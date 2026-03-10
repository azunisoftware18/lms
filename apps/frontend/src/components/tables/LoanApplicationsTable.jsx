import { useState } from "react";
import {
  TableShell,
  TableHead,
  TableBody,
  TableLoader,
} from "./core";

export default function LoanApplicationsTable({
  loans = [],
  loading = false,
}) {
  const [search, setSearch] = useState("");

  const columns = [
    {
      header: "Customer",
      accessor: "customer",
      render: (value, row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800 text-sm">
            {value}
          </span>
          <span className="text-xs text-slate-400">
            {row.email}
          </span>
        </div>
      ),
    },
    {
      header: "Type",
      accessor: "type",
    },
    {
      header: "Amount",
      accessor: "amount",
      render: (value) => (
        <span className="font-medium text-slate-700">
          ₹{value.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Date",
      accessor: "date",
    },
    {
      header: "Loan No",
      accessor: "loanNo",
    },
  ];

  const actions = [
    {
      label: "View",
      onClick: (row) => console.log("View", row),
    },
    {
      label: "Edit",
      onClick: (row) => console.log("Edit", row),
    },
  ];

  /* ---------- Search Filter ---------- */

  const filteredLoans = loans.filter((loan) =>
    loan.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <TableShell>
      <TableHead
        title="Loan Applications"
        columns={columns}
        search={search}
        setSearch={setSearch}
        filterOptions={[]}
      />

      {loading ? (
        <TableLoader colSpan={columns.length + 1} />
      ) : (
        <TableBody
          columns={columns}
          data={filteredLoans}
          actions={actions}
        />
      )}
    </TableShell>
  );
}