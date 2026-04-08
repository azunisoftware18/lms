import React from 'react';

export default function ViewCaseModal({ open = false, onClose = () => {}, loan = null }) {
  if (!open) return null;

  return (
    <div>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-[95%] max-w-2xl shadow-lg">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">Case Details</h3>
          <button onClick={onClose} className="text-slate-500">Close</button>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
          <div>
            <div className="text-slate-500">Loan</div>
            <div className="font-medium">{loan?.loanNumber}</div>
          </div>
          <div>
            <div className="text-slate-500">Customer</div>
            <div className="font-medium">{loan?.customerName}</div>
          </div>
          <div>
            <div className="text-slate-500">Outstanding</div>
            <div className="font-medium">₹{(loan?.outstandingAmount ?? 0).toLocaleString()}</div>
          </div>
          <div>
            <div className="text-slate-500">Assigned Agent</div>
            <div className="font-medium">{loan?.assignedAgent}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
