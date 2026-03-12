import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { MapPin, Building2 } from "lucide-react";
import InputField from "../ui/InputField";
import SelectField from "../ui/SelectField";
import TextAreaField from "../ui/TextAreaField";
import Button from "../ui/Button";
import ToggleSwitch from "../ui/ToggleSwitch"; 
import { zodResolver } from "@hookform/resolvers/zod";
import { branchSchema } from "../../validations/BranchValidation";

export default function AddBranchForm({ branch = null, mainBranches = [], onClose, onSave }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: branch?.name || "",
      code: branch?.code || "",
      type: branch?.type || "MAIN",
      parentBranchId: branch?.parentBranchId || "",
      city: branch?.city || "",
      state: branch?.state || "",
      address: branch?.address || "",
      head: branch?.head || "",
      isActive: branch?.isActive !== undefined ? branch.isActive : true,
    },
  });

  const branchType = watch("type");
  const branchName = watch("name");

  useEffect(() => {
    if (!branch && branchName) {
      const generatedCode = branchName
        .toUpperCase()
        .replace(/\s+/g, "_")
        .replace(/[^A-Z0-9_]/g, "")
        .slice(0, 10);
      setValue("code", generatedCode);
    }
  }, [branchName, setValue, branch]);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      parentBranchId: data.type === "MAIN" ? null : data.parentBranchId,
    };
    await onSave(payload);
  };

  return (
    // Responsive Max Width: full on mobile, max-w-2xl on tablet/desktop
    <div className="w-full max-w-2xl mx-auto bg-white sm:rounded-xl shadow-sm border-x sm:border border-slate-200 overflow-hidden">

      {/* Header Section: Adjusted padding for mobile */}
      <div className="p-4 sm:p-5 border-b bg-slate-50/50 flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg shrink-0">
          <Building2 className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <h3 className="font-bold text-lg sm:text-xl text-slate-800 leading-tight">
            {branch ? "Edit Branch" : "New Branch"}
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm">Enter branch location and management details.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="divide-y divide-slate-100">
        <div className="p-4 sm:p-6 space-y-6">

          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="md:col-span-2">
                <InputField
                  label="Branch Name"
                  required
                  {...register("name")}
                  error={errors.name?.message}
                />
              </div>

              <InputField
                label="Branch Code"
                required
                {...register("code")}
                error={errors.code?.message}
              />

              <SelectField label="Branch Type" {...register("type")}>
                <option value="MAIN">Main Branch</option>
                <option value="SUB">Subsidiary Branch</option>
              </SelectField>
            </div>

            {branchType === "SUB" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <SelectField
                  label="Parent Branch"
                  required
                  {...register("parentBranchId")}
                  error={errors.parentBranchId?.message}
                >
                  <option value="">Select Main Branch</option>
                  {mainBranches
                    .filter(b => b.id !== branch?.id)
                    .map(b => (
                      <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
                    ))
                  }
                </SelectField>
              </div>
            )}
          </div>

          <hr className="border-slate-100" />

          {/* Section 2: Location & Management */}
          <div className="space-y-4">
            <h4 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Location & Management</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <InputField label="City" icon={MapPin} {...register("city")} />
              <InputField label="State" {...register("state")} />
            </div>
            <TextAreaField label="Full Address" rows={3} {...register("address")} />
            <InputField label="Branch Manager / Head" {...register("head")} />
          </div>

          {/* Status Toggle - Compact on mobile, spread on desktop */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex gap-3 items-start sm:items-center">
              <div className={`mt-1 sm:mt-0 p-2 rounded-lg shrink-0 ${watch("isActive") ? 'bg-green-100' : 'bg-slate-200'}`}>
                <div className={`w-2.5 h-2.5 rounded-full ${watch("isActive") ? 'bg-green-600' : 'bg-slate-400'}`} />
              </div>
              <div>
                <p className="font-bold text-sm sm:text-base text-slate-800">Branch Status</p>
                <p className="text-[11px] sm:text-xs text-slate-500 max-w-50 sm:max-w-none">
                  {watch("isActive") ? "Active and visible in reports." : "Inactive and hidden from operations."}
                </p>
              </div>
            </div>

            <div className="flex justify-end sm:block">
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <ToggleSwitch
                    checked={field.value}
                    onChange={field.onChange}
                    label={field.value ? "Active" : "Inactive"}
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions: Stacked on tiny screens, side-by-side on mobile+ */}
        <div className="p-4 sm:p-5 bg-slate-50/50 flex flex-col-reverse sm:flex-row justify-end gap-3">
          <Button 
            type="button" 
            onClick={onClose} 
            className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-600! border border-slate-200 px-6"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            loading={isSubmitting} 
            className="w-full sm:w-auto px-10"
          >
            {branch ? "Save Changes" : "Create Branch"}
          </Button>
        </div>
      </form>
    </div>
  );
}