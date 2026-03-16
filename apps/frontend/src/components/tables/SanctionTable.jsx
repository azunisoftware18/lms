import { TableShell, TableBody } from "./core";

export default function SanctionTable({
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
              className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
            >
              {column.header}
            </th>
          ))}
          <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>

      <TableBody columns={columns} data={data} actions={actions} />
    </TableShell>
  );
}
