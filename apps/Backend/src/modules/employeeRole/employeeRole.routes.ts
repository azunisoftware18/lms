import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { validate } from "../../common/middlewares/zod.middleware.js";
import { checkPermissionMiddleware } from "../../common/middlewares/permission.middleware.js";
import {
  createEmployeeRoleController,
  deleteEmployeeRoleController,
  getEmployeeRolesController,
  updateEmployeeRoleController,
} from "./employeeRole.controller.js";
import {
  createEmployeeRoleSchema,
  employeeRoleIdParamSchema,
  updateEmployeeRoleSchema,
} from "./employeeRole.schema.js";

const employeeRoleRouter = Router();

employeeRoleRouter.use(authMiddleware);

employeeRoleRouter.post(
  "/",
  validate(createEmployeeRoleSchema),
  createEmployeeRoleController,
);

employeeRoleRouter.get(
  "/",
  checkPermissionMiddleware("READ_EMPLOYEE_ROLE"),
  getEmployeeRolesController,
);

employeeRoleRouter.patch(
  "/:id",
  validate(employeeRoleIdParamSchema, "params"),
  validate(updateEmployeeRoleSchema),
  updateEmployeeRoleController,
);

employeeRoleRouter.delete(
  "/:id",
  validate(employeeRoleIdParamSchema, "params"),
  deleteEmployeeRoleController,
);

export default employeeRoleRouter;