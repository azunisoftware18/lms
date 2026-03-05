import React, { useId, forwardRef } from 'react';
import { AlertCircle, Info } from 'lucide-react';

const TextAreaField = forwardRef(({
  label,
  placeholder = "Enter your message...",
  error,
  hint,
  rows = 4,
  maxLength,
  value,
  onChange,
  isRequired = false,
  isDisabled = false,
  resize = "none", // ✨ New Prop: 'none', 'vertical', 'horizontal', 'both'
  className = "",
  containerClassName = "",
  ...props
}, ref) => {
  const id = useId();
  const charCount = value ? value.length : 0;

  // Resize logic map
  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
  };

  return (
    <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
      <div className="flex justify-between items-center">
        {label && (
          <label htmlFor={id} className="text-sm font-semibold text-slate-700 flex items-center gap-1">
            {label}
            {isRequired && <span className="text-red-500">*</span>}
          </label>
        )}
        
        {maxLength && (
          <span className={`text-[10px] font-medium ${charCount >= maxLength ? 'text-red-500' : 'text-slate-400'}`}>
            {charCount}/{maxLength}
          </span>
        )}
      </div>

      <div className="relative group">
        <textarea
          id={id}
          ref={ref}
          rows={rows}
          value={value}
          onChange={onChange}
          disabled={isDisabled}
          maxLength={maxLength}
          placeholder={placeholder}
          className={`
            w-full rounded-xl border px-4 py-3 text-sm transition-all outline-none
            ${resizeClasses[resize] || 'resize-none'} 
            ${isDisabled ? 'bg-slate-50 cursor-not-allowed text-slate-500' : 'bg-white text-slate-900'}
            ${error 
              ? 'border-red-500 focus:ring-4 focus:ring-red-100' 
              : 'border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'}
            ${className}
          `}
          {...props}
        />
      </div>

      {error && (
        <p className="flex items-center gap-1 text-xs font-medium text-red-600 mt-0.5">
          <AlertCircle size={14} /> {error}
        </p>
      )}

      {hint && !error && (
        <p className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
          <Info size={14} /> {hint}
        </p>
      )}
    </div>
  );
});

TextAreaField.displayName = 'TextAreaField';
export default TextAreaField;