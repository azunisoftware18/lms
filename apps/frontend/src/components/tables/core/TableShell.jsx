// TableShell.jsx - Updated with responsive wrapper
import React from "react";

export default function TableShell({ children }) {
  const childArray = React.Children.toArray(children);
  const head = childArray[0] ?? null;
  const body = childArray[1] ?? null;
  const footer = childArray[2] ?? null;

  return (
    <div className="w-full max-w-full min-w-0 bg-white border border-slate-300 rounded-xl sm:rounded-2xl shadow-sm overflow-visible transition-all duration-300">
      <div className="w-full max-w-full overflow-x-auto overflow-y-visible scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
        <table className="w-full text-xs sm:text-sm text-left text-slate-600 border-collapse">
          {head}
          {body}
        </table>
      </div>
      {footer && (
        <div className="border-t border-slate-200 bg-slate-50 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-slate-600">
          {footer}
        </div>
      )}

      {/* Add custom scrollbar styles */}
      <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          height: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
