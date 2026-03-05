import React from 'react';

const TableCell = ({ children, isHeader = false, className = "" }) => {
  const baseClasses = "px-6 py-4 text-sm transition-all";

  if (isHeader) {
    return (
      <th className={`${baseClasses} font-bold text-slate-700 uppercase tracking-wider text-xs ${className}`}>
        {children}
      </th>
    );
  }

  return (
    <td className={`${baseClasses} text-slate-600 font-medium ${className}`}>
      {children}
    </td>
  );
};

export default TableCell;