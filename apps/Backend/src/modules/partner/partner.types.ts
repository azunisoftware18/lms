export type PartnerType = "DSA" | "BROKER" | "Connector" | "Fintech" | "Builder" | "Aggregator";
export type ConstitutionType = "INDIVIDUAL" | "PROPRIETORSHIP" | "PARTNERSHIP" | "LLP" | "PRIVATE_LTD" | "PUBLIC_LTD" | "OTHER";
export type CommissionType = "FIXED" | "PERCENTAGE";
export type PaymentCycle = "MONTHLY" | "QUARTERLY" | "HALF_YEARLY" | "YEARLY" | "PER_TRANSACTION";
export type PayoutType = "FLAT" | "PERCENTAGE" | "SLAB";
export type PayoutFrequency = "MONTHLY" | "CASE_WISE" | "ON_DISBURSEMENT";
export type PartnerStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "BLACKLISTED";
export type VerificationStatus = "pending" | "verified" | "rejected";

// ==================== CREATE PARTNER INTERFACE ====================
export interface CreatePartner {
  // ==================== BASIC INFORMATION ====================
  // User fields (for User account creation)
  fullName: string;
  email: string;
  password: string;
  role?: "PARTNER";
  userName: string;
  branchId: string;

  // Partner Code (auto-generated or provided)
  partnerCode?: string;

  // Legal & Business Identity
  legalName?: string;
  companyName?: string;
  tradeName?: string;
  partnerType: PartnerType;
  constitutionType?: ConstitutionType;
  dateOfOnboarding?: Date;
  status?: PartnerStatus;

  // ==================== CONTACT DETAILS ====================
  // Primary Contact
  contactPerson?: string;
  contactPersonName?: string;
  contactNumber: string;
  

  // Secondary Contact
  alternatePersonName?: string;
  alternateContactNumber?: string;
  alternateEmail?: string;
  alternateNumber?: string;

  // ==================== ADDRESS DETAILS ====================
  address?: string;
  fullAddress?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  currentAddressLine1?: string;
  currentCity?: string;
  currentState?: string;
  currentPinCode?: string;
  permanentAddressLine1?: string;
  permanentCity?: string;
  permanentState?: string;
  permanentPinCode?: string;
  addresses?: {
    currentAddress?: AddressInput;
    permanentAddress?: AddressInput;
  };

  // ==================== KYC & ENTITY VERIFICATION ====================
  // Individual / Proprietor
  panNumber: string;
  aadhaarNumber?: string;

  // Entity Details
  cinNumber?: string;
  gstinNumber?: string;
  gstNumber?: string;
  llpinNumber?: string;
  registrationCertificate?: string;

  // Verification Status
  panVerificationStatus?: VerificationStatus;
  gstVerificationStatus?: VerificationStatus;
  bankVerificationStatus?: VerificationStatus;

  // Document Upload Tracking
  kycDocumentsUploaded?: boolean;
  commercialCibilUploaded?: boolean;
  cibilCheckUploaded?: boolean;
  partnerAgreementUploaded?: boolean;
  ndaUploaded?: boolean;

  // Document References (from Document model)
  panDocumentId?: string;
  gstDocumentId?: string;
  commercialCibilDocumentId?: string;
  cibilCheckDocumentId?: string;
  cancelledChequeDocumentId?: string;

  // ==================== BANKING DETAILS ====================
  payoutBankName?: string;
  payoutAccountHolderName?: string;
  payoutAccountNumber?: string;
  payoutIfscCode?: string;
  payoutUpiId?: string;
  cancelledChequeUploadPath?: string;

  // ==================== BUSINESS PROFILE ====================
  businessNature?: string;
  yearsInBusiness?: number;
  establishedYear?: number;
  productExpertise?: string; // comma-separated
  monthlySourcingVolume?: number;
  geographicCoverage?: string;
  existingLenderRelationships?: string;
  officeStrength?: number;
  digitalApiIntegration?: boolean;
  businessRegistrationNumber?: string;
  annualTurnover?: number;
  designation?: string;
  businessCategory?: string;
  specialization?: string;
  totalEmployees?: number;
  targetArea?: string;

  // ==================== AGREEMENT & COMPLIANCE ====================
  agreementValidityDate?: Date;
  ndaValidityDate?: Date;
  agreementRemarks?: string;

  // ==================== SYSTEM ACCESS ====================
  loginId?: string;
  assignedRmId?: string;
  branchMapping?: any;
  productAccess?: any;
  apiKey?: string;
  integrationId?: string;

  // ==================== COMMISSION & PAYOUT ====================
  commissionType?: CommissionType;
  commissionValue?: number;
  paymentCycle?: PaymentCycle;
  minimumPayout?: number;
  taxDeduction?: number;
  payoutType?: PayoutType;
  productPayoutRates?: any;
  roiProcessingShare?: number;
  payoutFrequency?: PayoutFrequency;
  gstApplicable?: boolean;
  tdsApplicable?: boolean;
  incentiveSchemes?: any;
  clawbackTerms?: string;
  maxPayoutCap?: number;

  // ==================== OTHER ====================
  isActive?: boolean;
}

// ==================== UPDATE PARTNER INTERFACE ====================
export interface UpdatePartner extends Omit<Partial<CreatePartner>, "password"> {
  // Performance metrics (typically updated separately)
  totalLeadsSubmitted?: number;
  totalReferrals?: number;
  activeReferrals?: number;
  commissionEarned?: number;
  loginToSanctionRatio?: number;
  sanctionToDisbursementRatio?: number;
  disbursementVolume?: number;
  rejectionRate?: number;
  fraudCasesCount?: number;
  qualityScore?: number;
  partnerRating?: number;
}

// ==================== PARTNER MODEL INTERFACE ====================
export interface PartnerModel {
  // Basic Information
  id: string;
  userId: string;
  partnerCode: string;
  legalName: string;
  tradeName?: string | null;
  partnerType: PartnerType;
  constitutionType: ConstitutionType;
  dateOfOnboarding: Date;
  Status: PartnerStatus;
  isActive: boolean;

  // Contact Details
  contactPersonName: string;
  contactNumber: string;
  email?: string | null;
  alternatePersonName?: string | null;
  alternateContactNumber?: string | null;

  // KYC & Verification
  panNumber: string;
  aadhaarNumber: string;
  cinNumber?: string | null;
  gstinNumber?: string | null;
  gstNumber?: string | null;
  llpinNumber?: string | null;
  registrationCertificate?: string | null;
  panVerificationStatus: VerificationStatus;
  gstVerificationStatus: VerificationStatus;
  bankVerificationStatus: VerificationStatus;
  kycDocumentsUploaded: boolean;
  commercialCibilUploaded: boolean;
  cibilCheckUploaded: boolean;
  partnerAgreementUploaded?: boolean;
  ndaUploaded?: boolean;

  // Banking Details
  payoutBankName?: string | null;
  payoutAccountHolderName?: string | null;
  payoutAccountNumber?: string | null;
  payoutIfscCode?: string | null;
  payoutUpiId?: string | null;
  cancelledChequeUploadPath?: string | null;

  // Business Profile
  companyName?: string | null;
  businessNature?: string | null;
  yearsInBusiness?: number | null;
  establishedYear?: number | null;
  productExpertise?: string | null;
  monthlySourcingVolume?: number | null;
  geographicCoverage?: string | null;
  existingLenderRelationships?: string | null;
  officeStrength?: number | null;
  digitalApiIntegration: boolean;
  businessRegistrationNumber?: string | null;
  annualTurnover?: number | null;
  designation?: string | null;
  businessCategory?: string | null;
  specialization?: string | null;
  totalEmployees?: number | null;
  targetArea?: string | null;

  // Agreement & Compliance
  agreementValidityDate?: Date | null;
  ndaValidityDate?: Date | null;
  agreementRemarks?: string | null;

  // System Access
  loginId?: string | null;
  assignedRmId?: string | null;
  branchMapping?: any;
  productAccess?: any;
  apiKey?: string | null;
  integrationId?: string | null;

  // Commission & Payout
  commissionType: CommissionType;
  commissionValue?: number | null;
  paymentCycle: PaymentCycle;
  minimumPayout?: number | null;
  taxDeduction?: number | null;
  payoutType?: PayoutType | null;
  productPayoutRates?: any;
  roiProcessingShare?: number | null;
  payoutFrequency?: PayoutFrequency | null;
  gstApplicable: boolean;
  tdsApplicable: boolean;
  incentiveSchemes?: any;
  clawbackTerms?: string | null;
  maxPayoutCap?: number | null;

  // Performance Tracking
  totalLeadsSubmitted: number;
  totalReferrals: number;
  activeReferrals: number;
  commissionEarned: number;
  loginToSanctionRatio?: number | null;
  sanctionToDisbursementRatio?: number | null;
  disbursementVolume?: number | null;
  rejectionRate?: number | null;
  fraudCasesCount: number;
  qualityScore?: number | null;
  partnerRating: number;

  // Relations
  branchId: string;

  // Audit
  createdAt: Date;
  updatedAt: Date;
}

// ==================== ADDRESS INPUT INTERFACE ====================
export interface AddressInput {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district?: string;
  state: string;
  pinCode: string;
  landmark?: string;
  phoneNumber?: string;
}
