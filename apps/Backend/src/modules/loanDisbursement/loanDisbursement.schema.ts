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
});