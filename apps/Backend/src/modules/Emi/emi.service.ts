import { prisma } from "../../db/prismaService.js";
import { calculateEmi } from "../../common/utils/emi.util.js";
import { getPagination } from "../../common/utils/pagination.js";
import { Prisma } from "../../../generated/prisma-client/client.js";
import { buildEmiSearch } from "../../common/utils/search.js";
import { logAction } from "../../audit/audit.helper.js";
import { AppError } from "../../common/utils/apiError.js";

export const generateEmiScheduleService = async (
  loanNumber: string,
  userId?: string,
  branchId?: string,
  emiStartDate?: Date,
) => {
const loanData = await prisma.loanApplication.update({
  where: { loanNumber },
  data: {
    emiStartDate: emiStartDate , // only update if provided
  },
});

  const loan = await prisma.loanApplication.findUnique({
    where: { loanNumber: loanNumber },
    select: {
      id: true,
      loanNumber: true,
      approvedAmount: true,
      requestedAmount: true,
      interestRate: true,
      tenureMonths: true,
      interestType: true,
      emiStartDate: true,
      // removed emiStartingCycleDate
      status: true,
      latePaymentFeeType: true,
      latePaymentFee: true,
      bounceCharges: true,
      loanType: {
        select: {
          latePaymentFeeType: true,
          latePaymentFee: true,
          bounceCharges: true,
        },
      },
    },
  });

  if (!loan) {
    throw AppError.notFound("Loan application not found .....");
  }

  if (loan.status === "active") {
    throw AppError.conflict("EMI schedule already generated");
  }
 

  if (loan.status !== "SANCTIONED") {
    throw AppError.badRequest(
      "EMI schedule can only be generated after loan is sanctioned",
    );
  }
  if (!loan.approvedAmount && !loan.requestedAmount) {
    throw AppError.badRequest("Loan approved amount is missing");
  }



  // Use approvedAmount, fall back to requestedAmount if approved missing
  const principal = loan.approvedAmount ;

  // Validate inputs with specific messages to help debugging
  if (!principal) {
    throw AppError.badRequest(
      "Loan amount missing (approvedAmount/requestedAmount)",
    );
  }

  if (loan.tenureMonths == null || loan.tenureMonths <= 0) {
    throw AppError.badRequest("Invalid or missing tenureMonths for loan");
  }

  if (loan.interestRate == null) {
    // allow zero interest but not undefined/null
    throw AppError.badRequest("Invalid or missing interestRate for loan");
  }

  const existingScheduleCount = await prisma.loanEmiSchedule.count({
    where: { loanApplicationId: loan.id },
  });

  if (existingScheduleCount > 0) {
    throw AppError.conflict(
      "EMI schedule already exists. Regeneration is not allowed without explicit reset.",
    );
  }

  const tenureMonths = loan.tenureMonths!;
  const annualRate = loan.interestRate;
  const monthlyRate = annualRate / 12 / 100;

  const emi = [];

  let balance = principal;
  let emiAmount: number;

  const startDate = loan.emiStartDate ?? new Date();

  const latePaymentFeeType = (loan.latePaymentFeeType ??
    loan.loanType?.latePaymentFeeType) as any;

  const latePaymentFee =
    loan.latePaymentFee ?? loan.loanType?.latePaymentFee ?? 0;

  const bounceCharges = loan.bounceCharges ?? loan.loanType?.bounceCharges ?? 0;
  const monthlyFlatInterest = (principal * annualRate) / 100 / 12;

  if (loan.interestType === "FLAT") {
    const totalInterest = (principal * annualRate * (tenureMonths / 12)) / 100;
    emiAmount = (principal + totalInterest) / tenureMonths;
  } else {
    emiAmount =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  }

  for (let i = 1; i <= tenureMonths; i++) {
    const interestAmount =
      loan.interestType === "FLAT"
        ? monthlyFlatInterest
        : balance * monthlyRate;

    let principalAmount = emiAmount - interestAmount;
    let emiInstallmentAmount = emiAmount;
    let closingBalance = balance - principalAmount;

    // Keep schedule totals consistent by forcing final installment to clear residual balance.
    if (i === tenureMonths) {
      principalAmount = balance;
      emiInstallmentAmount = principalAmount + interestAmount;
      closingBalance = 0;
    }

    emi.push({
      loanApplicationId: loan.id,
      loanNumber: loan.loanNumber,
      emiStartDate: startDate,
      emiNo: i,
      dueDate: new Date(
        startDate.getFullYear(),
        startDate.getMonth() + i,
        startDate.getDate(),
      ),
      openingBalance: Number(balance.toFixed(2)),
      principalAmount: Number(principalAmount.toFixed(2)),
      interestAmount: Number(interestAmount.toFixed(2)),
      emiAmount: Number(emiInstallmentAmount.toFixed(2)),
      closingBalance:
        closingBalance < 0 ? 0 : Number(closingBalance.toFixed(2)),
      totalPayableAmount: Number(emiInstallmentAmount.toFixed(2)),
      latePaymentFeeType,
      latePaymentFee,
      bounceCharges,
    });

    balance = closingBalance;
  }
  await prisma.loanEmiSchedule.createMany({
    data: emi,
  });

  await prisma.loanApplication.update({
    where: { id: loan.id },
    data: { status: "Ready_for_disbursement" },
  });

  // Only log action if userId and branchId are provided
  if (userId && branchId) {
    await logAction({
      entityType: "EMI_SCHEDULE",
      entityId: loan.id,
      action: "GENERATE_EMI_SCHEDULE",
      performedBy: userId,
      branchId: branchId,
      oldValue: { status: "disbursed" },
      newValue: { status: "Ready_for_disbursement" },
      remarks: `EMI schedule generated for loan application ${loan.id}`,
    });
  }

  // Fetch and return the created EMI records from DB (createMany doesn't return created rows)
  const createdEmis = await prisma.loanEmiSchedule.findMany({
    where: { loanApplicationId: loan.id },
    orderBy: { emiNo: "asc" },
    include: {
      loanApplication: {
        select: {
          id: true,
          loanNumber: true,
          approvedAmount: true,
          requestedAmount: true,
          interestRate: true,
          tenureMonths: true,
          interestType: true,
          status: true,
          branchId: true,
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              contactNumber: true,
              email: true,
            },
          },
        },
      },
    },
  });

  const summary = createdEmis.reduce(
    (acc, e) => {
      acc.totalPrincipal += Number((e.principalAmount ?? 0).toFixed(2));
      acc.totalInterest += Number((e.interestAmount ?? 0).toFixed(2));
      acc.totalEmiAmount += Number((e.emiAmount ?? 0).toFixed(2));
      return acc;
    },
    { totalPrincipal: 0, totalInterest: 0, totalEmiAmount: 0 },
  );

  return {
    loan: createdEmis[0]?.loanApplication
      ? {
          id: createdEmis[0].loanApplication.id,
          loanNumber: createdEmis[0].loanApplication.loanNumber,
          approvedAmount:
            createdEmis[0].loanApplication.approvedAmount ??
            createdEmis[0].loanApplication.requestedAmount,
          interestRate: createdEmis[0].loanApplication.interestRate,
          tenureMonths: createdEmis[0].loanApplication.tenureMonths,
          interestType: createdEmis[0].loanApplication.interestType,
          status: createdEmis[0].loanApplication.status,
          branchId: createdEmis[0].loanApplication.branchId,
          customer: createdEmis[0].loanApplication.customer,
        }
      : null,
    emis: createdEmis.map((e) => ({
      id: e.id,
      emiNo: e.emiNo,
      dueDate: e.dueDate,
      openingBalance: e.openingBalance,
      principalAmount: e.principalAmount,
      interestAmount: e.interestAmount,
      emiAmount: e.emiAmount,
      closingBalance: e.closingBalance,
      totalPayableAmount: e.totalPayableAmount,
      latePaymentFee: e.latePaymentFee,
      latePaymentFeeType: e.latePaymentFeeType,
      bounceCharges: e.bounceCharges,
      status: e.status,
    })),
    summary: {
      totalPrincipal: Number(summary.totalPrincipal.toFixed(2)),
      totalInterest: Number(summary.totalInterest.toFixed(2)),
      totalEmiAmount: Number(summary.totalEmiAmount.toFixed(2)),
      emiCount: createdEmis.length,
    },
  };
};

export const getLoanEmiService = async (loanId: string) => {
  try {
    const emis = await prisma.loanEmiSchedule.findMany({
      where: { loanApplicationId: loanId },
      orderBy: { emiNo: "asc" },
    });
    return emis;
  } catch (error: any) {
    if (error?.statusCode) throw error;
    throw AppError.internal(error.message || "Failed to fetch EMI schedule");
  }
};

export const getAllEmisService = async (params: {
  loanId?: string;
  page?: number;
  limit?: number;
  q?: string;
  status?: string;
  accessibleBranchIds?: string[] | null;
}) => {
  const { page, limit, skip } = getPagination(params.page, params.limit);

  const where: Prisma.LoanEmiScheduleWhereInput = {
    ...(params.loanId && { loanApplicationId: params.loanId }),
    ...(params.status && { status: params.status as any }),
    ...(params.accessibleBranchIds && {
      loanApplication: {
        branchId: { in: params.accessibleBranchIds },
      },
    }),
    ...buildEmiSearch(params.q),
  };

  const [data, total] = await Promise.all([
    prisma.loanEmiSchedule.findMany({
      where,
      orderBy: { emiNo: "asc" },
      skip,
      take: limit,
      include: {
        loanApplication: {
          select: {
            id: true,
            loanNumber: true,
            approvedAmount: true,
            interestRate: true,
            tenureMonths: true,
            interestType: true,
            status: true,
            customer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                contactNumber: true,
              },
            },
          },
        },
      },
    }),
    prisma.loanEmiSchedule.count({ where }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
    },
  };
};

export const markEmiPaidService = async ({
  emiId,
  amountPaid,
  paymentMode,
  chequeStatus,
  paidByUserId,
  branchId,
}: {
  emiId: string;
  amountPaid: number;
  paymentMode: "CASH" | "UPI" | "BANK" | "CHEQUE";
  chequeStatus?: "PENDING" | "CLEARED" | "BOUNCED";
  paidByUserId?: string;
  branchId?: string;
}) => {
  if (!amountPaid || amountPaid <= 0) {
    throw AppError.badRequest("Payment amount must be greater than zero");
  }

  const emi = await prisma.loanEmiSchedule.findUnique({
    where: { id: emiId },
  });

  if (!emi) throw AppError.badRequest("Invalid EMI ID");

  const loan = await prisma.loanApplication.findUnique({
    where: { id: emi.loanApplicationId },
  });
  if (!loan) throw AppError.notFound("Associated loan application not found");

  if (loan.status !== "active" && loan.status !== "defaulted") {
    throw AppError.badRequest("Loan is not active or defaulted");
  }

  if (emi.status === "paid") {
    throw AppError.conflict("EMI already paid");
  }

  const paymentDate = new Date();

  /* ---------------- 1️⃣ Calculate Late Fee (READ ONLY) ---------------- */
  let lateFee = 0;
  if (paymentDate > emi.dueDate) {
    lateFee =
      emi.latePaymentFeeType === "FIXED"
        ? emi.latePaymentFee
        : (emi.emiAmount * emi.latePaymentFee) / 100;
  }

  /* ---------------- 2️⃣ Bounce Charge (ONLY ONCE) ---------------- */
  let bounceCharge = 0;
  const isChequeBounced =
    paymentMode === "CHEQUE" && chequeStatus === "BOUNCED";

  if (isChequeBounced && !emi.bounceChargeApplied) {
    bounceCharge = emi.bounceCharges;
  }

  /* ---------------- 3️⃣ Payable & Payment ---------------- */
  const alreadyPaid = emi.emiPaymentAmount ?? 0;

  const totalPayable = emi.emiAmount + lateFee + bounceCharge;

  // ✅ remaining amount for THIS EMI
  const remainingPayable = Math.max(totalPayable - alreadyPaid, 0);

  // ✅ do not allow overpayment
  const effectivePayment = Math.min(amountPaid, remainingPayable);

  const newPaidAmount = alreadyPaid + effectivePayment;

  const newStatus = newPaidAmount >= totalPayable ? "paid" : emi.status;
  /* ---------------- 4️⃣ DB Transaction ---------------- */
  const updatedEmi = await prisma.$transaction(async (tx) => {
    // Payment history
    await tx.emiPayment.create({
      data: {
        emiScheduleId: emi.id,
        amount: effectivePayment,
        paymentDate,
        paymentMode,
      },
    });
    // EMI update
    return tx.loanEmiSchedule.update({
      where: { id: emiId },
      data: {
        emiPaymentAmount: newPaidAmount,
        status: newStatus,
        paidDate: newStatus === "paid" ? paymentDate : null,

        // audit fields
        lastPaymentMode: paymentMode,
        chequeStatus,
        lastPaymentDate: paymentDate,

        // bounce protection
        bounceChargeApplied: emi.bounceChargeApplied || isChequeBounced,
      },
    });
  });

  if (paidByUserId && branchId) {
    await logAction({
      entityType: "EMI_SCHEDULE",
      entityId: emiId,
      action: "UPDATE_LOAN_STATUS",
      performedBy: paidByUserId,
      branchId,
      oldValue: {
        status: emi.status,
        emiPaymentAmount: emi.emiPaymentAmount,
      },
      newValue: {
        status: updatedEmi.status,
        emiPaymentAmount: updatedEmi.emiPaymentAmount,
      },
      remarks: `EMI payment recorded with mode ${paymentMode}`,
    });
  }

  return updatedEmi;
};

export const getEmisPayableAmountbyId = async (emiId: string) => {
  try {
    const emi = await prisma.loanEmiSchedule.findUnique({
      where: { id: emiId },
    });

    if (!emi) {
      throw AppError.notFound("EMI not found");
    }
    const today = new Date();

    /* ---------------- 1️⃣ Late Fee Logic ---------------- */
    let lateFee = 0;
    if (today > emi.dueDate) {
      if (emi.latePaymentFeeType === "FIXED") {
        lateFee = emi.latePaymentFee ?? 0;
      } else if (emi.latePaymentFeeType === "PERCENTAGE") {
        lateFee = (emi.emiAmount * (emi.latePaymentFee ?? 0)) / 100;
      }
    }

    /* ---------------- 2️⃣ Bounce Charge Logic ---------------- */
    let bounceCharge = 0;
    const isChequeBounced =
      emi.lastPaymentMode === "CHEQUE" && emi.chequeStatus === "BOUNCED";

    if (isChequeBounced && !emi.bounceChargeApplied) {
      bounceCharge = emi.bounceCharges;
    }

    /* ---------------- 3️⃣ Amount Calculation ---------------- */
    const alreadyPaid = emi.emiPaymentAmount ?? 0;
    const totalPayable = emi.emiAmount + lateFee + bounceCharge;
    const totalDue = totalPayable - alreadyPaid;

    return {
      emiId: emi.id,
      emiNo: emi.emiNo,
      dueDate: emi.dueDate,
      emiAmount: Number(emi.emiAmount.toFixed(2)),
      lateFee: Number(lateFee.toFixed(2)),
      bounceCharge: Number(bounceCharge.toFixed(2)),
      alreadyPaid: Number(alreadyPaid.toFixed(2)),
      totalPayable: Number(Math.max(totalDue, 0).toFixed(2)),
      isOverdue: today > emi.dueDate,
    };
  } catch (error: any) {
    if (error?.statusCode) throw error;
    throw AppError.internal(
      error.message || "Failed to fetch payable EMI amount",
    );
  }
};

// not use
export const getEmiAmountService = async ({
  principal,
  annualInterestRate,
  tenureMonths,
  interestType,
}: {
  principal: number;
  annualInterestRate: number;
  tenureMonths: number;
  interestType: "FLAT" | "REDUCING";
}) => {
  const { emi, totalPayable } = calculateEmi({
    principal,
    annualInterestRate,
    tenureMonths,
    interestType,
  });
  return { emiAmount: emi, totalPayable };
};

export const processOverdueEmis = async (): Promise<number> => {
  const today = new Date();

  /* 1️⃣ Fetch ONLY pending EMIs that crossed due date */
  const overdueEmis = await prisma.loanEmiSchedule.findMany({
    where: {
      status: "pending", // 🔒 prevents re-processing
      dueDate: {
        lt: today,
      },
    },
    select: {
      id: true,
      emiAmount: true,
      latePaymentFeeType: true,
      latePaymentFee: true,
    },
  });

  if (overdueEmis.length === 0) return 0;

  /* 2️⃣ Update safely in one transaction */
  await prisma.$transaction(
    overdueEmis.map((emi) => {
      const lateFee =
        emi.latePaymentFeeType === "FIXED"
          ? (emi.latePaymentFee ?? 0)
          : (emi.emiAmount * (emi.latePaymentFee ?? 0)) / 100;

      return prisma.loanEmiSchedule.update({
        where: {
          id: emi.id,
          status: "pending", // 🔐 extra safety condition
        },
        data: {
          status: "overdue",
          latePaymentFee: lateFee,
        },
      });
    }),
  );

  return overdueEmis.length;
};

export const getPayableEmiAmountService = async (emiId: string) => {
  const emi = await prisma.loanEmiSchedule.findUnique({
    where: { id: emiId },
  });

  if (!emi) {
    throw AppError.notFound("EMI not found");
  }

  const today = new Date();

  /* ---------------- 1️⃣ Late Fee Logic ---------------- */
  let lateFee = 0;

  if (today > emi.dueDate) {
    if (emi.latePaymentFeeType === "FIXED") {
      lateFee = emi.latePaymentFee ?? 0;
    } else if (emi.latePaymentFeeType === "PERCENTAGE") {
      lateFee = (emi.emiAmount * (emi.latePaymentFee ?? 0)) / 100;
    }
  }

  /* ---------------- 2️⃣ Bounce Charge Logic ---------------- */
  let bounceCharge = 0;

  /* ---------------- 3️⃣ Amount Calculation ---------------- */
  const alreadyPaid = emi.emiPaymentAmount ?? 0;

  const totalPayable = emi.emiAmount + lateFee + bounceCharge - alreadyPaid;

  /* ---------------- 4️⃣ Response ---------------- */
  return {
    emiId: emi.id,
    emiNo: emi.emiNo,
    dueDate: emi.dueDate,
    emiAmount: Number(emi.emiAmount.toFixed(2)),
    lateFee: Number(lateFee.toFixed(2)),
    bounceCharge: Number(bounceCharge.toFixed(2)),
    alreadyPaid: Number(alreadyPaid.toFixed(2)),
    totalPayable: Number(Math.max(totalPayable, 0).toFixed(2)),
    isOverdue: today > emi.dueDate,
  };
};

export const payEmiService = async (
  emiId: string,
  amount: number,
  paymentMode: string,
) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const emi = await tx.loanEmiSchedule.findUnique({
        where: { id: emiId },
      });
      if (!emi) {
        throw AppError.notFound("EMI not found");
      }

      const loan = await tx.loanApplication.findUnique({
        where: { id: emi.loanApplicationId },
      });

      if (loan?.status !== "active" && loan?.status !== "defaulted") {
        throw AppError.badRequest("Loan is not active");
      }

      const totalDue =
        emi.emiAmount + (emi.latePaymentFee ?? 0) + (emi.bounceCharges ?? 0);

      const paidSoFar = emi.emiPaymentAmount ?? 0;
      const newPaid = paidSoFar + amount;
      await tx.emiPayment.create({
        data: {
          emiScheduleId: emiId,
          amount,
          paymentDate: new Date(),
          paymentMode: paymentMode as any,
        },
      });

      await tx.loanEmiSchedule.update({
        where: { id: emiId },
        data: {
          emiPaymentAmount: newPaid,
          status: newPaid >= totalDue ? "paid" : emi.status,
          paidDate: newPaid >= totalDue ? new Date() : emi.paidDate,
        },
      });
    });
  } catch (error: any) {
    if (error?.statusCode) throw error;
    throw AppError.internal(error.message || "Failed to process EMI payment");
  }
};

export const forecloseLoanService = async (loanId: string) => {
  try {
    const loan = await prisma.loanApplication.findUnique({
      where: { id: loanId },
    });
    if (!loan) {
      throw AppError.notFound("Loan application not found");
    }

    const emis = await prisma.loanEmiSchedule.findMany({
      where: {
        loanApplicationId: loanId,
        status: { in: ["pending", "overdue"] },
      },
    });
    const now = new Date();

    const remainingPrincipal = emis.reduce(
      (sum, e) => sum + e.principalAmount,
      0,
    );
    const accruedInterest = emis.reduce((sum, e) => sum + e.interestAmount, 0);

    const unpaidEmiCharges = emis.reduce((sum, emi) => {
      const lateFee =
        now > emi.dueDate
          ? emi.latePaymentFeeType === "FIXED"
            ? emi.latePaymentFee
            : (emi.emiAmount * emi.latePaymentFee) / 100
          : 0;

      const bounceCharge =
        emi.bounceChargeApplied &&
        emi.lastPaymentMode === "CHEQUE" &&
        emi.chequeStatus === "BOUNCED"
          ? emi.bounceCharges
          : 0;

      const chargeDue = lateFee + bounceCharge;
      const extraPaidTowardCharges = Math.max(
        (emi.emiPaymentAmount ?? 0) - emi.emiAmount,
        0,
      );
      const chargeOutstanding = Math.max(chargeDue - extraPaidTowardCharges, 0);

      return sum + chargeOutstanding;
    }, 0);

    const foreclosurePenalty =
      remainingPrincipal * ((loan.foreclosureCharges ?? 0) / 100);

    const totalPayable =
      remainingPrincipal +
      accruedInterest +
      foreclosurePenalty +
      unpaidEmiCharges;

    return {
      remainingPrincipal: Number(remainingPrincipal.toFixed(2)),
      accruedInterest: Number(accruedInterest.toFixed(2)),
      foreclosurePenalty: Number(foreclosurePenalty.toFixed(2)),
      unpaidEmiCharges: Number(unpaidEmiCharges.toFixed(2)),
      totalPayable: Number(totalPayable.toFixed(2)),
    };
  } catch (error: any) {
    if (error?.statusCode) throw error;
    throw AppError.internal(error.message || "Failed to foreclose loan");
  }
};

export const getThisMonthEmiAmountService = async (
  loanApplicationId: string,
) => {
  /* 1️⃣ Current month range */
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date();
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);
  endOfMonth.setDate(0);
  endOfMonth.setHours(23, 59, 59, 999);

  /* 2️⃣ Fetch ALL pending & overdue EMIs till this month */
  const emis = await prisma.loanEmiSchedule.findMany({
    where: {
      loanApplicationId,
      status: { in: ["pending", "overdue"] },
      dueDate: { lte: endOfMonth },
    },
    orderBy: { dueDate: "asc" },
  });

  if (emis.length === 0) {
    throw AppError.notFound("No EMI due till this month");
  }

  const today = new Date();

  let totalEmiAmount = 0;
  let totalLateFee = 0;
  let totalBounceCharge = 0;
  let totalAlreadyPaid = 0;

  /* 3️⃣ Calculate EMI-wise charges */
  const emiBreakup = emis.map((emi) => {
    const isOverdue = today > emi.dueDate;

    /* ---- Late Fee ---- */
    let lateFee = 0;
    if (isOverdue) {
      lateFee =
        emi.latePaymentFeeType === "FIXED"
          ? (emi.latePaymentFee ?? 0)
          : (emi.emiAmount * (emi.latePaymentFee ?? 0)) / 100;
    }

    /* ---- Bounce Charge (ONLY IF BOUNCED) ---- */
    let bounceCharge = 0;
    if (
      emi.bounceChargeApplied &&
      emi.lastPaymentMode === "CHEQUE" &&
      emi.chequeStatus === "BOUNCED"
    ) {
      bounceCharge = emi.bounceCharges ?? 0;
    }

    const alreadyPaid = emi.emiPaymentAmount ?? 0;

    totalEmiAmount += emi.emiAmount;
    totalLateFee += lateFee;
    totalBounceCharge += bounceCharge;
    totalAlreadyPaid += alreadyPaid;

    return {
      emiId: emi.id,
      emiNo: emi.emiNo,
      dueDate: emi.dueDate,
      emiAmount: Number(emi.emiAmount.toFixed(2)),
      lateFee: Number(lateFee.toFixed(2)),
      bounceCharge: Number(bounceCharge.toFixed(2)),
      alreadyPaid: Number(alreadyPaid.toFixed(2)),
      totalPayable: Number(
        Math.max(
          emi.emiAmount + lateFee + bounceCharge - alreadyPaid,
          0,
        ).toFixed(2),
      ),
      status: emi.status,
      isOverdue,
    };
  });

  /* 4️⃣ Grand total */
  const grandTotal =
    totalEmiAmount + totalLateFee + totalBounceCharge - totalAlreadyPaid;

  return {
    loanApplicationId,
    totalEmisDue: emis.length,
    breakdown: emiBreakup,
    summary: {
      totalEmiAmount: Number(totalEmiAmount.toFixed(2)),
      totalLateFee: Number(totalLateFee.toFixed(2)),
      totalBounceCharge: Number(totalBounceCharge.toFixed(2)),
      totalAlreadyPaid: Number(totalAlreadyPaid.toFixed(2)),
      totalPayable: Number(Math.max(grandTotal, 0).toFixed(2)),
    },
  };
};

export const payforecloseLoanService = async (
  loanApplicationId: string,
  data: any,
  userId?: string,
  branchId?: string,
) => {
  try {
    const loan = await prisma.loanApplication.findUnique({
      where: { id: loanApplicationId },
    });
    if (!loan) {
      throw AppError.notFound("Loan application not found");
    }

    if (loan.status !== "active" && loan.status !== "defaulted") {
      throw AppError.badRequest("Loan is not active");
    }

    //count PAID EMIs
    const paidEmisCount = await prisma.loanEmiSchedule.count({
      where: {
        loanApplicationId: loanApplicationId,
        status: "paid",
      },
    });

    // minimum 6 emis should be paid before foreclosing
    if (paidEmisCount < 6) {
      throw AppError.badRequest(
        "At least 6 EMIs must be paid before foreclosing the loan",
      );
    }

    const emis = await prisma.loanEmiSchedule.findMany({
      where: {
        loanApplicationId: loanApplicationId,
        status: { in: ["pending", "overdue"] },
      },
    });

    const foreclosureSummary = await forecloseLoanService(loanApplicationId);
    const totalPayable = foreclosureSummary.totalPayable;

    if (data.amountPaid <= 0) {
      throw AppError.badRequest("Payment amount must be greater than zero");
    }
    if (data.amountPaid < totalPayable) {
      throw AppError.badRequest("Insufficient amount to foreclose the loan");
    }

    if (data.amountPaid >= totalPayable) {
      // Mark all pending EMIs as paid
      await prisma.$transaction(async (tx) => {
        for (const emi of emis) {
          await tx.loanEmiSchedule.update({
            where: { id: emi.id },
            data: {
              status: "paid",
              paidDate: new Date(),
              emiPaymentAmount: emi.emiAmount,
            },
          });
        }
      });
    }

    //check remaining amount after foreclosure
    await prisma.loanApplication.update({
      where: { id: loanApplicationId },
      data: {
        status: "closed",
        foreclosureDate: new Date(),
      },
    });

    if (userId && branchId) {
      await logAction({
        entityType: "LOAN",
        entityId: loanApplicationId,
        action: "UPDATE_LOAN_STATUS",
        performedBy: userId,
        branchId,
        oldValue: { status: loan.status },
        newValue: { status: "closed" },
        remarks: "Loan foreclosed after settlement of outstanding amount",
      });
    }

    return {
      ...foreclosureSummary,
      amountPaid: Number(data.amountPaid),
    };
  } catch (error: any) {
    if (error?.statusCode) throw error;
    throw AppError.internal(error.message || "Failed to foreclose loan");
  }
};

export const applyMoratoriumService = async ({
  loanId,
  type,
  startDate,
  endDate,
  userId,
  branchId,
}: {
  loanId: string;
  type: "FULL" | "INTEREST_ONLY";
  startDate: Date;
  endDate: Date;
  userId?: string;
  branchId?: string;
}) => {
  const loan = await prisma.loanApplication.findUnique({
    where: { id: loanId },
    include: { emis: true },
  });

  if (!loan) {
    throw AppError.notFound("Loan application not found");
  }

  if (loan.status !== "active") {
    throw AppError.badRequest("Moratorium can be applied only on active loans");
  }

  const overlapping = await prisma.emiMoratorium.findFirst({
    where: {
      loanApplicationId: loanId,
      status: "active",
      OR: [
        {
          startDate: { lte: endDate },
          endDate: { gte: startDate },
        },
      ],
    },
  });

  if (overlapping) {
    throw AppError.conflict(
      "An active moratorium already exists for this loan in the specified period",
    );
  }

  const futureEmis = await prisma.loanEmiSchedule.findMany({
    where: {
      loanApplicationId: loanId,
      status: "pending",
      dueDate: { gte: startDate },
    },
    orderBy: { emiNo: "asc" },
  });

  if (futureEmis.length === 0) {
    throw AppError.notFound("No pending EMIs found for moratorium application");
  }

  const affectedEmis = futureEmis.filter(
    (emi) => emi.dueDate >= startDate && emi.dueDate <= endDate,
  );

  if (affectedEmis.length === 0) {
    throw AppError.badRequest("No EMI falls within the moratorium period");
  }

  const interestAccrued = affectedEmis.reduce(
    (sum, emi) => sum + emi.interestAmount,
    0,
  );

  const moratorium = await prisma.$transaction(async (tx) => {
    if (type === "FULL") {
      const deferMonths = affectedEmis.length;

      await Promise.all(
        futureEmis.map((emi) =>
          tx.loanEmiSchedule.update({
            where: { id: emi.id },
            data: {
              isDeferred: true,
              dueDate: new Date(
                emi.dueDate.getFullYear(),
                emi.dueDate.getMonth() + deferMonths,
                emi.dueDate.getDate(),
              ),
            },
          }),
        ),
      );
    } else {
      // INTEREST_ONLY: Track deferred principal and redistribute across remaining EMIs
      const totalDeferredPrincipal = affectedEmis.reduce(
        (sum, emi) => sum + emi.principalAmount,
        0,
      );

      // Update affected EMIs: set principalAmount to 0, track as deferred
      await Promise.all(
        affectedEmis.map((emi) =>
          tx.loanEmiSchedule.update({
            where: { id: emi.id },
            data: {
              principalAmount: 0,
              deferredPrincipal: emi.principalAmount, // Track the deferred amount
              emiAmount: emi.interestAmount,
              totalPayableAmount: emi.interestAmount,
              isDeferred: true,
            },
          }),
        ),
      );

      // Redistribute deferred principal across remaining EMIs (after moratorium endDate)
      const remainingEmis = futureEmis.filter((emi) => emi.dueDate > endDate);

      if (remainingEmis.length > 0) {
        const deferredPerEmi = totalDeferredPrincipal / remainingEmis.length;

        // Get the last affected EMI's closingBalance to use as starting point for remaining EMIs
        const lastAffectedEmi = affectedEmis[affectedEmis.length - 1];
        let currentOpeningBalance =
          lastAffectedEmi?.closingBalance ?? loan.approvedAmount ?? 0;

        // Update remaining EMIs sequentially to maintain balance continuity
        for (const emi of remainingEmis) {
          const newPrincipal = emi.principalAmount + deferredPerEmi;
          // emiAmount = principal + interest (consistent total payable)
          const newEmiAmount = newPrincipal + emi.interestAmount;
          const newTotalPayable = newPrincipal + emi.interestAmount;

          // Calculate balances
          const openingBalance = currentOpeningBalance;
          const closingBalance = Math.max(0, openingBalance - newPrincipal); // Ensure non-negative

          await tx.loanEmiSchedule.update({
            where: { id: emi.id },
            data: {
              openingBalance,
              principalAmount: newPrincipal,
              emiAmount: newEmiAmount,
              totalPayableAmount: newTotalPayable,
              closingBalance,
            },
          });

          // Next EMI's opening balance is this EMI's closing balance
          currentOpeningBalance = closingBalance;
        }
      } else {
        // No remaining EMIs: create new ones to cover deferred principal
        // Determine number of new EMIs needed (assume ~equal distribution)
        const lastEmi = futureEmis[futureEmis.length - 1];
        const maxNewEmis = Math.ceil(affectedEmis.length * 0.5); // Conservative: spread over half original period
        const numberOfNewEmis = Math.max(1, maxNewEmis);
        const principalPerNewEmi = totalDeferredPrincipal / numberOfNewEmis;

        // Get the last affected EMI's closingBalance for the first new EMI
        const lastAffectedEmi = affectedEmis[affectedEmis.length - 1];
        let currentOpeningBalance =
          lastAffectedEmi?.closingBalance ?? loan.approvedAmount ?? 0;

        // Find the highest emiNo to continue sequence
        const maxEmiNo = Math.max(...futureEmis.map((e) => e.emiNo));

        // Create new EMI rows to recover deferred principal
        for (let i = 0; i < numberOfNewEmis; i++) {
          const newEmiNo = maxEmiNo + 1 + i;
          // Space new EMIs one month apart starting after moratorium end
          const newDueDate = new Date(endDate);
          newDueDate.setMonth(newDueDate.getMonth() + i + 1);

          const openingBalance = currentOpeningBalance;
          // Conservative interest calc on deferred principal
          const interestOnDeferred =
            (principalPerNewEmi * (loan.interestRate ?? 0)) / 100 / 12;
          const closingBalance = Math.max(
            0,
            openingBalance - principalPerNewEmi,
          );

          await tx.loanEmiSchedule.create({
            data: {
              loanApplicationId: loanId,
              loanNumber: loan.loanNumber,
              emiNo: newEmiNo,
              emiStartDate: new Date(
                endDate.getFullYear(),
                endDate.getMonth() + i,
                endDate.getDate(),
              ),
              dueDate: newDueDate,
              openingBalance,
              principalAmount: principalPerNewEmi,
              interestAmount: interestOnDeferred,
              emiAmount: principalPerNewEmi + interestOnDeferred,
              closingBalance,
              totalPayableAmount: principalPerNewEmi + interestOnDeferred,
              status: "pending",
            },
          });

          currentOpeningBalance = closingBalance;
        }
      }
    }

    return tx.emiMoratorium.create({
      data: {
        loanApplicationId: loanId,
        type,
        startDate,
        endDate,
        interestAccrued,
        status: "active",
      },
    });
  });

  if (userId && branchId) {
    await logAction({
      entityType: "LOAN",
      entityId: loanId,
      action: "UPDATE_LOAN_STATUS",
      performedBy: userId,
      branchId,
      oldValue: null,
      newValue: {
        moratoriumType: type,
        startDate,
        endDate,
        interestAccrued: moratorium.interestAccrued,
      },
      remarks: "Moratorium applied on active loan",
    });
  }

  return { message: "Moratorium applied successfully", moratorium };
};

export const editEmiService = async (
  emiId: string,
  newDueDate: Date,
  userId?: string,
  branchId?: string,
) => {
  const emi = await prisma.loanEmiSchedule.findUnique({
    where: { id: emiId },
  });

  if (!emi) {
    throw AppError.notFound("EMI not found");
  }

  const updated = await prisma.loanEmiSchedule.update({
    where: { id: emiId },
    data: {
      dueDate: newDueDate, // ✅ only Date
    },
  });

  if (userId && branchId) {
    await logAction({
      entityType: "EMI_SCHEDULE",
      entityId: emiId,
      action: "UPDATE_LOAN_STATUS",
      performedBy: userId,
      branchId,
      oldValue: { dueDate: emi.dueDate },
      newValue: { dueDate: updated.dueDate },
      remarks: "EMI due date updated manually",
    });
  }

  return updated;
};
