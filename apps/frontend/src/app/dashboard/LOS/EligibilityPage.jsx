import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, XCircle, AlertCircle, Shield, Calendar, 
  DollarSign, Briefcase, FileText, CreditCard, UserCheck, 
  Users, Loader, Eye, Clock, MapPin, Home, Phone, Mail,
  User, Building, BookOpen, ChevronRight, Award, RefreshCw,
  TrendingDown, AlertTriangle, Info, Star, BarChart, ChevronDown,
  ThumbsUp, ThumbsDown
} from 'lucide-react';
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { apiGet, apiPut } from "../../../lib/api/apiClient";
import { useLoanApplications, useUpdateLoanStatus } from "../../../hooks/useLoanApplication";

// ============================================================================
// Helper Functions
// ============================================================================

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return 'Invalid date';
  }
};

const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

const getRiskGradeColor = (grade) => {
  switch(grade) {
    case 'A': return 'text-green-600 bg-green-100';
    case 'B': return 'text-blue-600 bg-blue-100';
    case 'C': return 'text-yellow-600 bg-yellow-100';
    case 'D': return 'text-orange-600 bg-orange-100';
    case 'E': return 'text-red-600 bg-red-100';
    case 'F': return 'text-red-800 bg-red-200';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const getStatusColor = (status) => {
  switch(status?.toUpperCase()) {
    case 'ELIGIBLE': return 'text-green-600 bg-green-100';
    case 'INELIGIBLE': return 'text-red-600 bg-red-100';
    case 'PARTIALLY_ELIGIBLE': return 'text-yellow-600 bg-yellow-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const getApplicationStatusColor = (status) => {
  const statusLower = status?.toLowerCase();
  switch(statusLower) {
    case 'application_in_progress': return 'text-blue-600 bg-blue-100';
    case 'under_review': return 'text-purple-600 bg-purple-100';
    case 'LOANRULES_APPROVED': return 'text-green-700 bg-green-100';
    case 'LOANRULES_REJECTED': return 'text-red-700 bg-red-100';
    case 'approved': return 'text-green-700 bg-green-100';
    case 'rejected': return 'text-red-700 bg-red-100';
    case 'disbursed': return 'text-indigo-600 bg-indigo-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

// ============================================================================
// Sub-components
// ============================================================================

const EligibilityResultCard = ({ result }) => {
  if (!result) return null;
  
  const isEligible = result.status === 'ELIGIBLE';
  const maxAmount = result.maxEligibleAmount;
  const reasons = result.reason || [];
  const ruleSummary = result.ruleSummary;
  const risk = result.risk;

  return (
    <div className={`mt-4 rounded-xl p-3 ${
      isEligible ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isEligible ? (
            <CheckCircle className="text-green-600" size={18} />
          ) : (
            <XCircle className="text-red-600" size={18} />
          )}
          <h4 className="font-semibold text-sm">Eligibility Result</h4>
        </div>
        <div className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(result.status)}`}>
          {result.status?.replace(/_/g, ' ') || 'UNKNOWN'}
        </div>
      </div>

      {maxAmount > 0 && !isEligible && (
        <div className="mb-3 p-2 bg-yellow-100 rounded-lg">
          <p className="text-xs font-semibold text-yellow-800">
            Max Eligible: {formatCurrency(maxAmount)}
          </p>
        </div>
      )}

      {reasons.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
            <AlertTriangle size={12} />
            Reasons:
          </p>
          <ul className="space-y-0.5">
            {reasons.slice(0, 2).map((reason, idx) => (
              <li key={idx} className="text-xs text-red-700 flex items-start gap-1">
                <XCircle size={10} className="mt-0.5 flex-shrink-0" />
                <span className="text-xs">{reason}</span>
              </li>
            ))}
            {reasons.length > 2 && (
              <li className="text-xs text-gray-500">+{reasons.length - 2} more</li>
            )}
          </ul>
        </div>
      )}

      {ruleSummary && (
        <div className="mb-3 p-2 bg-white rounded-lg">
          <div className="flex gap-3 justify-around">
            <div className="text-center">
              <p className="text-lg font-bold text-blue-600">{ruleSummary.totalRules}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-green-600">{ruleSummary.passedRules}</p>
              <p className="text-xs text-gray-500">Passed</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-red-600">{ruleSummary.failedRules}</p>
              <p className="text-xs text-gray-500">Failed</p>
            </div>
          </div>
        </div>
      )}

      {risk && (
        <div className="p-2 bg-white rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-700 flex items-center gap-1">
              <BarChart size={12} />
              Risk:
            </p>
            <div className={`px-2 py-0.5 rounded-full text-xs font-bold ${getRiskGradeColor(risk.grade)}`}>
              Grade {risk.grade} | Score: {risk.score}
            </div>
          </div>
          {risk.reasons && risk.reasons.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">{risk.reasons[0]}</p>
          )}
        </div>
      )}
    </div>
  );
};

const CompactApplicationCard = ({
  application,
  result,
  isChecking,
  onCheckEligibility,
  onUpdateStatus,
  isExpanded,
  onToggle,
  isUpdatingStatus
}) => {
  const hasDocuments = application.kyc?.documents && application.kyc.documents.length > 0;
  const hasCoapplicant = application.coapplicants && application.coapplicants.length > 0;
  const verifiedDocs = application.kyc?.documents?.filter(doc => doc.verified).length || 0;
  const totalDocs = application.kyc?.documents?.length || 0;
  
  // Check status values (case-insensitive)
  const status = application.status?.toLowerCase();
  const isUnderReview = status === 'under_review';
  const isApplicationInProgress = status === 'application_in_progress';
  const isLoanRulesApproved = status === 'LOANRULES_APPROVED';
  const isLoanRulesRejected = status === 'LOANRULES_REJECTED';
  const isApproved = status === 'approved';
  const isRejected = status === 'rejected';
  const hasResult = result && result.status;

  // Determine if we can check eligibility (only for applications in progress)
  const canCheckEligibility = isApplicationInProgress;

  // Determine if we can approve (show approve button)
  // After checking eligibility, if eligible/partially eligible, we can update to LOANRULES_APPROVED
  const canApprove = (isApplicationInProgress || isUnderReview) && hasResult && 
                     (result.status === 'ELIGIBLE' || result.status === 'PARTIALLY_ELIGIBLE');
  
  // Determine if we can reject (show reject button)
  const canReject = (isApplicationInProgress || isUnderReview) && hasResult;

  const handleApprove = (e) => {
    e.stopPropagation();
    if (canApprove && !isUpdatingStatus) {
      // Send the status in lowercase as the API expects
      onUpdateStatus(application.id, 'LOANRULES_APPROVED');
    }
  };

  const handleReject = (e) => {
    e.stopPropagation();
    if (canReject && !isUpdatingStatus) {
      // Send the status in lowercase as the API expects
      onUpdateStatus(application.id, 'LOANRULES_REJECTED');
    }
  };

  const handleCheckEligibility = (e) => {
    e.stopPropagation();
    if (!isChecking && canCheckEligibility) {
      onCheckEligibility(application.id);
    }
  };

  // Format status display for UI
  const getStatusDisplay = (status) => {
    if (!status) return 'PENDING';
    const statusLower = status.toLowerCase();
    switch(statusLower) {
      case 'application_in_progress': return 'IN PROGRESS';
      case 'under_review': return 'UNDER REVIEW';
      case 'LOANRULES_APPROVED': return 'LOANRULES_APPROVED';
      case 'LOANRULES_REJECTED': return 'LOANRULES_REJECTED';
      case 'approved': return 'APPROVED';
      case 'rejected': return 'REJECTED';
      case 'disbursed': return 'DISBURSED';
      default: return status.toUpperCase();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-100">
      <div 
        onClick={onToggle}
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-gray-800 text-sm md:text-base">
                  {application.loanNumber || 'LN-XXXXXX'}
                </h3>
                <div className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getApplicationStatusColor(application.status)}`}>
                  {getStatusDisplay(application.status)}
                </div>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <User size={12} />
                  {application.customer?.firstName} {application.customer?.lastName}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign size={12} />
                  {formatCurrency(application.requestedAmount)}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {formatDate(application.createdAt || application.applicationDate)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1 text-xs">
                <FileText size={12} className="text-gray-400" />
                <span className={verifiedDocs === totalDocs ? "text-green-600" : "text-yellow-600"}>
                  {verifiedDocs}/{totalDocs}
                </span>
              </div>
              <ChevronDown 
                size={18} 
                className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''} text-gray-400`}
              />
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t border-gray-100">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <User className="text-blue-600 mt-0.5" size={14} />
                <div>
                  <p className="text-xs text-gray-500">Applicant Name</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {application.customer?.firstName} {application.customer?.lastName}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="text-blue-600 mt-0.5" size={14} />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-gray-700 break-all">{application.customer?.email || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="text-blue-600 mt-0.5" size={14} />
                <div>
                  <p className="text-xs text-gray-500">Contact</p>
                  <p className="text-sm text-gray-700">{application.customer?.contactNumber || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">Requested Amount</p>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(application.requestedAmount)}
                </p>
                <p className="text-xs text-gray-500">
                  Limit: {formatCurrency(application.loanType?.minAmount)} - {formatCurrency(application.loanType?.maxAmount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Tenure</p>
                <p className="text-base font-bold text-gray-800">
                  {application.tenureMonths} months
                </p>
                <p className="text-xs text-gray-500">
                  Max: {application.loanType?.maxTenureMonths || 'N/A'} months
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Loan Type</p>
                <p className="text-sm font-semibold text-gray-800">
                  {application.loanType?.name || 'Personal Loan Standard'}
                </p>
              </div>
            </div>
          </div>

          {hasDocuments && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <FileText size={12} /> Documents
              </h4>
              <div className="flex flex-wrap gap-2">
                {application.kyc.documents.map((doc, idx) => (
                  <div key={idx} className={`px-2 py-1 rounded-lg text-xs ${
                    doc.verified ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                  }`}>
                    {doc.documentType} {doc.verified ? '✓' : '⏳'}
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasCoapplicant && (
            <div className="mb-4 p-2 bg-blue-50 rounded-lg">
              <p className="text-xs font-semibold text-blue-800 flex items-center gap-1">
                <Users size={12} /> Co-applicant: {application.coapplicants[0].firstName} {application.coapplicants[0].lastName}
                <span className="text-xs font-normal">({application.coapplicants[0].relation})</span>
              </p>
            </div>
          )}

          <div className="space-y-3">
            {/* Check Eligibility Button - Only for IN PROGRESS applications */}
            <button
              onClick={handleCheckEligibility}
              disabled={isChecking || !canCheckEligibility}
              className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isChecking ? (
                <>
                  <Loader className="animate-spin" size={16} />
                  Checking Rules...
                </>
              ) : (
                <>
                  <Shield size={16} />
                  Check Loan Eligibility
                </>
              )}
            </button>

            {/* Approve/Reject Buttons - Only show after eligibility check and for applications in progress or under review */}
            {hasResult && (isApplicationInProgress || isUnderReview) && (
              <div className="flex gap-3">
                <button
                  onClick={handleApprove}
                  disabled={!canApprove || isUpdatingStatus}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                    canApprove && !isUpdatingStatus
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isUpdatingStatus ? (
                    <Loader className="animate-spin" size={16} />
                  ) : (
                    <ThumbsUp size={16} />
                  )}
                  Approve Rules
                </button>
                <button
                  onClick={handleReject}
                  disabled={!canReject || isUpdatingStatus}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                    canReject && !isUpdatingStatus
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isUpdatingStatus ? (
                    <Loader className="animate-spin" size={16} />
                  ) : (
                    <ThumbsDown size={16} />
                  )}
                  Reject Rules
                </button>
              </div>
            )}

            {/* Status Messages for LOANRULES_APPROVED/REJECTED */}
            {isLoanRulesApproved && (
              <div className="p-3 rounded-lg text-center text-sm font-medium bg-green-50 text-green-700">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle size={16} />
                  Loan rules have been approved for this application
                </div>
              </div>
            )}

            {isLoanRulesRejected && (
              <div className="p-3 rounded-lg text-center text-sm font-medium bg-red-50 text-red-700">
                <div className="flex items-center justify-center gap-2">
                  <XCircle size={16} />
                  Loan rules have been rejected for this application
                </div>
              </div>
            )}
          </div>

          {result && <EligibilityResultCard result={result} />}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

const EligibilityPage = () => {
  const [checkingLoan, setCheckingLoan] = useState(null);
  const [validationResults, setValidationResults] = useState({});
  const [expandedCard, setExpandedCard] = useState(null);

  // Fetch loan applications using the existing hook
  const { 
    data: applicationsData, 
    isLoading: isLoadingApps, 
    error: appsError,
    refetch: refetchApplications 
  } = useLoanApplications();

  // Use the update status hook
  const { mutate: updateStatusMutation, isLoading: isUpdatingStatus } = useUpdateLoanStatus();

  // Direct API call for eligibility check
  const checkEligibility = async (applicationId) => {
    if (checkingLoan) return;
    
    setCheckingLoan(applicationId);
    try {
      const response = await apiGet(`/risk/eligibility-check/${applicationId}`);
      
      if (response?.success && response.data) {
        setValidationResults(prev => ({
          ...prev,
          [applicationId]: response.data
        }));
      } else {
        setValidationResults(prev => ({
          ...prev,
          [applicationId]: {
            status: "INELIGIBLE",
            maxEligibleAmount: 0,
            reason: [response?.message || "Failed to check eligibility"],
            ruleSummary: { totalRules: 0, passedRules: 0, failedRules: 0 },
            risk: { grade: "E", score: 0, reasons: ["Unable to complete risk assessment"] }
          }
        }));
      }
    } catch (error) {
      console.error("Eligibility check error:", error);
      setValidationResults(prev => ({
        ...prev,
        [applicationId]: {
          status: "ERROR",
          maxEligibleAmount: 0,
          reason: [error?.message || "Failed to check eligibility"],
          ruleSummary: { totalRules: 0, passedRules: 0, failedRules: 0 },
          risk: { grade: "E", score: 0, reasons: ["Network or server error occurred"] }
        }
      }));
    } finally {
      setCheckingLoan(null);
    }
  };

  // Update application status using the hook
  const updateStatus = (applicationId, newStatus) => {
    updateStatusMutation(
      { id: applicationId, status: newStatus },
      {
        onSuccess: () => {
          // Refetch applications to get updated status
          refetchApplications();
        }
      }
    );
  };

  // Toggle expanded card
  const toggleExpand = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  // Get applications from the hook data
  const applications = applicationsData?.data || applicationsData || [];
  const isLoading = isLoadingApps;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (appsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Applications</h3>
          <p className="text-gray-600 mb-4">{appsError?.message || "Failed to load applications"}</p>
          <button
            onClick={() => refetchApplications()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={18} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
          <FileText className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Applications Found</h3>
          <p className="text-gray-600">No loan applications are currently available for review.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Loan Applications</h1>
            <p className="text-sm text-gray-600">Click on any card to expand, check eligibility, and approve/reject loan rules</p>
          </div>
          <button
            onClick={() => refetchApplications()}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm transition-colors shadow-sm"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        <div className="space-y-3">
          {applications.map((application) => (
            <CompactApplicationCard
              key={application.id}
              application={application}
              result={validationResults[application.id]}
              isChecking={checkingLoan === application.id}
              onCheckEligibility={checkEligibility}
              onUpdateStatus={updateStatus}
              isExpanded={expandedCard === application.id}
              onToggle={() => toggleExpand(application.id)}
              isUpdatingStatus={isUpdatingStatus}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EligibilityPage;