import { z } from "zod";
import { BranchType } from "../../../generated/prisma-client/enums.js";

export const createBranchSchema = z
  .object({
    name: z.string().min(1),
    code: z.string().min(1),
    type: z.nativeEnum(BranchType),
    parentBranchId: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "HEAD_OFFICE" && data.parentBranchId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["parentBranchId"],
        message: "Head Office / Central Office cannot have a parent branch",
      });
    }

    if (data.type !== "HEAD_OFFICE" && !data.parentBranchId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["parentBranchId"],
        message: "This branch type requires a parent branch",
      });
    }
  });

export const updateBranchSchema = z.object({
  name: z.string().min(1).optional(),
  code: z.string().min(1).optional(),
  type: z.nativeEnum(BranchType).optional(),
  parentBranchId: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

export const branchIdParamSchema = z.object({
  id: z.string().cuid(),
});

export const createBulkBranchesSchema = z.object({
  parentBranchId: z.string().min(1),
  type: z.enum(["ZONAL", "REGIONAL", "BRANCH"]).optional(),
  branches: z
    .array(
      z.object({
        name: z.string().min(1),
        code: z.string().min(1),
      }),
    )
    .min(1, "At least one branch is required"),
});

export const reassignBulkBranchesSchema = z.object({
  newParentBranchId: z.string().min(1),
  branchIds: z
    .array(z.string().min(1))
    .min(1, "At least one branch is required"),
});
