import React, { useMemo, useState } from "react";
import TableShell from "./core/TableShell";
import TableHead from "./core/TableHead";
import TableBody from "./core/TableBody";

export default function ForeClosureTable({ data = [] }) {
  const [search, setSearch] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const columns = useMemo(
    () => [
      { accessor: "loanNumber", header: "Loan Number" },
      { accessor: "customerName", header: "Customer Name" },
      {
        accessor: "transactionType",
        header: "Transaction Type",
        render: (val) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              val === "Prepayment"
                ? "bg-blue-100 text-blue-700"
                : "bg-purple-100 text-purple-700"
            }`}
          >
            {val}
          </span>
        ),
      },
      {
        accessor: "amountPaid",
        header: "Amount Paid",
        render: (val) => `₹${val}`,
      },
      {
        accessor: "status",
        header: "Status",
        render: (val) => (
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            {val}
          </span>
        ),
      },
      { accessor: "date", header: "Date" },
    ],
    [],
  );

  // filter & search
  const filterOptions = [
    { label: "All", value: "" },
    { label: "Prepayment", value: "Prepayment" },
    { label: "Foreclosure", value: "Foreclosure" },
  ];

  const filtered = useMemo(() => {
    const term = (search || "").toString().toLowerCase();
    return data
      .filter((r) => {
        if (filterValue) {
          if ((r.transactionType || "").toString() !== filterValue)
            return false;
        }
        if (!term) return true;
        return (
          (r.loanNumber || "").toString().toLowerCase().includes(term) ||
          (r.customerName || "").toString().toLowerCase().includes(term)
        );
      })
      .map((r) => ({
        loanNumber: r.loanNumber,
        customerName: r.customerName,
        transactionType: r.transactionType,
        amountPaid: r.amountPaid,
        status: r.status,
        date: r.date,
        id: r.loanNumber + "-" + r.date,
      }));
  }, [data, search, filterValue]);

  return (
    <div className="mt-8">
      <TableShell>
        <TableHead
          columns={columns}
          title="Transaction History"
          search={search}
          setSearch={setSearch}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          filterOptions={filterOptions}
        />
        <TableBody columns={columns} data={filtered} />
      </TableShell>
    </div>
  );
}
