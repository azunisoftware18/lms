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
  partnerId?: string;
  legalName?: string;
  companyName?: string;
  contactPerson?: string;
  contactPersonName?: string;
  tradeName?: string;
  constitutionType?: string;
  dateOfOnboarding?: Date;
  status?: string;
  alternatePersonName?: string;
  panNumber: string;
  gstNumber?: string;
  aadhaarNumber?: string;
  cinNumber?: string;
  llpinNumber?: string;
  establishedYear?: number;
  partnerType: PartnerType;
  businessNature?: string;

  // business details
  fullAddress?: string;
  city?: string;
  state?: string;
  pinCode?: string;

  // contact details
  alternateContactNumber?: string;
  alternateEmail?: string;

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
  minimumPayout?: number;
  taxDeduction?: number;

  targetArea?: string;
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
  legalName?: string | null;
  companyName?: string | null;
  contactPerson?: string | null;
  contactPersonName?: string | null;
  contactNumber?: string | null;
  alternateContactNumber?: string | null;
  alternateEmail?: string | null;
  tradeName?: string | null;
  panNumber?: string | null;
  aadhaarNumber?: string | null;
  gstNumber?: string | null;
  cinNumber?: string | null;
  llpinNumber?: string | null;
  branchId?: string | null;
  establishedYear?: number | null;
  partnerType?: PartnerType | null;
  constitutionType?: string | null;
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
