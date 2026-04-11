import { prisma } from "../../db/prismaService.js";
import { AppError } from "../../common/utils/apiError.js";

type CreateEmployeeRoleInput = {
  roleTitle: string;
  roleName: string;
  description?: string;
  isActive?: boolean;
};

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
      description: data.description?.trim() || null,
      isActive: data.isActive ?? true,
    },
  });
};

export const getEmployeeRolesService = async (includeInactive = false) => {
  return prisma.employeeRole.findMany({
    where: includeInactive ? undefined : { isActive: true },
    orderBy: { roleName: "asc" },
  });
};
