export type CreatePermissionBody = {
  code: string;
  name: string;
};

export type AssignPermissionsBody = {
  userId: string;
  permissions: string[]; // array of permission codes
};

export type AssignPermissionGroupsBody = {
  userId: string;
  groups: string[];
};

export type AppRole = "SUPER_ADMIN" | "ADMIN" | "EMPLOYEE" | "PARTNER";

export type AssignRolePermissionsBody = {
  role: AppRole;
  permissions: string[];
};

export type AssignRolePermissionGroupsBody = {
  role: AppRole;
  groups: string[];
};

export type UserIdParam = {
  userId: string;
};

export type PermissionDto = {
  id: string;
  code: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type UserPermissionDto = {
  id: string;
  userId: string;
  permissionId: string;
  allowed: boolean;
};

export type RolePermissionDto = {
  id: string;
  role: AppRole;
  permissionId: string;
  allowed: boolean;
};
