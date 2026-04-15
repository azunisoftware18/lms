import { useState, useMemo } from "react";
import { TableHead, TableBody, TableLoader, TableShell } from "./core";

import Pagination from "../common/Pagination";

import { Shield, Edit2, Trash2 } from "lucide-react";

export default function RoleManagementTable({
  roles = [],
  loading = false,
  onEdit,
  onDelete,
}) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  /* ---------------- Filter ---------------- */

  const filteredRoles = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return roles;
    return roles.filter((role) => {
      const title = (role.roleTitle || role.roleName || role.name || "")
        .toString()
        .toLowerCase();
      const desc = (role.description || "").toString().toLowerCase();
      const email = (role.email || role.loginEmail || "")
        .toString()
        .toLowerCase();
      return title.includes(q) || desc.includes(q) || email.includes(q);
    });
  }, [roles, search]);

  /* ---------------- Pagination ---------------- */

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);

  const paginatedRoles = filteredRoles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const isRoleActive = (row) => {
    const rawStatus =
      row.isActive ??
      row.active ??
      row.is_active ??
      row.status ??
      row.roleStatus ??
      row.state;

    if (typeof rawStatus === "boolean") return rawStatus;
    if (typeof rawStatus === "number") return rawStatus === 1;

    if (typeof rawStatus === "string") {
      const normalized = rawStatus.trim().toLowerCase();
      return ["active", "true", "1", "enabled", "yes"].includes(
        normalized,
      );
    }

    return false;
  };

  /* ---------------- Columns ---------------- */

  const columns = [
    {
      header: "Role Title / Role",
      accessor: "roleTitle",
      render: (_value, row) => {
        const title = row.roleTitle || row.name || "-";
        const roleName = row.roleName || "-";
        const colorClass = (row.color || "bg-gray-100 text-gray-700").split(
          " ",
        )[0];
        return (
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${colorClass}`}>
              <Shield size={16} />
            </div>

            <div>
              <p className="font-semibold text-slate-800">{title}</p>
              <p className="text-xs text-slate-500">{roleName}</p>
            </div>
          </div>
        );
      },
    },

    {
      header: "Status",
      accessor: "isActive",
      render: (_value, row) => {
        const isActive = isRoleActive(row);
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
              isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        );
      },
    },

    {
      header: "Date",
      accessor: "createdAt",
      render: (_value, row) => {
        const rawDate =
          row.createdAt || row.createdDate || row.date || row.updatedAt || null;
        if (!rawDate) return <span>-</span>;

        const date = new Date(rawDate);
        if (Number.isNaN(date.getTime())) return <span>-</span>;

        return (
          <span className="text-sm text-slate-700">
            {date.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        );
      },
    },
  ];

  /* ---------------- Actions ---------------- */

  const actions = [
    {
      label: "Edit",
      icon: Edit2,
      onClick: (row) => onEdit?.(row),
    },

    {
      label: "Delete",
      icon: Trash2,
      onClick: (row) => onDelete?.(row),
    },
  ];

  /* ---------------- Render ---------------- */

  return (
    <TableShell>
      <TableHead
        title="Admin Roles"
        columns={columns}
        search={search}
        setSearch={setSearch}
      />

      {loading ? (
        <TableLoader colSpan={columns.length + 1} />
      ) : (
        <>
          <TableBody
            columns={columns}
            data={paginatedRoles}
            actions={actions}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </TableShell>
  );
}
