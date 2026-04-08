// TableBody.jsx - Updated with responsive handling
import { useState, useEffect } from "react";
import TableEmpty from "./TableEmpty";
import TableRow from "./TableRow";
import ActionMenu from "../../common/ActionMenu";

export default function TableBody({
  columns = [],
  data = [],
  actions = [],
  wrapCells = false,
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!data.length) {
    return <TableEmpty colSpan={columns.length + 1} />;
  }

  // Mobile: render rows as stacked cards for better readability
  if (isMobile) {
    return (
      <tbody className="divide-y divide-slate-100">
        {data.map((row, index) => {
          const rowActions =
            typeof actions === "function" ? actions(row) : actions;
          const inlineActions = Array.isArray(rowActions)
            ? rowActions.filter((a) => a.inline)
            : [];
          const menuActions = Array.isArray(rowActions)
            ? rowActions.filter((a) => !a.inline)
            : [];

          return (
            <tr key={row.id || index} className="px-3 py-2">
              <td colSpan={columns.length + 1} className="px-3 py-3">
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      {columns.map((col) => (
                        <div key={col.accessor} className="mb-2">
                          <div className="text-[11px] text-slate-400">
                            {col.header}
                          </div>
                          <div className="text-sm font-medium text-slate-800 truncate">
                            {col.render
                              ? col.render(row[col.accessor], row)
                              : String(row[col.accessor] ?? "-")}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="shrink-0 flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
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

                        {menuActions.length > 0 && (
                          <ActionMenu
                            actions={menuActions.map((action) => ({
                              ...action,
                              onClick: () => action.onClick(row),
                            }))}
                          />
                        )}
                      </div>

                      {/* ID removed from mobile card view to avoid clutter */}
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    );
  }

  return (
    <tbody className="divide-y divide-slate-100">
      {data.map((row, index) => {
        const rowActions =
          typeof actions === "function" ? actions(row) : actions;

        return (
          <TableRow
            key={row.id || index}
            columns={columns}
            row={row}
            actions={rowActions}
            isLast={index === data.length - 1}
            wrapCells={wrapCells}
          />
        );
      })}
    </tbody>
  );
}
