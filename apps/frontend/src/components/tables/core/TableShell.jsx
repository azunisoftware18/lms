export const TableShell = ({ children }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
      <div className="overflow-x-auto ring-1 ring-slate-100">
        <table className="min-w-full text-sm text-left text-slate-600 border-collapse">
          {children[0]}
          {children[1]}
        </table>
      </div>
      {children[2] && (
        <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-2">
          {children[2]}
        </div>
      )}
    </div>
  );
};