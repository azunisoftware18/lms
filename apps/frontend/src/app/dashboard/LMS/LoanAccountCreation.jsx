import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  LayoutGrid,
  Plus,
  FileText,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";

import Button from "../../../components/ui/Button";
import StatusCard from "../../../components/common/StatusCard";
import LoanAccountTable from "../../../components/tables/LoanAccountTable";
import { mockLoans } from "../../../lib/dumyData";

export default function LoanAccountCreation() {
  const navigate = useNavigate(); // Initialize navigate
  const [, setShowModal] = useState(false);
  const [loans] = useState(mockLoans);

  const counts = {
    active: loans.filter((l) => l.status === "Active").length,
    delinquent: loans.filter((l) => l.status === "Delinquent").length,
    closed: loans.filter((l) => l.status === "Closed").length,
  };

  const handleViewLoan = (loan) => {
    // Navigate to detail page with loan ID
    navigate(`/admin/loan-account-view/${loan.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <LayoutGrid size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
                Loan Account Creation
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Manage and monitor all loan accounts
              </p>
            </div>
          </div>

          <Button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto"
          >
            <Plus size={16} className="mr-2" />
            New Loan Account
          </Button>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          <StatusCard
            title="Total Accounts"
            value={loans.length}
            subtext="All accounts"
            icon={FileText}
            variant="blue"
            size="compact"
          />
          <StatusCard
            title="Active"
            value={counts.active}
            subtext="In repayment"
            icon={CheckCircle}
            variant="green"
            size="compact"
          />
          <StatusCard
            title="Delinquent"
            value={counts.delinquent}
            subtext="Needs attention"
            icon={AlertCircle}
            variant="red"
            size="compact"
          />
          <StatusCard
            title="Closed"
            value={counts.closed}
            subtext="Fully repaid"
            icon={XCircle}
            variant="orange"
            size="compact"
          />
        </div>

        {/* TABLE CARD */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <LoanAccountTable
              loans={loans}
              loading={false}
              onView={handleViewLoan}
            />
          </div>
        </div>
      </main>

      {/* Create Loan Modal - Add later */}
      {/* {showModal && <CreateLoanModal onClose={() => setShowModal(false)} />} */}
    </div>
  );
}
