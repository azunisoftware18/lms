import { NextFunction, Request, Response } from "express";
import {
  getAllCoApplicantInLoanService,
  reuploadCoApplicantDocumentService,
  uploadDocumentsService,
  verifyCoApplicantDocumentService,
} from "./coApplicant.service.js";
import { cleanupFiles } from "../../common/utils/cleanup.js";
import { coApplicantDocumentTypeSchema } from "./coApplicant.schema.js";
import { AppError } from "../../common/utils/apiError.js";

export const uploadCoApplicantDocumentsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const coApplicantId =
      typeof req.params.coApplicantId === "string"
        ? req.params.coApplicantId
        : req.params.coApplicantId[0];
    if (!req.user) {
      throw AppError.unauthorized("Unauthorized");
    }
    const userId = req.user.id;

    if (!req.files || !(req.files instanceof Array)) {
      throw AppError.badRequest("No documents uploaded");
    }

    const documents = req.files.map((file: Express.Multer.File) => ({
      documentType: file.fieldname, // e.g. PAN, AADHAAR, PHOTO
      documentPath: `/uploads/${file.filename}`, // public path
      uploadedBy: userId,
    }));

    for (const doc of documents) {
      const parsed = coApplicantDocumentTypeSchema.safeParse(doc.documentType);
      if (!parsed.success) {
        throw AppError.badRequest(
          `Invalid document type '${doc.documentType}'. Allowed values: ${coApplicantDocumentTypeSchema.options.join(", ")}`,
        );
      }
    }

    const uploadedDocuments = await uploadDocumentsService(
      "coApplicant",
      coApplicantId,
      documents,
      {
        id: req.user.id,
        role: req.user.role,
        branchId: req.user.branchId,
      },
    );

    return res.status(201).json({
      success: true,
      message: "Co-applicant documents uploaded successfully",
      data: uploadedDocuments,
    });
  } catch (error) {
    if (req.files && req.files instanceof Array) {
      cleanupFiles(req.files); // 🧹 remove uploaded files
    }
    next(error);
  }
};


export const reuploadCoApplicantDocumentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const coApplicantId =
      typeof req.params.coApplicantId === "string"
        ? req.params.coApplicantId
        : req.params.coApplicantId[0];
    const documentType =
      typeof req.params.documentType === "string"
        ? req.params.documentType
        : req.params.documentType[0];

    const parsedDocumentType = coApplicantDocumentTypeSchema.safeParse(documentType);
    if (!parsedDocumentType.success) {
      throw AppError.badRequest(
        `Invalid document type '${documentType}'. Allowed values: ${coApplicantDocumentTypeSchema.options.join(", ")}`,
      );
    }

    if (!req.user) {
      throw AppError.unauthorized("Unauthorized");
    }

    if (!req.file) {
      throw AppError.badRequest("No document uploaded");
    }
    const updatedDoc = await reuploadCoApplicantDocumentService(
      coApplicantId,
      parsedDocumentType.data,
      {
        filename: req.file.filename,
        path: req.file.path,
        uploadedBy: req.user.id,
      },
      {
        id: req.user.id,
        role: req.user.role,
        branchId: req.user.branchId,
      },
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

export const getAllCoApplicantController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const loanApplicationId =
      typeof req.params.loanApplicationId === "string"
        ? req.params.loanApplicationId
        : req.params.loanApplicationId[0];
    if (!req.user) {
      throw AppError.unauthorized("Unauthorized");
    }
    const coApplicants =
      await getAllCoApplicantInLoanService(loanApplicationId, {
        id: req.user.id,
        role: req.user.role,
        branchId: req.user.branchId,
      });
    if (coApplicants.length === 0) {
      throw AppError.notFound("No co-applicants found for this loan application");
    }
    return res.status(200).json({
      success: true,
      message: "Co-applicants fetched successfully",
      data: coApplicants,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyCoApplicantDocumentController = async (
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

    const document = await verifyCoApplicantDocumentService(documentId, {
      id: req.user.id,
      role: req.user.role,
      branchId: req.user.branchId,
    });

    return res.status(200).json({
      success: true,
      message: "Co-applicant document verified successfully",
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

