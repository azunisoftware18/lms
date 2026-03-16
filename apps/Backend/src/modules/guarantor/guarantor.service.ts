import { prisma } from "../../db/prismaService.js";
import path from "path";
import fs from "fs";
import { AppError } from "../../common/utils/apiError.js";
import { logAction } from "../../audit/audit.helper.js";

type RequestUserContext = {
  id: string;
  role: string;
  branchId?: string | null;
};

const assertBranchAccess = (
  requester: RequestUserContext | undefined,
  branchId: string,
) => {
  if (typeof branchId !== "string" || branchId.trim().length === 0) {
    throw AppError.forbidden("Invalid branch context");
  }
  if (!requester) return;
  if (requester.role === "SUPER_ADMIN" || requester.role === "ADMIN") return;
  if (!requester.branchId || requester.branchId !== branchId) {
    throw AppError.forbidden("Access denied for branch resources");
  }
};

export async function uploadGuarantorDocumentsService(
  guarantorId: string,
  documents: {
    documentType: string;
    documentPath: string;
    uploadedBy: string;
  }[],
  requester?: RequestUserContext,
) {
  return prisma.$transaction(async (tx) => {
    /* 1️⃣ Resolve guarantor + branch */
    const guarantor = await tx.guarantor.findUnique({
      where: { id: guarantorId },
      select: {
        kycId: true,
        loanApplication: { select: { branchId: true, id: true } },
      },
    });

    if (!guarantor) throw AppError.notFound("Guarantor not found");

    if (!guarantor.loanApplication) {
      throw AppError.notFound("Loan application for guarantor not found");
    }

    const branchId = guarantor.loanApplication.branchId;
    const loanApplicationId = guarantor.loanApplication.id;
    assertBranchAccess(requester, branchId);

    /* 2️⃣ Get or create KYC for this guarantor */
    let kycId = guarantor.kycId;
    if (!kycId) {
      const uploadedBy = documents[0]?.uploadedBy ?? requester?.id ?? "";
      const kyc = await tx.kyc.create({
        data: {
          userId: uploadedBy,
          status: "PENDING",
        },
      });
      kycId = kyc.id;

      await tx.guarantor.update({
        where: { id: guarantorId },
        data: { kycId },
      });
    }

    /* 3️⃣ Check for already uploaded document types */
    const existingDocs = await tx.document.findMany({
      where: { guarantorId },
      select: { documentType: true },
    });

    const existingTypes = new Set(existingDocs.map((d) => d.documentType));
    const duplicateDocs = documents
      .map((d) => d.documentType)
      .filter((type) => existingTypes.has(type));

    if (duplicateDocs.length > 0) {
      const err: any = AppError.conflict(
        `Document(s) already uploaded: ${duplicateDocs.join(", ")}`,
      );
      err.duplicateDocs = duplicateDocs;
      throw err;
    }

    /* 4️⃣ Insert documents */
    await tx.document.createMany({
      data: documents.map((doc) => ({
        documentType: doc.documentType,
        documentPath: doc.documentPath,
        uploadedBy: doc.uploadedBy,
        kycId,
        branchId,
        loanApplicationId,
        guarantorId,
      })),
    });

    await logAction({
      action: "UPLOAD_DOCUMENT",
      performedBy: documents[0]?.uploadedBy ?? requester?.id ?? "SYSTEM",
      entityType: "DOCUMENT",
      entityId: guarantorId,
      branchId,
      oldValue: null,
      newValue: {
        target: "guarantor",
        count: documents.length,
        documentTypes: documents.map((d) => d.documentType),
      },
    });

    return tx.document.findMany({
      where: { guarantorId },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        documentType: true,
        documentPath: true,
        verificationStatus: true,
        verified: true,
        verifiedAt: true,
        rejectionReason: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  });
}

export async function reuploadGuarantorDocumentService(
  guarantorId: string,
  documentType: string,
  file: {
    filename: string;
    path: string;
    uploadedBy: string;
  },
  requester?: RequestUserContext,
) {
  return prisma.$transaction(async (tx) => {
    const guarantor = await tx.guarantor.findUnique({
      where: { id: guarantorId },
      select: { loanApplication: { select: { branchId: true } } },
    });

    if (!guarantor) throw AppError.notFound("Guarantor not found");

    const branchId = guarantor.loanApplication.branchId;
    assertBranchAccess(requester, branchId);

    const existingDoc = await tx.document.findFirst({
      where: { guarantorId, documentType },
    });

    if (!existingDoc) {
      throw AppError.notFound(
        `Document ${documentType} not found. Upload first.`,
      );
    }

    /* 2️⃣ Delete old file from disk */
    if (existingDoc.documentPath) {
      const oldFilePath = path.join(
        process.cwd(),
        "public",
        existingDoc.documentPath,
      );
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    const updatedDoc = await tx.document.update({
      where: { id: existingDoc.id },
      data: {
        documentPath: `/uploads/${file.filename}`,
        uploadedBy: file.uploadedBy,
        verificationStatus: "pending",
        rejectionReason: null,
        verified: false,
        verifiedBy: null,
        verifiedAt: null,
      },
      select: {
        id: true,
        documentType: true,
        documentPath: true,
        verificationStatus: true,
        verified: true,
        verifiedAt: true,
        rejectionReason: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await logAction({
      action: "REUPLOAD_DOCUMENT",
      performedBy: file.uploadedBy,
      entityType: "DOCUMENT",
      entityId: existingDoc.id,
      branchId,
      oldValue: {
        documentPath: existingDoc.documentPath,
        verificationStatus: existingDoc.verificationStatus,
      },
      newValue: {
        documentPath: updatedDoc.documentPath,
        verificationStatus: updatedDoc.verificationStatus,
      },
    });

    return updatedDoc;
  });
}

export async function verifyGuarantorDocumentService(
  documentId: string,
  userId: string,
) {
  return prisma.$transaction(async (tx) => {
    const existingDoc = await tx.document.findUnique({
      where: { id: documentId },
      select: {
        id: true,
        guarantorId: true,
        kycId: true,
        verificationStatus: true,
      },
    });

    if (!existingDoc) throw AppError.notFound("Document not found");
    if (!existingDoc.guarantorId)
      throw AppError.badRequest("Document does not belong to a guarantor");

    const document = await tx.document.update({
      where: { id: documentId },
      data: {
        verified: true,
        verifiedBy: userId,
        verifiedAt: new Date(),
        verificationStatus: "verified",
      },
      select: {
        id: true,
        documentType: true,
        documentPath: true,
        verificationStatus: true,
        verified: true,
        verifiedAt: true,
        rejectionReason: true,
        createdAt: true,
        updatedAt: true,
        kycId: true,
      },
    });

    if (document.kycId) {
      const unverifiedCount = await tx.document.count({
        where: {
          kycId: document.kycId,
          verificationStatus: { not: "verified" },
        },
      });

      if (unverifiedCount === 0) {
        await tx.kyc.update({
          where: { id: document.kycId },
          data: {
            status: "VERIFIED",
            verifiedBy: userId,
            verifiedAt: new Date(),
          },
        });
      }
    }

    await logAction({
      action: "VERIFY_DOCUMENT",
      performedBy: userId,
      entityType: "DOCUMENT",
      entityId: documentId,
      branchId: "",
      oldValue: { verificationStatus: existingDoc.verificationStatus },
      newValue: { verificationStatus: "verified" },
    });

    return document;
  });
}

export async function getAllGuarantorsInLoanService(
  loanApplicationId: string,
  requester?: RequestUserContext,
) {
  const loan = await prisma.loanApplication.findUnique({
    where: { id: loanApplicationId },
    select: { branchId: true },
  });

  if (!loan) throw AppError.notFound("Loan application not found");

  assertBranchAccess(requester, loan.branchId);

  return prisma.guarantor.findMany({
    where: { loanApplicationId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      contactNumber: true,
      email: true,
      employmentType: true,
      createdAt: true,
      updatedAt: true,
      kyc: {
        select: {
          id: true,
          status: true,
          verifiedAt: true,
        },
      },
      documents: {
        select: {
          id: true,
          documentType: true,
          verificationStatus: true,
          verified: true,
          verifiedAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}
