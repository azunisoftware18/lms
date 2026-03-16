import { z } from "zod";

export const createPermissionsSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .regex(/^[A-Z0-9_]+$/, "Code must be uppercase alphanumeric with underscores"),
  name: z.string().trim().min(1).max(255),
});

export const assignPermissionsSchema = z.object({
  userId: z.string().trim().min(1).max(100),
  permissions: z.array(z.string().trim().min(1).max(100)).min(1).max(50),
});

export const assignPermissionGroupsSchema = z.object({
  userId: z.string().trim().min(1).max(100),
  groups: z
    .array(
      z
        .string()
        .trim()
        .min(1)
        .max(100)
        .regex(/^[A-Z0-9_]+$/, "Group name must be uppercase with underscores"),
    )
    .min(1)
    .max(30),
});

export const roleSchema = z.enum(["SUPER_ADMIN", "ADMIN", "EMPLOYEE", "PARTNER"]);

export const assignRolePermissionsSchema = z.object({
  role: roleSchema,
  permissions: z.array(z.string().trim().min(1).max(100)).min(1).max(50),
});

export const assignRolePermissionGroupsSchema = z.object({
  role: roleSchema,
  groups: z
    .array(
      z
        .string()
        .trim()
        .min(1)
        .max(100)
        .regex(/^[A-Z0-9_]+$/, "Group name must be uppercase with underscores"),
    )
    .min(1)
    .max(30),
});

export const userIdParamSchema = z.object({
  userId: z.string().trim().min(1),
});

export const roleParamSchema = z.object({
  role: roleSchema,
});

export type CreatePermissionsBody = z.infer<typeof createPermissionsSchema>;
export type AssignPermissionsBody = z.infer<typeof assignPermissionsSchema>;
export type AssignPermissionGroupsBody = z.infer<typeof assignPermissionGroupsSchema>;
export type AssignRolePermissionsBody = z.infer<typeof assignRolePermissionsSchema>;
export type AssignRolePermissionGroupsBody = z.infer<typeof assignRolePermissionGroupsSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
export type RoleParam = z.infer<typeof roleParamSchema>;
