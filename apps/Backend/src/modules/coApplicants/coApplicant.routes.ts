import{ Router } from "express";
const coApplicantRouter = Router();
import { getAllCoApplicantController, reuploadCoApplicantDocumentController, uploadCoApplicantDocumentsController } from "./coApplicant.controller.js";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import upload from "../../common/middlewares/multer.middleware.js";
import { checkPermissionMiddleware } from "../../common/middlewares/permission.middleware.js";
import { validate } from "../../common/middlewares/zod.middleware.js";
import { createRateLimiter } from "../../common/middlewares/rateLimit.middleware.js";
import {
  coApplicantIdParamSchema,
  coApplicantLoanParamSchema,
  coApplicantReuploadParamSchema,
} from "./coApplicant.schema.js";

const coApplicantDocumentLimiter = createRateLimiter({
  windowMs: 60_000,
  max: 20,
  message: "Too many co-applicant document requests. Please try again later.",
  keyScope: "user",
});

coApplicantRouter.post(
  "/documents/:coApplicantId/upload",
  authMiddleware,
  coApplicantDocumentLimiter,
  validate(coApplicantIdParamSchema, "params"),
  checkPermissionMiddleware("UPLOAD_DOCUMENTS"),
  upload.any(),
  uploadCoApplicantDocumentsController,
);

coApplicantRouter.put(
    "/documents/:coApplicantId/:documentType/reupload",
    authMiddleware,
  coApplicantDocumentLimiter,
  validate(coApplicantReuploadParamSchema, "params"),
    checkPermissionMiddleware("UPLOAD_DOCUMENTS"),
    upload.single("document"),
    reuploadCoApplicantDocumentController,
)


coApplicantRouter.get(
    "/loan/:loanApplicationId",
    authMiddleware,
  validate(coApplicantLoanParamSchema, "params"),
    checkPermissionMiddleware("VIEW_COAPPLICANTS"),
    getAllCoApplicantController,
    
)

export default coApplicantRouter;