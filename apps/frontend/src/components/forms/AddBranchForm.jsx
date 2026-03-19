import { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { Building2 } from "lucide-react";
import InputField from "../ui/InputField";
import SelectField from "../ui/SelectField";
import Button from "../ui/Button";
import ToggleSwitch from "../ui/ToggleSwitch";
import { zodResolver } from "@hookform/resolvers/zod";
import { branchSchema } from "../../validations/BranchValidation";

export default function AddBranchForm({
  branch = null,
  mainBranches = [],
  onClose,
  onSave,
}) {
  const BRANCH_TYPE_OPTIONS = [
    { value: "HEAD_OFFICE", label: "Head Office" },
    { value: "ZONAL", label: "Zonal" },
    { value: "REGIONAL", label: "Regional" },
    { value: "BRANCH", label: "Branch" },
  ];

  const isTopLevelType = (type) => type === "HEAD_OFFICE" || type === "MAIN";

  const getExpectedParentType = (type) => {
    if (type === "ZONAL") return "HEAD_OFFICE";
    if (type === "REGIONAL") return "ZONAL";
    if (type === "BRANCH") return "REGIONAL";
    return null;
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: branch?.name || "",
      code: branch?.code || "",
      type: branch?.type || "BRANCH",
      parentBranchId: branch?.parentBranchId || branch?.parentBranch?.id || "",
      isActive: branch?.isActive !== undefined ? branch.isActive : true,
    },
  });

  const branchType = useWatch({
    control,
    name: "type",
    defaultValue: branch?.type || "BRANCH",
  });

  const branchName = useWatch({
    control,
    name: "name",
    defaultValue: branch?.name || "",
  });

  const isActiveValue = useWatch({
    control,
    name: "isActive",
    defaultValue: branch?.isActive !== undefined ? branch.isActive : true,
  });

  const selectedParentId = useWatch({
    control,
    name: "parentBranchId",
    defaultValue: branch?.parentBranchId || branch?.parentBranch?.id || "",
  });

  useEffect(() => {
    reset({
      name: branch?.name || "",
      code: branch?.code || "",
      type: branch?.type || "BRANCH",
      parentBranchId: branch?.parentBranchId || branch?.parentBranch?.id || "",
      isActive: branch?.isActive !== undefined ? branch.isActive : true,
    });
  }, [branch, reset]);

  const expectedParentType = getExpectedParentType(branchType);

  const parentBranchOptions = [
    { value: "", label: "Select Parent Branch" },
    ...mainBranches
      .filter((b) => b.id !== branch?.id)
      .filter((b) => {
        if (!expectedParentType) return false;
        return b.type === expectedParentType;
      })
      .map((b) => ({
        value: b.id,
        label: `${b.name} (${b.code})`,
      })),
  ];

  // Generate code from branch name
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

  useEffect(() => {
    if (isTopLevelType(branchType)) {
      if (selectedParentId) {
        setValue("parentBranchId", "", { shouldValidate: true });
      }
      return;
    }

    if (!selectedParentId) return;

    const selectedParent = mainBranches.find((b) => b.id === selectedParentId);
    if (!selectedParent || selectedParent.type !== expectedParentType) {
      setValue("parentBranchId", "", { shouldValidate: true });
    }
  }, [
    branchType,
    expectedParentType,
    mainBranches,
    selectedParentId,
    setValue,
  ]);

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      code: data.code,
      type: data.type,
      parentBranchId: isTopLevelType(data.type) ? null : data.parentBranchId,
      isActive: data.isActive,
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
          <p className="text-slate-500 text-xs sm:text-sm">
            Enter branch location and management details.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="divide-y divide-slate-100"
      >
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

              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Branch Type"
                    options={BRANCH_TYPE_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.type?.message}
                  />
                )}
              />
            </div>

            {!isTopLevelType(branchType) && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <Controller
                  name="parentBranchId"
                  control={control}
                  render={({ field }) => (
                    <SelectField
                      label="Parent Branch"
                      required
                      options={parentBranchOptions}
                      value={field.value}
                      onChange={field.onChange}
                      isSearchable
                      inlineMenu
                      error={errors.parentBranchId?.message}
                    />
                  )}
                />
              </div>
            )}
          </div>

          {/* Status Toggle - Compact on mobile, spread on desktop */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex gap-3 items-start sm:items-center">
              <div
                className={`mt-1 sm:mt-0 p-2 rounded-lg shrink-0 ${isActiveValue ? "bg-green-100" : "bg-slate-200"}`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full ${isActiveValue ? "bg-green-600" : "bg-slate-400"}`}
                />
              </div>
              <div>
                <p className="font-bold text-sm sm:text-base text-slate-800">
                  Branch Status
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500 max-w-50 sm:max-w-none">
                  {isActiveValue
                    ? "Active and visible in reports."
                    : "Inactive and hidden from operations."}
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
