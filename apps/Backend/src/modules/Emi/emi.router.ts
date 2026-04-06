import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { branchMiddleware } from "../../common/middlewares/branch.middleware.js";
import { createRateLimiter } from "../../common/middlewares/rateLimit.middleware.js";

import {
  applyMoratoriumController,
  editEmiController,
  // forecloseLoanController,
  generateEmiScheduleController,
  generateEmiAmount,
  getLoanEmiController,
  getThisMonthEmiAmountController,
  markEmiPaidController,
  // payforecloseLoanController,
  getEmiPayableAmountController,
  getAllEmisController,
  // processOverdueEmisController,
} from "./emi.controller.js";

import { checkPermissionMiddleware } from "../../common/middlewares/permission.middleware.js";

const emiRouter = Router();

const emiReadLimiter = createRateLimiter({
  windowMs: 60_000,
  max: 120,
  message: "Too many EMI read requests. Please try again later.",
});

const emiWriteLimiter = createRateLimiter({
  windowMs: 60_000,
  max: 60,
  message: "Too many EMI write requests. Please try again later.",
});




emiRouter.get("/", authMiddleware,
  branchMiddleware,
  emiReadLimiter,
  checkPermissionMiddleware("VIEW_EMIS"),
  getAllEmisController);


emiRouter.post(
  "/loan-applications/:id/emis",
  authMiddleware,
  branchMiddleware,
  emiWriteLimiter,
  checkPermissionMiddleware("GENERATE_EMI_SCHEDULE"),
  generateEmiScheduleController
);

emiRouter.get(
  "/loan-applications/:id/emis",
  authMiddleware,
  branchMiddleware,
  emiReadLimiter,
  checkPermissionMiddleware("VIEW_EMIS"),
  getLoanEmiController
);

emiRouter.get(
  "/loan-emis/:loanApplicationId/get-emi-details",
  authMiddleware,
  branchMiddleware,
  emiReadLimiter,
  checkPermissionMiddleware("VIEW_EMIS"),
  getThisMonthEmiAmountController
);
emiRouter.post("/:emiId/pay",
  authMiddleware,
  branchMiddleware,
  emiWriteLimiter,
  checkPermissionMiddleware("EMI_PAID"),
  markEmiPaidController);

// emiRouter.get("/loans/:loanId/foreclose",
//   authMiddleware,
//   branchMiddleware,
//   emiReadLimiter,
//   checkPermissionMiddleware("VIEW_FORECLOSE_AMOUNT"),
//   forecloseLoanController);


emiRouter.post("/loans/:loanId/moratorium",
  authMiddleware,
  branchMiddleware,
  emiWriteLimiter,
  checkPermissionMiddleware("APPLY_MORATORIUM"),
  applyMoratoriumController);

emiRouter.post("/get-emi-amount",
  authMiddleware,
  emiReadLimiter,
  checkPermissionMiddleware("GENERATE_EMI_AMOUNT"),
  generateEmiAmount);

emiRouter.post("/loan-emis/:emiId/edit",
  authMiddleware,
  branchMiddleware,
  emiWriteLimiter,
  checkPermissionMiddleware("EDIT_EMI"),
  editEmiController);
emiRouter.get("/loan-emis/:emiId/payable-amount",
  authMiddleware,
  branchMiddleware,
  emiReadLimiter,
  checkPermissionMiddleware("VIEW_EMI_PAYABLE_AMOUNT"),
  getEmiPayableAmountController);



export default emiRouter;
