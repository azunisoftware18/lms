import React from 'react';

const ToggleSwitch = ({ 
  checked = false,
  onChange,
  label,
  size = "md",
  className = ""
}) => {

  const sizes = {
    sm: { track: "w-8 h-4", dot: "w-3 h-3", translate: "translate-x-4" },
    md: { track: "w-11 h-6", dot: "w-5 h-5", translate: "translate-x-5" },
    lg: { track: "w-14 h-8", dot: "w-7 h-7", translate: "translate-x-6" }
  };

  const currentSize = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent
          transition-colors duration-200 ease-in-out outline-none focus:ring-2 focus:ring-blue-500/20
          ${currentSize.track}
          ${checked ? 'bg-blue-600' : 'bg-slate-200'}
        `}
      >
        <span
          aria-hidden="true"
          className={`
            pointer-events-none inline-block transform rounded-full bg-white shadow ring-0
            transition duration-200 ease-in-out
            ${currentSize.dot}
            ${checked ? currentSize.translate : 'translate-x-0'}
          `}
        />
      </button>

      {label && (
        <span
          className="text-sm font-medium text-slate-700 cursor-pointer"
          onClick={() => onChange(!checked)}
        >
          {label}
        </span>
      )}
    </div>
  );
};

export default ToggleSwitch;