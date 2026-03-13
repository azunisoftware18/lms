import { Request, Response } from "express";
import { AppError } from "../../common/utils/apiError.js";

import {
  createBranchAdminService,
  updateBranchAdminService,
} from "./branchAdmin.service.js";

export const createBranchAdminController = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.user) {
      throw AppError.unauthorized("Unauthorized");
    }

    const branchAdmin = await createBranchAdminService(req.body, req.user.id);
    res.status(201).json({
      success: true,
      message: "Branch admin created successfully",
      data: branchAdmin,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to create branch admin",
    });
  }
};

export const updateBranchAdminController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = typeof req.params.id === "string"
      ? req.params.id
      : Array.isArray(req.params.id)
        ? req.params.id[0]
        : "";

    if (!id) {
      throw AppError.badRequest("Valid branch admin id is required");
    }

    if (!req.user) {
      throw AppError.unauthorized("Unauthorized");
    }

    const updatedBranchAdmin = await updateBranchAdminService(
      id,
      req.body,
      req.user.id,
    );
    res.status(200).json({
      success: true,
      message: "Branch admin updated successfully",
      data: updatedBranchAdmin,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to update branch admin",
    });
  }
};
