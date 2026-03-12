
import { useState } from "react";
import {
  CheckCircle, PauseCircle, XCircle, AlertCircle,
} from "lucide-react";
import TableHead   from "./core/TableHead";
import TableBody   from "./core/TableBody";
import TableLoader from "./core/TableLoader";
import TableShell from "./core/TableShell";
import { mockMandates, mockDebits } from "../../lib/dumyData";

const fmt = (n) => "₹" + n.toLocaleString("en-IN");

/** Colored pill badge for mandate / debit status */
const StatusPill = ({ status }) => {
  const pill = {
    Active:    "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    Suspended: "bg-amber-50   text-amber-700   ring-1 ring-amber-200",
    Cancelled: "bg-red-50     text-red-700     ring-1 ring-red-200",
    Success:   "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    Failed:    "bg-red-50     text-red-700     ring-1 ring-red-200",
  };
  const dot = {
    Active:    "bg-emerald-500",
    Suspended: "bg-amber-500",
    Cancelled: "bg-red-500",
    Success:   "bg-emerald-500",
    Failed:    "bg-red-500",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${pill[status] ?? ""}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot[status] ?? "bg-slate-400"}`} />
      {status}
    </span>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// MANDATE MANAGEMENT TABLE
// ══════════════════════════════════════════════════════════════════════════════
export function MandateManagementTable({ 
  mandates: initialMandates = mockMandates,
  onStatusChange,
  showActions = true 
}) {
  const [mandates, setMandates] = useState(initialMandates);
  const [search, setSearch]     = useState("");
  const [statusF, setStatusF]   = useState("");
  const [loading, setLoading]   = useState(false);

  const updateStatus = (id, newStatus) => {
    const updated = mandates.map((m) => (m.id === id ? { ...m, status: newStatus } : m));
    setMandates(updated);
    if (onStatusChange) onStatusChange(id, newStatus, updated);
  };

  const counts = {
    active:    mandates.filter((m) => m.status === "Active").length,
    suspended: mandates.filter((m) => m.status === "Suspended").length,
    cancelled: mandates.filter((m) => m.status === "Cancelled").length,
  };

  const filterOptions = [
    { value: "",          label: "All Status",  count: mandates.length    },
    { value: "Active",    label: "Active",       count: counts.active     },
    { value: "Suspended", label: "Suspended",    count: counts.suspended  },
    { value: "Cancelled", label: "Cancelled",    count: counts.cancelled  },
  ];

  const columns = [
    {
      header: "Mandate ID",
      accessor: "id",
      render: (v) => (
        <span className="font-mono text-xs font-bold text-blue-600 whitespace-nowrap">{v}</span>
      ),
    },
    {
      header: "Customer Name",
      accessor: "customer",
      render: (v) => <span className="font-semibold text-slate-700 whitespace-nowrap">{v}</span>,
    },
    {
      header: "Bank Name",
      accessor: "bank",
      render: (v) => <span className="text-slate-600 whitespace-nowrap">{v}</span>,
    },
    {
      header: "Account No.",
      accessor: "account",
      render: (v) => <span className="font-mono text-slate-600">{v}</span>,
    },
    {
      header: "Debit Limit",
      accessor: "limit",
      render: (v) => <span className="font-semibold text-slate-700 whitespace-nowrap">{fmt(v)}</span>,
    },
    {
      header: "Status",
      accessor: "status",
      render: (v) => <StatusPill status={v} />,
    },
  ];

  const actions = showActions ? [
    {
      label: "Activate",
      icon: CheckCircle,
      show: (row) => row.status !== "Active",
      onClick: (row) => updateStatus(row.id, "Active"),
    },
    {
      label: "Suspend",
      icon: PauseCircle,
      show: (row) => row.status === "Active",
      onClick: (row) => updateStatus(row.id, "Suspended"),
    },
    {
      label: "Cancel",
      icon: XCircle,
      show: (row) => row.status !== "Cancelled",
      onClick: (row) => updateStatus(row.id, "Cancelled"),
    },
  ] : [];

  const filtered = mandates.filter((m) => {
    const q      = search.toLowerCase();
    const matchQ = m.id.toLowerCase().includes(q) || m.customer.toLowerCase().includes(q);
    const matchS = !statusF || m.status === statusF;
    return matchQ && matchS;
  });

  return (
    <TableShell>
      <TableHead
        title="All Mandates"
        columns={columns}
        search={search}
        setSearch={setSearch}
        filterValue={statusF}
        setFilterValue={setStatusF}
        filterOptions={filterOptions}
      />

      {loading
        ? <TableLoader colSpan={columns.length + 1} />
        : <TableBody columns={columns} data={filtered} actions={actions} />
      }

      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">
          Showing{" "}
          <span className="text-slate-600 font-semibold">{filtered.length}</span>
          {" "}of{" "}
          <span className="text-slate-600 font-semibold">{mandates.length}</span>
          {" "}mandates
        </span>
        <button className="w-7 h-7 rounded-lg text-xs font-bold bg-blue-600 text-white">
          1
        </button>
      </div>
    </TableShell>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// DEBIT HISTORY TABLE
// ══════════════════════════════════════════════════════════════════════════════
export function DebitHistoryTable({ 
  debits: initialDebits = mockDebits,
  onExport 
}) {
  const [search, setSearch]   = useState("");
  const [statusF, setStatusF] = useState("");
  const [dateF,   setDateF]   = useState("");
  const [loading, setLoading] = useState(false);

  const filterOptions = [
    { value: "",        label: "All Status" },
    { value: "Success", label: "Success"    },
    { value: "Failed",  label: "Failed"     },
  ];

  const columns = [
    {
      header: "Transaction Date",
      accessor: "date",
      render: (v) => (
        <span className="text-xs font-medium text-slate-600 whitespace-nowrap">{v}</span>
      ),
    },
    {
      header: "Loan Account",
      accessor: "loan",
      render: (v) => (
        <span className="font-mono text-xs font-bold text-blue-600 whitespace-nowrap">{v}</span>
      ),
    },
    {
      header: "Customer Name",
      accessor: "customer",
      render: (v) => (
        <span className="font-semibold text-slate-700 whitespace-nowrap">{v}</span>
      ),
    },
    {
      header: "Debit Amount",
      accessor: "amount",
      render: (v) => (
        <span className="font-bold text-slate-800 whitespace-nowrap">{fmt(v)}</span>
      ),
    },
    {
      header: "Bank Ref No.",
      accessor: "ref",
      render: (v) => (
        <span className="font-mono text-xs text-slate-500 whitespace-nowrap">{v}</span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (v) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ring-1 whitespace-nowrap
            ${v === "Success"
              ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
              : "bg-red-50 text-red-700 ring-red-200"
            }`}
        >
          {v === "Success"
            ? <CheckCircle size={11} />
            : <AlertCircle size={11} />
          }
          {v}
        </span>
      ),
    },
    {
      header: "Failure Reason",
      accessor: "reason",
      render: (v) =>
        v === "—" ? (
          <span className="text-slate-300 select-none">—</span>
        ) : (
          <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-lg whitespace-nowrap">
            {v}
          </span>
        ),
    },
  ];

  const filtered = initialDebits.filter((d) => {
    const q      = search.toLowerCase();
    const matchQ = d.loan.toLowerCase().includes(q) || d.customer.toLowerCase().includes(q);
    const matchS = !statusF || d.status === statusF;
    const matchD = !dateF   || d.date.includes(dateF);
    return matchQ && matchS && matchD;
  });

  const handleExport = () => {
    if (onExport) {
      onExport(filtered);
    } else {
      // Default export implementation
      const rows = [
        ["Date", "Loan Account", "Customer", "Amount", "Bank Ref", "Status", "Failure Reason"],
        ...filtered.map((d) => [d.date, d.loan, d.customer, d.amount, d.ref, d.status, d.reason]),
      ];
      const csv  = rows.map((r) => r.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url  = URL.createObjectURL(blob);
      const a    = Object.assign(document.createElement("a"), {
        href: url, download: "debit_history.csv",
      });
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <>
   

      <TableShell>
        <TableHead
          title="Transaction Log"
          columns={columns}
          search={search}
          setSearch={setSearch}
          filterValue={statusF}
          setFilterValue={setStatusF}
          filterOptions={filterOptions}
        />

        {loading
          ? <TableLoader colSpan={columns.length + 1} />
          : <TableBody columns={columns} data={filtered} actions={[
            {
              label: "View",
              onClick: (row) => {
                if (onView) {
                  onView(row);
                }
              },
            },
          ]} />
        }

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span className="text-xs text-slate-400 font-medium">
            Showing{" "}
            <span className="text-slate-600 font-semibold">{filtered.length}</span>
            {" "}of{" "}
            <span className="text-slate-600 font-semibold">{initialDebits.length}</span>
            {" "}transactions
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition-colors"
            >
              Export CSV
            </button>
            <button className="w-7 h-7 rounded-lg text-xs font-bold bg-blue-600 text-white">
              1
            </button>
          </div>
        </div>
      </TableShell>
    </>
  );
}

// Default export for backward compatibility
export default function NachAutoDebitTable({ type = "mandates", ...props }) {
  if (type === "history") {
    return <DebitHistoryTable {...props} />;
  }
  return <MandateManagementTable {...props} />;
}