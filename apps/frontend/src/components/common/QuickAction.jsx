import React from 'react';
import { ChevronRight, Loader2 } from 'lucide-react';

const QuickActionCard = ({
  title,
  subtitle,
  icon: Icon,
  onClick,
  variant = "blue", // "blue" | "indigo" | "sky" | "white"
  isLoading = false,
  className = ""
}) => {
  
  // Blue & White UI themed variants
  const variants = {
    // Primary Blue (Strong)
    blue: {
      container: "bg-blue-50 border-blue-100 hover:bg-blue-100/50 hover:border-blue-200",
      iconBox: "bg-blue-500 text-white shadow-sm", // Solid icon box for primary
      title: "text-blue-900",
      subtitle: "text-blue-600"
    },
    // Indigo (Professional / Darker Blue)
    indigo: {
      container: "bg-indigo-50 border-indigo-100 hover:bg-indigo-100/50 hover:border-indigo-200",
      iconBox: "bg-indigo-100 text-indigo-600",
      title: "text-indigo-900",
      subtitle: "text-indigo-500"
    },
    // Sky Blue (Light / Fresh)
    sky: {
      container: "bg-sky-50 border-sky-100 hover:bg-sky-100/50 hover:border-sky-200",
      iconBox: "bg-sky-500 text-white shadow-sm",
      title: "text-sky-900",
      subtitle: "text-sky-600"
    },
    // Clean White Theme (Standard)
    white: {
      container: "bg-white border-slate-200 hover:border-blue-400 hover:shadow-md",
      iconBox: "bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600",
      title: "text-slate-800",
      subtitle: "text-slate-500"
    }
  };

  const theme = variants[variant] || variants.blue;

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`
        flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300
        text-left group w-full relative overflow-hidden active:scale-[0.98]
        ${theme.container} ${className}
      `}
    >
      {/* Icon Section */}
      <div className={`
        flex-0 p-3 rounded-xl transition-all duration-300 
        group-hover:rotate-6 ${theme.iconBox}
      `}>
        {isLoading ? (
          <Loader2 size={24} className="animate-spin" />
        ) : (
          Icon && <Icon size={22} strokeWidth={2.5} />
        )}
      </div>

      {/* Text Content */}
      <div className="flex-1">
        <h4 className={`font-bold text-sm sm:text-base tracking-tight ${theme.title}`}>
          {title}
        </h4>
        {subtitle && (
          <p className={`text-xs font-medium mt-0.5 ${theme.subtitle}`}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Subtle Arrow */}
      <div className={`p-1.5 rounded-full opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 ${theme.container.includes('bg-white') ? 'bg-blue-50' : 'bg-white/50'}`}>
        <ChevronRight size={16} className={theme.title} />
      </div>
    </button>
  );
};

export default QuickActionCard;