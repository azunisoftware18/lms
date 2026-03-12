import { Request, Response, NextFunction } from "express";

const MAX_DOC_FILES = Number(process.env.MAX_DOC_FILES || 15);

function toMulterFiles(req: Request): Express.Multer.File[] {
  if (Array.isArray(req.files)) return req.files as Express.Multer.File[];
  if (req.files && typeof req.files === "object") {
    return Object.values(req.files as Record<string, Express.Multer.File[]>).flat();
  }
  return [];
}

export function validateLoanDocumentUpload(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const files = toMulterFiles(req);

  if (!files.length) {
    return res.status(400).json({
      success: false,
      message: "No documents uploaded",
    });
  }

  if (files.length > MAX_DOC_FILES) {
    return res.status(400).json({
      success: false,
      message: `Too many files. Maximum allowed is ${MAX_DOC_FILES}.`,
    });
  }

  const hasInvalidField = files.some(
    (file) => !/^[a-zA-Z0-9_\-]{2,50}$/.test(file.fieldname),
  );

  if (hasInvalidField) {
    return res.status(400).json({
      success: false,
      message: "Invalid document type field name",
    });
  }

  next();
}
