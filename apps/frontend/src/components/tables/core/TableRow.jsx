// TableRow.jsx - Updated with responsive styling
import ActionMenu from "../../common/ActionMenu";
import { Eye, CreditCard } from 'lucide-react';

export default function TableRow({
  columns,
  row,
  actions = [],
  isLast = false,
  wrapCells = false,
}) {
  const safeActions = Array.isArray(actions) ? actions : [];
  const inlineActions = safeActions.filter(a => a.inline);
  const menuActions = safeActions.filter(a => !a.inline);

  return (
    <tr className="hover:bg-blue-50/50 transition-colors duration-150 group">
      {columns.map((col) => (
        <td
          key={col.accessor}
          className={`px-3 sm:px-4 md:px-6 py-3 sm:py-4 ${wrapCells ? "whitespace-normal wrap-break-word" : "whitespace-nowrap"} text-xs sm:text-sm 
            ${!isLast ? "border-b border-slate-400" : ""} 
            font-medium text-slate-700 group-hover:text-slate-900 ${col.cellClassName || ""}`}
        >
          {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
        </td>
      ))}

      {/* Action Menu Column */}
      <td
        className={`px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-right 
        ${!isLast ? "border-b border-slate-400" : ""}`}
      >
        <div className="flex items-center justify-end gap-2">
          {inlineActions.map((act, i) => (
            <button
              key={i}
              onClick={() => act.onClick(row)}
              className="inline-flex items-center gap-2 px-3 py-1.5 border rounded text-xs bg-white hover:bg-slate-50"
            >
              {act.icon}
              <span>{act.label}</span>
            </button>
          ))}

          <ActionMenu
            actions={menuActions.map((action) => ({
              ...action,
              onClick: () => action.onClick(row),
            }))}
          />
        </div>
      </td>
    </tr>
  );
}
