import { NextFunction, Request, Response } from "express";
import { AppError } from "../../common/utils/apiError.js";
import {
  createEmployeeRoleService,
  deleteEmployeeRoleService,
  getEmployeeRolesService,
  updateEmployeeRoleService,
} from "./employeeRole.service.js";
import {
  createEmployeeRoleSchema,
  employeeRoleIdParamSchema,
  updateEmployeeRoleSchema,
} from "./employeeRole.schema.js";

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

    const parsedPayload = createEmployeeRoleSchema.safeParse(req.body);
    if (!parsedPayload.success) {
      throw AppError.badRequest("Invalid request data");
    }

    const employeeRole = await createEmployeeRoleService(parsedPayload.data);

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

export const updateEmployeeRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw AppError.unauthorized("Unauthorized");
    }

    if (req.user.role !== "SUPER_ADMIN") {
      throw AppError.forbidden("Only SUPER_ADMIN can update employee roles");
    }

    const parsedParams = employeeRoleIdParamSchema.safeParse(req.params);
    if (!parsedParams.success) {
      throw AppError.badRequest("Invalid employee role id");
    }

    const parsedPayload = updateEmployeeRoleSchema.safeParse(req.body);
    if (!parsedPayload.success) {
      throw AppError.badRequest("Invalid request data");
    }

    const employeeRole = await updateEmployeeRoleService(
      parsedParams.data.id,
      parsedPayload.data,
    );

    res.status(200).json({
      success: true,
      message: "Employee role updated successfully",
      data: employeeRole,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEmployeeRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw AppError.unauthorized("Unauthorized");
    }

    if (req.user.role !== "SUPER_ADMIN") {
      throw AppError.forbidden("Only SUPER_ADMIN can delete employee roles");
    }

    const parsedParams = employeeRoleIdParamSchema.safeParse(req.params);
    if (!parsedParams.success) {
      throw AppError.badRequest("Invalid employee role id");
    }

    const deletedRole = await deleteEmployeeRoleService(parsedParams.data.id);

    res.status(200).json({
      success: true,
      message: "Employee role deleted successfully",
      data: deletedRole,
    });
  } catch (error) {
    next(error);
  }
};
