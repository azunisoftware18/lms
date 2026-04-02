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
import { colorVariables } from "../../../lib";

import {
  useLoanApplications,
  useLoanDocuments,
  useUploadDocuments,
  useVerifyDocument,
  useRejectDocument,
  useLoanApplication,
} from "../../../hooks/useLoanApplication";
import { useLoanTypes } from "../../../hooks/useLoanType";
import { useLoanDocumentList } from "../../../hooks/useLoanDocumentList";

export default function DocumentPage() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  // uploadFiles: { applicant: {docType: File}, coApplicant: {docType: File}, guarantor: {docType: File} }
  const [uploadFiles, setUploadFiles] = useState({
    applicant: {},
    coApplicant: {},
    guarantor: {},
    other: {},
  });

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading: isLoadingApplications } = useLoanApplications();
  const applications = data?.data || [];

  // Fetch full application to get loanTypeId
  const { data: selectedAppFull } = useLoanApplication(selectedApplication?.id);

  const loanTypeId =
    selectedAppFull?.data?.loanTypeId || selectedApplication?.loanTypeId;
  const { loanTypes, loading: isLoadingLoanTypes } = useLoanTypes();
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
    verified: documents.filter((d) => d.verificationStatus === "verified")
      .length,
    pending: documents.filter((d) => d.verificationStatus === "PENDING").length,
    rejected: documents.filter((d) => d.verificationStatus === "REJECTED")
      .length,
  };

  // Handlers for document verification/rejection
  const verifyDocumentMutation = useVerifyDocument();
  const rejectDocumentMutation = useRejectDocument();
  const uploadDocumentsMutation = useUploadDocuments();

  const handleVerify = async (docId) => {
    if (!docId) return;
    await verifyDocumentMutation.mutateAsync(docId);
    toast.success("Document verified successfully");
    refetchDocuments();
  };

  const handleReject = async (docId) => {
    const reason = prompt("Enter rejection reason");
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
  const applicantRequiredDocs =
    loanType?.applicantDocumentsRequired !== undefined
      ? parseDocs(loanType.applicantDocumentsRequired)
      : (missingFields.push("applicantDocumentsRequired"), []);
  const applicantOptionalDocs =
    loanType?.applicantDocumentsOptional !== undefined
      ? parseDocs(loanType.applicantDocumentsOptional)
      : (missingFields.push("applicantDocumentsOptional"), []);
  const coApplicantRequiredDocs =
    loanType?.coApplicantDocumentsRequired !== undefined
      ? parseDocs(loanType.coApplicantDocumentsRequired)
      : (missingFields.push("coApplicantDocumentsRequired"), []);
  const coApplicantOptionalDocs =
    loanType?.coApplicantDocumentsOptional !== undefined
      ? parseDocs(loanType.coApplicantDocumentsOptional)
      : (missingFields.push("coApplicantDocumentsOptional"), []);
  const guarantorRequiredDocs =
    loanType?.guarantorDocumentsRequired !== undefined
      ? parseDocs(loanType.guarantorDocumentsRequired)
      : (missingFields.push("guarantorDocumentsRequired"), []);
  const guarantorOptionalDocs =
    loanType?.guarantorDocumentsOptional !== undefined
      ? parseDocs(loanType.guarantorDocumentsOptional)
      : (missingFields.push("guarantorDocumentsOptional"), []);
  const otherRequiredDocs =
    loanType?.otherDocumentsRequired !== undefined
      ? parseDocs(loanType.otherDocumentsRequired)
      : (missingFields.push("otherDocumentsRequired"), []);

  // Accept either `otherDocumentsOptional` or the older typo `otherDocumentsOptions`
  const otherOptionalRaw =
    loanType?.otherDocumentsOptional ?? loanType?.otherDocumentsOptions;
  const otherOptionalDocs =
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
  const missingDocsWarning = !loanType
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

  // If application selected, show document management view
  if (selectedApplication) {
    return (
      <>
        {/* New Document List Section */}

        <div className="min-h-screen bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {missingDocsWarning && (
              <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded">
                {missingDocsWarning}
              </div>
            )}
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
                      Document Verification
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Applicant</span>
                      <span>
                        {selectedApplication.customer?.firstName}{" "}
                        {selectedApplication.customer?.lastName}
                      </span>
                    </div>
                    {/* Add co-applicant info if available */}
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
                <div>
                  <button
                    type="button"
                    className={`px-4 py-2 ${colorVariables.PRIMARY_BUTTON_COLOR} text-white rounded-lg flex items-center gap-2`}
                    onClick={() => setShowUploadModal(true)}
                  >
                    <Upload size={18} />
                    Upload Document
                  </button>
                </div>
                {/* Upload Modal */}
                {showUploadModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
                      <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowUploadModal(false)}
                      >
                        &times;
                      </button>
                      <h2 className="text-lg font-bold mb-4">
                        Upload Documents
                      </h2>
                      {isLoadingLoanTypes ? (
                        <div>Loading document requirements...</div>
                      ) : (
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            if (!selectedApplication) return;
                            // Validation: Ensure all required docs are uploaded
                            const missingRequired = [];
                            [
                              {
                                party: "applicant",
                                docs: applicantRequiredDocs,
                              },
                              {
                                party: "coApplicant",
                                docs: coApplicantRequiredDocs,
                              },
                              {
                                party: "guarantor",
                                docs: guarantorRequiredDocs,
                              },
                              { party: "other", docs: otherRequiredDocs },
                            ].forEach(({ party, docs }) => {
                              const partyFiles = uploadFiles[party] || {};
                              docs.forEach((docType) => {
                                if (!partyFiles[docType]) {
                                  missingRequired.push(`${party} - ${docType}`);
                                }
                              });
                            });
                            if (missingRequired.length > 0) {
                              toast.error(
                                `Please upload all required documents: ${missingRequired.join(", ")}`,
                              );
                              return;
                            }
                            // Collect all files for all parties
                            const allEntries = [];
                            [
                              "applicant",
                              "coApplicant",
                              "guarantor",
                              "other",
                            ].forEach((party) => {
                              Object.entries(uploadFiles[party] || {}).forEach(
                                ([docType, file]) => {
                                  if (file)
                                    allEntries.push({ party, docType, file });
                                },
                              );
                            });
                            if (allEntries.length === 0) {
                              toast.error(
                                "Please select at least one document to upload.",
                              );
                              return;
                            }
                            // Always normalize documentType to match backend expectations
                            const normalizeDocType = (type) =>
                              type.trim().toUpperCase().replace(/\s+/g, "_");
                            const filesPayload = allEntries.map((entry) => ({
                              file: entry.file,
                              documentType: normalizeDocType(entry.docType),
                            }));
                            await uploadDocumentsMutation.mutateAsync({
                              id: selectedApplication.id,
                              files: filesPayload,
                              // Optionally, party can be sent if needed for all
                            });
                            toast.success("Documents uploaded successfully");
                            setShowUploadModal(false);
                            setUploadFiles({
                              applicant: {},
                              coApplicant: {},
                              guarantor: {},
                              other: {},
                            });
                            refetchDocuments();
                          }}
                        >
                          <div className="w-full overflow-x-auto max-h-[65vh] overflow-y-auto pr-2">
                            {/* Applicant */}
                            <h3 className="font-semibold mb-4 text-left">
                              Applicant
                            </h3>
                            <div className="flex flex-col gap-3 mb-8">
                              {[
                                ...applicantRequiredDocs.map((d) => ({
                                  type: d,
                                  required: true,
                                })),
                                ...applicantOptionalDocs.map((d) => ({
                                  type: d,
                                  required: false,
                                })),
                              ].length === 0 && (
                                <div className="text-xs text-gray-500">
                                  No documents
                                </div>
                              )}
                              {[
                                ...applicantRequiredDocs.map((d) => ({
                                  type: d,
                                  required: true,
                                })),
                                ...applicantOptionalDocs.map((d) => ({
                                  type: d,
                                  required: false,
                                })),
                              ].map(({ type, required }) => (
                                <div
                                  key={type}
                                  className="flex flex-col gap-2 border-2 border-blue-200 rounded-xl p-4 bg-white shadow-sm min-w-0 transition-all w-full"
                                  style={{ minHeight: 90 }}
                                >
                                  <span
                                    className="block text-base font-semibold text-gray-900 break-words max-w-full"
                                    title={type}
                                  >
                                    {type}
                                  </span>
                                  <span
                                    className={`block text-xs mt-1 ${required ? "text-red-500" : "text-gray-400"}`}
                                  >
                                    {required ? "Required" : "Optional"}
                                  </span>
                                  <input
                                    type="file"
                                    accept="application/pdf,image/*"
                                    className="w-full file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-base file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    onChange={(e) => {
                                      setUploadFiles((f) => ({
                                        ...f,
                                        applicant: {
                                          ...f.applicant,
                                          [type]: e.target.files[0],
                                        },
                                      }));
                                    }}
                                  />
                                  {uploadFiles.applicant[type] && (
                                    <span
                                      className="text-green-700 text-sm font-medium truncate max-w-full"
                                      title={uploadFiles.applicant[type].name}
                                    >
                                      {uploadFiles.applicant[type].name}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                            {/* Co-Applicant */}
                            <h3 className="font-semibold mb-4 text-left">
                              Co-Applicant
                            </h3>
                            <div className="flex flex-col gap-3 mb-8">
                              {[
                                ...coApplicantRequiredDocs.map((d) => ({
                                  type: d,
                                  required: true,
                                })),
                                ...coApplicantOptionalDocs.map((d) => ({
                                  type: d,
                                  required: false,
                                })),
                              ].length === 0 && (
                                <div className="text-xs text-gray-500">
                                  No documents
                                </div>
                              )}
                              {[
                                ...coApplicantRequiredDocs.map((d) => ({
                                  type: d,
                                  required: true,
                                })),
                                ...coApplicantOptionalDocs.map((d) => ({
                                  type: d,
                                  required: false,
                                })),
                              ].map(({ type, required }) => (
                                <div
                                  key={type}
                                  className="flex flex-col gap-2 border-2 border-blue-200 rounded-xl p-4 bg-white shadow-sm min-w-0 transition-all w-full"
                                  style={{ minHeight: 90 }}
                                >
                                  <span
                                    className="block text-base font-semibold text-gray-900 break-words max-w-full"
                                    title={type}
                                  >
                                    {type}
                                  </span>
                                  <span
                                    className={`block text-xs mt-1 ${required ? "text-red-500" : "text-gray-400"}`}
                                  >
                                    {required ? "Required" : "Optional"}
                                  </span>
                                  <input
                                    type="file"
                                    accept="application/pdf,image/*"
                                    className="w-full file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-base file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    onChange={(e) => {
                                      setUploadFiles((f) => ({
                                        ...f,
                                        coApplicant: {
                                          ...f.coApplicant,
                                          [type]: e.target.files[0],
                                        },
                                      }));
                                    }}
                                  />
                                  {uploadFiles.coApplicant[type] && (
                                    <span
                                      className="text-green-700 text-sm font-medium truncate max-w-full"
                                      title={uploadFiles.coApplicant[type].name}
                                    >
                                      {uploadFiles.coApplicant[type].name}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                            {/* Guarantor */}
                            <h3 className="font-semibold mb-4 text-left">
                              Guarantor
                            </h3>
                            <div className="flex flex-col gap-3">
                              {[
                                ...guarantorRequiredDocs.map((d) => ({
                                  type: d,
                                  required: true,
                                })),
                                ...guarantorOptionalDocs.map((d) => ({
                                  type: d,
                                  required: false,
                                })),
                              ].length === 0 && (
                                <div className="text-xs text-gray-500">
                                  No documents
                                </div>
                              )}
                              {[
                                ...guarantorRequiredDocs.map((d) => ({
                                  type: d,
                                  required: true,
                                })),
                                ...guarantorOptionalDocs.map((d) => ({
                                  type: d,
                                  required: false,
                                })),
                              ].map(({ type, required }) => (
                                <div
                                  key={type}
                                  className="flex flex-col gap-2 border-2 border-blue-200 rounded-xl p-4 bg-white shadow-sm min-w-0 transition-all w-full"
                                  style={{ minHeight: 90 }}
                                >
                                  <span
                                    className="block text-base font-semibold text-gray-900 break-words max-w-full"
                                    title={type}
                                  >
                                    {type}
                                  </span>
                                  <span
                                    className={`block text-xs mt-1 ${required ? "text-red-500" : "text-gray-400"}`}
                                  >
                                    {required ? "Required" : "Optional"}
                                  </span>
                                  <input
                                    type="file"
                                    accept="application/pdf,image/*"
                                    className="w-full file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-base file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    onChange={(e) => {
                                      setUploadFiles((f) => ({
                                        ...f,
                                        guarantor: {
                                          ...f.guarantor,
                                          [type]: e.target.files[0],
                                        },
                                      }));
                                    }}
                                  />
                                  {uploadFiles.guarantor[type] && (
                                    <span
                                      className="text-green-700 text-sm font-medium truncate max-w-full"
                                      title={uploadFiles.guarantor[type].name}
                                    >
                                      {uploadFiles.guarantor[type].name}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                            {/* Other Documents */}{" "}
                            <h3 className="font-semibold mb-4 text-left">
                              Other Documents
                            </h3>
                            <div className="flex flex-col gap-3">
                              {[
                                ...otherRequiredDocs.map((d) => ({
                                  type: d,
                                  required: true,
                                })),
                                ...otherOptionalDocs.map((d) => ({
                                  type: d,
                                  required: false,
                                })),
                              ].length === 0 && (
                                <div className="text-xs text-gray-500">
                                  No documents
                                </div>
                              )}
                              {[
                                ...otherRequiredDocs.map((d) => ({
                                  type: d,
                                  required: true,
                                })),
                                ...otherOptionalDocs.map((d) => ({
                                  type: d,
                                  required: false,
                                })),
                              ].map(({ type, required }) => (
                                <div
                                  key={type}
                                  className="flex flex-col gap-2 border-2 border-blue-200 rounded-xl p-4 bg-white shadow-sm min-w-0 transition-all w-full"
                                  style={{ minHeight: 90 }}
                                >
                                  <span
                                    className="block text-base font-semibold text-gray-900 break-words max-w-full"
                                    title={type}
                                  >
                                    {type}
                                  </span>
                                  <span
                                    className={`block text-xs mt-1 ${required ? "text-red-500" : "text-gray-400"}`}
                                  >
                                    {required ? "Required" : "Optional"}
                                  </span>
                                  <input
                                    type="file"
                                    accept="application/pdf,image/*"
                                    className="w-full file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-base file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    onChange={(e) => {
                                      setUploadFiles((f) => ({
                                        ...f,
                                        other: {
                                          ...f.other,
                                          [type]: e.target.files[0],
                                        },
                                      }));
                                    }}
                                  />
                                  {uploadFiles.other[type] && (
                                    <span
                                      className="text-green-700 text-sm font-medium truncate max-w-full"
                                      title={uploadFiles.other[type].name}
                                    >
                                      {uploadFiles.other[type].name}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="mt-6 flex justify-end gap-2">
                            <button
                              type="button"
                              className="px-4 py-2 bg-gray-200 rounded"
                              onClick={() => setShowUploadModal(false)}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className={`px-4 py-2 ${colorVariables.PRIMARY_BUTTON_COLOR} text-white rounded`}
                            >
                              Submit All
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                )}
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
                    doc.ownerType ||
                    (doc.party ? doc.party.toUpperCase() : "APPLICANT"),
                  uploadDate: doc.createdAt
                    ? new Date(doc.createdAt).toLocaleDateString()
                    : "-",
                  status: doc.verificationStatus
                    ? doc.verificationStatus.toUpperCase()
                    : "-",
                  documentPath: doc.documentPath,
                  // Add any other fields needed for actions
                }))}
                loading={isLoadingDocuments}
                onViewDocument={(doc) =>
                  window.open(doc.documentPath, "_blank")
                }
                onVerify={handleVerify}
                onReject={handleReject}
              />
            </div>
          </div>
        </div>
      </>
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
              const totalDocumentsDisplay =
                totalRequired > 0
                  ? totalRequired
                  : (app.totalDocuments ?? uploadedCount);
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
