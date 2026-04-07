import React from "react";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  IndianRupee,
  RefreshCw,
} from "lucide-react";
import Button from "../ui/Button";
import { useEligibility } from "../../hooks/useEligibility";

const statusTone = (status) => {
  const s = String(status || "").toUpperCase();
  if (s === "ELIGIBLE") return "bg-green-100 text-green-700";
  if (s === "PARTIALLY_ELIGIBLE") return "bg-amber-100 text-amber-700";
  if (s === "INELIGIBLE" || s === "ERROR") return "bg-red-100 text-red-700";
  return "bg-slate-100 text-slate-700";
};

const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "-";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function EligibilityModal({
  open,
  application = null,
  onClose = () => {},
  onApproveRules = () => {},
  onRejectRules = () => {},
  isUpdatingStatus = false,
  onEligibilityLoaded = () => {},
}) {
  const loanId = open ? application?.id : null;
  const {
    data: eligibilityData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useEligibility(loanId);

  const result = eligibilityData?.data || eligibilityData || null;

  React.useEffect(() => {
    if (loanId && result?.status) {
      onEligibilityLoaded(loanId, result);
    }
  }, [loanId, result, onEligibilityLoaded]);

  if (!open || !application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Eligibility Details
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {application.loanNumber || "-"} •{" "}
              {application.applicantName || "-"}
            </p>
          </div>
          <Button
            className="px-3! py-1.5! text-xs! bg-slate-700"
            onClick={onClose}
          >
            Close
          </Button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {isLoading || isFetching ? (
            <div className="flex items-center justify-center py-12 text-slate-600 gap-2">
              <RefreshCw size={18} className="animate-spin" />
              Checking eligibility...
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
              <p className="font-semibold">
                Failed to load eligibility details
              </p>
              <p className="text-sm mt-1">
                {error?.message || "Something went wrong"}
              </p>
              <div className="mt-3">
                <Button
                  className="px-3! py-1.5! text-xs!"
                  onClick={() => refetch()}
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : !result ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
              No eligibility result found.
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${statusTone(
                    result.status,
                  )}`}
                >
                  {String(result.status || "UNKNOWN").replace(/_/g, " ")}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  <IndianRupee size={12} />
                  Max Eligible: {formatCurrency(result.maxEligibleAmount)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-200 p-3 bg-slate-50">
                  <p className="text-xs text-slate-500">Total Rules</p>
                  <p className="text-xl font-bold text-slate-900">
                    {result.ruleSummary?.totalRules ?? 0}
                  </p>
                </div>
                <div className="rounded-xl border border-green-200 p-3 bg-green-50">
                  <p className="text-xs text-green-700">Passed</p>
                  <p className="text-xl font-bold text-green-800">
                    {result.ruleSummary?.passedRules ?? 0}
                  </p>
                </div>
                <div className="rounded-xl border border-red-200 p-3 bg-red-50">
                  <p className="text-xs text-red-700">Failed</p>
                  <p className="text-xl font-bold text-red-800">
                    {result.ruleSummary?.failedRules ?? 0}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-1">
                  <BarChart3 size={16} /> Risk Summary
                </p>
                <div className="text-sm text-slate-700">
                  Grade:{" "}
                  <span className="font-semibold">
                    {result.risk?.grade || "-"}
                  </span>{" "}
                  • Score:{" "}
                  <span className="font-semibold">
                    {result.risk?.score ?? "-"}
                  </span>
                </div>
                {Array.isArray(result.risk?.reasons) &&
                  result.risk.reasons.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {result.risk.reasons.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="text-xs text-slate-600">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  )}
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-1">
                  <AlertTriangle size={16} /> Reason(s)
                </p>
                {Array.isArray(result.reason) && result.reason.length > 0 ? (
                  <ul className="space-y-1">
                    {result.reason.map((item, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-slate-700 flex items-start gap-2"
                      >
                        <span className="mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-600">No issues reported.</p>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4">
          <Button
            className="px-4! py-2! text-sm! bg-red-600 hover:bg-red-700"
            onClick={() => onRejectRules(application.id)}
            disabled={isUpdatingStatus}
          >
            <XCircle size={16} /> Reject Rules
          </Button>
          <Button
            className="px-4! py-2! text-sm! bg-green-600 hover:bg-green-700"
            onClick={() => onApproveRules(application.id)}
            disabled={isUpdatingStatus}
          >
            <CheckCircle size={16} /> Approve Rules
          </Button>
        </div>
      </div>
    </div>
  );
}
