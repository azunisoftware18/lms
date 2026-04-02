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
  ChevronDown,
  Grid,
  List,
  Download,
  Share2,
  MoreVertical,
} from "lucide-react";

import ActionMenu from "../../../components/common/ActionMenu";
import { useSelector, shallowEqual } from "react-redux";
import { useLegalReports, useApproveLegalReport, useCreateLegalReport } from "../../../hooks/useLegalReports";

import StatusCard from "../../../components/common/StatusCard";
import Pagination from "../../../components/common/Pagination";
import Button from "../../../components/ui/Button";
import SearchField from "../../../components/ui/SearchField";
import FilterDropdown from "../../../components/ui/FilterDropdown";
import LegalCompilanceTable from "../../../components/tables/core/LegalCompilanceTable.jsx";
import LegalReportTable from "../../../components/tables/core/LegalReportTable.jsx";
import { colorVariables } from "../../../lib";
// NOTE: data will come from API via hook/redux; dummy data removed

function LegalComplianceModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const createMutation = useCreateLegalReport();
  const [form, setForm] = useState({
    loanNumber: "",
    advocateName: "",
    lawFirmName: "",
    ownerName: "",
    ownershipType: "SELF",
    titleClear: true,
    titleChainYears: 1,
    encumbranceFound: false,
    encumbranceDetails: "",
    reraRegistered: false,
    landUserClear: false,
    buildingApproval: false,
    remarks: "",
    reportUrl: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (key, value) => setForm((s) => ({ ...s, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!form.loanNumber || form.loanNumber.trim() === "") errors.loanNumber = "Loan number is required";
    if (!form.advocateName || form.advocateName.trim() === "") errors.advocateName = "Advocate name is required";
    if (!form.ownerName || form.ownerName.trim() === "") errors.ownerName = "Owner name is required";
    if (!form.ownershipType) errors.ownershipType = "Ownership type is required";
    if (typeof form.titleClear !== "boolean") errors.titleClear = "Title clear must be specified";
    if (!form.titleChainYears || Number(form.titleChainYears) < 1) errors.titleChainYears = "Title chain years must be at least 1";
    if (typeof form.encumbranceFound !== "boolean") errors.encumbranceFound = "Encumbrance flag required";
    if (form.encumbranceFound && (!form.encumbranceDetails || form.encumbranceDetails.trim() === "")) errors.encumbranceDetails = "Encumbrance details are required when encumbrance is found";

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      // API hook expects `loanId` param; pass loanNumber as loanId
      await createMutation.mutateAsync({ loanId: form.loanNumber, data: form });
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800">Create Legal Report</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
        <div className="px-6 py-6 text-sm text-slate-600">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <input required placeholder="Loan Number" value={form.loanNumber} onChange={(e) => handleChange('loanNumber', e.target.value)} className="w-full p-2 border rounded" />
              {fieldErrors.loanNumber && <div className="text-red-500 text-xs mt-1">{fieldErrors.loanNumber}</div>}
              <div className="text-xs text-slate-400 mt-1">Enter the loan application number (loanNumber)</div>
            </div>

            <div>
              <input placeholder="Advocate Name" value={form.advocateName} onChange={(e) => handleChange('advocateName', e.target.value)} className="w-full p-2 border rounded" />
              {fieldErrors.advocateName && <div className="text-red-500 text-xs mt-1">{fieldErrors.advocateName}</div>}
            </div>

            <div>
              <input placeholder="Law Firm Name (optional)" value={form.lawFirmName} onChange={(e) => handleChange('lawFirmName', e.target.value)} className="w-full p-2 border rounded" />
            </div>

            <div>
              <input placeholder="Owner Name" value={form.ownerName} onChange={(e) => handleChange('ownerName', e.target.value)} className="w-full p-2 border rounded" />
              {fieldErrors.ownerName && <div className="text-red-500 text-xs mt-1">{fieldErrors.ownerName}</div>}
            </div>

            <div>
              <label className="text-sm">Ownership Type</label>
              <select value={form.ownershipType} onChange={(e) => handleChange('ownershipType', e.target.value)} className="w-full p-2 border rounded">
                <option value="SELF">Self</option>
                <option value="JOINT">Joint</option>
                <option value="INHERITED">Inherited</option>
              </select>
              {fieldErrors.ownershipType && <div className="text-red-500 text-xs mt-1">{fieldErrors.ownershipType}</div>}
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm">Title Clear</label>
              <input type="checkbox" checked={form.titleClear} onChange={(e) => handleChange('titleClear', e.target.checked)} />
              {fieldErrors.titleClear && <div className="text-red-500 text-xs mt-1">{fieldErrors.titleClear}</div>}
            </div>

            <div>
              <label className="text-sm">Title Chain Years</label>
              <input type="number" min={1} value={form.titleChainYears} onChange={(e) => handleChange('titleChainYears', Number(e.target.value))} className="w-full p-2 border rounded" />
              {fieldErrors.titleChainYears && <div className="text-red-500 text-xs mt-1">{fieldErrors.titleChainYears}</div>}
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm">Encumbrance Found</label>
              <input type="checkbox" checked={form.encumbranceFound} onChange={(e) => handleChange('encumbranceFound', e.target.checked)} />
            </div>
            {form.encumbranceFound && (
              <div>
                <textarea placeholder="Encumbrance details" value={form.encumbranceDetails} onChange={(e) => handleChange('encumbranceDetails', e.target.value)} className="w-full p-2 border rounded" />
                {fieldErrors.encumbranceDetails && <div className="text-red-500 text-xs mt-1">{fieldErrors.encumbranceDetails}</div>}
              </div>
            )}

            <div className="flex items-center gap-3">
              <label className="text-sm">RERA Registered</label>
              <input type="checkbox" checked={form.reraRegistered} onChange={(e) => handleChange('reraRegistered', e.target.checked)} />
              <label className="text-sm">Land Use Clear</label>
              <input type="checkbox" checked={form.landUserClear} onChange={(e) => handleChange('landUserClear', e.target.checked)} />
              <label className="text-sm">Building Approval</label>
              <input type="checkbox" checked={form.buildingApproval} onChange={(e) => handleChange('buildingApproval', e.target.checked)} />
            </div>

            <div>
              <input placeholder="Remarks" value={form.remarks} onChange={(e) => handleChange('remarks', e.target.value)} className="w-full p-2 border rounded" />
            </div>
            <div>
              <input placeholder="Report URL" value={form.reportUrl} onChange={(e) => handleChange('reportUrl', e.target.value)} className="w-full p-2 border rounded" />
            </div>
          </div>
        </div>
        <div className="flex justify-end border-t border-slate-200 px-6 py-4">
          <Button type="submit" className="mr-2">Create</Button>
          <Button onClick={onClose} className="bg-white! text-slate-700! border border-slate-300">Close</Button>
        </div>
      </form>
    </div>
  );
}

function LegalComplianceViewModal({ isOpen, report, onClose }) {
  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-2xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Legal Report Details
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-slate-500">Loan Number:</span>{" "}
              <div className="font-medium text-slate-800 break-words">{report.loanNumber ?? report.loanApplication?.loanNumber ?? "-"}</div>
            </div>
            <div>
              <span className="text-slate-500">Status:</span>{" "}
              <div className="uppercase text-slate-800 break-words">{report.status ?? "-"}</div>
            </div>

            <div>
              <span className="text-slate-500">Advocate:</span>{" "}
              <div className="font-medium text-slate-800 break-words">{report.advocateName ?? "-"}</div>
            </div>
            <div>
              <span className="text-slate-500">Law Firm:</span>{" "}
              <div className="text-slate-800 break-words">{report.lawFirmName ?? "-"}</div>
            </div>

            <div>
              <span className="text-slate-500">Owner:</span>{" "}
              <div className="text-slate-800 break-words">{report.ownerName ?? "-"}</div>
            </div>
            <div>
              <span className="text-slate-500">Ownership Type:</span>{" "}
              <div className="text-slate-800 break-words">{report.ownershipType ?? "-"}</div>
            </div>

            <div>
              <span className="text-slate-500">Title Clear:</span>{" "}
              <div className="text-slate-800 break-words">{typeof report.titleClear === 'boolean' ? (report.titleClear ? 'Yes' : 'No') : '-'}</div>
            </div>
            <div>
              <span className="text-slate-500">Title Chain Years:</span>{" "}
              <div className="text-slate-800 break-words">{report.titleChainYears ?? "-"}</div>
            </div>

            <div>
              <span className="text-slate-500">Encumbrance Found:</span>{" "}
              <div className="text-slate-800 break-words">{typeof report.encumbranceFound === 'boolean' ? (report.encumbranceFound ? 'Yes' : 'No') : '-'}</div>
            </div>
            <div>
              <span className="text-slate-500">Encumbrance Details:</span>{" "}
              <div className="text-slate-800 break-words">{report.encumbranceDetails ?? '-'}</div>
            </div>

            <div>
              <span className="text-slate-500">RERA Registered:</span>{" "}
              <div className="text-slate-800 break-words">{typeof report.reraRegistered === 'boolean' ? (report.reraRegistered ? 'Yes' : 'No') : '-'}</div>
            </div>
            <div>
              <span className="text-slate-500">Land Use Clear:</span>{" "}
              <div className="text-slate-800 break-words">{typeof report.landUserClear === 'boolean' ? (report.landUserClear ? 'Yes' : 'No') : '-'}</div>
            </div>

            <div>
              <span className="text-slate-500">Building Approval:</span>{" "}
              <div className="text-slate-800 break-words">{typeof report.buildingApproval === 'boolean' ? (report.buildingApproval ? 'Yes' : 'No') : '-'}</div>
            </div>
            <div>
              <span className="text-slate-500">Submitted At:</span>{" "}
              <div className="text-slate-800 break-words">{report.submittedAt ? new Date(report.submittedAt).toLocaleString() : '-'}</div>
            </div>

            <div>
              <span className="text-slate-500">Approved By:</span>{" "}
              <div className="text-slate-800 break-words">{report.approvedBy ?? '-'}</div>
            </div>
            <div>
              <span className="text-slate-500">Approved At:</span>{" "}
              <div className="text-slate-800 break-words">{report.approvedAt ? new Date(report.approvedAt).toLocaleString() : '-'}</div>
            </div>

            <div className="col-span-2">
              <span className="text-slate-500">Remarks:</span>
              <div className="text-slate-800 break-words">{report.remarks ?? '-'}</div>
            </div>

            <div className="col-span-2">
              <span className="text-slate-500">Report URL:</span>
              <div>
                {report.reportUrl ? (
                  <a href={report.reportUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline break-words">Open report</a>
                ) : (
                  <span className="text-slate-800">-</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end border-t border-slate-200 px-6 py-4">
          <Button
            onClick={onClose}
            className="bg-white! text-slate-700! border border-slate-300"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function LegalCompliancePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("all");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState("grid");

  // Device detection
  const [device, setDevice] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  });

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setDevice({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
        isDesktop: width >= 1024,
      });

      // Auto-set view mode based on device
      if (width < 640) {
        setViewMode("cards");
      } else if (width >= 640 && width < 1024) {
        // Keep existing for tablet
      } else {
        setViewMode("table");
      }
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  const handleView = (report) => {
    setSelectedReport(report);
    setIsViewOpen(true);
  };

  const handleEdit = (report) => {
    console.log("Edit report:", report);
    // Add edit logic here
  };

  const handleDelete = (report) => {
    console.log("Delete report:", report);
    // Add delete logic here
  };

  const approveMutation = useApproveLegalReport();

  const handleApprove = async (report) => {
    try {
      const id = report.id || report._id || report.reportId;
      if (!id) return;
      await approveMutation.mutateAsync(id);
    } catch (err) {
      console.error(err);
    }
  };

  const iconMap = {
    FileText,
    CheckCircle,
    Clock,
    XCircle,
  };

  // Fetch legal reports from API (server-preferred) using hook
  const params = {
    page: currentPage,
    limit: itemsPerPage,
    q: searchTerm || undefined,
    status: statusFilter !== "all" ? statusFilter.toUpperCase() : undefined,
    propertyType: propertyTypeFilter !== "all" ? propertyTypeFilter.toUpperCase() : undefined,
  };
  const { data: apiData, isLoading, error } = useLegalReports(params);
  const reportsFromStore = useSelector(
    (state) => state.legalReport?.legalReports?.data ?? [],
    shallowEqual,
  );
  const metaFromStore = useSelector(
    (state) => state.legalReport?.legalReports?.meta ?? {},
    shallowEqual,
  );

  const reports = apiData?.data ?? reportsFromStore;
  const meta = apiData?.meta ?? metaFromStore;

  // Build statistics from returned data
  const totalCount = meta?.total ?? reports.length;
  const approvedCount = (reports || []).filter((r) => (r.status || "").toString().toUpperCase().includes("APPROV")).length;
  const rejectedCount = (reports || []).filter((r) => (r.status || "").toString().toUpperCase().includes("REJECT")).length;

  const statistics = [
    { id: 1, title: "Total Reports", value: totalCount, subtext: "All legal reports", icon: FileText, iconColor: "blue" },
    { id: 2, title: "Approved", value: approvedCount, subtext: "Approved reports", icon: CheckCircle, iconColor: "green" },
    { id: 3, title: "Rejected", value: rejectedCount, subtext: "Rejected reports", icon: XCircle, iconColor: "red" },
  ];

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

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPropertyTypeFilter("all");
    setIsFilterMenuOpen(false);
    setCurrentPage(1);
  };

  // Filter reports
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      searchTerm === "" ||
      report.engineerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.agencyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.address.toLowerCase().includes(searchTerm.toLowerCase());

    const reportStatus = (report.status || "").toString().toUpperCase();
    const matchesStatus =
      statusFilter === "all" || reportStatus === statusFilter.toString().toUpperCase();
    const matchesPropertyType =
      propertyTypeFilter === "all" ||
      (report.propertyType || "").toString().toUpperCase() === propertyTypeFilter.toString().toUpperCase();

    return matchesSearch && matchesStatus && matchesPropertyType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const statusOptions = [
    { value: "all", label: "All Status", count: reports.length },
    {
      value: "approved",
      label: "Approved",
      count: reports.filter((r) => (r.status || "").toString().toUpperCase() === "APPROVED").length,
    },
    {
      value: "pending",
      label: "Pending",
      count: reports.filter((r) => (r.status || "").toString().toUpperCase() === "PENDING").length,
    },
    {
      value: "rejected",
      label: "Rejected",
      count: reports.filter((r) => (r.status || "").toString().toUpperCase() === "REJECTED").length,
    },
  ];

  const propertyOptions = [
    { value: "all", label: "All Properties", count: reports.length },
    {
      value: "residential",
      label: "Residential",
      count: reports.filter(
        (r) => (r.propertyType || "").toString().toUpperCase() === "RESIDENTIAL",
      ).length,
    },
    {
      value: "commercial",
      label: "Commercial",
      count: reports.filter(
        (r) => (r.propertyType || "").toString().toUpperCase() === "COMMERCIAL",
      ).length,
    },
    {
      value: "industrial",
      label: "Industrial",
      count: reports.filter(
        (r) => (r.propertyType || "").toString().toUpperCase() === "INDUSTRIAL",
      ).length,
    },
    {
      value: "land",
      label: "Land",
      count: reports.filter((r) => (r.propertyType || "").toString().toUpperCase() === "LAND")
        .length,
    },
  ];

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
        <ActionMenu
          actions={[
            {
              label: "View Details",
              icon: <Eye className="w-4 h-4" />,
              onClick: () => handleView(report),
            },
            {
              label: "Edit Report",
              icon: <Edit2 className="w-4 h-4" />,
              onClick: () => handleEdit(report),
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
              onClick: () => handleDelete(report),
              isDanger: true,
            },
          ]}
        />
      </div>
    </div>
  );

  // Tablet compact card
  const TabletCompactCard = ({ report }) => (
    <div className="bg-white p-3 rounded-xl border border-slate-200 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-slate-800 text-sm truncate">
          {report.engineerName}
        </h3>
        {getStatusBadge(report.status)}
      </div>
      <p className="text-xs text-slate-500 mb-2 truncate">
        {report.agencyName}
      </p>
      <div className="flex justify-between text-xs">
        <span className="text-slate-600">{report.propertyType}</span>
        <span className="font-medium text-slate-800">{report.marketValue}</span>
      </div>
    </div>
  );

  // Tablet grid card
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
          <span className="text-slate-600">
            {report.city}, {report.state}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Market Value:</span>
          <span className="font-medium text-slate-800">
            {report.marketValue}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">LTV:</span>
          <span className="font-medium text-slate-800">
            {report.recommendedLtv}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          {getQualityBadge(report.qualityOfConstruction)}
        </div>
        <ActionMenu
          actions={[
            {
              label: "View",
              icon: <Eye className="w-4 h-4" />,
              onClick: () => handleView(report),
            },
            {
              label: "Edit",
              icon: <Edit2 className="w-4 h-4" />,
              onClick: () => handleEdit(report),
            },
            {
              label: "Delete",
              icon: <Trash2 className="w-4 h-4" />,
              onClick: () => handleDelete(report),
              isDanger: true,
            },
          ]}
        />
      </div>
    </div>
  );

  // Tablet list item
  const TabletListItem = ({ report }) => (
    <div className="bg-white p-4 rounded-xl border border-slate-200 mb-3 hover:shadow-md transition-all">
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
        <ActionMenu
          actions={[
            {
              label: "View",
              icon: <Eye className="w-4 h-4" />,
              onClick: () => handleView(report),
            },
            {
              label: "Edit",
              icon: <Edit2 className="w-4 h-4" />,
              onClick: () => handleEdit(report),
            },
            {
              label: "Delete",
              icon: <Trash2 className="w-4 h-4" />,
              onClick: () => handleDelete(report),
              isDanger: true,
            },
          ]}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Main Content */}
      <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800">
              Legal Compliance
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-2">
              Manage and verify property legal compliance reports
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className={`inline-flex items-center justify-center px-4 sm:px-5 py-2.5 sm:py-3 ${colorVariables.PRIMARY_BUTTON_COLOR} text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md text-xs sm:text-sm font-medium w-full sm:w-auto`}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Legal Report
          </Button>
        </div>

        {/* Statistics Cards - Responsive Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
          {statistics.map((stat) => (
            <div
              key={stat.id}
              className="transform transition-all duration-200 hover:scale-105"
            >
              <StatusCard
                title={stat.title}
                value={stat.value}
                subtext={stat.subtext}
                icon={stat.icon}
                variant={
                  stat.iconColor === "green"
                    ? "green"
                    : stat.iconColor === "orange"
                      ? "orange"
                      : stat.iconColor === "red"
                        ? "red"
                        : "blue"
                }
              />
            </div>
          ))}
        </div>

        {/* Search and Filters */}
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
              className={`${isFilterMenuOpen || device.isDesktop ? "block" : "hidden"} lg:block flex-1`}
            >
              <div className="relative">
                <SearchField
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder={
                    device.isMobile
                      ? "Search..."
                      : "Search by engineer, agency, or address..."
                  }
                  showResults={false}
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div
              className={`${isFilterMenuOpen || device.isDesktop ? "block" : "hidden"} lg:block`}
            >
              <div className="flex flex-col sm:flex-row lg:items-center gap-2 sm:gap-3">
                {/* View Mode Toggle for Tablet */}
                {device.isTablet && (
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

                <FilterDropdown
                  value={statusFilter}
                  onChange={(v) => {
                    setStatusFilter(v);
                    setCurrentPage(1);
                  }}
                  options={statusOptions}
                  placeholder="All Status"
                  className="w-full sm:w-auto"
                />

                <FilterDropdown
                  value={propertyTypeFilter}
                  onChange={(v) => {
                    setPropertyTypeFilter(v);
                    setCurrentPage(1);
                  }}
                  options={propertyOptions}
                  placeholder="All Properties"
                  className="w-full sm:w-auto"
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <p className="text-xs sm:text-sm text-slate-500 order-2 sm:order-1">
            Showing{" "}
            <span className="font-medium">{paginatedReports.length}</span> of{" "}
            <span className="font-medium">{filteredReports.length}</span>{" "}
            reports
          </p>
          {device.isDesktop && (
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg bg-white order-1 sm:order-2 w-full sm:w-auto"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          )}
        </div>

        {/* Reports Section - Responsive layouts */}
        {device.isDesktop && (
          <LegalReportTable
            items={paginatedReports}
            loading={isLoading}
            onView={handleView}
            onApprove={handleApprove}
            onDownload={(r) => console.log('download', r)}
            onDelete={handleDelete}
          />
        )}

        {(device.isTablet || device.isMobile) && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Tablet / Mobile: render simple legal cards */}
            <div className="p-4">
              {paginatedReports.length > 0 ? (
                <div className={`${device.isMobile ? "space-y-3" : "grid grid-cols-2 gap-4"}`}>
                  {paginatedReports.map((report) => (
                    <div key={report.id} className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-slate-800 text-sm truncate">{report.loanNumber ?? report.loanApplication?.loanNumber ?? "-"}</h3>
                          <p className="text-xs text-slate-500">{report.advocateName ?? "-"}</p>
                        </div>
                        <div className="text-xs text-slate-600">{(report.submittedAt && new Date(report.submittedAt).toLocaleDateString()) || "-"}</div>
                      </div>

                      <div className="text-sm text-slate-700 mb-2">Owner: {report.ownerName ?? '-'}</div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-slate-500">Ownership: <span className="text-slate-800">{report.ownershipType ?? '-'}</span></div>
                        <div>
                          <ActionMenu actions={[
                            { label: 'View', icon: <Eye className="w-4 h-4" />, onClick: () => handleView(report) },
                            { label: 'Approve', icon: <CheckCircle className="w-4 h-4" />, onClick: () => handleApprove(report) },
                          ]} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText className="w-16 h-16 text-slate-300 mb-4" />
                  <p className="text-slate-500 text-lg font-medium">No reports found</p>
                  <p className="text-slate-400 text-sm mt-2">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pagination */}
        {filteredReports.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Modals */}
      <LegalComplianceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <LegalComplianceViewModal
        isOpen={isViewOpen}
        report={selectedReport}
        onClose={() => setIsViewOpen(false)}
      />
    </div>
  );
}
