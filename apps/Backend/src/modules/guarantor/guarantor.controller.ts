import { NextFunction, Request, Response } from "express";
import {
  uploadGuarantorDocumentsService,
  reuploadGuarantorDocumentService,
  verifyGuarantorDocumentService,
  getAllGuarantorsInLoanService,
} from "./guarantor.service.js";
import { cleanupFiles } from "../../common/utils/cleanup.js";
import { guarantorDocumentTypeSchema } from "./guarantor.schema.js";
import { AppError } from "../../common/utils/apiError.js";

export const uploadGuarantorDocumentsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const guarantorId =
      typeof req.params.guarantorId === "string"
        ? req.params.guarantorId
        : req.params.guarantorId[0];

    if (!req.user) throw AppError.unauthorized("Unauthorized");

    if (!req.files || !(req.files instanceof Array)) {
      throw AppError.badRequest("No documents uploaded");
    }

    const documents = req.files.map((file: Express.Multer.File) => ({
      documentType: file.fieldname,
      documentPath: `/uploads/${file.filename}`,
      uploadedBy: req.user!.id,
    }));

    for (const doc of documents) {
      const parsed = guarantorDocumentTypeSchema.safeParse(doc.documentType);
      if (!parsed.success) {
        throw AppError.badRequest(
          `Invalid document type '${doc.documentType}'. Allowed values: ${guarantorDocumentTypeSchema.options.join(", ")}`,
        );
      }
    }

    const uploadedDocuments = await uploadGuarantorDocumentsService(
      guarantorId,
      documents,
      { id: req.user.id, role: req.user.role, branchId: req.user.branchId },
    );

    return res.status(201).json({
      success: true,
      message: "Guarantor documents uploaded successfully",
      data: uploadedDocuments,
    });
  } catch (error) {
    if (req.files && req.files instanceof Array) {
      cleanupFiles(req.files);
    }
    next(error);
  }
};

export const reuploadGuarantorDocumentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const guarantorId =
      typeof req.params.guarantorId === "string"
        ? req.params.guarantorId
        : req.params.guarantorId[0];
    const documentType =
      typeof req.params.documentType === "string"
        ? req.params.documentType
        : req.params.documentType[0];

    const parsedDocumentType =
      guarantorDocumentTypeSchema.safeParse(documentType);
    if (!parsedDocumentType.success) {
      throw AppError.badRequest(
        `Invalid document type '${documentType}'. Allowed values: ${guarantorDocumentTypeSchema.options.join(", ")}`,
      );
    }

    if (!req.user) throw AppError.unauthorized("Unauthorized");
    if (!req.file) throw AppError.badRequest("No document uploaded");

    const updatedDoc = await reuploadGuarantorDocumentService(
      guarantorId,
      parsedDocumentType.data,
      {
        filename: req.file.filename,
        path: req.file.path,
        uploadedBy: req.user.id,
      },
      { id: req.user.id, role: req.user.role, branchId: req.user.branchId },
    );

    return res.status(200).json({
      success: true,
      message: "Document re-uploaded successfully",
      data: updatedDoc,
    });
  } catch (error) {
    if (req.file) {
      cleanupFiles([req.file]);
    }
    next(error);
  }
};

export const verifyGuarantorDocumentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) throw AppError.unauthorized("Unauthorized");

    const documentId =
      typeof req.params.documentId === "string"
        ? req.params.documentId
        : req.params.documentId[0];

    const document = await verifyGuarantorDocumentService(
      documentId,
      req.user.id,
    );

    return res.status(200).json({
      success: true,
      message: "Guarantor document verified successfully",
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllGuarantorsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) throw AppError.unauthorized("Unauthorized");

    const loanApplicationId =
      typeof req.params.loanApplicationId === "string"
        ? req.params.loanApplicationId
        : req.params.loanApplicationId[0];

    const guarantors = await getAllGuarantorsInLoanService(loanApplicationId, {
      id: req.user.id,
      role: req.user.role,
      branchId: req.user.branchId,
    });

    return res.status(200).json({
      success: true,
      message: "Guarantors fetched successfully",
      data: guarantors,
    });
  } catch (error) {
    next(error);
  }
};
