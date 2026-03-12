import { Router } from "express";

import {
  createBranchController,
  getAllBranchesController,
  getBranchByIdController,
  updateBranchController,
  deleteBranchController,
  getAllMainBranchesController,
  createBulkBranchesController,
  reassignBulkBranchesController,
} from "./branch.controller.js";

import { validate } from "../../common/middlewares/zod.middleware.js";
import {
  branchIdParamSchema,
} from "./branch.schema.js";

import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import {
  createBranchSchema,
  updateBranchSchema,
  createBulkBranchesSchema,
  reassignBulkBranchesSchema,
} from "./branch.schema.js";

import { checkPermissionMiddleware } from "../../common/middlewares/permission.middleware.js";

const branchRouter = Router();

branchRouter.post(
  "/",
  authMiddleware,
  checkPermissionMiddleware("CREATE_BRANCH"),
  validate(createBranchSchema),
  createBranchController,
);

branchRouter.post(
  "/bulk",
  authMiddleware,
  checkPermissionMiddleware("CREATE_BRANCH"),
  validate(createBulkBranchesSchema),
  createBulkBranchesController,
);

branchRouter.put(
  "/bulk/reassign",
  authMiddleware,
  checkPermissionMiddleware("UPDATE_BRANCH"),
  validate(reassignBulkBranchesSchema),
  reassignBulkBranchesController,
);

branchRouter.put(
  "/:id",
  authMiddleware,
  checkPermissionMiddleware("UPDATE_BRANCH"),
  validate(branchIdParamSchema, "params"),
  validate(updateBranchSchema),
  updateBranchController,
);

branchRouter.get(
  "/",
  authMiddleware,
  checkPermissionMiddleware("VIEW_BRANCH"),
  getAllBranchesController,
);

branchRouter.get(
  "/main",
  authMiddleware,
  checkPermissionMiddleware("VIEW_BRANCH"),
  getAllMainBranchesController,
);

branchRouter.get(
  "/:id",
  authMiddleware,
  checkPermissionMiddleware("VIEW_BRANCH"),
  validate(branchIdParamSchema, "params"),
  getBranchByIdController,
);

branchRouter.delete(
  "/:id",
  authMiddleware,
  checkPermissionMiddleware("DELETE_BRANCH"),
  validate(branchIdParamSchema, "params"),
  deleteBranchController,
);

export default branchRouter;
