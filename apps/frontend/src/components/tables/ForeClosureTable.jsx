import React, { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { RotateCw } from "lucide-react";
import TableShell from "./core/TableShell";
import TableHead from "./core/TableHead";
import TableBody from "./core/TableBody";
import DateFilter from "../common/DateFilter";

const parseRecordDate = (value) => {
  if (!value) return null;

  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;

  const direct = new Date(value);
  if (!Number.isNaN(direct.getTime())) return direct;

  if (typeof value === "string") {
    const normalized = value.replace(/-/g, " ").replace(/\s+/g, " ").trim();
    const attempt = new Date(normalized);
    if (!Number.isNaN(attempt.getTime())) return attempt;
  }

  return null;
};

const isWithinDateRange = (date, range) => {
  if (!date || range === "ALL") return true;

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  if (range === "TODAY") {
    return date >= startOfToday;
  }

  if (range === "WEEK") {
    const weekStart = new Date(startOfToday);
    weekStart.setDate(weekStart.getDate() - 6);
    return date >= weekStart;
  }

  if (range === "MONTH") {
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth()
    );
  }

  if (range === "LAST_3_MONTHS") {
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    return date >= threeMonthsAgo;
  }

  if (range === "LAST_6_MONTHS") {
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
    return date >= sixMonthsAgo;
  }

  if (range === "YEAR") {
    return date.getFullYear() === now.getFullYear();
  }

  return true;
};

export default function ForeClosureTable({ data = [] }) {
  const [search, setSearch] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [dateFilter, setDateFilter] = useState("ALL");

  const columns = useMemo(
    () => [
      {
        accessor: "loanNumber",
        header: "Loan Number",
        render: (val, row) => (
          <div className="min-w-0">
            <div className="font-medium text-slate-800 truncate">{val}</div>
            <div className="text-xs text-slate-500 truncate">
              {row.customerName}
            </div>
          </div>
        ),
      },
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
        render: (val) => {
          const amount = Number(val);
          return `₹${Number.isFinite(amount) ? amount.toLocaleString("en-IN") : (val ?? "0")}`;
        },
      },
      {
        accessor: "status",
        header: "Status",
        render: (val) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              ["completed", "success", "paid", "closed"].includes(
                (val || "").toString().toLowerCase(),
              )
                ? "bg-green-100 text-green-700"
                : ["pending", "processing"].includes(
                      (val || "").toString().toLowerCase(),
                    )
                  ? "bg-yellow-100 text-yellow-700"
                  : ["failed", "rejected"].includes(
                        (val || "").toString().toLowerCase(),
                      )
                    ? "bg-red-100 text-red-700"
                    : "bg-slate-100 text-slate-700"
            }`}
          >
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
    { label: "Settlement", value: "Settlement" },
  ];

  const filtered = useMemo(() => {
    const term = (search || "").toString().toLowerCase();

    return data
      ?.filter((r) => {
        if (filterValue) {
          if ((r.transactionType || "").toString() !== filterValue)
            return false;
        }

        const recordDate = parseRecordDate(r.date);
        if (!isWithinDateRange(recordDate, dateFilter)) return false;

        if (!term) return true;

        return (
          (r.loanNumber || "").toString().toLowerCase().includes(term) ||
          (r.customerName || "").toString().toLowerCase().includes(term) ||
          (r.status || "").toString().toLowerCase().includes(term)
        );
      })
      .sort((a, b) => {
        const aDate = parseRecordDate(a.date);
        const bDate = parseRecordDate(b.date);
        return (bDate?.getTime() || 0) - (aDate?.getTime() || 0);
      })
      .map((r) => ({
        loanNumber: r.loanNumber,
        customerName: r.customerName,
        transactionType: r.transactionType,
        amountPaid: r.amountPaid,
        status: r.status,
        date: parseRecordDate(r.date)
          ? parseRecordDate(r.date).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : r.date,
        id: r.loanNumber + "-" + r.date,
      }));
  }, [data, search, filterValue, dateFilter]);

  const countLabel = `${filtered.length} record${filtered.length === 1 ? "" : "s"}`;

  const handleDownloadStatement = (row) => {
    const apiBase =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
    const url = `${apiBase}/foreclose/loans/${encodeURIComponent(row.loanNumber)}/foreclosure-statement`;

    fetch(url, {
      credentials: "include",
      headers: { Accept: "application/pdf" },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = `${(row.loanNumber || "statement").toString().replace(/\s+/g, "_")}_foreclosure_statement.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(blobUrl);
      })
      .catch((err) => {
        console.error("Failed to download PDF", err);
      });
  };

  return (
    <div className="mt-8">
      <div className="mb-3 px-1">
        <p className="text-xs text-slate-500">{countLabel}</p>
      </div>
      <TableShell>
        <TableHead
          columns={columns}
          title="Transaction History"
          search={search}
          setSearch={setSearch}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          filterOptions={filterOptions}
          headerAction={
            <div className="flex items-center gap-2">
              <DateFilter
                value={dateFilter}
                onChange={setDateFilter}
                className="w-44"
              />
              <button
                onClick={() => {
                  setSearch("");
                  setFilterValue("");
                  setDateFilter("ALL");
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          }
        />
        <TableBody
          columns={columns}
          data={filtered}
          actions={(row) => [
            {
              label: "Download Statement",
              icon: <Download className="w-4 h-4" />,
              onClick: () => handleDownloadStatement(row),
            },
          ]}
        />
      </TableShell>
    </div>
  );
}
