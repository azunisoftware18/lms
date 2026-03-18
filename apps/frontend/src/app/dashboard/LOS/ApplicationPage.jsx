import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  FileText,
  Check,
  Ban,
  AlertCircle,
  Hash,
  IndianRupee,
  Users,
  ShieldCheck,
  Briefcase,
} from "lucide-react";
import Button from "../../../components/ui/Button";
import StatusCard from "../../../components/common/StatusCard";
import ApplicationPageTable from "../../../components/tables/ApplicationPageTable";
import LoanApplicationView from "../ViewDetail/LoanApplicationView";
import LoanApplicationForm from "../../../components/forms/LoanApplicationForm";
import {
  useLoanApplications,
  useUpdateLoanStatus,
} from "../../../hooks/useLoanApplication";
import { SAMPLE_LOAN_APPLICATIONS } from "../../../lib/LOSDummyData";

export default function ProfessionalNBFCPortal() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [currentPage] = useState(1);
  const [showApproveDialog, setShowApproveDialog] = useState(false);

  const { data: applicationsResponse } = useLoanApplications();
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

  const PAGE_SIZE = 10;

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

  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const tableColumns = [
    {
      header: "Applicant",
      accessor: "customer",
      render: (_, app) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-blue-700 font-bold border border-slate-200">
            {app.applicant?.firstName?.charAt(0) || "U"}
          </div>
          <div>
            <div className="font-bold text-slate-900">
              {`${app.applicant?.firstName || ""} ${app.applicant?.lastName || ""}`}
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <Hash size={12} /> {app.applicant?.panNumber || "No PAN"} |{" "}
              {app.applicant?.category || "Gen"}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Employment & Income",
      accessor: "occupation",
      render: (_, app) => (
        <div>
          <div className="text-sm font-medium text-slate-700 flex items-center gap-1">
            <Briefcase size={14} className="text-slate-400" />
            {app.occupation?.category || "Salaried"}
          </div>
          <div className="text-xs text-green-600 font-semibold">
            Monthly: ₹
            {app.financials?.grossMonthlyIncome?.toLocaleString() || "0"}
          </div>
        </div>
      ),
    },
    {
      header: "Loan Structure",
      accessor: "loanDetails",
      render: (_, app) => (
        <div className="space-y-1">
          <div className="text-sm font-bold text-blue-600 flex items-center">
            <IndianRupee size={14} /> {app.requestedAmount?.toLocaleString()}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
            {app.loanType || "Mortgage Loan"} • {app.tenureMonths} Mo.
          </div>
        </div>
      ),
    },
    {
      header: "Risk Grade (CIBIL)",
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
      render: (status) => (
        <span
          className={`px-2 py-1 rounded-md text-[11px] font-bold border uppercase ${
            status === "approved"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-amber-50 border-amber-200 text-amber-700"
          }`}
        >
          {status}
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
    <div className="min-h-screen bg-[#f8fafc] p-6">
      {/* NBFC Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="text-blue-600" size={28} />
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                MASCOT PROJECTS LOS
              </h1>
            </div>
            <p className="text-slate-500 text-sm font-medium">
              Non-Banking Finance Operations Control
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
          >
            <Plus size={18} className="mr-2" /> Start New Underwriting
          </Button>
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

        {/* Application Data Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-700">Recent Applications</h3>
            <div className="text-xs font-medium text-slate-400 italic font-mono">
              Real-time NBFC Sync Enabled
            </div>
          </div>
          <ApplicationPageTable
            applications={paginatedApplications}
            tableColumns={tableColumns}
            onViewDetails={(app) => {
              setSelectedApp(app);
              setViewModalOpen(true);
            }}
          />
        </div>
      </div>

      {/* Modals */}
      {showForm && <LoanApplicationForm onClose={() => setShowForm(false)} />}
      {viewModalOpen && (
        <LoanApplicationView
          application={selectedApp}
          onClose={() => setViewModalOpen(false)}
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
