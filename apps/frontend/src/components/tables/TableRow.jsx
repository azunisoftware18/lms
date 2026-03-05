import React from 'react';

const TableRow = ({ children, onClick, className = "" }) => {
  return (
    <tr 
      onClick={onClick}
      className={`
        group transition-colors 
        ${onClick ? 'cursor-pointer hover:bg-blue-50/50 active:bg-blue-100/30' : 'hover:bg-slate-50/50'}
        ${className}
      `}
    >
      {children}
    </tr>
  );
};

export default TableRow;