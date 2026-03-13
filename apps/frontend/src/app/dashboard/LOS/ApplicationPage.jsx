import React, { useMemo, useState } from "react";
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
import LoanApplicationFormModal from "../../../components/modals/LoanApplicationFormModal";
import ApplicationPageTable from "../../../components/tables/ApplicationPageTable";
import {
  useLoanApplications,
  useUpdateLoanStatus,
} from "../../../hooks/useLoanApplication";
import { SAMPLE_LOAN_APPLICATIONS } from "../../../lib/LOSDummyData";

export default function ApplicationPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
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

  const totalPages = Math.max(
    1,
    Math.ceil(filteredApplications.length / PAGE_SIZE),
  );
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
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

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Format currency helper
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 p-4 md:p-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Loan Applications
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage and track all loan applications
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <SearchField
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            onClear={() => {
              setSearchTerm("");
              setCurrentPage(1);
            }}
            showResults={false}
            placeholder="Search applications..."
            containerClassName="w-full md:w-72"
          />
          <Button
            onClick={() => setIsModalOpen(true)}
            className="whitespace-nowrap bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200"
          >
            <Plus size={20} />
            <span className="font-semibold">New Application</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          paginatedApplications={paginatedApplications}
          tableColumns={tableColumns}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          shouldShowLoadingOnly={shouldShowLoadingOnly}
          onViewDetails={handleViewDetails}
        />
      )}

      {/* VIEW DETAILS MODAL - COMPREHENSIVE REDESIGN */}
      {viewModalOpen && selectedApp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-60 p-2 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl sm:max-w-4xl lg:max-w-6xl shadow-2xl relative max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            {/* Modal Header with Gradient */}
            <div className="sticky top-0 bg-linear-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 z-10">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center shrink-0">
                  <FileText className="text-white" size={20} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-white wrap-break-word">
                    Loan Application Details
                  </h2>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
                    <p className="text-xs sm:text-sm text-blue-100 truncate">
                      ID: {selectedApp.id}
                    </p>
                    <span className="w-1 h-1 rounded-full bg-blue-300 hidden sm:block"></span>
                    <p className="text-xs sm:text-sm text-blue-100 truncate">
                      Loan #: {selectedApp.loanNumber}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-auto sm:ml-0">
                <button
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/10 hover:bg-white/20 items-center justify-center transition-colors hidden sm:flex"
                  onClick={() => window.print()}
                >
                  <Printer size={18} className="text-white" />
                </button>
                <button
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/10 hover:bg-white/20 items-center justify-center transition-colors hidden sm:flex"
                  onClick={() => {
                    /* Handle download */
                  }}
                >
                  <Download size={18} className="text-white" />
                </button>
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X size={18} className="text-white" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
              {/* Status Banner with Timeline */}
              <div className="bg-linear-to-r from-slate-50 to-blue-50 rounded-xl p-3 sm:p-5 border border-blue-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                        selectedApp.status?.toLowerCase() === "approved"
                          ? "bg-green-100"
                          : selectedApp.status?.toLowerCase() === "rejected"
                            ? "bg-red-100"
                            : "bg-yellow-100"
                      }`}
                    >
                      {selectedApp.status?.toLowerCase() === "approved" && (
                        <CheckCircle size={28} className="text-green-600" />
                      )}
                      {selectedApp.status?.toLowerCase() === "rejected" && (
                        <Ban size={28} className="text-red-600" />
                      )}
                      {selectedApp.status?.toLowerCase() === "pending" && (
                        <AlertCircle size={28} className="text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-slate-500">
                        Current Status
                      </p>
                      <div className="flex items-center gap-2 sm:gap-3 mt-1 flex-wrap">
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 capitalize">
                          {selectedApp.status || "Pending"}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedApp.status)}`}
                        >
                          {selectedApp.status || "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 text-sm">
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-slate-500">Application Date</p>
                      <p className="font-medium text-slate-800 truncate">
                        {formatDate(selectedApp.applicationDate)}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-slate-500">Last Updated</p>
                      <p className="font-medium text-slate-800 truncate">
                        {formatDate(selectedApp.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timeline/Approval Info */}
                {(selectedApp.approvedAt || selectedApp.rejectedAt) && (
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs sm:text-sm">
                      <Clock size={16} className="text-slate-400 shrink-0" />
                      {selectedApp.approvedAt && (
                        <span>
                          Approved on {formatDate(selectedApp.approvedAt)} by{" "}
                          {selectedApp.approvedBy || "System"}
                        </span>
                      )}
                      {selectedApp.rejectedAt && (
                        <span>
                          Rejected on {formatDate(selectedApp.rejectedAt)} -
                          Reason:{" "}
                          {selectedApp.rejectionReason || "Not specified"}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Personal Information Section - Enhanced */}
              <SectionInfoCard title="Personal Information" icon={User}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <InfoCard
                    icon={<User size={16} className="text-blue-500" />}
                    label="Full Name"
                    value={
                      selectedApp.customer
                        ? `${selectedApp.customer.title || ""} ${selectedApp.customer.firstName || ""} ${selectedApp.customer.middleName || ""} ${selectedApp.customer.lastName || ""}`.trim()
                        : null
                    }
                    fallback="Not provided"
                  />
                  <InfoCard
                    icon={<Mail size={16} className="text-blue-500" />}
                    label="Email"
                    value={selectedApp.customer?.email}
                    fallback="Not provided"
                  />
                  <InfoCard
                    icon={<Phone size={16} className="text-blue-500" />}
                    label="Phone"
                    value={selectedApp.customer?.contactNumber}
                    fallback="Not provided"
                  />
                  <InfoCard
                    icon={<Phone size={16} className="text-blue-500" />}
                    label="Alternate Phone"
                    value={selectedApp.customer?.alternateNumber}
                    fallback="Not provided"
                  />
                  <InfoCard
                    icon={<Calendar size={16} className="text-blue-500" />}
                    label="Date of Birth"
                    value={
                      selectedApp.customer?.dob
                        ? formatDate(selectedApp.customer.dob)
                        : null
                    }
                    fallback="Not provided"
                  />
                  <InfoCard
                    icon={<Hash size={16} className="text-blue-500" />}
                    label="Gender"
                    value={selectedApp.customer?.gender}
                    fallback="Not provided"
                  />
                  <InfoCard
                    icon={<Hash size={16} className="text-blue-500" />}
                    label="Marital Status"
                    value={selectedApp.customer?.maritalStatus}
                    fallback="Not provided"
                  />
                  <InfoCard
                    icon={<Hash size={16} className="text-blue-500" />}
                    label="Nationality"
                    value={selectedApp.customer?.nationality}
                    fallback="Not provided"
                  />
                  <InfoCard
                    icon={<Hash size={16} className="text-blue-500" />}
                    label="Category"
                    value={selectedApp.customer?.category}
                    fallback="Not provided"
                  />
                  <InfoCard
                    icon={<User size={16} className="text-blue-500" />}
                    label="Spouse Name"
                    value={selectedApp.customer?.spouseName}
                    fallback="Not provided"
                  />
                </div>

                {/* Address - Full Width */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <InfoCard
                    icon={<MapPin size={16} className="text-blue-500" />}
                    label="Residential Address"
                    value={
                      selectedApp.customer
                        ? `${selectedApp.customer.address || ""}, ${selectedApp.customer.city || ""}, ${selectedApp.customer.state || ""} - ${selectedApp.customer.pinCode || ""}`.trim()
                        : null
                    }
                    fallback="Not provided"
                    fullWidth
                  />
                </div>
              </SectionInfoCard>

              {/* KYC & Identity Section */}
              <SectionInfoCard title="KYC & Identity Details" icon={Shield}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <InfoCard
                    icon={<CreditCard size={16} className="text-blue-500" />}
                    label="Aadhaar Number"
                    value={selectedApp.customer?.aadhaarNumber}
                    fallback="Not provided"
                  />
                  <InfoCard
                    icon={<FileText size={16} className="text-blue-500" />}
                    label="PAN Number"
                    value={selectedApp.customer?.panNumber}
                    fallback="Not provided"
                  />
                  <InfoCard
                    icon={<FileText size={16} className="text-blue-500" />}
                    label="Voter ID"
                    value={selectedApp.customer?.voterId}
                    fallback="Not provided"
                  />
                  <InfoCard
                    icon={<FileText size={16} className="text-blue-500" />}
                    label="Passport Number"
                    value={selectedApp.customer?.passportNumber}
                    fallback="Not provided"
                  />
                </div>

                {/* KYC Status */}
                {selectedApp.kyc && (
                  <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-700">
                          KYC Status:
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            selectedApp.kyc.status === "VERIFIED"
                              ? "bg-green-100 text-green-700"
                              : selectedApp.kyc.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {selectedApp.kyc.status}
                        </span>
                      </div>
                      {selectedApp.kyc.verifiedBy && (
                        <span className="text-xs text-slate-500">
                          Verified by: {selectedApp.kyc.verifiedBy} on{" "}
                          {formatDate(selectedApp.kyc.verifiedAt)}
                        </span>
                      )}
                    </div>

                    {/* Documents */}
                    {selectedApp.kyc.documents &&
                      selectedApp.kyc.documents.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-slate-500 mb-2">
                            Uploaded Documents
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {selectedApp.kyc.documents.map((doc, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200"
                              >
                                <FileText size={14} className="text-blue-500" />
                                <span className="text-xs text-slate-700">
                                  {doc.documentType}
                                </span>
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    doc.verificationStatus === "verified"
                                      ? "bg-green-500"
                                      : doc.verificationStatus === "pending"
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                  }`}
                                ></span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </SectionInfoCard>

              {/* Employment & Financial Section */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-linear-to-r from-slate-50 to-blue-50 px-5 py-3 border-b border-slate-200">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <Briefcase size={18} className="text-blue-600" />
                    Employment & Financial Details
                  </h3>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <InfoCard
                      icon={<Briefcase size={16} className="text-blue-500" />}
                      label="Employment Type"
                      value={selectedApp.customer?.employmentType?.replace(
                        "_",
                        " ",
                      )}
                      fallback="Not provided"
                    />
                    <InfoCard
                      icon={<IndianRupee size={16} className="text-blue-500" />}
                      label="Monthly Income"
                      value={
                        selectedApp.customer?.monthlyIncome
                          ? formatCurrency(selectedApp.customer.monthlyIncome)
                          : null
                      }
                      fallback="Not provided"
                    />
                    <InfoCard
                      icon={<IndianRupee size={16} className="text-blue-500" />}
                      label="Annual Income"
                      value={
                        selectedApp.customer?.annualIncome
                          ? formatCurrency(selectedApp.customer.annualIncome)
                          : null
                      }
                      fallback="Not provided"
                    />
                    <InfoCard
                      icon={<IndianRupee size={16} className="text-blue-500" />}
                      label="Other Income"
                      value={
                        selectedApp.customer?.otherIncome
                          ? formatCurrency(selectedApp.customer.otherIncome)
                          : null
                      }
                      fallback="Not provided"
                    />
                  </div>
                </div>
              </div>

              {/* Bank Details Section */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-linear-to-r from-slate-50 to-blue-50 px-5 py-3 border-b border-slate-200">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <Landmark size={18} className="text-blue-600" />
                    Bank Account Details
                  </h3>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <InfoCard
                      icon={<Building size={16} className="text-blue-500" />}
                      label="Bank Name"
                      value={selectedApp.customer?.bankName}
                      fallback="Not provided"
                    />
                    <InfoCard
                      icon={<CreditCard size={16} className="text-blue-500" />}
                      label="Account Number"
                      value={selectedApp.customer?.bankAccountNumber}
                      fallback="Not provided"
                    />
                    <InfoCard
                      icon={<Hash size={16} className="text-blue-500" />}
                      label="IFSC Code"
                      value={selectedApp.customer?.ifscCode}
                      fallback="Not provided"
                    />
                    <InfoCard
                      icon={<Hash size={16} className="text-blue-500" />}
                      label="Account Type"
                      value={selectedApp.customer?.accountType}
                      fallback="Not provided"
                    />
                  </div>
                </div>
              </div>

              {/* Loan Details Section */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-linear-to-r from-slate-50 to-blue-50 px-5 py-3 border-b border-slate-200">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <TrendingUp size={18} className="text-blue-600" />
                    Loan Details
                  </h3>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <InfoCard
                      label="Loan Number"
                      value={selectedApp.loanNumber}
                      fallback="Not provided"
                    />
                    <InfoCard
                      label="Loan Type ID"
                      value={selectedApp.loanTypeId}
                      fallback="Not provided"
                    />
                    <InfoCard
                      icon={<IndianRupee size={16} className="text-blue-500" />}
                      label="Requested Amount"
                      value={
                        selectedApp.requestedAmount
                          ? formatCurrency(selectedApp.requestedAmount)
                          : null
                      }
                      fallback="Not specified"
                    />
                    <InfoCard
                      icon={<IndianRupee size={16} className="text-blue-500" />}
                      label="Approved Amount"
                      value={
                        selectedApp.approvedAmount
                          ? formatCurrency(selectedApp.approvedAmount)
                          : null
                      }
                      fallback="Not approved yet"
                    />
                    <InfoCard
                      label="Tenure"
                      value={
                        selectedApp.tenureMonths
                          ? `${selectedApp.tenureMonths} months`
                          : null
                      }
                      fallback="Not specified"
                    />
                    <InfoCard
                      label="Interest Rate"
                      value={
                        selectedApp.interestRate
                          ? `${selectedApp.interestRate}% p.a.`
                          : null
                      }
                      fallback="Not specified"
                    />
                    <InfoCard
                      label="Interest Type"
                      value={selectedApp.interestType}
                      fallback="Not specified"
                    />
                    <InfoCard
                      icon={<IndianRupee size={16} className="text-blue-500" />}
                      label="EMI Amount"
                      value={
                        selectedApp.emiAmount
                          ? formatCurrency(selectedApp.emiAmount)
                          : null
                      }
                      fallback="Not calculated"
                    />
                    <InfoCard
                      icon={<IndianRupee size={16} className="text-blue-500" />}
                      label="Total Payable"
                      value={
                        selectedApp.totalPayable
                          ? formatCurrency(selectedApp.totalPayable)
                          : null
                      }
                      fallback="Not calculated"
                    />
                    <InfoCard
                      label="Loan Purpose"
                      value={selectedApp.loanPurpose}
                      fallback="Not specified"
                    />
                    <InfoCard
                      label="Purpose Details"
                      value={selectedApp.purposeDetails}
                      fallback="Not specified"
                      fullWidth
                    />
                  </div>

                  {/* CIBIL Score with Visual */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                      <div className="text-center sm:text-left">
                        <p className="text-xs text-slate-500 mb-1">
                          CIBIL Score
                        </p>
                        <div
                          className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto sm:mx-0 ${
                            selectedApp.cibilScore >= 750
                              ? "bg-green-100 text-green-700"
                              : selectedApp.cibilScore >= 650
                                ? "bg-yellow-100 text-yellow-700"
                                : selectedApp.cibilScore
                                  ? "bg-red-100 text-red-700"
                                  : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {selectedApp.cibilScore || "N/A"}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-700 sm:text-slate-800 text-sm sm:text-base">
                          Credit Assessment
                        </p>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1">
                          {selectedApp.cibilScore >= 750
                            ? "Excellent credit history"
                            : selectedApp.cibilScore >= 650
                              ? "Good credit history"
                              : selectedApp.cibilScore
                                ? "Fair credit history - May require additional verification"
                                : "Credit score not available"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Co-applicants Section */}
              {selectedApp.coapplicants &&
                selectedApp.coapplicants.length > 0 && (
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="bg-linear-to-r from-slate-50 to-blue-50 px-5 py-3 border-b border-slate-200">
                      <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                        <Users size={18} className="text-blue-600" />
                        Co-Applicants ({selectedApp.coapplicants.length})
                      </h3>
                    </div>
                    <div className="p-5">
                      {selectedApp.coapplicants.map((co, idx) => (
                        <div
                          key={idx}
                          className="mb-4 last:mb-0 p-4 bg-slate-50 rounded-lg"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <InfoCard
                              label="Name"
                              value={`${co.firstName || ""} ${co.lastName || ""}`.trim()}
                            />
                            <InfoCard label="Relation" value={co.relation} />
                            <InfoCard
                              label="Contact"
                              value={co.contactNumber}
                            />
                            <InfoCard label="Email" value={co.email} />
                            <InfoCard label="PAN" value={co.panNumber} />
                            <InfoCard
                              label="Aadhaar"
                              value={co.aadhaarNumber}
                            />
                            <InfoCard
                              label="Employment"
                              value={co.employmentType}
                            />
                            <InfoCard
                              label="Monthly Income"
                              value={
                                co.monthlyIncome
                                  ? formatCurrency(co.monthlyIncome)
                                  : null
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Additional Loan Settings */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-linear-to-r from-slate-50 to-blue-50 px-5 py-3 border-b border-slate-200">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <Settings size={18} className="text-blue-600" />
                    Additional Loan Settings
                  </h3>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <InfoCard
                      label="Foreclosure Allowed"
                      value={selectedApp.foreclosureAllowed ? "Yes" : "No"}
                    />
                    <InfoCard
                      label="Prepayment Allowed"
                      value={selectedApp.prepaymentAllowed ? "Yes" : "No"}
                    />
                    <InfoCard
                      label="Late Payment Fee"
                      value={
                        selectedApp.latePaymentFee
                          ? formatCurrency(selectedApp.latePaymentFee)
                          : "Not set"
                      }
                    />
                    <InfoCard
                      label="Bounce Charges"
                      value={
                        selectedApp.bounceCharges
                          ? formatCurrency(selectedApp.bounceCharges)
                          : "Not set"
                      }
                    />
                    <InfoCard
                      label="Foreclosure Charges"
                      value={
                        selectedApp.foreclosureCharges
                          ? `${selectedApp.foreclosureCharges}%`
                          : "Not set"
                      }
                    />
                    <InfoCard
                      label="Prepayment Charges"
                      value={
                        selectedApp.prepaymentCharges
                          ? `${selectedApp.prepaymentCharges}%`
                          : "Not set"
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer with Actions */}
            <div className="sticky bottom-0 bg-white border-t border-slate-200 px-3 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
              <div className="text-xs sm:text-sm text-slate-500 truncate">
                <Clock size={12} className="inline mr-1" />
                Created: {formatDate(selectedApp.createdAt)} | Branch:{" "}
                {selectedApp.branchId}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <Button
                  onClick={() => setViewModalOpen(false)}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-600! bg-white hover:bg-slate-50 transition-colors w-full sm:w-auto"
                >
                  Close
                </Button>
                {selectedApp.status?.toLowerCase() !== "approved" && (
                  <Button
                    onClick={() => setShowApproveDialog(true)}
                    className="px-4 sm:px-6 py-2 sm:py-2.5 bg-linear-to-r from-green-500 to-green-600 text-white rounded-xl font-medium text-xs sm:text-sm hover:from-green-600 hover:to-green-700 transition-colors shadow-lg shadow-green-200 flex items-center justify-center sm:gap-2 w-full sm:w-auto"
                  >
                    <CheckCircle size={16} className="sm:hidden" />
                    <CheckCircle size={18} className="hidden sm:block" />
                    <span className="ml-1 sm:ml-0">Approve</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* // Loan Application Form */}
      <LoanApplicationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

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
