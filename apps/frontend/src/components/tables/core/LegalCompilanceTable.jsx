import { Eye, Edit2, Trash2 } from "lucide-react";
import { TableShell, TableBody, TableLoader } from "./index";

export default function LegalCompilanceTable({
  items = [],
  loading = false,
  getStatusBadge,
  getQualityBadge,
  onView,
  onEdit,
  onDelete,
}) {
  const columns = [
    {
      header: "Engineer",
      accessor: "engineerName",
      render: (value, row) => (
        <div>
          <div className="text-sm font-medium text-slate-800">{value}</div>
        </div>
      ),
    },
    { header: "Agency", accessor: "agencyName" },
    { header: "Property", accessor: "propertyType" },
    {
      header: "Location",
      accessor: "city",
      render: (value, row) => (
        <div>
          <div className="text-sm text-slate-600">{value}</div>
          <div className="text-xs text-slate-400">{row.state}</div>
        </div>
      ),
    },
    {
      header: "Value",
      accessor: "marketValue",
      render: (value) => (
        <span className="text-sm font-medium text-slate-800">{value}</span>
      ),
    },
    { header: "LTV", accessor: "recommendedLtv" },
    { header: "Construction", accessor: "constructionStatus" },
    {
      header: "Quality",
      accessor: "qualityOfConstruction",
      render: (value) =>
        typeof getQualityBadge === "function" ? getQualityBadge(value) : value,
    },
    {
      header: "Status",
      accessor: "status",
      render: (value) =>
        typeof getStatusBadge === "function" ? getStatusBadge(value) : value,
    },
  ];

  const actions = [
    {
      label: "View",
      icon: <Eye className="w-4 h-4" />,
      onClick: (row) => {
        if (typeof onView === "function") onView(row);
      },
    },
    {
      label: "Edit",
      icon: <Edit2 className="w-4 h-4" />,
      onClick: (row) => {
        if (typeof onEdit === "function") onEdit(row);
      },
    },
    {
      label: "Delete",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (row) => {
        if (typeof onDelete === "function") onDelete(row);
      },
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
          <th className="px-4 xl:px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>

      {loading ? (
        <TableLoader colSpan={columns.length + 1} />
      ) : (
        <TableBody columns={columns} data={items} actions={actions} />
      )}
    </TableShell>
  );
}
