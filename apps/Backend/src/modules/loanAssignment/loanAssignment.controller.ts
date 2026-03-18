import { NextFunction, Request, Response } from "express";

import {
  assignLoanService,
  unassignLoanService,
  getAssignedLoansForEmployeeService,
} from "./loanAssignment.service.js";
import { AppError } from "../../common/utils/apiError.js";
import { assignedLoansQuerySchema } from "./loanAssignment.schema.js";

export const assignLoanController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw AppError.unauthorized("Unauthorized");
    }

    const loanApplicationId =
      typeof req.params.loanApplicationId === "string"
        ? req.params.loanApplicationId
        : req.params.loanApplicationId[0];
    const { employeeId, role } = req.body;

    const assigned = await assignLoanService(
      loanApplicationId,
      employeeId,
      role,
      req.user.id,
      { id: req.user.id, role: req.user.role, branchId: req.user.branchId },
    );

    return res.status(200).json({
      success: true,
      message: "Loan assigned successfully",
      data: assigned,
    });
  } catch (error) {
    next(error);
  }
};

export const unassignLoanController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw AppError.unauthorized("Unauthorized");
    }

    const assignmentId =
      typeof req.params.assignmentId === "string"
        ? req.params.assignmentId
        : req.params.assignmentId[0];

    const unassigned = await unassignLoanService(assignmentId, req.user.id, {
      id: req.user.id,
      role: req.user.role,
      branchId: req.user.branchId,
    });

    return res.status(200).json({
      success: true,
      message: "Loan unassigned successfully",
      data: unassigned,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyAssignedLoansController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user?.id) {
      throw AppError.unauthorized("Unauthorized");
    }

    const parsedQuery = assignedLoansQuerySchema.parse(req.query);
    const loans = await getAssignedLoansForEmployeeService(
      { id: req.user.id, role: req.user.role, branchId: req.user.branchId },
      parsedQuery,
    );

    return res.status(200).json({
      success: true,
      message: "Assigned loans fetched successfully",
      data: loans.data,
      meta: loans.meta,
    });
  } catch (error) {
    next(error);
  }
};
