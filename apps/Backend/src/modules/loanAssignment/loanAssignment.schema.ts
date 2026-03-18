import { z } from "zod";

export const assignLoanSchema = z.object({
  employeeId: z.string().min(1),
  role: z.enum(["PROCESSOR", "LEGAL", "TECHNICAL", "RECOVERY"]),
});

export const assignLoanParamSchema = z.object({
  loanApplicationId: z.string().cuid(),
});

export const unassignLoanSchema = z.object({
  assignmentId: z.string().cuid(),
});

export const assignedLoansQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});