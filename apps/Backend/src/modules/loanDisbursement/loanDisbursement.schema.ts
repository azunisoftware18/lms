// loanDisbursement.schema.ts

import { z } from "zod";

export const disburseLoanSchema = z.object({
  disbursementMode: z.enum([
    "BANK_TRANSFER",
    "NEFT",
    "RTGS",
    "IMPS",
    "UPI",
    "CASH",
    "CHEQUE",
  ]),
  transactionReference: z.string().min(3, "Transaction reference required"),
  remarks: z.string().max(255).optional(),
  bankName: z.string().max(255).optional(),
  bankAccountNumber: z.string().max(64).optional(),
  ifscCode: z.string().max(32).optional(),
  accountHolderName: z.string().max(255).optional(),
  valueDate: z.string().optional(),
  externalTxnId: z.string().max(255).optional(),
  utrNumber: z.string().max(255).optional(),
});

export const reverseDisbursementSchema = z.object({
  reason: z.string().max(1024).optional(),
});