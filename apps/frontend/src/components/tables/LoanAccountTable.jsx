import { useState, useMemo } from "react";
import { TableShell, TableHead, TableBody, TableLoader } from "./core";
import Pagination from "../common/Pagination";

export default function LoanAccountTable({
  loans = [],
  loading = false,
  onView,
}) {
  const [search, setSearch] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, _setPageSize] = useState(10);

  /* ---------------- Columns ---------------- */

  const columns = [
    {
      header: "Loan",
      accessor: "loanNumber",
      render: (value, row) => (
        <div className="flex items-center gap-3 min-w-40">
          <div className="text-left">
            <div>
              <a className="text-blue-600 font-medium whitespace-nowrap">
                {row.loanNumber || value}
              </a>
            </div>
            <div className="text-slate-500 text-sm truncate mt-0.5">
              {row.customerName}
            </div>
          </div>
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
          ${value === "Active" && "bg-green-50 text-green-700 border-green-200"}
          ${value === "Delinquent" && "bg-red-50 text-red-600 border-red-200"}
          ${value === "Closed" && "bg-gray-100 text-gray-600 border-gray-200"}
          ${value === "Written Off" && "bg-yellow-100 text-yellow-600 border-yellow-200"}
          ${value === "Defaulted" && "bg-red-100 text-red-600 border-red-200"}`}
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

  const filteredLoans = useMemo(() => {
    let list = loans || [];

    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter((loan) => {
        const name = String(loan.customerName || "");
        const loanNum = String(loan.loanNumber || loan.id || "");
        return (
          name.toLowerCase().includes(q) || loanNum.toLowerCase().includes(q)
        );
      });
    }

    if (filterValue) {
      list = list.filter((loan) => loan.status === filterValue);
    }

    // Date filtering: best-effort if loan has a `createdAt`, `disbursedAt`, or `date` field
    if (dateRange) {
      // Simple mapping for commonly used option values in DateFilter
      const now = new Date();
      let start = null;

      if (dateRange === "TODAY") {
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (dateRange === "WEEK") {
        const day = now.getDay();
        start = new Date(now);
        start.setDate(now.getDate() - day);
      } else if (dateRange === "MONTH") {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
      } else if (dateRange === "LAST_3_MONTHS") {
        start = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      } else if (dateRange === "LAST_6_MONTHS") {
        start = new Date(now.getFullYear(), now.getMonth() - 6, 1);
      } else if (dateRange === "YEAR") {
        start = new Date(now.getFullYear(), 0, 1);
      }

      if (start) {
        const toTimestamp = (d) => new Date(d).getTime();
        list = list.filter((loan) => {
          const dateStr =
            loan.createdAt || loan.disbursedAt || loan.date || loan.created_at;
          if (!dateStr) return false;
          const t = toTimestamp(dateStr);
          return t >= start.getTime();
        });
      }
      // end dateRange
    }

    return list;
  }, [loans, search, filterValue, dateRange]);

  /* ---------------- Pagination & Debug vars ---------------- */

  // const totalItems = filteredLoans.length;
  // const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedLoans = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return filteredLoans.slice(startIdx, startIdx + pageSize);
  }, [filteredLoans, currentPage, pageSize]);

  /* ---------------- Render ---------------- */

  return (
    <TableShell>
      <TableHead
        title="Loan Accounts"
        columns={columns}
        search={search}
        setSearch={setSearch}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        dateValue={dateRange}
        setDateValue={(v) => {
          setDateRange(v);
          setCurrentPage(1);
        }}
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
        <TableBody columns={columns} data={paginatedLoans} actions={actions} />
      )}
    </TableShell>
  );
}
