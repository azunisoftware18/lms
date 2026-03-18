import { useState, useMemo } from "react";
import { TableShell, TableHead, TableBody, TableLoader } from "../tables/core";

import Pagination from "../common/Pagination";

import {
  User,
  Mail,
  Phone,
  Building2,
  Edit,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function BranchAdminTable({
  admins = [],
  loading = false,
  onEdit,
  onRefresh,
}) {
  const [search, setSearch] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  /* ---------------- Search ---------------- */

  const filteredAdmins = useMemo(() => {
    const s = search.toLowerCase();

    return admins.filter((a) => {
      const matchFilter =
        !filterValue ||
        (filterValue === "active" && a.isActive) ||
        (filterValue === "inactive" && !a.isActive);

      return (
        matchFilter &&
        (a.fullName?.toLowerCase().includes(s) ||
          a.email?.toLowerCase().includes(s) ||
          a.userName?.toLowerCase().includes(s) ||
          a.branch?.name?.toLowerCase().includes(s))
      );
    });
  }, [admins, search, filterValue]);

  /* ---------------- Pagination ---------------- */

  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);

  const paginatedAdmins = filteredAdmins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  /* ---------------- Columns ---------------- */

  const columns = [
    {
      header: "Full Name",
      accessor: "fullName",
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <User size={14} className="text-blue-600" />
          </div>
          <span className="font-medium text-slate-800">{value || "N/A"}</span>
        </div>
      ),
    },

    {
      header: "Email",
      accessor: "email",
      render: (value) => (
        <div className="flex items-center gap-1 text-slate-600">
          <Mail size={14} />
          {value || "N/A"}
        </div>
      ),
    },

    {
      header: "Username / Contact",
      accessor: "userName",
      render: (_, row) => (
        <div className="space-y-1">
          <div className="font-mono text-xs text-slate-600">
            {row.userName || "N/A"}
          </div>
          <div className="flex items-center gap-1 text-slate-600 text-xs">
            <Phone size={12} />
            {row.contactNumber || "N/A"}
          </div>
        </div>
      ),
    },

    {
      header: "Branch",
      accessor: "branch",
      render: (value) => (
        <div className="flex items-center gap-1">
          <Building2 size={14} className="text-slate-400" />
          {value?.name || "N/A"}
        </div>
      ),
    },

    {
      header: "Status",
      accessor: "isActive",
      render: (value) =>
        value ? (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-green-50 text-green-700 border border-green-200">
            <CheckCircle size={12} />
            Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-red-50 text-red-700 border border-red-200">
            <AlertCircle size={12} />
            Inactive
          </span>
        ),
    },
  ];

  /* ---------------- Actions ---------------- */

  const actions = [
    {
      label: "Edit",
      icon: <Edit size={14} />,
      onClick: (row) => onEdit?.(row),
    },
  ];

  /* ---------------- Render ---------------- */

  return (
    <TableShell>
      <TableHead
        title="Branch Admins"
        columns={columns}
        search={search}
        setSearch={setSearch}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        wrapHeaders={true}
        onRefresh={onRefresh}
        refreshing={loading}
        filterOptions={[
          { label: "All Status", value: "" },
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" },
        ]}
      />

      {loading ? (
        <TableLoader colSpan={columns.length + 1} />
      ) : (
        <>
          <TableBody
            columns={columns}
            data={paginatedAdmins}
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
