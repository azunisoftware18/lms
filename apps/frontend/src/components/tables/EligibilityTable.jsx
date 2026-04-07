import React from "react";
import { Eye, ShieldCheck } from "lucide-react";
import ActionMenu from "../common/ActionMenu";
import { TableShell, TableLoader, TableEmpty } from "./core";

const COLUMNS = [
  "Loan Number",
  "Requested Amount",
  "App Status",
  "Eligibility",
  "Actions",
];

const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "-";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const statusTone = (status) => {
  const s = String(status || "").toUpperCase();
  if (s === "ELIGIBLE") return "bg-green-100 text-green-700";
  if (s === "PARTIALLY_ELIGIBLE") return "bg-amber-100 text-amber-700";
  if (s === "INELIGIBLE" || s === "ERROR") return "bg-red-100 text-red-700";
  return "bg-slate-100 text-slate-700";
};

const appStatusTone = (status) => {
  const s = String(status || "").toLowerCase();
  if (s.includes("approved")) return "bg-green-100 text-green-700";
  if (s.includes("rejected")) return "bg-red-100 text-red-700";
  if (s.includes("review")) return "bg-violet-100 text-violet-700";
  if (s.includes("progress")) return "bg-blue-100 text-blue-700";
  return "bg-slate-100 text-slate-700";
};

export default function EligibilityTable({
  rows = [],
  loading = false,
  checkingId = null,
  onCheckEligibility = () => {},
  onViewDetails = () => {},
}) {
  return (
    <TableShell>
      <thead className="bg-slate-50 border-b border-slate-200">
        <tr>
          {COLUMNS.map((column) => (
            <th
              key={column}
              className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 ${
                column === "Actions" ? "text-right" : "text-left"
              }`}
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>

      {loading ? (
        <TableLoader colSpan={COLUMNS.length} />
      ) : rows.length === 0 ? (
        <TableEmpty colSpan={COLUMNS.length} />
      ) : (
        <tbody className="divide-y divide-slate-200">
          {rows.map((row) => {
            const isChecking = checkingId === row.id;
            return (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-800">{row.loanNumber || "-"}</p>
                  <p className="text-sm text-slate-700 mt-1">{row.applicantName || "-"}</p>
                </td>
                <td className="px-4 py-3 font-semibold text-slate-800">
                  {formatCurrency(row.requestedAmount)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${appStatusTone(
                      row.applicationStatus,
                    )}`}
                  >
                    {String(row.applicationStatus || "-")
                      .replace(/_/g, " ")
                      .toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone(
                      row.eligibilityStatus,
                    )}`}
                  >
                    {row.eligibilityStatus
                      ? String(row.eligibilityStatus).replace(/_/g, " ")
                      : "NOT CHECKED"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <ActionMenu
                    align="right"
                    actions={[
                      {
                        label: isChecking ? "Checking..." : "Check Eligibility",
                        icon: ShieldCheck,
                        disabled: isChecking,
                        onClick: () => onCheckEligibility(row.id),
                      },
                      {
                        label: "View Details",
                        icon: Eye,
                        onClick: () => onViewDetails(row.id),
                      },
                    ]}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      )}
    </TableShell>
  );
}
