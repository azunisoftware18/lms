import Pagination from "../common/Pagination";
import {
  TableShell,
  TableHead,
  TableBody,
  TableLoader
} from "../tables/core";

export default function LeadsTable({
  items = [],
  loading = false,
  getActions,
  currentPage,
  totalPages,
  onPageChange
}) {

  const columns = [
    { header: "Customer", accessor: "fullName" },
    { header: "Contact", accessor: "contactNumber" },
    { header: "City", accessor: "city" },
    { header: "Loan Type", accessor: "loanType" },
    { header: "Loan Amount", accessor: "loanAmount" }
  ];

  return (
    <TableShell>

      {/* HEAD */}
      <TableHead
        title="Leads"
        columns={columns}
      />

      {/* BODY */}
      {loading ? (
        <TableLoader colSpan={columns.length + 1} />
      ) : (
        <TableBody
          columns={columns}
          data={items}
          actions={(row) => getActions(row)}
        />
      )}

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />

    </TableShell>
  );
}