import React, { useState, useMemo } from "react";
import LoanClosureTable from "../../../components/tables/LoanClosureTable";
import { useLoanApplications } from "../../../hooks/useLoanApplication";
import {
  Search,
  CreditCard,
  User,
  IndianRupee,
  Calendar,
  ShieldCheck,
  CheckCircle,
  FileText,
  FileCheck,
  Download,
  Printer,
  Clock,
  Check,
  XCircle,
  AlertCircle,
  BadgeCheck,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";

const LoanClosure = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState("closure");

  // State for loan search
  const [searchLoanNumber, setSearchLoanNumber] = useState("");
  const [searchedLoan, setSearchedLoan] = useState(null);
  const [searchError, setSearchError] = useState("");

  // State for loan status
  const [loanStatus, setLoanStatus] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState({
    emiPayments: false,
    penaltiesCleared: false,
    chargesCleared: false,
  });

  // Local closed loans added client-side (keeps user additions)
  const [localClosedLoans, setLocalClosedLoans] = useState([]);

  const formatDateOnly = (value) => {
    if (!value) return "-";
    try {
      const d = new Date(value);
      if (!Number.isNaN(d.getTime())) {
        return d.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }
    } catch (e) {
      toast.error("Error parsing date: " + e.message);
    }
    return String(value).split("T")[0] || String(value);
  };

  // State for NOC
  const [nocGenerated, setNocGenerated] = useState(false);
  const [closureReference] = useState();
  // "CLR" + Math.floor(Math.random() * 1000000),
  const [closureDate] = useState(
    new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
  );

  // Fetch loan applications and show closed loans for NOC download
  const loanQuery = useLoanApplications({ limit: 1000 });
  const loansData = loanQuery?.data;
  const refetchLoans = loanQuery?.refetch;

  // Derive closed loans from server response without setting state inside effect
  const serverClosedLoans = useMemo(() => {
    // Normalize possible response shapes
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

    return (list || [])
      .filter((loan) => {
        const st = (loan.status || "").toString().toLowerCase();
        return st === "closed";
      })
      .map((loan) => ({
        accountNumber: loan.loanNumber || loan.accountNumber || loan.id,
        customerName:
          loan.customer?.name ||
          loan.customerName ||
          `${loan.customer?.firstName || ""} ${loan.customer?.lastName || ""}`.trim() ||
          "-",
        loanAmount:
          loan.approvedAmount || loan.requestedAmount || loan.loanAmount || 0,
        status: loan.status || "closed",
        closureDate: formatDateOnly(
          loan.foreclosureDate ||
            loan.closureDate ||
            loan.updatedAt ||
            loan.createdAt,
        ),
        id:
          loan.id ||
          loan.loanNumber ||
          `${loan.loanNumber || loan.accountNumber}`,
      }));
  }, [loansData]);

  const closedLoans = useMemo(() => {
    // Merge local additions first, then server list
    return [...localClosedLoans, ...serverClosedLoans];
  }, [localClosedLoans, serverClosedLoans]);

  // Tabs configuration
  const tabs = [
    { id: "closure", label: "Loan Closure", icon: ShieldCheck },
    { id: "noc", label: "NOC Generation", icon: FileCheck },
  ];

  // Handle search loan
  const handleSearchLoan = () => {
    setSearchError("");
    const foundLoan = closedLoans.find(
      (loan) => loan.accountNumber === searchLoanNumber,
    );

    if (foundLoan) {
      setSearchedLoan(foundLoan);
      setLoanStatus(foundLoan.status);
      // Reset verification status for new loan
      setVerificationStatus({
        emiPayments: false,
        penaltiesCleared: false,
        chargesCleared: false,
      });
      setNocGenerated(false);
    } else {
      setSearchError("Loan account number not found");
      setSearchedLoan(null);
      setLoanStatus(null);
    }
  };

  // Handle verify payments
  const handleVerifyPayments = () => {
    setVerificationStatus({
      emiPayments: true,
      penaltiesCleared: true,
      chargesCleared: true,
    });
  };

  // Handle confirm loan closure
  const handleConfirmClosure = () => {
    if (Object.values(verificationStatus).every((status) => status === true)) {
      setLoanStatus("CLOSED");

      // Add to closed loans table
      const closedLoan = {
        accountNumber: searchedLoan.accountNumber,
        customerName: searchedLoan.customerName,
        loanAmount: searchedLoan.loanAmount,
        status: "CLOSED",
        closureDate: new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      };

      setLocalClosedLoans((prev) => [closedLoan, ...prev]);

      // Update searched loan status
      setSearchedLoan({
        ...searchedLoan,
        status: "CLOSED",
      });

      alert("Loan closure confirmed successfully!");
    } else {
      alert("Please verify all payments before confirming closure.");
    }
  };

  // Handle generate NOC
  const handleGenerateNOC = () => {
    if (loanStatus === "CLOSED") {
      setNocGenerated(true);
      alert("NOC generated successfully!");
    } else {
      alert("Loan must be closed before generating NOC.");
    }
  };

  // Handle download NOC
  const handleDownloadNOC = () => {
    if (nocGenerated) {
      alert("Downloading NOC PDF...");
    } else {
      alert("Please generate NOC first.");
    }
  };

  // Handle print NOC
  const handlePrintNOC = () => {
    if (nocGenerated) {
      alert("Preparing NOC for print...");
    } else {
      alert("Please generate NOC first.");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Loan Closure</h1>
        <p className="text-slate-600 mt-1">
          Search, verify, and close loans with NOC generation
        </p>
      </div>

      {/* Loan Search Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Loan Account Number
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchLoanNumber}
                onChange={(e) => setSearchLoanNumber(e.target.value)}
                placeholder="Enter loan account number"
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === "Enter" && handleSearchLoan()}
              />
            </div>
            {searchError && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <XCircle className="w-4 h-4" />
                {searchError}
              </p>
            )}
          </div>
          <button
            onClick={handleSearchLoan}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors md:self-center"
          >
            <Search className="w-4 h-4" />
            Search Loan
          </button>
        </div>
      </div>

      {/* Loan Summary Card - Only show when loan is searched */}
      {searchedLoan && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-800">
                Loan Summary
              </h2>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
                loanStatus === "ACTIVE"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {loanStatus}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                <CreditCard className="w-4 h-4 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Loan Account Number</p>
                <p className="font-medium text-slate-800 truncate">
                  {searchedLoan.accountNumber}
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
                  ₹{searchedLoan.loanAmount}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                <Calendar className="w-4 h-4 text-blue-600" />
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
                  ₹{searchedLoan.outstandingBalance}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Navigation - Only show when loan is searched */}
      {searchedLoan && (
        <div className="bg-white rounded-xl shadow-sm p-1 inline-flex flex-wrap mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isDisabled = tab.id === "noc" && loanStatus !== "CLOSED";

            return (
              <button
                key={tab.id}
                onClick={() => !isDisabled && setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : isDisabled
                      ? "text-slate-400 cursor-not-allowed"
                      : "text-slate-600 hover:bg-slate-100"
                }`}
                disabled={isDisabled}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Tab Content - Only show when loan is searched */}
      {searchedLoan && (
        <div className="space-y-6">
          {/* Tab 1: Loan Closure */}
          {activeTab === "closure" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Payment Verification Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-800">
                    Payment Verification
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-slate-100">
                    <span className="text-slate-600">Total Loan Amount</span>
                    <span className="font-medium text-slate-800">
                      ₹{searchedLoan.loanAmount}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-slate-100">
                    <span className="text-slate-600">Total EMI Paid</span>
                    <span className="font-medium text-green-600">
                      ₹{searchedLoan.totalEmiPaid}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-slate-100">
                    <span className="text-slate-600">Remaining Balance</span>
                    <span className="font-medium text-slate-800">
                      ₹{searchedLoan.outstandingBalance}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-slate-100">
                    <span className="text-slate-600">Late Charges</span>
                    <span className="font-medium text-orange-600">
                      ₹{searchedLoan.lateCharges}
                    </span>
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-700">
                        Final Payable Amount
                      </span>
                      <span className="text-xl font-bold text-blue-600">
                        ₹{searchedLoan.finalPayable}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification Status Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-800">
                    Verification Status
                  </h2>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-slate-600" />
                      <span className="text-sm text-slate-700">
                        EMI Payments Verified
                      </span>
                    </div>
                    {verificationStatus.emiPayments ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <Check className="w-4 h-4" />
                        <span className="text-xs font-medium">Verified</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs font-medium">Pending</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-slate-600" />
                      <span className="text-sm text-slate-700">
                        Penalties Cleared
                      </span>
                    </div>
                    {verificationStatus.penaltiesCleared ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <Check className="w-4 h-4" />
                        <span className="text-xs font-medium">Cleared</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs font-medium">Pending</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-600" />
                      <span className="text-sm text-slate-700">
                        Charges Cleared
                      </span>
                    </div>
                    {verificationStatus.chargesCleared ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <Check className="w-4 h-4" />
                        <span className="text-xs font-medium">Cleared</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs font-medium">Pending</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleVerifyPayments}
                    disabled={loanStatus === "CLOSED"}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      loanStatus === "CLOSED"
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Verify Payments
                  </button>
                  <button
                    onClick={handleConfirmClosure}
                    disabled={loanStatus === "CLOSED"}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      loanStatus === "CLOSED"
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "border border-blue-600 text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Confirm Loan Closure
                  </button>
                </div>

                {loanStatus === "CLOSED" && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg flex items-center gap-2">
                    <BadgeCheck className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-700">
                      Loan has been successfully closed
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: NOC Generation */}
          {activeTab === "noc" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* NOC Information Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <FileCheck className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-800">
                    NOC Information
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">
                        Loan Account Number
                      </p>
                      <p className="font-medium text-slate-800">
                        {searchedLoan.accountNumber}
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
                        Loan Closure Date
                      </p>
                      <p className="font-medium text-slate-800">
                        {closureDate}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">
                        Final Payment Amount
                      </p>
                      <p className="font-medium text-slate-800">
                        ₹{searchedLoan.finalPayable}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600 mb-1">
                      Closure Reference Number
                    </p>
                    <p className="font-medium text-blue-700">
                      {closureReference}
                    </p>
                  </div>
                </div>
              </div>

              {/* Document Preview Section */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-800">
                    NOC Preview
                  </h2>
                </div>

                {/* NOC Certificate Preview */}
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 mb-6">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-slate-800">
                      NO OBJECTION CERTIFICATE
                    </h3>
                    <p className="text-xs text-slate-500">
                      Reference: {closureReference}
                    </p>
                  </div>

                  <div className="space-y-3 text-sm">
                    <p className="text-slate-600">
                      This is to certify that the loan availed by{" "}
                      <span className="font-semibold">
                        {searchedLoan.customerName}
                      </span>{" "}
                      (Loan Account: {searchedLoan.accountNumber}) has been
                      fully repaid and settled.
                    </p>

                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Loan Amount:</span>
                        <span className="font-medium">
                          ₹{searchedLoan.loanAmount}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span className="text-slate-500">Closure Date:</span>
                        <span className="font-medium">{closureDate}</span>
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span className="text-slate-500">Final Payment:</span>
                        <span className="font-medium">
                          ₹{searchedLoan.finalPayable}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-600">
                      The lender has no objection to the closure of this loan
                      and confirms that all dues have been cleared.
                    </p>

                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-xs text-slate-500">
                            Authorized Signatory
                          </p>
                          <p className="font-medium text-slate-800">
                            For ABC Bank Ltd.
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Date</p>
                          <p className="font-medium text-slate-800">
                            {closureDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleGenerateNOC}
                    disabled={nocGenerated}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      nocGenerated
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    <FileCheck className="w-4 h-4" />
                    Generate NOC
                  </button>
                  <button
                    onClick={handleDownloadNOC}
                    disabled={!nocGenerated}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      nocGenerated
                        ? "border border-blue-600 text-blue-600 hover:bg-blue-50"
                        : "border border-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                  <button
                    onClick={handlePrintNOC}
                    disabled={!nocGenerated}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      nocGenerated
                        ? "border border-slate-200 text-slate-600 hover:bg-slate-50"
                        : "border border-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <Printer className="w-4 h-4" />
                    Print
                  </button>
                </div>

                {nocGenerated && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-700">
                      NOC generated successfully
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Closed Loans Table moved to component */}
      <LoanClosureTable
        data={closedLoans}
        onRefresh={() => {
          if (typeof refetchLoans === "function") refetchLoans();
        }}
      />
    </div>
  );
};

export default LoanClosure;
