import React from 'react';

const TableHead = ({ children, className = "" }) => {
  return (
    <thead className={`bg-blue-50/50 border-b border-slate-200 ${className}`}>
      {children}
    </thead>
  );
};

export default TableHead;