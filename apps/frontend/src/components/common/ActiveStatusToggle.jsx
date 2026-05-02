// apps/frontend/src/components/common/ActiveStatusToggle.jsx
import { ToggleRight, ToggleLeft } from "lucide-react";

export const ActiveStatusToggle = ({ isActive, onToggle }) => {
  return (
    <div className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
        <span className="text-xs font-semibold text-slate-700">
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>
      <button
        onClick={onToggle}
        className={`transition-colors ${isActive ? "text-emerald-500 hover:text-emerald-700" : "text-slate-400 hover:text-slate-600"}`}
      >
        {isActive ? <ToggleRight size={26} strokeWidth={1.8} /> : <ToggleLeft size={26} strokeWidth={1.8} />}
      </button>
    </div>
  );
};