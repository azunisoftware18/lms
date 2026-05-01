import React, { useState, useMemo, useEffect, useRef } from "react";
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
// colorVariables intentionally unused in this file

import {
  useLoanApplications,
  useLoanDocuments,
  useUploadDocuments,
  useVerifyDocument,
  useRejectDocument,
  useLoanApplication,
} from "../../../hooks/useLoanApplication";
// Document upload will render as a full page (like LoanApplicationForm) instead of a modal
import DocumentUploadForm from "../../../components/forms/DocumentUploadForm";
import { useLoanTypes } from "../../../hooks/useLoanType";
import { useLoanDocumentList } from "../../../hooks/useLoanDocumentList";

export default function DocumentPage() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  // uploadFiles: { applicant: {docType: File}, coApplicant: {docType: File}, guarantor: {docType: File} }
  const [_uploadFiles, _setUploadFiles] = useState({
    applicant: {},
    coApplicant: {},
    guarantor: {},
    other: {},
  });

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [uploadTargetDoc, setUploadTargetDoc] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading: isLoadingApplications } = useLoanApplications();
  const applications = React.useMemo(() => data?.data || [], [data]);

  // Fetch full application to get loanTypeId
  const { data: selectedAppFull } = useLoanApplication(selectedApplication?.id);

  const loanTypeId =
    selectedAppFull?.data?.loanTypeId || selectedApplication?.loanTypeId;
  const { loanTypes, loading: _isLoadingLoanTypes } = useLoanTypes();
  const loanType = loanTypes?.find((lt) => lt.id === loanTypeId);

  // Filter applications based on search
  const filteredApplications = useMemo(() => {
    if (!searchTerm.trim()) return applications;
    const term = searchTerm.toLowerCase();
    return applications.filter(
      (app) =>
        app.loanNumber?.toLowerCase().includes(term) ||
        app.id?.toLowerCase().includes(term) ||
        app.customer?.firstName?.toLowerCase().includes(term) ||
        app.customer?.lastName?.toLowerCase().includes(term),
    );
  }, [applications, searchTerm]);

  // Fetch documents for selected application
  const {
    data: documentsData,
    isLoading: isLoadingDocuments,
    refetch: refetchDocuments,
  } = useLoanDocuments(selectedApplication?.id);
  // Ensure documents is always an array
  const documents = Array.isArray(documentsData)
    ? documentsData
    : documentsData?.data || [];

  // Document stats
  const documentStats = {
    total: documents.length,
    verified:
      documents.length > 0 &&
      documents.every(
        (d) => (d.verificationStatus || "").toLowerCase() === "verified",
      )
        ? 1
        : 0,
    pending:
      documents.some(
        (d) => (d.verificationStatus || "").toLowerCase() === "pending",
      ) &&
      !documents.some(
        (d) => (d.verificationStatus || "").toLowerCase() === "rejected",
      ) &&
      !documents.every(
        (d) => (d.verificationStatus || "").toLowerCase() === "verified",
      )
        ? 1
        : 0,
    rejected: documents.some(
      (d) => (d.verificationStatus || "").toLowerCase() === "rejected",
    )
      ? 1
      : 0,
  };

  // Handlers for document verification/rejection
  const verifyDocumentMutation = useVerifyDocument();
  const rejectDocumentMutation = useRejectDocument();
  const _uploadDocumentsMutation = useUploadDocuments();

  const handleVerify = async (docId) => {
    if (!docId) return;
    await verifyDocumentMutation.mutateAsync(docId);
    toast.success("Document verified successfully");
    refetchDocuments();
  };

  // Accept a rejection remark from the UI confirmation dialog
  const handleReject = async (docId, reason) => {
    if (!reason) return;
    if (!selectedApplication) return;
    await rejectDocumentMutation.mutateAsync({
      applicationId: selectedApplication.id,
      documentId: docId,
      reason,
    });
    toast.success("Document rejected");
    refetchDocuments();
  };

  const handleBackToApplications = () => {
    setSelectedApplication(null);
    setSearchTerm("");
  };

  // Helper to get doc arrays from loanType (CSV or array)
  const parseDocs = (docs) => {
    if (!docs) return [];
    if (Array.isArray(docs)) return docs;
    if (typeof docs === "string")
      return docs
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean);
    return [];
  };

  // Defensive: fallback to empty array and log warnings if fields are missing
  const missingFields = [];
  const _applicantRequiredDocs =
    loanType?.applicantDocumentsRequired !== undefined
      ? parseDocs(loanType.applicantDocumentsRequired)
      : (missingFields.push("applicantDocumentsRequired"), []);
  const _applicantOptionalDocs =
    loanType?.applicantDocumentsOptional !== undefined
      ? parseDocs(loanType.applicantDocumentsOptional)
      : (missingFields.push("applicantDocumentsOptional"), []);
  const _coApplicantRequiredDocs =
    loanType?.coApplicantDocumentsRequired !== undefined
      ? parseDocs(loanType.coApplicantDocumentsRequired)
      : (missingFields.push("coApplicantDocumentsRequired"), []);
  const _coApplicantOptionalDocs =
    loanType?.coApplicantDocumentsOptional !== undefined
      ? parseDocs(loanType.coApplicantDocumentsOptional)
      : (missingFields.push("coApplicantDocumentsOptional"), []);
  const _guarantorRequiredDocs =
    loanType?.guarantorDocumentsRequired !== undefined
      ? parseDocs(loanType.guarantorDocumentsRequired)
      : (missingFields.push("guarantorDocumentsRequired"), []);
  const _guarantorOptionalDocs =
    loanType?.guarantorDocumentsOptional !== undefined
      ? parseDocs(loanType.guarantorDocumentsOptional)
      : (missingFields.push("guarantorDocumentsOptional"), []);
  const _otherRequiredDocs =
    loanType?.otherDocumentsRequired !== undefined
      ? parseDocs(loanType.otherDocumentsRequired)
      : (missingFields.push("otherDocumentsRequired"), []);

  // Accept either `otherDocumentsOptional` or the older typo `otherDocumentsOptions`
  const otherOptionalRaw =
    loanType?.otherDocumentsOptional ?? loanType?.otherDocumentsOptions;
  const _otherOptionalDocs =
    otherOptionalRaw !== undefined
      ? parseDocs(otherOptionalRaw)
      : (missingFields.push("otherDocumentsOptional"), []);

  // Only show toast once per loanType change
  const hasShownToastRef = useRef({});
  useEffect(() => {
    if (loanType && missingFields.length > 0) {
      const key = loanType.id || JSON.stringify(loanType);
      if (!hasShownToastRef.current[key]) {
        toast.error(`Missing fields in loanType: ${missingFields.join(", ")}`);
        hasShownToastRef.current[key] = true;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loanType && loanType.id]);

  // Show a warning in the UI if loanType or required doc fields are missing
  const _missingDocsWarning = !loanType
    ? "Loan type not found for this application. Document requirements unavailable."
    : [
          "applicantDocumentsRequired",
          "applicantDocumentsOptional",
          "coApplicantDocumentsRequired",
          "coApplicantDocumentsOptional",
          "guarantorDocumentsRequired",
          "guarantorDocumentsOptional",
        ].some((field) => loanType[field] === undefined)
      ? "Some document requirement fields are missing for this loan type. Please check loan type configuration."
      : null;

  // Calculate overall statistics before any conditional return so hook order stays stable.
  const overallStats = useMemo(() => {
    let totalDocs = 0;
    let verifiedApplications = 0;
    let pendingApplications = 0;
    let rejectedApplications = 0;

    applications.forEach((app) => {
      const appTotalDocuments = app.totalDocuments ?? app.documentCount ?? 0;
      const appVerifiedDocuments = app.verifiedDocuments ?? 0;
      const appRejectedDocuments = app.rejectedDocuments ?? 0;

      totalDocs += appTotalDocuments;

      if (appRejectedDocuments > 0) {
        rejectedApplications += 1;
      } else if (
        appTotalDocuments > 0 &&
        appVerifiedDocuments === appTotalDocuments
      ) {
        verifiedApplications += 1;
      } else if (appTotalDocuments > 0) {
        pendingApplications += 1;
      }
    });

    return {
      totalApplications: applications.length,
      totalDocuments: totalDocs,
      verifiedDocuments: verifiedApplications,
      pendingDocuments: pendingApplications,
      rejectedDocuments: rejectedApplications,
    };
  }, [applications]);

  // TODO: If Port will change then also should change this
  // If application selected, show document management view
  const buildDocumentUrl = (path) => {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `http://localhost:4000${normalized}`;
  };

  if (selectedApplication) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={handleBackToApplications}
              className="text-sm text-blue-600 hover:underline mr-4"
            >
              ← Back to applications
            </button>

            <div className="ml-auto">
              <Button
                variant="outline"
                onClick={() => setShowUploadModal(true)}
              >
                Upload Documents
              </Button>
            </div>
          </div>

          {!showUploadModal ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <StatusCard
                  title="Total Documents"
                  value={documentStats.total}
                  icon={FileText}
                  colorClass="text-blue-600"
                  bgClass="bg-blue-50"
                />
                <StatusCard
                  title="Verified"
                  value={documentStats.verified}
                  icon={CheckCircle}
                  colorClass="text-green-600"
                  bgClass="bg-green-50"
                />
                <StatusCard
                  title="Pending"
                  value={documentStats.pending}
                  icon={Clock}
                  colorClass="text-orange-600"
                  bgClass="bg-orange-50"
                />
                <StatusCard
                  title="Rejected"
                  value={documentStats.rejected}
                  icon={XCircle}
                  colorClass="text-red-600"
                  bgClass="bg-red-50"
                />
              </div>

              {/* Documents Table */}
              <div>
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Documents
                  </h2>
                </div>
                <DocumentPageTable
                  documents={documents.map((doc) => ({
                    id: doc.id,
                    name: doc.documentType || doc.documentName || "-",
                    category: doc.category || "-",
                    applicantType:
                      doc.applicantType || // Use new applicantType field from backend
                      doc.ownerType ||
                      (doc.party ? doc.party.toUpperCase() : "applicant"),
                    uploadDate: doc.createdAt
                      ? new Date(doc.createdAt).toLocaleDateString()
                      : "-",
                    status: doc.verificationStatus
                      ? doc.verificationStatus.toUpperCase()
                      : "-",
                    documentPath: doc.documentPath,
                  }))}
                  loading={isLoadingDocuments}
                  onViewDocument={(doc) =>
                    window.open(buildDocumentUrl(doc.documentPath), "_blank")
                  }
                  onUploadDocument={(doc) => {
                    setUploadTargetDoc(doc);
                    setShowUploadModal(true);
                  }}
                  onVerify={handleVerify}
                  onReject={handleReject}
                />
              </div>
            </>
          ) : (
            <div className="max-w-5xl mx-auto px-6 py-6 bg-white rounded-lg shadow">
              <DocumentUploadForm
                selectedApplication={selectedApplication}
                uploadFiles={_uploadFiles}
                setUploadFiles={_setUploadFiles}
                uploadDocumentsMutation={_uploadDocumentsMutation}
                applicantRequiredDocs={_applicantRequiredDocs}
                applicantOptionalDocs={_applicantOptionalDocs}
                coApplicantRequiredDocs={_coApplicantRequiredDocs}
                coApplicantOptionalDocs={_coApplicantOptionalDocs}
                guarantorRequiredDocs={_guarantorRequiredDocs}
                guarantorOptionalDocs={_guarantorOptionalDocs}
                otherRequiredDocs={_otherRequiredDocs}
                otherOptionalDocs={_otherOptionalDocs}
                refetchDocuments={refetchDocuments}
                onClose={() => setShowUploadModal(false)}
              />
            </div>
          )}
          {showUploadModal && (
            <div className="fixed inset-0  lg:pl-64 bg-white overflow-y-auto z-40 pointer-events-auto mt-16">
              <div className="max-w-5xl mx-auto px-6 py-6 pointer-events-auto">
                <DocumentUploadForm
                  selectedApplication={selectedApplication}
                  uploadFiles={_uploadFiles}
                  setUploadFiles={_setUploadFiles}
                  uploadDocumentsMutation={_uploadDocumentsMutation}
                  applicantRequiredDocs={_applicantRequiredDocs}
                  applicantOptionalDocs={_applicantOptionalDocs}
                  coApplicantRequiredDocs={_coApplicantRequiredDocs}
                  coApplicantOptionalDocs={_coApplicantOptionalDocs}
                  guarantorRequiredDocs={_guarantorRequiredDocs}
                  guarantorOptionalDocs={_guarantorOptionalDocs}
                  otherRequiredDocs={_otherRequiredDocs}
                  otherOptionalDocs={_otherOptionalDocs}
                  refetchDocuments={refetchDocuments}
                  onClose={() => {
                    setShowUploadModal(false);
                    setUploadTargetDoc(null);
                  }}
                  initialDocument={uploadTargetDoc}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show all applications
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Document Verification
          </h1>
          <p className="text-gray-600 mt-1">
            Select a loan application to manage documents
          </p>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <StatusCard
            title="Total Applications"
            value={overallStats.totalApplications}
            icon={FileText}
            colorClass="text-blue-600"
            bgClass="bg-blue-50"
          />
          <StatusCard
            title="Total Documents"
            value={overallStats.totalDocuments}
            icon={FileText}
            colorClass="text-indigo-600"
            bgClass="bg-indigo-50"
          />
          <StatusCard
            title="Verified"
            value={overallStats.verifiedDocuments}
            icon={CheckCircle}
            colorClass="text-green-600"
            bgClass="bg-green-50"
          />
          <StatusCard
            title="Pending"
            value={overallStats.pendingDocuments}
            icon={Clock}
            colorClass="text-orange-600"
            bgClass="bg-orange-50"
          />
          <StatusCard
            title="Rejected"
            value={overallStats.rejectedDocuments}
            icon={XCircle}
            colorClass="text-red-600"
            bgClass="bg-red-50"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
          <SearchField
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm("")}
            placeholder="Search by loan number, application ID, or applicant name..."
            showResults={false}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingApplications ? (
            <div className="col-span-3 text-center py-12">Loading...</div>
          ) : (
            filteredApplications.map((app) => {
              // Compute total required documents from the loan type when available
              const appLoanTypeId =
                app.loanTypeId ?? app.loanApplication?.loanTypeId;
              const appLoanType = loanTypes?.find(
                (lt) => lt.id === appLoanTypeId,
              );
              const reqApplicant = parseDocs(
                appLoanType?.applicantDocumentsRequired,
              ).length;
              const reqCoApplicant = parseDocs(
                appLoanType?.coApplicantDocumentsRequired,
              ).length;
              const reqGuarantor = parseDocs(
                appLoanType?.guarantorDocumentsRequired,
              ).length;
              const reqOther = parseDocs(
                appLoanType?.otherDocumentsRequired,
              ).length;
              const totalRequired =
                reqApplicant + reqCoApplicant + reqGuarantor + reqOther;
              // Actual uploaded documents count (prefer documents array, then server counts)
              const uploadedCount = Array.isArray(app.documents)
                ? app.documents.length
                : (app.uploadedDocuments ??
                  app.documentCount ??
                  app.totalDocuments ??
                  0);
              const verifiedCount =
                app.verifiedDocuments ??
                (Array.isArray(app.documents)
                  ? app.documents.filter(
                      (d) => d.verificationStatus === "verified",
                    ).length
                  : 0);
              const rejectedCount =
                app.rejectedDocuments ??
                (Array.isArray(app.documents)
                  ? app.documents.filter(
                      (d) => d.verificationStatus === "rejected",
                    ).length
                  : 0);
              const pendingCount = Math.max(
                0,
                uploadedCount - verifiedCount - rejectedCount,
              );
              const totalDocumentsDisplay = Math.max(
                totalRequired > 0 ? totalRequired : 0,
                uploadedCount,
                app.totalDocuments ?? 0,
              );
              const fullName =
                [
                  app.customer?.firstName,
                  app.customer?.middleName,
                  app.customer?.lastName,
                ]
                  .filter(Boolean)
                  .join(" ") ||
                app.customer?.name ||
                app.applicantName ||
                "Unknown Applicant";

              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedApplication(app)}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className=" text-gray-900">
                        Loan No :
                        {app.loanNumber ||
                          app.loanApplication?.loanNumber ||
                          " —"}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{fullName}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="inline-flex items-center gap-3">
                      <div className="text-xs text-gray-500">
                        Total Documents
                      </div>
                      <div className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md font-medium">
                        {totalDocumentsDisplay}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-gray-500">Uploaded</div>
                      <div className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md font-medium">
                        {uploadedCount}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-gray-500">Verified</div>
                      <div className="px-2 py-1 bg-green-50 text-green-700 rounded-md font-medium">
                        {verifiedCount}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-gray-500">Pending</div>
                      <div className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded-md font-medium">
                        {pendingCount}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedApplication(app);
                      }}
                      className="text-xs text-blue-600 font-medium hover:underline"
                    >
                      Click to manage documents →
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {filteredApplications.length === 0 && !isLoadingApplications && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
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

// Component to display all document names and upload buttons
function DocumentListWithUpload({ applicationId, onUploadSuccess }) {
  const { data, isLoading, error, refetch } =
    useLoanDocumentList(applicationId);
  const [uploading, setUploading] = React.useState({});

  if (isLoading) return <div>Loading document list...</div>;
  if (error)
    return <div className="text-red-500">Failed to load document list.</div>;

  // Defensive: handle non-array docs
  let docList = [];
  if (Array.isArray(data?.data)) {
    docList = data.data;
  } else if (Array.isArray(data)) {
    docList = data;
  } else if (data && typeof data === "object") {
    if (Array.isArray(data.documents)) {
      docList = data.documents;
    } else if (Array.isArray(data.result)) {
      docList = data.result;
    }
  }

  // docs is expected to be an array of { documentType, documentName, party, required }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Document Name
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Party
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Required
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Upload
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {docList.map((doc) => (
            <tr key={doc.party + "-" + doc.documentType}>
              <td className="px-4 py-2 whitespace-nowrap">
                {doc.documentName || doc.documentType}
              </td>
              <td className="px-4 py-2 whitespace-nowrap capitalize">
                {doc.party}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                {doc.required ? (
                  <span className="text-red-500 font-semibold">Required</span>
                ) : (
                  <span className="text-gray-400">Optional</span>
                )}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                <UploadCell
                  applicationId={applicationId}
                  documentType={doc.documentType}
                  party={doc.party}
                  onUploadSuccess={() => {
                    refetch();
                    if (onUploadSuccess) onUploadSuccess();
                  }}
                  uploading={!!uploading[doc.party + "-" + doc.documentType]}
                  setUploading={setUploading}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {docList.length === 0 && (
        <div className="text-gray-500 p-4">No documents found.</div>
      )}
    </div>
  );
}

// Cell for uploading a document
function UploadCell({
  applicationId,
  documentType,
  party,
  onUploadSuccess,
  uploading,
  setUploading,
}) {
  const uploadDocumentsMutation = useUploadDocuments();
  const inputRef = React.useRef();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading((u) => ({ ...u, [party + "-" + documentType]: true }));
    try {
      await uploadDocumentsMutation.mutateAsync({
        id: applicationId,
        file,
        documentType,
        party,
      });
      toast.success("Document uploaded successfully");
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploading((u) => ({ ...u, [party + "-" + documentType]: false }));
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept="application/pdf,image/*"
        ref={inputRef}
        disabled={uploading}
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {uploading && <span className="text-blue-500 text-xs">Uploading...</span>}
    </div>
  );
}
