import React, { useState } from "react";
import EMIManagementTableView from "../../../components/tables/EMIManagementTable";
import { useSearchParams } from "react-router-dom";
import PayEmiModal from "../../../components/modals/PayEmiModal";

export default function ViewEMIs() {
  const [searchParams] = useSearchParams();
  const loanIdParam = searchParams.get("loanId") || searchParams.get("loanNumber") || null;

  const [payOpen, setPayOpen] = useState(false);
  const [selectedEmiId, setSelectedEmiId] = useState(null);

  const handleView = (row) => {
    // Minimal details view; table also provides actions
    alert(`EMI: ${row.emiNumber || "-"}\nLoan: ${row.loanNumber || row.loanApplicationId || "-"}`);
  };

  const handlePayEMI = (row) => {
    // Open Pay EMI modal for the clicked row
    setSelectedEmiId(row.id || row.emiId || row.emi_id);
    setPayOpen(true);n
  };

  const closePayModal = () => {
    setPayOpen(false);
    setSelectedEmiId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">EMI Management</h1>
            <p className="mt-2 text-sm text-gray-600">Manage and track EMIs for the selected loan</p>
          </div>
        </div>

        {/* Table handles fetching via useLoanEmis when loanId is provided */}
        <EMIManagementTableView
          loanId={loanIdParam}
          onView={handleView}
          onPayEMI={handlePayEMI}
        />
        <PayEmiModal emiId={selectedEmiId} open={payOpen} onClose={closePayModal} />
      </div>
    </div>
  );
}
