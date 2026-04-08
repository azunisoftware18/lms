import { prisma } from "../../db/prismaService.js";
import { AppError } from "../../common/utils/apiError.js";
import { logAction } from "../../audit/audit.helper.js";
import { getPagination, buildPaginationMeta } from "../../common/utils/pagination.js";
import {
  LoanDefaultCheckResult,
  LoanDefaultQueryParams,
  RequesterContext,
} from "./loanDefault.types.js";
import { getAccessibleBranchIds } from "../../common/utils/branchAccess.js";

const getPrincipalOutstandingByLoanIds = async (
  loanIds: string[],
  approvedAmountByLoanId: Record<string, number>,
) => {
  if (loanIds.length === 0) return new Map<string, number>();

  const paidPrincipalGroups = await prisma.loanEmiSchedule.groupBy({
    by: ["loanApplicationId"],
    where: {
      loanApplicationId: { in: loanIds },
      status: "paid",
    },
    _sum: {
      principalAmount: true,
    },
  });

  const paidPrincipalMap = new Map<string, number>();
  paidPrincipalGroups.forEach((g) => {
    paidPrincipalMap.set(g.loanApplicationId, Number(g._sum.principalAmount ?? 0));
  });

  const outstandingMap = new Map<string, number>();
  loanIds.forEach((loanId) => {
    const approved = Number(approvedAmountByLoanId[loanId] ?? 0);
    const paidPrincipal = Number(paidPrincipalMap.get(loanId) ?? 0);
    outstandingMap.set(loanId, Math.max(0, approved - paidPrincipal));
  });

  return outstandingMap;
};


export const checkAndMarkLoanDefault = async (
  loanId: string,
): Promise<LoanDefaultCheckResult> => {
  return prisma.$transaction(async (tx) => {
    const loan = await tx.loanApplication.findUnique({
      where: { id: loanId },
    });

    if (!loan) {
     throw AppError.notFound("Loan not found");
    }

    const paidPrincipalAgg = await tx.loanEmiSchedule.aggregate({
      where: {
        loanApplicationId: loanId,
        status: "paid",
      },
      _sum: {
        principalAmount: true,
      },
    });

    const paidPrincipal = Number(paidPrincipalAgg._sum.principalAmount ?? 0);
    const principalOutstanding = Math.max(0, Number(loan.approvedAmount) - paidPrincipal);

    const syncRecoveryAmounts = async (outstandingAmount: number, dpdValue: number) => {
      const recovery = await tx.loanRecovery.findFirst({
        where: { loanApplicationId: loanId },
        orderBy: { createdAt: "desc" },
      });

      if (!recovery) {
        return null;
      }

      const nextBalance = Math.max(
        0,
        Number(outstandingAmount) - Number(recovery.recoveredAmount ?? 0),
      );

      return tx.loanRecovery.update({
        where: { id: recovery.id },
        data: {
          totalOutstandingAmount: outstandingAmount,
          balanceAmount: nextBalance,
          dpd: dpdValue,
          defaultedAt: loan.defaultedAt ?? recovery.defaultedAt ?? new Date(),
        },
      });
    };

    // Idempotent behavior for manual retries and cron overlap.
    if (loan.status === "defaulted") {
      await syncRecoveryAmounts(principalOutstanding, Number(loan.dpd ?? 0));
      return {
        skipped: true,
        reason: "already_defaulted",
        status: "defaulted",
        dpd: loan.dpd,
        outstandingAmount: principalOutstanding,
      };
    }

    if (loan.status !== "active" && loan.status !== "delinquent") {
      throw AppError.badRequest("Loan status is not eligible for default check");
    }

    const overdueEmis = await tx.loanEmiSchedule.findMany({
      where: { loanApplicationId: loanId, status: "overdue" },
      orderBy: { dueDate: "asc" },
    });

    // No overdue EMIs: if delinquent, recover to active
    if (overdueEmis.length === 0) {
      if (loan.status === "delinquent") {
        await tx.loanApplication.update({
          where: { id: loanId },
          data: { status: "active", dpd: 0 },
        });
      }
      return { isDefaulted: false };
    }

    const firstOverdueEmi = overdueEmis[0];
    const dpd = Math.max(
      0,
      Math.floor(
        (Date.now() - firstOverdueEmi.dueDate.getTime()) / (1000 * 60 * 60 * 24),
      ),
    );

    const isDefault = overdueEmis.length >= 3 || dpd >= 90;

    // 🔸 DELINQUENT
    if (!isDefault) {
      await tx.loanApplication.update({
        where: { id: loanId },
        data: { status: "delinquent", dpd },
      });
      return { status: "delinquent", dpd };
    }

    // 🔴 DEFAULT
    // NBFC/retail-banking style principal outstanding:
    // outstanding = approved amount - paid EMI principal
    const outstanding = principalOutstanding;

    await tx.loanApplication.update({
      where: { id: loanId },
      data: { status: "defaulted", defaultedAt: new Date(), dpd },
    });

    // Avoid duplicate recovery records
    const existingRecovery = await tx.loanRecovery.findFirst({
      where: { loanApplicationId: loanId },
    });

    if (!existingRecovery) {
      await tx.loanRecovery.create({
        data: {
          loanApplicationId: loanId,
          customerId: loan.customerId,
          totalOutstandingAmount: outstanding,
          recoveredAmount: 0,
          branchId: loan.branchId,
          balanceAmount: outstanding,
          dpd,
          defaultedAt: new Date(),
          recoveryStage: "INITIAL_CONTACT",
          recoveryStatus: "ONGOING",
        },
      });
    } else {
      const nextBalance = Math.max(
        0,
        Number(outstanding) - Number(existingRecovery.recoveredAmount ?? 0),
      );

      await tx.loanRecovery.update({
        where: { id: existingRecovery.id },
        data: {
          totalOutstandingAmount: outstanding,
          balanceAmount: nextBalance,
          dpd,
          defaultedAt: loan.defaultedAt ?? new Date(),
        },
      });
    }

    await logAction({
      entityType: "LOAN_APPLICATION",
      entityId: loanId,
      action: "UPDATE_LOAN_STATUS",
      performedBy: "SYSTEM",
      branchId: loan.branchId,
      oldValue: { status: loan.status, dpd: loan.dpd },
      newValue: { status: "defaulted", dpd, outstandingAmount: outstanding },
    });

    return { status: "defaulted", dpd, outstandingAmount: outstanding };
  });
};

export const getAllDefaultedLoansService = async (
  params: LoanDefaultQueryParams,
  requester: RequesterContext,
) => {
  const { page, limit, skip } = getPagination(params.page, params.limit);

  const accessibleBranchIds = await getAccessibleBranchIds({
    id: requester.id,
    role: requester.role,
    branchId: requester.branchId ?? undefined,
  });
  if (
    params.branchId &&
    accessibleBranchIds !== null &&
    !accessibleBranchIds.includes(params.branchId)
  ) {
    throw AppError.forbidden("Access denied for this branch resource");
  }

  const branchFilter =
    params.branchId
      ? { branchId: params.branchId }
      : accessibleBranchIds !== null
        ? { branchId: { in: accessibleBranchIds } }
        : {};

  const where = {
    status: "defaulted" as const,
    ...branchFilter,
  };

  const [loans, total] = await Promise.all([
    prisma.loanApplication.findMany({
      where,
      orderBy: { defaultedAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        loanNumber: true,
        status: true,
        defaultedAt: true,
        dpd: true,
        approvedAmount: true,
        branch: {
          select: {
            id: true,
            name: true,
          },
        },
        loanType:{
          select: {
            id: true,
            name: true,
            category: true,
          },
          
        },
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            contactNumber: true,
            panNumber: true,
          },
        },
        loanRecoveries: {
          select: {
            id: true,
            totalOutstandingAmount: true,
            recoveredAmount: true,
            balanceAmount: true,
            recoveryStage: true,
            recoveryStatus: true,
            recoveryPayments: {
              select: { id: true, amount: true, paymentDate: true },
            },
          },
        },
      },
    }),
    prisma.loanApplication.count({ where }),
  ]);

  const approvedAmountByLoanId = loans.reduce<Record<string, number>>((acc, loan) => {
    acc[loan.id] = Number(loan.approvedAmount ?? 0);
    return acc;
  }, {});

  const principalOutstandingMap = await getPrincipalOutstandingByLoanIds(
    loans.map((loan) => loan.id),
    approvedAmountByLoanId,
  );

  const normalizedLoans = loans.map((loan) => {
    const principalOutstanding = Number(principalOutstandingMap.get(loan.id) ?? 0);

    return {
      ...loan,
      loanRecoveries: (loan.loanRecoveries || []).map((recovery) => ({
        ...recovery,
        totalOutstandingAmount: principalOutstanding,
        balanceAmount: Math.max(
          0,
          principalOutstanding - Number(recovery.recoveredAmount ?? 0),
        ),
      })),
    };
  });

  return { data: normalizedLoans, meta: buildPaginationMeta(total, page, limit) };
};

export const getDefaultLoanByIdService = async (
  loanId: string,
  requester: RequesterContext,
) => {
  const loan = await prisma.loanApplication.findUnique({
    where: { id: loanId },
    include: {
      customer: true,
      loanRecoveries: { include: { recoveryPayments: true } },
    },
  });

  if (!loan || loan.status !== "defaulted") {
    throw AppError.notFound("Defaulted loan not found");
  }

  const accessibleBranchIds = await getAccessibleBranchIds({
    id: requester.id,
    role: requester.role,
    branchId: requester.branchId ?? undefined,
  });

  if (accessibleBranchIds !== null && !accessibleBranchIds.includes(loan.branchId)) {
    throw AppError.forbidden("Access denied for this branch resource");
  }

  const paidPrincipalAgg = await prisma.loanEmiSchedule.aggregate({
    where: {
      loanApplicationId: loanId,
      status: "paid",
    },
    _sum: {
      principalAmount: true,
    },
  });

  const paidPrincipal = Number(paidPrincipalAgg._sum.principalAmount ?? 0);
  const principalOutstanding = Math.max(
    0,
    Number(loan.approvedAmount ?? 0) - paidPrincipal,
  );

  const normalizedLoan = {
    ...loan,
    loanRecoveries: (loan.loanRecoveries || []).map((recovery) => ({
      ...recovery,
      totalOutstandingAmount: principalOutstanding,
      balanceAmount: Math.max(
        0,
        principalOutstanding - Number(recovery.recoveredAmount ?? 0),
      ),
    })),
  };

  return normalizedLoan;
};
