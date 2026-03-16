import { Router } from "express";
import {
  uploadGuarantorDocumentsController,
  reuploadGuarantorDocumentController,
  verifyGuarantorDocumentController,
  getAllGuarantorsController,
} from "./guarantor.controller.js";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import upload from "../../common/middlewares/multer.middleware.js";
import { checkPermissionMiddleware } from "../../common/middlewares/permission.middleware.js";
import { validate } from "../../common/middlewares/zod.middleware.js";
import { createRateLimiter } from "../../common/middlewares/rateLimit.middleware.js";
import {
  guarantorIdParamSchema,
  guarantorReuploadParamSchema,
  guarantorDocumentIdParamSchema,
  guarantorLoanParamSchema,
} from "./guarantor.schema.js";

const guarantorRouter = Router();

const guarantorDocumentLimiter = createRateLimiter({
  windowMs: 60_000,
  max: 20,
  message: "Too many guarantor document requests. Please try again later.",
  keyScope: "user",
});

// Upload guarantor documents
guarantorRouter.post(
  "/documents/:guarantorId/upload",
  authMiddleware,
  guarantorDocumentLimiter,
  validate(guarantorIdParamSchema, "params"),
  checkPermissionMiddleware("UPLOAD_DOCUMENTS"),
  upload.any(),
  uploadGuarantorDocumentsController,
);

// Re-upload a specific guarantor document
guarantorRouter.put(
  "/documents/:guarantorId/:documentType/reupload",
  authMiddleware,
  guarantorDocumentLimiter,
  validate(guarantorReuploadParamSchema, "params"),
  checkPermissionMiddleware("UPLOAD_DOCUMENTS"),
  upload.single("document"),
  reuploadGuarantorDocumentController,
);

// Verify a guarantor document
guarantorRouter.put(
  "/documents/:documentId/verify",
  authMiddleware,
  validate(guarantorDocumentIdParamSchema, "params"),
  checkPermissionMiddleware("VERIFY_DOCUMENT"),
  verifyGuarantorDocumentController,
);

// Get all guarantors for a loan
guarantorRouter.get(
  "/loan/:loanApplicationId",
  authMiddleware,
  validate(guarantorLoanParamSchema, "params"),
  checkPermissionMiddleware("VIEW_COAPPLICANTS"),
  getAllGuarantorsController,
);

export default guarantorRouter;
