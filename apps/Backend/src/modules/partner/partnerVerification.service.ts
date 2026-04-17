import { prisma } from "../../db/prismaService.js";
import type { Partner } from "../../../generated/prisma-client/index.js";

// ==================== VERIFICATION STATUS DEFINITIONS ====================

export enum VerificationStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  REJECTED = "rejected",
}

export interface VerificationResult {
  isValid: boolean;
  status: string;
  message: string;
  timestamp: Date;
}

export interface KYCVerificationReport {
  partnerId: string;
  panVerification: VerificationResult;
  gstVerification: VerificationResult;
  bankVerification: VerificationResult;
  documentVerification: VerificationResult;
  overallStatus: "PENDING" | "VERIFIED" | "REJECTED" | "PARTIAL";
  lastVerifiedAt?: Date;
  verifiedBy?: string;
}

// ==================== VERIFICATION SERVICE FUNCTIONS ====================

/**
 * Verify PAN number format (Basic validation)
 */
export function validatePANFormat(panNumber: string): boolean {
  // PAN format: 10 characters, e.g., AAAPA1234A
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(panNumber.toUpperCase());
}

/**
 * Verify Aadhaar number format
 */
export function validateAadhaarFormat(aadhaarNumber: string): boolean {
  // Aadhaar is 12 digits
  const aadhaarRegex = /^[0-9]{12}$/;
  return aadhaarRegex.test(aadhaarNumber);
}

/**
 * Verify GSTIN format
 */
export function validateGSTINFormat(gstin: string): boolean {
  // GSTIN format: 15 characters
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin.toUpperCase());
}

/**
 * Verify CIN format
 */
export function validateCINFormat(cin: string): boolean {
  // CIN format: 21 characters
  const cinRegex = /^[U0-9]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;
  return cinRegex.test(cin.toUpperCase());
}

/**
 * Verify LLPIN format
 */
export function validateLLPINFormat(llpin: string): boolean {
  // LLPIN format: 10 characters
  const llpinRegex = /^[A-Z]{2}[0-9]{8}$/;
  return llpinRegex.test(llpin.toUpperCase());
}

/**
 * Perform PAN verification
 */
export async function verifyPANService(
  partnerId: string,
  panNumber: string,
  verifiedBy?: string
): Promise<VerificationResult> {
  // Check basic format
  if (!validatePANFormat(panNumber)) {
    return {
      isValid: false,
      status: "INVALID_FORMAT",
      message: "PAN number format is invalid",
      timestamp: new Date(),
    };
  }

  // Check for duplicates (same PAN assigned to another partner)
  const existingPartner = await prisma.partner.findFirst({
    where: {
      panNumber: panNumber,
      id: { not: partnerId },
    },
  });

  if (existingPartner) {
    return {
      isValid: false,
      status: "DUPLICATE",
      message: "This PAN is already registered with another partner",
      timestamp: new Date(),
    };
  }

  // Update partner verification status
  await prisma.partner.update({
    where: { id: partnerId },
    data: {
      panVerificationStatus: VerificationStatus.VERIFIED,
    },
  });

  return {
    isValid: true,
    status: "VERIFIED",
    message: "PAN number verified successfully",
    timestamp: new Date(),
  };
}

/**
 * Perform GSTIN verification
 */
export async function verifyGSTINService(
  partnerId: string,
  gstin: string,
  verifiedBy?: string
): Promise<VerificationResult> {
  if (!validateGSTINFormat(gstin)) {
    return {
      isValid: false,
      status: "INVALID_FORMAT",
      message: "GSTIN format is invalid",
      timestamp: new Date(),
    };
  }

  // Check for duplicates
  const existingPartner = await prisma.partner.findFirst({
    where: {
      OR: [
        { gstinNumber: gstin },
        { gstNumber: gstin },
      ],
      id: { not: partnerId },
    },
  });

  if (existingPartner) {
    return {
      isValid: false,
      status: "DUPLICATE",
      message: "This GSTIN is already registered with another partner",
      timestamp: new Date(),
    };
  }

  // Update partner verification status
  await prisma.partner.update({
    where: { id: partnerId },
    data: {
      gstVerificationStatus: VerificationStatus.VERIFIED,
    },
  });

  return {
    isValid: true,
    status: "VERIFIED",
    message: "GSTIN verified successfully",
    timestamp: new Date(),
  };
}

/**
 * Perform Bank verification
 */
export async function verifyBankDetailsService(
  partnerId: string,
  bankName: string,
  accountNumber: string,
  ifscCode: string,
  verifiedBy?: string
): Promise<VerificationResult> {
  // Validate IFSC code format (4 letters + 0 + 6 characters)
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  if (!ifscRegex.test(ifscCode)) {
    return {
      isValid: false,
      status: "INVALID_FORMAT",
      message: "IFSC code format is invalid",
      timestamp: new Date(),
    };
  }

  // Check if bank account is already registered
  const existingPartner = await prisma.partner.findFirst({
    where: {
      payoutAccountNumber: accountNumber,
      id: { not: partnerId },
    },
  });

  if (existingPartner) {
    return {
      isValid: false,
      status: "DUPLICATE",
      message: "This bank account is already registered with another partner",
      timestamp: new Date(),
    };
  }

  // Update partner verification status
  await prisma.partner.update({
    where: { id: partnerId },
    data: {
      bankVerificationStatus: VerificationStatus.VERIFIED,
    },
  });

  return {
    isValid: true,
    status: "VERIFIED",
    message: "Bank details verified successfully",
    timestamp: new Date(),
  };
}

/**
 * Check KYC document completion
 */
export async function checkKYCDocumentCompletionService(partnerId: string): Promise<VerificationResult> {
  const partner = await prisma.partner.findUnique({
    where: { id: partnerId },
  });

  if (!partner) {
    return {
      isValid: false,
      status: "PARTNER_NOT_FOUND",
      message: "Partner not found",
      timestamp: new Date(),
    };
  }

  // Check required documents based on constitution type
  const requiredDocuments: { [key: string]: string[] } = {
    INDIVIDUAL: ["PAN", "AADHAAR", "ADDRESS_PROOF"],
    PROPRIETORSHIP: ["PAN", "REGISTRATION_CERTIFICATE", "GST_CERTIFICATE"],
    PARTNERSHIP: ["PAN", "PARTNERSHIP_AGREEMENT", "BANK_PROOF"],
    LLP: ["PAN", "LLPIN", "CIN", "BANK_PROOF"],
    PRIVATE_LTD: ["PAN", "CIN", "INCORPORATION_CERTIFICATE", "BANK_PROOF"],
    PUBLIC_LTD: ["PAN", "CIN", "INCORPORATION_CERTIFICATE", "BANK_PROOF"],
  };

  const required = requiredDocuments[partner.constitutionType] || requiredDocuments.INDIVIDUAL;

  const uploadedDocs = await prisma.document.count({
    where: {
      partnerId: partnerId,
      documentType: { in: required },
    },
  });

  const allDocumentsUploaded = uploadedDocs === required.length;

  return {
    isValid: allDocumentsUploaded,
    status: allDocumentsUploaded ? "COMPLETE" : "INCOMPLETE",
    message: allDocumentsUploaded
      ? `All ${required.length} required documents uploaded`
      : `${uploadedDocs}/${required.length} required documents uploaded`,
    timestamp: new Date(),
  };
}

/**
 * Generate KYC verification report
 */
export async function generateKYCVerificationReportService(
  partnerId: string,
  verifiedBy?: string
): Promise<KYCVerificationReport> {
  const partner = await prisma.partner.findUnique({
    where: { id: partnerId },
  });

  if (!partner) {
    throw new Error("Partner not found");
  }

  // Check each verification component
  const panVerification = validatePANFormat(partner.panNumber)
    ? {
        isValid: true,
        status: partner.panVerificationStatus,
        message: "PAN format valid",
        timestamp: new Date(),
      }
    : {
        isValid: false,
        status: "INVALID_FORMAT",
        message: "PAN format invalid",
        timestamp: new Date(),
      };

  const gstVerification = partner.gstinNumber || partner.gstNumber
    ? validateGSTINFormat(partner.gstinNumber || partner.gstNumber || "")
      ? {
          isValid: true,
          status: partner.gstVerificationStatus,
          message: "GSTIN format valid",
          timestamp: new Date(),
        }
      : {
          isValid: false,
          status: "INVALID_FORMAT",
          message: "GSTIN format invalid",
          timestamp: new Date(),
        }
    : {
        isValid: true,
        status: VerificationStatus.PENDING,
        message: "GSTIN not provided",
        timestamp: new Date(),
      };

  const bankVerification = partner.payoutAccountNumber
    ? {
        isValid: true,
        status: partner.bankVerificationStatus,
        message: "Bank details provided",
        timestamp: new Date(),
      }
    : {
        isValid: false,
        status: VerificationStatus.PENDING,
        message: "Bank details not provided",
        timestamp: new Date(),
      };

  const documentCompletion = await checkKYCDocumentCompletionService(partnerId);

  // Determine overall status
  let overallStatus: "PENDING" | "VERIFIED" | "REJECTED" | "PARTIAL" = "PENDING";

  if (
    panVerification.status === VerificationStatus.VERIFIED &&
    gstVerification.status === VerificationStatus.VERIFIED &&
    bankVerification.status === VerificationStatus.VERIFIED &&
    documentCompletion.isValid
  ) {
    overallStatus = "VERIFIED";
  } else if (
    panVerification.status === VerificationStatus.REJECTED ||
    gstVerification.status === VerificationStatus.REJECTED ||
    bankVerification.status === VerificationStatus.REJECTED
  ) {
    overallStatus = "REJECTED";
  } else if (
    panVerification.status === VerificationStatus.VERIFIED ||
    gstVerification.status === VerificationStatus.VERIFIED ||
    bankVerification.status === VerificationStatus.VERIFIED
  ) {
    overallStatus = "PARTIAL";
  }

  return {
    partnerId,
    panVerification,
    gstVerification,
    bankVerification,
    documentVerification: documentCompletion,
    overallStatus,
    lastVerifiedAt: new Date(),
    verifiedBy,
  };
}

/**
 * Approve partner KYC
 */
export async function approvePartnerKYCService(
  partnerId: string,
  approvedBy: string
): Promise<Partner> {
  const partner = await prisma.partner.update({
    where: { id: partnerId },
    data: {
      Status: "ACTIVE",
      panVerificationStatus: VerificationStatus.VERIFIED,
      gstVerificationStatus: VerificationStatus.VERIFIED,
      bankVerificationStatus: VerificationStatus.VERIFIED,
    },
  });

  return partner;
}

/**
 * Reject partner KYC
 */
export async function rejectPartnerKYCService(
  partnerId: string,
  rejectionReason: string,
  rejectedBy: string
): Promise<Partner> {
  const partner = await prisma.partner.update({
    where: { id: partnerId },
    data: {
      Status: "SUSPENDED",
      panVerificationStatus: VerificationStatus.REJECTED,
      gstVerificationStatus: VerificationStatus.REJECTED,
      bankVerificationStatus: VerificationStatus.REJECTED,
    },
  });

  return partner;
}
