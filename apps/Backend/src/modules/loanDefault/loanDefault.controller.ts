import { NextFunction, Request, Response } from "express";
import {
  checkAndMarkLoanDefault,
  getAllDefaultedLoansService,
  getDefaultLoanByIdService,
} from "./loanDefault.service.js";
import { AppError } from "../../common/utils/apiError.js";
import { loanDefaultQuerySchema } from "./loandefault.schema.js";

export const markLoanDefaultController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) throw AppError.unauthorized("Unauthorized");

    const loanId = typeof req.params.loanId === "string" ? req.params.loanId : req.params.loanId[0];
    const result = await checkAndMarkLoanDefault(loanId);

    const message = result.skipped
      ? "Loan already defaulted; no status update performed"
      : "Loan default status checked and updated successfully";

    return res.status(200).json({
      success: true,
      message,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllDefaultedLoansController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) throw AppError.unauthorized("Unauthorized");

    const parsedQuery = loanDefaultQuerySchema.safeParse(req.query);
    if (!parsedQuery.success) {
      throw AppError.badRequest("Invalid query parameters");
    }

    const { page, limit, branchId } = parsedQuery.data;

    const result = await getAllDefaultedLoansService(
      {
        page,
        limit,
        branchId,
      },
      { id: req.user.id, role: req.user.role, branchId: req.user.branchId },
    );

    return res.status(200).json({
      success: true,
      message: "Defaulted loans retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
};

export const getDefaultedLoanByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) throw AppError.unauthorized("Unauthorized");

    const loanId = typeof req.params.loanId === "string" ? req.params.loanId : req.params.loanId[0];
    const loan = await getDefaultLoanByIdService(loanId, {
      id: req.user.id,
      role: req.user.role,
      branchId: req.user.branchId,
    });

    return res.status(200).json({
      success: true,
      message: "Defaulted loan retrieved successfully",
      data: loan,
    });
  } catch (error) {
    next(error);
  }
};