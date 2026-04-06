import { z } from "zod";

const emptyToUndefined = (arg) =>
  typeof arg === "string" && arg.trim() === "" ? undefined : arg;

const optionalString = z.preprocess(emptyToUndefined, z.string().optional());
const optionalNonEmptyString = z.preprocess(
  emptyToUndefined,
  z.string().min(1).optional(),
);
const optionalEmail = z.preprocess(
  emptyToUndefined,
  z.string().email().optional(),
);
const optionalNumber = z.preprocess((arg) => {
  if (arg === null || arg === undefined || arg === "") return undefined;
  if (typeof arg === "number") return Number.isFinite(arg) ? arg : undefined;
  const parsed = Number(arg);
  return Number.isFinite(parsed) ? parsed : undefined;
}, z.number().optional());
const optionalDate = z.preprocess((arg) => {
  if (arg === null || arg === undefined || arg === "") return undefined;
  if (arg instanceof Date) return isNaN(arg.getTime()) ? undefined : arg;
  if (typeof arg === "string" || typeof arg === "number") {
    const d = new Date(arg);
    return isNaN(d.getTime()) ? undefined : d;
  }
  return undefined;
}, z.date().optional());

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
  addressType: optionalString,
  addressLine1: optionalString,
  addressLine2: optionalString,
  city: optionalString,
  district: optionalString,
  state: optionalString,
  pinCode: optionalString,
  landmark: optionalString,
  phoneNumber: optionalString,
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
  occupationalCategoryOther: optionalString,
  companyBusinessName: optionalString,
  address: addressSchema.optional(),
  phoneNumber: optionalString,
  extensionNumber: optionalString,
  totalWorkExperience: optionalNumber,
  noOfEmployees: optionalNumber,
  // commencementDate: z.coerce.date().optional(),
  professionalType: optionalString,
  professionalSpecify: optionalString,
  businessType: optionalString,
  businessSpecify: optionalString,
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
  employerTypeOther: optionalString,
  designation: optionalString,
  department: optionalString,
  dateOfJoining: optionalDate,
  dateOfRetirement: optionalDate,
});

/* ─── FINANCIAL DETAILS ─────────────────────────────────────────── */

export const financialDetailsSchema = z.object({
  grossMonthlyIncome: optionalNumber,
  netMonthlyIncome: optionalNumber,
  averageMonthlyExpenses: optionalNumber,
  savingBankBalance: optionalNumber,
  valueOfImmovableProperty: optionalNumber,
  currentBalanceInPF: optionalNumber,
  valueOfSharesSecurities: optionalNumber,
  fixedDeposits: optionalNumber,
  otherAssets: optionalNumber,
  totalAssets: optionalNumber,
  creditSocietyLoan: optionalNumber,
  employerLoan: optionalNumber,
  homeLoan: optionalNumber,
  pfLoan: optionalNumber,
  vehicleLoan: optionalNumber,
  personalLoan: optionalNumber,
  otherLoan: optionalNumber,
  totalLiabilities: optionalNumber,
});

/* ─── APPLICANT ─────────────────────────────────────────────────── */

export const applicantSchema = z
  .object({
    title: titleEnum,
    firstName: z.string().min(1, "First name is required"),
    middleName: optionalString,
    lastName: z.string().min(1, "Last name is required"),
    fatherName: z.string().min(1, "Father name required"),
    motherName: z.string().min(1, "Mother name required"),
    woname: optionalString,
    dob: z.coerce.date(),
    gender: genderEnum,
    maritalStatus: maritalStatusEnum,
    nationality: z.string().min(1, "Nationality required"),
    category: categoryEnum,
    voterId: optionalString,
    drivingLicenceNo: optionalString,
    passportNumber: optionalString,
    aadhaarNumber: z.string().min(12, "Valid Aadhaar required"),
    panNumber: z.string().min(10, "Valid PAN required"),
    contactNumber: z.string().min(10, "Contact number required"),
    alternateNumber: optionalString,
    phoneNumber: optionalString,
    email: optionalEmail,
    qualification: optionalString,
    employmentType: employmentTypeEnum,
    relationshipWithCoApplicant: optionalString,
    noOfFamilyDependents: optionalNumber,
    noOfChildren: optionalNumber,
    correspondenceAddressType: optionalString,
    presentAccommodation: optionalString,
    periodOfStay: optionalString,
    rentPerMonth: optionalNumber,
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
    middleName: optionalNonEmptyString,
    lastName: optionalNonEmptyString,
    fatherName: z.string().min(1, "Father name required"),
    motherName: z.string().min(1, "Mother name required"),
    woname: optionalNonEmptyString,
    relation: relationEnum,
    contactNumber: z.string().min(10),
    phoneNumber: optionalNonEmptyString,
    email: optionalEmail,
    dob: z.coerce.date(),
    gender: genderEnum.optional(),
    category: categoryEnum.optional(),
    maritalStatus: maritalStatusEnum.optional(),
    noOfDependents: optionalNumber,
    noOfChildren: optionalNumber,
    qualification: optionalNonEmptyString,
    correspondenceAddressType: optionalNonEmptyString,
    panNumber: z.string().min(10, "Valid PAN required"),
    aadhaarNumber: z.string().min(12, "Valid Aadhaar required"),
    voterId: optionalNonEmptyString,
    drivingLicenceNo: optionalString,
    passportNumber: optionalString,
    presentAccommodation: optionalNonEmptyString,
    periodOfStay: optionalNonEmptyString,
    rentPerMonth: optionalNumber,
    employmentType: employmentTypeEnum,
    monthlyIncome: optionalNumber,
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
    middleName: optionalNonEmptyString,
    lastName: z.string().min(1),
    fatherName: z.string().min(1, "Father name required"),
    motherName: z.string().min(1, "Mother name required"),
    woname: optionalNonEmptyString,
    dob: z.coerce.date(),
    gender: genderEnum.optional(),
    contactNumber: z.string().min(10),
    phoneNumber: optionalNonEmptyString,
    email: optionalEmail,
    panNumber: z.string().min(10, "Valid PAN required"),
    aadhaarNumber: z.string().min(12, "Valid Aadhaar required"),
    voterId: optionalNonEmptyString,
    drivingLicence: optionalNonEmptyString,
    drivingLicenceNo: optionalString,
    passportNumber: optionalString,
    category: categoryEnum.optional(),
    maritalStatus: maritalStatusEnum.optional(),
    noOfDependents: optionalNumber,
    noOfChildren: optionalNumber,
    qualification: optionalString,
    correspondenceAddressType: optionalNonEmptyString,
    relationshipWithApplicant: relationshipWithApplicantEnum,
    accommodationType: optionalNonEmptyString,
    presentAccommodation: optionalNonEmptyString,
    periodOfStay: optionalNonEmptyString,
    rentPerMonth: optionalNumber,
    employmentType: employmentTypeEnum,
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
  "LAND_PURCHASE",
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
  propertySelected: z.boolean(),
  ownershipType: z.string().min(1),
  landType: optionalNonEmptyString,
  purchaseFrom: z.string().min(1),
  constructionStage: z.string().min(1),
  // Add other property fields as needed
});

/* ─── CREDIT CARD SCHEMA ────────────────────────────────────────── */

export const creditCardSchema = z.object({
  holderName: z.string().min(1),
  lastFourDigits: z
    .string()
    .regex(/^\d{4}$/)
    .optional(),
  cardNumber: z
    .string()
    .regex(/^\d{13,19}$/, "Invalid credit card number")
    .optional(),
  holderSince: optionalDate,
  issuingBank: optionalString,
  creditLimit: optionalNumber,
  outstandingAmount: optionalNumber,
});

export const existingLoanSchema = z.object({
  institutionName: z.string().min(1),
  purpose: optionalString,
  disbursedAmount: optionalNumber,
  emi: optionalNumber,
  balanceTerm: optionalNumber,
  balanceOutstanding: optionalNumber,
});

export const bankAccountSchema = z.object({
  holderName: z.string().min(1),
  bankName: z.string().min(1),
  branchName: optionalString,
  accountType: z.string().min(1),
  accountNumber: z.string().min(1),
  openingDate: optionalDate,
  balanceAmount: optionalNumber,
});

export const referenceSchema = z.object({
  name: z.string().min(1),
  fatherName: optionalString,
  relation: optionalString,
  contactNumber: z.string().min(10),
  phone: optionalString,
  address: optionalString,
  city: optionalString,
  state: optionalString,
  pinCode: optionalString,
  occupation: optionalString,
});

export const createLoanApplicationSchema = z.object({
  loanTypeId: z.string().min(1, "Loan type required"),
  leadNumber: optionalNonEmptyString,

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

  existingLoans: z.array(existingLoanSchema).optional(),
  creditCards: z.array(creditCardSchema).optional(),
  bankAccounts: z.array(bankAccountSchema).optional(),
  insurancePolicies: z.array(z.any()).optional(),
  properties: z.array(propertySchema).optional(),
  references: z.array(referenceSchema).optional(),

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
      howKnowAboutMPPLOther: optionalNonEmptyString,
      preferLoanSanctionedDate: optionalDate,
      disbursedDate: optionalDate,
      doYouOwn: z.array(z.string()).optional(),
      communicationLanguage: optionalNonEmptyString,
    })
    .optional(),
});

export default createLoanApplicationSchema;
