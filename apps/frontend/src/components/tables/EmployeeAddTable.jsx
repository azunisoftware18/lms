import React, { useMemo } from "react";
import { AlertCircle, Eye, Edit, Trash2, Presentation } from "lucide-react";
import { TableShell, TableBody } from "./core";

export default function EmployeeAddTable({
  employees = [],
  presentations = [],
  onPermission,
  onView,
  onEdit,
  onDelete,
}) {
  const columns = useMemo(
    () => [
      {
        header: "Emp ID",
        accessor: "employeeId",
        render: (value) => (
          <span className="text-blue-600 text-sm font-medium">#{value}</span>
        ),
      },
      {
        header: "Employee Name",
        accessor: "fullName",
        render: (value, row) => {
          const pendingPresentations = presentations.filter(
            (presentation) =>
              presentation.employeeId === row.employeeId &&
              (presentation.status === "Pending" ||
                presentation.status === "In Progress"),
          ).length;

          return (
            <div className="font-medium text-gray-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                {value?.charAt(0) || "?"}
              </div>
              <div>
                <div>{value}</div>
                <div className="text-xs text-gray-500">{row.email}</div>
                {pendingPresentations > 0 && (
                  <div className="flex items-center gap-1 text-xs text-orange-600 mt-1">
                    <AlertCircle size={10} />
                    <span>{pendingPresentations} pending task(s)</span>
                  </div>
                )}
              </div>
            </div>
          );
        },
      },
      {
        header: "Department",
        accessor: "department",
        render: (value) => (
          <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium">
            {value}
          </span>
        ),
      },
      {
        header: "Designation",
        accessor: "designation",
      },
      {
        header: "Contact",
        accessor: "phone",
        render: (value, row) => (
          <div>
            <div>{value || row.contactNumber || "-"}</div>
            <div className="text-xs text-gray-500">
              Joined: {row.dateOfJoining}
            </div>
          </div>
        ),
      },
      {
        header: "Salary",
        accessor: "totalSalary",
        render: (value) => (
          <span className="text-green-600 font-bold text-sm">{value}</span>
        ),
      },
      {
        header: "Status",
        accessor: "status",
        render: (value, row) => (
          <div className="flex flex-col gap-1">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium border
								${
                  value === "Active"
                    ? "bg-green-50 text-green-700 border-green-100"
                    : value === "Inactive"
                      ? "bg-red-50 text-red-700 border-red-100"
                      : value === "On Leave"
                        ? "bg-yellow-50 text-yellow-700 border-yellow-100"
                        : "bg-gray-50 text-gray-700 border-gray-100"
                }`}
            >
              {value}
            </span>
            <span className="text-xs text-gray-500">
              Leaves: {row.leaveBalance} days
            </span>
          </div>
        ),
      },
    ],
    [presentations],
  );

  const actions = [
    {
      label: "Permissions",
      icon: Presentation,
      onClick: onPermission,
    },
    {
      label: "View Employee",
      icon: Eye,
      onClick: onView,
    },
    {
      label: "Edit Employee",
      icon: Edit,
      onClick: onEdit,
    },
    {
      label: "Delete Employee",
      icon: Trash2,
      onClick: onDelete,
      isDanger: true,
    },
  ];

  return (
    <TableShell>
      <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
        <tr>
          {columns.map((column) => (
            <th key={column.accessor} className="px-6 py-4">
              {column.header}
            </th>
          ))}
          <th className="px-6 py-4 text-right">Action</th>
        </tr>
      </thead>

      <TableBody columns={columns} data={employees} actions={actions} />
    </TableShell>
  );
}
