import React, { useEffect, useState } from "react";
import SelectField from "../../../components/ui/SelectField";
import TextAreaField from "../../../components/ui/TextAreaField";
import Button from "../../../components/ui/Button";

const STATUS_OPTIONS = [
  { label: "Contacted", value: "CONTACTED" },
  { label: "Interested", value: "INTERESTED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Pending", value: "PENDING" },
];

const REJECTED_ONLY_OPTIONS = [{ label: "Rejected", value: "REJECTED" }];

export default function EditLeadDialog({
  open,
  lead,
  onClose,
  onSave,
  onApprove,
  approving = false,
}) {
  const [status, setStatus] = useState(() =>
    lead?.status ? lead.status : "PENDING",
  );
  const [remark, setRemark] = useState(() => lead?.remarks || "");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStatus(lead?.status || "PENDING");
    setRemark(lead?.remarks || "");
    setTouched(false);
  }, [open, lead?.id, lead?.status, lead?.remarks]);

  // Derive displayed status: if user hasn't touched the field, reflect `lead.status`.
  const displayedStatus = touched ? status : lead?.status || "PENDING";
  const isRejectedLead = lead?.status === "REJECTED";
  const shouldAskForRemark = displayedStatus === "REJECTED";
  const trimmedRemark = remark.trim();
  const hasDefaultLoggingFeeAmount =
    lead?.defaultLoggingFeeAmount !== null &&
    lead?.defaultLoggingFeeAmount !== undefined;
  const availableStatusOptions = isRejectedLead
    ? REJECTED_ONLY_OPTIONS
    : STATUS_OPTIONS;

  if (!open || !lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Edit Lead Status
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Lead Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
            <Info label="Name" value={lead.fullName} />
            <Info label="Email" value={lead.email} />
            <Info label="Contact" value={lead.contactNumber} />
            <Info label="City" value={lead.city} />
            <Info label="State" value={lead.state} />
            <Info label="Loan Type" value={lead.loanType?.name} />
            <Info
              label="Loan Amount"
              value={`₹ ${lead.loanAmount?.toLocaleString("en-IN")}`}
            />
            <Info label="Address" value={lead.address} />
          </div>

          {/* Status Section */}
          <div className="mb-4">
            <SelectField
              label="Update Status"
              value={displayedStatus}
              onChange={(v) => {
                setTouched(true);
                setStatus(v);
              }}
              options={availableStatusOptions}
              isRequired
              isDisabled={isRejectedLead}
            />
            {shouldAskForRemark && (
              <div className="mt-4">
                <TextAreaField
                  label="Rejection Remark"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Enter the reason for rejecting this lead"
                  rows={4}
                  isRequired
                  maxLength={500}
                />
              </div>
            )}
            {!hasDefaultLoggingFeeAmount && (
              <p className="mt-2 text-xs text-amber-700">
                Set login charges before approving this lead.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => onApprove?.(lead)}
            disabled={!hasDefaultLoggingFeeAmount || approving}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {approving ? "Approving..." : "Approve Lead"}
          </Button>
          <Button
            type="button"
            onClick={() =>
              onSave({
                ...lead,
                status: displayedStatus,
                remarks: shouldAskForRemark ? trimmedRemark : lead?.remarks || "",
              })
            }
            disabled={shouldAskForRemark && !trimmedRemark}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

/* Reusable Info Component */
function Info({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="font-medium text-gray-800 wrap-break-word">
        {value || "-"}
      </p>
    </div>
  );
}
