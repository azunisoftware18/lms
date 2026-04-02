import { FileText, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { TableShell, TableLoader, TableEmpty } from "./core";

const COLUMNS = [
  "Document",
  "Category",
  "Applicant",
  "Upload Date",
  "Status",
  "Actions",
];

const getCategoryLabel = (category) => category?.replaceAll("_", " ") || "-";

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
  const tone =
    status === "verified"
      ? "bg-green-100 text-green-700"
      : status === "PENDING"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-red-100 text-red-700";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${tone}`}
    >
      {status === "verified" && <CheckCircle className="w-3 h-3 mr-1" />}
      {status === "PENDING" && <Clock className="w-3 h-3 mr-1" />}
      {status === "REJECTED" && <XCircle className="w-3 h-3 mr-1" />}
      {status}
    </span>
  );
}

export default function DocumentPageTable({
  documents = [],
  loading = false,
  onViewDocument = () => {},
  onVerify = () => {},
  onReject = () => {},
}) {
  return (
    <TableShell>
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          {COLUMNS.map((column) => (
            <th
              key={column}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
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
                <td className={`${cellClass} text-sm text-gray-600`}>
                  {getCategoryLabel(doc.category)}
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
                <td className={cellClass}>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewDocument(doc)}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Document"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {doc.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => onVerify(doc.id)}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs font-medium"
                        >
                          Verify
                        </button>
                        <button
                          onClick={() => onReject(doc.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs font-medium"
                        >
                          Reject
                        </button>
                      </>
                    )}
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
