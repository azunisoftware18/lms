import {
  assignPermissionsService,
  assignPermissionGroupsService,
  assignRolePermissionsService,
  assignRolePermissionGroupsService,
  createPermissionsService,
  getUserPermissionsService,
  getRolePermissionsService,
  getAllPermissionGroupsService,
  getAllPermissionsCodeAndNameService,
} from "./permission.service.js";
import { Response, Request } from "express";
export const assignPermissionsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userId, permissions } = req.body;

    if (!userId || !permissions) {
      return res.status(400).json({
        success: false,
        message: "userId and permissions are required",
      });
    }
    if (!Array.isArray(permissions)) {
      return res.status(400).json({
        success: false,
        message: "permissions must be an array of permission codes",
      });
    }
    await assignPermissionsService(userId, permissions);
    res.status(200).json({
      success: true,
      message: "Permissions assigned successfully",
    });
  } catch (error: any) {
    if (error.message && error.message.includes("not found")) {
      return res.status(404).json({ success: false, message: error.message });
    }

    res.status(500).json({
      success: false,
      message: "Failed to assign permissions",
      error: "INTERNAL_SERVER_ERROR",
    });
  }
};

export const createPermissionsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { code, name } = req.body;

    const permission = await createPermissionsService({ code, name });
    res.status(201).json({
      success: true,
      message: "Permission created successfully",
      data: permission,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to create permission",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
};

export const assignPermissionGroupsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userId, groups } = req.body;

    await assignPermissionGroupsService(userId, groups);
    res.status(200).json({
      success: true,
      message: "Permission groups assigned successfully",
    });
  } catch (error: any) {
    if (error?.statusCode) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }

    res.status(500).json({
      success: false,
      message: "Failed to assign permission groups",
      error: "INTERNAL_SERVER_ERROR",
    });
  }
};

export const assignRolePermissionsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { role, permissions } = req.body;

    await assignRolePermissionsService(role, permissions);
    res.status(200).json({
      success: true,
      message: "Role permissions assigned successfully",
    });
  } catch (error: any) {
    if (error?.statusCode) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }

    res.status(500).json({
      success: false,
      message: "Failed to assign role permissions",
      error: "INTERNAL_SERVER_ERROR",
    });
  }
};

export const assignRolePermissionGroupsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { role, groups } = req.body;

    await assignRolePermissionGroupsService(role, groups);
    res.status(200).json({
      success: true,
      message: "Role permission groups assigned successfully",
    });
  } catch (error: any) {
    if (error?.statusCode) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }

    res.status(500).json({
      success: false,
      message: "Failed to assign role permission groups",
      error: "INTERNAL_SERVER_ERROR",
    });
  }
};

export const getUserPermissionsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const userIdParam = req.params.userId;
    const userId = Array.isArray(userIdParam) ? userIdParam[0] : userIdParam;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "userId param is required" });
    }

    const permissions = await getUserPermissionsService(userId);
    res.status(200).json({ success: true, data: permissions });
  } catch (error: any) {
    if (error?.message && error.message.includes("not found")) {
      return res.status(404).json({ success: false, message: error.message });
    }
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to fetch user permissions",
      });
  }
};

export const getAllPermissionsNameAndCodeController = async (
  req: Request,
  res: Response,
) => {
  try {
    const permissions = await getAllPermissionsCodeAndNameService();

    res.status(200).json({
      success: true,
      data: permissions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch permissions",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
};

export const getRolePermissionsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { role } = req.params;
    const permissions = await getRolePermissionsService(role as any);

    res.status(200).json({
      success: true,
      data: permissions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch role permissions",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
};

export const getAllPermissionGroupsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const groups = await getAllPermissionGroupsService();

    res.status(200).json({
      success: true,
      data: groups,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch permission groups",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
};
