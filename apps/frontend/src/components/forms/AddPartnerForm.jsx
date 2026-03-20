import InputField from "../ui/InputField";
import SelectField from "../ui/SelectField";
import Button from "../ui/Button";

const partnerTypeOptions = [
  { value: "Individual", label: "Individual" },
  { value: "Company", label: "Company" },
  { value: "Institution", label: "Institution" },
  { value: "Corporate", label: "Corporate" },
  { value: "Agency", label: "Agency" },
];

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "Suspended", label: "Suspended" },
  { value: "Under Review", label: "Under Review" },
];

const commissionTypeOptions = [
  { value: "Percentage", label: "Percentage" },
  { value: "Flat", label: "Flat" },
];

const paymentCycleOptions = [
  { value: "Weekly", label: "Weekly" },
  { value: "Monthly", label: "Monthly" },
  { value: "Quarterly", label: "Quarterly" },
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
          label="Partner ID"
          name="partnerId"
          value={formData.partnerId || ""}
          onChange={handleChange}
          error={errors.partnerId}
          isRequired={true}
        />

        <InputField
          label="Company Name"
          name="companyName"
          value={formData.companyName || ""}
          onChange={handleChange}
          error={errors.companyName}
          isRequired={true}
        />

        <InputField
          label="Contact Person"
          name="partnerName"
          value={formData.partnerName || ""}
          onChange={handleChange}
          error={errors.partnerName}
          isRequired={true}
        />

        <InputField
          label="Email"
          name="email"
          type="email"
          value={formData.email || ""}
          onChange={handleChange}
          error={errors.email}
          isRequired={true}
        />

        <InputField
          label="Phone"
          name="phone"
          value={formData.phone || ""}
          onChange={handleChange}
          error={errors.phone}
          isRequired={true}
        />

        <InputField
          label="City"
          name="city"
          value={formData.city || ""}
          onChange={handleChange}
        />

        <SelectField
          label="Partner Type"
          value={formData.partnerType || "Individual"}
          options={partnerTypeOptions}
          onChange={handleSelectChange("partnerType")}
        />

        <SelectField
          label="Status"
          value={formData.status || "Active"}
          options={statusOptions}
          onChange={handleSelectChange("status")}
        />

        <SelectField
          label="Commission Type"
          value={formData.commissionType || "Percentage"}
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
          label="Payment Cycle"
          value={formData.paymentCycle || "Monthly"}
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
