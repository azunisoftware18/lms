import { Router } from "express";
import {
  createPartnerController,
  createPartnerLeadController,
  getAllPartnersController,
  getPartnerByIdController,
  updatePartnerController,
  getPartnerByCodeController,
  createPartnerLoanApplicationController,
  createChildPartnerController,
  uploadPartnerDocumentController,
  getPartnerDocumentsController,
  updateDocumentVerificationController,
  deletePartnerDocumentController,
  checkDocumentCompletionController,
  generateKYCReportController,
  approvePartnerKYCController,
  rejectPartnerKYCController,
  updatePartnerPerformanceController,
  getPartnerDashboardController,
} from "./partner.controller.js";
import multer from "multer";
import { validate } from "../../common/middlewares/zod.middleware.js";
import {
  createPartnerSchema,
  updatePartnerSchema,
  partnerIdParamSchema,
  createLeadSchema,
} from "./partner.schema.js";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { checkPermissionMiddleware } from "../../common/middlewares/permission.middleware.js";
import { createLoanApplicationSchema } from "../LoanApplication/loanApplication.schema.js";

const partnerRouter = Router();

// Multer setup for partner document uploads
const upload = multer({ dest: "public/uploads/partners" });

// ==================== BASIC PARTNER MANAGEMENT ====================

// Protect all routes
partnerRouter.use(authMiddleware);

partnerRouter.post(
  "/",
  // Accept multipart/form-data with an optional `data` JSON field and files under `documents`
  upload.array("documents"),
  checkPermissionMiddleware("CREATE_PARTNER"),
  createPartnerController,
);

partnerRouter.get(
  "/all",
  checkPermissionMiddleware("VIEW_ALL_PARTNERS"),
  getAllPartnersController,
);

partnerRouter.get(
  "/code/:code",
  validate(partnerIdParamSchema, "params"),
  checkPermissionMiddleware("VIEW_PARTNER_DETAILS"),
  getPartnerByCodeController,
);

partnerRouter.get(
  "/:id",
  validate(partnerIdParamSchema, "params"),
  checkPermissionMiddleware("VIEW_PARTNER_DETAILS"),
  getPartnerByIdController,
);

partnerRouter.patch(
  "/:id",
  validate(partnerIdParamSchema, "params"),
  validate(updatePartnerSchema),
  checkPermissionMiddleware("UPDATE_PARTNER"),
  updatePartnerController,
);

// ==================== PARTNER DOCUMENT MANAGEMENT ====================

partnerRouter.post(
  "/:partnerId/documents/upload",
  validate(partnerIdParamSchema, "params"),
  // accept multipart/form-data files under the `documents` field
  upload.array("documents"),
  checkPermissionMiddleware("UPLOAD_PARTNER_DOCUMENT"),
  uploadPartnerDocumentController,
);

partnerRouter.get(
  "/:partnerId/documents",
  validate(partnerIdParamSchema, "params"),
  checkPermissionMiddleware("VIEW_PARTNER_DOCUMENTS"),
  getPartnerDocumentsController,
);

partnerRouter.patch(
  "/documents/:documentId/verify",
  checkPermissionMiddleware("VERIFY_PARTNER_DOCUMENT"),
  updateDocumentVerificationController,
);

partnerRouter.delete(
  "/documents/:documentId",
  checkPermissionMiddleware("DELETE_PARTNER_DOCUMENT"),
  deletePartnerDocumentController,
);

partnerRouter.get(
  "/:partnerId/documents/completion",
  validate(partnerIdParamSchema, "params"),
  checkPermissionMiddleware("VIEW_PARTNER_DOCUMENTS"),
  checkDocumentCompletionController,
);

// ==================== PARTNER VERIFICATION & KYC ====================

partnerRouter.get(
  "/:partnerId/kyc/report",
  validate(partnerIdParamSchema, "params"),
  checkPermissionMiddleware("VERIFY_PARTNER_KYC"),
  generateKYCReportController,
);

partnerRouter.post(
  "/:partnerId/kyc/approve",
  validate(partnerIdParamSchema, "params"),
  checkPermissionMiddleware("APPROVE_PARTNER_KYC"),
  approvePartnerKYCController,
);

partnerRouter.post(
  "/:partnerId/kyc/reject",
  validate(partnerIdParamSchema, "params"),
  checkPermissionMiddleware("REJECT_PARTNER_KYC"),
  rejectPartnerKYCController,
);

// ==================== PARTNER PERFORMANCE & METRICS ====================

partnerRouter.patch(
  "/:partnerId/performance",
  validate(partnerIdParamSchema, "params"),
  checkPermissionMiddleware("UPDATE_PARTNER_PERFORMANCE"),
  updatePartnerPerformanceController,
);

partnerRouter.get(
  "/:partnerId/dashboard",
  validate(partnerIdParamSchema, "params"),
  checkPermissionMiddleware("VIEW_PARTNER_DASHBOARD"),
  getPartnerDashboardController,
);

// ==================== PARTNER LEADS & APPLICATIONS ====================

partnerRouter.post(
  "/create-lead",
  validate(createLeadSchema),
  checkPermissionMiddleware("CREATE_LEAD"),
  createPartnerLeadController,
);

partnerRouter.post(
  "/create-loan-application",
  validate(createLoanApplicationSchema),
  checkPermissionMiddleware("CREATE_LOAN_APPLICATION"),
  createPartnerLoanApplicationController,
);

partnerRouter.post(
  "/create-child-partner",
  validate(createPartnerSchema),
  checkPermissionMiddleware("CREATE_CHILD_PARTNER"),
  createChildPartnerController,
);

export default partnerRouter;
