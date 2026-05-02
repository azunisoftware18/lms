import type {
  EmploymentType as PrismaEmploymentType,
  EmiStatus as PrismaEmiStatus,
  CommissionType,
} from "../../../generated/prisma-client/enums.js";
import * as Enums from "../../../generated/prisma-client/enums.js";

export type InterestType = "FLAT" | "REDUCING";
export type LoanStatus =
  | "LEAD_CREATED"
  | "LEAD_VERIFICATION"
  | "APPLICATION_STARTED"
  | "DOCUMENT_COLLECTION"
  | "KYC_VERIFICATION"
  | "CREDIT_BUREAU_CHECK"
  | "BANK_STATEMENT_ANALYSIS"
  | "ELIGIBILITY_CHECK"
  | "UNDERWRITING"
  | "APPROVED"
  | "REJECTED"
  | "SANCTION_LETTER_ISSUED"
  | "AGREEMENT_SIGNED"
  | "DISBURSEMENT_INITIATED"
  | "DISBURSED"
  | "MOVED_TO_LMS"
  | "ACTIVE"
  | "EMI_SCHEDULE_GENERATED"
  | "EMI_DUE"
  | "PAYMENT_RECEIVED"
  | "DELINQUENT"
  | "COLLECTIONS"
  | "SETTLED"
  | "CLOSED"
  | "WRITTEN_OFF"
  | "DEFAULTED"
  | "FORECLOSURE_PENDING";

export type Title = "MR" | "MRS" | "MS" | "DR" | "PROF";
export type Gender = "MALE" | "FEMALE" | "OTHER";
export type EmploymentType = PrismaEmploymentType;
export type CustomerStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";
export type CustomerKYCStatus = "PENDING" | "VERIFIED" | "REJECTED";
export type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";
export type ApprovalLevel = "LEVEL_1" | "LEVEL_2" | "LEVEL_3";
export type EmiStatus = PrismaEmiStatus;
export type PaymentMode =
  | "CASH"
  | "CHEQUE"
  | "ONLINE_TRANSFER"
  | "NEFT"
  | "RTGS"
  | "IMPS";
export type MaritalStatus =
  | "SINGLE"
  | "MARRIED"
  | "DIVORCED"
  | "WIDOWED"
  | "OTHER";
export type Category = "GENERAL" | "SC" | "ST" | "OBC" | "OTHER";
export type LoanType =
  | "PERSONAL_LOAN"
  | "VEHICLE_LOAN"
  | "HOME_LOAN"
  | "EDUCATION_LOAN"
  | "BUSINESS_LOAN"
  | "GOLD_LOAN";

export interface CreateLoanApplication {
  // ----------------- Customer Fields -----------------
  title: Title;
  firstName: string;
  lastName?: string;
  middleName?: string;
  gender?: Gender;
  dob?: Date | string;

  aadhaarNumber?: string;
  panNumber?: string;
  voterId?: string;
  passportNumber?: string;
  maritalStatus?: MaritalStatus;
  nationality?: string;
  category?: Category;
  spouseName?: string;

  contactNumber: string;
  alternateNumber?: string;
  email?: string;

  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;

  employmentType?: EmploymentType;
  monthlyIncome?: number;
  annualIncome?: number;

  // Bank / account
  bankName?: string;
  bankAccountNumber?: string;
  ifscCode?: string;
  accountType?: string;
  otherIncome?: number;
  accountNumber?: string;

  // ----------------- Loan Fields -----------------
  loanProductId?: string;
  loanTypeId?: string;
  requestedAmount: number;

  tenureMonths?: number;
  interestRate?: number;
  interestType?: InterestType;

  emiAmount?: number;
  totalPayable?: number;
  purposeDetails?: string;
  loanPurpose?: string;
  cibilScore?: number;

  coApplicantAadhaarNumber?: string;
  coApplicantPanNumber?: string;
  coApplicantName?: string;
  coApplicantContactNumber?: string;

  approvedAmount?: number;
  status?: LoanStatus; // optional, default: APPLICATION_STARTED

  documents?: {
    documentType: string;
    documentPath: string;
  }[];

  coApplicants?: {
    firstName: string;
    lastName?: string;
    relation: Enums.CoApplicantRelation;
    contactNumber?: string;
    email?: string;
    dob?: Date | string;
    aadhaarNumber?: string;
    panNumber?: string;
    employmentType?: Enums.EmploymentType;
    monthlyIncome?: number;

    documents?: {
      documentType: string;
      documentPath: string;
    }[];
  }[];
}

export interface EmiScheduleInput {
  loanId: string;
  emiStartDate: Date;
  principal: number;
  annualRate: number;
  tenureMonths: number;
  emiAmount: number;
  startDate: Date;
}

export interface EmiScheduleItem {
  emiStartDate: Date;
  loanApplicationId: string;
  emiNo: number;
  dueDate: Date;
  openingBalance: number;
  interestAmount: number;
  principalAmount: number;
  emiAmount: number;
  closingBalance: number;
  status?: EmiStatus;
  paidDate?: Date | null;
}

export interface apperoveLoanInput {
  latePaymentFeeType: CommissionType;
  latePaymentFee: number;
  bounceCharges: number;
  prepaymentChargeType: CommissionType;
  prepaymentAllowed: boolean;
  prepaymentDate?: Date;
  prepaymentCharges: number;
  foreclosureChargesType: CommissionType;
  foreclosureAllowed: boolean;
  foreclosureDate: Date;
  foreclosureCharges: number;
  // Added approval-related fields used by approveLoanService
  approvedAmount?: number;
  tenureMonths?: number;
  interestType?: InterestType;
  interestRate?: number;
  emiStartDate?: Date;
  emiPaymentAmount?: number;
  emiAmount?: number;
}

export interface FullLoanApplicationInput {
  loanTypeId: string;
  leadNumber: string;

  applicant: {
    title: Enums.Title;
    firstName: string;
    middleName?: string;
    lastName: string;
    fatherName: string;
    motherName: string;
    woname?: string;
    dob: Date;
    aadhaarProvider?:JSON;
    panProvider?: JSON;

    gender: Enums.Gender;
    genderOther?: string;
    maritalStatus: Enums.MaritalStatus;
    maritalStatusOther?: string;
    nationality: string;
    category: Enums.Category;
    categoryOther?: string;

    aadhaarNumber: string;
    panNumber: string;
    voterId?: string;
    drivingLicenceNo?: string;
    passportNumber?: string;

    contactNumber: string;
    alternateNumber?: string;
    email?: string;
    phoneNumber?: string;

    relationshipWithCoApplicant?: Enums.CoApplicantRelation;
    relationWithCoApplicantOther?: string;

    qualification?: string;

    noOfFamilyDependents?: number;
    noOfChildren?: number;

    correspondenceAddressType?: Enums.CorrespondenceAddressType;
    presentAccommodation?: Enums.AccommodationType;
    periodOfStay?: string;
    rentPerMonth?: number;

    employmentType: Enums.EmploymentType;
  };

  addresses: {
    currentAddress: AddressInput;
    permanentAddress?: AddressInput;
  };

  occupationalDetails?: OccupationalInput | OccupationalInput[];

  employmentDetails?: EmploymentInput | EmploymentInput[];

  financialDetails?: FinancialInput;

  coApplicants?: CoApplicantInput[];

  guarantors?: GuarantorInput[];

  existingLoans?: ExistingLoanInput[];

  creditCards?: CreditCardInput[];

  bankAccounts?: BankAccountInput[];

  insurancePolicies?: InsurancePolicyInput[];

  properties?: PropertyInput[];

  references?: ReferenceInput[];

  loanRequirement: LoanRequirementInput;

  questionnaire?: LoanQuestionnaireInput;
}

export interface AddressInput {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: string;
  state: string;
  pinCode: string;
  landmark?: string;
  phoneNumber?: string;
}

export interface OccupationalInput {
  occupationalCategory: Enums.OccupationalCategory;
  occupationalCategoryOther?: string;
  companyBusinessName?: string;
  address?: AddressInput;
  phoneNumber?: string;
  extensionNumber?: string;
  totalWorkExperience?: number;
  noOfEmployees?: number;
  commencementDate?: Date | string;
  professionalType?: Enums.ProfessionalType;
  professionalSpecify?: string;
  businessType?: Enums.BusinessType;
  businessSpecify?: string;
}

export interface EmploymentInput {
  employerType: Enums.EmployerType;
  employerTypeOther?: string;
  designation?: string;
  department?: string;
  dateOfJoining?: Date | string;
  dateOfRetirement?: Date | string;
}

export interface FinancialInput {
  grossMonthlyIncome: number;
  netMonthlyIncome: number;
  averageMonthlyExpenses: number;
  savingBankBalance?: number;
  valueOfImmovableProperty?: number;
  currentBalanceInPF?: number;
  valueOfSharesSecurities?: number;
  fixedDeposits?: number;
  otherAssets?: number;
  totalAssets?: number;
  creditSocietyLoan?: number;
  employerLoan?: number;
  homeLoan?: number;
  pfLoan?: number;
  vehicleLoan?: number;
  personalLoan?: number;
  otherLoan?: number;
  totalLiabilities?: number;
}

export interface CoApplicantInput {
  firstName: string;
  middleName?: string;
  lastName: string;
  aadhaarProvider?: JSON;
  panProvider?: JSON;

  fatherName: string;
  motherName: string;
  woname?: string;
  relation: Enums.CoApplicantRelation;
  relationOther?: string;
  contactNumber: string;
  phoneNumber?: string;
  email?: string;
  dob: Date | string;
  category?: Enums.Category;
  maritalStatus?: Enums.MaritalStatus;
  noOfDependents?: number;
  noOfChildren?: number;
  qualification?: string;
  correspondenceAddressType?: Enums.CorrespondenceAddressType;
  panNumber?: string;
  aadhaarNumber?: string;
  voterId?: string;
  drivingLicenceNo?: string;
  passportNumber?: string;
  presentAccommodation?: Enums.AccommodationType;
  periodOfStay?: string;
  rentPerMonth?: number;
  employmentType: Enums.EmploymentType;
  addresses?: (AddressInput & { addressType: Enums.AddressType })[];
  occupationalDetails?: OccupationalInput | OccupationalInput[];
  employmentDetails?: EmploymentInput | EmploymentInput[];
  financialDetails?: FinancialInput;
}

export interface GuarantorInput {
  firstName: string;
  middleName?: string;
  lastName: string;
  aadhaarProvider?: JSON;
  panProvider?: JSON;
  
  fatherName: string;
  motherName: string;
  woname?: string;
  dob?: Date | string;
  contactNumber?: string;
  phoneNumber?: string;
  email?: string;
  panNumber?: string;
  aadhaarNumber?: string;
  voterId?: string;
  drivingLicence?: string;
  passportNumber?: string;
  category?: Enums.Category;
  maritalStatus?: Enums.MaritalStatus;
  noOfDependents?: number;
  noOfChildren?: number;
  qualification?: string;
  correspondenceAddressType?: Enums.CorrespondenceAddressType;
  relationshipWithApplicant?: Enums.CoApplicantRelation;
  relationshipOther?: string;
  accommodationType?: Enums.AccommodationType;
  periodOfStay?: string;
  rentPerMonth?: number;
  employmentType?: Enums.EmploymentType;
  addresses?: (AddressInput & { addressType: Enums.AddressType })[];
  occupationalDetails?: OccupationalInput | OccupationalInput[];
  employmentDetails?: EmploymentInput | EmploymentInput[];
  financialDetails?: FinancialInput;
}

export interface ExistingLoanInput {
  institutionName: string;
  purpose?: string;
  disbursedAmount?: number;
  emi?: number;
  balanceTerm?: number;
  balanceOutstanding?: number;
}

export interface CreditCardInput {
  holderName: string;
  lastFourDigits: string; // e.g., "4532"
  token?: string; // Tokenized card reference from PCI-compliant service
  issuingBank?: string;
  holderSince?: Date | string;
  creditLimit?: number;
  outstandingAmount?: number;
}

export interface BankAccountInput {
  holderName: string;
  bankName: string;
  branchName?: string;
  accountType: string;
  accountNumber: string;
  openingDate?: Date | string;
  balanceAmount?: number;
}

export interface InsurancePolicyInput {
  issuedBy?: string;
  branchName?: string;
  holderName?: string;
  policyNumber?: string;
  maturityDate?: Date | string;
  policyValue?: number;
  policyType?: string;
  yearlyPremium?: number;
  paidUpValue?: number;
}

export interface PropertyInput {
  propertySelected: boolean;
  landArea?: number;
  buildUpArea?: number;
  ownershipType: Enums.OwnershipType;
  landType: Enums.LandType;
  purchaseFrom: Enums.PurchaseSource;
  purchaseOther?: string;
  constructionStage: Enums.ConstructionStage;
  constructionPercent?: number;
}

export interface ReferenceInput {
  name: string;
  fatherName?: string;
  relation?: string;
  contactNumber: string;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  phone?: string;
  occupation?: string;
}

export interface LoanRequirementInput {
  loanAmount: number;
  tenure?: number;
  interestOption: Enums.InterestOption;
  loanPurpose: Enums.LoanPurpose;
  loanPurposeOther?: string;
  repaymentMethod: Enums.RepaymentMethod;
  interestType?: Enums.InterestType;
}

export interface LoanQuestionnaireInput {
  legalPropertyClear?: boolean;
  mortgagedElsewhere?: boolean;
  residentOfIndia?: boolean;
  otherLoans?: boolean;
  guarantorAnywhere?: boolean;
  mppLifeInsurance?: boolean;
}
