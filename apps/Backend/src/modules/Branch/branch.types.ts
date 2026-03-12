import { z } from "zod";
import {
	createBranchSchema,
	updateBranchSchema,
	branchIdParamSchema,
	createBulkBranchesSchema,
	reassignBulkBranchesSchema,
} from "./branch.schema.js";

export type CreateBranchInput = z.infer<typeof createBranchSchema>;
export type UpdateBranchInput = z.infer<typeof updateBranchSchema>;
export type BranchIdParamInput = z.infer<typeof branchIdParamSchema>;
export type CreateBulkBranchesInput = z.infer<typeof createBulkBranchesSchema>;
export type ReassignBulkBranchesInput = z.infer<typeof reassignBulkBranchesSchema>;