import { z } from "zod";

export const createSanctionSchema = z.object({
	loanNumber: z.string().min(1),
	sanctionedAmount: z.number().positive(),
	currency: z.string().optional(),
	remarks: z.string().optional(),
	documents: z.any().optional(),
});

export const updateSanctionSchema = z.object({
	sanctionedAmount: z.number().positive().optional(),
	status: z.enum(["PENDING", "APPROVED", "REJECTED", "PARTIAL"]).optional(),
	approvedBy: z.string().optional(),
	approvedAt: z.string().optional(),
	remarks: z.string().optional(),
	documents: z.any().optional(),
});

export const sanctionIdParamSchema = z.object({ id: z.string().min(1) });

export const sanctionListQuerySchema = z.object({
	page: z.preprocess((v) => Number(v), z.number().int().positive()).optional(),
	limit: z.preprocess((v) => Number(v), z.number().int().positive()).optional(),
	status: z.string().optional(),
	loanApplicationId: z.string().optional(),
});

export type CreateSanctionInput = z.infer<typeof createSanctionSchema>;
export type UpdateSanctionInput = z.infer<typeof updateSanctionSchema>;
