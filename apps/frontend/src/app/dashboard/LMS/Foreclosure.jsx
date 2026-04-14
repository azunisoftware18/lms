import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  CreditCard,
  User,
  IndianRupee,
  Calendar,
  Percent,
  Calculator,
  FileCheck,
  CheckCircle,
  AlertCircle,
  X,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Clock,
  Banknote,
  Receipt,
  Building,
  Phone,
  Mail,
} from "lucide-react";
import {
  useForecloseSummary,
  useApplyForeclose,
  useApproveForeclose,
  usePayForeclose,
} from "../../../hooks/useForeclose";
import toast from "react-hot-toast";
import ForeClosureTable from "../../../components/tables/ForeClosureTable";
import { useLoanApplications } from "../../../hooks/useLoanApplication";

const PrepaymentForeclosure = () => {
  // State for loan search
  const [searchLoanNumber, setSearchLoanNumber] = useState("");
  const [searchedLoan, setSearchedLoan] = useState(null);
  const [loanStatus, setLoanStatus] = useState("");
  const [showCalculation, setShowCalculation] = useState(false);
  const [foreclosureRecord, setForeclosureRecord] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [paymentDetails, setPaymentDetails] = useState({
    paymentMode: "BANK_TRANSFER",
    settlementReference: "TXN" + Math.floor(Math.random() * 1000000),
  });

  // Fetch loans list for search
  const loanQuery = useLoanApplications({ limit: 100 });
  const loansData = loanQuery?.data;
  const isLoadingLoans = loanQuery?.isLoading;
  const refetchLoans = loanQuery?.refetch;

  // Get the loan number for API calls
  const loanNumber = searchedLoan?.loanNumber;
  const loanId = searchedLoan?.id;

  // Use hooks
  const {
    data: forecloseSummary,
    isLoading: isSummaryLoading,
    refetch: refetchSummary,
    isFetching: isSummaryFetching,
  } = useForecloseSummary(loanId);

  const applyForecloseMut = useApplyForeclose();
  const approveForecloseMut = useApproveForeclose();
  const payForecloseMut = usePayForeclose();

  // Auto-update when summary arrives
  useEffect(() => {
    if (forecloseSummary?.foreClosure) {
      const fc = forecloseSummary.foreClosure;
      setForeclosureRecord(fc);
      setApprovalStatus(fc.approvalStatus);
    } else if (forecloseSummary?.data?.foreClosure) {
      const fc = forecloseSummary.data.foreClosure;
      setForeclosureRecord(fc);
      setApprovalStatus(fc.approvalStatus);
    }
  }, [forecloseSummary]);

  // Format loans for display/search
  const loans = useMemo(() => {
    let list = [];

    if (loansData?.data?.data && Array.isArray(loansData.data.data)) {
      list = loansData.data.data;
    } else if (loansData?.data && Array.isArray(loansData.data)) {
      list = loansData.data;
    } else if (Array.isArray(loansData)) {
      list = loansData;
    } else if (loansData?.data?.items && Array.isArray(loansData.data.items)) {
      list = loansData.data.items;
    }

    if (!Array.isArray(list) || list.length === 0) return [];

    return list.map((loan) => ({
      id: loan.id || loan._id,
      loanNumber: loan.loanNumber || loan.accountNumber,
      customerName:
        loan.customer?.name ||
        loan.customerName ||
        `${loan.customer?.firstName || ""} ${loan.customer?.lastName || ""}`.trim() ||
        "N/A",
      customerEmail: loan.customer?.email || loan.email,
      customerPhone: loan.customer?.phone || loan.phone,
      loanAmount: loan.approvedAmount || loan.requestedAmount || loan.loanAmount || 0,
      bank: loan.customer?.bankName || loan.bankName || "N/A",
      status: loan.status || "pending",
      interestRate: loan.interestRate || 0, 
      tenure: loan.tenure || loan.tenureMonths || 0,
      outstandingBalance: loan.outstandingBalance || loan.approvedAmount || loan.requestedAmount || 0,
      nextEMIDate: loan.nextEmiDate || loan.nextEMIDate || "N/A",
      customerId: loan.customer?.id || loan.customerId,
      emiAmount: loan.emiAmount || 0,
    }));
  }, [loansData]);

  // Handle search loan
  const handleSearchLoan = async () => {
    if (!searchLoanNumber) {
      toast.error("Enter loan account number");
      return;
    }

    const foundLoan = loans.find(
      (loan) => loan.loanNumber?.toLowerCase() === searchLoanNumber.toLowerCase()
    );

    if (!foundLoan) {
      toast.error("Loan account number not found");
      setSearchedLoan(null);
      setLoanStatus(null);
      setShowCalculation(false);
      setForeclosureRecord(null);
      setApprovalStatus(null);
      return;
    }

    setSearchedLoan(foundLoan);
    setLoanStatus(foundLoan.status ?? "");
    setShowCalculation(false);
    setForeclosureRecord(null);
    setApprovalStatus(null);
    
    setTimeout(() => refetchSummary(), 100);
  };

  // Handle apply foreclosure - Step 1: Submit application
  const handleApplyForeclosure = async () => {
    if (!searchedLoan) {
      toast.error("Please search and select a loan first");
      return;
    }

    if (!loanNumber) {
      toast.error("Loan number not available");
      return;
    }

    try {
      const result = await applyForecloseMut.mutateAsync({
        loanNumber: loanNumber,
        data: {}
      });
      
      const responseData = result?.data || result;
      
      if (responseData?.foreClosure || responseData?.data?.foreClosure) {
        const foreClosureData = responseData?.foreClosure || responseData?.data?.foreClosure;
        setForeclosureRecord(foreClosureData);
        setApprovalStatus("PENDING");
        setShowCalculation(true);
        toast.success("Foreclosure application submitted successfully");
        await refetchSummary();
      } else {
        toast.error("Failed to submit foreclosure application");
      }
    } catch (error) {
      console.error("Error applying for foreclosure:", error);
      toast.error(error?.response?.data?.message || error?.message || "Failed to submit foreclosure application");
    }
  };

  // Handle approve foreclosure
  const handleApproveForeclosure = async () => {
    if (!loanNumber) {
      toast.error("Loan number not available");
      return;
    }

    try {
      const result = await approveForecloseMut.mutateAsync({
        loanNumber: loanNumber,
        approve: true,
        rejectionReason: undefined
      });
      
      if (result?.data) {
        setApprovalStatus("APPROVED");
        setForeclosureRecord(prev => ({
          ...prev,
          approvalStatus: "APPROVED",
          foreclosureApprovedBy: result.data.foreclosureApprovedBy || "Admin",
          foreclosureApprovedAt: result.data.foreclosureApprovedAt || new Date().toISOString()
        }));
        toast.success("Foreclosure application approved successfully!");
        setShowApprovalModal(false);
        await refetchSummary();
      }
    } catch (error) {
      console.error("Error approving foreclosure:", error);
      toast.error(error?.response?.data?.message || error?.message || "Failed to approve foreclosure");
    }
  };

  // Handle reject foreclosure
  const handleRejectForeclosure = async () => {
    if (!loanNumber) {
      toast.error("Loan number not available");
      return;
    }

    if (!rejectionReason) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      const result = await approveForecloseMut.mutateAsync({
        loanNumber: loanNumber,
        approve: false,
        rejectionReason: rejectionReason
      });
      
      if (result?.data) {
        setApprovalStatus("REJECTED");
        setForeclosureRecord(prev => ({
          ...prev,
          approvalStatus: "REJECTED",
          reason: rejectionReason
        }));
        toast.error("Foreclosure application rejected");
        setShowApprovalModal(false);
        setRejectionReason("");
        await refetchSummary();
      }
    } catch (error) {
      console.error("Error rejecting foreclosure:", error);
      toast.error(error?.response?.data?.message || error?.message || "Failed to reject foreclosure");
    }
  };

  // Handle confirm foreclosure payment - Step 3: Pay and close
  const handleConfirmForeclosure = async () => {
    if (!searchedLoan) {
      toast.error("Loan not found");
      return;
    }

    if (approvalStatus !== "APPROVED") {
      toast.error("Foreclosure application must be approved before payment");
      return;
    }

    const summaryData = forecloseSummary?.data || forecloseSummary || {};
    const totalPayable = summaryData.totalPayable;

    if (!totalPayable || Number(totalPayable) <= 0) {
      toast.error("Invalid payable amount");
      return;
    }

    try {
      const payload = {
        amountPaid: Number(totalPayable),
        paymentMode: paymentDetails.paymentMode,
        settlementReference: paymentDetails.settlementReference,
        receiptUrl: ""
      };
      
      const result = await payForecloseMut.mutateAsync({
        loanNumber: loanNumber,
        data: payload 
      });
      
      if (result?.data) {
        toast.success("Loan foreclosed successfully!");
        await refetchLoans();
        await refetchSummary();
        
        setLoanStatus("closed");
        setSearchedLoan(prev => ({ ...prev, status: "closed" }));
        setApprovalStatus(null);
        setForeclosureRecord(null);
        setShowCalculation(false);
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || err?.message || "Failed to process foreclosure");
    }
  };

  // Get summary data from API response
  const summaryData = forecloseSummary?.data || forecloseSummary || {};
  
  const activeLoansCount = useMemo(() => {
    if (!Array.isArray(loans)) return 0;
    return loans.filter((l) =>
      ["active", "ACTIVE", "approved", "Approved", "running", "RUNNING", "FORECLOSURE_PENDING"].includes((l.status || "").toString())
    ).length;
  }, [loans]);

  const displayLoanStatus = (loanStatus?.toUpperCase() || "NOT SELECTED").replace(/_/g, " ");
  const displayOutstanding = Number(searchedLoan?.outstandingBalance || 0);
  const isCalculating = isSummaryLoading || isSummaryFetching;

  const getForeclosureStep = () => {
    if (!searchedLoan) return null;
    if (loanStatus === "CLOSED" || loanStatus === "closed") return "closed";
    if (!showCalculation) return "apply";
    if (!foreclosureRecord) return "apply";
    if (approvalStatus === "PENDING") return "approve";
    if (approvalStatus === "APPROVED") return "pay";
    if (approvalStatus === "REJECTED") return "rejected";
    return "apply";
  };

  const currentStep = getForeclosureStep();

  // Approval Modal Component
  const ApprovalModal = () => {
    const [localRejectionReason, setLocalRejectionReason] = useState("");
    const [showRejectConfirm, setShowRejectConfirm] = useState(false);

    if (!showApprovalModal) return null;

    const handleRejectClick = () => {
      if (!localRejectionReason.trim()) {
        toast.error("Please provide a reason for rejection");
        return;
      }
      setRejectionReason(localRejectionReason);
      setShowRejectConfirm(true);
    };

    const confirmReject = async () => {
      setShowRejectConfirm(false);
      await handleRejectForeclosure();
    };

    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowApprovalModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Review Foreclosure Application</h2>
                  <p className="text-sm text-slate-500">Please review all details before making a decision</p>
                </div>
              </div>
              <button
                onClick={() => setShowApprovalModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Full Name</p>
                      <p className="font-medium text-slate-800">{searchedLoan?.customerName}</p>
                    </div>
                  </div>
                  {searchedLoan?.customerEmail && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500">Email</p>
                        <p className="font-medium text-slate-800">{searchedLoan.customerEmail}</p>
                      </div>
                    </div>
                  )}
                  {searchedLoan?.customerPhone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500">Phone</p>
                        <p className="font-medium text-slate-800">{searchedLoan.customerPhone}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Building className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Bank</p>
                      <p className="font-medium text-slate-800">{searchedLoan?.bank}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loan Information */}
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Loan Information
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Loan Number</p>
                    <p className="font-semibold text-slate-800">{searchedLoan?.loanNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Loan Amount</p>
                    <p className="font-semibold text-slate-800">₹{searchedLoan?.loanAmount?.toLocaleString("en-IN")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Interest Rate</p>
                    <p className="font-semibold text-slate-800">{searchedLoan?.interestRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Tenure</p>
                    <p className="font-semibold text-slate-800">{searchedLoan?.tenure} months</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Monthly EMI</p>
                    <p className="font-semibold text-slate-800">₹{searchedLoan?.emiAmount?.toLocaleString("en-IN") || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Outstanding Balance</p>
                    <p className="font-semibold text-orange-600">₹{displayOutstanding.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              </div>

              {/* Foreclosure Calculation */}
              <div className="bg-slate-50 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  Foreclosure Calculation Breakdown
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-slate-600">Remaining Principal</span>
                    <span className="font-medium">₹{(summaryData.remainingPrincipal || 0).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-slate-600">Accrued Interest</span>
                    <span className="font-medium">₹{(summaryData.accruedInterest || 0).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-slate-600">Foreclosure Charges</span>
                    <span className="font-medium text-orange-600">₹{(summaryData.foreclosureCharges || 0).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-slate-600">Unpaid EMI Charges</span>
                    <span className="font-medium">₹{(summaryData.unpaidEmiCharges || 0).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 mt-2 border-t-2 border-slate-300">
                    <span className="font-bold text-slate-800 text-lg">Total Payable Amount</span>
                    <span className="text-2xl font-bold text-blue-600">₹{(summaryData.totalPayable || 0).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Application Timeline */}
              {foreclosureRecord && (
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Application Timeline
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Applied On:</span>
                      <span className="font-medium">{new Date(foreclosureRecord.appliedAt).toLocaleString()}</span>
                    </div>
                    {foreclosureRecord.foreclosureApprovedAt && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Approved On:</span>
                        <span className="font-medium text-green-600">{new Date(foreclosureRecord.foreclosureApprovedAt).toLocaleString()}</span>
                      </div>
                    )}
                    {foreclosureRecord.foreclosureApprovedBy && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Approved By:</span>
                        <span className="font-medium">{foreclosureRecord.foreclosureApprovedBy}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Rejection Reason Input */}
              <div className="border-t border-slate-200 pt-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Rejection Reason (if rejecting)
                </label>
                <textarea
                  value={localRejectionReason}
                  onChange={(e) => setLocalRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejection..."
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleApproveForeclosure}
                  disabled={approveForecloseMut.isLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  <ThumbsUp className="w-5 h-5" />
                  {approveForecloseMut.isLoading ? "Processing..." : "Approve Foreclosure"}
                </button>
                <button
                  onClick={handleRejectClick}
                  disabled={approveForecloseMut.isLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  <ThumbsDown className="w-5 h-5" />
                  {approveForecloseMut.isLoading ? "Processing..." : "Reject Foreclosure"}
                </button>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span><strong>Important Note:</strong> Please verify all customer details and loan information before approving. This action will initiate the foreclosure process and cannot be reversed.</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rejection Confirmation Modal */}
        {showRejectConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Confirm Rejection</h3>
                <p className="text-slate-600 mb-4">
                  Are you sure you want to reject this foreclosure application?
                </p>
                <p className="text-sm text-red-600 mb-6 bg-red-50 p-3 rounded-lg">
                  Reason: {localRejectionReason}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRejectConfirm(false)}
                    className="flex-1 px-4 py-2 border-2 border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmReject}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen p-4 md:p-6">
      {/* Approval Modal */}
      <ApprovalModal />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-600 rounded-xl">
            <Banknote className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Foreclosure Management</h1>
        </div>
        <p className="text-slate-600 ml-12">Apply for loan foreclosure, review applications, and process payments</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">Loan Status</p>
              <p className="text-2xl font-bold text-slate-800">
                {searchedLoan ? displayLoanStatus : `${activeLoansCount} Active`}
              </p>
              <p className="text-xs text-slate-400 mt-1">{searchedLoan ? "Current lifecycle state" : "Active loans available"}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileCheck className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">Outstanding Balance</p>
              <p className="text-2xl font-bold text-slate-800">₹{displayOutstanding.toLocaleString("en-IN")}</p>
              <p className="text-xs text-slate-400 mt-1">{searchedLoan ? "Pending amount to settle" : "No loan selected"}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-xl">
              <IndianRupee className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">Foreclosure Status</p>
              <p className="text-2xl font-bold text-slate-800">
                {approvalStatus === "APPROVED" ? "Approved" :
                 approvalStatus === "PENDING" ? "Pending" :
                 approvalStatus === "REJECTED" ? "Rejected" :
                 showCalculation ? "Calculated" : "Not Started"}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {approvalStatus === "APPROVED" ? "Ready for payment" :
                 approvalStatus === "PENDING" ? "Waiting for approval" :
                 approvalStatus === "REJECTED" ? "Application rejected" :
                 showCalculation ? "Application submitted" : "Click Apply to start"}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${
              approvalStatus === "APPROVED" ? "bg-green-100" :
              approvalStatus === "PENDING" ? "bg-amber-100" :
              approvalStatus === "REJECTED" ? "bg-red-100" : "bg-purple-100"
            }`}>
              <Calculator className={`w-6 h-6 ${
                approvalStatus === "APPROVED" ? "text-green-600" :
                approvalStatus === "PENDING" ? "text-amber-600" :
                approvalStatus === "REJECTED" ? "text-red-600" : "text-purple-600"
              }`} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">Current Step</p>
              <p className="text-2xl font-bold text-slate-800">
                {currentStep === "closed" ? "Closed" :
                 currentStep === "pay" ? "Payment" :
                 currentStep === "approve" ? "Approval" :
                 currentStep === "apply" ? "Application" : "Ready"}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {currentStep === "closed" ? "Loan settled" :
                 currentStep === "pay" ? "Complete payment" :
                 currentStep === "approve" ? "Under review" :
                 currentStep === "apply" ? "Start process" : "Search loan"}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Loan Search Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Loan Account Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchLoanNumber}
                onChange={(e) => setSearchLoanNumber(e.target.value)}
                placeholder="Enter loan account number"
                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                onKeyPress={(e) => e.key === "Enter" && handleSearchLoan()}
              />
            </div>
          </div>
          <button
            onClick={handleSearchLoan}
            disabled={isLoadingLoans}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 disabled:opacity-50 font-semibold"
          >
            <Search className="w-5 h-5" />
            {isLoadingLoans ? "Searching..." : "Search Loan"}
          </button>
        </div>
      </div>

      {/* Loan Summary */}
      {searchedLoan && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Loan Summary</h2>
                <p className="text-sm text-slate-500">Complete loan details</p>
              </div>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                loanStatus === "ACTIVE" || loanStatus === "active" || loanStatus === "approved"
                  ? "bg-green-100 text-green-700"
                  : loanStatus === "CLOSED" || loanStatus === "closed" || loanStatus === "settled"
                  ? "bg-gray-100 text-gray-700"
                  : loanStatus === "FORECLOSURE_PENDING"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {displayLoanStatus}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-slate-500">Loan Number</p>
                <p className="font-semibold text-slate-800">{searchedLoan.loanNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <User className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-slate-500">Customer Name</p>
                <p className="font-semibold text-slate-800">{searchedLoan.customerName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <IndianRupee className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-slate-500">Loan Amount</p>
                <p className="font-semibold text-slate-800">
                  ₹{typeof searchedLoan.loanAmount === "number"
                    ? searchedLoan.loanAmount.toLocaleString()
                    : searchedLoan.loanAmount}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <Percent className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-slate-500">Interest Rate</p>
                <p className="font-semibold text-slate-800">{searchedLoan.interestRate}% p.a.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Foreclosure Process Section */}
      {searchedLoan && loanStatus !== "CLOSED" && loanStatus !== "closed" && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Calculator className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Foreclosure Process</h2>
              <p className="text-sm text-slate-500">Follow the steps to complete foreclosure</p>
            </div>
          </div>

          {/* Step Indicator */}
          {showCalculation && (
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {["Apply", "Approve", "Pay"].map((step, index) => {
                  const stepKey = step.toLowerCase();
                  const isCompleted = 
                    stepKey === "apply" && (currentStep === "approve" || currentStep === "pay" || currentStep === "closed") ||
                    stepKey === "approve" && (currentStep === "pay" || currentStep === "closed") ||
                    stepKey === "pay" && currentStep === "closed";
                  const isCurrent = 
                    stepKey === "apply" && currentStep === "apply" ||
                    stepKey === "approve" && currentStep === "approve" ||
                    stepKey === "pay" && currentStep === "pay";
                  
                  return (
                    <div key={step} className="flex-1 text-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 transition-all ${
                        isCompleted ? "bg-green-600 text-white" :
                        isCurrent ? "bg-blue-600 text-white ring-4 ring-blue-200" :
                        "bg-gray-200 text-gray-600"
                      }`}>
                        {isCompleted ? <CheckCircle className="w-6 h-6" /> : index + 1}
                      </div>
                      <p className={`text-sm font-semibold ${
                        isCurrent ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-500"
                      }`}>{step}</p>
                    </div>
                  );
                })}
              </div>
              <div className="relative mt-2">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-full"></div>
                <div className={`absolute top-0 left-0 h-1 bg-green-600 rounded-full transition-all duration-500 ${
                  currentStep === "approve" ? "w-1/2" :
                  currentStep === "pay" ? "w-2/3" :
                  currentStep === "closed" ? "w-full" : "w-0"
                }`}></div>
              </div>
            </div>
          )}

          {/* Step 1: Apply for Foreclosure */}
          {currentStep === "apply" && (
            <div className="text-center py-12">
              <div className="mb-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Ready to Apply?</h3>
                <p className="text-slate-600">Submit application to calculate foreclosure amount</p>
              </div>
              <button
                onClick={handleApplyForeclosure}
                disabled={applyForecloseMut.isLoading || isCalculating}
                className={`inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl transition-all transform hover:scale-105 font-semibold text-lg ${
                  applyForecloseMut.isLoading || isCalculating
                    ? "bg-blue-400 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                }`}
              >
                <Calculator className="w-5 h-5" />
                {applyForecloseMut.isLoading ? "Submitting Application..." : "Apply for Foreclosure"}
              </button>
            </div>
          )}

          {/* Step 2: Awaiting Approval */}
          {currentStep === "approve" && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-800 mb-1">Awaiting Approval</h3>
                    <p className="text-sm text-amber-700">
                      Your foreclosure application has been submitted and is pending approval.
                      An authorized approver needs to review and approve this request.
                    </p>
                    {foreclosureRecord && (
                      <div className="mt-3 text-xs text-amber-600">
                        Applied on: {new Date(foreclosureRecord.appliedAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Review & Approve Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => setShowApprovalModal(true)}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 font-semibold text-lg shadow-lg"
                >
                  <Eye className="w-5 h-5" />
                  Review & Approve Application
                </button>
              </div>

              {/* Show calculation summary */}
              {summaryData?.totalPayable && (
                <div className="mt-6 p-6 bg-slate-50 rounded-xl">
                  <h3 className="font-semibold text-slate-800 mb-4">Foreclosure Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2">
                      <span className="text-slate-600">Remaining Principal</span>
                      <span className="font-medium">₹{(summaryData.remainingPrincipal || 0).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between py-2 border-t border-slate-200">
                      <span className="text-slate-600">Accrued Interest</span>
                      <span className="font-medium">₹{(summaryData.accruedInterest || 0).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between py-2 border-t border-slate-200">
                      <span className="text-slate-600">Foreclosure Charges</span>
                      <span className="font-medium text-orange-600">₹{(summaryData.foreclosureCharges || 0).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between py-2 border-t border-slate-200">
                      <span className="text-slate-600">Unpaid EMI Charges</span>
                      <span className="font-medium">₹{(summaryData.unpaidEmiCharges || 0).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between py-3 mt-2 border-t-2 border-slate-300 bg-blue-50 -mx-6 px-6 rounded-b-xl">
                      <span className="font-bold text-slate-800">Total Payable</span>
                      <span className="text-xl font-bold text-blue-600">₹{(summaryData.totalPayable || 0).toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Approved - Ready for Payment */}
          {currentStep === "pay" && summaryData?.totalPayable && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-800 mb-1">Application Approved</h3>
                    <p className="text-sm text-green-700">
                      Your foreclosure application has been approved. You can now proceed with payment.
                    </p>
                    {foreclosureRecord?.foreclosureApprovedAt && (
                      <div className="mt-2 text-xs text-green-600">
                        Approved on: {new Date(foreclosureRecord.foreclosureApprovedAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="font-semibold text-slate-800 mb-4">Payment Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600">Remaining Principal</span>
                    <span className="font-medium">₹{(summaryData.remainingPrincipal || 0).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-slate-200">
                    <span className="text-slate-600">Accrued Interest</span>
                    <span className="font-medium">₹{(summaryData.accruedInterest || 0).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-slate-200">
                    <span className="text-slate-600">Foreclosure Charges</span>
                    <span className="font-medium text-orange-600">₹{(summaryData.foreclosureCharges || 0).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-slate-200">
                    <span className="text-slate-600">Unpaid EMI Charges</span>
                    <span className="font-medium">₹{(summaryData.unpaidEmiCharges || 0).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between py-3 mt-2 border-t-2 border-slate-300 bg-blue-100 -mx-6 px-6 rounded-b-xl">
                    <span className="font-bold text-slate-800 text-lg">Total Payable Amount</span>
                    <span className="text-2xl font-bold text-blue-600">₹{(summaryData.totalPayable || 0).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-green-600" />
                  Payment Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Payment Mode
                    </label>
                    <select
                      value={paymentDetails.paymentMode}
                      onChange={(e) => setPaymentDetails({...paymentDetails, paymentMode: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="BANK_TRANSFER">🏦 Bank Transfer</option>
                      <option value="UPI">📱 UPI</option>
                      <option value="CARD">💳 Debit/Credit Card</option>
                      <option value="CASH">💰 Cash</option>
                      <option value="CHEQUE">📝 Cheque</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Settlement Reference
                    </label>
                    <input
                      type="text"
                      value={paymentDetails.settlementReference}
                      onChange={(e) => setPaymentDetails({...paymentDetails, settlementReference: e.target.value})}
                      placeholder="Enter transaction reference"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-blue-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Amount to Pay: <strong className="text-lg">₹{(summaryData.totalPayable || 0).toLocaleString("en-IN")}</strong>
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleConfirmForeclosure}
                    disabled={payForecloseMut.isLoading}
                    className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all transform hover:scale-105 disabled:opacity-50 font-semibold"
                  >
                    <CheckCircle className="w-5 h-5" />
                    {payForecloseMut.isLoading ? "Processing Payment..." : "Confirm & Pay"}
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowCalculation(false);
                      setForeclosureRecord(null);
                      setApprovalStatus(null);
                    }}
                    className="px-8 py-3 border-2 border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Rejected State */}
          {currentStep === "rejected" && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-red-800 mb-2">Application Rejected</h3>
              <p className="text-red-600 mb-4">
                Your foreclosure application has been rejected.
                {foreclosureRecord?.reason && (
                  <span className="block mt-2 text-sm">Reason: {foreclosureRecord.reason}</span>
                )}
              </p>
              <button
                onClick={() => {
                  setShowCalculation(false);
                  setForeclosureRecord(null);
                  setApprovalStatus(null);
                }}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
              >
                Start Over
              </button>
            </div>
          )}

          {/* Loading State */}
          {showCalculation && isCalculating && !foreclosureRecord && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Calculating foreclosure amount...</p>
            </div>
          )}
        </div>
      )}

      {/* Closed Loan Message */}
      {searchedLoan && (loanStatus === "CLOSED" || loanStatus === "closed") && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-green-800 mb-2">Loan Closed Successfully</h3>
          <p className="text-green-600">
            This loan has been fully settled and closed. No further actions required.
          </p>
        </div>
      )}

      {/* Transaction History Table */}
      <div className="mt-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Receipt className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Recent Loan Applications</h3>
        </div>
        <ForeClosureTable data={loans} />
      </div>
    </div>
  );
};

export default PrepaymentForeclosure;