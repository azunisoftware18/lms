import React, { useState, useEffect } from "react";
import {
  Plus,
  Filter,
  X,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Edit2,
  Trash2,
  Home,
  Building2,
  MapPin,
  ChevronDown,
  Calendar,
  DollarSign,
  Grid,
  List,
  Download,
  Share2,
  MoreVertical,
} from "lucide-react";

import StatusCard from "../../../components/common/StatusCard";
import ActionMenu from "../../../components/common/ActionMenu";
import Button from "../../../components/ui/Button";
import SearchField from "../../../components/ui/SearchField";
import SelectField from "../../../components/ui/SelectField";
import Pagination from "../../../components/common/Pagination";
import TechnicalReviewTable from "../../../components/tables/TechnicalReviewTable";
import { colorVariables } from "../../../lib";
import {
  TECHNICAL_REVIEW_REPORTS,
  TECHNICAL_REVIEW_STATISTICS,
} from "../../../lib/LOSDummyData";

const TECHNICAL_REVIEW_ICON_MAP = {
  FileText,
  CheckCircle,
  Clock,
  XCircle,
};

import { useCreateTechnicalReport } from "../../../hooks/useTechnicalReport";
import TechnicalReportForm from "../../../components/forms/TechnicalReportForm";

function TechnicalReportModal({ isOpen, onClose }) {
  const [error, setError] = useState(null);
  const createReport = useCreateTechnicalReport();
  const [formFieldErrors, setFormFieldErrors] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (form, resetForm) => {
    setError(null);
    try {
      await createReport.mutateAsync({
        loanNumber: form.loanNumber,
        data: {
          ...form,
          marketValue: Number(form.marketValue),
          discussionValue: Number(form.discussionValue),
          recommendedLtv: Number(form.recommendedLtv),
          loanApplicationId: form.loanNumber,
        },
      });
      resetForm();
      onClose();
    } catch (err) {
      // If the hook rethrew an enhanced error with fieldErrors, capture them
      const fieldErrors = err?.fieldErrors || err?.original?.response?.data?.errors || null;
      if (fieldErrors) {
        // Pass field-level errors to the form via local state so they render near inputs
        setError(null);
        setFormFieldErrors(fieldErrors);
      } else {
        setError(err?.message || "Failed to create report");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="relative w-full max-w-2xl md:w-[700px] rounded-2xl border border-slate-200 bg-white shadow-2xl flex flex-col max-h-[90vh]"
        style={{ minWidth: 320 }}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800">Create Technical Report</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-4 sm:px-6 py-6 text-sm text-slate-600 flex-1">
          <TechnicalReportForm
            onSubmit={handleSubmit}
            loading={createReport.isLoading}
            error={error}
            serverFieldErrors={formFieldErrors}
          />
        </div>
      </div>
    </div>
  );
}

function TechnicalReportDetailsModal({ isOpen, onClose, report }) {
  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Technical Report Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 px-6 py-5 text-sm">
          <div>
            <span className="text-slate-500">Engineer:</span>{" "}
            <span className="font-medium text-slate-800">
              {report.engineerName}
            </span>
          </div>
          <div>
            <span className="text-slate-500">Agency:</span>{" "}
            <span className="text-slate-800">{report.agencyName}</span>
          </div>
          <div>
            <span className="text-slate-500">Property:</span>{" "}
            <span className="text-slate-800">{report.propertyType}</span>
          </div>
          <div>
            <span className="text-slate-500">Location:</span>{" "}
            <span className="text-slate-800">
              {report.city}, {report.state}
            </span>
          </div>
          <div>
            <span className="text-slate-500">Market Value:</span>{" "}
            <span className="text-slate-800">{report.marketValue}</span>
          </div>
          <div>
            <span className="text-slate-500">Status:</span>{" "}
            <span className="capitalize text-slate-800">{report.status}</span>
          </div>
          <div>
            <span className="text-slate-500">Remarks:</span>{" "}
            <span className="text-slate-800">{report.remarks}</span>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-200 px-6 py-4">
          <Button
            onClick={onClose}
            className="border border-slate-300 bg-white! text-slate-700!"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function TechnicalReviewPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("all");
  const [constructionStatusFilter, setConstructionStatusFilter] =
    useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Device detection with proper cleanup
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
      setIsDesktop(width >= 1024);

      // Auto-switch view mode based on device
      if (width < 640) {
        setViewMode("cards");
      } else if (width >= 640 && width < 1024) {
        // Keep existing view mode for tablet
      } else {
        setViewMode("table");
      }
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  const getReportActions = (report) => [
    {
      label: "View Details",
      icon: <Eye className="w-4 h-4" />,
      onClick: () => handleViewDetails(report),
    },
    {
      label: "Edit Report",
      icon: <Edit2 className="w-4 h-4" />,
      onClick: () => console.log("Edit", report),
    },
    {
      label: "Download PDF",
      icon: <Download className="w-4 h-4" />,
      onClick: () => console.log("Download", report),
    },
    {
      label: "Share",
      icon: <Share2 className="w-4 h-4" />,
      onClick: () => console.log("Share", report),
    },
    {
      label: "Delete",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: () => console.log("Delete", report),
      isDanger: true,
    },
  ];

  const statistics = TECHNICAL_REVIEW_STATISTICS.map((item) => ({
    ...item,
    icon: TECHNICAL_REVIEW_ICON_MAP[item.iconName] || FileText,
  }));
  const reports = TECHNICAL_REVIEW_REPORTS;

  // Get unique cities for filter
  const cities = ["all", ...new Set(reports.map((r) => r.city))];
  const propertyTypeOptions = [
    { value: "all", label: "All Properties" },
    { value: "residential", label: "Residential" },
    { value: "commercial", label: "Commercial" },
    { value: "industrial", label: "Industrial" },
    { value: "land", label: "Land" },
  ];
  const constructionStatusOptions = [
    { value: "all", label: "All Construction" },
    { value: "COMPLETED", label: "Completed" },
    { value: "UNDER_CONSTRUCTION", label: "Under Construction" },
  ];
  const cityOptions = cities.map((city) => ({
    value: city,
    label: city === "all" ? "All Cities" : city,
  }));
  const itemsPerPageOptions = [10, 20, 50].map((item) => ({
    value: item,
    label: `${item} per page`,
  }));

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Approved",
        icon: CheckCircle,
      },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        label: "Pending Review",
        icon: Clock,
      },
      rejected: {
        bg: "bg-red-100",
        text: "text-red-700",
        label: "Rejected",
        icon: XCircle,
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const getQualityBadge = (quality) => {
    const qualityConfig = {
      Excellent: "bg-green-100 text-green-700",
      Good: `${colorVariables.LIGHT_BG} ${colorVariables.PRIMARY_COLOR}`,
      Average: "bg-yellow-100 text-yellow-700",
      Poor: "bg-red-100 text-red-700",
    };

    return (
      <span
        className={`px-2 py-1 text-xs rounded-full ${qualityConfig[quality] || "bg-gray-100 text-gray-700"}`}
      >
        {quality}
      </span>
    );
  };

  const handleViewDetails = (report) => {
    setSelectedReport(report);
    setIsDetailsModalOpen(true);
  };

  const tableActions = [
    {
      label: "View Details",
      icon: <Eye className="w-4 h-4" />,
      onClick: handleViewDetails,
    },
    {
      label: "Edit Report",
      icon: <Edit2 className="w-4 h-4" />,
      onClick: (report) => console.log("Edit", report),
    },
    {
      label: "Download PDF",
      icon: <Download className="w-4 h-4" />,
      onClick: (report) => console.log("Download", report),
    },
    {
      label: "Share",
      icon: <Share2 className="w-4 h-4" />,
      onClick: (report) => console.log("Share", report),
    },
    {
      label: "Delete",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (report) => console.log("Delete", report),
      isDanger: true,
    },
  ];

  const desktopColumns = [
    {
      accessor: "engineerName",
      header: "Engineer",
      render: (value, row) => (
        <div>
          <div className="text-sm font-medium text-slate-800">{value}</div>
          <div className="text-xs text-slate-500">ID: {row.id}</div>
        </div>
      ),
    },
    { accessor: "agencyName", header: "Agency" },
    { accessor: "propertyType", header: "Property" },
    {
      accessor: "city",
      header: "Location",
      render: (value, row) => (
        <div>
          <div className="text-sm text-slate-600">{value}</div>
          <div className="text-xs text-slate-400">{row.state}</div>
        </div>
      ),
    },
    {
      accessor: "marketValue",
      header: "Value",
      render: (value) => (
        <span className="text-sm font-medium text-slate-800">{value}</span>
      ),
    },
    { accessor: "recommendedLtv", header: "LTV" },
    { accessor: "constructionStatus", header: "Construction" },
    {
      accessor: "qualityOfConstruction",
      header: "Quality",
      render: (value) => getQualityBadge(value),
    },
    {
      accessor: "status",
      header: "Status",
      render: (value) => getStatusBadge(value),
    },
  ];

  const resetFilters = () => {
    setSearchTerm("");
    setPropertyTypeFilter("all");
    setConstructionStatusFilter("all");
    setCityFilter("all");
    setIsFilterMenuOpen(false);
  };

  // Filter reports
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      searchTerm === "" ||
      report.engineerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.agencyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPropertyType =
      propertyTypeFilter === "all" ||
      report.propertyType.toLowerCase() === propertyTypeFilter.toLowerCase();

    const matchesConstructionStatus =
      constructionStatusFilter === "all" ||
      report.constructionStatus.replace(" ", "_").toUpperCase() ===
        constructionStatusFilter;

    const matchesCity = cityFilter === "all" || report.city === cityFilter;

    return (
      matchesSearch &&
      matchesPropertyType &&
      matchesConstructionStatus &&
      matchesCity
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Mobile card view
  const MobileReportCard = ({ report }) => (
    <div className="bg-white p-4 rounded-xl border border-slate-200 mb-3 hover:shadow-md transition-all duration-200 active:bg-slate-50">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-800 text-base truncate">
            {report.engineerName}
          </h3>
          <p className="text-xs text-slate-500 truncate">{report.agencyName}</p>
        </div>
        {getStatusBadge(report.status)}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-slate-50 p-2 rounded-lg">
          <p className="text-xs text-slate-400 mb-1">Property</p>
          <p className="text-sm font-medium text-slate-700 truncate">
            {report.propertyType}
          </p>
        </div>
        <div className="bg-slate-50 p-2 rounded-lg">
          <p className="text-xs text-slate-400 mb-1">Location</p>
          <p className="text-sm font-medium text-slate-700 truncate">
            {report.city}
          </p>
        </div>
        <div className="bg-slate-50 p-2 rounded-lg">
          <p className="text-xs text-slate-400 mb-1">Value</p>
          <p className="text-sm font-medium text-slate-700">
            {report.marketValue}
          </p>
        </div>
        <div className="bg-slate-50 p-2 rounded-lg">
          <p className="text-xs text-slate-400 mb-1">LTV</p>
          <p className="text-sm font-medium text-slate-700">
            {report.recommendedLtv}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs px-2 py-1 bg-slate-100 rounded-full text-slate-600">
            {report.constructionStatus}
          </span>
          {getQualityBadge(report.qualityOfConstruction)}
        </div>
        <ActionMenu actions={getReportActions(report)} />
      </div>
    </div>
  );

  // Tablet compact card view
  const TabletCompactCard = ({ report }) => (
    <div className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-slate-800">
            {report.engineerName}
          </h3>
          <p className="text-xs text-slate-500">{report.agencyName}</p>
        </div>
        {getStatusBadge(report.status)}
      </div>

      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-slate-600">{report.propertyType}</span>
        <span className="font-medium text-slate-800">{report.marketValue}</span>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{report.city}</span>
        <span>{report.constructionStatus}</span>
      </div>
    </div>
  );

  // Tablet grid view
  const TabletGridCard = ({ report }) => (
    <div className="bg-white p-5 rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-slate-800">
            {report.engineerName}
          </h3>
          <p className="text-sm text-slate-500">{report.agencyName}</p>
        </div>
        {getStatusBadge(report.status)}
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Home className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600">{report.propertyType}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600">
            {report.city}, {report.state}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600 font-medium">
            {report.marketValue}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600">Updated: {report.lastUpdated}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          {getQualityBadge(report.qualityOfConstruction)}
        </div>
        <ActionMenu actions={getReportActions(report)} />
      </div>
    </div>
  );

  // Tablet list view
  const TabletListItem = ({ report }) => (
    <div className="bg-white p-4 rounded-xl border border-slate-200 mb-3 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-slate-800">
              {report.engineerName}
            </h3>
            {getStatusBadge(report.status)}
          </div>
          <p className="text-sm text-slate-500 mb-3">{report.agencyName}</p>

          <div className="grid grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-xs text-slate-400">Property</p>
              <p className="text-slate-700 font-medium">
                {report.propertyType}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Location</p>
              <p className="text-slate-700">{report.city}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Value</p>
              <p className="text-slate-700 font-medium">{report.marketValue}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Quality</p>
              <div>{getQualityBadge(report.qualityOfConstruction)}</div>
            </div>
          </div>
        </div>

        <ActionMenu actions={getReportActions(report)} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800">
              Technical Review Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-2">
              Manage and review property technical valuation reports
            </p>
          </div>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className={`inline-flex items-center justify-center px-4 sm:px-5 py-2.5 sm:py-3 ${colorVariables.PRIMARY_BUTTON_COLOR} text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md text-xs sm:text-sm font-medium w-full sm:w-auto`}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Report
          </Button>
        </div>

        {/* Statistics Cards - Fully Responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
          {statistics.map((stat) => (
            <div
              key={stat.id}
              className="transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <StatusCard
                title={stat.title}
                value={stat.value}
                subtext={stat.subtext}
                icon={stat.icon}
                variant={stat.iconColor}
              />
            </div>
          ))}
        </div>

        {/* Search and Filters - Responsive */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-3 sm:p-4 lg:p-5 mb-6 lg:mb-8">
          {/* Mobile/Tablet Filter Toggle */}
          <div className="lg:hidden mb-3">
            <button
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 rounded-lg sm:rounded-xl border border-slate-200"
            >
              <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <Filter className="w-4 h-4" />
                Search & Filters
                {filteredReports.length > 0 && (
                  <span
                    className={`ml-2 px-2 py-0.5 ${colorVariables.LIGHT_BG} ${colorVariables.PRIMARY_COLOR} rounded-full text-xs`}
                  >
                    {filteredReports.length} results
                  </span>
                )}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isFilterMenuOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
            {/* Search Input */}
            <div
              className={`${isFilterMenuOpen || isDesktop ? "block" : "hidden"} lg:block flex-1`}
            >
              <SearchField
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                showResults={false}
                placeholder={
                  isMobile
                    ? "Search..."
                    : "Search by engineer, agency, or address..."
                }
              />
            </div>

            {/* Filter Controls */}
            <div
              className={`${isFilterMenuOpen || isDesktop ? "block" : "hidden"} lg:block`}
            >
              <div className="flex flex-col sm:flex-row lg:items-center gap-2 sm:gap-3">
                {/* View Mode Toggle for Tablet */}
                {isTablet && (
                  <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg order-first sm:order-0">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === "grid"
                          ? `bg-white shadow-sm ${colorVariables.PRIMARY_COLOR}`
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                      title="Grid View"
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === "list"
                          ? `bg-white shadow-sm ${colorVariables.PRIMARY_COLOR}`
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                      title="List View"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("compact")}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === "compact"
                          ? `bg-white shadow-sm ${colorVariables.PRIMARY_COLOR}`
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                      title="Compact View"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <SelectField
                  value={propertyTypeFilter}
                  onChange={(value) => setPropertyTypeFilter(value)}
                  options={propertyTypeOptions}
                  className="w-full sm:w-48"
                />

                <SelectField
                  value={constructionStatusFilter}
                  onChange={(value) => setConstructionStatusFilter(value)}
                  options={constructionStatusOptions}
                  className="w-full sm:w-56"
                />

                <SelectField
                  value={cityFilter}
                  onChange={(value) => setCityFilter(value)}
                  options={cityOptions}
                  className="w-full sm:w-48"
                />

                <Button
                  onClick={resetFilters}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-5 py-2.5 sm:py-3 border border-slate-200 rounded-lg sm:rounded-xl hover:bg-slate-50 transition-colors duration-200 text-sm font-medium text-slate-600! bg-white!"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results count and items per page */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-medium">{paginatedReports.length}</span> of{" "}
            <span className="font-medium">{filteredReports.length}</span>{" "}
            reports
          </p>
          {isDesktop && (
            <SelectField
              value={itemsPerPage}
              onChange={(value) => setItemsPerPage(Number(value))}
              options={itemsPerPageOptions}
              className="w-36"
            />
          )}
        </div>

        {/* Reports Display - Responsive layouts */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Desktop Table View */}
          {isDesktop && (
            <TechnicalReviewTable
              columns={desktopColumns}
              data={paginatedReports}
              actions={tableActions}
            />
          )}

          {/* Tablet View */}
          {isTablet && (
            <div className="p-4">
              {paginatedReports.length > 0 ? (
                <>
                  {viewMode === "grid" && (
                    <div className="grid grid-cols-2 gap-4">
                      {paginatedReports.map((report) => (
                        <TabletGridCard key={report.id} report={report} />
                      ))}
                    </div>
                  )}
                  {viewMode === "list" && (
                    <div className="space-y-3">
                      {paginatedReports.map((report) => (
                        <TabletListItem key={report.id} report={report} />
                      ))}
                    </div>
                  )}
                  {viewMode === "compact" && (
                    <div className="grid grid-cols-3 gap-3">
                      {paginatedReports.map((report) => (
                        <TabletCompactCard key={report.id} report={report} />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText className="w-16 h-16 text-slate-300 mb-4" />
                  <p className="text-slate-500 text-lg font-medium">
                    No reports found
                  </p>
                  <p className="text-slate-400 text-sm mt-2">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Mobile View */}
          {isMobile && (
            <div className="p-3">
              {paginatedReports.length > 0 ? (
                paginatedReports.map((report) => (
                  <MobileReportCard key={report.id} report={report} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText className="w-16 h-16 text-slate-300 mb-4" />
                  <p className="text-slate-500 text-base font-medium">
                    No reports found
                  </p>
                  <p className="text-slate-400 text-xs mt-2">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredReports.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            containerClassName="mt-6"
            maxVisiblePages={isMobile ? 3 : 7}
          />
        )}

        {/* Modals */}
        <TechnicalReportModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />

        {selectedReport && (
          <TechnicalReportDetailsModal
            isOpen={isDetailsModalOpen}
            onClose={() => {
              setIsDetailsModalOpen(false);
              setSelectedReport(null);
            }}
            report={selectedReport}
          />
        )}
      </div>
    </div>
  );
}
