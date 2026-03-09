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
} from "./loanApplication.controller.js";
import { validate } from "../../common/middlewares/zod.middleware.js";
import {
  createLoanApplicationSchema,
  updateLoanApplicationSchema,
  loanApplicationIdParamSchema,
  approveLoanInputSchema,
  createFullLoanApplicationSchema,
} from "./loanApplication.schema.js";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import upload from "../../common/middlewares/multer.middleware.js";
import { checkPermissionMiddleware } from "../../common/middlewares/permission.middleware.js";
import { markLoanDefaultController } from "../loanDefault/loanDefault.controller.js";

// Define your loan application routes here

loanApplicationRouter.get(
  "/",
  authMiddleware,
  checkPermissionMiddleware("VIEW_LOAN_APPLICATIONS"),
  getAllLoanApplicationsController,
);

loanApplicationRouter.get(
  "/:id",
  authMiddleware,
  validate(loanApplicationIdParamSchema, "params"),
  checkPermissionMiddleware("VIEW_LOAN_APPLICATION"),
  getLoanApplicationByIdController,
);
loanApplicationRouter.put(
  "/:id/status",
  authMiddleware,
  checkPermissionMiddleware("UPDATE_LOAN_STATUS"),
  validate(updateLoanApplicationSchema, "body"),
  validate(loanApplicationIdParamSchema, "params"),
  updateLoanApplicationStatusController,
);
loanApplicationRouter.put(
  "/:id/review",
  authMiddleware,
  checkPermissionMiddleware("REVIEW_LOAN"),
  validate(loanApplicationIdParamSchema, "params"),
  reviewLoanController,
);

loanApplicationRouter.post(
  "/:id/approve",
  authMiddleware,
  checkPermissionMiddleware("APPROVE_LOAN"),
  validate(loanApplicationIdParamSchema, "params"),
  validate(approveLoanInputSchema, "body"),
  approveLoanController,
);
loanApplicationRouter.put(
  "/:id/reject",
  authMiddleware,
  checkPermissionMiddleware("REJECT_LOAN"),
  validate(loanApplicationIdParamSchema, "params"),
  rejectLoanController,
);

loanApplicationRouter.post(
  "/:id/documents",
  authMiddleware,

  validate(loanApplicationIdParamSchema, "params"),
  //checkPermissionMiddleware("UPLOAD_DOCUMENTS"),
  upload.any(),
  uploadLoanDocumentsController,
);
loanApplicationRouter.post(
  "/documents/:id/verify",
  authMiddleware,
  validate(loanApplicationIdParamSchema, "params"),
  //checkPermissionMiddleware("VERIFY_DOCUMENTS"),
  verifyDocumentController,
);
loanApplicationRouter.post(
  "/documents/:id/reject",
  authMiddleware,
  validate(loanApplicationIdParamSchema, "params"),
  checkPermissionMiddleware("VERIFY_DOCUMENTS"),
  rejectDocumentController,
);


loanApplicationRouter.get(
  "/:id/documents",
  authMiddleware,
  validate(loanApplicationIdParamSchema, "params"),
  checkPermissionMiddleware("VIEW_LOAN_APPLICATION"),
  getAlldoumentsforLoanApplicationController
);
  
loanApplicationRouter.post(
  "/loans/:loanId/check-default",
  authMiddleware,
  validate(loanApplicationIdParamSchema, "params"),
  checkPermissionMiddleware("CHECK_LOAN_DEFAULT"),
  markLoanDefaultController,
);

//TODO : Add routes for co-applicant document uploads LIST AND SIZE

loanApplicationRouter.post(
  "/documents/:loanApplicationId/:documentType/reupload",
  authMiddleware,
  checkPermissionMiddleware("UPLOAD_DOCUMENTS"),
  upload.single("document"),
  reuploadLoanDocumentController,
);



loanApplicationRouter.post(
  "/loan/create",
  authMiddleware,
  validate(createFullLoanApplicationSchema, "body"),
  checkPermissionMiddleware("CREATE_LOAN_APPLICATION"),
  createFullLoanApplicationController
);export default loanApplicationRouter;
