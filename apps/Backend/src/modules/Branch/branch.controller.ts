import { Request, Response } from "express";
import {
  createBranchService,
  getAllBranchesService,
  getBranchByIdService,
  updateBranchService,
  deleteBranchService,
  getAllMainBranchesService,
} from "./branch.service.js";
import { AppError } from "../../common/utils/apiError.js";

export const createBranchController = async (req: Request, res: Response) => {
  if (!req.user) {
    throw AppError.unauthorized("Unauthorized");
  }
  const branch = await createBranchService(req.body, req.user.id);
  res.status(201).json({
    success: true,
    message: "Branch created successfully",
    data: branch,
  });
};

export const updateBranchController = async (req: Request, res: Response) => {
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
};

export const getAllBranchesController = async (req: Request, res: Response) => {
  const branches = await getAllBranchesService((req as any).user);
  res.status(200).json({
    success: true,
    message: "Branches retrieved successfully",
    data: branches,
  });
};

export const deleteBranchController = async (req: Request, res: Response) => {
  if (!req.user) {
    throw AppError.unauthorized("Unauthorized");
  }

  const { id } = req.params as { id: string };
  await deleteBranchService(id, req.user.id);
  res.status(200).json({
    success: true,
    message: "Branch deleted successfully",
  });
};

export const getBranchByIdController = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const branch = await getBranchByIdService(id);
  res.status(200).json({
    success: true,
    message: "Branch retrieved successfully",
    data: branch,
  });
};

export const getAllMainBranchesController = async (
  req: Request,
  res: Response,
) => {
  const mainBranches = await getAllMainBranchesService();
  res.status(200).json({
    success: true,
    message: "Main branches retrieved successfully",
    data: mainBranches,
  });
};
