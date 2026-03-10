import ActionMenu from "../../common/ActionMenu";

export default function TableRow ({ columns, row, actions = [] }) {
  return (
    <tr className="hover:bg-blue-50 transition-colors duration-150 group">
      {columns.map((col) => (
        <td 
          key={col.accessor} 
          // Yahan border color wahi rakhein jo aapko puri row mein chahiye
          className="px-6 py-4 whitespace-nowrap border-b border-slate-400 group-last:border-none font-medium text-slate-700"
        >
          {col.render
            ? col.render(row[col.accessor], row)
            : row[col.accessor]}
        </td>
      ))}
      
      {/* Action Menu Column - Iski border class bhi match karni chahiye */}
      <td className="px-6 py-4 text-right border-b border-slate-400 group-last:border-none">
        <ActionMenu
          actions={actions.map((action) => ({
            ...action,
            onClick: () => action.onClick(row),
          }))}
        />
      </td>
    </tr>
  );
}