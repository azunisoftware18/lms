import {
  Home,
  Car,
  Briefcase,
  CreditCard,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { TableShell, TableLoader, TableEmpty } from "./core";

const COLUMNS = [
  "Loan Type",
  "Bank / NBFC",
  "EMI Amount",
  "Outstanding",
  "Overdue",
  "Status",
];

const LOAN_TYPE_ICONS = {
  "Home Loan": <Home size={16} className="text-blue-500" />,
  "Car Loan": <Car size={16} className="text-emerald-500" />,
  "Personal Loan": <Briefcase size={16} className="text-purple-500" />,
  "Credit Card": <CreditCard size={16} className="text-amber-500" />,
};

const getStatusTone = (statusColor) => {
  if (statusColor === "rose") return "bg-rose-100 text-rose-700";
  if (statusColor === "emerald") return "bg-emerald-100 text-emerald-700";
  if (statusColor === "amber") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
};

export default function CreditCheckTable({ loans = [], loading = false }) {
  return (
    <TableShell>
      <thead className="bg-slate-50 border-b border-slate-300">
        <tr>
          {COLUMNS.map((col) => (
            <th
              key={col}
              className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-slate-600 uppercase tracking-wider text-[10px] sm:text-[11px] whitespace-nowrap"
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>

      {loading ? (
        <TableLoader colSpan={COLUMNS.length} />
      ) : loans.length === 0 ? (
        <TableEmpty colSpan={COLUMNS.length} />
      ) : (
        <tbody className="divide-y divide-slate-100">
          {loans.map((loan, index) => {
            const isLast = index === loans.length - 1;
            const cellClass = `px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm ${
              !isLast ? "border-b border-slate-200" : ""
            }`;

            return (
              <tr
                key={loan.id || index}
                className="hover:bg-blue-50/50 transition-colors duration-150"
              >
                <td className={cellClass}>
                  <div className="flex items-center gap-2">
                    {LOAN_TYPE_ICONS[loan.loanType] ?? null}
                    <span className="font-medium text-slate-800">
                      {loan.loanType}
                    </span>
                  </div>
                </td>

                <td className={`${cellClass} text-slate-700`}>
                  {loan.bankName}
                </td>

                <td className={`${cellClass} font-medium text-slate-800`}>
                  ₹{loan.emiAmount.toLocaleString("en-IN")}
                </td>

                <td className={`${cellClass} text-slate-700`}>
                  ₹{loan.outstandingAmount.toLocaleString("en-IN")}
                </td>

                <td className={cellClass}>
                  <span
                    className={`font-medium ${
                      loan.overdueAmount > 0
                        ? "text-rose-600"
                        : "text-slate-700"
                    }`}
                  >
                    ₹{loan.overdueAmount.toLocaleString("en-IN")}
                  </span>
                </td>

                <td className={cellClass}>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusTone(
                      loan.statusColor,
                    )}`}
                  >
                    {loan.status === "Active" && (
                      <CheckCircle size={12} className="mr-1" />
                    )}
                    {loan.status === "Default" && (
                      <AlertCircle size={12} className="mr-1" />
                    )}
                    {loan.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      )}
    </TableShell>
  );
}
