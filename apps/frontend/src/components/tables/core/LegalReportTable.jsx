import React from "react";
import { Eye, CheckCircle, Download, Trash2 } from "lucide-react";
import { TableShell, TableBody, TableLoader } from "./index";

export default function LegalReportTable({
  items = [],
  loading = false,
  onView,
  onApprove,
  onDownload,
  onDelete,
}) {
  const columns = [
    {
      header: "Loan #",
      accessor: "loanNumber",
      render: (value, row) => (
        
          <div>
            <div className="text-sm font-medium text-slate-800">{value || row.loanNumber || row.loanApplication?.loanNumber || row.loanApplicationId || "-"}</div>
          </div>
        ),
    },
    { header: "Advocate", accessor: "advocateName" },
    { header: "Law Firm", accessor: "lawFirmName" },
    { header: "Owner", accessor: "ownerName" },
    { header: "Ownership", accessor: "ownershipType" },
    { header: "Submitted", accessor: "submittedAt", render: (v) => (v ? new Date(v).toLocaleDateString() : "-") },
    { header: "Status", accessor: "status" },
  ];

  const actions = [
    {
      label: "View",
      icon: <Eye className="w-4 h-4" />,
      onClick: (row) => onView && onView(row),
    },
    {
      label: "Approve",
      icon: <CheckCircle className="w-4 h-4" />,
      onClick: (row) => onApprove && onApprove(row),
    },
    {
      label: "Download",
      icon: <Download className="w-4 h-4" />,
      onClick: (row) => onDownload && onDownload(row),
    },
    {
      label: "Delete",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (row) => onDelete && onDelete(row),
      isDanger: true,
    },
  ];

  return (
    <TableShell>
      <thead className="bg-slate-50 border-b border-slate-200">
        <tr>
          {columns.map((column) => (
            <th
              key={column.accessor}
              className="px-4 xl:px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
            >
              {column.header}
            </th>
          ))}
          <th className="px-4 xl:px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>

      {loading ? <TableLoader colSpan={columns.length + 1} /> : <TableBody columns={columns} data={items} actions={actions} />}
    </TableShell>
  );
}
