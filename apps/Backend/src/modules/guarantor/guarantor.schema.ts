import { z } from "zod";

export const guarantorDocumentTypeSchema = z.enum([
  "PAN",
  "AADHAAR",
  "PHOTO",
  "SIGNATURE",
  "VOTER_ID",
  "DRIVING_LICENSE",
  "PASSPORT",
  "ADDRESS_PROOF",
  "INCOME_PROOF",
  "BANK_STATEMENT",
  "OTHER",
]);

export const guarantorIdParamSchema = z.object({
  guarantorId: z.string().cuid(),
});

export const guarantorReuploadParamSchema = z.object({
  guarantorId: z.string().cuid(),
  documentType: guarantorDocumentTypeSchema,
});

export const guarantorDocumentIdParamSchema = z.object({
  documentId: z.string().cuid(),
});

export const guarantorLoanParamSchema = z.object({
  loanApplicationId: z.string().cuid(),
});
