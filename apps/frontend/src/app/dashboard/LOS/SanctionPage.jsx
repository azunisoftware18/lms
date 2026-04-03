import React, { useState, useEffect } from "react";
import {
  Plus,
  Filter,
  X,
  Eye,
  Edit2,
  Trash2,
  Download,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  FileCheck,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  Home,
  Building2,
  ChevronDown,
  Grid,
  List,
  MoreVertical,
  FileText,
} from "lucide-react";
import StatusCard from "../../../components/common/StatusCard";
import ActionMenu from "../../../components/common/ActionMenu";
import ConfirmationDialog from "../../../components/common/ConfirmationDialog";

import Pagination from "../../../components/common/Pagination";
import Button from "../../../components/ui/Button";
import SearchField from "../../../components/ui/SearchField";
import FilterDropdown from "../../../components/ui/FilterDropdown";
import SelectField from "../../../components/ui/SelectField";
import SanctionTable from "../../../components/tables/SanctionTable";
import { colorVariables } from "../../../lib";
import { SANCTION_LOAN_TYPES, SANCTION_STATISTICS } from "../../../lib/LOSDummyData";
import { useSanctions, useCreateSanction } from "../../../hooks/useSanction";
import { useLoanApplications } from "../../../hooks/useLoanApplication";
import { useSelector } from "react-redux";

function CreateSanctionModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const mutation = useCreateSanction();
  const [form, setForm] = React.useState({
    loanNumber: "",
    sanctionedAmount: "",
    currency: "INR",
    interestRate: "",
    tenureMonths: "",
    latePaymentFee: "",
    latePaymentFeeType: "FIXED",
    remarks: "",
    documents: { sanctionLetter: "" },
  });

  const onChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async () => {
    try {
      await mutation.mutateAsync({
        loanNumber: form.loanNumber,
        sanctionedAmount: Number(form.sanctionedAmount),
        currency: form.currency,
        interestRate: form.interestRate ? Number(form.interestRate) : undefined,
        tenureMonths: form.tenureMonths ? Number(form.tenureMonths) : undefined,
        latePaymentFee: form.latePaymentFee ? Number(form.latePaymentFee) : undefined,
        latePaymentFeeType: form.latePaymentFeeType,
        remarks: form.remarks,
        documents: { sanctionLetter: form.documents.sanctionLetter },
      });
      onClose();
    } catch (err) {
      // error handled in hook
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800">Create Loan Sanction</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-6 text-sm text-slate-600">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input placeholder="Loan Number" value={form.loanNumber} onChange={(e)=>onChange('loanNumber', e.target.value)} className="p-2 border rounded" />
            <input placeholder="Sanctioned Amount" type="number" value={form.sanctionedAmount} onChange={(e)=>onChange('sanctionedAmount', e.target.value)} className="p-2 border rounded" />
            <input placeholder="Interest Rate" type="number" value={form.interestRate} onChange={(e)=>onChange('interestRate', e.target.value)} className="p-2 border rounded" />
            <input placeholder="Tenure Months" type="number" value={form.tenureMonths} onChange={(e)=>onChange('tenureMonths', e.target.value)} className="p-2 border rounded" />
            <input placeholder="Late Payment Fee" type="number" value={form.latePaymentFee} onChange={(e)=>onChange('latePaymentFee', e.target.value)} className="p-2 border rounded" />
            <select value={form.latePaymentFeeType} onChange={(e)=>onChange('latePaymentFeeType', e.target.value)} className="p-2 border rounded">
              <option value="FIXED">FIXED</option>
              <option value="PERCENTAGE">PERCENTAGE</option>
            </select>
            <input placeholder="Sanction Letter URL" value={form.documents.sanctionLetter} onChange={(e)=>setForm(f=>({...f, documents: { sanctionLetter: e.target.value }}))} className="col-span-1 sm:col-span-2 p-2 border rounded" />
            <textarea placeholder="Remarks" value={form.remarks} onChange={(e)=>onChange('remarks', e.target.value)} className="col-span-1 sm:col-span-2 p-2 border rounded" />
          </div>
        </div>
        <div className="flex justify-end border-t border-slate-200 px-6 py-4">
          <Button onClick={onClose} className="bg-white! text-slate-700! border border-slate-300 mr-2">Cancel</Button>
          <Button onClick={submit} className="bg-blue-600 text-white">Create</Button>
        </div>
      </div>
    </div>
  );
}

function SanctionDetailsModal({ isOpen, onClose, sanction }) {
  if (!isOpen || !sanction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Sanction Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-3 px-6 py-5 text-sm max-h-96 overflow-y-auto">
          <div>
            <span className="text-slate-500">Loan Number:</span>{" "}
            <span className="font-medium text-slate-800">
              {sanction.loanNumber}
            </span>
          </div>
          <div>
            <span className="text-slate-500">Applicant:</span>{" "}
            <span className="text-slate-800">{sanction.applicantName}</span>
          </div>
          <div>
            <span className="text-slate-500">Loan Type:</span>{" "}
            <span className="text-slate-800">{sanction.loanType}</span>
          </div>
          <div>
            <span className="text-slate-500">Branch:</span>{" "}
            <span className="text-slate-800">{sanction.branch}</span>
          </div>
          <div>
            <span className="text-slate-500">Requested Amount:</span>{" "}
            <span className="text-slate-800">{sanction.requestedAmount}</span>
          </div>
          <div>
            <span className="text-slate-500">Sanctioned Amount:</span>{" "}
            <span className="text-slate-800">{sanction.sanctionedAmount}</span>
          </div>
          <div>
            <span className="text-slate-500">Interest Rate:</span>{" "}
            <span className="text-slate-800">{sanction.interestRate}</span>
          </div>
          <div>
            <span className="text-slate-500">Tenure:</span>{" "}
            <span className="text-slate-800">{sanction.tenure}</span>
          </div>
          <div>
            <span className="text-slate-500">Status:</span>{" "}
            <span className="uppercase text-slate-800">{sanction.status}</span>
          </div>
          <div>
            <span className="text-slate-500">Sanction Date:</span>{" "}
            <span className="text-slate-800">{sanction.sanctionDate}</span>
          </div>
          <div>
            <span className="text-slate-500">Remarks:</span>{" "}
            <span className="text-slate-800">{sanction.remarks}</span>
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

export default function SanctionPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSanction, setSelectedSanction] = useState(null);
  const [sanctionToDelete, setSanctionToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loanTypeFilter, setLoanTypeFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState("table");

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
        setViewMode("grid");
      } else {
        setViewMode("table");
      }
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  const sanctionIconMap = {
    FileCheck,
    CheckCircle,
    Clock,
    XCircle,
  };

  

  // Load sanctions and loan applications from API/store
  const { data: apiData, isLoading: sanctionsLoading } = useSanctions({
    page: currentPage,
    limit: itemsPerPage,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  // Load loan applications to show in the table
  const { data: loanApiData, isLoading: loansLoading } = useLoanApplications({
    page: currentPage,
    limit: itemsPerPage,
    q: searchTerm || undefined,
  });

  const loanApplicationsFromStore = useSelector((s) => s.loanApplication?.loanApplications || []);

  // Prefer the query result when available, otherwise fall back to the store
  // Try multiple common response shapes: array, { data: [...] }, { data: { data: [...] } }
  const rawLoanList = Array.isArray(loanApiData)
    ? loanApiData
    : Array.isArray(loanApiData?.data)
    ? loanApiData.data
    : Array.isArray(loanApiData?.data?.data)
    ? loanApiData.data.data
    : loanApplicationsFromStore;

  React.useEffect(() => {
    // Debug: inspect API/store shapes when troubleshooting empty table
    // Remove in production
    // eslint-disable-next-line no-console
    console.debug("SanctionPage rawLoanList shape:", {
      loanApiData,
      loanApplicationsFromStore,
      rawLoanListPreview: Array.isArray(rawLoanList) ? rawLoanList.slice(0, 5) : rawLoanList,
    });
  }, [loanApiData, loanApplicationsFromStore]);

  // Map loan applications to the table shape expected by SanctionTable
  const mappedLoanApplications = (rawLoanList || []).map((l) => ({
    id: l.id,
    loanNumber: l.loanNumber,
    applicantName:
      (l.customer && (l.customer.firstName || l.customer.lastName))
        ? `${l.customer.firstName || ""} ${l.customer.lastName || ""}`.trim()
        : (l.applicantName || ""),
    loanType: l.loanTypeName  || "",
    requestedAmount: l.requestedAmount || l.requestedAmount || "",
    sanctionedAmount: l.approvedAmount ?? "",
    interestRate: l.interestRate ?? "",
    tenure: l.tenureMonths ?? l.tenure ?? "",
    branch:
      (l.branch && (l.branch.name || l.branch.id)) ||
      l.branchName ||
      l.branchId ||
      "",
    // Normalize status values to expected lower-case keys used by UI
    // Preserve 'approved' as its own status (do not map to 'sanctioned')
    status: (() => {
      const raw = l.status ?? l.applicationStatus ?? "";
      const s = String(raw).toLowerCase();
      if (!s) return "pending"; // default to pending when unknown
      if (s === "approved") return "approved";
      if (s === "sanctioned") return "sanctioned";
      return s;
    })(),
    sanctionDate: l.approvedAt || l.createdAt || "",
  }));

  const sanctions = mappedLoanApplications; // show loan applications in the sanction table

  // Build real statistics based on current sanctions data (counts + last-updated dates)
  const computeLastUpdated = (items) => {
    if (!items || items.length === 0) return null;
    const dates = items
      .map((it) => it.sanctionDate || it.updatedAt || it.createdAt)
      .filter(Boolean)
      .map((d) => new Date(d));
    if (!dates.length) return null;
    const max = new Date(Math.max(...dates.map((d) => d.getTime())));
    return max.toISOString();
  };

  const statistics = [
    {
      id: 1,
      title: "Total Sanctions",
      value: String(sanctions.length),
      icon: FileCheck,
      variant: "blue",
      subtext: undefined,
      lastUpdated: computeLastUpdated(sanctions),
    },
    {
      id: 2,
      title: "Sanctioned Loans",
      value: String(sanctions.filter((s) => s.status === "sanctioned").length),
      icon: CheckCircle,
      variant: "green",
      subtext: undefined,
      lastUpdated: computeLastUpdated(sanctions.filter((s) => s.status === "sanctioned")),
    },
    {
      id: 3,
      title: "Pending Sanctions",
      value: String(sanctions.filter((s) => s.status === "pending").length),
      icon: Clock,
      variant: "orange",
      subtext: undefined,
      lastUpdated: computeLastUpdated(sanctions.filter((s) => s.status === "pending")),
    },
    {
      id: 4,
      title: "Rejected",
      value: String(sanctions.filter((s) => s.status === "rejected").length),
      icon: XCircle,
      variant: "red",
      subtext: undefined,
      lastUpdated: computeLastUpdated(sanctions.filter((s) => s.status === "rejected")),
    },
  ];

  // Get unique branches for filter
  const branches = ["all", ...new Set(sanctions.map((s) => s.branch))];
  const loanTypes = SANCTION_LOAN_TYPES;
  const loanTypeOptions = loanTypes.map((type) => ({
    value: type,
    label: type === "all" ? "All Loan Types" : type,
  }));
  const branchOptions = branches.map((branch) => ({
    value: branch,
    label: branch === "all" ? "All Branches" : branch,
  }));
  const statusOptions = [
    { value: "all", label: "All Status", count: sanctions.length },
    {
      value: "sanctioned",
      label: "Sanctioned",
      count: sanctions.filter((item) => item.status === "sanctioned").length,
    },
    {
      value: "approved",
      label: "Approved",
      count: sanctions.filter((item) => item.status === "approved").length,
    },
    {
      value: "pending",
      label: "Pending",
      count: sanctions.filter((item) => item.status === "pending").length,
    },
    {
      value: "conditional",
      label: "Conditional",
      count: sanctions.filter((item) => item.status === "conditional").length,
    },
    {
      value: "rejected",
      label: "Rejected",
      count: sanctions.filter((item) => item.status === "rejected").length,
    },
  ];
  const itemsPerPageOptions = [5, 10, 20, 50].map((count) => ({
    value: count,
    label: `${count} per page`,
  }));

  const getStatusBadge = (status) => {
    const statusConfig = {
      sanctioned: {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Sanctioned",
        icon: CheckCircle,
      },
      approved: {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Approved",
        icon: CheckCircle,
      },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        label: "Pending",
        icon: Clock,
      },
      conditional: {
        bg: colorVariables.LIGHT_BG,
        text: colorVariables.PRIMARY_COLOR,
        label: "Conditional",
        icon: FileCheck,
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
        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const handleViewDetails = (sanction) => {
    setSelectedSanction(sanction);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (sanction) => {
    console.log("Edit sanction:", sanction);
    // Add edit logic here
  };

  const handleDelete = (sanction) => {
    setSanctionToDelete(sanction);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (sanctionToDelete) {
      console.log("Delete sanction:", sanctionToDelete);
    }
    setIsDeleteDialogOpen(false);
    setSanctionToDelete(null);
  };

  const handleDownloadLetter = (sanction) => {
    console.log("Download sanction letter:", sanction);
    // Add download logic here
  };

  const resetFilters = () => {
    setSearchTerm("");
    setLoanTypeFilter("all");
    setBranchFilter("all");
    setStatusFilter("all");
    setDateFilter("");
    setIsFilterMenuOpen(false);
    setCurrentPage(1);
  };

  // Filter sanctions
  const filteredSanctions = sanctions.filter((sanction) => {
    const loanNumber = (sanction.loanNumber || "").toString();
    const applicantName = (sanction.applicantName || "").toString();
    const matchesSearch =
      searchTerm === "" ||
      loanNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicantName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLoanType =
      loanTypeFilter === "all" || (sanction.loanType || "") === loanTypeFilter;
    const matchesBranch =
      branchFilter === "all" || (sanction.branch || "") === branchFilter;
    const matchesStatus =
      statusFilter === "all" || (sanction.status || "").toString() === statusFilter;
    const matchesDate = !dateFilter || (sanction.sanctionDate || "") === dateFilter;

    return (
      matchesSearch &&
      matchesLoanType &&
      matchesBranch &&
      matchesStatus &&
      matchesDate
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredSanctions.length / itemsPerPage);
  const resolvedCurrentPage =
    totalPages > 0 ? Math.min(currentPage, totalPages) : 1;
  const paginatedSanctions = filteredSanctions.slice(
    (resolvedCurrentPage - 1) * itemsPerPage,
    resolvedCurrentPage * itemsPerPage,
  );

  const getActionItems = (sanction) => [
    {
      label: "View Details",
      icon: <Eye className="w-4 h-4" />,
      onClick: () => handleViewDetails(sanction),
    },
    {
      label: "Download Letter",
      icon: <Download className="w-4 h-4" />,
      onClick: () => handleDownloadLetter(sanction),
    },
    {
      label: "Edit",
      icon: <Edit2 className="w-4 h-4" />,
      onClick: () => handleEdit(sanction),
    },
    {
      label: "Delete",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: () => handleDelete(sanction),
      isDanger: true,
    },
  ];

  const tableActions = [
    {
      label: "View Details",
      icon: <Eye className="w-4 h-4" />,
      onClick: handleViewDetails,
    },
    {
      label: "Download Letter",
      icon: <Download className="w-4 h-4" />,
      onClick: handleDownloadLetter,
    },
    {
      label: "Edit",
      icon: <Edit2 className="w-4 h-4" />,
      onClick: handleEdit,
    },
    {
      label: "Delete",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: handleDelete,
      isDanger: true,
    },
  ];

  const desktopColumns = [
    {
      accessor: "loanNumber",
      header: "Loan Number",
      render: (value, row) => (
        <div className="text-sm font-medium text-slate-800">{value}</div>
      ),
    },
    { accessor: "applicantName", header: "Applicant" },
    { accessor: "loanType", header: "Loan Type" },
    { accessor: "requestedAmount", header: "Requested" },
    {
      accessor: "sanctionedAmount",
      header: "Sanctioned",
      render: (value) => (
        <span className="font-semibold text-slate-800">{value}</span>
      ),
    },
    { accessor: "interestRate", header: "Interest" },
    { accessor: "tenure", header: "Tenure" },
    { accessor: "branch", header: "Branch" },
    {
      accessor: "status",
      header: "Status",
      render: (value) => getStatusBadge(value),
    },
    { accessor: "sanctionDate", header: "Date" },
  ];

  // Handle page change from Pagination component
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of the table/cards
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Mobile card view
  const MobileSanctionCard = ({ sanction }) => (
    <div className="bg-white p-4 rounded-xl border border-slate-200 mb-3 hover:shadow-md transition-all active:bg-slate-50">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-800 text-base truncate">
            {sanction.applicantName}
          </h3>
          <p className="text-xs text-slate-500">{sanction.loanNumber}</p>
        </div>
        {getStatusBadge(sanction.status)}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-slate-50 p-2 rounded-lg">
          <p className="text-xs text-slate-400 mb-1">Loan Type</p>
          <p className="text-sm font-medium text-slate-700 truncate">
            {sanction.loanType}
          </p>
        </div>
        <div className="bg-slate-50 p-2 rounded-lg">
          <p className="text-xs text-slate-400 mb-1">Branch</p>
          <p className="text-sm font-medium text-slate-700 truncate">
            {sanction.branch}
          </p>
        </div>
        <div className="bg-slate-50 p-2 rounded-lg">
          <p className="text-xs text-slate-400 mb-1">Requested</p>
          <p className="text-sm font-medium text-slate-700">
            {sanction.requestedAmount}
          </p>
        </div>
        <div className="bg-slate-50 p-2 rounded-lg">
          <p className="text-xs text-slate-400 mb-1">Sanctioned</p>
          <p className="text-sm font-medium text-slate-700">
            {sanction.sanctionedAmount}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <Percent className="w-3 h-3 text-slate-400" />
          <span className="text-xs text-slate-600">
            {sanction.interestRate}
          </span>
        </div>
        <ActionMenu actions={getActionItems(sanction)} />
      </div>
    </div>
  );

  // Tablet grid card
  const TabletGridCard = ({ sanction }) => (
    <div className="bg-white p-5 rounded-xl border border-slate-200 hover:shadow-lg transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-slate-800">
            {sanction.applicantName}
          </h3>
          <p className="text-sm text-slate-500">{sanction.loanNumber}</p>
        </div>
        {getStatusBadge(sanction.status)}
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Home className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600">{sanction.loanType}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Building2 className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600">{sanction.branch}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Requested:</span>
          <span className="font-medium text-slate-800">
            {sanction.requestedAmount}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Sanctioned:</span>
          <span className="font-medium text-slate-800">
            {sanction.sanctionedAmount}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Interest:</span>
          <span className="font-medium text-slate-800">
            {sanction.interestRate}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <span className="text-xs text-slate-500">{sanction.sanctionDate}</span>
        <ActionMenu actions={getActionItems(sanction)} />
      </div>
    </div>
  );

  // Tablet list item
  const TabletListItem = ({ sanction }) => (
    <div className="bg-white p-4 rounded-xl border border-slate-200 mb-3 hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-slate-800">
              {sanction.applicantName}
            </h3>
            {getStatusBadge(sanction.status)}
          </div>
          <p className="text-sm text-slate-500 mb-3">{sanction.loanNumber}</p>

          <div className="grid grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-xs text-slate-400">Loan Type</p>
              <p className="text-slate-700 font-medium">{sanction.loanType}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Branch</p>
              <p className="text-slate-700">{sanction.branch}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Sanctioned</p>
              <p className="text-slate-700 font-medium">
                {sanction.sanctionedAmount}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Interest</p>
              <p className="text-slate-700">{sanction.interestRate}</p>
            </div>
          </div>
        </div>
        <div className="ml-4">
          <ActionMenu actions={getActionItems(sanction)} />
        </div>
      </div>
    </div>
  );

  // Tablet compact card
  const TabletCompactCard = ({ sanction }) => (
    <div className="bg-white p-3 rounded-xl border border-slate-200 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-800 text-sm truncate">
            {sanction.applicantName}
          </h3>
          <p className="text-xs text-slate-500 truncate">
            {sanction.loanNumber}
          </p>
        </div>
        {getStatusBadge(sanction.status)}
      </div>
      <div className="flex justify-between text-xs mb-2">
        <span className="text-slate-600">{sanction.loanType}</span>
        <span className="font-medium text-slate-800">
          {sanction.sanctionedAmount}
        </span>
      </div>
      <div className="flex justify-end">
        <ActionMenu actions={getActionItems(sanction)} />
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
              Loan Sanction Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-2">
              Manage approved loan sanctions and final approval decisions
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className={`justify-center px-4 sm:px-5 py-2.5 sm:py-3 ${colorVariables.PRIMARY_BUTTON_COLOR} text-white rounded-xl text-xs sm:text-sm w-full sm:w-auto`}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Loan Sanction
          </Button>
        </div>

        {/* Statistics Cards */}
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
                      variant={stat.variant}
                      trend={stat.trendData}
                      lastUpdated={stat.lastUpdated}
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
                {filteredSanctions.length > 0 && (
                  <span
                    className={`ml-2 px-2 py-0.5 ${colorVariables.LIGHT_BG} ${colorVariables.PRIMARY_COLOR} rounded-full text-xs`}
                  >
                    {filteredSanctions.length} results
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
              <SearchField
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setCurrentPage(1);
                }}
                onClear={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                showResults={false}
                placeholder={
                  device.isMobile
                    ? "Search..."
                    : "Search by Loan Number or Applicant Name"
                }
              />
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

                <SelectField
                  value={loanTypeFilter}
                  onChange={(value) => {
                    setLoanTypeFilter(value);
                    setCurrentPage(1);
                  }}
                  options={loanTypeOptions}
                  className="w-full sm:w-52"
                  placeholder="All Loan Types"
                />

                <SelectField
                  value={branchFilter}
                  onChange={(value) => {
                    setBranchFilter(value);
                    setCurrentPage(1);
                  }}
                  options={branchOptions}
                  className="w-full sm:w-48"
                  placeholder="All Branches"
                />

                <FilterDropdown
                  value={statusFilter}
                  onChange={(value) => {
                    setStatusFilter(value);
                    setCurrentPage(1);
                  }}
                  options={statusOptions}
                  className="w-full sm:w-auto"
                  placeholder="All Status"
                />

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400 hidden sm:block" />
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full sm:w-auto px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-slate-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                    placeholder="Select Date"
                  />
                </div>

                <Button
                  onClick={resetFilters}
                  className="w-full sm:w-auto justify-center px-4 sm:px-5 py-2.5 sm:py-3 border border-slate-200 rounded-lg sm:rounded-xl bg-white! text-slate-600! hover:bg-slate-50"
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
            <span className="font-medium">{paginatedSanctions.length}</span> of{" "}
            <span className="font-medium">{filteredSanctions.length}</span>{" "}
            sanctions
          </p>
          {device.isDesktop && (
            <SelectField
              value={itemsPerPage}
              onChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
              options={itemsPerPageOptions}
              className="order-1 sm:order-2 w-full sm:w-40"
              placeholder="Items"
            />
          )}
        </div>

        {/* Sanctions Display - Responsive layouts */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Desktop Table View */}
          {device.isDesktop && (
            <SanctionTable
              columns={desktopColumns}
              data={paginatedSanctions}
              actions={tableActions}
            />
          )}

          {/* Tablet View */}
          {device.isTablet && (
            <div className="p-4">
              {paginatedSanctions.length > 0 ? (
                <>
                  {viewMode === "grid" && (
                    <div className="grid grid-cols-2 gap-4">
                      {paginatedSanctions.map((sanction) => (
                        <TabletGridCard key={sanction.id} sanction={sanction} />
                      ))}
                    </div>
                  )}
                  {viewMode === "list" && (
                    <div className="space-y-3">
                      {paginatedSanctions.map((sanction) => (
                        <TabletListItem key={sanction.id} sanction={sanction} />
                      ))}
                    </div>
                  )}
                  {viewMode === "compact" && (
                    <div className="grid grid-cols-3 gap-3">
                      {paginatedSanctions.map((sanction) => (
                        <TabletCompactCard
                          key={sanction.id}
                          sanction={sanction}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText className="w-16 h-16 text-slate-300 mb-4" />
                  <p className="text-slate-500 text-lg font-medium">
                    No sanctions found
                  </p>
                  <p className="text-slate-400 text-sm mt-2">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Mobile View */}
          {device.isMobile && (
            <div className="p-3">
              {paginatedSanctions.length > 0 ? (
                paginatedSanctions.map((sanction) => (
                  <MobileSanctionCard key={sanction.id} sanction={sanction} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText className="w-16 h-16 text-slate-300 mb-4" />
                  <p className="text-slate-500 text-base font-medium">
                    No sanctions found
                  </p>
                  <p className="text-slate-400 text-xs mt-2">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pagination - Using your custom Pagination component */}
        {filteredSanctions.length > 0 && (
          <Pagination
            currentPage={resolvedCurrentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            containerClassName="mt-6"
            showPrevNext={true}
            maxVisiblePages={device.isMobile ? 3 : 7}
          />
        )}
      </div>

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        title="Delete sanction record"
        description={
          sanctionToDelete
            ? `This will remove ${sanctionToDelete.loanNumber} for ${sanctionToDelete.applicantName}.`
            : "This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setSanctionToDelete(null);
        }}
        onConfirm={confirmDelete}
        isPopup={true}
        variant="danger"
      />

      {/* Modals */}
      <CreateSanctionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {selectedSanction && (
        <SanctionDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedSanction(null);
          }}
          sanction={selectedSanction}
        />
      )}
    </div>
  );
}
