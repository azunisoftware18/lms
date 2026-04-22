import React, { useMemo, useState } from "react";
import InputField from "../ui/InputField";
import { LucideLoader } from "lucide-react";
import { useCreatePermission } from "../../hooks/usePermission";

export default function PermissionManagementModal({
  open,
  onClose,
  onSuccess,
}) {
  const [form, setForm] = useState({ code: "", name: "" });
  const [errors, setErrors] = useState({});
  const createPermission = useCreatePermission();

  const isSubmitting = createPermission.isPending;

  const normalizedCode = useMemo(
    () =>
      form.code
        .toUpperCase()
        .replace(/\s+/g, "_")
        .replace(/[^A-Z0-9_]/g, ""),
    [form.code],
  );

  const validate = () => {
    const nextErrors = {};

    if (!normalizedCode) {
      nextErrors.code = "Permission code is required";
    } else if (!/^[A-Z0-9_]+$/.test(normalizedCode)) {
      nextErrors.code =
        "Only uppercase letters, numbers, and underscores are allowed";
    }

    if (!form.name.trim()) {
      nextErrors.name = "Permission name is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setForm({ code: "", name: "" });
    setErrors({});
    onClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createPermission.mutateAsync({
        code: normalizedCode,
        name: form.name.trim(),
      });
      setForm({ code: "", name: "" });
      setErrors({});
      onSuccess?.();
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        form: error?.message || "Failed to create permission",
      }));
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-xl border border-slate-100">
        <h2 className="text-xl font-bold mb-1 text-slate-900">
          Create Permission
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Create a new permission code for role/user assignment.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Permission Code"
            value={form.code}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, code: e.target.value }));
              if (errors.code) setErrors((prev) => ({ ...prev, code: "" }));
            }}
            placeholder="e.g. MANAGE_BRANCH_SETTINGS"
            error={errors.code}
            isRequired={true}
          />

          <div className="-mt-2 text-xs text-slate-500">
            Normalized code:{" "}
            <span className="font-mono">{normalizedCode || "-"}</span>
          </div>

          <InputField
            label="Permission Name"
            value={form.name}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, name: e.target.value }));
              if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
            }}
            placeholder="e.g. Manage Branch Settings"
            error={errors.name}
            isRequired={true}
          />

          {errors.form && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {errors.form}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LucideLoader className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Permission"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
