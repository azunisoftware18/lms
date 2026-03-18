import { prisma } from "../../db/prismaService.js";
import { AppError } from "../../common/utils/apiError.js";
import { logAction } from "../../audit/audit.helper.js";
import { getPagination, buildPaginationMeta } from "../../common/utils/pagination.js";
import { LoanDefaultQueryParams, RequesterContext } from "./loanDefault.types.js";
import { getAccessibleBranchIds } from "../../common/utils/branchAccess.js";

export const checkAndMarkLoanDefault = async (loanId: string) => {
  return prisma.$transaction(async (tx) => {
    const loan = await tx.loanApplication.findUnique({
      where: { id: loanId },
    });

    // Allow active + delinquent, skip already defaulted
    if (!loan || loan.status === "defaulted") {
      return { skipped: true };
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
    const outstanding = overdueEmis.reduce(
      (sum, e) =>
        sum +
        Number(e.principalAmount) +
        Number(e.interestAmount) +
        Number(e.latePaymentFee),
      0,
    );

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
  const branchFilter =
    accessibleBranchIds !== null
      ? { branchId: { in: accessibleBranchIds } }
      : {};

  const where = {
    status: "defaulted" as const,
    ...branchFilter,
    ...(params.branchId ? { branchId: params.branchId } : {}),
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
        branchId: true,
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

  return { data: loans, meta: buildPaginationMeta(total, page, limit) };
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

  if (
    requester.role !== "SUPER_ADMIN" &&
    requester.role !== "ADMIN" &&
    requester.branchId &&
    loan.branchId !== requester.branchId
  ) {
    throw AppError.forbidden("Access denied for this branch resource");
  }

  return loan;
};
