// ─────────────────────────────────────────────────────────────────────────────
// NachMandateForm.jsx
//
// Reusable NACH Mandate Creation Form with React Hook Form
// ─────────────────────────────────────────────────────────────────────────────

import { useForm } from "react-hook-form";
import {
  Landmark, CreditCard, Hash, IndianRupee, Calendar,
  CheckCircle, AlertCircle, Shield, Zap, Activity, Plus
} from "lucide-react";

// ══════════════════════════════════════════════════════════════════════════════
// PropTypes validation
// ══════════════════════════════════════════════════════════════════════════════
/**
 * @typedef {Object} NachMandateFormData
 * @property {string} bank - Bank name
 * @property {string} account - Account number
 * @property {string} ifsc - IFSC code
 * @property {string} limit - Debit limit
 * @property {string} startDate - Start date
 */

/**
 * @param {Object} props
 * @param {Function} props.onSubmit - Callback when form is submitted successfully
 * @param {Function} props.onCancel - Callback when form is cancelled/reset
 * @param {NachMandateFormData} props.defaultValues - Default values for the form
 * @param {boolean} props.isSubmitting - External loading state
 * @param {string} props.submitButtonText - Custom submit button text
 * @param {boolean} props.showFeatures - Show feature highlights
 */

// ══════════════════════════════════════════════════════════════════════════════
// FORM COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
export default function NachMandateForm({
  onSubmit,
  onCancel,
  defaultValues = {
    bank: "",
    account: "",
    ifsc: "",
    limit: "",
    startDate: "",
  },
  isSubmitting = false,
  submitButtonText = "Create Mandate",
  showFeatures = true,
}) {
  // ── React Hook Form setup ─────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful, isSubmitted },
    setError,
    clearErrors,
  } = useForm({
    defaultValues,
    mode: "onBlur", // Validate on blur for better UX
  });

  // ── Custom validation ────────────────────────────────────────────────────
  const validateForm = (data) => {
    const errors = {};

    // Bank validation
    if (!data.bank?.trim()) {
      errors.bank = "Bank name is required";
    } else if (data.bank.length < 3) {
      errors.bank = "Bank name must be at least 3 characters";
    }

    // Account validation
    if (!data.account?.trim()) {
      errors.account = "Account number is required";
    } else if (!/^\d{9,18}$/.test(data.account.replace(/\s/g, ""))) {
      errors.account = "Enter a valid account number (9-18 digits)";
    }

    // IFSC validation
    if (!data.ifsc?.trim()) {
      errors.ifsc = "IFSC code is required";
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(data.ifsc.toUpperCase())) {
      errors.ifsc = "Enter a valid IFSC code (e.g., HDFC0001234)";
    }

    // Limit validation
    if (!data.limit) {
      errors.limit = "Debit limit is required";
    } else if (isNaN(data.limit) || Number(data.limit) <= 0) {
      errors.limit = "Enter a valid positive amount";
    } else if (Number(data.limit) > 1000000) {
      errors.limit = "Limit cannot exceed ₹10,00,000";
    }

    // Start date validation
    if (!data.startDate) {
      errors.startDate = "Start date is required";
    } else {
      const selectedDate = new Date(data.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.startDate = "Start date cannot be in the past";
      }
    }

    return errors;
  };

  // ── Custom submit handler ────────────────────────────────────────────────
  const onFormSubmit = async (data) => {
    // Clear previous errors
    clearErrors();

    // Run custom validation
    const validationErrors = validateForm(data);
    if (Object.keys(validationErrors).length > 0) {
      // Set errors in react-hook-form
      Object.entries(validationErrors).forEach(([field, message]) => {
        setError(field, { type: "manual", message });
      });
      return;
    }

    // Call parent onSubmit if provided
    if (onSubmit) {
      await onSubmit(data);
    }
  };

  // ── Handle reset ────────────────────────────────────────────────────────
  const handleReset = () => {
    reset(defaultValues);
    if (onCancel) onCancel();
  };

  // ── Format helpers ──────────────────────────────────────────────────────
  const formatAccountNumber = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) return;
    
    // Format in groups of 4 for better readability
    const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    e.target.value = formatted;
  };

  const formatIfsc = (e) => {
    e.target.value = e.target.value.toUpperCase();
  };

  // ── Feature highlights component ────────────────────────────────────────
  const FeatureHighlights = () => (
    <div className="flex flex-col sm:flex-row gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl">
      {[
        { icon: Zap, label: "Auto EMI Debit", sub: "Automated monthly collection" },
        { icon: Shield, label: "Bank Grade Security", sub: "256-bit encrypted mandate" },
        { icon: Activity, label: "Real-time Tracking", sub: "Instant debit notifications" },
      ].map(({ icon: Icon, label, sub }) => (
        <div key={label} className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-white rounded-lg shadow-sm border border-blue-100 shrink-0">
            <Icon size={15} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-700">{label}</p>
            <p className="text-[11px] text-slate-500">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );

  // ── Input field component ───────────────────────────────────────────────
  const FormField = ({ 
    label, 
    name, 
    type = "text", 
    placeholder, 
    icon: Icon,
    required = false,
    hint,
    onChange,
    ...props 
  }) => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none">
            <Icon size={17} />
          </div>
        )}
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-all outline-none
            ${Icon ? "pl-10" : "pl-4"}
            ${errors[name]
              ? "border-red-400 focus:ring-4 focus:ring-red-100"
              : "border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"}
            bg-white text-slate-900 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500`}
          disabled={isSubmitting}
          {...register(name)}
          onChange={(e) => {
            register(name).onChange(e);
            if (onChange) onChange(e);
          }}
          {...props}
        />
      </div>
      {errors[name] && (
        <p className="text-xs text-red-600 flex items-center gap-1 mt-0.5">
          <AlertCircle size={12} />
          {errors[name].message}
        </p>
      )}
      {hint && !errors[name] && (
        <p className="text-xs text-slate-400 mt-0.5">{hint}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* ── Success message (if needed) ── */}
      {isSubmitSuccessful && (
        <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">
          <CheckCircle size={18} className="shrink-0" />
          Mandate created successfully! Reference will be sent to the customer.
        </div>
      )}

      {/* ── Feature highlights (optional) ── */}
      {showFeatures && <FeatureHighlights />}

      {/* ── Form card ── */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        {/* Card header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5">
          <div className="p-1.5 bg-blue-50 rounded-lg">
            <CreditCard size={15} className="text-blue-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Mandate Details</h3>
        </div>

        {/* Form fields */}
        <div className="p-5 sm:p-6">
          <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <FormField
                label="Bank Name"
                name="bank"
                placeholder="e.g. HDFC Bank"
                icon={Landmark}
                required
              />
              
              <FormField
                label="Account Number"
                name="account"
                placeholder="Enter account number"
                icon={CreditCard}
                required
                hint="Will be masked after submission"
                onChange={formatAccountNumber}
              />
              
              <FormField
                label="IFSC Code"
                name="ifsc"
                placeholder="e.g. HDFC0001234"
                icon={Hash}
                required
                onChange={formatIfsc}
                maxLength={11}
              />
              
              <FormField
                label="Debit Limit (₹)"
                name="limit"
                type="number"
                placeholder="e.g. 25000"
                icon={IndianRupee}
                required
                hint="Maximum amount per debit transaction"
                min="1"
                max="1000000"
                step="100"
              />
              
              {/* Full-width date field */}
              <div className="sm:col-span-2">
                <FormField
                  label="Start Date"
                  name="startDate"
                  type="date"
                  icon={Calendar}
                  required
                />
              </div>
            </div>

            {/* Disclaimer */}
            <p className="mt-5 text-[11px] text-slate-400 leading-relaxed">
              By submitting, you confirm that the account holder has authorized this NACH mandate.
              The mandate will be registered with NPCI and the bank within 2–3 working days.
            </p>

            {/* Form actions */}
            <div className="mt-5 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleReset}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition text-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-sm shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={16} /> {submitButtonText}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Also export types for TypeScript users ─────────────────────────────────
export const NachMandateFormData = {}; // For documentation