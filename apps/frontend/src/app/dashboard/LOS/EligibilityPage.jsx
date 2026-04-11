import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  FileStack,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import toast from "react-hot-toast";
import SearchField from "../../../components/ui/SearchField";
import Button from "../../../components/ui/Button";
import StatusCard from "../../../components/common/StatusCard";
import EligibilityTable from "../../../components/tables/EligibilityTable";
import EligibilityModal from "../../../components/modals/EligibilityModal";
import { apiGet } from "../../../lib/api/apiClient";
import {
  useLoanApplications,
  useUpdateLoanStatus,
} from "../../../hooks/useLoanApplication";

const normalizeResult = (payload) => payload?.data || payload || null;

const normalizeRows = (applications, resultsMap) => {
  return applications.map((app) => {
    const result = resultsMap[app.id];
    const applicantName = [app.customer?.firstName, app.customer?.lastName]
      .filter(Boolean)
      .join(" ");

    return {
      id: app.id,
      loanNumber: app.loanNumber,
      applicantName: applicantName || app.applicantName || "-",
      contactNumber: app.customer?.contactNumber || app.customer?.phone || "-",
      requestedAmount: app.requestedAmount,
      applicationStatus: app.status,
      eligibilityStatus: result?.status || null,
    };
  });
};

export default function EligibilityPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [checkingId, setCheckingId] = React.useState(null);
  const [eligibilityResults, setEligibilityResults] = React.useState({});
  const [selectedApplicationId, setSelectedApplicationId] =
    React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const {
    data: applicationsData,
    isLoading,
    error,
    refetch,
  } = useLoanApplications();

  const updateStatusMutation = useUpdateLoanStatus();
  const applications = React.useMemo(
    () => applicationsData?.data || applicationsData || [],
    [applicationsData],
  );

  const filteredApplications = React.useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return applications;
    return applications.filter((app) => {
      const fullName =
        `${app.customer?.firstName || ""} ${app.customer?.lastName || ""}`.toLowerCase();
      return (
        String(app.loanNumber || "")
          .toLowerCase()
          .includes(term) ||
        String(app.id || "")
          .toLowerCase()
          .includes(term) ||
        fullName.includes(term)
      );
    });
  }, [applications, searchTerm]);

  const tableRows = React.useMemo(
    () => normalizeRows(filteredApplications, eligibilityResults),
    [filteredApplications, eligibilityResults],
  );

  const selectedApplication = React.useMemo(
    () => applications.find((app) => app.id === selectedApplicationId) || null,
    [applications, selectedApplicationId],
  );

  // Auto-open modal when `loanId` query param is present
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const loanId = params.get("loanId");
    if (loanId) {
      // If the provided loanId is the application id or loanNumber, try to resolve to id
      const matched = applications.find(
        (a) => a.id === loanId || a.loanNumber === loanId,
      );
      if (matched) {
        setSelectedApplicationId(matched.id);
        setIsModalOpen(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, applications]);

  const checkedResults = React.useMemo(
    () => Object.values(eligibilityResults),
    [eligibilityResults],
  );

  const stats = React.useMemo(() => {
    const eligible = checkedResults.filter(
      (x) => x?.status === "ELIGIBLE",
    ).length;
    const flagged = checkedResults.filter(
      (x) =>
        x?.status === "INELIGIBLE" ||
        x?.status === "PARTIALLY_ELIGIBLE" ||
        x?.status === "ERROR",
    ).length;

    return {
      total: applications.length,
      checked: checkedResults.length,
      eligible,
      flagged,
    };
  }, [applications.length, checkedResults]);

  const handleCheckEligibility = async (loanApplicationId) => {
    if (!loanApplicationId || checkingId) return;
    setCheckingId(loanApplicationId);
    try {
      const response = await apiGet(
        `/risk/eligibility-check/${loanApplicationId}`,
      );
      const result = normalizeResult(response);
      setEligibilityResults((prev) => ({
        ...prev,
        [loanApplicationId]: result,
      }));
      setSelectedApplicationId(loanApplicationId);
      setIsModalOpen(true);
    } catch (err) {
      toast.error(err?.message || "Failed to check eligibility");
    } finally {
      setCheckingId(null);
    }
  };

  const handleViewDetails = (loanApplicationId) => {
    setSelectedApplicationId(loanApplicationId);
    setIsModalOpen(true);
  };

  const handleEligibilityLoaded = (loanApplicationId, result) => {
    if (!loanApplicationId || !result) return;
    setEligibilityResults((prev) => ({ ...prev, [loanApplicationId]: result }));
  };

  const handleUpdateStatus = async (loanApplicationId, status) => {
    try {
      await updateStatusMutation.mutateAsync({ id: loanApplicationId, status });
      refetch();
    } catch {
      // useUpdateLoanStatus already shows toast
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Eligibility Review
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Review loan applications, run eligibility checks, and approve or
              reject loan rules.
            </p>
          </div>
          <div className="w-full sm:w-80">
            <SearchField
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm("")}
              placeholder="Search loan number or applicant..."
              showResults={false}
            />
          </div>
          <Button
            className="px-4! py-2! bg-slate-700 hover:bg-slate-800"
            onClick={() => refetch()}
          >
            <RefreshCw size={16} /> Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatusCard
            title="Total Applications"
            value={stats.total}
            icon={FileStack}
            colorClass="text-blue-700"
            bgClass="bg-blue-100"
          />
          <StatusCard
            title="Eligibility Checked"
            value={stats.checked}
            icon={CheckCircle2}
            colorClass="text-emerald-700"
            bgClass="bg-emerald-100"
          />
          <StatusCard
            title="Eligible"
            value={stats.eligible}
            icon={CheckCircle2}
            colorClass="text-green-700"
            bgClass="bg-green-100"
          />
          <StatusCard
            title="Needs Attention"
            value={stats.flagged}
            icon={ShieldAlert}
            colorClass="text-amber-700"
            bgClass="bg-amber-100"
          />
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            <div className="flex items-center gap-2 font-semibold">
              <AlertCircle size={18} /> Failed to load applications
            </div>
            <p className="text-sm mt-1">
              {error?.message || "Please try again."}
            </p>
          </div>
        ) : (
          <EligibilityTable
            rows={tableRows}
            loading={isLoading}
            checkingId={checkingId}
            onCheckEligibility={handleCheckEligibility}
            onViewDetails={handleViewDetails}
          />
        )}

        <EligibilityModal
          open={isModalOpen}
          application={selectedApplication}
          onClose={() => setIsModalOpen(false)}
          onEligibilityLoaded={handleEligibilityLoaded}
          onApproveRules={(id) => handleUpdateStatus(id, "LOANRULES_APPROVED")}
          onRejectRules={(id) => handleUpdateStatus(id, "LOANRULES_REJECTED")}
          isUpdatingStatus={updateStatusMutation.isLoading}
        />
      </div>
    </div>
  );
}
