import React, { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useLoanApplication } from "../../../hooks/useLoanApplication";
import { useEligibility } from "../../../hooks/useEligibility";
import { useRefreshCreditReport } from "../../../hooks/useCreditReport";
import {
  ArrowLeft,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Shield,
  CreditCard,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Banknote,
  Calendar,
  Users,
  Building2,
  Info,
} from "lucide-react";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// Helper: format currency
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "N/A";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Helper: get badge for eligibility status
const getEligibilityBadge = (status) => {
  const s = (status || "").toLowerCase();
  if (s === "eligible")
    return { icon: CheckCircle, color: "bg-emerald-100 text-emerald-700", label: "Eligible" };
  if (s === "ineligible")
    return { icon: XCircle, color: "bg-red-100 text-red-700", label: "Ineligible" };
  return { icon: AlertCircle, color: "bg-amber-100 text-amber-700", label: "Pending" };
};

// Helper: get score color
const getScoreColor = (score) => {
  if (score >= 750) return "text-emerald-600";
  if (score >= 650) return "text-blue-600";
  if (score >= 550) return "text-amber-600";
  return "text-red-600";
};

const getScoreLabel = (score) => {
  if (score >= 750) return "Excellent";
  if (score >= 650) return "Good";
  if (score >= 550) return "Average";
  return "Poor";
};

// Helper: DPD badge
const getDpdBadge = (dpd) => {
  if (dpd === 0) return { color: "bg-emerald-100 text-emerald-700", label: "No Delay" };
  if (dpd <= 30) return { color: "bg-blue-100 text-blue-700", label: `${dpd} days` };
  if (dpd <= 60) return { color: "bg-amber-100 text-amber-700", label: `${dpd} days` };
  return { color: "bg-red-100 text-red-700", label: `${dpd} days` };
};

const WhiteCard = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-5 ${className}`}>{children}</div>
);

const StatCard = ({ title, value, icon: Icon, color = "blue" }) => (
  <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-slate-500">{title}</p>
        <p className="text-xl font-bold text-slate-800">{value}</p>
      </div>
      <div className={`p-2 bg-${color}-100 rounded-lg`}>
        <Icon className={`w-5 h-5 text-${color}-600`} />
      </div>
    </div>
  </div>
);

const CreditReportView = () => {
  const { loanId } = useParams();
  const navigate = useNavigate();
  const query = useQuery();
  const party = query.get("party") || "applicant";
  const partyId = query.get("partyId");

  const { data: loanData, isLoading: loanLoading } = useLoanApplication(loanId);
  const loan = loanData || {};

  const eligibility = useEligibility(loanId);
  const refreshReport = useRefreshCreditReport();

  useEffect(() => {
    let q = loan.loanNumber || loanId;
    if (party === "coapplicant" && partyId) q = partyId;
    if (party === "guarantor" && partyId) q = partyId;
    if (party === "applicant") {
      q = loan.customer?.contactNumber || loan.customer?.panNumber || loan.loanNumber || q;
    }
    if (q) refreshReport.mutate({ q, reason: `view-${party}` });
  }, [loanId, loan.loanNumber, loan.customer?.contactNumber, loan.customer?.panNumber, partyId]);

  // Extract credit report data
  const creditData = refreshReport.data?.data || refreshReport.data || {};
  const creditScore = creditData.creditScore;
  const scoreMeta = creditScore ? { color: getScoreColor(creditScore), label: getScoreLabel(creditScore) } : null;

  // Eligibility data
  const eligData = eligibility.data || {};
  const eligStatus = eligData.status;
  const { icon: EligIcon, color: EligColor, label: EligLabel } = getEligibilityBadge(eligStatus);
  const risk = eligData.risk || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Credit & Eligibility Report</h1>
            <p className="text-slate-500">
              Loan: {loan.loanNumber || loanId} • Party: {party.charAt(0).toUpperCase() + party.slice(1)}
              {partyId && ` • ID: ${partyId}`}
            </p>
          </div>
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ==================== ELIGIBILITY SECTION ==================== */}
          <WhiteCard>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-800">Eligibility Assessment</h2>
            </div>

            {eligibility.isLoading || loanLoading ? (
              <div className="flex items-center gap-2 text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading eligibility...
              </div>
            ) : eligibility.error ? (
              <div className="text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {eligibility.error?.message || "Failed to load eligibility"}
              </div>
            ) : eligData && Object.keys(eligData).length > 0 ? (
              <div className="space-y-5">
                {/* Status Badge */}
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${EligColor}`}>
                  <EligIcon className="w-4 h-4" /> {EligLabel}
                </div>

                {/* Amounts */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-500">Max Eligible Amount</p>
                    <p className="text-lg font-bold text-slate-800">{formatCurrency(eligData.maxEligibleAmount)}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-500">Eligible EMI</p>
                    <p className="text-lg font-bold text-slate-800">{formatCurrency(eligData.eligibleEmi)}</p>
                  </div>
                </div>

                {/* Reasons */}
                {eligData.reason && eligData.reason.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">Reasons</p>
                    <ul className="space-y-1">
                      {eligData.reason.map((r, idx) => (
                        <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Rule Summary */}
                {eligData.ruleSummary && (
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-sm font-medium text-slate-700 mb-2">Rule Summary</p>
                    <div className="flex justify-between text-sm">
                      <span>Total Rules: <strong>{eligData.ruleSummary.totalRules}</strong></span>
                      <span>Passed: <strong className="text-emerald-600">{eligData.ruleSummary.passedRules}</strong></span>
                      <span>Failed: <strong className="text-red-600">{eligData.ruleSummary.failedRules}</strong></span>
                    </div>
                  </div>
                )}

                {/* Risk Assessment */}
                {risk && Object.keys(risk).length > 0 && (
                  <div className="border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="w-4 h-4 text-purple-600" />
                      <p className="text-sm font-semibold text-slate-700">Risk Assessment</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-purple-50 rounded-xl p-2 text-center">
                        <p className="text-xs text-purple-600">Risk Grade</p>
                        <p className="text-xl font-bold text-purple-700">{risk.grade || "N/A"}</p>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-2 text-center">
                        <p className="text-xs text-purple-600">Risk Score</p>
                        <p className="text-xl font-bold text-purple-700">{risk.score ?? "N/A"}</p>
                      </div>
                    </div>
                    {risk.reasons && risk.reasons.length > 0 && (
                      <ul className="space-y-1">
                        {risk.reasons.map((reason, idx) => (
                          <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                            <AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {/* Raw JSON (collapsible) */}
                <details className="bg-slate-50 rounded-xl p-2 text-xs">
                  <summary className="cursor-pointer font-medium text-slate-500">View raw eligibility data</summary>
                  <pre className="whitespace-pre-wrap overflow-auto mt-2">{JSON.stringify(eligData, null, 2)}</pre>
                </details>
              </div>
            ) : (
              <div className="text-slate-400">No eligibility data available.</div>
            )}
          </WhiteCard>

          {/* ==================== CREDIT REPORT SECTION ==================== */}
          <WhiteCard>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-slate-800">Credit Report</h2>
            </div>

            {refreshReport.isLoading ? (
              <div className="flex items-center gap-2 text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin" /> Fetching credit report...
              </div>
            ) : refreshReport.isError ? (
              <div className="text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {refreshReport.error?.response?.data?.message || refreshReport.error?.message || "Failed to fetch credit report"}
              </div>
            ) : creditData && Object.keys(creditData).length > 0 ? (
              <div className="space-y-5">
                {/* CIBIL Score Card */}
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 text-center">
                  <p className="text-sm text-slate-500">CIBIL Score</p>
                  <p className={`text-4xl font-bold ${scoreMeta?.color || "text-slate-800"}`}>
                    {creditScore ?? "N/A"}
                  </p>
                  {scoreMeta && <p className="text-sm font-medium">{scoreMeta.label}</p>}
                  <p className="text-xs text-slate-400 mt-1">Provider: {creditData.provider || "CIBIL"}</p>
                  <p className="text-xs text-slate-400">Fetched: {creditData.fetchedAt ? new Date(creditData.fetchedAt).toLocaleString() : "N/A"}</p>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <StatCard title="Active Loans" value={creditData.totalAtiveLoans ?? 0} icon={CreditCard} color="blue" />
                  <StatCard title="Total Outstanding" value={formatCurrency(creditData.totalOutstandingLoans)} icon={Banknote} color="amber" />
                  <StatCard title="Monthly EMI" value={formatCurrency(creditData.totalMonthlyEmi)} icon={TrendingUp} color="emerald" />
                  <StatCard title="Max DPD" value={`${creditData.maxDPD ?? 0} days`} icon={AlertCircle} color="red" />
                  <StatCard title="Overdue Accounts" value={creditData.overdueAccounts ?? 0} icon={AlertTriangle} color="orange" />
                  <StatCard title="Settled Count" value={creditData.settledCounts ?? 0} icon={CheckCircle} color="green" />
                </div>

                {/* Credit Accounts Table */}
                {creditData.creditAccount && creditData.creditAccount.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-3">Credit Accounts</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-3 py-2 text-left">Lender</th>
                            <th className="px-3 py-2 text-left">Type</th>
                            <th className="px-3 py-2 text-left">Status</th>
                            <th className="px-3 py-2 text-right">Sanctioned</th>
                            <th className="px-3 py-2 text-right">Outstanding</th>
                            <th className="px-3 py-2 text-right">EMI</th>
                            <th className="px-3 py-2 text-center">DPD</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {creditData.creditAccount.map((acc) => (
                            <tr key={acc.id} className="hover:bg-slate-50">
                              <td className="px-3 py-2 font-medium">{acc.lenderName}</td>
                              <td className="px-3 py-2">{acc.accountType?.replace(/_/g, " ")}</td>
                              <td className="px-3 py-2">
                                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                                  acc.accountStatus === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                                }`}>
                                  {acc.accountStatus}
                                </span>
                              </td>
                              <td className="px-3 py-2 text-right">{formatCurrency(acc.sanctionedAmount)}</td>
                              <td className="px-3 py-2 text-right">{formatCurrency(acc.outstanding)}</td>
                              <td className="px-3 py-2 text-right">{formatCurrency(acc.emiAmount)}</td>
                              <td className="px-3 py-2 text-center">
                                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getDpdBadge(acc.dpd).color}`}>
                                  {acc.dpd === 0 ? "0" : `${acc.dpd}d`}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Thin file / NTC indicators */}
                {(creditData.isThinFile || creditData.isNTC) && (
                  <div className="bg-amber-50 rounded-xl p-3 text-amber-700 text-sm flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    {creditData.isThinFile && "Thin file – limited credit history. "}
                    {creditData.isNTC && "No credit history available."}
                  </div>
                )}

                {/* Raw JSON (collapsible) */}
                <details className="bg-slate-50 rounded-xl p-2 text-xs">
                  <summary className="cursor-pointer font-medium text-slate-500">View raw credit report</summary>
                  <pre className="whitespace-pre-wrap overflow-auto mt-2">{JSON.stringify(creditData, null, 2)}</pre>
                </details>
              </div>
            ) : (
              <div className="text-slate-400">No credit report available.</div>
            )}
          </WhiteCard>
        </div>
      </div>
    </div>
  );
};

export default CreditReportView;