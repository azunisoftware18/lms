import { Router } from "express";
import {
  markLoanDefaultController,
  getAllDefaultedLoansController,
  getDefaultedLoanByIdController,
} from "./loanDefault.controller.js";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { checkPermissionMiddleware } from "../../common/middlewares/permission.middleware.js";
import { validate } from "../../common/middlewares/zod.middleware.js";
import { loanDefaultParamSchema, loanDefaultQuerySchema } from "./loandefault.schema.js";

const loanDefaultRouter = Router();

loanDefaultRouter.post(
  "/:loanId/check",
  authMiddleware,
  validate(loanDefaultParamSchema, "params"),
  checkPermissionMiddleware("CHECK_LOAN_DEFAULT"),
  markLoanDefaultController,
);

loanDefaultRouter.get(
  "/defaulted",
  authMiddleware,
  checkPermissionMiddleware("VIEW_DEFAULTED_LOANS"),
  getAllDefaultedLoansController,
);

loanDefaultRouter.get(
  "/defaulted/:loanId",
  authMiddleware,
  validate(loanDefaultParamSchema, "params"),
  checkPermissionMiddleware("VIEW_DEFAULTED_LOANS"),
  getDefaultedLoanByIdController,
);

export default loanDefaultRouter; 