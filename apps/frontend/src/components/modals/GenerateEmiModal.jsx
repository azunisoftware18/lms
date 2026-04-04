import React, { useEffect, useState, useMemo } from "react";
import { X } from "lucide-react";

export default function GenerateEmiModal({
  isOpen,
  onClose,
  loan,
  onGenerate,
}) {
  const [startDate, setStartDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [generated, setGenerated] = useState(null);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount || 0);

  const formatDate = (d) => {
    if (!d) return "N/A";
    try {
      return new Date(d).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return String(d);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const defaultDate = loan?.emiStartDate
        ? new Date(loan.emiStartDate).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10);
      setStartDate(defaultDate);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => (document.body.style.overflow = "unset");
  }, [isOpen, loan]);

  const principal = loan?.approvedAmount ?? loan?.requestedAmount ?? 0;
  const tenure = loan?.tenureMonths ?? loan?.tenure ?? 0;
  const annualRate = loan?.interestRate ?? 0;
  const interestType =
    loan?.interestType ?? loan?.loanType?.interestType ?? "REDUCING";

  const estimatedEmi = useMemo(() => {
    if (!principal || !tenure) return 0;
    const monthlyRate = annualRate / 12 / 100;
    if ((interestType || "").toUpperCase() === "FLAT") {
      const totalInterest = (principal * annualRate * (tenure / 12)) / 100;
      const totalPayable = principal + totalInterest;
      return Math.round(totalPayable / tenure);
    }
    // reducing
    const r = monthlyRate;
    const n = tenure;
    const numerator = principal * r * Math.pow(1 + r, n);
    const denominator = Math.pow(1 + r, n) - 1;
    if (denominator === 0) return Math.round(principal / n);
    return Math.round(numerator / denominator);
  }, [principal, tenure, annualRate, interestType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loan) return;
    try {
      setSubmitting(true);
      // onGenerate is expected to call the mutation; backend currently accepts only loanId
      // prefer loanNumber when available (backend accepts either)
      const key = loan.loanNumber || loan.id;
      const resp = await onGenerate(key);
      // mutation resolves with API response; parent returns that
      setGenerated(resp?.data ?? resp);
    } catch  {
      // noop - parent handles errors via toast
      
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm px-4 py-6 sm:py-12"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center">
        <div
          className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-medium">Generate EMI Schedule</h3>
            <button
              className="p-2 rounded-md hover:bg-slate-100"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Loan details grid - supports both loan and loan.loanApplication shapes */}
            {loan && (
              (() => {
                const L = loan.loanApplication || loan;
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600">Customer</label>
                      <div className="mt-1 font-medium text-gray-900">
                        {L.customer?.firstName || L.applicantName || L.customer?.name || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500">{L.customer?.email}</div>
                      <div className="text-xs text-gray-500">{L.customer?.contactNumber}</div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600">Loan Number</label>
                      <div className="mt-1 font-medium text-gray-900">{L.loanNumber || "N/A"}</div>
                      <div className="text-xs text-gray-500">{L.loanTypeName || L.loanType?.name || ""}</div>
                      <div className="text-xs text-gray-500">{L.branchName || L.branchId || ""}</div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600">Principal</label>
                      <div className="mt-1 font-semibold">{formatCurrency(L.approvedAmount ?? L.requestedAmount)}</div>
                      <div className="text-xs text-gray-500">Requested: {formatCurrency(L.requestedAmount)}</div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600">Tenure</label>
                      <div className="mt-1">{L.tenureMonths ?? L.tenure ?? 0} months</div>
                      <div className="text-xs text-gray-500">Interest: {L.interestRate ?? 0}% ({(L.interestType || L.loanType?.interestType || "REDUCING").toString()})</div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600">Status</label>
                      <div className="mt-1 font-medium text-gray-900">{(L.status || L.applicationStatus || "N/A").toString()}</div>
                      <div className="text-xs text-gray-500">Purpose: {L.loanPurpose || L.purpose || "-"}</div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600">Created</label>
                      <div className="mt-1">{formatDate(L.createdAt)}</div>
                      <div className="text-xs text-gray-500">KYC: {L.kycStatus || "-"} • Docs: {L.documentCount ?? 0}</div>
                    </div>
                  </div>
                );
              })()
            )}

            <div>
              <label className="block text-sm text-gray-600">
                EMI Start Date
              </label>
              <input
                type="date"
                className="mt-1 w-full border rounded-md px-3 py-2"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="pt-2 border-t">
              <div className="text-sm text-gray-600">Estimated EMI</div>
              <div className="text-xl font-semibold mt-1">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  minimumFractionDigits: 0,
                }).format(estimatedEmi)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                This is an estimated EMI based on current loan data.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-white border"
              >
                Cancel
              </button>
              {!generated ? (
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white"
                >
                  {submitting ? "Generating..." : "Generate EMI"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setGenerated(null);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white"
                >
                  Close
                </button>
              )}
            </div>
          </form>
          {generated && (
            <div className="p-6 border-t">
              <h4 className="text-md font-semibold mb-3">Generated EMI Schedule</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-500">Loan</div>
                  <div className="font-medium">{generated.loan?.loanNumber}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Principal</div>
                  <div className="font-medium">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(generated.loan?.approvedAmount || 0)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">EMIs</div>
                  <div className="font-medium">{generated.summary?.emiCount || 0}</div>
                </div>
              </div>

              <div className="overflow-auto max-h-48">
                <table className="w-full text-sm table-auto">
                  <thead>
                    <tr className="text-left text-xs text-gray-500">
                      <th className="py-1">#</th>
                      <th className="py-1">Due Date</th>
                      <th className="py-1">Principal</th>
                      <th className="py-1">Interest</th>
                      <th className="py-1">EMI</th>
                      <th className="py-1">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(generated.emis) && generated.emis.map((e) => (
                      <tr key={e.id} className="border-t">
                        <td className="py-2">{e.emiNo}</td>
                        <td className="py-2">{new Date(e.dueDate).toLocaleDateString("en-IN")}</td>
                        <td className="py-2">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(e.principalAmount || 0)}</td>
                        <td className="py-2">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(e.interestAmount || 0)}</td>
                        <td className="py-2">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(e.emiAmount || 0)}</td>
                        <td className="py-2">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(e.closingBalance || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 text-right text-sm text-gray-600">
                <div>Total Principal: {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(generated.summary?.totalPrincipal || 0)}</div>
                <div>Total Interest: {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(generated.summary?.totalInterest || 0)}</div>
                <div className="font-semibold">Total EMI Amount: {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(generated.summary?.totalEmiAmount || 0)}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
