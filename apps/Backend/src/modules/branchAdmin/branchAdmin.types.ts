import { z } from "zod";
import {
  createBranchAdminSchema,
  updateBranchAdminSchema,
  branchAdminIdParamSchema,
} from "./branchAdmin.schema.js";

export type CreateBranchAdminInput = z.infer<typeof createBranchAdminSchema>;
export type UpdateBranchAdminInput = z.infer<typeof updateBranchAdminSchema>;
export type BranchAdminIdParamInput = z.infer<typeof branchAdminIdParamSchema>;