import { z } from "zod";

export const createBranchAdminSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  userName: z.string().min(3, "Username is required"),
  contactNumber: z.string().min(10, "Contact number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  branchId: z.string().cuid("Valid branchId is required"),
});

export const updateBranchAdminSchema = z.object({
  fullName: z.string().min(1).optional(),
  email: z.string().email("Invalid email address").optional(),
  userName: z.string().min(3).optional(),
  contactNumber: z.string().min(10).optional(),
  password: z.string().min(6).optional(),
  branchId: z.string().cuid().optional(),
});

export const branchAdminIdParamSchema = z.object({
  id: z.string().cuid(),
});

export const getBranchAdminsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  search: z.string().optional(),
  q: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});