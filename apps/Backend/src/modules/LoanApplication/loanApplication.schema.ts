import { z } from "zod";
import {
  CommissionType,
  InterestType,
} from "../../../generated/prisma-client/enums.js";

export const titleEnum = z.enum(["MR", "MRS", "MS", "DR", "PROF"]);
export const genderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);
export const employmentTypeEnum = z.enum([
  "salaried",
  "self_employed",
  "business",
]);

export const maritalStatusEnum = z.enum([
  "SINGLE",
  "MARRIED",
  "DIVORCED",
  "WIDOWED",
  "OTHER",
]);

export const CategoryEnum = z.enum(["GENERAL", "SC", "ST", "OBC", "OTHER"]);

export const CoApplicantRelationEnum = z.enum([
  "SPOUSE",
  "PARENT",
  "SIBLING",
  "CHILD",
  "FRIEND",
  "COLLEAGUE",
  "OTHER",
  "BUSINESS_PARTNER",
  "FATHER",
  "MOTHER",
]);

export const interestTypeEnum = z.enum(["FLAT", "REDUCING"]);

export const loanStatusEnum = z.enum([
  "draft",
  "submitted",
  "kyc_pending",
  "credit_check",
  "under_review",
  "approved",
  "rejected",
  "disbursed",
  "active",
  "closed",
  "written_off",
  "defaulted",
  "application_in_progress",
]);

export const customerInlineSchema = z.object({
  title: titleEnum,
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().optional(),
  middleName: z.string().trim().optional(),
  gender: genderEnum.optional(),
  dob: z.preprocess((v) => (v ? new Date(v as string) : v), z.date()),
  aadhaarNumber: z.string().trim(),
  panNumber: z.string().trim(),
  voterId: z.string().trim().optional(),
  contactNumber: z.string().trim().min(1),

  alternateNumber: z.string().trim().optional(),
  email: z.string().email().optional(),
  address: z.string().trim().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  pinCode: z.string().trim().optional(),
  employmentType: employmentTypeEnum,
  monthlyIncome: z.coerce.number().optional(),
  annualIncome: z.coerce.number().optional(),
});

export const createLoanApplicationSchema = z.object({
  // Customer fields
  title: titleEnum,
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1).optional(),
  middleName: z.string().trim().min(1).optional(),
  gender: genderEnum,
  dob: z.coerce.date(),
  aadhaarNumber: z.string().trim().min(1),
  panNumber: z.string().trim().min(1),
  voterId: z.string().trim().min(1).optional(),
  contactNumber: z.string().trim().min(1),
  alternateNumber: z.string().trim().min(1).optional(),
  employmentType: employmentTypeEnum,
  maritalStatus: maritalStatusEnum,
  nationality: z.string().trim().min(1),
  category: CategoryEnum,
  spouseName: z.string().trim().min(1).optional(),
  passportNumber: z.string().trim().min(1).optional(),
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
  tenureMonths: z.coerce.number().int().optional(),

  interestRate: z.coerce.number().optional(),
  interestType: interestTypeEnum.optional(),
  emiAmount: z.coerce.number().optional(),
  purposeDetails: z.string().trim().min(1).optional(),
  loanPurpose: z.string().trim().min(1).optional(),
  cibilScore: z.coerce.number().int().optional(),
  coApplicantName: z.string().trim().min(1).optional(),
  coApplicantContact: z.string().trim().min(1).optional(),
  coApplicantIncome: z.coerce.number().optional(),
  coApplicantPan: z.string().trim().min(1).optional(),
  coApplicantAadhaar: z.string().trim().min(1).optional(),
  coApplicantRelation: CoApplicantRelationEnum.optional(),
  coApplicants: z
    .array(
      z.object({
        firstName: z.string().trim().min(1),
        lastName: z.string().trim().min(1).optional(),
        middleName: z.string().trim().min(1).optional(),
        relation: CoApplicantRelationEnum,
        contactNumber: z.string().trim().min(1),
        email: z.string().trim().email().optional(),
        dob: z.coerce.date(),
        panNumber: z.string().trim().min(1).optional(),
        aadhaarNumber: z.string().trim().min(1).optional(),
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

export const createCoApplicantSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1).optional(),
  middleName: z.string().trim().min(1).optional(),
  relation: CoApplicantRelationEnum,
  relationOther: z.string().trim().min(1).optional(),
  contactNumber: z.string().trim().min(10),
  email: z.string().trim().email().optional(),

  dob: z.coerce.date(),
  panNumber: z.string().trim().min(1).optional(),
  aadhaarNumber: z.string().trim().min(1).optional(),
  employmentType: z.enum(["salaried", "self_employed", "business", "professional"]),
});

const guarantorSchema = z.object({
  firstName: z.string().trim().min(1),
  middleName: z.string().trim().min(1).optional(),
  lastName: z.string().trim().min(1),
  fatherName: z.string().trim().min(1).optional(),
  motherName: z.string().trim().min(1).optional(),
  woname: z.string().trim().min(1).optional(),
  dob: z.coerce.date().optional(),
  contactNumber: z.string().trim().min(10).optional(),
  phoneNumber: z.string().trim().min(10).optional(),
  email: z.string().trim().email().optional(),
  panNumber: z.string().trim().min(1).optional(),
  aadhaarNumber: z.string().trim().min(1).optional(),
  voterId: z.string().trim().min(1).optional(),
  drivingLicence: z.string().trim().min(1).optional(),
  passportNumber: z.string().trim().min(1).optional(),
  category: z.enum(["GENERAL", "SC", "ST", "NT", "OBC", "OTHER"]).optional(),
  maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED", "OTHER"]).optional(),
  noOfDependents: z.coerce.number().int().min(0).optional(),
  noOfChildren: z.coerce.number().int().min(0).optional(),
  qualification: z.string().trim().min(1).optional(),
  accommodationType: z.string().trim().min(1).optional(),
  periodOfStay: z.string().trim().min(1).optional(),
  rentPerMonth: z.coerce.number().min(0).optional(),
  employmentType: z.enum(["salaried", "self_employed", "business", "professional"]).optional(),
});

const existingLoanSchema = z.object({
  institutionName: z.string().trim().min(1),
  purpose: z.string().trim().min(1).optional(),
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
    lastFourDigits: z.string().trim().regex(/^\d{4}$/, "lastFourDigits must be 4 digits"),
    token: z.string().trim().min(1).optional(),
    issuingBank: z.string().trim().min(1).optional(),
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
  branchName: z.string().trim().min(1).optional(),
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
  landType: z.string().trim().min(1),
  purchaseFrom: z.string().trim().min(1),
  purchaseOther: z.string().trim().min(1).optional(),
  constructionStage: z.string().trim().min(1),
  constructionPercent: z.coerce.number().min(0).max(100).optional(),
});

const referenceSchema = z.object({
  name: z.string().trim().min(1),
  relation: z.string().trim().min(1).optional(),
  contactNumber: z.string().trim().min(10),
  address: z.string().trim().min(1).optional(),
  city: z.string().trim().min(1).optional(),
  state: z.string().trim().min(1).optional(),
  pinCode: z.string().trim().min(1).optional(),
  phone: z.string().trim().min(10).optional(),
  occupation: z.string().trim().min(1).optional(),
});



export const addressSchema = z.object({
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional(),
  city: z.string(),
  district: z.string(),
  state: z.string(),
  pinCode: z.string(),
  landmark: z.string().optional(),
  phoneNumber: z.string().optional()
})

export const createFullLoanApplicationSchema = z.object({

  loanTypeId: z.string().min(1, "loanTypeId is required"),

  applicant: z.object({
    title: z.enum(["MR","MRS","MS","DR","PROF"]),
    firstName: z.string(),
    middleName: z.string().optional(),
    lastName: z.string(),
    fatherName: z.string(),
    motherName: z.string(),
    woname: z.string().optional(),
    dob: z.coerce.date(),
    gender: z.enum(["MALE","FEMALE","OTHER"]),
    maritalStatus: z.enum(["SINGLE","MARRIED","DIVORCED","WIDOWED","OTHER"]),
    nationality: z.string(),
    category: z.enum(["GENERAL","SC","ST","NT","OBC","OTHER"]),

    aadhaarNumber: z.string(),
    panNumber: z.string(),
    voterId: z.string().optional(),
    drivingLicenceNo: z.string().optional(),
    passportNumber: z.string().optional(),

    contactNumber: z.string(),
    alternateNumber: z.string().optional(),
    email: z.string().email().optional(),

    qualification: z.string().optional(),
    employmentType: z.enum(["salaried","self_employed","business","professional"])
  }),

  addresses: z.object({
    currentAddress: addressSchema,
    permanentAddress: addressSchema.optional()
  }),

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
    interestOption: z.enum(["FIXED","VARIABLE"]),
    loanPurpose: z.enum([
      "HOME",
      "HOME_IMPROVEMENT",
      "LAND_PURCHASE"
    ]),
    repaymentMethod: z.enum(["SALARY_DEDUCTION", "ECS", "CHEQUE"])
  }),

  questionnaire: z.object({
    legalPropertyClear: z.boolean().optional(),
    mortgagedElsewhere: z.boolean().optional(),
    residentOfIndia: z.boolean().optional(),
    otherLoans: z.boolean().optional(),
    guarantorAnywhere: z.boolean().optional(),
    mppLifeInsurance: z.boolean().optional()
  }).optional()
})