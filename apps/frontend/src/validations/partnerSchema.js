import { z } from "zod";

// Client-side partner form schema (keeps most fields optional to avoid blocking)
export const partnerFormSchema = z.object({
  companyName: z.string().trim().min(1, "Legal Name is required"),
  tradeName: z.string().trim().optional(),
  constitutionType: z.string().optional(),
  onboardingDate: z.string().optional(),
  contactPerson: z.string().trim().min(1, "Primary contact is required"),
  email: z.string().trim().email("Valid email is required"),
  contactNumber: z.string().trim().min(6, "Valid contact number is required"),

  partnerType: z.string().optional(),
  status: z.string().optional(),
  commissionType: z.string().optional(),
  commissionValue: z.preprocess((v) => (v === "" ? undefined : Number(v)), z.number().nonnegative().optional()),

  payoutFrequency: z.string().optional(),
  payoutType: z.string().optional(),
  productWisePayoutRates: z.any().optional(),

  gstApplicability: z.union([z.boolean(), z.string()]).optional(),
  gstPercentage: z.preprocess((v) => (v === "" ? undefined : Number(v)), z.number().min(0).max(100).optional()),
  tdsApplicability: z.union([z.boolean(), z.string()]).optional(),
  tdsRate: z.preprocess((v) => (v === "" ? undefined : Number(v)), z.number().min(0).max(100).optional()),

  panNumber: z.string().trim().optional(),
  aadhaarNumber: z.string().trim().optional(),
  gstNumber: z.string().trim().optional(),

  bankName: z.string().trim().min(1, "Bank name is required").optional(),
  accountHolder: z.string().trim().min(1, "Account holder is required").optional(),
  accountNo: z.string().trim().min(1, "Account number is required").optional(),
  ifsc: z.string().trim().optional(),

  // Address fields
  registeredAddressLine1: z.string().trim().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  registeredPinCode: z.string().trim().optional(),

  // Business profile
  natureOfBusiness: z.string().trim().optional(),
  yearsInBusiness: z.preprocess((v) => (v === "" ? undefined : Number(v)), z.number().int().min(0).optional()),
  productExpertise: z.string().trim().optional(),
});

export default partnerFormSchema;
