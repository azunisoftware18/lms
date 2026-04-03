import { Router } from "express";
import {
  disburseLoanController,
  getDisbursementController,
  listDisbursementsController,
  reverseDisbursementController,
} from "./loanDisbursement.controller.js";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { checkPermissionMiddleware } from "../../common/middlewares/permission.middleware.js";
import { disburseLoanSchema } from "./loanDisbursement.schema.js";
import { validate } from "../../common/middlewares/zod.middleware.js";
const loanDisbursementRouter = Router();

loanDisbursementRouter.post(
  "/:id/disburse",
  authMiddleware,
  checkPermissionMiddleware("DISBURSE_LOAN"),
  validate(disburseLoanSchema),
  disburseLoanController

);
loanDisbursementRouter.get("/",
  authMiddleware,
  checkPermissionMiddleware("DISBURSE_LOAN"),
  listDisbursementsController);
loanDisbursementRouter.get("/:loanNumber", 
  authMiddleware,
  checkPermissionMiddleware("DISBURSE_LOAN"), 
  getDisbursementController);
loanDisbursementRouter.post("/:loanNumber/reverse", 
  authMiddleware, 
  checkPermissionMiddleware("DISBURSE_LOAN"),
  reverseDisbursementController);

  
export default loanDisbursementRouter;