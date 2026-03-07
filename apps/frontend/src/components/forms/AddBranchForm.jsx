import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form"; 
import { MapPin, Building2 } from "lucide-react";
import InputField from "../ui/InputField";
import SelectField from "../ui/SelectField";
import TextAreaField from "../ui/TextAreaField";
import Button from "../ui/Button";
import ToggleSwitch from "../ui/ToggleSwitch"; // Aapka switch component

const AddBranchForm = ({ branch = null, mainBranches = [], onClose, onSave }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control, // Controller ke liye zaroori hai
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: branch?.name || "",
      code: branch?.code || "",
      type: branch?.type || "MAIN",
      parentBranchId: branch?.parentBranchId || "",
      city: branch?.city || "",
      state: branch?.state || "",
      address: branch?.address || "",
      head: branch?.head || "",
      isActive: branch?.isActive !== undefined ? branch.isActive : true, // Boolean rakha hai
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
      // isActive toggle se pehle se hi boolean mil raha hai
      parentBranchId: data.type === "MAIN" ? null : data.parentBranchId,
    };
    await onSave(payload);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* Header Section */}
      <div className="p-6 border-b bg-slate-50/50 flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Building2 className="text-blue-600" size={24} />
        </div>
        <div>
          <h3 className="font-bold text-xl text-slate-800">
            {branch ? "Edit Branch Details" : "Create New Branch"}
          </h3>
          <p className="text-slate-500 text-sm">Fill in the details below.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="divide-y divide-slate-100">
        <div className="p-8 space-y-8">
          
          {/* Section 1: Basic Info */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <InputField
                  label="Branch Name"
                  required
                  {...register("name", { required: "Branch name is required" })}
                  error={errors.name?.message}
                />
              </div>

              <InputField
                label="Branch Code"
                required
                {...register("code", { required: "Code is required" })}
                error={errors.code?.message}
              />

              <SelectField label="Branch Type" {...register("type")}>
                <option value="MAIN">Main Branch</option>
                <option value="SUB">Subsidiary Branch</option>
              </SelectField>
            </div>

            {branchType === "SUB" && (
              <SelectField
                label="Parent Branch"
                required
                {...register("parentBranchId", { required: "Please select a parent branch" })}
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
            )}
          </div>

          <hr className="border-slate-100" />

          {/* Section 2: Management */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Location & Management</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="City" icon={MapPin} {...register("city")} />
              <InputField label="State" {...register("state")} />
            </div>
            <TextAreaField label="Full Address" rows={3} {...register("address")} />
            <InputField label="Branch Manager / Head" {...register("head")} />
          </div>

          <hr className="border-slate-100" />

          {/* Status Toggle Switch - Redesign */}
          <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex gap-4 items-center">
              <div className={`p-2 rounded-lg ${watch("isActive") ? 'bg-green-100' : 'bg-slate-200'}`}>
                <div className={`w-2.5 h-2.5 rounded-full ${watch("isActive") ? 'bg-green-600' : 'bg-slate-400'}`} />
              </div>
              <div>
                <p className="font-bold text-slate-800">Branch Status</p>
                <p className="text-xs text-slate-500">
                  {watch("isActive") ? "Branch is currently active and visible." : "Branch is inactive and hidden."}
                </p>
              </div>
            </div>

            {/* Controller for Custom ToggleSwitch */}
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

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50/50 flex justify-end gap-3">
          <Button type="button" onClick={onClose} className="bg-white hover:bg-slate-100 text-slate-600! border border-slate-200 px-6">
            Back to List
          </Button>
          <Button type="submit" loading={isSubmitting} className="px-10">
            {branch ? "Update Branch" : "Create Branch"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddBranchForm;