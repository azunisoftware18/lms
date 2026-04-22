import { prisma } from "../../db/prismaService.js";
import { Prisma } from "../../../generated/prisma-client/client.js";

import type {
  CreatePartner,
  PartnerModel,
  UpdatePartner,
} from "./partner.types.js";

// ==================== HELPER FUNCTIONS ====================

/**
 * Generate unique partner code based on partner type
 */
function generatePartnerCode(partnerType: string): string {
  const typePrefix = partnerType.substring(0, 3).toUpperCase();
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${typePrefix}-${timestamp}-${randomSuffix}`;
}

/**
 * Create or update addresses for partner
 */
async function createPartnerAddresses(partnerId: string, body: CreatePartner) {
  const addressData = [];

  // Create Registered/Current Address
  if (body.currentAddressLine1 || body.currentCity || body.currentState) {
    const currentAddress = await prisma.address.create({
      data: {
        addressType: "CURRENT_RESIDENTIAL",
        addressLine1: body.currentAddressLine1 || "",
        addressLine2: body.address,
        city: body.currentCity || body.city || "",
        state: body.currentState || body.state || "",
        pinCode: body.currentPinCode || body.pinCode || "",
        district: body.currentCity,
        partnerId,
      },
    });
    addressData.push(currentAddress);
  }

  // Create Permanent Address if different
  if (body.permanentAddressLine1 || body.permanentCity || body.permanentState) {
    const permanentAddress = await prisma.address.create({
      data: {
        addressType: "PERMANENT",
        addressLine1: body.permanentAddressLine1 || "",
        addressLine2: body.address,
        city: body.permanentCity || "",
        state: body.permanentState || "",
        pinCode: body.permanentPinCode || "",
        district: body.permanentCity,
        partnerId,
      },
    });
    addressData.push(permanentAddress);
  }

  return addressData;
}

// ==================== CORE SERVICE FUNCTIONS ====================

export async function createPartnerService(body: CreatePartner) {
  // Check for existing user by email
  const existingUser = await prisma.user.findUnique({
    where: { email: body.email },
    include: { partner: true },
  });

  let user = null;

  if (existingUser) {
    if (existingUser.partner) {
      throw new Error(
        "User with this email already exists and is already a partner",
      );
    }

    user = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        fullName: body.fullName || existingUser.fullName,
        userName: body.userName || existingUser.userName,
        contactNumber: body.contactNumber || existingUser.contactNumber,
        branchId: body.branchId || existingUser.branchId,
      },
    });
  } else {
    user = await prisma.user.create({
      data: {
        fullName:
          body.fullName || body.contactPersonName || body.companyName || "",
        userName: body.userName || body.email.split("@")[0],
        email: body.email,
        password: body.password,
        role: "PARTNER",
        contactNumber: body.contactNumber || "",
        branchId: body.branchId,
      },
    });
  }

  // Generate partner code if not provided
  const partnerCode =
    body.partnerCode || generatePartnerCode(body.partnerType || "DSA");

  const partnerData: Prisma.PartnerCreateInput = {
    user: { connect: { id: user.id } },
    partnerCode,
    legalName: body.legalName || body.companyName || body.fullName || "",
    companyName: body.companyName || body.legalName || body.fullName,
    tradeName: body.tradeName,
    partnerType: (body.partnerType as any) || "DSA",
    constitutionType: (body.constitutionType as any) || "INDIVIDUAL",
    dateOfOnboarding: body.dateOfOnboarding
      ? new Date(body.dateOfOnboarding)
      : new Date(),
    Status: (body.status as any) || "ACTIVE",

    // Contact Details
    contactPersonName:
      body.contactPersonName || body.contactPerson || user.fullName,
    contactNumber: body.contactNumber || user.contactNumber || "",
    email: body.email,
    alternatePersonName: body.alternatePersonName,
    alternateContactNumber: body.alternateContactNumber,

    // KYC & Verification
    panNumber: body.panNumber,
    aadhaarNumber: body.aadhaarNumber || "",
    cinNumber: body.cinNumber,
    gstinNumber: body.gstinNumber,
    gstNumber: body.gstNumber,
    llpinNumber: body.llpinNumber,
    registrationCertificate: body.registrationCertificate,
    panVerificationStatus: (body.panVerificationStatus as any) || "pending",
    gstVerificationStatus: (body.gstVerificationStatus as any) || "pending",
    bankVerificationStatus: (body.bankVerificationStatus as any) || "pending",

    // Document Upload Tracking
    kycDocumentsUploaded: body.kycDocumentsUploaded || false,
    commercialCibilUploaded: body.commercialCibilUploaded || false,
    cibilCheckUploaded: body.cibilCheckUploaded || false,
    partnerAgreementUploaded: body.partnerAgreementUploaded || false,
    ndaUploaded: body.ndaUploaded || false,

    // Banking Details
    payoutBankName: body.payoutBankName,
    payoutAccountHolderName: body.payoutAccountHolderName,
    payoutAccountNumber: body.payoutAccountNumber,
    payoutIfscCode: body.payoutIfscCode,
    payoutUpiId: body.payoutUpiId,
    cancelledChequeUploadPath: body.cancelledChequeUploadPath,

    // Business Profile
    businessNature: body.businessNature,
    yearsInBusiness: body.yearsInBusiness,
    establishedYear: body.establishedYear,
    productExpertise: body.productExpertise,
    monthlySourcingVolume: body.monthlySourcingVolume,
    geographicCoverage: body.geographicCoverage,
    existingLenderRelationships: body.existingLenderRelationships,
    officeStrength: body.officeStrength,
    digitalApiIntegration: body.digitalApiIntegration || false,
    businessRegistrationNumber: body.businessRegistrationNumber,
    annualTurnover: body.annualTurnover,
    designation: body.designation,
    businessCategory: body.businessCategory,
    specialization: body.specialization,
    totalEmployees: body.totalEmployees,
    targetArea: body.targetArea,

    // Agreement & Compliance
    agreementValidityDate: body.agreementValidityDate,
    ndaValidityDate: body.ndaValidityDate,
    agreementRemarks: body.agreementRemarks,

    // System Access
    loginId: body.loginId,
    assignedRmId: body.assignedRmId,
    branchMapping: body.branchMapping,
    productAccess: body.productAccess,
    apiKey: body.apiKey,
    integrationId: body.integrationId,

    // Commission & Payout
    commissionType: (body.commissionType as any) || "FIXED",
    commissionValue: body.commissionValue,
    paymentCycle: (body.paymentCycle as any) || "MONTHLY",
    minimumPayout: body.minimumPayout,
    taxDeduction: body.taxDeduction,
    payoutType: body.payoutType as any,
    productPayoutRates: body.productPayoutRates,
    roiProcessingShare: body.roiProcessingShare,
    payoutFrequency: body.payoutFrequency as any,
    gstApplicable: body.gstApplicable ?? true,
    tdsApplicable: body.tdsApplicable ?? false,
    incentiveSchemes: body.incentiveSchemes,
    clawbackTerms: body.clawbackTerms,
    maxPayoutCap: body.maxPayoutCap,

    // Branch Connection
    branch: { connect: { id: body.branchId } },
    isActive: body.isActive ?? true,

    // Performance Tracking
    totalLeadsSubmitted: 0,
    totalReferrals: 0,
    activeReferrals: 0,
    commissionEarned: 0,
    fraudCasesCount: 0,
    partnerRating: 0,
  };

  const partner = await prisma.partner.create({ data: partnerData });

  // Create addresses for the partner
  try {
    await createPartnerAddresses(partner.id, body);
  } catch (error) {
    console.error("Error creating partner addresses:", error);
    // Don't fail partner creation if addresses fail
  }

  return { user, partner, };
}

export async function getAllPartnerService(options: {
  page?: number;
  limit?: number;
  q?: string | undefined;
}) {
  const page = options.page && options.page > 0 ? options.page : 1;
  const limit = options.limit && options.limit > 0 ? options.limit : 20;
  const skip = (page - 1) * limit;

  const where = options.q
    ? {
        OR: [
          { legalName: { contains: options.q, mode: "insensitive" } },
          { tradeName: { contains: options.q, mode: "insensitive" } },
          { companyName: { contains: options.q, mode: "insensitive" } },
          { contactPersonName: { contains: options.q, mode: "insensitive" } },
          { panNumber: { contains: options.q, mode: "insensitive" } },
          { partnerCode: { contains: options.q, mode: "insensitive" } },
        ],
      }
    : {};

  const partners = await prisma.partner.findMany({
    where,
    skip,
    take: limit,
    include: {
      user: true,
      addresses: true,
      commission: true,
      branch: true,
      documents: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.partner.count({ where });

  return { data: partners, meta: { page, limit, total } };
}

export async function getPartnerByIdService(id: string) {
  const partner = await prisma.partner.findUnique({
    where: { id },
    include: {
      user: true,
      addresses: true,
      commission: true,
      branch: true,
      documents: true,
      leads: true,
    },
  });
  if (!partner) throw new Error("Partner not found");
  return partner;
}

export async function getPartnerByCodeService(partnerCode: string) {
  const partner = await prisma.partner.findUnique({
    where: { partnerCode },
    include: {
      user: true,
      addresses: true,
      commission: true,
      branch: true,
      documents: true,
    },
  });
  if (!partner) throw new Error("Partner with this code not found");
  return partner;
}

export async function updatePartnerService(
  id: string,
  updateData: UpdatePartner,
) {
  // Extract nested user update if provided
  const { user: userUpdate, ...partnerUpdate } = updateData as any;

  if (userUpdate) {
    const userId = await prisma.partner
      .findUnique({ where: { id }, select: { userId: true } })
      .then((p) => p?.userId);

    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: userUpdate,
      });
    }
  }

  const updated = await prisma.partner.update({
    where: { id },
    data: partnerUpdate as any,
    include: {
      user: true,
      addresses: true,
      branch: true,
    },
  });

  return updated;
}

export async function updatePartnerPerformanceMetricsService(
  id: string,
  metrics: {
    totalLeadsSubmitted?: number;
    loginToSanctionRatio?: number;
    sanctionToDisbursementRatio?: number;
    disbursementVolume?: number;
    rejectionRate?: number;
    fraudCasesCount?: number;
    qualityScore?: number;
    partnerRating?: number;
  },
) {
  const updated = await prisma.partner.update({
    where: { id },
    data: metrics,
  });
  return updated;
}

export async function createPartnerLeadService(body: any, userId: string) {
  const partner = await prisma.partner.findUnique({ where: { userId } });
  if (!partner) throw new Error("Partner not found for current user");

  const leadNumber = `LD-${Date.now()}`;

  // Create address for lead if provided
  let addressId: string | undefined;
  if (body.city || body.state || body.address) {
    const address = await prisma.address.create({
      data: {
        addressType: "CURRENT_RESIDENTIAL",
        addressLine1: body.address || "",
        city: body.city || "",
        state: body.state || "",
        pinCode: body.pinCode || "",
        district: body.district || body.city || "",
      },
    });
    addressId = address.id;
  }

  const lead = await prisma.leads.create({
    data: {
      fullName: body.fullName,
      contactNumber: body.contactNumber,
      leadNumber,
      email: body.email,
      dob: new Date(body.dob),
      gender: body.gender,
      partnerId: partner.id,
      loanAmount: Number(body.loanAmount) || 0,
      loanTypeId: body.loanTypeId,
      addressId,
    },
    include: { address: true },
  });

  return lead;
}

export async function createPartnerLoanApplicationService(
  _body: any,
  _user: { id: string; role: any },
) {
  throw new Error("createPartnerLoanApplicationService not implemented yet");
}

export async function createChildPartnerService(
  parentUserId: string,
  body: CreatePartner,
) {
  const { user, partner } = await createPartnerService(body);
  return { user, partner, parentUserId };
}

/**
 * Get partner statistics and performance dashboard data
 */
export async function getPartnerDashboardService(partnerId: string) {
  const partner = await prisma.partner.findUnique({
    where: { id: partnerId },
    select: {
      id: true,
      partnerCode: true,
      legalName: true,
      Status: true,
      totalLeadsSubmitted: true,
      totalReferrals: true,
      activeReferrals: true,
      commissionEarned: true,
      loginToSanctionRatio: true,
      sanctionToDisbursementRatio: true,
      disbursementVolume: true,
      rejectionRate: true,
      fraudCasesCount: true,
      qualityScore: true,
      partnerRating: true,
      leads: {
        select: {
          id: true,
          status: true,
          createdAt: true,
        },
      },
      commission: {
        select: {
          id: true,
          status: true,
          commissionAmount: true,
          createdAt: true,
        },
      },
    },
  });

  if (!partner) throw new Error("Partner not found");

  return {
    partner,
    stats: {
      leadsCount: partner.leads.length,
      commissionsCount: partner.commission.length,
      totalCommissionEarned: partner.commissionEarned || 0,
    },
  };
}
