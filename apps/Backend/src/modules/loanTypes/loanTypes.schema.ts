import { z } from "zod";
import {
  InterestType,
  CommissionType,
  EmploymentType,
  LoanTypes,
} from "../../../generated/prisma-client/enums.js";
import {
  getInvalidLoanDocumentTypes,
  normalizeLoanDocumentCsv,
} from "../../common/constants/loanDocumentTypes.js";

const loanTypeBaseSchema = z.object({
  code: z.string().trim().uppercase().min(3).max(50),
  name: z.string().trim().min(3).max(100),
  description: z.string().optional(),

  category: z.nativeEnum(LoanTypes),
  secured: z.boolean().default(false),

  minAmount: z.number().positive(),
  maxAmount: z.number().positive(),
  minTenureMonths: z.number().int().positive(),
  maxTenureMonths: z.number().int().positive(),

  interestType: z.nativeEnum(InterestType),
  minInterestRate: z.number().min(0),
  maxInterestRate: z.number().min(0),
  defaultInterestRate: z.number().min(0),

  minProcessingFee: z.number().min(0),
  maxProcessingFee: z.number().min(0),
  minLoginCharges: z.number().min(0),
  defaultLoginCharges: z.number().min(0),
  maxLoginCharges: z.number().min(0),
  gstApplicable: z.boolean().default(true),
  gstPercentage: z.number().min(0).max(100).optional(),

  minAge: z.number().int().min(18),
  maxAge: z.number().int().max(100),
  minIncome: z.number().optional(),
  employmentType: z.nativeEnum(EmploymentType).optional(),

  minCibilScore: z.number().int().min(300).max(900).optional(),
  maxCibilScore: z.number().int().min(300).max(900).optional(),

  maxLoanToValueRatio: z.number().min(0).max(100).optional(),

  prepaymentAllowed: z.boolean().default(true),
  foreclosureAllowed: z.boolean().default(true),
  prepaymentCharges: z.number().min(0).optional(),
  foreclosureCharges: z.number().min(0).optional(),

  isActive: z.boolean().default(true),
  isPublic: z.boolean().default(true),
  approvalRequired: z.boolean().default(true),

  estimatedProcessingTimeDays: z.number().int().positive().optional(),
  // documentsRequired: z.string(),
  // documentsOptions: z.string().optional(),

  applicantDocumentsRequired: z.string(),
  applicantDocumentsOptional: z.string().optional(),
  coApplicantDocumentsRequired: z.string(),
  coApplicantDocumentsOptional: z.string().optional(),
  guarantorDocumentsRequired: z.string(),
  guarantorDocumentsOptional: z.string().optional(),
  otherDocumentsRequired: z.string(),
  otherDocumentsOptions: z.string().optional(),
});

export const createLoanTypeSchema = loanTypeBaseSchema
  .superRefine((data, ctx) => {
    const min = data.minInterestRate;
    const max = data.maxInterestRate;
    const def = data.defaultInterestRate;

    if (min === undefined || max === undefined || def === undefined) {
      return;
    }

    if (max < min) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "maxInterestRate must be greater than or equal to minInterestRate",
        path: ["maxInterestRate"],
      });
    }

    if (def < min || def > max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "defaultInterestRate must be within minInterestRate and maxInterestRate",
        path: ["defaultInterestRate"],
      });
    }

    const perPartyFields: Array<[string, string | undefined]> = [
      ["applicantDocumentsRequired", data.applicantDocumentsRequired],
      ["applicantDocumentsOptional", data.applicantDocumentsOptional],
      ["coApplicantDocumentsRequired", data.coApplicantDocumentsRequired],
      ["coApplicantDocumentsOptional", data.coApplicantDocumentsOptional],
      ["guarantorDocumentsRequired", data.guarantorDocumentsRequired],
      ["guarantorDocumentsOptional", data.guarantorDocumentsOptional],
      ["otherDocumentsRequired", data.otherDocumentsRequired],
      ["otherDocumentsOptions", data.otherDocumentsOptions],
    ];
    for (const [fieldName, fieldValue] of perPartyFields) {
      if (fieldValue) {
        const invalid = getInvalidLoanDocumentTypes(fieldValue);
        if (invalid.length > 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${fieldName} has invalid types: ${invalid.join(", ")}`,
            path: [fieldName],
          });
        }
      }
    }
  })
  .transform((data) => ({
    ...data,
    applicantDocumentsRequired: normalizeLoanDocumentCsv(data.applicantDocumentsRequired),
    applicantDocumentsOptional: data.applicantDocumentsOptional
      ? normalizeLoanDocumentCsv(data.applicantDocumentsOptional)
      : undefined,
    coApplicantDocumentsRequired: normalizeLoanDocumentCsv(data.coApplicantDocumentsRequired),
    coApplicantDocumentsOptional: data.coApplicantDocumentsOptional
      ? normalizeLoanDocumentCsv(data.coApplicantDocumentsOptional)
      : undefined,
    guarantorDocumentsRequired: normalizeLoanDocumentCsv(data.guarantorDocumentsRequired),
    guarantorDocumentsOptional: data.guarantorDocumentsOptional
      ? normalizeLoanDocumentCsv(data.guarantorDocumentsOptional)
      : undefined,
  }));

export const updateLoanTypeSchema = loanTypeBaseSchema
  .partial()
  .superRefine((data, ctx) => {
    const min = data.minInterestRate;
    const max = data.maxInterestRate;
    const def = data.defaultInterestRate;

    if (min !== undefined && max !== undefined && max < min) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "maxInterestRate must be greater than or equal to minInterestRate",
        path: ["maxInterestRate"],
      });
    }

    if (
      min !== undefined &&
      max !== undefined &&
      def !== undefined &&
      (def < min || def > max)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "defaultInterestRate must be within minInterestRate and maxInterestRate",
        path: ["defaultInterestRate"],
      });
    }

    const perPartyFields: Array<[string, string | undefined]> = [
      ["applicantDocumentsRequired", data.applicantDocumentsRequired],
      ["applicantDocumentsOptional", data.applicantDocumentsOptional],
      ["coApplicantDocumentsRequired", data.coApplicantDocumentsRequired],
      ["coApplicantDocumentsOptional", data.coApplicantDocumentsOptional],
      ["guarantorDocumentsRequired", data.guarantorDocumentsRequired],
      ["guarantorDocumentsOptional", data.guarantorDocumentsOptional],
    ];
    for (const [fieldName, fieldValue] of perPartyFields) {
      if (fieldValue !== undefined) {
        const invalid = getInvalidLoanDocumentTypes(fieldValue);
        if (invalid.length > 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${fieldName} has invalid types: ${invalid.join(", ")}`,
            path: [fieldName],
          });
        }
      }
    }
  })
  .transform((data) => ({
    ...data,
    ...(data.applicantDocumentsRequired !== undefined && {
      applicantDocumentsRequired: normalizeLoanDocumentCsv(data.applicantDocumentsRequired),
    }),
    ...(data.applicantDocumentsOptional !== undefined && {
      applicantDocumentsOptional: normalizeLoanDocumentCsv(data.applicantDocumentsOptional),
    }),
    ...(data.coApplicantDocumentsRequired !== undefined && {
      coApplicantDocumentsRequired: normalizeLoanDocumentCsv(data.coApplicantDocumentsRequired),
    }),
    ...(data.coApplicantDocumentsOptional !== undefined && {
      coApplicantDocumentsOptional: normalizeLoanDocumentCsv(data.coApplicantDocumentsOptional),
    }),
    ...(data.guarantorDocumentsRequired !== undefined && {
      guarantorDocumentsRequired: normalizeLoanDocumentCsv(data.guarantorDocumentsRequired),
    }),
    ...(data.guarantorDocumentsOptional !== undefined && {
      guarantorDocumentsOptional: normalizeLoanDocumentCsv(data.guarantorDocumentsOptional),
    }),
  }));

export const loanTypeIdSchema = z.object({
  id: z.string().cuid(),
});
export const loanTypeListQuerySchema = z.object({
  isActive: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  category: z.nativeEnum(LoanTypes).optional(),
});
