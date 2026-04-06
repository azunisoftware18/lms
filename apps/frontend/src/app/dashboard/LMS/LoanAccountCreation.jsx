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
import { useLoanApplications } from "../../../hooks/useLoanApplication";

export default function LoanAccountCreation() {
  const navigate = useNavigate(); // Initialize navigate
  const [, setShowModal] = useState(false);

  // Fetch loan applications from API (all statuses)
  const { data: loanApiData, isLoading: loansLoading } = useLoanApplications({ page: 1, limit: 200 });

  const rawLoans = Array.isArray(loanApiData)
    ? loanApiData
    : Array.isArray(loanApiData?.data)
    ? loanApiData.data
    : Array.isArray(loanApiData?.data?.data)
    ? loanApiData.data.data
    : [];

  const formatStatusDisplay = (s) => {
    if (!s) return "Active";
    const key = String(s).toLowerCase();
    return key
      .replace(/_/g, " ")
      .split(" ")
      .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ""))
      .join(" ");
  };

  const loans = (rawLoans || []).map((l) => {
    const statusKey = String(l.status || "").toLowerCase();
    return {
      id: l.id || l.loanNumber,
      loanNumber: l.loanNumber || l.id,
      customerName:
        (l.customer && (l.customer.firstName || l.customer.lastName))
          ? `${l.customer.firstName || ""} ${l.customer.lastName || ""}`.trim()
          : l.customer?.name || "",
      branch: l.branchName || l.branch?.name || "",
      loanAmount: Math.round(l.approvedAmount ?? l.requestedAmount ?? 0),
      outstandingBalance: Math.round(l.outstandingBalance ?? l.approvedAmount ?? 0),
      status: formatStatusDisplay(statusKey),
      statusKey,
    };
  });

  // Only show these statuses on this page
  const allowedStatusKeys = [
    "active",
    "closed",
    "delinquent",
    "written_off",
    "defaulted",
  ];

  const filteredLoans = loans.filter((l) =>
    allowedStatusKeys.includes(l.statusKey)
  );

  // Prefer server-reported total (pagination meta) when available — fallback to displayed count
  const totalAccounts = Number(
    loanApiData?.meta?.total ?? loanApiData?.data?.meta?.total ?? filteredLoans.length
  );

  const counts = {
    active: filteredLoans.filter((l) => l.statusKey === "active").length,
    delinquent: filteredLoans.filter((l) => l.statusKey === "delinquent").length,
    closed: filteredLoans.filter((l) => l.statusKey === "closed").length,
    writtenOff: filteredLoans.filter((l) =>
      l.statusKey === "written_off" || l.statusKey === "written off"
    ).length,
    defaulted: filteredLoans.filter((l) => l.statusKey === "defaulted").length,
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
                Loan Account Management
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
            value={totalAccounts}
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
          <StatusCard
            title="Written Off"
            value={counts.writtenOff}
            subtext="Write-offs"
            icon={XCircle}
            variant="slate"
            size="compact"
          />
          <StatusCard
            title="Defaulted"
            value={counts.defaulted}
            subtext="Defaulted loans"
            icon={AlertCircle}
            variant="yellow"
            size="compact"
          />
        </div>

        {/* TABLE CARD */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <LoanAccountTable
                loans={filteredLoans}
                loading={loansLoading}
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
