import { z } from "zod";

export const coApplicantDocumentTypeSchema = z.enum([
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

export const coApplicantIdParamSchema = z.object({
  coApplicantId: z.string().cuid(),
});

export const coApplicantReuploadParamSchema = z.object({
  coApplicantId: z.string().cuid(),
  documentType: coApplicantDocumentTypeSchema,
});

export const coApplicantLoanParamSchema = z.object({
  loanApplicationId: z.string().cuid(),
});
