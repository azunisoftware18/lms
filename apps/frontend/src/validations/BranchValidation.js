import { z } from "zod";

export const branchSchema = z
  .object({
    name: z
      .string()
      .min(1, "Branch name is required")
      .min(3, "Branch name must be at least 3 characters"),

    code: z
      .string()
      .min(1, "Branch code is required")
      .min(2, "Branch code must be at least 2 characters"),

    type: z.enum(
      ["HEAD_OFFICE", "ZONAL", "REGIONAL", "BRANCH", "MAIN", "SUB"],
      {
        errorMap: () => ({ message: "Branch type is required" }),
      },
    ),

    parentBranchId: z.string().optional(),

    city: z.string().optional(),

    state: z.string().optional(),

    address: z.string().optional(),

    head: z.string().optional(),

    isActive: z.boolean(),
  })

  .superRefine((data, ctx) => {
    const isTopLevelType = data.type === "HEAD_OFFICE" || data.type === "MAIN";
    if (!isTopLevelType && !data.parentBranchId) {
      ctx.addIssue({
        path: ["parentBranchId"],
        message: "Please select a parent branch",
        code: z.ZodIssueCode.custom,
      });
    }
  });
