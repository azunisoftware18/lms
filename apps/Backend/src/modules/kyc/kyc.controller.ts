import { Request, Response } from "express";
import {
  uploadKycDocumentService,
  verifyDocumentService,
  rejectDocumentService,
  getMyKycService,
  getAllKycService,
  createRequiredKycDocumentService,
  getRequiredKycDocumentsService,
} from "./kyc.service.js";
import logger from "../../common/logger.js";

/** Safely extract a string route param regardless of Express type widening */
function getStringParam(param: string | string[] | undefined): string {
  if (Array.isArray(param)) return param[0];
  return param ?? "";
}

export const uploadKycDocumentController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = getStringParam(req.params.id);

    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const isAdmin = req.user.role === "SUPER_ADMIN" || req.user.role === "ADMIN";
    if (!isAdmin && req.user.id !== id) {
      return res.status(403).json({ success: false, message: "Forbidden: you may only upload documents for your own KYC" });
    }

    const files = req.files as Record<string, Express.Multer.File[]>;
    const documents = [];

    if (files?.aadhaar_front) {
      documents.push({
        documentType: "AADHAAR_FRONT",
        documentPath: files.aadhaar_front[0].path,
      });
    }
    if (files?.aadhaar_back) {
      documents.push({
        documentType: "AADHAAR_BACK",
        documentPath: files.aadhaar_back[0].path,
      });
    }
    if (files?.pan_card) {
      documents.push({
        documentType: "PAN_CARD",
        documentPath: files.pan_card[0].path,
      });
    }
    if (files?.photo) {
      documents.push({
        documentType: "PHOTO",
        documentPath: files.photo[0].path,
      });
    }

    if (documents.length === 0) {
      return res.status(400).json({ success: false, message: "No valid files uploaded" });
    }

    const result = await uploadKycDocumentService({
      userId: id,
      documents,
      branchId: req.user?.branchId,
    });

    res.status(201).json({
      success: true,
      message: "KYC document uploaded successfully",
      data: result,
    });
  } catch (error: any) {
    logger.error("KYC Document Upload Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload KYC document",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
};

//Todo add document checklist by role

export const verifyKycController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const id = getStringParam(req.params.id);
    const doc = await verifyDocumentService(id, req.user.id);
    return res.status(200).json({ success: true, data: doc });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status((error as any).statusCode || 500)
        .json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getMyKycController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const kyc = await getMyKycService(req.user.id);

    res.json({
      success: true,
      data: kyc,
    });
  } catch (error: any) {
    logger.error("Get My KYC Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch KYC data",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
};



export const getAllKycController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const kycList = await getAllKycService({
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      q: typeof req.query.q === 'string' ? req.query.q : undefined,
    },
      {
        id: req.user.id,
        role: req.user.role,
        branchId: req.user.branchId
      });
    res.json({
      success: true,
      data: kycList,
    });
  }
  catch (error: any) {
    logger.error("Get All KYC Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch KYC data",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
}

export const rejectKycController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const id = getStringParam(req.params.id);
    const reason = typeof req.body?.reason === "string" ? req.body.reason : undefined;
    const doc = await rejectDocumentService(id, req.user.id, reason);
    return res.status(200).json({ success: true, data: doc });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status((error as any).statusCode || 500)
        .json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const createRequiredKycDocumentController = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only SUPER_ADMIN can configure required KYC documents",
      });
    }

    const created = await createRequiredKycDocumentService(req.body, {
      id: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Required KYC document created successfully",
      data: created,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status((error as any).statusCode || 500)
        .json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getRequiredKycDocumentsController = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const includeInactive =
      req.user.role === "SUPER_ADMIN" && req.query.includeInactive === "true";

    const documents = await getRequiredKycDocumentsService(includeInactive);

    return res.status(200).json({
      success: true,
      data: documents,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status((error as any).statusCode || 500)
        .json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};