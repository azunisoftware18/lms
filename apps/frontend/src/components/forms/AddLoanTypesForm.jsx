import { useEffect, useMemo } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import {
  Info,
  Percent,
  Users,
  Shield,
  Eye,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Home,
  Car,
  GraduationCap,
  Gem,
  User,
  FileText,
  Clock,
  CreditCard,
  IndianRupee,
  Building,
  DollarSign,
  BadgeCheck,
  Calendar,
  Settings,
} from "lucide-react";
import toast from "react-hot-toast";
import { useCreateLoanType, useUpdateLoanType } from "../../hooks/useLoanType";
import InputField from "../ui/InputField";
import ToggleSwitch from "../ui/ToggleSwitch";
import TextAreaField from "../ui/TextAreaField";
import SelectField from "../ui/SelectField";
import Button from "../ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { loanTypeSchema } from "../../validations/LoanTypeValidation";

import { LOAN_CATEGORIES, DOCUMENT_OPTIONS } from "../../constants/loanType";

const APPLICANT_DOCUMENT_OPTIONS = DOCUMENT_OPTIONS.filter(
  (opt) =>
    !opt.value.startsWith("CO_APPLICANT_") &&
    !opt.value.startsWith("GUARANTOR_"),
);

const CO_APPLICANT_DOCUMENT_OPTIONS = DOCUMENT_OPTIONS.filter(
  (opt) =>
    !opt.value.startsWith("APPLICANT_") && !opt.value.startsWith("GUARANTOR_"),
);

const GUARANTOR_DOCUMENT_OPTIONS = DOCUMENT_OPTIONS.filter(
  (opt) =>
    !opt.value.startsWith("APPLICANT_") &&
    !opt.value.startsWith("CO_APPLICANT_"),
);

const INTEREST_TYPES = [
  { value: "FLAT", label: "Flat" },
  { value: "REDUCING", label: "Reducing Balance" },
];

const PROCESSING_FEE_TYPES = [
  { value: "PERCENTAGE", label: "Percentage" },
  { value: "FIXED", label: "Fixed Amount" },
];

const EMPLOYMENT_TYPES = [
  { value: "salaried", label: "Salaried" },
  { value: "self_employed", label: "Self-Employed" },
];

const normalizeInterestType = (value) => {
  const raw = String(value || "")
    .trim()
    .toUpperCase();
  if (raw === "FLAT") return "FLAT";
  if (raw === "REDUCING" || raw === "REDUCING_BALANCE") return "REDUCING";
  return raw;
};

const normalizeProcessingFeeType = (value) => {
  const raw = String(value || "")
    .trim()
    .toUpperCase();
  if (raw === "FIXED" || raw === "FIXED_AMOUNT") return "FIXED";
  if (raw === "PERCENTAGE") return "PERCENTAGE";
  return raw;
};

const toNumberOrUndefined = (value) => {
  if (value === "" || value === null || value === undefined) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

export default function AddLoanTypesForm({ onClose, editData }) {
  const createLoanTypeMutation = useCreateLoanType();
  const updateLoanTypeMutation = useUpdateLoanType();

  const interestTypes = INTEREST_TYPES;

  const chargeTypes = PROCESSING_FEE_TYPES;
  const employmentTypes = EMPLOYMENT_TYPES;

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: zodResolver(loanTypeSchema),
    mode: "onChange",
    defaultValues: {
      loanCode: "",
      loanName: "",
      loanCategory: "",
      securedLoan: false,
      description: "",
      minLoanAmount: "",
      maxLoanAmount: "",
      minTenure: "",
      maxTenure: "",
      interestType: "FLAT",
      minInterestRate: "",
      maxInterestRate: "",
      defaultInterestRate: "",
      minProcessingFee: "",
      maxProcessingFee: "",
      minLoginCharges: "",
      defaultLoginCharges: "",
      maxLoginCharges: "",
      gstApplicable: false,
      gstPercentage: "",
      minAge: "",
      maxAge: "",
      minMonthlyIncome: "",
      employmentType: "",
      minCibilScore: "",
      maxCibilScore: "",
      maxLoanToValueRatio: "",
      prepaymentAllowed: false,
      foreclosureAllowed: false,
      prepaymentCharges: "",
      foreclosureCharges: "",
      latePaymentFeeType: "",
      latePaymentFee: "",
      bounceCharges: "",
      activeStatus: true,
      publicVisibility: true,
      approvalRequired: true,
      estimatedProcessingTimeDays: "",
      applicantDocumentsRequired: [],
      applicantDocumentsOptional: [],
      coApplicantDocumentsRequired: [],
      coApplicantDocumentsOptional: [],
      guarantorDocumentsRequired: [],
      guarantorDocumentsOptional: [],
      otherDocumentsRequired: [],
      otherDocumentsOptions: [],
    },
  });

  // Watch values for conditional rendering
  const watchLoanCategory = useWatch({ control, name: "loanCategory" });
  const watchGstApplicable = useWatch({ control, name: "gstApplicable" });
  const watchSecuredLoan = useWatch({ control, name: "securedLoan" });
  const watchPrepaymentAllowed = useWatch({
    control,
    name: "prepaymentAllowed",
  });
  const watchForeclosureAllowed = useWatch({
    control,
    name: "foreclosureAllowed",
  });
  const watchApplicantDocumentsRequired = useWatch({
    control,
    name: "applicantDocumentsRequired",
  });
  const watchApplicantDocumentsOptional = useWatch({
    control,
    name: "applicantDocumentsOptional",
  });
  const watchCoApplicantDocumentsRequired = useWatch({
    control,
    name: "coApplicantDocumentsRequired",
  });
  const watchCoApplicantDocumentsOptional = useWatch({
    control,
    name: "coApplicantDocumentsOptional",
  });
  const watchGuarantorDocumentsRequired = useWatch({
    control,
    name: "guarantorDocumentsRequired",
  });
  const watchGuarantorDocumentsOptional = useWatch({
    control,
    name: "guarantorDocumentsOptional",
  });
  const watchOtherDocumentsRequired = useWatch({
    control,
    name: "otherDocumentsRequired",
  });
  const watchOtherDocumentsOptions = useWatch({
    control,
    name: "otherDocumentsOptions",
  });

  const applicantOptionalOptions = useMemo(
    () =>
      APPLICANT_DOCUMENT_OPTIONS.filter(
        (option) => !watchApplicantDocumentsRequired?.includes(option.value),
      ),
    [watchApplicantDocumentsRequired],
  );

  const coApplicantOptionalOptions = useMemo(
    () =>
      CO_APPLICANT_DOCUMENT_OPTIONS.filter(
        (option) => !watchCoApplicantDocumentsRequired?.includes(option.value),
      ),
    [watchCoApplicantDocumentsRequired],
  );

  const guarantorOptionalOptions = useMemo(
    () =>
      GUARANTOR_DOCUMENT_OPTIONS.filter(
        (option) => !watchGuarantorDocumentsRequired?.includes(option.value),
      ),
    [watchGuarantorDocumentsRequired],
  );

  // Set edit data
  useEffect(() => {
    if (editData) {
      reset({
        loanCode: editData.code || "",
        loanName: editData.name || "",
        loanCategory: editData.category || "",
        securedLoan: editData.secured || false,
        description: editData.description || "",
        minLoanAmount: editData.minAmount || "",
        maxLoanAmount: editData.maxAmount || "",
        minTenure: editData.minTenureMonths || "",
        maxTenure: editData.maxTenureMonths || "",
        interestType: editData.interestType || "FLAT",
        minInterestRate: editData.minInterestRate || "",
        maxInterestRate: editData.maxInterestRate || "",
        defaultInterestRate: editData.defaultInterestRate || "",

        minProcessingFee: editData.minProcessingFee || "",
        maxProcessingFee: editData.maxProcessingFee || "",
        minLoginCharges: editData.minLoginCharges || "",
        defaultLoginCharges: editData.defaultLoginCharges || "",
        maxLoginCharges: editData.maxLoginCharges || "",
        gstApplicable: editData.gstApplicable || false,
        gstPercentage: editData.gstPercentage || "",
        minAge: editData.minAge || "",
        maxAge: editData.maxAge || "",
        minMonthlyIncome: editData.minIncome || "",
        employmentType: editData.employmentType || "",
        minCibilScore: editData.minCibilScore || "",
        maxCibilScore: editData.maxCibilScore || "",
        maxLoanToValueRatio: editData.maxLoanToValueRatio || "",
        prepaymentAllowed: editData.prepaymentAllowed || false,
        foreclosureAllowed: editData.foreclosureAllowed || false,
        prepaymentCharges: editData.prepaymentCharges || "",
        foreclosureCharges: editData.foreclosureCharges || "",
        latePaymentFeeType: editData.latePaymentFeeType || "",
        latePaymentFee: editData.latePaymentFee || "",
        bounceCharges: editData.bounceCharges || "",
        activeStatus: editData.isActive ?? true,
        publicVisibility: editData.isPublic ?? true,
        approvalRequired: editData.approvalRequired ?? true,
        estimatedProcessingTimeDays: editData.estimatedProcessingTimeDays || "",
        applicantDocumentsRequired: editData.applicantDocumentsRequired
          ? editData.applicantDocumentsRequired.split(",")
          : [],
        applicantDocumentsOptional: editData.applicantDocumentsOptional
          ? editData.applicantDocumentsOptional.split(",")
          : [],
        coApplicantDocumentsRequired: editData.coApplicantDocumentsRequired
          ? editData.coApplicantDocumentsRequired.split(",")
          : [],
        coApplicantDocumentsOptional: editData.coApplicantDocumentsOptional
          ? editData.coApplicantDocumentsOptional.split(",")
          : [],
        guarantorDocumentsRequired: editData.guarantorDocumentsRequired
          ? editData.guarantorDocumentsRequired.split(",")
          : [],
        guarantorDocumentsOptional: editData.guarantorDocumentsOptional
          ? editData.guarantorDocumentsOptional.split(",")
          : [],
        otherDocumentsRequired: editData.otherDocumentsRequired
          ? editData.otherDocumentsRequired.split(",")
          : [],
        otherDocumentsOptions: editData.otherDocumentsOptions
          ? editData.otherDocumentsOptions.split(",")
          : [],
      });
    }
  }, [editData, reset]);

  useEffect(() => {
    const nextOptional = (watchApplicantDocumentsOptional || []).filter(
      (doc) => !watchApplicantDocumentsRequired?.includes(doc),
    );
    if (
      nextOptional.length !== (watchApplicantDocumentsOptional || []).length
    ) {
      setValue("applicantDocumentsOptional", nextOptional, {
        shouldValidate: true,
      });
    }
  }, [
    watchApplicantDocumentsRequired,
    watchApplicantDocumentsOptional,
    setValue,
  ]);

  useEffect(() => {
    const nextOptional = (watchCoApplicantDocumentsOptional || []).filter(
      (doc) => !watchCoApplicantDocumentsRequired?.includes(doc),
    );
    if (
      nextOptional.length !== (watchCoApplicantDocumentsOptional || []).length
    ) {
      setValue("coApplicantDocumentsOptional", nextOptional, {
        shouldValidate: true,
      });
    }
  }, [
    watchCoApplicantDocumentsRequired,
    watchCoApplicantDocumentsOptional,
    setValue,
  ]);

  useEffect(() => {
    const nextOptional = (watchGuarantorDocumentsOptional || []).filter(
      (doc) => !watchGuarantorDocumentsRequired?.includes(doc),
    );
    if (
      nextOptional.length !== (watchGuarantorDocumentsOptional || []).length
    ) {
      setValue("guarantorDocumentsOptional", nextOptional, {
        shouldValidate: true,
      });
    }
  }, [
    watchGuarantorDocumentsRequired,
    watchGuarantorDocumentsOptional,
    setValue,
  ]);

  // Generate loan code based on category
  useEffect(() => {
    if (watchLoanCategory) {
      const category = LOAN_CATEGORIES.find(
        (c) => c.value === watchLoanCategory,
      );
      const prefix = category?.label.substring(0, 3).toUpperCase() || "LON";
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setValue("loanCode", `${prefix}-${randomNum}`);
    }
  }, [watchLoanCategory, setValue]);

  const onSubmit = async (data) => {
    const payload = {
      code: data.loanCode,
      name: data.loanName,
      category: data.loanCategory,
      secured: data.securedLoan,
      description: data.description || undefined,
      minAmount: Number(data.minLoanAmount),
      maxAmount: Number(data.maxLoanAmount),
      minTenureMonths: Number(data.minTenure),
      maxTenureMonths: Number(data.maxTenure),
      interestType: normalizeInterestType(data.interestType),
      minInterestRate: Number(data.minInterestRate),
      maxInterestRate: Number(data.maxInterestRate),
      defaultInterestRate: Number(data.defaultInterestRate),

      minProcessingFee: data.minProcessingFee
        ? Number(data.minProcessingFee)
        : undefined,
      maxProcessingFee: data.maxProcessingFee
        ? Number(data.maxProcessingFee)
        : undefined,
      minLoginCharges: data.minLoginCharges
        ? Number(data.minLoginCharges)
        : undefined,
        defaultLoginCharges: data.defaultLoginCharges
          ? Number(data.defaultLoginCharges)
          : undefined,

      maxLoginCharges: data.maxLoginCharges
        ? Number(data.maxLoginCharges)
        : undefined,
      gstApplicable: data.gstApplicable,
      gstPercentage:
        data.gstApplicable && data.gstPercentage
          ? Number(data.gstPercentage)
          : undefined,
      minAge: Number(data.minAge),
      maxAge: Number(data.maxAge),
      minIncome: data.minMonthlyIncome
        ? Number(data.minMonthlyIncome)
        : undefined,
      employmentType: data.employmentType || undefined,
      minCibilScore: data.minCibilScore
        ? Number(data.minCibilScore)
        : undefined,
      maxCibilScore: data.maxCibilScore
        ? Number(data.maxCibilScore)
        : undefined,
      maxLoanToValueRatio: watchSecuredLoan
        ? toNumberOrUndefined(data.maxLoanToValueRatio)
        : undefined,
      prepaymentAllowed: data.prepaymentAllowed,
      foreclosureAllowed: data.foreclosureAllowed,
      prepaymentCharges:
        data.prepaymentAllowed && data.prepaymentCharges
          ? Number(data.prepaymentCharges)
          : undefined,
      foreclosureCharges:
        data.foreclosureAllowed && data.foreclosureCharges
          ? Number(data.foreclosureCharges)
          : undefined,
      latePaymentFeeType: data.latePaymentFeeType
        ? normalizeProcessingFeeType(data.latePaymentFeeType)
        : undefined,
      latePaymentFee: toNumberOrUndefined(data.latePaymentFee),
      bounceCharges: toNumberOrUndefined(data.bounceCharges),
      isActive: data.activeStatus,
      isPublic: data.publicVisibility,
      approvalRequired: data.approvalRequired,
      estimatedProcessingTimeDays: data.estimatedProcessingTimeDays
        ? Number(data.estimatedProcessingTimeDays)
        : undefined,
      applicantDocumentsRequired: data.applicantDocumentsRequired.join(","),
      applicantDocumentsOptional: data.applicantDocumentsOptional.length
        ? data.applicantDocumentsOptional.join(",")
        : undefined,
      coApplicantDocumentsRequired: data.coApplicantDocumentsRequired.join(","),
      coApplicantDocumentsOptional: data.coApplicantDocumentsOptional.length
        ? data.coApplicantDocumentsOptional.join(",")
        : undefined,
      guarantorDocumentsRequired: data.guarantorDocumentsRequired.join(","),
      guarantorDocumentsOptional: data.guarantorDocumentsOptional.length
        ? data.guarantorDocumentsOptional.join(",")
        : undefined,
      otherDocumentsRequired: data.otherDocumentsRequired.join(","),
      otherDocumentsOptions: data.otherDocumentsOptions.length
        ? data.otherDocumentsOptions.join(",")
        : undefined,
    };

    try {
      if (editData) {
        await updateLoanTypeMutation.mutateAsync({
          id: editData.id,
          data: payload,
        });
        toast.success("Loan Type updated successfully");
      } else {
        await createLoanTypeMutation.mutateAsync(payload);
        toast.success("Loan Type created successfully");
      }
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Operation failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Header - Now part of the form but styled consistently */}
      <div className="px-6 py-4 border-b border-gray-200 bg-linear-to-r from-gray-50 to-white">
        <h2 className="text-xl font-semibold text-gray-900">
          {editData ? "Edit Loan Type" : "Create New Loan Type"}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Fill in the details below to {editData ? "update" : "create"} a loan
          product
        </p>
      </div>

      {/* Form Content */}
      <div className="p-6 space-y-6 max-h-[calc(90vh-180px)] overflow-y-auto">
        {/* Section 1: Basic Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              Basic Information
            </h3>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                name="loanCode"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Loan Code"
                    {...field}
                    readOnly
                    className="bg-gray-50 cursor-not-allowed"
                    icon={FileText}
                  />
                )}
              />

              <Controller
                name="loanName"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Loan Name"
                    placeholder="Enter loan product name"
                    error={errors.loanName?.message}
                    isRequired
                    icon={BadgeCheck}
                    {...field}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Loan Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {LOAN_CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  const isSelected = watchLoanCategory === category.value;
                  return (
                    <button
                      key={category.value}
                      type="button"
                      onClick={() =>
                        setValue("loanCategory", category.value, {
                          shouldValidate: true,
                        })
                      }
                      className={`p-3 border-2 rounded-lg text-center transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 mx-auto mb-1 ${isSelected ? "text-blue-600" : "text-gray-600"}`}
                      />
                      <span className="text-xs font-medium">
                        {category.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              {errors.loanCategory && (
                <p className="text-red-500 text-xs flex items-center mt-1">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.loanCategory.message}
                </p>
              )}
            </div>

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextAreaField
                  label="Description (optional)"
                  placeholder="Enter a brief description of this loan product..."
                  rows={2}
                  maxLength={500}
                  error={errors.description?.message}
                  {...field}
                />
              )}
            />

            <div className="pt-2 border-t border-gray-100">
              <Controller
                name="securedLoan"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ToggleSwitch
                    label="Secured Loan"
                    checked={value}
                    onChange={onChange}
                    description="Requires collateral or security"
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Loan Amount & Tenure */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <IndianRupee className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              Loan Amount & Tenure
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="minLoanAmount"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Minimum Loan Amount"
                  type="number"
                  placeholder="0.00"
                  error={errors.minLoanAmount?.message}
                  isRequired
                  icon={IndianRupee}
                  {...field}
                />
              )}
            />

            <Controller
              name="maxLoanAmount"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Maximum Loan Amount"
                  type="number"
                  placeholder="0.00"
                  error={errors.maxLoanAmount?.message}
                  isRequired
                  icon={IndianRupee}
                  {...field}
                />
              )}
            />

            <Controller
              name="minTenure"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Minimum Tenure (months)"
                  type="number"
                  placeholder="0"
                  error={errors.minTenure?.message}
                  isRequired
                  icon={Calendar}
                  {...field}
                />
              )}
            />

            <Controller
              name="maxTenure"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Maximum Tenure (months)"
                  type="number"
                  placeholder="0"
                  error={errors.maxTenure?.message}
                  isRequired
                  icon={Calendar}
                  {...field}
                />
              )}
            />

            {watchSecuredLoan && (
              <Controller
                name="maxLoanToValueRatio"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Max Loan To Value Ratio (%)"
                    type="number"
                    placeholder="e.g., 80"
                    error={errors.maxLoanToValueRatio?.message}
                    icon={Percent}
                    {...field}
                  />
                )}
              />
            )}
          </div>
        </div>

        {/* Section 3: Interest Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Percent className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              Interest Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="interestType"
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Interest Type"
                  options={interestTypes}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.interestType?.message}
                />
              )}
            />

            <Controller
              name="minInterestRate"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Minimum Interest Rate (%)"
                  type="number"
                  placeholder="0.00"
                  error={errors.minInterestRate?.message}
                  icon={Percent}
                  {...field}
                />
              )}
            />

            <Controller
              name="maxInterestRate"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Maximum Interest Rate (%)"
                  type="number"
                  placeholder="0.00"
                  error={errors.maxInterestRate?.message}
                  icon={Percent}
                  {...field}
                />
              )}
            />

            <Controller
              name="defaultInterestRate"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Default Interest Rate (%)"
                  type="number"
                  placeholder="0.00"
                  error={errors.defaultInterestRate?.message}
                  icon={Percent}
                  {...field}
                />
              )}
            />
          </div>
        </div>

        {/* Section 4: Processing Fee & Tax */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              Processing Fee & Tax
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Controller
                name="gstApplicable"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ToggleSwitch
                    label="GST Applicable"
                    checked={value}
                    onChange={onChange}
                    description="Goods and Services Tax"
                  />
                )}
              />

              {watchGstApplicable && (
                <Controller
                  name="gstPercentage"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="GST Percentage (%)"
                      type="number"
                      placeholder="0.00"
                      error={errors.gstPercentage?.message}
                      icon={Percent}
                      {...field}
                    />
                  )}
                />
              )}
            </div>

            {/* New fields: min/max processing fee and min/max login charges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <Controller
                name="minProcessingFee"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Minimum Processing Fee"
                    type="number"
                    placeholder="0.00"
                    error={errors.minProcessingFee?.message}
                    icon={IndianRupee}
                    {...field}
                  />
                )}
              />

              <Controller
                name="maxProcessingFee"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Maximum Processing Fee"
                    type="number"
                    placeholder="0.00"
                    error={errors.maxProcessingFee?.message}
                    icon={IndianRupee}
                    {...field}
                  />
                )}
              />

              <Controller
                name="minLoginCharges"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Minimum Login Charges"
                    type="number"
                    placeholder="0.00"
                    error={errors.minLoginCharges?.message}
                    icon={IndianRupee}
                    {...field}
                  />
                )}
              />
              <Controller
                name="defaultLoginCharges"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Default Login Charges"
                    type="number"
                    placeholder="0.00"
                    error={errors.defaultLoginCharges?.message}
                    icon={IndianRupee}
                    {...field}
                  />
                )}
              />

              <Controller
                name="maxLoginCharges"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Maximum Login Charges"
                    type="number"
                    placeholder="0.00"
                    error={errors.maxLoginCharges?.message}
                    icon={IndianRupee}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Section 5: Eligibility Criteria */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              Eligibility Criteria
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="minAge"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Minimum Age"
                  type="number"
                  placeholder="18"
                  error={errors.minAge?.message}
                  isRequired
                  icon={User}
                  {...field}
                />
              )}
            />

            <Controller
              name="maxAge"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Maximum Age"
                  type="number"
                  placeholder="65"
                  error={errors.maxAge?.message}
                  isRequired
                  icon={User}
                  {...field}
                />
              )}
            />

            <Controller
              name="minMonthlyIncome"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Minimum Monthly Income"
                  type="number"
                  placeholder="0.00"
                  error={errors.minMonthlyIncome?.message}
                  icon={IndianRupee}
                  {...field}
                />
              )}
            />

            <Controller
              name="employmentType"
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Employment Type"
                  options={employmentTypes}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.employmentType?.message}
                />
              )}
            />

            <Controller
              name="minCibilScore"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Minimum CIBIL Score"
                  type="number"
                  placeholder="300"
                  error={errors.minCibilScore?.message}
                  icon={CreditCard}
                  {...field}
                />
              )}
            />

            <Controller
              name="maxCibilScore"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Maximum CIBIL Score"
                  type="number"
                  placeholder="900"
                  error={errors.maxCibilScore?.message}
                  icon={CreditCard}
                  {...field}
                />
              )}
            />
          </div>
        </div>

        {/* Section 6: Loan Rules */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Loan Rules</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                name="prepaymentAllowed"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ToggleSwitch
                    label="Prepayment Allowed"
                    checked={value}
                    onChange={onChange}
                    description="Allow early partial repayment"
                  />
                )}
              />

              <Controller
                name="foreclosureAllowed"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ToggleSwitch
                    label="Foreclosure Allowed"
                    checked={value}
                    onChange={onChange}
                    description="Allow complete early repayment"
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {watchPrepaymentAllowed && (
                <Controller
                  name="prepaymentCharges"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="Prepayment Charges (%)"
                      type="number"
                      placeholder="0.00"
                      error={errors.prepaymentCharges?.message}
                      icon={Percent}
                      {...field}
                    />
                  )}
                />
              )}

              {watchForeclosureAllowed && (
                <Controller
                  name="foreclosureCharges"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="Foreclosure Charges (%)"
                      type="number"
                      placeholder="0.00"
                      error={errors.foreclosureCharges?.message}
                      icon={Percent}
                      {...field}
                    />
                  )}
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Controller
                name="latePaymentFeeType"
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Late Payment Fee Type"
                    options={chargeTypes}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select fee type"
                    error={errors.latePaymentFeeType?.message}
                  />
                )}
              />

              <Controller
                name="latePaymentFee"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Late Payment Fee"
                    type="number"
                    placeholder="0.00"
                    error={errors.latePaymentFee?.message}
                    icon={IndianRupee}
                    {...field}
                  />
                )}
              />

              <Controller
                name="bounceCharges"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Bounce Charges"
                    type="number"
                    placeholder="0.00"
                    error={errors.bounceCharges?.message}
                    icon={IndianRupee}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Section 7: Documents */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-teal-100 rounded-lg">
              <FileText className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Documents</h3>
          </div>

          <div className="space-y-5">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Applicant Documents
              </h4>
              <div className="space-y-3">
                <SelectField
                  label="Required"
                  options={APPLICANT_DOCUMENT_OPTIONS}
                  value={watchApplicantDocumentsRequired || []}
                  onChange={(value) =>
                    setValue("applicantDocumentsRequired", value || [], {
                      shouldValidate: true,
                    })
                  }
                  isMulti
                  isSearchable
                  placeholder="Select required applicant documents"
                  error={errors.applicantDocumentsRequired?.message}
                  className="bg-white rounded-lg"
                />

                <SelectField
                  label="Optional"
                  options={applicantOptionalOptions}
                  value={watchApplicantDocumentsOptional || []}
                  onChange={(value) =>
                    setValue("applicantDocumentsOptional", value || [], {
                      shouldValidate: true,
                    })
                  }
                  isMulti
                  isSearchable
                  placeholder="Select optional applicant documents"
                  error={errors.applicantDocumentsOptional?.message}
                  className="bg-white rounded-lg"
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                Co-Applicant Documents
              </h4>
              <div className="space-y-3">
                <SelectField
                  label="Required"
                  options={CO_APPLICANT_DOCUMENT_OPTIONS}
                  value={watchCoApplicantDocumentsRequired || []}
                  onChange={(value) =>
                    setValue("coApplicantDocumentsRequired", value || [], {
                      shouldValidate: true,
                    })
                  }
                  isMulti
                  isSearchable
                  placeholder="Select required co-applicant documents"
                  error={errors.coApplicantDocumentsRequired?.message}
                  className="bg-white rounded-lg"
                />

                <SelectField
                  label="Optional"
                  options={coApplicantOptionalOptions}
                  value={watchCoApplicantDocumentsOptional || []}
                  onChange={(value) =>
                    setValue("coApplicantDocumentsOptional", value || [], {
                      shouldValidate: true,
                    })
                  }
                  isMulti
                  isSearchable
                  placeholder="Select optional co-applicant documents"
                  error={errors.coApplicantDocumentsOptional?.message}
                  className="bg-white rounded-lg"
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                Guarantor Documents
              </h4>
              <div className="space-y-3">
                <SelectField
                  label="Required"
                  options={GUARANTOR_DOCUMENT_OPTIONS}
                  value={watchGuarantorDocumentsRequired || []}
                  onChange={(value) =>
                    setValue("guarantorDocumentsRequired", value || [], {
                      shouldValidate: true,
                    })
                  }
                  isMulti
                  isSearchable
                  placeholder="Select required guarantor documents"
                  error={errors.guarantorDocumentsRequired?.message}
                  className="bg-white rounded-lg"
                />

                <SelectField
                  label="Optional"
                  options={guarantorOptionalOptions}
                  value={watchGuarantorDocumentsOptional || []}
                  onChange={(value) =>
                    setValue("guarantorDocumentsOptional", value || [], {
                      shouldValidate: true,
                    })
                  }
                  isMulti
                  isSearchable
                  placeholder="Select optional guarantor documents"
                  error={errors.guarantorDocumentsOptional?.message}
                  className="bg-white rounded-lg"
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                Other Documents
              </h4>
              <div className="space-y-3">
                <SelectField
                  label="Required"
                  options={DOCUMENT_OPTIONS}
                  value={watchOtherDocumentsRequired || []}
                  onChange={(value) =>
                    setValue("otherDocumentsRequired", value || [], {
                      shouldValidate: true,
                    })
                  }
                  isMulti
                  isSearchable
                  placeholder="Select other required documents"
                  error={errors.otherDocumentsRequired?.message}
                  className="bg-white rounded-lg"
                />

                <SelectField
                  label="Options"
                  options={DOCUMENT_OPTIONS}
                  value={watchOtherDocumentsOptions || []}
                  onChange={(value) =>
                    setValue("otherDocumentsOptions", value || [], {
                      shouldValidate: true,
                    })
                  }
                  isMulti
                  isSearchable
                  placeholder="Select other optional documents"
                  error={errors.otherDocumentsOptions?.message}
                  className="bg-white rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 8: Status & Visibility */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Eye className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              Status & Visibility
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Controller
                name="activeStatus"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ToggleSwitch
                    label="Active Status"
                    checked={value}
                    onChange={onChange}
                    description="Enable this loan product"
                  />
                )}
              />

              <Controller
                name="publicVisibility"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ToggleSwitch
                    label="Public Visibility"
                    checked={value}
                    onChange={onChange}
                    description="Show on customer portal"
                  />
                )}
              />

              <Controller
                name="approvalRequired"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ToggleSwitch
                    label="Approval Required"
                    checked={value}
                    onChange={onChange}
                    description="Requires manual approval"
                  />
                )}
              />
            </div>

            <div className="space-y-4">
              <Controller
                name="estimatedProcessingTimeDays"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Estimated Processing Time (days)"
                    type="number"
                    placeholder="e.g., 7"
                    error={errors.estimatedProcessingTimeDays?.message}
                    icon={Clock}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Actions */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-end gap-3">
          <Button type="button" onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              !isValid ||
              createLoanTypeMutation.isLoading ||
              updateLoanTypeMutation.isLoading
            }
            className="min-w-35"
          >
            {createLoanTypeMutation.isLoading ||
            updateLoanTypeMutation.isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{editData ? "Updating..." : "Creating..."}</span>
              </div>
            ) : editData ? (
              "Update Loan Type"
            ) : (
              "Create Loan Type"
            )}
          </Button>
        </div>

        {!isValid && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
              Please fill all required fields correctly to create the loan type
            </p>
          </div>
        )}
      </div>
    </form>
  );
}
