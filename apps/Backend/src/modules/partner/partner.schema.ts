import { z } from "zod";

// ==================== ENUMS ====================
export const partnerTypeEnum = z.enum(["DSA", "BROKER", "Connector", "Fintech", "Builder", "Aggregator"]);
export const constitutionTypeEnum = z.enum(["INDIVIDUAL", "PROPRIETORSHIP", "PARTNERSHIP", "LLP", "PRIVATE_LTD", "PUBLIC_LTD", "OTHER"]);
export const commissionTypeEnum = z.enum(["FIXED", "PERCENTAGE"]);
export const paymentCycleEnum = z.enum(["MONTHLY", "QUARTERLY", "HALF_YEARLY", "YEARLY", "PER_TRANSACTION"]);
export const payoutTypeEnum = z.enum(["FLAT", "PERCENTAGE", "SLAB"]);
export const payoutFrequencyEnum = z.enum(["MONTHLY", "CASE_WISE", "ON_DISBURSEMENT"]);
export const partnerStatusEnum = z.enum(["ACTIVE", "INACTIVE", "SUSPENDED", "BLACKLISTED"]);
export const verificationStatusEnum = z.enum(["pending", "verified", "rejected"]);

// ==================== ADDRESS SCHEMA ====================
const partnerAddressSchema = z.object({
  addressLine1: z.string().trim().min(1, "Address Line 1 is required"),
  addressLine2: z.string().trim().optional(),
  city: z.string().trim().min(1, "City is required"),
  district: z.string().trim().optional(),
  state: z.string().trim().min(1, "State is required"),
  pinCode: z.string().trim().min(1, "PIN Code is required"),
  landmark: z.string().trim().optional(),
  phoneNumber: z.string().trim().optional(),
});

// ==================== CREATE PARTNER SCHEMA ====================
export const createPartnerSchema = z
  .object({
    // ==================== USER FIELDS ====================
    fullName: z.string().trim().min(1, "Full Name is required"),
    email: z.string().toLowerCase().email("Valid email is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.literal("PARTNER").optional(),
    userName: z.string().trim().min(1, "Username is required"),
    branchId: z.string().trim().min(1, "Branch ID is required"),

    // ==================== BASIC PARTNER INFORMATION ====================
    partnerCode: z.string().trim().optional(), // Auto-generated if not provided
    legalName: z.string().trim().optional(),
    companyName: z.string().trim().optional(),
    tradeName: z.string().trim().optional(),
    partnerType: partnerTypeEnum,
    constitutionType: constitutionTypeEnum.optional().default("INDIVIDUAL"),
    dateOfOnboarding: z.coerce.date().optional(),
    status: partnerStatusEnum.optional().default("ACTIVE"),

    // ==================== CONTACT DETAILS ====================
    contactPerson: z.string().trim().optional(),
    contactPersonName: z.string().trim().min(1, "Contact Person Name is required"),
    contactNumber: z.string().trim().min(1, "Contact Number is required"),
    alternatePersonName: z.string().trim().optional(),
    alternateContactNumber: z.string().trim().optional(),
    alternateNumber: z.string().trim().optional(),
    alternateEmail: z.string().email().optional(),

    // ==================== ADDRESS DETAILS ====================
    address: z.string().trim().optional(),
    fullAddress: z.string().trim().optional(),
    city: z.string().trim().optional(),
    state: z.string().trim().optional(),
    pinCode: z.string().trim().optional(),
    currentAddressLine1: z.string().trim().optional(),
    currentCity: z.string().trim().optional(),
    currentState: z.string().trim().optional(),
    currentPinCode: z.string().trim().optional(),
    permanentAddressLine1: z.string().trim().optional(),
    permanentCity: z.string().trim().optional(),
    permanentState: z.string().trim().optional(),
    permanentPinCode: z.string().trim().optional(),
    addresses: z
      .object({
        currentAddress: partnerAddressSchema.optional(),
        permanentAddress: partnerAddressSchema.optional(),
      })
      .optional(),

    // ==================== KYC & ENTITY VERIFICATION ====================
    panNumber: z.string().trim().min(1, "PAN Number is required"),
    aadhaarNumber: z.string().trim().optional(),
    cinNumber: z.string().trim().optional(),
    gstinNumber: z.string().trim().optional(),
    gstNumber: z.string().trim().optional(),
    llpinNumber: z.string().trim().optional(),
    registrationCertificate: z.string().trim().optional(),

    // Verification Status
    panVerificationStatus: verificationStatusEnum.optional(),
    gstVerificationStatus: verificationStatusEnum.optional(),
    bankVerificationStatus: verificationStatusEnum.optional(),

    // Document Upload Tracking
    kycDocumentsUploaded: z.coerce.boolean().optional(),
    commercialCibilUploaded: z.coerce.boolean().optional(),
    cibilCheckUploaded: z.coerce.boolean().optional(),
    partnerAgreementUploaded: z.coerce.boolean().optional(),
    ndaUploaded: z.coerce.boolean().optional(),

    // Document References
    panDocumentId: z.string().optional(),
    gstDocumentId: z.string().optional(),
    commercialCibilDocumentId: z.string().optional(),
    cibilCheckDocumentId: z.string().optional(),
    cancelledChequeDocumentId: z.string().optional(),

    // ==================== BANKING DETAILS ====================
    payoutBankName: z.string().trim().optional(),
    payoutAccountHolderName: z.string().trim().optional(),
    payoutAccountNumber: z.string().trim().optional(),
    payoutIfscCode: z.string().trim().optional(),
    payoutUpiId: z.string().trim().optional(),
    cancelledChequeUploadPath: z.string().trim().optional(),

    // ==================== BUSINESS PROFILE ====================
    businessNature: z.string().trim().optional(),
    yearsInBusiness: z.coerce.number().int().min(0).optional(),
    establishedYear: z.coerce.number().int().min(1800).optional(),
    productExpertise: z.string().trim().optional(), // comma-separated
    monthlySourcingVolume: z.coerce.number().int().min(0).optional(),
    geographicCoverage: z.string().trim().optional(),
    existingLenderRelationships: z.string().trim().optional(),
    officeStrength: z.coerce.number().int().min(0).optional(),
    digitalApiIntegration: z.coerce.boolean().optional(),
    businessRegistrationNumber: z.string().trim().optional(),
    annualTurnover: z.coerce.number().min(0).optional(),
    designation: z.string().trim().optional(),
    businessCategory: z.string().trim().optional(),
    specialization: z.string().trim().optional(),
    totalEmployees: z.coerce.number().int().min(0).optional(),
    targetArea: z.string().trim().optional(),

    // ==================== AGREEMENT & COMPLIANCE ====================
    agreementValidityDate: z.coerce.date().optional(),
    ndaValidityDate: z.coerce.date().optional(),
    agreementRemarks: z.string().trim().optional(),

    // ==================== SYSTEM ACCESS ====================
    loginId: z.string().trim().optional(),
    assignedRmId: z.string().trim().optional(),
    branchMapping: z.any().optional(),
    productAccess: z.any().optional(),
    apiKey: z.string().trim().optional(),
    integrationId: z.string().trim().optional(),

    // ==================== COMMISSION & PAYOUT ====================
    commissionType: commissionTypeEnum.optional(),
    commissionValue: z.coerce.number().min(0).optional(),
    paymentCycle: paymentCycleEnum.optional(),
    minimumPayout: z.coerce.number().min(0).optional(),
    taxDeduction: z.coerce.number().min(0).optional(),
    payoutType: payoutTypeEnum.optional(),
    productPayoutRates: z.any().optional(),
    roiProcessingShare: z.coerce.number().min(0).optional(),
    payoutFrequency: payoutFrequencyEnum.optional(),
    gstApplicable: z.coerce.boolean().optional().default(true),
    tdsApplicable: z.coerce.boolean().optional().default(false),
    incentiveSchemes: z.any().optional(),
    clawbackTerms: z.string().trim().optional(),
    maxPayoutCap: z.coerce.number().min(0).optional(),

    // ==================== OTHER ====================
    isActive: z.coerce.boolean().optional().default(true),
  })
  .strict();

// ==================== UPDATE PARTNER SCHEMA ====================
export const updatePartnerSchema = createPartnerSchema
  .partial()
  .extend({
    role: z.enum(["ADMIN", "EMPLOYEE", "PARTNER"]).optional(),
    user: z
      .object({
        userName: z.string().trim().optional(),
        role: z.enum(["ADMIN", "EMPLOYEE", "PARTNER"]).optional(),
        contactNumber: z.string().trim().optional(),
        isActive: z.coerce.boolean().optional(),
      })
      .optional(),
    // Performance metrics
    totalLeadsSubmitted: z.coerce.number().int().min(0).optional(),
    totalReferrals: z.coerce.number().int().min(0).optional(),
    activeReferrals: z.coerce.number().int().min(0).optional(),
    commissionEarned: z.coerce.number().min(0).optional(),
    loginToSanctionRatio: z.coerce.number().min(0).max(1).optional(),
    sanctionToDisbursementRatio: z.coerce.number().min(0).max(1).optional(),
    disbursementVolume: z.coerce.number().min(0).optional(),
    rejectionRate: z.coerce.number().min(0).max(100).optional(),
    fraudCasesCount: z.coerce.number().int().min(0).optional(),
    qualityScore: z.coerce.number().min(0).max(100).optional(),
    partnerRating: z.coerce.number().min(0).max(5).optional(),
  })
  .passthrough();

// ==================== ID PARAM SCHEMA ====================
export const partnerIdParamSchema = z.object({
  id: z.string().min(1, "Partner ID is required"),
});

// ==================== LEAD CREATION SCHEMA ====================
export const createLeadSchema = z.object({
  fullName: z.string().trim().min(1, "Full Name is required"),
  contactNumber: z.string().trim().min(1, "Contact Number is required"),
  email: z.string().email("Valid email is required"),
  dob: z.coerce.date(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  loanAmount: z.coerce.number().nonnegative("Loan Amount must be non-negative"),
  loanTypeId: z.string().trim().min(1, "Loan Type ID is required"),
  city: z.string().trim().nullable().optional(),
  state: z.string().trim().nullable().optional(),
  pinCode: z.string().trim().nullable().optional(),
  address: z.string().trim().nullable().optional(),
});
