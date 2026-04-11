export type PartnerType =
  | "INDIVIDUAL"
  | "COMPANY"
  | "INSTITUTION"
  | "CORPORATE"
  | "AGENCY";
export type CommissionType = "FIXED" | "PERCENTAGE";

export type PaymentCycle =
  | "MONTHLY"
  | "QUARTERLY"
  | "HALF_YEARLY"
  | "YEARLY"
  | "PER_TRANSACTION";

export interface CreatePartner {
  // user fields
  fullName: string;
  email: string;
  password: string;
  role?: "PARTNER";
  userName: string;
  branchId: string;

  // contact
  address?: string;
  contactNumber?: string;
  alternateNumber?: string;

  isActive?: boolean;

  // partner-specific
  companyName?: string;
  contactPerson?: string;
  panNumber: string;
  gstNumber?: string;
  establishedYear?: number;
  partnerType: PartnerType;
  businessNature?: string;
  partnerCode?: string;
  constitutionType?:
    | "INDIVIDUAL"
    | "PROPRIETORSHIP"
    | "PARTNERSHIP"
    | "LLP"
    | "PRIVATE_LIMITED"
    | "PUBLIC_LIMITED"
    | "OTHER";
  onboardingDate?: Date | string;

  // business details
  fullAddress?: string;
  city?: string;
  state?: string;
  pinCode?: string;

  designation?: string;
  businessCategory?: string;
  specialization?: string;
  totalEmployees?: number;
  annualTurnover?: number;
  businessRegistrationNumber?: string;

  // commission & payouts
  commissionType?: CommissionType;
  commissionValue?: number;
  paymentCycle?: PaymentCycle;
  payoutFrequency?: "MONTHLY" | "CASE_WISE";
  payoutType?: "FLAT" | "PERCENTAGE" | "SLAB";
  gstApplicable?: boolean;
  tdsApplicable?: boolean;
  maxPayoutCap?: number;
  minimumPayout?: number;
  taxDeduction?: number;

  targetArea?: string;
  // KYC
  aadhaarNumber?: string;
  registrationNo?: string;
  documents?: Record<string, string>;
  llpNumber?: string;
  panVerificationStatus?: "pending" | "verified" | "rejected";
  gstVerificationStatus?: "pending" | "verified" | "rejected";
  kycDocumentsUploaded?: boolean;

  // Secondary contact
  secondaryContactPerson?: string;
  secondaryContactNumber?: string;
  secondaryContactEmail?: string;

  // Banking
  bankName?: string;
  accountHolder?: string;
  accountNo?: string;
  ifsc?: string;
  upiId?: string;

  // System access
  portalAccess?: boolean;
  loginId?: string;
  accessType?: "LEAD_UPLOAD" | "FULL_LOS" | "VIEW_ONLY";
  assignedRelationshipManager?: string;
  branchMapping?: string;
  productAccess?: string[];

  // Performance metrics (optional)
  totalLeadsSubmitted?: number;
  loginToSanctionRatio?: number;
  sanctionToDisbursementRatio?: number;
  disbursementVolume?: number;
  rejectionRate?: number;
  fraudCasesCount?: number;
  qualityScore?: number;
  partnerRating?: number;
}

export interface UpdatePartner
  extends Omit<Partial<CreatePartner>, "password"> {
  totalReferrals?: number;
  activeReferrals?: number;
  commissionEarned?: number;
}

export interface PartnerModel {
  id: string;
  userId: string;
  userName?: string | null;
  partnerId?: string | null;
  companyName?: string | null;
  contactPerson?: string | null;
  alternateNumber?: string | null;
  panNumber?: string | null;
  gstNumber?: string | null;
  branchId?: string | null;
  establishedYear?: number | null;
  partnerType?: PartnerType | null;
  businessNature?: string | null;
  fullAddress?: string | null;
  city?: string | null;
  state?: string | null;
  pinCode?: string | null;
  designation?: string | null;
  businessCategory?: string | null;
  specialization?: string | null;
  totalEmployees?: number | null;
  annualTurnover?: number | null;
  businessRegistrationNumber?: string | null;
  commissionType?: CommissionType | null;
  paymentCycle?: PaymentCycle | null;
  minimumPayout?: number | null;
  taxDeduction?: number | null;
  targetArea?: string | null;
  totalReferrals?: number | null;
  activeReferrals?: number | null;
  commissionEarned?: number | null;
  createdAt: Date;
  updatedAt: Date;
}
