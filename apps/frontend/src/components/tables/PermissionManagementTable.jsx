import React from "react";
import { useNavigate } from "react-router-dom";
import StatusCard from "../common/StatusCard";
import { Users } from "lucide-react";
import TableShell from "./core/TableShell";
import TableHead from "./core/TableHead";
import TableBody from "./core/TableBody";
import TableLoader from "./core/TableLoader";
import Pagination from "../common/Pagination";

export default function PermissionManagementTable({
  mode = "users", // 'users' or 'permissions'
  title,
  data = [],
  loading = false,
  page = 1,
  totalPages = 1,
  onPageChange,
  onRowClick,
  onTogglePermission,
  onManage, // callback when Manage Permissions is requested
  onRemovePermission,
  search = "",
  setSearch = () => {},
  dateValue = "",
  setDateValue = () => {},
  filterValue = "",
  setFilterValue = () => {},
  filterOptions = [],
}) {
  const navigate = useNavigate();
  if (mode === "users") {
    const columns = [
      {
        accessor: "fullName",
        header: "Name / Email",
        render: (val, row) => (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-sm text-gray-700">
              {row.avatar}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-slate-800 truncate">
                {row.fullName}
              </div>
              <div className="text-xs text-slate-500 truncate">{row.email}</div>
            </div>
          </div>
        ),
      },
      {
        accessor: "role",
        header: "Role",
        render: (val) => (
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {val}
          </span>
        ),
      },
      {
        accessor: "status",
        header: "Status",
        render: (val) => (
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${val === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
          >
            {val}
          </span>
        ),
      },
    ];

    return (
      <TableShell>
        <TableHead
          columns={columns}
          title={title || "System Users"}
          search={search}
          setSearch={setSearch}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          dateValue={dateValue}
          setDateValue={setDateValue}
          filterOptions={filterOptions}
        />

        {loading ? (
          <TableLoader colSpan={columns.length + 1} />
        ) : (
          <TableBody
            columns={columns}
            data={data}
            actions={(row) => [
              //   {
              //     label: selectedId === row.id ? "Selected" : "Select",
              //     inline: true,
              //     onClick: () => onRowClick && onRowClick(row.id),
              //   },
              {
                label: "Manage Permissions",
                inline: false,
                onClick: () => {
                  // if parent provided an onManage handler, call it (e.g. to open a modal)
                  if (onManage) return onManage(row);
                  onRowClick && onRowClick(row.id);

                  // fallback: navigate to the permission management page for this user
                  navigate(
                    `/admin/permission-management/user/${encodeURIComponent(row.id)}`,
                  );
                },
              },
            ]}
          />
        )}

        <div>
          <div className="flex items-center justify-end">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      </TableShell>
    );
  }

  // permissions mode
  const columns = [
    {
      accessor: "name",
      header: "Permission",
      render: (val, row) => (
        <div>
          <div className="text-sm font-medium text-slate-800 truncate">
            {row.name}
          </div>
          <div className="text-xs text-slate-500 truncate">
            {row.description}
          </div>
        </div>
      ),
    },
    {
      accessor: "code",
      header: "Code",
      render: (val) => (
        <div className="text-xs font-mono text-slate-500">{val}</div>
      ),
    },
    {
      accessor: "allowed",
      header: "Allowed",
      render: (val, row) => (
        <input
          type="checkbox"
          checked={!!val}
          onChange={() => onTogglePermission && onTogglePermission(row.code)}
          disabled={!onTogglePermission}
          className="h-4 w-4 text-blue-600"
        />
      ),
    },
  ];

  return (
    <TableShell>
      <TableHead
        columns={columns}
        title={title || "Permissions"}
        search={search}
        setSearch={setSearch}
        dateValue={dateValue}
        setDateValue={setDateValue}
      />

      {loading ? (
        <TableLoader colSpan={columns.length + 1} />
      ) : (
        <TableBody
          columns={columns}
          data={data}
          actions={(row) => [
            {
              label: "Remove Permission",
              inline: false,
              onClick: () => {
                if (typeof onRemovePermission === "function")
                  return onRemovePermission(row.code);
              },
            },
          ]}
        />
      )}

      <div>
        <div className="flex items-center justify-end">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </TableShell>
  );
}
