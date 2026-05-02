// components/ui/EditableField.jsx
import { AlertCircle } from "lucide-react";

export const EditableField = ({ 
  label, 
  value, 
  icon: Icon, 
  type = "text", 
  editing, 
  onChange, 
  error, 
  hint, 
  disabled,
  containerClassName = "" 
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>
      <div className="relative group">
        {Icon && (
          <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${editing ? "text-blue-500" : "text-slate-400"}`}>
            <Icon size={16} />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          disabled={!editing || disabled}
          className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-all outline-none
            ${Icon ? "pl-10" : "pl-4"}
            ${!editing || disabled
              ? "bg-slate-50 border-slate-200 text-slate-700 cursor-default"
              : error
              ? "bg-white border-red-400 focus:ring-4 focus:ring-red-100 text-slate-900"
              : "bg-white border-blue-400 focus:ring-4 focus:ring-blue-500/10 text-slate-900"
            }`}
        />
      </div>
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle size={11} /> {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-slate-400">{hint}</p>
      )}
    </div>
  );
};