import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Landmark,
  CreditCard,
  Hash,
  IndianRupee,
  Calendar,
  CheckCircle,
  AlertCircle,
  Shield,
  Zap,
  Activity,
  Plus,
} from "lucide-react";

import { NachMandateSchema } from "../../validations/NachMandateValidation";
import InputField from "../ui/InputField";
import Button from "../ui/Button";

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
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(NachMandateSchema),
    defaultValues,
    mode: "onBlur",
  });

  const onFormSubmit = async (data) => {
    if (onSubmit) {
      await onSubmit(data);
    }
  };

  const handleReset = () => {
    reset(defaultValues);
    if (onCancel) onCancel();
  };

  const FeatureHighlights = () => (
    <div className="flex flex-col sm:flex-row gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl">
      {[
        { icon: Zap, label: "Auto EMI Debit", sub: "Automated monthly collection" },
        { icon: Shield, label: "Bank Grade Security", sub: "256-bit encrypted mandate" },
        { icon: Activity, label: "Real-time Tracking", sub: "Instant debit notifications" },
      ].map(({ icon: Icon, label, sub }) => (
        <div key={label} className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-white rounded-lg shadow-sm border border-blue-100">
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

  return (
    <div className="space-y-6">

      {isSubmitSuccessful && (
        <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">
          <CheckCircle size={18} />
          Mandate created successfully!
        </div>
      )}

      {showFeatures && <FeatureHighlights />}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100">

        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 rounded-lg">
            <CreditCard size={15} className="text-blue-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Mandate Details</h3>
        </div>

        <div className="p-5 sm:p-6">

          <form onSubmit={handleSubmit(onFormSubmit)}>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* Bank */}
              <Controller
                name="bank"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Bank Name"
                    icon={Landmark}
                    placeholder="HDFC Bank"
                    isRequired
                    {...field}
                    error={errors.bank?.message}
                  />
                )}
              />

              {/* Account */}
              <Controller
                name="account"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Account Number"
                    icon={CreditCard}
                    placeholder="Enter account number"
                    isRequired
                    hint="Will be masked after submission"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 16);
                      field.onChange(value);
                    }}
                    error={errors.account?.message}
                  />
                )}
              />

              {/* IFSC */}
              <Controller
                name="ifsc"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="IFSC Code"
                    icon={Hash}
                    placeholder="HDFC0001234"
                    isRequired
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                    error={errors.ifsc?.message}
                  />
                )}
              />

              {/* Limit */}
              <Controller
                name="limit"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Debit Limit (₹)"
                    icon={IndianRupee}
                    type="number"
                    placeholder="25000"
                    isRequired
                    hint="Maximum amount per debit transaction"
                    {...field}
                    onChange={(e) =>
                      field.onChange(Number(e.target.value))
                    }
                    error={errors.limit?.message}
                  />
                )}
              />

              {/* Date */}
              <div className="sm:col-span-2">
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="Start Date"
                      icon={Calendar}
                      type="date"
                      isRequired
                      {...field}
                      error={errors.startDate?.message}
                    />
                  )}
                />
              </div>

            </div>

            <p className="mt-5 text-[11px] text-slate-400">
              By submitting, you confirm that the account holder has authorized
              this NACH mandate. Mandate will be registered with NPCI.
            </p>

            <div className="mt-5 flex flex-col sm:flex-row justify-end gap-3">

              <Button
                type="button"
                onClick={handleReset}
                className="!bg-white !text-slate-600 border border-slate-200 hover:!bg-slate-50"
              >
                Reset
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="!px-6 !py-2.5"
              >
                {isSubmitting ? "Creating..." : (
                  <>
                    <Plus size={16} />
                    {submitButtonText}
                  </>
                )}
              </Button>

            </div>

          </form>

        </div>
      </div>
    </div>
  );
}