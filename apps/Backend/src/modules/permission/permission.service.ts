import { prisma } from "../../db/prismaService.js";
import { PERMISSION_GROUPS } from "../../common/constants/permission.js";

type AppRole = "SUPER_ADMIN" | "ADMIN" | "EMPLOYEE" | "PARTNER";

const normalizeCodes = (codes: string[]) =>
  [...new Set(codes.map((code) => code.trim()).filter(Boolean))];

const resolveCodesFromGroups = (groups: string[]) => {
  const normalizedGroups = [...new Set(groups.map((g) => g.trim().toUpperCase()))];
  const invalidGroups = normalizedGroups.filter(
    (group) => !(group in PERMISSION_GROUPS),
  );

  if (invalidGroups.length > 0) {
    const e: any = new Error(
      `Invalid permission groups: ${invalidGroups.join(", ")}. Use /permissions/permission-groups to list valid groups.`,
    );
    e.statusCode = 400;
    throw e;
  }

  const allCodes = normalizedGroups.flatMap(
    (group) => PERMISSION_GROUPS[group as keyof typeof PERMISSION_GROUPS],
  );

  return normalizeCodes(allCodes);
};

const getPermissionsByCodes = async (permissionCodes: string[]) => {
  const normalizedCodes = normalizeCodes(permissionCodes);
  const permissions = await (prisma as any).permission.findMany({
    where: {
      code: { in: normalizedCodes },
    },
  });

  if (permissions.length !== normalizedCodes.length) {
    const foundCodes = new Set(permissions.map((permission: any) => permission.code));
    const missingCodes = normalizedCodes.filter((code) => !foundCodes.has(code));
    const e: any = new Error(`Permissions not found: ${missingCodes.join(", ")}`);
    e.statusCode = 404;
    throw e;
  }

  return permissions;
};

export const assignPermissionsService = async (
  userId: string,
  permissionCodes: string[],
) => {
  // Check if user exists
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const e: any = new Error("User not found");
    e.statusCode = 404;
    throw e;
  }

  const permissions = await getPermissionsByCodes(permissionCodes);

  const result = await prisma.$transaction(
    permissions.map((permission: any) =>
      (prisma as any).userPermission.upsert({
        where: {
          userId_permissionId: {
            userId,
            permissionId: permission.id,
          },
        },
        update: { allowed: true },
        create: {
          userId,
          permissionId: permission.id,
          allowed: true,
        },
      })
    )
  );

  return result;
};

export const assignPermissionGroupsService = async (
  userId: string,
  groups: string[],
) => {
  const permissionCodes = resolveCodesFromGroups(groups);
  return assignPermissionsService(userId, permissionCodes);
};

export const assignRolePermissionsService = async (
  role: AppRole,
  permissionCodes: string[],
) => {
  const permissions = await getPermissionsByCodes(permissionCodes);

  const result = await prisma.$transaction(
    permissions.map((permission: any) =>
      (prisma as any).rolePermission.upsert({
        where: {
          role_permissionId: {
            role,
            permissionId: permission.id,
          },
        },
        update: { allowed: true },
        create: {
          role,
          permissionId: permission.id,
          allowed: true,
        },
      }),
    ),
  );

  return result;
};

export const assignRolePermissionGroupsService = async (
  role: AppRole,
  groups: string[],
) => {
  const permissionCodes = resolveCodesFromGroups(groups);
  return assignRolePermissionsService(role, permissionCodes);
};

export const getRolePermissionsService = async (role: AppRole) => {
  const rolePermissions = await (prisma as any).rolePermission.findMany({
    where: { role, allowed: true },
    include: { permission: true },
  });

  return rolePermissions.map((rp: any) => ({
    id: rp.id,
    role: rp.role,
    permissionId: rp.permissionId,
    code: rp.permission?.code,
    name: rp.permission?.name,
    allowed: rp.allowed,
  }));
};

export const createPermissionsService = async (permissionData: {
  code: string;
  name: string;
}) => {
  try {
    const permission = await (prisma as any).permission.create({
      data: {
        code: permissionData.code,
        name: permissionData.name,
      },
    });

    return permission;
  } catch (error) {
    throw error;
  }
};

export const getUserPermissionsService = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const e: any = new Error("User not found");
    e.statusCode = 404;
    throw e;
  }

  const userPermissions = await (prisma as any).userPermission.findMany({
    where: { userId },
    include: { permission: true },
  });

  return userPermissions.map((up: any) => ({
    id: up.id,
    permissionId: up.permissionId,
    code: up.permission?.code,
    name: up.permission?.name,
    allowed: up.allowed,
  }));
};

export const getAllPermissionGroupsService = async () => {
  return Object.entries(PERMISSION_GROUPS).map(([group, permissions]) => ({
    group,
    permissions,
  }));
};

export const getAllPermissionsCodeAndNameService = async () => {
  const permissions = await prisma.permission.findMany({
    select: {
      code: true,
      name: true,
    },
  });
  return permissions;
};