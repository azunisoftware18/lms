import { prisma } from "../../db/prismaService.js";
import { hashPassword } from "../../common/utils/utils.js";
import { logAction } from "../../audit/audit.helper.js";
import logger from "../../common/logger.js";
import { AppError } from "../../common/utils/apiError.js";
import { getAccessibleBranchIds } from "../../common/utils/branchAccess.js";
import { buildBranchFilter } from "../../common/utils/branchFilter.js";
import { buildPaginationMeta, getPagination } from "../../common/utils/pagination.js";
import { buildBranchAdminSearch } from "../../common/utils/search.js";
import { Prisma } from "../../../generated/prisma-client/client.js";
import {
  CreateBranchAdminInput,
  UpdateBranchAdminInput,
} from "./branchAdmin.types.js";

type ScopedUser = {
  id: string;
  role: string;
  branchId?: string;
};

const ensureSingleActiveAdminPerBranch = async (
  db: Pick<typeof prisma, "user">,
  branchId: string,
  excludeUserId?: string,
) => {
  const existingAdmin = await db.user.findFirst({
    where: {
      role: "ADMIN",
      branchId,
      isActive: true,
      ...(excludeUserId
        ? {
            id: {
              not: excludeUserId,
            },
          }
        : {}),
    },
    select: {
      id: true,
      fullName: true,
      email: true,
    },
  });

  if (existingAdmin) {
    throw AppError.conflict(
      `This branch already has an active admin (${existingAdmin.fullName || existingAdmin.email}).`,
    );
  }
};

const mapPrismaError = (error: any): never => {
  if (error?.code === "P2002") {
    const fields = Array.isArray(error?.meta?.target) ? error.meta.target.join(", ") : "unique field";
    throw AppError.conflict(`Duplicate value for ${fields}`);
  }
  if (error?.code === "P2034") {
    throw AppError.conflict("Concurrent update conflict. Please retry.");
  }
  if (error?.code === "P2003") {
    throw AppError.badRequest("Invalid foreign key reference");
  }
  throw error;
};

export const createBranchAdminService = async (
  data: CreateBranchAdminInput,
  userId: string,
) => {
  try {
    const branch = await prisma.branch.findUnique({ where: { id: data.branchId } });
    if (!branch || !branch.isActive) {
      throw AppError.badRequest("Branch not found or inactive");
    }

    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) throw AppError.conflict("User with this email already exists");

    const existingUserName = await prisma.user.findUnique({ where: { userName: data.userName } });
    if (existingUserName) throw AppError.conflict("Username already exists");

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.$transaction(
      async (tx) => {
        await ensureSingleActiveAdminPerBranch(tx, data.branchId);

        return tx.user.create({
          data: {
            fullName: data.fullName,
            email: data.email,
            userName: data.userName,
            contactNumber: data.contactNumber,
            password: hashedPassword,
            role: "ADMIN",
            branchId: data.branchId,
            isActive: true,
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    await logAction({
      entityType: "BRANCH_ADMIN",
      entityId: user.id,
      action: "CREATE_BRANCH_ADMIN",
      performedBy: userId,
      branchId: data.branchId,
      oldValue: null,
      newValue: {
        fullName: user.fullName,
        email: user.email,
        userName: user.userName,
        contactNumber: user.contactNumber,
        branchId: user.branchId,
        role: user.role,
        isActive: user.isActive,
      },
      remarks: `Branch admin created for branch ${branch.name}`,
    });

    const { password: _pw, ...safeUser } = user;
    return safeUser;
  } catch (error: any) {
    logger.error("Error creating branch admin:", { message: error.message, stack: error.stack, code: error.code });
    if (error?.code) mapPrismaError(error);
    if (!error.statusCode) throw AppError.internal("Failed to create branch admin");
    throw error;
  }
};

export const updateBranchAdminService = async (
  id: string,
  data: UpdateBranchAdminInput,
  userId: string,
) => {
  let updatedBranchName: string | null = null;
  try {
    // Fetch existing user
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });
    if (!existingUser || existingUser.role !== "ADMIN") {
      throw AppError.notFound("Branch admin user not found");
    }

    // Validate branch if being updated
    if (data.branchId && data.branchId !== existingUser.branchId) {
      const branch = await prisma.branch.findUnique({
        where: { id: data.branchId },
      });
      if (!branch || !branch.isActive) {
        throw AppError.badRequest("Branch not found or inactive");
      }

      updatedBranchName = branch.name;
    }

    // Validate email uniqueness
    if (data.email && data.email !== existingUser.email) {
      const existingEmailUser = await prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existingEmailUser) {
        throw AppError.conflict("User with this email already exists");
      }
    }

    // Validate userName uniqueness
    if (data.userName && data.userName !== existingUser.userName) {
      const existingUserName = await prisma.user.findUnique({
        where: { userName: data.userName },
      });
      if (existingUserName) {
        throw AppError.conflict("Username already exists");
      }
    }

    // Hash password if provided
    const updateData: any = { ...data };
    if (data.password) {
      updateData.password = await hashPassword(data.password);
    } else {
      delete updateData.password;
    }

    // Update user
    const targetBranchId = data.branchId ?? existingUser.branchId;
    const nextIsActive = existingUser.isActive;

    const updatedUser = await prisma.$transaction(
      async (tx) => {
        if (nextIsActive) {
          await ensureSingleActiveAdminPerBranch(tx, targetBranchId, id);
        }

        return tx.user.update({
          where: { id },
          data: updateData,
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    // Log audit trail
    const auditBranchId = data.branchId ?? existingUser.branchId;
    await logAction({
      entityType: "BRANCH_ADMIN",
      entityId: updatedUser.id,
      action: "UPDATE_BRANCH_ADMIN",
      performedBy: userId,
      branchId: auditBranchId,
      oldValue: {
        fullName: existingUser.fullName,
        email: existingUser.email,
        userName: existingUser.userName,
        contactNumber: existingUser.contactNumber,
        branchId: existingUser.branchId,
        role: existingUser.role,
        isActive: existingUser.isActive,
      },
      newValue: {
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        userName: updatedUser.userName,
        contactNumber: updatedUser.contactNumber,
        branchId: updatedUser.branchId,
        role: updatedUser.role,
        isActive: updatedUser.isActive,
      },
      remarks: updatedBranchName
        ? `Branch admin updated and moved to ${updatedBranchName}`
        : "Branch admin updated",
    });

    // Return user without password
    const { password: _pw, ...safeUser } = updatedUser;
    return safeUser;
  } catch (err: any) {
    logger.error("Error updating branch admin:", {
      message: err.message,
      stack: err.stack,
      statusCode: err.statusCode,
    });
    if (err?.code) mapPrismaError(err);
    if (!err.statusCode) {
      throw AppError.internal("Failed to update branch admin");
    }
    throw err;
  }
};

export const getAllBranchAdminsService = async (
  params: {
    page?: number;
    limit?: number;
    q?: string;
    status?: "active" | "inactive";
  },
  user: ScopedUser,
) => {
  try {
    const { page, limit, skip } = getPagination(params.page, params.limit);
    const accessibleBranches = await getAccessibleBranchIds(user);
    const search = params.q?.trim() || "";

    const baseWhere: any = {
      role: "ADMIN",
      ...buildBranchFilter(accessibleBranches),
      ...buildBranchAdminSearch(search),
    };

    const where: any = {
      ...baseWhere,
    };

    if (params.status === "active") {
      where.isActive = true;
    }

    if (params.status === "inactive") {
      where.isActive = false;
    }

    const [data, total, activeCount, inactiveCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          fullName: true,
          email: true,
          userName: true,
          contactNumber: true,
          role: true,
          branchId: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          branch: {
            select: {
              id: true,
              name: true,
              code: true,
              type: true,
              isActive: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
      prisma.user.count({
        where: {
          ...baseWhere,
          isActive: true,
        },
      }),
      prisma.user.count({
        where: {
          ...baseWhere,
          isActive: false,
        },
      }),
    ]);

    return {
      data,
      pagination: buildPaginationMeta(total, page, limit),
      activeCount,
      inactiveCount,
    };
  } catch (error: any) {
    logger.error("Error fetching branch admins:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    if (error?.code) mapPrismaError(error);
    if (!error?.statusCode) {
      throw AppError.internal("Failed to fetch branch admins");
    }
    throw error;
  }
};

export const getBranchAdminByIdService = async (id: string, user: ScopedUser) => {
  const accessibleBranches = await getAccessibleBranchIds(user);

  const branchAdmin = await prisma.user.findFirst({
    where: {
      id,
      role: "ADMIN",
      ...buildBranchFilter(accessibleBranches),
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      userName: true,
      contactNumber: true,
      role: true,
      branchId: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      branch: {
        select: {
          id: true,
          name: true,
          code: true,
          type: true,
          isActive: true,
        },
      },
    },
  });

  if (!branchAdmin) {
    throw AppError.notFound("Branch admin not found");
  }

  return branchAdmin;
};
