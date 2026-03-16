import React, { useState } from "react";
import {
  AlertTriangle,
  TrendingDown,
  Building,
  Users,
  CreditCard,
  Calendar,
  Filter,
  Download,
  Eye,
  PieChart,
  BarChart3,
  DollarSign,
  Percent,
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  XCircle,
  RefreshCw,
  Printer,
  ChevronRight,
} from "lucide-react";
import {
  NPA_REPORTS_DATA,
  NPA_USER_ROLES,
} from "../../../lib/ReportsDummyData";
import { colorVariables } from "../../../lib";
import Button from "../../../components/ui/Button";
import SearchField from "../../../components/ui/SearchField";
import SelectField from "../../../components/ui/SelectField";
import TextAreaField from "../../../components/ui/TextAreaField";
import ToastCard from "../../../components/ui/ToastCard";
import Pagination from "../../../components/common/Pagination";
import StatusCard from "../../../components/common/StatusCard";

const mockNPAData = NPA_REPORTS_DATA;
const userRoles = NPA_USER_ROLES;

// Color configuration using colorVariables
const npaColorConfig = {
  lightBackground: colorVariables.LIGHT_BG,
  primaryBorder: colorVariables.BORDER_COLOR,
  riskHigh: colorVariables.EXECUTIVE_COLOR,
  riskMedium: colorVariables.INDEPENDENT_COLOR,
  riskLow: colorVariables.NOMINEE_COLOR,
};

export default function NPAReportsPage() {
  const [activeTab, setActiveTab] = useState("summary");
  const [filters, setFilters] = useState({
    dateRange: "last_quarter",
    branch: "all",
    product: "all",
    bucketCategory: "all",
    collectionExecutive: "all",
    status: "all",
    overdueRange: "all",
    search: "",
  });
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [editingRemarks, setEditingRemarks] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({
    key: "overdueDays",
    direction: "desc",
  });
  const [userRole, setUserRole] = useState(userRoles.admin); // Default role
  const [toastState, setToastState] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  // Filter data based on user role
  const roleBasedFilter = (data) => {
    if (userRole === userRoles.manager) {
      return data.filter((item) => item.branch === "Main Branch"); // Manager sees only their branch
    } else if (userRole === userRoles.agent) {
      return data.filter((item) => item.collectionExecutive === "Amit Sharma"); // Agent sees only assigned accounts
    }
    return data;
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleDrillDown = (type, value) => {
    setActiveTab("details");
    switch (type) {
      case "bucket":
        handleFilterChange(
          "bucketCategory",
          value.toLowerCase().replace(" ", "_"),
        );
        break;
      case "branch":
        handleFilterChange("branch", value.toLowerCase().replace(" ", "_"));
        break;
      case "product":
        handleFilterChange("product", value.toLowerCase().replace(" ", "_"));
        break;
    }
  };

  const filteredDetails = roleBasedFilter(mockNPAData.details).filter(
    (item) => {
      return (
        (filters.branch === "all" ||
          item.branch.toLowerCase().replace(" ", "_") === filters.branch) &&
        (filters.product === "all" ||
          item.product.toLowerCase().replace(" ", "_") === filters.product) &&
        (filters.status === "all" || item.status === filters.status) &&
        (filters.collectionExecutive === "all" ||
          item.collectionExecutive === filters.collectionExecutive) &&
        (filters.overdueRange === "all" ||
          (filters.overdueRange === "30-59" &&
            item.overdueDays >= 30 &&
            item.overdueDays <= 59) ||
          (filters.overdueRange === "60-89" &&
            item.overdueDays >= 60 &&
            item.overdueDays <= 89) ||
          (filters.overdueRange === "90-119" &&
            item.overdueDays >= 90 &&
            item.overdueDays <= 119) ||
          (filters.overdueRange === "120+" && item.overdueDays >= 120)) &&
        (filters.search === "" ||
          item.customerName
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          item.accountNumber
            .toLowerCase()
            .includes(filters.search.toLowerCase()))
      );
    },
  );

  // Sort filtered details
  const sortedDetails = [...filteredDetails].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedDetails.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedDetails.length / itemsPerPage);

  const getRiskColor = (days) => {
    if (days >= 90) return "bg-red-50 border-red-200";
    if (days >= 60) return "bg-orange-50 border-orange-200";
    if (days >= 30) return "bg-yellow-50 border-yellow-200";
    return "bg-green-50 border-green-200";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "legal":
        return npaColorConfig.riskHigh;
      case "settlement":
        return npaColorConfig.riskLow;
      case "follow-up":
        return npaColorConfig.riskMedium;
      default:
        return colorVariables.DEFAULT_COLOR;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const exportToExcel = () => {
    setToastState({
      isOpen: true,
      type: "success",
      title: "Excel Export Successful",
      message: "Your NPA report has been exported to Excel",
    });
  };

  const exportToPDF = () => {
    setToastState({
      isOpen: true,
      type: "success",
      title: "PDF Export Successful",
      message: "Your NPA report has been exported to PDF",
    });
  };

  const handleDetailOpen = (item) => {
    setSelectedDetail(item);
    setEditingRemarks(item.remarks);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-linear-to-r from-red-600 to-orange-600 p-2 rounded-xl">
                <AlertTriangle className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Non-Performing Assets (NPA) Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                  Monitor and manage non-performing loans with real-time
                  insights
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <SelectField
              value={userRole}
              onChange={(value) => setUserRole(value)}
              options={[
                { value: userRoles.admin, label: "Admin View" },
                { value: userRoles.manager, label: "Manager View" },
                { value: userRoles.agent, label: "Collection Agent View" },
              ]}
              placeholder="Select View"
              className="min-w-100"
            />
            <Button onClick={() => window.location.reload()}>
              <RefreshCw size={18} />
              Refresh
            </Button>
            <Button className="bg-linear-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700">
              <Printer size={18} />
              Print Report
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 overflow-x-auto">
          <button
            className={`px-3 sm:px-4 md:px-6 py-3 font-medium text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap ${activeTab === "summary" ? "border-red-600 text-red-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab("summary")}
          >
            <div className="flex items-center gap-2">
              <PieChart size={16} className="sm:block" />
              <span className="hidden sm:inline">Summary Overview</span>
              <span className="sm:hidden">Summary</span>
            </div>
          </button>
          <button
            className={`px-3 sm:px-4 md:px-6 py-3 font-medium text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap ${activeTab === "details" ? "border-red-600 text-red-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab("details")}
          >
            <div className="flex items-center gap-2">
              <FileText size={16} className="sm:block" />
              <span className="hidden sm:inline">Customer Details</span>
              <span className="sm:hidden">Details</span>
            </div>
          </button>
        </div>
      </div>

      {/* KPI Cards using StatusCard Component */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatusCard
          title="Total Loan Portfolio"
          value={formatCurrency(mockNPAData.summary.totalPortfolio)}
          icon={DollarSign}
          variant="blue"
          trend={{ value: 2.3, isPositive: true }}
        />
        <StatusCard
          title="Total NPA Amount"
          value={formatCurrency(mockNPAData.summary.totalNPA)}
          icon={TrendingDown}
          variant="red"
          trend={{ value: 5.1, isPositive: false }}
        />
        <StatusCard
          title="NPA Percentage"
          value={`${mockNPAData.summary.npaPercentage.toFixed(1)}%`}
          icon={Percent}
          variant="orange"
          trend={{ value: 0.8, isPositive: false }}
        />
        <StatusCard
          title="Critical NPA (90+ days)"
          value={mockNPAData.summary.criticalNPACount}
          icon={AlertTriangle}
          variant="purple"
          trend={{ value: 3, isPositive: false }}
        />
      </div>

      {activeTab === "summary" ? (
        /* Summary View */
        <div className="space-y-6">
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* NPA by Bucket */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    NPA by Overdue Bucket
                  </h3>
                  <p className="text-sm text-gray-500">
                    Days overdue distribution
                  </p>
                </div>
                <BarChart3 className="text-gray-400" size={20} />
              </div>
              <div className="space-y-4">
                {mockNPAData.summary.npaByBucket.map((bucket, idx) => (
                  <div
                    key={idx}
                    className="group cursor-pointer"
                    onClick={() => handleDrillDown("bucket", bucket.bucket)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {bucket.bucket}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(bucket.amount)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-lineart-to-r from-red-500 to-orange-500 h-2 rounded-full"
                          style={{ width: `${bucket.percentage}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {bucket.count} accounts
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {bucket.percentage}%
                        </span>
                        <ChevronRight
                          size={16}
                          className="text-gray-400 group-hover:text-red-600"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* NPA by Product */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    NPA by Product Type
                  </h3>
                  <p className="text-sm text-gray-500">
                    Loan product distribution
                  </p>
                </div>
                <PieChart className="text-gray-400" size={20} />
              </div>
              <div className="space-y-4">
                {mockNPAData.summary.npaByProduct.map((product, idx) => (
                  <div
                    key={idx}
                    className="group cursor-pointer"
                    onClick={() => handleDrillDown("product", product.product)}
                  >
                    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-r from-red-50 to-orange-50 rounded-lg flex items-center justify-center">
                          <CreditCard size={18} className="text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {product.product}
                          </p>
                          <p className="text-xs text-gray-500">
                            {product.percentage}% of total NPA
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(product.amount)}
                        </p>
                        <ChevronRight
                          size={16}
                          className="text-gray-400 group-hover:text-red-600 ml-auto"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Branch Summary Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Branch-wise NPA Summary
                  </h3>
                  <p className="text-sm text-gray-500">
                    Performance across branches
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 w-full sm:w-auto">
                    <Calendar size={16} className="text-gray-500" />
                    <select className="bg-transparent outline-none text-sm w-full sm:w-auto">
                      <option>Last Quarter</option>
                      <option>Last Month</option>
                      <option>Year to Date</option>
                    </select>
                  </div>
                  <button className="flex items-center justify-center sm:justify-start gap-2 text-red-600 hover:text-red-700 text-sm font-medium">
                    <Download size={18} />
                    Export
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-140 sm:min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 sm:p-4 text-left text-xs sm:text-sm font-medium text-gray-700 w-[34%]">
                      Branch
                    </th>
                    <th className="p-2 sm:p-4 text-left text-xs sm:text-sm font-medium text-gray-700 hidden sm:table-cell">
                      Total Loans
                    </th>
                    <th className="p-2 sm:p-4 text-left text-xs sm:text-sm font-medium text-gray-700 w-[30%]">
                      NPA Amount
                    </th>
                    <th className="p-2 sm:p-4 text-left text-xs sm:text-sm font-medium text-gray-700 w-[16%]">
                      NPA %
                    </th>
                    <th className="p-2 sm:p-4 text-left text-xs sm:text-sm font-medium text-gray-700 hidden md:table-cell">
                      Active NPA Loans
                    </th>
                    <th className="p-2 sm:p-4 text-left text-xs sm:text-sm font-medium text-gray-700 w-[20%]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockNPAData.summary.npaByBranch.map((branch, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="p-2 sm:p-4 align-top">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Building
                            size={16}
                            className="text-gray-400 shrink-0"
                          />
                          <span className="font-medium text-gray-900 truncate text-sm">
                            {branch.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-2 sm:p-4 text-gray-900 hidden sm:table-cell text-sm">
                        {branch.totalLoans}
                      </td>
                      <td className="p-2 sm:p-4 align-top">
                        <div className="space-y-1.5">
                          <span className="font-semibold text-red-600 text-xs sm:text-sm block truncate">
                            {formatCurrency(branch.amount)}
                          </span>
                          <div className="w-full sm:w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-red-500 h-2 rounded-full"
                              style={{ width: `${branch.percentage}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-2 sm:p-4">
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium inline-block ${branch.percentage > 20 ? "bg-red-100 text-red-800" : branch.percentage > 15 ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"}`}
                        >
                          {branch.percentage}%
                        </span>
                      </td>
                      <td className="p-2 sm:p-4 text-gray-900 hidden md:table-cell text-sm">
                        {branch.npaLoans}
                      </td>
                      <td className="p-2 sm:p-4 align-top">
                        <button
                          onClick={() => handleDrillDown("branch", branch.name)}
                          className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium inline-flex items-center gap-1 whitespace-nowrap"
                        >
                          <span className="sm:hidden">View</span>
                          <span className="hidden sm:inline">View Details</span>
                          <ExternalLink size={12} className="sm:block" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Details View */
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex-1">
                  <SearchField
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                    placeholder="Search customer, account number..."
                    showResults={false}
                  />
                </div>
                <Button
                  className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                  onClick={exportToExcel}
                >
                  <Download size={18} />
                  <span className="hidden sm:inline">Excel</span>
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                  onClick={exportToPDF}
                >
                  <FileText size={18} />
                  <span className="hidden sm:inline">PDF</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <SelectField
                label="Branch"
                value={filters.branch}
                onChange={(value) => handleFilterChange("branch", value)}
                options={[
                  { value: "all", label: "All Branches" },
                  { value: "main_branch", label: "Main Branch" },
                  { value: "downtown", label: "Downtown" },
                  { value: "westside", label: "Westside" },
                  { value: "east_end", label: "East End" },
                  { value: "northgate", label: "Northgate" },
                ]}
              />
              <SelectField
                label="Product"
                value={filters.product}
                onChange={(value) => handleFilterChange("product", value)}
                options={[
                  { value: "all", label: "All Products" },
                  { value: "home_loan", label: "Home Loan" },
                  { value: "personal_loan", label: "Personal Loan" },
                  { value: "business_loan", label: "Business Loan" },
                  { value: "auto_loan", label: "Auto Loan" },
                ]}
              />
              <SelectField
                label="Bucket"
                value={filters.bucketCategory}
                onChange={(value) =>
                  handleFilterChange("bucketCategory", value)
                }
                options={[
                  { value: "all", label: "All Buckets" },
                  { value: "30-59", label: "30-59 days" },
                  { value: "60-89", label: "60-89 days" },
                  { value: "90-119", label: "90-119 days" },
                  { value: "120+", label: "120+ days" },
                ]}
              />
              <SelectField
                label="Collection Executive"
                value={filters.collectionExecutive}
                onChange={(value) =>
                  handleFilterChange("collectionExecutive", value)
                }
                options={[
                  { value: "all", label: "All Executives" },
                  { value: "Amit Sharma", label: "Amit Sharma" },
                  { value: "Neha Verma", label: "Neha Verma" },
                  { value: "Rohit Mehta", label: "Rohit Mehta" },
                ]}
              />
              <SelectField
                label="Status"
                value={filters.status}
                onChange={(value) => handleFilterChange("status", value)}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "legal", label: "Legal" },
                  { value: "settlement", label: "Settlement" },
                  { value: "follow-up", label: "Follow-up" },
                ]}
              />
              <SelectField
                label="Overdue Days"
                value={filters.overdueRange}
                onChange={(value) => handleFilterChange("overdueRange", value)}
                options={[
                  { value: "all", label: "All Ranges" },
                  { value: "30-59", label: "30-59 days" },
                  { value: "60-89", label: "60-89 days" },
                  { value: "90-119", label: "90-119 days" },
                  { value: "120+", label: "120+ days" },
                ]}
              />
            </div>
          </div>

          {/* Customer Details Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    NPA Customer Details
                  </h3>
                  <p className="text-sm text-gray-500">
                    Showing {currentItems.length} of {sortedDetails.length}{" "}
                    accounts
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500">
                  <span>Sorted by:</span>
                  <button
                    onClick={() => handleSort("overdueDays")}
                    className="font-medium text-gray-700 hover:text-gray-900 whitespace-nowrap"
                  >
                    Overdue Days{" "}
                    {sortConfig.key === "overdueDays" &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </button>
                  <span className="hidden sm:inline mx-2">|</span>
                  <button
                    onClick={() => handleSort("outstandingBalance")}
                    className="font-medium text-gray-700 hover:text-gray-900 whitespace-nowrap"
                  >
                    Balance{" "}
                    {sortConfig.key === "outstandingBalance" &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 sm:p-4 text-left text-xs sm:text-sm font-medium text-gray-700">
                      Customer
                    </th>
                    <th className="p-2 sm:p-4 text-left text-xs sm:text-sm font-medium text-gray-700 hidden md:table-cell">
                      Loan Details
                    </th>
                    <th className="p-2 sm:p-4 text-left text-xs sm:text-sm font-medium text-gray-700">
                      Overdue
                    </th>
                    <th className="p-2 sm:p-4 text-left text-xs sm:text-sm font-medium text-gray-700 hidden lg:table-cell">
                      Outstanding
                    </th>
                    <th className="p-2 sm:p-4 text-left text-xs sm:text-sm font-medium text-gray-700 hidden lg:table-cell">
                      Collection
                    </th>
                    <th className="p-2 sm:p-4 text-left text-xs sm:text-sm font-medium text-gray-700 hidden sm:table-cell">
                      Status
                    </th>
                    <th className="p-2 sm:p-4 text-left text-xs sm:text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentItems.map((item) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50 text-xs sm:text-sm ${getRiskColor(item.overdueDays)}`}
                    >
                      <td className="p-2 sm:p-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-r from-red-100 to-orange-100 rounded-lg flex items-center justify-center shrink-0">
                            <User className="text-red-600" size={16} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate">
                              {item.customerName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {item.accountNumber}
                            </p>
                            <div className="flex items-center gap-1 mt-1 flex-wrap">
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">
                                <Building size={8} />
                                {item.branch}
                              </span>
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">
                                <CreditCard size={8} />
                                {item.product}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-2 sm:p-4 hidden md:table-cell">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">EMI:</span>
                            <span className="font-medium">
                              {formatCurrency(item.emiAmount)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Last Paid:</span>
                            <span>
                              {new Date(
                                item.lastPaymentDate,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Loan Date:</span>
                            <span>
                              {new Date(item.loanDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-2 sm:p-4">
                        <div className="text-center">
                          <span
                            className={`text-lg sm:text-2xl font-bold ${item.overdueDays >= 90 ? "text-red-600" : item.overdueDays >= 60 ? "text-orange-600" : "text-yellow-600"}`}
                          >
                            {item.overdueDays}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">days</p>
                          {item.overdueDays >= 90 && (
                            <div className="mt-2">
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                <AlertTriangle size={10} />
                                <span className="hidden sm:inline">
                                  Critical
                                </span>
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-2 sm:p-4 hidden lg:table-cell">
                        <div className="space-y-2">
                          <p className="font-bold text-gray-900">
                            {formatCurrency(item.outstandingBalance)}
                          </p>
                          <div className="text-xs text-gray-500 space-y-1">
                            <div className="flex items-center justify-between">
                              <span>Rate:</span>
                              <span>{item.interestRate}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Tenure:</span>
                              <span>{item.tenure}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-2 sm:p-4 hidden lg:table-cell">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                              <Users size={12} className="text-blue-600" />
                            </div>
                            <span className="font-medium text-gray-900 text-xs sm:text-sm">
                              {item.collectionExecutive}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Phone size={10} className="text-gray-400" />
                            <span className="text-gray-600">
                              {item.contact}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Mail size={10} className="text-gray-400" />
                            <span className="text-gray-600 truncate">
                              {item.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-2 sm:p-4 hidden sm:table-cell">
                        <div className="space-y-2">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}
                          >
                            {item.status.charAt(0).toUpperCase() +
                              item.status.slice(1)}
                          </span>
                          <p className="text-xs text-gray-600 line-clamp-1">
                            {item.remarks}
                          </p>
                        </div>
                      </td>
                      <td className="p-2 sm:p-4">
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handleDetailOpen(item)}
                            className="flex items-center justify-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-xs sm:text-sm whitespace-nowrap"
                          >
                            <Eye size={12} className="sm:block" />
                            <span className="hidden sm:inline">View</span>
                            <span className="sm:hidden">V</span>
                          </button>
                          <button className="flex items-center justify-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 text-xs sm:text-sm whitespace-nowrap">
                            <Phone size={12} className="sm:block" />
                            <span className="hidden sm:inline">Call</span>
                            <span className="sm:hidden">C</span>
                          </button>
                          <button className="flex items-center justify-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 text-xs sm:text-sm whitespace-nowrap">
                            <FileText size={12} className="sm:block" />
                            <span className="hidden sm:inline">Notes</span>
                            <span className="sm:hidden">N</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination using Pagination Component */}
            {totalPages > 1 && (
              <div className="p-2 sm:p-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs sm:text-sm text-gray-500">
                    Page {currentPage} of {totalPages} • {sortedDetails.length}{" "}
                    records
                  </div>
                  <div className="overflow-x-auto">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      maxVisiblePages={5}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Customer Detail Modal */}
      {selectedDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                    {selectedDetail.customerName}
                  </h3>
                  <p className="text-gray-600 text-sm truncate">
                    {selectedDetail.accountNumber} • {selectedDetail.branch}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDetail(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg shrink-0"
                >
                  <XCircle size={24} className="text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
                      Customer Information
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-400 shrink-0" />
                        <span className="text-gray-600 truncate">
                          {selectedDetail.customerName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-gray-400 shrink-0" />
                        <span className="text-gray-600 truncate">
                          {selectedDetail.contact}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-400 shrink-0" />
                        <span className="text-gray-600 truncate">
                          {selectedDetail.email}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin
                          size={16}
                          className="text-gray-400 mt-1 shrink-0"
                        />
                        <span className="text-gray-600">
                          {selectedDetail.address}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
                      Loan Details
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-gray-500">Product Type</p>
                        <p className="font-medium">{selectedDetail.product}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Loan Date</p>
                        <p className="font-medium">
                          {new Date(
                            selectedDetail.loanDate,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Interest Rate</p>
                        <p className="font-medium">
                          {selectedDetail.interestRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Tenure</p>
                        <p className="font-medium">{selectedDetail.tenure}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-red-50 rounded-xl p-3 sm:p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
                      NPA Status
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">
                          Overdue Days
                        </span>
                        <span className="text-xl sm:text-2xl font-bold text-red-600">
                          {selectedDetail.overdueDays}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">
                          Outstanding Balance
                        </span>
                        <span className="text-lg sm:text-xl font-bold text-gray-900">
                          {formatCurrency(selectedDetail.outstandingBalance)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">
                          Monthly EMI
                        </span>
                        <span className="font-medium">
                          {formatCurrency(selectedDetail.emiAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">
                          Last Payment
                        </span>
                        <span className="font-medium">
                          {new Date(
                            selectedDetail.lastPaymentDate,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
                      Collection Information
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-gray-400" />
                          <span className="text-gray-600">Executive</span>
                        </div>
                        <span className="font-medium">
                          {selectedDetail.collectionExecutive}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Current Status
                        </p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedDetail.status)}`}
                        >
                          {selectedDetail.status.charAt(0).toUpperCase() +
                            selectedDetail.status.slice(1)}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Remarks</p>
                        <TextAreaField
                          value={editingRemarks}
                          onChange={(e) => setEditingRemarks(e.target.value)}
                          label=""
                          placeholder="Add or edit remarks..."
                          rows={3}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 text-sm font-medium">
                  View Full History
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-medium">
                  Initiate Recovery
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <ToastCard
        isOpen={toastState.isOpen}
        onClose={() => setToastState({ ...toastState, isOpen: false })}
        type={toastState.type}
        title={toastState.title}
        message={toastState.message}
        showDeliveryTime={false}
        buttonText="OK"
      />
    </div>
  );
}
