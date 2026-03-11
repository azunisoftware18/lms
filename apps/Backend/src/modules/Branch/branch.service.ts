import { prisma } from "../../db/prismaService.js";
import { getBranchScopeFilter } from "../../common/utils/branchScope.helper.js";
import {
  CreateBranchInput,
  UpdateBranchInput,
  CreateBulkBranchesInput,
  ReassignBulkBranchesInput,
} from "./branch.types.js";
import { logAction } from "../../audit/audit.helper.js";
import { AppError } from "../../common/utils/apiError.js";

type BranchTypeValue = "HEAD_OFFICE" | "ZONAL" | "REGIONAL" | "BRANCH";

const BRANCH_TYPE_LABEL: Record<BranchTypeValue, string> = {
  HEAD_OFFICE: "Head Office / Central Office",
  ZONAL: "Circle / Zonal Office",
  REGIONAL: "Regional Office",
  BRANCH: "Main Branch",
};

const getExpectedParentType = (
  type: BranchTypeValue,
): BranchTypeValue | null => {
  if (type === "HEAD_OFFICE") return null;
  if (type === "ZONAL") return "HEAD_OFFICE";
  if (type === "REGIONAL") return "ZONAL";
  return "REGIONAL";
};

export const createBranchService = async (
  data: CreateBranchInput,
  userId: string,
) => {
  if (data.type === "HEAD_OFFICE") {
    if (data.parentBranchId) {
      throw AppError.badRequest(
        `${BRANCH_TYPE_LABEL.HEAD_OFFICE} cannot have a parent branch`,
      );
    }

    const existingHeadOffice = await prisma.branch.findFirst({
      where: { type: "HEAD_OFFICE" },
    });

    if (existingHeadOffice) {
      throw AppError.conflict("Cannot create another Head Office branch");
    }
  } else {
    const branchType = data.type as BranchTypeValue;

    if (!data.parentBranchId) {
      throw AppError.badRequest(
        `${BRANCH_TYPE_LABEL[branchType]} must have a parent branch`,
      );
    }

    const parentBranch = await prisma.branch.findUnique({
      where: { id: data.parentBranchId },
      select: { id: true, type: true },
    });

    if (!parentBranch) {
      throw AppError.notFound("Parent branch not found");
    }

    const expectedParentType = getExpectedParentType(data.type as BranchTypeValue);
    if (expectedParentType && parentBranch.type !== expectedParentType) {
      throw AppError.badRequest(
        `${BRANCH_TYPE_LABEL[data.type as BranchTypeValue]} must be under ${BRANCH_TYPE_LABEL[expectedParentType]}`,
      );
    }
  }

  // If code already exists, treat create as idempotent update for same type.
  const existingBranch = await prisma.branch.findUnique({
    where: { code: data.code },
  });

  let branch;
  if (existingBranch) {
    if (existingBranch.type !== data.type) {
      throw AppError.conflict(
        `A branch with code '${data.code}' already exists with type '${existingBranch.type}'`,
      );
    }

    branch = await prisma.branch.update({
      where: { id: existingBranch.id },
      data: {
        name: data.name,
        parentBranchId: data.parentBranchId || null,
        isActive: true,
      },
    });
  } else {
    branch = await prisma.branch.create({
      data: {
        name: data.name,
        code: data.code,
        type: data.type,
        parentBranchId: data.parentBranchId || null,
      },
    });
  }

  await logAction({
    entityType: "BRANCH",
    entityId: branch.id,
    action: existingBranch ? "UPDATE_BRANCH" : "CREATE_BRANCH",
    performedBy: userId, // In real implementation, this should be the user performing the action
    branchId: branch.id,
    oldValue: null,
    newValue: {
      name: branch.name,
      code: branch.code,
      type: branch.type,
      parentBranchId: branch.parentBranchId,
    },
  });

  return branch;
};

export const updateBranchService = async (
  id: string,
  data: UpdateBranchInput,
  userId: string,
) => {
  // Get the old branch data before updating
  const oldBranch = await prisma.branch.findUnique({
    where: { id },
  });

  if (!oldBranch) {
    throw AppError.notFound("Branch not found");
  }

  const hasParentBranchIdInPayload = Object.prototype.hasOwnProperty.call(
    data,
    "parentBranchId",
  );
  const nextType = (data.type ?? oldBranch.type) as BranchTypeValue;
  const nextParentBranchId = hasParentBranchIdInPayload
    ? (data.parentBranchId ?? null)
    : oldBranch.parentBranchId;

  if (nextType === "HEAD_OFFICE") {
    if (nextParentBranchId) {
      throw AppError.badRequest(
        `${BRANCH_TYPE_LABEL.HEAD_OFFICE} cannot have a parent branch`,
      );
    }

    const anotherHeadOffice = await prisma.branch.findFirst({
      where: { type: "HEAD_OFFICE", NOT: { id } },
      select: { id: true },
    });

    if (anotherHeadOffice) {
      throw AppError.conflict("Cannot create another Head Office branch");
    }
  } else {
    if (!nextParentBranchId) {
      throw AppError.badRequest(
        `${BRANCH_TYPE_LABEL[nextType]} must have a parent branch`,
      );
    }

    if (nextParentBranchId === id) {
      throw AppError.badRequest("Branch cannot be parent of itself");
    }

    const parentBranch = await prisma.branch.findUnique({
      where: { id: nextParentBranchId },
      select: { id: true, type: true },
    });

    if (!parentBranch) {
      throw AppError.notFound("Parent branch not found");
    }

    const expectedParentType = getExpectedParentType(nextType);
    if (expectedParentType && parentBranch.type !== expectedParentType) {
      throw AppError.badRequest(
        `${BRANCH_TYPE_LABEL[nextType]} must be under ${BRANCH_TYPE_LABEL[expectedParentType]}`,
      );
    }
  }

  if (data.type && data.type !== oldBranch.type) {
    const childBranches = await prisma.branch.findMany({
      where: { parentBranchId: id },
      select: { type: true },
    });

    if (nextType === "BRANCH" && childBranches.length > 0) {
      throw AppError.badRequest(`${BRANCH_TYPE_LABEL.BRANCH} cannot have child branches`);
    }

    if (nextType !== "BRANCH") {
      const expectedChildType: BranchTypeValue =
        nextType === "HEAD_OFFICE"
          ? "ZONAL"
          : nextType === "ZONAL"
            ? "REGIONAL"
            : "BRANCH";

      const hasInvalidChild = childBranches.some(
        (child) => child.type !== expectedChildType,
      );

      if (hasInvalidChild) {
        throw AppError.badRequest(
          `${BRANCH_TYPE_LABEL[nextType]} can only have ${BRANCH_TYPE_LABEL[expectedChildType]} as child branches`,
        );
      }
    }
  }

  const branch = await prisma.branch.update({
    where: { id },
    data: {
      ...data,
      parentBranchId: nextParentBranchId,
    },
  });

  await logAction({
    entityType: "BRANCH",
    entityId: branch.id,
    action: "UPDATE_BRANCH",
    performedBy: userId,
    branchId: branch.id,
    oldValue: {
      name: oldBranch.name,
      code: oldBranch.code,
      type: oldBranch.type,
      parentBranchId: oldBranch.parentBranchId,
    },
    newValue: {
      name: branch.name,
      code: branch.code,
      type: branch.type,
      parentBranchId: branch.parentBranchId,
    },
  });

  return branch;
};

export const getBranchByIdService = async (id: string) => {
  const branch = await prisma.branch.findUnique({
    where: { id },
    include: {
      parentBranch: true,
      subBranches: true,
    },
  });

  if (!branch) {
    throw AppError.notFound("Branch not found");
  }

  return branch;
};

type ScopedUser = {
  id: string;
  role: string;
  branchId?: string | null;
};

export const getAllBranchesService = async (user: ScopedUser) => {
  const scope = await getBranchScopeFilter(user);

  return prisma.branch.findMany({
    where: { ...scope },
    select: {
      id: true,
      name: true,
      code: true,
      type: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      parentBranch: {
        select: { id: true, name: true, code: true, type: true, isActive: true },
      },
      subBranches: {
        select: { id: true, name: true, code: true, type: true, isActive: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const deleteBranchService = async (id: string, userId: string) => {
  if (!userId) {
    throw AppError.unauthorized("Unauthorized");
  }

  const existingBranch = await prisma.branch.findUnique({ where: { id } });

  if (!existingBranch) {
    throw AppError.notFound("Branch not found");
  }

  const branch = await prisma.branch.update({
    where: { id },
    data: { isActive: false },
  });

  await logAction({
    entityType: "BRANCH",
    entityId: branch.id,
    action: "DELETE_BRANCH",
    performedBy: userId,
    branchId: branch.id,
    oldValue: { isActive: existingBranch.isActive },
    newValue: { isActive: false },
  });
};

export const getAllMainBranchesService = async () => {
  return prisma.branch.findMany({
    where: { type: "BRANCH" },
  });
};

export const createBulkBranchesService = async (
  data: CreateBulkBranchesInput,
  userId: string,
) => {
  const branchType = data.type as BranchTypeValue;

  // Validate parent exists and has the correct type
  const parentBranch = await prisma.branch.findUnique({
    where: { id: data.parentBranchId },
    select: { id: true, type: true, name: true },
  });

  if (!parentBranch) {
    throw AppError.notFound("Parent branch not found");
  }

  const expectedParentType = getExpectedParentType(branchType);
  if (!expectedParentType || parentBranch.type !== expectedParentType) {
    throw AppError.badRequest(
      `${BRANCH_TYPE_LABEL[branchType]} must be under a ${BRANCH_TYPE_LABEL[expectedParentType as BranchTypeValue]}`,
    );
  }

  // Check for duplicate codes in the incoming payload
  const incomingCodes = data.branches.map((b) => b.code);
  const uniqueCodes = new Set(incomingCodes);
  if (uniqueCodes.size !== incomingCodes.length) {
    throw AppError.badRequest("Duplicate branch codes found in request");
  }

  // Skip codes that already exist so bulk insert remains idempotent
  const existing = await prisma.branch.findMany({
    where: { code: { in: incomingCodes } },
    select: { code: true },
  });

  const existingCodes = new Set(existing.map((b) => b.code));
  const branchesToCreate = data.branches.filter(
    (branch) => !existingCodes.has(branch.code),
  );

  if (branchesToCreate.length === 0) {
    throw AppError.conflict("All provided branch codes already exist");
  }

  // Create only new branches
  const created = await prisma.$transaction(
    branchesToCreate.map((b) =>
      prisma.branch.create({
        data: {
          name: b.name,
          code: b.code,
          type: data.type,
          parentBranchId: data.parentBranchId,
        },
      }),
    ),
  );

  await Promise.all(
    created.map((branch) =>
      logAction({
        entityType: "BRANCH",
        entityId: branch.id,
        action: "CREATE_BRANCH",
        performedBy: userId,
        branchId: branch.id,
        oldValue: null,
        newValue: {
          name: branch.name,
          code: branch.code,
          type: branch.type,
          parentBranchId: branch.parentBranchId,
        },
      }),
    ),
  );

  return created;
};

export const reassignBulkBranchesService = async (
  data: ReassignBulkBranchesInput,
  userId: string,
) => {
  const targetParent = await prisma.branch.findUnique({
    where: { id: data.newParentBranchId },
    select: { id: true, type: true, name: true },
  });

  if (!targetParent) {
    throw AppError.notFound("Target parent branch not found");
  }

  const uniqueBranchIds = [...new Set(data.branchIds)];

  const branches = await prisma.branch.findMany({
    where: { id: { in: uniqueBranchIds } },
    select: { id: true, code: true, name: true, type: true, parentBranchId: true },
  });

  if (branches.length !== uniqueBranchIds.length) {
    const foundIds = new Set(branches.map((b) => b.id));
    const missingIds = uniqueBranchIds.filter((id) => !foundIds.has(id));
    throw AppError.notFound(`Branch not found for id(s): ${missingIds.join(", ")}`);
  }

  const invalidSelfParent = branches.find((b) => b.id === data.newParentBranchId);
  if (invalidSelfParent) {
    throw AppError.badRequest("A branch cannot be moved under itself");
  }

  const invalidHierarchy = branches.find((b) => {
    const expectedParentType = getExpectedParentType(b.type as BranchTypeValue);
    if (!expectedParentType) return true;
    return targetParent.type !== expectedParentType;
  });

  if (invalidHierarchy) {
    const branchType = invalidHierarchy.type as BranchTypeValue;
    const expectedParentType = getExpectedParentType(branchType);
    throw AppError.badRequest(
      `${invalidHierarchy.code} (${BRANCH_TYPE_LABEL[branchType]}) must be under ${expectedParentType ? BRANCH_TYPE_LABEL[expectedParentType] : "a valid parent"}`,
    );
  }

  const updated = await prisma.$transaction(
    branches.map((branch) =>
      prisma.branch.update({
        where: { id: branch.id },
        data: { parentBranchId: data.newParentBranchId },
      }),
    ),
  );

  await Promise.all(
    updated.map((branch, index) =>
      logAction({
        entityType: "BRANCH",
        entityId: branch.id,
        action: "UPDATE_BRANCH",
        performedBy: userId,
        branchId: branch.id,
        oldValue: { parentBranchId: branches[index]?.parentBranchId ?? null },
        newValue: { parentBranchId: data.newParentBranchId },
      }),
    ),
  );

  return updated;
};
