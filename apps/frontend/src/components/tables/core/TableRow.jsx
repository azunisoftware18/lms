// TableRow.jsx - Updated with responsive styling
import ActionMenu from "../../common/ActionMenu";

export default function TableRow({
  columns,
  row,
  actions = [],
  isLast = false,
  wrapCells = false,
}) {
  const safeActions = Array.isArray(actions) ? actions : [];

  return (
    <tr className="hover:bg-blue-50/50 transition-colors duration-150 group">
      {columns.map((col) => (
        <td
          key={col.accessor}
          className={`px-3 sm:px-4 md:px-6 py-3 sm:py-4 ${wrapCells ? "whitespace-normal wrap-break-word" : "whitespace-nowrap"} text-xs sm:text-sm 
            ${!isLast ? "border-b border-slate-400" : ""} 
            font-medium text-slate-700 group-hover:text-slate-900`}
        >
          {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
        </td>
      ))}

      {/* Action Menu Column */}
      <td
        className={`px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-right 
        ${!isLast ? "border-b border-slate-400" : ""}`}
      >
        <ActionMenu
          actions={safeActions.map((action) => ({
            ...action,
            onClick: () => action.onClick(row),
          }))}
        />
      </td>
    </tr>
  );
}
