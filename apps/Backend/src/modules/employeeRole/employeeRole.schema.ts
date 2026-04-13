import { z } from "zod";
import { roleFor } from "../../../generated/prisma-client/enums.js";

export const createEmployeeRoleSchema = z
  .object({
    roleTitle: z.string().trim().min(1, "Role title is required"),
    roleName: z
      .string()
      .trim()
      .min(1, "Role name is required")
      .regex(
        /^[A-Z_]+$/,
        "Role name must be uppercase letters and underscores only",
      ),
    roleFor: z.nativeEnum(roleFor).optional().default(roleFor.Employee),
    description: z.string().trim().optional(),
    documentsRequired: z
      .string()
      .trim()
      .min(1, "At least one required document is required"),
    documentsOptions: z.string().optional(),
    isActive: z.coerce.boolean().optional(),
  })
  .strict();

export const updateEmployeeRoleSchema = createEmployeeRoleSchema.partial();

export const employeeRoleIdParamSchema = z
  .object({
    id: z.string().trim().min(1, "Employee role id is required"),
  })
  .strict();
