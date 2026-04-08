import { prisma } from "../../db/prismaService.js";
import { AppError } from "../../common/utils/apiError.js";
import { logAction } from "../../audit/audit.helper.js";
import app from "../../app.js";

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

    const remainingPrincipal = emis.reduce((sum, e) => sum + e.principalAmount, 0);
    const accruedInterest = emis.reduce((sum, e) => sum + e.interestAmount, 0);

    const unpaidEmiCharges = emis.reduce((sum, emi) => {
      const lateFee =
        now > emi.dueDate
          ? emi.latePaymentFeeType === "FIXED"
            ? emi.latePaymentFee
            : (emi.emiAmount * emi.latePaymentFee) / 100
          : 0;

      const bounceCharge =
        emi.bounceChargeApplied && emi.lastPaymentMode === "CHEQUE" && emi.chequeStatus === "BOUNCED"
          ? emi.bounceCharges
          : 0;

      const chargeDue = lateFee + bounceCharge;
      const extraPaidTowardCharges = Math.max((emi.emiPaymentAmount ?? 0) - emi.emiAmount, 0);
      const chargeOutstanding = Math.max(chargeDue - extraPaidTowardCharges, 0);

      return sum + chargeOutstanding;
    }, 0);

    const foreclosurePenalty = remainingPrincipal * ((loan.foreclosureCharges ?? 0) / 100);

    const totalPayable = remainingPrincipal + accruedInterest + foreclosurePenalty + unpaidEmiCharges;

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

export const applyForecloseLoanService = async (
  loanId: string,
  userId?: string,
  branchId?: string,
  createApplication = false,
) => {
  try {
    const loan = await prisma.loanApplication.findUnique({ where: { id: loanId } });
    if (!loan) throw AppError.notFound("Loan application not found");

    if (loan.status !== "active" && loan.status !== "defaulted") {
      throw AppError.badRequest("Loan is not active or defaulted");
    }

    const summary = await forecloseLoanService(loan.id);

    if (createApplication && userId && branchId) {
      await logAction({
        entityType: "LOAN",
        entityId: loan.id,
        action: "APPLY_FORECLOSE",
        performedBy: userId,
        branchId,
        oldValue: { status: loan.status },
        newValue: { status: loan.status },
        remarks: "Foreclose application submitted",
      });
      // persist foreclosure application record
      const record = await (prisma as any).foreClosure.create({
        data: {
          loanApplicationId: loan.id,
          appliedBy: userId,
          appliedAt: new Date(),
          principalOutstanding: summary.remainingPrincipal,
          interestAccrued: summary.accruedInterest,
          unpaidEmiCharges: summary.unpaidEmiCharges,
          penalty: summary.foreclosurePenalty,
          totalPayable: summary.totalPayable,
          foreclosureAmount: summary.totalPayable,
          approvalStatus: "PENDING",
        },
      });

      return { summary, foreClosure: record };
    }

    return { summary };
  } catch (error: any) {
    if (error?.statusCode) throw error;
    throw AppError.internal(error.message || "Failed to apply for foreclose");
  }
};

export const payforecloseLoanService = async (
  loanId: string,
  data: any,
  userId?: string,
  branchId?: string,
) => {
  try {
    const loan = await prisma.loanApplication.findUnique({ where: { id: loanId } });
    if (!loan) throw AppError.notFound("Loan application not found");

    if (loan.status !== "active" && loan.status !== "defaulted") {
      throw AppError.badRequest("Loan is not active");
    }

    const foreclosure = await (prisma as any).foreClosure.findFirst({ where: { loanApplicationId: loan.id }, orderBy: { createdAt: "desc" } });
    if (!foreclosure) throw AppError.notFound("Foreclosure application not found");
    if (foreclosure.approvalStatus !== "APPROVED") {
        throw AppError.badRequest("Foreclosure application is not approved");
    }
    
    const paidEmisCount = await prisma.loanEmiSchedule.count({
      where: { loanApplicationId: loan.id, status: "paid" },
    });

    if (paidEmisCount < 6) {
      throw AppError.badRequest("At least 6 EMIs must be paid before foreclosing the loan");
    }

    const emis = await prisma.loanEmiSchedule.findMany({
      where: { loanApplicationId: loan.id, status: { in: ["pending", "overdue"] } },
    });

    const foreclosureSummary = await forecloseLoanService(loan.id);
    const totalPayable = foreclosureSummary.totalPayable;

    if (data.amountPaid <= 0) throw AppError.badRequest("Payment amount must be greater than zero");
    if (data.amountPaid < totalPayable) throw AppError.badRequest("Insufficient amount to foreclose the loan");

    if (data.amountPaid >= totalPayable) {
      await prisma.$transaction(async (tx) => {
        for (const emi of emis) {
          await tx.loanEmiSchedule.update({ where: { id: emi.id }, data: { status: "paid", paidDate: new Date(), emiPaymentAmount: emi.emiAmount } });
        }
      });
    }

    await prisma.loanApplication.update({ where: { id: loan.id }, data: { status: "closed", foreclosureDate: new Date() } });

    if (userId && branchId) {
      await logAction({
        entityType: "LOAN",
        entityId: loan.id,
        action: "UPDATE_LOAN_STATUS",
        performedBy: userId,
        branchId,
        oldValue: { status: loan.status },
        newValue: { status: "closed" },
        remarks: "Loan foreclosed after settlement of outstanding amount",
      });
    }

    // update or create foreclosure record with settlement info
    let closure = await (prisma as any).foreClosure.findFirst({ where: { loanApplicationId: loan.id }, orderBy: { createdAt: "desc" } });
    const settlementData: any = {
      foreclosureAmount: foreclosureSummary.totalPayable,
      foreclosureApprovedBy: userId,
      foreclosureApprovedAt: new Date(),
      approvalStatus: "APPROVED",
      settledAmount: Number(data.amountPaid),
      settledAt: new Date(),
      settlementReference: data.settlementReference || data.reference || null,
      paymentMode: data.paymentMode || null,
      settlementReceiptUrl: data.receiptUrl || null,
    };

    if (closure) {
      closure = await (prisma as any).foreClosure.update({ where: { id: closure.id }, data: settlementData });
    } else {
      closure = await (prisma as any).foreClosure.create({ data: { loanApplicationId: loan.id, appliedAt: new Date(), appliedBy: userId, ...settlementData, principalOutstanding: foreclosureSummary.remainingPrincipal, interestAccrued: foreclosureSummary.accruedInterest, unpaidEmiCharges: foreclosureSummary.unpaidEmiCharges, penalty: foreclosureSummary.foreclosurePenalty, totalPayable: foreclosureSummary.totalPayable } });
    }

    return { ...foreclosureSummary, amountPaid: Number(data.amountPaid), foreClosure: closure };
  } catch (error: any) {
    if (error?.statusCode) throw error;
    throw AppError.internal(error.message || "Failed to foreclose loan");
  }
};


export const approveForecloseService = async (
  loanId: string,
  userId: string,
  branchId: string,
  approve: boolean
) => {
  try {
    const loan = await prisma.loanApplication.findUnique({ where: { id: loanId } });
        if (!loan) throw AppError.notFound("Loan application not found");

        const closure = await (prisma as any).foreClosure.findFirst({ where: { loanApplicationId: loan.id }, orderBy: { createdAt: "desc" } });
        if (!closure) throw AppError.notFound("Foreclosure application not found");
        if (closure.approvalStatus !== "PENDING") throw AppError.badRequest("Foreclosure application is not pending approval");
        if (approve) {
          await (prisma as any).foreClosure.update({ where: { id: closure.id }, data: { approvalStatus: "APPROVED",
            foreclosureApprovedBy: userId,
            foreclosureApprovedAt: new Date(),
             } });
        } else {
            await (prisma as any).foreClosure.update({ where: { id: closure.id }, data: { approvalStatus: "REJECTED", reason: `Rejected by ${userId}` } });
        }
        return closure;
    } catch (error: any) {
        if (error?.statusCode) throw error;
        throw AppError.internal(error.message || "Failed to approve foreclosure application");
    }
};


