import React from "react";
import { Eye, IndianRupee, Phone, AlertCircle, Check, Ban } from "lucide-react";
import Pagination from "../common/Pagination";
import { TableBody, TableShell } from "./core";
import Button from "../ui/Button";
// Helper function to get status color
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return "bg-green-100 text-green-700 border-green-200";
    case "rejected":
      return "bg-red-100 text-red-700 border-red-200";
    case "pending":
    case "kyc_pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

// Mobile Card View Component
const CardView = ({ applications, onViewDetails }) => (
  <div className="space-y-4">
    {applications.map((application) => (
      <div
        key={application.id}
        className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
              {application.customer?.firstName?.charAt(0) || "?"}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-slate-800 text-sm truncate">
                {application.customer
                  ? `${application.customer.firstName || ""} ${application.customer.lastName || ""}`
                  : "—"}
              </h3>
              <p className="text-xs text-slate-500 truncate">
                {application.customer?.email || "—"}
              </p>
            </div>
          </div>
          <span
            className={`px-2 py-1 rounded-lg text-xs font-medium border whitespace-nowrap ${getStatusColor(application.status)}`}
          >
            {application.status || "Pending"}
          </span>
        </div>

        <div className="space-y-2 mb-3 pb-3 border-t border-slate-100 pt-3">
          <div className="flex justify-between gap-2">
            <span className="text-xs text-slate-500">Amount</span>
            <span className="text-sm font-semibold text-slate-800 flex items-center gap-1">
              <IndianRupee size={14} />
              {application.requestedAmount
                ? Number(application.requestedAmount).toLocaleString()
                : "N/A"}
            </span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-xs text-slate-500">CIBIL</span>
            <span
              className={`text-sm font-semibold px-2 py-0.5 rounded ${
                application.cibilScore >= 750
                  ? "bg-green-100 text-green-700"
                  : application.cibilScore >= 650
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {application.cibilScore ?? "N/A"}
            </span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-xs text-slate-500">Contact</span>
            <div className="flex items-center gap-1 text-xs text-slate-600">
              <Phone size={12} />
              {application.customer?.contactNumber || "—"}
            </div>
          </div>
        </div>

        <Button
          onClick={() => onViewDetails(application)}
          className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm py-2 flex items-center justify-center gap-2"
        >
          <Eye size={16} />
          View Details
        </Button>
      </div>
    ))}
  </div>
);
export default function ApplicationPageTable({
  paginatedApplications = [],
  tableColumns = [],
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  shouldShowLoadingOnly = false,
  onViewDetails = () => {},
}) {
  if (shouldShowLoadingOnly) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 text-center text-slate-500 text-sm sm:text-base">
        Loading applications...
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200">
        <TableShell>
          <thead className="bg-linear-to-r from-slate-50 to-blue-50 text-slate-600 text-xs font-semibold uppercase tracking-wider">
            <tr>
              {tableColumns.map((col) => (
                <th
                  key={col.header}
                  className="px-3 sm:px-6 py-3 sm:py-4 text-left"
                >
                  {col.header}
                </th>
              ))}
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-right">Actions</th>
            </tr>
          </thead>
          <TableBody
            columns={tableColumns}
            data={paginatedApplications}
            actions={[
              {
                label: "View",
                onClick: onViewDetails,
              },
            ]}
          />
        </TableShell>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        <CardView
          applications={paginatedApplications}
          onViewDetails={onViewDetails}
        />
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
}
