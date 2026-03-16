import { prisma } from "../../db/prismaService.js";
import { hashPassword } from "../../common/utils/utils.js";
import { CreateEmployee } from "./employee.types.js";
import {
  getPagination,
  buildPaginationMeta,
} from "../../common/utils/pagination.js";
import { buildEmployeeSearch } from "../../common/utils/search.js";
import { generateUniqueEmployeeId } from "../../common/generateId/generateEmployeeId.js";

import { logAction } from "../../audit/audit.helper.js";
import { getAccessibleBranchIds } from "../../common/utils/branchAccess.js";
import { buildBranchFilter } from "../../common/utils/branchFilter.js";
import { AppError } from "../../common/utils/apiError.js";
import { Role } from "../../../generated/prisma-client/enums.js";
import type { Role as UserRole } from "../../../generated/prisma-client/enums.js";
//Todo: add permission checks where necessary

export async function createEmployeeService(
  data: CreateEmployee,
  requestedByRole?: string,
) {
  const requestedRole = (data.role ?? Role.EMPLOYEE) as UserRole;
  if (requestedRole !== Role.EMPLOYEE && requestedByRole !== Role.SUPER_ADMIN) {
    throw AppError.forbidden(
      "Only SUPER_ADMIN can create employees with elevated roles",
    );
  }

  // check if a user with the email already exists
  const [existingEmailUser, existingUserNameUser] = await Promise.all([
    prisma.user.findUnique({ where: { email: data.email } }),
    prisma.user.findUnique({ where: { userName: data.userName } }),
  ]);

  if (existingEmailUser) {
     throw AppError.conflict("Employee with this email already exists");
  }

  if (existingUserNameUser) {
     throw AppError.conflict("Employee with this username already exists");
  }

  const hashedPassword = await hashPassword(data.password);

  // Add validation for branchId
  if (!data.branchId) {
    throw AppError.badRequest("Branch assignment is required for employee");
  }

  // Verify branch exists
  const branch = await prisma.branch.findUnique({
    where: { id: data.branchId },
  });

  if (!branch || !branch.isActive) {
    throw AppError.badRequest("Invalid or inactive branch");
  }

  const employeeRole = await (prisma as any).employeeRole.findUnique({
    where: { id: data.employeeRoleId },
  });

  if (!employeeRole || !employeeRole.isActive) {
    throw AppError.badRequest("Invalid or inactive employee role");
  }

  try {
    const employeeId = await generateUniqueEmployeeId();

    const dobVal = data.dob
      ? typeof data.dob === "string"
        ? new Date(data.dob)
        : data.dob
      : null;
    const dojVal = data.dateOfJoining
      ? typeof data.dateOfJoining === "string"
        ? new Date(data.dateOfJoining)
        : data.dateOfJoining
      : null;

    const { user, employee } = await prisma.$transaction(async (tx) => {
      const currentAddress = data.addresses?.currentAddress;
      const permanentAddress = data.addresses?.permanentAddress;
      const selectedAddress = currentAddress ?? permanentAddress;

      const employeeAddress = selectedAddress || data.address
        ? await tx.address.create({
            data: {
              addressType: currentAddress
                ? "CURRENT_RESIDENTIAL"
                : permanentAddress
                  ? "PERMANENT"
                  : "CURRENT_RESIDENTIAL",
              addressLine1: selectedAddress?.addressLine1 ?? data.address ?? "",
              addressLine2: selectedAddress?.addressLine2 ?? null,
              city: selectedAddress?.city ?? data.city ?? "",
              district:
                selectedAddress?.district ??
                selectedAddress?.city ??
                data.city ??
                "",
              state: selectedAddress?.state ?? data.state ?? "",
              pinCode: selectedAddress?.pinCode ?? data.pinCode ?? "",
              landmark: selectedAddress?.landmark ?? null,
              phoneNumber: selectedAddress?.phoneNumber ?? null,
            },
          })
        : null;

      const createdUser = await tx.user.create({
        data: {
          fullName: data.fullName,
          email: data.email,
          userName: data.userName,
          password: hashedPassword,
          role: requestedRole,
          contactNumber: data.contactNumber,
          branchId: data.branchId,
          isActive: typeof data.isActive === "boolean" ? data.isActive : true,
        },
      });

      const createdEmployee = await (tx as any).employee.create({
        data: {
          userId: createdUser.id,
          employeeId,
          employeeRoleId: data.employeeRoleId,
          atlMobileNumber: data.atlMobileNumber ?? "",
          dob: dobVal ?? new Date(),
          gender: (data.gender ?? "OTHER") as any,
          maritalStatus: (data.maritalStatus ?? "SINGLE") as any,
          designation: data.designation ?? "",
          emergencyContact: data.emergencyContact ?? "",
          emergencyRelationship: (data.emergencyRelationship ?? "OTHER") as any,
          experience: data.experience ?? "",
          workLocation: (data.workLocation ?? "OFFICE") as any,
          department: data.department ?? "",
          dateOfJoining: dojVal ?? new Date(),
          salary: typeof data.salary === "number" ? data.salary : 0,
          addressId: employeeAddress?.id,
          branchId: data.branchId,
        },
        include: {
          employeeRole: true,
        },
      });

      return { user: createdUser, employee: createdEmployee };
    });

    // hide password before returning
    const { password: _pw, ...safeUser } = user as any;
    return { user: safeUser, employee };
  } catch (error: unknown) {
    const eAny = error as any;
    if (eAny && eAny.code === "P2002") {
      throw AppError.conflict("Employee already exists");
    }
    throw error;
  }
}

export async function getAllEmployeesService(params: {
  page?: number;
  limit?: number;
  q?: string;
}, user: {
  id: string;
  role: string;
  branchId?: string;
}) {
  const { page, limit, skip } = getPagination(params.page, params.limit);

   const accessibleBranches = await getAccessibleBranchIds({
     id: user.id,
     role: user.role,
     branchId: user.branchId,
   });

  const where = {
    ...buildEmployeeSearch(params.q),
    ...buildBranchFilter(accessibleBranches),
   };

  const [data, total] = await Promise.all([
    (prisma as any).employee.findMany({
      where,
      include: {
        employeeRole: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.employee.count({ where }),
  ]);

  return {
    data,
    meta: buildPaginationMeta(total, page, limit),
  };
}

export async function getEmployeeByIdService(id: string) {
  const employee = await (prisma as any).employee.findUnique({
    where: { id },
    include: {
      user: true,
      branch: true,
      employeeRole: true,
    },
  });

  if (!employee) {
    throw AppError.notFound("Employee not found");
  }

  if (!employee.user) {
    throw AppError.notFound("Associated user not found");
  }

  const { password, ...safeUser } = employee.user as any;

  // Fetch KYC records separately — `kyc` is not a direct relation on `User` in schema
  const kycs = await prisma.kyc.findMany({
    where: { userId: employee.userId },
  });

  return {
    ...employee,
    user: safeUser,
    kycs,
  };
}

export async function updateEmployeeService(
  id: string,
  updateData: Partial<CreateEmployee> & Record<string, any>,
  userId?: string,
  branchId?: string,
  requestedByRole?: string,
) {
  try {
    const existing = await (prisma as any).employee.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, userName: true } },
        employeeRole: true,
      },
    });
    if (!existing) {
      throw AppError.notFound("Employee not found");
    }

    const userUpdateData: Record<string, any> = {};
    const employeeUpdateData: Record<string, any> = {};

    const currentAddress = updateData.addresses?.currentAddress;
    const permanentAddress = updateData.addresses?.permanentAddress;
    const selectedAddress = currentAddress ?? permanentAddress;
    const hasLegacyAddressInput = !!(
      updateData.address ||
      updateData.city ||
      updateData.state ||
      updateData.pinCode
    );

    if (selectedAddress || hasLegacyAddressInput) {
      const addressPayload = {
        addressType: currentAddress
          ? "CURRENT_RESIDENTIAL"
          : permanentAddress
            ? "PERMANENT"
            : "CURRENT_RESIDENTIAL",
        addressLine1: selectedAddress?.addressLine1 ?? updateData.address ?? "",
        addressLine2: selectedAddress?.addressLine2 ?? null,
        city: selectedAddress?.city ?? updateData.city ?? "",
        district:
          selectedAddress?.district ?? selectedAddress?.city ?? updateData.city ?? "",
        state: selectedAddress?.state ?? updateData.state ?? "",
        pinCode: selectedAddress?.pinCode ?? updateData.pinCode ?? "",
        landmark: selectedAddress?.landmark ?? null,
        phoneNumber: selectedAddress?.phoneNumber ?? null,
      };

      const normalizedAddressPayload = {
        ...addressPayload,
        addressType: addressPayload.addressType as any,
      };

      if (existing.addressId) {
        await prisma.address.update({
          where: { id: existing.addressId },
          data: normalizedAddressPayload,
        });
      } else {
        const newAddress = await prisma.address.create({
          data: normalizedAddressPayload,
        });
        employeeUpdateData.addressId = newAddress.id;
      }
    }

    // user-scoped fields
    const userFields = [
      "fullName",
      "email",
      "userName",
      "password",
      "role",
      "contactNumber",
    ];
    // accept user updates either at top-level or inside `user` object
    for (const key of userFields) {
      if (Object.prototype.hasOwnProperty.call(updateData, key)) {
        (userUpdateData as any)[key] = (updateData as any)[key];
      }
    }
    if (
      updateData &&
      typeof updateData.user === "object" &&
      updateData.user !== null
    ) {
      for (const [k, v] of Object.entries(updateData.user)) {
        if (userFields.includes(k) || k === "role" || k === "userName") {
          (userUpdateData as any)[k] = v;
        }
      }
    }

    if (
      userUpdateData.role &&
      userUpdateData.role !== Role.EMPLOYEE &&
      requestedByRole !== Role.SUPER_ADMIN
    ) {
      throw AppError.forbidden(
        "Only SUPER_ADMIN can assign elevated employee roles",
      );
    }

    if (userUpdateData.password) {
      userUpdateData.password = await hashPassword(userUpdateData.password);
    }

    if (userUpdateData.email && userUpdateData.email !== existing.user?.email) {
      const emailInUse = await prisma.user.findFirst({
        where: {
          email: userUpdateData.email,
          NOT: { id: existing.userId },
        },
        select: { id: true },
      });
      if (emailInUse) {
        throw AppError.conflict("Employee already exists");
      }
    }

    if (
      userUpdateData.userName &&
      userUpdateData.userName !== existing.user?.userName
    ) {
      const usernameInUse = await prisma.user.findFirst({
        where: {
          userName: userUpdateData.userName,
          NOT: { id: existing.userId },
        },
        select: { id: true },
      });
      if (usernameInUse) {
        throw AppError.conflict("Employee already exists");
      }
    }

    // employee-scoped fields
    const empFields = [
      "employeeId",
      "employeeRoleId",
      "designation",
      "branchId",
      "department",
      "joiningDate",
    ];
    for (const key of empFields) {
      if (Object.prototype.hasOwnProperty.call(updateData, key)) {
        let val = (updateData as any)[key];
        if (key === "joiningDate" && typeof val === "string") {
          val = new Date(val);
        }
        (employeeUpdateData as any)[key] = val;
      }
    }

    if (employeeUpdateData.employeeRoleId) {
      const nextEmployeeRole = await (prisma as any).employeeRole.findUnique({
        where: { id: employeeUpdateData.employeeRoleId },
      });

      if (!nextEmployeeRole || !nextEmployeeRole.isActive) {
        throw AppError.badRequest("Invalid or inactive employee role");
      }
    }

    const prismaData: any = {};
    if (Object.keys(userUpdateData).length > 0)
      prismaData.user = { update: userUpdateData } as any;
    if (Object.keys(employeeUpdateData).length > 0)
      Object.assign(prismaData, employeeUpdateData);

    const updatedEmployee = await (prisma as any).employee.update({
      where: { id },
      data: prismaData,
      include: { user: true, employeeRole: true },
    });
    const { user, ...employeeOnly } = updatedEmployee as any;

    // Log the update action if userId and branchId are provided
    const auditBranchId = branchId || existing.branchId;
    if (userId && auditBranchId) {
      await logAction({
        action: "UPDATE_EMPLOYEE",
        entityType: "EMPLOYEE",
        entityId: id,
        performedBy: userId,
        branchId: auditBranchId,
        oldValue: {
          designation: existing.designation,
          department: existing.department,
          branchId: existing.branchId,
        },
        newValue: {
          designation: employeeOnly.designation,
          department: employeeOnly.department,
          branchId: employeeOnly.branchId,
        },
        remarks: "Employee details updated",
      });
    }

    if (user) {
      const { password: _pw, ...safeUser } = user as any;
      return { employee: employeeOnly, user: safeUser };
    }
    return { employee: employeeOnly, user: null };
  } catch (error: unknown) {
    const eAny = error as any;
    if (eAny && eAny.code === "P2002") {
      throw AppError.conflict("Employee already exists");
    }
    throw error;
  }
}

//Todo: delete employee service

export const getEmployeeDashBoardService = async (employeeId: string) => {
  const assignmentFilter = {
    loanAssignments: {
      some: {
        employeeId,
        isActive: true,
      },
    },
  };

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const assignedLoans = await prisma.loanApplication.count({ where: assignmentFilter });

  if (assignedLoans === 0) {
    return {
      assignedLoans: 0,
      pendingKyc: 0,
      underReview: 0,
      legalTechnicalPending: 0,
      todaysTasks: [],
    };
  }

  const [groupedStatuses, legalPending, technicalPending, todaysTasks] =
    await Promise.all([
      prisma.loanApplication.groupBy({
        by: ["status"],
        where: {
          ...assignmentFilter,
          status: { in: ["kyc_pending", "under_review"] },
        },
        _count: { _all: true },
      }),
      prisma.legalReport.count({
        where: {
          loanApplication: assignmentFilter,
        },
      }),
      prisma.technicalReport.count({
        where: {
          loanApplication: assignmentFilter,
        },
      }),
      prisma.loanApplication.findMany({
        where: {
          ...assignmentFilter,
          OR: [{ status: "kyc_pending" }, { status: "under_review" }],
          updatedAt: {
            gte: todayStart,
          },
        },
        select: {
          id: true,
          loanNumber: true,
          status: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: "desc" },
      }),
    ]);

  const pendingKyc = groupedStatuses.find((g) => g.status === "kyc_pending")?._count._all ?? 0;
  const underReview = groupedStatuses.find((g) => g.status === "under_review")?._count._all ?? 0;

  return {
    assignedLoans,
    pendingKyc,
    underReview,
    legalTechnicalPending: legalPending + technicalPending,
    todaysTasks,
  };
};
