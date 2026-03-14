import { NextFunction, Request, Response } from "express";
import {
  createEmployeeService,
  getAllEmployeesService,
  getEmployeeByIdService,
  updateEmployeeService,
  getEmployeeDashBoardService,
} from "./employee.service.js";
import { prisma } from "../../db/prismaService.js";
import { logAction } from "../../audit/audit.helper.js";
import { AppError } from "../../common/utils/apiError.js";

const buildSafeEmployeeResponse = (payload: any) => {
  const user = payload?.user ?? null;
  const employee = payload?.employee ?? null;

  return {
    user: user
      ? {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          userName: user.userName,
          role: user.role,
          contactNumber: user.contactNumber,
          branchId: user.branchId,
          isActive: user.isActive,
        }
      : null,
    employee: employee
      ? {
          id: employee.id,
          userId: employee.userId,
          employeeId: employee.employeeId,
          employeeRoleId: employee.employeeRoleId,
          designation: employee.designation,
          department: employee.department,
          branchId: employee.branchId,
          createdAt: employee.createdAt,
          updatedAt: employee.updatedAt,
        }
      : null,
  };
};

export const createEmployeeController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await createEmployeeService(req.body, req.user?.role);
    const { user, employee } = result as any;
    const { password: _pw, ...safeUser } = user;

    // Only log action if user has a branchId
    const userBranchId = req.user?.branchId || employee.branchId;
    if (userBranchId) {
      try {
        await logAction({
          action: "CREATE_EMPLOYEE",
          performedBy: req.user?.id || "SYSTEM",
          entityType: "EMPLOYEE",
          entityId: employee.id,
          branchId: userBranchId,
          oldValue: null,
          newValue: {
            user: safeUser,
            employee: {
              id: employee.id,
              name: employee.name,
              email: employee.email,
              contactNumber: employee.contactNumber,
              branchId: employee.branchId,
            },
          },
        });
      } catch (auditError) {
        console.error("Failed to log audit action:", auditError);
      }
    }

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: buildSafeEmployeeResponse({ user: safeUser, employee }),
    });
  } catch (error) {
    next(error);
  }
};

export const getAllEmployeesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw AppError.unauthorized("Unauthorized");
    }
    const employees = await getAllEmployeesService(
      {
        page: Number(req.query.page),
        limit: Number(req.query.limit),
        q: typeof req.query.q === 'string' ? req.query.q : undefined,
      },
      {
        id: req.user.id,
        role: req.user.role,
        branchId: req.user.branchId,
      },
    );
    res.status(200).json({
      success: true,
      message: "Employees retrieved successfully",
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployeeByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
  try {
    const employee = await getEmployeeByIdService(id);
    res.status(200).json({
      success: true,
      message: "Employee retrieved successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEmployeeController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
  const updateData = req.body;

  try {
    const updatedEmployee = await updateEmployeeService(
      id,
      updateData,
      req.user?.id,
      req.user?.branchId,
      req.user?.role,
    );

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: buildSafeEmployeeResponse(updatedEmployee),
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployeeDashBoardController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw AppError.unauthorized("Unauthorized");
    }
    const employee = await prisma.employee.findUnique({
      where: { userId: req.user.id },
    });
    if (!employee) {
      throw AppError.notFound("Employee not found");
    }
    const employeeId = employee.id;
    const dashboardData = await getEmployeeDashBoardService(employeeId);
    res.status(200).json({
      success: true,
      message: "Employee dashboard data retrieved successfully",
      data: dashboardData,
    });
  } catch (error) {
    next(error);
  }
};
