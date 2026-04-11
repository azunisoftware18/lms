import InputField from "../ui/InputField";
import SelectField from "../ui/SelectField";
import Button from "../ui/Button";

const partnerTypeOptions = [
  { value: "DSA", label: "DSA" },
  { value: "Broker", label: "Broker" },
  { value: "Connector", label: "Connector" },
  { value: "Fintech", label: "Fintech" },
  { value: "Builder", label: "Builder" },
  { value: "Aggregator", label: "Aggregator" },
];

const statusOptions = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "BLACKLISTED", label: "Blacklisted" },
];

const commissionTypeOptions = [
  { value: "PERCENTAGE", label: "Percentage" },
  { value: "FIXED", label: "Flat" },
];

const paymentCycleOptions = [
  { value: "MONTHLY", label: "Monthly" },
  { value: "QUARTERLY", label: "Quarterly" },
  { value: "HALF_YEARLY", label: "Half Yearly" },
  { value: "YEARLY", label: "Yearly" },
  { value: "PER_TRANSACTION", label: "Per Transaction" },
];

const ConstitutionType = [
  { value: "PROPRIETORSHIP", label: "Proprietorship" },
  { value: "PARTNERSHIP", label: "Partnership" },
  { value: "LLP", label: "LLP" },
  { value: "PRIVATE_LIMITED", label: "Private Limited" },
  { value: "PUBLIC_LIMITED", label: "Public Limited" },
  { value: "INDIVIDUAL", label: "Individual" },
  { value: "OTHER", label: "Other" },
];

export default function AddPartnerForm({
  formData,
  errors = {},
  handleChange,
  handleSubmit,
  onCancel,
  isEditing = false,
  performanceOptions = [],
}) {
  const handleSelectChange = (name) => (value) => {
    handleChange?.({ target: { name, value, type: "text" } });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <InputField
          label="Legal Name (Entity)"
          name="companyName"
          value={formData.companyName || ""}
          onChange={handleChange}
          error={errors.companyName}
          isRequired={true}
        />

        <InputField
          label="Trade Name"
          name="tradeName"
          value={formData.tradeName || ""}
          onChange={handleChange}
          error={errors.tradeName}
        />

        <SelectField
          label="Constitution Type"
          value={formData.constitutionType || "INDIVIDUAL"}
          options={ConstitutionType}
          onChange={handleSelectChange("constitutionType")}
        />

        <InputField
          label="Onboarding Date"
          name="onboardingDate"
          type="date"
          value={formData.onboardingDate || ""}
          onChange={handleChange}
          error={errors.onboardingDate}
        />

        {/* Primary Contact */}
        <InputField
          label="Primary Contact Person"
          name="contactPerson"
          value={formData.contactPerson || ""}
          onChange={handleChange}
          error={errors.contactPerson}
          isRequired={true}
        />

        <InputField
          label="Primary Email"
          name="email"
          type="email"
          value={formData.email || ""}
          onChange={handleChange}
          error={errors.email}
          isRequired={true}
        />

        <InputField
          label="Primary Mobile"
          name="contactNumber"
          value={formData.contactNumber || ""}
          onChange={handleChange}
          error={errors.contactNumber}
          isRequired={true}
        />

        {/* Secondary Contact */}
        <InputField
          label="Secondary Contact Person"
          name="secondaryContactPerson"
          value={formData.secondaryContactPerson || ""}
          onChange={handleChange}
          error={errors.secondaryContactPerson}
        />

        <InputField
          label="Secondary Mobile"
          name="secondaryContactNumber"
          value={formData.secondaryContactNumber || ""}
          onChange={handleChange}
          error={errors.secondaryContactNumber}
        />

        <InputField
          label="Secondary Email"
          name="secondaryContactEmail"
          type="email"
          value={formData.secondaryContactEmail || ""}
          onChange={handleChange}
          error={errors.secondaryContactEmail}
        />

        <InputField
          label="Alternate Phone"
          name="alternateNumber"
          value={formData.alternateNumber || ""}
          onChange={handleChange}
          error={errors.alternateNumber}
        />

        <InputField
          label="Registered Address Line 1"
          name="registeredAddressLine1"
          value={formData.registeredAddressLine1 || ""}
          onChange={handleChange}
        />

        <InputField
          label="Registered Address Line 2"
          name="registeredAddressLine2"
          value={formData.registeredAddressLine2 || ""}
          onChange={handleChange}
        />

        <InputField
          label="City"
          name="city"
          value={formData.city || ""}
          onChange={handleChange}
        />

        <InputField
          label="State"
          name="state"
          value={formData.state || ""}
          onChange={handleChange}
        />

        <InputField
          label="Registered PIN Code"
          name="registeredPinCode"
          value={formData.registeredPinCode || ""}
          onChange={handleChange}
        />

        <InputField
          label="Country"
          name="country"
          value={formData.country || ""}
          onChange={handleChange}
        />

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700">Office address same as registered</label>
          <select
            name="officeSameAsRegistered"
            value={String(formData.officeSameAsRegistered || "true")}
            onChange={(e) => handleChange({ target: { name: "officeSameAsRegistered", value: e.target.value === "true" } })}
            className="mt-1 w-full rounded-md border-slate-200"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <SelectField
          label="Partner Type"
          value={formData.partnerType || "DSA"}
          options={partnerTypeOptions}
          onChange={handleSelectChange("partnerType")}
        />

        <SelectField
          label="Status"
          value={formData.status || "ACTIVE"}
          options={statusOptions}
          onChange={handleSelectChange("status")}
        />

        <SelectField
          label="Commission Type"
          value={formData.commissionType || "PERCENTAGE"}
          options={commissionTypeOptions}
          onChange={handleSelectChange("commissionType")}
        />

        <InputField
          label="Commission Value"
          name="commissionValue"
          value={formData.commissionValue || ""}
          onChange={handleChange}
          error={errors.commissionValue}
          isRequired={true}
        />

        <SelectField
          label="Payout Frequency"
          value={formData.payoutFrequency || "MONTHLY"}
          options={[{ value: "MONTHLY", label: "Monthly" }, { value: "CASE_WISE", label: "Case-wise" }]}
          onChange={handleSelectChange("payoutFrequency")}
        />

        <InputField
          label="PAN Number"
          name="panNumber"
          value={formData.panNumber || ""}
          onChange={handleChange}
        />

        <InputField
          label="Aadhaar Number"
          name="aadhaarNumber"
          value={formData.aadhaarNumber || ""}
          onChange={handleChange}
        />

        <InputField
          label="LLP / Registration ID"
          name="llpNumber"
          value={formData.llpNumber || ""}
          onChange={handleChange}
        />

        <SelectField
          label="PAN Verification Status"
          value={formData.panVerificationStatus || "pending"}
          options={[{ value: "pending", label: "Pending" }, { value: "verified", label: "Verified" }, { value: "rejected", label: "Rejected" }]}
          onChange={handleSelectChange("panVerificationStatus")}
        />

        <SelectField
          label="GST Verification Status"
          value={formData.gstVerificationStatus || "pending"}
          options={[{ value: "pending", label: "Pending" }, { value: "verified", label: "Verified" }, { value: "rejected", label: "Rejected" }]}
          onChange={handleSelectChange("gstVerificationStatus")}
        />

        <InputField
          label="GSTIN"
          name="gstNumber"
          value={formData.gstNumber || ""}
          onChange={handleChange}
        />

        <InputField
          label="CIN / Registration No"
          name="registrationNo"
          value={formData.registrationNo || ""}
          onChange={handleChange}
        />

        {/* Document uploads / URLs */}
        <InputField
          label="Partner Agreement URL"
          name="documents.partnerAgreementUrl"
          value={formData.documents?.partnerAgreementUrl || ""}
          onChange={handleChange}
        />

        <InputField
          label="PAN Copy URL"
          name="documents.panCopyUrl"
          value={formData.documents?.panCopyUrl || ""}
          onChange={handleChange}
        />

        <InputField
          label="GST Certificate URL"
          name="documents.gstCertUrl"
          value={formData.documents?.gstCertUrl || ""}
          onChange={handleChange}
        />

        <InputField
          label="Incorporation Certificate URL"
          name="documents.incorporationCertUrl"
          value={formData.documents?.incorporationCertUrl || ""}
          onChange={handleChange}
        />

        <InputField
          label="Address Proof URL"
          name="documents.addressProofUrl"
          value={formData.documents?.addressProofUrl || ""}
          onChange={handleChange}
        />

        <InputField
          label="Bank Proof URL"
          name="documents.bankProofUrl"
          value={formData.documents?.bankProofUrl || ""}
          onChange={handleChange}
        />

        <InputField
          label="Board Resolution URL"
          name="documents.boardResolutionUrl"
          value={formData.documents?.boardResolutionUrl || ""}
          onChange={handleChange}
        />

        <InputField
          label="Authorization Letter URL"
          name="documents.authorizationLetterUrl"
          value={formData.documents?.authorizationLetterUrl || ""}
          onChange={handleChange}
        />

        <InputField
          label="NDA URL"
          name="documents.ndaUrl"
          value={formData.documents?.ndaUrl || ""}
          onChange={handleChange}
        />

        <InputField
          label="Agreement URL"
          name="documents.agreementUrl"
          value={formData.documents?.agreementUrl || ""}
          onChange={handleChange}
        />

        <InputField
          label="Agreement Validity Date"
          name="documents.agreementValidityDate"
          type="date"
          value={formData.documents?.agreementValidityDate || ""}
          onChange={handleChange}
        />

        <InputField
          label="Commercial CIBIL URL"
          name="documents.commercialCibilUrl"
          value={formData.documents?.commercialCibilUrl || ""}
          onChange={handleChange}
        />

        <InputField
          label="CIBIL Check URL (Director/Partner/KMP)"
          name="documents.cibilCheckUrl"
          value={formData.documents?.cibilCheckUrl || ""}
          onChange={handleChange}
        />

        <InputField
          label="Bank Name"
          name="bankName"
          value={formData.bankName || ""}
          onChange={handleChange}
        />

        <InputField
          label="Account Holder Name"
          name="accountHolder"
          value={formData.accountHolder || ""}
          onChange={handleChange}
        />

        <InputField
          label="Account Number"
          name="accountNo"
          value={formData.accountNo || ""}
          onChange={handleChange}
        />

        <InputField
          label="IFSC Code"
          name="ifsc"
          value={formData.ifsc || ""}
          onChange={handleChange}
        />

        <InputField
          label="UPI ID"
          name="upiId"
          value={formData.upiId || ""}
          onChange={handleChange}
        />

        <InputField
          label="Maximum Payout Cap"
          name="maxPayoutCap"
          value={formData.maxPayoutCap || ""}
          onChange={handleChange}
        />

        <SelectField
          label="Payment Cycle"
          value={formData.paymentCycle || "MONTHLY"}
          options={paymentCycleOptions}
          onChange={handleSelectChange("paymentCycle")}
        />

        <InputField
          label="Monthly Target"
          name="monthlyTarget"
          value={formData.monthlyTarget || ""}
          onChange={handleChange}
        />

        <div className="md:col-span-2 lg:col-span-1">
          <SelectField
            label="Performance Rating"
            value={String(formData.performanceRating || "3")}
            options={performanceOptions.map((item) => ({
              value: item.value,
              label: `${item.label} (${item.value}/5)`,
            }))}
            onChange={handleSelectChange("performanceRating")}
          />
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <Button type="submit">
          {isEditing ? "Update Partner" : "Add Partner"}
        </Button>
      </div>
    </form>
  );
}
