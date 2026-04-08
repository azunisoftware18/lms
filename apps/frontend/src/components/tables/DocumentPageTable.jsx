import React, { useState, useEffect } from "react";
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Upload,
} from "lucide-react";
import { TableShell, TableLoader, TableEmpty } from "./core";
import ActionMenu from "../common/ActionMenu";
import ConfirmationDialog from "../common/ConfirmationDialog";

const COLUMNS = ["Document", "Applicant", "Upload Date", "Status", "Actions"];

function ApplicantBadge({ applicantType }) {
  const isPrimary = applicantType === "APPLICANT";

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        isPrimary
          ? "bg-blue-100 text-blue-700"
          : "bg-violet-100 text-violet-700"
      }`}
    >
      {isPrimary ? "Primary" : "Co-applicant"}
    </span>
  );
}

function StatusBadge({ status }) {
  const normalized = (status || "").toLowerCase();
  const tone =
    normalized === "verified"
      ? "bg-green-100 text-green-700"
      : normalized === "pending"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-red-100 text-red-700";

  const display = status ? String(status).toUpperCase() : "-";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${tone}`}
    >
      {normalized === "verified" && <CheckCircle className="w-3 h-3 mr-1" />}
      {normalized === "pending" && <Clock className="w-3 h-3 mr-1" />}
      {normalized === "rejected" && <XCircle className="w-3 h-3 mr-1" />}
      {display}
    </span>
  );
}

export default function DocumentPageTable({
  documents = [],
  loading = false,
  onViewDocument = () => {},
  onVerify = () => {},
  onReject = () => {},
  onUploadDocument = () => {},
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <TableShell>
      {!isMobile && (
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {COLUMNS.map((column) => (
              <th
                key={column}
                className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase ${
                  column === "Actions" ? "text-right" : "text-left"
                }`}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
      )}

      {loading ? (
        <TableLoader colSpan={COLUMNS.length} />
      ) : documents.length === 0 ? (
        <TableEmpty colSpan={COLUMNS.length} />
      ) : (
        <DocumentTableBody
          isMobile={isMobile}
          documents={documents}
          onViewDocument={onViewDocument}
          onVerify={onVerify}
          onReject={onReject}
          onUploadDocument={onUploadDocument}
        />
      )}
    </TableShell>
  );
}

function DocumentTableBody({
  isMobile,
  documents,
  onViewDocument,
  onVerify,
  onReject,
  onUploadDocument,
}) {
  if (isMobile) {
    return (
      <tbody className="divide-y divide-gray-200">
        {documents.map((doc, index) => (
          <tr key={doc.id || index} className="px-3 py-2">
            <td colSpan={COLUMNS.length} className="px-3 py-3">
              <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {doc.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {doc.uploadDate}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <ApplicantBadge applicantType={doc.applicantType} />
                      <StatusBadge status={doc.status} />
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <TableRowActions
                      doc={doc}
                      onView={onViewDocument}
                      onVerify={onVerify}
                      onReject={onReject}
                      onUpload={onUploadDocument}
                    />
                  </div>
                </div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    );
  }

  return (
    <tbody className="divide-y divide-gray-200">
      {documents.map((doc, index) => {
        const isLast = index === documents.length - 1;
        const cellClass = `px-6 py-4 ${!isLast ? "border-b border-gray-200" : ""}`;

        return (
          <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
            <td className={cellClass}>
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-900">{doc.name}</span>
              </div>
            </td>
            <td className={cellClass}>
              <ApplicantBadge applicantType={doc.applicantType} />
            </td>
            <td className={`${cellClass} text-sm text-gray-600`}>
              {doc.uploadDate}
            </td>
            <td className={cellClass}>
              <StatusBadge status={doc.status} />
            </td>
            <td className={`${cellClass} text-right`}>
              <div className="inline-flex items-center">
                <TableRowActions
                  doc={doc}
                  onView={onViewDocument}
                  onVerify={onVerify}
                  onReject={onReject}
                  onUpload={onUploadDocument}
                />
              </div>
            </td>
          </tr>
        );
      })}
    </tbody>
  );
}

function TableRowActions({ doc, onView, onVerify, onReject, onUpload }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const isPending = (doc.status || "").toLowerCase() === "pending";
  const isRejected = (doc.status || "").toLowerCase() === "rejected";

  const actions = [
    {
      label: "View",
      icon: Eye,
      onClick: () => onView(doc),
    },
    ...(isPending
      ? [
          {
            label: "Verify",
            icon: CheckCircle,
            isSuccess: true,
            onClick: () => onVerify(doc.id),
          },
        ]
      : []),
    ...(isRejected
      ? [
          {
            label: "Upload",
            icon: Upload,
            onClick: () => onUpload && onUpload(doc),
          },
        ]
      : []),
    {
      label: "Reject",
      icon: XCircle,
      isDanger: true,
      onClick: () => setConfirmOpen(true),
    },
  ];

  return (
    <>
      <ActionMenu
        actions={actions}
        containerClassName=""
        menuClassName=""
        align="right"
      />
      <ConfirmationDialog
        open={confirmOpen}
        title="Reject Document"
        description="Please provide a reason for rejecting this document."
        confirmText="Reject"
        cancelText="Cancel"
        showRemark={true}
        variant="danger"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={(remark) => {
          setConfirmOpen(false);
          onReject(doc.id, remark);
        }}
        isPopup={true}
      />
    </>
  );
}
