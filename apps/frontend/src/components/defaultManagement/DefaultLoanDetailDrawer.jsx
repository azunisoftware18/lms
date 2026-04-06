import { X } from "lucide-react";

export default function DefaultLoanDetailDrawer({ loan, onClose }) {
  if (!loan) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30" onClick={onClose} />
      <div className="w-[450px] bg-white shadow-xl overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex justify-between items-center">
          <h3 className="font-semibold text-lg">Loan Details: {loan.loanNumber}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-slate-500">Customer:</div>
            <div className="font-medium">{loan.customer?.firstName} {loan.customer?.lastName}</div>
            <div className="text-slate-500">Contact:</div>
            <div>{loan.customer?.contactNumber}</div>
            <div className="text-slate-500">PAN:</div>
            <div>{loan.customer?.panNumber || "-"}</div>
            <div className="text-slate-500">Branch:</div>
            <div>{loan.branchName || loan.branch?.name || loan.branchId || "-"}</div>
            <div className="text-slate-500">Loan Type:</div>
            <div>{loan.loanType?.name || loan.loanTypeName || (typeof loan.loanType === "string" ? loan.loanType : "-")}</div>
            <div className="text-slate-500">Approved Amount:</div>
            <div>₹{Number(loan.approvedAmount || 0).toLocaleString()}</div>
            <div className="text-slate-500">Outstanding:</div>
            <div className="text-red-600 font-medium">₹{Number(loan.loanRecoveries?.[0]?.balanceAmount || 0).toLocaleString()}</div>
            <div className="text-slate-500">Recovered:</div>
            <div className="text-green-600">₹{Number(loan.loanRecoveries?.[0]?.recoveredAmount || 0).toLocaleString()}</div>
            <div className="text-slate-500">DPD:</div>
            <div className="font-semibold">{loan.dpd} days</div>
            <div className="text-slate-500">Recovery Stage:</div>
            <div>{loan.loanRecoveries?.[0]?.recoveryStage || "-"}</div>
            <div className="text-slate-500">Recovery Status:</div>
            <div>{loan.loanRecoveries?.[0]?.recoveryStatus || "-"}</div>
            <div className="text-slate-500">Assigned To:</div>
            <div>{loan.assignedTo?.name || loan.assignedTo || "-"}</div>
          </div>

          <div className="border-t pt-3">
            <div className="font-medium mb-2">Notes</div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {(loan.notes || []).length === 0 ? (
                <p className="text-slate-400 text-sm">No notes available</p>
              ) : (
                (loan.notes || []).map((note, i) => (
                  <div key={i} className="bg-slate-50 p-2 rounded text-sm">
                    <span className="font-semibold">{note.by}:</span> {note.text}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
