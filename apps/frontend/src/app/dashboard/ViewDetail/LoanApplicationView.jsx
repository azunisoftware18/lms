// components/details/LoanApplicationView.js
import React from "react";
import {
  X,
  FileText,
  Check,
  Ban,
  AlertCircle,
  Clock,
  User,
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
  Landmark,
  CheckCircle,
  Calendar,
  TrendingUp,
  Settings,
} from "lucide-react";
import Button from "../../../components/ui/Button";
import InfoCard from "../../../components/details/InfoCard";

export default function LoanApplicationView({
  application,
  onClose,
  onApprove,
}) {
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

  if (!application) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50">
        <div className="bg-white p-6 rounded-lg">Loading...</div>
      </div>
    );
  }

  // Fallback: use applicant if customer is missing
  const customer = application.customer || application.applicant || {};
  

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-60 p-2 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl sm:max-w-4xl lg:max-w-6xl shadow-2xl relative max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Modal Header with Gradient */}
        <div className="sticky top-0 bg-linear-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 z-10">
          <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center shrink-0">
              <FileText className="text-white" size={20} />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-white wrap-break-words">
                Loan Application Details
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
                <p className="text-xs sm:text-sm text-blue-100 truncate">
                  ID: {application.id}
                </p>
                <span className="w-1 h-1 rounded-full bg-blue-300 hidden sm:block"></span>
                <p className="text-xs sm:text-sm text-blue-100 truncate">
                  Loan #: {application.loanNumber}
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
              onClick={onClose}
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
                    application.status?.toLowerCase() === "approved"
                      ? "bg-green-100"
                      : application.status?.toLowerCase() === "rejected"
                        ? "bg-red-100"
                        : "bg-yellow-100"
                  }`}
                >
                  {application.status?.toLowerCase() === "approved" && (
                    <CheckCircle size={28} className="text-green-600" />
                  )}
                  {application.status?.toLowerCase() === "rejected" && (
                    <Ban size={28} className="text-red-600" />
                  )}
                  {application.status?.toLowerCase() === "pending" && (
                    <AlertCircle size={28} className="text-yellow-600" />
                  )}
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Current Status
                  </p>
                  <div className="flex items-center gap-2 sm:gap-3 mt-1 flex-wrap">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-800 capitalize">
                      {application.status || "Pending"}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        application.status,
                      )}`}
                    >
                      {application.status || "Pending"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 text-sm">
                <div className="text-left sm:text-right">
                  <p className="text-xs text-slate-500">Application Date</p>
                  <p className="font-medium text-slate-800 truncate">
                    {formatDate(application.applicationDate)}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs text-slate-500">Last Updated</p>
                  <p className="font-medium text-slate-800 truncate">
                    {formatDate(application.updatedAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline/Approval Info */}
            {(application.approvedAt || application.rejectedAt) && (
              <div className="mt-4 pt-4 border-t border-blue-200">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs sm:text-sm">
                  <Clock size={16} className="text-slate-400 shrink-0" />
                  {application.approvedAt && (
                    <span>
                      Approved on {formatDate(application.approvedAt)} by{" "}
                      {application.approvedBy || "System"}
                    </span>
                  )}
                  {application.rejectedAt && (
                    <span>
                      Rejected on {formatDate(application.rejectedAt)} - Reason:{" "}
                      {application.rejectionReason || "Not specified"}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Personal Information Section */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="bg-linear-to-r from-slate-50 to-blue-50 px-5 py-3 border-b border-slate-200 text-amber-950">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <User size={18} className="text-blue-600" />
                Personal Information
              </h3>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-blue-700">
                <InfoCard
                  icon={<User size={16} className="text-blue-500" />}
                  label="Full Name"
                  value={customer.name || null}
                  fallback="Not provided"
                />
                <InfoCard
                  icon={<Mail size={16} className="text-blue-500" />}
                  label="Email"
                  value={customer.email || "Not provided"}
                  fallback="Not provided"
                />
                <InfoCard
                  icon={<Phone size={16} className="text-blue-500" />}
                  label="Phone"
                  value={customer.contactNumber || "Not provided"}
                  fallback="Not provided"
                />
                <InfoCard
                  icon={<Phone size={16} className="text-blue-500" />}
                  label="Alternate Phone"
                  value={customer.alternateNumber}
                  fallback="Not provided"
                />
                <InfoCard
                  icon={<Calendar size={16} className="text-blue-500" />}
                  label="Date of Birth"
                  value={customer.dob ? formatDate(customer.dob) : null}
                  fallback="Not provided"
                />
                <InfoCard
                  icon={<Hash size={16} className="text-blue-500" />}
                  label="Gender"
                  value={customer.gender}
                  fallback="Not provided"
                />
                <InfoCard
                  icon={<Hash size={16} className="text-blue-500" />}
                  label="Marital Status"
                  value={customer.maritalStatus}
                  fallback="Not provided"
                />
                <InfoCard
                  icon={<Hash size={16} className="text-blue-500" />}
                  label="Nationality"
                  value={customer.nationality}
                  fallback="Not provided"
                />
                <InfoCard
                  icon={<Hash size={16} className="text-blue-500" />}
                  label="Category"
                  value={customer.category}
                  fallback="Not provided"
                />
              </div>

              {/* Address - Full Width */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <InfoCard
                  icon={<MapPin size={16} className="text-blue-500" />}
                  label="Residential Address"
                  value={
                    customer.address
                      ? `${customer.address}, ${customer.city || ""}, ${customer.state || ""} - ${customer.pinCode || ""}`
                          .replace(/\s+,/g, ",")
                          .replace(/,\s*-/, "-")
                          .trim()
                      : null
                  }
                  fallback="Not provided"
                  fullWidth
                />
              </div>
            </div>
          </div>

          {/* KYC & Identity Section */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="bg-linear-to-r from-slate-50 to-blue-50 px-5 py-3 border-b border-slate-200">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Shield size={18} className="text-blue-600" />
                KYC & Identity Details
              </h3>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <InfoCard
                  icon={<CreditCard size={16} className="text-blue-500" />}
                  label="Aadhaar Number"
                  value={customer.aadhaarNumber}
                  fallback="Not provided"
                />
                <InfoCard
                  icon={<FileText size={16} className="text-blue-500" />}
                  label="PAN Number"
                  value={customer.panNumber}
                  fallback="Not provided"
                />
                <InfoCard
                  icon={<FileText size={16} className="text-blue-500" />}
                  label="Voter ID"
                  value={customer.voterId}
                  fallback="Not provided"
                />
                <InfoCard
                  icon={<FileText size={16} className="text-blue-500" />}
                  label="Passport Number"
                  value={customer.passportNumber}
                  fallback="Not provided"
                />
              </div>

              {/* KYC Status */}
              {application.kyc && (
                <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-700">
                        KYC Status:
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          application.kyc.status === "VERIFIED"
                            ? "bg-green-100 text-green-700"
                            : application.kyc.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {application.kyc.status}
                      </span>
                    </div>
                    {application.kyc.verifiedBy && (
                      <span className="text-xs text-slate-500">
                        Verified by: {application.kyc.verifiedBy} on{" "}
                        {formatDate(application.kyc.verifiedAt)}
                      </span>
                    )}
                  </div>

                  {/* Documents */}
                  {application.kyc.documents &&
                    application.kyc.documents.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-slate-500 mb-2">
                          Uploaded Documents
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {application.kyc.documents.map((doc, idx) => (
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
            </div>
          </div>

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
                  value={application.customer?.employmentType?.replace(
                    "_",
                    " ",
                  )}
                  fallback="Not provided"
                />
                <InfoCard
                  icon={<IndianRupee size={16} className="text-blue-500" />}
                  label="Monthly Income"
                  value={
                    application.customer?.monthlyIncome
                      ? formatCurrency(application.customer.monthlyIncome)
                      : null
                  }
                  fallback="Not provided"
                />
                <InfoCard
                  icon={<IndianRupee size={16} className="text-blue-500" />}
                  label="Annual Income"
                  value={
                    application.customer?.annualIncome
                      ? formatCurrency(application.customer.annualIncome)
                      : null
                  }
                  fallback="Not provided"
                />
                <InfoCard
                  icon={<IndianRupee size={16} className="text-blue-500" />}
                  label="Other Income"
                  value={
                    application.customer?.otherIncome
                      ? formatCurrency(application.customer.otherIncome)
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
                  value={application.customer?.bankName}
                  fallback="Not provided"
                />
                <InfoCard
                  icon={<CreditCard size={16} className="text-blue-500" />}
                  label="Account Number"
                  value={application.customer?.bankAccountNumber}
                  fallback="Not provided"
                />
                <InfoCard
                  icon={<Hash size={16} className="text-blue-500" />}
                  label="IFSC Code"
                  value={application.customer?.ifscCode}
                  fallback="Not provided"
                />
                <InfoCard
                  icon={<Hash size={16} className="text-blue-500" />}
                  label="Account Type"
                  value={application.customer?.accountType}
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
                  value={application.loanNumber}
                  fallback="Not provided"
                />
                <InfoCard
                  label="Loan Type ID"
                  value={application.loanTypeId}
                  fallback="Not provided"
                />
                <InfoCard
                  icon={<IndianRupee size={16} className="text-blue-500" />}
                  label="Requested Amount"
                  value={
                    application.requestedAmount
                      ? formatCurrency(application.requestedAmount)
                      : null
                  }
                  fallback="Not specified"
                />
                <InfoCard
                  icon={<IndianRupee size={16} className="text-blue-500" />}
                  label="Approved Amount"
                  value={
                    application.approvedAmount
                      ? formatCurrency(application.approvedAmount)
                      : null
                  }
                  fallback="Not approved yet"
                />
                <InfoCard
                  label="Tenure"
                  value={
                    application.tenureMonths
                      ? `${application.tenureMonths} months`
                      : null
                  }
                  fallback="Not specified"
                />
                <InfoCard
                  label="Interest Rate"
                  value={
                    application.interestRate
                      ? `${application.interestRate}% p.a.`
                      : null
                  }
                  fallback="Not specified"
                />
                <InfoCard
                  label="Interest Type"
                  value={application.interestType}
                  fallback="Not specified"
                />
                <InfoCard
                  icon={<IndianRupee size={16} className="text-blue-500" />}
                  label="EMI Amount"
                  value={
                    application.emiAmount
                      ? formatCurrency(application.emiAmount)
                      : null
                  }
                  fallback="Not calculated"
                />
                <InfoCard
                  icon={<IndianRupee size={16} className="text-blue-500" />}
                  label="Total Payable"
                  value={
                    application.totalPayable
                      ? formatCurrency(application.totalPayable)
                      : null
                  }
                  fallback="Not calculated"
                />
                <InfoCard
                  label="Loan Purpose"
                  value={application.loanPurpose}
                  fallback="Not specified"
                />
                <InfoCard
                  label="Purpose Details"
                  value={application.purposeDetails}
                  fallback="Not specified"
                  fullWidth
                />
              </div>

              {/* CIBIL Score with Visual */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  <div className="text-center sm:text-left">
                    <p className="text-xs text-slate-500 mb-1">CIBIL Score</p>
                    <div
                      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto sm:mx-0 ${
                        application.cibilScore >= 750
                          ? "bg-green-100 text-green-700"
                          : application.cibilScore >= 650
                            ? "bg-yellow-100 text-yellow-700"
                            : application.cibilScore
                              ? "bg-red-100 text-red-700"
                              : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {application.cibilScore || "N/A"}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-700 sm:text-slate-800 text-sm sm:text-base">
                      Credit Assessment
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      {application.cibilScore >= 750
                        ? "Excellent credit history"
                        : application.cibilScore >= 650
                          ? "Good credit history"
                          : application.cibilScore
                            ? "Fair credit history - May require additional verification"
                            : "Credit score not available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Co-applicants Section */}
          {application.coapplicants && application.coapplicants.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-linear-to-r from-slate-50 to-blue-50 px-5 py-3 border-b border-slate-200">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Users size={18} className="text-blue-600" />
                  Co-Applicants ({application.coapplicants.length})
                </h3>
              </div>
              <div className="p-5">
                {application.coapplicants.map((co, idx) => (
                  <div
                    key={idx}
                    className="mb-4 last:mb-0 p-4 bg-slate-50 rounded-lg"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <InfoCard
                        label="Name"
                        value={`${co.firstName || ""} ${
                          co.lastName || ""
                        }`.trim()}
                      />
                      <InfoCard label="Relation" value={co.relation} />
                      <InfoCard label="Contact" value={co.contactNumber} />
                      <InfoCard label="Email" value={co.email} />
                      <InfoCard label="PAN" value={co.panNumber} />
                      <InfoCard label="Aadhaar" value={co.aadhaarNumber} />
                      <InfoCard label="Employment" value={co.employmentType} />
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
                  value={application.foreclosureAllowed ? "Yes" : "No"}
                />
                <InfoCard
                  label="Prepayment Allowed"
                  value={application.prepaymentAllowed ? "Yes" : "No"}
                />
                <InfoCard
                  label="Late Payment Fee"
                  value={
                    application.latePaymentFee
                      ? formatCurrency(application.latePaymentFee)
                      : "Not set"
                  }
                />
                <InfoCard
                  label="Bounce Charges"
                  value={
                    application.bounceCharges
                      ? formatCurrency(application.bounceCharges)
                      : "Not set"
                  }
                />
                <InfoCard
                  label="Foreclosure Charges"
                  value={
                    application.foreclosureCharges
                      ? `${application.foreclosureCharges}%`
                      : "Not set"
                  }
                />
                <InfoCard
                  label="Prepayment Charges"
                  value={
                    application.prepaymentCharges
                      ? `${application.prepaymentCharges}%`
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
            Created: {formatDate(application.createdAt)} | Branch:{" "}
            {application.branchId}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              onClick={onClose}
              className="px-4 sm:px-6 py-2 sm:py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-600 bg-white hover:bg-slate-50 transition-colors w-full sm:w-auto"
            >
              <span className="text-red-600">Close</span>
            </Button>
            {application.status?.toLowerCase() !== "approved" && (
              <Button
                onClick={() => onApprove(application.id)}
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
  );
}
