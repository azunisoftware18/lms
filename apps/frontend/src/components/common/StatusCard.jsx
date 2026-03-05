import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatusCard = ({ 
  title, 
  value, 
  subtext, 
  icon: Icon, 
  variant = "blue", // "blue" | "red" | "green" | "orange" | "purple"
  trend, // { value: number, isPositive: boolean }
  isLoading = false,
  className = "" 
}) => {
  
  const variants = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    red: "bg-red-50 text-red-600 border-red-100",
    green: "bg-green-50 text-green-600 border-green-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="h-8 w-24 bg-gray-300 rounded" />
          </div>
          <div className="h-12 w-12 bg-gray-200 rounded-xl" />
        </div>
        <div className="mt-4 h-4 w-32 bg-gray-100 rounded" />
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-500 tracking-wide uppercase">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
        </div>
        
        <div className={`p-3 rounded-2xl border ${variants[variant] || variants.blue}`}>
          {Icon && <Icon size={24} strokeWidth={2.5} />}
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-2">
        {trend && (
          <div className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded-md ${
            trend.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {trend.isPositive ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
            {trend.value}%
          </div>
        )}
        
        {subtext && (
          <span className="text-sm text-slate-500 font-medium">
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatusCard;