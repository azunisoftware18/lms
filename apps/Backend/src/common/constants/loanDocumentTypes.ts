export const LOAN_DOCUMENT_TYPES = [
  // KYC documents
  "PAN",
  "AADHAAR",
  "PASSPORT",
  "VOTER_ID",
  "DRIVING_LICENSE",
  "ADDRESS_PROOF",
  "UTILITY_BILL",
  "RENT_AGREEMENT",
  "APPLICANT_PHOTO",
  "CO_APPLICANT_PHOTO",
  "GUARANTOR_PHOTO",
  "SELFIE_CAPTURE",

  // Income documents: salaried
  "SALARY_SLIP",
  "FORM_16",
  "EMPLOYMENT_ID",
  "APPOINTMENT_LETTER",

  // Income documents: self-employed
  "ITR",
  "GST_REGISTRATION_CERTIFICATE",
  "SHOP_ESTABLISHMENT_CERTIFICATE",
  "BUSINESS_REGISTRATION_CERTIFICATE",
  "PARTNERSHIP_DEED",
  "MOA",
  "AOA",
  "BUSINESS_FINANCIAL_STATEMENTS",
  "GST_RETURNS",
  "UDYAM_REGISTRATION",

  // Banking documents
  "BANK_STATEMENT",
  "OTHER_BANK_ACCOUNTS_STATEMENT",
  "CO_APPLICANT_BANK_STATEMENT",
  "GUARANTOR_BANK_STATEMENT",
  "BANK_VERIFICATION_REPORT",
  "BANK_STATEMENT_ANALYSIS_REPORT",

  // Security/property documents
  "PROPERTY_TITLE_DEED",
  "SALE_AGREEMENT",
  "ALLOTMENT_LETTER",
  "BUILDER_OR_SOCIETY_NOC",
  "PROPERTY_TAX_RECEIPTS",
  "PROPERTY_TECHNICAL_REPORT",
  "LEGAL_SCRUTINY_REPORT",

  // Verification documents
  "OFFICE_VERIFICATION_REPORT",
  "RESIDENCE_VERIFICATION_REPORT",
  "FIELD_INVESTIGATION_REPORT",
  "REFERENCE_CHECK_REPORT",

  // Other loan application documents
  "SIGNED_LOAN_APPLICATION_FORM",
  "KYC_DECLARATION",
  "CREDIT_BUREAU_CONSENT_FORM",
  "LOAN_PROCESSING_FEE_RECEIPT",
  "CUSTOMER_DECLARATION_FORM",

  // Credit documents
  "CREDIT_APPRAISAL_NOTE",
  "RISK_ASSESSMENT_REPORT",
  "SANCTION_LETTER",
  "INTERNAL_APPROVAL_MEMO",

  // Loan agreement documents
  "SIGNED_LOAN_AGREEMENT",
  "ACCEPTED_SANCTION_LETTER",
  "ECS_NACH_MANDATE_FORM",
  "POST_DATED_CHEQUES",
  "INSURANCE_POLICY_DOCUMENTS",

  // Disbursement documents
  "DISBURSEMENT_REQUEST_FORM",
  "BANK_ACCOUNT_PROOF",
  "CANCELLED_CHEQUE",
  "DISBURSEMENT_APPROVAL_NOTE",
  "VENDOR_INVOICE",
  "PAYMENT_REQUEST",

  // Generic supporting docs
  "PHOTO",
  "SIGNATURE",
  "INCOME_PROOF",
  "OTHER",
] as const;

export type LoanDocumentType = (typeof LOAN_DOCUMENT_TYPES)[number];

const LOAN_DOCUMENT_TYPE_SET = new Set<string>(LOAN_DOCUMENT_TYPES);

export const normalizeLoanDocumentType = (value: string) =>
  value.trim().toUpperCase().replace(/[\s-]+/g, "_");

export const isValidLoanDocumentType = (value: string) =>
  LOAN_DOCUMENT_TYPE_SET.has(normalizeLoanDocumentType(value));

export const parseLoanDocumentCsv = (value: string) =>
  value
    .split(",")
    .map((token) => normalizeLoanDocumentType(token))
    .filter(Boolean);

export const normalizeLoanDocumentCsv = (value: string) =>
  Array.from(new Set(parseLoanDocumentCsv(value))).join(",");

export const getInvalidLoanDocumentTypes = (value: string) =>
  parseLoanDocumentCsv(value).filter((token) => !LOAN_DOCUMENT_TYPE_SET.has(token));
