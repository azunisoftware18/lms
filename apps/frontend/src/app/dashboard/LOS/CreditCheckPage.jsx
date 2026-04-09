import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Shield,
  RefreshCw,
  Eye,
  User,
  AlertCircle,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useLoanApplications } from "../../../hooks/useLoanApplication";
import { useEligibility } from "../../../hooks/useEligibility";
import { useRefreshCreditReport } from "../../../hooks/useCreditReport";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// charts will be computed from API data

const CreditDashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [selectedParty, setSelectedParty] = useState(null);

  // Fetch real loan applications
  const { data, isLoading, refetch } = useLoanApplications();
  const applications = data?.data || data || [];

  // Helpers to normalize fields
  const getAppDate = (app) => {
    return (
      app.createdAt ||
      app.created_at ||
      app.submittedAt ||
      app.submitted_at ||
      app.updatedAt ||
      app.updated_at ||
      null
    );
  };

  const getCibil = (app) => {
    return (
      app.cibilScore ??
      app.cibil_score ??
      app.creditScore ??
      app.credit_score ??
      app.customer?.cibilScore ??
      app.customer?.creditScore ??
      null
    );
  };

  // Compute monthly trends and distributions from applications
  const monthlyMap = {};
  const scoreBuckets = [
    { range: "Approved", count: 0, color: "#ef4444" },
    { range: "Pending", count: 0, color: "#f59e0b" },
    { range: "Reject", count: 0, color: "#3b82f6" },
    { range: "Eligible-approved", count: 0, color: "#10b981" },
    { range: "Eligible-reject", count: 0, color: "#8b5cf6" },
  ];
  const loanTypeMap = {};

  applications.forEach((app) => {
    // Monthly grouping
    const rawDate = getAppDate(app);
    const d = rawDate ? new Date(rawDate) : null;
    const monthKey = d
      ? d.toLocaleString("en-US", { month: "short", year: "numeric" })
      : "Unknown";
    if (!monthlyMap[monthKey])
      monthlyMap[monthKey] = {
        month: monthKey,
        applications: 0,
        totalScore: 0,
        avgScore: 0,
      };
    monthlyMap[monthKey].applications += 1;

    const cibil = getCibil(app);
    if (typeof cibil === "number") {
      monthlyMap[monthKey].totalScore += cibil;
    }

    // Determine application/eligibility category for distribution
    const rawElig =
      app.eligibilityStatus ||
      app.eligibility?.status ||
      app.eligibilityResult?.status ||
      app.eligibilityResult?.result?.status ||
      null;
    const eligStr = rawElig ? String(rawElig).toLowerCase() : null;
    const appStatus = (
      app.status ||
      app.applicationStatus ||
      app.loanStatus ||
      ""
    )
      .toString()
      .toLowerCase();

    let category = "Pending";
    if (eligStr) {
      if (eligStr.includes("eligible") || eligStr.includes("approved")) {
        category =
          appStatus === "approved" ? "Eligible-approved" : "Eligible-reject";
      } else if (
        eligStr.includes("ineligible") ||
        eligStr.includes("reject") ||
        eligStr.includes("rejected")
      ) {
        category = "Reject";
      } else {
        category = appStatus === "approved" ? "Approved" : "Pending";
      }
    } else {
      if (appStatus === "approved") category = "Approved";
      else if (appStatus === "rejected" || appStatus === "reject")
        category = "Reject";
      else category = "Pending";
    }

    const bucket = scoreBuckets.find(
      (b) => b.range.toLowerCase() === category.toLowerCase(),
    );
    if (bucket) bucket.count += 1;

    // loan type
    const lt =
      (app.loanType && (app.loanType.code || app.loanType.name)) ||
      app.purpose ||
      app.purposeType ||
      "OTHER";
    const ltKey = (
      typeof lt === "string" ? lt : JSON.stringify(lt)
    ).toUpperCase();
    loanTypeMap[ltKey] = (loanTypeMap[ltKey] || 0) + 1;
  });

  const monthlyTrends = Object.values(monthlyMap)
    .sort((a, b) => new Date(a.month) - new Date(b.month))
    .map((m) => ({
      month: m.month.split(" ")[0],
      applications: m.applications,
      avgScore: m.applications
        ? Math.round(m.totalScore / m.applications)
        : null,
    }));

  const scoreDistribution = scoreBuckets.map((b) => ({
    range: b.range,
    count: b.count,
    color: b.color,
  }));

  const loanTypeDistribution = Object.keys(loanTypeMap).map((k, i) => ({
    type: k,
    count: loanTypeMap[k],
    color: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec489a"][i % 5],
  }));

  // Fetch eligibility for the loan application (use loan id)
  const eligibility = useEligibility(selectedLoan?.id);
  // Use mutation to refresh/fetch credit report from backend (refresh endpoint)
  const refreshReport = useRefreshCreditReport();

  // Derived KPI values
  const totalApplications = applications.length || 0;
  const avgCibilScore = Math.round(
    applications.reduce((s, a) => s + (getCibil(a) || 0), 0) /
      (applications.filter((a) => typeof getCibil(a) === "number").length ||
        1) || 0,
  );
  const approvedCount = applications.filter(
    (a) => (a.status || "").toLowerCase() === "approved",
  ).length;

  // Helper to open modal and select applicant only
  const handleCreditCheck = (loan) => {
    setSelectedLoan(loan);
    const applicant = { id: loan.customer?.id, ...loan.customer };
    setSelectedParty({ ...applicant, label: "Applicant" });
    setModalOpen(true);
    // Trigger initial fetch of credit report for the loan (backend accepts loanNumber as q)
    try {
      refreshReport.mutate({ q: loan.loanNumber, reason: "manual-check" });
    } catch (err) {
      console.error("Failed to refresh credit report:", err);
    }
  };

  const navigate = useNavigate();

  const hasCoApplicant = !!(
    selectedLoan &&
    (selectedLoan.coApplicant ||
      (selectedLoan.coApplicants && selectedLoan.coApplicants.length > 0) ||
      (selectedLoan.coapplicants && selectedLoan.coapplicants.length > 0))
  );

  const hasGuarantor = !!(
    selectedLoan &&
    (selectedLoan.guarantor ||
      (selectedLoan.guarantors && selectedLoan.guarantors.length > 0))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Credit Dashboard
              </h1>
            </div>
            <p className="text-slate-500 ml-12">
              Real-time credit health & loan application insights
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refetch}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-700"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* KPI Cards & Charts */}
          <div className="p-5 border-b border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-gradient-to-r from-white to-slate-50 rounded-xl border border-slate-100 shadow-sm">
                <div className="text-sm text-slate-500">Total Applications</div>
                <div className="text-2xl font-bold text-slate-800">
                  {totalApplications}
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-white to-slate-50 rounded-xl border border-slate-100 shadow-sm">
                <div className="text-sm text-slate-500">Avg CIBIL Score</div>
                <div className="text-2xl font-bold text-slate-800">
                  {avgCibilScore}
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-white to-slate-50 rounded-xl border border-slate-100 shadow-sm">
                <div className="text-sm text-slate-500">Approvals</div>
                <div className="text-2xl font-bold text-slate-800">
                  {approvedCount}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div className="text-sm font-semibold mb-2">
                  Monthly Applications
                </div>
                <div style={{ width: "100%", height: 180 }}>
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart
                      data={monthlyTrends}
                      margin={{ top: 0, right: 12, left: -12, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorApps"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3b82f6"
                            stopOpacity={0.2}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3b82f6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="applications"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#colorApps)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div className="text-sm font-semibold mb-2">
                  Score Distribution
                </div>
                <div style={{ width: "100%", height: 180 }}>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={scoreDistribution}
                        dataKey="count"
                        nameKey="range"
                        outerRadius={60}
                        fill="#8884d8"
                      >
                        {scoreDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div className="text-sm font-semibold mb-2">Loan Type Mix</div>
                <div style={{ width: "100%", height: 180 }}>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart
                      data={loanTypeDistribution}
                      margin={{ left: -20 }}
                    >
                      <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count">
                        {loanTypeDistribution.map((entry, idx) => (
                          <Cell key={`bar-${idx}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
          <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800">
              Recent Loan Applications
            </h3>
            <span className="text-xs text-slate-400">
              {applications.length} total
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">
                    Loan Number
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">
                    Applicant
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">
                    Loan Type
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-slate-600">
                    Amount
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">
                    Status
                  </th>
                  <th className="px-5 py-3 text-center text-xs font-semibold text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8">
                      Loading...
                    </td>
                  </tr>
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8">
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-5 py-3 font-mono text-sm text-slate-600">
                        {app.loanNumber}
                      </td>
                      <td className="px-5 py-3 font-medium text-slate-800">
                        {app.customer?.firstName} {app.customer?.lastName}
                      </td>
                      <td className="px-5 py-3 text-sm">
                        {app.purpose || "-"}
                      </td>
                      <td className="px-5 py-3 text-right font-medium text-slate-800">
                        ₹{app.approvedAmount?.toLocaleString("en-IN")}
                      </td>
                      <td className="px-5 py-3 text-left text-xs">
                        {app.status}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <button
                          className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 text-blue-600 text-xs font-semibold"
                          onClick={() => handleCreditCheck(app)}
                        >
                          Credit Check
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Credit Check */}
        {modalOpen && selectedLoan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
              <button
                className="absolute top-3 right-3 p-2 rounded-full hover:bg-slate-100"
                onClick={() => setModalOpen(false)}
              >
                <XCircle className="w-5 h-5 text-slate-400" />
              </button>
              <h2 className="text-xl font-bold mb-2">Credit Check</h2>
              <div className="mb-4">
                <div className="font-semibold mb-1">Person:</div>
                <div className="flex gap-2 mb-2">
                  <button
                    className={`px-3 py-1.5 rounded-lg border ${selectedParty?.label === "Applicant" ? "bg-blue-600 text-white" : "bg-white text-slate-700"}`}
                    onClick={() => {
                      const applicant = {
                        id: selectedLoan.customer?.id,
                        ...selectedLoan.customer,
                      };
                      setSelectedParty({ ...applicant, label: "Applicant" });
                    }}
                  >
                    Applicant
                  </button>
                  {hasCoApplicant && (
                    <button
                      className={`px-3 py-1.5 rounded-lg border ${selectedParty?.label === "Co-applicant" ? "bg-blue-600 text-white" : "bg-white text-slate-700"}`}
                      onClick={() => {
                        const party =
                          (selectedLoan.coApplicants &&
                            selectedLoan.coApplicants[0]) ||
                          (selectedLoan.coapplicants &&
                            selectedLoan.coapplicants[0]) ||
                          selectedLoan.coApplicant ||
                          null;
                        if (party)
                          setSelectedParty({ ...party, label: "Co-applicant" });
                      }}
                    >
                      Co-applicant
                    </button>
                  )}
                  {hasGuarantor && (
                    <button
                      className={`px-3 py-1.5 rounded-lg border ${selectedParty?.label === "Guarantor" ? "bg-blue-600 text-white" : "bg-white text-slate-700"}`}
                      onClick={() => {
                        const party =
                          (selectedLoan.guarantors &&
                            selectedLoan.guarantors[0]) ||
                          selectedLoan.guarantor ||
                          null;
                        if (party)
                          setSelectedParty({ ...party, label: "Guarantor" });
                      }}
                    >
                      Guarantor
                    </button>
                  )}
                </div>
              </div>
              {selectedParty && (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl border border-blue-200 bg-blue-50 flex items-center gap-2 text-blue-700">
                    <User className="w-5 h-5" />
                    <span className="font-semibold">
                      {selectedParty.label}:
                    </span>
                    <span>
                      {selectedParty.name ||
                        selectedParty.firstName ||
                        selectedParty.lastName}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">
                      Eligibility Result:
                    </div>
                    {eligibility.isLoading ? (
                      <div className="flex items-center gap-2 text-blue-600">
                        <Loader2 className="w-4 h-4 animate-spin" /> Checking
                        eligibility...
                      </div>
                    ) : eligibility.error ? (
                      <div className="text-red-600">
                        {eligibility.error?.message ||
                          "Failed to fetch eligibility."}
                      </div>
                    ) : eligibility.data ? (
                      <div className="flex items-start justify-between gap-4">
                        <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 max-w-[70%]">
                          <div>
                            <strong>Status:</strong>{" "}
                            {eligibility.data.status ??
                              eligibility.data.result ??
                              String(eligibility.data?.status ?? "")}
                          </div>
                          {eligibility.data.reason && (
                            <div className="text-sm text-emerald-800 mt-1">
                              {Array.isArray(eligibility.data.reason)
                                ? eligibility.data.reason.slice(0, 3).join(", ")
                                : String(eligibility.data.reason)}
                            </div>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          <button
                            className="px-3 py-1.5 rounded-lg border bg-white text-slate-700 text-sm"
                            onClick={() => {
                              setModalOpen(false);
                              navigate(
                                `/admin/los/credit-report/${selectedLoan.id}?party=applicant`,
                              );
                            }}
                          >
                            View Eligibility
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="text-slate-400">
                          No eligibility data.
                        </div>
                        <button
                          className="px-3 py-1.5 rounded-lg border bg-white text-slate-700 text-sm"
                          onClick={() => {
                            setModalOpen(false);
                            navigate(
                              `/admin/los/credit-report/${selectedLoan.id}?party=applicant`,
                            );
                          }}
                        >
                          View Eligibility
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Credit Report:</div>
                    {refreshReport.isLoading ? (
                      <div className="flex items-center gap-2 text-blue-600">
                        <Loader2 className="w-4 h-4 animate-spin" /> Loading
                        credit report...
                      </div>
                    ) : refreshReport.isError ? (
                      <div className="text-red-600">
                        {refreshReport.error?.response?.data?.message ||
                          refreshReport.error?.message ||
                          "Failed to fetch credit report."}
                      </div>
                    ) : refreshReport.data ? (
                      <div className="flex items-start justify-between gap-4">
                        <div className="p-3 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 max-w-[70%]">
                          <div className="text-sm">
                            <strong>Report:</strong>{" "}
                            {String(
                              (refreshReport.data.data &&
                                (refreshReport.data.data.score ||
                                  refreshReport.data.data.cibilScore)) ||
                                (refreshReport.data.score ?? "Available"),
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0 flex flex-col gap-2">
                          <button
                            className="px-3 py-1.5 rounded-lg border bg-white text-slate-700 text-sm"
                            onClick={() => {
                              setModalOpen(false);
                              navigate(
                                `/admin/los/credit-report/${selectedLoan.id}?party=applicant`,
                              );
                            }}
                          >
                            View Applicant Report
                          </button>
                          {hasCoApplicant && (
                            <button
                              className="px-3 py-1.5 rounded-lg border bg-white text-slate-700 text-sm"
                              onClick={() => {
                                setModalOpen(false);
                                const party =
                                  (selectedLoan.coApplicants &&
                                    selectedLoan.coApplicants[0]) ||
                                  (selectedLoan.coapplicants &&
                                    selectedLoan.coapplicants[0]) ||
                                  selectedLoan.coApplicant;
                                navigate(
                                  `/admin/los/credit-report/${selectedLoan.id}?party=coapplicant&partyId=${party?.id}`,
                                );
                              }}
                            >
                              View Co-applicant Report
                            </button>
                          )}
                          {hasGuarantor && (
                            <button
                              className="px-3 py-1.5 rounded-lg border bg-white text-slate-700 text-sm"
                              onClick={() => {
                                setModalOpen(false);
                                const party =
                                  (selectedLoan.guarantors &&
                                    selectedLoan.guarantors[0]) ||
                                  selectedLoan.guarantor;
                                navigate(
                                  `/admin/los/credit-report/${selectedLoan.id}?party=guarantor&partyId=${party?.id}`,
                                );
                              }}
                            >
                              View Guarantor Report
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="text-slate-400">
                          No credit report data.
                        </div>
                        <div>
                          <button
                            className="px-3 py-1.5 rounded-lg border bg-white text-slate-700 text-sm"
                            onClick={() => {
                              setModalOpen(false);
                              navigate(
                                `/admin/los/credit-report/${selectedLoan.id}?party=applicant`,
                              );
                            }}
                          >
                            View Report
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditDashboard;
