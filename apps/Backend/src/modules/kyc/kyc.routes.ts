import { Router } from "express";
import {
  getMyKycController,
  uploadKycDocumentController,
  verifyKycController,
  rejectKycController,
  getAllKycController,
  createRequiredKycDocumentController,
  getRequiredKycDocumentsController,
} from "./kyc.controller.js";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { checkPermissionMiddleware } from "../../common/middlewares/permission.middleware.js";
import  upload  from "../../common/middlewares/multer.middleware.js";
import { validate } from "../../common/middlewares/zod.middleware.js";
import {
  kycParamSchema,
  rejectDocumentBodySchema,
  createRequiredKycDocumentSchema,
} from "./kyc.schema.js";
const router = Router();

router.post(
  "/document/:id",
  authMiddleware,
  validate(kycParamSchema, "params"),
  upload.fields([
    { name:"aadhaar_front" },
    { name:"aadhaar_back" },
    { name: "pan_card" },
    { name: "photo" }
  ]),
  uploadKycDocumentController
);

router.put(
  "/:id/verify",
  authMiddleware,
  validate(kycParamSchema, "params"),
  checkPermissionMiddleware("VERIFY_DOCUMENT"),
  verifyKycController
);

router.put(
  "/:id/reject",
  authMiddleware,
  validate(kycParamSchema, "params"),
  validate(rejectDocumentBodySchema),
  checkPermissionMiddleware("VERIFY_DOCUMENT"),
  rejectKycController
);

router.get(
  "/me",
  authMiddleware,
  getMyKycController
);

router.get(
  "/all",
  authMiddleware,
  checkPermissionMiddleware("VIEW_KYC"),
  getAllKycController
);

router.post(
  "/required-documents",
  authMiddleware,
  checkPermissionMiddleware("MANAGE_KYC"), // or appropriate permission
  validate(createRequiredKycDocumentSchema),
  createRequiredKycDocumentController,
);
router.get(
  "/required-documents",
  authMiddleware,
  getRequiredKycDocumentsController,
);

export default router;