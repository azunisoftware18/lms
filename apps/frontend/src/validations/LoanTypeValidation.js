import { z } from "zod";

export const loanTypeSchema = z.object({
  loanName: z.string().min(3, "Loan name must be at least 3 characters"),

  loanCategory: z.string().min(1, "Loan category is required"),

  minLoanAmount: z.coerce.number().positive("Minimum amount must be positive"),

  maxLoanAmount: z.coerce.number().positive(),

  minTenure: z.coerce.number().int().positive(),

  maxTenure: z.coerce.number().int().positive(),

  minInterestRate: z.coerce.number().min(0),

  maxInterestRate: z.coerce.number().min(0),

  defaultInterestRate: z.coerce.number().min(0),

  minAge: z.coerce.number().int().min(18),

  maxAge: z.coerce.number().int().max(100),
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

});