// apps/frontend/src/components/ui/PasswordField.jsx
import { useState } from "react";
import { Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

export const PasswordField = ({ label, value, onChange, error, hint }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
          <Lock size={16} />
        </div>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder="Enter new password"
          className={`w-full rounded-xl border pl-10 pr-10 py-2.5 text-sm outline-none transition-all
            ${error
              ? "border-red-400 focus:ring-4 focus:ring-red-100"
              : "border-blue-400 bg-white focus:ring-4 focus:ring-blue-500/10"
            } text-slate-900`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {error && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
};