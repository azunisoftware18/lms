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

const toPublicBranch = (branch: any): any => {
  if (!branch) return branch;

  return {
    id: branch.id,
    name: branch.name,
    code: branch.code,
    type: branch.type,
    isActive: branch.isActive,
    createdAt: branch.createdAt,
    updatedAt: branch.updatedAt,
    parentBranch: branch.parentBranch
      ? {
          id: branch.parentBranch.id,
          name: branch.parentBranch.name,
          code: branch.parentBranch.code,
          type: branch.parentBranch.type,
          isActive: branch.parentBranch.isActive,
        }
      : null,
    subBranches: Array.isArray(branch.subBranches)
      ? branch.subBranches.map((sub: any) => ({
          id: sub.id,
          name: sub.name,
          code: sub.code,
          type: sub.type,
          isActive: sub.isActive,
        }))
      : [],
  };
};

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
      data: toPublicBranch(branch),
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
      data: toPublicBranch(branch),
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

    const sanitized = {
      data: Array.isArray(branches?.data)
        ? branches.data.map((branch) => toPublicBranch(branch))
        : [],
      pagination: branches?.pagination,
    };

    res.status(200).json({
      success: true,
      message: "Branches retrieved successfully",
      data: sanitized,
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
      data: toPublicBranch(branch),
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

    const sanitized = {
      data: Array.isArray(mainBranches?.data)
        ? mainBranches.data.map((branch) => toPublicBranch(branch))
        : [],
      pagination: mainBranches?.pagination,
    };

    res.status(200).json({
      success: true,
      message: "Main branches retrieved successfully",
      data: sanitized,
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
      data: Array.isArray(branches)
        ? branches.map((branch) => toPublicBranch(branch))
        : [],
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
      data: Array.isArray(branches)
        ? branches.map((branch) => toPublicBranch(branch))
        : [],
    });
  } catch (error) {
    next(error);
  }
};
