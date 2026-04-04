import { prisma } from "../../db/prismaService.js";
import { logAction } from "../../audit/audit.helper.js";
import * as Enums from "../../../generated/prisma-client/enums.js";
import type { CreateloanDisbursementInput } from "./loanDisbursement.types.js";

export const disburseLoanService = async (
  loanNumber: string,
  userId: string,
  input: CreateloanDisbursementInput,
) => {
  // Validate required fields (basic)
  if (!input.disbursementMode) {
    throw new Error("Disbursement mode is required");
  }
  if (!input.transactionReference) {
    throw new Error("Transaction reference is required");
  }

  return prisma.$transaction(async (tx) => {
    // loanNumber param may be either the loan `id` or the human `loanNumber`.
    let loan = await tx.loanApplication.findUnique({ where: { id: loanNumber } });
    if (!loan) {
      loan = await tx.loanApplication.findUnique({ where: { loanNumber: loanNumber } });
    }
    if (!loan) {
      const err: any = new Error("Loan application not found");
      err.statusCode = 404;
      throw err;
    }
    if (loan.status !== "Ready_for_disbursement" && loan.status !== "approved" && loan.status !== "SANCTIONED") {
      throw new Error("Only approved loans can be disbursed");
    }
    if (!loan.approvedAmount) {
      throw new Error("Approved amount not found for this loan");
    }
    const existingDisbursement = await tx.loanDisbursement.findUnique({
      where: { loanNumber: loan.id },
    });
    if (existingDisbursement) {
      throw new Error("loan already disbursed");
    }
    const disbursement = await tx.loanDisbursement.create({
      data: {
        // relation expects loanApplication.id
        loanNumber: loan.id,
        amount: loan.approvedAmount,
        // required by Prisma schema
        principalAmount: loan.approvedAmount,
        interestAmount: 0,
        disbursementMode: input.disbursementMode,
        transactionReference: input.transactionReference,
        externalTxnId: input.externalTxnId ?? "",
        utrNumber: input.utrNumber ?? "",
        bankName: input.bankName ?? "",
        bankAccountNumber: input.bankAccountNumber ?? "",
        ifscCode: input.ifscCode ?? "",
        accountHolderName: input.accountHolderName ?? "",
        valueDate: input.valueDate ? new Date(input.valueDate) : undefined,
        remarks: input.remarks ?? "",
        processedBy: userId,
        metadata: {
          branchId: loan.branchId ?? "",
          createdFrom: "api",
        },
      },
    });
    await tx.loanApplication.update({ where: { id: loan.id }, data: { status: "active" } });

    await logAction({
      action: "LOAN_DISBURSED",
      entityType: "LOAN_APPLICATION",
      entityId: loan.loanNumber,
      performedBy: userId,
      branchId: loan.branchId,
      oldValue: {
        status: loan.status,
      },
      newValue: {
        disbursementMode: input.disbursementMode,
        transactionReference: input.transactionReference,
        amount: loan.approvedAmount,
        principalAmount: loan.approvedAmount,
        interestAmount: 0,
      },
      remarks: `Disbursed via ${input.disbursementMode} `,
    });

    return disbursement;
  });
};

export const getDisbursementByLoanNumberService = async (loanNumber: string) => {
  // loanNumber param may be loan.id (stored in disbursement.loanNumber) or the public loanNumber
  let disbursement = await prisma.loanDisbursement.findUnique({ where: { loanNumber } });
  if (disbursement) return disbursement;

  // try resolving by LoanApplication.loanNumber -> then lookup by loan.id
  const loan = await prisma.loanApplication.findUnique({ where: { loanNumber } });
  if (loan) {
    disbursement = await prisma.loanDisbursement.findUnique({ where: { loanNumber: loan.id } });
  }

  if (!disbursement) {
    const err: any = new Error("Disbursement not found");
    err.statusCode = 404;
    throw err;
  }
  return disbursement;
};

export const listDisbursementsService = async (params: { page?: number; limit?: number } = {}) => {
  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : 20;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.loanDisbursement.findMany({ orderBy: { createdAt: "desc" }, skip, take: limit }),
    prisma.loanDisbursement.count(),
  ]);

  return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};

export const reverseDisbursementService = async (
  loanNumber: string,
  userId: string,
  reason?: string,
) => {
  return prisma.$transaction(async (tx) => {
    // Resolve disbursement by stored loanNumber (which holds loan.id),
    // or by resolving the loan using the public loanNumber.
    let disb = await tx.loanDisbursement.findUnique({ where: { loanNumber } });
    if (!disb) {
      const loan = await tx.loanApplication.findUnique({ where: { loanNumber } });
      if (loan) disb = await tx.loanDisbursement.findUnique({ where: { loanNumber: loan.id } });
    }
    if (!disb) {
      const err: any = new Error("Disbursement not found");
      err.statusCode = 404;
      throw err;
    }
    if (disb.isReversed) {
      throw new Error("Disbursement already reversed");
    }

    const updated = await tx.loanDisbursement.update({
      where: { id: disb.id },
      data: {
        isReversed: true,
        reversedAt: new Date(),
        reversalReason: reason || null,
      },
    });

    // update loan status back to approved (or a configurable state)
    await tx.loanApplication.update({ where: { id: disb.loanNumber }, data: { status: "approved" } });

    // determine branchId from loan record when available to satisfy audit type
    const loanRec = await tx.loanApplication.findUnique({ where: { id: disb.loanNumber }, select: { branchId: true } });
    const auditBranchId = loanRec?.branchId ?? "";

    await logAction({
      action: "UPDATE_LOAN_STATUS",
      entityType: "LOAN_DISBURSEMENT",
      entityId: disb.id,
      performedBy: userId,
      branchId: auditBranchId,
      oldValue: { isReversed: false },
      newValue: { isReversed: true, reversalReason: reason },
      remarks: reason ?? undefined,
    });

    return updated;
  });
};
