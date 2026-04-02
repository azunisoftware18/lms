import React, { useState, useEffect, useMemo } from "react";
import {
  Clock,
  CreditCard,
  X,
  Building,
  Send,
  Shield,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

// External Component Import
import Button from "../../../components/ui/Button";
import SearchField from "../../../components/ui/SearchField";
import InputField from "../../../components/ui/InputField";
import SelectField from "../../../components/ui/SelectField";
import DisbursementManagementTable from "../../../components/tables/DisbursementManagementTable";

// Utilities
import { colorVariables } from "../../../lib/index";
import { apiGet } from "../../../lib/api/apiClient";
import { normalizeParams } from "../../../lib/utils/paramHelper";

// Import hooks
import { useDisbursement } from "../../../hooks/useDisbursement";
import { useLoanApplication } from "../../../hooks/useLoanApplication";

// Define useLoanApplicationsList hook locally for list
const useLoanApplicationsList = (params = {}) => {
  const normalizedParams = normalizeParams(params);

  return useQuery({
    queryKey: ["loanApplications", normalizedParams],
    queryFn: () => apiGet(`/loan-applications`, { params: normalizedParams }),
    keepPreviousData: true,
  });
};

export default function DisbursementManagementPage() {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [selectedDV, setSelectedDV] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- DATA STATES for Disbursements ---
  const [approvedDVs, setApprovedDVs] = useState([]);
  const [paidDVs, setPaidDVs] = useState([]);
  const [disbursementLoading, setDisbursementLoading] = useState(false);

  const [dvForm, setDvForm] = useState({
    date: new Date().toISOString().split("T")[0],
    mode: "NEFT",
  });

  // --- USE LOAN APPLICATIONS HOOK (List) ---
  const {
    data: loanApplicationsData,
    isLoading: loansLoading,
    refetch: refetchLoans,
  } = useLoanApplicationsList({ 
    status: "approved",
    limit: 100 
  });

  // --- USE LOAN APPLICATION HOOK (Individual) ---
  const {
    data: individualLoanData,
    isLoading: individualLoanLoading,
    refetch: refetchIndividualLoan,
  } = useLoanApplication(selectedLoanId);

  // Extract pending loans from API response
  const pendingLoans = useMemo(() => {
    let loans = [];
    
    if (loanApplicationsData?.data?.data) {
      loans = loanApplicationsData.data.data;
    } else if (loanApplicationsData?.data) {
      loans = loanApplicationsData.data;
    } else if (Array.isArray(loanApplicationsData)) {
      loans = loanApplicationsData;
    }
    
    if (!Array.isArray(loans)) return [];
    
    return loans
      .filter(loan => loan.status === "approved")
      .map(loan => ({
        id: loan.id,
        loanId: loan.loanNumber,
        customer: loan.customer?.name || `${loan.customer?.firstName || ''} ${loan.customer?.lastName || ''}`.trim(),
        customerId: loan.customer?.id,
        amount: loan.approvedAmount || loan.requestedAmount,
        requestedAmount: loan.requestedAmount,
        approvedAmount: loan.approvedAmount,
        type: loan.loanPurpose?.replace(/_/g, ' ') || loan.loanType?.name,
        approvedDate: loan.updatedAt ? new Date(loan.updatedAt).toLocaleDateString() : new Date(loan.createdAt).toLocaleDateString(),
        bank: loan.customer?.bankName || "Not Provided",
        acc: loan.customer?.accountNumber || "N/A",
        ifsc: loan.customer?.ifscCode || "N/A",
        tenureMonths: loan.tenureMonths,
        loanNumber: loan.loanNumber,
        status: loan.status,
      }));
  }, [loanApplicationsData]);

  // Update selected loan details when individual loan data is fetched
  useEffect(() => {
    if (individualLoanData && selectedLoanId) {
      const loan = individualLoanData;
      setSelectedLoan({
        id: loan.id,
        loanId: loan.loanNumber,
        customer: loan.customer?.name || `${loan.customer?.firstName || ''} ${loan.customer?.lastName || ''}`.trim(),
        customerId: loan.customer?.id,
        amount: loan.approvedAmount || loan.requestedAmount,
        requestedAmount: loan.requestedAmount,
        approvedAmount: loan.approvedAmount,
        type: loan.loanPurpose?.replace(/_/g, ' ') || loan.loanType?.name,
        approvedDate: loan.updatedAt ? new Date(loan.updatedAt).toLocaleDateString() : new Date(loan.createdAt).toLocaleDateString(),
        bank: loan.customer?.bankName || "Not Provided",
        acc: loan.customer?.accountNumber || "N/A",
        ifsc: loan.customer?.ifscCode || "N/A",
        tenureMonths: loan.tenureMonths,
        loanNumber: loan.loanNumber,
        status: loan.status,
      });
    }
  }, [individualLoanData, selectedLoanId]);

  // --- USE DISBURSEMENT HOOK ---
  const { mutate: disburseLoan, isLoading: isDisbursing } = useDisbursement();

  // --- DISBURSEMENT API CALLS ---
  const fetchDisbursements = async () => {
  setDisbursementLoading(true);
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "http://localhost:4000/api/disbursements", // ✅ FIXED URL
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "", // ✅ safe token
        },
      }
    );

    let disbursementsData = [];
    if (response.data?.data?.data) {
      disbursementsData = response.data.data.data;
    } else if (response.data?.data) {
      disbursementsData = response.data.data;
    } else if (Array.isArray(response.data)) {
      disbursementsData = response.data;
    }

    const approved = disbursementsData.filter(
      (dv) => dv.status === "approved"
    );
    const paid = disbursementsData.filter(
      (dv) => dv.status === "paid"
    );

    setApprovedDVs(approved);
    setPaidDVs(paid);
  } catch (error) {
    console.error("Error fetching disbursements:", error);
    setApprovedDVs([]);
    setPaidDVs([]);
  } finally {
    setDisbursementLoading(false);
  }
  };

  // Load data on component mount
  useEffect(() => {
    fetchDisbursements();
  }, []);

  // Refresh data after successful disbursement
  const refreshData = () => {
    refetchLoans();
    fetchDisbursements();
  };

  // --- SAFE FILTER FUNCTION ---
  const filterData = (data, searchFields) => {
    if (!Array.isArray(data)) return [];
    if (!searchQuery) return data;
    
    return data.filter(item => {
      return searchFields.some(field => {
        const value = item[field];
        return value && value.toString().toLowerCase().includes(searchQuery.toLowerCase());
      });
    });
  };

  // --- SIMPLIFIED TAB MAPPING ---
  const tabData = {
    pending: {
      title: "Pending Loans (Approved)",
      data: filterData(pendingLoans, ['customer', 'loanId', 'id', 'loanNumber']),
      icon: <Clock size={18} />,
      color: "orange",
    },
    approved: {
      title: "Approved for Payment",
      data: filterData(approvedDVs, ['customer', 'dvNo', 'loanId']),
      icon: <Shield size={18} />,
      color: "blue",
    },
    paid: {
      title: "Paid Vouchers",
      data: filterData(paidDVs, ['customer', 'dvNo', 'loanId']),
      icon: <CreditCard size={18} />,
      color: "green",
    },
  };

  // --- DISBURSEMENT ACTIONS ---
  const handleCreateDV = (loan) => {
    setSelectedLoan(loan);
    setShowCreateModal(true);
  };

  const submitCreateDV = () => {
    if (!selectedLoan) return;
    
    // Generate a unique transaction reference
    const transactionRef = `${dvForm.mode.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    
    // Payload matching your backend schema
    const payload = {
      disbursementMode: dvForm.mode, // NEFT, IMPS, RTGS, UPI
      transactionReference: transactionRef,
      remarks: `Loan disbursement for ${selectedLoan.customer} - Amount: ₹${(selectedLoan.approvedAmount || selectedLoan.amount).toLocaleString()}`,
    };

    console.log("Sending disbursement payload:", payload);

    disburseLoan(
      {
        loanId: selectedLoan.id,
        payload: payload,
      },
      {
        onSuccess: (data) => {
          console.log("Disbursement successful:", data);
          refreshData();
          setShowCreateModal(false);
          setActiveTab("approved");
          setCurrentPage(1);
          setDvForm({
            date: new Date().toISOString().split("T")[0],
            mode: "NEFT",
          });
          alert(`Disbursement created successfully! Transaction ID: ${data?.data?.transactionReference || transactionRef}`);
        },
        onError: (error) => {
          console.error("Failed to create disbursement:", error);
          const errorMessage = error?.response?.data?.message || error?.message || "Failed to create disbursement. Please try again.";
          alert(errorMessage);
        },
      }
    );
  };

  const handlePayNow = async (dv) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `http://localhost:4000/api/disbursements/${dv.dvNo}/pay`, // ✅ FIXED URL
      {
        status: "paid",
        paymentDate: new Date().toISOString(),
      },
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "", // ✅ safe token
        },
      }
    );

    if (response.data.success) {
      refreshData();
      alert(
        `Payment of ₹${dv.amount.toLocaleString()} initiated for ${dv.customer}`
      );
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    alert("Failed to process payment. Please try again.");
  }
};

  const handleViewDetails = (item) => {
    if (activeTab === "pending") {
      setSelectedLoanId(item.id);
      refetchIndividualLoan();
      setShowDetailsModal(true);
    } else {
      setSelectedDV(item);
      setShowDetailsModal(true);
    }
  };

  // --- PAGINATION ---
  const currentTab = tabData[activeTab];
  const totalItems = currentTab.data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPageData = currentTab.data.slice(startIndex, startIndex + itemsPerPage);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
    setSearchQuery("");
    if (tabId === "pending") {
      refetchLoans();
    } else {
      fetchDisbursements();
    }
  };

  const isLoading = loansLoading || disbursementLoading || individualLoanLoading;
  
  if (isLoading && pendingLoans.length === 0 && approvedDVs.length === 0 && paidDVs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading approved loans and disbursements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      {/* HEADER */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
          <span>Admin</span>
          <ChevronRight size={14} />
          <span className={colorVariables.PRIMARY_COLOR}>Disbursement</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Disbursement</h1>
        <p className="text-gray-500 mt-1">Manage loan payments to approved customers</p>
      </div>

      {/* TABS */}
      <div className="flex gap-1 mb-6 bg-white p-1 rounded-xl border border-gray-200 shadow-sm w-fit flex-wrap">
        {Object.entries(tabData).map(([key, tab]) => (
          <button
            key={key}
            onClick={() => handleTabChange(key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === key
                ? `${colorVariables.LIGHT_BG} ${colorVariables.PRIMARY_COLOR} border border-blue-100 shadow-sm`
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            {tab.icon}
            {tab.title}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === key
                  ? `bg-blue-100 ${colorVariables.PRIMARY_COLOR}`
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {tab.data.length}
            </span>
          </button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* SEARCH BAR */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <div>
            <h2 className="font-bold text-gray-800">{currentTab.title}</h2>
            <p className="text-sm text-gray-500">
              {totalItems === 0
                ? "No approved loans pending disbursement"
                : `Showing ${totalItems} loan${totalItems !== 1 ? "s" : ""}`}
            </p>
          </div>
          <div className="w-full sm:w-64">
            <SearchField
              value={searchQuery}
              placeholder="Search by Name or Loan ID"
              showResults={false}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              onClear={() => {
                setSearchQuery("");
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <DisbursementManagementTable
          data={currentPageData}
          activeTab={activeTab}
          loading={isLoading}
          onViewDetails={handleViewDetails}
          onDisburse={handleCreateDV}
          onPayNow={handlePayNow}
          onPrint={() => window.print()}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* MODAL: CREATE DISBURSEMENT */}
      {showCreateModal && selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-5 border-b flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Create Disbursement</h3>
                <p className="text-sm text-gray-500">Send payment to approved customer</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="hover:bg-gray-100 p-1 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className={`p-5 space-y-3 ${colorVariables.LIGHT_BG} m-4 rounded-lg`}>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Customer:</span>
                <span className="font-medium">{selectedLoan.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Loan ID:</span>
                <span className={`font-mono ${colorVariables.PRIMARY_COLOR}`}>
                  {selectedLoan.loanNumber || selectedLoan.loanId || selectedLoan.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Approved Amount:</span>
                <span className="font-bold text-lg">
                  &#8377;{(selectedLoan.approvedAmount || selectedLoan.amount).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Tenure:</span>
                <span className="font-medium">{selectedLoan.tenureMonths} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Bank:</span>
                <span className="font-medium">{selectedLoan.bank}</span>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Disbursement Date</label>
                <InputField
                  type="date"
                  value={dvForm.date}
                  onChange={(e) => setDvForm({ ...dvForm, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <SelectField
                  value={dvForm.mode}
                  onChange={(value) => setDvForm({ ...dvForm, mode: value })}
                  options={[
                    { label: "NEFT", value: "NEFT" },
                    { label: "IMPS", value: "IMPS" },
                    { label: "RTGS", value: "RTGS" },
                    { label: "UPI", value: "UPI" },
                  ]}
                  placeholder="Select payment method"
                />
              </div>
            </div>

            <div className="p-5 border-t flex justify-end gap-3">
              <Button onClick={() => setShowCreateModal(false)} className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50" disabled={isDisbursing}>
                Cancel
              </Button>
              <Button onClick={submitCreateDV} className={`px-5 py-2.5 ${colorVariables.PRIMARY_BUTTON_COLOR} text-white`} disabled={isDisbursing}>
                {isDisbursing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Generate Payment
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VIEW DETAILS */}
      {(showDetailsModal && (selectedLoan || selectedDV)) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-5 border-b flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">
                  {activeTab === "pending" ? "Approved Loan Details" : "Disbursement Details"}
                </h3>
                <p className="text-sm text-gray-500">
                  {activeTab === "pending" 
                    ? (selectedLoan?.loanNumber || selectedLoan?.loanId || selectedLoan?.id)
                    : selectedDV?.dvNo}
                </p>
              </div>
              <button onClick={() => {
                setShowDetailsModal(false);
                setSelectedLoanId(null);
                setSelectedLoan(null);
              }} className="hover:bg-gray-100 p-1 rounded-lg">
                <X size={20} />
              </button>
            </div>

            {individualLoanLoading && activeTab === "pending" ? (
              <div className="p-10 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading loan details...</p>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-medium">{activeTab === "pending" ? selectedLoan?.customer : selectedDV?.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Loan Type/Purpose</p>
                    <p className="font-medium">{activeTab === "pending" ? selectedLoan?.type : selectedDV?.loanType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="font-bold">&#8377;{(activeTab === "pending" ? (selectedLoan?.approvedAmount || selectedLoan?.amount) : selectedDV?.amount).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{activeTab === "pending" ? "Approved Date" : "Disbursement Date"}</p>
                    <p className="font-medium">{activeTab === "pending" ? selectedLoan?.approvedDate : selectedDV?.disbursementDate}</p>
                  </div>
                  {activeTab === "pending" && selectedLoan?.tenureMonths && (
                    <div>
                      <p className="text-sm text-gray-500">Tenure</p>
                      <p className="font-medium">{selectedLoan.tenureMonths} months</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Building size={16} /> Bank Details
                  </h4>
                  <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Bank:</span>
                      <span className="font-medium">{activeTab === "pending" ? selectedLoan?.bank : selectedDV?.bank}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Account:</span>
                      <span className="font-mono">{activeTab === "pending" ? (selectedLoan?.accountNumber || selectedLoan?.acc) : selectedDV?.accountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">IFSC:</span>
                      <span className="font-mono">{activeTab === "pending" ? selectedLoan?.ifsc : selectedDV?.ifsc}</span>
                    </div>
                  </div>
                </div>

                {activeTab !== "pending" && selectedDV?.transactionId && (
                  <div className="pt-2">
                    <p className="text-sm text-gray-500">Transaction ID</p>
                    <p className="font-mono text-sm">{selectedDV.transactionId}</p>
                  </div>
                )}
              </div>
            )}

            <div className="p-5 border-t">
              <Button onClick={() => {
                setShowDetailsModal(false);
                setSelectedLoanId(null);
                setSelectedLoan(null);
              }} className={`w-full py-2.5 ${colorVariables.PRIMARY_BUTTON_COLOR} text-white`}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}