import logger from "../../common/logger.js";
import { getAccessibleBranchIds } from "../../common/utils/branchAccess.js";
import { buildBranchFilter } from "../../common/utils/branchFilter.js";
import { getPagination } from "../../common/utils/pagination.js";
import { buildKycSearch } from "../../common/utils/search.js";
import { prisma } from "../../db/prismaService.js";
import { logAction } from "../../audit/audit.helper.js";
import { AppError } from "../../common/utils/apiError.js";

const requiredKycDocumentDelegate = (prisma as any).requiredKycDocument;

const normalizeDocumentType = (value: string) =>
  value.trim().toUpperCase().replace(/\s+/g, "_");

const getActiveRequiredDocumentTypes = async (
  tx: typeof prisma,
): Promise<string[]> => {
  const docs = await (tx as any).requiredKycDocument.findMany({
    where: { isActive: true },
    select: { documentType: true },
  });
  return docs.map((doc: { documentType: string }) =>
    normalizeDocumentType(doc.documentType),
  );
};

const buildRequiredDocumentStatus = (
  requiredDocumentTypes: string[],
  uploadedDocumentTypes: string[],
) => {
  const uploadedSet = new Set(uploadedDocumentTypes.map(normalizeDocumentType));
  const missingRequiredDocuments = requiredDocumentTypes.filter(
    (docType) => !uploadedSet.has(docType),
  );

  return {
    requiredDocuments: requiredDocumentTypes,
    uploadedDocuments: Array.from(uploadedSet),
    missingRequiredDocuments,
    allRequiredDocumentsUploaded: missingRequiredDocuments.length === 0,
  };
};

export const uploadKycDocumentService = async (data: {
  userId: string;
  documents: {
    documentType: string;
    documentPath: string;
  }[];
  branchId?: string;
}) => {
  const { userId, documents, branchId } = data;
  try {
    return prisma.$transaction(async (tx) => {
      let kyc = await tx.kyc.findFirst({
        where: { userId },
      });

      if (!kyc) {
        kyc = await tx.kyc.create({
          data: {
            userId,
            status: "PENDING",
          },
        });
      }

      // Get user's branchId if not provided
      let documentBranchId = branchId;
      if (!documentBranchId) {
        const user = await tx.user.findUnique({
          where: { id: userId },
          select: { branchId: true },
        });
        documentBranchId = user?.branchId || "";
      }

      const saveDocuments = await Promise.all(
        documents.map(async (doc) => {
          const normalizedType = normalizeDocumentType(doc.documentType);
          const existing = await tx.document.findFirst({
            where: { kycId: kyc.id, documentType: normalizedType },
          });
          if (existing) {
            return tx.document.update({
              where: { id: existing.id },
              data: {
                documentType: normalizedType,
                documentPath: doc.documentPath,
                verified: false,
                verificationStatus: "pending",
                verifiedBy: null,
                verifiedAt: null,
              },
            });
          }
          return tx.document.create({
            data: {
              kycId: kyc.id,
              documentType: normalizedType,
              documentPath: doc.documentPath,
              uploadedBy: userId,
              branchId: documentBranchId,
            },
          });
        }),
      );

      await logAction({
        entityType: "KYC",
        entityId: kyc.id,
        action: "UPLOAD_DOCUMENT",
        performedBy: userId,
        branchId: documentBranchId,
        oldValue: null,
        newValue: {
          documentTypes: documents.map((d) => normalizeDocumentType(d.documentType)),
        },
      });

      const requiredDocumentTypes = await getActiveRequiredDocumentTypes(tx as any);
      const allUploadedDocs = await tx.document.findMany({
        where: { kycId: kyc.id },
        select: { documentType: true },
      });
      const requiredDocumentStatus = buildRequiredDocumentStatus(
        requiredDocumentTypes,
        allUploadedDocs.map((d) => d.documentType),
      );

      return {
        kyc,
        documents: saveDocuments,
        requiredDocumentStatus,
      };
    });
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export const verifyDocumentService = async (
  documentId: string,
  adminId: string,
) => {
  try {
    return prisma.$transaction(async (tx) => {
      // Ensure the document exists before attempting update
      const existingDoc = await tx.document.findUnique({
        where: { id: documentId },
      });
      if (!existingDoc) {
        const err: any = new Error("Document not found");
        err.statusCode = 404;
        throw err;
      }

      // Mark the single document as verified
      const document = await tx.document.update({
        where: { id: documentId },
        data: {
          verified: true,
          verifiedBy: adminId,
          verifiedAt: new Date(),
          verificationStatus: "verified",
        },
      });

      // If the document is linked to a KYC, check remaining unverified documents
      if (document.kycId) {
        const requiredDocumentTypes = await getActiveRequiredDocumentTypes(tx as any);
        const verifiedDocs = await tx.document.findMany({
          where: {
            kycId: document.kycId,
            verificationStatus: "verified",
          },
          select: { documentType: true },
        });

        const requiredDocumentStatus = buildRequiredDocumentStatus(
          requiredDocumentTypes,
          verifiedDocs.map((d) => d.documentType),
        );

        if (requiredDocumentStatus.allRequiredDocumentsUploaded) {
          const updatedKyc = await tx.kyc.update({
            where: { id: document.kycId },
            data: {
              status: "VERIFIED",
              verifiedBy: adminId,
              verifiedAt: new Date(),
            },
          });

          await tx.user.update({
            where: { id: updatedKyc.userId },
            data: { kycStatus: "VERIFIED" },
          });
        }
      }

      await logAction({
        entityType: "DOCUMENT",
        entityId: documentId,
        action: "VERIFY_DOCUMENT",
        performedBy: adminId,
        branchId: existingDoc.branchId ?? "",
        oldValue: { verificationStatus: existingDoc.verificationStatus },
        newValue: { verificationStatus: "verified" },
      });

      return document;
    });
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export async function getMyKycService(userId: string) {
  const kyc = await prisma.kyc.findFirst({
    where: { userId },
    include: { documents: true },
  });

  if (!kyc) {
    return null;
  }

  const requiredDocs = await requiredKycDocumentDelegate.findMany({
    where: { isActive: true },
    select: { documentType: true },
  });

  const requiredDocumentStatus = buildRequiredDocumentStatus(
    requiredDocs.map((d: { documentType: string }) => d.documentType),
    kyc.documents.map((d: { documentType: string }) => d.documentType),
  );

  return {
    ...kyc,
    requiredDocumentStatus,
  };
}

export const rejectDocumentService = async (
  documentId: string,
  adminId: string,
  reason?: string,
) => {
  try {
    return prisma.$transaction(async (tx) => {
      const existingDoc = await tx.document.findUnique({
        where: { id: documentId },
      });
      if (!existingDoc) {
        const err: any = new Error("Document not found");
        err.statusCode = 404;
        throw err;
      }

      const document = await tx.document.update({
        where: { id: documentId },
        data: {
          verified: false,
          verificationStatus: "rejected",
          verifiedBy: adminId,
          verifiedAt: new Date(),
        },
      });

      await logAction({
        entityType: "DOCUMENT",
        entityId: documentId,
        action: "REJECT_DOCUMENT",
        performedBy: adminId,
        branchId: existingDoc.branchId ?? "",
        oldValue: { verificationStatus: existingDoc.verificationStatus },
        newValue: { verificationStatus: "rejected", reason: reason ?? null },
      });

      return document;
    });
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export const getAllKycService = async (
  params: {
    page?: number;
    limit?: number;
    q?: string;
  },
  user: {
    id: string;
    role: string;
    branchId?: string;
  },
) => {
  const { page, limit, skip } = getPagination(params.page, params.limit);
  const accessibleBranches = await getAccessibleBranchIds({
    id: user.id,
    role: user.role,
    branchId: user.branchId,
  });
  const where = {
    ...buildKycSearch(params.q),
    ...buildBranchFilter(accessibleBranches),
  };

  const [data, total] = await Promise.all([
    prisma.kyc.findMany({
      where,
      include: { documents: true, user: true },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.kyc.count({ where }),
  ]);

  const requiredDocs = await requiredKycDocumentDelegate.findMany({
    where: { isActive: true },
    select: { documentType: true },
  });
  const requiredTypes = requiredDocs.map(
    (doc: { documentType: string }) => doc.documentType,
  );

  const dataWithRequiredStatus = data.map((kyc) => ({
    ...kyc,
    requiredDocumentStatus: buildRequiredDocumentStatus(
      requiredTypes,
      kyc.documents.map((doc) => doc.documentType),
    ),
  }));

  return {
    data: dataWithRequiredStatus,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const createRequiredKycDocumentService = async (
  data: {
    documentType: string;
    displayName?: string;
    isActive?: boolean;
  },
  user: { id: string },
) => {
  const normalizedDocumentType = normalizeDocumentType(data.documentType);

  if (!normalizedDocumentType) {
    throw AppError.badRequest("documentType is required");
  }

  const existing = await requiredKycDocumentDelegate.findFirst({
    where: { documentType: normalizedDocumentType },
  });
  if (existing) {
    throw AppError.conflict("Required KYC document already exists");
  }

  return requiredKycDocumentDelegate.create({
    data: {
      documentType: normalizedDocumentType,
      displayName: data.displayName?.trim() || null,
      isActive: data.isActive ?? true,
      createdById: user.id,
    },
  });
};

export const getRequiredKycDocumentsService = async (includeInactive = false) => {
  return requiredKycDocumentDelegate.findMany({
    where: includeInactive ? undefined : { isActive: true },
    orderBy: { documentType: "asc" },
  });
};
