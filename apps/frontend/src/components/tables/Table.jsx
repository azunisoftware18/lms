import React from 'react';

const Table = ({ children, className = "" }) => {
  return (
    <div className={`w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {children}
        </table>
      </div>
    </div>
  );
};

export default Table;