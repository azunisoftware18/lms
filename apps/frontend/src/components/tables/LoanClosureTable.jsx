import React, { useMemo, useState } from "react";
import { RotateCw, RefreshCw, Download } from "lucide-react";
import TableShell from "./core/TableShell";
import TableHead from "./core/TableHead";
import TableBody from "./core/TableBody";
import DateFilter from "../common/DateFilter";

export default function LoanClosureTable({ data = [] }) {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("ALL");

  const columns = useMemo(
    () => [
      {
        accessor: "accountNumber",
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
        accessor: "loanAmount",
        header: "Loan Amount",
        render: (val) => `₹${val}`,
      },
      {
        accessor: "status",
        header: "Status",
        render: (val) => (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            {val}
          </span>
        ),
      },
      { accessor: "closureDate", header: "Closure Date" },
    ],
    [],
  );

  const filtered = useMemo(() => {
    const term = (search || "").toString().toLowerCase();
    return (data || [])
      .filter((r) => {
        if (dateFilter && dateFilter !== "ALL") {
          // simple check: if closureDate is in same day/month/year
          const d = new Date(r.closureDate || r.date || 0);
          const now = new Date();
          if (dateFilter === "TODAY") {
            const s = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
            );
            if (d < s) return false;
          }
        }

        if (!term) return true;
        return (
          (r.accountNumber || "").toString().toLowerCase().includes(term) ||
          (r.customerName || "").toString().toLowerCase().includes(term) ||
          (r.status || "").toString().toLowerCase().includes(term)
        );
      })
      .map((r) => ({
        accountNumber: r.accountNumber || r.loanNumber || r.id,
        customerName: r.customerName || r.customer?.name || "-",
        loanAmount: r.loanAmount || r.finalPayable || r.loanAmountPaid || "0",
        status: r.status || "-",
        closureDate: r.closureDate || r.date || "-",
        id: r.id || r.accountNumber || `${r.accountNumber}-${r.closureDate}`,
      }));
  }, [data, search, dateFilter]);

  const countLabel = `${filtered.length} record${filtered.length === 1 ? "" : "s"}`;

  const downloadNOC = async (row) => {
    try {
      const loanNum = encodeURIComponent(row.accountNumber);
      const API_BASE =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
      const resp = await fetch(`${API_BASE}/loan-close/loans/${loanNum}/noc`, {
        credentials: "include",
      });
      if (!resp.ok) throw new Error("Failed to download NOC");
      const blob = await resp.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `NOC_${row.accountNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Unable to download NOC. Please try again.");
    }
  };

  return (
    <div className="mt-8">
      <div className="mb-3 px-1 flex items-center justify-between">
        <p className="text-xs text-slate-500">{countLabel}</p>
      </div>
      <TableShell>
        <TableHead
          columns={columns}
          title="Closed Loans"
          search={search}
          setSearch={setSearch}
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
              label: "Download NOC",
              icon: <Download className="w-3.5 h-3.5" />,
              onClick: () => downloadNOC(row),
            },
          ]}
        />
      </TableShell>
    </div>
  );
}
