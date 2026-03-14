import { useState, useMemo } from "react";
import {
  TableHead,
  TableBody,
  TableLoader,
  TableShell,
} from "./core";

import Pagination from "../common/Pagination";

import {
  Shield,
  Mail,
  Users,
  User,
  Edit2,
  Trash2
} from "lucide-react";

export default function RoleManagementTable({
  roles = [],
  loading = false,
  onEdit,
  onDelete,
  onLogin,
  getModuleName
}) {

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  /* ---------------- Filter ---------------- */

  const filteredRoles = useMemo(() => {
    return roles.filter((role) =>
      role.name.toLowerCase().includes(search.toLowerCase()) ||
      role.description.toLowerCase().includes(search.toLowerCase()) ||
      role.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [roles, search]);

  /* ---------------- Pagination ---------------- */

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);

  const paginatedRoles = filteredRoles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* ---------------- Columns ---------------- */

  const columns = [

    {
      header: "Role",
      accessor: "name",
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${row.color.split(" ")[0]}`}>
            <Shield size={16} />
          </div>

          <div>
            <p className="font-semibold text-slate-800">{value}</p>
            <p className="text-xs text-slate-500">{row.description}</p>
          </div>
        </div>
      )
    },

    {
      header: "Login",
      accessor: "email",
      render: (value, row) => (
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1 text-sm">
            <Mail size={14} /> {value}
          </span>

          <button
            onClick={() => onLogin?.(row)}
            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
          >
            <User size={12} />
            View Login
          </button>
        </div>
      )
    },

    {
      header: "Permissions",
      accessor: "permissions",
      render: (value) => (
        <div className="flex flex-wrap gap-1 max-w-55">
          {value.slice(0,3).map((p) => (
            <span
              key={p}
              className="px-2 py-1 text-xs rounded bg-blue-50 text-blue-700"
            >
              {getModuleName?.(p)}
            </span>
          ))}

          {value.length > 3 && (
            <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-600">
              +{value.length - 3}
            </span>
          )}
        </div>
      )
    },

    {
      header: "Users",
      accessor: "userCount",
      render: (value) => (
        <div className="flex items-center gap-1">
          <Users size={14} />
          <span className="font-semibold">{value}</span>
        </div>
      )
    }

  ];

  /* ---------------- Actions ---------------- */

  const actions = [

    {
      label: "Login",
      icon: User,
      onClick: (row) => onLogin?.(row)
    },

    {
      label: "Edit",
      icon: Edit2,
      onClick: (row) => onEdit?.(row)
    },

    {
      label: "Delete",
      icon: Trash2,
      onClick: (row) => onDelete?.(row)
    }

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