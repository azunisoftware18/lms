// apps/frontend/src/components/details/PasswordValidationRules.jsx
import { CheckCircle } from "lucide-react";

export const PasswordValidationRules = ({ password, confirmPassword }) => {
  const rules = [
    { label: "Min 8 chars", ok: password.length >= 8 },
    { label: "Max 128 chars", ok: password.length <= 128 && password.length > 0 },
    { label: "Passwords match", ok: password === confirmPassword && password.length > 0 },
  ];

  return (
    <div className="flex flex-wrap gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
      {rules.map(({ label, ok }) => (
        <div key={label} className={`flex items-center gap-1.5 text-[11px] font-semibold ${ok ? "text-emerald-600" : "text-slate-400"}`}>
          {ok ? (
            <CheckCircle size={12} className="text-emerald-500" />
          ) : (
            <div className="w-3 h-3 rounded-full border-2 border-slate-300" />
          )}
          {label}
        </div>
      ))}
    </div>
  );
};