import { z } from "zod";

/* ENUMS */

export const titleEnum = z.enum(["MR", "MRS", "MS", "DR", "PROF"]);

export const genderEnum = z.enum([
  "MALE",
  "FEMALE",
  "OTHER"
]);

export const maritalStatusEnum = z.enum([
  "SINGLE",
  "MARRIED",
  "DIVORCED",
  "WIDOWED",
  "OTHER"
]);

export const categoryEnum = z.enum([
  "GENERAL",
  "SC",
  "ST",
  "NT",
  "OBC",
  "OTHER"
]);

export const employmentTypeEnum = z.enum([
  "salaried",
  "self_employed",
  "business",
  "professional"
]);

/* ADDRESS */

export const addressSchema = z.object({
  addressLine1: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  district: z.string().min(1, "District is required"),
  state: z.string().min(1, "State is required"),
  pinCode: z.string().min(6, "Pin code is required"),
  landmark: z.string().optional(),
  phoneNumber: z.string().optional()
});

/* APPLICANT */

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

  email: z.string().email().optional(),

  qualification: z.string().optional(),

  employmentType: employmentTypeEnum
});

/* CO APPLICANT */

export const coApplicantSchema = z.object({

  firstName: z.string().min(1),

  lastName: z.string().optional(),

  middleName: z.string().optional(),

  relation: z.string(),

  contactNumber: z.string().min(10),

  email: z.string().email().optional(),

  dob: z.coerce.date(),

  panNumber: z.string().optional(),

  aadhaarNumber: z.string().optional(),

  employmentType: employmentTypeEnum,

  monthlyIncome: z.coerce.number().optional()
});

/* LOAN REQUIREMENT */

export const loanRequirementSchema = z.object({

  loanAmount: z.number().positive("Loan amount required"),

  tenure: z.number().int().positive(),

  interestOption: z.enum(["FIXED", "VARIABLE"]),

  loanPurpose: z.enum([
    "HOME",
    "HOME_IMPROVEMENT",
    "LAND_PURCHASE"
  ]),

  repaymentMethod: z.enum([
    "SALARY_DEDUCTION",
    "ECS",
    "CHEQUE"
  ])
});

/* FULL LOAN APPLICATION */

export const createLoanApplicationSchema = z.object({

  loanTypeId: z.string().min(1, "Loan type required"),

  applicant: applicantSchema,

  addresses: z.object({

    currentAddress: addressSchema,

    permanentAddress: addressSchema.optional()

  }),

  coApplicants: z.array(coApplicantSchema).optional(),

  guarantors: z.array(z.any()).optional(),

  existingLoans: z.array(z.any()).optional(),

  creditCards: z.array(z.any()).optional(),

  bankAccounts: z.array(z.any()).optional(),

  insurancePolicies: z.array(z.any()).optional(),

  properties: z.array(z.any()).optional(),

  references: z.array(z.any()).optional(),

  loanRequirement: loanRequirementSchema,

  questionnaire: z.object({

    legalPropertyClear: z.boolean().optional(),

    mortgagedElsewhere: z.boolean().optional(),

    residentOfIndia: z.boolean().optional(),

    otherLoans: z.boolean().optional(),

    guarantorAnywhere: z.boolean().optional(),

    mppLifeInsurance: z.boolean().optional()

  }).optional()

});

export default createLoanApplicationSchema;