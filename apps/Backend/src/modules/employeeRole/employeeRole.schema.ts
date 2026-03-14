import { z } from "zod";

export const createEmployeeRoleSchema = z
  .object({
    name: z.string().trim().min(1, "Role name is required"),
    description: z.string().trim().optional(),
    isActive: z.coerce.boolean().optional(),
  })
  .strict();
