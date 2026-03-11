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
  if (!requester) return;
  if (requester.role === "SUPER_ADMIN" || requester.role === "ADMIN") return;

  if (!requester.branchId || requester.branchId !== branchId) {
    throw AppError.forbidden("Access denied for branch resources");
  }
};

export async function uploadDocumentsService(
  target: "loan" | "coApplicant",
  targetId: string,
  documents: {
    documentType: string;
    documentPath: string;
    uploadedBy: string;
  }[],
  requester?: RequestUserContext,
) {
  return prisma.$transaction(async (tx) => {
    let kycId: string;
    let branchId = "";
    let loanApplicationId: string;
    let whereClause: any = {};

    /* 1️⃣ Resolve KYC + where condition */
    if (target === "loan") {
      const loan = await tx.loanApplication.findUnique({
        where: { id: targetId },
        select: { kyc: { select: { id: true } }, branchId: true },
      });
      if (!loan || !loan.kyc) throw AppError.notFound("Loan or KYC not found");

      kycId = loan.kyc.id;
      branchId = loan.branchId;
      loanApplicationId = targetId;
      whereClause = { loanApplicationId: targetId };

      assertBranchAccess(requester, branchId);
    }

    if (target === "coApplicant") {
      const co = await tx.coApplicant.findUnique({
        where: { id: targetId },
        select: {
          kyc: { select: { id: true } },
          loanApplication: { select: { branchId: true, id: true } },
        },
      });
      if (!co || !co.kyc) {
        throw AppError.notFound("CoApplicant or KYC not found");
      }

      kycId = co.kyc.id;
      branchId = co.loanApplication.branchId;
      loanApplicationId = co.loanApplication.id;
      whereClause = { coApplicantId: targetId };

      assertBranchAccess(requester, branchId);
    }

    /* 2️⃣ Check already uploaded document types */
    const existingDocs = await tx.document.findMany({
      where: whereClause,
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

    /* 3️⃣ Insert documents */
    const created = await tx.document.createMany({
      data: documents.map((doc) => ({
        documentType: doc.documentType,
        documentPath: doc.documentPath,
        uploadedBy: doc.uploadedBy,
        kycId,
        branchId: branchId!,
        loanApplicationId: loanApplicationId!,
        coApplicantId: target === "coApplicant" ? targetId : undefined,
      })),
    });

    await logAction({
      action: "UPLOAD_DOCUMENT",
      performedBy: documents[0]?.uploadedBy ?? requester?.id ?? "SYSTEM",
      entityType: "DOCUMENT",
      entityId: targetId,
      branchId,
      oldValue: null,
      newValue: {
        target,
        count: created.count,
        documentTypes: documents.map((d) => d.documentType),
      },
    });

    /* 4️⃣ Return documents */
    return tx.document.findMany({
      where: whereClause,
      orderBy: { createdAt: "asc" },
    });
  });
}

export async function reuploadCoApplicantDocumentService(
  coApplicantId: string,
  documentType: string,
  file: {
    filename: string;
    path: string;
    uploadedBy: string;
  },
  requester?: RequestUserContext,
) {
  return prisma.$transaction(async (tx) => {
    const coApplicant = await tx.coApplicant.findUnique({
      where: { id: coApplicantId },
      select: { loanApplication: { select: { branchId: true } } },
    });

    if (!coApplicant) {
      throw AppError.notFound("CoApplicant not found");
    }

    const branchId = coApplicant.loanApplication.branchId;
    assertBranchAccess(requester, branchId);

    /* 1️⃣ Find existing document */
    const existingDoc = await tx.document.findFirst({
      where: {
        coApplicantId,
        documentType,
      },
    });

    if (!existingDoc) {
      throw AppError.notFound(`Document ${documentType} not found. Upload first.`);
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

    /* 3️⃣ Update document */
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

export const getAllCoApplicantInLoanService = async (
  loanApplicationId: string,
  requester?: RequestUserContext,
) => {
  const loan = await prisma.loanApplication.findUnique({
    where: { id: loanApplicationId },
    select: { branchId: true },
  });

  if (!loan) {
    throw AppError.notFound("Loan application not found");
  }

  assertBranchAccess(requester, loan.branchId);

  const coApplicants = await prisma.coApplicant.findMany({
    where: { loanApplicationId },
    include: {
      documents: true,
      addresses: true,
      occupationalDetails: { include: { address: true } },
      employmentDetails: true,
      financialDetails: true,
    },
  });
  return coApplicants;
};
