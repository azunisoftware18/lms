import { Router } from "express";
import {
  createEmployeeController,
  getAllEmployeesController,
  getEmployeeByIdController,
  updateEmployeeController,
  getEmployeeDashBoardController,
} from "./employee.controller.js";
import {validate } from "../../common/middlewares/zod.middleware.js";
import {createEmployeeSchema, updateEmployeeSchema, employeeIdParamSchema
} from "./employee.schema.js";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { checkPermissionMiddleware } from "../../common/middlewares/permission.middleware.js";
import { createRateLimiter } from "../../common/middlewares/rateLimit.middleware.js";

export const employeeRouter = Router();

const employeeWriteLimiter = createRateLimiter({
  windowMs: 60_000,
  max: 20,
  message: "Too many employee write requests. Please try again later.",
  keyScope: "user",
});

// Protect all routes defined after this middleware
employeeRouter.use(authMiddleware);
employeeRouter.post(
  "/",
  employeeWriteLimiter,
  validate(createEmployeeSchema),
  checkPermissionMiddleware("CREATE_EMPLOYEE"),
  createEmployeeController
);



employeeRouter.get("/all",
  checkPermissionMiddleware("VIEW_ALL_EMPLOYEES"),
  getAllEmployeesController);




employeeRouter.get(
  "/dashboard",
  checkPermissionMiddleware("VIEW_EMPLOYEE_DETAILS"),
  getEmployeeDashBoardController,
);

employeeRouter.patch(
  "/:id",
  employeeWriteLimiter,
  validate(employeeIdParamSchema, "params"),
  validate(updateEmployeeSchema),
  checkPermissionMiddleware("UPDATE_EMPLOYEE"),
  updateEmployeeController
);


employeeRouter.get("/:id",
  validate(employeeIdParamSchema, "params"),
  checkPermissionMiddleware("VIEW_EMPLOYEE_DETAILS"),
  getEmployeeByIdController);




export default employeeRouter;
