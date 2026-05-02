import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, ChevronRight, Plus, Trash2 } from "lucide-react";

import {
  useCreateLoanApplication,
  useLoanTypes,
} from "../../../hooks/useLoanApplication";
import createLoanApplicationSchema from "../../../validations/LoanApplicationValidation";
import {
  showError,
  showInfo,
  showSuccess,
} from "../../../lib/utils/toastService";

import Button from "../../ui/Button";
import InputField from "../../ui/InputField";
import SelectField from "../../ui/SelectField";
import { FormFooter, StepNavbar } from ".";
import ApplicantSection from "./sections/ApplicantSection";
import CoApplicantSection from "./sections/CoApplicantSection";
import GuarantorSection from "./sections/GuarantorSection";
import ReviewSection from "./sections/ReviewSection";
import SuccessScreen from "./sections/SuccessScreen";
import { SectionCard } from "./sharedFields";
import { personDefaults } from "./sharedUtils";
import {
  applyAadhaarProfile,
  applyPanProfile,
} from "../../../lib/utils/identityProfileHelper";

const STEPS = [
  { id: "applicant", label: "Applicant", shortLabel: "Applicant" },
  { id: "coApplicant", label: "Co-Applicant", shortLabel: "Co-App" },
  { id: "guarantor", label: "Guarantor", shortLabel: "Guarantor" },
  { id: "additional", label: "Additional", shortLabel: "Additional" },
  { id: "review", label: "Review", shortLabel: "Review" },
];

const STEP_FIELDS = {
  applicant: [
    "applicant.title",
    "applicant.firstName",
    "applicant.lastName",
    "applicant.fatherName",
    "applicant.motherName",
    "applicant.gender",
    "applicant.dob",
    "applicant.maritalStatus",
    "applicant.nationality",
    "applicant.category",
    "applicant.aadhaarNumber",
    "applicant.panNumber",
    "applicant.contactNumber",
    "applicant.employmentType",
    "addresses.currentAddress.addressLine1",
    "addresses.currentAddress.city",
    "addresses.currentAddress.district",
    "addresses.currentAddress.state",
    "addresses.currentAddress.pinCode",
    "loanTypeId",
    "loanRequirement.tenure",
    "loanRequirement.interestOption",
    "loanRequirement.loanPurpose",
    "loanRequirement.repaymentMethod",
    "loanRequirement.loanAmount",
    // Occupational / employment details are optional per backend schema
  ],
  coApplicant: [],
  guarantor: [],
  additional: [],
  review: [],
};

const DRAFT_KEY = "loan_app_draft_v5";

const DEFAULT_VALUES = {
  loanTypeId: "",
  leadNumber: "",
  applicant: {
    ...personDefaults(),
    nationality: "Indian",
    occupationalDetails: {
      occupationalCategory: "",
      companyBusinessName: "",
      address: {
        addressLine1: "",
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
      totalWorkExperience: "",
      noOfEmployees: "",
      commencementDate: "",
      businessType: "",
      businessTypeOther: "",
    },
    employmentDetails: {
      employerType: "",
      designation: "",
      department: "",
      dateOfJoining: "",
      dateOfRetirement: "",
    },
  },
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
  existingLoans: [],
  creditCards: [],
  bankAccounts: [],
  insurancePolicies: [],
  references: [],
  properties: [],
  loanRequirement: {
    restFrequency: "",
    interestOption: "",
    tenure: "",
    loanAmount: "",
    loanPurpose: "",
    loanPurposeOther: "",
    repaymentMethod: "",
  },
  questionnaire: {},
};

const normalizePayload = (data) => {
  const toNumber = (v) => {
    if (v === "" || v === null || v === undefined) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };
  const optionalString = (v) => {
    if (v === null || v === undefined) return undefined;
    const s = String(v).trim();
    return s ? s : undefined;
  };
  const formatDate = (v) => {
    if (!v) return undefined;
    if (typeof v === "string") return v;
    if (v instanceof Date) return v.toISOString().split("T")[0];
    const d = new Date(v);
    return isNaN(d.getTime()) ? undefined : d.toISOString().split("T")[0];
  };
  const cleanArray = (arr) =>
    (arr || []).filter(
      (item) =>
        item &&
        Object.values(item).some(
          (val) => val !== "" && val !== null && val !== undefined,
        ),
    );

  const deepIsEmpty = (val) => {
    if (val === null || val === undefined) return true;
    if (typeof val === "string") return val.trim() === "";
    if (typeof val === "number") return false;
    if (val instanceof Date) return isNaN(val.getTime());
    if (Array.isArray(val)) return val.length === 0 || val.every(deepIsEmpty);
    if (typeof val === "object") {
      return (
        Object.keys(val).length === 0 ||
        Object.values(val).every((v) => deepIsEmpty(v))
      );
    }
    return false;
  };

  const collectFinancial = (obj) => {
    const keys = [
      "grossMonthlyIncome",
      "netMonthlyIncome",
      "averageMonthlyExpenses",
      "savingBankBalance",
      "valueOfImmovableProperty",
      "currentBalanceInPF",
      "valueOfSharesSecurities",
      "fixedDeposits",
      "otherAssets",
      "totalAssets",
      "creditSocietyLoan",
      "employerLoan",
      "homeLoan",
      "pfLoan",
      "vehicleLoan",
      "personalLoan",
      "otherLoan",
      "totalLiabilities",
    ];
    const fin = {};
    keys.forEach((k) => {
      if (obj && obj[k] !== undefined && obj[k] !== "") {
        const n = toNumber(obj[k]);
        if (n !== undefined) fin[k] = n;
      }
    });
    return Object.keys(fin).length ? fin : undefined;
  };

  // applicant financial -> top-level financialDetails
  const applicant = { ...(data.applicant || {}) };
  applicant.dob = formatDate(applicant.dob);
  const applicantFinancial = collectFinancial(applicant);
  // remove financial keys from applicant copy
  [
    "grossMonthlyIncome",
    "netMonthlyIncome",
    "averageMonthlyExpenses",
    "savingBankBalance",
    "valueOfImmovableProperty",
    "currentBalanceInPF",
    "valueOfSharesSecurities",
    "fixedDeposits",
    "otherAssets",
    "totalAssets",
    "creditSocietyLoan",
    "employerLoan",
    "homeLoan",
    "pfLoan",
    "vehicleLoan",
    "personalLoan",
    "otherLoan",
    "totalLiabilities",
  ].forEach((k) => delete applicant[k]);

  const coApplicants = cleanArray(data.coApplicants).map((p) => {
    const copy = { ...p, dob: formatDate(p?.dob) };
    copy.drivingLicenceNo = optionalString(copy.drivingLicenceNo);
    copy.passportNumber = optionalString(copy.passportNumber);
    copy.panNumber = optionalString(copy.panNumber);
    copy.aadhaarNumber = optionalString(copy.aadhaarNumber);
    copy.voterId = optionalString(copy.voterId);
    copy.periodOfStay = optionalString(copy.periodOfStay);
    if (
      copy.noOfFamilyDependents !== undefined &&
      copy.noOfDependents === undefined
    ) {
      copy.noOfDependents = copy.noOfFamilyDependents;
    }
    delete copy.noOfFamilyDependents;
    const fin = collectFinancial(copy);
    if (fin) {
      copy.financialDetails = fin;
      [
        "grossMonthlyIncome",
        "netMonthlyIncome",
        "averageMonthlyExpenses",
        "savingBankBalance",
        "valueOfImmovableProperty",
        "currentBalanceInPF",
        "valueOfSharesSecurities",
        "fixedDeposits",
        "otherAssets",
        "totalAssets",
        "creditSocietyLoan",
        "employerLoan",
        "homeLoan",
        "pfLoan",
        "vehicleLoan",
        "personalLoan",
        "otherLoan",
        "totalLiabilities",
      ].forEach((k) => delete copy[k]);
    }
    const occupational = copy.occupationalDetails;
    if (occupational && deepIsEmpty(occupational))
      delete copy.occupationalDetails;
    return copy;
  });

  const guarantors = cleanArray(data.guarantors).map((p) => {
    const copy = { ...p, dob: formatDate(p?.dob) };
    copy.drivingLicenceNo = optionalString(copy.drivingLicenceNo);
    copy.drivingLicence = optionalString(copy.drivingLicence);
    copy.passportNumber = optionalString(copy.passportNumber);
    copy.panNumber = optionalString(copy.panNumber);
    copy.aadhaarNumber = optionalString(copy.aadhaarNumber);
    copy.voterId = optionalString(copy.voterId);
    copy.periodOfStay = optionalString(copy.periodOfStay);
    if (copy.drivingLicenceNo && !copy.drivingLicence) {
      copy.drivingLicence = copy.drivingLicenceNo;
    }
    if (copy.presentAccommodation && !copy.accommodationType) {
      copy.accommodationType = copy.presentAccommodation;
    }
    if (
      copy.noOfFamilyDependents !== undefined &&
      copy.noOfDependents === undefined
    ) {
      copy.noOfDependents = copy.noOfFamilyDependents;
    }
    delete copy.noOfFamilyDependents;
    const fin = collectFinancial(copy);
    if (fin) {
      copy.financialDetails = fin;
      [
        "grossMonthlyIncome",
        "netMonthlyIncome",
        "averageMonthlyExpenses",
        "savingBankBalance",
        "valueOfImmovableProperty",
        "currentBalanceInPF",
        "valueOfSharesSecurities",
        "fixedDeposits",
        "otherAssets",
        "totalAssets",
        "creditSocietyLoan",
        "employerLoan",
        "homeLoan",
        "pfLoan",
        "vehicleLoan",
        "personalLoan",
        "otherLoan",
        "totalLiabilities",
      ].forEach((k) => delete copy[k]);
    }
    const occupational = copy.occupationalDetails;
    if (occupational && deepIsEmpty(occupational))
      delete copy.occupationalDetails;
    return copy;
  });

  // Map applicant occupational/employment details to top-level shape expected by backend
  const mapOccupational = (occ) => {
    if (!occ || deepIsEmpty(occ)) return undefined;
    const out = {};
    if (occ.occupationalCategory)
      out.occupationalCategory = occ.occupationalCategory;
    if (occ.occupationalCategoryOther)
      out.occupationalCategoryOther = occ.occupationalCategoryOther;
    if (occ.companyBusinessName)
      out.companyBusinessName = occ.companyBusinessName;
    if (
      occ.address &&
      Object.values(occ.address).some(
        (v) => v !== "" && v !== null && v !== undefined,
      )
    )
      out.address = occ.address;
    if (occ.phoneNumber) out.phoneNumber = String(occ.phoneNumber);
    if (occ.extensionNumber) out.extensionNumber = String(occ.extensionNumber);
    if (occ.totalWorkExperience !== undefined && occ.totalWorkExperience !== "")
      out.totalWorkExperience = Number(occ.totalWorkExperience);
    if (occ.noOfEmployees !== undefined && occ.noOfEmployees !== "")
      out.noOfEmployees = Number(occ.noOfEmployees);
    if (occ.commencementDate)
      out.commencementDate = formatDate(occ.commencementDate);
    if (occ.professionalType) out.professionalType = occ.professionalType;
    if (occ.professionalTypeOther)
      out.professionalSpecify = occ.professionalTypeOther;
    if (occ.businessType) out.businessType = occ.businessType;
    if (occ.businessTypeOther) out.businessSpecify = occ.businessTypeOther;
    return Object.keys(out).length ? out : undefined;
  };

  const mapEmployment = (emp) => {
    if (!emp) return undefined;
    const out = {};
    if (emp.employerType) out.employerType = emp.employerType;
    if (emp.employerTypeOther) out.employerTypeOther = emp.employerTypeOther;
    if (emp.designation) out.designation = emp.designation;
    if (emp.department) out.department = emp.department;
    if (emp.dateOfJoining) out.dateOfJoining = formatDate(emp.dateOfJoining);
    if (emp.dateOfRetirement)
      out.dateOfRetirement = formatDate(emp.dateOfRetirement);
    return Object.keys(out).length ? out : undefined;
  };

  const applicantOccupational = mapOccupational(
    data.applicant?.occupationalDetails,
  );
  const applicantEmployment = mapEmployment(data.applicant?.employmentDetails);

  return {
    ...data,
    applicant,
    financialDetails: applicantFinancial || data.financialDetails,
    occupationalDetails: applicantOccupational || data.occupationalDetails,
    employmentDetails: applicantEmployment || data.employmentDetails,
    coApplicants,
    guarantors,
    loanRequirement: {
      ...data.loanRequirement,
      tenure: toNumber(data.loanRequirement?.tenure),
      loanAmount: toNumber(data.loanRequirement?.loanAmount),
    },
    existingLoans: cleanArray(data.existingLoans).map((loan) => ({
      ...loan,
      purpose: loan.purpose || undefined,
      disbursedAmount: toNumber(loan.disbursedAmount),
      emi: toNumber(loan.emi),
      balanceTerm: toNumber(loan.balanceTerm),
      balanceOutstanding: toNumber(loan.balanceOutstanding),
    })),
    creditCards: cleanArray(data.creditCards).map((card) => ({
      holderName: card.holderName,
      // backend expects lastFourDigits — derive from full cardNumber if provided
      lastFourDigits:
        (card.cardNumber && String(card.cardNumber).slice(-4)) ||
        card.lastFourDigits ||
        card.cardNo,
      holderSince: card.holderSince || card.cardHolderSince,
      issuingBank: card.issuingBank || undefined,
      creditLimit: toNumber(card.creditLimit),
      outstandingAmount: toNumber(card.outstandingAmount),
    })),
    bankAccounts: cleanArray(data.bankAccounts).map((b) => ({
      ...b,
      branchName: b.branchName || undefined,
      openingDate: formatDate(b.openingDate),
      balanceAmount: toNumber(b.balanceAmount),
    })),
    insurancePolicies: cleanArray(data.insurancePolicies),
    references: cleanArray(data.references).map((reference) => ({
      ...reference,
      contactNumber: reference.contactNumber || reference.phone,
      phone: reference.phone || reference.contactNumber,
      fatherName: reference.fatherName || undefined,
      relation: reference.relation || undefined,
      occupation: reference.occupation || undefined,
    })),
    properties: cleanArray(data.properties),
  };
};

function AdditionalSection({
  control,
  watch,
  setValue,
  requiredPaths = new Set(),
}) {
  const existingLoans = watch("existingLoans") || [];
  const creditCards = watch("creditCards") || [];
  const bankAccounts = watch("bankAccounts") || [];
  const insurancePolicies = watch("insurancePolicies") || [];
  const properties = watch("properties") || [];
  const references = watch("references") || [];

  const removeAt = (key, idx) => {
    setValue(
      key,
      (watch(key) || []).filter((__, i) => i !== idx),
    );
  };

  const addItem = (key, item) => {
    setValue(key, [...(watch(key) || []), item]);
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Loan Details" icon={FileText}>
        <div className="space-y-4">
          {existingLoans.map((_, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 gap-3 md:grid-cols-3 p-3 border border-slate-200 rounded-xl"
            >
              <Controller
                name={`existingLoans.${idx}.institutionName`}
                control={control}
                render={({ field }) => (
                  <InputField label="Institution Name" isRequired {...field} />
                )}
              />
              <Controller
                name={`existingLoans.${idx}.purpose`}
                control={control}
                render={({ field }) => (
                  <InputField label="Purpose" isRequired {...field} />
                )}
              />
              <Controller
                name={`existingLoans.${idx}.disbursedAmount`}
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Disbursed Amount (Rs.)"
                    type="number"
                    {...field}
                  />
                )}
              />
              <Controller
                name={`existingLoans.${idx}.emi`}
                control={control}
                render={({ field }) => (
                  <InputField label="EMI (Rs.)" type="number" {...field} />
                )}
              />
              <Controller
                name={`existingLoans.${idx}.balanceTerm`}
                control={control}
                render={({ field }) => (
                  <InputField label="Balance Term" {...field} />
                )}
              />
              <Controller
                name={`existingLoans.${idx}.balanceOutstanding`}
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Outstanding (Rs.)"
                    type="number"
                    {...field}
                  />
                )}
              />
              <Button
                type="button"
                onClick={() => removeAt("existingLoans", idx)}
                className="bg-red-50! text-red-600! border border-red-200 shadow-none! w-fit"
              >
                <Trash2 size={14} /> Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() =>
              addItem("existingLoans", {
                institutionName: "",
                purpose: "",
                disbursedAmount: "",
                emi: "",
                balanceTerm: "",
                balanceOutstanding: "",
              })
            }
            className="w-fit"
          >
            <Plus size={14} /> Add Loan Detail
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="Credit Card Details" icon={FileText}>
        <div className="space-y-4">
          {creditCards.map((_, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 gap-3 md:grid-cols-3 p-3 border border-slate-200 rounded-xl"
            >
              <Controller
                name={`creditCards.${idx}.holderName`}
                control={control}
                render={({ field }) => (
                  <InputField label="Holder Name" isRequired {...field} />
                )}
              />
              <Controller
                name={`creditCards.${idx}.cardNumber`}
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Credit Card Number"
                    isRequired
                    placeholder="4111 1111 1111 1111"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value.replace(/\D/g, "").slice(0, 19),
                      )
                    }
                  />
                )}
              />
              <Controller
                name={`creditCards.${idx}.holderSince`}
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Card Holder Since"
                    isRequired
                    type="date"
                    {...field}
                  />
                )}
              />
              <Controller
                name={`creditCards.${idx}.issuingBank`}
                control={control}
                render={({ field }) => (
                  <InputField label="Issuing Bank" isRequired {...field} />
                )}
              />
              <Controller
                name={`creditCards.${idx}.creditLimit`}
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Credit Limit (Rs.)"
                    type="number"
                    {...field}
                  />
                )}
              />
              <Controller
                name={`creditCards.${idx}.outstandingAmount`}
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Outstanding (Rs.)"
                    type="number"
                    {...field}
                  />
                )}
              />
              <Button
                type="button"
                onClick={() => removeAt("creditCards", idx)}
                className="bg-red-50! text-red-600! border border-red-200 shadow-none! w-fit"
              >
                <Trash2 size={14} /> Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() =>
              addItem("creditCards", {
                holderName: "",
                cardNumber: "",
                holderSince: "",
                issuingBank: "",
                creditLimit: "",
                outstandingAmount: "",
              })
            }
            className="w-fit"
          >
            <Plus size={14} /> Add Credit Card
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="Bank Account Details" icon={FileText}>
        <div className="space-y-4">
          {bankAccounts.map((_, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 gap-3 md:grid-cols-3 p-3 border border-slate-200 rounded-xl"
            >
              <Controller
                name={`bankAccounts.${idx}.holderName`}
                control={control}
                render={({ field }) => (
                  <InputField label="Holder Name" isRequired {...field} />
                )}
              />
              <Controller
                name={`bankAccounts.${idx}.bankName`}
                control={control}
                render={({ field }) => (
                  <InputField label="Bank Name" isRequired {...field} />
                )}
              />
              <Controller
                name={`bankAccounts.${idx}.branchName`}
                control={control}
                render={({ field }) => (
                  <InputField label="Branch" isRequired {...field} />
                )}
              />

              <Controller
                name={`bankAccounts.${idx}.accountType`}
                control={control}
                render={({ field }) => (
                  <InputField label="Account Type" isRequired {...field} />
                )}
              />
              <Controller
                name={`bankAccounts.${idx}.accountNumber`}
                control={control}
                render={({ field }) => (
                  <InputField label="Account Number" isRequired {...field} />
                )}
              />
              <Controller
                name={`bankAccounts.${idx}.openingDate`}
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Opening Date"
                    type="date"
                    {...field}
                    isRequired
                  />
                )}
              />
              <Controller
                name={`bankAccounts.${idx}.balanceAmount`}
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Balance Amount (Rs.)"
                    type="number"
                    {...field}
                  />
                )}
              />
              <Button
                type="button"
                onClick={() => removeAt("bankAccounts", idx)}
                className="bg-red-50! text-red-600! border border-red-200 shadow-none! w-fit"
              >
                <Trash2 size={14} /> Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() =>
              addItem("bankAccounts", {
                holderName: "",
                bankName: "",
                branchName: "",
                accountType: "",
                accountNumber: "",
                openingDate: "",
                balanceAmount: "",
              })
            }
            className="w-fit"
          >
            <Plus size={14} /> Add Bank Account
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="Insurance Details" icon={FileText}>
        <div className="space-y-4">
          {insurancePolicies.map((_, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 gap-3 md:grid-cols-3 p-3 border border-slate-200 rounded-xl"
            >
              <Controller
                name={`insurancePolicies.${idx}.issuedBy`}
                control={control}
                render={({ field }) => (
                  <InputField label="Issued By" {...field} />
                )}
              />
              <Controller
                name={`insurancePolicies.${idx}.branchName`}
                control={control}
                render={({ field }) => <InputField label="Branch" {...field} />}
              />
              <Controller
                name={`insurancePolicies.${idx}.holderName`}
                control={control}
                render={({ field }) => (
                  <InputField label="Holder Name" {...field} />
                )}
              />
              <Controller
                name={`insurancePolicies.${idx}.policyNumber`}
                control={control}
                render={({ field }) => (
                  <InputField label="Policy Number" {...field} />
                )}
              />
              <Controller
                name={`insurancePolicies.${idx}.maturityDate`}
                control={control}
                render={({ field }) => (
                  <InputField label="Maturity Date" type="date" {...field} />
                )}
              />
              <Controller
                name={`insurancePolicies.${idx}.policyValue`}
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Policy Value (Rs.)"
                    type="number"
                    {...field}
                  />
                )}
              />
              <Button
                type="button"
                onClick={() => removeAt("insurancePolicies", idx)}
                className="bg-red-50! text-red-600! border border-red-200 shadow-none! w-fit"
              >
                <Trash2 size={14} /> Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() =>
              addItem("insurancePolicies", {
                issuedBy: "",
                branchName: "",
                holderName: "",
                policyNumber: "",
                maturityDate: "",
                policyValue: "",
              })
            }
            className="w-fit"
          >
            <Plus size={14} /> Add Insurance Policy
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="Property Details" icon={FileText}>
        <div className="space-y-4">
          {properties.map((_, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 gap-3 md:grid-cols-3 p-3 border border-slate-200 rounded-xl"
            >
              <Controller
                name={`properties.${idx}.propertySelected`}
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Property Selected"
                    as="select"
                    isRequired
                    {...field}
                    value={field.value ? "true" : "false"}
                    onChange={(e) => field.onChange(e.target.value === "true")}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </InputField>
                )}
              />
              <Controller
                name={`properties.${idx}.landMark`}
                control={control}
                render={({ field }) => (
                  <InputField label="Landmark" {...field} />
                )}
              />
              <Controller
                name={`properties.${idx}.landArea`}
                control={control}
                render={({ field }) => (
                  <InputField label="Land Area" type="number" {...field} />
                )}
              />
              <Controller
                name={`properties.${idx}.ownershipType`}
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Ownership Type"
                    isRequired
                    options={[
                      { value: "SOLE", label: "Sole" },
                      { value: "JOINT", label: "Joint" },
                    ]}
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                name={`properties.${idx}.landType`}
                control={control}
                render={({ field }) => (
                  <SelectField
                    isRequired
                    label="Land Type"
                    options={[
                      { value: "FREEHOLD", label: "Freehold" },
                      { value: "LEASEHOLD", label: "Leasehold" },
                    ]}
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                name={`properties.${idx}.purchaseFrom`}
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Purchased From"
                    isRequired
                    options={[
                      { value: "BUILDER", label: "Builder" },
                      { value: "SOCIETY", label: "Society" },
                      {
                        value: "DEVELOPMENT_AUTHORITY",
                        label: "Development Authority",
                      },
                      { value: "RESALE", label: "Resale" },
                      {
                        value: "SELF_CONSTRUCTION",
                        label: "Self Construction",
                      },
                      { value: "OTHER", label: "Other" },
                    ]}
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                name={`properties.${idx}.constructionStage`}
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Construction Stage"
                    isRequired
                    options={[
                      { value: "READY", label: "Ready" },
                      {
                        value: "UNDER_CONSTRUCTION",
                        label: "Under Construction",
                      },
                    ]}
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                name={`properties.${idx}.constructionPercent`}
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Construction Percent"
                    type="number"
                    {...field}
                  />
                )}
              />
              <Button
                type="button"
                onClick={() => removeAt("properties", idx)}
                className="bg-red-50! text-red-600! border border-red-200 shadow-none! w-fit"
              >
                <Trash2 size={14} /> Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() =>
              addItem("properties", {
                propertySelected: true,
                landMark: "",
                landArea: "",
                ownershipType: "",
                landType: "",
                purchaseFrom: "",
                constructionStage: "",
                constructionPercent: "",
              })
            }
            className="w-fit"
          >
            <Plus size={14} /> Add Property
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="References" icon={FileText}>
        <div className="space-y-4">
          {references.map((_, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 gap-3 md:grid-cols-3 p-3 border border-slate-200 rounded-xl"
            >
              <Controller
                name={`references.${idx}.name`}
                control={control}
                render={({ field }) => (
                  <InputField label="Name" isRequired {...field} />
                )}
              />
              <Controller
                name={`references.${idx}.fatherName`}
                control={control}
                render={({ field }) => (
                  <InputField label="Father Name" isRequired {...field} />
                )}
              />
              <Controller
                name={`references.${idx}.relation`}
                control={control}
                render={({ field }) => (
                  <InputField label="Relation" isRequired {...field} />
                )}
              />
              <Controller
                name={`references.${idx}.contactNumber`}
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Contact Number"
                    isRequired
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
                name={`references.${idx}.address`}
                control={control}
                render={({ field }) => (
                  <InputField label="Address" {...field} />
                )}
              />
              <Controller
                name={`references.${idx}.city`}
                control={control}
                render={({ field }) => <InputField label="City" {...field} />}
              />
              <Controller
                name={`references.${idx}.state`}
                control={control}
                render={({ field }) => <InputField label="State" {...field} />}
              />
              <Controller
                name={`references.${idx}.pinCode`}
                control={control}
                render={({ field }) => (
                  <InputField label="Pin Code" {...field} />
                )}
              />
              <Controller
                name={`references.${idx}.occupation`}
                control={control}
                render={({ field }) => (
                  <InputField label="Occupation" isRequired {...field} />
                )}
              />
              <Button
                type="button"
                onClick={() => removeAt("references", idx)}
                className="bg-red-50! text-red-600! border border-red-200 shadow-none! w-fit"
              >
                <Trash2 size={14} /> Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() =>
              addItem("references", {
                name: "",
                fatherName: "",
                relation: "",
                contactNumber: "",
                phone: "",
                address: "",
                city: "",
                state: "",
                pinCode: "",
                occupation: "",
              })
            }
            className="w-fit"
          >
            <Plus size={14} /> Add Reference
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="Questionnaire" icon={FileText}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            ["legalPropertyClear", "Is property title clear?"],
            ["mortgagedElsewhere", "Will MPPL get first mortgage?"],
            ["residentOfIndia", "Applicant resident of India?"],
            ["otherLoans", "Any other outstanding loans?"],
            ["guarantorAnywhere", "Guarantor anywhere else?"],
            ["mppLifeInsurance", "Interested in MPPL life insurance?"],
          ].map(([key, label]) => (
            <Controller
              key={key}
              name={`questionnaire.${key}`}
              control={control}
              render={({ field }) => (
                <div className="p-3 border border-slate-200 rounded-xl flex items-center justify-between gap-2">
                  <span className="text-sm text-slate-700">{label}</span>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => field.onChange(true)}
                      className={
                        field.value === true
                          ? "bg-blue-600!"
                          : "bg-slate-100! text-slate-700!"
                      }
                    >
                      Yes
                    </Button>
                    <Button
                      type="button"
                      onClick={() => field.onChange(false)}
                      className={
                        field.value === false
                          ? "bg-blue-600!"
                          : "bg-slate-100! text-slate-700!"
                      }
                    >
                      No
                    </Button>
                  </div>
                </div>
              )}
            />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

export default function LoanApplicationForm({
  onClose,
  onSuccess = () => {},
  initialData = null,
  verifiedData = null,
}) {
  const draftSnapshot = useMemo(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, []);

  const [currentStep, setCurrentStep] = useState(
    () => draftSnapshot?.currentStep || "applicant",
  );
  const [completedSteps, setCompletedSteps] = useState(
    () => draftSnapshot?.completedSteps || [],
  );
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requiredPaths, setRequiredPaths] = useState(new Set());

  const loanTypeOptions = useLoanTypes();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    trigger,
    getFieldState,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createLoanApplicationSchema),
    mode: "onTouched",
    defaultValues: DEFAULT_VALUES,
  });

  // Auto-fill verified Aadhaar and PAN from payment gate
  React.useEffect(() => {
    console.log("[LoanApplicationForm] verifiedData received:", verifiedData);
    if (!verifiedData?.verificationData) return;

    const {
      aadhaarNumber,
      panNumber,
      verificationMethod,
      profileData,
      verificationResponse,
    } = verifiedData.verificationData;

    if (verificationMethod === "aadhaar" && profileData) {
      console.log("[LoanApplicationForm] applying Aadhaar profile:", profileData, "aadhaarNumber:", aadhaarNumber);
      applyAadhaarProfile(profileData, aadhaarNumber, setValue);
      // store raw provider payload so ApplicantSection can read provider values
      if (verificationResponse) {
        try {
          setValue("applicant.aadhaarProvider", verificationResponse, {
            shouldDirty: true,
            shouldTouch: true,
          });
        } catch (e) {
          console.warn("Failed to set applicant.aadhaarProvider", e);
        }
      }
      // ensure applicant tab is visible for user to see autofilled values
      try {
        setCurrentStep("applicant");
      } catch (e) {}
    } else if (verificationMethod === "pan" && profileData) {
      console.log("[LoanApplicationForm] applying PAN profile:", profileData);
      applyPanProfile(profileData, setValue);
      if (verificationResponse) {
        try {
          setValue("applicant.panProvider", verificationResponse, {
            shouldDirty: true,
            shouldTouch: true,
          });
        } catch (e) {
          console.warn("Failed to set applicant.panProvider", e);
        }
      }
      try {
        setCurrentStep("applicant");
      } catch (e) {}
    } else {
      if (aadhaarNumber) {
        setValue("applicant.aadhaarNumber", aadhaarNumber);
      }

      if (panNumber) {
        setValue("applicant.panNumber", panNumber);
      }
    }

    if (verificationResponse) {
      if (verificationMethod === "aadhaar") {
        setValue("applicant.aadhaarVerificationResponse", verificationResponse);
      } else if (verificationMethod === "pan") {
        setValue("applicant.panVerificationResponse", verificationResponse);
      }
    }

    if (verifiedData.lead) {
      const lead = verifiedData.lead;

      if (lead.leadNumber) {
        setValue("leadNumber", lead.leadNumber);
      }

      if (lead.contactNumber) {
        setValue("applicant.contactNumber", lead.contactNumber);
      }

      if (lead.email) {
        setValue("applicant.email", lead.email);
      }
    }
  }, [verifiedData, setValue]);

  const { mutate: createLoanApplication } = useCreateLoanApplication({
    onSuccess: () => {
      showSuccess("Loan application created successfully!");
      localStorage.removeItem(DRAFT_KEY);
      reset(DEFAULT_VALUES);
      if (typeof onSuccess === "function") onSuccess();
      setSubmitted(true);
    },
    onError: (err) => {
      const pathToLabel = {
        firstName: "First Name",
        lastName: "Last Name",
        middleName: "Middle Name",
        fatherName: "Father's Name",
        motherName: "Mother's Name",
        dob: "Date of Birth",
        aadhaarNumber: "Aadhaar Card No.",
        panNumber: "PAN No.",
        contactNumber: "Contact Number",
        phoneNumber: "Phone Number",
        email: "Email",
        employmentType: "Employment Type",
        maritalStatus: "Marital Status",
        category: "Category",
        addressLine1: "Address Line 1",
        city: "City",
        district: "District",
        state: "State",
        pinCode: "Pin Code",
        loanTypeId: "Loan Type",
        tenure: "Loan Tenure",
        loanAmount: "Loan Amount",
        loanPurpose: "Loan Purpose",
        grossMonthlyIncome: "Gross Monthly Income",
        netMonthlyIncome: "Net Monthly Income",
        averageMonthlyExpenses: "Average Monthly Expenses",
        drivingLicenceNo: "Driving Licence No.",
        drivingLicence: "Driving Licence No.",
        passportNumber: "Passport Number",
        occupationalDetails: "Occupational Details",
      };

      // special-case loan-number conflict for clearer UX
      if (
        typeof err?.message === "string" &&
        err.message.includes("Loan number already exists")
      ) {
        showError(
          "A loan number collision occurred — the server generated a duplicate loan number. Please try submitting again.",
        );
        return;
      }

      const backendErrors = Array.isArray(err?.errors) ? err.errors : [];
      if (backendErrors.length) {
        // mark server-reported paths as required/invalid so UI can highlight them
        try {
          const paths = backendErrors
            .map((e) =>
              typeof e?.path === "string" ? e.path : String(e?.path || ""),
            )
            .filter(Boolean);
          setRequiredPaths(new Set(paths));
        } catch (e) {
          setRequiredPaths(new Set());
        }
        const labels = Array.from(
          new Set(
            backendErrors
              .map((e) =>
                String(e?.path || "")
                  .split(".")
                  .pop(),
              )
              .filter(Boolean)
              .map(
                (k) =>
                  pathToLabel[k] ||
                  k
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (s) => s.toUpperCase()),
              ),
          ),
        );

        const msg = labels.length
          ? `Please review required/invalid fields: ${labels.slice(0, 8).join(", ")}`
          : "Please review required/invalid fields";
        showError(msg);
        return;
      }

      showError(err?.message || "Failed to create loan application");
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
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
    if (verifiedData?.verificationData) return;
    if (!initialData) return;
    reset({ ...DEFAULT_VALUES, ...initialData });
  }, [initialData, reset, verifiedData]);

  useEffect(() => {
    if (!draftSnapshot?.values) return;
    reset({ ...DEFAULT_VALUES, ...draftSnapshot.values });
    showInfo("Draft loaded");
  }, [draftSnapshot, reset]);

  const steps = useMemo(() => STEPS.filter((s) => s.id !== "review"), []);
  const currentIdx = STEPS.findIndex((s) => s.id === currentStep);

  const saveDraft = useCallback(() => {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({
        values: getValues(),
        completedSteps,
        currentStep,
      }),
    );
    showInfo("Draft saved");
  }, [getValues, completedSteps, currentStep]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
    reset(DEFAULT_VALUES);
    setCompletedSteps([]);
    setCurrentStep("applicant");
    showSuccess("Saved draft cleared");
  }, [reset]);

  const onSubmit = handleSubmit(
    (formData) => {
      setIsSubmitting(true);
      createLoanApplication(normalizePayload(formData));
    },
    (errors) => {
      const extractPaths = (obj, base = "") => {
        if (!obj || typeof obj !== "object") return [];
        return Object.entries(obj).flatMap(([k, v]) => {
          // react-hook-form error leaf nodes often have a 'type' or 'message'
          if (
            v &&
            (v.type || v.message) &&
            Object.keys(v).every(
              (x) => x === "type" || x === "message" || x === "ref",
            )
          ) {
            return [`${base}${k}`];
          }
          // nested object (including array indices as keys)
          return extractPaths(v, `${base}${k}.`);
        });
      };

      const rawPaths = extractPaths(errors).filter(Boolean);
      // set client-side required markers as well
      try {
        setRequiredPaths(new Set(rawPaths));
      } catch (e) {
        setRequiredPaths(new Set());
      }

      const humanize = (p) => {
        const withoutIdx = p
          .replace(/\.\d+\./g, ".#.")
          .replace(/\.(\d+)$/g, ".#$1");
        const key = withoutIdx.split(".").slice(-1)[0];
        const map = {
          firstName: "First Name",
          lastName: "Last Name",
          middleName: "Middle Name",
          fatherName: "Father's Name",
          motherName: "Mother's Name",
          dob: "Date of Birth",
          aadhaarNumber: "Aadhaar Card No.",
          panNumber: "PAN No.",
          contactNumber: "Contact Number",
          phoneNumber: "Phone Number",
          email: "Email",
          employmentType: "Employment Type",
          maritalStatus: "Marital Status",
          category: "Category",
          addressLine1: "Address Line 1",
          city: "City",
          district: "District",
          state: "State",
          pinCode: "Pin Code",
          loanTypeId: "Loan Type",
          "loanRequirement.tenure": "Loan Tenure",
          loanAmount: "Loan Amount",
          loanPurpose: "Loan Purpose",
        };
        return (
          map[key] ||
          key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())
        );
      };

      const labels = Array.from(new Set(rawPaths.map(humanize))).slice(0, 8);
      const msg =
        labels.length === 1
          ? `Please fill required field: ${labels[0]}`
          : labels.length
            ? `Please fill required fields: ${labels.join(", ")}`
            : "Please complete required fields before submitting";
      showError(msg);
    },
  );

  const goPrev = () => {
    if (currentIdx > 0) {
      setCurrentStep(STEPS[currentIdx - 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goNext = async () => {
    const stepFields = STEP_FIELDS[currentStep] || [];

    const flattenPaths = (obj, base = "") => {
      if (obj === null || obj === undefined) return [];
      if (typeof obj !== "object") return [base.replace(/\.$/, "")];
      if (Array.isArray(obj)) {
        return obj.flatMap((item, idx) => flattenPaths(item, `${base}${idx}.`));
      }
      return Object.keys(obj).flatMap((k) =>
        flattenPaths(obj[k], `${base}${k}.`),
      );
    };

    let fieldsToValidate = [];
    let valid = true;
    if (stepFields.length) {
      fieldsToValidate = stepFields;
      valid = await trigger(fieldsToValidate);
    } else {
      // build dynamic field list for current step by inspecting values
      const values = getValues();
      let stepRoots = [];
      if (currentStep === "coApplicant") stepRoots = ["coApplicants"];
      else if (currentStep === "guarantor") stepRoots = ["guarantors"];
      else if (currentStep === "additional")
        stepRoots = [
          "existingLoans",
          "creditCards",
          "bankAccounts",
          "insurancePolicies",
          "properties",
          "references",
        ];

      const dynamicFields = stepRoots.flatMap((root) => {
        const rootVal = values[root];
        if (!rootVal) return [];
        if (Array.isArray(rootVal)) {
          return rootVal.flatMap((item, idx) =>
            flattenPaths(item, `${root}.${idx}.`),
          );
        }
        return flattenPaths(rootVal, `${root}.`);
      });

      fieldsToValidate = dynamicFields;
      valid = fieldsToValidate.length ? await trigger(fieldsToValidate) : true;
    }

    if (!valid) {
      const rawPaths = fieldsToValidate.filter(
        (path) => getFieldState(path).invalid,
      );

      const humanize = (p) => {
        // remove numeric array indices
        const withoutIdx = p
          .replace(/\.\d+\./g, ".#.")
          .replace(/\.(\d+)$/g, ".#$1");
        const key = withoutIdx.split(".").slice(-1)[0];
        const map = {
          firstName: "First Name",
          lastName: "Last Name",
          middleName: "Middle Name",
          fatherName: "Father's Name",
          motherName: "Mother's Name",
          dob: "Date of Birth",
          aadhaarNumber: "Aadhaar Card No.",
          panNumber: "PAN No.",
          contactNumber: "Contact Number",
          phoneNumber: "Phone Number",
          email: "Email",
          employmentType: "Employment Type",
          maritalStatus: "Marital Status",
          category: "Category",
          addressLine1: "Address Line 1",
          city: "City",
          district: "District",
          state: "State",
          pinCode: "Pin Code",
          loanTypeId: "Loan Type",
          "loanRequirement.tenure": "Loan Tenure",
          loanAmount: "Loan Amount",
          loanPurpose: "Loan Purpose",
        };
        return (
          map[key] ||
          key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())
        );
      };

      const labels = Array.from(new Set(rawPaths.map(humanize))).slice(0, 8);
      const msg =
        labels.length === 1
          ? `Please fill required field: ${labels[0]}`
          : labels.length
            ? `Please fill required fields: ${labels.join(", ")}`
            : "Please fill required fields";
      showError(msg);
      return;
    }

    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }

    if (currentIdx < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIdx + 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderSection = () => {
    switch (currentStep) {
      case "applicant":
        return (
          <ApplicantSection
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
            loanTypeOptions={loanTypeOptions}
            requiredPaths={requiredPaths}
          />
        );
      case "coApplicant":
        return (
          <CoApplicantSection
            control={control}
            watch={watch}
            setValue={setValue}
            fields={coAppFields}
            append={coAppAppend}
            remove={coAppRemove}
            requiredPaths={requiredPaths}
          />
        );
      case "guarantor":
        return (
          <GuarantorSection
            control={control}
            watch={watch}
            setValue={setValue}
            fields={guarFields}
            append={guarAppend}
            remove={guarRemove}
            requiredPaths={requiredPaths}
          />
        );
      case "additional":
        return (
          <AdditionalSection
            control={control}
            watch={watch}
            setValue={setValue}
            requiredPaths={requiredPaths}
          />
        );
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

  return (
    <div className="fixed inset-0 pt-16 lg:pl-64 bg-linear-to-br from-slate-50 via-blue-50/20 to-slate-100 overflow-y-auto">
      <StepNavbar
        steps={steps}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={setCurrentStep}
      />

      <main className="max-w-5xl mx-auto px-6 py-3">
        {renderSection()}

        <FormFooter
          currentStep={currentStep}
          currentIdx={currentIdx}
          steps={STEPS}
          onPrev={goPrev}
          onClose={() => {
            if (typeof onClose === "function") {
              onClose();
            }
          }}
          onSaveDraft={saveDraft}
          onClearDraft={clearDraft}
          onNext={goNext}
        />

        {currentStep !== "review" && (
          <div className="mt-3 flex justify-end">
            <Button
              type="button"
              onClick={() => setCurrentStep("review")}
              className="text-sm!"
            >
              Jump To Review <ChevronRight size={14} />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
