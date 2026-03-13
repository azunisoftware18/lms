import React, { useState, useMemo } from "react";
import {
  User,
  Users,
  Building,
  Banknote,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Calculator,
  FileText,
  Shield,
  Percent,
  Home,
  Save,
  Send,
  Download,
  X,
  IndianRupee,
  Key,
  ArrowLeft,
} from "lucide-react";
import Button from "../../../components/ui/Button";
import SearchField from "../../../components/ui/SearchField";
import InputField from "../../../components/ui/InputField";
import SelectField from "../../../components/ui/SelectField";
import TextAreaField from "../../../components/ui/TextAreaField";
import StatusCard from "../../../components/common/StatusCard";
import CreditCheckTable from "../../../components/tables/CreditCheckTable";
import { useRefreshCreditReport } from "../../../hooks/useCreditReport";
import {
  CREDIT_CHECK_LOAN_APPLICATIONS,
  CREDIT_CHECK_DATA,
  CREDIT_CHECK_DECISIONS,
  RECENT_CREDIT_SEARCHES,
} from "../../../lib/LOSDummyData";
import { colorVariables } from "../../../lib";

export default function CreditCheckPage() {
  const { mutateAsync: refreshCreditReport } = useRefreshCreditReport();

  const fetchCredit = async (loanNumber) => {
    // Align page API with existing hook contract.
    return refreshCreditReport({ loanNumber });
  };
  const getScoreMeta = (score) => {
    if (score >= 750)
      return { status: "Excellent", color: "emerald", riskGrade: "A" };
    if (score >= 700) return { status: "Good", color: "blue", riskGrade: "B+" };
    if (score >= 650) return { status: "Fair", color: "amber", riskGrade: "C" };
    return { status: "Poor", color: "rose", riskGrade: "D" };
  };

  const formatAccountType = (type) => {
    if (!type) return "Loan";
    return type
      .toString()
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const normalizeCreditReport = (apiResponse, loanKey, monthlyIncome = 0) => {
    const report = apiResponse?.data || apiResponse;
    if (!report || typeof report !== "object") return null;

    const score =
      typeof report.creditScore === "number" ? report.creditScore : null;
    const scoreMeta = score !== null ? getScoreMeta(score) : null;
    const existingLoans = (report.creditAccount || []).map((account, index) => {
      const isDefault = typeof account.dpd === "number" && account.dpd > 0;
      const isActive = account.accountStatus === "ACTIVE";
      const status = isDefault ? "Default" : isActive ? "Active" : "Closed";
      const statusColor = isDefault ? "rose" : isActive ? "emerald" : "gray";
      return {
        id: account.id || index + 1,
        loanType: formatAccountType(account.accountType),
        bankName: account.lenderName || "Unknown Lender",
        emiAmount: account.emiAmount || 0,
        outstandingAmount: account.outstanding || 0,
        overdueAmount: isDefault ? account.emiAmount || 0 : 0,
        status,
        statusColor,
      };
    });

    const totalExistingEMI =
      typeof report.totalMonthlyEmi === "number"
        ? report.totalMonthlyEmi
        : existingLoans.reduce((sum, loan) => sum + loan.emiAmount, 0);

    const riskGrade = scoreMeta?.riskGrade || "B";
    const provider = report.provider || "Credit Bureau";
    const creditRemarks =
      score !== null
        ? `${provider} score ${score}. Total outstanding ${report.totalOutstandingLoans || 0}.`
        : `Credit report fetched from ${provider}.`;

    return {
      loanNumber: loanKey,
      creditScores:
        score !== null
          ? [
              {
                bureau: provider,
                score,
                status: scoreMeta.status,
                color: scoreMeta.color,
              },
            ]
          : [],
      coApplicant: null,
      existingLoans,
      creditAnalysis: {
        monthlyIncome,
        totalExistingEMI,
        foirPercentage: monthlyIncome
          ? ((totalExistingEMI / monthlyIncome) * 100).toFixed(2)
          : 0,
        eligibleEMICapacity: monthlyIncome
          ? (monthlyIncome * 0.5).toFixed(0)
          : 0,
        riskGrade,
        recommendedLoanAmount: 0,
        recommendedTenure: 0,
        interestRate: 0,
        creditRemarks,
      },
    };
  };
  // Loan applications database
  const [loanApplications] = useState(CREDIT_CHECK_LOAN_APPLICATIONS);

  // Selected application state
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Search state
  const [loanNumberInput, setLoanNumberInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [recentSearches, setRecentSearches] = useState(RECENT_CREDIT_SEARCHES);

  const [apiCreditData, setApiCreditData] = useState({});

  // Credit data for each loan
  const [creditData] = useState(CREDIT_CHECK_DATA);

  // Decision state for each loan
  const [decisions, setDecisions] = useState(CREDIT_CHECK_DECISIONS);

  // User role
  const [userRole] = useState("CREDIT_OFFICER");

  // Handle loan number search
  const handleLoanNumberSearch = async () => {
    if (!loanNumberInput.trim()) {
      setSearchError("Please enter a loan number");
      return;
    }

    setIsSearching(true);
    setSearchError("");

    const normalizedQuery = loanNumberInput.trim();
    let fetchedCredit = null;

    try {
      fetchedCredit = await fetchCredit(normalizedQuery);
    } catch (err) {
      setSearchError(err.message || "Failed to fetch credit report");
    }

    const foundApplication = loanApplications.find(
      (app) =>
        app.loanNumber.toLowerCase() === normalizedQuery.toLowerCase() ||
        app.applicationNumber.toLowerCase() === normalizedQuery.toLowerCase(),
    );

    const loanKey = normalizedQuery.toUpperCase();
    const normalizedCredit = fetchedCredit
      ? normalizeCreditReport(
          fetchedCredit,
          loanKey,
          foundApplication?.monthlyIncome || 0,
        )
      : null;

    if (normalizedCredit) {
      setApiCreditData((prev) => ({
        ...prev,
        [loanKey]: normalizedCredit,
      }));
    }

    if (foundApplication) {
      setSelectedApplication(foundApplication);
    } else if (fetchedCredit) {
      const applicant = fetchedCredit.applicant || {};
      const loanNumber =
        fetchedCredit.loanNumber || normalizedQuery.toUpperCase();
      setSelectedApplication({
        id: fetchedCredit.id || loanNumber,
        applicationNumber: fetchedCredit.applicationNumber || loanNumber,
        loanNumber,
        applicantName:
          fetchedCredit.applicantName || applicant.name || "Unknown Applicant",
        coApplicantName:
          fetchedCredit.coApplicantName ||
          fetchedCredit.coApplicant?.name ||
          null,
        loanType: fetchedCredit.loanType || "Loan",
        loanAmount: fetchedCredit.loanAmount || 0,
        branchName: fetchedCredit.branchName || "Unknown Branch",
        currentStage: fetchedCredit.currentStage || "Credit Check",
        monthlyIncome:
          fetchedCredit.monthlyIncome || applicant.monthlyIncome || 0,
        panNumber: fetchedCredit.panNumber || applicant.panNumber || "N/A",
        dob: fetchedCredit.dob || applicant.dob || "N/A",
        mobile: fetchedCredit.mobile || applicant.mobile || "N/A",
        employmentType:
          fetchedCredit.employmentType || applicant.employmentType || "N/A",
        companyName:
          fetchedCredit.companyName || applicant.companyName || "N/A",
        tenure: fetchedCredit.tenure || 0,
        interestRate: fetchedCredit.interestRate || 0,
      });
    } else {
      setSearchError(`No loan found with number: ${normalizedQuery}`);
    }

    if (!recentSearches.includes(normalizedQuery.toUpperCase())) {
      setRecentSearches((prev) => [
        normalizedQuery.toUpperCase(),
        ...prev.slice(0, 3),
      ]);
    }

    setIsSearching(false);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLoanNumberSearch();
    }
  };

  // Handle recent search click
  const handleRecentSearchClick = (loanNum) => {
    setLoanNumberInput(loanNum);
    const foundApplication = loanApplications.find(
      (app) => app.loanNumber === loanNum || app.applicationNumber === loanNum,
    );
    if (foundApplication) {
      setSelectedApplication(foundApplication);
      setSearchError("");
    }
  };

  // Clear search and go back
  const handleClearSearch = () => {
    setSelectedApplication(null);
    setLoanNumberInput("");
    setSearchError("");
  };

  // Get current application data
  const currentCreditData = selectedApplication
    ? apiCreditData[selectedApplication.loanNumber] ||
      creditData[selectedApplication.loanNumber]
    : null;
  const currentDecision = selectedApplication
    ? decisions[selectedApplication.loanNumber]
    : null;

  // Calculate total existing EMI
  const totalExistingEMI = useMemo(() => {
    if (!currentCreditData) return 0;
    return currentCreditData.existingLoans.reduce(
      (sum, loan) => sum + loan.emiAmount,
      0,
    );
  }, [currentCreditData]);

  // Calculate FOIR percentage
  const foirPercentage = useMemo(() => {
    if (!selectedApplication) return 0;
    return (
      (totalExistingEMI / selectedApplication.monthlyIncome) *
      100
    ).toFixed(2);
  }, [totalExistingEMI, selectedApplication]);

  // Calculate eligible EMI capacity (50% of monthly income)
  const eligibleEMICapacity = useMemo(() => {
    if (!selectedApplication) return 0;
    return (selectedApplication.monthlyIncome * 0.5).toFixed(0);
  }, [selectedApplication]);

  // Handle decision change
  const handleDecisionChange = (type) => {
    if (!selectedApplication) return;

    setDecisions((prev) => ({
      ...prev,
      [selectedApplication.loanNumber]: {
        ...prev[selectedApplication.loanNumber],
        decisionType: type,
        status: type === "reject" ? "rejected" : "approved",
        officerName: "Credit Officer Sharma",
        decisionDate: new Date().toISOString().split("T")[0],
      },
    }));
  };

  // Handle save decision
  const handleSaveDecision = () => {
    if (!selectedApplication) return;
    alert(`Decision saved for ${selectedApplication.loanNumber}!`);
  };

  // Handle approve and move
  const handleApproveMove = () => {
    if (!selectedApplication) return;
    alert(
      `Application ${selectedApplication.loanNumber} approved and moved to underwriting!`,
    );
  };

  // Handle reject application
  const handleRejectApplication = () => {
    if (!selectedApplication || !currentDecision?.remarks.trim()) {
      alert("Please provide remarks for rejection");
      return;
    }
    alert(`Application ${selectedApplication.loanNumber} rejected!`);
  };

  // Role permissions
  const canApprove = userRole === "CREDIT_OFFICER" || userRole === "ADMIN";
  const canEdit = userRole === "ADMIN";

  const riskGradeOptions = [
    { label: "A+ (Excellent)", value: "A+" },
    { label: "A (Very Good)", value: "A" },
    { label: "B+ (Good)", value: "B+" },
    { label: "B (Average)", value: "B" },
    { label: "C (Below Average)", value: "C" },
    { label: "D (Poor)", value: "D" },
  ];

  // If no application selected, show search screen
  if (!selectedApplication) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Search Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Key className={colorVariables.PRIMARY_COLOR} size={32} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Credit Check Portal
              </h1>
              <p className="text-gray-600">
                Enter loan number to review applicant's creditworthiness
              </p>
            </div>

            {/* Search Input */}
            <div className="mb-8">
              <SearchField
                value={loanNumberInput}
                onChange={(e) => {
                  setLoanNumberInput(e.target.value);
                  setSearchError("");
                }}
                onClear={() => {
                  setLoanNumberInput("");
                  setSearchError("");
                }}
                onSearch={handleLoanNumberSearch}
                onKeyPress={handleKeyPress}
                showResults={false}
                showButton
                buttonText={isSearching ? "Searching..." : "Search"}
                isLoading={isSearching}
                placeholder="Enter Loan Number (e.g., LON-2024-001) or Application Number"
                className="py-4 text-base"
              />

              {searchError && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertCircle size={18} />
                    <span className="font-medium">{searchError}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Recent Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((loanNum, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentSearchClick(loanNum)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                      <Clock size={14} />
                      <span className="font-mono">{loanNum}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Example Loan Numbers */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Example Loan Numbers
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className={`p-3 ${colorVariables.LIGHT_BG} rounded-lg`}>
                  <div className="font-mono text-sm text-blue-700 mb-1">
                    LON-2024-001
                  </div>
                  <div className="text-xs text-gray-600">
                    Rajesh Kumar - Home Loan
                  </div>
                </div>
                <div className={`p-3 ${colorVariables.LIGHT_BG} rounded-lg`}>
                  <div className="font-mono text-sm text-blue-700 mb-1">
                    LON-2024-002
                  </div>
                  <div className="text-xs text-gray-600">
                    Amit Sharma - Personal Loan
                  </div>
                </div>
                <div className={`p-3 ${colorVariables.LIGHT_BG} rounded-lg`}>
                  <div className="font-mono text-sm text-blue-700 mb-1">
                    LON-2024-003
                  </div>
                  <div className="text-xs text-gray-600">
                    Sunita Patel - Business Loan
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Search by: <span className="font-medium">Loan Number</span>,{" "}
              <span className="font-medium">Application Number</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If application selected, show credit check dashboard
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Application Selection Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleClearSearch}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Search another loan"
                >
                  <ArrowLeft size={20} className="text-gray-500" />
                </button>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Currently Viewing
                  </h2>
                  <p className="text-sm text-gray-500">
                    Loan number: {selectedApplication.loanNumber}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Quick Search Input */}
              <div className="w-80">
                <SearchField
                  value={loanNumberInput}
                  onChange={(e) => setLoanNumberInput(e.target.value)}
                  onSearch={handleLoanNumberSearch}
                  onKeyPress={handleKeyPress}
                  showResults={false}
                  showButton
                  buttonText="Go"
                  isLoading={isSearching}
                  placeholder="Search another loan..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Loan & Applicant Summary Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Credit Check Management
              </h1>
              <p className="text-gray-600">
                Review applicant's creditworthiness for loan approval
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                {selectedApplication.currentStage}
              </span>
              <Button className={colorVariables.PRIMARY_BUTTON_COLOR}>
                <Download size={18} />
                Export Report
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatusCard
              title="Loan Number"
              value={selectedApplication.loanNumber}
              subtext={selectedApplication.loanType}
              icon={FileText}
              variant="blue"
            />
            <StatusCard
              title="Primary Applicant"
              value={selectedApplication.applicantName}
              subtext={selectedApplication.employmentType}
              icon={User}
              variant="purple"
            />
            <StatusCard
              title="Loan Amount"
              value={`₹${selectedApplication.loanAmount.toLocaleString("en-IN")}`}
              subtext={`${selectedApplication.tenure} years`}
              icon={Banknote}
              variant="green"
            />
            <StatusCard
              title="Branch"
              value={selectedApplication.branchName}
              subtext={selectedApplication.currentStage}
              icon={Building}
              variant="orange"
            />
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Users size={18} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Co-applicant</p>
                <p className="font-medium text-gray-900">
                  {selectedApplication.coApplicantName || "Not Available"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Home size={18} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Loan Type</p>
                <p className="font-medium text-gray-900">
                  {selectedApplication.loanType}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Tenure</p>
                <p className="font-medium text-gray-900">
                  {selectedApplication.tenure} years
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Credit Scores & Applicant Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Credit Bureau Scores */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Credit Bureau Scores
                </h2>
                <span className="text-sm text-gray-500">
                  Last updated: Today
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {currentCreditData?.creditScores.map((bureau, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">
                        {bureau.bureau}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-${bureau.color}-100 text-${bureau.color}-700`}
                      >
                        {bureau.status}
                      </span>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-3xl font-bold text-${bureau.color}-600 mb-1`}
                      >
                        {bureau.score}
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-${bureau.color}-500 rounded-full`}
                          style={{ width: `${(bureau.score / 900) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Applicant & Co-Applicant Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary Applicant Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Primary Applicant
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700`}
                  >
                    Low Risk
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Name</span>
                    <span className="font-medium text-gray-900">
                      {selectedApplication.applicantName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">PAN Number</span>
                    <span className="font-medium text-gray-900">
                      {selectedApplication.panNumber}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Date of Birth</span>
                    <span className="font-medium text-gray-900">
                      {selectedApplication.dob}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Mobile</span>
                    <span className="font-medium text-gray-900">
                      {selectedApplication.mobile}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Credit Score</span>
                    <span className="text-lg font-bold text-emerald-600">
                      {currentCreditData?.creditScores[0]?.score || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Employment</span>
                    <span className="font-medium text-gray-900">
                      {selectedApplication.employmentType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Co-Applicant Card */}
              {currentCreditData?.coApplicant && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Co-applicant
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700`}
                    >
                      Medium Risk
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Name</span>
                      <span className="font-medium text-gray-900">
                        {currentCreditData.coApplicant.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">PAN Number</span>
                      <span className="font-medium text-gray-900">
                        {currentCreditData.coApplicant.panNumber}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Date of Birth
                      </span>
                      <span className="font-medium text-gray-900">
                        {currentCreditData.coApplicant.dob}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Mobile</span>
                      <span className="font-medium text-gray-900">
                        {currentCreditData.coApplicant.mobile}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Credit Score
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        {currentCreditData.coApplicant.creditScore}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Employment</span>
                      <span className="font-medium text-gray-900">
                        {currentCreditData.coApplicant.employmentType}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Existing Loans Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Existing Loans & Liabilities
                </h2>
                <span className="text-sm text-gray-500">
                  Total EMI: ₹{totalExistingEMI.toLocaleString("en-IN")}/month
                </span>
              </div>

              <CreditCheckTable
                loans={currentCreditData?.existingLoans ?? []}
                loading={false}
              />

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Total Existing Liabilities
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹
                      {currentCreditData?.existingLoans
                        .reduce((sum, loan) => sum + loan.outstandingAmount, 0)
                        .toLocaleString("en-IN") || "0"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Monthly EMI Commitment
                    </p>
                    <p
                      className={`text-2xl font-bold ${colorVariables.PRIMARY_COLOR}`}
                    >
                      ₹{totalExistingEMI.toLocaleString("en-IN")}/month
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Credit Analysis & Decision */}
          <div className="space-y-8">
            {/* Credit Analysis Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Credit Analysis
                </h2>
                <Calculator className="text-blue-500" size={24} />
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Monthly Income
                    </span>
                    <span className="font-bold text-gray-900">
                      ₹
                      {selectedApplication.monthlyIncome.toLocaleString(
                        "en-IN",
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Total Existing EMI
                    </span>
                    <span className="font-bold text-rose-600">
                      ₹{totalExistingEMI.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      FOIR Percentage
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold ${foirPercentage > 50 ? "text-rose-600" : "text-emerald-600"}`}
                      >
                        {foirPercentage}%
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${foirPercentage > 50 ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}
                      >
                        {foirPercentage > 50 ? "High Risk" : "Safe"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                      <span>FOIR Progress</span>
                      <span>{foirPercentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${foirPercentage > 50 ? "bg-rose-500" : foirPercentage > 40 ? "bg-amber-500" : "bg-emerald-500"}`}
                        style={{ width: `${Math.min(foirPercentage, 100)}%` }}
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>0%</span>
                        <span
                          className={`${foirPercentage > 40 ? "text-amber-600" : "text-emerald-600"} font-medium`}
                        >
                          40% Safe Limit
                        </span>
                        <span
                          className={`${foirPercentage > 50 ? "text-rose-600" : "text-gray-400"} font-medium`}
                        >
                          50% Max Limit
                        </span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Eligible EMI Capacity
                    </span>
                    <span className="font-bold text-emerald-600">
                      ₹{eligibleEMICapacity.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Risk Grade</span>
                    <span className="px-3 py-1 rounded-full text-sm font-bold bg-emerald-100 text-emerald-700">
                      {currentCreditData?.creditAnalysis.riskGrade}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Credit Remarks
                  </h4>
                  <p
                    className={`text-sm text-gray-600 ${colorVariables.LIGHT_BG} rounded-lg p-3`}
                  >
                    {currentCreditData?.creditAnalysis.creditRemarks}
                  </p>
                </div>
              </div>
            </div>

            {/* Credit Officer Decision Panel */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Credit Decision
                </h2>
                <div className="flex items-center gap-2">
                  <Shield className="text-blue-500" size={20} />
                  <span className="text-sm text-gray-500">
                    {userRole.replace("_", " ")}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                {/* Decision Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Decision Type
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleDecisionChange("approve")}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                        currentDecision?.decisionType === "approve"
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/50"
                      }`}
                      disabled={!canApprove}
                    >
                      <CheckCircle
                        className={`${currentDecision?.decisionType === "approve" ? "text-emerald-600" : "text-gray-400"} mb-2`}
                        size={24}
                      />
                      <span className="font-medium text-sm">Approve</span>
                    </button>

                    <button
                      onClick={() => handleDecisionChange("conditional")}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                        currentDecision?.decisionType === "conditional"
                          ? "border-amber-500 bg-amber-50"
                          : "border-gray-200 hover:border-amber-200 hover:bg-amber-50/50"
                      }`}
                      disabled={!canApprove}
                    >
                      <AlertCircle
                        className={`${currentDecision?.decisionType === "conditional" ? "text-amber-600" : "text-gray-400"} mb-2`}
                        size={24}
                      />
                      <span className="font-medium text-sm">Conditional</span>
                    </button>

                    <button
                      onClick={() => handleDecisionChange("reject")}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                        currentDecision?.decisionType === "reject"
                          ? "border-rose-500 bg-rose-50"
                          : "border-gray-200 hover:border-rose-200 hover:bg-rose-50/50"
                      }`}
                      disabled={!canApprove}
                    >
                      <XCircle
                        className={`${currentDecision?.decisionType === "reject" ? "text-rose-600" : "text-gray-400"} mb-2`}
                        size={24}
                      />
                      <span className="font-medium text-sm">Reject</span>
                    </button>
                  </div>
                </div>

                {/* Recommendation Fields */}
                <div className="space-y-4">
                  <InputField
                    type="number"
                    label="Recommended Loan Amount"
                    icon={IndianRupee}
                    value={currentDecision?.recommendedAmount || ""}
                    onChange={(e) => {
                      if (!selectedApplication) return;
                      setDecisions((prev) => ({
                        ...prev,
                        [selectedApplication.loanNumber]: {
                          ...prev[selectedApplication.loanNumber],
                          recommendedAmount: e.target.value,
                        },
                      }));
                    }}
                    isDisabled={!canEdit}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      type="number"
                      label="Tenure (Years)"
                      value={currentDecision?.recommendedTenure || ""}
                      onChange={(e) => {
                        if (!selectedApplication) return;
                        setDecisions((prev) => ({
                          ...prev,
                          [selectedApplication.loanNumber]: {
                            ...prev[selectedApplication.loanNumber],
                            recommendedTenure: e.target.value,
                          },
                        }));
                      }}
                      isDisabled={!canEdit}
                    />

                    <InputField
                      type="number"
                      step="0.1"
                      label="Interest Rate %"
                      icon={Percent}
                      value={currentDecision?.interestRate || ""}
                      onChange={(e) => {
                        if (!selectedApplication) return;
                        setDecisions((prev) => ({
                          ...prev,
                          [selectedApplication.loanNumber]: {
                            ...prev[selectedApplication.loanNumber],
                            interestRate: e.target.value,
                          },
                        }));
                      }}
                      isDisabled={!canEdit}
                    />
                  </div>

                  <SelectField
                    label="Risk Grade"
                    options={riskGradeOptions}
                    value={currentDecision?.riskGrade || ""}
                    onChange={(value) => {
                      if (!selectedApplication) return;
                      setDecisions((prev) => ({
                        ...prev,
                        [selectedApplication.loanNumber]: {
                          ...prev[selectedApplication.loanNumber],
                          riskGrade: value,
                        },
                      }));
                    }}
                    isDisabled={!canEdit}
                  />
                </div>

                {/* Remarks */}
                <TextAreaField
                  label="Credit Officer Remarks"
                  value={currentDecision?.remarks || ""}
                  onChange={(e) => {
                    if (!selectedApplication) return;
                    setDecisions((prev) => ({
                      ...prev,
                      [selectedApplication.loanNumber]: {
                        ...prev[selectedApplication.loanNumber],
                        remarks: e.target.value,
                      },
                    }));
                  }}
                  rows={4}
                  placeholder="Enter detailed remarks about the credit decision..."
                  isDisabled={!canApprove}
                />

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleSaveDecision}
                    className={`w-full justify-center ${colorVariables.PRIMARY_BUTTON_COLOR}`}
                    disabled={!canApprove}
                  >
                    <Save size={18} />
                    Save Decision
                  </Button>

                  <Button
                    onClick={handleApproveMove}
                    className="w-full justify-center bg-emerald-600 hover:bg-emerald-700"
                    disabled={
                      !canApprove || currentDecision?.decisionType !== "approve"
                    }
                  >
                    <Send size={18} />
                    Approve & Move to Underwriting
                  </Button>

                  <Button
                    onClick={handleRejectApplication}
                    className="w-full justify-center bg-rose-600 hover:bg-rose-700"
                    disabled={
                      !canApprove || currentDecision?.decisionType !== "reject"
                    }
                  >
                    <X size={18} />
                    Reject Application
                  </Button>
                </div>

                {/* Decision Info */}
                {currentDecision && currentDecision.status !== "pending" && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Officer</span>
                      <span className="font-medium text-gray-900">
                        {currentDecision.officerName || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-gray-500">Decision Date</span>
                      <span className="font-medium text-gray-900">
                        {currentDecision.decisionDate || "N/A"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Risk Assessment Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Risk Assessment Summary
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Credit Score Risk
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-emerald-100 text-emerald-700">
                    {currentCreditData?.creditScores[0]?.score >= 750
                      ? "Low"
                      : currentCreditData?.creditScores[0]?.score >= 650
                        ? "Medium"
                        : "High"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">FOIR Risk</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      foirPercentage > 50
                        ? "bg-rose-100 text-rose-700"
                        : foirPercentage > 40
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {foirPercentage > 50
                      ? "High"
                      : foirPercentage > 40
                        ? "Medium"
                        : "Low"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Existing Debt Risk
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      totalExistingEMI > selectedApplication.monthlyIncome * 0.4
                        ? "bg-amber-100 text-amber-700"
                        : totalExistingEMI >
                            selectedApplication.monthlyIncome * 0.2
                          ? "bg-blue-100 text-blue-700"
                          : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {totalExistingEMI > selectedApplication.monthlyIncome * 0.4
                      ? "Medium"
                      : totalExistingEMI >
                          selectedApplication.monthlyIncome * 0.2
                        ? "Low"
                        : "Very Low"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Overall Risk Grade
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-bold bg-emerald-100 text-emerald-700">
                    {currentCreditData?.creditAnalysis.riskGrade}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    currentCreditData?.creditScores[0]?.score >= 750
                      ? "bg-emerald-500"
                      : currentCreditData?.creditScores[0]?.score >= 650
                        ? "bg-blue-500"
                        : "bg-amber-500"
                  }`}
                ></div>
                <span className="text-sm text-gray-600">
                  Credit Score:{" "}
                  {currentCreditData?.creditScores[0]?.score >= 750
                    ? "Excellent"
                    : currentCreditData?.creditScores[0]?.score >= 650
                      ? "Good"
                      : "Average"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    foirPercentage > 50
                      ? "bg-rose-500"
                      : foirPercentage > 40
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                  }`}
                ></div>
                <span className="text-sm text-gray-600">
                  FOIR: {foirPercentage}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    totalExistingEMI > selectedApplication.monthlyIncome * 0.4
                      ? "bg-amber-500"
                      : totalExistingEMI >
                          selectedApplication.monthlyIncome * 0.2
                        ? "bg-blue-500"
                        : "bg-emerald-500"
                  }`}
                ></div>
                <span className="text-sm text-gray-600">
                  Existing Debt:{" "}
                  {totalExistingEMI > selectedApplication.monthlyIncome * 0.4
                    ? "High"
                    : totalExistingEMI > selectedApplication.monthlyIncome * 0.2
                      ? "Moderate"
                      : "Low"}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Application Status</p>
              <p className={`font-medium ${colorVariables.PRIMARY_COLOR}`}>
                {selectedApplication.currentStage}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
