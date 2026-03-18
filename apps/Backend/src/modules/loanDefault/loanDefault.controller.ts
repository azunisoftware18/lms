import { NextFunction, Request, Response } from "express";
import {
  checkAndMarkLoanDefault,
  getAllDefaultedLoansService,
  getDefaultLoanByIdService,
} from "./loanDefault.service.js";
import { AppError } from "../../common/utils/apiError.js";

export const markLoanDefaultController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) throw AppError.unauthorized("Unauthorized");

    const loanId = typeof req.params.loanId === "string" ? req.params.loanId : req.params.loanId[0];
    const result = await checkAndMarkLoanDefault(loanId);

    return res.status(200).json({
      success: true,
      message: "Loan default status checked and updated successfully",
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

    const result = await getAllDefaultedLoansService(
      {
        page: Number(req.query.page) || undefined,
        limit: Number(req.query.limit) || undefined,
        branchId: typeof req.query.branchId === "string" ? req.query.branchId : undefined,
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