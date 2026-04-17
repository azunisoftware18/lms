import { prisma } from "../../db/prismaService.js";
import type { Document } from "../../../generated/prisma-client/index.js";

// ==================== DOCUMENT TYPE DEFINITIONS ====================
export enum PartnerDocumentType {
  PAN = "PAN",
  AADHAAR = "AADHAAR",
  GSTIN = "GSTIN",
  CIN = "CIN",
  LLPIN = "LLPIN",
  REGISTRATION_CERTIFICATE = "REGISTRATION_CERTIFICATE",
  PARTNERSHIP_AGREEMENT = "PARTNERSHIP_AGREEMENT",
  KYC_DOCUMENT = "KYC_DOCUMENT",
  GST_CERTIFICATE = "GST_CERTIFICATE",
  INCORPORATION_CERTIFICATE = "INCORPORATION_CERTIFICATE",
  PAN_COPY = "PAN_COPY",
  ADDRESS_PROOF = "ADDRESS_PROOF",
  BANK_PROOF = "BANK_PROOF",
  CANCELLED_CHEQUE = "CANCELLED_CHEQUE",
  BOARD_RESOLUTION = "BOARD_RESOLUTION",
  AUTHORIZATION_LETTER = "AUTHORIZATION_LETTER",
  AGREEMENT = "AGREEMENT",
  NDA = "NDA",
  COMMERCIAL_CIBIL = "COMMERCIAL_CIBIL",
  CIBIL_CHECK = "CIBIL_CHECK",
}

// ==================== INTERFACE DEFINITIONS ====================

export interface UploadPartnerDocumentInput {
  partnerId: string;
  documentType: string;
  documentPath: string;
  uploadedBy: string;
  branchId: string;
  rejectionReason?: string;
}

export interface UpdateDocumentVerificationInput {
  documentId: string;
  verificationStatus: "pending" | "verified" | "rejected";
  verifiedBy?: string;
  rejectionReason?: string;
}

// ==================== DOCUMENT UPLOAD SERVICE ====================

/**
 * Upload a partner document
 */
export async function uploadPartnerDocumentService(input: UploadPartnerDocumentInput): Promise<Document> {
  // Check if partner exists
  const partner = await prisma.partner.findUnique({
    where: { id: input.partnerId },
  });

  if (!partner) {
    throw new Error("Partner not found");
  }

  // Check for duplicate document (same partner and document type)
  const existingDocument = await prisma.document.findFirst({
    where: {
      partnerId: input.partnerId,
      documentType: input.documentType,
    },
  });

  if (existingDocument) {
    throw new Error(`Document of type ${input.documentType} already exists for this partner`);
  }

  // Create new document
  const document = await prisma.document.create({
    data: {
      partnerId: input.partnerId,
      documentType: input.documentType,
      documentPath: input.documentPath,
      uploadedBy: input.uploadedBy,
      branchId: input.branchId,
      verificationStatus: "pending",
    },
  });

  // Update partner document upload tracking based on document type
  await updatePartnerDocumentTrackingStatus(input.partnerId, input.documentType);

  return document;
}

/**
 * Get all documents for a partner
 */
export async function getPartnerDocumentsService(partnerId: string): Promise<Document[]> {
  const partner = await prisma.partner.findUnique({
    where: { id: partnerId },
  });

  if (!partner) {
    throw new Error("Partner not found");
  }

  const documents = await prisma.document.findMany({
    where: {
      partnerId: partnerId,
    },
    orderBy: { createdAt: "desc" },
  });

  return documents;
}

/**
 * Get a specific document by ID
 */
export async function getPartnerDocumentByIdService(documentId: string): Promise<Document> {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });

  if (!document) {
    throw new Error("Document not found");
  }

  return document;
}

/**
 * Update document verification status
 */
export async function updateDocumentVerificationService(
  input: UpdateDocumentVerificationInput
): Promise<Document> {
  const document = await prisma.document.findUnique({
    where: { id: input.documentId },
  });

  if (!document) {
    throw new Error("Document not found");
  }

  const updated = await prisma.document.update({
    where: { id: input.documentId },
    data: {
      verificationStatus: input.verificationStatus,
      verified: input.verificationStatus === "verified",
      verifiedBy: input.verifiedBy,
      verifiedAt: input.verificationStatus === "verified" ? new Date() : null,
      rejectionReason: input.rejectionReason,
    },
  });

  return updated;
}

/**
 * Delete a partner document
 */
export async function deletePartnerDocumentService(documentId: string): Promise<void> {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });

  if (!document) {
    throw new Error("Document not found");
  }

  await prisma.document.delete({
    where: { id: documentId },
  });
}

/**
 * Get required documents based on constitution type
 */
export function getRequiredDocuments(constitutionType: string): string[] {
  const requiredDocs: { [key: string]: string[] } = {
    INDIVIDUAL: [
      PartnerDocumentType.PAN,
      PartnerDocumentType.AADHAAR,
      PartnerDocumentType.ADDRESS_PROOF,
      PartnerDocumentType.BANK_PROOF,
    ],
    PROPRIETORSHIP: [
      PartnerDocumentType.PAN,
      PartnerDocumentType.AADHAAR,
      PartnerDocumentType.REGISTRATION_CERTIFICATE,
      PartnerDocumentType.GST_CERTIFICATE,
      PartnerDocumentType.BANK_PROOF,
    ],
    PARTNERSHIP: [
      PartnerDocumentType.PAN,
      PartnerDocumentType.REGISTRATION_CERTIFICATE,
      PartnerDocumentType.PARTNERSHIP_AGREEMENT,
      PartnerDocumentType.GSTIN,
      PartnerDocumentType.BANK_PROOF,
      PartnerDocumentType.BOARD_RESOLUTION,
    ],
    LLP: [
      PartnerDocumentType.PAN,
      PartnerDocumentType.LLPIN,
      PartnerDocumentType.CIN,
      PartnerDocumentType.INCORPORATION_CERTIFICATE,
      PartnerDocumentType.GSTIN,
      PartnerDocumentType.BANK_PROOF,
    ],
    PRIVATE_LTD: [
      PartnerDocumentType.PAN,
      PartnerDocumentType.CIN,
      PartnerDocumentType.INCORPORATION_CERTIFICATE,
      PartnerDocumentType.GSTIN,
      PartnerDocumentType.BOARD_RESOLUTION,
      PartnerDocumentType.BANK_PROOF,
    ],
    PUBLIC_LTD: [
      PartnerDocumentType.PAN,
      PartnerDocumentType.CIN,
      PartnerDocumentType.INCORPORATION_CERTIFICATE,
      PartnerDocumentType.GSTIN,
      PartnerDocumentType.BOARD_RESOLUTION,
      PartnerDocumentType.BANK_PROOF,
    ],
  };

  return requiredDocs[constitutionType] || requiredDocs.INDIVIDUAL;
}

/**
 * Check document completion status for partner
 */
export async function checkPartnerDocumentCompletionService(
  partnerId: string
): Promise<{
  requiredDocuments: string[];
  uploadedDocuments: string[];
  missingDocuments: string[];
  completionPercentage: number;
}> {
  const partner = await prisma.partner.findUnique({
    where: { id: partnerId },
  });

  if (!partner) {
    throw new Error("Partner not found");
  }

  const requiredDocuments = getRequiredDocuments(partner.constitutionType);

  const uploadedDocuments = await prisma.document
    .findMany({
      where: {
        partnerId: partnerId,
        documentType: {
          in: requiredDocuments,
        },
      },
      select: { documentType: true },
    })
    .then((docs) => docs.map((d) => d.documentType));

  const missingDocuments = requiredDocuments.filter((doc) => !uploadedDocuments.includes(doc));

  const completionPercentage =
    requiredDocuments.length > 0 ? Math.round((uploadedDocuments.length / requiredDocuments.length) * 100) : 100;

  return {
    requiredDocuments,
    uploadedDocuments,
    missingDocuments,
    completionPercentage,
  };
}

/**
 * Update partner document tracking status
 */
async function updatePartnerDocumentTrackingStatus(partnerId: string, documentType: string): Promise<void> {
  const partner = await prisma.partner.findUnique({
    where: { id: partnerId },
  });

  if (!partner) return;

  // Determine which tracking flag to update
  const trackingUpdates: { [key: string]: string } = {
    [PartnerDocumentType.PAN]: "panVerificationStatus",
    [PartnerDocumentType.GSTIN]: "gstVerificationStatus",
    [PartnerDocumentType.GST_CERTIFICATE]: "gstVerificationStatus",
    [PartnerDocumentType.BANK_PROOF]: "bankVerificationStatus",
    [PartnerDocumentType.CANCELLED_CHEQUE]: "bankVerificationStatus",
    [PartnerDocumentType.KYC_DOCUMENT]: "kycDocumentsUploaded",
    [PartnerDocumentType.COMMERCIAL_CIBIL]: "commercialCibilUploaded",
    [PartnerDocumentType.CIBIL_CHECK]: "cibilCheckUploaded",
    [PartnerDocumentType.PARTNERSHIP_AGREEMENT]: "partnerAgreementUploaded",
    [PartnerDocumentType.AGREEMENT]: "partnerAgreementUploaded",
    [PartnerDocumentType.NDA]: "ndaUploaded",
  };

  const updateData: any = {};

  if (trackingUpdates[documentType] === "kycDocumentsUploaded") {
    updateData.kycDocumentsUploaded = true;
  } else if (trackingUpdates[documentType] === "commercialCibilUploaded") {
    updateData.commercialCibilUploaded = true;
  } else if (trackingUpdates[documentType] === "cibilCheckUploaded") {
    updateData.cibilCheckUploaded = true;
  } else if (trackingUpdates[documentType] === "partnerAgreementUploaded") {
    updateData.partnerAgreementUploaded = true;
  } else if (trackingUpdates[documentType] === "ndaUploaded") {
    updateData.ndaUploaded = true;
  }

  if (Object.keys(updateData).length > 0) {
    await prisma.partner.update({
      where: { id: partnerId },
      data: updateData,
    });
  }
}

/**
 * Bulk upload multiple documents
 */
export async function bulkUploadPartnerDocumentsService(
  partnerId: string,
  documents: UploadPartnerDocumentInput[]
): Promise<Document[]> {
  const uploadedDocuments: Document[] = [];

  for (const doc of documents) {
    try {
      const uploaded = await uploadPartnerDocumentService(doc);
      uploadedDocuments.push(uploaded);
    } catch (error) {
      console.error(`Error uploading document ${doc.documentType}:`, error);
      // Continue with other documents
    }
  }

  return uploadedDocuments;
}
