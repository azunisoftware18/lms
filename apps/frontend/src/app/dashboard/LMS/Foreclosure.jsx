import React, { useState, useMemo } from "react";
import {
  Search,
  CreditCard,
  User,
  IndianRupee,
  Calendar,
  Percent,
  Calculator,
  TrendingUp,
  FileText,
  CheckCircle,
  FileCheck,
  Download,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import {
  useGetForecloseSummary,
  usePayForecloseLoan,
} from "../../../hooks/useEmi";
import toast from "react-hot-toast";
import ForeClosureTable from "../../../components/tables/ForeClosureTable";
import { useSettlementsByLoan } from "../../../hooks/useSettlements";
import { useLoanApplications } from "../../../hooks/useLoanApplication";
import StatusCard from "../../../components/common/StatusCard";

const PrepaymentForeclosure = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState("prepayment");

  // State for loan search
  const [searchLoanNumber, setSearchLoanNumber] = useState("");
  const [searchedLoan, setSearchedLoan] = useState(null);

  // State for prepayment form
  const [prepaymentData, setPrepaymentData] = useState({
    amount: "",
    charges: "2.5",
    applyCharges: true,
  });

  // State for prepayment calculation results
  const [prepaymentResults, setPrepaymentResults] = useState({
    updatedBalance: "",
    newEmi: "",
    remainingTenure: "",
  });

  // State for foreclosure calculation
  const [foreclosureData, setForeclosureData] = useState({
    outstandingPrincipal: "",
    accruedInterest: "",
    foreclosureCharges: "",
    totalPayable: "",
  });

  // State for confirmation
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [transactionRef, setTransactionRef] = useState("");
  const [loanStatus, setLoanStatus] = useState("");

  // State for transaction history
  const [transactionHistory, setTransactionHistory] = useState([]);

  // Use the actual useLoanApplications hook
  const loanQuery = useLoanApplications({ limit: 100 });

  const loansData = loanQuery?.data;
  const isLoadingLoans = loanQuery?.isLoading;
  const refetchLoans = loanQuery?.refetch;

  // Format loans for display/search - FIXED: Handle nested data structure
  const loans = useMemo(() => {
    // Try different possible data structures
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
      id: loan.id || loan._id || loan.loanNumber || loan.loanId,
      loanNumber: loan.loanNumber || loan.accountNumber || loan.id,
      customerName:
        loan.customer?.name ||
        loan.customerName ||
        `${loan.customer?.firstName || ""} ${loan.customer?.lastName || ""}`.trim() ||
        "N/A",
      loanAmount:
        loan.approvedAmount || loan.requestedAmount || loan.loanAmount || 0,
      bank: loan.customer?.bankName || loan.bankName || "N/A",
      status: loan.status || "pending",
      interestRate: loan.interestRate || 0,
      tenure: loan.tenure || loan.tenureMonths || 0,
      outstandingBalance:
        loan.outstandingBalance ||
        loan.approvedAmount ||
        loan.requestedAmount ||
        0,
      nextEMIDate: loan.nextEmiDate || loan.nextEMIDate || "N/A",
      createdAt: loan.createdAt || loan.created_at || null,
      updatedAt: loan.updatedAt || loan.updated_at || null,
      customerId: loan.customer?.id || loan.customerId,
      approvedAmount: loan.approvedAmount,
      requestedAmount: loan.requestedAmount,
    }));
  }, [loansData]);

  // Handle search loan from the fetched loans list
  const handleSearchLoan = async () => {
    // clear any previous error
    if (!searchLoanNumber) {
      toast.error("Enter loan account number");
      return;
    }

    // Search in the fetched loans list
    const foundLoan = loans.find(
      (loan) =>
        loan.loanNumber?.toLowerCase() === searchLoanNumber.toLowerCase(),
    );

    if (!foundLoan) {
      toast.error("Loan account number not found");
      setSearchedLoan(null);
      setLoanStatus(null);
      return;
    }

    setSearchedLoan(foundLoan);
    setLoanStatus(foundLoan.status ?? "");
    setTransactionRef("TXN" + Math.floor(Math.random() * 1000000));

    // Reset forms
    setPrepaymentData({ amount: "", charges: "2.5", applyCharges: true });
    setPrepaymentResults({
      updatedBalance: "",
      newEmi: "",
      remainingTenure: "",
    });

    // Reset foreclosure data
    setForeclosureData((s) => ({
      ...s,
      outstandingPrincipal:
        foundLoan.outstandingBalance ?? s.outstandingPrincipal,
    }));
  };

  // Handle calculate EMI for prepayment
  const handleCalculateEMI = () => {
    if (!prepaymentData.amount) {
      toast.error("Please enter prepayment amount");
      return;
    }

    if (!searchedLoan) {
      toast.error("No loan selected");
      return;
    }

    const prepaymentAmount = parseFloat(prepaymentData.amount);
    const currentBalance = parseFloat(searchedLoan.outstandingBalance);
    const updatedBalance = currentBalance - prepaymentAmount;

    if (updatedBalance < 0) {
      toast.error("Prepayment amount cannot exceed outstanding balance");
      return;
    }

    // Simplified EMI calculation
    const monthlyRate = parseFloat(searchedLoan.interestRate) / 12 / 100;
    let newEmi = 0;
    let remainingTenure = 0;

    if (monthlyRate > 0 && searchedLoan.tenure > 0 && updatedBalance > 0) {
      newEmi = Math.round(
        (updatedBalance *
          monthlyRate *
          Math.pow(1 + monthlyRate, searchedLoan.tenure)) /
          (Math.pow(1 + monthlyRate, searchedLoan.tenure) - 1),
      );
      remainingTenure = Math.round(updatedBalance / newEmi);
    } else {
      newEmi = updatedBalance;
      remainingTenure = 1;
    }

    setPrepaymentResults({
      updatedBalance: updatedBalance.toLocaleString("en-IN"),
      newEmi: newEmi.toLocaleString("en-IN"),
      remainingTenure: remainingTenure.toString(),
    });
  };

  // Handle apply prepayment
  const handleApplyPrepayment = () => {
    if (!prepaymentResults.updatedBalance) {
      toast.error("Please calculate EMI first");
      return;
    }

    // Add to transaction history
    const newTransaction = {
      loanNumber: searchedLoan.loanNumber,
      customerName: searchedLoan.customerName,
      transactionType: "Prepayment",
      amountPaid: prepaymentData.amount,
      status: "Completed",
      date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };

    setTransactionHistory([newTransaction, ...transactionHistory]);

    // Update loan outstanding balance
    setSearchedLoan({
      ...searchedLoan,
      outstandingBalance: prepaymentResults.updatedBalance.replace(/,/g, ""),
    });

    toast.success("Prepayment applied successfully!");
  };

  // Foreclosure API: fetch summary when loan selected
  const loanIdForApi = searchedLoan?.id ?? searchedLoan?.loanNumber;
  const {
    data: forecloseApiData,
    isLoading: isForecloseLoading,
    refetch: refetchForeclose,
  } = useGetForecloseSummary(loanIdForApi);

  const effectiveForeclosureData = forecloseApiData || foreclosureData;

  // Handle calculate foreclosure
  const handleCalculateForeclosure = async () => {
    const loanId = searchedLoan?.id ?? searchedLoan?.loanNumber;
    if (!loanId) {
      toast.error("Loan id unavailable for foreclosure summary");
      return null;
    }

    const res = await refetchForeclose();
    const summary = res?.data || null;
    if (summary) {
      setForeclosureData({
        outstandingPrincipal: summary.outstandingPrincipal || "",
        accruedInterest: summary.accruedInterest || "",
        foreclosureCharges: summary.foreclosureCharges || "",
        totalPayable: summary.totalPayable || "",
      });
    }
    return summary;
  };

  // Handle proceed to confirmation
  const handleProceedToConfirmation = () => {
    if (!effectiveForeclosureData.totalPayable) {
      toast.error("Please calculate foreclosure amount first");
      return;
    }
    setActiveTab("confirmation");
  };

  // Handle apply foreclosure directly
  const handleApplyForeclosure = async () => {
    if (!searchedLoan) {
      toast.error("No loan selected");
      return;
    }

    // First check if foreclosure data is available
    if (!effectiveForeclosureData.totalPayable) {
      // Calculate foreclosure first
      toast.loading("Calculating foreclosure amount...", {
        id: "foreclosure-calc",
      });

      const summary = await handleCalculateForeclosure();
      toast.dismiss("foreclosure-calc");

      if (summary?.totalPayable) {
        setActiveTab("confirmation");
        toast.success(
          "Foreclosure amount calculated. Please proceed with confirmation.",
        );
      } else {
        toast.error(
          "Unable to calculate foreclosure amount. Please try again.",
        );
      }
    } else {
      // If foreclosure data is already available, go directly to confirmation
      setActiveTab("confirmation");
      toast.success("Proceeding to foreclosure confirmation");
    }
  };

  // Handle confirm foreclosure
  const payForecloseMut = usePayForecloseLoan();

  const handleConfirmForeclosure = async () => {
    const loanId = searchedLoan?.id ?? searchedLoan?.loanNumber;
    if (!loanId) return toast.error("Loan id unavailable");

    const payableString = effectiveForeclosureData.totalPayable;
    const amountRaw = payableString
      ? payableString.toString().replace(/,/g, "")
      : "";
    const amountPaid = Number(amountRaw) || Number(payableString) || 0;

    if (!amountPaid || amountPaid <= 0)
      return toast.error("Invalid payable amount");

    try {
      const payload = {
        amountPaid,
        paymentMethod,
        transactionRef,
      };
      await payForecloseMut.mutateAsync({ loanId, payload });

      const newTransaction = {
        loanNumber: searchedLoan.loanNumber,
        customerName: searchedLoan.customerName,
        transactionType: "Foreclosure",
        amountPaid: amountPaid.toLocaleString("en-IN"),
        status: "Completed",
        date: new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      };
      setTransactionHistory([newTransaction, ...transactionHistory]);
      setLoanStatus("CLOSED");
      setSearchedLoan({
        ...searchedLoan,
        status: "CLOSED",
        outstandingBalance: "0",
      });
      toast.success("Foreclosure confirmed successfully");

      // Refresh the loan list
      refetchLoans();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to process foreclosure");
    }
  };

  // Handle download receipt
  const handleDownloadReceipt = () => {
    toast.success("Downloading closure receipt...");
  };

  // Handle generate NOC
  const handleGenerateNOC = () => {
    toast.success("NOC generated successfully!");
  };

  // Fetch settlements/closure transactions for this loan
  const { data: settlementsForLoan, isLoading: isSettlementsLoading } =
    useSettlementsByLoan(searchedLoan?.id ?? null);

  // Map server settlements to table rows
  const serverTransactions = (
    Array.isArray(settlementsForLoan) ? settlementsForLoan : []
  ).map((r) => {
    const payments = Array.isArray(r.recoveryPayments)
      ? r.recoveryPayments
      : [];
    const lastPayment = payments.length ? payments[payments.length - 1] : null;
    const loanApp = r.loanApplication ?? {};
    const customer = loanApp.customer ?? null;
    return {
      loanNumber: loanApp.loanNumber ?? searchedLoan?.loanNumber ?? "",
      customerName: customer?.firstName
        ? `${customer.firstName} ${customer.lastName ?? ""}`.trim()
        : (loanApp.customerName ?? searchedLoan?.customerName ?? ""),
      transactionType: "Settlement",
      amountPaid: lastPayment ? lastPayment.amount : (r.recoveredAmount ?? 0),
      status: r.recoveryStatus ?? "",
      date: (lastPayment?.paymentDate ?? r.updatedAt ?? r.createdAt) || "",
      id: r.id || `${loanApp.loanNumber}-${r.updatedAt}`,
    };
  });

  const allTransactions = useMemo(() => {
    const merged = [...transactionHistory, ...serverTransactions];
    return merged.sort((a, b) => {
      const aDate = new Date(a?.date || 0).getTime();
      const bDate = new Date(b?.date || 0).getTime();
      return bDate - aDate;
    });
  }, [transactionHistory, serverTransactions]);

  const tableData = useMemo(() => {
    if (allTransactions.length > 0) return allTransactions;

    return loans.map((loan) => ({
      id: `loan-${loan.id}`,
      loanNumber: loan.loanNumber,
      customerName: loan.customerName,
      transactionType: "Prepayment",
      amountPaid: loan.outstandingBalance || loan.loanAmount || 0,
      status: loan.status || "Pending",
      date: loan.updatedAt || loan.createdAt || new Date().toISOString(),
    }));
  }, [allTransactions, loans]);

  const transactionSummary = useMemo(() => {
    const total = allTransactions.length;
    const completed = allTransactions.filter((t) =>
      ["completed", "success", "closed", "paid"].includes(
        (t?.status || "").toString().toLowerCase(),
      ),
    ).length;
    const pending = allTransactions.filter((t) =>
      ["pending", "processing"].includes(
        (t?.status || "").toString().toLowerCase(),
      ),
    ).length;

    return { total, completed, pending };
  }, [allTransactions]);

  const activeLoansCount = useMemo(() => {
    if (!Array.isArray(loans)) return 0;
    return loans.filter((l) =>
      ["active", "ACTIVE", "approved", "Approved"].includes(
        (l.status || "").toString(),
      ),
    ).length;
  }, [loans]);

  const displayLoanStatus = (
    loanStatus?.toUpperCase() || "NOT SELECTED"
  ).replace(/_/g, " ");
  const displayOutstanding = Number(searchedLoan?.outstandingBalance || 0);

  return (
    <div className="bg-slate-50 min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">
          Prepayment & Foreclosure
        </h1>
        <p className="text-slate-600 mt-1">
          Manage loan prepayments and foreclosure requests
        </p>
      </div>

      {/* Status Cards  */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatusCard
          title="Loan Status"
          value={
            searchedLoan ? displayLoanStatus : `${activeLoansCount} Active`
          }
          icon={FileCheck}
          colorClass="text-blue-600"
          bgClass="bg-blue-50"
          subtext={
            searchedLoan ? "Current lifecycle state" : "Active loans available"
          }
        />
        <StatusCard
          title="Outstanding Balance"
          value={`₹${displayOutstanding.toLocaleString("en-IN")}`}
          icon={IndianRupee}
          colorClass="text-orange-600"
          bgClass="bg-orange-50"
          subtext={
            searchedLoan ? "Pending amount to settle" : "No loan selected"
          }
        />
        <StatusCard
          title="Completed Transactions"
          value={transactionSummary.completed}
          icon={CheckCircle}
          colorClass="text-green-600"
          bgClass="bg-green-50"
          subtext={`${transactionSummary.total} total records`}
        />
        <StatusCard
          title="Pending Transactions"
          value={transactionSummary.pending}
          icon={AlertCircle}
          colorClass="text-amber-600"
          bgClass="bg-amber-50"
          subtext={
            isSettlementsLoading ? "Loading settlements..." : "Requires action"
          }
        />
      </div>

      {/* Loan Search section */}

      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1">
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchLoanNumber}
              onChange={(e) => setSearchLoanNumber(e.target.value)}
              placeholder="Enter loan account number"
              className="w-full pl-10 pr-4 py-2 px-2 border-2 border-blue-400 rounded-lg focus:outline-blue-600 focus:ring focus:ring-blue-500"
              onKeyPress={(e) => e.key === "Enter" && handleSearchLoan()}
            />
          </div>
        </div>
        <button
          onClick={handleSearchLoan}
          disabled={isLoadingLoans}
          className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors md:self-center disabled:bg-blue-400"
        >
          <Search className="w-4 h-4" />
          {isLoadingLoans ? "Loading..." : "Search Loan"}
        </button>
      </div>

      {/* Loan Summary Card - Only show when loan is searched */}
      {searchedLoan && (
        <>
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-800">
                  Loan Summary
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    loanStatus === "ACTIVE" ||
                    loanStatus === "active" ||
                    loanStatus === "approved"
                      ? "bg-green-100 text-green-700"
                      : loanStatus === "CLOSED" ||
                          loanStatus === "closed" ||
                          loanStatus === "settled"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {loanStatus?.toUpperCase() || "ACTIVE"}
                </span>

                {/* Apply Foreclosure Button */}
                <button
                  onClick={handleApplyForeclosure}
                  className="flex items-center gap-2 px-4 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm whitespace-nowrap"
                >
                  <FileCheck className="w-4 h-4" />
                  Apply Foreclosure
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Loan Account Number</p>
                  <p className="font-medium text-slate-800 truncate">
                    {searchedLoan.loanNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Customer Name</p>
                  <p className="font-medium text-slate-800 truncate">
                    {searchedLoan.customerName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                  <IndianRupee className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Loan Amount</p>
                  <p className="font-medium text-slate-800">
                    ₹
                    {typeof searchedLoan.loanAmount === "number"
                      ? searchedLoan.loanAmount.toLocaleString()
                      : searchedLoan.loanAmount}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                  <Percent className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Interest Rate</p>
                  <p className="font-medium text-slate-800">
                    {searchedLoan.interestRate}%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Tenure</p>
                  <p className="font-medium text-slate-800">
                    {searchedLoan.tenure} months
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                  <IndianRupee className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Outstanding Balance</p>
                  <p className="font-medium text-slate-800">
                    ₹
                    {typeof searchedLoan.outstandingBalance === "number"
                      ? searchedLoan.outstandingBalance.toLocaleString()
                      : searchedLoan.outstandingBalance}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Next EMI Date</p>
                  <p className="font-medium text-slate-800">
                    {searchedLoan.nextEMIDate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Tabs Navigation - Only show when loan is searched and active */}
      {searchedLoan &&
        (loanStatus === "ACTIVE" ||
          loanStatus === "active" ||
          loanStatus === "approved") && (
          <div className="bg-white rounded-xl shadow-sm p-1 inline-flex flex-wrap mb-6">
            {[
              { id: "prepayment", label: "Prepayment", icon: IndianRupee },
              {
                id: "foreclosure",
                label: "Foreclosure Calculator",
                icon: Calculator,
              },
              { id: "confirmation", label: "Confirmation", icon: CheckCircle },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}

      {/* Tab Content - Only show when loan is searched and active */}
      {searchedLoan &&
        (loanStatus === "ACTIVE" ||
          loanStatus === "active" ||
          loanStatus === "approved") && (
          <div className="space-y-6">
            {/* Tab 1: Prepayment */}
            {activeTab === "prepayment" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Prepayment Form Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                  <div className="flex items-center gap-2 mb-4">
                    <IndianRupee className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-slate-800">
                      Prepayment Details
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Prepayment Amount (₹)
                      </label>
                      <input
                        type="number"
                        value={prepaymentData.amount}
                        onChange={(e) =>
                          setPrepaymentData({
                            ...prepaymentData,
                            amount: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter amount"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Prepayment Charges (%)
                      </label>
                      <input
                        type="number"
                        value={prepaymentData.charges}
                        onChange={(e) =>
                          setPrepaymentData({
                            ...prepaymentData,
                            charges: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter charges"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm font-medium text-slate-700">
                        Apply Charges
                      </span>
                      <button
                        onClick={() =>
                          setPrepaymentData({
                            ...prepaymentData,
                            applyCharges: !prepaymentData.applyCharges,
                          })
                        }
                        className="focus:outline-none"
                      >
                        {prepaymentData.applyCharges ? (
                          <ToggleRight className="w-6 h-6 text-blue-600" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-slate-400" />
                        )}
                      </button>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleCalculateEMI}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Calculator className="w-4 h-4" />
                        Calculate EMI
                      </button>
                      <button
                        onClick={handleApplyPrepayment}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" />
                        Apply Prepayment
                      </button>
                    </div>
                  </div>
                </div>

                {/* Calculation Results Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-slate-800">
                      Recalculated EMI Details
                    </h2>
                  </div>

                  {prepaymentResults.updatedBalance ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-600 mb-1">
                          Updated Outstanding Balance
                        </p>
                        <p className="text-2xl font-semibold text-blue-700">
                          ₹{prepaymentResults.updatedBalance}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <p className="text-xs text-slate-500 mb-1">
                            New EMI Amount
                          </p>
                          <p className="font-medium text-slate-800">
                            ₹{prepaymentResults.newEmi}
                          </p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <p className="text-xs text-slate-500 mb-1">
                            Remaining Tenure
                          </p>
                          <p className="font-medium text-slate-800">
                            {prepaymentResults.remainingTenure} months
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calculator className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500">
                        Enter amount and calculate EMI
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Foreclosure Calculator */}
            {activeTab === "foreclosure" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Calculation Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Calculator className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-slate-800">
                      Foreclosure Calculation
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-slate-100">
                      <span className="text-slate-600">
                        Outstanding Principal
                      </span>
                      <span className="font-medium text-slate-800">
                        ₹
                        {typeof effectiveForeclosureData.outstandingPrincipal ===
                        "number"
                          ? effectiveForeclosureData.outstandingPrincipal.toLocaleString()
                          : effectiveForeclosureData.outstandingPrincipal}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-slate-100">
                      <span className="text-slate-600">Accrued Interest</span>
                      <span className="font-medium text-slate-800">
                        ₹
                        {typeof effectiveForeclosureData.accruedInterest ===
                        "number"
                          ? effectiveForeclosureData.accruedInterest.toLocaleString()
                          : effectiveForeclosureData.accruedInterest}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-slate-100">
                      <span className="text-slate-600">
                        Foreclosure Charges
                      </span>
                      <span className="font-medium text-orange-600">
                        ₹
                        {typeof effectiveForeclosureData.foreclosureCharges ===
                        "number"
                          ? effectiveForeclosureData.foreclosureCharges.toLocaleString()
                          : effectiveForeclosureData.foreclosureCharges}
                      </span>
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-700">
                          Total Payable Amount
                        </span>
                        <span className="text-xl font-bold text-blue-600">
                          ₹
                          {typeof effectiveForeclosureData.totalPayable ===
                          "number"
                            ? effectiveForeclosureData.totalPayable.toLocaleString()
                            : effectiveForeclosureData.totalPayable}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleCalculateForeclosure}
                        disabled={isForecloseLoading}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          isForecloseLoading
                            ? "bg-blue-400 text-white cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        <Calculator className="w-4 h-4" />
                        {isForecloseLoading ? "Calculating..." : "Calculate"}
                      </button>
                      <button
                        onClick={handleProceedToConfirmation}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        Proceed to Confirmation
                      </button>
                    </div>
                  </div>
                </div>

                {/* Formula Explanation Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-slate-800">
                      Calculation Formula
                    </h2>
                  </div>

                  <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-slate-600">
                        Outstanding Principal
                      </span>
                      <span className="text-slate-400">+</span>
                      <span className="text-slate-600">Accrued Interest</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-slate-600 ml-8">+</span>
                      <span className="text-slate-600">
                        Foreclosure Charges
                      </span>
                    </div>
                    <div className="border-t border-slate-200 my-2"></div>
                    <div className="flex items-center gap-2 font-medium text-blue-600">
                      <span>= Total Payable Amount</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-xs text-yellow-700 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Foreclosure charges are applicable as per loan agreement
                      terms
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Foreclosure Confirmation */}
            {activeTab === "confirmation" && (
              <div className="grid grid-cols-1 gap-6">
                {/* Payment Summary Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-slate-800">
                      Payment Summary
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">
                        Loan Account Number
                      </p>
                      <p className="font-medium text-slate-800">
                        {searchedLoan.loanNumber}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">
                        Customer Name
                      </p>
                      <p className="font-medium text-slate-800">
                        {searchedLoan.customerName}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">
                        Total Payable Amount
                      </p>
                      <p className="font-medium text-slate-800">
                        ₹
                        {typeof effectiveForeclosureData.totalPayable ===
                        "number"
                          ? effectiveForeclosureData.totalPayable.toLocaleString()
                          : effectiveForeclosureData.totalPayable}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">
                        Transaction Reference
                      </p>
                      <p className="font-medium text-slate-800">
                        {transactionRef}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Payment Method
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="upi">UPI</option>
                      <option value="card">Debit/Credit Card</option>
                      <option value="cash">Cash</option>
                    </select>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleConfirmForeclosure}
                      disabled={payForecloseMut.isLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {payForecloseMut.isLoading
                        ? "Processing..."
                        : "Confirm Foreclosure"}
                    </button>
                    <button
                      onClick={handleDownloadReceipt}
                      className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download Closure Receipt
                    </button>
                    <button
                      onClick={handleGenerateNOC}
                      className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <FileCheck className="w-4 h-4" />
                      Generate NOC
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      {/* Transaction History Table */}
      <div className="mt-8">
        <ForeClosureTable data={tableData} />
      </div>
    </div>
  );
};

export default PrepaymentForeclosure;
