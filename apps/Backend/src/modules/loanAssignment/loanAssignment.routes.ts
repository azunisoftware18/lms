import { Router } from "express";

import { 
    assignLoanController,
    unassignLoanController,
    getMyAssignedLoansController
} from "./loanAssignment.controller.js";
 

import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { validate } from "../../common/middlewares/zod.middleware.js";
import { checkPermissionMiddleware } from "../../common/middlewares/permission.middleware.js";
import {
    assignLoanParamSchema,
    assignLoanSchema,
    unassignLoanSchema,
} from "./loanAssignment.schema.js";
import { createRateLimiter } from "../../common/middlewares/rateLimit.middleware.js";

const assignLoanLimiter = createRateLimiter({
    windowMs: 60_000,
    max: 15,
    message: "Too many loan assignment attempts. Please try again in a minute.",
});

const unassignLoanLimiter = createRateLimiter({
    windowMs: 60_000,
    max: 15,
    message: "Too many loan unassignment attempts. Please try again in a minute.",
});

const assignedLoansReadLimiter = createRateLimiter({
    windowMs: 60_000,
    max: 60,
    message: "Too many assigned-loan read requests. Please try again shortly.",
});

const loanAssignmentRouter = Router();


loanAssignmentRouter.post(
  "/loans/:loanApplicationId/assign",
  authMiddleware,
    assignLoanLimiter,
  checkPermissionMiddleware("ASSIGN_LOAN"),
    validate(assignLoanParamSchema, "params"),
  validate(assignLoanSchema),
  assignLoanController,
);

loanAssignmentRouter.post(
    "/loans/unassign/:assignmentId",
    authMiddleware,
        unassignLoanLimiter,
    checkPermissionMiddleware("UNASSIGN_LOAN"),
    validate(unassignLoanSchema, "params"),
    unassignLoanController
)

loanAssignmentRouter.get(
    "/my-assigned-loans",
    authMiddleware,
        assignedLoansReadLimiter,
        checkPermissionMiddleware("VIEW_ASSIGNED_LOANS"),
    getMyAssignedLoansController
)

export default loanAssignmentRouter;
