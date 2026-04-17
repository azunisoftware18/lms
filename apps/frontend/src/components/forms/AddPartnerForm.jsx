import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { User, Building2, Phone, Mail, MapPin, Briefcase, CreditCard, Key, FileText, Banknote, TrendingUp, Shield } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import InputField from "../ui/InputField";
import SelectField from "../ui/SelectField";
import Button from "../ui/Button";
import { showSuccess, showError } from "../../lib/utils/toastService";

// Enums from Prisma model
const PartnerTypeEnum = {
  DSA: "DSA",
  BROKER: "BROKER",
  Connector: "Connector",
  Fintech: "Fintech",
  Builder: "Builder",
  Aggregator: "Aggregator",
};

const ConstitutionTypeEnum = {
  INDIVIDUAL: "INDIVIDUAL",
  PROPRIETORSHIP: "PROPRIETORSHIP",
  PARTNERSHIP: "PARTNERSHIP",
  LLP: "LLP",
  PRIVATE_LTD: "PRIVATE_LTD",
  PUBLIC_LTD: "PUBLIC_LTD",
  OTHER: "OTHER",
};

const PartnerStatusEnum = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  SUSPENDED: "SUSPENDED",
  BLACKLISTED: "BLACKLISTED",
};

const AddressTypeEnum = {
  CURRENT_RESIDENTIAL: "CURRENT_RESIDENTIAL",
  PERMANENT: "PERMANENT",
  CORRESPONDENCE: "CORRESPONDENCE",
  OFFICE: "OFFICE",
};

const CommissionTypeEnum = {
  FIXED: "FIXED",
  PERCENTAGE: "PERCENTAGE",
};

const PaymentCycleEnum = {
  MONTHLY: "MONTHLY",
  QUARTERLY: "QUARTERLY",
  HALF_YEARLY: "HALF_YEARLY",
  YEARLY: "YEARLY",
  PER_TRANSACTION: "PER_TRANSACTION",
};

const PayoutTypeEnum = {
  FLAT: "FLAT",
  PERCENTAGE: "PERCENTAGE",
  SLAB: "SLAB",
};

const PayoutFrequencyEnum = {
  MONTHLY: "MONTHLY",
  CASE_WISE: "CASE_WISE",
  ON_DISBURSEMENT: "ON_DISBURSEMENT",
};

// Zod validation schema
const partnerSchema = z.object({
  // Basic Info
  legalName: z.string().min(1, "Legal Name is required"),
  tradeName: z.string().optional(),
  partnerType: z.enum(["DSA", "BROKER", "Connector", "Fintech", "Builder", "Aggregator"]),
  constitutionType: z.enum(["INDIVIDUAL", "PROPRIETORSHIP", "PARTNERSHIP", "LLP", "PRIVATE_LTD", "PUBLIC_LTD", "OTHER"]),
  dateOfOnboarding: z.string().min(1, "Date of Onboarding is required"),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED", "BLACKLISTED"]),
  branchId: z.string().min(1, "Branch is required"),

  // Contact Details
  contactPersonName: z.string().min(1, "Contact Person Name is required"),
  contactNumber: z.string().min(10, "Valid contact number is required"),
  email: z.string().email("Valid email is required").optional(),
  alternatePersonName: z.string().optional(),
  alternateContactNumber: z.string().optional(),

  // Address
  addressType: z.enum(["CURRENT_RESIDENTIAL", "PERMANENT", "CORRESPONDENCE", "OFFICE"]).default("OFFICE"),
  addressLine1: z.string().min(1, "Address Line 1 is required"),
  addressLine2: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(1, "City is required"),
  district: z.string().min(1, "District is required"),
  state: z.string().min(1, "State is required"),
  pinCode: z.string().min(6, "Valid PIN Code is required"),
  phoneNumber: z.string().optional(),

  // KYC & Verification
  panNumber: z.string().min(10, "Valid PAN number is required").max(10),
  aadhaarNumber: z.string().length(12, "Valid Aadhaar number is required"),
  cinNumber: z.string().optional(),
  llpinNumber: z.string().optional(),

  // Banking
  payoutBankName: z.string().optional(),
  payoutAccountHolderName: z.string().optional(),
  payoutAccountNumber: z.string().optional(),
  payoutIfscCode: z.string().optional(),
  payoutUpiId: z.string().optional(),

  // Login Credentials
  loginId: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),

  // Business Profile
  natureOfBusiness: z.string().optional(),
  yearsInBusiness: z.string().optional(),
  productExpertise: z.string().optional(),
  monthlySourcingVolume: z.string().optional(),
  geographicCoverage: z.string().optional(),
  existingLenderRelationships: z.string().optional(),
  totalEmployees: z.string().optional(),
  digitalApiIntegration: z.boolean().default(false),

  // GST
  gstNumber: z.string().optional(),

  // Commission / Payout
  commissionType: z.enum(["FIXED", "PERCENTAGE"]),
  commissionValue: z.string().optional(),
  paymentCycle: z.enum(["MONTHLY", "QUARTERLY", "HALF_YEARLY", "YEARLY", "PER_TRANSACTION"]),
  minimumPayout: z.string().optional(),
  taxDeduction: z.string().optional(),
  payoutType: z.enum(["FLAT", "PERCENTAGE", "SLAB"]).optional(),
  productPayoutRates: z.string().optional(),
  roiProcessingShare: z.string().optional(),
  payoutFrequency: z.enum(["MONTHLY", "CASE_WISE", "ON_DISBURSEMENT"]).optional(),
  gstApplicable: z.boolean().default(true),
  tdsApplicable: z.boolean().default(false),
  incentiveSchemes: z.string().optional(),
  clawbackTerms: z.string().optional(),
  maxPayoutCap: z.string().optional(),

  // Business Metrics
  establishedYear: z.string().optional(),
  specialization: z.string().optional(),
  annualTurnover: z.string().optional(),
  businessRegistrationNumber: z.string().optional(),
  targetArea: z.string().optional(),
});

export default function AddPartnerForm({
  initialFormState,
  isEditing,
  editId,
  onCancel,
  onSuccess,
}) {
  const [documentFiles, setDocumentFiles] = useState({});

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(partnerSchema),
    mode: "onChange",
    defaultValues: initialFormState || {
      // Basic Info
      legalName: "",
      tradeName: "",
      partnerType: "DSA",
      constitutionType: "INDIVIDUAL",
      dateOfOnboarding: new Date().toISOString().split("T")[0],
      status: "ACTIVE",
      branchId: "",
      // Contact Details
      contactPersonName: "",
      contactNumber: "",
      email: "",
      alternatePersonName: "",
      alternateContactNumber: "",
      // Address
      addressType: "OFFICE",
      addressLine1: "",
      addressLine2: "",
      landmark: "",
      city: "",
      district: "",
      state: "",
      pinCode: "",
      phoneNumber: "",
      // KYC
      panNumber: "",
      aadhaarNumber: "",
      cinNumber: "",
      llpinNumber: "",
      // Banking
      payoutBankName: "",
      payoutAccountHolderName: "",
      payoutAccountNumber: "",
      payoutIfscCode: "",
      payoutUpiId: "",
      // Login Credentials
      loginId: "",
      password: "",
      // Business Profile
      natureOfBusiness: "",
      yearsInBusiness: "",
      productExpertise: "",
      monthlySourcingVolume: "",
      geographicCoverage: "",
      existingLenderRelationships: "",
      totalEmployees: "",
      digitalApiIntegration: false,
      // GST
      gstNumber: "",
      // Commission
      commissionType: "PERCENTAGE",
      commissionValue: "",
      paymentCycle: "MONTHLY",
      minimumPayout: "",
      taxDeduction: "",
      payoutType: "PERCENTAGE",
      productPayoutRates: "",
      roiProcessingShare: "",
      payoutFrequency: "MONTHLY",
      gstApplicable: true,
      tdsApplicable: false,
      incentiveSchemes: "",
      clawbackTerms: "",
      maxPayoutCap: "",
      // Business Metrics
      establishedYear: "",
      specialization: "",
      annualTurnover: "",
      businessRegistrationNumber: "",
      targetArea: "",
    },
  });

  const selectedConstitutionType = watch("constitutionType");

  const requiredDocumentTypes = useMemo(() => {
    const map = {
      INDIVIDUAL: ["PAN", "AADHAAR", "ADDRESS_PROOF", "BANK_PROOF"],
      PROPRIETORSHIP: ["PAN", "AADHAAR", "REGISTRATION_CERTIFICATE", "GST_CERTIFICATE", "BANK_PROOF"],
      PARTNERSHIP: ["PAN", "REGISTRATION_CERTIFICATE", "PARTNERSHIP_AGREEMENT", "GSTIN", "BANK_PROOF", "BOARD_RESOLUTION"],
      LLP: ["PAN", "LLPIN", "CIN", "INCORPORATION_CERTIFICATE", "GSTIN", "BANK_PROOF"],
      PRIVATE_LTD: ["PAN", "CIN", "INCORPORATION_CERTIFICATE", "GSTIN", "BOARD_RESOLUTION", "BANK_PROOF"],
      PUBLIC_LTD: ["PAN", "CIN", "INCORPORATION_CERTIFICATE", "GSTIN", "BOARD_RESOLUTION", "BANK_PROOF"],
      OTHER: ["PAN", "ADDRESS_PROOF", "BANK_PROOF"],
    };

    return map[selectedConstitutionType] || map.INDIVIDUAL;
  }, [selectedConstitutionType]);

  const onDocumentChange = (documentType, event) => {
    const selectedFile = event.target.files?.[0] || null;
    setDocumentFiles((prev) => ({
      ...prev,
      [documentType]: selectedFile,
    }));
  };

  const generatePartnerCredentials = () => {
    const legalName = getValues("legalName");
    if (legalName) {
      const loginId = legalName.toLowerCase().replace(/\s+/g, ".") + Math.floor(Math.random() * 1000);
      setValue("loginId", loginId);
      showSuccess("Username generated!");
    } else {
      showError("Please enter Legal Name first");
    }
  };

  const onSubmit = async (data) => {
    const missingDocuments = requiredDocumentTypes.filter((docType) => !documentFiles[docType]);
    if (!isEditing && missingDocuments.length > 0) {
      showError(`Please upload required documents: ${missingDocuments.join(", ")}`);
      return;
    }

    const payload = {
      // Required user fields
      fullName: data.contactPersonName,
      email: data.email,
      password: data.password,
      userName: data.loginId,
      branchId: data.branchId,

      // Basic partner fields
      legalName: data.legalName,
      companyName: data.legalName,
      tradeName: data.tradeName || null,
      partnerType: data.partnerType,
      constitutionType: data.constitutionType,
      dateOfOnboarding: data.dateOfOnboarding,
      status: data.status,
      
      // Contact Details
      contactPersonName: data.contactPersonName,
      contactNumber: data.contactNumber,
      alternatePersonName: data.alternatePersonName || null,
      alternateContactNumber: data.alternateContactNumber || null,
      
      // Address details
      currentAddressLine1: data.addressLine1,
      currentCity: data.city,
      currentState: data.state,
      currentPinCode: data.pinCode,
      permanentAddressLine1: data.addressLine1,
      permanentCity: data.city,
      permanentState: data.state,
      permanentPinCode: data.pinCode,
      
      // KYC & Verification
      panNumber: data.panNumber,
      aadhaarNumber: data.aadhaarNumber,
      cinNumber: data.cinNumber || null,
      llpinNumber: data.llpinNumber || null,
      
      // Verification Status (defaults)
      panVerificationStatus: "pending",
      gstVerificationStatus: "pending",
      bankVerificationStatus: "pending",
      kycDocumentsUploaded: false,
      commercialCibilUploaded: false,
      cibilCheckUploaded: false,
      
      // Banking
      payoutBankName: data.payoutBankName,
      payoutAccountHolderName: data.payoutAccountHolderName,
      payoutAccountNumber: data.payoutAccountNumber,
      payoutIfscCode: data.payoutIfscCode,
      payoutUpiId: data.payoutUpiId || null,
      
      // Login Credentials
      loginId: data.loginId,
      
      // Business Profile
      natureOfBusiness: data.natureOfBusiness || null,
      yearsInBusiness: data.yearsInBusiness ? parseInt(data.yearsInBusiness) : null,
      productExpertise: data.productExpertise || null,
      monthlySourcingVolume: data.monthlySourcingVolume ? parseInt(data.monthlySourcingVolume) : null,
      geographicCoverage: data.geographicCoverage || null,
      existingLenderRelationships: data.existingLenderRelationships || null,
      totalEmployees: data.totalEmployees ? parseInt(data.totalEmployees) : null,
      digitalApiIntegration: data.digitalApiIntegration,
      
      // GST
      gstNumber: data.gstNumber || null,
      
      // Commission / Payout
      commissionType: data.commissionType,
      commissionValue: data.commissionValue ? parseFloat(data.commissionValue) : null,
      paymentCycle: data.paymentCycle,
      minimumPayout: data.minimumPayout ? parseFloat(data.minimumPayout) : null,
      taxDeduction: data.taxDeduction ? parseFloat(data.taxDeduction) : null,
      payoutType: data.payoutType || null,
      productPayoutRates: (() => {
        try {
          return data.productPayoutRates ? JSON.parse(data.productPayoutRates) : null;
        } catch {
          return null;
        }
      })(),
      roiProcessingShare: data.roiProcessingShare ? parseFloat(data.roiProcessingShare) : null,
      payoutFrequency: data.payoutFrequency || null,
      gstApplicable: data.gstApplicable,
      tdsApplicable: data.tdsApplicable,
      incentiveSchemes: (() => {
        try {
          return data.incentiveSchemes ? JSON.parse(data.incentiveSchemes) : null;
        } catch {
          return null;
        }
      })(),
      clawbackTerms: data.clawbackTerms || null,
      maxPayoutCap: data.maxPayoutCap ? parseFloat(data.maxPayoutCap) : null,
      
      // Business Metrics
      establishedYear: data.establishedYear ? parseInt(data.establishedYear) : null,
      specialization: data.specialization || null,
      annualTurnover: data.annualTurnover ? parseFloat(data.annualTurnover) : null,
      businessRegistrationNumber: data.businessRegistrationNumber || null,
      targetArea: data.targetArea || null,
      
      // Performance Tracking (defaults)
      totalReferrals: 0,
      activeReferrals: 0,
      commissionEarned: 0,
      totalLeadsSubmitted: 0,
      loginToSanctionRatio: null,
      sanctionToDisbursementRatio: null,
      disbursementVolume: 0,
      rejectionRate: null,
      fraudCasesCount: 0,
      qualityScore: null,
      partnerRating: 0,
      
      // Organization
      isActive: true,
    };

    console.log("Submitting payload:", payload);

    const selectedDocumentTypes = requiredDocumentTypes.filter((docType) => !!documentFiles[docType]);
    const documents = selectedDocumentTypes.map((docType) => documentFiles[docType]);

    if (onSuccess) {
      onSuccess({
        partnerData: payload,
        documents,
        documentTypes: selectedDocumentTypes,
      });
    }
  };

  const partnerTypeOptions = Object.entries(PartnerTypeEnum).map(([key, value]) => ({ value, label: value.charAt(0) + value.slice(1).toLowerCase() }));
  const constitutionTypeOptions = Object.entries(ConstitutionTypeEnum).map(([key, value]) => ({ 
    value, 
    label: value === "PRIVATE_LTD" ? "Private Limited" : 
           value === "PUBLIC_LTD" ? "Public Limited" :
           value === "PROPRIETORSHIP" ? "Proprietorship" :
           value === "PARTNERSHIP" ? "Partnership" :
           value === "LLP" ? "LLP" :
           value === "INDIVIDUAL" ? "Individual" :
           value === "OTHER" ? "Other" : value
  }));
  const statusOptions = Object.entries(PartnerStatusEnum).map(([key, value]) => ({ value, label: value.replace("_", " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) }));
  const commissionTypeOptions = Object.entries(CommissionTypeEnum).map(([key, value]) => ({ value, label: value.charAt(0) + value.slice(1).toLowerCase() }));
  const paymentCycleOptions = Object.entries(PaymentCycleEnum).map(([key, value]) => ({ value, label: value.replace("_", " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) }));
  const payoutTypeOptions = Object.entries(PayoutTypeEnum).map(([key, value]) => ({ value, label: value.charAt(0) + value.slice(1).toLowerCase() }));
  const payoutFrequencyOptions = Object.entries(PayoutFrequencyEnum).map(([key, value]) => ({ value, label: value.charAt(0) + value.slice(1).toLowerCase() }));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <form onSubmit={handleSubmit(onSubmit)} className="p-8" autoComplete="off">
        
        {/* Basic Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="md:col-span-3 pb-2 border-b border-gray-100 mb-2">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Building2 size={18} className="text-blue-500" /> Basic Information
            </h3>
          </div>

          <InputField
            label="Legal Name"
            {...register("legalName")}
            error={errors.legalName?.message}
            isRequired
            icon={Building2}
            placeholder="e.g. ABC Enterprises Pvt Ltd"
          />

          <InputField
            label="Trade Name"
            {...register("tradeName")}
            error={errors.tradeName?.message}
            placeholder="e.g. ABC Corp"
          />

          <Controller
            name="partnerType"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Partner Type"
                options={partnerTypeOptions}
                value={field.value}
                onChange={field.onChange}
                isRequired
              />
            )}
          />

          <Controller
            name="constitutionType"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Constitution Type"
                options={constitutionTypeOptions}
                value={field.value}
                onChange={field.onChange}
                isRequired
              />
            )}
          />

          <InputField
            label="Date of Onboarding"
            type="date"
            {...register("dateOfOnboarding")}
            error={errors.dateOfOnboarding?.message}
            isRequired
          />

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Status"
                options={statusOptions}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <InputField
            label="Branch ID"
            {...register("branchId")}
            error={errors.branchId?.message}
            isRequired
            placeholder="Enter branch ID"
          />
        </div>

        {/* Contact Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="md:col-span-3 pb-2 border-b border-gray-100 mb-2">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <User size={18} className="text-blue-500" /> Contact Details
            </h3>
          </div>

          <InputField
            label="Contact Person Name"
            {...register("contactPersonName")}
            error={errors.contactPersonName?.message}
            isRequired
            icon={User}
            placeholder="e.g. John Doe"
          />

          <InputField
            label="Contact Number"
            {...register("contactNumber")}
            error={errors.contactNumber?.message}
            isRequired
            icon={Phone}
            placeholder="9876543210"
          />

          <InputField
            label="Email Address"
            type="email"
            {...register("email")}
            error={errors.email?.message}
            icon={Mail}
            placeholder="contact@company.com"
          />

          <InputField
            label="Alternate Person Name"
            {...register("alternatePersonName")}
            icon={User}
            placeholder="Optional"
          />

          <InputField
            label="Alternate Contact Number"
            {...register("alternateContactNumber")}
            icon={Phone}
            placeholder="Optional"
          />
        </div>

        {/* Address Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="md:col-span-3 pb-2 border-b border-gray-100 mb-2">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <MapPin size={18} className="text-blue-500" /> Address Details
            </h3>
          </div>

          <Controller
            name="addressType"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Address Type"
                options={Object.entries(AddressTypeEnum).map(([key, value]) => ({ value, label: value.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) }))}
                value={field.value}
                onChange={field.onChange}
                isRequired
              />
            )}
          />

          <div className="md:col-span-2">
            <InputField
              label="Address Line 1"
              {...register("addressLine1")}
              error={errors.addressLine1?.message}
              isRequired
              placeholder="Street, Area, Landmark"
            />
          </div>

          <div className="md:col-span-2">
            <InputField
              label="Address Line 2"
              {...register("addressLine2")}
              error={errors.addressLine2?.message}
              placeholder="Optional"
            />
          </div>

          <InputField
            label="Landmark"
            {...register("landmark")}
            error={errors.landmark?.message}
            placeholder="Optional"
          />

          <InputField
            label="City"
            {...register("city")}
            error={errors.city?.message}
            isRequired
            placeholder="e.g. Mumbai"
          />

          <InputField
            label="District"
            {...register("district")}
            error={errors.district?.message}
            isRequired
            placeholder="e.g. Mumbai Suburban"
          />

          <InputField
            label="State"
            {...register("state")}
            error={errors.state?.message}
            isRequired
            placeholder="e.g. Maharashtra"
          />

          <InputField
            label="PIN Code"
            {...register("pinCode")}
            error={errors.pinCode?.message}
            isRequired
            placeholder="400001"
          />

          <InputField
            label="Phone Number"
            {...register("phoneNumber")}
            error={errors.phoneNumber?.message}
            placeholder="Optional"
            icon={Phone}
          />
        </div>

        {/* KYC & Verification Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="md:col-span-3 pb-2 border-b border-gray-100 mb-2">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Shield size={18} className="text-blue-500" /> KYC & Verification
            </h3>
          </div>

          <InputField
            label="PAN Number"
            {...register("panNumber")}
            error={errors.panNumber?.message}
            isRequired
            placeholder="ABCDE1234F"
          />

          <InputField
            label="Aadhaar Number"
            {...register("aadhaarNumber")}
            error={errors.aadhaarNumber?.message}
            placeholder="1234 5678 9012"
          />

          <InputField
            label="CIN Number"
            {...register("cinNumber")}
            error={errors.cinNumber?.message}
            placeholder="U12345MH2023PTC123456"
          />

          <InputField
            label="LLPIN Number"
            {...register("llpinNumber")}
            error={errors.llpinNumber?.message}
            placeholder="ABC-1234-5678"
          />
        </div>

        {/* GST Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="md:col-span-3 pb-2 border-b border-gray-100 mb-2">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <FileText size={18} className="text-blue-500" /> GST Details
            </h3>
          </div>

          <InputField
            label="GST Number"
            {...register("gstNumber")}
            error={errors.gstNumber?.message}
            placeholder="22AAAAA0000A1Z"
          />
        </div>

        {/* Banking Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="md:col-span-3 pb-2 border-b border-gray-100 mb-2">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <CreditCard size={18} className="text-blue-500" /> Banking Details
            </h3>
          </div>

          <InputField
            label="Bank Name"
            {...register("payoutBankName")}
            error={errors.payoutBankName?.message}
            isRequired
            placeholder="e.g. HDFC Bank"
          />

          <InputField
            label="Account Holder Name"
            {...register("payoutAccountHolderName")}
            error={errors.payoutAccountHolderName?.message}
            isRequired
            placeholder="As per bank records"
          />

          <InputField
            label="Account Number"
            {...register("payoutAccountNumber")}
            error={errors.payoutAccountNumber?.message}
            isRequired
            placeholder="123456789012"
          />

          <InputField
            label="IFSC Code"
            {...register("payoutIfscCode")}
            error={errors.payoutIfscCode?.message}
            isRequired
            placeholder="HDFC0001234"
          />

          <InputField
            label="UPI ID"
            {...register("payoutUpiId")}
            error={errors.payoutUpiId?.message}
            placeholder="company@hdfc"
          />
        </div>

        {/* Login Credentials Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="md:col-span-3 pb-2 border-b border-gray-100 mb-2">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Key size={18} className="text-blue-500" /> Login Credentials
            </h3>
          </div>

          <InputField
            label="Username"
            {...register("loginId")}
            error={errors.loginId?.message}
            isRequired
            placeholder="Create username"
            icon={User}
            autoComplete="off"
          />

          <InputField
            label="Password"
            type="password"
            {...register("password")}
            error={errors.password?.message}
            isRequired
            placeholder="Minimum 8 characters"
            autoComplete="new-password"
          />

          <div className="md:col-span-2 flex items-end">
            <Button
              type="button"
              onClick={generatePartnerCredentials}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Key size={16} className="mr-2" /> Generate Username
            </Button>
          </div>
        </div>

        {/* Required Document Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="md:col-span-3 pb-2 border-b border-gray-100 mb-2">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <FileText size={18} className="text-blue-500" /> Required Documents Upload
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Upload all required documents based on selected constitution type.
            </p>
          </div>

          {requiredDocumentTypes.map((docType) => (
            <div key={docType}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {docType.replace(/_/g, " ")}
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(event) => onDocumentChange(docType, event)}
                className="block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {documentFiles[docType] ? (
                <p className="text-xs text-green-600 mt-1">{documentFiles[docType].name}</p>
              ) : null}
            </div>
          ))}
        </div>

        {/* Business Profile Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="md:col-span-3 pb-2 border-b border-gray-100 mb-2">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Briefcase size={18} className="text-blue-500" /> Business Profile
            </h3>
          </div>

          <InputField
            label="Nature of Business"
            {...register("natureOfBusiness")}
            placeholder="e.g. Financial Services"
          />

          <InputField
            label="Years in Business"
            {...register("yearsInBusiness")}
            type="number"
            placeholder="e.g. 5"
          />

          <InputField
            label="Product Expertise"
            {...register("productExpertise")}
            placeholder="e.g. Home Loans, Personal Loans"
          />

          <InputField
            label="Monthly Sourcing Volume"
            {...register("monthlySourcingVolume")}
            type="number"
            placeholder="e.g. 50"
          />

          <InputField
            label="Geographic Coverage"
            {...register("geographicCoverage")}
            placeholder="e.g. Maharashtra, Gujarat"
          />

          <InputField
            label="Existing Lender Relationships"
            {...register("existingLenderRelationships")}
            placeholder="e.g. HDFC, ICICI"
          />

          <InputField
            label="Total Employees"
            {...register("totalEmployees")}
            type="number"
            placeholder="e.g. 25"
          />

          <div className="md:col-span-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("digitalApiIntegration")}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Digital API Integration Available</span>
            </label>
          </div>
        </div>

        {/* Business Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="md:col-span-3 pb-2 border-b border-gray-100 mb-2">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-500" /> Business Metrics
            </h3>
          </div>

          <InputField
            label="Established Year"
            {...register("establishedYear")}
            type="number"
            placeholder="e.g. 2015"
          />

          <InputField
            label="Specialization"
            {...register("specialization")}
            placeholder="e.g. Home Loans Specialist"
          />

          <InputField
            label="Annual Turnover"
            {...register("annualTurnover")}
            type="number"
            step="0.01"
            placeholder="e.g. 5000000"
          />

          <InputField
            label="Business Registration Number"
            {...register("businessRegistrationNumber")}
            placeholder="e.g. REG123456"
          />

          <InputField
            label="Target Area"
            {...register("targetArea")}
            placeholder="e.g. South Mumbai"
          />
        </div>

        {/* Commission & Payout Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="md:col-span-3 pb-2 border-b border-gray-100 mb-2">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Banknote size={18} className="text-blue-500" /> Commission & Payout
            </h3>
          </div>

          <Controller
            name="commissionType"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Commission Type"
                options={commissionTypeOptions}
                value={field.value}
                onChange={field.onChange}
                isRequired
              />
            )}
          />

          <InputField
            label="Commission Value"
            {...register("commissionValue")}
            type="number"
            step="0.01"
            placeholder="e.g. 5 for 5% or 1000 for fixed"
          />

          <Controller
            name="paymentCycle"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Payment Cycle"
                options={paymentCycleOptions}
                value={field.value}
                onChange={field.onChange}
                isRequired
              />
            )}
          />

          <InputField
            label="Minimum Payout"
            {...register("minimumPayout")}
            type="number"
            step="0.01"
            placeholder="e.g. 1000"
          />

          <InputField
            label="Tax Deduction (%)"
            {...register("taxDeduction")}
            type="number"
            step="0.01"
            placeholder="e.g. 10"
          />

          <Controller
            name="payoutType"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Payout Type"
                options={payoutTypeOptions}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <InputField
            label="Product Payout Rates (JSON)"
            {...register("productPayoutRates")}
            placeholder='{"HL": 0.5, "PL": 0.3}'
          />

          <InputField
            label="ROI Processing Share (%)"
            {...register("roiProcessingShare")}
            type="number"
            step="0.01"
            placeholder="e.g. 0.5"
          />

          <Controller
            name="payoutFrequency"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Payout Frequency"
                options={payoutFrequencyOptions}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <div className="md:col-span-2">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("gstApplicable")}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">GST Applicable</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("tdsApplicable")}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">TDS Applicable</span>
              </label>
            </div>
          </div>

          <InputField
            label="Incentive Schemes (JSON)"
            {...register("incentiveSchemes")}
            placeholder='{"scheme1": 1000, "scheme2": 2000}'
          />

          <InputField
            label="Clawback Terms"
            {...register("clawbackTerms")}
            placeholder="e.g. 6 months clawback period"
          />

          <InputField
            label="Max Payout Cap"
            {...register("maxPayoutCap")}
            type="number"
            placeholder="e.g. 100000"
          />
        </div>

        {/* Form Actions */}
        <div className="mt-8 flex justify-between pt-6 border-t border-gray-100">
          <Button
            type="button"
            onClick={onCancel}
            className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-none"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isSubmitting ? "Processing..." : (isEditing ? "Update Partner" : "Add Partner")}
          </Button>
        </div>
      </form>
    </div>
  );
}