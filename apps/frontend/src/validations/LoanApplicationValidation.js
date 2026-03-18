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
  "salaried",
  "self_employed",
  "business",
  "professional",
]);

/* ─── ADDRESS ───────────────────────────────────────────────────── */

export const addressSchema = z.object({
  addressType: z.string().optional(),
  addressLine1: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  district: z.string().min(1, "District is required"),
  state: z.string().min(1, "State is required"),
  pinCode: z.string().min(6, "Pin code is required"),
  landmark: z.string().optional(),
  phoneNumber: z.string().optional(),
});

/* ─── OCCUPATIONAL DETAILS ──────────────────────────────────────── */

export const occupationalDetailsSchema = z.object({
  occupationalCategory: z.string().optional(),
  companyBusinessName: z.string().optional(),
  address: addressSchema.optional(),
  phoneNumber: z.string().optional(),
  extensionNumber: z.string().optional(),
  totalWorkExperience: z.coerce.number().optional(),
  noOfEmployees: z.coerce.number().optional(),
  commencementDate: z.coerce.date().optional(),
  businessType: z.string().optional(),
});

/* ─── EMPLOYMENT DETAILS ────────────────────────────────────────── */

export const employmentDetailsSchema = z.object({
  employerType: z.string().optional(),
  designation: z.string().optional(),
  department: z.string().optional(),
  dateOfJoining: z.coerce.date().optional(),
  dateOfRetirement: z.coerce.date().optional(),
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

export const applicantSchema = z.object({
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
  aadhaarNumber: z.string().min(12, "Valid Aadhaar required"),
  panNumber: z.string().min(10, "Valid PAN required"),
  voterId: z.string().optional(),
  drivingLicenceNo: z.string().optional(),
  passportNumber: z.string().optional(),
  contactNumber: z.string().min(10, "Contact number required"),
  alternateNumber: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email().optional(),
  qualification: z.string().optional(),
  employmentType: employmentTypeEnum,
  relationshipWithCoApplicant: z.string().optional(),
  noOfFamilyDependents: z.coerce.number().optional(),
  noOfChildren: z.coerce.number().optional(),
  correspondenceAddressType: z.string().optional(),
  presentAccommodation: z.string().optional(),
  periodOfStay: z.string().optional(),
  rentPerMonth: z.coerce.number().optional(),
});

/* ─── CO‑APPLICANT ──────────────────────────────────────────────── */

export const coApplicantSchema = z.object({
  firstName: z.string().min(1),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  woname: z.string().optional(),
  relation: z.string().optional(),
  contactNumber: z.string().min(10),
  phoneNumber: z.string().optional(),
  email: z.string().email().optional(),
  dob: z.coerce.date().optional(),
  gender: genderEnum.optional(),
  category: categoryEnum.optional(),
  maritalStatus: maritalStatusEnum.optional(),
  noOfDependents: z.coerce.number().optional(),
  noOfChildren: z.coerce.number().optional(),
  qualification: z.string().optional(),
  correspondenceAddressType: z.string().optional(),
  panNumber: z.string().optional(),
  aadhaarNumber: z.string().optional(),
  voterId: z.string().optional(),
  drivingLicenceNo: z.string().optional(),
  passportNumber: z.string().optional(),
  presentAccommodation: z.string().optional(),
  periodOfStay: z.string().optional(),
  rentPerMonth: z.coerce.number().optional(),
  employmentType: employmentTypeEnum.optional(),
  monthlyIncome: z.coerce.number().optional(),
  addresses: z.array(addressSchema).optional(),
  occupationalDetails: occupationalDetailsSchema.optional(),
  employmentDetails: employmentDetailsSchema.optional(),
  financialDetails: financialDetailsSchema.optional(),
});

/* ─── GUARANTOR ─────────────────────────────────────────────────── */

export const guarantorSchema = z.object({
  firstName: z.string().min(1),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  woname: z.string().optional(),
  dob: z.coerce.date().optional(),
  gender: genderEnum.optional(),
  contactNumber: z.string().min(10),
  phoneNumber: z.string().optional(),
  email: z.string().email().optional(),
  panNumber: z.string().optional(),
  aadhaarNumber: z.string().optional(),
  voterId: z.string().optional(),
  drivingLicence: z.string().optional(),
  drivingLicenceNo: z.string().optional(),
  passportNumber: z.string().optional(),
  category: categoryEnum.optional(),
  maritalStatus: maritalStatusEnum.optional(),
  noOfDependents: z.coerce.number().optional(),
  noOfChildren: z.coerce.number().optional(),
  qualification: z.string().optional(),
  correspondenceAddressType: z.string().optional(),
  relationshipWithApplicant: z.string().optional(),
  accommodationType: z.string().optional(),
  presentAccommodation: z.string().optional(),
  periodOfStay: z.string().optional(),
  rentPerMonth: z.coerce.number().optional(),
  employmentType: employmentTypeEnum.optional(),
  addresses: z.array(addressSchema).optional(),
  occupationalDetails: occupationalDetailsSchema.optional(),
  employmentDetails: employmentDetailsSchema.optional(),
  financialDetails: financialDetailsSchema.optional(),
});

/* ─── LOAN REQUIREMENT ──────────────────────────────────────────── */

export const loanRequirementSchema = z.object({
  loanAmount: z.number().positive("Loan amount required"),
  tenure: z.number().int().positive(),
  interestOption: z.enum(["FIXED", "VARIABLE"]),
  loanPurpose: z.string().min(1, "Loan purpose required"),
  repaymentMethod: z.enum([
    "SALARY_DEDUCTION",
    "ECS",
    "CHEQUE",
    "STANDING_INSTRUCTION",
    "OTHER",
  ]),
});

/* ─── FULL LOAN APPLICATION ─────────────────────────────────────── */

export const createLoanApplicationSchema = z.object({
  loanTypeId: z.string().min(1, "Loan type required"),
  leadNumber: z.string().optional(),

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
  creditCards: z.array(z.any()).optional(),
  bankAccounts: z.array(z.any()).optional(),
  insurancePolicies: z.array(z.any()).optional(),
  properties: z.array(z.any()).optional(),
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
      howKnowAboutMPPLOther: z.string().optional(),
      preferLoanSanctionedDate: z.coerce.date().optional(),
      disbursedDate: z.coerce.date().optional(),
      doYouOwn: z.array(z.string()).optional(),
      communicationLanguage: z.string().optional(),
    })
    .optional(),
});

export default createLoanApplicationSchema;
