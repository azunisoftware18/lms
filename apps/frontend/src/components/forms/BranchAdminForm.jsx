import React from "react";
import { useForm } from "react-hook-form";
import { Loader, AlertCircle, User, Mail, Phone, Lock, Building2 } from "lucide-react";
import InputField from "../ui/InputField"; // Reusable input
import SelectField from "../ui/SelectField"; // Reusable select
import Button from "../ui/Button"; // Reusable button
import { zodResolver } from "@hookform/resolvers/zod";
import { branchAdminSchema } from "../../validations/BranchAdminValidation";

const BranchAdminForm = ({ admin = null, branches = [], onSave, onClose, loading = false }) => {
  const isEditMode = !!admin;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(branchAdminSchema(isEditMode)),
    defaultValues: {
      fullName: admin?.fullName || "",
      email: admin?.email || "",
      userName: admin?.userName || "",
      contactNumber: admin?.contactNumber || "",
      password: "",
      branchId: admin?.branchId || admin?.branch?.id || "",
    },
  });

  const onSubmit = async (data) => {
    // Edit mode mein agar password khali hai toh usey delete kar do taaki purana password na badle
    const payload = { ...data };
    if (isEditMode && !payload.password) {
      delete payload.password;
    }
    await onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="divide-y divide-slate-100">
      <div className="p-8 space-y-6">

        {/* Basic Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <InputField
              label="Full Name"
              icon={User}
              placeholder="e.g. Rahul Sharma"
              required
              {...register("fullName")}
              error={errors.fullName?.message}
            />
          </div>

          <InputField
            label="Email Address"
            type="email"
            icon={Mail}
            placeholder="rahul@example.com"
            required
            {...register("email")}
            error={errors.email?.message}
          />

          <InputField
            label="Username"
            icon={User}
            placeholder="rahul_admin"
            required
            {...register("userName")}
            error={errors.userName?.message}
          />

          <InputField
            label="Contact Number"
            type="tel"
            icon={Phone}
            placeholder="9876543210"
            required
            {...register("contactNumber")}
            error={errors.contactNumber?.message}
          />

          <SelectField
            label="Assign Branch"
            icon={Building2}
            required
            {...register("branchId")}
            error={errors.branchId?.message}
          >
            <option value="">Select a branch</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name} {branch.code ? `(${branch.code})` : ""}
              </option>
            ))}
          </SelectField>

          <div className="md:col-span-2">
            <InputField
              label={isEditMode ? "New Password (Optional)" : "Account Password"}
              type="password"
              icon={Lock}
              placeholder={isEditMode ? "Leave blank to keep current" : "Minimum 6 characters"}
              required={!isEditMode}
              {...register("password")}
              error={errors.password?.message}
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 bg-slate-50/50 flex justify-end gap-3">
        <Button
          className="bg-white hover:bg-slate-100 text-slate-600! border border-slate-200 px-6"
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
          className="px-8"
        >
          {isEditMode ? "Update Admin" : "Create Admin Account"}
        </Button>
      </div>
    </form>
  );
};

export default BranchAdminForm;