import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { branchMiddleware } from "../../common/middlewares/branch.middleware.js";
import { createRateLimiter } from "../../common/middlewares/rateLimit.middleware.js";
import { checkPermissionMiddleware } from "../../common/middlewares/permission.middleware.js";
import {
  forecloseLoanController,
  applyForecloseController,
  payforecloseLoanController,
  approveForecloseController,
} from "./foreclose.controller.js";
import { foreclosureStatementController } from "./foreclose.controller.js";

const forecloseRouter = Router();

const readLimiter = createRateLimiter({
  windowMs: 60_000,
  max: 120,
  message: "Too many requests",
});
const writeLimiter = createRateLimiter({
  windowMs: 60_000,
  max: 60,
  message: "Too many requests",
});

forecloseRouter.get(
  "/loans/:loanNumber/foreclosure-statement",
  authMiddleware,
  branchMiddleware,
  readLimiter,
  checkPermissionMiddleware("VIEW_FORECLOSE_AMOUNT"),
  foreclosureStatementController,
);

forecloseRouter.get(
  "/loans/:loanId",
  authMiddleware,
  branchMiddleware,
  readLimiter,
  checkPermissionMiddleware("VIEW_FORECLOSE_AMOUNT"),
  forecloseLoanController,
);

forecloseRouter.post(
  "/loans/:loanNumber/apply-foreclose",
  authMiddleware,
  branchMiddleware,
  writeLimiter,
  checkPermissionMiddleware("APPLY_FORECLOSE"),
  applyForecloseController,
);


forecloseRouter.post(
  "/loans/:loanNumber/foreclose",
  authMiddleware,
  branchMiddleware,
  writeLimiter,
  checkPermissionMiddleware("FORECLOSE_LOAN"),
  payforecloseLoanController,
);

forecloseRouter.post(
  "/loans/:loanNumber/foreclose/approval",
  authMiddleware,
  branchMiddleware,
  writeLimiter,
  checkPermissionMiddleware("APPROVE_FORECLOSE"),
  approveForecloseController,
);

export default forecloseRouter;
