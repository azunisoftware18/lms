import React from "react";

/**
 * CheckboxGroup component for use with React Hook Form Controller.
 * @param {string} label - The label for the group.
 * @param {Array} options - Array of { value, label } objects.
 * @param {Array|string} value - The current value(s) (array for multi-select, string for single).
 * @param {Function} onChange - Change handler.
 */
export default function CheckboxGroup({
  label,
  options = [],
  value = [],
  onChange,
}) {
  // Ensure value is always an array
  const selected = Array.isArray(value) ? value : [];

  const handleChange = (checkedValue) => {
    if (selected.includes(checkedValue)) {
      onChange(selected.filter((v) => v !== checkedValue));
    } else {
      onChange([...selected, checkedValue]);
    }
  };

  return (
    <div>
      {label && (
        <p className="text-xs font-semibold text-slate-600 mb-2">{label}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer text-xs font-semibold transition-all select-none ${selected.includes(opt.value) ? "bg-blue-50 border-blue-400 text-blue-700" : "border-slate-200 text-slate-500 bg-white"}`}
          >
            <input
              type="checkbox"
              className="sr-only"
              value={opt.value}
              checked={selected.includes(opt.value)}
              onChange={() => handleChange(opt.value)}
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}
