import React, { useState, useRef, useEffect, useMemo, forwardRef } from "react";
import {
  ChevronDown,
  X,
  Check,
  AlertCircle,
  Loader2,
  Search,
} from "lucide-react";

const SelectField = forwardRef(
  (
    {
      options = [],
      value,
      onChange,
      label,
      error,
      placeholder = "Select an option",
      isMulti = false,
      isSearchable = false,
      isDisabled = false,
      isLoading = false,
      isRequired = false,
      inlineMenu = false,
      className = "",
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const containerRef = useRef(null);
    const dropdownRef = useRef(null);
    const triggerRef = useRef(null);
    const dropdownId = `dropdown-${Math.random().toString(36).substr(2, 9)}`;

    // 1. Click Outside Logic
    useEffect(() => {
      const handler = (e) => {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
          setIsOpen(false);
          setSearchTerm("");
          setFocusedIndex(-1);
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, []);

    // 2. Keyboard Handler for Trigger
    const handleTriggerKeyDown = (e) => {
      if (isDisabled) return;

      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          setIsOpen(!isOpen);
          if (!isOpen) setFocusedIndex(0);
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setFocusedIndex(-1);
          break;
        case "ArrowDown":
          e.preventDefault();
          setIsOpen(true);
          setFocusedIndex(0);
          break;
        case "ArrowUp":
          e.preventDefault();
          setIsOpen(true);
          setFocusedIndex(Math.max(0, filteredOptions.length - 1));
          break;
        default:
          break;
      }
    };

    // 3. Keyboard Handler for Dropdown Navigation
    const handleDropdownKeyDown = (e) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case "Enter":
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
            handleSelect(filteredOptions[focusedIndex]);
            setFocusedIndex(-1);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setFocusedIndex(-1);
          triggerRef.current?.focus();
          break;
        default:
          break;
      }
    };

    // 4. Filtering Logic (Performance Optimized)
    const filteredOptions = useMemo(() => {
      return options.filter((opt) => {
        const label = opt.label ?? '';
        return label.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }, [options, searchTerm]);

    // 5. Reset focused index when filtered options change or menu closes
    useEffect(() => {
      if (!isOpen) {
        setFocusedIndex(-1);
      }
    }, [isOpen]);

    // 6. Selection Logic
    const handleSelect = (option) => {
      if (isDisabled || isLoading) return;

      if (isMulti) {
        const current = Array.isArray(value) ? value : [];
        const newValue = current.includes(option.value)
          ? current.filter((v) => v !== option.value)
          : [...current, option.value];
        onChange?.(newValue);
      } else {
        onChange?.(option.value);
        setIsOpen(false);
        setSearchTerm("");
        setFocusedIndex(-1);
      }
    };

    // 7. Option ID generator
    const getOptionId = (index) => `${dropdownId}-option-${index}`;
    const activedescendant =
      isOpen && focusedIndex >= 0
        ? getOptionId(focusedIndex)
        : undefined;

    const removeValue = (e, val) => {
      e.stopPropagation();
      onChange?.(value.filter((v) => v !== val));
    };

    return (
      <div
        className={`w-full flex flex-col gap-1.5 ${className}`}
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
      >
        {/* Label */}
        {label && (
          <label className="text-sm font-semibold text-slate-700 flex gap-1">
            {label} {isRequired && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          {/* Trigger / Input Container */}
          <div
            ref={triggerRef}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-controls={dropdownId}
            aria-activedescendant={activedescendant}
            tabIndex={isDisabled ? -1 : 0}
            onClick={() => !isDisabled && setIsOpen(!isOpen)}
            onKeyDown={handleTriggerKeyDown}
            className={`
            min-h-10.5 w-full flex items-center justify-between px-3 py-1.5 rounded-lg border transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1
            ${isOpen ? "border-blue-500 ring-2 ring-blue-100" : "border-slate-300"}
            ${error ? "border-red-500 bg-red-50" : "bg-white"}
            ${isDisabled ? "opacity-60 cursor-not-allowed bg-slate-50" : "hover:border-slate-400"}
          `}
          >
            <div className="flex flex-wrap gap-1.5 flex-1">
              {/* Multi-Select Chips */}
              {isMulti &&
                Array.isArray(value) &&
                value.map((v) => (
                  <span
                    key={v}
                    className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium"
                  >
                    {options.find((o) => o.value === v)?.label}
                    <X
                      size={14}
                      className="cursor-pointer hover:text-blue-900"
                      onClick={(e) => removeValue(e, v)}
                    />
                  </span>
                ))}

              {/* Placeholder or Single Value */}
              {(!isMulti || (isMulti && value?.length === 0)) && !isOpen && (
                <span className={!value ? "text-slate-400" : "text-slate-900"}>
                  {options.find((o) => o.value === value)?.label || placeholder}
                </span>
              )}

              {/* Search Input when Open */}
              {isOpen && isSearchable && (
                <input
                  autoFocus
                  className="bg-transparent outline-none border-none text-sm w-full"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>

            {/* Icons Area */}
            <div className="flex items-center gap-2 ml-2">
              {isLoading ? (
                <Loader2 size={16} className="animate-spin text-slate-400" />
              ) : (
                <ChevronDown
                  size={18}
                  className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              )}
            </div>
          </div>

          {/* Dropdown Menu */}
          {isOpen && (
            <div
              ref={dropdownRef}
              id={dropdownId}
              role="listbox"
              onKeyDown={handleDropdownKeyDown}
              className={`${inlineMenu ? "relative z-10" : "absolute z-50"} w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto animate-in fade-in zoom-in duration-150`}
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt, index) => {
                  const isSelected = isMulti
                    ? value?.includes(opt.value)
                    : value === opt.value;
                  const isFocused = index === focusedIndex;
                  return (
                    <div
                      key={opt.value}
                      id={getOptionId(index)}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        handleSelect(opt);
                        setFocusedIndex(-1);
                      }}
                      onMouseEnter={() => setFocusedIndex(index)}
                      className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between outline-none ${
                        isFocused ? "bg-slate-100" : "hover:bg-slate-50"
                      } ${isSelected ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-700"}`}
                    >
                      {opt.label}
                      {isSelected && <Check size={16} />}
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-slate-400 text-sm italic">
                  No results found.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Error / Hint */}
        {error && (
          <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
            <AlertCircle size={14} /> {error}
          </p>
        )}
      </div>
    );
  },
);

SelectField.displayName = "SelectField";
export default SelectField;
