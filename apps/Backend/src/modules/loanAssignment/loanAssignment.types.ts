import type { AssignedRole } from "../../../generated/prisma-client/enums.js";

export type AssignmentRoleType = {
  employeeId: string;
  role: AssignedRole;
};

export type UnassignLoanType = {
  assignmentId: string;
};

export type RequesterContext = {
  id: string;
  role: string;
  branchId?: string | null;
};

export type AssignedLoansQueryParams = {
  page?: number;
  limit?: number;
};
