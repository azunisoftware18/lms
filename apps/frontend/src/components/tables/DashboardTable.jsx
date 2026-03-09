import { useState } from "react";
import {
  TableHead,
  TableBody,
  TableLoader,
  TableShell,
} from "./core";

export default function DashboardTable({ loans = [], loading = false }) {

  const [search, setSearch] = useState("");
  const [filterValue, setFilterValue] = useState("");

  /* ------------ Columns ------------ */

  const columns = [
    {
      header: "Borrower",
      accessor: "name",
      render: (value, row) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-800 text-sm">
            {value}
          </span>
          <span className="text-xs text-slate-400">
            {row.id}
          </span>
        </div>
      ),
    },
    {
      header: "Amount",
      accessor: "amount",
    },
    {
      header: "Type",
      accessor: "type",
    },
    {
      header: "Status",
      accessor: "status",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border
          ${value === "Approved" && "bg-green-50 text-green-700 border-green-100"}
          ${value === "Pending" && "bg-orange-50 text-orange-700 border-orange-100"}
          ${value === "Rejected" && "bg-red-50 text-red-700 border-red-100"}
        `}
        >
          {value}
        </span>
      ),
    },
  ];

  /* ------------ Actions ------------ */

  const actions = [
    {
      label: "View",
      onClick: (row) => console.log("View Loan", row),
    },
    {
      label: "Approve",
      onClick: (row) => console.log("Approve Loan", row),
    },
    {
      label: "Reject",
      onClick: (row) => console.log("Reject Loan", row),
    },
  ];

  /* ------------ Filter Logic ------------ */

  const filteredLoans = loans
    .filter((loan) =>
      loan.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((loan) =>
      filterValue ? loan.status === filterValue : true
    );

  return (
    <TableShell>

      <TableHead
        title="Recent Loan Requests"
        columns={columns}
        search={search}
        setSearch={setSearch}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        filterOptions={[
          { label: "All", value: "" },
          { label: "Approved", value: "Approved" },
          { label: "Pending", value: "Pending" },
          { label: "Rejected", value: "Rejected" },
        ]}
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