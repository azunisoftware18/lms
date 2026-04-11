import { z } from "zod";

export const createEmployeeRoleSchema = z
  .object({
    roleTitle: z.string().trim().min(1, "Role title is required"),
    roleName: z.string().trim().min(1, "Role name is required").regex(/^[A-Z_]+$/, "Role name must be uppercase letters and underscores only"),
    description: z.string().trim().optional(),
    isActive: z.coerce.boolean().optional(),
  })
  .strict();
