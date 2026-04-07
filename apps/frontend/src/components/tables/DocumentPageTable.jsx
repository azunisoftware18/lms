import React, { useState } from "react";
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
  return (
    <TableShell>
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

      {loading ? (
        <TableLoader colSpan={COLUMNS.length} />
      ) : documents.length === 0 ? (
        <TableEmpty colSpan={COLUMNS.length} />
      ) : (
        <tbody className="divide-y divide-gray-200">
          {documents.map((doc, index) => {
            const isLast = index === documents.length - 1;
            const cellClass = `px-6 py-4 ${!isLast ? "border-b border-gray-200" : ""}`;

            return (
              <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                <td className={cellClass}>
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {doc.name}
                    </span>
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
      )}
    </TableShell>
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
