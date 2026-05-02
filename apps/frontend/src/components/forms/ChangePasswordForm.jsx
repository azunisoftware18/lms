// apps/frontend/src/components/forms/ChangePasswordForm.jsx
import { Key, Fingerprint } from "lucide-react";
import { Card } from "../common/Card";
import { SectionHeader } from "../common/SectionHeader";
import { PasswordField } from "../ui/PasswordField";
import { PasswordValidationRules } from "../details/PasswordValidationRules";

export const ChangePasswordForm = ({ form, errors, onFieldChange, onSave }) => {
  return (
    <Card>
      <SectionHeader icon={Key} title="Change Password" />
      <div className="px-6 py-5 space-y-4">
        <PasswordValidationRules password={form.next} confirmPassword={form.confirm} />
        
        <PasswordField
          label="Current Password"
          value={form.current}
          onChange={onFieldChange("current")}
          error={errors.current}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PasswordField
            label="New Password"
            value={form.next}
            onChange={onFieldChange("next")}
            error={errors.next}
            hint="8–128 characters"
          />
          <PasswordField
            label="Confirm New Password"
            value={form.confirm}
            onChange={onFieldChange("confirm")}
            error={errors.confirm}
          />
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={onSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-sm shadow-blue-200 transition-all active:scale-95"
          >
            <Fingerprint size={15} /> Update Password
          </button>
        </div>
      </div>
    </Card>
  );
};