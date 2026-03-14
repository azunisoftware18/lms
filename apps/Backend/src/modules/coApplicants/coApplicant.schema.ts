import { z } from "zod";
import { LOAN_DOCUMENT_TYPES } from "../../common/constants/loanDocumentTypes.js";

const CO_APPLICANT_DOCUMENT_TYPES = [
  "PAN",
  "AADHAAR",
  "PHOTO",
  "CO_APPLICANT_PHOTO",
  "SIGNATURE",
  "VOTER_ID",
  "DRIVING_LICENSE",
  "PASSPORT",
  "ADDRESS_PROOF",
  "INCOME_PROOF",
  "BANK_STATEMENT",
  "CO_APPLICANT_BANK_STATEMENT",
  "OTHER",
] as const satisfies ReadonlyArray<(typeof LOAN_DOCUMENT_TYPES)[number]>;

export const coApplicantDocumentTypeSchema = z.enum(CO_APPLICANT_DOCUMENT_TYPES);

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

export const coApplicantDocumentIdParamSchema = z.object({
  documentId: z.string().cuid(),
});
