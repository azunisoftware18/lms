import React, { useState, useEffect, useCallback } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronRight,
  ChevronLeft,
  Save,
  Send,
  Check,
  User,
  MapPin,
  Users,
  IndianRupee,
  FileText,
  Eye,
  Plus,
  Trash2,
  Shield,
  Landmark,
  CreditCard,
  Home,
  Briefcase,
  Phone,
  ClipboardList,
  BadgeCheck,
  Info,
  Loader2,
  AlertCircle,
  UserCheck,
  X,
  Search,
  TrendingUp,
  BarChart3,
  FileCheck,
  PiggyBank,
} from "lucide-react";

import Button from "../ui/Button";
import InputField from "../ui/InputField";
import TextAreaField from "../ui/TextAreaField";
import SelectField from "../ui/SelectField";
import createLoanApplicationSchema from "../../validations/LoanApplicationValidation";
import {
  leadDummyData,
  loanTypeDummyData,
} from "../../lib/LoanApplicationDummyData";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const TITLE_OPTIONS = [
  { value: "MR", label: "Mr." },
  { value: "MRS", label: "Mrs." },
  { value: "MS", label: "Ms." },
  { value: "DR", label: "Dr." },
  { value: "PROF", label: "Prof." },
];
const GENDER_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];
const MARITAL_OPTIONS = [
  { value: "MARRIED", label: "Married" },
  { value: "SINGLE", label: "Single" },
  { value: "DIVORCED", label: "Divorced" },
  { value: "WIDOWED", label: "Widowed" },
  { value: "OTHER", label: "Other" },
];
const CATEGORY_OPTIONS = [
  { value: "SC", label: "SC" },
  { value: "ST", label: "ST" },
  { value: "NT", label: "NT" },
  { value: "GENERAL", label: "General" },
  { value: "OBC", label: "OBC" },
  { value: "OTHER", label: "Other" },
];
const EMPLOYMENT_OPTIONS = [
  { value: "salaried", label: "Salaried" },
  { value: "business", label: "Business" },
  { value: "professional", label: "Professional" },
  { value: "other", label: "Other" },
];
const LOAN_TYPE_OPTIONS = loanTypeDummyData.map((loan) => ({
  value: loan.code,
  label: loan.name,
}));
const INTEREST_OPTIONS = [
  { value: "FIXED", label: "Fixed" },
  { value: "VARIABLE", label: "Variable" },
];
const REST_FREQ_OPTIONS = [
  { value: "ANNUAL", label: "Annual" },
  { value: "MONTHLY", label: "Monthly" },
];
const REPAYMENT_OPTIONS = [
  { value: "SALARY_DEDUCTION", label: "Salary Deduction" },
  { value: "ECS", label: "ECS" },
  { value: "CHEQUE", label: "Post Dated Cheque" },
  { value: "STANDING_INSTRUCTION", label: "Standing Instruction to Banker" },
  { value: "OTHER", label: "Other" },
];
const LOAN_PURPOSE_OPTIONS = [
  { value: "HOME_LOAN", label: "Home Loan" },
  { value: "HOME_IMPROVEMENT", label: "Home Improvement" },
  { value: "HOME_EXTENSION", label: "Home Extension Loan" },
  { value: "LAND_PURCHASE", label: "Land Purchase Loan" },
  { value: "NRPL", label: "NRPL" },
  { value: "OTHER", label: "Other" },
];
const RELATION_OPTIONS = [
  { value: "spouse", label: "Spouse" },
  { value: "parent", label: "Parent" },
  { value: "child", label: "Child" },
  { value: "sibling", label: "Sibling" },
  { value: "other", label: "Other" },
];
const ACCOMMODATION_OPTIONS = [
  { value: "OWN", label: "Own" },
  { value: "FAMILY", label: "Family" },
  { value: "RENTED", label: "Rented" },
  { value: "EMPLOYER", label: "Employer" },
];
const CORRESPONDENCE_OPTIONS = [
  { value: "RESIDENCE", label: "Applicant's Residence" },
  { value: "OFFICE", label: "Applicant's Office" },
];
const SALARIED_WORKING_FOR = [
  { value: "PUBLIC_LTD", label: "Public Ltd." },
  { value: "MNC", label: "MNC" },
  { value: "EDUCATIONAL_INST", label: "Educational Inst." },
  { value: "CENTRAL_STATE_GOVT", label: "Central/State Govt" },
  { value: "PUBLIC_SECTOR", label: "Public Sector Unit" },
  { value: "PROPRIETOR_PARTNERSHIP", label: "Proprietor/Partnership" },
  { value: "PRIVATE_LTD", label: "Private Ltd." },
  { value: "OTHER", label: "Other" },
];
const PROFESSIONAL_OPTIONS = [
  { value: "DOCTOR", label: "Doctor" },
  { value: "CA_ICWA_CS", label: "CA/ICWA/CS" },
  { value: "ARCHITECT", label: "Architect" },
  { value: "OTHER", label: "Other (Specify)" },
];
const BUSINESS_OPTIONS = [
  { value: "TRADER", label: "Trader" },
  { value: "MANUFACTURER", label: "Manufacturer" },
  { value: "WHOLESELLER", label: "Wholeseller" },
  { value: "OTHER", label: "Other (Specify)" },
];
const OWNERSHIP_OPTIONS = [
  { value: "SOLE", label: "Sole" },
  { value: "JOINT", label: "Joint" },
];
const LAND_TYPE_OPTIONS = [
  { value: "FREEHOLD", label: "Freehold" },
  { value: "LEASEHOLD", label: "Leasehold" },
];
const PURCHASED_FROM_OPTIONS = [
  { value: "BUILDER", label: "Builder" },
  { value: "SOCIETY", label: "Society" },
  {
    value: "DEVELOPMENT_AUTHORITY",
    label: "Development Authority/Housing Board",
  },
  { value: "RESALE", label: "Resale" },
  { value: "SELF_CONSTRUCTION", label: "Self Construction" },
  { value: "OTHER", label: "Other" },
];
const CONSTRUCTION_STAGE_OPTIONS = [
  { value: "READY", label: "Ready" },
  { value: "UNDER_CONSTRUCTION", label: "Under Construction" },
];
const PAYMENT_MODE_OPTIONS = [
  { value: "CASH", label: "1. Cash (Nakad)" },
  { value: "CHEQUE_FULL_PDC", label: "2. Cheque (Full PDC)" },
  { value: "CHEQUE_ROLLOVER_PDC", label: "3. Cheque (Rollover PDC)" },
  { value: "NACH", label: "4. NACH" },
  { value: "ECS", label: "5. ECS" },
];
const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh",
  "Puducherry",
].map((s) => ({ value: s, label: s }));

// ─────────────────────────────────────────────
// STEPS
// ─────────────────────────────────────────────
const STEPS = [
  {
    id: "applicant",
    label: "Applicant Details",
    shortLabel: "Applicant",
    icon: User,
  },
  {
    id: "loanType",
    label: "Loan Type",
    shortLabel: "Loan",
    icon: ClipboardList,
  },
  { id: "address", label: "Address", shortLabel: "Address", icon: MapPin },
  {
    id: "coApplicant",
    label: "Co-Applicants",
    shortLabel: "Co-App",
    icon: Users,
  },
  {
    id: "guarantor",
    label: "Guarantor",
    shortLabel: "Guarantor",
    icon: Shield,
  },
  {
    id: "loanReq",
    label: "Loan Requirement",
    shortLabel: "Loan Req.",
    icon: IndianRupee,
  },
  {
    id: "additional",
    label: "Additional Info",
    shortLabel: "Additional",
    icon: FileText,
  },
  {
    id: "consent",
    label: "Consent & PDC",
    shortLabel: "Consent",
    icon: FileCheck,
  },
  { id: "review", label: "Review & Submit", shortLabel: "Review", icon: Eye },
];

const STEP_FIELDS = {
  applicant: [
    "applicant.title",
    "applicant.firstName",
    "applicant.lastName",
    "applicant.fatherName",
    "applicant.motherName",
    "applicant.dob",
    "applicant.gender",
    "applicant.maritalStatus",
    "applicant.nationality",
    "applicant.category",
    "applicant.contactNumber",
    "applicant.panNumber",
    "applicant.aadhaarNumber",
    "applicant.employmentType",
  ],
  loanType: [
    "loanTypeId",
    "loanRequirement.interestOption",
    "loanRequirement.tenure",
    "loanRequirement.repaymentMethod",
  ],
  address: [
    "addresses.currentAddress.addressLine1",
    "addresses.currentAddress.city",
    "addresses.currentAddress.district",
    "addresses.currentAddress.state",
    "addresses.currentAddress.pinCode",
  ],
  coApplicant: [],
  guarantor: [],
  loanReq: [
    "loanRequirement.loanAmount",
    "loanRequirement.tenure",
    "loanRequirement.interestOption",
    "loanRequirement.loanPurpose",
    "loanRequirement.repaymentMethod",
  ],
  additional: [],
  consent: [],
  review: [],
};

const DRAFT_KEY = "loan_app_draft_v5";

// ─────────────────────────────────────────────
// PERSON DEFAULTS (reused for applicant / co-applicant / guarantor)
// ─────────────────────────────────────────────
const personDefaults = () => ({
  title: undefined,
  firstName: "",
  middleName: "",
  lastName: "",
  fatherName: "",
  motherName: "",
  woname: "",
  currentAddress: {
    addressLine1: "",
    city: "",
    district: "",
    state: "",
    pinCode: "",
    landmark: "",
    phoneWithStd: "",
  },
  permanentAddress: {
    addressLine1: "",
    city: "",
    district: "",
    state: "",
    pinCode: "",
    landmark: "",
    phoneWithStd: "",
  },
  dob: "",
  category: undefined,
  maritalStatus: undefined,
  noOfFamilyDependentsChildren: "",
  noOfFamilyDependentsOther: "",
  correspondenceAddress: undefined,
  qualification: "",
  passportNumber: "",
  panNumber: "",
  drivingLicenceNo: "",
  aadhaarNumber: "",
  contactNumber: "",
  alternateNumber: "",
  email: "",
  presentAccommodation: undefined,
  periodOfStay: "",
  rentPerMonth: "",
  // Employment
  employmentType: undefined,
  companyName: "",
  companyAddress: "",
  companyCity: "",
  companyDistrict: "",
  companyState: "",
  companyPinCode: "",
  companyLandMark: "",
  companyPhone: "",
  companyExtNo: "",
  workExperience: "",
  noOfEmployees: "",
  commencementDate: "",
  professionalType: undefined,
  professionalTypeOther: "",
  businessType: undefined,
  businessTypeOther: "",
  salariedWorkingFor: undefined,
  designation: "",
  department: "",
  dateOfJoining: "",
  dateOfRetirement: "",
  // Income
  grossMonthlyIncome: 0,
  netMonthlyIncome: 0,
  monthlyExpenses: 0,
  // Assets
  savingBankBalance: 0,
  valueOfImmovableProperty: 0,
  currentBalanceInPF: 0,
  valueOfSharesAndSecurities: 0,
  fixedDeposits: 0,
  otherAssets: 0,
  totalAssets: 0,
  // Liabilities
  creditSocietyLoan: 0,
  employerLoan: 0,
  homeLoan: 0,
  pfLoan: 0,
  vehicleLoan: 0,
  personalLoan: 0,
  otherLoan: 0,
  totalLiabilities: 0,
});

const DEFAULT_VALUES = {
  officeUse: {
    branchName: "",
    fileNo: "",
    serviceCenter: "",
    customerNo: "",
    processingFees: "",
    date: "",
    executiveName: "",
    applicantNo: "",
    employeeCode: "",
    referrersFileNo: "",
    schemeGroup: "",
    roi: "",
  },
  leadNumber: "",
  loanTypeId: "",
  sameAsCurrent: false,
  applicant: { ...personDefaults(), nationality: "Indian" },
  addresses: {
    currentAddress: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      district: "",
      state: "",
      pinCode: "",
      landmark: "",
      phoneNumber: "",
    },
    permanentAddress: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      district: "",
      state: "",
      pinCode: "",
      landmark: "",
      phoneNumber: "",
    },
  },
  coApplicants: [],
  guarantors: [],
  loanRequirement: {
    loanAmount: 0,
    tenure: 0,
    restFrequency: undefined,
    interestOption: undefined,
    loanPurpose: undefined,
    loanPurposeOther: "",
    repaymentMethod: undefined,
    repaymentOther: "",
    // Cost breakdown
    landCost: 0,
    agreementValue: 0,
    amenitiesAgreement: 0,
    stampDuty: 0,
    constructionCost: 0,
    incidental: 0,
    totalRequirement: 0,
    // Source of funds
    amountSpent: 0,
    balanceFundSaving: 0,
    balanceFundDisposal: 0,
    balanceFundFamily: 0,
    balanceFundOther: 0,
    totalBalanceFund: 0,
    loanRequired: 0,
    totalSourceOfFunds: 0,
  },
  property: {
    selected: "No",
    address: "",
    city: "",
    district: "",
    state: "",
    pinCode: "",
    landmark: "",
    landArea: "",
    buildUpArea: "",
    ownership: undefined,
    landType: undefined,
    purchasedFrom: undefined,
    purchasedFromOther: "",
    constructionStage: undefined,
    constructionPercent: "",
  },
  // Additional Information
  loanDetails: Array(3)
    .fill(null)
    .map(() => ({
      institution: "",
      purposeForLoan: "",
      disbursedLoanAmt: 0,
      emi: 0,
      balanceTerm: "",
      balanceOutstanding: 0,
    })),
  creditCards: Array(3)
    .fill(null)
    .map(() => ({
      holderName: "",
      cardNo: "",
      cardHolderSince: "",
      issuingBank: "",
      creditLimit: 0,
      outstandingAmount: 0,
    })),
  bankAccounts: Array(3)
    .fill(null)
    .map(() => ({
      holderName: "",
      bankNameBranch: "",
      acType: "",
      accountNo: "",
      acOpeningDate: "",
      balanceAmt: 0,
    })),
  insurancePolicies: Array(4)
    .fill(null)
    .map(() => ({
      issuedBy: "",
      branchName: "",
      holderName: "",
      policyNo: "",
      maturityDate: "",
      policyValue: 0,
      policyType: "",
      premiumYearly: 0,
      paidUpValue: 0,
    })),
  // General Information
  questionnaire: {
    legalPropertyClear: undefined,
    mortgagedElsewhere: undefined,
    residentOfIndia: undefined,
    appliedToMPPLEarlier: undefined,
    givenGuaranteeToMPPL: undefined,
    intendToGiveOnRent: undefined,
    howKnowAboutMPPL: [],
    howKnowAboutMPPLOther: "",
    preferLoanSanctionedDate: "",
    disbursedDate: "",
    doYouOwn: [],
    communicationLanguage: undefined,
    interestedInInsurance: undefined,
  },
  references: [
    {
      name: "",
      fatherName: "",
      wo: "",
      address: "",
      cityDist: "",
      state: "",
      pinCode: "",
      phoneNo: "",
      occupation: "",
    },
    {
      name: "",
      fatherName: "",
      wo: "",
      address: "",
      cityDist: "",
      state: "",
      pinCode: "",
      phoneNo: "",
      occupation: "",
    },
  ],
  // Consent & PDC
  consent: {
    borrowerName: "",
    spouseOrWardOf: "",
    loanAmount: 0,
    totalMonthlyInstallments: 0,
    advanceInstallments: 0,
    pendingInstallments: 0,
    firstInstallmentDate: "",
    interestRate: "",
    paymentMode: undefined,
    totalCheques: "",
    outstanding: "",
    chequeEcs: "",
  },
  pdcEntries: Array(5)
    .fill(null)
    .map(() => ({
      draweeBank: "",
      accountNo: "",
      chequeFrom: "",
      chequeTo: "",
      noOfCheques: "",
      emi: 0,
      security: "",
      insurance: "",
      chequeDtMY: "",
    })),
  paymentReceipts: {
    advanceInstallmentDate: "",
    advanceInstallmentReceiptNo: "",
    advanceInstallmentAmount: 0,
    fileChargeDate: "",
    fileChargeReceiptNo: "",
    fileChargeAmount: 0,
    securityAmountDate: "",
    securityAmountReceiptNo: "",
    securityAmountTotal: 0,
    cashPaymentDate: "",
    cashPaymentReceiptNo: "",
    cashPaymentAmount: 0,
    stampingChargeDate: "",
    stampingChargeReceiptNo: "",
    stampingChargeAmount: 0,
    otherAmountDate: "",
    otherAmountReceiptNo: "",
    otherAmountTotal: 0,
    totalAmountDate: "",
    totalAmountReceiptNo: "",
    totalAmount: 0,
  },
};

// ─────────────────────────────────────────────
// LAYOUT HELPERS
// ─────────────────────────────────────────────
const SectionCard = React.memo(
  ({ title, icon: Icon, children, accentColor = "blue" }) => {
    const gradients = {
      blue: "from-blue-600 to-blue-700",
      indigo: "from-indigo-600 to-indigo-700",
      slate: "from-slate-600 to-slate-700",
      amber: "from-amber-500 to-amber-600",
      emerald: "from-emerald-600 to-emerald-700",
      rose: "from-rose-600 to-rose-700",
      violet: "from-violet-600 to-violet-700",
      teal: "from-teal-600 to-teal-700",
    };
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-visible mb-6">
        <div
          className={`flex items-center gap-3 px-6 py-4 bg-linear-to-r ${gradients[accentColor] || gradients.blue}`}
        >
          {Icon && (
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
              <Icon size={16} className="text-white" />
            </div>
          )}
          <h3 className="font-bold text-base text-white tracking-wide">
            {title}
          </h3>
        </div>
        <div className="p-6">{children}</div>
      </div>
    );
  },
);

const Grid = React.memo(({ cols = 2, children }) => (
  <div
    className={`grid grid-cols-1 gap-4 ${cols === 2 ? "sm:grid-cols-2" : cols === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : cols === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : ""}`}
  >
    {children}
  </div>
));

const Divider = React.memo(({ label }) => (
  <div className="flex items-center gap-3 my-5">
    <div className="flex-1 h-px bg-slate-100" />
    {label && (
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
        {label}
      </span>
    )}
    <div className="flex-1 h-px bg-slate-100" />
  </div>
));

const Toast = ({ message, type, onClose }) => {
  const styles = {
    success: { bg: "bg-emerald-600", icon: <BadgeCheck size={16} /> },
    draft: { bg: "bg-amber-500", icon: <Save size={16} /> },
    error: { bg: "bg-red-500", icon: <AlertCircle size={16} /> },
    info: { bg: "bg-blue-600", icon: <Info size={16} /> },
  };
  const s = styles[type] || styles.info;
  return (
    <div
      className={`fixed bottom-6 right-6 z-99 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-white text-sm font-semibold ${s.bg}`}
    >
      {s.icon}
      <span>{message}</span>
      <button onClick={onClose} className="ml-1 opacity-75 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
};

// Radio Group
const RadioGroup = React.memo(
  ({ label, options, value, onChange, isRequired }) => {
    const handleChange = useCallback(
      (optValue) => {
        onChange(optValue);
      },
      [onChange],
    );

    return (
      <div>
        {label && (
          <p className="text-xs font-semibold text-slate-600 mb-2">
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer text-xs font-semibold transition-all select-none ${
                value === opt.value
                  ? "bg-blue-50 border-blue-400 text-blue-700"
                  : "border-slate-200 text-slate-500 hover:border-slate-300 bg-white"
              }`}
              onClick={() => handleChange(opt.value)}
            >
              <span
                className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  value === opt.value ? "border-blue-600" : "border-slate-300"
                }`}
              >
                {value === opt.value && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 block" />
                )}
              </span>
              <input
                type="radio"
                className="sr-only"
                value={opt.value}
                checked={value === opt.value}
                onChange={() => {}} // onChange is handled by onClick on label
                readOnly
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>
    );
  },
);

// Checkbox Group
const CheckboxGroup = React.memo(({ label, options, value = [], onChange }) => {
  const handleChange = useCallback(
    (optValue, checked) => {
      if (checked) {
        onChange([...value, optValue]);
      } else {
        onChange(value.filter((v) => v !== optValue));
      }
    },
    [value, onChange],
  );

  return (
    <div>
      {label && (
        <p className="text-xs font-semibold text-slate-600 mb-2">{label}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const checked = value.includes(opt.value);
          return (
            <label
              key={opt.value}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer text-xs font-semibold transition-all select-none ${
                checked
                  ? "bg-blue-50 border-blue-400 text-blue-700"
                  : "border-slate-200 text-slate-500 hover:border-slate-300 bg-white"
              }`}
              onClick={() => handleChange(opt.value, !checked)}
            >
              <span
                className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border-2 ${
                  checked ? "border-blue-600 bg-blue-600" : "border-slate-300"
                }`}
              >
                {checked && (
                  <Check size={9} strokeWidth={3} className="text-white" />
                )}
              </span>
              <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                onChange={() => {}} // onChange is handled by onClick on label
                readOnly
              />
              {opt.label}
            </label>
          );
        })}
      </div>
    </div>
  );
});

// Lead Fetch
const LeadFetch = ({ setValue, showToast }) => {
  const [leadNumber, setLeadNumber] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [fetchStatus, setFetchStatus] = useState(null);
  const handleFetch = () => {
    const trimmed = leadNumber.trim();
    if (!trimmed) return;
    setIsFetching(true);
    setFetchStatus(null);
    setTimeout(() => {
      const data = leadDummyData.find(
        (l) => l.leadNumber.toUpperCase() === trimmed.toUpperCase(),
      );
      if (!data) {
        setFetchStatus("error");
        showToast("Lead not found", "error");
        setIsFetching(false);
        return;
      }
      const nameParts = data.fullName.split(" ");
      setValue("applicant.firstName", nameParts[0] || "");
      setValue("applicant.lastName", nameParts[1] || "");
      setValue("applicant.contactNumber", data.contactNumber);
      setValue("applicant.email", data.email);
      setValue("applicant.gender", data.gender);
      setValue("applicant.dob", data.dob);
      setValue("loanRequirement.loanAmount", data.loanAmount);
      setValue("loanTypeId", data.loanTypeId);
      setValue("addresses.currentAddress.city", data.city);
      setValue("addresses.currentAddress.state", data.state);
      setValue("addresses.currentAddress.pinCode", data.pinCode);
      setValue("addresses.currentAddress.addressLine1", data.address);
      setValue("leadNumber", trimmed);
      setFetchStatus("success");
      showToast("Lead data loaded successfully", "success");
      setIsFetching(false);
    }, 500);
  };
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Enter Lead Number (Example: LD0001)"
          value={leadNumber}
          onChange={(e) => setLeadNumber(e.target.value)}
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm"
        />
        <Button
          type="button"
          onClick={handleFetch}
          disabled={isFetching}
          className="py-2! px-4!"
        >
          {isFetching ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Search size={14} />
          )}{" "}
          Fetch
        </Button>
      </div>
      {fetchStatus === "success" && (
        <p className="text-green-600 text-xs mt-2">
          Lead data loaded successfully
        </p>
      )}
      {fetchStatus === "error" && (
        <p className="text-red-600 text-xs mt-2">Lead not found</p>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// PERSON PERSONAL SECTION (reused for Applicant / Co-Applicant / Guarantor)
// ─────────────────────────────────────────────
const PersonPersonalFields = ({
  control,
  errors,
  watch,
  prefix,
  showRelationship = false,
}) => {
  const presentAccommodation = watch(`${prefix}.presentAccommodation`);
  return (
    <div className="space-y-4">
      <Grid cols={3}>
        <Controller
          name={`${prefix}.firstName`}
          control={control}
          render={({ field }) => (
            <InputField
              label="First Name"
              isRequired
              {...field}
              error={errors?.[prefix]?.firstName?.message}
            />
          )}
        />
        <Controller
          name={`${prefix}.middleName`}
          control={control}
          render={({ field }) => <InputField label="Middle Name" {...field} />}
        />
        <Controller
          name={`${prefix}.lastName`}
          control={control}
          render={({ field }) => <InputField label="Last Name" {...field} />}
        />
      </Grid>
      <Grid cols={3}>
        <Controller
          name={`${prefix}.fatherName`}
          control={control}
          render={({ field }) => (
            <InputField label="Father's Name" {...field} />
          )}
        />
        <Controller
          name={`${prefix}.motherName`}
          control={control}
          render={({ field }) => (
            <InputField label="Mother's Name" {...field} />
          )}
        />
        <Controller
          name={`${prefix}.woname`}
          control={control}
          render={({ field }) => <InputField label="W/o" {...field} />}
        />
      </Grid>

      <Divider label="Current Residential Address" />
      <Controller
        name={`${prefix}.currentAddress.addressLine1`}
        control={control}
        render={({ field }) => (
          <InputField
            label="Current Residential Address"
            placeholder="House No., Street, Area"
            {...field}
          />
        )}
      />
      <Grid cols={3}>
        <Controller
          name={`${prefix}.currentAddress.city`}
          control={control}
          render={({ field }) => <InputField label="City / Town" {...field} />}
        />
        <Controller
          name={`${prefix}.currentAddress.district`}
          control={control}
          render={({ field }) => <InputField label="District" {...field} />}
        />
        <Controller
          name={`${prefix}.currentAddress.state`}
          control={control}
          render={({ field }) => (
            <SelectField
              label="State"
              isSearchable
              options={INDIAN_STATES}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </Grid>
      <Grid>
        <Controller
          name={`${prefix}.currentAddress.pinCode`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Pin Code"
              {...field}
              onChange={(e) =>
                field.onChange(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
            />
          )}
        />
        <Controller
          name={`${prefix}.currentAddress.landmark`}
          control={control}
          render={({ field }) => <InputField label="Land Mark" {...field} />}
        />
      </Grid>
      <Controller
        name={`${prefix}.currentAddress.phoneWithStd`}
        control={control}
        render={({ field }) => (
          <InputField label="Phone No. (With STD Code)" {...field} />
        )}
      />

      <Divider label="Permanent Address" />
      <Controller
        name={`${prefix}.permanentAddress.addressLine1`}
        control={control}
        render={({ field }) => (
          <InputField
            label="Permanent Address"
            placeholder="House No., Street, Area"
            {...field}
          />
        )}
      />
      <Grid cols={3}>
        <Controller
          name={`${prefix}.permanentAddress.city`}
          control={control}
          render={({ field }) => <InputField label="City / Town" {...field} />}
        />
        <Controller
          name={`${prefix}.permanentAddress.district`}
          control={control}
          render={({ field }) => <InputField label="District" {...field} />}
        />
        <Controller
          name={`${prefix}.permanentAddress.state`}
          control={control}
          render={({ field }) => (
            <SelectField
              label="State"
              isSearchable
              options={INDIAN_STATES}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </Grid>
      <Grid>
        <Controller
          name={`${prefix}.permanentAddress.pinCode`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Pin Code"
              {...field}
              onChange={(e) =>
                field.onChange(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
            />
          )}
        />
        <Controller
          name={`${prefix}.permanentAddress.landmark`}
          control={control}
          render={({ field }) => <InputField label="Land Mark" {...field} />}
        />
      </Grid>
      <Controller
        name={`${prefix}.permanentAddress.phoneWithStd`}
        control={control}
        render={({ field }) => (
          <InputField label="Phone No. (With STD Code)" {...field} />
        )}
      />

      <Divider label="Personal Details" />
      <Grid>
        <Controller
          name={`${prefix}.email`}
          control={control}
          render={({ field }) => (
            <InputField label="E-mail" type="email" {...field} />
          )}
        />
        <Controller
          name={`${prefix}.dob`}
          control={control}
          render={({ field }) => (
            <InputField label="Date of Birth" type="date" {...field} />
          )}
        />
      </Grid>
      <Controller
        name={`${prefix}.category`}
        control={control}
        render={({ field }) => (
          <RadioGroup
            label="Category"
            options={CATEGORY_OPTIONS}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name={`${prefix}.maritalStatus`}
        control={control}
        render={({ field }) => (
          <RadioGroup
            label="Marital Status"
            options={MARITAL_OPTIONS}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          No. of Family Dependents
        </p>
        <Grid>
          <Controller
            name={`${prefix}.noOfFamilyDependentsChildren`}
            control={control}
            render={({ field }) => (
              <InputField
                label="Children"
                type="number"
                placeholder="0"
                {...field}
              />
            )}
          />
          <Controller
            name={`${prefix}.noOfFamilyDependentsOther`}
            control={control}
            render={({ field }) => (
              <InputField
                label="Others"
                type="number"
                placeholder="0"
                {...field}
              />
            )}
          />
        </Grid>
      </div>

      <Controller
        name={`${prefix}.correspondenceAddress`}
        control={control}
        render={({ field }) => (
          <RadioGroup
            label="Correspondence Address"
            options={CORRESPONDENCE_OPTIONS}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name={`${prefix}.qualification`}
        control={control}
        render={({ field }) => <InputField label="Qualification" {...field} />}
      />
      <Grid cols={3}>
        <Controller
          name={`${prefix}.passportNumber`}
          control={control}
          render={({ field }) => <InputField label="Passport No." {...field} />}
        />
        <Controller
          name={`${prefix}.panNumber`}
          control={control}
          render={({ field }) => (
            <InputField
              label="PAN No."
              {...field}
              onChange={(e) =>
                field.onChange(e.target.value.toUpperCase().slice(0, 10))
              }
            />
          )}
        />
        <Controller
          name={`${prefix}.aadhaarNumber`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Voter ID / Aadhaar Card No."
              {...field}
              onChange={(e) =>
                field.onChange(e.target.value.replace(/\D/g, "").slice(0, 12))
              }
            />
          )}
        />
      </Grid>
      <Controller
        name={`${prefix}.drivingLicenceNo`}
        control={control}
        render={({ field }) => (
          <InputField label="Driving Licence No." {...field} />
        )}
      />

      {showRelationship && (
        <Controller
          name={`${prefix}.relationshipWithApplicant`}
          control={control}
          render={({ field }) => (
            <InputField label="Relationship (With Applicant)" {...field} />
          )}
        />
      )}

      <Controller
        name={`${prefix}.presentAccommodation`}
        control={control}
        render={({ field }) => (
          <RadioGroup
            label="Present Accommodation"
            options={ACCOMMODATION_OPTIONS}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Grid>
        <Controller
          name={`${prefix}.periodOfStay`}
          control={control}
          render={({ field }) => (
            <InputField label="Period of Stay" {...field} />
          )}
        />
        {presentAccommodation === "RENTED" && (
          <Controller
            name={`${prefix}.rentPerMonth`}
            control={control}
            render={({ field }) => (
              <InputField
                label="If Rented Rent p.m. (₹)"
                type="number"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        )}
      </Grid>
    </div>
  );
};

// ─────────────────────────────────────────────
// PERSON EMPLOYMENT SECTION (reused)
// ─────────────────────────────────────────────
const PersonEmploymentFields = ({ control, watch, prefix }) => {
  const employmentType = watch(`${prefix}.employmentType`);
  return (
    <div className="space-y-4">
      <Controller
        name={`${prefix}.employmentType`}
        control={control}
        render={({ field }) => (
          <RadioGroup
            label="Occupational Category"
            isRequired
            options={EMPLOYMENT_OPTIONS}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      {employmentType && (
        <div className="p-4 bg-blue-50/40 rounded-xl border border-blue-100 space-y-4">
          <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            {employmentType === "salaried"
              ? "Company / Employer Details"
              : "Business / Office Address"}
          </p>
          <Controller
            name={`${prefix}.companyName`}
            control={control}
            render={({ field }) => (
              <InputField label="Company / Business Name" {...field} />
            )}
          />
          <Controller
            name={`${prefix}.companyAddress`}
            control={control}
            render={({ field }) => <InputField label="Address" {...field} />}
          />
          <Grid cols={3}>
            <Controller
              name={`${prefix}.companyCity`}
              control={control}
              render={({ field }) => (
                <InputField label="City / Town" {...field} />
              )}
            />
            <Controller
              name={`${prefix}.companyDistrict`}
              control={control}
              render={({ field }) => <InputField label="District" {...field} />}
            />
            <Controller
              name={`${prefix}.companyState`}
              control={control}
              render={({ field }) => (
                <SelectField
                  label="State"
                  isSearchable
                  options={INDIAN_STATES}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </Grid>
          <Grid cols={3}>
            <Controller
              name={`${prefix}.companyPinCode`}
              control={control}
              render={({ field }) => (
                <InputField
                  label="Pin Code"
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value.replace(/\D/g, "").slice(0, 6),
                    )
                  }
                />
              )}
            />
            <Controller
              name={`${prefix}.companyLandMark`}
              control={control}
              render={({ field }) => (
                <InputField label="Land Mark" {...field} />
              )}
            />
            <Controller
              name={`${prefix}.companyPhone`}
              control={control}
              render={({ field }) => (
                <InputField label="Phone No. (With STD Code)" {...field} />
              )}
            />
          </Grid>
          <Grid>
            <Controller
              name={`${prefix}.companyExtNo`}
              control={control}
              render={({ field }) => <InputField label="Ext. No." {...field} />}
            />
            <Controller
              name={`${prefix}.workExperience`}
              control={control}
              render={({ field }) => (
                <InputField label="Total Work Experience" {...field} />
              )}
            />
          </Grid>
          <Grid>
            <Controller
              name={`${prefix}.noOfEmployees`}
              control={control}
              render={({ field }) => (
                <InputField label="No. of Employees" type="number" {...field} />
              )}
            />
            <Controller
              name={`${prefix}.commencementDate`}
              control={control}
              render={({ field }) => (
                <InputField
                  label="Date of Commencement of Business/Profession"
                  type="date"
                  {...field}
                />
              )}
            />
          </Grid>
          {employmentType === "professional" && (
            <Controller
              name={`${prefix}.professionalType`}
              control={control}
              render={({ field }) => (
                <RadioGroup
                  label="If Professional"
                  options={PROFESSIONAL_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          )}
          {employmentType === "business" && (
            <Controller
              name={`${prefix}.businessType`}
              control={control}
              render={({ field }) => (
                <RadioGroup
                  label="If Business"
                  options={BUSINESS_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          )}
        </div>
      )}

      {employmentType === "salaried" && (
        <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 space-y-4">
          <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            If Salaried
          </p>
          <Controller
            name={`${prefix}.salariedWorkingFor`}
            control={control}
            render={({ field }) => (
              <RadioGroup
                label="Working for"
                options={SALARIED_WORKING_FOR}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Grid>
            <Controller
              name={`${prefix}.designation`}
              control={control}
              render={({ field }) => (
                <InputField label="Designation" {...field} />
              )}
            />
            <Controller
              name={`${prefix}.department`}
              control={control}
              render={({ field }) => (
                <InputField label="Department" {...field} />
              )}
            />
          </Grid>
          <Grid>
            <Controller
              name={`${prefix}.dateOfJoining`}
              control={control}
              render={({ field }) => (
                <InputField label="Date of Joining" type="date" {...field} />
              )}
            />
            <Controller
              name={`${prefix}.dateOfRetirement`}
              control={control}
              render={({ field }) => (
                <InputField label="Date of Retirement" type="date" {...field} />
              )}
            />
          </Grid>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// PERSON FINANCIAL SECTION (reused)
// ─────────────────────────────────────────────
const PersonFinancialFields = ({ control, watch, setValue, prefix }) => {
  const assets = watch([
    `${prefix}.savingBankBalance`,
    `${prefix}.valueOfImmovableProperty`,
    `${prefix}.currentBalanceInPF`,
    `${prefix}.valueOfSharesAndSecurities`,
    `${prefix}.fixedDeposits`,
    `${prefix}.otherAssets`,
  ]);
  const liabilities = watch([
    `${prefix}.creditSocietyLoan`,
    `${prefix}.employerLoan`,
    `${prefix}.homeLoan`,
    `${prefix}.pfLoan`,
    `${prefix}.vehicleLoan`,
    `${prefix}.personalLoan`,
    `${prefix}.otherLoan`,
  ]);
  useEffect(() => {
    setValue(
      `${prefix}.totalAssets`,
      assets.reduce((s, v) => s + (Number(v) || 0), 0),
    );
  }, [assets, prefix, setValue]);
  useEffect(() => {
    setValue(
      `${prefix}.totalLiabilities`,
      liabilities.reduce((s, v) => s + (Number(v) || 0), 0),
    );
  }, [liabilities, prefix, setValue]);
  return (
    <div className="space-y-4">
      <Grid>
        <Controller
          name={`${prefix}.grossMonthlyIncome`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Gross Monthly Income (₹)"
              type="number"
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
        <Controller
          name={`${prefix}.netMonthlyIncome`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Net Monthly Income (₹)"
              type="number"
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
      </Grid>
      <Controller
        name={`${prefix}.monthlyExpenses`}
        control={control}
        render={({ field }) => (
          <InputField
            label="Average Monthly Expenses (₹)"
            type="number"
            {...field}
            onChange={(e) => field.onChange(Number(e.target.value))}
          />
        )}
      />

      <Divider label="Assets" />
      <Grid>
        <Controller
          name={`${prefix}.savingBankBalance`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Saving Bank A/c (₹)"
              type="number"
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
        <Controller
          name={`${prefix}.valueOfImmovableProperty`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Value of Immovable Property (₹)"
              type="number"
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
      </Grid>
      <Grid>
        <Controller
          name={`${prefix}.currentBalanceInPF`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Current Balance in PF (₹)"
              type="number"
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
        <Controller
          name={`${prefix}.valueOfSharesAndSecurities`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Value of Shares & Securities (₹)"
              type="number"
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
      </Grid>
      <Grid>
        <Controller
          name={`${prefix}.fixedDeposits`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Fixed Deposits (₹)"
              type="number"
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
        <Controller
          name={`${prefix}.otherAssets`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Others (₹)"
              type="number"
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
      </Grid>
      <Controller
        name={`${prefix}.totalAssets`}
        control={control}
        render={({ field }) => (
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
            <span className="text-sm font-bold text-emerald-800">
              Total Assets Rs.
            </span>
            <span className="text-lg font-black text-emerald-700">
              ₹{Number(field.value || 0).toLocaleString("en-IN")}
            </span>
          </div>
        )}
      />

      <Divider label="Liabilities" />
      <Grid>
        <Controller
          name={`${prefix}.creditSocietyLoan`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Credit Society Loan (₹)"
              type="number"
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
        <Controller
          name={`${prefix}.employerLoan`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Employer Loan (₹)"
              type="number"
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
      </Grid>
      <Grid>
        <Controller
          name={`${prefix}.homeLoan`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Home Loan (₹)"
              type="number"
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
        <Controller
          name={`${prefix}.pfLoan`}
          control={control}
          render={({ field }) => (
            <InputField
              label="PF Loan (₹)"
              type="number"
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
      </Grid>
      <Grid>
        <Controller
          name={`${prefix}.vehicleLoan`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Vehicle Loan (₹)"
              type="number"
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
        <Controller
          name={`${prefix}.personalLoan`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Personal Loan (₹)"
              type="number"
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
      </Grid>
      <Controller
        name={`${prefix}.otherLoan`}
        control={control}
        render={({ field }) => (
          <InputField
            label="Other Loan (₹)"
            type="number"
            {...field}
            onChange={(e) => field.onChange(Number(e.target.value))}
          />
        )}
      />
      <Controller
        name={`${prefix}.totalLiabilities`}
        control={control}
        render={({ field }) => (
          <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 flex items-center justify-between">
            <span className="text-sm font-bold text-rose-800">
              Total Liabilities Rs.
            </span>
            <span className="text-lg font-black text-rose-700">
              ₹{Number(field.value || 0).toLocaleString("en-IN")}
            </span>
          </div>
        )}
      />
    </div>
  );
};

// ─────────────────────────────────────────────
// SECTION: APPLICANT
// ─────────────────────────────────────────────
const ApplicantSection = ({ control, errors, watch, setValue, showToast }) => (
  <div>
    <LeadFetch setValue={setValue} showToast={showToast} />
    <SectionCard title="Personal Information" icon={User}>
      <div className="space-y-4">
        <Grid cols={3}>
          <Controller
            name="applicant.title"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Title"
                isRequired
                options={TITLE_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                error={errors.applicant?.title?.message}
              />
            )}
          />
          <Controller
            name="applicant.firstName"
            control={control}
            render={({ field }) => (
              <InputField
                label="First Name"
                isRequired
                {...field}
                error={errors.applicant?.firstName?.message}
              />
            )}
          />
          <Controller
            name="applicant.middleName"
            control={control}
            render={({ field }) => (
              <InputField label="Middle Name" {...field} />
            )}
          />
        </Grid>
        <Grid cols={3}>
          <Controller
            name="applicant.lastName"
            control={control}
            render={({ field }) => (
              <InputField
                label="Last Name"
                isRequired
                {...field}
                error={errors.applicant?.lastName?.message}
              />
            )}
          />
          <Controller
            name="applicant.fatherName"
            control={control}
            render={({ field }) => (
              <InputField
                label="Father's Name"
                isRequired
                {...field}
                error={errors.applicant?.fatherName?.message}
              />
            )}
          />
          <Controller
            name="applicant.motherName"
            control={control}
            render={({ field }) => (
              <InputField
                label="Mother's Name"
                isRequired
                {...field}
                error={errors.applicant?.motherName?.message}
              />
            )}
          />
        </Grid>
        <Controller
          name="applicant.woname"
          control={control}
          render={({ field }) => <InputField label="W/o" {...field} />}
        />
        <Grid>
          <Controller
            name="applicant.dob"
            control={control}
            render={({ field }) => (
              <InputField
                label="Date of Birth"
                type="date"
                isRequired
                {...field}
                error={errors.applicant?.dob?.message}
              />
            )}
          />
          <Controller
            name="applicant.nationality"
            control={control}
            render={({ field }) => (
              <InputField
                label="Nationality"
                isRequired
                {...field}
                error={errors.applicant?.nationality?.message}
              />
            )}
          />
        </Grid>
        <Controller
          name="applicant.category"
          control={control}
          render={({ field }) => (
            <RadioGroup
              label="Category"
              isRequired
              options={CATEGORY_OPTIONS}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          name="applicant.maritalStatus"
          control={control}
          render={({ field }) => (
            <RadioGroup
              label="Marital Status"
              isRequired
              options={MARITAL_OPTIONS}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            No. of Family Dependents
          </p>
          <Grid>
            <Controller
              name="applicant.noOfFamilyDependentsChildren"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Children"
                  type="number"
                  placeholder="0"
                  {...field}
                />
              )}
            />
            <Controller
              name="applicant.noOfFamilyDependentsOther"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Others"
                  type="number"
                  placeholder="0"
                  {...field}
                />
              )}
            />
          </Grid>
        </div>
        <Controller
          name="applicant.correspondenceAddress"
          control={control}
          render={({ field }) => (
            <RadioGroup
              label="Correspondence Address"
              options={CORRESPONDENCE_OPTIONS}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          name="applicant.qualification"
          control={control}
          render={({ field }) => (
            <InputField label="Qualification" {...field} />
          )}
        />
      </div>
    </SectionCard>

    <SectionCard title="Contact & Identity" icon={Phone}>
      <div className="space-y-4">
        <Grid>
          <Controller
            name="applicant.contactNumber"
            control={control}
            render={({ field }) => (
              <InputField
                label="Mobile Number"
                type="tel"
                isRequired
                icon={Phone}
                hint="10-digit"
                {...field}
                onChange={(e) =>
                  field.onChange(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                error={errors.applicant?.contactNumber?.message}
              />
            )}
          />
          <Controller
            name="applicant.alternateNumber"
            control={control}
            render={({ field }) => (
              <InputField
                label="Alternate Number"
                type="tel"
                {...field}
                onChange={(e) =>
                  field.onChange(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
              />
            )}
          />
        </Grid>
        <Controller
          name="applicant.email"
          control={control}
          render={({ field }) => (
            <InputField
              label="Email Address"
              type="email"
              {...field}
              error={errors.applicant?.email?.message}
            />
          )}
        />
        <Grid cols={3}>
          <Controller
            name="applicant.passportNumber"
            control={control}
            render={({ field }) => (
              <InputField label="Passport No." {...field} />
            )}
          />
          <Controller
            name="applicant.panNumber"
            control={control}
            render={({ field }) => (
              <InputField
                label="PAN No."
                isRequired
                {...field}
                onChange={(e) =>
                  field.onChange(e.target.value.toUpperCase().slice(0, 10))
                }
                error={errors.applicant?.panNumber?.message}
              />
            )}
          />
          <Controller
            name="applicant.drivingLicenceNo"
            control={control}
            render={({ field }) => (
              <InputField label="Driving Licence No." {...field} />
            )}
          />
        </Grid>
        <Controller
          name="applicant.aadhaarNumber"
          control={control}
          render={({ field }) => (
            <InputField
              label="Voter ID / Aadhaar Card No."
              isRequired
              {...field}
              onChange={(e) =>
                field.onChange(e.target.value.replace(/\D/g, "").slice(0, 12))
              }
              error={errors.applicant?.aadhaarNumber?.message}
            />
          )}
        />
      </div>
    </SectionCard>

    <SectionCard title="Present Accommodation" icon={Home}>
      <div className="space-y-4">
        <Controller
          name="applicant.presentAccommodation"
          control={control}
          render={({ field }) => (
            <RadioGroup
              label="Accommodation Type"
              options={ACCOMMODATION_OPTIONS}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Grid>
          <Controller
            name="applicant.periodOfStay"
            control={control}
            render={({ field }) => (
              <InputField label="Period of Stay" {...field} />
            )}
          />
          <Controller
            name="applicant.rentPerMonth"
            control={control}
            render={({ field }) => (
              <InputField
                label="If Rented Rent p.m. (₹)"
                type="number"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        </Grid>
      </div>
    </SectionCard>

    <SectionCard title="Applicant's Occupational Details" icon={Briefcase}>
      <PersonEmploymentFields
        control={control}
        watch={watch}
        prefix="applicant"
      />
    </SectionCard>

    <SectionCard
      title="Applicant's Financial Status — Income"
      icon={IndianRupee}
      accentColor="indigo"
    >
      <PersonFinancialFields
        control={control}
        watch={watch}
        setValue={setValue}
        prefix="applicant"
      />
    </SectionCard>
  </div>
);

// ─────────────────────────────────────────────
// SECTION: LOAN TYPE
// ─────────────────────────────────────────────
const LoanTypeSection = ({ control, errors }) => (
  <SectionCard title="Loan Details" icon={ClipboardList}>
    <div className="space-y-5">
      <Grid>
        <Controller
          name="loanTypeId"
          control={control}
          render={({ field }) => (
            <SelectField
              label="Loan Type"
              isRequired
              options={LOAN_TYPE_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={errors.loanTypeId?.message}
            />
          )}
        />
        <Controller
          name="loanRequirement.interestOption"
          control={control}
          render={({ field }) => (
            <SelectField
              label="Interest Option"
              isRequired
              options={INTEREST_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={errors.loanRequirement?.interestOption?.message}
            />
          )}
        />
      </Grid>
      <Grid>
        <Controller
          name="loanRequirement.repaymentMethod"
          control={control}
          render={({ field }) => (
            <SelectField
              label="Repayment Method"
              isRequired
              options={REPAYMENT_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={errors.loanRequirement?.repaymentMethod?.message}
            />
          )}
        />
        <Controller
          name="loanRequirement.tenure"
          control={control}
          render={({ field }) => (
            <InputField
              label="Tenure (Months)"
              type="number"
              placeholder="e.g. 120"
              isRequired
              value={field.value}
              onChange={(e) => field.onChange(Number(e.target.value))}
              error={errors.loanRequirement?.tenure?.message}
            />
          )}
        />
      </Grid>
    </div>
  </SectionCard>
);

// ─────────────────────────────────────────────
// SECTION: ADDRESS (standalone applicant address)
// ─────────────────────────────────────────────
const AddressSection = ({ control, errors, watch, setValue }) => {
  const sameAddress = watch("sameAsCurrent");
  const copyCurrent = useCallback(() => {
    [
      "addressLine1",
      "addressLine2",
      "city",
      "district",
      "state",
      "pinCode",
      "landmark",
      "phoneNumber",
    ].forEach((f) => {
      setValue(
        `addresses.permanentAddress.${f}`,
        watch(`addresses.currentAddress.${f}`) || "",
      );
    });
  }, [watch, setValue]);
  return (
    <div>
      <SectionCard title="Current Residential Address" icon={Home}>
        <div className="space-y-4">
          <Controller
            name="addresses.currentAddress.addressLine1"
            control={control}
            render={({ field }) => (
              <InputField
                label="Address Line 1"
                isRequired
                {...field}
                error={errors.addresses?.currentAddress?.addressLine1?.message}
              />
            )}
          />
          <Controller
            name="addresses.currentAddress.addressLine2"
            control={control}
            render={({ field }) => (
              <InputField label="Address Line 2" {...field} />
            )}
          />
          <Grid>
            <Controller
              name="addresses.currentAddress.city"
              control={control}
              render={({ field }) => (
                <InputField
                  label="City / Town"
                  isRequired
                  {...field}
                  error={errors.addresses?.currentAddress?.city?.message}
                />
              )}
            />
            <Controller
              name="addresses.currentAddress.district"
              control={control}
              render={({ field }) => (
                <InputField
                  label="District"
                  isRequired
                  {...field}
                  error={errors.addresses?.currentAddress?.district?.message}
                />
              )}
            />
          </Grid>
          <Grid>
            <Controller
              name="addresses.currentAddress.state"
              control={control}
              render={({ field }) => (
                <SelectField
                  label="State"
                  isRequired
                  isSearchable
                  options={INDIAN_STATES}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.addresses?.currentAddress?.state?.message}
                />
              )}
            />
            <Controller
              name="addresses.currentAddress.pinCode"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Pin Code"
                  isRequired
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value.replace(/\D/g, "").slice(0, 6),
                    )
                  }
                  error={errors.addresses?.currentAddress?.pinCode?.message}
                />
              )}
            />
          </Grid>
          <Grid>
            <Controller
              name="addresses.currentAddress.landmark"
              control={control}
              render={({ field }) => (
                <InputField label="Land Mark" {...field} />
              )}
            />
            <Controller
              name="addresses.currentAddress.phoneNumber"
              control={control}
              render={({ field }) => (
                <InputField label="Phone No. (With STD Code)" {...field} />
              )}
            />
          </Grid>
        </div>
      </SectionCard>
      <div
        className="flex items-center gap-3 px-5 py-3.5 bg-blue-50 rounded-2xl border border-blue-100 mb-6 cursor-pointer"
        onClick={() => {
          const next = !sameAddress;
          setValue("sameAsCurrent", next);
          if (next) copyCurrent();
        }}
      >
        <div
          className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all shrink-0 ${sameAddress ? "bg-blue-600 border-blue-600" : "border-slate-300 bg-white"}`}
        >
          {sameAddress && (
            <Check size={11} strokeWidth={3} className="text-white" />
          )}
        </div>
        <label className="text-sm font-semibold text-blue-700 cursor-pointer select-none flex-1">
          Permanent address same as current address
        </label>
      </div>
      <SectionCard title="Permanent Address" icon={MapPin}>
        <div className="space-y-4">
          <Controller
            name="addresses.permanentAddress.addressLine1"
            control={control}
            render={({ field }) => (
              <InputField label="Address Line 1" {...field} />
            )}
          />
          <Controller
            name="addresses.permanentAddress.addressLine2"
            control={control}
            render={({ field }) => (
              <InputField label="Address Line 2" {...field} />
            )}
          />
          <Grid>
            <Controller
              name="addresses.permanentAddress.city"
              control={control}
              render={({ field }) => (
                <InputField label="City / Town" {...field} />
              )}
            />
            <Controller
              name="addresses.permanentAddress.district"
              control={control}
              render={({ field }) => <InputField label="District" {...field} />}
            />
          </Grid>
          <Grid>
            <Controller
              name="addresses.permanentAddress.state"
              control={control}
              render={({ field }) => (
                <SelectField
                  label="State"
                  isSearchable
                  options={INDIAN_STATES}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              name="addresses.permanentAddress.pinCode"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Pin Code"
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value.replace(/\D/g, "").slice(0, 6),
                    )
                  }
                />
              )}
            />
          </Grid>
          <Controller
            name="addresses.permanentAddress.landmark"
            control={control}
            render={({ field }) => <InputField label="Land Mark" {...field} />}
          />
        </div>
      </SectionCard>
    </div>
  );
};

// ─────────────────────────────────────────────
// SECTION: CO-APPLICANTS (Images 3 + 4)
// ─────────────────────────────────────────────
const CoApplicantSection = ({
  control,
  errors,
  watch,
  setValue,
  fields,
  append,
  remove,
}) => (
  <div>
    <div className="flex items-center justify-between p-5 bg-blue-50 rounded-2xl border border-blue-100 mb-6">
      <div>
        <h3 className="font-bold text-blue-800 text-sm">Co-Applicants</h3>
        <p className="text-xs text-blue-500 mt-0.5">
          Add co-applicants to strengthen the application
        </p>
      </div>
      <Button
        type="button"
        onClick={() => append({ ...personDefaults() })}
        className="py-2! px-4! text-xs!"
      >
        <Plus size={13} /> Add Co-Applicant
      </Button>
    </div>
    {fields.length === 0 && (
      <div className="text-center py-14 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
        <Users size={36} className="mx-auto text-slate-300 mb-3" />
        <p className="text-slate-400 font-semibold text-sm">
          No co-applicants added
        </p>
      </div>
    )}
    {fields.map((field, index) => (
      <div key={field.id}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-black text-blue-700 text-sm">
            Co-Applicant {index + 1}
          </h3>
          <Button
            type="button"
            onClick={() => remove(index)}
            className="bg-red-50! text-red-600! border border-red-200 shadow-none! py-1.5! px-3! text-xs!"
          >
            <Trash2 size={13} /> Remove
          </Button>
        </div>
        <SectionCard
          title={`Co-Applicant ${index + 1} — Personal Details`}
          icon={UserCheck}
        >
          <PersonPersonalFields
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
            prefix={`coApplicants.${index}`}
            showRelationship={true}
          />
        </SectionCard>
        <SectionCard
          title={`Co-Applicant ${index + 1} — Occupational Details`}
          icon={Briefcase}
          accentColor="indigo"
        >
          <PersonEmploymentFields
            control={control}
            watch={watch}
            prefix={`coApplicants.${index}`}
          />
        </SectionCard>
        <SectionCard
          title={`Co-Applicant ${index + 1} — Financial Status`}
          icon={TrendingUp}
          accentColor="emerald"
        >
          <PersonFinancialFields
            control={control}
            watch={watch}
            setValue={setValue}
            prefix={`coApplicants.${index}`}
          />
        </SectionCard>
      </div>
    ))}
  </div>
);

// ─────────────────────────────────────────────
// SECTION: GUARANTOR (Images 6 + 7)
// ─────────────────────────────────────────────
const GuarantorSection = ({
  control,
  errors,
  watch,
  setValue,
  fields,
  append,
  remove,
}) => (
  <div>
    <div className="flex items-center justify-between p-5 bg-amber-50 rounded-2xl border border-amber-100 mb-6">
      <div>
        <h3 className="font-bold text-amber-800 text-sm">Guarantors</h3>
        <p className="text-xs text-amber-600 mt-0.5">
          Guarantors provide additional assurance
        </p>
      </div>
      <Button
        type="button"
        onClick={() => append({ ...personDefaults() })}
        className="bg-amber-500! hover:bg-amber-600! py-2! px-4! text-xs!"
      >
        <Plus size={13} /> Add Guarantor
      </Button>
    </div>
    {fields.length === 0 && (
      <div className="text-center py-14 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
        <Shield size={36} className="mx-auto text-slate-300 mb-3" />
        <p className="text-slate-400 font-semibold text-sm">
          No guarantors added
        </p>
      </div>
    )}
    {fields.map((field, index) => (
      <div key={field.id}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-black text-amber-700 text-sm">
            Guarantor {index + 1}
          </h3>
          <Button
            type="button"
            onClick={() => remove(index)}
            className="bg-red-50! text-red-600! border border-red-200 shadow-none! py-1.5! px-3! text-xs!"
          >
            <Trash2 size={13} /> Remove
          </Button>
        </div>
        <SectionCard
          title={`Guarantor ${index + 1} — Personal Details`}
          icon={Shield}
        >
          <PersonPersonalFields
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
            prefix={`guarantors.${index}`}
            showRelationship={true}
          />
        </SectionCard>
        <SectionCard
          title={`Guarantor ${index + 1} — Occupational Details`}
          icon={Briefcase}
          accentColor="amber"
        >
          <PersonEmploymentFields
            control={control}
            watch={watch}
            prefix={`guarantors.${index}`}
          />
        </SectionCard>
        <SectionCard
          title={`Guarantor ${index + 1} — Financial Status`}
          icon={BarChart3}
          accentColor="rose"
        >
          <PersonFinancialFields
            control={control}
            watch={watch}
            setValue={setValue}
            prefix={`guarantors.${index}`}
          />
        </SectionCard>
      </div>
    ))}
  </div>
);

// ─────────────────────────────────────────────
// SECTION: LOAN REQUIREMENT (Image 8)
// ─────────────────────────────────────────────
const LoanRequirementSection = ({ control, errors, watch, setValue }) => {
  const costs = watch([
    "loanRequirement.landCost",
    "loanRequirement.agreementValue",
    "loanRequirement.amenitiesAgreement",
    "loanRequirement.stampDuty",
    "loanRequirement.constructionCost",
    "loanRequirement.incidental",
  ]);
  const funds = watch([
    "loanRequirement.amountSpent",
    "loanRequirement.balanceFundSaving",
    "loanRequirement.balanceFundDisposal",
    "loanRequirement.balanceFundFamily",
    "loanRequirement.balanceFundOther",
  ]);
  useEffect(() => {
    setValue(
      "loanRequirement.totalRequirement",
      costs.reduce((s, v) => s + (Number(v) || 0), 0),
    );
  }, [costs, setValue]);
  useEffect(() => {
    const t = funds.reduce((s, v) => s + (Number(v) || 0), 0);
    setValue("loanRequirement.totalBalanceFund", t);
  }, [funds, setValue]);
  const propertySelected = watch("property.selected");

  return (
    <div>
      <SectionCard title="Loan Requirement Details" icon={IndianRupee}>
        <div className="space-y-4">
          <Controller
            name="loanRequirement.restFrequency"
            control={control}
            render={({ field }) => (
              <RadioGroup
                label="Rest Frequency"
                options={REST_FREQ_OPTIONS}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="loanRequirement.interestOption"
            control={control}
            render={({ field }) => (
              <RadioGroup
                label="Interest Option"
                isRequired
                options={INTEREST_OPTIONS}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Grid>
            <Controller
              name="loanRequirement.tenure"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Tenure of Loan (Month/Years)"
                  isRequired
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  error={errors.loanRequirement?.tenure?.message}
                />
              )}
            />
            <Controller
              name="loanRequirement.loanAmount"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Loan Required (₹)"
                  type="number"
                  isRequired
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  error={errors.loanRequirement?.loanAmount?.message}
                />
              )}
            />
          </Grid>
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-2">
              Purpose of Loan
            </p>
            <div className="flex flex-wrap gap-2">
              {LOAN_PURPOSE_OPTIONS.map((opt) => (
                <Controller
                  key={opt.value}
                  name="loanRequirement.loanPurpose"
                  control={control}
                  render={({ field }) => (
                    <label
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer text-xs font-semibold transition-all select-none ${field.value === opt.value ? "bg-blue-50 border-blue-400 text-blue-700" : "border-slate-200 text-slate-500 bg-white"}`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center ${field.value === opt.value ? "border-blue-600 bg-blue-600" : "border-slate-300"}`}
                      >
                        {field.value === opt.value && (
                          <Check
                            size={8}
                            strokeWidth={3}
                            className="text-white"
                          />
                        )}
                      </span>
                      <input
                        type="radio"
                        className="sr-only"
                        value={opt.value}
                        checked={field.value === opt.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                      {opt.label}
                    </label>
                  )}
                />
              ))}
            </div>
            {watch("loanRequirement.loanPurpose") === "OTHER" && (
              <Controller
                name="loanRequirement.loanPurposeOther"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Specify Other Purpose"
                    className="mt-3"
                    {...field}
                  />
                )}
              />
            )}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-2">
              Payment Method
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "SALARY_DEDUCTION", label: "Salary Deduction" },
                { value: "CHEQUE", label: "Post Dated Cheque" },
                {
                  value: "STANDING_INSTRUCTION",
                  label: "Standing Instruction to Banker",
                },
                { value: "OTHER", label: "Other" },
              ].map((opt) => (
                <Controller
                  key={opt.value}
                  name="loanRequirement.repaymentMethod"
                  control={control}
                  render={({ field }) => (
                    <label
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer text-xs font-semibold transition-all select-none ${field.value === opt.value ? "bg-blue-50 border-blue-400 text-blue-700" : "border-slate-200 text-slate-500 bg-white"}`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center ${field.value === opt.value ? "border-blue-600 bg-blue-600" : "border-slate-300"}`}
                      >
                        {field.value === opt.value && (
                          <Check
                            size={8}
                            strokeWidth={3}
                            className="text-white"
                          />
                        )}
                      </span>
                      <input
                        type="radio"
                        className="sr-only"
                        value={opt.value}
                        checked={field.value === opt.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                      {opt.label}
                    </label>
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Cost Breakdown" icon={Landmark} accentColor="slate">
        <div className="space-y-4">
          <Grid>
            <Controller
              name="loanRequirement.landCost"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Land Cost (₹)"
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
            <Controller
              name="loanRequirement.agreementValue"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Agreement Value (₹)"
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </Grid>
          <Grid>
            <Controller
              name="loanRequirement.amenitiesAgreement"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Amenities Agreement (₹)"
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
            <Controller
              name="loanRequirement.stampDuty"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Stamp Duty / Reg. Charges (₹)"
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </Grid>
          <Grid>
            <Controller
              name="loanRequirement.constructionCost"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Cost of Construction / Ext. / IMP (₹)"
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
            <Controller
              name="loanRequirement.incidental"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Incidental (₹)"
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </Grid>
          <Controller
            name="loanRequirement.totalRequirement"
            control={control}
            render={({ field }) => (
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200 flex items-center justify-between">
                <span className="text-sm font-bold text-indigo-800">
                  (A) Total Requirement of Funds Rs.
                </span>
                <span className="text-lg font-black text-indigo-700">
                  ₹{Number(field.value || 0).toLocaleString("en-IN")}
                </span>
              </div>
            )}
          />
        </div>
      </SectionCard>

      <SectionCard title="Source of Funds" icon={PiggyBank} accentColor="teal">
        <div className="space-y-4">
          <Controller
            name="loanRequirement.amountSpent"
            control={control}
            render={({ field }) => (
              <InputField
                label="Amount Spent (₹)"
                type="number"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Balance Fund
          </p>
          <Grid>
            <Controller
              name="loanRequirement.balanceFundSaving"
              control={control}
              render={({ field }) => (
                <InputField
                  label="1) Saving (₹)"
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
            <Controller
              name="loanRequirement.balanceFundDisposal"
              control={control}
              render={({ field }) => (
                <InputField
                  label="2) Disposal of Asset (₹)"
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </Grid>
          <Grid>
            <Controller
              name="loanRequirement.balanceFundFamily"
              control={control}
              render={({ field }) => (
                <InputField
                  label="3) Family (₹)"
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
            <Controller
              name="loanRequirement.balanceFundOther"
              control={control}
              render={({ field }) => (
                <InputField
                  label="4) Others (₹)"
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </Grid>
          <Controller
            name="loanRequirement.totalBalanceFund"
            control={control}
            render={({ field }) => (
              <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 flex items-center justify-between">
                <span className="text-sm font-bold text-teal-800">
                  Total Balance Fund (1+2+3+4)
                </span>
                <span className="text-base font-black text-teal-700">
                  ₹{Number(field.value || 0).toLocaleString("en-IN")}
                </span>
              </div>
            )}
          />
          <Controller
            name="loanRequirement.loanRequired"
            control={control}
            render={({ field }) => (
              <InputField
                label="Loan Required (₹)"
                type="number"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
          <Controller
            name="loanRequirement.totalSourceOfFunds"
            control={control}
            render={({ field }) => (
              <div className="p-4 bg-teal-50 rounded-xl border border-teal-200 flex items-center justify-between">
                <span className="text-sm font-bold text-teal-800">
                  (B) Total Source of Funds Rs.
                </span>
                <span className="text-lg font-black text-teal-700">
                  ₹{Number(field.value || 0).toLocaleString("en-IN")}
                </span>
              </div>
            )}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Mortgage Property Details"
        icon={Home}
        accentColor="violet"
      >
        <div className="space-y-4">
          <Controller
            name="property.selected"
            control={control}
            render={({ field }) => (
              <RadioGroup
                label="Property Selected"
                options={[
                  { value: "Yes", label: "Yes" },
                  { value: "No", label: "No" },
                ]}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {propertySelected === "Yes" && (
            <>
              <Controller
                name="property.address"
                control={control}
                render={({ field }) => (
                  <TextAreaField label="Property Address" rows={2} {...field} />
                )}
              />
              <Grid cols={4}>
                <Controller
                  name="property.city"
                  control={control}
                  render={({ field }) => (
                    <InputField label="City / Town" {...field} />
                  )}
                />
                <Controller
                  name="property.district"
                  control={control}
                  render={({ field }) => (
                    <InputField label="District" {...field} />
                  )}
                />
                <Controller
                  name="property.state"
                  control={control}
                  render={({ field }) => (
                    <SelectField
                      label="State"
                      isSearchable
                      options={INDIAN_STATES}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  name="property.pinCode"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="Pin Code"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value.replace(/\D/g, "").slice(0, 6),
                        )
                      }
                    />
                  )}
                />
              </Grid>
              <Controller
                name="property.landmark"
                control={control}
                render={({ field }) => (
                  <InputField label="Land Mark" {...field} />
                )}
              />
              <Grid>
                <Controller
                  name="property.landArea"
                  control={control}
                  render={({ field }) => (
                    <InputField label="Land Area (Sq. Mtr.)" {...field} />
                  )}
                />
                <Controller
                  name="property.buildUpArea"
                  control={control}
                  render={({ field }) => (
                    <InputField label="Build up Area (Sq. Mtr.)" {...field} />
                  )}
                />
              </Grid>
              <Controller
                name="property.ownership"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    label="Ownership"
                    options={OWNERSHIP_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                name="property.landType"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    label="Land Type"
                    options={LAND_TYPE_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                name="property.purchasedFrom"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    label="Purchased From"
                    options={PURCHASED_FROM_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <Grid>
                <Controller
                  name="property.constructionStage"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      label="Construction Stage"
                      options={CONSTRUCTION_STAGE_OPTIONS}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  name="property.constructionPercent"
                  control={control}
                  render={({ field }) => (
                    <InputField label="Stage of Construction %" {...field} />
                  )}
                />
              </Grid>
            </>
          )}
        </div>
      </SectionCard>
    </div>
  );
};

// ─────────────────────────────────────────────
// SECTION: ADDITIONAL INFO (Image 5 + 8)
// ─────────────────────────────────────────────
const AdditionalSection = ({ control }) => {
  const HOW_KNOW = [
    { value: "PAPER_INSERT", label: "Paper Insert" },
    { value: "TV_ADVT", label: "TV Advt." },
    { value: "PERSONAL_VISIT", label: "Personal Visit" },
    { value: "BANNER", label: "Banner" },
    { value: "EXISTING_CUSTOMER", label: "Existing Customer" },
    { value: "CARDS", label: "Cards" },
    { value: "PAPER_ADVT", label: "Paper Advt." },
    { value: "OTHERS", label: "Others" },
  ];
  const OWN_OPTIONS = [
    { value: "CAR", label: "Car" },
    { value: "TWO_WHEELER", label: "2-Wheeler" },
    { value: "COMPUTER", label: "Computer" },
    { value: "AIR_CONDITIONS", label: "Air Conditions" },
    { value: "REFRIGERATOR", label: "Refrigerator" },
    { value: "MICROWAVE", label: "Microwave" },
  ];
  const BOOL_QS = [
    {
      key: "questionnaire.legalPropertyClear",
      label: "Is the Legal Title of the property clear?",
    },
    {
      key: "questionnaire.mortgagedElsewhere",
      label: "Will MPPL be able to get Ist Mortgage?",
    },
    {
      key: "questionnaire.residentOfIndia",
      label: "Is/Are Applicant(s) resident(s) of India?",
    },
    {
      key: "questionnaire.appliedToMPPLEarlier",
      label: "Has/Have applicant(s) applied to MPPL earlier?",
    },
    {
      key: "questionnaire.givenGuaranteeToMPPL",
      label: "Has/Have applicant(s) given Guarantee to any loan with MPPL?",
    },
    {
      key: "questionnaire.intendToGiveOnRent",
      label: "Do you intend to give the dwelling unit on rent?",
    },
    {
      key: "questionnaire.interestedInInsurance",
      label: "Would you be interested in insuring yourself?",
    },
  ];

  return (
    <div>
      {/* Loan Details Table */}
      <SectionCard title="Loan Details" icon={CreditCard} accentColor="slate">
        <p className="text-xs text-slate-400 mb-4">
          Applicable only if applicant/co-applicant has a loan outstanding
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100">
                {[
                  "Name of Institution",
                  "Purpose for Loan",
                  "Disbursed Loan Amt (₹)",
                  "EMI (₹)",
                  "Balance Term",
                  "Balance Outstanding (₹)",
                ].map((h) => (
                  <th
                    key={h}
                    className="border border-slate-200 px-2 py-2 text-left font-bold text-slate-600 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2].map((i) => (
                <tr key={i}>
                  {[
                    ["institution", "text"],
                    ["purposeForLoan", "text"],
                    ["disbursedLoanAmt", "number"],
                    ["emi", "number"],
                    ["balanceTerm", "text"],
                    ["balanceOutstanding", "number"],
                  ].map(([field, type]) => (
                    <td key={field} className="border border-slate-200 p-1">
                      <Controller
                        name={`loanDetails.${i}.${field}`}
                        control={control}
                        render={({ field: f }) => (
                          <input
                            type={type}
                            className="w-full px-2 py-1 text-xs border-0 outline-none bg-transparent"
                            placeholder="—"
                            {...f}
                            onChange={(e) =>
                              f.onChange(
                                type === "number"
                                  ? Number(e.target.value)
                                  : e.target.value,
                              )
                            }
                          />
                        )}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Credit Card Details */}
      <SectionCard
        title="Credit Card Details"
        icon={CreditCard}
        accentColor="indigo"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100">
                {[
                  "Holder Name",
                  "Credit Card No.",
                  "Card Holder Since",
                  "Issuing Bank",
                  "Credit Limit (₹)",
                  "Outstanding Amount (₹)",
                ].map((h) => (
                  <th
                    key={h}
                    className="border border-slate-200 px-2 py-2 text-left font-bold text-slate-600 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2].map((i) => (
                <tr key={i}>
                  {[
                    ["holderName", "text"],
                    ["cardNo", "text"],
                    ["cardHolderSince", "text"],
                    ["issuingBank", "text"],
                    ["creditLimit", "number"],
                    ["outstandingAmount", "number"],
                  ].map(([field, type]) => (
                    <td key={field} className="border border-slate-200 p-1">
                      <Controller
                        name={`creditCards.${i}.${field}`}
                        control={control}
                        render={({ field: f }) => (
                          <input
                            type={type}
                            className="w-full px-2 py-1 text-xs border-0 outline-none bg-transparent"
                            placeholder="—"
                            {...f}
                            onChange={(e) =>
                              f.onChange(
                                type === "number"
                                  ? Number(e.target.value)
                                  : e.target.value,
                              )
                            }
                          />
                        )}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Bank A/c Details */}
      <SectionCard title="Bank A/c Details" icon={Landmark} accentColor="teal">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100">
                {[
                  "Holder Name",
                  "Bank Name/Branch",
                  "A/c Type",
                  "Account No.",
                  "A/c Opening Date",
                  "Balance Amt (₹)",
                ].map((h) => (
                  <th
                    key={h}
                    className="border border-slate-200 px-2 py-2 text-left font-bold text-slate-600 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2].map((i) => (
                <tr key={i}>
                  {[
                    ["holderName", "text"],
                    ["bankNameBranch", "text"],
                    ["acType", "text"],
                    ["accountNo", "text"],
                    ["acOpeningDate", "text"],
                    ["balanceAmt", "number"],
                  ].map(([field, type]) => (
                    <td key={field} className="border border-slate-200 p-1">
                      <Controller
                        name={`bankAccounts.${i}.${field}`}
                        control={control}
                        render={({ field: f }) => (
                          <input
                            type={type}
                            className="w-full px-2 py-1 text-xs border-0 outline-none bg-transparent"
                            placeholder="—"
                            {...f}
                            onChange={(e) =>
                              f.onChange(
                                type === "number"
                                  ? Number(e.target.value)
                                  : e.target.value,
                              )
                            }
                          />
                        )}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Insurance Details */}
      <SectionCard
        title="Insurance Details (Applicant & Co-Applicant)"
        icon={Shield}
        accentColor="violet"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-200 px-2 py-2 text-left font-bold text-slate-600 w-32">
                  Field
                </th>
                {["Policy 1", "Policy 2", "Policy 3", "Policy 4"].map((p) => (
                  <th
                    key={p}
                    className="border border-slate-200 px-2 py-2 text-left font-bold text-slate-600"
                  >
                    {p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["issuedBy", "Issued by", "text"],
                ["branchName", "Branch Name", "text"],
                ["holderName", "Holder Name", "text"],
                ["policyNo", "Policy No.", "text"],
                ["maturityDate", "Maturity Date", "text"],
                ["policyValue", "Policy Value (₹)", "number"],
                ["policyType", "Policy Type", "text"],
                ["premiumYearly", "Premium (Yearly) (₹)", "number"],
                ["paidUpValue", "Paid-up Value (₹)", "number"],
              ].map(([field, rowLabel, type]) => (
                <tr key={field}>
                  <td className="border border-slate-200 px-2 py-1.5 font-semibold text-slate-600 bg-slate-50">
                    {rowLabel}
                  </td>
                  {[0, 1, 2, 3].map((i) => (
                    <td key={i} className="border border-slate-200 p-1">
                      <Controller
                        name={`insurancePolicies.${i}.${field}`}
                        control={control}
                        render={({ field: f }) => (
                          <input
                            type={type}
                            className="w-full px-2 py-1 text-xs border-0 outline-none bg-transparent"
                            placeholder="—"
                            {...f}
                            onChange={(e) =>
                              f.onChange(
                                type === "number"
                                  ? Number(e.target.value)
                                  : e.target.value,
                              )
                            }
                          />
                        )}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* General Information */}
      <SectionCard title="General Information" icon={Info} accentColor="amber">
        <div className="space-y-4">
          {BOOL_QS.map((q) => (
            <div
              key={q.key}
              className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 gap-4"
            >
              <span className="text-sm text-slate-700 flex-1">{q.label}</span>
              <Controller
                name={q.key}
                control={control}
                render={({ field }) => (
                  <div className="flex gap-2 shrink-0">
                    {[true, false].map((v) => (
                      <label
                        key={String(v)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border cursor-pointer text-xs font-semibold transition-all ${field.value === v ? "bg-blue-50 border-blue-400 text-blue-700" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}
                      >
                        <input
                          type="radio"
                          className="sr-only"
                          value={String(v)}
                          checked={field.value === v}
                          onChange={() => field.onChange(v)}
                        />
                        {v ? "Yes" : "No"}
                      </label>
                    ))}
                  </div>
                )}
              />
            </div>
          ))}

          <Controller
            name="questionnaire.howKnowAboutMPPL"
            control={control}
            render={({ field }) => (
              <CheckboxGroup
                label="Did you get to know about MPPL from"
                options={HOW_KNOW}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="questionnaire.howKnowAboutMPPLOther"
            control={control}
            render={({ field }) => (
              <InputField label="Others (specify)" {...field} />
            )}
          />
          <Grid>
            <Controller
              name="questionnaire.preferLoanSanctionedDate"
              control={control}
              render={({ field }) => (
                <InputField
                  label="When do you prefer the Loan to be Sanctioned (Date)"
                  type="date"
                  {...field}
                />
              )}
            />
            <Controller
              name="questionnaire.disbursedDate"
              control={control}
              render={({ field }) => (
                <InputField label="Disbursed (Date)" type="date" {...field} />
              )}
            />
          </Grid>
          <Controller
            name="questionnaire.doYouOwn"
            control={control}
            render={({ field }) => (
              <CheckboxGroup
                label="Do you own"
                options={OWN_OPTIONS}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="questionnaire.communicationLanguage"
            control={control}
            render={({ field }) => (
              <RadioGroup
                label="In which language would you like to receive any future communication?"
                options={[
                  { value: "HINDI", label: "Hindi" },
                  { value: "ENGLISH", label: "English" },
                ]}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </SectionCard>

      {/* References */}
      <SectionCard title="References" icon={UserCheck}>
        <div className="space-y-6">
          {[0, 1].map((n) => (
            <div key={n}>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Reference {n + 1}
              </p>
              <Grid>
                <Controller
                  name={`references.${n}.name`}
                  control={control}
                  render={({ field }) => <InputField label="Name" {...field} />}
                />
                <Controller
                  name={`references.${n}.fatherName`}
                  control={control}
                  render={({ field }) => (
                    <InputField label="Father's Name" {...field} />
                  )}
                />
              </Grid>
              <div className="mt-3 space-y-3">
                <Controller
                  name={`references.${n}.wo`}
                  control={control}
                  render={({ field }) => <InputField label="W/o" {...field} />}
                />
                <Controller
                  name={`references.${n}.address`}
                  control={control}
                  render={({ field }) => (
                    <InputField label="Address" {...field} />
                  )}
                />
                <Grid cols={3}>
                  <Controller
                    name={`references.${n}.cityDist`}
                    control={control}
                    render={({ field }) => (
                      <InputField label="City / Dist" {...field} />
                    )}
                  />
                  <Controller
                    name={`references.${n}.state`}
                    control={control}
                    render={({ field }) => (
                      <InputField label="State" {...field} />
                    )}
                  />
                  <Controller
                    name={`references.${n}.pinCode`}
                    control={control}
                    render={({ field }) => (
                      <InputField
                        label="Pin Code"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value.replace(/\D/g, "").slice(0, 6),
                          )
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid>
                  <Controller
                    name={`references.${n}.phoneNo`}
                    control={control}
                    render={({ field }) => (
                      <InputField
                        label="Phone No."
                        type="tel"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value.replace(/\D/g, "").slice(0, 10),
                          )
                        }
                      />
                    )}
                  />
                  <Controller
                    name={`references.${n}.occupation`}
                    control={control}
                    render={({ field }) => (
                      <InputField label="Occupation" {...field} />
                    )}
                  />
                </Grid>
              </div>
              {n === 0 && <Divider />}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

// ─────────────────────────────────────────────
// SECTION: CONSENT & PDC (Images 9 + 10)
// ─────────────────────────────────────────────
const ConsentSection = ({ control }) => (
  <div>
    <SectionCard
      title="Consent Letter (सहमति पत्र)"
      icon={FileCheck}
      accentColor="indigo"
    >
      <div className="space-y-4">
        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-xs text-slate-700 leading-relaxed space-y-2">
          <p>
            Shriман Prabhandak, Mascot Projects Pvt. Ltd., Jaipur — Mahoday,
          </p>
          <p>
            Namra nivedan hai ki main <strong>[Borrower Name]</strong>,
            Putra/Patni/Putri/Shri <strong>[Spouse/Ward of]</strong> ne aapki
            company se <strong>[Loan Amount]</strong> Rupaye ka rin liya hai.
          </p>
        </div>
        <Grid>
          <Controller
            name="consent.borrowerName"
            control={control}
            render={({ field }) => (
              <InputField label="Borrower Name (Naam)" {...field} />
            )}
          />
          <Controller
            name="consent.spouseOrWardOf"
            control={control}
            render={({ field }) => (
              <InputField
                label="Putra/Patni/Putri/Shri (S/o, W/o)"
                {...field}
              />
            )}
          />
        </Grid>
        <Grid>
          <Controller
            name="consent.loanAmount"
            control={control}
            render={({ field }) => (
              <InputField
                label="Loan Amount (Rin Rashi) (₹)"
                type="number"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
          <Controller
            name="consent.totalMonthlyInstallments"
            control={control}
            render={({ field }) => (
              <InputField
                label="Total Monthly Installments (Kul Masik Kisten)"
                type="number"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        </Grid>
        <Grid>
          <Controller
            name="consent.advanceInstallments"
            control={control}
            render={({ field }) => (
              <InputField
                label="Advance Installments (Kisht Agrim)"
                type="number"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
          <Controller
            name="consent.pendingInstallments"
            control={control}
            render={({ field }) => (
              <InputField
                label="Pending Installments (Bakaya Kisten)"
                type="number"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        </Grid>
        <Grid>
          <Controller
            name="consent.firstInstallmentDate"
            control={control}
            render={({ field }) => (
              <InputField
                label="First Installment Date (Pratham Kisht Dinank)"
                type="date"
                {...field}
              />
            )}
          />
          <Controller
            name="consent.interestRate"
            control={control}
            render={({ field }) => (
              <InputField
                label="Interest Rate % (Byaj ki Dar — Pratishat Per Annum)"
                {...field}
              />
            )}
          />
        </Grid>
        <Controller
          name="consent.paymentMode"
          control={control}
          render={({ field }) => (
            <RadioGroup
              label="Kishton ka Bhugtan (Payment Mode)"
              options={PAYMENT_MODE_OPTIONS}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Grid>
          <Controller
            name="consent.totalCheques"
            control={control}
            render={({ field }) => (
              <InputField label="Kul Cheque (Total Cheques)" {...field} />
            )}
          />
          <Controller
            name="consent.outstanding"
            control={control}
            render={({ field }) => (
              <InputField label="Bakaya (Outstanding)" {...field} />
            )}
          />
        </Grid>
        <Controller
          name="consent.chequeEcs"
          control={control}
          render={({ field }) => (
            <InputField
              label="Cheque/ECS (Borrower/Co-Borrower/Guarantor) diye ja rahe hain"
              {...field}
            />
          )}
        />
      </div>
    </SectionCard>

    {/* Full PDC / Rollover PDC Table */}
    <SectionCard
      title="Full PDC / Rollover PDC / Security Cheque Details"
      icon={CreditCard}
      accentColor="slate"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100">
              {[
                "Drawee Bank",
                "Account No.",
                "Cheque No. From",
                "Cheque No. To",
                "No. of Chq.",
                "EMI (₹)",
                "Security",
                "Insurance",
                "Chq. Dt. M/Y",
              ].map((h) => (
                <th
                  key={h}
                  className="border border-slate-200 px-2 py-2 text-left font-bold text-slate-600 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[0, 1, 2, 3, 4].map((i) => (
              <tr key={i}>
                {[
                  ["draweeBank", "text"],
                  ["accountNo", "text"],
                  ["chequeFrom", "text"],
                  ["chequeTo", "text"],
                  ["noOfCheques", "text"],
                  ["emi", "number"],
                  ["security", "text"],
                  ["insurance", "text"],
                  ["chequeDtMY", "text"],
                ].map(([field, type]) => (
                  <td key={field} className="border border-slate-200 p-1">
                    <Controller
                      name={`pdcEntries.${i}.${field}`}
                      control={control}
                      render={({ field: f }) => (
                        <input
                          type={type}
                          className="w-full px-2 py-1 text-xs border-0 outline-none bg-transparent"
                          placeholder="—"
                          {...f}
                          onChange={(e) =>
                            f.onChange(
                              type === "number"
                                ? Number(e.target.value)
                                : e.target.value,
                            )
                          }
                        />
                      )}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400 mt-3">
        Note: Rollover PDC ke case mein bakaya cheque 6+ maah ki bheetar jama
        karane honge athwa jama ki gayi pratibhuti bina kisi soochna ke jabt kar
        li jaegi.
      </p>
    </SectionCard>

    {/* Payment Receipts */}
    <SectionCard
      title="Payment Receipts (Neeche Rashi Jama Karai Hai)"
      icon={FileCheck}
      accentColor="emerald"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100">
              {[
                "Vivaran (Description)",
                "Dinank (Date)",
                "Receipt No.",
                "Rashi (Amount ₹)",
              ].map((h) => (
                <th
                  key={h}
                  className="border border-slate-200 px-2 py-2 text-left font-bold text-slate-600"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Advance Installment (Advance Kisht)", "advanceInstallment"],
              ["File Charge", "fileCharge"],
              ["Security Amount (Pratibhuti Rashi)", "securityAmount"],
              ["Cash Payment Charge (Nakad Bhugtan Charge)", "cashPayment"],
              ["Stamping Charge (Stamping Charge)", "stampingCharge"],
              ["Other Amount (Anya Rashi)", "otherAmount"],
              ["Total Amount (Kul Rashi)", "totalAmount"],
            ].map(([label, key]) => (
              <tr key={key}>
                <td className="border border-slate-200 px-2 py-1.5 font-semibold text-slate-700 bg-slate-50">
                  {label}
                </td>
                {[
                  ["Date", "Date", "date"],
                  ["ReceiptNo", "Receipt No.", "text"],
                  ["Amount", "Amount (₹)", "number"],
                ].map(([suffix, , type]) => (
                  <td key={suffix} className="border border-slate-200 p-1">
                    <Controller
                      name={`paymentReceipts.${key}${suffix}`}
                      control={control}
                      render={({ field: f }) => (
                        <input
                          type={type}
                          className="w-full px-2 py-1 text-xs border-0 outline-none bg-transparent"
                          placeholder="—"
                          {...f}
                          onChange={(e) =>
                            f.onChange(
                              type === "number"
                                ? Number(e.target.value)
                                : e.target.value,
                            )
                          }
                        />
                      )}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-8 pt-4 border-t border-slate-100">
        <div className="text-center">
          <div className="h-10 border-b-2 border-slate-400 mb-2"></div>
          <p className="text-xs text-slate-500 font-semibold">
            Hastakshar Prarthi (Applicant Signature)
          </p>
        </div>
        <div className="text-center">
          <div className="h-10 border-b-2 border-slate-400 mb-2"></div>
          <p className="text-xs text-slate-500 font-semibold">Dinank (Date)</p>
        </div>
        <div className="text-center">
          <div className="h-10 border-b-2 border-slate-400 mb-2"></div>
          <p className="text-xs text-slate-500 font-semibold">
            Hastakshar Marketing Head
          </p>
        </div>
      </div>
    </SectionCard>
  </div>
);

// ─────────────────────────────────────────────
// SECTION: REVIEW & SUBMIT
// ─────────────────────────────────────────────
const ReviewBlock = ({ title, icon: Icon, rows }) => {
  const valid = rows.filter(
    ([, v]) => v !== undefined && v !== null && v !== "",
  );
  if (!valid.length) return null;
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-4">
      <div className="flex items-center gap-2 px-5 py-3 bg-slate-50 border-b border-slate-100">
        {Icon && <Icon size={14} className="text-blue-600" />}
        <h4 className="font-bold text-sm text-slate-700">{title}</h4>
      </div>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {valid.map(([label, value]) => (
          <div key={label}>
            <p className="text-xs text-slate-400 font-medium mb-0.5">{label}</p>
            <p className="text-sm font-semibold text-slate-800">
              {String(value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ReviewSection = ({ getValues, onSubmit, isSubmitting }) => {
  const [agreed, setAgreed] = useState(false);
  const data = getValues();
  const a = data.applicant || {};
  const addr = data.addresses?.currentAddress || {};
  const lr = data.loanRequirement || {};

  return (
    <div className="space-y-4">
      <div className="p-5 bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Eye size={18} />
          </div>
          <div>
            <h3 className="font-black text-lg">Review Application</h3>
            <p className="text-blue-100 text-sm">
              Verify all details before final submission
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            [
              "Loan Purpose",
              LOAN_PURPOSE_OPTIONS.find((o) => o.value === lr.loanPurpose)
                ?.label || "—",
            ],
            [
              "Loan Amount",
              lr.loanAmount
                ? `₹${Number(lr.loanAmount).toLocaleString("en-IN")}`
                : "—",
            ],
            ["Tenure", lr.tenure ? `${lr.tenure} Months` : "—"],
          ].map(([l, v]) => (
            <div key={l} className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-blue-200 text-[10px] font-medium">{l}</p>
              <p className="text-white font-bold text-sm mt-0.5">{v}</p>
            </div>
          ))}
        </div>
        {data.leadNumber && (
          <div className="mt-3 flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
            <Search size={12} className="text-blue-200 shrink-0" />
            <span className="text-blue-100 text-xs">Lead Reference:</span>
            <span className="text-white text-xs font-black tracking-widest">
              {data.leadNumber}
            </span>
          </div>
        )}
      </div>

      <ReviewBlock
        title="Applicant Details"
        icon={User}
        rows={[
          [
            "Full Name",
            [a.title, a.firstName, a.middleName, a.lastName]
              .filter(Boolean)
              .join(" "),
          ],
          ["Date of Birth", a.dob],
          ["Gender", a.gender],
          ["Mobile", a.contactNumber],
          ["Email", a.email],
          ["PAN", a.panNumber],
          ["Aadhaar", a.aadhaarNumber],
          ["Category", a.category],
          [
            "Employment",
            EMPLOYMENT_OPTIONS.find((o) => o.value === a.employmentType)?.label,
          ],
          ["Nationality", a.nationality],
          [
            "Total Assets",
            a.totalAssets
              ? `₹${Number(a.totalAssets).toLocaleString("en-IN")}`
              : "",
          ],
          [
            "Total Liabilities",
            a.totalLiabilities
              ? `₹${Number(a.totalLiabilities).toLocaleString("en-IN")}`
              : "",
          ],
        ]}
      />

      <ReviewBlock
        title="Current Address"
        icon={MapPin}
        rows={[
          ["Address", addr.addressLine1],
          ["City", addr.city],
          ["District", addr.district],
          ["State", addr.state],
          ["Pin Code", addr.pinCode],
        ]}
      />

      <ReviewBlock
        title="Loan Requirement"
        icon={IndianRupee}
        rows={[
          [
            "Loan Amount",
            lr.loanAmount
              ? `₹${Number(lr.loanAmount).toLocaleString("en-IN")}`
              : "",
          ],
          ["Tenure", lr.tenure ? `${lr.tenure} Months` : ""],
          ["Interest Option", lr.interestOption],
          ["Repayment Method", lr.repaymentMethod],
          [
            "Total Requirement",
            lr.totalRequirement
              ? `₹${Number(lr.totalRequirement).toLocaleString("en-IN")}`
              : "",
          ],
        ]}
      />

      {(data.coApplicants || []).length > 0 && (
        <ReviewBlock
          title={`Co-Applicants (${data.coApplicants.length})`}
          icon={Users}
          rows={data.coApplicants.map((ca, i) => [
            `Co-Applicant ${i + 1}`,
            [ca.firstName, ca.lastName].filter(Boolean).join(" "),
          ])}
        />
      )}
      {(data.guarantors || []).length > 0 && (
        <ReviewBlock
          title={`Guarantors (${data.guarantors.length})`}
          icon={Shield}
          rows={data.guarantors.map((g, i) => [
            `Guarantor ${i + 1}`,
            [g.firstName, g.lastName].filter(Boolean).join(" "),
          ])}
        />
      )}

      <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200">
        <div className="flex items-start gap-3">
          <Info size={16} className="text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-amber-800 mb-2">Declaration</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              I/We declare that all the particulars and information given in
              this application form are true, correct and complete and that they
              shall form the basis of any loan{" "}
              <strong>Mascot Projects Pvt. Ltd.</strong> may decide to grant to
              me/us. I/We confirm that I/WE have/had no insolvency proceedings
              against me/us nor have I/We been adjudicated insolvent. I/We
              further confirm that I/We have read the brochure and understood
              the content. I/WE also understand that the processing fees are
              non-refundable. I/We undertake to inform MPPL regarding any
              changes in My/Our occupation/employment.
            </p>
            <div
              className="flex items-center gap-2.5 mt-4 cursor-pointer select-none"
              onClick={() => setAgreed((v) => !v)}
            >
              <div
                className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all shrink-0 ${agreed ? "bg-amber-600 border-amber-600" : "border-amber-400 bg-white"}`}
              >
                {agreed && (
                  <Check size={11} strokeWidth={3} className="text-white" />
                )}
              </div>
              <span className="text-xs font-bold text-amber-800">
                I agree to the above declaration
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 p-5 bg-slate-50 rounded-2xl border border-slate-200">
        {[
          ["Applicant's Signature", "✓"],
          ["Co-Applicant's Signature", "🖊"],
          ["Guarantor's Signature", "✗"],
        ].map(([label, symbol]) => (
          <div key={label} className="text-center">
            <div className="h-12 border-b-2 border-slate-400 mb-2 flex items-end justify-center pb-1">
              <span className="text-2xl text-slate-300">{symbol}</span>
            </div>
            <p className="text-xs text-slate-500 font-semibold">{label}</p>
          </div>
        ))}
      </div>

      <Button
        type="button"
        onClick={onSubmit}
        disabled={!agreed || isSubmitting}
        className={`w-full justify-center! py-3.5! text-base! rounded-xl! bg-emerald-600! hover:bg-emerald-700! ${!agreed || isSubmitting ? "opacity-50! cursor-not-allowed!" : ""}`}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Submitting…
          </>
        ) : (
          <>
            <Send size={16} /> Submit Application
          </>
        )}
      </Button>
    </div>
  );
};

// ─────────────────────────────────────────────
// SUCCESS SCREEN
// ─────────────────────────────────────────────
const SuccessScreen = ({ onReset, leadNumber }) => {
  const [refNum] = useState(() => Date.now().toString().slice(-8));
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <BadgeCheck size={40} className="text-emerald-600" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">
          Application Submitted!
        </h2>
        <p className="text-slate-500 text-sm">
          Your loan application has been received successfully.
        </p>
        <div className="bg-blue-50 rounded-2xl p-4 my-6 border border-blue-100">
          <p className="text-xs text-blue-600 font-semibold">
            Application Reference
          </p>
          <p className="text-2xl font-black text-blue-800 mt-1 tracking-wider">
            MPPL-{refNum.current}
          </p>
          {leadNumber && (
            <p className="text-xs text-blue-500 mt-2">
              Lead: <span className="font-bold">{leadNumber}</span>
            </p>
          )}
        </div>
        <p className="text-xs text-slate-400 mb-6">
          Our team will contact you within 2–3 business days
        </p>
        <Button onClick={onReset} className="w-full justify-center!">
          Start New Application
        </Button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
export default function LoanApplicationForm({ onClose }) {
  const [currentStep, setCurrentStep] = useState("applicant");
  const [completedSteps, setCompletedSteps] = useState([]);
  const [toast, setToast] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    trigger,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createLoanApplicationSchema),
    mode: "onTouched",
    defaultValues: DEFAULT_VALUES,
  });

  const {
    fields: coAppFields,
    append: coAppAppend,
    remove: coAppRemove,
  } = useFieldArray({ control, name: "coApplicants" });
  const {
    fields: guarFields,
    append: guarAppend,
    remove: guarRemove,
  } = useFieldArray({ control, name: "guarantors" });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const {
          values,
          completedSteps: cs,
          currentStep: cs2,
        } = JSON.parse(raw);
        if (values) reset(values);
        if (cs) setCompletedSteps(cs);
        if (cs2) setCurrentStep(cs2);
        showToast("Draft loaded ✓", "draft");
      }
    } catch {
      /* silent */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const handleClose = () => {
    const confirmClose = window.confirm(
      "Are you sure you want to close the form?",
    );
    if (confirmClose) {
      onClose();
    }
  };

  const saveDraft = useCallback(() => {
    try {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          values: getValues(),
          completedSteps,
          currentStep,
        }),
      );
      showToast(
        `Draft saved — "${STEPS.find((s) => s.id === currentStep)?.label}"`,
        "draft",
      );
    } catch {
      showToast("Failed to save draft", "error");
    }
  }, [getValues, completedSteps, currentStep, showToast]);

  const currentIdx = STEPS.findIndex((s) => s.id === currentStep);

  const goNext = useCallback(async () => {
    const fields = STEP_FIELDS[currentStep] || [];
    const valid = fields.length ? await trigger(fields) : true;
    if (!valid) {
      showToast("Please fix the errors before continuing", "error");
      return;
    }
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }
    if (currentIdx < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIdx + 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep, completedSteps, currentIdx, trigger, showToast]);

  const goPrev = useCallback(() => {
    if (currentIdx > 0) {
      setCurrentStep(STEPS[currentIdx - 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentIdx]);

  const onSubmit = handleSubmit(
    (data) => {
      setIsSubmitting(true);
      console.log(
        "✅ LOAN APPLICATION PAYLOAD:",
        JSON.stringify(data, null, 2),
      );
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
        localStorage.removeItem(DRAFT_KEY);
      }, 1800);
    },
    (errs) => {
      console.error("Validation errors:", errs);
      showToast("Please complete all required fields", "error");
    },
  );

  if (submitted) {
    return (
      <SuccessScreen
        leadNumber={getValues("leadNumber")}
        onReset={() => {
          reset(DEFAULT_VALUES);
          setSubmitted(false);
          setCompletedSteps([]);
          setCurrentStep("applicant");
        }}
      />
    );
  }

  const renderSection = () => {
    switch (currentStep) {
      case "applicant":
        return (
          <ApplicantSection
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
            showToast={showToast}
          />
        );
      case "loanType":
        return <LoanTypeSection control={control} errors={errors} />;
      case "address":
        return (
          <AddressSection
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />
        );
      case "coApplicant":
        return (
          <CoApplicantSection
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
            fields={coAppFields}
            append={coAppAppend}
            remove={coAppRemove}
          />
        );
      case "guarantor":
        return (
          <GuarantorSection
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
            fields={guarFields}
            append={guarAppend}
            remove={guarRemove}
          />
        );
      case "loanReq":
        return (
          <LoanRequirementSection
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />
        );
      case "additional":
        return <AdditionalSection control={control} watch={watch} />;
      case "consent":
        return <ConsentSection control={control} />;
      case "review":
        return (
          <ReviewSection
            getValues={getValues}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 pt-16 lg:pl-64 bg-linear-to-br from-slate-50 via-blue-50/20 to-slate-100 overflow-y-auto">
      <main className="max-w-5xl mx-auto px-6 py-10">
        {renderSection()}
        {currentStep !== "review" && (
          <div className="mt-6 flex items-center justify-between pt-6 border-t border-slate-200">
            <Button
              type="button"
              onClick={goPrev}
              disabled={currentIdx === 0}
              className={`bg-white! text-slate-600! border border-slate-200 hover:bg-slate-50! shadow-none! ${currentIdx === 0 ? "opacity-40! cursor-not-allowed!" : ""}`}
            >
              <ChevronLeft size={15} /> Previous
            </Button>
            <button
              onClick={handleClose}
              className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
            >
              <X size={16} />
              Close
            </button>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={saveDraft}
                className="bg-amber-50! text-amber-700! border border-amber-200 hover:bg-amber-100! shadow-none! text-sm!"
              >
                <Save size={14} /> Save Draft
              </Button>
              <Button type="button" onClick={goNext} className="text-sm!">
                {currentIdx === STEPS.length - 2 ? "Review & Submit" : "Next"}{" "}
                <ChevronRight size={15} />
              </Button>
            </div>
          </div>
        )}
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
