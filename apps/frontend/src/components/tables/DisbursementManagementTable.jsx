import { Eye, Send, CreditCard, Printer } from "lucide-react";
import Button from "../ui/Button";
import Pagination from "../common/Pagination";
import { TableShell, TableLoader, TableEmpty } from "./core";
import { colorVariables } from "../../lib";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "bg-orange-100 text-orange-700 border-orange-200",
  },
  approved: {
    label: "Approved",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  paid: {
    label: "Paid",
    color: "bg-green-100 text-green-700 border-green-200",
  },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? {
    label: status,
    color: "bg-gray-100 text-gray-700",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border ${cfg.color}`}
    >
      {cfg.label}
    </span>
  );
}

export default function DisbursementManagementTable({
  data = [],
  activeTab = "pending",
  loading = false,
  onViewDetails = () => {},
  onDisburse = () => {},
  onPayNow = () => {},
  onPrint = () => {},
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
}) {
  const isPending = activeTab === "pending";
  const isApproved = activeTab === "approved";
  const isPaid = activeTab === "paid";
  // Status column is now shown for all tabs
  const colSpan = 6; // Always 6 columns: Customer, Loan ID, Amount, Bank, Status, Action

  return (
    <>
      <TableShell>
        <thead className="bg-slate-50 border-b border-slate-300">
          <tr className="text-left">
            {["Customer", "Loan ID", "Amount", "Bank", "Status"].map((col) => (
              <th
                key={col}
                className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {col}
              </th>
            ))}
            <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
              Action
            </th>
          </tr>
        </thead>

        {loading ? (
          <TableLoader colSpan={colSpan} />
        ) : data.length === 0 ? (
          <TableEmpty colSpan={colSpan} />
        ) : (
          <tbody className="divide-y divide-gray-100">
            {data.map((item, index) => {
              const isLast = index === data.length - 1;
              const cellClass = `p-4 text-xs sm:text-sm ${!isLast ? "border-b border-slate-100" : ""}`;

              return (
                <tr
                  key={item.id || item.loanId}
                  className="hover:bg-blue-50/50 transition-colors duration-150"
                >
                  <td className={`${cellClass} font-medium text-gray-800`}>
                    {item.customer}
                  </td>

                  <td className={cellClass}>
                    <div
                      className={`font-mono ${colorVariables.PRIMARY_COLOR}`}
                    >
                      {item.loanId || item.id}
                    </div>
                    {item.dvNo && (
                      <div className="text-xs text-gray-500">{item.dvNo}</div>
                    )}
                  </td>

                  <td className={`${cellClass} font-bold text-gray-900`}>
                    ₹{item.amount.toLocaleString()}
                  </td>

                  <td className={`${cellClass} text-gray-700`}>{item.bank}</td>

                  {/* Status column - now always visible */}
                  <td className={cellClass}>
                    <StatusBadge status={item.status || activeTab} />
                  </td>

                  <td className={cellClass}>
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => onViewDetails(item)}
                        className={`px-3 py-1.5 ${colorVariables.LIGHT_BG} ${colorVariables.PRIMARY_COLOR} border border-blue-200 hover:bg-blue-100 text-sm`}
                      >
                        <Eye size={14} />
                        View
                      </Button>

                      {isPending && (
                        <Button
                          onClick={() => onDisburse(item)}
                          className={`px-3 py-1.5 ${colorVariables.PRIMARY_BUTTON_COLOR} text-sm`}
                        >
                          <Send size={14} />
                          Disburse
                        </Button>
                      )}

                      {isApproved && (
                        <Button
                          onClick={() => onPayNow(item)}
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm"
                        >
                          <CreditCard size={14} />
                          Pay Now
                        </Button>
                      )}

                      {isPaid && (
                        <Button
                          onClick={() => onPrint(item)}
                          className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-sm"
                        >
                          <Printer size={14} />
                          Print
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        )}
      </TableShell>

      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <p className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              buttonClassName="px-3 py-1 border rounded hover:bg-gray-50"
              activeButtonClassName={`${colorVariables.ACCENT_COLOR_BG} text-white border-blue-600`}
            />
          </div>
        </div>
      )}
    </>
  );
}