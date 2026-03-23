import { useState, useMemo } from "react";
import { Eye } from "lucide-react";

import { TableShell, TableHead, TableBody, TableLoader } from "./core";

import Pagination from "../common/Pagination";

export default function ApplicationPageTable({
  applications = [],
  tableColumns = [],
  loading = false,
  onViewDetails,
  headerAction,
  onRefresh,
  refreshing = false,
}) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  /* ---------------- Search Filter ---------------- */

  const filteredApplications = useMemo(() => {
    return applications.filter((app) =>
      tableColumns.some((col) =>
        String(app[col.accessor] || "")
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    );
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
        title="Loan Applications"
        columns={columns}
        search={search}
        setSearch={setSearch}
        headerAction={headerAction}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />

      {loading ? (
        <TableLoader colSpan={columns.length} />
      ) : (
        <>
          <TableBody
            columns={columns}
            data={paginatedApplications}
            actions={[
              {
                label: "View",
                icon: Eye,
                onClick: (row) => onViewDetails?.(row),
              },
            ]}
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
