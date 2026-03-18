import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  X,
  FileText,
  Check,
  Ban,
  AlertCircle,
  Eye,
  User,
  Calendar,
  DollarSign,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Hash,
  IndianRupee,
  Building,
  Briefcase,
  CreditCard,
  Download,
  Printer,
  Shield,
  Users,
  Clock,
  Landmark,
  CheckCircle,
} from "lucide-react";
import Button from "../../../components/ui/Button";
import SearchField from "../../../components/ui/SearchField";
import ConfirmationDialog from "../../../components/common/ConfirmationDialog";
import StatusCard from "../../../components/common/StatusCard";
import SectionInfoCard from "../../../components/details/InfoCard";
import ApplicationPageTable from "../../../components/tables/ApplicationPageTable";
import {
  useLoanApplications,
  useUpdateLoanStatus,
} from "../../../hooks/useLoanApplication";
import { SAMPLE_LOAN_APPLICATIONS } from "../../../lib/LOSDummyData";
import LoanApplicationForm from "../../../components/forms/LoanApplicationForm";
import LoanApplicationView from "../ViewDetail/LoanApplicationView";

export default function ApplicationPage() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);

  const { data: applicationsResponse, isLoading } = useLoanApplications();
  const { mutate: updateStatus } = useUpdateLoanStatus();

  const applications = useMemo(() => {
    const raw =
      applicationsResponse?.data ??
      applicationsResponse?.loanApplications ??
      applicationsResponse;
    const apiData = Array.isArray(raw) ? raw : [];
    // Use dummy data if no real data is available
    return apiData.length > 0 ? apiData : SAMPLE_LOAN_APPLICATIONS;
  }, [applicationsResponse]);

  const shouldShowLoadingOnly =
    isLoading && !applicationsResponse && SAMPLE_LOAN_APPLICATIONS.length === 0;

  const PAGE_SIZE = 10;

  const handleViewDetails = (app) => {
    setSelectedApp(app);
    setViewModalOpen(true);
  };

  const handleApproveApplication = () => {
    if (!selectedApp?.id) return;
    updateStatus({
      id: selectedApp.id,
      status: "approved",
    });
    setShowApproveDialog(false);
    setViewModalOpen(false);
  };

  // Filter applications based on search term
  const filteredApplications = applications.filter(
    (app) =>
      `${app.customer?.firstName || ""} ${app.customer?.lastName || ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      app.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.customer?.panNumber?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const stats = {
    total: applications.length,
    approved: applications.filter((a) => a.status?.toLowerCase() === "approved")
      .length,
    rejected: applications.filter((a) => a.status?.toLowerCase() === "rejected")
      .length,
    pending: applications.filter(
      (a) =>
        a.status?.toLowerCase() === "pending" ||
        a.status?.toLowerCase() === "kyc_pending",
    ).length,
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      case "pending":
      case "kyc_pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const tableColumns = [
    {
      header: "Applicant",
      accessor: "customer",
      render: (_, app) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
            {app.customer?.firstName?.charAt(0) || "?"}
            {app.customer?.lastName?.charAt(0) || ""}
          </div>
          <div>
            <div className="font-semibold text-slate-800">
              {app.customer
                ? `${app.customer.firstName || ""} ${app.customer.lastName || ""}`
                : "—"}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <Hash size={12} />
              {app.customer?.panNumber || "PAN N/A"}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Contact",
      accessor: "contact",
      render: (_, app) => (
        <div className="space-y-1">
          <div className="text-sm text-slate-600 flex items-center gap-2">
            <Mail size={14} className="text-slate-400" />
            {app.customer?.email || "—"}
          </div>
          <div className="text-sm text-slate-600 flex items-center gap-2">
            <Phone size={14} className="text-slate-400" />
            {app.customer?.contactNumber || "—"}
          </div>
        </div>
      ),
    },
    {
      header: "Loan Details",
      accessor: "requestedAmount",
      render: (value, app) => (
        <div className="space-y-1">
          <div className="font-semibold text-slate-800 flex items-center gap-1">
            <IndianRupee size={16} className="text-blue-500" />
            {value ? Number(value).toLocaleString() : "N/A"}
          </div>
          <div className="text-xs text-slate-500">
            {app.tenureMonths || "N/A"} months • {app.interestRate || "N/A"}%
            p.a.
          </div>
        </div>
      ),
    },
    {
      header: "CIBIL",
      accessor: "cibilScore",
      render: (value) => (
        <span
          className={`px-3 py-1.5 rounded-lg font-medium text-sm ${
            value >= 750
              ? "bg-green-100 text-green-700"
              : value >= 650
                ? "bg-yellow-100 text-yellow-700"
                : value
                  ? "bg-red-100 text-red-700"
                  : "bg-slate-100 text-slate-700"
          }`}
        >
          {value ?? "N/A"}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (value) => (
        <span
          className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${getStatusColor(value)}`}
        >
          {value || "Pending"}
        </span>
      ),
    },
  ];

  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showForm]);

  if (showForm) {
    return <LoanApplicationForm onClose={() => setShowForm(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Loan Applications
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and track all loan applications
          </p>
        </div>

        <Button
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 
            px-4 py-2 rounded-lg transition-colors text-sm font-medium
            flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          <span className="font-semibold">New Application</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatusCard
          title="Total"
          value={stats.total}
          icon={FileText}
          variant="blue"
          subtext="All applications"
        />
        <StatusCard
          title="Approved"
          value={stats.approved}
          icon={Check}
          variant="green"
          subtext="Successfully approved"
        />
        <StatusCard
          title="Pending"
          value={stats.pending}
          icon={AlertCircle}
          variant="orange"
          subtext="Need review"
        />
        <StatusCard
          title="Rejected"
          value={stats.rejected}
          icon={Ban}
          variant="red"
          subtext="Declined applications"
        />
      </div>

      {shouldShowLoadingOnly ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500">
          Loading applications...
        </div>
      ) : (
        <ApplicationPageTable
          applications={filteredApplications}
          tableColumns={tableColumns}
          loading={shouldShowLoadingOnly}
          onViewDetails={handleViewDetails}
        />
      )}

      {/* VIEW DETAILS MODAL - COMPREHENSIVE REDESIGN */}
      {viewModalOpen && (
        <LoanApplicationView
          application={selectedApp}
          onClose={() => setViewModalOpen(false)}
          onApprove={(id) => {
            updateStatus({
              id,
              status: "approved",
            });
            setViewModalOpen(false);
          }}
        />
      )}
      {/* // Loan Application Form */}

      <ConfirmationDialog
        open={showApproveDialog}
        title="Approve Loan Application"
        description="Are you sure you want to approve this loan application?"
        confirmText="Approve"
        cancelText="Cancel"
        onConfirm={handleApproveApplication}
        onCancel={() => setShowApproveDialog(false)}
        variant="info"
        isPopup={true}
      />
    </div>
  );
}

// Enhanced InfoCard component
const InfoCard = ({
  icon,
  label,
  value,
  fallback = "—",
  fullWidth = false,
}) => (
  <div className={fullWidth ? "md:col-span-2 lg:col-span-4" : ""}>
    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
      {icon}
      {label}
    </p>
    <p className="text-sm font-medium text-slate-800 wrap-break-word">
      {value ? (
        value
      ) : (
        <span className="text-slate-400 italic">{fallback}</span>
      )}
    </p>
  </div>
);

// Settings icon component
const Settings = ({ size, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H5.78a1.65 1.65 0 0 0-1.51 1 1.65 1.65 0 0 0 .33 1.82l.07.09A10 10 0 0 0 12 18a10 10 0 0 0 6.26-2.22l.07-.09z"></path>
    <path d="M4.6 9a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1.51 1h12.44a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.07-.09A10 10 0 0 0 12 6a10 10 0 0 0-6.26 2.22l-.07.09z"></path>
  </svg>
);
