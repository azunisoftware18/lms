import React, { useState, useMemo } from "react";
import { Clock, X, Send, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Components
import Button from "../../../components/ui/Button";
import SearchField from "../../../components/ui/SearchField";
import InputField from "../../../components/ui/InputField";
import SelectField from "../../../components/ui/SelectField";
import DisbursementManagementTable from "../../../components/tables/DisbursementManagementTable";

// Utils
import { colorVariables } from "../../../lib/index";
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

  const [dvForm, setDvForm] = useState({
    mode: "NEFT",
  });

  // 🔹 Fetch approved loans only
  const { data, isLoading, refetch } = useLoanApplicationsList({
    status: "approved",
    limit: 100,
  });

  // 🔹 Disbursement Hook
  const { mutate: disburseLoan, isPending } = useDisbursement({
    onSuccess: () => {
      // Refresh the loans list after successful disbursement
      refetch();
      setShowModal(false);
      setSelectedLoan(null);
    },
  });

  // 🔹 Format data
  const loans = useMemo(() => {
    let list = data?.data?.data || data?.data || [];

    if (!Array.isArray(list)) return [];

    return list.map((loan) => ({
      id: loan.id,
      loanNumber: loan.loanNumber, // ✅ Make sure loanNumber is included
      customer:
        loan.customer?.name ||
        `${loan.customer?.firstName || ""} ${loan.customer?.lastName || ""}`,
      amount: loan.approvedAmount || loan.requestedAmount,
      bank: loan.customer?.bankName || "N/A",
      status: loan.status,
    }));
  }, [data]);

  // 🔹 Filter
  const filteredLoans = loans.filter(
    (l) =>
      l.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.loanNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 🔹 Open modal
  const handleDisburse = (loan) => {
    setSelectedLoan(loan);
    setShowModal(true);
  };

  // 🔹 Submit - FIXED: Using loanNumber instead of loanId
  const handleSubmit = () => {
    if (!selectedLoan) return;
    
    const transactionRef = `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    disburseLoan({
      loanNumber: selectedLoan.loanNumber, // ✅ Changed from loanId to loanNumber
      payload: {
        disbursementMode: dvForm.mode,
        transactionReference: transactionRef,
        remarks: `Loan disbursement for ${selectedLoan.customer} - Amount: ₹${selectedLoan.amount.toLocaleString()}`,
      },
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
        <p className="text-gray-500 mt-1">Disburse approved loans to customers</p>
      </div>

      {/* Search */}
      <div className="mb-4">
        <SearchField
          value={searchQuery}
          placeholder="Search by customer name or loan number..."
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
      {showModal && selectedLoan && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-xl">Disburse Loan</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="hover:bg-gray-100 p-1 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between">
                <span className="text-gray-600">Loan Number:</span>
                <span className="font-mono font-medium">{selectedLoan.loanNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Customer:</span>
                <span className="font-medium">{selectedLoan.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold text-lg text-green-600">
                  ₹{selectedLoan.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bank:</span>
                <span className="font-medium">{selectedLoan.bank}</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <SelectField
                value={dvForm.mode}
                onChange={(val) => setDvForm({ mode: val })}
                options={[
                  { label: "NEFT", value: "NEFT" },
                  { label: "IMPS", value: "IMPS" },
                  { label: "RTGS", value: "RTGS" },
                  { label: "UPI", value: "UPI" },
                ]}
                placeholder="Select payment method"
              />
            </div>

            <Button
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Send size={16} className="mr-2" />
                  Disburse Loan
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}