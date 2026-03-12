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
import ActionMenu from "../../../components/common/ActionMenu";
import ConfirmationDialog from "../../../components/common/ConfirmationDialog";
import StatusCard from "../../../components/common/StatusCard";
import Pagination from "../../../components/common/Pagination";
import QuickActionCard from "../../../components/common/QuickAction";
import InfoCard from "../../../components/details/InfoCard";
import InfoItem from "../../../components/details/InfoItem";
import CopyableInfoItem from "../../../components/details/CopyableInfoItem";
import TabsNav from "../../../components/details/TabsNav";
import StatusOverviewCard from "../../../components/details/StatusOverviewCard";
import ProfileHeader from "../../../components/details/ProfileHeader";
import PageSkeleton from "../../../components/details/PageSkeleton";
import Button from "../../../components/ui/Button";
import SearchField from "../../../components/ui/SearchField";
import SelectField from "../../../components/ui/SelectField";
import FilterDropdown from "../../../components/ui/FilterDropdown";
import ToastCard from "../../../components/ui/ToastCard";
import ToggleSwitch from "../../../components/ui/ToggleSwitch";
import {
  CRC_COMMERCIAL_DUMMY_DATA,
  CRC_CONSUMER_DUMMY_DATA,
  CRC_ROLES,
  CRC_RISK_FILTER_OPTIONS,
} from "../../../lib/ReportsDummyData";
import { colorVariables } from "../../../lib/index";

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
                <User className={colorVariables.PRIMARY_COLOR} size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{data.customerName}</h3>
                <p className="text-sm text-gray-500">{data.mobileNumber}</p>
              </div>
            </div>
            <div className="space-y-2">
              <CopyableInfoItem
                label="PAN"
                value={data.panNumber}
                icon={CreditCard}
              />
              <InfoItem
                label="Income"
                value={`${formatCurrency(data.monthlyIncome)}/mo`}
              />
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
            className={`${colorVariables.PRIMARY_COLOR} hover:text-blue-700 text-sm font-medium flex items-center gap-1`}
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
                <CopyableInfoItem
                  label="GST"
                  value={data.gstNumber}
                  icon={Globe}
                />
              </div>
            </div>
            <div className="space-y-2">
              <InfoItem
                label="Turnover"
                value={`${formatCurrency(data.annualTurnover)}/yr`}
              />
              <InfoItem label="Active Loans" value={`${data.activeLoans}`} />
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
  const [toast, setToast] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });
  const [confirmDialog, setConfirmDialog] = useState({ open: false });
  const [compactView, setCompactView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const consumerData = CRC_CONSUMER_DUMMY_DATA;
  const commercialData = CRC_COMMERCIAL_DUMMY_DATA;

  const currentData = activeTab === "consumer" ? consumerData : commercialData;
  const ITEMS_PER_PAGE = 3;

  const handleAction = (type) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setToast({
        isOpen: true,
        type: "success",
        title: type,
        message: `${type} completed successfully.`,
      });
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
            <SelectField
              value={userRole}
              onChange={(v) => setUserRole(v)}
              options={[
                {
                  label: "Credit Analyst View",
                  value: CRC_ROLES.creditAnalyst,
                },
                {
                  label: "Credit Manager View",
                  value: CRC_ROLES.creditManager,
                },
                { label: "Admin View", value: CRC_ROLES.admin },
              ]}
              placeholder="Select Role"
            />
            <Button onClick={() => handleAction("Refresh Data")}>
              <RefreshCw size={18} /> Refresh Data
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="mb-4">
              <SearchField
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery("")}
                placeholder="Search by name, PAN, GST, mobile..."
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <QuickActionCard
                title="Save Report"
                subtitle="Save to database"
                icon={Save}
                onClick={() => handleAction("Save Report")}
                variant="blue"
              />
              <QuickActionCard
                title="Export PDF"
                subtitle="Download as PDF"
                icon={Download}
                onClick={() => handleAction("Export PDF")}
                variant="indigo"
              />
              <QuickActionCard
                title="Print Report"
                subtitle="Send to printer"
                icon={Printer}
                onClick={() => handleAction("Print")}
                variant="sky"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <TabsNav
          tabs={["Consumer CRC", "Commercial CRC"]}
          active={activeTab === "consumer" ? "Consumer CRC" : "Commercial CRC"}
          setActive={(t) =>
            setActiveTab(t === "Consumer CRC" ? "consumer" : "commercial")
          }
        />
      </div>

      {isLoading ? (
        <PageSkeleton />
      ) : (
        <>
          {/* Stats */}
          {/* Stats + Compact Toggle */}
          <div className="flex items-center justify-end gap-3 mb-3">
            <span className="text-sm text-gray-600">Compact View</span>
            <ToggleSwitch
              checked={compactView}
              onChange={setCompactView}
              size="sm"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatusCard
              title="Total Assessments"
              value={currentData.length}
              icon={FileText}
              variant="blue"
              trend={{ value: "+12%", isPositive: true }}
            />
            <StatusCard
              title={`Avg. ${activeTab === "consumer" ? "Credit Score" : "Risk Rating"}`}
              value={activeTab === "consumer" ? "725" : "Low-Medium"}
              icon={TrendingUp}
              variant="green"
              trend={{ value: "+5%", isPositive: true }}
            />
            <StatusCard
              title="Approval Rate"
              value={activeTab === "consumer" ? "78%" : "65%"}
              icon={Percent}
              variant="purple"
              trend={{ value: "+3%", isPositive: true }}
            />
            <StatusCard
              title="High Risk Cases"
              value="1"
              icon={AlertTriangle}
              variant="red"
              trend={{ value: "+2", isPositive: false }}
            />
          </div>

          {/* Cards */}
          {!compactView && (
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
          )}

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
                  <FilterDropdown
                    value={filters.riskGrade}
                    onChange={(val) => setFilters({ riskGrade: val })}
                    options={CRC_RISK_FILTER_OPTIONS}
                    placeholder="All Risk Grades"
                  />
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
                                <User
                                  className={colorVariables.PRIMARY_COLOR}
                                  size={18}
                                />
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
                        <ActionMenu
                          actions={[
                            {
                              label: "View Full Report",
                              icon: Eye,
                              onClick: () =>
                                setSelectedReport({
                                  type: activeTab,
                                  data: item,
                                }),
                            },
                            {
                              label: "Edit Record",
                              icon: Edit,
                              onClick: () => {},
                            },
                            {
                              label: "Generate Report",
                              icon: FileText,
                              onClick: () => {},
                              divider: true,
                            },
                          ]}
                        />
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
                <ProfileHeader
                  name={
                    selectedReport.type === "consumer"
                      ? selectedReport.data.customerName
                      : selectedReport.data.businessName
                  }
                  subtitle={`CRC Report • Generated on ${new Date().toLocaleDateString()}`}
                />
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
                <InfoCard
                  title={
                    selectedReport.type === "consumer"
                      ? "Personal Information"
                      : "Business Information"
                  }
                  icon={selectedReport.type === "consumer" ? User : Building}
                >
                  <div className="space-y-3">
                    {selectedReport.type === "consumer" ? (
                      <>
                        <InfoItem
                          label="Full Name"
                          value={selectedReport.data.customerName}
                          icon={User}
                        />
                        <InfoItem
                          label="Mobile Number"
                          value={selectedReport.data.mobileNumber}
                          icon={Phone}
                          copyable
                        />
                        <CopyableInfoItem
                          label="PAN Number"
                          value={selectedReport.data.panNumber}
                          icon={CreditCard}
                        />
                        <InfoItem
                          label="Monthly Income"
                          value={formatCurrency(
                            selectedReport.data.monthlyIncome,
                          )}
                        />
                      </>
                    ) : (
                      <>
                        <InfoItem
                          label="Business Name"
                          value={selectedReport.data.businessName}
                          icon={Building}
                        />
                        <CopyableInfoItem
                          label="GST Number"
                          value={selectedReport.data.gstNumber}
                          icon={Globe}
                        />
                        <InfoItem
                          label="Annual Turnover"
                          value={formatCurrency(
                            selectedReport.data.annualTurnover,
                          )}
                        />
                        <InfoItem
                          label="Active Loans"
                          value={`${selectedReport.data.activeLoans}`}
                        />
                      </>
                    )}
                  </div>
                </InfoCard>

                <InfoCard title="Risk Assessment" icon={Shield}>
                  <div className="space-y-3">
                    <InfoItem
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
                    <InfoItem
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
                    <InfoItem
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
                </InfoCard>
              </div>

              <div className="mt-6">
                <StatusOverviewCard
                  items={
                    selectedReport.type === "consumer"
                      ? [
                          {
                            label: "Suggested Limit",
                            value: formatCurrency(
                              selectedReport.data.suggestedLimit,
                            ),
                          },
                          {
                            label: "Interest Band",
                            value: selectedReport.data.interestBand,
                          },
                          {
                            label: "Eligibility",
                            value: selectedReport.data.eligibilityStatus,
                          },
                          {
                            label: "Last Checked",
                            value: selectedReport.data.lastChecked,
                          },
                        ]
                      : [
                          {
                            label: "Approved Limit",
                            value: formatCurrency(
                              selectedReport.data.approvedLimit,
                            ),
                          },
                          {
                            label: "Risk Category",
                            value: selectedReport.data.riskCategory,
                          },
                          {
                            label: "GST Status",
                            value: selectedReport.data.gstVerification,
                          },
                          {
                            label: "Last Checked",
                            value: selectedReport.data.lastChecked,
                          },
                        ]
                  }
                />
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
                    <Button onClick={() => setConfirmDialog({ open: true })}>
                      Save to Database
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(currentData.length / ITEMS_PER_PAGE)}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Toast Notification */}
      <ToastCard
        isOpen={toast.isOpen}
        onClose={() => setToast((t) => ({ ...t, isOpen: false }))}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        showDeliveryTime={false}
        onButtonClick={() => setToast((t) => ({ ...t, isOpen: false }))}
      />

      {/* Confirm Save Dialog */}
      <ConfirmationDialog
        open={confirmDialog.open}
        title="Save CRC Report"
        description="Are you sure you want to save this CRC report to the database?"
        confirmText="Save"
        showRemark
        onConfirm={() => {
          setConfirmDialog({ open: false });
          handleAction("Save to Database");
        }}
        onCancel={() => setConfirmDialog({ open: false })}
        isPopup
      />
    </div>
  );
}
