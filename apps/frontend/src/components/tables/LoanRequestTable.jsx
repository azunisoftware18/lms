import { Eye, Users, Building } from "lucide-react";
import { TableShell, TableBody } from "./core";

export default function LoanRequestTable({
  items = [],
  onView,
  statusBadge,
  primaryColorClass = "text-blue-600",
  employees = [],
  footer,
}) {
  const columns = [
    {
      header: "Loan ID",
      accessor: "id",
      render: (value) => (
        <span className={`font-bold ${primaryColorClass}`}>{value}</span>
      ),
    },
    { header: "Borrower", accessor: "borrower" },
    {
      header: "Amount",
      accessor: "amount",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    {
      header: "Source / Partner",
      accessor: "loanSource",
      render: (value) => (
        <span className="flex items-center gap-1 font-medium">
          {employees.includes(value) ? (
            <Users size={14} className="text-green-500" />
          ) : (
            <Building size={14} className="text-purple-500" />
          )}
          {value}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (value) =>
        typeof statusBadge === "function" ? statusBadge(value) : value,
    },
    {
      header: "Approved By",
      accessor: "approvedBy",
      render: (value) =>
        value || <span className="text-gray-400 italic">N/A</span>,
    },
  ];

  const actions = [
    {
      label: "View",
      icon: <Eye size={16} />,
      onClick: (row) => {
        if (typeof onView === "function") onView(row);
      },
    },
  ];

  return (
    <TableShell>
      <thead className="bg-slate-50 border-b border-slate-300">
        <tr className="border-t border-slate-300">
          {columns.map((column) => (
            <th
              key={column.accessor}
              className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-slate-600 uppercase tracking-wider text-[10px] sm:text-[11px] whitespace-nowrap"
            >
              {column.header}
            </th>
          ))}
          <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-slate-600 uppercase tracking-wider text-[10px] sm:text-[11px] text-right whitespace-nowrap">
            Actions
          </th>
        </tr>
      </thead>

      <TableBody columns={columns} data={items} actions={actions} />

      {footer || null}
    </TableShell>
  );
}
