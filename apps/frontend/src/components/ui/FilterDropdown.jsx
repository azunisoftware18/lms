import { useState, useEffect, useRef } from "react";
import { ChevronDown, Check, Filter } from "lucide-react";

export default function FilterDropdown({
  value,
  onChange,
  options = [],
  placeholder = "Filter by Status",
  disabled = false,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const activeOption = options.find((o) => o.value === value);

  // Outside click logic
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className={`relative inline-block ${className}`} ref={ref}>
      {/* Trigger Button */}
      <button
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={`
          flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all duration-200
          border rounded-xl shadow-sm min-w-[160px] justify-between
          ${open 
            ? "border-blue-500 ring-4 ring-blue-50 bg-white text-blue-600" 
            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"}
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        <div className="flex items-center gap-2">
          <Filter size={14} className={value ? "text-blue-500" : "text-gray-400"} />
          <span className="truncate">{activeOption?.label || placeholder}</span>
        </div>
        
        {/* CSS Rotation instead of Motion */}
        <ChevronDown 
          size={16} 
          className={`opacity-60 transition-transform duration-200 ${open ? "rotate-180" : ""}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 z-[999] mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl p-1.5 origin-top-right">
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
            {options.length > 0 ? (
              options.map((opt) => {
                const isActive = value === opt.value;

                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={`
                      w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-xl transition-all mb-0.5 last:mb-0
                      ${isActive 
                        ? "bg-blue-600 text-white font-medium shadow-md shadow-blue-200" 
                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-4 h-4 rounded-md border flex items-center justify-center transition-colors
                        ${isActive ? "border-white bg-white/20" : "border-gray-300 bg-white"}
                      `}>
                        {isActive && <Check size={12} strokeWidth={4} />}
                      </div>
                      <span>{opt.label}</span>
                    </div>

                    {typeof opt.count === "number" && (
                      <span className={`
                        px-2 py-0.5 rounded-full text-[10px] font-bold
                        ${isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}
                      `}>
                        {opt.count}
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-8 text-center text-gray-400 text-xs">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}