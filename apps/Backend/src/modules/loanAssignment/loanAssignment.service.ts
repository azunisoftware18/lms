import { AssignedRole } from "../../../generated/prisma-client/enums.js";
import { logAction } from "../../audit/audit.helper.js";
import { AppError } from "../../common/utils/apiError.js";
import { getAccessibleBranchIds } from "../../common/utils/branchAccess.js";
import { buildPaginationMeta, getPagination } from "../../common/utils/pagination.js";
import { prisma } from "../../db/prismaService.js";
import type {
  AssignedLoansQueryParams,
  RequesterContext,
} from "./loanAssignment.types.js";

const TERMINAL_LOAN_STATUSES = new Set([
  "closed",
  "rejected",
  "written_off",
  "defaulted",
]);

const ensureBranchAccess = async (
  requester: RequesterContext,
  branchId: string,
) => {
  const accessibleBranchIds = await getAccessibleBranchIds({
    id: requester.id,
    role: requester.role,
    branchId: requester.branchId ?? undefined,
  });

  if (accessibleBranchIds && !accessibleBranchIds.includes(branchId)) {
    throw AppError.forbidden("Access denied for branch resources");
  }
};

export const assignLoanService = async (
  loanApplicationId: string,
  employeeId: string,
  role: AssignedRole,
  assignedById: string,
  requester: RequesterContext,
) => {
  return prisma.$transaction(async (tx) => {
    const loan = await tx.loanApplication.findUnique({
      where: { id: loanApplicationId },
      select: { id: true, branchId: true, status: true, loanNumber: true },
    });

    if (!loan) {
      throw AppError.notFound("Loan application not found");
    }

    await ensureBranchAccess(requester, loan.branchId);

    if (TERMINAL_LOAN_STATUSES.has(loan.status)) {
      throw AppError.badRequest(
        `Cannot assign employee when loan is in ${loan.status} status`,
      );
    }

    const employee = await tx.employee.findUnique({
      where: { id: employeeId },
      select: {
        id: true,
        branchId: true,
        user: { select: { fullName: true } },
      },
    });

    if (!employee) {
      throw AppError.notFound("Employee not found");
    }

    if (employee.branchId !== loan.branchId) {
      throw AppError.badRequest(
        "Employee branch does not match the loan application's branch",
      );
    }

    const existing = await tx.loanAssignment.findFirst({
      where: {
        loanApplicationId,
        employeeId,
        role,
        isActive: true,
      },
      select: { id: true },
    });

    if (existing) {
      throw AppError.conflict(
        "Active assignment already exists for this loan, employee, and role",
      );
    }

    const inactiveAssignment = await tx.loanAssignment.findFirst({
      where: {
        loanApplicationId,
        employeeId,
        role,
        isActive: false,
      },
      select: { id: true },
    });

    const assignment = inactiveAssignment
      ? await tx.loanAssignment.update({
          where: { id: inactiveAssignment.id },
          data: {
            isActive: true,
            assignedBy: assignedById,
            assignedAt: new Date(),
            unassignedAt: null,
            unassignedBy: null,
          },
        })
      : await tx.loanAssignment.create({
          data: {
            loanApplicationId,
            employeeId,
            role,
            assignedBy: assignedById,
          },
        });

    await logAction({
      entityType: "LOAN_ASSIGNMENT",
      entityId: assignment.id,
      action: "ASSIGN_LOAN",
      performedBy: assignedById,
      branchId: loan.branchId,
      oldValue: null,
      newValue: {
        loanApplicationId,
        employeeId,
        employeeName: employee.user.fullName,
        role,
        isActive: true,
      },
      remarks: `Loan ${loan.loanNumber} assigned to ${employee.user.fullName} as ${role}`,
    });

    return assignment;
  });
};

export const unassignLoanService = async (
  assignmentId: string,
  unassignedById: string,
  requester: RequesterContext,
) => {
  return prisma.$transaction(async (tx) => {
    const existingAssignment = await tx.loanAssignment.findUnique({
      where: { id: assignmentId },
      include: {
        loanApplication: {
          select: { loanNumber: true, branchId: true },
        },
        employee: {
          select: {
            user: { select: { fullName: true } },
          },
        },
      },
    });

    if (!existingAssignment) {
      throw AppError.notFound("Loan assignment not found");
    }

    await ensureBranchAccess(requester, existingAssignment.loanApplication.branchId);

    if (!existingAssignment.isActive) {
      throw AppError.badRequest("Assignment is already inactive");
    }

    const updatedAssignment = await tx.loanAssignment.update({
      where: { id: assignmentId },
      data: {
        isActive: false,
        unassignedBy: unassignedById,
        unassignedAt: new Date(),
      },
    });

    await logAction({
      entityType: "LOAN_ASSIGNMENT",
      entityId: assignmentId,
      action: "UNASSIGN_LOAN",
      performedBy: unassignedById,
      branchId: existingAssignment.loanApplication.branchId,
      oldValue: {
        isActive: true,
        employeeName: existingAssignment.employee.user.fullName,
        role: existingAssignment.role,
      },
      newValue: {
        isActive: false,
        unassignedAt: updatedAssignment.unassignedAt,
      },
      remarks: `Loan ${existingAssignment.loanApplication.loanNumber} unassigned from ${existingAssignment.employee.user.fullName} (${existingAssignment.role})`,
    });

    return updatedAssignment;
  });
};

export const getAssignedLoansForEmployeeService = async (
  requester: RequesterContext,
  params: AssignedLoansQueryParams,
) => {
  const employee = await prisma.employee.findUnique({
    where: { userId: requester.id },
    select: { id: true, branchId: true },
  });

  if (!employee) {
    throw AppError.notFound("Employee not found");
  }

  const accessibleBranchIds = await getAccessibleBranchIds({
    id: requester.id,
    role: requester.role,
    branchId: requester.branchId ?? undefined,
  });

  if (accessibleBranchIds && !accessibleBranchIds.includes(employee.branchId)) {
    throw AppError.forbidden("Access denied for branch resources");
  }

  const { page, limit, skip } = getPagination(params.page, params.limit);

  const assignmentWhere = {
    employeeId: employee.id,
    isActive: true,
    loanApplication: accessibleBranchIds
      ? { branchId: { in: accessibleBranchIds } }
      : undefined,
  };

  const [total, assignments] = await prisma.$transaction([
    prisma.loanAssignment.count({ where: assignmentWhere }),
    prisma.loanAssignment.findMany({
      where: assignmentWhere,
      orderBy: { assignedAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        role: true,
        assignedAt: true,
        loanApplication: {
          select: {
            id: true,
            loanNumber: true,
            status: true,
            requestedAmount: true,
            approvedAmount: true,
            tenureMonths: true,
            branchId: true,
            customer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                contactNumber: true,
              },
            },
          },
        },
      },
    }),
  ]);

  return {
    data: assignments.map((assignment) => ({
      assignmentId: assignment.id,
      role: assignment.role,
      assignedAt: assignment.assignedAt,
      loan: assignment.loanApplication,
    })),
    meta: buildPaginationMeta(total, page, limit),
  };
};
