import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { validate } from "../../common/middlewares/zod.middleware.js";
import { checkPermissionMiddleware } from "../../common/middlewares/permission.middleware.js";
import {
  createEmployeeRoleController,
  getEmployeeRolesController,
} from "./employeeRole.controller.js";
import { createEmployeeRoleSchema } from "./employeeRole.schema.js";

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

export default employeeRoleRouter;