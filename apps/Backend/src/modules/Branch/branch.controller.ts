import { NextFunction, Request, Response } from "express";
import {
  createBranchService,
  getAllBranchesService,
  getBranchByIdService,
  updateBranchService,
  deleteBranchService,
  getAllMainBranchesService,
  createBulkBranchesService,
  reassignBulkBranchesService,
} from "./branch.service.js";
import { AppError } from "../../common/utils/apiError.js";

export const createBranchController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw AppError.unauthorized("Unauthorized");
    }
    const branch = await createBranchService(req.body, req.user.id);
    res.status(201).json({
      success: true,
      message: "Branch created successfully",
      data: branch,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBranchController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw AppError.unauthorized("Unauthorized");
    }
    const { id } = req.params as { id: string };
    const branch = await updateBranchService(id, req.body, req.user.id);
    res.status(200).json({
      success: true,
      message: "Branch updated successfully",
      data: branch,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBranchesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw AppError.unauthorized("Unauthorized");
    }
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search || req.query.q) as string;
    
    const branches = await getAllBranchesService(req.user, {
      page,
      limit,
      search,
    });
    res.status(200).json({
      success: true,
      message: "Branches retrieved successfully",
      data: branches,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBranchController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw AppError.unauthorized("Unauthorized");
    }

    const { id } = req.params as { id: string };
    await deleteBranchService(id, req.user.id);
    res.status(200).json({
      success: true,
      message: "Branch deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getBranchByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string };
    const branch = await getBranchByIdService(id);
    res.status(200).json({
      success: true,
      message: "Branch retrieved successfully",
      data: branch,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllMainBranchesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search || req.query.q) as string;
    
    const mainBranches = await getAllMainBranchesService({
      page,
      limit,
      search,
    });
    res.status(200).json({
      success: true,
      message: "Main branches retrieved successfully",
      data: mainBranches,
    });
  } catch (error) {
    next(error);
  }
};

export const createBulkBranchesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw AppError.unauthorized("Unauthorized");
    }
    const branches = await createBulkBranchesService(req.body, req.user.id);
    res.status(201).json({
      success: true,
      message: `${branches.length} branch(es) created successfully`,
      data: branches,
    });
  } catch (error) {
    next(error);
  }
};

export const reassignBulkBranchesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw AppError.unauthorized("Unauthorized");
    }

    const branches = await reassignBulkBranchesService(req.body, req.user.id);
    res.status(200).json({
      success: true,
      message: `${branches.length} branch(es) reassigned successfully`,
      data: branches,
    });
  } catch (error) {
    next(error);
  }
};
