import { useState } from "react";
import {
  TableShell,
  TableHead,
  TableBody,
  TableLoader,
} from "./core";

export default function LoanAccountTable({
  loans = [],
  loading = false,
  onView,
}) {

  const [search, setSearch] = useState("");
  const [filterValue, setFilterValue] = useState("");

  /* ---------------- Columns ---------------- */

  const columns = [

    {
      header: "Loan Number",
      accessor: "id",
      render: (value) => (
        <span className="text-blue-600 font-medium cursor-pointer whitespace-nowrap">
          {value}
        </span>
      ),
    },

    {
      header: "Customer Name",
      accessor: "customerName",
      render: (value) => (
        <div className="flex items-center gap-2 sm:gap-3 min-w-40">

          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-500 text-white text-[10px] sm:text-xs flex items-center justify-center font-semibold">
            {value
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>

          <span className="font-medium text-slate-700 truncate">
            {value}
          </span>

        </div>
      ),
    },

    {
      header: "Branch",
      accessor: "branch",
      render: (value) => (
        <span className="text-slate-500 text-sm whitespace-nowrap">
          {value}
        </span>
      ),
    },

    {
      header: "Loan Amount",
      accessor: "loanAmount",
      render: (value) => (
        <span className="font-medium text-slate-700 whitespace-nowrap">
          ₹{value.toLocaleString()}
        </span>
      ),
    },

    {
      header: "Outstanding Balance",
      accessor: "outstandingBalance",
      render: (value) => (
        <span className="font-medium text-slate-700 whitespace-nowrap">
          ₹{value.toLocaleString()}
        </span>
      ),
    },

    {
      header: "Status",
      accessor: "status",
      render: (value) => (
        <span
          className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium border whitespace-nowrap
          ${
            value === "Active" &&
            "bg-green-50 text-green-700 border-green-200"
          }
          ${
            value === "Delinquent" &&
            "bg-red-50 text-red-600 border-red-200"
          }
          ${
            value === "Closed" &&
            "bg-gray-100 text-gray-600 border-gray-200"
          }
          ${
            value === "Written Off" &&
            "bg-yellow-100 text-yellow-600 border-yellow-200"
          }
          ${
            value === "Defaulted" &&
            "bg-red-100 text-red-600 border-red-200"
          }`}
        >
          {value}
        </span>
      ),
    },

  ];

  /* ---------------- Actions ---------------- */

  const actions = [
    {
      label: "View",
      onClick: (row) => onView && onView(row),
    },
  ];

  /* ---------------- Filter Logic ---------------- */

  const filteredLoans = loans
    .filter((loan) =>
      loan.customerName
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter((loan) =>
      filterValue ? loan.status === filterValue : true
    );

  /* ---------------- Render ---------------- */

  return (

    <div className="w-full overflow-x-auto">

      <TableShell>

        <TableHead
          title="Loan Accounts"
          columns={columns}
          search={search}
          setSearch={setSearch}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          filterOptions={[
            { label: "All Status", value: "" },
            { label: "Active", value: "Active" },
            { label: "Delinquent", value: "Delinquent" },
            { label: "Closed", value: "Closed" },
            { label: "Written Off", value: "Written Off" },
            { label: "Defaulted", value: "Defaulted" },
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

    </div>

  );
}