import React, { useId, useRef, useState, useEffect } from 'react';
import { Search, X, Loader2, User, ChevronRight } from 'lucide-react';
import Button from './Button';

const SearchField = ({
  value,
  onChange,
  onClear,
  onSearch,
  results = [],
  showResults = true, // ✨ New Prop: True/False condition
  placeholder = "Search...",
  isLoading = false,
  showButton = false,
  buttonText = "Search",
  className = "",
  containerClassName = "",
  onResultClick,
  ...props
}) => {
  const id = useId();
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    if (onClear) onClear();
    else onChange?.({ target: { value: '' } });
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative w-full ${containerClassName}`} ref={containerRef}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1 group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
            {isLoading && !showButton ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
          </div>

          <input
            id={id}
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder={placeholder}
            className={`
              w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm
              transition-all outline-none hover:bg-white hover:border-slate-300
              focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
              ${className}
            `}
            {...props}
          />

          {value && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-all"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {showButton && (
          <Button
            type="button"
            onClick={() => {
               onSearch?.();
               setShowDropdown(false);
            }}
            disabled={isLoading || !value}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : buttonText}
          </Button>
        )}
      </div>

      {/* --- Conditional Integrated Results Dropdown --- */}
      {/* ✨ Added showResults check here */}
      {showResults && showDropdown && value && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {results.length > 0 ? (
            <div className="py-2">
              <p className="px-4 py-1 text-[10px] font-bold text-slate-400 uppercase">Results</p>
              {results.map((item, index) => (
                <div
                  key={item.id || index}
                  onClick={() => {
                    onResultClick?.(item);
                    setShowDropdown(false);
                  }}
                  className="px-4 py-2.5 flex items-center justify-between hover:bg-blue-50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-blue-100 text-slate-500 group-hover:text-blue-600">
                      <User size={16} />
                    </div>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">
                      {item.name}
                    </span>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-400" />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm text-slate-400 italic">No matches found for "{value}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchField;