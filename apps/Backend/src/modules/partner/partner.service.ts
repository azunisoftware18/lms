import { prisma } from "../../db/prismaService.js";
import { Prisma } from "../../../generated/prisma-client/client.js";

import type {
  CreatePartner,
  PartnerModel,
  UpdatePartner,
} from "./partner.types.js";

export async function createPartnerService(body: CreatePartner) {
  // Check for existing user by email. If exists and already a partner -> error.
  // If exists but not a partner, attach new Partner to that User instead of creating a new User.
  const existingUser = await prisma.user.findUnique({
    where: { email: body.email },
    include: { partner: true },
  });

  let user = null;

  if (existingUser) {
    if (existingUser.partner) {
      // user already has a partner record
      throw new Error("User with this email already exists and is already a partner");
    }

    // update basic fields on existing user if provided
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
    // create user (minimal fields required by User model)
    user = await prisma.user.create({
      data: {
        fullName: body.fullName || body.contactPerson || body.companyName || "",
        userName: body.userName || body.email.split("@")[0],
        email: body.email,
        password: body.password,
        role: "PARTNER",
        contactNumber: body.contactNumber || "",
        branchId: body.branchId,
      },
    });
  }

  const partnerData: Prisma.PartnerCreateInput = {
    user: { connect: { id: user.id } },
    legalName: body.companyName || body.legalName || body.fullName || "",
    tradeName: body.tradeName || undefined,
    partnerType: (body.partnerType as any) || undefined,
    constitutionType: (body.constitutionType as any) || "OTHER",
    dateOfOnboarding: body.dateOfOnboarding ? new Date(body.dateOfOnboarding) : new Date(),
    status: (body.status as any) || undefined,
    contactPersonName: body.contactPerson || body.contactPersonName || user.fullName,
    contactNumber: body.contactNumber || undefined,
    email: body.email || undefined,
    alternatePersonName: body.alternatePersonName || undefined,
    alternateContactNumber: body.alternateContactNumber || undefined,
    alternateEmail: body.alternateEmail || undefined,
    panNumber: body.panNumber,
    aadhaarNumber: body.aadhaarNumber || "",
    cinNumber: body.cinNumber || undefined,
    llpinNumber: body.llpinNumber || undefined,
    panVerificationStatus: (body.panVerificationStatus as any) || undefined,
    gstVerificationStatus: (body.gstVerificationStatus as any) || undefined,
    kycDocumentsUploaded: body.kycDocumentsUploaded || false,
    commercialCibilUploaded: body.commercialCibilUploaded || false,
    cibilCheckUploaded: body.cibilCheckUploaded || false,
    panDocumentId: body.panDocumentId || undefined,
    gstDocumentId: body.gstDocumentId || undefined,
    commercialCibilDocumentId: body.commercialCibilDocumentId || undefined,
    cibilCheckDocumentId: body.cibilCheckDocumentId || undefined,
    cancelledChequeDocumentId: body.cancelledChequeDocumentId || undefined,
    natureOfBusiness: body.businessNature || undefined,
    yearsInBusiness: body.yearsInBusiness || undefined,
    productExpertise: body.productExpertise || undefined,
    monthlySourcingVolume: body.monthlySourcingVolume || undefined,
    geographicCoverage: body.geographicCoverage || undefined,
    totalEmployees: body.totalEmployees || undefined,
    digitalApiIntegration: body.digitalApiIntegration || undefined,
    payoutBankName: body.payoutBankName || undefined,
    payoutAccountHolderName: body.payoutAccountHolderName || undefined,
    payoutAccountNumber: body.payoutAccountNumber || undefined,
    payoutIfscCode: body.payoutIfscCode || undefined,
    payoutUpiId: body.payoutUpiId || undefined,
    bankVerificationStatus: (body.bankVerificationStatus as any) || undefined,
    gstNumber: body.gstNumber || undefined,
    commissionType: (body.commissionType as any) || undefined,
    commissionValue: body.commissionValue || undefined,
    paymentCycle: (body.paymentCycle as any) || undefined,
    minimumPayout: body.minimumPayout || undefined,
    taxDeduction: body.taxDeduction || undefined,
    branch: { connect: { id: body.branchId } },
    isActive: body.isActive ?? true,
    establishedYear: body.establishedYear || undefined,
    specialization: body.specialization || undefined,
    annualTurnover: body.annualTurnover || undefined,
    businessRegistrationNumber: body.businessRegistrationNumber || undefined,
    targetArea: body.targetArea || undefined,
    payoutType: (body.payoutType as any) || undefined,
    productPayoutRates: body.productPayoutRates || undefined,
    roiProcessingShare: body.roiProcessingShare || undefined,
    payoutFrequency: (body.payoutFrequency as any) || undefined,
    gstApplicable: body.gstApplicable ?? true,
    tdsApplicable: body.tdsApplicable ?? false,
    incentiveSchemes: body.incentiveSchemes || undefined,
    clawbackTerms: body.clawbackTerms || undefined,
    maxPayoutCap: body.maxPayoutCap || undefined,
  };

  const partner = await prisma.partner.create({ data: partnerData });

  return { user, partner };
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
          { contactPersonName: { contains: options.q, mode: "insensitive" } },
          { panNumber: { contains: options.q, mode: "insensitive" } },
        ],
      }
    : {};

  const partners = await prisma.partner.findMany({
    where,
    skip,
    take: limit,
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.partner.count({ where });

  return { data: partners, meta: { page, limit, total } };
}

export async function getPartnerByIdService(id: string) {
  const partner = await prisma.partner.findUnique({
    where: { id },
    include: { user: true, addresses: true, commission: true },
  });
  if (!partner) throw new Error("Partner not found");
  return partner;
}

export async function updatePartnerService(id: string, updateData: UpdatePartner) {
  // handle nested user update if provided
  const { user: userUpdate, ...partnerUpdate } = updateData as any;

  if (userUpdate) {
    await prisma.user.update({ where: { id: userUpdate.id ?? undefined, userName: userUpdate.userName ? undefined : undefined }, data: userUpdate as any });
    // Note: above line intentionally minimal — callers should provide correct unique selector for user updates if needed
  }

  const updated = await prisma.partner.update({ where: { id }, data: partnerUpdate as any });
  return updated;
}

export async function createPartnerLeadService(body: any, userId: string) {
  const partner = await prisma.partner.findUnique({ where: { userId } });
  if (!partner) throw new Error("Partner not found for current user");

  const leadNumber = `LD-${Date.now()}`;

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
    },
  });

  return lead;
}

export async function createPartnerLoanApplicationService(_body: any, _user: { id: string; role: any }) {
  throw new Error("createPartnerLoanApplicationService not implemented yet");
}

export async function createChildPartnerService(parentUserId: string, body: CreatePartner) {
  // create a child user/partner pair; no explicit parent relation exists on Partner model
  const { user, partner } = await createPartnerService(body);
  return { user, partner, parentUserId };
}
 