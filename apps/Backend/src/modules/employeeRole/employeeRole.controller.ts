import { NextFunction, Request, Response } from "express";
import { AppError } from "../../common/utils/apiError.js";
import {
  createEmployeeRoleService,
  getEmployeeRolesService,
} from "./employeeRole.service.js";

export const createEmployeeRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw AppError.unauthorized("Unauthorized");
    }

    if (req.user.role !== "SUPER_ADMIN") {
      throw AppError.forbidden("Only SUPER_ADMIN can create employee roles");
    }

    const employeeRole = await createEmployeeRoleService(req.body);

    res.status(201).json({
      success: true,
      message: "Employee role created successfully",
      data: employeeRole,
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployeeRolesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const includeInactive =
      req.user?.role === "SUPER_ADMIN" && req.query.includeInactive === "true";

    const employeeRoles = await getEmployeeRolesService(includeInactive);

    res.status(200).json({
      success: true,
      message: "Employee roles retrieved successfully",
      data: employeeRoles,
    });
  } catch (error) {
    next(error);
  }
};
