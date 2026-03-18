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
    let result = [];

    list.forEach((branch) => {
      result.push({ ...branch, level });

      if (branch.subBranches?.length && expandedBranches[branch.id]) {
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

  const totalPages = Math.ceil(filteredBranches.length / itemsPerPage);
  const paginatedBranches = filteredBranches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const columns = [
    {
      header: "Branch Name",
      accessor: "name",
      render: (value, row) => {
        const hasChildren = row.subBranches?.length > 0;
        const isExpanded = expandedBranches[row.id];

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

            <span className="font-semibold text-slate-700 truncate">
              {value}
            </span>
          </div>
        );
      },
    },

    {
      header: "Code",
      accessor: "code",
      render: (value) => (
        <span className="font-mono text-xs text-blue-600">{value}</span>
      ),
    },
    {
      header: "Type",
      accessor: "type",
      render: (value) => (
        <span
          className={`inline-flex items-center whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-semibold border
          ${
            value === "MAIN"
              ? "bg-purple-50 text-purple-700 border-purple-200"
              : "bg-blue-50 text-blue-700 border-blue-200"
          }`}
        >
          {value === "MAIN" ? "Main Branch" : "Subsidiary"}
        </span>
      ),
    },

    {
      header: "Parent",
      accessor: "parentBranch",
      render: (value) => value?.name || "—",
    },

    {
      header: "Manager",
      accessor: "head",
      render: (value) => value || "—",
    },

    {
      header: "Sub",
      accessor: "_count",
      render: (value) => (
        <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold">
          {value?.subBranches || 0}
        </span>
      ),
    },

    {
      header: "Status",
      accessor: "isActive",
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
        setSearch={setSearch}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        wrapHeaders={true}
        onRefresh={onRefresh}
        refreshing={loading}
        filterOptions={[
          { label: "All Types", value: "" },
          { label: "Main Branch", value: "MAIN" },
          { label: "Subsidiary", value: "SUB" },
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
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </TableShell>
  );
}
