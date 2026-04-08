import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Hash,
  IndianRupee,
  ShieldCheck,
  Briefcase,
  Clock3,
  CircleCheckBig,
  CircleX,
  FileCheck2,
  FileClock,
} from "lucide-react";
import Button from "../../../components/ui/Button";
import StatusCard from "../../../components/common/StatusCard";
import ConfirmationDialog from "../../../components/common/ConfirmationDialog";
import ApplicationPageTable from "../../../components/tables/ApplicationPageTable";
import LoanApplicationView from "../ViewDetail/LoanApplicationView";
import LoanApplicationForm from "../../../components/forms/LoanApplication/LoanApplicationForm";
import { useLoanApplication } from "../../../hooks/useLoanApplication";

import {
  useLoanApplications,
  useUpdateLoanStatus,
} from "../../../hooks/useLoanApplication";
import { SAMPLE_LOAN_APPLICATIONS } from "../../../lib/LOSDummyData";
import { showError, showInfo } from "../../../lib/utils/toastService";

export default function ProfessionalNBFCPortal() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState("ALL");

  // Correct usage: call the hook inside the component, after selectedId is defined
  const { data: selectedApp, isLoading } = useLoanApplication(selectedId);
  const {
    data: applicationsResponse,
    refetch: refetchApplications,
    isFetching: refreshingApplications,
  } = useLoanApplications();
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

  const getApplicationDate = (app) => {
    const raw = app?.applicationDate || app?.createdAt || app?.updatedAt;
    if (!raw) return null;
    const d = new Date(raw);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  const inDateRange = (appDate, range) => {
    if (!appDate || !range || range === "ALL") return true;

    const now = new Date();
    const startToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    if (range === "TODAY") {
      return appDate >= startToday;
    }

    if (range === "WEEK") {
      const startWeek = new Date(startToday);
      const day = startWeek.getDay();
      const diff = day === 0 ? 6 : day - 1;
      startWeek.setDate(startWeek.getDate() - diff);
      return appDate >= startWeek;
    }

    if (range === "MONTH") {
      const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return appDate >= startMonth;
    }

    if (range === "LAST_3_MONTHS") {
      const start = new Date(
        now.getFullYear(),
        now.getMonth() - 3,
        now.getDate(),
      );
      return appDate >= start;
    }

    if (range === "LAST_6_MONTHS") {
      const start = new Date(
        now.getFullYear(),
        now.getMonth() - 6,
        now.getDate(),
      );
      return appDate >= start;
    }

    if (range === "YEAR") {
      const startYear = new Date(now.getFullYear(), 0, 1);
      return appDate >= startYear;
    }

    return true;
  };

  const handleRefreshApplications = async () => {
    showInfo("Refreshing applications...");
    await refetchApplications();
  };

  const handleApproveApplication = () => {
    if (!selectedApp?.id) {
      showError("No application selected for approval");
      return;
    }

    // Correct usage: call the hook inside the component, after selectedId is defined
    updateStatus({
      id: selectedApp.id,
      status: "approved",
    });
    setShowApproveDialog(false);
    setViewModalOpen(false);
  };

  // Filter applications based on search term
  const filteredApplications = applications.filter((app) => {
    const appDate = getApplicationDate(app);
    const matchesStatus =
      !statusFilter ||
      (app.status && app.status.toLowerCase() === statusFilter.toLowerCase());
    const matchesDate = inDateRange(appDate, dateRange);
    const matchesSearch =
      `${app.customer?.firstName || ""} ${app.customer?.lastName || ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      app.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.customer?.panNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch && matchesDate;
  });

  const statusCounts = useMemo(() => {
    return filteredApplications.reduce((acc, app) => {
      const key = String(app?.status || "PENDING").toUpperCase();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [filteredApplications]);

  const totalApplications = filteredApplications.length;
  const statusCards = [
    {
      title: "Total Applications",
      value: totalApplications,
      icon: FileCheck2,
      colorClass: "text-white",
      bgClass: "bg-gradient-to-r from-blue-500 to-blue-600",
      percent: totalApplications ? 100 : 0,
    },
    {
      title: "Pending",
      value: statusCounts.PENDING || 0,
      icon: Clock3,
      colorClass: "text-amber-700",
      bgClass: "bg-amber-50",
      percent: totalApplications
        ? Math.round(((statusCounts.PENDING || 0) / totalApplications) * 100)
        : 0,
    },
    {
      title: "Under Review",
      value: statusCounts.UNDER_REVIEW || 0,
      icon: FileClock,
      colorClass: "text-indigo-700",
      bgClass: "bg-indigo-50",
      percent: totalApplications
        ? Math.round(
            ((statusCounts.UNDER_REVIEW || 0) / totalApplications) * 100,
          )
        : 0,
    },
    {
      title: "Approved",
      value: statusCounts.APPROVED || 0,
      icon: CircleCheckBig,
      colorClass: "text-green-700",
      bgClass: "bg-green-50",
      percent: totalApplications
        ? Math.round(((statusCounts.APPROVED || 0) / totalApplications) * 100)
        : 0,
    },
    {
      title: "Rejected",
      value: statusCounts.REJECTED || 0,
      icon: CircleX,
      colorClass: "text-red-700",
      bgClass: "bg-red-50",
      percent: totalApplications
        ? Math.round(((statusCounts.REJECTED || 0) / totalApplications) * 100)
        : 0,
    },
  ];

  // Status filter options for dropdown
  const filterOptions = [
    { label: "All", value: "" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
    // Add more statuses as needed
  ];

  const tableColumns = [
    {
      header: "Applicant",
      accessor: "customer",
      render: (_, app) => {
        const firstName =
          app.customer?.firstName || app.applicant?.firstName || "";
        const lastName =
          app.customer?.lastName || app.applicant?.lastName || "";
        const fullName = `${firstName} ${lastName}`.trim() || "Unknown";
        const initial = fullName.charAt(0) || "U";
        const loanNumber = app.loanNumber || app.loan?.loanNumber || "-";

        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-blue-700 font-bold border border-slate-200">
              {initial}
            </div>
            <div>
              <div className="font-bold text-slate-900">{fullName}</div>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <Hash size={12} /> {loanNumber}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: "Employment",
      accessor: "occupation",
      render: (_, app) => {
        const grossMonthly =
          app.customer?.financialDetails?.grossMonthlyIncome ??
          app.financials?.grossMonthlyIncome ??
          app.customer?.grossMonthlyIncome;
        const netMonthly =
          app.customer?.financialDetails?.netMonthlyIncome ??
          app.financials?.netMonthlyIncome ??
          app.customer?.netMonthlyIncome;

        const fmt = (v) =>
          typeof v === "number" ? v.toLocaleString() : v || "Not provided";

        return (
          <div>
            <div className="text-sm font-medium text-slate-700 flex items-center gap-1">
              <Briefcase size={14} className="text-slate-400" />
              {app.occupation?.category || "Salaried"}
            </div>
            <div className="text-xs text-green-600 font-semibold">
              Gross: ₹{fmt(grossMonthly)}
            </div>
            <div className="text-xs text-slate-500">
              Net: ₹{fmt(netMonthly)}
            </div>
          </div>
        );
      },
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
    return (
      <LoanApplicationForm
        onClose={() => setShowForm(false)}
        onSuccess={() => {
          setShowForm(false);
          refetchApplications();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-3 sm:p-4 lg:p-6">
      {/* NBFC Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end mb-6 sm:mb-8 border-b border-slate-200 pb-4 sm:pb-6">
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
            className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 w-full sm:w-auto justify-center"
          >
            <Plus size={18} className="mr-2" /> New Application
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3 sm:gap-4 mb-5 sm:mb-6">
          {statusCards.map((card) => (
            <StatusCard
              key={card.title}
              title={card.title}
              value={card.value}
              icon={card.icon}
              colorClass={card.colorClass}
              bgClass={card.bgClass}
              percent={card.percent}
            />
          ))}
        </div>

        {/* Application Data Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <ApplicationPageTable
            applications={filteredApplications}
            tableColumns={tableColumns}
            onRefresh={handleRefreshApplications}
            refreshing={refreshingApplications}
            onViewDetails={(app) => {
              setSelectedId(app.id);
              setViewModalOpen(true);
            }}
            onEdit={(app) => {
              setSelectedId(app.id);
              // open the form in edit mode
              setShowForm(true);
            }}
            filterOptions={filterOptions}
            filterValue={statusFilter}
            setFilterValue={setStatusFilter}
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
        </div>
      </div>

      {/* Modals */}
      {showForm && (
        <LoanApplicationForm
          onClose={() => setShowForm(false)}
          initialData={selectedApp}
          onSuccess={() => {
            setShowForm(false);
            refetchApplications();
          }}
        />
      )}
      {viewModalOpen && (
        <LoanApplicationView
          application={selectedApp}
          isLoading={isLoading}
          onClose={() => {
            setViewModalOpen(false);
            setSelectedId(null);
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
