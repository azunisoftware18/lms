import { z } from "zod";
import { createBranchSchema, updateBranchSchema, branchIdParamSchema } from "./branch.schema.js";

export type CreateBranchInput = z.infer<typeof createBranchSchema>;
export type UpdateBranchInput = z.infer<typeof updateBranchSchema>;
export type BranchIdParamInput = z.infer<typeof branchIdParamSchema>;