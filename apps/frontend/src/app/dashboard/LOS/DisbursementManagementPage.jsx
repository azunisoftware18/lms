import React, { useState, useMemo, useEffect } from "react";
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
    // Optional: Add error handling
    onError: (error) => {
      console.error("Failed to fetch loan applications:", error);
    },
  });
};

export default function DisbursementManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch approved loan applications
  const { data, isLoading, error, refetch } = useLoanApplicationsList({
    status: "approved",
    limit: 100,
  });

  // Disbursement mutation hook
  const { mutate: disburseLoan, isPending } = useDisbursement({
    onSuccess: () => {
      console.log("Disbursement successful, refreshing list...");
      refetch(); // Refresh the loan list
      setShowModal(false); // Close modal
      setSelectedLoan(null); // Clear selected loan
    },
    onError: (error) => {
      console.error("Disbursement failed:", error);
    },
  });

  // ✅ Format loans for display
  const loans = useMemo(() => {
    let list = data?.data?.data || data?.data || [];

    if (!Array.isArray(list)) return [];

    return list.map((loan) => ({
      id: loan.id,
      loanNumber: loan.loanNumber,
      customer:
        loan.customer?.name ||
        `${loan.customer?.firstName || ""} ${loan.customer?.lastName || ""}`.trim(),
      amount: loan.approvedAmount || loan.requestedAmount,
      bank: loan.customer?.bankName || "N/A",
    }));
  }, [data]);

  // ✅ Filter loans based on search query
  const filteredLoans = useMemo(() => {
    if (!searchQuery.trim()) return loans;
    
    return loans.filter(
      (loan) =>
        loan.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.loanNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [loans, searchQuery]);

  // Handle disburse button click
  const handleDisburse = (loan) => {
    console.log("Selected loan for disbursement:", loan);
    setSelectedLoan(loan);
    setShowModal(true);
  };

  // ✅ FIXED: Handle disbursement form submission
  const handleDisbursementSubmit = async (payload) => {
    // Validate selected loan has loanNumber
    if (!selectedLoan?.loanNumber) {
      console.error("No loan number found for selected loan:", selectedLoan);
      return Promise.reject(new Error("Loan number is missing"));
    }

    console.log("Submitting disbursement with:", {
      loanNumber: selectedLoan.loanNumber,
      payload,
    });

    return new Promise((resolve, reject) => {
      disburseLoan(
        {
          loanNumber: selectedLoan.loanNumber, // ✅ Using loanNumber (not loanId)
          payload,
        },
        {
          onSuccess: (data) => {
            console.log("Disbursement success response:", data);
            resolve(data);
          },
          onError: (error) => {
            console.error("Disbursement error response:", error);
            reject(error);
          },
        }
      );
    });
  };

  // Debug: Log when component mounts and data changes
  useEffect(() => {
    console.log("Component mounted");
    console.log("Fetching loans with status: approved");
  }, []);

  useEffect(() => {
    if (data) {
      console.log("Loans data received:", data);
      console.log("Number of loans:", loans.length);
    }
    if (error) {
      console.error("Error fetching loans:", error);
    }
  }, [data, error, loans.length]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          Admin <ChevronRight size={14} /> Disbursement
        </div>
        <h1 className="text-2xl font-bold">Disbursement Management</h1>
        <p className="text-gray-500 mt-1">
          Disburse approved loans to customers
        </p>
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

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error loading loans:</strong> {error.message || "Please try again later"}
        </div>
      )}

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
        isSubmitting={isPending}
      />
    </div>
  );
}