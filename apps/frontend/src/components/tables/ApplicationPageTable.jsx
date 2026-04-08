import { useState, useMemo } from "react";
import { Eye, PenIcon } from "lucide-react";

import { TableShell, TableHead, TableBody, TableLoader } from "./core";

import Pagination from "../common/Pagination";
import DateFilter from "../common/DateFilter";

export default function ApplicationPageTable({
  applications = [],
  tableColumns = [],
  loading = false,
  onViewDetails,
  onEdit,
  headerAction,
  onRefresh,
  refreshing = false,
  filterOptions = [],
  filterValue = "",
  setFilterValue = () => {},
  dateRange = "ALL",
  setDateRange = () => {},
}) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  /* ---------------- Search Filter ---------------- */

  const filteredApplications = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    if (!q) return applications;

    return applications.filter((app) => {
      // Search by loan number
      const loanNumber = (app.loanNumber || app.loan?.loanNumber || "")
        .toString()
        .toLowerCase();
      if (loanNumber.includes(q)) return true;

      // Search by applicant/customer full name
      const firstName = (
        app.customer?.firstName ||
        app.applicant?.firstName ||
        ""
      )
        .toString()
        .toLowerCase();
      const lastName = (app.customer?.lastName || app.applicant?.lastName || "")
        .toString()
        .toLowerCase();
      const fullName = `${firstName} ${lastName}`.trim();
      if (fullName.includes(q)) return true;

      // Fallback: search through configured columns (handles nested objects)
      return tableColumns.some((col) => {
        const value = app[col.accessor];
        if (value && typeof value === "object") {
          return Object.values(value).some((v) =>
            String(v || "")
              .toLowerCase()
              .includes(q),
          );
        }
        return String(value || "")
          .toLowerCase()
          .includes(q);
      });
    });
  }, [applications, search, tableColumns]);

  /* ---------------- Pagination ---------------- */

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  /* ---------------- Columns ---------------- */

  const columns = tableColumns;

  /* ---------------- Render ---------------- */

  return (
    <TableShell>
      <TableHead
        title=""
        columns={columns}
        search={search}
        setSearch={setSearch}
        headerAction={
          <div className="flex items-center gap-2">
            {headerAction}
            <DateFilter value={dateRange} onChange={setDateRange} />
          </div>
        }
        onRefresh={onRefresh}
        refreshing={refreshing}
        filterOptions={filterOptions}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
      />

      {loading ? (
        <TableLoader colSpan={columns.length} />
      ) : (
        <TableBody
          columns={columns}
          data={paginatedApplications}
          actions={[
            {
              label: "View",
              icon: Eye,
              onClick: (row) => onViewDetails?.(row),
            },
            {
              label: "Edit Application",
              icon: PenIcon,
              onClick: (row) => onEdit?.(row),
            },
          ]}
        />
      )}

      {/* Pagination is passed as the third child, outside <table> */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </TableShell>
  );
}
