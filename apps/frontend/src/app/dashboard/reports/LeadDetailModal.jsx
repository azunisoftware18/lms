import React from "react";
import { X } from "lucide-react";
import Button from "../../../components/ui/Button";

export default function LeadDetailModal({ open, lead, onClose }) {
  if (!open || !lead) return null;

  const formatCurrency = (value) => {
    if (!value && value !== 0) return "-";
    return `₹ ${Number(value).toLocaleString("en-IN")}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Lead Details</h2>
            <p className="text-sm text-gray-500 mt-1">
              Lead ID: {lead.leadNumber || lead.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Personal Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField label="Full Name" value={lead.fullName} />
              <InfoField label="Email" value={lead.email} />
              <InfoField label="Contact Number" value={lead.contactNumber} />
              <InfoField label="City" value={lead.city} />
              <InfoField label="State" value={lead.state} />
              <InfoField label="Address" value={lead.address} />
            </div>
          </div>

          {/* Loan Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Loan Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField
                label="Loan Type"
                value={lead.loanType?.name || "-"}
              />
              <InfoField
                label="Loan Amount"
                value={formatCurrency(lead.loanAmount)}
              />
              <InfoField
                label="Login Charges"
                value={formatCurrency(lead.defaultLoggingFeeAmount)}
              />
              <InfoField label="Status" value={formatStatus(lead.status)} />
            </div>
          </div>

          {/* Status & Remarks */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Status Information
            </h3>
            <div className="space-y-4">
              <StatusBadge status={lead.status} />
              {lead.remarks && (
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <p className="text-xs text-amber-600 font-semibold mb-2">
                    REMARKS / NOTES
                  </p>
                  <p className="text-sm text-amber-900 leading-relaxed">
                    {lead.remarks}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Assignment Information */}
          {(lead.assignedTo || lead.assignedBy) && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Assignment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField
                  label="Assigned To"
                  value={lead.assignedTo?.name || lead.assignedTo || "-"}
                />
                <InfoField
                  label="Assigned By"
                  value={lead.assignedBy?.name || lead.assignedBy || "-"}
                />
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Timeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <InfoField
                label="Created On"
                value={formatDate(lead.createdAt)}
              />
              <InfoField
                label="Last Updated"
                value={formatDate(lead.updatedAt)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

/* Reusable Info Field Component */
function InfoField({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
        {label}
      </p>
      <p className="font-medium text-gray-800 mt-1.5 break-words">
        {value || "-"}
      </p>
    </div>
  );
}

/* Status Badge Component */
function StatusBadge({ status }) {
  const statusColors = {
    CONTACTED: "bg-blue-100 text-blue-800 border-blue-300",
    INTERESTED: "bg-cyan-100 text-cyan-800 border-cyan-300",
    APPLICATION_IN_PROGRESS: "bg-yellow-100 text-yellow-800 border-yellow-300",
    APPLICATION_SUBMITTED: "bg-indigo-100 text-indigo-800 border-indigo-300",
    UNDER_REVIEW: "bg-purple-100 text-purple-800 border-purple-300",
    APPROVED: "bg-green-100 text-green-800 border-green-300",
    REJECTED: "bg-red-100 text-red-800 border-red-300",
    FUNDED: "bg-emerald-100 text-emerald-800 border-emerald-300",
    CLOSED: "bg-slate-100 text-slate-800 border-slate-300",
    DROPPED: "bg-orange-100 text-orange-800 border-orange-300",
    PENDING: "bg-gray-100 text-gray-800 border-gray-300",
  };

  const displayStatus = (status) => {
    return status
      ? status
          .replace(/_/g, " ")
          .toLowerCase()
          .replace(/\b\w/g, (l) => l.toUpperCase())
      : "Unknown";
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
        Current Status
      </span>
      <span
        className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${
          statusColors[status] || statusColors.PENDING
        }`}
      >
        {displayStatus(status)}
      </span>
    </div>
  );
}

/* Format Status Helper */
function formatStatus(status) {
  return status
    ? status
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (l) => l.toUpperCase())
    : "Unknown";
}
