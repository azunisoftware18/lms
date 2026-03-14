import React, { useState, useMemo } from "react";
import {
  FileText,
  CheckCircle,
  XCircle,
  User,
  Clock,
  Banknote,
  Upload,
  UserPlus,
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../../components/ui/Button";
import SearchField from "../../../components/ui/SearchField";
import StatusCard from "../../../components/common/StatusCard";
import DocumentPageTable from "../../../components/tables/DocumentPageTable";
import {
  DOCUMENT_APPLICATIONS,
  DOCUMENT_REPOSITORY,
} from "../../../lib/LOSDummyData";
import { colorVariables } from "../../../lib";

export default function DocumentPage() {
  // Use dummy data instead of hooks
  const [applications] = useState(DOCUMENT_APPLICATIONS);
  const [documents, setDocuments] = useState(DOCUMENT_REPOSITORY);

  // Selected application state - null means no application selected
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Filter applications based on search
  const filteredApplications = useMemo(() => {
    if (!searchTerm.trim()) return applications;

    const term = searchTerm.toLowerCase();

    return applications.filter(
      (app) =>
        app.loanNumber?.toLowerCase().includes(term) ||
        app.applicationNumber?.toLowerCase().includes(term) ||
        app.applicantName?.toLowerCase().includes(term) ||
        (app.coApplicantName &&
          app.coApplicantName.toLowerCase().includes(term)),
    );
  }, [applications, searchTerm]);

  // Get current application documents
  const currentDocuments = useMemo(() => {
    if (!selectedApplication) return [];

    const docs = documents[selectedApplication.id] || [];
    return docs;
  }, [documents, selectedApplication]);

  // Handle document verification
  const handleVerify = (docId) => {
    if (!selectedApplication) return;

    setDocuments((prev) => ({
      ...prev,
      [selectedApplication.id]: prev[selectedApplication.id].map((doc) =>
        doc.id === docId ? { ...doc, status: "VERIFIED" } : doc,
      ),
    }));

    toast.success("Document verified successfully");
  };

  // Handle document rejection
  const handleReject = (docId) => {
    const reason = prompt("Enter rejection reason");
    if (!reason) return;

    if (!selectedApplication) return;

    setDocuments((prev) => ({
      ...prev,
      [selectedApplication.id]: prev[selectedApplication.id].map((doc) =>
        doc.id === docId ? { ...doc, status: "REJECTED" } : doc,
      ),
    }));

    toast.success("Document rejected");
  };

  // Clear selected application
  const handleBackToApplications = () => {
    setSelectedApplication(null);
    setSearchTerm("");
  };

  // Document stats
  const documentStats = {
    total: currentDocuments.length,
    verified: currentDocuments.filter((d) => d.status === "VERIFIED").length,
    pending: currentDocuments.filter((d) => d.status === "PENDING").length,
    rejected: currentDocuments.filter((d) => d.status === "REJECTED").length,
  };

  // If application selected, show document management view
  if (selectedApplication) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header with Back Button */}
          <div className="mb-6">
            <Button
              onClick={handleBackToApplications}
              className="mb-4 bg-transparent shadow-none px-0 py-0 text-blue-700 hover:text-blue-800 hover:bg-transparent"
            >
              <span className="text-blue-900">← Back to Applications</span>
            </Button>

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {selectedApplication.loanNumber}
                  </h1>
                  <span
                    className={`px-3 py-1 ${colorVariables.LIGHT_BG} text-blue-700 text-sm font-medium rounded-full`}
                  >
                    {selectedApplication.currentStage}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Applicant</p>
                      <p className="font-semibold">
                        {selectedApplication.applicantName}
                      </p>
                    </div>
                  </div>

                  {selectedApplication.coApplicantName && (
                    <div className="flex items-center gap-2">
                      <UserPlus className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Co-applicant</p>
                        <p className="font-semibold">
                          {selectedApplication.coApplicantName}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Loan Amount</p>
                      <p className="font-semibold">
                        ₹
                        {selectedApplication.loanAmount
                          ? selectedApplication.loanAmount.toLocaleString(
                              "en-IN",
                            )
                          : "0"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => toast("Upload flow is disabled in dummy mode")}
                className={`px-4 py-2 ${colorVariables.PRIMARY_BUTTON_COLOR} text-white rounded-lg`}
              >
                <Upload size={18} />
                Upload Document
              </Button>
            </div>
          </div>

          {/* Document Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatusCard
              title="Total Documents"
              value={documentStats.total}
              icon={FileText}
              variant="blue"
            />
            <StatusCard
              title="Verified"
              value={documentStats.verified}
              icon={CheckCircle}
              variant="green"
            />
            <StatusCard
              title="Pending"
              value={documentStats.pending}
              icon={Clock}
              variant="orange"
            />
            <StatusCard
              title="Rejected"
              value={documentStats.rejected}
              icon={XCircle}
              variant="red"
            />
          </div>

          {/* Documents Table */}
          <div>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
            </div>
            <DocumentPageTable
              documents={currentDocuments}
              onViewDocument={(doc) => window.open(doc.url, "_blank")}
              onVerify={handleVerify}
              onReject={handleReject}
            />
          </div>
        </div>
      </div>
    );
  }

  // Show all applications
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Document Verification
          </h1>
          <p className="text-gray-600 mt-1">
            Select a loan application to manage documents
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
          <SearchField
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm("")}
            placeholder="Search by loan number, application ID, or applicant name..."
            showResults={false}
          />
        </div>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApplications.map((app) => {
            const appDocs = documents[app.id] || [];
            const verifiedCount = appDocs.filter(
              (d) => d.status === "VERIFIED",
            ).length;
            const pendingCount = appDocs.filter(
              (d) => d.status === "PENDING",
            ).length;
            const rejectedCount = appDocs.filter(
              (d) => d.status === "REJECTED",
            ).length;
            const progress = Math.round(
              (appDocs.length / app.totalDocuments) * 100,
            );

            return (
              <div
                key={app.id}
                onClick={() => {
                  setSelectedApplication(app);
                }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer"
              >
                {/* Loan Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {app.loanNumber}
                    </h3>
                    <p className="text-sm text-gray-500">
                      App: {app.applicationNumber}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 ${colorVariables.LIGHT_BG} text-blue-700 text-xs font-medium rounded-full`}
                  >
                    {app.currentStage}
                  </span>
                </div>

                {/* Applicant Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <User className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-700">{app.applicantName}</span>
                  </div>
                  {app.coApplicantName && (
                    <div className="flex items-center text-sm">
                      <UserPlus className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-600">
                        {app.coApplicantName}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center text-sm">
                    <Banknote className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-700">
                      ₹{app.loanAmount?.toLocaleString("en-IN") || "0"}
                    </span>
                  </div>
                </div>

                {/* Document Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Document Progress</span>
                    <span className="font-semibold text-gray-900">
                      {appDocs.length}/{app.totalDocuments}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colorVariables.ACCENT_COLOR_BG} rounded-full transition-all`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Status Summary */}
                <div className="flex gap-3 text-xs">
                  {verifiedCount > 0 && (
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {verifiedCount} Verified
                    </span>
                  )}
                  {pendingCount > 0 && (
                    <span className="flex items-center text-yellow-600">
                      <Clock className="w-3 h-3 mr-1" />
                      {pendingCount} Pending
                      {rejectedCount > 0 && (
                        <span className="flex items-center text-red-600">
                          <XCircle className="w-3 h-3 mr-1" />
                          {rejectedCount} Rejected
                        </span>
                      )}
                    </span>
                  )}
                </div>

                {/* Click Indicator */}
                <div className="mt-4 pt-3 border-t border-gray-100 text-right">
                  <span
                    className={`text-xs ${colorVariables.PRIMARY_COLOR} font-medium`}
                  >
                    Click to manage documents →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredApplications.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No applications found
            </h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
