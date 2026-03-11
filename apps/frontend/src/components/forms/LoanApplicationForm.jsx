import { useState, useEffect, useCallback } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronRight, ChevronLeft, Save, Send, Check,
  User, MapPin, Users, IndianRupee, FileText, Eye,
  Plus, Trash2, Shield, Landmark, CreditCard, Home,
  Briefcase, Phone, ClipboardList, BadgeCheck, Info,
  Loader2, AlertCircle, UserCheck, X, Search
} from "lucide-react";

import Button from "../ui/Button";
import InputField from "../ui/InputField";
import TextAreaField from "../ui/TextAreaField";
import SelectField from "../ui/SelectField";
import createLoanApplicationSchema from "../../validations/LoanApplicationValidation";
import { leadDummyData, loanTypeDummyData } from "../../lib/LoanApplicationDummyData";

// ─────────────────────────────────────────────
// OPTION CONSTANTS
// ─────────────────────────────────────────────
const TITLE_OPTIONS = [
  { value: "MR", label: "Mr." }, { value: "MRS", label: "Mrs." },
  { value: "MS", label: "Ms." }, { value: "DR", label: "Dr." },
  { value: "PROF", label: "Prof." },
];
const GENDER_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];
const MARITAL_OPTIONS = [
  { value: "SINGLE", label: "Single" }, { value: "MARRIED", label: "Married" },
  { value: "DIVORCED", label: "Divorced" }, { value: "WIDOWED", label: "Widowed" },
  { value: "OTHER", label: "Other" },
];
const CATEGORY_OPTIONS = [
  { value: "GENERAL", label: "General" }, { value: "SC", label: "SC" },
  { value: "ST", label: "ST" }, { value: "NT", label: "NT" },
  { value: "OBC", label: "OBC" }, { value: "OTHER", label: "Other" },
];
const EMPLOYMENT_OPTIONS = [
  { value: "salaried", label: "Salaried" },
  { value: "self_employed", label: "Self Employed" },
  { value: "business", label: "Business" },
  { value: "professional", label: "Professional" },
];
const LOAN_TYPE_OPTIONS = loanTypeDummyData.map((loan) => ({
  value: loan.code,
  label: loan.name,
}));
const INTEREST_OPTIONS = [
  { value: "FIXED", label: "Fixed" },
  { value: "VARIABLE", label: "Variable" },
];
const REPAYMENT_OPTIONS = [
  { value: "SALARY_DEDUCTION", label: "Salary Deduction" },
  { value: "ECS", label: "ECS" },
  { value: "CHEQUE", label: "Post Dated Cheque" },
];
const RELATION_OPTIONS = [
  { value: "spouse", label: "Spouse" }, { value: "parent", label: "Parent" },
  { value: "child", label: "Child" }, { value: "sibling", label: "Sibling" },
  { value: "other", label: "Other" },
];
const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh","Puducherry",
].map(s => ({ value: s, label: s }));

// ─────────────────────────────────────────────
// STEPS CONFIG  ← NEW ORDER: Applicant first
// ─────────────────────────────────────────────
const STEPS = [
  { id: "applicant",   label: "Applicant Details", shortLabel: "Applicant", icon: User          },
  { id: "loanType",    label: "Loan Type",          shortLabel: "Loan",      icon: ClipboardList },
  { id: "address",     label: "Address",            shortLabel: "Address",   icon: MapPin        },
  { id: "coApplicant", label: "Co-Applicants",      shortLabel: "Co-App",    icon: Users         },
  { id: "guarantor",   label: "Guarantor",          shortLabel: "Guarantor", icon: Shield        },
  { id: "loanReq",     label: "Loan Requirement",   shortLabel: "Loan Req.", icon: IndianRupee   },
  { id: "additional",  label: "Additional Info",    shortLabel: "Additional",icon: FileText      },
  { id: "review",      label: "Review & Submit",    shortLabel: "Review",    icon: Eye           },
];

// Per-step fields for targeted Zod trigger — Applicant is now step 0
const STEP_FIELDS = {
  applicant:   [
    "applicant.title","applicant.firstName","applicant.lastName",
    "applicant.fatherName","applicant.motherName","applicant.dob",
    "applicant.gender","applicant.maritalStatus","applicant.nationality",
    "applicant.category","applicant.contactNumber",
    "applicant.panNumber","applicant.aadhaarNumber","applicant.employmentType",
  ],
  loanType:    [
    "loanTypeId","loanRequirement.interestOption",
    "loanRequirement.tenure","loanRequirement.repaymentMethod",
  ],
  address:     [
    "addresses.currentAddress.addressLine1","addresses.currentAddress.city",
    "addresses.currentAddress.district","addresses.currentAddress.state",
    "addresses.currentAddress.pinCode",
  ],
  coApplicant: [],
  guarantor:   [],
  loanReq:     [
    "loanRequirement.loanAmount","loanRequirement.tenure",
    "loanRequirement.interestOption","loanRequirement.loanPurpose",
    "loanRequirement.repaymentMethod",
  ],
  additional:  [],
  review:      [],
};

const DRAFT_KEY = "loan_app_draft_v3";

const DEFAULT_VALUES = {
  leadNumber: "",
  loanTypeId: "",
  sameAsCurrent: false,
  propertySelected: "No",
  applicant: {
    title: undefined, firstName: "", middleName: "", lastName: "",
    fatherName: "", motherName: "", woname: "",
    dob: "", gender: undefined, maritalStatus: undefined,
    nationality: "Indian", category: undefined,
    aadhaarNumber: "", panNumber: "", voterId: "",
    drivingLicenceNo: "", passportNumber: "",
    contactNumber: "", alternateNumber: "", email: "",
    qualification: "", employmentType: undefined,
    companyName: "", designation: "", department: "",
    dateOfJoining: "", dateOfRetirement: "",
    workExperience: "", noOfEmployees: "", commencementDate: "",
    grossMonthlyIncome: 0, netMonthlyIncome: 0, monthlyExpenses: 0,
  },
  addresses: {
    currentAddress:   { addressLine1: "", addressLine2: "", city: "", district: "", state: "", pinCode: "", landmark: "", phoneNumber: "" },
    permanentAddress: { addressLine1: "", addressLine2: "", city: "", district: "", state: "", pinCode: "", landmark: "", phoneNumber: "" },
  },
  coApplicants: [],
  guarantors:   [],
  loanRequirement: { loanAmount: 0, tenure: 0, interestOption: undefined, loanPurpose: undefined, repaymentMethod: undefined },
  costs:    { landCost: 0, agreementValue: 0, stampDuty: 0, constructionCost: 0 },
  property: { address: "", city: "", state: "", pinCode: "", landArea: "" },
  questionnaire: {
    legalPropertyClear: undefined, mortgagedElsewhere: undefined,
    residentOfIndia: undefined, otherLoans: undefined,
    guarantorAnywhere: undefined, mppLifeInsurance: undefined,
  },
  references:    [
    { name: "", fatherName: "", phone: "", occupation: "" },
    { name: "", fatherName: "", phone: "", occupation: "" },
  ],
  existingLoans: [
    { institution: "", emi: 0, balanceOutstanding: 0 },
    { institution: "", emi: 0, balanceOutstanding: 0 },
    { institution: "", emi: 0, balanceOutstanding: 0 },
  ],
};

// ─────────────────────────────────────────────
// LAYOUT HELPERS
// ─────────────────────────────────────────────
const SectionCard = ({ title, icon: Icon, children, accentColor = "blue" }) => {
  const gradients = {
    blue:   "from-blue-600 to-blue-700",
    indigo: "from-indigo-600 to-indigo-700",
    slate:  "from-slate-600 to-slate-700",
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-visible mb-6">
      <div className={`flex items-center gap-3 px-6 py-4 bg-gradient-to-r ${gradients[accentColor] || gradients.blue}`}>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <Icon size={16} className="text-white" />
          </div>
        )}
        <h3 className="font-bold text-base text-white tracking-wide">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};

const Grid = ({ cols = 2, children }) => (
  <div className={`grid grid-cols-1 gap-4 ${
    cols === 2 ? "sm:grid-cols-2" :
    cols === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : ""
  }`}>
    {children}
  </div>
);

const Divider = ({ label }) => (
  <div className="flex items-center gap-3 my-5">
    <div className="flex-1 h-px bg-slate-100" />
    {label && (
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
        {label}
      </span>
    )}
    <div className="flex-1 h-px bg-slate-100" />
  </div>
);

const Toast = ({ message, type, onClose }) => {
  const styles = {
    success: { bg: "bg-emerald-600", icon: <BadgeCheck size={16} /> },
    draft:   { bg: "bg-amber-500",   icon: <Save size={16} /> },
    error:   { bg: "bg-red-500",     icon: <AlertCircle size={16} /> },
    info:    { bg: "bg-blue-600",    icon: <Info size={16} /> },
  };
  const s = styles[type] || styles.info;
  return (
    <div className={`fixed bottom-6 right-6 z-[99] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-white text-sm font-semibold animate-in slide-in-from-bottom-4 ${s.bg}`}>
      {s.icon}
      <span>{message}</span>
      <button onClick={onClose} className="ml-1 opacity-75 hover:opacity-100 transition-opacity">
        <X size={14} />
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────
// LEAD NUMBER FETCH BANNER
// ─────────────────────────────────────────────
const LeadFetch = ({ setValue, showToast }) => {

  const [leadNumber, setLeadNumber] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [fetchStatus, setFetchStatus] = useState(null);

  const handleFetch = () => {

    const trimmed = leadNumber.trim();

    if (!trimmed) return;

    if (!/^[a-zA-Z0-9]+$/.test(trimmed)) {
      showToast("Lead number must be alphanumeric", "error");
      return;
    }

    setIsFetching(true);
    setFetchStatus(null);

    setTimeout(() => {

      const data = leadDummyData.find(
        (lead) => lead.leadNumber.toUpperCase() === trimmed.toUpperCase()
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
          className="!py-2 !px-4"
        >
          {isFetching
            ? <Loader2 size={14} className="animate-spin"/>
            : <Search size={14}/>
          }
          Fetch
        </Button>

      </div>

      {fetchStatus === "success" && (
        <p className="text-green-600 text-xs mt-2">
          Lead data loaded successfully
        </p>
      )}

      {fetchStatus === "error" && (
        <p className="text-red-600 text-xs mt-2">
          Lead not found
        </p>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// STEPPER
// ─────────────────────────────────────────────
const Stepper = ({ currentStep, completedSteps, onStepClick }) => {
  const currentIdx = STEPS.findIndex(s => s.id === currentStep);
  const progress   = ((currentIdx + 1) / STEPS.length) * 100;

  return (
    <div className="w-full bg-white border-b border-slate-100 shadow-sm sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4">
        {/* Progress bar */}
        <div className="h-1 bg-slate-100 mt-3 rounded-full overflow-visible">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Steps */}
        <div className="flex items-center overflow-x-auto py-3 gap-1 scrollbar-hide">
          {STEPS.map((step, i) => {
            const Icon    = step.icon;
            const isActive = step.id === currentStep;
            const isDone   = completedSteps.includes(step.id);
            const isPast   = i < currentIdx;
            const clickable = isDone || isPast || i === currentIdx;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => clickable && onStepClick(step.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0
                  ${isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                    : isDone
                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer"
                    : isPast
                    ? "bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
                    : "text-slate-300 cursor-default"
                  }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all
                  ${isActive ? "bg-white/20" : isDone ? "bg-emerald-100" : "bg-slate-200"}`}>
                  {isDone
                    ? <Check size={10} strokeWidth={3} className="text-emerald-600" />
                    : <Icon size={10} className={isActive ? "text-white" : ""} />
                  }
                </span>
                <span className="hidden sm:inline">{step.label}</span>
                <span className="sm:hidden">{step.shortLabel}</span>
                {i < STEPS.length - 1 && (
                  <ChevronRight size={11} className="ml-0.5 hidden sm:block opacity-40" />
                )}
              </button>
            );
          })}
        </div>

        <p className="text-xs text-slate-400 pb-2 px-1">
          Step {currentIdx + 1} of {STEPS.length} —{" "}
          <span className="font-semibold text-blue-600">{STEPS[currentIdx]?.label}</span>
        </p>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// SECTION: APPLICANT DETAILS  (now step 1)
// ─────────────────────────────────────────────
const ApplicantSection = ({ control, errors, watch, setValue, showToast }) => {
  const employmentType = watch("applicant.employmentType");

  return (
    <div>
      {/* ── Lead Auto-Fill Banner ── */}
      <LeadFetch setValue={setValue} showToast={showToast} />

      {/* ── Personal Information ── */}
      <SectionCard title="Personal Information" icon={User}>
        <div className="space-y-4">
          <Grid cols={3}>
            <Controller name="applicant.title" control={control} render={({ field }) => (
              <SelectField label="Title" isRequired options={TITLE_OPTIONS}
                value={field.value} onChange={field.onChange}
                error={errors.applicant?.title?.message} />
            )} />
            <Controller name="applicant.firstName" control={control} render={({ field }) => (
              <InputField label="First Name" placeholder="Rahul" isRequired
                {...field} error={errors.applicant?.firstName?.message} />
            )} />
            <Controller name="applicant.middleName" control={control} render={({ field }) => (
              <InputField label="Middle Name" placeholder="Kumar" {...field} />
            )} />
          </Grid>
          <Grid cols={3}>
            <Controller name="applicant.lastName" control={control} render={({ field }) => (
              <InputField label="Last Name" placeholder="Sharma" isRequired
                {...field} error={errors.applicant?.lastName?.message} />
            )} />
            <Controller name="applicant.fatherName" control={control} render={({ field }) => (
              <InputField label="Father's Name" isRequired
                {...field} error={errors.applicant?.fatherName?.message} />
            )} />
            <Controller name="applicant.motherName" control={control} render={({ field }) => (
              <InputField label="Mother's Name" isRequired
                {...field} error={errors.applicant?.motherName?.message} />
            )} />
          </Grid>
          <Grid>
            <Controller name="applicant.woname" control={control} render={({ field }) => (
              <InputField label="W/O (Wife / Ward of)" placeholder="Optional" {...field} />
            )} />
            <Controller name="applicant.dob" control={control} render={({ field }) => (
              <InputField label="Date of Birth" type="date" isRequired
                {...field} error={errors.applicant?.dob?.message} />
            )} />
          </Grid>
          <Grid>
            <Controller name="applicant.gender" control={control} render={({ field }) => (
              <SelectField label="Gender" isRequired options={GENDER_OPTIONS}
                value={field.value} onChange={field.onChange}
                error={errors.applicant?.gender?.message} />
            )} />
            <Controller name="applicant.maritalStatus" control={control} render={({ field }) => (
              <SelectField label="Marital Status" isRequired options={MARITAL_OPTIONS}
                value={field.value} onChange={field.onChange}
                error={errors.applicant?.maritalStatus?.message} />
            )} />
          </Grid>
          <Grid>
            <Controller name="applicant.category" control={control} render={({ field }) => (
              <SelectField label="Category" isRequired options={CATEGORY_OPTIONS}
                value={field.value} onChange={field.onChange}
                error={errors.applicant?.category?.message} />
            )} />
            <Controller name="applicant.nationality" control={control} render={({ field }) => (
              <InputField label="Nationality" placeholder="Indian" isRequired
                {...field} error={errors.applicant?.nationality?.message} />
            )} />
          </Grid>
          <Controller name="applicant.qualification" control={control} render={({ field }) => (
            <InputField label="Qualification" placeholder="B.Tech, MBA, Graduate…" {...field} />
          )} />
        </div>
      </SectionCard>

      {/* ── Contact & Identity ── */}
      <SectionCard title="Contact & Identity" icon={Phone}>
        <div className="space-y-4">
          <Grid>
            <Controller name="applicant.contactNumber" control={control} render={({ field }) => (
              <InputField label="Mobile Number" type="tel" placeholder="9876543210" isRequired
                icon={Phone} hint="10-digit Indian mobile"
                {...field}
                onChange={e => field.onChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
                error={errors.applicant?.contactNumber?.message} />
            )} />
            <Controller name="applicant.alternateNumber" control={control} render={({ field }) => (
              <InputField label="Alternate Number" type="tel" placeholder="Optional" icon={Phone}
                {...field}
                onChange={e => field.onChange(e.target.value.replace(/\D/g, "").slice(0, 10))} />
            )} />
          </Grid>
          <Controller name="applicant.email" control={control} render={({ field }) => (
            <InputField label="Email Address" type="email" placeholder="name@email.com"
              {...field} error={errors.applicant?.email?.message} />
          )} />

          <Divider label="Identity Documents" />

          <Grid>
            <Controller name="applicant.panNumber" control={control} render={({ field }) => (
              <InputField label="PAN Number" placeholder="ABCDE1234F" isRequired hint="10-char PAN"
                {...field}
                onChange={e => field.onChange(e.target.value.toUpperCase().slice(0, 10))}
                error={errors.applicant?.panNumber?.message} />
            )} />
            <Controller name="applicant.aadhaarNumber" control={control} render={({ field }) => (
              <InputField label="Aadhaar Number" placeholder="XXXXXXXXXXXX" isRequired hint="12 digits"
                {...field}
                onChange={e => field.onChange(e.target.value.replace(/\D/g, "").slice(0, 12))}
                error={errors.applicant?.aadhaarNumber?.message} />
            )} />
          </Grid>
          <Grid>
            <Controller name="applicant.voterId" control={control} render={({ field }) => (
              <InputField label="Voter ID" placeholder="Optional" {...field} />
            )} />
            <Controller name="applicant.passportNumber" control={control} render={({ field }) => (
              <InputField label="Passport No." placeholder="Optional" {...field} />
            )} />
          </Grid>
          <Controller name="applicant.drivingLicenceNo" control={control} render={({ field }) => (
            <InputField label="Driving Licence No." placeholder="Optional" {...field} />
          )} />
        </div>
      </SectionCard>

      {/* ── Employment Details ── */}
      <SectionCard title="Employment Details" icon={Briefcase}>
        <div className="space-y-4">
          <Controller name="applicant.employmentType" control={control} render={({ field }) => (
            <SelectField label="Employment Type" isRequired options={EMPLOYMENT_OPTIONS}
              value={field.value} onChange={field.onChange}
              error={errors.applicant?.employmentType?.message} />
          )} />

          {/* Salaried fields */}
          {employmentType === "salaried" && (
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 space-y-4">
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Salaried Details</p>
              <Grid>
                <Controller name="applicant.companyName" control={control} render={({ field }) => (
                  <InputField label="Company Name" {...field} />
                )} />
                <Controller name="applicant.designation" control={control} render={({ field }) => (
                  <InputField label="Designation" {...field} />
                )} />
              </Grid>
              <Grid>
                <Controller name="applicant.department" control={control} render={({ field }) => (
                  <InputField label="Department" {...field} />
                )} />
                <Controller name="applicant.dateOfJoining" control={control} render={({ field }) => (
                  <InputField label="Date of Joining" type="date" {...field} />
                )} />
              </Grid>
              <Controller name="applicant.dateOfRetirement" control={control} render={({ field }) => (
                <InputField label="Date of Retirement" type="date" {...field} />
              )} />
            </div>
          )}

          {/* Business / Professional / Self-Employed fields */}
          {(employmentType === "business" || employmentType === "professional" || employmentType === "self_employed") && (
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100 space-y-4">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Business / Professional Details</p>
              <Grid>
                <Controller name="applicant.companyName" control={control} render={({ field }) => (
                  <InputField label="Business / Company Name" {...field} />
                )} />
                <Controller name="applicant.workExperience" control={control} render={({ field }) => (
                  <InputField label="Total Work Experience" placeholder="5 years" {...field} />
                )} />
              </Grid>
              <Grid>
                <Controller name="applicant.noOfEmployees" control={control} render={({ field }) => (
                  <InputField label="No. of Employees" type="number" {...field} />
                )} />
                <Controller name="applicant.commencementDate" control={control} render={({ field }) => (
                  <InputField label="Date of Commencement" type="date" {...field} />
                )} />
              </Grid>
            </div>
          )}

          <Divider label="Income Details" />
          <Grid>
            <Controller name="applicant.grossMonthlyIncome" control={control} render={({ field }) => (
              <InputField label="Gross Monthly Income (₹)" type="number" placeholder="50000"
                {...field} onChange={e => field.onChange(Number(e.target.value))} />
            )} />
            <Controller name="applicant.netMonthlyIncome" control={control} render={({ field }) => (
              <InputField label="Net Monthly Income (₹)" type="number" placeholder="42000"
                {...field} onChange={e => field.onChange(Number(e.target.value))} />
            )} />
          </Grid>
          <Controller name="applicant.monthlyExpenses" control={control} render={({ field }) => (
            <InputField label="Average Monthly Expenses (₹)" type="number" placeholder="20000"
              {...field} onChange={e => field.onChange(Number(e.target.value))} />
          )} />
        </div>
      </SectionCard>
    </div>
  );
};

// ─────────────────────────────────────────────
// SECTION: LOAN TYPE  (now step 2)
// ─────────────────────────────────────────────
const LoanTypeSection = ({ control, errors }) => (
  <SectionCard title="Loan Details" icon={ClipboardList}>
    <div className="space-y-5">
      <Grid>
        <Controller name="loanTypeId" control={control} render={({ field }) => (
          <SelectField label="Loan Type" isRequired options={LOAN_TYPE_OPTIONS}
            value={field.value} onChange={field.onChange}
            error={errors.loanTypeId?.message} />
        )} />
        <Controller name="loanRequirement.interestOption" control={control} render={({ field }) => (
          <SelectField label="Interest Option" isRequired options={INTEREST_OPTIONS}
            value={field.value} onChange={field.onChange}
            error={errors.loanRequirement?.interestOption?.message} />
        )} />
      </Grid>
      <Grid>
        <Controller name="loanRequirement.repaymentMethod" control={control} render={({ field }) => (
          <SelectField label="Repayment Method" isRequired options={REPAYMENT_OPTIONS}
            value={field.value} onChange={field.onChange}
            error={errors.loanRequirement?.repaymentMethod?.message} />
        )} />
        <Controller name="loanRequirement.tenure" control={control} render={({ field }) => (
          <InputField label="Tenure (Months)" type="number" placeholder="e.g. 120" isRequired
            value={field.value}
            onChange={e => field.onChange(Number(e.target.value))}
            error={errors.loanRequirement?.tenure?.message} />
        )} />
      </Grid>
    </div>
  </SectionCard>
);

// ─────────────────────────────────────────────
// SECTION: ADDRESS
// ─────────────────────────────────────────────
const AddressSection = ({ control, errors, watch, setValue }) => {
  const sameAddress = watch("sameAsCurrent");

  const copyCurrent = useCallback(() => {
    [
      "addressLine1","addressLine2","city","district",
      "state","pinCode","landmark","phoneNumber",
    ].forEach(f => {
      setValue(
        `addresses.permanentAddress.${f}`,
        watch(`addresses.currentAddress.${f}`) || ""
      );
    });
  }, [watch, setValue]);

  return (
    <div>
      <SectionCard title="Current Residential Address" icon={Home}>
        <div className="space-y-4">
          <Controller name="addresses.currentAddress.addressLine1" control={control} render={({ field }) => (
            <InputField label="Address Line 1" placeholder="House No., Street, Area" isRequired
              {...field} error={errors.addresses?.currentAddress?.addressLine1?.message} />
          )} />
          <Controller name="addresses.currentAddress.addressLine2" control={control} render={({ field }) => (
            <InputField label="Address Line 2" placeholder="Near landmark, Colony…" {...field} />
          )} />
          <Grid>
            <Controller name="addresses.currentAddress.city" control={control} render={({ field }) => (
              <InputField label="City / Town" isRequired
                {...field} error={errors.addresses?.currentAddress?.city?.message} />
            )} />
            <Controller name="addresses.currentAddress.district" control={control} render={({ field }) => (
              <InputField label="District" isRequired
                {...field} error={errors.addresses?.currentAddress?.district?.message} />
            )} />
          </Grid>
          <Grid>
            <Controller name="addresses.currentAddress.state" control={control} render={({ field }) => (
              <SelectField label="State" isRequired isSearchable options={INDIAN_STATES}
                value={field.value} onChange={field.onChange}
                error={errors.addresses?.currentAddress?.state?.message} />
            )} />
            <Controller name="addresses.currentAddress.pinCode" control={control} render={({ field }) => (
              <InputField label="Pin Code" placeholder="302001" isRequired
                {...field}
                onChange={e => field.onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
                error={errors.addresses?.currentAddress?.pinCode?.message} />
            )} />
          </Grid>
          <Grid>
            <Controller name="addresses.currentAddress.landmark" control={control} render={({ field }) => (
              <InputField label="Land Mark" placeholder="Near…" {...field} />
            )} />
            <Controller name="addresses.currentAddress.phoneNumber" control={control} render={({ field }) => (
              <InputField label="Phone No. (With STD Code)" placeholder="0141-2345678" {...field} />
            )} />
          </Grid>
        </div>
      </SectionCard>

      {/* Same address toggle */}
      <div className="flex items-center gap-3 px-5 py-3.5 bg-blue-50 rounded-2xl border border-blue-100 mb-6 cursor-pointer"
        onClick={() => {
          const next = !sameAddress;
          setValue("sameAsCurrent", next);
          if (next) copyCurrent();
        }}>
        <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all flex-shrink-0
          ${sameAddress ? "bg-blue-600 border-blue-600" : "border-slate-300 bg-white"}`}>
          {sameAddress && <Check size={11} strokeWidth={3} className="text-white" />}
        </div>
        <label className="text-sm font-semibold text-blue-700 cursor-pointer select-none flex-1">
          Permanent address same as current address
        </label>
      </div>

      <SectionCard title="Permanent Address" icon={MapPin}>
        <div className="space-y-4">
          <Controller name="addresses.permanentAddress.addressLine1" control={control} render={({ field }) => (
            <InputField label="Address Line 1" placeholder="House No., Street, Area" {...field} />
          )} />
          <Controller name="addresses.permanentAddress.addressLine2" control={control} render={({ field }) => (
            <InputField label="Address Line 2" placeholder="Near landmark, Colony…" {...field} />
          )} />
          <Grid>
            <Controller name="addresses.permanentAddress.city" control={control} render={({ field }) => (
              <InputField label="City / Town" {...field} />
            )} />
            <Controller name="addresses.permanentAddress.district" control={control} render={({ field }) => (
              <InputField label="District" {...field} />
            )} />
          </Grid>
          <Grid>
            <Controller name="addresses.permanentAddress.state" control={control} render={({ field }) => (
              <SelectField label="State" isSearchable options={INDIAN_STATES}
                value={field.value} onChange={field.onChange} />
            )} />
            <Controller name="addresses.permanentAddress.pinCode" control={control} render={({ field }) => (
              <InputField label="Pin Code" placeholder="302001"
                {...field}
                onChange={e => field.onChange(e.target.value.replace(/\D/g, "").slice(0, 6))} />
            )} />
          </Grid>
          <Controller name="addresses.permanentAddress.landmark" control={control} render={({ field }) => (
            <InputField label="Land Mark" placeholder="Near…" {...field} />
          )} />
        </div>
      </SectionCard>
    </div>
  );
};

// ─────────────────────────────────────────────
// SECTION: CO-APPLICANTS
// ─────────────────────────────────────────────
const CoApplicantSection = ({ control, errors, fields, append, remove }) => (
  <div>
    <div className="flex items-center justify-between p-5 bg-blue-50 rounded-2xl border border-blue-100 mb-6">
      <div>
        <h3 className="font-bold text-blue-800 text-sm">Co-Applicants</h3>
        <p className="text-xs text-blue-500 mt-0.5">Add co-applicants to strengthen the application</p>
      </div>
      <Button type="button"
        onClick={() => append({
          firstName: "", middleName: "", lastName: "", relation: "",
          contactNumber: "", employmentType: "salaried", dob: "",
          panNumber: "", aadhaarNumber: "", email: "", monthlyIncome: 0,
        })}
        className="!py-2 !px-4 !text-xs">
        <Plus size={13} /> Add Co-Applicant
      </Button>
    </div>

    {fields.length === 0 && (
      <div className="text-center py-14 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
        <Users size={36} className="mx-auto text-slate-300 mb-3" />
        <p className="text-slate-400 font-semibold text-sm">No co-applicants added</p>
        <p className="text-xs text-slate-400 mt-1">Click "Add Co-Applicant" above to continue</p>
      </div>
    )}

    {fields.map((field, index) => (
      <SectionCard key={field.id} title={`Co-Applicant ${index + 1}`} icon={UserCheck}>
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button type="button" onClick={() => remove(index)}
              className="!bg-red-50 !text-red-600 border border-red-200 hover:!bg-red-100 !shadow-none !py-1.5 !px-3 !text-xs">
              <Trash2 size={13} /> Remove
            </Button>
          </div>
          <Grid cols={3}>
            <Controller name={`coApplicants.${index}.firstName`} control={control} render={({ field: f }) => (
              <InputField label="First Name" isRequired {...f} error={errors.coApplicants?.[index]?.firstName?.message} />
            )} />
            <Controller name={`coApplicants.${index}.middleName`} control={control} render={({ field: f }) => (
              <InputField label="Middle Name" {...f} />
            )} />
            <Controller name={`coApplicants.${index}.lastName`} control={control} render={({ field: f }) => (
              <InputField label="Last Name" {...f} />
            )} />
          </Grid>
          <Grid>
            <Controller name={`coApplicants.${index}.relation`} control={control} render={({ field: f }) => (
              <SelectField label="Relationship" isRequired options={RELATION_OPTIONS}
                value={f.value} onChange={f.onChange}
                error={errors.coApplicants?.[index]?.relation?.message} />
            )} />
            <Controller name={`coApplicants.${index}.dob`} control={control} render={({ field: f }) => (
              <InputField label="Date of Birth" type="date" isRequired
                {...f} error={errors.coApplicants?.[index]?.dob?.message} />
            )} />
          </Grid>
          <Grid>
            <Controller name={`coApplicants.${index}.contactNumber`} control={control} render={({ field: f }) => (
              <InputField label="Mobile Number" type="tel" isRequired
                {...f}
                onChange={e => f.onChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
                error={errors.coApplicants?.[index]?.contactNumber?.message} />
            )} />
            <Controller name={`coApplicants.${index}.email`} control={control} render={({ field: f }) => (
              <InputField label="Email" type="email" {...f} error={errors.coApplicants?.[index]?.email?.message} />
            )} />
          </Grid>
          <Grid>
            <Controller name={`coApplicants.${index}.panNumber`} control={control} render={({ field: f }) => (
              <InputField label="PAN Number" {...f}
                onChange={e => f.onChange(e.target.value.toUpperCase().slice(0, 10))} />
            )} />
            <Controller name={`coApplicants.${index}.aadhaarNumber`} control={control} render={({ field: f }) => (
              <InputField label="Aadhaar Number" {...f}
                onChange={e => f.onChange(e.target.value.replace(/\D/g, "").slice(0, 12))} />
            )} />
          </Grid>
          <Grid>
            <Controller name={`coApplicants.${index}.employmentType`} control={control} render={({ field: f }) => (
              <SelectField label="Employment Type" isRequired options={EMPLOYMENT_OPTIONS}
                value={f.value} onChange={f.onChange}
                error={errors.coApplicants?.[index]?.employmentType?.message} />
            )} />
            <Controller name={`coApplicants.${index}.monthlyIncome`} control={control} render={({ field: f }) => (
              <InputField label="Monthly Income (₹)" type="number"
                {...f} onChange={e => f.onChange(Number(e.target.value))} />
            )} />
          </Grid>
        </div>
      </SectionCard>
    ))}
  </div>
);

// ─────────────────────────────────────────────
// SECTION: GUARANTORS
// ─────────────────────────────────────────────
const GuarantorSection = ({ control, errors, fields, append, remove }) => (
  <div>
    <div className="flex items-center justify-between p-5 bg-amber-50 rounded-2xl border border-amber-100 mb-6">
      <div>
        <h3 className="font-bold text-amber-800 text-sm">Guarantors</h3>
        <p className="text-xs text-amber-600 mt-0.5">Guarantors provide additional assurance</p>
      </div>
      <Button type="button"
        onClick={() => append({
          firstName: "", middleName: "", lastName: "", contactNumber: "",
          email: "", panNumber: "", aadhaarNumber: "", relation: "", occupation: "",
        })}
        className="!bg-amber-500 hover:!bg-amber-600 !py-2 !px-4 !text-xs">
        <Plus size={13} /> Add Guarantor
      </Button>
    </div>

    {fields.length === 0 && (
      <div className="text-center py-14 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
        <Shield size={36} className="mx-auto text-slate-300 mb-3" />
        <p className="text-slate-400 font-semibold text-sm">No guarantors added</p>
      </div>
    )}

    {fields.map((field, index) => (
      <SectionCard key={field.id} title={`Guarantor ${index + 1}`} icon={Shield}>
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button type="button" onClick={() => remove(index)}
              className="!bg-red-50 !text-red-600 border border-red-200 !shadow-none !py-1.5 !px-3 !text-xs">
              <Trash2 size={13} /> Remove
            </Button>
          </div>
          <Grid cols={3}>
            <Controller name={`guarantors.${index}.firstName`} control={control} render={({ field: f }) => (
              <InputField label="First Name" isRequired {...f} />
            )} />
            <Controller name={`guarantors.${index}.middleName`} control={control} render={({ field: f }) => (
              <InputField label="Middle Name" {...f} />
            )} />
            <Controller name={`guarantors.${index}.lastName`} control={control} render={({ field: f }) => (
              <InputField label="Last Name" {...f} />
            )} />
          </Grid>
          <Grid>
            <Controller name={`guarantors.${index}.contactNumber`} control={control} render={({ field: f }) => (
              <InputField label="Mobile Number" type="tel"
                {...f}
                onChange={e => f.onChange(e.target.value.replace(/\D/g, "").slice(0, 10))} />
            )} />
            <Controller name={`guarantors.${index}.email`} control={control} render={({ field: f }) => (
              <InputField label="Email" type="email" {...f} />
            )} />
          </Grid>
          <Grid>
            <Controller name={`guarantors.${index}.panNumber`} control={control} render={({ field: f }) => (
              <InputField label="PAN Number" {...f}
                onChange={e => f.onChange(e.target.value.toUpperCase().slice(0, 10))} />
            )} />
            <Controller name={`guarantors.${index}.aadhaarNumber`} control={control} render={({ field: f }) => (
              <InputField label="Aadhaar Number" {...f}
                onChange={e => f.onChange(e.target.value.replace(/\D/g, "").slice(0, 12))} />
            )} />
          </Grid>
          <Grid>
            <Controller name={`guarantors.${index}.relation`} control={control} render={({ field: f }) => (
              <InputField label="Relationship with Applicant" {...f} />
            )} />
            <Controller name={`guarantors.${index}.occupation`} control={control} render={({ field: f }) => (
              <SelectField label="Occupation" options={EMPLOYMENT_OPTIONS}
                value={f.value} onChange={f.onChange} />
            )} />
          </Grid>
        </div>
      </SectionCard>
    ))}
  </div>
);

// ─────────────────────────────────────────────
// SECTION: LOAN REQUIREMENT
// ─────────────────────────────────────────────
const LoanRequirementSection = ({ control, errors, watch }) => {
  const propertySelected = watch("propertySelected");

  return (
    <div>
      <SectionCard title="Loan Amount & Terms" icon={IndianRupee}>
        <div className="space-y-4">
          <Grid>
            <Controller name="loanRequirement.loanAmount" control={control} render={({ field }) => (
              <InputField label="Loan Amount Required (₹)" type="number" placeholder="500000" isRequired
                {...field} onChange={e => field.onChange(Number(e.target.value))}
                error={errors.loanRequirement?.loanAmount?.message} />
            )} />
            <Controller name="loanRequirement.tenure" control={control} render={({ field }) => (
              <InputField label="Tenure (Months)" type="number" placeholder="120" isRequired
                {...field} onChange={e => field.onChange(Number(e.target.value))}
                error={errors.loanRequirement?.tenure?.message} />
            )} />
          </Grid>
          <Grid>
            <Controller name="loanRequirement.interestOption" control={control} render={({ field }) => (
              <SelectField label="Interest Option" isRequired options={INTEREST_OPTIONS}
                value={field.value} onChange={field.onChange}
                error={errors.loanRequirement?.interestOption?.message} />
            )} />
            <Controller name="loanRequirement.repaymentMethod" control={control} render={({ field }) => (
              <SelectField label="Repayment Method" isRequired options={REPAYMENT_OPTIONS}
                value={field.value} onChange={field.onChange}
                error={errors.loanRequirement?.repaymentMethod?.message} />
            )} />
          </Grid>
          <Controller name="loanRequirement.loanPurpose" control={control} render={({ field }) => (
            <SelectField label="Loan Purpose" isRequired options={LOAN_PURPOSE_OPTIONS}
              value={field.value} onChange={field.onChange}
              error={errors.loanRequirement?.loanPurpose?.message} />
          )} />
        </div>
      </SectionCard>

      <SectionCard title="Cost Breakdown" icon={Landmark}>
        <div className="space-y-4">
          <Grid>
            <Controller name="costs.landCost" control={control} render={({ field }) => (
              <InputField label="Land Cost (₹)" type="number"
                {...field} onChange={e => field.onChange(Number(e.target.value))} />
            )} />
            <Controller name="costs.agreementValue" control={control} render={({ field }) => (
              <InputField label="Agreement Value (₹)" type="number"
                {...field} onChange={e => field.onChange(Number(e.target.value))} />
            )} />
          </Grid>
          <Grid>
            <Controller name="costs.stampDuty" control={control} render={({ field }) => (
              <InputField label="Stamp Duty / Reg. Charges (₹)" type="number"
                {...field} onChange={e => field.onChange(Number(e.target.value))} />
            )} />
            <Controller name="costs.constructionCost" control={control} render={({ field }) => (
              <InputField label="Construction Cost (₹)" type="number"
                {...field} onChange={e => field.onChange(Number(e.target.value))} />
            )} />
          </Grid>
        </div>
      </SectionCard>

      <SectionCard title="Mortgage Property" icon={Home}>
        <div className="space-y-4">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm font-semibold text-slate-700">Property Selected?</span>
            <Controller name="propertySelected" control={control} render={({ field }) => (
              <div className="flex gap-3">
                {["Yes", "No"].map(opt => (
                  <label key={opt} className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer text-sm transition-all
                    ${field.value === opt
                      ? "bg-blue-50 border-blue-400 text-blue-700 font-semibold"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}>
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
                      ${field.value === opt ? "border-blue-600" : "border-slate-300"}`}>
                      {field.value === opt && <span className="w-2 h-2 rounded-full bg-blue-600 block" />}
                    </span>
                    <input type="radio" className="sr-only" value={opt}
                      checked={field.value === opt} onChange={() => field.onChange(opt)} />
                    {opt}
                  </label>
                ))}
              </div>
            )} />
          </div>

          {propertySelected === "Yes" && (
            <div className="space-y-4 pt-2">
              <Controller name="property.address" control={control} render={({ field }) => (
                <TextAreaField label="Property Address" rows={2} {...field} />
              )} />
              <Grid>
                <Controller name="property.city" control={control} render={({ field }) => (
                  <InputField label="City / Town" {...field} />
                )} />
                <Controller name="property.state" control={control} render={({ field }) => (
                  <SelectField label="State" isSearchable options={INDIAN_STATES}
                    value={field.value} onChange={field.onChange} />
                )} />
              </Grid>
              <Grid>
                <Controller name="property.pinCode" control={control} render={({ field }) => (
                  <InputField label="Pin Code"
                    {...field}
                    onChange={e => field.onChange(e.target.value.replace(/\D/g, "").slice(0, 6))} />
                )} />
                <Controller name="property.landArea" control={control} render={({ field }) => (
                  <InputField label="Land Area (Sq. Mtr.)" {...field} />
                )} />
              </Grid>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
};

// ─────────────────────────────────────────────
// SECTION: ADDITIONAL INFO
// ─────────────────────────────────────────────
const AdditionalSection = ({ control }) => {
  const BOOL_QUESTIONS = [
    { key: "questionnaire.legalPropertyClear", label: "Is the legal title of the property clear?" },
    { key: "questionnaire.mortgagedElsewhere",  label: "Will MPPL be able to get 1st Mortgage?" },
    { key: "questionnaire.residentOfIndia",     label: "Is/Are Applicant(s) resident(s) of India?" },
    { key: "questionnaire.otherLoans",          label: "Has/Have applicant(s) applied to MPPL earlier?" },
    { key: "questionnaire.guarantorAnywhere",   label: "Has applicant given Guarantee to any loan with MPPL?" },
    { key: "questionnaire.mppLifeInsurance",    label: "Would you be interested in insuring yourself?" },
  ];

  return (
    <div>
      <SectionCard title="General Questions" icon={Info}>
        <div className="space-y-1">
          {BOOL_QUESTIONS.map(q => (
            <div key={q.key}
              className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 gap-4">
              <span className="text-sm text-slate-700 flex-1">{q.label}</span>
              <Controller name={q.key} control={control} render={({ field }) => (
                <div className="flex gap-2 flex-shrink-0">
                  {[true, false].map(v => (
                    <label key={String(v)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border cursor-pointer text-xs font-semibold transition-all
                        ${field.value === v
                          ? "bg-blue-50 border-blue-400 text-blue-700"
                          : "border-slate-200 text-slate-500 hover:border-slate-300"
                        }`}>
                      <input type="radio" className="sr-only"
                        checked={field.value === v} onChange={() => field.onChange(v)} />
                      {v ? "Yes" : "No"}
                    </label>
                  ))}
                </div>
              )} />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="References" icon={UserCheck}>
        <div className="space-y-5">
          {[0, 1].map(n => (
            <div key={n}>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Reference {n + 1}
              </p>
              <Grid>
                <Controller name={`references.${n}.name`} control={control} render={({ field }) => (
                  <InputField label="Name" {...field} />
                )} />
                <Controller name={`references.${n}.fatherName`} control={control} render={({ field }) => (
                  <InputField label="Father's Name" {...field} />
                )} />
              </Grid>
              <div className="mt-4">
                <Grid>
                  <Controller name={`references.${n}.phone`} control={control} render={({ field }) => (
                    <InputField label="Phone No." type="tel"
                      {...field}
                      onChange={e => field.onChange(e.target.value.replace(/\D/g, "").slice(0, 10))} />
                  )} />
                  <Controller name={`references.${n}.occupation`} control={control} render={({ field }) => (
                    <InputField label="Occupation" {...field} />
                  )} />
                </Grid>
              </div>
              {n === 0 && <Divider />}
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Existing Loans" icon={CreditCard}>
        <p className="text-xs text-slate-400 mb-4">
          Applicable only if applicant/co-applicant has a loan outstanding
        </p>
        <div className="space-y-3">
          {[0, 1, 2].map(i => (
            <div key={i} className="p-4 bg-slate-50 rounded-xl space-y-3">
              <p className="text-xs font-semibold text-slate-500">Loan {i + 1}</p>
              <Grid cols={3}>
                <Controller name={`existingLoans.${i}.institution`} control={control} render={({ field }) => (
                  <InputField label={i === 0 ? "Institution Name" : undefined} placeholder="Bank / NBFC" {...field} />
                )} />
                <Controller name={`existingLoans.${i}.emi`} control={control} render={({ field }) => (
                  <InputField label={i === 0 ? "EMI (₹)" : undefined} type="number"
                    {...field} onChange={e => field.onChange(Number(e.target.value))} />
                )} />
                <Controller name={`existingLoans.${i}.balanceOutstanding`} control={control} render={({ field }) => (
                  <InputField label={i === 0 ? "Balance Outstanding (₹)" : undefined} type="number"
                    {...field} onChange={e => field.onChange(Number(e.target.value))} />
                )} />
              </Grid>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

// ─────────────────────────────────────────────
// SECTION: REVIEW & SUBMIT
// ─────────────────────────────────────────────
const ReviewSection = ({ getValues, onSubmit, isSubmitting }) => {
  const [agreed, setAgreed] = useState(false);
  const data = getValues();
  const a    = data.applicant || {};
  const addr = data.addresses?.currentAddress || {};
  const lr   = data.loanRequirement || {};

  const ReviewBlock = ({ title, icon: Icon, rows }) => {
    const valid = rows.filter(([, v]) => v !== undefined && v !== null && v !== "");
    if (!valid.length) return null;
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-visible mb-4">
        <div className="flex items-center gap-2 px-5 py-3 bg-slate-50 border-b border-slate-100">
          {Icon && <Icon size={14} className="text-blue-600" />}
          <h4 className="font-bold text-sm text-slate-700">{title}</h4>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {valid.map(([label, value]) => (
            <div key={label}>
              <p className="text-xs text-slate-400 font-medium mb-0.5">{label}</p>
              <p className="text-sm font-semibold text-slate-800">{String(value)}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Summary banner */}
      <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Eye size={18} />
          </div>
          <div>
            <h3 className="font-black text-lg">Review Application</h3>
            <p className="text-blue-100 text-sm">Verify all details before final submission</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            ["Loan Purpose", LOAN_PURPOSE_OPTIONS.find(o => o.value === lr.loanPurpose)?.label || "—"],
            ["Loan Amount",  lr.loanAmount ? `₹${Number(lr.loanAmount).toLocaleString("en-IN")}` : "—"],
            ["Tenure",       lr.tenure ? `${lr.tenure} Months` : "—"],
          ].map(([l, v]) => (
            <div key={l} className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-blue-200 text-[10px] font-medium">{l}</p>
              <p className="text-white font-bold text-sm mt-0.5">{v}</p>
            </div>
          ))}
        </div>
        {/* Lead Number badge if present */}
        {data.leadNumber && (
          <div className="mt-3 flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
            <Search size={12} className="text-blue-200 flex-shrink-0" />
            <span className="text-blue-100 text-xs">Lead Reference:</span>
            <span className="text-white text-xs font-black tracking-widest">{data.leadNumber}</span>
          </div>
        )}
      </div>

      <ReviewBlock title="Applicant Details" icon={User} rows={[
        ["Full Name",   [a.title, a.firstName, a.middleName, a.lastName].filter(Boolean).join(" ")],
        ["Date of Birth", a.dob], ["Gender", a.gender],
        ["Mobile",      a.contactNumber], ["Email", a.email],
        ["PAN",         a.panNumber], ["Aadhaar", a.aadhaarNumber],
        ["Employment",  EMPLOYMENT_OPTIONS.find(o => o.value === a.employmentType)?.label],
        ["Nationality", a.nationality], ["Category", a.category],
      ]} />

      <ReviewBlock title="Current Address" icon={MapPin} rows={[
        ["Address",  addr.addressLine1], ["City",     addr.city],
        ["District", addr.district],     ["State",    addr.state],
        ["Pin Code", addr.pinCode],
      ]} />

      <ReviewBlock title="Loan Requirement" icon={IndianRupee} rows={[
        ["Loan Amount",      lr.loanAmount ? `₹${Number(lr.loanAmount).toLocaleString("en-IN")}` : ""],
        ["Tenure",           lr.tenure ? `${lr.tenure} Months` : ""],
        ["Interest Option",  lr.interestOption],
        ["Repayment Method", REPAYMENT_OPTIONS.find(o => o.value === lr.repaymentMethod)?.label],
      ]} />

      {(data.coApplicants || []).length > 0 && (
        <ReviewBlock title={`Co-Applicants (${data.coApplicants.length})`} icon={Users} rows={
          data.coApplicants.map((ca, i) => [
            `Co-Applicant ${i + 1}`,
            [ca.firstName, ca.lastName].filter(Boolean).join(" "),
          ])
        } />
      )}
      {(data.guarantors || []).length > 0 && (
        <ReviewBlock title={`Guarantors (${data.guarantors.length})`} icon={Shield} rows={
          data.guarantors.map((g, i) => [
            `Guarantor ${i + 1}`,
            [g.firstName, g.lastName].filter(Boolean).join(" "),
          ])
        } />
      )}

      {/* Declaration */}
      <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200">
        <div className="flex items-start gap-3">
          <Info size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-amber-800 mb-2">Declaration</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              I/We declare that all the particulars and information given in this application form are true,
              correct and complete and that they shall form the basis of any loan Mascot Projects Pvt. Ltd.
              may decide to grant to me/us. I/We confirm that I/WE have/had no insolvency proceedings
              against me/us nor have I/We been adjudicated insolvent.
            </p>
            <div
              className="flex items-center gap-2.5 mt-4 cursor-pointer select-none"
              onClick={() => setAgreed(v => !v)}>
              <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all flex-shrink-0
                ${agreed ? "bg-amber-600 border-amber-600" : "border-amber-400 bg-white"}`}>
                {agreed && <Check size={11} strokeWidth={3} className="text-white" />}
              </div>
              <span className="text-xs font-bold text-amber-800">I agree to the above declaration</span>
            </div>
          </div>
        </div>
      </div>

      <Button type="button" onClick={onSubmit}
        disabled={!agreed || isSubmitting}
        className={`w-full !justify-center !py-3.5 !text-base !rounded-xl !bg-emerald-600 hover:!bg-emerald-700
          ${(!agreed || isSubmitting) ? "!opacity-50 !cursor-not-allowed" : ""}`}>
        {isSubmitting
          ? <><Loader2 size={16} className="animate-spin" /> Submitting…</>
          : <><Send size={16} /> Submit Application</>
        }
      </Button>
    </div>
  );
};

// ─────────────────────────────────────────────
// SUCCESS SCREEN
// ─────────────────────────────────────────────
const SuccessScreen = ({ onReset, leadNumber }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
    <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
        <BadgeCheck size={40} className="text-emerald-600" />
      </div>
      <h2 className="text-2xl font-black text-slate-800 mb-2">Application Submitted!</h2>
      <p className="text-slate-500 text-sm">Your loan application has been received successfully.</p>

      <div className="bg-blue-50 rounded-2xl p-4 my-6 border border-blue-100">
        <p className="text-xs text-blue-600 font-semibold">Application Reference</p>
        <p className="text-2xl font-black text-blue-800 mt-1 tracking-wider">
          MPPL-{Date.now().toString().slice(-8)}
        </p>
        {leadNumber && (
          <p className="text-xs text-blue-500 mt-2">
            Lead: <span className="font-bold">{leadNumber}</span>
          </p>
        )}
      </div>

      <p className="text-xs text-slate-400 mb-6">Our team will contact you within 2–3 business days</p>
      <Button onClick={onReset} className="w-full !justify-center">Start New Application</Button>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function LoanApplicationForm() {
  const [currentStep,    setCurrentStep]    = useState("applicant"); // ← starts on Applicant now
  const [completedSteps, setCompletedSteps] = useState([]);
  const [toast,          setToast]          = useState(null);
  const [submitted,      setSubmitted]      = useState(false);
  const [isSubmitting,   setIsSubmitting]   = useState(false);

  const {
    control, handleSubmit, watch, setValue, getValues, trigger, reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createLoanApplicationSchema),
    mode: "onTouched",
    defaultValues: DEFAULT_VALUES,
  });

  // ✅ useFieldArray — proper top-level hook calls
  const { fields: coAppFields, append: coAppAppend, remove: coAppRemove } =
    useFieldArray({ control, name: "coApplicants" });

  const { fields: guarFields, append: guarAppend, remove: guarRemove } =
    useFieldArray({ control, name: "guarantors" });

  // Load draft on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const { values, completedSteps: cs, currentStep: cs2 } = JSON.parse(raw);
        if (values) reset(values);
        if (cs)  setCompletedSteps(cs);
        if (cs2) setCurrentStep(cs2);
        showToast("Draft loaded ✓", "draft");
      }
    } catch {
      // silent
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const saveDraft = () => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({
        values: getValues(), completedSteps, currentStep,
      }));
      showToast(
        `Draft saved — "${STEPS.find(s => s.id === currentStep)?.label}"`,
        "draft"
      );
    } catch {
      showToast("Failed to save draft", "error");
    }
  };

  const currentIdx = STEPS.findIndex(s => s.id === currentStep);

  const goNext = async () => {
    const fields = STEP_FIELDS[currentStep] || [];
    const valid  = fields.length ? await trigger(fields) : true;
    if (!valid) {
      showToast("Please fix the errors before continuing", "error");
      return;
    }
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
    if (currentIdx < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIdx + 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goPrev = () => {
    if (currentIdx > 0) {
      setCurrentStep(STEPS[currentIdx - 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onSubmit = handleSubmit(
    (data) => {
      setIsSubmitting(true);
      // ── API-READY: replace with actual endpoint ──
      console.log("✅ LOAN APPLICATION PAYLOAD:", JSON.stringify(data, null, 2));
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
        localStorage.removeItem(DRAFT_KEY);
      }, 1800);
    },
    (errs) => {
      console.error("Validation errors:", errs);
      showToast("Please complete all required fields", "error");
    }
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
            control={control} errors={errors}
            watch={watch} setValue={setValue}
            showToast={showToast}
          />
        );
      case "loanType":
        return <LoanTypeSection control={control} errors={errors} />;
      case "address":
        return <AddressSection control={control} errors={errors} watch={watch} setValue={setValue} />;
      case "coApplicant":
        return (
          <CoApplicantSection
            control={control} errors={errors}
            fields={coAppFields} append={coAppAppend} remove={coAppRemove}
          />
        );
      case "guarantor":
        return (
          <GuarantorSection
            control={control} errors={errors}
            fields={guarFields} append={guarAppend} remove={guarRemove}
          />
        );
      case "loanReq":
        return <LoanRequirementSection control={control} errors={errors} watch={watch} />;
      case "additional":
        return <AdditionalSection control={control} />;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100">
      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-sm">
              <Landmark size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black text-slate-800 leading-tight">
                Mascot Projects Pvt. Ltd.
              </h1>
              <p className="text-[10px] text-slate-400">Non Banking Finance Co. · Loan Application Form</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Auto-save enabled
          </div>
        </div>
      </div>

      {/* ── Stepper ── */}
      <Stepper
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={(id) => {
          setCurrentStep(id);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* ── Body ── */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {renderSection()}

        {/* Navigation Bar */}
        {currentStep !== "review" && (
          <div className="mt-6 flex items-center justify-between pt-6 border-t border-slate-200">
            <Button type="button" onClick={goPrev}
              disabled={currentIdx === 0}
              className={`!bg-white !text-slate-600 border border-slate-200 hover:!bg-slate-50 !shadow-none
                ${currentIdx === 0 ? "!opacity-40 !cursor-not-allowed" : ""}`}>
              <ChevronLeft size={15} /> Previous
            </Button>

            <div className="flex items-center gap-2">
              <Button type="button" onClick={saveDraft}
                className="!bg-amber-50 !text-amber-700 border border-amber-200 hover:!bg-amber-100 !shadow-none !text-sm">
                <Save size={14} /> Save Draft
              </Button>
              <Button type="button" onClick={goNext} className="!text-sm">
                {currentIdx === STEPS.length - 2 ? "Review & Submit" : "Next"}
                <ChevronRight size={15} />
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* ── Toast ── */}
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