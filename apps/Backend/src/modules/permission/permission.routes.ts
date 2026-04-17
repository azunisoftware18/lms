import { Router } from "express";
const permissionRouter = Router();

import {
  assignPermissionsController,
  unassignPermissionsController,
  assignPermissionGroupsController,
  assignRolePermissionsController,
  assignRolePermissionGroupsController,
  getRolePermissionsController,
  getAllPermissionGroupsController,
  getUserPermissionsController,
  createPermissionsController,
  getAllPermissionsNameAndCodeController,
} from "./permission.controller.js";

import { validate } from "../../common/middlewares/zod.middleware.js";
import {
  createPermissionsSchema,
  assignPermissionsSchema,
  assignPermissionGroupsSchema,
  assignRolePermissionsSchema,
  assignRolePermissionGroupsSchema,
  userIdParamSchema,
  roleParamSchema,
} from "./permission.schema.js";
import { checkPermissionMiddleware } from "../../common/middlewares/permission.middleware.js";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
// Define your permission routes here

permissionRouter.post("/create-permissions",
  authMiddleware,
  validate(createPermissionsSchema),
  checkPermissionMiddleware("CREATE_PERMISSIONS"),
  createPermissionsController);

permissionRouter.post(
  "/assign",
  authMiddleware,
  validate(assignPermissionsSchema),
  checkPermissionMiddleware("ASSIGN_PERMISSIONS"),
  assignPermissionsController
);

permissionRouter.post(
  "/assign-groups",
  authMiddleware,
  validate(assignPermissionGroupsSchema),
  checkPermissionMiddleware("ASSIGN_PERMISSIONS"),
  assignPermissionGroupsController,
);

permissionRouter.post(
  "/assign-role",
  authMiddleware,
  validate(assignRolePermissionsSchema),
  checkPermissionMiddleware("ASSIGN_PERMISSIONS"),
  assignRolePermissionsController,
);

permissionRouter.post(
  "/assign-role-groups",
  authMiddleware,
  validate(assignRolePermissionGroupsSchema),
  checkPermissionMiddleware("ASSIGN_PERMISSIONS"),
  assignRolePermissionGroupsController,
);

permissionRouter.get(
  "/user/:userId",
  authMiddleware,
  validate(userIdParamSchema, "params"),
  checkPermissionMiddleware("VIEW_USER_PERMISSIONS"),
  getUserPermissionsController
);

permissionRouter.get(
  "/role/:role",
  authMiddleware,
  validate(roleParamSchema, "params"),
  checkPermissionMiddleware("VIEW_USER_PERMISSIONS"),
  getRolePermissionsController,
);

permissionRouter.get(
  "/all-permissions",
  authMiddleware,
  checkPermissionMiddleware("VIEW_ALL_PERMISSIONS"),
  getAllPermissionsNameAndCodeController,
);

permissionRouter.get(
  "/permission-groups",
  authMiddleware,
  checkPermissionMiddleware("VIEW_ALL_PERMISSIONS"),
  getAllPermissionGroupsController,
);

permissionRouter.post(
  "/unassign",
  authMiddleware,
  validate(assignPermissionsSchema),
  checkPermissionMiddleware("ASSIGN_PERMISSIONS"),
  unassignPermissionsController,
);

export default permissionRouter;
