import { prisma } from "../../db/prismaService.js";
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
import { hashPassword } from "../../common/utils/utils.js";
//Todo: add permission checks where necessary

type EmployeeRoleDocumentConfig = {
  required: string[];
  optional: string[];
};

const normalizeDocumentToken = (value: string) =>
  String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const parseRoleDocumentConfig = (employeeRole: {
  documentsRequired?: string | null;
  documentsOptions?: string | null;
}): EmployeeRoleDocumentConfig => {
  const parseCsv = (value?: string | null) =>
    String(value || "")
      .split(",")
      .map((entry) => normalizeDocumentToken(entry))
      .filter(Boolean);

  const required = parseCsv(employeeRole.documentsRequired);
  const optional = parseCsv(employeeRole.documentsOptions);

  return {
    required: Array.from(new Set(required)),
    optional: Array.from(new Set(optional)),
  };
};

const stripDocumentSide = (documentType: string) =>
  normalizeDocumentToken(documentType).replace(/_(FRONT|BACK|FILE)$/, "");

const mapUploadedEmployeeDocuments = (
  uploadedFiles: Express.Multer.File[],
  allowedBaseTypes: Set<string>,
) => {
  const mapped = uploadedFiles.map((file) => ({
    documentType: normalizeDocumentToken(file.fieldname),
    documentPath: `/uploads/${file.filename}`,
  }));

  const invalidTypes = mapped
    .map((doc) => doc.documentType)
    .filter((documentType) => !allowedBaseTypes.has(stripDocumentSide(documentType)));

  if (invalidTypes.length > 0) {
    throw AppError.badRequest(
      `Invalid employee document types: ${Array.from(new Set(invalidTypes)).join(", ")}`,
    );
  }

  return mapped;
};

const assertRequiredEmployeeDocuments = (
  requiredBaseTypes: string[],
  uploadedDocumentTypes: string[],
  existingDocumentTypes: string[] = [],
) => {
  if (!requiredBaseTypes.length) return;

  const uploadedBaseTypes = uploadedDocumentTypes.map(stripDocumentSide);
  const existingBaseTypes = existingDocumentTypes.map(stripDocumentSide);
  const available = new Set([...uploadedBaseTypes, ...existingBaseTypes]);

  const missing = requiredBaseTypes.filter((requiredDoc) => !available.has(requiredDoc));
  if (missing.length > 0) {
    throw AppError.badRequest(
      `Missing required employee documents: ${missing.join(", ")}`,
    );
  }
};

export async function createEmployeeService(
  data: CreateEmployee,
  requestedByRole?: string,
  requestedByUserId?: string,
  uploadedFiles: Express.Multer.File[] = [],
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

  const roleDocumentConfig = parseRoleDocumentConfig(employeeRole);
  const allowedDocumentTypes = new Set([
    ...roleDocumentConfig.required,
    ...roleDocumentConfig.optional,
  ]);

  const normalizedUploadedDocuments = uploadedFiles.length
    ? mapUploadedEmployeeDocuments(uploadedFiles, allowedDocumentTypes)
    : [];

  assertRequiredEmployeeDocuments(
    roleDocumentConfig.required,
    normalizedUploadedDocuments.map((doc) => doc.documentType),
  );

  try {
    const employeeId = await generateUniqueEmployeeId();
    const hashedPassword = await hashPassword(data.password);

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

    const emergencyContact = String(
      (data as any).emergencyContact ?? data.contactNumber ?? "",
    ).trim();

    const relationshipInput = String(
      (data as any).emergencyRelationship ??
        (data as any).emergencyRelation ??
        "FATHER",
    )
      .trim()
      .toUpperCase();

    const allowedRelationships = new Set([
      "FATHER",
      "MOTHER",
      "SPOUSE",
      "SIBLING",
      "FRIEND",
      "OTHER",
    ]);

    const emergencyRelationship = allowedRelationships.has(relationshipInput)
      ? relationshipInput
      : "OTHER";

    const department = String(
      (data as any).department ?? data.roleTitle ?? data.designation ?? "GENERAL",
    ).trim();

    const basicSalary = Number(data.basicSalary ?? data.salary ?? 0);
    const conveyance = data.conveyance != null ? Number(data.conveyance) : null;
    const medicalAllowance =
      data.medicalAllowance != null ? Number(data.medicalAllowance) : null;
    const otherAllowances =
      data.otherAllowances != null ? Number(data.otherAllowances) : null;
    const pfDeduction = data.pfDeduction != null ? Number(data.pfDeduction) : null;
    const taxDeduction = data.taxDeduction != null ? Number(data.taxDeduction) : null;

    const { employee, documents, user } = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          fullName: data.fullName,
          userName: data.userName,
          email: data.email,
          password: hashedPassword,
          role: requestedRole as any,
          contactNumber: data.contactNumber || "",
          branch: { connect: { id: branch.id } },
          isActive:
            typeof data.isActive === "boolean"
              ? data.isActive
              : (data.status ?? "Active") === "Active",
        },
      });

      const currentAddress = data.addresses?.currentAddress;
      const permanentAddress = data.addresses?.permanentAddress;
      const selectedAddress = currentAddress ?? permanentAddress;

      const legacyAddress = (data as any).address ?? null;
      const employeeAddress = selectedAddress || legacyAddress
        ? await tx.address.create({
            data: {
              addressType: currentAddress
                ? "CURRENT_RESIDENTIAL"
                : permanentAddress
                  ? "PERMANENT"
                  : "CURRENT_RESIDENTIAL",
              addressLine1: selectedAddress?.addressLine1 ?? legacyAddress ?? "",
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

      

      const createdEmployee = await (tx as any).employee.create({
        data: {
          employeeId,
          user: { connect: { id: createdUser.id } },
          branch: { connect: { id: data.branchId } },
          employeeRole: { connect: { id: data.employeeRoleId } },
          fullName: data.fullName,
          Email: data.email,
          contactNumber: data.contactNumber || "",
          reportingManagerId: data.reportingManager || null,
          atlMobileNumber: data.atlMobileNumber ?? "",
          dob: dobVal ?? new Date(),
          gender: (data.gender ?? "OTHER") as any,
          maritalStatus: (data.maritalStatus ?? "SINGLE") as any,
          designation: data.designation ?? "",
          emergencyContact,
          emergencyRelationship: emergencyRelationship as any,
          department,
          experience: data.experience ?? "",
          workLocation: (data.workLocation ?? "OFFICE") as any,
          accountHolder: data.accountHolder ?? null,
          bankName: data.bankName ?? null,
          bankAccountNo: data.bankAccountNo ?? null,
          ifsc: data.ifsc ?? null,
          upiId: data.upiId ?? null,
          basicSalary,
          conveyance,
          medicalAllowance,
          otherAllowances,
          pfDeduction,
          taxDeduction,

          dateOfJoining: dojVal ?? new Date(),
          ...(employeeAddress?.id
            ? { address: { connect: { id: employeeAddress.id } } }
            : {}),
        },
        include: {
          employeeRole: true,
          user: true,
        },
      });

      const createdDocuments = normalizedUploadedDocuments.length
        ? await Promise.all(
            normalizedUploadedDocuments.map((doc) =>
              (tx as any).document.create({
                data: {
                  employeeId: createdEmployee.id,
                  branchId: data.branchId,
                  uploadedBy: requestedByUserId || "SYSTEM",
                  documentType: doc.documentType,
                  documentPath: doc.documentPath,
                },
              }),
            ),
          )
        : [];

      return { employee: createdEmployee, documents: createdDocuments, user: createdUser };
    });

    // hide password before returning
    const { password: _pw, ...safeUser } = user as any;
    return { user: safeUser, employee, documents };
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

  const documents = await (prisma as any).document.findMany({
    where: { employeeId: id },
    orderBy: { createdAt: "asc" },
  });

  return {
    ...employee,
    user: safeUser,
    kycs,
    documents,
  };
}

export async function updateEmployeeService(
  id: string,
  updateData: Partial<CreateEmployee> & Record<string, any>,
  userId?: string,
  branchId?: string,
  requestedByRole?: string,
  uploadedFiles: Express.Multer.File[] = [],
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
    const legacyAddressInput = (updateData as any).address ?? null;
    const hasLegacyAddressInput = Boolean(
      legacyAddressInput || updateData.city || updateData.state || updateData.pinCode,
    );

    let normalizedAddressPayload:
      | {
          addressType: any;
          addressLine1: string;
          addressLine2: string | null;
          city: string;
          district: string;
          state: string;
          pinCode: string;
          landmark: string | null;
          phoneNumber: string | null;
        }
      | null = null;

    if (selectedAddress || hasLegacyAddressInput) {
      const addressPayload = {
        addressType: currentAddress
          ? "CURRENT_RESIDENTIAL"
          : permanentAddress
            ? "PERMANENT"
            : "CURRENT_RESIDENTIAL",
        addressLine1: selectedAddress?.addressLine1 ?? legacyAddressInput ?? "",
        addressLine2: selectedAddress?.addressLine2 ?? null,
        city: selectedAddress?.city ?? updateData.city ?? "",
        district:
          selectedAddress?.district ?? selectedAddress?.city ?? updateData.city ?? "",
        state: selectedAddress?.state ?? updateData.state ?? "",
        pinCode: selectedAddress?.pinCode ?? updateData.pinCode ?? "",
        landmark: selectedAddress?.landmark ?? null,
        phoneNumber: selectedAddress?.phoneNumber ?? null,
      };

      normalizedAddressPayload = {
        ...addressPayload,
        addressType: addressPayload.addressType as any,
      };
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
      "accountHolder",
      "bankName",
      "bankAccountNo",
      "ifsc",
      "upiId",
      "basicSalary",
      "conveyance",
      "medicalAllowance",
      "otherAllowances",
      "pfDeduction",
      "taxDeduction",
    ];
    for (const key of empFields) {
      if (Object.prototype.hasOwnProperty.call(updateData, key)) {
        let val = (updateData as any)[key];
        if (key === "joiningDate" && typeof val === "string") {
          val = new Date(val);
        }
        if (
          ["basicSalary", "conveyance", "medicalAllowance", "otherAllowances", "pfDeduction", "taxDeduction"].includes(key) &&
          val !== null &&
          val !== undefined &&
          val !== ""
        ) {
          val = Number(val);
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

    const employeeRoleForDocuments = employeeUpdateData.employeeRoleId
      ? await (prisma as any).employeeRole.findUnique({
          where: { id: employeeUpdateData.employeeRoleId },
        })
      : existing.employeeRole;

    const roleDocumentConfig = parseRoleDocumentConfig(employeeRoleForDocuments || {});
    const allowedDocumentTypes = new Set([
      ...roleDocumentConfig.required,
      ...roleDocumentConfig.optional,
    ]);

    const normalizedUploadedDocuments = uploadedFiles.length
      ? mapUploadedEmployeeDocuments(uploadedFiles, allowedDocumentTypes)
      : [];

    const existingEmployeeDocuments = await (prisma as any).document.findMany({
      where: { employeeId: id },
      select: { documentType: true },
    });

    assertRequiredEmployeeDocuments(
      roleDocumentConfig.required,
      normalizedUploadedDocuments.map((doc) => doc.documentType),
      existingEmployeeDocuments.map((doc: { documentType: string }) => doc.documentType),
    );

    const prismaData: any = {};
    if (Object.keys(userUpdateData).length > 0)
      prismaData.user = { update: userUpdateData } as any;
    if (Object.keys(employeeUpdateData).length > 0)
      Object.assign(prismaData, employeeUpdateData);

    const { updatedEmployee, documents } = await prisma.$transaction(async (tx) => {
      if (normalizedAddressPayload) {
        if (existing.addressId) {
          await tx.address.update({
            where: { id: existing.addressId },
            data: normalizedAddressPayload,
          });
        } else {
          const newAddress = await tx.address.create({
            data: normalizedAddressPayload,
          });
          employeeUpdateData.addressId = newAddress.id;
        }
      }

      if (Object.keys(employeeUpdateData).length > 0)
        Object.assign(prismaData, employeeUpdateData);

      const employeeRecord = await (tx as any).employee.update({
        where: { id },
        data: prismaData,
        include: { user: true, employeeRole: true },
      });

      if (normalizedUploadedDocuments.length > 0) {
        const reuploadedTypes = Array.from(
          new Set(normalizedUploadedDocuments.map((doc) => doc.documentType)),
        );

        await (tx as any).document.deleteMany({
          where: {
            employeeId: id,
            documentType: { in: reuploadedTypes },
          },
        });

        await (tx as any).document.createMany({
          data: normalizedUploadedDocuments.map((doc) => ({
            employeeId: id,
            branchId: employeeRecord.branchId,
            uploadedBy: userId || "SYSTEM",
            documentType: doc.documentType,
            documentPath: doc.documentPath,
          })),
        });
      }

      const updatedDocuments = await (tx as any).document.findMany({
        where: { employeeId: id },
        orderBy: { createdAt: "asc" },
      });

      return { updatedEmployee: employeeRecord, documents: updatedDocuments };
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
      return { employee: employeeOnly, user: safeUser, documents };
    }
    return { employee: employeeOnly, user: null, documents };
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
