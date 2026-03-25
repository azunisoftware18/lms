import { Router } from "express";
const loanApplicationRouter = Router();
import {
  getAllLoanApplicationsController,
  getLoanApplicationByIdController,
  reviewLoanController,
  approveLoanController,
  rejectLoanController,
  updateLoanApplicationStatusController,
  uploadLoanDocumentsController,
  verifyDocumentController,
  rejectDocumentController,
  reuploadLoanDocumentController,
  getAlldoumentsforLoanApplicationController,
  createFullLoanApplicationController,
  listofalldocumentsForLoanApplicationController,
} from "./loanApplication.controller.js";
import { validate } from "../../common/middlewares/zod.middleware.js";
import {
  createLoanApplicationSchema,
  updateLoanApplicationSchema,
  loanApplicationIdParamSchema,
  approveLoanInputSchema,
  createFullLoanApplicationSchema,
  reuploadLoanDocumentParamSchema,
} from "./loanApplication.schema.js";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import upload from "../../common/middlewares/multer.middleware.js";
import { checkPermissionMiddleware } from "../../common/middlewares/permission.middleware.js";
import { markLoanDefaultController } from "../loanDefault/loanDefault.controller.js";
import { createRateLimiter } from "../../common/middlewares/rateLimit.middleware.js";
import { validateLoanDocumentUpload } from "../../common/middlewares/uploadValidation.middleware.js";
import { branchMiddleware } from "../../common/middlewares/branch.middleware.js";

const createLoanApplicationLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 20,
  message: "Too many create loan requests. Please try again later.",
});

const verifyDocumentLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 120,
  message: "Too many document verification requests. Please try again later.",
});

const uploadLoanDocumentsLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,  // 10 minutes
  max: 50,
  message: "Too many document upload requests. Please try again later.",
});

const rejectDocumentLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 120,
  message: "Too many document rejection requests. Please try again later.",
});

const reuploadLoanDocumentsLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 50,
  message: "Too many document reupload requests. Please try again later.",
});

// Define your loan application routes here

loanApplicationRouter.get(
  "/",
  authMiddleware,
  branchMiddleware,
  checkPermissionMiddleware("VIEW_LOAN_APPLICATIONS"),
  getAllLoanApplicationsController,
);

loanApplicationRouter.get(
  "/:id",
  authMiddleware,
  branchMiddleware,
  validate(loanApplicationIdParamSchema, "params"),
  checkPermissionMiddleware("VIEW_LOAN_APPLICATION"),
  getLoanApplicationByIdController,
);
loanApplicationRouter.put(
  "/:id/status",
  authMiddleware,
  branchMiddleware,
  checkPermissionMiddleware("UPDATE_LOAN_STATUS"),
  validate(updateLoanApplicationSchema, "body"),
  validate(loanApplicationIdParamSchema, "params"),
  updateLoanApplicationStatusController,
);
loanApplicationRouter.put(
  "/:id/review",
  authMiddleware,
  branchMiddleware,
  checkPermissionMiddleware("REVIEW_LOAN"),
  validate(loanApplicationIdParamSchema, "params"),
  reviewLoanController,
);

loanApplicationRouter.post(
  "/:id/approve",
  authMiddleware,
  branchMiddleware,
  checkPermissionMiddleware("APPROVE_LOAN"),
  validate(loanApplicationIdParamSchema, "params"),
  validate(approveLoanInputSchema, "body"),
  approveLoanController,
);
loanApplicationRouter.put(
  "/:id/reject",
  authMiddleware,
  branchMiddleware,
  checkPermissionMiddleware("REJECT_LOAN"),
  validate(loanApplicationIdParamSchema, "params"),
  rejectLoanController,
);

loanApplicationRouter.post(
  "/:id/documents",
  authMiddleware,
  branchMiddleware,
  checkPermissionMiddleware("UPLOAD_DOCUMENTS"),
  validate(loanApplicationIdParamSchema, "params"),
  uploadLoanDocumentsLimiter,
  upload.any(),
  validateLoanDocumentUpload,
  uploadLoanDocumentsController,
);
loanApplicationRouter.post(
  "/documents/:id/verify",
  authMiddleware,
  branchMiddleware,
  validate(loanApplicationIdParamSchema, "params"),
  checkPermissionMiddleware("VERIFY_DOCUMENTS"),
  verifyDocumentLimiter,
  verifyDocumentController,
);
loanApplicationRouter.post(
  "/documents/:id/reject",
  authMiddleware,
  branchMiddleware,
  validate(loanApplicationIdParamSchema, "params"),
  checkPermissionMiddleware("VERIFY_DOCUMENTS"),
  rejectDocumentLimiter,
  rejectDocumentController,
);


loanApplicationRouter.get(
  "/:id/documents",
  authMiddleware,
  branchMiddleware,
  validate(loanApplicationIdParamSchema, "params"),
  checkPermissionMiddleware("VIEW_LOAN_APPLICATION"),
  getAlldoumentsforLoanApplicationController
);
  
loanApplicationRouter.post(
  "/loans/:loanId/check-default",
  authMiddleware,
  branchMiddleware,
  validate(loanApplicationIdParamSchema, "params"),
  checkPermissionMiddleware("CHECK_LOAN_DEFAULT"),
  markLoanDefaultController,
);

//TODO : Add routes for co-applicant document uploads LIST AND SIZE

loanApplicationRouter.post(
  "/documents/:loanApplicationId/:documentType/reupload",
  authMiddleware,
  branchMiddleware,
  validate(reuploadLoanDocumentParamSchema, "params"),
  checkPermissionMiddleware("UPLOAD_DOCUMENTS"),
  reuploadLoanDocumentsLimiter,
  upload.single("document"),
  reuploadLoanDocumentController,
);



loanApplicationRouter.post(
  "/loan/create",
  authMiddleware,
  branchMiddleware,
  checkPermissionMiddleware("CREATE_LOAN_APPLICATION"),
  createLoanApplicationLimiter,
  validate(createFullLoanApplicationSchema, "body"),
  createFullLoanApplicationController
);

loanApplicationRouter.get(
  "/:id/documents/list",
  authMiddleware,
  branchMiddleware,
  validate(loanApplicationIdParamSchema, "params"),
  checkPermissionMiddleware("VIEW_LOAN_APPLICATION"),
  listofalldocumentsForLoanApplicationController
);

export default loanApplicationRouter;


