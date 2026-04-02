// types.ts

import {
  InterestType,
  CommissionType,
  EmploymentType,
  LoanTypes,
} from "../../../generated/prisma-client/enums.js";

export interface LoanTypeDTO {
  id: string;

  // Basic Identification
  code: string;
  name: string;
  description?: string | null;

  // Classification
  category: LoanTypes;
  secured: boolean;

  // Loan Limits
  minAmount: number;
  maxAmount: number;
  minTenureMonths: number;
  maxTenureMonths: number;

  // Interest Configuration
  interestType: InterestType;
  minInterestRate: number;
  maxInterestRate: number;
  defaultInterestRate: number;

  // Processing & Charges
  minProcessingFee: number;
  maxProcessingFee: number;

  minLoginCharges: number;
  maxLoginCharges: number;

  gstApplicable: boolean;
  gstPercentage?: number | null;

  // Eligibility Criteria
  minAge: number;
  maxAge: number;
  minIncome?: number | null;
  employmentType?: EmploymentType | null;

  // Risk & Credit
  minCibilScore?: number | null;
  maxCibilScore?: number | null;

  // Disbursement Rules
  maxLoanToValueRatio?: number | null;
  prepaymentAllowed: boolean;
  foreclosureAllowed: boolean;
  prepaymentCharges?: number | null;
  foreclosureCharges?: number | null;

  // Visibility & Control
  isActive: boolean;
  isPublic: boolean;
  approvalRequired: boolean;

  // SLA & Workflow
  estimatedProcessingTimeDays?: number | null;

  // Applicant documents
  applicantDocumentsRequired: string;
  applicantDocumentsOptional?: string | null;

  // Co-Applicant documents
  coApplicantDocumentsRequired: string;
  coApplicantDocumentsOptional?: string | null;

  // Guarantor documents
  guarantorDocumentsRequired: string;
  guarantorDocumentsOptional?: string | null;

  // Other documents
  otherDocumentsRequired: string;
  otherDocumentsOptions?: string | null;

  // Audit
  createdAt: Date;
  updatedAt: Date;
}
