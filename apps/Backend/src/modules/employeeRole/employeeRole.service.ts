import { prisma } from "../../db/prismaService.js";
import { AppError } from "../../common/utils/apiError.js";
import * as Enums from "../../../generated/prisma-client/enums.js";

type CreateEmployeeRoleInput = {
  roleTitle: string;
  roleName: string;
  description?: string;
  roleFor?: Enums.roleFor;
  documentsRequired: string;
  documentsOptions?: string;
  isActive?: boolean;
};

type UpdateEmployeeRoleInput = Partial<CreateEmployeeRoleInput>;

export const createEmployeeRoleService = async (
  data: CreateEmployeeRoleInput,
) => {
  const normalizedName = data.roleName.trim();

  if (!normalizedName) {
    throw AppError.badRequest("Role name is required");
  }

  const existingRole = await prisma.employeeRole.findFirst({
    where: { roleName: normalizedName },
  });

  if (existingRole) {
    throw AppError.conflict("Employee role already exists");
  }

  return prisma.employeeRole.create({
    data: {
      roleTitle: data.roleTitle.trim(),
      roleName: normalizedName,
      roleFor: data.roleFor ?? Enums.roleFor.Employee,
      description: data.description?.trim() || null,
      documentsRequired: data.documentsRequired.trim(),
      documentsOptions: data.documentsOptions?.trim() || null,
      isActive: data.isActive ?? true,
    },
  });
};

export const updateEmployeeRoleService = async (
  id: string,
  data: UpdateEmployeeRoleInput,
) => {
  const existingRole = await prisma.employeeRole.findUnique({
    where: { id },
  });

  if (!existingRole) {
    throw AppError.notFound("Employee role not found");
  }

  const normalizedName = data.roleName?.trim();
  if (normalizedName && normalizedName !== existingRole.roleName) {
    const duplicateRole = await prisma.employeeRole.findFirst({
      where: {
        roleName: normalizedName,
        id: { not: id },
      },
    });

    if (duplicateRole) {
      throw AppError.conflict("Employee role already exists");
    }
  }

  return prisma.employeeRole.update({
    where: { id },
    data: {
      roleTitle: data.roleTitle?.trim(),
      roleName: normalizedName,
      roleFor: data.roleFor,
      description:
        data.description !== undefined
          ? data.description?.trim() || null
          : undefined,
      documentsRequired:
        data.documentsRequired !== undefined
          ? data.documentsRequired.trim()
          : undefined,
      documentsOptions:
        data.documentsOptions !== undefined
          ? data.documentsOptions?.trim() || null
          : undefined,
      isActive: data.isActive,
    },
  });
};

export const deleteEmployeeRoleService = async (id: string) => {
  const roleWithEmployees = await prisma.employeeRole.findUnique({
    where: { id },
    include: {
      _count: {
        select: { employees: true },
      },
    },
  });

  if (!roleWithEmployees) {
    throw AppError.notFound("Employee role not found");
  }

  if (roleWithEmployees._count.employees > 0) {
    throw AppError.conflict(
      "Cannot delete employee role that is assigned to employees",
    );
  }

  return prisma.employeeRole.delete({
    where: { id },
  });
};

export const getEmployeeRolesService = async (includeInactive = false) => {
  return prisma.employeeRole.findMany({
    where: includeInactive ? undefined : { isActive: true },
    orderBy: { roleName: "asc" },
  });
};
