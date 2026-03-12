import { Copy, Check } from "lucide-react";
import { useState } from "react";

export default function InfoItem({ label, value, icon: Icon, copyable = false, onClick }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation(); // Click event ko parent tak jane se rokta hai
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group flex flex-col gap-1.5 transition-all">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
        {label}
      </span>

      <div 
        onClick={onClick}
        className={`flex items-center gap-2 text-slate-700 font-medium leading-tight ${onClick ? 'cursor-pointer hover:text-blue-600' : ''}`}
      >
        {Icon && <Icon size={16} className="text-slate-400 group-hover:text-blue-400 transition-colors" />}
        <span className="truncate">{value || "-"}</span>

        {copyable && value && (
          <button
            onClick={handleCopy}
            className="ml-auto opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 rounded transition-all"
            title="Copy to clipboard"
          >
            {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} className="text-slate-400" />}
          </button>
        )}
      </div>
    </div>
  );
}