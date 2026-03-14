import { TableBody, TableShell } from "./core";

export default function SecuritySettingTable({
  columns = [],
  data = [],
  onRemove = () => {},
}) {
  return (
    <TableShell>
      <thead className="bg-slate-50 border-b border-slate-200">
        <tr>
          {columns.map((column) => (
            <th
              key={column.accessor}
              className="px-6 py-4 font-bold text-slate-800 uppercase tracking-wider text-[11px]"
            >
              {column.header}
            </th>
          ))}
          <th className="px-6 py-4 font-bold text-slate-800 uppercase tracking-wider text-[11px] text-right">
            Actions
          </th>
        </tr>
      </thead>

      <TableBody
        columns={columns}
        data={data}
        actions={[
          {
            label: "Remove",
            onClick: onRemove,
          },
        ]}
      />
    </TableShell>
  );
}
