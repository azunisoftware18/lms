import React, { useState, useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Components
import SearchField from "../../../components/ui/SearchField";
import DisbursementManagementTable from "../../../components/tables/DisbursementManagementTable";
import DisbursementFormModal from "../../../components/modals/DisbursementFormModal";

// Utils
import { apiGet } from "../../../lib/api/apiClient";
import { normalizeParams } from "../../../lib/utils/paramHelper";

// Hooks
import { useDisbursement } from "../../../hooks/useDisbursement";

// 🔹 Loan list hook
const useLoanApplicationsList = (params = {}) => {
  const normalizedParams = normalizeParams(params);

  return useQuery({
    queryKey: ["loanApplications", normalizedParams],
    queryFn: () => apiGet(`/loan-applications`, { params: normalizedParams }),
  });
};

export default function DisbursementManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading, refetch } = useLoanApplicationsList({
    status: "approved",
    limit: 100,
  });

  const { mutate: disburseLoan, isPending } = useDisbursement({
    onSuccess: () => {
      refetch();
      setShowModal(false);
      setSelectedLoan(null);
    },
  });

  // ✅ Format loans
  const loans = useMemo(() => {
    let list = data?.data?.data || data?.data || [];

    if (!Array.isArray(list)) return [];

    return list.map((loan) => ({
      id: loan.id,
      loanNumber: loan.loanNumber,
      customer:
        loan.customer?.name ||
        `${loan.customer?.firstName || ""} ${loan.customer?.lastName || ""}`,
      amount: loan.approvedAmount || loan.requestedAmount,
      bank: loan.customer?.bankName || "N/A",
    }));
  }, [data]);

  // ✅ FIXED FILTER (IMPORTANT)
  const filteredLoans = loans.filter(
    (loan) =>
      loan.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.loanNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDisburse = (loan) => {
    setSelectedLoan(loan);
    setShowModal(true);
  };

  // ✅ FIXED (loanId instead of loanNumber)
  const handleDisbursementSubmit = async (payload) => {
    return new Promise((resolve, reject) => {
      disburseLoan(
        {
          loanId: selectedLoan.id, // 🔥 MOST IMPORTANT FIX
          payload,
        },
        {
          onSuccess: resolve,
          onError: reject,
        }
      );
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          Admin <ChevronRight size={14} /> Disbursement
        </div>
        <h1 className="text-2xl font-bold">Disbursement</h1>
        <p className="text-gray-500 mt-1">
          Disburse approved loans to customers
        </p>
      </div>

      {/* Search */}
      <div className="mb-4">
        <SearchField
          value={searchQuery}
          placeholder="Search by customer or loan..."
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery("")}
        />
      </div>

      {/* Table */}
      <DisbursementManagementTable
        data={filteredLoans}
        loading={isLoading}
        onDisburse={handleDisburse}
      />

      {/* Modal */}
      <DisbursementFormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedLoan(null);
        }}
        loanData={selectedLoan}
        onSubmit={handleDisbursementSubmit}
      />
    </div>
  );
}