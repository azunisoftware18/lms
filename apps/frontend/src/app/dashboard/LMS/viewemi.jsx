import React from "react";
import EMIManagementTableView from "../../../components/tables/EMIManagementTable";
import { useSearchParams } from "react-router-dom";

export default function ViewEMIs() {
  const [searchParams] = useSearchParams();
  const loanIdParam = searchParams.get("loanId") || searchParams.get("loanNumber") || null;

  const handleView = (row) => {
    // Minimal details view; table also provides actions
    alert(`EMI: ${row.emiNumber || "-"}\nLoan: ${row.loanNumber || row.loanApplicationId || "-"}`);
  };

  const handlePayEMI = (row) => {
    // Placeholder behaviour - table's actions will call this when needed
    alert(`Initiate payment for ${row.emiNumber || row.id}`);
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
      </div>
    </div>
  );
}
