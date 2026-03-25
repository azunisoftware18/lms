import React, { useId, useState, forwardRef } from "react";
import { Eye, EyeOff, AlertCircle, Info } from "lucide-react";

const InputField = forwardRef(
  (
    {
      label,
      type = "text",
      placeholder,
      error,
      hint,
      icon: Icon, // Left side icon
      isRequired = false,
      isDisabled = false,
      className = "",
      containerClassName = "",
      as = "input", // 'input' or 'select'
      children,
      ...props
    },
    ref,
  ) => {
    const id = useId();
    const [showPassword, setShowPassword] = useState(false);

    // Password toggle logic
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
        {/* Label Logic */}
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-semibold text-slate-700 flex items-center gap-1"
          >
            {label}
            {isRequired && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="relative group">
          {/* Left Icon (Optional) */}
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <Icon size={18} />
            </div>
          )}

          {as === "select" ? (
            <select
              id={id}
              ref={ref}
              disabled={isDisabled}
              className={`
              w-full rounded-lg border px-4 py-2.5 text-sm transition-all outline-none
              ${Icon ? "pl-10" : "pl-4"}
              ${isDisabled ? "bg-slate-50 cursor-not-allowed text-slate-500" : "bg-white text-slate-900"}
              ${
                error
                  ? "border-red-500 focus:ring-4 focus:ring-red-100"
                  : "border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              }
              ${className}
            `}
              {...props}
            >
              {children}
            </select>
          ) : (
            <>
              <input
                id={id}
                ref={ref}
                type={inputType}
                disabled={isDisabled}
                placeholder={placeholder}
                className={`
                w-full rounded-lg border px-4 py-2.5 text-sm transition-all outline-none
                ${Icon ? "pl-10" : "pl-4"} 
                ${isPassword ? "pr-10" : "pr-4"}
                ${isDisabled ? "bg-slate-50 cursor-not-allowed text-slate-500" : "bg-white text-slate-900"}
                ${
                  error
                    ? "border-red-500 focus:ring-4 focus:ring-red-100"
                    : "border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                }
                ${className}
              `}
                {...props}
              />
              {/* Password Visibility Toggle */}
              {isPassword && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="flex items-center gap-1 text-xs font-medium text-red-600 mt-1 animate-in fade-in slide-in-from-top-1">
            <AlertCircle size={14} />
            {error}
          </p>
        )}

        {/* Hint Text */}
        {hint && !error && (
          <p className="flex items-center gap-1 text-xs text-slate-500 mt-1">
            <Info size={14} />
            {hint}
          </p>
        )}
      </div>
    );
  },
);

InputField.displayName = "InputField";

export default InputField;
