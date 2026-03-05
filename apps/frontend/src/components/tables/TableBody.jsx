import React from 'react';

const TableBody = ({ children, className = "" }) => {
  return (
    <tbody className={`divide-y divide-slate-100 ${className}`}>
      {children}
    </tbody>
  );
};

export default TableBody;