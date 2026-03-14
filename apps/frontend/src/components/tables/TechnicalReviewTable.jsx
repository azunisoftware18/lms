import { TableShell, TableBody } from "./core";

export default function TechnicalReviewTable({
  columns = [],
  data = [],
  actions = [],
}) {
  return (
    <TableShell>
      <thead className="bg-slate-50 border-b border-slate-200">
        <tr>
          {columns.map((column) => (
            <th
              key={column.accessor}
              className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap"
            >
              {column.header}
            </th>
          ))}
          <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-right text-xs sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
            Actions
          </th>
        </tr>
      </thead>

      <TableBody columns={columns} data={data} actions={actions} />
    </TableShell>
  );
}
