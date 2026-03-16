import { Shield } from "lucide-react";
import { TableShell, TableBody } from "./core";

const columns = [
  {
    accessor: "name",
    header: "Role",
    render: (value, row) => (
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gray-100">
          <Shield size={16} />
        </div>
        <div>
          <p className="font-semibold">{value}</p>
          <p className="text-xs text-gray-500">{row.description}</p>
        </div>
      </div>
    ),
  },
  { accessor: "email", header: "Email" },
  {
    accessor: "permissions",
    header: "Permissions",
    render: (value) => (
      <div className="flex flex-wrap gap-1 max-w-xs">
        {value.slice(0, 3).map((permission) => (
          <span
            key={permission}
            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
          >
            {permission}
          </span>
        ))}

        {value.length > 3 && (
          <span className="text-xs text-gray-500">
            +{value.length - 3} more
          </span>
        )}
      </div>
    ),
  },
  { accessor: "userCount", header: "Users" },
];

export default function AdminRoleTable({ data = [], actions = [] }) {
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
