import React from 'react';

const TableLoader = ({ rows = 5, cols = 4 }) => {
  return (
    <>
      {[...Array(rows)].map((_, i) => (
        <tr key={i} className="animate-pulse">
          {[...Array(cols)].map((_, j) => (
            <td key={j} className="px-6 py-4">
              <div className="h-4 bg-slate-100 rounded-lg w-full" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default TableLoader;