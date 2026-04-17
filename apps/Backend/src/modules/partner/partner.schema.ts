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
    // some clients may send this key; accept it to avoid strict-schema rejection
    alternateContactNumber: z.string().trim().optional(),
    address: z.string().trim().optional(),

    isActive: z.coerce.boolean().optional(),

    // Partner-specific
    partnerId: z.string().trim().optional(), // allow client to provide custom partnerId or let system generate
    companyName: z.string().trim().optional(),
    contactPerson: z.string().trim().optional(),
    panNumber: z.string().trim().min(1, "panNumber is required"),
    aadhaarNumber: z.string().trim().optional(),
    gstNumber: z.string().trim().optional(),
    establishedYear: z.coerce.number().int().min(1800).optional(),
    partnerType: partnerTypeEnum.optional(),
    businessNature: z.string().trim().optional(),

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
    minimumPayout: z.coerce.number().min(0).optional(),
    taxDeduction: z.coerce.number().min(0).optional(),

    targetArea: z.string().trim().optional(),
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
