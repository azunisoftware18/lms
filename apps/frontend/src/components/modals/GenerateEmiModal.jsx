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
    if (!loan?.id) return;
    try {
      setSubmitting(true);
      // onGenerate is expected to call the mutation; backend currently accepts only loanId
      await onGenerate(loan.id);
      onClose();
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600">Customer</label>
                <div className="mt-1 font-medium text-gray-900">
                  {loan?.customer?.firstName || loan?.applicantName || "N/A"}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600">
                  Loan Number
                </label>
                <div className="mt-1 font-medium text-gray-900">
                  {loan?.loanNumber ||
                    loan?.loanApplication?.loanNumber ||
                    "N/A"}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600">Principal</label>
                <div className="mt-1 font-semibold">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    minimumFractionDigits: 0,
                  }).format(principal)}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600">Tenure</label>
                <div className="mt-1">{tenure} months</div>
              </div>
            </div>

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
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-md bg-blue-600 text-white"
              >
                {submitting ? "Generating..." : "Generate EMI"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
