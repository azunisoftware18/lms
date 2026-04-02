import { z } from "zod";

/* ─── ENUMS ─────────────────────────────────────────────────────── */

export const titleEnum = z.enum(["MR", "MRS", "MS", "DR", "PROF"]);

export const genderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);

export const maritalStatusEnum = z.enum([
  "SINGLE",
  "MARRIED",
  "DIVORCED",
  "WIDOWED",
  "OTHER",
]);

export const categoryEnum = z.enum([
  "GENERAL",
  "SC",
  "ST",
  "NT",
  "OBC",
  "OTHER",
]);

export const employmentTypeEnum = z.enum([
  "SALARIED",
  "BUSINESS",
  "PROFESSIONAL",
  "OTHER",
]);

/* ─── ADDRESS ───────────────────────────────────────────────────── */

export const addressSchema = z.object({
  addressType: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  pinCode: z.string().optional(),
  landmark: z.string().optional(),
  phoneNumber: z.string().optional(),
});

/* ─── OCCUPATIONAL DETAILS ──────────────────────────────────────── */

export const occupationalCategoryEnum = z.enum([
  "SALARIED",
  "BUSINESS",
  "PROFESSIONAL",
  "OTHER",
]);

export const occupationalDetailsSchema = z.object({
  occupationalCategory: occupationalCategoryEnum.optional(),
  occupationalCategoryOther: z.string().optional(),
  companyBusinessName: z.string().optional(),
  address: addressSchema.optional(),
  phoneNumber: z.string().optional(),
  extensionNumber: z.string().optional(),
  totalWorkExperience: z.coerce.number().optional(),
  noOfEmployees: z.coerce.number().optional(),
  // commencementDate: z.coerce.date().optional(),
  professionalType: z.string().optional(),
  professionalSpecify: z.string().optional(),
  businessType: z.string().optional(),
  businessSpecify: z.string().optional(),
});

/* ─── EMPLOYMENT DETAILS ────────────────────────────────────────── */

export const employerTypeEnum = z.enum([
  "PUBLIC_LTD",
  "MNC",
  "EDUCATIONAL_INST",
  "CENTRAL_STATE_GOVT",
  "PUBLIC_SECTOR_UNIT",
  "PROPRIETOR_PARTNERSHIP",
  "PRIVATE_LTD",
  "OTHER",
]);

export const employmentDetailsSchema = z.object({
  employerType: employerTypeEnum.optional(),
  employerTypeOther: z.string().optional(),
  designation: z.string().optional(),
  department: z.string().optional(),
  dateOfJoining: z.preprocess((arg) => {
    if (arg === null || arg === undefined || arg === "") return undefined;
    if (typeof arg === "string" || arg instanceof Date) {
      const d = new Date(arg);
      return isNaN(d.getTime()) ? undefined : d;
    }
    return undefined;
  }, z.date().optional().nullable()),
  dateOfRetirement: z.preprocess((arg) => {
    if (arg === null || arg === undefined || arg === "") return undefined;
    if (typeof arg === "string" || arg instanceof Date) {
      const d = new Date(arg);
      return isNaN(d.getTime()) ? undefined : d;
    }
    return undefined;
  }, z.date().optional().nullable()),
});

/* ─── FINANCIAL DETAILS ─────────────────────────────────────────── */

export const financialDetailsSchema = z.object({
  grossMonthlyIncome: z.coerce.number().optional(),
  netMonthlyIncome: z.coerce.number().optional(),
  averageMonthlyExpenses: z.coerce.number().optional(),
  savingBankBalance: z.coerce.number().optional(),
  valueOfImmovableProperty: z.coerce.number().optional(),
  currentBalanceInPF: z.coerce.number().optional(),
  valueOfSharesSecurities: z.coerce.number().optional(),
  fixedDeposits: z.coerce.number().optional(),
  otherAssets: z.coerce.number().optional(),
  totalAssets: z.coerce.number().optional(),
  creditSocietyLoan: z.coerce.number().optional(),
  employerLoan: z.coerce.number().optional(),
  homeLoan: z.coerce.number().optional(),
  pfLoan: z.coerce.number().optional(),
  vehicleLoan: z.coerce.number().optional(),
  personalLoan: z.coerce.number().optional(),
  otherLoan: z.coerce.number().optional(),
  totalLiabilities: z.coerce.number().optional(),
});

/* ─── APPLICANT ─────────────────────────────────────────────────── */

export const applicantSchema = z
  .object({
    title: titleEnum,
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last name is required"),
    fatherName: z.string().min(1, "Father name required"),
    motherName: z.string().min(1, "Mother name required"),
    woname: z.string().optional(),
    dob: z.coerce.date(),
    gender: genderEnum,
    maritalStatus: maritalStatusEnum,
    nationality: z.string().min(1, "Nationality required"),
    category: categoryEnum,
    aadhaarNumber: z.string().min(12, "Valid Aadhaar required").optional(),
    panNumber: z.string().min(10, "Valid PAN required").optional(),
    voterId: z.string().optional(),
    drivingLicenceNo: z.string().optional(),
    passportNumber: z.string().optional(),
    contactNumber: z.string().min(10, "Contact number required").optional(),
    alternateNumber: z.string().optional(),
    phoneNumber: z.string().optional(),
    email: z.string().email().optional(),
    qualification: z.string().optional(),
    employmentType: employmentTypeEnum.optional(),
    relationshipWithCoApplicant: z.string().optional(),
    noOfFamilyDependents: z.coerce.number().optional(),
    noOfChildren: z.coerce.number().optional(),
    correspondenceAddressType: z.string().optional(),
    presentAccommodation: z.string().optional(),
    periodOfStay: z.string().optional(),
    rentPerMonth: z.coerce.number().optional(),
  })
  .passthrough();

/* ─── CO‑APPLICANT ──────────────────────────────────────────────── */

export const relationEnum = z.enum([
  "SPOUSE",
  "PARTNER",
  "FATHER",
  "MOTHER",
  "SIBLING",
  "FRIEND",
  "OTHER",
]);

export const coApplicantSchema = z
  .object({
    firstName: z.string().min(1),
    middleName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    fatherName: z.string().min(1).optional(),
    motherName: z.string().min(1).optional(),
    woname: z.string().min(1).optional(),
    relation: relationEnum.optional(),
    contactNumber: z.string().min(10),
    phoneNumber: z.string().min(1).optional(),
    email: z.string().email().optional(),
    dob: z.coerce.date().optional(),
    gender: genderEnum.optional(),
    category: categoryEnum.optional(),
    maritalStatus: maritalStatusEnum.optional(),
    noOfDependents: z.coerce.number().optional(),
    noOfChildren: z.coerce.number().optional(),
    qualification: z.string().min(1).optional(),
    correspondenceAddressType: z.string().min(1).optional(),
    panNumber: z.string().min(1).optional(),
    aadhaarNumber: z.string().min(1).optional(),
    voterId: z.string().min(1).optional(),
    drivingLicenceNo: z.string().optional(),
    passportNumber: z.string().min(1).optional(),
    presentAccommodation: z.string().min(1).optional(),
    periodOfStay: z.string().min(1).optional(),
    rentPerMonth: z.coerce.number().optional(),
    employmentType: employmentTypeEnum.optional(),
    monthlyIncome: z.coerce.number().optional(),
    addresses: z.array(addressSchema).optional(),
    occupationalDetails: occupationalDetailsSchema.optional(),
    employmentDetails: employmentDetailsSchema.optional(),
    financialDetails: financialDetailsSchema.optional(),
  })
  .passthrough();

/* ─── GUARANTOR ─────────────────────────────────────────────────── */

export const relationshipWithApplicantEnum = z.enum([
  "SPOUSE",
  "PARTNER",
  "FATHER",
  "MOTHER",
  "SIBLING",
  "FRIEND",
  "OTHER",
]);

export const guarantorSchema = z
  .object({
    firstName: z.string().min(1),
    middleName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    fatherName: z.string().min(1).optional(),
    motherName: z.string().min(1).optional(),
    woname: z.string().min(1).optional(),
    dob: z.coerce.date().optional(),
    gender: genderEnum.optional(),
    contactNumber: z.string().min(10),
    phoneNumber: z.string().min(1).optional(),
    email: z.string().email().optional(),
    panNumber: z.string().min(1).optional(),
    aadhaarNumber: z.string().min(1).optional(),
    voterId: z.string().min(1).optional(),
    drivingLicence: z.string().min(1).optional(),
    drivingLicenceNo: z.string().optional(),
    passportNumber: z.string().min(1).optional(),
    category: categoryEnum.optional(),
    maritalStatus: maritalStatusEnum.optional(),
    noOfDependents: z.coerce.number().optional(),
    noOfChildren: z.coerce.number().optional(),
    qualification: z.string().min(1).optional(),
    correspondenceAddressType: z.string().min(1).optional(),
    relationshipWithApplicant: relationshipWithApplicantEnum.optional(),
    accommodationType: z.string().min(1).optional(),
    presentAccommodation: z.string().min(1).optional(),
    periodOfStay: z.string().min(1).optional(),
    rentPerMonth: z.coerce.number().optional(),
    employmentType: employmentTypeEnum.optional(),
    addresses: z.array(addressSchema).optional(),
    occupationalDetails: occupationalDetailsSchema.optional(),
    employmentDetails: employmentDetailsSchema.optional(),
    financialDetails: financialDetailsSchema.optional(),
  })
  .passthrough();

/* ─── LOAN REQUIREMENT ──────────────────────────────────────────── */

export const loanPurposeEnum = z.enum([
  "HOME",
  "HOME_IMPROVEMENT",
  "PLOT_PURCHASE",
  "NRPL",
  "POST_DATED_CHEQUE",
  "STANDING_INSTRUCTION",
]);

export const repaymentMethodEnum = z.enum([
  "SALARY_DEDUCTION",
  "ECS",
  "CHEQUE",
]);

export const loanRequirementSchema = z.object({
  loanAmount: z.number().positive("Loan amount required"),
  tenure: z.number().int().positive(),
  interestOption: z.enum(["FIXED", "VARIABLE"]),
  loanPurpose: loanPurposeEnum,
  repaymentMethod: repaymentMethodEnum,
});
/* ─── PROPERTY SCHEMA ──────────────────────────────────────────── */

export const propertySchema = z.object({
  ownershipType: z.string().min(1),
  landType: z.string().min(1).optional(),
  purchaseFrom: z.string().min(1),
  constructionStage: z.string().min(1),
  // Add other property fields as needed
});

/* ─── CREDIT CARD SCHEMA ────────────────────────────────────────── */

export const creditCardSchema = z.object({
  holderName: z.string().optional(),
  cardNo: z.string().optional(),
  cardHolderSince: z.coerce.date().optional(),
  issuingBank: z.string().optional(),
  creditLimit: z.coerce.number().optional(),
  outstandingAmount: z.coerce.number().optional(),
});

export const createLoanApplicationSchema = z.object({
  loanTypeId: z.string().min(1, "Loan type required"),
  leadNumber: z.string().min(1).optional(),

  applicant: applicantSchema,

  addresses: z.object({
    currentAddress: addressSchema,
    permanentAddress: addressSchema.optional(),
  }),

  occupationalDetails: occupationalDetailsSchema.optional(),
  employmentDetails: employmentDetailsSchema.optional(),
  financialDetails: financialDetailsSchema.optional(),

  coApplicants: z.array(coApplicantSchema).optional(),
  guarantors: z.array(guarantorSchema).optional(),

  existingLoans: z.array(z.any()).optional(),
  creditCards: z.array(creditCardSchema).optional(),
  bankAccounts: z.array(z.any()).optional(),
  insurancePolicies: z.array(z.any()).optional(),
  properties: z.array(propertySchema).optional(),
  references: z.array(z.any()).optional(),

  loanRequirement: loanRequirementSchema,

  questionnaire: z
    .object({
      legalPropertyClear: z.boolean().optional(),
      mortgagedElsewhere: z.boolean().optional(),
      residentOfIndia: z.boolean().optional(),
      appliedToMPPLEarlier: z.boolean().optional(),
      givenGuaranteeToMPPL: z.boolean().optional(),
      intendToGiveOnRent: z.boolean().optional(),
      interestedInInsurance: z.boolean().optional(),
      otherLoans: z.boolean().optional(),
      guarantorAnywhere: z.boolean().optional(),
      mppLifeInsurance: z.boolean().optional(),
      howKnowAboutMPPL: z.array(z.string()).optional(),
      howKnowAboutMPPLOther: z.string().min(1).optional(),
      preferLoanSanctionedDate: z.coerce.date().optional(),
      disbursedDate: z.coerce.date().optional(),
      doYouOwn: z.array(z.string()).optional(),
      communicationLanguage: z.string().min(1).optional(),
    })
    .optional(),
});

export default createLoanApplicationSchema;
