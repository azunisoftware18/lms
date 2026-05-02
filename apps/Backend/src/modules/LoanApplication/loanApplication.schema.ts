import { minLength, positive, z } from "zod";
import {
  CommissionType,
  InterestType,
} from "../../../generated/prisma-client/enums.js";
import { LOAN_DOCUMENT_TYPES } from "../../common/constants/loanDocumentTypes.js";

export const titleEnum = z.enum(["MR", "MRS", "MS", "DR", "PROF"]);
export const genderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);
export const employmentTypeEnum = z.enum([
  "SALARIED",
  "BUSINESS",
  "PROFESSIONAL",
  "OTHER",
]);

export const maritalStatusEnum = z.enum([
  "SINGLE",
  "MARRIED",
  "DIVORCED",
  "WIDOWED",
  "OTHER",
]);

export const CategoryEnum = z.enum([
  "GENERAL",
  "SC",
  "ST",
  "NT",
  "OBC",
  "OTHER",
]);

export const accommodationTypeEnum = z.enum([
  "OWN",
  "FAMILY",
  "RENTED",
  "EMPLOYER",
]);

export const correspondenceAddressTypeEnum = z.enum(["RESIDENCE", "OFFICE"]);

export const occupationalCategoryEnum = z.enum([
  "SALARIED",
  "BUSINESS",
  "PROFESSIONAL",
  "OTHER",
]);

export const professionalTypeEnum = z.enum([
  "DOCTOR",
  "CA_ICWA_CS",
  "ARCHITECT",
  "OTHER",
]);

export const businessTypeEnum = z.enum([
  "TRADER",
  "MANUFACTURER",
  "WHOLESALER",
  "OTHER",
]);

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

export const CoApplicantRelationEnum = z.enum([
  "SPOUSE",
  "PARTNER",
  "BUSINESS_PARTNER",
  "FATHER",
  "MOTHER",
  "SIBLING",
  "FRIEND",
  "OTHER",
]);

export const interestTypeEnum = z.enum(["FLAT", "REDUCING"]);

export const loanStatusEnum = z.enum([
  "LEAD_CREATED",
  "LEAD_VERIFICATION",
  "APPLICATION_STARTED",
  "DOCUMENT_COLLECTION",
  "KYC_VERIFICATION",
  "CREDIT_BUREAU_CHECK",
  "BANK_STATEMENT_ANALYSIS",
  "ELIGIBILITY_CHECK",
  "UNDERWRITING",
  "APPROVED",
  "REJECTED",
  "SANCTION_LETTER_ISSUED",
  "AGREEMENT_SIGNED",
  "DISBURSEMENT_INITIATED",
  "DISBURSED",
  "MOVED_TO_LMS",
  "ACTIVE",
  "EMI_SCHEDULE_GENERATED",
  "EMI_DUE",
  "PAYMENT_RECEIVED",
  "DELINQUENT",
  "COLLECTIONS",
  "SETTLED",
  "CLOSED",
  "WRITTEN_OFF",
  "DEFAULTED",
  "FORECLOSURE_PENDING",
]);

export const customerInlineSchema = z.object({
  title: titleEnum,
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().optional(),
  middleName: z.string().trim().optional(),
  gender: genderEnum,
  dob: z.preprocess((v) => (v ? new Date(v as string) : v), z.date()),
  aadhaarNumber: z.string().trim(),
  panNumber: z.string().trim(),
  voterId: z.string().trim().optional(),
  contactNumber: z.string().trim().min(1),

  alternateNumber: z.string().trim().optional(),
  email: z.string().trim().email().optional(),
  address: z.string().trim().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  pinCode: z.string().trim().optional(),
  employmentType: employmentTypeEnum,
  monthlyIncome: z.coerce.number().optional(),
  annualIncome: z.coerce.number().optional(),
});

// Helper: treat empty strings as undefined for optional string fields
const optionalNonEmptyString = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  z.string().trim().min(1).optional(),
);

export const createLoanApplicationSchema = z.object({
  // Customer fields
  title: titleEnum,
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  middleName: optionalNonEmptyString,
  gender: genderEnum,
  dob: z.coerce.date(),
  aadhaarNumber: z.string().trim().min(12).max(12),
  panNumber: z.string().trim().min(10).max(10),
  voterId: optionalNonEmptyString,
  contactNumber: z.string().trim().min(10).max(15),
  alternateNumber: optionalNonEmptyString,
  employmentType: employmentTypeEnum,
  maritalStatus: maritalStatusEnum,
  nationality: z.string().trim().min(1),
  category: CategoryEnum,
  passportNumber: optionalNonEmptyString,
  monthlyIncome: z.coerce.number(),
  annualIncome: z.coerce.number(),
  otherIncome: z.coerce.number().optional(),
  email: z.string().trim().email().optional(),
  address: z.string().trim().min(1),
  city: z.string().trim().min(1),
  state: z.string().trim().min(1),
  pinCode: z.string().trim().min(1),

  // Bank (optional – stored later if needed)
  bankName: z.string().trim().min(1),
  bankAccountNumber: z.string().trim().min(1),
  ifscCode: z.string().trim().min(1),
  accountType: z.string().trim().min(1),

  // Loan fields
  loanTypeId: z.string().trim().min(1),
  requestedAmount: z.coerce.number().positive(),
  tenureMonths: z.coerce.number().int().positive().optional(),

  interestRate: z.coerce.number().positive().optional(),
  interestType: interestTypeEnum.optional(),
  emiAmount: z.coerce.number().positive().optional(),
  purposeDetails: optionalNonEmptyString,
  loanPurpose: optionalNonEmptyString,

  coApplicantName: optionalNonEmptyString,
  coApplicantContact: optionalNonEmptyString,
  coApplicantIncome: z.coerce.number().positive().optional(),
  coApplicantPan: optionalNonEmptyString,
  coApplicantAadhaar: optionalNonEmptyString,
  coApplicantRelation: CoApplicantRelationEnum.optional(),
  coApplicants: z
    .array(
      z.object({
        firstName: z.string().trim().min(1),
        lastName: optionalNonEmptyString,
        middleName: optionalNonEmptyString,
        relation: CoApplicantRelationEnum,
        contactNumber: z.string().trim().min(1),
        email: z.string().trim().email().optional(),
        dob: z.coerce.date(),
        panNumber: optionalNonEmptyString,
        aadhaarNumber: optionalNonEmptyString,
        employmentType: employmentTypeEnum,
        monthlyIncome: z.coerce.number().optional(),
      }),
    )
    .optional(),
});

export const updateLoanApplicationSchema = createLoanApplicationSchema
  .partial()
  .extend({
    status: loanStatusEnum.optional(),
    approvedAmount: z.coerce.number().optional(),
    approvalDate: z
      .preprocess((v) => (v ? new Date(v as string) : v), z.date())
      .optional(),
    activationDate: z
      .preprocess((v) => (v ? new Date(v as string) : v), z.date())
      .optional(),
    rejectionReason: z.string().trim().optional(),
  })
  .passthrough();

export const loanApplicationIdParamSchema = z.object({
  id: z.string().min(1, "id param is required"),
});

export const loanDocumentTypeEnum = z.enum(LOAN_DOCUMENT_TYPES);

export const reuploadLoanDocumentParamSchema = z.object({
  loanApplicationId: z.string().min(1, "loanApplicationId param is required"),
  documentType: loanDocumentTypeEnum,
});

export type CreateLoanApplicationBody = z.infer<
  typeof createLoanApplicationSchema
>;
export type UpdateLoanApplicationBody = z.infer<
  typeof updateLoanApplicationSchema
>;

export default createLoanApplicationSchema;

export const approveLoanInputSchema = z.object({
  latePaymentFeeType: z.nativeEnum(CommissionType),
  latePaymentFee: z.number().min(0),
  bounceCharges: z.number().min(0),

  prepaymentChargeType: z.nativeEnum(CommissionType),
  prepaymentAllowed: z.boolean().optional(),
  prepaymentDate: z.coerce.date().optional(),
  prepaymentCharges: z.number().min(0),

  foreclosureChargesType: z.nativeEnum(CommissionType),
  foreclosureAllowed: z.boolean().optional(),
  foreclosureDate: z.coerce.date().optional(),
  foreclosureCharges: z.number().min(0),

  // Approval-related fields
  approvedAmount: z.number().positive(),
  tenureMonths: z.number().int().positive(),
  interestType: z.nativeEnum(InterestType),
  interestRate: z.number().min(0).max(100),
  emiStartDate: z.coerce.date().optional(),
  emiPaymentAmount: z.number().min(0).optional(),
  emiAmount: z.number().min(0).optional(),
});

export type ApproveLoanInput = z.infer<typeof approveLoanInputSchema>;

export const addressTypeEnum = z.enum([
  "CURRENT_RESIDENTIAL",
  "PERMANENT",
  "CORRESPONDENCE",
  "OFFICE",
]);

export const addressSchema = z.object({
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional(),
  city: z.string(),
  district: z.string(),
  state: z.string(),
  pinCode: z.string(),
  landmark: z.string().optional(),
  phoneNumber: z.string().optional(),
});

export const typedAddressSchema = addressSchema.extend({
  addressType: addressTypeEnum,
});

const occupationalDetailsSchema = z.object({
  occupationalCategory: occupationalCategoryEnum,
  occupationalCategoryOther: z.string().trim().optional(),
  companyBusinessName: z.string().trim().optional(),
  address: addressSchema.optional(),
  phoneNumber: z.string().trim().min(10).optional(),
  extensionNumber: z.string().trim().optional(),
  totalWorkExperience: z.coerce.number().int().optional(),
  noOfEmployees: z.coerce.number().int().optional(),
  // commencementDate: z.coerce.date().optional(),
  professionalType: professionalTypeEnum.optional(),
  professionalSpecify: z.string().trim().optional(),
  businessType: businessTypeEnum.optional(),
  businessSpecify: z.string().trim().optional(),
});

const employmentDetailsSchema = z.object({
  employerType: employerTypeEnum.optional(),
  employerTypeOther: z.string().trim().optional(),
  designation: z.string().optional(),
  department: z.string().trim().optional(),
  dateOfJoining: z.coerce.date().optional(),
  dateOfRetirement: z.coerce.date().optional(),
});

const occupationalDetailsInputSchema = z
  .union([occupationalDetailsSchema, z.array(occupationalDetailsSchema)])
  .transform((value) => {
    if (!value) return undefined;
    if (Array.isArray(value)) return value.length ? value : undefined;
    return Object.keys(value).length ? value : undefined;
  })
  .optional();

const employmentDetailsInputSchema = z
  .union([employmentDetailsSchema, z.array(employmentDetailsSchema)])
  .optional();

const financialDetailsSchema = z.object({
  grossMonthlyIncome: z.coerce.number().min(0).optional(),
  netMonthlyIncome: z.coerce.number().min(0).optional(),
  averageMonthlyExpenses: z.coerce.number().min(0).optional(),
  savingBankBalance: z.coerce.number().min(0).optional(),
  valueOfImmovableProperty: z.coerce.number().min(0).optional(),
  currentBalanceInPF: z.coerce.number().min(0).optional(),
  valueOfSharesSecurities: z.coerce.number().min(0).optional(),
  fixedDeposits: z.coerce.number().min(0).optional(),
  otherAssets: z.coerce.number().min(0).optional(),
  totalAssets: z.coerce.number().min(0).optional(),
  creditSocietyLoan: z.coerce.number().min(0).optional(),
  employerLoan: z.coerce.number().min(0).optional(),
  homeLoan: z.coerce.number().min(0).optional(),
  pfLoan: z.coerce.number().min(0).optional(),
  vehicleLoan: z.coerce.number().min(0).optional(),
  personalLoan: z.coerce.number().min(0).optional(),
  otherLoan: z.coerce.number().min(0).optional(),
  totalLiabilities: z.coerce.number().min(0).optional(),
});

export const createCoApplicantSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: optionalNonEmptyString,
  middleName: optionalNonEmptyString,
  aadhaarProvider: z.unknown().optional(),
  panProvider: z.unknown().optional(),
  fatherName: optionalNonEmptyString,
  motherName: optionalNonEmptyString,
  woname: optionalNonEmptyString,
  relation: CoApplicantRelationEnum,
  relationOther: optionalNonEmptyString,
  contactNumber: z.string().trim().min(10),
  phoneNumber: z.string().trim().min(10).optional(),
  email: z.string().trim().email().optional(),

  dob: z.coerce.date(),
  category: z.enum(["GENERAL", "SC", "ST", "NT", "OBC", "OTHER"]).optional(),
  maritalStatus: z
    .enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED", "OTHER"])
    .optional(),
  noOfDependents: z.coerce.number().int().min(0).optional(),
  noOfChildren: z.coerce.number().int().min(0).optional(),
  qualification: optionalNonEmptyString,
  correspondenceAddressType: correspondenceAddressTypeEnum.optional(),
  panNumber: optionalNonEmptyString,
  aadhaarNumber: optionalNonEmptyString,
  voterId: optionalNonEmptyString,
  drivingLicenceNo: optionalNonEmptyString,
  passportNumber: optionalNonEmptyString,
  presentAccommodation: accommodationTypeEnum.optional(),
  periodOfStay: optionalNonEmptyString,
  rentPerMonth: z.coerce.number().min(0).optional(),
  employmentType: employmentTypeEnum,
  addresses: z.array(typedAddressSchema).optional(),
  occupationalDetails: occupationalDetailsInputSchema,
  employmentDetails: employmentDetailsInputSchema,
  financialDetails: financialDetailsSchema.optional(),
});

const guarantorSchema = z.object({
  firstName: z.string().trim().min(1),
  middleName: optionalNonEmptyString,
  lastName: z.string().trim().min(1),
  aadhaarProvider: z.unknown().optional(),
  panProvider: z.unknown().optional(),
  fatherName: optionalNonEmptyString,
  motherName: optionalNonEmptyString,
  woname: optionalNonEmptyString,
  dob: z.coerce.date().optional(),
  contactNumber: z.string().trim().min(10).optional(),
  phoneNumber: z.string().trim().min(10).optional(),
  email: z.string().trim().email().optional(),
  panNumber: optionalNonEmptyString,
  aadhaarNumber: optionalNonEmptyString,
  voterId: optionalNonEmptyString,
  drivingLicence: optionalNonEmptyString,
  passportNumber: optionalNonEmptyString,
  category: z.enum(["GENERAL", "SC", "ST", "NT", "OBC", "OTHER"]).optional(),
  maritalStatus: z
    .enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED", "OTHER"])
    .optional(),
  noOfDependents: z.coerce.number().int().min(0).optional(),
  noOfChildren: z.coerce.number().int().min(0).optional(),
  qualification: optionalNonEmptyString,
  correspondenceAddressType: correspondenceAddressTypeEnum.optional(),
  relationshipWithApplicant: CoApplicantRelationEnum.optional(),
  relationshipOther: optionalNonEmptyString,
  accommodationType: accommodationTypeEnum.optional(),
  periodOfStay: optionalNonEmptyString,
  rentPerMonth: z.coerce.number().min(0).optional(),
  employmentType: employmentTypeEnum.optional(),
  addresses: z.array(typedAddressSchema).optional(),
  occupationalDetails: occupationalDetailsInputSchema,
  employmentDetails: employmentDetailsInputSchema,
  financialDetails: financialDetailsSchema.optional(),
});

const existingLoanSchema = z.object({
  institutionName: z.string().trim().min(1),
  purpose: optionalNonEmptyString,
  disbursedAmount: z.coerce.number().min(0).optional(),
  emi: z.coerce.number().min(0).optional(),
  balanceTerm: z.coerce.number().int().min(0).optional(),
  balanceOutstanding: z.coerce.number().min(0).optional(),
});

const creditCardSchema = z
  .object({
    holderName: z.string().trim().min(1),
    // Accepted only to detect and reject raw PAN input with a clear validation message.
    cardNumber: z.string().trim().optional(),
    lastFourDigits: z
      .string()
      .trim()
      .regex(/^\d{4}$/, "lastFourDigits must be 4 digits"),
    token: z.string().trim().min(1).optional(),
    issuingBank: optionalNonEmptyString,
    holderSince: z.coerce.date().optional(),
    creditLimit: z.coerce.number().min(0).optional(),
    outstandingAmount: z.coerce.number().min(0).optional(),
  })
  .superRefine((value, ctx) => {
    if (!value.cardNumber) return;
    const normalized = value.cardNumber.replace(/[\s-]/g, "");
    if (/^\d{12,19}$/.test(normalized)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cardNumber"],
        message:
          "Full card number is not allowed. Send only lastFourDigits and optional token.",
      });
    }
  })
  .transform(({ cardNumber: _cardNumber, ...rest }) => rest);

const bankAccountSchema = z.object({
  holderName: z.string().trim().min(1),
  bankName: z.string().trim().min(1),
  branchName: optionalNonEmptyString,
  accountType: z.string().trim().min(1),
  accountNumber: z.string().trim().min(1),
  openingDate: z.coerce.date().optional(),
  balanceAmount: z.coerce.number().min(0).optional(),
});

const insurancePolicySchema = z.object({
  issuedBy: z.string().trim().min(1).optional(),
  branchName: z.string().trim().min(1).optional(),
  holderName: z.string().trim().min(1).optional(),
  policyNumber: z.string().trim().min(1).optional(),
  maturityDate: z.coerce.date().optional(),
  policyValue: z.coerce.number().min(0).optional(),
  policyType: z.string().trim().min(1).optional(),
  yearlyPremium: z.coerce.number().min(0).optional(),
  paidUpValue: z.coerce.number().min(0).optional(),
});

const propertySchema = z.object({
  propertySelected: z.boolean(),
  landArea: z.coerce.number().min(0).optional(),
  buildUpArea: z.coerce.number().min(0).optional(),
  ownershipType: z.string().trim().min(1),
  landType: z.string().optional(),
  purchaseFrom: z.string().trim().min(1),
  purchaseOther: z.string().trim().min(1).optional(),
  constructionStage: z.string().trim().min(1),
  constructionPercent: z.coerce.number().min(0).max(100).optional(),
});

const referenceSchema = z.object({
  name: z.string().trim().min(1),
  fatherName: optionalNonEmptyString,
  relation: optionalNonEmptyString,
  contactNumber: z.string().trim().min(10),
  address: z.string().trim().min(1).optional(),
  city: z.string().trim().min(1).optional(),
  state: z.string().trim().min(1).optional(),
  pinCode: z.string().trim().min(1).optional(),
  phone: z.string().trim().min(10).optional(),
  occupation: optionalNonEmptyString,
});

export const createFullLoanApplicationSchema = z.object({
  loanTypeId: z.string().min(1, "loanTypeId is required"),
  leadNumber: z.string().trim().min(1, "leadNumber is required"),

  applicant: z.object({
    title: z.enum(["MR", "MRS", "MS", "DR", "PROF"]),
    firstName: z.string(),
    middleName: z.string().optional(),
    lastName: z.string(),
    fatherName: z.string(),
    motherName: z.string(),
    woname: z.string().optional(),
    dob: z.coerce.date(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    genderOther: z.string().optional(),
    maritalStatus: z.enum([
      "SINGLE",
      "MARRIED",
      "DIVORCED",
      "WIDOWED",
      "OTHER",
    ]),
    maritalStatusOther: z.string().optional(),
    nationality: z.string(),
    category: z.enum(["GENERAL", "SC", "ST", "NT", "OBC", "OTHER"]),
    categoryOther: z.string().optional(),

    aadhaarProvider: z.unknown().optional(),
    panProvider: z.unknown().optional(),

    aadhaarNumber: z.string(),
    panNumber: z.string(),
    voterId: z.string().optional(),
    drivingLicenceNo: z.string().optional(),
    passportNumber: z.string().optional(),

    contactNumber: z.string(),
    alternateNumber: z.string().optional(),
    email: z.string().email().optional(),
    phoneNumber: z.string().optional(),

    relationshipWithCoApplicant: CoApplicantRelationEnum.optional(),
    relationWithCoApplicantOther: z.string().optional(),

    qualification: z.string().optional(),

    noOfFamilyDependents: z.coerce.number().int().min(0).optional(),
    noOfChildren: z.coerce.number().int().min(0).optional(),

    correspondenceAddressType: correspondenceAddressTypeEnum.optional(),
    presentAccommodation: accommodationTypeEnum.optional(),
    periodOfStay: z.string().optional(),
    rentPerMonth: z.coerce.number().min(0).optional(),

    employmentType: employmentTypeEnum,
  }),

  addresses: z.object({
    currentAddress: addressSchema,
    permanentAddress: addressSchema.optional(),
  }),

  occupationalDetails: occupationalDetailsInputSchema,

  employmentDetails: employmentDetailsInputSchema,

  financialDetails: financialDetailsSchema.optional(),

  coApplicants: z.array(createCoApplicantSchema).optional(),

  guarantors: z.array(guarantorSchema).optional(),

  existingLoans: z.array(existingLoanSchema).optional(),

  creditCards: z.array(creditCardSchema).optional(),

  bankAccounts: z.array(bankAccountSchema).optional(),

  insurancePolicies: z.array(insurancePolicySchema).optional(),

  properties: z.array(propertySchema).optional(),

  references: z.array(referenceSchema).optional(),

  loanRequirement: z.object({
    loanAmount: z.number().positive(),
    tenure: z.number().int().positive(),
    interestOption: z.enum(["FIXED", "VARIABLE"]),
    loanPurpose: z.enum([
      "HOME",
      "HOME_IMPROVEMENT",
      "LAND_PURCHASE",
      "NRPL",
      "POST_DATED_CHEQUE",
      "STANDING_INSTRUCTION",
    ]),
    loanPurposeOther: z.string().optional(),
    repaymentMethod: z.enum(["SALARY_DEDUCTION", "ECS", "CHEQUE"]),
  }),

  questionnaire: z
    .object({
      legalPropertyClear: z.boolean().optional(),
      mortgagedElsewhere: z.boolean().optional(),
      residentOfIndia: z.boolean().optional(),
      otherLoans: z.boolean().optional(),
      guarantorAnywhere: z.boolean().optional(),
      mppLifeInsurance: z.boolean().optional(),
    })
    .optional(),
});
