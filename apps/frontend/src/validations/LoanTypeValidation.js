import { z } from "zod";

export const loanTypeSchema = z
  .object({
    loanCode: z.string().min(1, "Loan code is required"),

    loanName: z.string().min(3, "Loan name must be at least 3 characters"),

    loanCategory: z.string().min(1, "Loan category is required"),

    minLoanAmount: z.coerce
      .number()
      .positive("Minimum amount must be positive"),

    maxLoanAmount: z.coerce.number().positive(),

    minTenure: z.coerce.number().int().positive(),

    maxTenure: z.coerce.number().int().positive(),

    minInterestRate: z.coerce.number().min(0),

    maxInterestRate: z.coerce.number().min(0),

    defaultInterestRate: z.coerce.number().min(0),

    interestType: z.enum(["FLAT", "REDUCING"], {
      error: "Interest type must be FLAT or REDUCING",
    }),

    minProcessingFee: z.coerce
      .number()
      .min(0, "Minimum processing fee must be at least 0"),
    maxProcessingFee: z.coerce
      .number()
      .min(0, "Maximum processing fee must be at least 0"),

    minLoginCharges: z.preprocess((value) => {
      if (value === "" || value === null || value === undefined)
        return undefined;
      const parsed = Number(value);
      return Number.isNaN(parsed) ? value : parsed;
    }, z.number().min(0).optional()),
    defaultLoginCharges: z.preprocess((value) => {
      if (value === "" || value === null || value === undefined)
        return undefined;
      const parsed = Number(value);
      return Number.isNaN(parsed) ? value : parsed;
    }, z.number().min(0).optional()),
  

    maxLoginCharges: z.preprocess((value) => {
      if (value === "" || value === null || value === undefined)
        return undefined;
      const parsed = Number(value);
      return Number.isNaN(parsed) ? value : parsed;
    }, z.number().min(0).optional()),

    gstApplicable: z.boolean().default(false),

    gstPercentage: z.preprocess((value) => {
      if (value === "" || value === null || value === undefined)
        return undefined;
      const parsed = Number(value);
      return Number.isNaN(parsed) ? value : parsed;
    }, z.number().min(0, "GST percentage must be at least 0").max(100, "GST percentage cannot exceed 100").optional()),

    minAge: z.coerce.number().int().min(18),

    maxAge: z.coerce.number().int().max(100),

    securedLoan: z.boolean().default(false),

    minMonthlyIncome: z.preprocess((value) => {
      if (value === "" || value === null || value === undefined)
        return undefined;
      const parsed = Number(value);
      return Number.isNaN(parsed) ? value : parsed;
    }, z.number().min(0).optional()),

    employmentType: z
      .enum(["salaried", "self_employed", "business", "professional"])
      .optional()
      .or(z.literal("")),

    minCibilScore: z.preprocess((value) => {
      if (value === "" || value === null || value === undefined)
        return undefined;
      const parsed = Number(value);
      return Number.isNaN(parsed) ? value : parsed;
    }, z.number().int().min(300).max(900).optional()),

    maxCibilScore: z.preprocess((value) => {
      if (value === "" || value === null || value === undefined)
        return undefined;
      const parsed = Number(value);
      return Number.isNaN(parsed) ? value : parsed;
    }, z.number().int().min(300).max(900).optional()),

    maxLoanToValueRatio: z.preprocess((value) => {
      if (value === "" || value === null || value === undefined)
        return undefined;
      const parsed = Number(value);
      return Number.isNaN(parsed) ? value : parsed;
    }, z.number().min(0).max(100).optional()),

    prepaymentAllowed: z.boolean().default(false),
    foreclosureAllowed: z.boolean().default(false),

    prepaymentCharges: z.preprocess((value) => {
      if (value === "" || value === null || value === undefined)
        return undefined;
      const parsed = Number(value);
      return Number.isNaN(parsed) ? value : parsed;
    }, z.number().min(0).optional()),

    foreclosureCharges: z.preprocess((value) => {
      if (value === "" || value === null || value === undefined)
        return undefined;
      const parsed = Number(value);
      return Number.isNaN(parsed) ? value : parsed;
    }, z.number().min(0).optional()),

    latePaymentFeeType: z
      .enum(["FIXED", "PERCENTAGE"])
      .optional()
      .or(z.literal("")),

    latePaymentFee: z.preprocess((value) => {
      if (value === "" || value === null || value === undefined)
        return undefined;
      const parsed = Number(value);
      return Number.isNaN(parsed) ? value : parsed;
    }, z.number().min(0).optional()),

    bounceCharges: z.preprocess((value) => {
      if (value === "" || value === null || value === undefined)
        return undefined;
      const parsed = Number(value);
      return Number.isNaN(parsed) ? value : parsed;
    }, z.number().min(0).optional()),

    activeStatus: z.boolean().default(true),
    publicVisibility: z.boolean().default(true),
    approvalRequired: z.boolean().default(true),

    estimatedProcessingTimeDays: z.preprocess((value) => {
      if (value === "" || value === null || value === undefined)
        return undefined;
      const parsed = Number(value);
      return Number.isNaN(parsed) ? value : parsed;
    }, z.number().int().positive().optional()),

    applicantDocumentsRequired: z
      .array(z.string())
      .min(1, "Select at least one applicant required document"),
    applicantDocumentsOptional: z.array(z.string()).default([]),
    coApplicantDocumentsRequired: z
      .array(z.string())
      .min(1, "Select at least one co-applicant required document"),
    coApplicantDocumentsOptional: z.array(z.string()).default([]),
    guarantorDocumentsRequired: z
      .array(z.string())
      .min(1, "Select at least one guarantor required document"),
    guarantorDocumentsOptional: z.array(z.string()).default([]),
    otherDocumentsRequired: z.array(z.string()).default([]),
    otherDocumentsOptions: z.array(z.string()).default([]),
  })
  .superRefine((data, ctx) => {
    if (data.maxLoanAmount < data.minLoanAmount) {
      ctx.addIssue({
        code: "custom",
        message: "Maximum loan must be greater than minimum loan",
        path: ["maxLoanAmount"],
      });
    }

    if (data.maxTenure < data.minTenure) {
      ctx.addIssue({
        code: "custom",
        message: "Maximum tenure must be greater than minimum tenure",
        path: ["maxTenure"],
      });
    }

    if (data.maxInterestRate < data.minInterestRate) {
      ctx.addIssue({
        code: "custom",
        message: "Max interest must be greater than min interest",
        path: ["maxInterestRate"],
      });
    }

    if (
      data.defaultInterestRate < data.minInterestRate ||
      data.defaultInterestRate > data.maxInterestRate
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Default interest must be between min and max interest",
        path: ["defaultInterestRate"],
      });
    }

    if (data.maxAge < data.minAge) {
      ctx.addIssue({
        code: "custom",
        message: "Max age must be greater than min age",
        path: ["maxAge"],
      });
    }

    if (
      data.minCibilScore !== undefined &&
      data.maxCibilScore !== undefined &&
      data.maxCibilScore < data.minCibilScore
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "Max CIBIL score must be greater than or equal to min CIBIL score",
        path: ["maxCibilScore"],
      });
    }

    if (data.prepaymentAllowed && data.prepaymentCharges === undefined) {
      ctx.addIssue({
        code: "custom",
        message: "Prepayment charges are required when prepayment is allowed",
        path: ["prepaymentCharges"],
      });
    }

    if (data.foreclosureAllowed && data.foreclosureCharges === undefined) {
      ctx.addIssue({
        code: "custom",
        message: "Foreclosure charges are required when foreclosure is allowed",
        path: ["foreclosureCharges"],
      });
    }

    if (data.securedLoan && data.maxLoanToValueRatio === undefined) {
      ctx.addIssue({
        code: "custom",
        message: "Max Loan To Value Ratio is required for secured loan",
        path: ["maxLoanToValueRatio"],
      });
    }

    if (data.latePaymentFee !== undefined && !data.latePaymentFeeType) {
      ctx.addIssue({
        code: "custom",
        message:
          "Late payment fee type is required when late payment fee is set",
        path: ["latePaymentFeeType"],
      });
    }

    if (data.gstApplicable && data.gstPercentage === undefined) {
      ctx.addIssue({
        code: "custom",
        message: "GST percentage is required when GST is applicable",
        path: ["gstPercentage"],
      });
    }

    if (
      data.maxProcessingFee !== undefined &&
      data.minProcessingFee !== undefined &&
      data.maxProcessingFee < data.minProcessingFee
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "Maximum processing fee must be greater than or equal to minimum processing fee",
        path: ["maxProcessingFee"],
      });
    }

    if (
      data.maxLoginCharges !== undefined &&
      data.minLoginCharges !== undefined &&
      data.maxLoginCharges < data.minLoginCharges
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "Maximum login charges must be greater than or equal to minimum login charges",
        path: ["maxLoginCharges"],
      });
    }
  });
