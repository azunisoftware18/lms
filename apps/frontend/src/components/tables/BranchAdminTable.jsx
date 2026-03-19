import { useState } from "react";
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
  search: controlledSearch,
  setSearch: controlledSetSearch,
  filterValue: controlledFilterValue,
  setFilterValue: controlledSetFilterValue,
  currentPage: controlledCurrentPage,
  onPageChange,
  totalPages = 1,
}) {
  const [localSearch, setLocalSearch] = useState("");
  const [localFilterValue, setLocalFilterValue] = useState("");
  const [localCurrentPage, setLocalCurrentPage] = useState(1);

  const search =
    typeof controlledSearch === "string" ? controlledSearch : localSearch;
  const filterValue =
    typeof controlledFilterValue === "string"
      ? controlledFilterValue
      : localFilterValue;
  const currentPage =
    typeof controlledCurrentPage === "number"
      ? controlledCurrentPage
      : localCurrentPage;

  const setSearch = controlledSetSearch || setLocalSearch;
  const setFilterValue = controlledSetFilterValue || setLocalFilterValue;
  const setCurrentPage = onPageChange || setLocalCurrentPage;

  const columns = [
    {
      header: "Full Name",
      accessor: "fullName",
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
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
          <div className="flex items-center gap-1 text-xs text-slate-600">
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
          <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2 py-1 text-xs text-green-700">
            <CheckCircle size={12} />
            Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700">
            <AlertCircle size={12} />
            Inactive
          </span>
        ),
    },
  ];

  const actions = [
    {
      label: "Edit",
      icon: Edit,
      onClick: (row) => onEdit?.(row),
    },
  ];

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
          <TableBody columns={columns} data={admins} actions={actions} />

          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, totalPages)}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </TableShell>
  );
}
