import { prisma } from "../../db/prismaService.js";
import { AppError } from "../../common/utils/apiError.js";

type CreateEmployeeRoleInput = {
  name: string;
  description?: string;
  isActive?: boolean;
};

export const createEmployeeRoleService = async (
  data: CreateEmployeeRoleInput,
) => {
  const normalizedName = data.name.trim();

  if (!normalizedName) {
    throw AppError.badRequest("name is required");
  }

  const existingRole = await prisma.employeeRole.findFirst({
    where: { name: normalizedName },
  });

  if (existingRole) {
    throw AppError.conflict("Employee role already exists");
  }

  return prisma.employeeRole.create({
    data: {
      name: normalizedName,
      description: data.description?.trim() || null,
      isActive: data.isActive ?? true,
    },
  });
};

export const getEmployeeRolesService = async (includeInactive = false) => {
  return prisma.employeeRole.findMany({
    where: includeInactive ? undefined : { isActive: true },
    orderBy: { name: "asc" },
  });
};
