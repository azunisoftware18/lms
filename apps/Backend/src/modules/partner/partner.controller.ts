import e, { Request, Response } from "express";
import {
  createPartnerService,
  getAllPartnerService,
  getPartnerByIdService,
  updatePartnerService,
  createPartnerLeadService,
  createPartnerLoanApplicationService,
  createChildPartnerService,
  getPartnerByCodeService,
  updatePartnerPerformanceMetricsService,
  getPartnerDashboardService,
} from "./partner.service.js";
import {
  uploadPartnerDocumentService,
  getPartnerDocumentsService,
  updateDocumentVerificationService,
  deletePartnerDocumentService,
  checkPartnerDocumentCompletionService,
  bulkUploadPartnerDocumentsService,
} from "./partnerDocument.service.js";
import {
  generateKYCVerificationReportService,
  approvePartnerKYCService,
  rejectPartnerKYCService,
} from "./partnerVerification.service.js";
import logger from "../../common/logger.js";
import * as Enums from "../../../generated/prisma-client/enums.js";
import { createPartnerSchema } from "./partner.schema.js";

function sanitizeError(error: any) {
  return {
    message: error?.message ?? String(error),
    name: error?.name ?? "Error",
    code: error?.code ?? null,
    stack: error?.stack ?? null,
  };
}

function toSingleParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

function parseDocumentTypes(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.flatMap((item) => parseDocumentTypes(item));
  }

  if (typeof raw === "string") {
    const value = raw.trim();
    if (!value) return [];

    if (value.startsWith("[") && value.endsWith("]")) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => String(item).trim()).filter(Boolean);
        }
      } catch {
        // fall through and treat as plain string
      }
    }

    if (value.includes(",")) {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [value];
  }

  return [];
}

// ==================== BASIC PARTNER MANAGEMENT ====================

export const createPartnerController = async (req: Request, res: Response) => {
  try {
    // Support multipart/form-data by allowing frontend to send a `data` field (JSON string)
    // and file uploads under the `documents` field. Example: form-data with key `data` = JSON.stringify(partnerPayload)
    let bodyData: any = req.body;
    if (req.body && typeof req.body.data === "string") {
      try {
        bodyData = JSON.parse(req.body.data);
      } catch (e) {
        // If parsing fails, keep raw body (fallback)
      }
    }

    // Validate parsed partner payload with Zod schema
    try {
      bodyData = createPartnerSchema.parse(bodyData);
    } catch (zerr: any) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid request data",
          errors: zerr.errors || zerr.message,
        });
    }

    const { user, partner } = await createPartnerService(bodyData);
    const { password: _pw, ...safeUser } = user;

    // If files were uploaded, handle document creation. Frontend should send an array of documentTypes
    // inside the `data` payload with key `documentTypes` where each entry corresponds to the file index.
    const files = (req.files as Express.Multer.File[]) || [];
    const rawDocumentTypes = req.body?.documentTypes;
    const documentTypes = parseDocumentTypes(rawDocumentTypes);

    if (
      files.length > 0 &&
      documentTypes.length > 0 &&
      documentTypes.length !== files.length
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid documentTypes payload",
        errors: `Expected ${files.length} documentTypes, received ${documentTypes.length}`,
      });
    }

    const uploadedDocuments = [] as any[];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const docType = documentTypes[i] || "KYC_DOCUMENT";
      try {
        const doc = await uploadPartnerDocumentService({
          partnerId: partner.id,
          documentType: docType,
          documentPath: file.path,
          uploadedBy: req.user?.id || "",
          branchId: req.user?.branchId || "",
        });
        uploadedDocuments.push(doc);
      } catch (err) {
        // Log and continue with other files
        logger.error(
          "upload during partner creation failed",
          sanitizeError(err),
        );
      }
    }

    res.status(201).json({
      success: true,
      message: "Partner created successfully",
      data: {
        user: safeUser,
        partner,
        uploadedDocuments,
      },
    });
  } catch (error: any) {
    if (error.message && error.message.includes("already exists")) {
      return res.status(409).json({ success: false, message: error.message });
    }
    logger.error("createPartnerController error", sanitizeError(error));
    res.status(500).json({
      success: false,
      message: "Partner creation failed",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
};

export const getAllPartnersController = async (req: Request, res: Response) => {
  try {
    const partners = await getAllPartnerService({
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      q: req.query.q?.toString(),
    });
    res.status(200).json({
      success: true,
      message: "Partners retrieved successfully",
      data: partners,
    });
  } catch (error: any) {
    logger.error("getAllPartnersController error", sanitizeError(error));
    res.status(500).json({
      success: false,
      message: "Failed to retrieve partners",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
};

export const getPartnerByIdController = async (req: Request, res: Response) => {
  try {
    const id =
      typeof req.params.id === "string" ? req.params.id : req.params.id[0];
    const partner = await getPartnerByIdService(id);
    res.status(200).json({
      success: true,
      message: "Partner retrieved successfully",
      data: partner,
    });
  } catch (error: any) {
    if (error.message && error.message.includes("not found")) {
      return res.status(404).json({ success: false, message: error.message });
    }
    logger.error("getPartnerByIdController error", sanitizeError(error));
    res.status(500).json({
      success: false,
      message: "Failed to retrieve partner",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
};

export const getPartnerByCodeController = async (
  req: Request,
  res: Response,
) => {
  try {
    const code = toSingleParam(req.params.code);
    const partner = await getPartnerByCodeService(code);
    res.status(200).json({
      success: true,
      message: "Partner retrieved successfully",
      data: partner,
    });
  } catch (error: any) {
    if (error.message && error.message.includes("not found")) {
      return res.status(404).json({ success: false, message: error.message });
    }
    logger.error("getPartnerByCodeController error", sanitizeError(error));
    res.status(500).json({
      success: false,
      message: "Failed to retrieve partner",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
};

export const updatePartnerController = async (req: Request, res: Response) => {
  const id =
    typeof req.params.id === "string" ? req.params.id : req.params.id[0];
  const updateData = req.body;
  try {
    const updatedPartner = await updatePartnerService(id, updateData);
    res.status(200).json({
      success: true,
      message: "Partner updated successfully",
      data: updatedPartner,
    });
  } catch (error: any) {
    if (error.message && error.message.includes("not found")) {
      return res.status(404).json({ success: false, message: error.message });
    }
    logger.error("updatePartnerController error", sanitizeError(error));
    res.status(500).json({
      success: false,
      message: "Failed to update partner",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
};

// ==================== PARTNER DOCUMENT MANAGEMENT ====================

export const uploadPartnerDocumentController = async (
  req: Request,
  res: Response,
) => {
  try {
    const partnerId =
      toSingleParam(req.params.partnerId) || req.body?.partnerId;
    const { documentType, documentPath } = req.body;
    const userId = req.user?.id;
    const files = (req.files as Express.Multer.File[]) || [];
    const documentTypes = parseDocumentTypes(
      req.body?.documentTypes ?? documentType,
    );

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    if (!partnerId) {
      return res.status(400).json({
        success: false,
        message: "Partner ID is required",
      });
    }

    if (
      files.length > 0 &&
      documentTypes.length > 0 &&
      documentTypes.length !== files.length
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid documentTypes payload",
        errors: `Expected ${files.length} documentTypes, received ${documentTypes.length}`,
      });
    }

    if (files.length > 0) {
      const uploadedDocuments = [] as any[];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const mappedType = documentTypes[i] || "KYC_DOCUMENT";

        const uploaded = await uploadPartnerDocumentService({
          partnerId,
          documentType: mappedType,
          documentPath: file.path,
          uploadedBy: userId,
          branchId: req.user?.branchId || "",
        });

        uploadedDocuments.push(uploaded);
      }

      return res.status(201).json({
        success: true,
        message: "Documents uploaded successfully",
        data: uploadedDocuments,
        uploadedDocuments,
      });
    }

    const document = await uploadPartnerDocumentService({
      partnerId,
      documentType,
      documentPath,
      uploadedBy: userId,
      branchId: req.user?.branchId || "",
    });

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      data: document,
    });
  } catch (error: any) {
    if (error.message && error.message.includes("already exists")) {
      return res.status(409).json({ success: false, message: error.message });
    }
    logger.error("uploadPartnerDocumentController error", sanitizeError(error));
    res.status(500).json({
      success: false,
      message: "Failed to upload document",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
};

export const getPartnerDocumentsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const partnerId = toSingleParam(req.params.partnerId);
    const documents = await getPartnerDocumentsService(partnerId);
    res.status(200).json({
      success: true,
      message: "Documents retrieved successfully",
      data: documents,
    });
  } catch (error: any) {
    logger.error("getPartnerDocumentsController error", sanitizeError(error));
    res.status(500).json({
      success: false,
      message: "Failed to retrieve documents",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
};

export const updateDocumentVerificationController = async (
  req: Request,
  res: Response,
) => {
  try {
    const documentId = toSingleParam(req.params.documentId);
    const { verificationStatus, rejectionReason } = req.body;
    const userId = req.user?.id;

    const document = await updateDocumentVerificationService({
      documentId,
      verificationStatus,
      verifiedBy: userId,
      rejectionReason,
    });

    res.status(200).json({
      success: true,
      message: "Document verification updated successfully",
      data: document,
    });
  } catch (error: any) {
    logger.error(
      "updateDocumentVerificationController error",
      sanitizeError(error),
    );
    res.status(500).json({
      success: false,
      message: "Failed to update document verification",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
};

export const deletePartnerDocumentController = async (
  req: Request,
  res: Response,
) => {
  try {
    const documentId = toSingleParam(req.params.documentId);
    await deletePartnerDocumentService(documentId);
    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error: any) {
    logger.error("deletePartnerDocumentController error", sanitizeError(error));
    res.status(500).json({
      success: false,
      message: "Failed to delete document",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
};

export const checkDocumentCompletionController = async (
  req: Request,
  res: Response,
) => {
  try {
    const partnerId = toSingleParam(req.params.partnerId);
    const completion = await checkPartnerDocumentCompletionService(partnerId);
    res.status(200).json({
      success: true,
      message: "Document completion checked successfully",
      data: completion,
    });
  } catch (error: any) {
    logger.error(
      "checkDocumentCompletionController error",
      sanitizeError(error),
    );
    res.status(500).json({
      success: false,
      message: "Failed to check document completion",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
};

// ==================== PARTNER VERIFICATION & KYC ====================

export const generateKYCReportController = async (
  req: Request,
  res: Response,
) => {
  try {
    const partnerId = toSingleParam(req.params.partnerId);
    const report = await generateKYCVerificationReportService(
      partnerId,
      req.user?.id,
    );
    res.status(200).json({
      success: true,
      message: "KYC report generated successfully",
      data: report,
    });
  } catch (error: any) {
    logger.error("generateKYCReportController error", sanitizeError(error));
    res.status(500).json({
      success: false,
      message: "Failed to generate KYC report",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
};

export const approvePartnerKYCController = async (
  req: Request,
  res: Response,
) => {
  try {
    const partnerId = toSingleParam(req.params.partnerId);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    const partner = await approvePartnerKYCService(partnerId, userId);
    res.status(200).json({
      success: true,
      message: "Partner KYC approved successfully",
      data: partner,
    });
  } catch (error: any) {
    logger.error("approvePartnerKYCController error", sanitizeError(error));
    res.status(500).json({
      success: false,
      message: "Failed to approve partner KYC",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
};

export const rejectPartnerKYCController = async (
  req: Request,
  res: Response,
) => {
  try {
    const partnerId = toSingleParam(req.params.partnerId);
    const { rejectionReason } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    const partner = await rejectPartnerKYCService(
      partnerId,
      rejectionReason,
      userId,
    );
    res.status(200).json({
      success: true,
      message: "Partner KYC rejected successfully",
      data: partner,
    });
  } catch (error: any) {
    logger.error("rejectPartnerKYCController error", sanitizeError(error));
    res.status(500).json({
      success: false,
      message: "Failed to reject partner KYC",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
};

// ==================== PARTNER PERFORMANCE & METRICS ====================

export const updatePartnerPerformanceController = async (
  req: Request,
  res: Response,
) => {
  try {
    const partnerId = toSingleParam(req.params.partnerId);
    const metrics = req.body;
    const updated = await updatePartnerPerformanceMetricsService(
      partnerId,
      metrics,
    );
    res.status(200).json({
      success: true,
      message: "Partner performance metrics updated successfully",
      data: updated,
    });
  } catch (error: any) {
    logger.error(
      "updatePartnerPerformanceController error",
      sanitizeError(error),
    );
    res.status(500).json({
      success: false,
      message: "Failed to update partner performance metrics",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
};

export const getPartnerDashboardController = async (
  req: Request,
  res: Response,
) => {
  try {
    const partnerId = toSingleParam(req.params.partnerId);
    const dashboard = await getPartnerDashboardService(partnerId);
    res.status(200).json({
      success: true,
      message: "Partner dashboard data retrieved successfully",
      data: dashboard,
    });
  } catch (error: any) {
    logger.error("getPartnerDashboardController error", sanitizeError(error));
    res.status(500).json({
      success: false,
      message: "Failed to retrieve partner dashboard",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
};

// ==================== PARTNER LEADS & APPLICATIONS ====================

export const createPartnerLeadController = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }
    const leads = await createPartnerLeadService(req.body, userId);
    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: leads,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to create lead",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
};

export const createPartnerLoanApplicationController = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.user)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    const loanApplication = await createPartnerLoanApplicationService(
      req.body,
      {
        id: req.user.id,
        role: req.user.role as Enums.Role,
      },
    );
    res.status(201).json({
      success: true,
      message: "Loan application created successfully",
      data: loanApplication,
    });
  } catch (error: any) {
    logger.error(
      "createPartnerLoanApplicationController error",
      sanitizeError(error),
    );
    res.status(500).json({
      success: false,
      message: "Failed to create loan application",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
};

export const createChildPartnerController = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const childPartner = await createChildPartnerService(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: "Child partner created successfully",
      data: childPartner,
    });
  } catch (error: any) {
    logger.error("createChildPartnerController error", sanitizeError(error));
    res.status(500).json({
      success: false,
      message: "Failed to create child partner",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
};
