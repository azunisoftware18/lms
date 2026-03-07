import { z } from "zod";

export const loanTypeSchema = z.object({
  loanName: z.string().min(1, "Loan name is required"),

  loanCategory: z.string().min(1, "Loan category is required"),

  description: z.string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  minLoanAmount: z.number()
    .min(1, "Minimum amount must be positive"),

  maxLoanAmount: z.number()
    .min(1, "Amount must be positive")
    .refine((value, ctx) => {
      const minAmount = ctx.parent.minLoanAmount;
      if (minAmount && value <= minAmount) {
        return false;
      }
      return true;
    }, {
      message: "Maximum amount must be greater than minimum amount",
      path: ["maxLoanAmount"]
    }),

  minTenure: z.number()
    .min(1, "Minimum tenure must be positive"),

  maxTenure: z.number()
    .min(1, "Tenure must be positive")
    .refine((value, ctx) => {
      const minTenure = ctx.parent.minTenure;
      if (minTenure && value <= minTenure) {
        return false;
      }
      return true;
    }, {
      message: "Maximum tenure must be greater than minimum tenure",
      path: ["maxTenure"]
    }),

  minAge: z.number()
    .min(18, "Minimum age must be at least 18"),

  maxAge: z.number()
    .max(100, "Maximum age is too high")
    .refine((value, ctx) => {
      const minAge = ctx.parent.minAge;
      if (minAge && value <= minAge) {
        return false;
      }
      return true;
    }, {
      message: "Maximum age must be greater than minimum age",
      path: ["maxAge"]
    })
});