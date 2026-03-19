import { useState, useMemo } from "react";
import { TableShell, TableHead, TableBody, TableLoader } from "../tables/core";

import { Building2, ChevronRight, ChevronDown } from "lucide-react";
import Pagination from "../common/Pagination";

export default function BranchManagementTable({
  branches = [],
  loading = false,
  onEdit,
  onDelete,
  onRefresh,
}) {
  const [expandedBranches, setExpandedBranches] = useState({});
  const [search, setSearch] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const toggleBranch = (id) => {
    setExpandedBranches((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const flattenBranches = (list, level = 0) => {
    const safeList = Array.isArray(list) ? list : [];
    let result = [];

    safeList.forEach((branch) => {
      result.push({ ...branch, level });

      const isExpanded = expandedBranches[branch.id] ?? true;

      if (branch.subBranches?.length && isExpanded) {
        result = result.concat(flattenBranches(branch.subBranches, level + 1));
      }
    });

    return result;
  };

  const flatBranches = flattenBranches(branches);

  const filteredBranches = useMemo(() => {
    return flatBranches.filter((b) => {
      const matchSearch =
        b.name?.toLowerCase().includes(search.toLowerCase()) ||
        b.code?.toLowerCase().includes(search.toLowerCase());

      const matchFilter = !filterValue || b.type === filterValue;

      return matchSearch && matchFilter;
    });
  }, [flatBranches, search, filterValue]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBranches.length / itemsPerPage),
  );
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedBranches = filteredBranches.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage,
  );

  const handleSearchChange = (valueOrEvent) => {
    const value =
      typeof valueOrEvent === "string"
        ? valueOrEvent
        : valueOrEvent?.target?.value || "";
    setCurrentPage(1);
    setSearch(value);
  };

  const handleFilterChange = (value) => {
    setCurrentPage(1);
    setFilterValue(value);
  };

  const columns = [
    {
      header: "Branch Name",
      accessor: "name",
      render: (value, row) => {
        const hasChildren = row.subBranches?.length > 0;
        const isExpanded = expandedBranches[row.id] ?? true;

        return (
          <div
            className="flex items-center gap-2 min-w-0"
            style={{ paddingLeft: `${Math.min(row.level * 12, 72)}px` }}
          >
            {hasChildren ? (
              <button
                onClick={() => toggleBranch(row.id)}
                className="p-1 hover:bg-slate-100 rounded"
              >
                {isExpanded ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </button>
            ) : (
              <div className="w-4" />
            )}

            <Building2 size={16} className="text-blue-500" />

            <div className="min-w-0">
              <span className="font-semibold text-slate-700 truncate block">
                {value}
              </span>

              <div className="md:hidden mt-1 text-[11px] text-slate-500 space-y-0.5">
                <div>Code: {row.code || "—"}</div>
                <div>
                  Parent:{" "}
                  {row.parentBranch?.name || row.parentBranchName || "—"}
                </div>
                <div>
                  Status: {row.isActive ? "Active" : "Inactive"} • Sub:{" "}
                  {row?._count?.subBranches ?? row?.subBranches?.length ?? 0}
                </div>
              </div>
            </div>
          </div>
        );
      },
    },

    {
      header: "Code",
      accessor: "code",
      headerClassName: "hidden md:table-cell",
      cellClassName: "hidden md:table-cell",
      render: (value) => (
        <span className="font-mono text-xs text-blue-600">{value}</span>
      ),
    },

    {
      header: "Parent",
      accessor: "parentBranch",
      headerClassName: "hidden md:table-cell",
      cellClassName: "hidden md:table-cell",
      render: (value, row) => value?.name || row?.parentBranchName || "—",
    },

    {
      header: "Sub",
      accessor: "_count",
      headerClassName: "hidden md:table-cell",
      cellClassName: "hidden md:table-cell",
      render: (value, row) => (
        <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold">
          {value?.subBranches ?? row?.subBranches?.length ?? 0}
        </span>
      ),
    },

    {
      header: "Status",
      accessor: "isActive",
      headerClassName: "hidden md:table-cell",
      cellClassName: "hidden md:table-cell",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border
          ${
            value
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-600 border-red-200"
          }`}
        >
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: "Edit",
      onClick: (row) => onEdit?.(row),
    },
    {
      label: "Delete",
      onClick: (row) => onDelete?.(row),
    },
  ];

  return (
    <TableShell>
      <TableHead
        title="Branch Management"
        columns={columns}
        search={search}
        setSearch={handleSearchChange}
        filterValue={filterValue}
        setFilterValue={handleFilterChange}
        wrapHeaders={true}
        onRefresh={onRefresh}
        refreshing={loading}
        filterOptions={[
          { label: "All Types", value: "" },
          { label: "Head Office", value: "HEAD_OFFICE" },
          { label: "Zonal", value: "ZONAL" },
          { label: "Regional", value: "REGIONAL" },
          { label: "Branch", value: "BRANCH" },
          { label: "Main Branch (Legacy)", value: "MAIN" },
          { label: "Subsidiary (Legacy)", value: "SUB" },
        ]}
      />

      {loading ? (
        <TableLoader colSpan={columns.length + 1} />
      ) : (
        <TableBody
          columns={columns}
          data={paginatedBranches}
          actions={actions}
          wrapCells={true}
        />
      )}
      <Pagination
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        onPageChange={(page) =>
          setCurrentPage(Math.min(Math.max(1, page), totalPages))
        }
      />
    </TableShell>
  );
}
