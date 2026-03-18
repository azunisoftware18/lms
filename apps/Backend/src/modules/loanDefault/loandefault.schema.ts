import { z } from "zod";

export const loanDefaultParamSchema = z.object({
  loanId: z.string().cuid(),
});

export const loanDefaultQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  branchId: z.string().cuid().optional(),
});
