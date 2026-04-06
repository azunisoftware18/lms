import React, { useMemo, useState } from "react";
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import DefaultLoanTable from "../../../components/tables/core/DefaultLoanTable";
import DefaultManagementStats from "../../../components/defaultManagement/DefaultManagementStats";
import DefaultManagementCharts from "../../../components/defaultManagement/DefaultManagementCharts";
import DefaultLoanDetailDrawer from "../../../components/defaultManagement/DefaultLoanDetailDrawer";
import RecoveryForm from "../../../components/forms/RecoveryForm";
import RecoveryNoteForm from "../../../components/forms/RecoveryNoteForm";
import { useDefaultedLoans, useCheckLoanDefault } from "../../../hooks/useLoanDefault";
import { defaultLoanDummyData } from "../../../lib/LMSDATA/LMSDummyData";
import { showSuccess, showError } from "../../../lib/utils/toastService";

function ModalShell({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="rounded p-1 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function DefaultManagementPage() {
  const { data, isLoading } = useDefaultedLoans();
  const checkMutation = useCheckLoanDefault();

  const defaultState = useSelector((state) => state.loanDefault || null);

  const queryRows = data?.data || [];
  const reduxRows = defaultState?.defaultedLoans?.data || [];

  const resolvedRows = useMemo(() => {
    if (Array.isArray(queryRows) && queryRows.length) return queryRows;
    if (Array.isArray(reduxRows) && reduxRows.length) return reduxRows;
    return defaultLoanDummyData;
  }, [queryRows, reduxRows]);

  const [rowsState, setRowsState] = useState(resolvedRows);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [activeLoanId, setActiveLoanId] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);

  React.useEffect(() => {
    setRowsState(resolvedRows);
  }, [resolvedRows]);

  const totals = useMemo(() => {
    const totalLoans = rowsState.length;
    const totalOutstanding = rowsState.reduce((sum, row) => {
      return sum + Number(row.loanRecoveries?.[0]?.balanceAmount ?? row.outstandingAmount ?? 0);
    }, 0);
    const totalRecovered = rowsState.reduce((sum, row) => {
      return sum + Number(row.loanRecoveries?.[0]?.recoveredAmount ?? 0);
    }, 0);
    const totalApproved = rowsState.reduce((sum, row) => sum + Number(row.approvedAmount || 0), 0);
    const avgDpd = totalLoans
      ? Math.round(rowsState.reduce((sum, row) => sum + Number(row.dpd || 0), 0) / totalLoans)
      : 0;
    const recoveryRate = totalApproved > 0 ? (totalRecovered / totalApproved) * 100 : 0;

    return { totalLoans, totalOutstanding, totalRecovered, totalApproved, avgDpd, recoveryRate };
  }, [rowsState]);

  const handleView = (row) => {
    setSelectedLoan(row.raw || row);
    setShowDetail(true);
  };

  const handleCheck = (loanId) => {
    checkMutation.mutate(loanId);
    showSuccess(`Default check initiated for loan ID: ${loanId}`);
  };

  const handleCreateRecovery = (loanId) => {
    setActiveLoanId(loanId);
    setShowRecoveryModal(true);
  };

  const handleAddNote = (loanId) => {
    setActiveLoanId(loanId);
    setShowNoteModal(true);
  };

  const submitRecovery = (amount) => {
    if (!activeLoanId || !amount || amount <= 0) {
      showError("Please enter a valid recovery amount.");
      return;
    }

    setRowsState((prev) =>
      prev.map((loan) => {
        if (loan.id !== activeLoanId) return loan;

        const currentRecovery = loan.loanRecoveries?.[0] || {
          balanceAmount: loan.outstandingAmount || loan.approvedAmount || 0,
          recoveredAmount: 0,
          recoveryStage: "INITIAL_CONTACT",
          recoveryStatus: "ONGOING",
        };

        const nextRecovered = Number(currentRecovery.recoveredAmount || 0) + amount;
        const nextBalance = Math.max(0, Number(currentRecovery.balanceAmount || 0) - amount);

        const notes = Array.isArray(loan.notes) ? [...loan.notes] : [];
        notes.unshift({
          by: "USER",
          text: `Recovery payment of ₹${amount.toLocaleString()} recorded. New balance: ₹${nextBalance.toLocaleString()}`,
          at: new Date().toISOString(),
        });

        return {
          ...loan,
          loanRecoveries: [
            {
              ...currentRecovery,
              recoveredAmount: nextRecovered,
              balanceAmount: nextBalance,
              recoveryStatus: nextBalance === 0 ? "COMPLETED" : "ONGOING",
            },
          ],
          notes,
        };
      }),
    );

    setShowRecoveryModal(false);
    showSuccess(`Recovery of ₹${amount.toLocaleString()} recorded successfully.`);
  };

  const submitNote = (noteText) => {
    if (!activeLoanId || !String(noteText || "").trim()) {
      showError("Note cannot be empty.");
      return;
    }

    setRowsState((prev) =>
      prev.map((loan) => {
        if (loan.id !== activeLoanId) return loan;
        const notes = Array.isArray(loan.notes) ? [...loan.notes] : [];
        notes.unshift({ by: "USER", text: noteText.trim(), at: new Date().toISOString() });
        return { ...loan, notes };
      }),
    );

    setShowNoteModal(false);
    showSuccess("Note added successfully.");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Default Management Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">Monitor and manage defaulted loans</p>
          </div>
          <div className="rounded-lg bg-white px-4 py-2 shadow-sm">
            <span className="text-sm text-slate-500">Last Updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <DefaultManagementStats totals={totals} />
        <DefaultManagementCharts rows={rowsState} />

        <DefaultLoanTable
          data={rowsState}
          loading={isLoading}
          onView={handleView}
          onCheck={handleCheck}
          onCreateRecovery={handleCreateRecovery}
          onAddNote={handleAddNote}
        />

        {showDetail && selectedLoan && (
          <DefaultLoanDetailDrawer loan={selectedLoan} onClose={() => setShowDetail(false)} />
        )}

        {showRecoveryModal && (
          <ModalShell title="Record Recovery Payment" onClose={() => setShowRecoveryModal(false)}>
            <RecoveryForm
              onSubmit={submitRecovery}
              onCancel={() => setShowRecoveryModal(false)}
            />
          </ModalShell>
        )}

        {showNoteModal && (
          <ModalShell title="Add Recovery Note" onClose={() => setShowNoteModal(false)}>
            <RecoveryNoteForm
              onSubmit={submitNote}
              onCancel={() => setShowNoteModal(false)}
            />
          </ModalShell>
        )}
      </div>
    </div>
  );
}
