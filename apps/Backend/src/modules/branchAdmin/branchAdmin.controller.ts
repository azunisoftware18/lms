import { Request, Response } from "express";
import { AppError } from "../../common/utils/apiError.js";

import {
  createBranchAdminService,
  updateBranchAdminService,
  getAllBranchAdminsService,
  getBranchAdminByIdService,
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

const getIdParam = (req: Request) => {
  if (typeof req.params.id === "string") {
    return req.params.id;
  }

  if (Array.isArray(req.params.id)) {
    return req.params.id[0] || "";
  }

  return "";
};

export const getAllBranchAdminsController = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.user) {
      throw AppError.unauthorized("Unauthorized");
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search || req.query.q) as string;
    const status = req.query.status as "active" | "inactive" | undefined;

    const branchAdmins = await getAllBranchAdminsService(
      { page, limit, q: search, status },
      {
        id: req.user.id,
        role: req.user.role,
        branchId: req.user.branchId,
      },
    );

    res.status(200).json({
      success: true,
      message: "Branch admins retrieved successfully",
      data: branchAdmins,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    const message = error.statusCode
      ? error.message
      : "Failed to fetch branch admins";
    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

export const getBranchAdminByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.user) {
      throw AppError.unauthorized("Unauthorized");
    }

    const id = getIdParam(req);
    if (!id) {
      throw AppError.badRequest("Valid branch admin id is required");
    }

    const branchAdmin = await getBranchAdminByIdService(id, {
      id: req.user.id,
      role: req.user.role,
      branchId: req.user.branchId,
    });

    res.status(200).json({
      success: true,
      message: "Branch admin retrieved successfully",
      data: branchAdmin,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to fetch branch admin",
    });
  }
};
