import React, { useState } from "react";
import {
  Search,
  Download,
  Printer,
  Save,
  User,
  Building,
  CreditCard,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  FileText,
  Percent,
  Phone,
  Eye,
  Edit,
  Filter,
  RefreshCw,
  Globe,
} from "lucide-react";
import {
  CRC_COMMERCIAL_DUMMY_DATA,
  CRC_CONSUMER_DUMMY_DATA,
  CRC_ROLES,
  CRC_RISK_FILTER_OPTIONS,
} from "../../../lib/ReportsDummyData";

// Helper functions
const getRiskColor = (riskLevel) => {
  const risk = riskLevel.toLowerCase();
  return risk.includes("low")
    ? "bg-green-100 text-green-800"
    : risk.includes("medium")
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800";
};

const getStatusColor = (status) => {
  const stat = status.toLowerCase();
  return stat.includes("approved") ||
    stat.includes("valid") ||
    stat.includes("verified")
    ? "bg-green-50 border-green-200 text-green-700"
    : stat.includes("review") ||
        stat.includes("average") ||
        stat.includes("good")
      ? "bg-yellow-50 border-yellow-200 text-yellow-700"
      : "bg-red-50 border-red-200 text-red-700";
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);

const TabButton = ({ tab, label, icon, count, activeTab, onTabChange }) => (
  <button
    className={`px-8 py-4 font-medium text-sm border-b-2 transition-all flex items-center gap-2 ${
      activeTab === tab
        ? "border-blue-600 text-blue-600"
        : "border-transparent text-gray-500 hover:text-gray-700"
    }`}
    onClick={() => onTabChange(tab)}
  >
    {icon}
    {label}
    <span className="ml-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
      {count}
    </span>
  </button>
);

// Component: QuickStatCard
const QuickStatCard = ({ title, value, icon, change, trend }) => (
  <div className="bg-white rounded-2xl shadow-sm p-5">
    <div className="flex items-start justify-between mb-4">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className="p-3 rounded-xl bg-blue-50">{icon}</div>
    </div>
    <div className="flex items-center gap-1">
      {trend === "up" ? (
        <TrendingUp size={16} className="text-green-500" />
      ) : (
        <TrendingDown size={16} className="text-red-500" />
      )}
      <span
        className={`text-sm font-medium ${trend === "up" ? "text-green-600" : "text-red-600"}`}
      >
        {change}
      </span>
      <span className="text-xs text-gray-500 ml-1">from last month</span>
    </div>
  </div>
);

// Component: ConsumerCard
const ConsumerCard = ({ data, onView }) => {
  const StatusIcon =
    data.eligibilityStatus === "Approved"
      ? CheckCircle
      : data.eligibilityStatus === "Review"
        ? AlertTriangle
        : XCircle;
  const statusColor =
    data.eligibilityStatus === "Approved"
      ? "text-green-700"
      : data.eligibilityStatus === "Review"
        ? "text-yellow-700"
        : "text-red-700";
  const bgColor =
    data.statusColor === "green"
      ? "bg-green-50"
      : data.statusColor === "yellow"
        ? "bg-yellow-50"
        : "bg-red-50";
  const borderColor =
    data.statusColor === "green"
      ? "border-green-500"
      : data.statusColor === "yellow"
        ? "border-yellow-500"
        : "border-red-500";

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg overflow-hidden border-l-4 ${borderColor}`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-linear-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                <User className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{data.customerName}</h3>
                <p className="text-sm text-gray-500">{data.mobileNumber}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">PAN:</span>
                <span className="text-sm font-medium">{data.panNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">
                  Income:
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(data.monthlyIncome)}/mo
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getRiskColor(data.riskGrade)}`}
            >
              {data.riskGrade}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {data.creditScore}
            </div>
            <div className="text-xs text-gray-500">Credit Score</div>
          </div>
          <div className="text-center">
            <div
              className={`text-2xl font-bold ${data.overdueCount === 0 ? "text-green-600" : "text-red-600"}`}
            >
              {data.overdueCount}
            </div>
            <div className="text-xs text-gray-500">Overdue</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Suggested Limit:</span>
            <span className="font-bold text-gray-900">
              {formatCurrency(data.suggestedLimit)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Interest Band:</span>
            <span className="font-bold text-gray-900">{data.interestBand}</span>
          </div>
        </div>
      </div>

      <div className={`px-5 py-3 ${bgColor}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusIcon size={16} className={statusColor} />
            <span className={`font-bold ${statusColor}`}>
              {data.eligibilityStatus}
            </span>
          </div>
          <button
            onClick={onView}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          >
            View Details <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Component: CommercialCard
const CommercialCard = ({ data, onView }) => {
  const StatusIcon = data.loanRecommendation.includes("Approved")
    ? CheckCircle
    : data.loanRecommendation.includes("Review")
      ? AlertTriangle
      : XCircle;
  const statusColor = data.loanRecommendation.includes("Approved")
    ? "text-green-700"
    : data.loanRecommendation.includes("Review")
      ? "text-yellow-700"
      : "text-red-700";
  const bgColor =
    data.statusColor === "green"
      ? "bg-green-50"
      : data.statusColor === "yellow"
        ? "bg-yellow-50"
        : "bg-red-50";
  const borderColor =
    data.statusColor === "green"
      ? "border-green-500"
      : data.statusColor === "yellow"
        ? "border-yellow-500"
        : "border-red-500";

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg overflow-hidden border-l-4 ${borderColor}`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-linear-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                <Building className="text-purple-600" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{data.businessName}</h3>
                <p className="text-sm text-gray-500">{data.gstNumber}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">
                  Turnover:
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(data.annualTurnover)}/yr
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">
                  Active Loans:
                </span>
                <span className="text-sm font-medium">{data.activeLoans}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getRiskColor(data.businessRiskRating)}`}
            >
              {data.businessRiskRating}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">
              {formatCurrency(data.approvedLimit)}
            </div>
            <div className="text-xs text-gray-500">Approved Limit</div>
          </div>
          <div className="text-center">
            <div
              className={`text-xl font-bold ${data.legalAlerts === 0 ? "text-green-600" : "text-red-600"}`}
            >
              {data.legalAlerts}
            </div>
            <div className="text-xs text-gray-500">Legal Alerts</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Director Credit:</span>
            <span
              className={`font-medium ${getStatusColor(data.directorCreditHistory)} px-2 py-1 rounded text-xs`}
            >
              {data.directorCreditHistory}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Bank Summary:</span>
            <span
              className={`font-medium ${getStatusColor(data.bankSummary)} px-2 py-1 rounded text-xs`}
            >
              {data.bankSummary}
            </span>
          </div>
        </div>
      </div>

      <div className={`px-5 py-3 ${bgColor}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusIcon size={16} className={statusColor} />
            <span className={`font-bold ${statusColor}`}>
              {data.loanRecommendation}
            </span>
          </div>
          <button
            onClick={onView}
            className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
          >
            View Details <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function CRCReportPage() {
  const [activeTab, setActiveTab] = useState("consumer");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState(CRC_ROLES.creditAnalyst);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filters, setFilters] = useState({ riskGrade: "all" });

  const consumerData = CRC_CONSUMER_DUMMY_DATA;
  const commercialData = CRC_COMMERCIAL_DUMMY_DATA;

  const currentData = activeTab === "consumer" ? consumerData : commercialData;

  const handleAction = (type) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(`${type} action completed!`);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                <Shield className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Credit Risk Center (CRC)
                </h1>
                <p className="text-gray-600 mt-1">
                  Unified dashboard for Consumer & Commercial credit risk
                  assessment
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white border rounded-xl px-3 py-2">
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="bg-transparent outline-none text-sm"
              >
                <option value={CRC_ROLES.creditAnalyst}>
                  Credit Analyst View
                </option>
                <option value={CRC_ROLES.creditManager}>
                  Credit Manager View
                </option>
                <option value={CRC_ROLES.admin}>Admin View</option>
              </select>
            </div>
            <button
              onClick={() => handleAction("Refresh Data")}
              className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-xl hover:opacity-90"
            >
              <RefreshCw size={18} /> Refresh Data
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAction("Search");
                }}
                className="relative"
              >
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by name, PAN, GST, mobile..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
            <div className="flex items-center gap-3">
              {["Save Report", "Export PDF", "Print"].map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAction(action)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl ${
                    idx === 0
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {idx === 0 ? (
                    <Save size={18} />
                  ) : idx === 1 ? (
                    <Download size={18} />
                  ) : (
                    <Printer size={18} />
                  )}
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <TabButton
            tab="consumer"
            label="Consumer CRC"
            icon={<User size={18} />}
            count={consumerData.length}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          <TabButton
            tab="commercial"
            label="Commercial CRC"
            icon={<Building size={18} />}
            count={commercialData.length}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Fetching credit risk data...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <QuickStatCard
              title="Total Assessments"
              value={currentData.length}
              icon={<FileText className="text-blue-600" />}
              change="+12%"
              trend="up"
            />
            <QuickStatCard
              title={`Avg. ${activeTab === "consumer" ? "Credit Score" : "Risk Rating"}`}
              value={activeTab === "consumer" ? "725" : "Low-Medium"}
              icon={<TrendingUp className="text-green-600" />}
              change="+5%"
              trend="up"
            />
            <QuickStatCard
              title="Approval Rate"
              value={activeTab === "consumer" ? "78%" : "65%"}
              icon={<Percent className="text-indigo-600" />}
              change="+3%"
              trend="up"
            />
            <QuickStatCard
              title="High Risk Cases"
              value="1"
              icon={<AlertTriangle className="text-red-600" />}
              change="+2"
              trend="down"
            />
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {currentData.map((item) =>
              activeTab === "consumer" ? (
                <ConsumerCard
                  key={item.id}
                  data={item}
                  onView={() =>
                    setSelectedReport({ type: "consumer", data: item })
                  }
                />
              ) : (
                <CommercialCard
                  key={item.id}
                  data={item}
                  onView={() =>
                    setSelectedReport({ type: "commercial", data: item })
                  }
                />
              ),
            )}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {activeTab === "consumer" ? "Consumer" : "Commercial"}{" "}
                    Credit Risk Details
                  </h3>
                  <p className="text-sm text-gray-500">Detailed analysis</p>
                </div>
                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-gray-500" />
                  <select
                    className="border-0 bg-transparent outline-none text-sm"
                    value={filters.riskGrade}
                    onChange={(e) => setFilters({ riskGrade: e.target.value })}
                  >
                    {CRC_RISK_FILTER_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {activeTab === "consumer" ? (
                      <>
                        <th className="p-4 text-left text-sm font-medium text-gray-700">
                          Customer Info
                        </th>
                        <th className="p-4 text-left text-sm font-medium text-gray-700">
                          Financials
                        </th>
                        <th className="p-4 text-left text-sm font-medium text-gray-700">
                          Risk Indicators
                        </th>
                        <th className="p-4 text-left text-sm font-medium text-gray-700">
                          CRC Results
                        </th>
                      </>
                    ) : (
                      <>
                        <th className="p-4 text-left text-sm font-medium text-gray-700">
                          Business Info
                        </th>
                        <th className="p-4 text-left text-sm font-medium text-gray-700">
                          Financial Overview
                        </th>
                        <th className="p-4 text-left text-sm font-medium text-gray-700">
                          Risk Assessment
                        </th>
                        <th className="p-4 text-left text-sm font-medium text-gray-700">
                          CRC Results
                        </th>
                      </>
                    )}
                    <th className="p-4 text-left text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                activeTab === "consumer"
                                  ? "bg-linear-to-r from-blue-100 to-indigo-100"
                                  : "bg-linear-to-r from-purple-100 to-pink-100"
                              }`}
                            >
                              {activeTab === "consumer" ? (
                                <User className="text-blue-600" size={18} />
                              ) : (
                                <Building
                                  className="text-purple-600"
                                  size={18}
                                />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {activeTab === "consumer"
                                  ? item.customerName
                                  : item.businessName}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Phone size={10} />
                                {activeTab === "consumer"
                                  ? item.mobileNumber
                                  : item.gstNumber}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-gray-500">
                              {activeTab === "consumer"
                                ? "Monthly Income"
                                : "Annual Turnover"}
                            </p>
                            <p className="font-semibold text-gray-900">
                              {formatCurrency(
                                activeTab === "consumer"
                                  ? item.monthlyIncome
                                  : item.annualTurnover,
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">
                              {activeTab === "consumer"
                                ? "Existing EMIs"
                                : "Bank Summary"}
                            </p>
                            <p className="font-semibold text-gray-900">
                              {activeTab === "consumer"
                                ? formatCurrency(item.existingEMIs)
                                : item.bankSummary}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              {activeTab === "consumer"
                                ? "Credit Score"
                                : "Business Risk"}
                            </span>
                            <span
                              className={`font-bold ${
                                activeTab === "consumer"
                                  ? item.creditScore >= 750
                                    ? "text-green-600"
                                    : item.creditScore >= 650
                                      ? "text-yellow-600"
                                      : "text-red-600"
                                  : getRiskColor(item.businessRiskRating)
                              }`}
                            >
                              {activeTab === "consumer"
                                ? item.creditScore
                                : item.businessRiskRating}
                            </span>
                          </div>
                          <div>
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                activeTab === "consumer"
                                  ? getRiskColor(item.riskGrade)
                                  : getRiskColor(item.riskCategory)
                              }`}
                            >
                              {activeTab === "consumer"
                                ? `${item.riskGrade} Risk`
                                : item.riskCategory}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-3">
                          <div
                            className={`p-3 rounded-lg ${
                              activeTab === "consumer"
                                ? getStatusColor(item.eligibilityStatus)
                                : getStatusColor(item.loanRecommendation)
                            }`}
                          >
                            <p className="text-xs text-gray-500">
                              {activeTab === "consumer"
                                ? "Eligibility Status"
                                : "Loan Recommendation"}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {activeTab === "consumer" ? (
                                item.eligibilityStatus === "Approved" ? (
                                  <CheckCircle
                                    size={16}
                                    className="text-green-600"
                                  />
                                ) : item.eligibilityStatus === "Review" ? (
                                  <AlertTriangle
                                    size={16}
                                    className="text-yellow-600"
                                  />
                                ) : (
                                  <XCircle size={16} className="text-red-600" />
                                )
                              ) : item.loanRecommendation.includes(
                                  "Approved",
                                ) ? (
                                <CheckCircle
                                  size={16}
                                  className="text-green-600"
                                />
                              ) : item.loanRecommendation.includes("Review") ? (
                                <AlertTriangle
                                  size={16}
                                  className="text-yellow-600"
                                />
                              ) : (
                                <XCircle size={16} className="text-red-600" />
                              )}
                              <p className="font-bold">
                                {activeTab === "consumer"
                                  ? item.eligibilityStatus
                                  : item.loanRecommendation}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() =>
                              setSelectedReport({ type: activeTab, data: item })
                            }
                            className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                          >
                            <Eye size={14} /> View Full
                          </button>
                          <button className="flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100">
                            <Edit size={14} /> Edit
                          </button>
                          <button className="flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100">
                            <FileText size={14} /> Report
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedReport.type === "consumer"
                      ? `${selectedReport.data.customerName} - Consumer CRC Report`
                      : `${selectedReport.data.businessName} - Commercial CRC Report`}
                  </h3>
                  <p className="text-gray-600">
                    Generated on {new Date().toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle size={24} className="text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    {selectedReport.type === "consumer"
                      ? "Personal Information"
                      : "Business Information"}
                  </h4>
                  <div className="space-y-3">
                    {selectedReport.type === "consumer" ? (
                      <>
                        <DetailRow
                          label="Full Name"
                          value={selectedReport.data.customerName}
                        />
                        <DetailRow
                          label="Mobile Number"
                          value={selectedReport.data.mobileNumber}
                        />
                        <DetailRow
                          label="PAN Number"
                          value={selectedReport.data.panNumber}
                        />
                        <DetailRow
                          label="Monthly Income"
                          value={formatCurrency(
                            selectedReport.data.monthlyIncome,
                          )}
                        />
                      </>
                    ) : (
                      <>
                        <DetailRow
                          label="Business Name"
                          value={selectedReport.data.businessName}
                        />
                        <DetailRow
                          label="GST Number"
                          value={selectedReport.data.gstNumber}
                        />
                        <DetailRow
                          label="Annual Turnover"
                          value={formatCurrency(
                            selectedReport.data.annualTurnover,
                          )}
                        />
                        <DetailRow
                          label="Active Loans"
                          value={selectedReport.data.activeLoans}
                        />
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Risk Assessment
                  </h4>
                  <div className="space-y-3">
                    <DetailRow
                      label={
                        selectedReport.type === "consumer"
                          ? "Credit Score"
                          : "Business Risk Rating"
                      }
                      value={
                        selectedReport.type === "consumer"
                          ? selectedReport.data.creditScore
                          : selectedReport.data.businessRiskRating
                      }
                    />
                    <DetailRow
                      label={
                        selectedReport.type === "consumer"
                          ? "Risk Grade"
                          : "Risk Category"
                      }
                      value={
                        selectedReport.type === "consumer"
                          ? selectedReport.data.riskGrade
                          : selectedReport.data.riskCategory
                      }
                    />
                    <DetailRow
                      label={
                        selectedReport.type === "consumer"
                          ? "Overdue Count"
                          : "Legal Alerts"
                      }
                      value={
                        selectedReport.type === "consumer"
                          ? selectedReport.data.overdueCount
                          : selectedReport.data.legalAlerts
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Report ID: CRC-{selectedReport.type.toUpperCase()}-
                    {selectedReport.data.id}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAction("Download PDF")}
                      className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50"
                    >
                      Download PDF
                    </button>
                    <button
                      onClick={() => handleAction("Save to Database")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                    >
                      Save to Database
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component
const DetailRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
    <span className="text-sm font-medium text-gray-600">{label}:</span>
    <span className="text-sm font-semibold text-gray-900">{value}</span>
  </div>
);
