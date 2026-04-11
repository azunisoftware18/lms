import { z } from "zod";
export const genderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);

export const partnerTypeEnum = z.enum([
  "INDIVIDUAL",
  "COMPANY",
  "INSTITUTION",
  "CORPORATE",
  "AGENCY",
]);

export const commissionTypeEnum = z.enum(["FIXED", "PERCENTAGE"]);

export const paymentCycleEnum = z.enum([
  "MONTHLY",
  "QUARTERLY",
  "HALF_YEARLY",
  "YEARLY",
  "PER_TRANSACTION",
]);

export const constitutionEnum = z.enum([
  "INDIVIDUAL",
  "PROPRIETORSHIP",
  "PARTNERSHIP",
  "LLP",
  "PRIVATE_LIMITED",
  "PUBLIC_LIMITED",
  "OTHER",
]);

export const accessTypeEnum = z.enum(["LEAD_UPLOAD", "FULL_LOS", "VIEW_ONLY"]);

export const payoutTypeEnum = z.enum(["FLAT", "PERCENTAGE", "SLAB"]);

const partnerAddressSchema = z.object({
  addressLine1: z.string().trim().min(1),
  addressLine2: z.string().trim().optional(),
  city: z.string().trim().min(1),
  district: z.string().trim().optional(),
  state: z.string().trim().min(1),
  pinCode: z.string().trim().min(1),
  landmark: z.string().trim().optional(),
  phoneNumber: z.string().trim().optional(),
});

/* ================= CREATE ================= */

export const createPartnerSchema = z
  .object({
    // User fields
    fullName: z.string().trim().min(1, "fullName is required"),
    email: z.string().toLowerCase().email("Valid email is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.literal("PARTNER").optional(),
    userName: z.string().trim(),
    branchId: z.string().trim().min(1, "branchId cannot be empty").optional(),
    // Contact
    contactNumber: z.string().trim().min(1, "contactNumber is required"),
    alternateNumber: z.string().trim().optional(),
    address: z.string().trim().optional(),

    isActive: z.coerce.boolean().optional(),

    
    companyName: z.string().trim().optional(),
    contactPerson: z.string().trim().optional(),
    panNumber: z.string().trim().min(1, "panNumber is required"),
    gstNumber: z.string().trim().optional(),
    establishedYear: z.coerce.number().int().min(1800).optional(),
    partnerType: partnerTypeEnum.optional(),
    businessNature: z.string().trim().optional(),
    partnerCode: z.string().trim().optional(),
    constitutionType: constitutionEnum.optional(),
    onboardingDate: z.coerce.date().optional(),

    // Business details
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
    designation: z.string().trim().optional(),
    businessCategory: z.string().trim().optional(),
    specialization: z.string().trim().optional(),
    totalEmployees: z.coerce.number().int().min(0).optional(),
    annualTurnover: z.coerce.number().min(0).optional(),
    businessRegistrationNumber: z.string().trim().optional(),

    // commission & payouts
    commissionType: commissionTypeEnum.optional(),
    commissionValue: z.coerce.number().min(0).optional(),
    paymentCycle: paymentCycleEnum.optional(),
    payoutFrequency: z.enum(["MONTHLY", "CASE_WISE"]).optional(),
    payoutType: payoutTypeEnum.optional(),
    gstApplicable: z.coerce.boolean().optional(),
    tdsApplicable: z.coerce.boolean().optional(),
    maxPayoutCap: z.coerce.number().optional(),
    minimumPayout: z.coerce.number().min(0).optional(),
    taxDeduction: z.coerce.number().min(0).optional(),

    targetArea: z.string().trim().optional(),
    // KYC / Verification
    aadhaarNumber: z.string().trim().optional(),
    registrationNo: z.string().trim().optional(), // CIN / company reg
    // Document uploads and URLs
    documents: z
      .object({
        partnerAgreementUrl: z.string().trim().optional(),
        panCopyUrl: z.string().trim().optional(),
        gstCertUrl: z.string().trim().optional(),
        incorporationCertUrl: z.string().trim().optional(),
        registrationCertificateUrl: z.string().trim().optional(),
        bankProofUrl: z.string().trim().optional(),
        addressProofUrl: z.string().trim().optional(),
        boardResolutionUrl: z.string().trim().optional(),
        authorizationLetterUrl: z.string().trim().optional(),
        agreementUrl: z.string().trim().optional(),
        agreementValidityDate: z.coerce.date().optional(),
        ndaUrl: z.string().trim().optional(),
        commercialCibilUrl: z.string().trim().optional(),
        cibilCheckUrl: z.string().trim().optional(),
        directorCibilUrl: z.string().trim().optional(),
      })
      .optional(),

    // Verification status fields
    panVerificationStatus: z.enum(["pending", "verified", "rejected"]).optional(),
    gstVerificationStatus: z.enum(["pending", "verified", "rejected"]).optional(),
    kycDocumentsUploaded: z.coerce.boolean().optional(),

    // Banking
    bankName: z.string().trim().optional(),
    accountHolder: z.string().trim().optional(),
    accountNo: z.string().trim().optional(),
    ifsc: z.string().trim().optional(),
    upiId: z.string().trim().optional(),

    // System access & mapping
    portalAccess: z.coerce.boolean().optional(),
    loginId: z.string().trim().optional(),
    accessType: accessTypeEnum.optional(),
    assignedRelationshipManager: z.string().trim().optional(),
    branchMapping: z.string().trim().optional(),
    productAccess: z.array(z.string()).optional(),

    // Secondary contact
    secondaryContactPerson: z.string().trim().optional(),
    secondaryContactNumber: z.string().trim().optional(),
    secondaryContactEmail: z.string().trim().email().optional(),

    // Partner performance metrics (readonly at create, optional)
    totalLeadsSubmitted: z.coerce.number().optional(),
    loginToSanctionRatio: z.coerce.number().optional(),
    sanctionToDisbursementRatio: z.coerce.number().optional(),
    disbursementVolume: z.coerce.number().optional(),
    rejectionRate: z.coerce.number().optional(),
    fraudCasesCount: z.coerce.number().optional(),
    qualityScore: z.coerce.number().optional(),
    partnerRating: z.coerce.number().optional(),
  })
  .strict();

/* ================= UPDATE ================= */

export const updatePartnerSchema = createPartnerSchema
  .partial()
  .extend({
    // allow role to be changed to any valid role on update
    role: z.enum(["ADMIN", "EMPLOYEE", "PARTNER"]).optional(),

    // allow nested `user` updates (e.g., { user: { userName, role } })
    user: z
      .object({
        userName: z.string().trim().optional(),
        role: z.enum(["ADMIN", "EMPLOYEE", "PARTNER"]).optional(),
        contactNumber: z.string().trim().optional(),
        isActive: z.coerce.boolean().optional(),
      })
      .optional(),
  })
  // allow extra keys on update so partial updates from clients aren't rejected
  .passthrough();

/* ================= PARAM ================= */

export const partnerIdParamSchema = z.object({
  id: z.string().min(1, "id param is required"),
});

export const createLeadSchema = z.object({
  fullName: z.string().trim().min(1, "fullName is required"),
  contactNumber: z.string().trim().min(1, "contactNumber is required"),
  email: z.string().email("Valid email is required"),
  dob: z.coerce.date(),
  gender: genderEnum,
  loanAmount: z.coerce.number().nonnegative(),
  loanTypeId: z.string().trim().min(1, "loanTypeId is required"),
  city: z.string().trim().nullable(),
  state: z.string().trim().nullable(),
  pinCode: z.string().trim().nullable(),
  address: z.string().trim().nullable(),
});
