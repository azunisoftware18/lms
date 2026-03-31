import { useLoanTypes } from "../../hooks/useLoanApplication";
import { useCreateLoanApplication } from "../../hooks/useLoanApplication";
import ErrorBoundary from "../common/ErrorBoundary";
import React, { useState, useEffect, useCallback } from "react";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TrendingUp,
  BarChart3,
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
  BadgeCheck,
  Info,
  Loader2,
  UserCheck,
  X,
} from "lucide-react";

import Button from "../ui/Button";
import InputField from "../ui/InputField";
import SelectField from "../ui/SelectField";
import createLoanApplicationSchema from "../../validations/LoanApplicationValidation";
import { showError, showInfo, showSuccess } from "../../lib/utils/toastService";
// Populated option arrays for required fields
const EMPLOYMENT_OPTIONS = [
  { value: "SALARIED", label: "Salaried" },
  { value: "BUSINESS", label: "Business" },
  { value: "PROFESSIONAL", label: "Professional" },
  { value: "OTHER", label: "Other" },
];
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
const CATEGORY_OPTIONS = [
  { value: "GENERAL", label: "General" },
  { value: "SC", label: "SC" },
  { value: "ST", label: "ST" },
  { value: "NT", label: "NT" },
  { value: "OBC", label: "OBC" },
  { value: "OTHER", label: "Other" },
];
const MARITAL_OPTIONS = [
  { value: "SINGLE", label: "Single" },
  { value: "MARRIED", label: "Married" },
  { value: "DIVORCED", label: "Divorced" },
  { value: "WIDOWED", label: "Widowed" },
  { value: "OTHER", label: "Other" },
];
// Loan type options will be fetched from backend
const INTEREST_OPTIONS = [
  { value: "FIXED", label: "Fixed" },
  { value: "VARIABLE", label: "Variable" },
];
const REPAYMENT_OPTIONS = [
  { value: "SALARY_DEDUCTION", label: "Salary Deduction" },
  { value: "ECS", label: "ECS" },
  { value: "CHEQUE", label: "Post Dated Cheque" },
  { value: "STANDING_INSTRUCTION", label: "Standing Instruction to Banker" },
  { value: "OTHER", label: "Other" },
];
const REST_FREQ_OPTIONS = [
  { value: "MONTHLY", label: "Monthly" },
  { value: "QUARTERLY", label: "Quarterly" },
  { value: "HALF_YEARLY", label: "Half-Yearly" },
  { value: "YEARLY", label: "Yearly" },
];
const LOAN_PURPOSE_OPTIONS = [
  { value: "HOME", label: "Home Purchase" },
  { value: "HOME_IMPROVEMENT", label: "Home Improvement" },
  { value: "PLOT_PURCHASE", label: "Plot Purchase" },
  { value: "NRPL", label: "NRPL" },
  { value: "POST_DATED_CHEQUE", label: "Post Dated Cheque" },
  { value: "STANDING_INSTRUCTION", label: "Standing Instruction" },
];

// PERSON PERSONAL FIELDS (Reusable for Applicant/Co-Applicant)
const PersonPersonalFields = ({ control, prefix, watch }) => {
  // Watch present accommodation for conditional rent field
  const presentAccommodation = watch(`${prefix}.presentAccommodation`);
  return (
    <div className="space-y-4">
      <Grid cols={3}>
        <Controller
          name={`${prefix}.firstName`}
          control={control}
          render={({ field }) => (
            <InputField label="First Name" isRequired {...field} />
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
          render={({ field }) => (
            <InputField label="Last Name" isRequired {...field} />
          )}
        />
      </Grid>
      <Grid cols={3}>
        <Controller
          name={`${prefix}.fatherName`}
          control={control}
          render={({ field }) => (
            <InputField label="Father's Name" isRequired {...field} />
          )}
        />
        {/* Use the useLoanTypes hook for fetching loan types */}
        <Controller
          name={`${prefix}.motherName`}
          control={control}
          render={({ field }) => (
            <InputField label="Mother's Name" isRequired {...field} />
          )}
        />
        <Controller
          name={`${prefix}.woname`}
          control={control}
          render={({ field }) => <InputField label="W/o" {...field} />}
        />
      </Grid>
      <Grid cols={3}>
        <Controller
          name={`${prefix}.qualification`}
          control={control}
          render={({ field }) => (
            <SelectField
              label="Qualification"
              options={[
                { value: "MATRIC", label: "Matriculation" },
                { value: "INTERMEDIATE", label: "Intermediate" },
                { value: "GRADUATE", label: "Graduate" },
                { value: "POSTGRADUATE", label: "Post Graduate" },
                { value: "DOCTORATE", label: "Doctorate" },
                { value: "OTHER", label: "Other" },
              ]}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          name={`${prefix}.email`}
          control={control}
          render={({ field }) => (
            <InputField label="Email Address" type="email" {...field} />
          )}
        />
        <Controller
          name={`${prefix}.passportNumber`}
          control={control}
          render={({ field }) => (
            <InputField label="Passport Number" {...field} />
          )}
        />
        <Controller
          name={`${prefix}.panNumber`}
          control={control}
          render={({ field }) => <InputField label="PAN No." {...field} />}
        />
      </Grid>
      <Grid cols={3}>
        <Controller
          name={`${prefix}.dob`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Date of Birth"
              type="date"
              value={
                field.value
                  ? new Date(field.value).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                field.onChange(
                  e.target.value ? new Date(e.target.value) : undefined,
                )
              }
            />
          )}
        />
        <Controller
          name={`${prefix}.category`}
          control={control}
          render={({ field }) => (
            <SelectField
              label="Category"
              isRequired
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
            <SelectField
              label="Marital Status"
              isRequired
              options={MARITAL_OPTIONS}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          name={`${prefix}.contactNumber`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Mobile Number"
              type="tel"
              isRequired
              {...field}
              onChange={(e) =>
                field.onChange(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
            />
          )}
        />
      </Grid>

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
      <Grid cols={3}>
        <Controller
          name={`${prefix}.drivingLicenceNo`}
          control={control}
          render={({ field }) => (
            <InputField label="Driving Licence No." {...field} />
          )}
        />
        <Controller
          name={`${prefix}.voterId`}
          control={control}
          render={({ field }) => <InputField label="Voter Id" {...field} />}
        />
        <Controller
          name={`${prefix}.aadhaarNumber`}
          control={control}
          render={({ field }) => (
            <InputField label="Aadhaar Card No." {...field} />
          )}
        />
      </Grid>
      <Grid cols={3}>
        <Controller
          name={`${prefix}.relation`}
          control={control}
          render={({ field }) => (
            <SelectField
              label="Relationship with Applicant"
              options={RELATION_OPTIONS}
              value={field.value}
              onChange={(val) => field.onChange(val)}
            />
          )}
        />
        <Controller
          name={`${prefix}.presentAccommodation`}
          control={control}
          render={({ field }) => (
            <SelectField
              label="Present Accommodation"
              options={[
                { value: "OWN", label: "Own" },
                { value: "FAMILY", label: "Family" },
                { value: "RENTED", label: "Rented" },
                { value: "EMPLOYER", label: "Employer" },
              ]}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
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
              <InputField label="Rent per Month" type="number" {...field} />
            )}
          />
        )}
      </Grid>
      <Controller
        name={`${prefix}.currentAddress.addressLine1`}
        control={control}
        render={({ field }) => (
          <InputField label="Address Line 1" isRequired {...field} />
        )}
      />
      <Grid cols={3}>
        <Controller
          name={`${prefix}.currentAddress.city`}
          control={control}
          render={({ field }) => (
            <InputField label="City / Town" isRequired {...field} />
          )}
        />
        <Controller
          name={`${prefix}.currentAddress.district`}
          control={control}
          render={({ field }) => (
            <InputField label="District" isRequired {...field} />
          )}
        />
        <Controller
          name={`${prefix}.currentAddress.state`}
          control={control}
          render={({ field }) => (
            <SelectField
              label="State"
              isRequired
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
          name={`${prefix}.currentAddress.pinCode`}
          control={control}
          render={({ field }) => (
            <InputField
              label="Pin Code"
              isRequired
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
        <Controller
          name={`${prefix}.currentAddress.phoneWithStd`}
          control={control}
          render={({ field }) => (
            <InputField label="Phone No. (With STD Code)" {...field} />
          )}
        />
      </Grid>

      <Divider label="Permanent Address" />
      <Controller
        name={`${prefix}.permanentAddress.addressLine1`}
        control={control}
        render={({ field }) => <InputField label="Address Line 1" {...field} />}
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
      <Grid cols={3}>
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
    </div>
  );
};

// PERSON DEFAULTS (backend-required fields only)
const personDefaults = () => ({
  title: undefined,
  firstName: "",
  middleName: "",
  lastName: "",
  fatherName: "",
  motherName: "",
  woname: undefined,
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
  gender: undefined,
  maritalStatus: undefined,
  category: undefined,
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
  commencementDate: undefined,
  professionalType: undefined,
  professionalTypeOther: "",
  businessType: undefined,
  businessTypeOther: "",
  salariedWorkingFor: undefined,
  designation: "",
  department: undefined,
  dateOfJoining: undefined,
  dateOfRetirement: undefined,
  grossMonthlyIncome: null,
  netMonthlyIncome: null,
  monthlyExpenses: null,
  savingBankBalance: null,
  valueOfImmovableProperty: null,
  currentBalanceInPF: null,
  valueOfSharesAndSecurities: null,
  fixedDeposits: null,
  otherAssets: null,
  totalAssets: null,
  creditSocietyLoan: null,
  employerLoan: null,
  homeLoan: null,
  pfLoan: null,
  vehicleLoan: null,
  personalLoan: null,
  otherLoan: null,
  totalLiabilities: null,
});
// ...existing code...

// ...existing code...
const RELATION_OPTIONS = [
  { value: "SPOUSE", label: "Spouse" },
  { value: "PARTNER", label: "Partner" },
  { value: "FATHER", label: "Father" },
  { value: "MOTHER", label: "Mother" },
  { value: "SIBLING", label: "Sibling" },
  { value: "FRIEND", label: "Friend" },
  { value: "OTHER", label: "Other" },
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
  { value: "PUBLIC_SECTOR_UNIT", label: "Public Sector Unit" },
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

// STEPS
const STEPS = [
  { id: "personal", label: "Personal", shortLabel: "Personal", icon: User },
  {
    id: "coApplicant",
    label: "Co-Applicant",
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
    id: "additional",
    label: "Additional",
    shortLabel: "Additional",
    icon: FileText,
  },
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
  ],
  applicantContact: [
    "applicant.contactNumber",
    "applicant.panNumber",
    "applicant.aadhaarNumber",
  ],
  accommodation: ["applicant.presentAccommodation"],
  occupational: ["applicant.employmentType"],
  financial: [],
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

  review: [],
};

const DRAFT_KEY = "loan_app_draft_v5";
// localStorage.removeItem("loan_app_draft_v5");

// PERSON DEFAULTS (reused for applicant / co-applicant / guarantor)

const DEFAULT_VALUES = {
  loanTypeId: "",
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
  occupationalDetails: {
    occupationalCategory: undefined,
    occupationalCategoryOther: "",
    companyBusinessName: undefined,
    address: {
      addressLine1: undefined,
      addressLine2: "",
      city: "",
      district: "",
      state: "",
      pinCode: "",
      landmark: "",
      phoneNumber: "",
    },
    phoneNumber: "",
    extensionNumber: "",
    totalWorkExperience: null,
    noOfEmployees: null,
    commencementDate: undefined,
    professionalType: "",
    professionalSpecify: "",
    businessType: "",
    businessSpecify: "",
  },
  employmentDetails: {
    employerType: undefined,
    employerTypeOther: "",
    designation: "",
    department: undefined,
    dateOfJoining: undefined,
    dateOfRetirement: undefined,
  },
  financialDetails: {
    grossMonthlyIncome: null,
    netMonthlyIncome: null,
    averageMonthlyExpenses: null,
    savingBankBalance: null,
    valueOfImmovableProperty: null,
    currentBalanceInPF: null,
    valueOfSharesSecurities: null,
    fixedDeposits: null,
    otherAssets: null,
    totalAssets: null,
    creditSocietyLoan: null,
    employerLoan: null,
    homeLoan: null,
    pfLoan: null,
    vehicleLoan: null,
    personalLoan: null,
    otherLoan: null,
    totalLiabilities: null,
  },
  existingLoans: [
    {
      institutionName: "",
      purpose: "",
      disbursedAmount: "",
      emi: "",
      balanceTerm: "",
      balanceOutstanding: "",
    },
  ],
  creditCards: [
    {
      holderName: "",
      cardNo: "",
      cardHolderSince: "",
      issuingBank: "",
      creditLimit: "",
      outstandingAmount: "",
    },
  ],
  bankAccounts: [],
  insurancePolicies: [],
  properties: [
    {
      propertySelected: true,
      landType: "",
      landMark: "",
      landArea: "",
      ownershipType: "",
      loanType: "",
      loanTypeId: "",
      purchaseFrom: "",
      constructionStage: "",
      constructionPercent: "",
    },
  ],
  loanRequirement: {
    restFrequency: "",
    interestOption: "",
    tenure: "",
    loanAmount: "",
    loanPurpose: "",
    loanPurposeOther: "",
    repaymentMethod: "",
  },
  questionnaire: {
    legalPropertyClear: undefined,
    mortgagedElsewhere: undefined,
    residentOfIndia: undefined,
    otherLoans: undefined,
    guarantorAnywhere: undefined,
    mppLifeInsurance: undefined,
  },
};

// LAYOUT HELPERS

const SectionCard = React.memo(({ title, icon: Icon, children }) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 mb-6">
      <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-200">
        {Icon && <Icon size={18} className="text-slate-600 shrink-0" />}
        <h3 className="font-semibold text-sm text-slate-700 tracking-normal">
          {title}
        </h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
});

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

// Radio Group
const RadioGroup = React.memo(({ label }) => {
  return (
    <div>
      {label && (
        <p className="text-xs font-semibold text-slate-600 mb-2">{label}</p>
      )}
      {/* ...rest of RadioGroup rendering logic... */}
    </div>
  );
});

// PERSON EMPLOYMENT SECTION (reused)
const PersonEmploymentFields = ({ control, watch, prefix }) => {
  const employmentType = watch(`${prefix}.employmentType`);
  const professionalType = watch(`${prefix}.professionalType`);
  const businessType = watch(`${prefix}.businessType`);
  const salariedWorkingFor = watch(`${prefix}.salariedWorkingFor`);

  return (
    <div className="space-y-4">
      <Controller
        name={`${prefix}.employmentType`}
        control={control}
        render={({ field }) => (
          <SelectField
            label="Occupational Category"
            isRequired
            options={EMPLOYMENT_OPTIONS}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      {(employmentType === "SALARIED" ||
        employmentType === "BUSINESS" ||
        employmentType === "PROFESSIONAL" ||
        employmentType === "OTHER") && (
        <div className="p-4 bg-blue-50/40 rounded-xl border border-blue-100 space-y-4">
          <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            {employmentType === "SALARIED"
              ? "Company Details"
              : employmentType === "BUSINESS"
                ? "Business Details"
                : employmentType === "PROFESSIONAL"
                  ? "Professional Details"
                  : "Other Occupation Details"}
          </p>
          {/* Working For  */}
          {employmentType === "PROFESSIONAL" && (
            <>
              <Controller
                name={`${prefix}.professionalType`}
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Working for"
                    options={PROFESSIONAL_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {professionalType === "OTHER" && (
                <Controller
                  name={`${prefix}.professionalTypeOther`}
                  control={control}
                  render={({ field }) => (
                    <InputField label="Specify Other Profession" {...field} />
                  )}
                />
              )}
            </>
          )}
          {employmentType === "BUSINESS" && (
            <>
              <Controller
                name={`${prefix}.businessType`}
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Working for"
                    options={BUSINESS_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {businessType === "OTHER" && (
                <Controller
                  name={`${prefix}.businessTypeOther`}
                  control={control}
                  render={({ field }) => (
                    <InputField label="Specify Other Business" {...field} />
                  )}
                />
              )}
            </>
          )}
          {employmentType === "SALARIED" && (
            <>
              <Controller
                name={`${prefix}.salariedWorkingFor`}
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Working for"
                    options={SALARIED_WORKING_FOR}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {salariedWorkingFor === "OTHER" && (
                <Controller
                  name={`${prefix}.salariedWorkingForOther`}
                  control={control}
                  render={({ field }) => (
                    <InputField label="Specify Other Employer" {...field} />
                  )}
                />
              )}
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
                  name="applicant.dateOfJoining"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="Date of Joining"
                      type="date"
                      value={
                        field.value
                          ? new Date(field.value).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? new Date(e.target.value) : undefined,
                        )
                      }
                    />
                  )}
                />
                <Controller
                  name="applicant.dateOfRetirement"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="Date of Retirement"
                      type="date"
                      value={
                        field.value
                          ? new Date(field.value).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? new Date(e.target.value) : undefined,
                        )
                      }
                    />
                  )}
                />
              </Grid>
            </>
          )}
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
            {/* <Controller
              name={`${prefix}.commencementDate`}
              control={control}
              render={({ field }) => (
                <InputField
                  label="Date of Commencement of Business/Profession"
                  type="date"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || undefined)}
                />
              )}
            /> */}
          </Grid>
        </div>
      )}
    </div>
  );
};

// PERSON FINANCIAL SECTION (reused)
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

// SECTION: APPLICANT
const ApplicantSection = ({ control, errors, mode = "all" }) => (
  <div>
    {(mode === "personal" || mode === "all") && (
      <>
        {/* <LeadFetch setValue={setValue} showToast={showToast} /> */}
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
            <Grid cols={3}>
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
                name="applicant.gender"
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Gender"
                    isRequired
                    options={GENDER_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.applicant?.gender?.message}
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
            <Grid cols={2}>
              <Controller
                name="applicant.category"
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Category"
                    isRequired
                    options={CATEGORY_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.applicant?.category?.message}
                  />
                )}
              />
              <Controller
                name="applicant.maritalStatus"
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Marital Status"
                    isRequired
                    options={MARITAL_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.applicant?.maritalStatus?.message}
                  />
                )}
              />
            </Grid>

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

            <Grid cols={2}>
              <Controller
                name="applicant.correspondenceAddress"
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Correspondence Address"
                    options={CORRESPONDENCE_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.applicant?.correspondenceAddress?.message}
                  />
                )}
              />
              <Controller
                name="applicant.qualification"
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Qualification"
                    options={[
                      { value: "MATRIC", label: "Matriculation" },
                      { value: "INTERMEDIATE", label: "Intermediate" },
                      { value: "GRADUATE", label: "Graduate" },
                      { value: "POSTGRADUATE", label: "Post Graduate" },
                      { value: "DOCTORATE", label: "Doctorate" },
                      { value: "OTHER", label: "Other" },
                    ]}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.applicant?.qualification?.message}
                  />
                )}
              />
            </Grid>
          </div>
        </SectionCard>

        <SectionCard title="Contact Details" icon={Phone}>
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
                      field.onChange(
                        e.target.value.replace(/\D/g, "").slice(0, 10),
                      )
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
                      field.onChange(
                        e.target.value.replace(/\D/g, "").slice(0, 10),
                      )
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
            <Controller
              name="applicant.presentAccommodation"
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Accommodation Type"
                  isRequired
                  options={ACCOMMODATION_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors?.applicant?.presentAccommodation?.message}
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
            <Grid cols={2}>
              {/* Aadhaar Number (Required) */}
              <Controller
                name="applicant.aadhaarNumber"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Aadhaar Number"
                    isRequired
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value.replace(/\D/g, "").slice(0, 12),
                      )
                    }
                    error={errors.applicant?.aadhaarNumber?.message}
                    placeholder="Enter 12-digit Aadhaar Number"
                  />
                )}
              />
              {/* Voter ID (Optional) */}
              <Controller
                name="applicant.voterId"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Voter ID"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value
                          .replace(/[^a-zA-Z0-9]/g, "")
                          .slice(0, 15),
                      )
                    }
                    error={errors.applicant?.voterId?.message}
                    placeholder="Enter Voter ID "
                  />
                )}
              />
            </Grid>
          </div>
        </SectionCard>
      </>
    )}
  </div>
);

// // SECTION: ADDRESS (standalone applicant address)
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

// SECTION: CO-APPLICANTS
const CoApplicantSection = ({
  control,
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
            prefix={`coApplicants.${index}`}
            watch={watch}
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

// SECTION: GUARANTOR
const GuarantorSection = ({
  control,
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
            prefix={`guarantors.${index}`}
            watch={watch}
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

// SECTION: LOAN REQUIREMENT (Image 8)
const LoanRequirementSection = ({
  control,
  errors,
  watch,
  setValue,
  loanTypeOptions = [],
}) => {
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
  const loanPurpose = watch("loanRequirement.loanPurpose");
  return (
    <div>
      <SectionCard title="Loan Requirement Details" icon={IndianRupee}>
        <div className="space-y-4">
          <Controller
            name="loanRequirement.restFrequency"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Rest Frequency"
                options={REST_FREQ_OPTIONS}
                {...field}
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
                {...field}
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
                  type="number"
                  {...field}
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

          {/* <Controller
            name="loanRequirement.loanPurpose"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Purpose of Loan"
                isRequired
                options={LOAN_PURPOSE_OPTIONS}
                {...field}
              />
            )}
          /> */}

          <Controller
            name="loanRequirement.loanPurpose"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Purpose of Loan"
                isRequired
                options={LOAN_PURPOSE_OPTIONS}
                value={field.value || ""} // ✅ important
                onChange={(val) => field.onChange(val)} // ✅ important
              />
            )}
          />
          <Controller
            name="loanTypeId"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Loan Type"
                isRequired
                options={loanTypeOptions}
                value={field.value || ""}
                onChange={(val) => field.onChange(val)}
              />
            )}
          />

          {/* Conditional Field */}
          {loanPurpose === "OTHER" && (
            <Controller
              name="loanRequirement.loanPurposeOther"
              control={control}
              render={({ field }) => (
                <InputField label="Specify Other Purpose" {...field} />
              )}
            />
          )}

          <Controller
            name="loanRequirement.repaymentMethod"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Payment Method"
                isRequired
                options={[
                  { value: "SALARY_DEDUCTION", label: "Salary Deduction" },
                  { value: "CHEQUE", label: "Post Dated Cheque" },
                  {
                    value: "STANDING_INSTRUCTION",
                    label: "Standing Instruction",
                  },
                  { value: "ECS", label: "ECS" },
                  { value: "OTHER", label: "Other" },
                ]}
                {...field}
              />
            )}
          />
        </div>
      </SectionCard>

      {/* <SectionCard title="Cost Breakdown" icon={Landmark} accentColor="slate">
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
      </SectionCard> */}
    </div>
  );
};

// SECTION: ADDITIONAL INFO
const AdditionalSection = ({ control, watch, setValue }) => {
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
      key: "questionnaire.otherLoanOutstanding",
      label: "Do you have any other loan outstanding?",
    },
    {
      key: "questionnaire.appliedToMPPLEarlier",
      label: "Has/Have applicant(s) applied to MPPL earlier?",
    },

    {
      key: "questionnaire.interestedInInsurance",
      label: "Would you be interested in insuring yourself?",
    },
  ];
  const loans = watch("existingLoans");
  const cards = watch("creditCards");
  const banks = watch("bankAccounts");
  const policies = watch("insurancePolicies") ?? [];
  const properties = watch("properties");
  const refs = watch("references") ?? [];
  return (
    <div>
      {/* Loan Details */}
      <SectionCard title="Loan Details" icon={CreditCard} accentColor="slate">
        <p className="text-xs text-slate-400 mb-4">
          Applicable only if applicant/co-applicant has a loan outstanding
        </p>

        <div className="space-y-6">
          {loans.map((_, i) => (
            <div key={i} className="p-4 border border-slate-200 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name={`existingLoans.${i}.institutionName`}
                  control={control}
                  render={({ field }) => (
                    <InputField label="Name of Institution" {...field} />
                  )}
                />

                <Controller
                  name={`existingLoans.${i}.purpose`}
                  control={control}
                  render={({ field }) => (
                    <InputField label="Purpose for Loan" {...field} />
                  )}
                />

                <Controller
                  name={`existingLoans.${i}.disbursedAmount`}
                  control={control}
                  render={({ field }) => (
                    <InputField
                      type="number"
                      label="Disbursed Loan Amt (₹)"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />

                <Controller
                  name={`existingLoans.${i}.emi`}
                  control={control}
                  render={({ field }) => (
                    <InputField
                      type="number"
                      label="EMI (₹)"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />

                <Controller
                  name={`existingLoans.${i}.balanceTerm`}
                  control={control}
                  render={({ field }) => (
                    <InputField
                      type="number"
                      label="Balance Term"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />

                <Controller
                  name={`existingLoans.${i}.balanceOutstanding`}
                  control={control}
                  render={({ field }) => (
                    <InputField
                      type="number"
                      label="Balance Outstanding (₹)"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
              </div>

              {/* Remove */}
              {loans.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const updated = loans.filter((_, index) => index !== i);
                    setValue("existingLoans", updated);
                  }}
                  className="mt-3 text-xs text-red-500"
                >
                  Remove Loan
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add */}
        <button
          type="button"
          onClick={() => {
            setValue("existingLoans", [
              ...loans,
              {
                institutionName: "",
                purpose: "",
                disbursedAmount: "",
                emi: "",
                balanceTerm: "",
                balanceOutstanding: "",
              },
            ]);
          }}
          className="mt-4 px-3 py-2 text-sm bg-blue-600 rounded"
        >
          + Add Another Loan Details
        </button>
      </SectionCard>

      {/* Credit Card Details */}
      <SectionCard
        title="Credit Card Details"
        icon={CreditCard}
        accentColor="indigo"
      >
        <div className="space-y-6">
          {cards.map((_, i) => (
            <div key={i} className="p-4 border border-slate-200 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Holder Name */}
                <Controller
                  name={`creditCards.${i}.holderName`}
                  control={control}
                  render={({ field }) => (
                    <InputField label="Holder Name" {...field} />
                  )}
                />

                {/* Card Number */}
                <Controller
                  name={`creditCards.${i}.cardNo`}
                  control={control}
                  render={({ field }) => (
                    <InputField label="Credit Card No." {...field} />
                  )}
                />

                {/* Holder Since */}
                <Controller
                  name={`creditCards.${i}.cardHolderSince`}
                  control={control}
                  render={({ field }) => (
                    <InputField label="Card Holder Since" {...field} />
                  )}
                />

                {/* Issuing Bank */}
                <Controller
                  name={`creditCards.${i}.issuingBank`}
                  control={control}
                  render={({ field }) => (
                    <InputField label="Issuing Bank" {...field} />
                  )}
                />

                {/* Credit Limit */}
                <Controller
                  name={`creditCards.${i}.creditLimit`}
                  control={control}
                  render={({ field }) => (
                    <InputField
                      type="number"
                      label="Credit Limit (₹)"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />

                {/* Outstanding Amount */}
                <Controller
                  name={`creditCards.${i}.outstandingAmount`}
                  control={control}
                  render={({ field }) => (
                    <InputField
                      type="number"
                      label="Outstanding Amount (₹)"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
              </div>

              {/* Remove Button */}
              {cards.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const updated = cards.filter((_, index) => index !== i);
                    setValue("creditCards", updated);
                  }}
                  className="mt-3 text-xs text-red-500"
                >
                  Remove Card
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Button */}
        <button
          type="button"
          onClick={() => {
            setValue("creditCards", [
              ...cards,
              {
                holderName: "",
                cardNo: "",
                cardHolderSince: "",
                issuingBank: "",
                creditLimit: "",
                outstandingAmount: "",
              },
            ]);
          }}
          className="mt-4 px-3 py-2 text-sm bg-blue-600 rounded"
        >
          + Add Another Credit Card Details
        </button>
      </SectionCard>

      {/* Bank A/C Details */}
      <SectionCard title="Bank A/c Details" icon={Landmark} accentColor="teal">
        <div className="space-y-6">
          {(banks.length ? banks : [{}]).map((_, i) => (
            <div key={i} className="p-4 border border-slate-200 rounded-md ">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Holder Name */}
                <Controller
                  name={`bankAccounts.${i}.holderName`}
                  control={control}
                  render={({ field }) => (
                    <InputField label="Holder Name" {...field} />
                  )}
                />

                {/* Bank Name */}
                <Controller
                  name={`bankAccounts.${i}.bankName`}
                  control={control}
                  render={({ field }) => (
                    <InputField label="Bank Name" {...field} />
                  )}
                />

                {/* Branch Name */}
                <Controller
                  name={`bankAccounts.${i}.branchName`}
                  control={control}
                  render={({ field }) => (
                    <InputField label="Branch Name" {...field} />
                  )}
                />

                {/* Account Type */}
                <Controller
                  name={`bankAccounts.${i}.accountType`}
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="Account Type (SAVINGS/CURRENT)"
                      {...field}
                    />
                  )}
                />

                {/* Account Number */}
                <Controller
                  name={`bankAccounts.${i}.accountNumber`}
                  control={control}
                  render={({ field }) => (
                    <InputField label="Account Number" {...field} />
                  )}
                />

                {/* Opening Date */}
                <Controller
                  name={`bankAccounts.${i}.openingDate`}
                  control={control}
                  render={({ field }) => (
                    <InputField type="date" label="Opening Date" {...field} />
                  )}
                />

                {/* Balance */}
                <Controller
                  name={`bankAccounts.${i}.balanceAmount`}
                  control={control}
                  render={({ field }) => (
                    <InputField
                      type="number"
                      label="Balance Amount (₹)"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
              </div>

              {/* Remove Button */}
              {banks.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const updated = banks.filter((_, index) => index !== i);
                    setValue("bankAccounts", updated);
                  }}
                  className="mt-3 text-xs text-red-500"
                >
                  Remove Account
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Button */}
        <button
          type="button"
          onClick={() => {
            setValue("bankAccounts", [
              ...banks,
              {
                holderName: "",
                bankName: "",
                branchName: "",
                accountType: "",
                accountNumber: "",
                openingDate: "",
                balanceAmount: "",
              },
            ]);
          }}
          className="mt-4 px-3 py-2 text-sm bg-blue-600 rounded"
        >
          + Add Another Bank A/C Details
        </button>
      </SectionCard>

      {/* Insurance Details */}
      <SectionCard
        title="Insurance Details (Applicant & Co-Applicant)"
        icon={Shield}
        accentColor="violet"
      >
        <div className="space-y-6">
          {(policies.length ? policies : [{}]).map((_, i) => (
            <div key={i} className="p-4 border border-slate-200 rounded-md ">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Issued By */}
                <Controller
                  name={`insurancePolicies.${i}.issuedBy`}
                  control={control}
                  render={({ field }) => (
                    <InputField label="Issued By" {...field} />
                  )}
                />

                {/* Branch */}
                <Controller
                  name={`insurancePolicies.${i}.branchName`}
                  control={control}
                  render={({ field }) => (
                    <InputField label="Branch Name" {...field} />
                  )}
                />

                {/* Holder */}
                <Controller
                  name={`insurancePolicies.${i}.holderName`}
                  control={control}
                  render={({ field }) => (
                    <InputField label="Holder Name" {...field} />
                  )}
                />

                {/* Policy Number */}
                <Controller
                  name={`insurancePolicies.${i}.policyNumber`}
                  control={control}
                  render={({ field }) => (
                    <InputField label="Policy Number" {...field} />
                  )}
                />

                {/* Maturity Date */}
                <Controller
                  name={`insurancePolicies.${i}.maturityDate`}
                  control={control}
                  render={({ field }) => (
                    <InputField type="date" label="Maturity Date" {...field} />
                  )}
                />

                {/* Policy Value */}
                <Controller
                  name={`insurancePolicies.${i}.policyValue`}
                  control={control}
                  render={({ field }) => (
                    <InputField
                      type="number"
                      label="Policy Value (₹)"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />

                {/* Policy Type */}
                <Controller
                  name={`insurancePolicies.${i}.policyType`}
                  control={control}
                  render={({ field }) => (
                    <InputField label="Policy Type" {...field} />
                  )}
                />

                {/* Yearly Premium */}
                <Controller
                  name={`insurancePolicies.${i}.yearlyPremium`}
                  control={control}
                  render={({ field }) => (
                    <InputField
                      type="number"
                      label="Yearly Premium (₹)"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />

                {/* Paid Up Value */}
                <Controller
                  name={`insurancePolicies.${i}.paidUpValue`}
                  control={control}
                  render={({ field }) => (
                    <InputField
                      type="number"
                      label="Paid-up Value (₹)"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
              </div>

              {/* Remove Button */}
              {policies.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const updated = policies.filter((_, index) => index !== i);
                    setValue("insurancePolicies", updated);
                  }}
                  className="mt-3 text-xs text-red-500"
                >
                  Remove Policy
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Button */}
        <button
          type="button"
          onClick={() => {
            setValue("insurancePolicies", [
              ...policies,
              {
                issuedBy: "",
                branchName: "",
                holderName: "",
                policyNumber: "",
                maturityDate: "",
                policyValue: "",
                policyType: "",
                yearlyPremium: "",
                paidUpValue: "",
              },
            ]);
          }}
          className="mt-4 px-3 py-2 text-sm bg-blue-600 rounded "
        >
          + Add Another Policy Detais
        </button>
      </SectionCard>

      {/* Mortgage Property Details */}
      <SectionCard
        title="Mortgage Property Details"
        icon={Home}
        accentColor="violet"
      >
        <div className="space-y-6">
          {(properties.length ? properties : [{}]).map((_, i) => {
            return (
              <div
                key={i}
                className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm"
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-slate-700">
                      Property {i + 1}
                    </h3>

                    {properties.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = properties.filter(
                            (_, idx) => idx !== i,
                          );
                          setValue("properties", updated);
                        }}
                        className="text-xs text-red-500"
                      >
                        Remove Property
                      </button>
                    )}
                  </div>

                  {/* Property Selected */}
                  <Controller
                    name={`properties.${i}.propertySelected`}
                    control={control}
                    render={({ field }) => (
                      <InputField
                        label="Property Selected"
                        as="select"
                        value={field.value ? true : false} // ✅ convert boolean → UI
                        onChange={
                          (e) => field.onChange(e.target.value === true) // ✅ convert UI → boolean
                        }
                      >
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                      </InputField>
                    )}
                  />

                  {/* Landmark */}
                  <Controller
                    name={`properties.${i}.landMark`}
                    control={control}
                    render={({ field }) => (
                      <InputField label="Landmark" {...field} />
                    )}
                  />
                  <Controller
                    name={`properties.${i}.landArea`}
                    control={control}
                    render={({ field }) => (
                      <InputField
                        label="Land Area (Sq. mtr)"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : "",
                          )
                        }
                      />
                    )}
                  />

                  <Controller
                    name={`properties.${i}.ownershipType`}
                    control={control}
                    render={({ field }) => (
                      <InputField label="Ownership" as="select" {...field}>
                        <option value="">Select</option>
                        <option value="SOLE">Sole</option>
                        <option value="JOINT">Joint</option>
                      </InputField>
                    )}
                  />

                  <Controller
                    name={`properties.${i}.loanTypeId`}
                    control={control}
                    render={({ field }) => (
                      <InputField label="Loan Type" as="select" {...field}>
                        <option value="">Select</option>
                        <option value="FREEHOLD">Freehold</option>
                        <option value="LEASEHOLD">Leasehold</option>
                      </InputField>
                    )}
                  />
                  <Controller
                    name={`properties.${i}.landType`}
                    control={control}
                    render={({ field }) => (
                      <SelectField
                        label="Land Type"
                        options={LAND_TYPE_OPTIONS}
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {/* <Controller
                        name={`properties.${i}.landType`}
                        control={control}
                        render={({ field }) => (
                          <InputField label="Land Type" as="select" {...field}>
                            <option value="">Select</option>
                            <option value="RESIDENTIAL">Residential</option>
                            <option value="COMMERCIAL">Commercial</option>
                            <option value="AGRICULTURAL">Agricultural</option>
                          </InputField>
                        )}
                      /> */}
                  <Controller
                    name={`properties.${i}.purchaseFrom`}
                    control={control}
                    render={({ field }) => (
                      <InputField label="Purchased From" as="select" {...field}>
                        <option value="">Select</option>
                        <option value="BUILDER">Builder</option>
                        <option value="SOCIETY">Society</option>
                        <option value="DEVELOPMENT_AUTHORITY">
                          Development Authority
                        </option>
                        <option value="HOUSING_BOARD">Housing Board</option>
                        <option value="RESALE">Resale</option>
                        <option value="SELF_CONSTRUCTION">
                          Self Construction
                        </option>
                        <option value="OTHER">Other</option>
                      </InputField>
                    )}
                  />

                  <Controller
                    name={`properties.${i}.constructionStage`}
                    control={control}
                    render={({ field }) => (
                      <InputField
                        label="Construction Stage"
                        as="select"
                        {...field}
                      >
                        <option value="">Select</option>
                        <option value="READY">Ready</option>
                        <option value="UNDER_CONSTRUCTION">
                          Under Construction
                        </option>
                      </InputField>
                    )}
                  />

                  <Controller
                    name={`properties.${i}.constructionPercent`}
                    control={control}
                    render={({ field }) => (
                      <InputField
                        label="Stage of Construction (%)"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : "",
                          )
                        }
                      />
                    )}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Button */}
        <button
          type="button"
          onClick={() => {
            setValue("properties", [
              ...properties,
              {
                propertySelected: true,
                landMark: "",
                landArea: "",
                landType: "",
                loanTypeId: "",
                ownershipType: "",
                // loanType: "",
                purchaseFrom: "",
                constructionStage: "",
                constructionPercent: "",
              },
            ]);
          }}
          className="mt-4 px-3 py-2 text-sm bg-blue-600 rounded-md"
        >
          + Add Another Property Detalis
        </button>
      </SectionCard>

      {/* questionnaire / General Information */}
      <SectionCard title="General Information" icon={Info} accentColor="amber">
        <div className="space-y-4">
          {[
            {
              key: "questionnaire.legalPropertyClear",
              label: "Is the property legally clear?",
            },
            {
              key: "questionnaire.mortgagedElsewhere",
              label: "Is the property mortgaged elsewhere?",
            },
            {
              key: "questionnaire.residentOfIndia",
              label: "Are you a resident of India?",
            },
            {
              key: "questionnaire.otherLoans",
              label: "Do you have other loans?",
            },
            {
              key: "questionnaire.guarantorAnywhere",
              label: "Are you a guarantor anywhere?",
            },
            {
              key: "questionnaire.mppLifeInsurance",
              label: "Do you have MPPL life insurance?",
            },
          ].map((q) => (
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
                        className={`... ${field.value === v ? "bg-blue-50 border-blue-400 text-blue-700" : ""}`}
                      >
                        <input
                          type="radio"
                          className="sr-only"
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
        </div>
      </SectionCard>

      {/* References */}
      <SectionCard title="References" icon={UserCheck}>
        <div className="space-y-6">
          {(refs.length ? refs : [{}]).map((_, i) => (
            <div
              key={i}
              className="p-4 border border-slate-200 rounded-md bg-slate-50"
            >
              <div className="flex justify-between items-center mb-3">
                <p className="text-xs font-bold text-slate-500 uppercase">
                  Reference {i + 1}
                </p>
                {refs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const updated = refs.filter((_, idx) => idx !== i);
                      setValue("references", updated);
                    }}
                    className="text-xs text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
              <Grid>
                <Controller
                  name={`references.${i}.name`}
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="Name"
                      {...field}
                      value={field.value || ""}
                    />
                  )}
                />
                <Controller
                  name={`references.${i}.fatherName`}
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="Father's Name"
                      {...field}
                      value={field.value || ""}
                    />
                  )}
                />
                <Controller
                  name={`references.${i}.relationship`}
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="Relationship"
                      {...field}
                      value={field.value || ""}
                    />
                  )}
                />
              </Grid>
              <div className="mt-3 space-y-3">
                <Controller
                  name={`references.${i}.phone`}
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="Phone"
                      type="tel"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value.replace(/\D/g, "").slice(0, 10),
                        )
                      }
                    />
                  )}
                />
                <Controller
                  name={`references.${i}.email`}
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="Email"
                      type="email"
                      {...field}
                      value={field.value || ""}
                    />
                  )}
                />
                <Controller
                  name={`references.${i}.address`}
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="Address"
                      {...field}
                      value={field.value || ""}
                    />
                  )}
                />
                <Grid cols={3}>
                  <Controller
                    name={`references.${i}.city`}
                    control={control}
                    render={({ field }) => (
                      <InputField
                        label="City"
                        {...field}
                        value={field.value || ""}
                      />
                    )}
                  />
                  <Controller
                    name={`references.${i}.state`}
                    control={control}
                    render={({ field }) => (
                      <InputField
                        label="State"
                        {...field}
                        value={field.value || ""}
                      />
                    )}
                  />
                  <Controller
                    name={`references.${i}.pinCode`}
                    control={control}
                    render={({ field }) => (
                      <InputField
                        label="Pin Code"
                        {...field}
                        value={field.value || ""}
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
                  name={`references.${i}.occupation`}
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="Occupation"
                      {...field}
                      value={field.value || ""}
                    />
                  )}
                />
              </div>
            </div>
          ))}
        </div>
        {/* ADD BUTTON */}
        <button
          type="button"
          onClick={() => {
            setValue("references", [
              ...refs,
              {
                name: "",
                fatherName: "",
                relationship: "",
                phone: "",
                email: "",
                address: "",
                city: "",
                state: "",
                pinCode: "",
                occupation: "",
              },
            ]);
          }}
          className="mt-4 px-3 py-2 text-sm bg-blue-600 rounded"
        >
          + Add Another Reference
        </button>
      </SectionCard>
    </div>
  );
};

// SECTION: REVIEW & SUBMIT
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

// Review Section
const ReviewSection = ({ getValues, onSubmit, isSubmitting }) => {
  const [agreed, setAgreed] = useState(false);
  const data = getValues();
  const a = data.applicant || {};
  const addr = data.addresses?.currentAddress || {};
  const lr = data.loanRequirement || {};

  return (
    <div className="space-y-4">
      {/* Top Navbar for Steps */}
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
      {(data.existingLoans || []).length > 0 && (
        <ReviewBlock
          title="Existing Loans"
          icon={CreditCard}
          rows={data.existingLoans.map((l, i) => [
            `Loan ${i + 1}`,
            `${l.institutionName} - ₹${l.disbursedAmount}`,
          ])}
        />
      )}
      {(data.creditCards || []).length > 0 && (
        <ReviewBlock
          title="Credit Cards"
          icon={CreditCard}
          rows={data.creditCards.map((c, i) => [
            `Card ${i + 1}`,
            `${c.issuingBank} - Limit ₹${c.creditLimit}`,
          ])}
        />
      )}
      {(data.bankAccounts || []).length > 0 && (
        <ReviewBlock
          title="Bank Accounts"
          icon={Landmark}
          rows={data.bankAccounts.map((b, i) => [
            `Account ${i + 1}`,
            `${b.bankName} - ₹${b.balanceAmount}`,
          ])}
        />
      )}
      {(data.insurancePolicies || []).length > 0 && (
        <ReviewBlock
          title="Insurance Policies"
          icon={Shield}
          rows={data.insurancePolicies.map((p, i) => [
            `Policy ${i + 1}`,
            `${p.issuedBy} - ₹${p.policyValue}`,
          ])}
        />
      )}
      {(data.insurancePolicies || []).length > 0 && (
        <ReviewBlock
          title="Insurance Policies"
          icon={Shield}
          rows={data.insurancePolicies.map((p, i) => [
            `Policy ${i + 1}`,
            `${p.issuedBy} - ₹${p.policyValue}`,
          ])}
        />
      )}
      {(data.properties || []).length > 0 && (
        <ReviewBlock
          title="Properties"
          icon={Home}
          rows={data.properties.map((p, i) => [
            `Property ${i + 1}`,
            `${p.landArea} sqft - ${p.ownershipType}`,
          ])}
        />
      )}
      {(data.references || data.reference || []).length > 0 && (
        <ReviewBlock
          title="References"
          icon={UserCheck}
          rows={(data.references || data.reference).map((r, i) => [
            `Reference ${i + 1}`,
            `${r.name} - ${r.phoneNo || r.phone}`,
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

// SUCCESS SCREEN
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

// MAIN
export default function LoanApplicationForm({ onClose, onSuccess = () => {} }) {
  const [currentStep, setCurrentStep] = useState("applicant");
  const [completedSteps, setCompletedSteps] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Use a custom hook for loanTypeOptions
  const loanTypeOptions = useLoanTypes();

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

  useEffect(() => {
    const current = getValues("loanTypeId");
    if (!current) return;
    const isValid = loanTypeOptions.some((o) => o.value === current);
    if (!isValid) {
      setValue("loanTypeId", "");
    }
    // we intentionally re-check when options load/change
  }, [loanTypeOptions, getValues, setValue]);
  const normalizePayload = (data) => {
    const cleanArray = (arr) =>
      (arr || []).filter(
        (item) =>
          item &&
          Object.values(item).some(
            (v) => v !== "" && v !== null && v !== undefined,
          ),
      );

    const toNumber = (val) =>
      val === "" || val === null || val === undefined ? undefined : Number(val);

    // Utility to normalize boolean-like values
    const toBoolean = (val) => {
      if (typeof val === "boolean") return val;
      if (typeof val === "string") {
        if (val.toLowerCase() === "yes" || val === "true") return true;
        if (val.toLowerCase() === "no" || val === "false") return false;
      }
      return Boolean(val);
    };

    const mapEmploymentType = (type) => {
      switch (type) {
        case "salaried":
          return "SALARIED";
        case "business":
          return "BUSINESS";
        case "professional":
          return "PROFESSIONAL";
        default:
          return "OTHER";
      }
    };

    return {
      loanTypeId: data.loanTypeId,
      applicant: data.applicant,
      addresses: data.addresses,
      occupationalDetails: {
        occupationalCategory: mapEmploymentType(data.applicant?.employmentType),
      },
      employmentDetails: {
        ...data.employmentDetails,
        employerType: data.applicant?.salariedWorkingFor,
      },
      financialDetails: data.financialDetails,

      coApplicants: cleanArray(data.coApplicants),
      guarantors: cleanArray(data.guarantors),

      existingLoans: cleanArray(data.existingLoans),

      creditCards: cleanArray(data.creditCards).map((c) => ({
        holderName: c.holderName,
        lastFourDigits: c.cardNo ? c.cardNo.slice(-4) : "",
        issuingBank: c.issuingBank,
        holderSince: c.cardHolderSince,
        creditLimit: toNumber(c.creditLimit),
        outstandingAmount: toNumber(c.outstandingAmount),
      })),

      bankAccounts: cleanArray(data.bankAccounts),

      insurancePolicies: cleanArray(data.insurancePolicies),

      properties: cleanArray(data.properties).map((p) => ({
        propertySelected: toBoolean(p.propertySelected),
        landArea: toNumber(p.landArea),
        ownershipType: p.ownershipType,
        landType: p.landType,
        purchaseFrom: p.purchaseFrom,
        constructionStage: p.constructionStage,
        constructionPercent: toNumber(p.constructionPercent),
      })),

      loanRequirement: {
        loanAmount: toNumber(data.loanRequirement?.loanAmount),
        tenure: toNumber(data.loanRequirement?.tenure),
        interestOption: data.loanRequirement?.interestOption,
        loanPurpose: data.loanRequirement?.loanPurpose,
        loanPurposeOther: data.loanRequirement?.loanPurposeOther,
        repaymentMethod: data.loanRequirement?.repaymentMethod,
      },

      questionnaire: data.questionnaire,
    };
  };
  // Use the custom hook for loan application creation
  const { mutate: createLoanApplication } = useCreateLoanApplication({
    onSuccess: () => {
      showSuccess("Loan application created successfully!");
      reset(DEFAULT_VALUES);
      localStorage.removeItem(DRAFT_KEY);
      if (typeof onSuccess === "function") onSuccess();
      setSubmitted(true);
    },
    onError: () => {
      // Optionally log error details here if needed
    },
  });

  // Handler for form submit
  const submitToBackend = (data) => {
    setIsSubmitting(true);
    const payload = normalizePayload(data);
    // console.log("FINAL CLEAN PAYLOAD:", payload);
    createLoanApplication(payload, {
      onSettled: () => setIsSubmitting(false),
    });
  };

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
        if (values) {
          reset({
            ...DEFAULT_VALUES,
            ...values,
          });
        }
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
    if (type === "error") {
      showError(message);
      return;
    }
    if (type === "info" || type === "draft") {
      showInfo(message);
      return;
    }
    showSuccess(message);
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
      // Check which fields in STEP_FIELDS have errors
      const fieldErrors = fields.filter((fieldPath) => {
        // Navigate through nested object
        const keys = fieldPath.split(".");
        let error = errors;
        for (const key of keys) {
          error = error?.[key];
        }
        return error?.message !== undefined;
      });
      const errorCount = fieldErrors.length;
      const errorMsg =
        errorCount === 1
          ? `Please complete the required field: ${fieldErrors[0]}`
          : `Please complete ${errorCount} required fields: ${fieldErrors.join(", ")}`;
      showError(errorMsg);
      return;
    }
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }
    if (currentIdx < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIdx + 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep, completedSteps, currentIdx, trigger, errors]);

  const goPrev = useCallback(() => {
    if (currentIdx > 0) {
      setCurrentStep(STEPS[currentIdx - 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentIdx]);

  const onSubmit = handleSubmit(submitToBackend, (errs) => {
    console.log("FULL ERRORS:", JSON.stringify(errs, null, 2));
    showToast("Please complete all required fields", "error");
  });

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
            mode="personal"
          />
        );
      case "applicantContact":
        return (
          <ApplicantSection
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
            showToast={showToast}
            mode="contact"
          />
        );

      case "occupational":
        return (
          <SectionCard title="Occupational Details" icon={Briefcase}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 items-center">
                <Controller
                  name="applicant.employmentType"
                  control={control}
                  render={({ field }) => (
                    <SelectField
                      label="Occupational Category"
                      isRequired
                      options={[
                        { label: "Salaried", value: "SALARIED" },
                        { label: "Business", value: "BUSINESS" },
                        { label: "Professional", value: "PROFESSIONAL" },
                        { label: "Other", value: "OTHER" },
                      ]}
                      value={field.value}
                      onChange={(val) => {
                        field.onChange(val);
                        // Reset subcategory and specify fields when main category changes
                        setValue("applicant.professionalType", undefined);
                        setValue("applicant.professionalTypeOther", "");
                        setValue("applicant.businessType", undefined);
                        setValue("applicant.businessTypeOther", "");
                        setValue("applicant.salariedWorkingFor", undefined);
                        setValue("applicant.salariedTypeOther", "");
                      }}
                      error={errors?.applicant?.employmentType?.message}
                    />
                  )}
                />
                {/* Working For Dropdown (conditionally rendered) */}
                {watch("applicant.employmentType") === "SALARIED" && (
                  <div>
                    <Controller
                      name="applicant.salariedWorkingFor"
                      control={control}
                      render={({ field }) => (
                        <SelectField
                          label="Working For"
                          options={SALARIED_WORKING_FOR}
                          value={field.value}
                          onChange={(val) => {
                            field.onChange(val);
                            if (val !== "other")
                              setValue("applicant.salariedTypeOther", "");
                          }}
                          error={errors?.applicant?.salariedWorkingFor?.message}
                        />
                      )}
                    />
                    {/* {watch("applicant.salariedType") === "other" && (
                      <Controller
                        name="applicant.salariedTypeOther"
                        control={control}
                        render={({ field }) => (
                          <InputField
                            label="Please Specify Working For"
                            {...field}
                          />
                        )}
                      />
                    )} */}
                  </div>
                )}
              </div>
              {/* Conditional Professional Subcategory */}
              {watch("applicant.employmentType") === "professional" && (
                <>
                  <Controller
                    name="applicant.professionalType"
                    control={control}
                    render={({ field }) => (
                      <SelectField
                        label="Professional Type"
                        options={[
                          { label: "Doctor", value: "doctor" },
                          { label: "CA/ICWA/CS", value: "ca_icwa_cs" },
                          { label: "Architect", value: "architect" },
                          { label: "Other", value: "other" },
                        ]}
                        value={field.value}
                        onChange={(val) => {
                          field.onChange(val);
                          if (val !== "other")
                            setValue("applicant.professionalTypeOther", "");
                        }}
                        error={errors?.applicant?.professionalType?.message}
                      />
                    )}
                  />
                  {watch("applicant.professionalType") === "other" && (
                    <Controller
                      name="applicant.professionalTypeOther"
                      control={control}
                      render={({ field }) => (
                        <InputField
                          label="Please Specify Professional Type"
                          {...field}
                        />
                      )}
                    />
                  )}
                </>
              )}
              {/* Conditional Salaried Subcategory */}
              {watch("applicant.employmentType") === "SALARIED" && (
                <>
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div>
                      {watch("applicant.salariedType") === "other" && (
                        <Controller
                          name="applicant.salariedTypeOther"
                          control={control}
                          render={({ field }) => (
                            <InputField
                              label="Please Specify Working For"
                              {...field}
                            />
                          )}
                        />
                      )}
                    </div>
                  </div>
                  <Grid>
                    <Controller
                      name="applicant.salariedDesignation"
                      control={control}
                      render={({ field }) => (
                        <InputField label="Designation" {...field} />
                      )}
                    />
                    <Controller
                      name="applicant.salariedDepartment"
                      control={control}
                      render={({ field }) => (
                        <InputField label="Department" {...field} />
                      )}
                    />
                  </Grid>
                  <Grid>
                    <Controller
                      name="applicant.salariedDateOfJoining"
                      control={control}
                      render={({ field }) => (
                        <InputField
                          label="Date of Joining"
                          type="date"
                          value={
                            field.value
                              ? new Date(field.value)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? new Date(e.target.value)
                                : undefined,
                            )
                          }
                        />
                      )}
                    />
                    <Controller
                      name="applicant.salariedDateOfRetirement"
                      control={control}
                      render={({ field }) => (
                        <InputField
                          label="Date of Retirement"
                          type="date"
                          value={
                            field.value
                              ? new Date(field.value)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? new Date(e.target.value)
                                : undefined,
                            )
                          }
                        />
                      )}
                    />
                  </Grid>
                </>
              )}
              {/* Conditional Business Subcategory */}
              {watch("applicant.employmentType") === "business" && (
                <>
                  <Controller
                    name="applicant.businessType"
                    control={control}
                    render={({ field }) => (
                      <SelectField
                        label="Business Type"
                        options={[
                          { label: "Trader", value: "trader" },
                          { label: "Manufacturer", value: "manufacturer" },
                          { label: "Wholeseller", value: "wholeseller" },
                          { label: "Other", value: "other" },
                        ]}
                        value={field.value}
                        onChange={(val) => {
                          field.onChange(val);
                          if (val !== "other")
                            setValue("applicant.businessTypeOther", "");
                        }}
                        error={errors?.applicant?.businessType?.message}
                      />
                    )}
                  />
                  {watch("applicant.businessType") === "other" && (
                    <Controller
                      name="applicant.businessTypeOther"
                      control={control}
                      render={({ field }) => (
                        <InputField
                          label="Please Specify Business Type"
                          {...field}
                        />
                      )}
                    />
                  )}
                </>
              )}
              <Grid>
                <Controller
                  name="applicant.companyOrBusinessName"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="Company/Business Name"
                      isRequired
                      {...field}
                    />
                  )}
                />
                <Controller
                  name="applicant.occupationAddress"
                  control={control}
                  render={({ field }) => (
                    <InputField label="Address" isRequired {...field} />
                  )}
                />
              </Grid>
              <Grid>
                <Controller
                  name="applicant.occupationCity"
                  control={control}
                  render={({ field }) => (
                    <InputField label="City/Town" isRequired {...field} />
                  )}
                />
                <Controller
                  name="applicant.occupationDistrict"
                  control={control}
                  render={({ field }) => (
                    <InputField label="District" isRequired {...field} />
                  )}
                />
              </Grid>
              <Grid>
                <Controller
                  name="applicant.occupationState"
                  control={control}
                  render={({ field }) => (
                    <InputField label="State" isRequired {...field} />
                  )}
                />
                <Controller
                  name="applicant.occupationPincode"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="Pincode"
                      isRequired
                      type="number"
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid>
                <Controller
                  name="applicant.occupationLandmark"
                  control={control}
                  render={({ field }) => (
                    <InputField label="Landmark" {...field} />
                  )}
                />
                <Controller
                  name="applicant.occupationPhone"
                  control={control}
                  render={({ field }) => (
                    <InputField label="Phone No." type="tel" {...field} />
                  )}
                />
              </Grid>
              <Grid>
                <Controller
                  name="applicant.totalWorkExperience"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="Total Work Experience (years)"
                      type="number"
                      {...field}
                    />
                  )}
                />
                <Controller
                  name="applicant.noOfEmployees"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="No. of Employees"
                      type="number"
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Controller
                name="applicant.dateOfCommencement"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Date of Commencement of Business/Profession"
                    type="date"
                    value={
                      field.value
                        ? new Date(field.value).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? new Date(e.target.value) : undefined,
                      )
                    }
                  />
                )}
              />
            </div>
          </SectionCard>
        );

      case "address":
        return (
          <AddressSection
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />
        );
      case "financial":
        return (
          <SectionCard title="Financial Status — Income" icon={IndianRupee}>
            <PersonFinancialFields
              control={control}
              watch={watch}
              setValue={setValue}
              prefix="applicant"
            />
          </SectionCard>
        );
      case "loanType":
        return <LoanTypeSection control={control} errors={errors} />;

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
            showToast={showToast}
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
            showToast={showToast}
          />
        );
      case "loanReq":
        return (
          <LoanRequirementSection
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
            loanTypeOptions={loanTypeOptions}
            showToast={showToast}
          />
        );
      case "additional":
        return (
          <AdditionalSection
            control={control}
            watch={watch}
            setValue={setValue}
            showToast={showToast}
          />
        );

      case "review":
        return (
          <ReviewSection
            getValues={getValues}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            setCurrentStep={setCurrentStep}
            currentStep={currentStep}
            showToast={showToast}
          />
        );
      default:
        return null;
    }
  };
  // Get steps except the review step
  const steps = (typeof STEPS !== "undefined" ? STEPS : window.STEPS).filter(
    (s) => s.id !== "review",
  );
  return (
    <div className="fixed inset-0 pt-16 lg:pl-64 bg-linear-to-br from-slate-50 via-blue-50/20 to-slate-100 overflow-y-auto">
      {/* Top Navbar for Steps */}
      <nav className="flex flex-wrap gap-2 justify-center mt-6">
        {steps.map((step, idx) => (
          <button
            key={step.id}
            type="button"
            className={`px-3 py-2 rounded-2xl border text-sm font-semibold transition-all duration-150 flex items-center gap-1
              ${currentStep === step.id ? "bg-blue-600 text-white border-blue-700 shadow" : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"}`}
            onClick={() => setCurrentStep && setCurrentStep(step.id)}
          >
            {step.icon && (
              <span className="mr-1">
                <step.icon size={14} />
              </span>
            )}
            <span>{step.shortLabel || step.label}</span>
            <span className="text-[10px] text-blue-400">{idx + 1}</span>
          </button>
        ))}
      </nav>
      ;
      <main className="max-w-5xl mx-auto px-6 py-3">
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
    </div>
  );
}
