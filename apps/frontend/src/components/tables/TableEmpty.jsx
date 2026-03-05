import React from 'react';
import { Inbox } from 'lucide-react';

const TableEmpty = ({ message = "No data available", colSpan }) => {
  return (
    <tr>
      <td colSpan={colSpan} className="py-20 text-center">
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <Inbox size={48} strokeWidth={1} className="text-blue-200" />
          <p className="text-sm font-semibold text-slate-500">{message}</p>
        </div>
      </td>
    </tr>
  );
};

export default TableEmpty;