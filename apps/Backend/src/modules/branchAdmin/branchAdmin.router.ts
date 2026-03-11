import { Router } from "express";
import {
  createBranchAdminController,
  updateBranchAdminController,
} from "./branchAdmin.controller.js";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { validate } from "../../common/middlewares/zod.middleware.js";
import {
  createBranchAdminSchema,
  updateBranchAdminSchema,
  branchAdminIdParamSchema,
} from "./branchAdmin.schema.js";
import { rateLimit } from "../../common/middlewares/rateLimit.middleware.js";

const branchAdminRouter = Router();

branchAdminRouter.use(authMiddleware);
branchAdminRouter.use(rateLimit(20, 60_000));

branchAdminRouter.post(
  "/create-admin",
  validate(createBranchAdminSchema),
  createBranchAdminController,
);

branchAdminRouter.put(
  "/update-admin/:id",
  validate(branchAdminIdParamSchema, "params"),
  validate(updateBranchAdminSchema),
  updateBranchAdminController,
);

export default branchAdminRouter;
