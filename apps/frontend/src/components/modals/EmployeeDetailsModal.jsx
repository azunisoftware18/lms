import React from "react";
import { Download, X, Phone, Check } from "lucide-react";
import { useBranchAdminById } from "../../hooks/useBranchAdmin";
import { useEmployee } from "../../hooks/useEmployee";

const PERMISSION_LABELS = [
  { key: "addCustomer", label: "Can Add Customer" },
  { key: "viewCustomer", label: "Can View All Customers" },
  { key: "processLoan", label: "Can Process Loans" },
  { key: "manageLeads", label: "Can Manage Leads" },
  { key: "generateReports", label: "Can Generate Reports" },
];

export default function EmployeeDetailsModal({
  isOpen,
  employee,
  onClose,
  onDownloadProfile,
}) {
  const nonEmpty = (...values) =>
    values.find((value) => value != null && String(value).trim().length);

  const reportingManagerRaw = employee?.reportingManager;
  const reportingManagerRef =
    employee?.reportingManagerId ||
    (typeof reportingManagerRaw === "object" && reportingManagerRaw !== null
      ? reportingManagerRaw.id
      : typeof reportingManagerRaw === "string"
        ? reportingManagerRaw
        : null);

  // Avoid querying by obvious human names.
  const managerId =
    typeof reportingManagerRef === "string" &&
    reportingManagerRef.trim().length > 0 &&
    !/\s/.test(reportingManagerRef)
      ? reportingManagerRef
      : null;

  const managerQuery = useBranchAdminById(managerId);
  const managerData = managerQuery?.data?.data || managerQuery?.data || null;
  const managerEmployeeQuery = useEmployee(managerId);
  const managerEmployeeData =
    managerEmployeeQuery?.data?.data || managerEmployeeQuery?.data || null;

  if (!isOpen || !employee) return null;

  const show = (value) => {
    if (value == null) return "-";
    const str = String(value).trim();
    return str.length ? str : "-";
  };

  const statusClass = (() => {
    const s = employee?.status;
    if (s === "Active") return "bg-green-100 text-green-700";
    if (s === "On Leave") return "bg-yellow-100 text-yellow-700";
    if (s) return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  })();

  const leaveBalanceDisplay =
    employee?.leaveBalance != null ? `${employee.leaveBalance} days` : "-";

  const formatDate = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString();
  };

  const toNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const computedTotalSalary = (() => {
    if (employee == null) return null;
    if (
      employee.totalSalary != null &&
      String(employee.totalSalary).trim().length
    )
      return employee.totalSalary;
    const sum =
      toNum(nonEmpty(employee.basicSalary, employee.salaryDetails?.basicSalary)) +
      toNum(employee.hra) +
      toNum(nonEmpty(employee.conveyance, employee.salaryDetails?.conveyance)) +
      toNum(
        nonEmpty(employee.medicalAllowance, employee.salaryDetails?.medicalAllowance),
      ) +
      toNum(
        nonEmpty(employee.otherAllowances, employee.salaryDetails?.otherAllowances),
      ) -
      toNum(nonEmpty(employee.pfDeduction, employee.salaryDetails?.pfDeduction)) -
      toNum(nonEmpty(employee.taxDeduction, employee.salaryDetails?.taxDeduction));
    return sum || null;
  })();

  const uploadedDocs = Array.isArray(employee.documents)
    ? employee.documents
    : [];
  const kycs = Array.isArray(employee.kycs) ? employee.kycs : [];

  const getDocLabel = (documentType) =>
    String(documentType || "-")
      .replace(/^EMP_/, "")
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const getReportingManagerName = () => {
    const rm = employee.reportingManager;

    const directName = nonEmpty(
      employee.reportingManagerName,
      employee.reportingManagerFullName,
      typeof rm === "object" && rm !== null
        ? rm.fullName || rm.name || rm.username || rm.email
        : null,
    );

    if (directName) return directName;
    if (!rm && !employee.reportingManagerId) return null;

    if (typeof rm === "object" && rm !== null) {
      return rm.fullName || rm.name || rm.username || rm.email || rm.id || null;
    }
    if (typeof rm === "string") {
      // prefer fetched manager data (branch-admin) first
      if (managerData)
        return (
          managerData.fullName ||
          managerData.name ||
          managerData.username ||
          managerData.email ||
          managerData.id
        );
      // then prefer employee lookup
      if (managerEmployeeData)
        return (
          managerEmployeeData.fullName ||
          managerEmployeeData.name ||
          managerEmployeeData.username ||
          managerEmployeeData.email ||
          managerEmployeeData.id
        );
      // if the string looks like a human name (contains space), return it
      if (/\s/.test(rm)) return rm;
      // otherwise fallback to id
      return employee.reportingManagerId || rm || null;
    }
    // final fallback: prefer fetched names, then ids
    if (managerData)
      return (
        managerData.fullName ||
        managerData.name ||
        managerData.username ||
        managerData.email ||
        managerData.id
      );
    if (managerEmployeeData)
      return (
        managerEmployeeData.fullName ||
        managerEmployeeData.name ||
        managerEmployeeData.username ||
        managerEmployeeData.email ||
        managerEmployeeData.id
      );
    return (
      employee.reportingManagerName ||
      employee.reportingManagerFullName ||
      employee.reportingManagerId ||
      null
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg font-bold">
              {employee.fullName?.charAt(0) || "?"}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {employee.fullName}
              </h2>
              <p className="text-sm text-gray-500">
                {show(employee.designation)} • {show(employee.department)} • ID:{" "}
                {show(employee.employeeId)}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onDownloadProfile}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm"
            >
              <Download size={16} /> Download Excel (CSV)
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b pb-2 mb-4">
                  Personal Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block">Email</span>
                    <span className="font-medium text-gray-800">
                      {show(nonEmpty(employee.email, employee.Email, employee.user?.email))}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Phone</span>
                    <span className="font-medium text-gray-800">
                      {show(
                        nonEmpty(
                          employee.phone,
                          employee.contactNumber,
                          employee.user?.contactNumber,
                        ),
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Alt Phone</span>
                    <span className="font-medium text-gray-800">
                      {show(nonEmpty(employee.altPhone, employee.atlMobileNumber))}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Gender</span>
                    <span className="font-medium text-gray-800">
                      {show(employee.gender)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">DOB</span>
                    <span className="font-medium text-gray-800">
                      {formatDate(employee.dob)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Marital Status</span>
                    <span className="font-medium text-gray-800">
                      {show(employee.maritalStatus)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b pb-2 mb-4">
                  Professional Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block">Employee ID</span>
                    <span className="font-bold text-blue-600">
                      {show(employee.employeeId)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Department</span>
                    <span className="font-medium text-gray-800">
                      {show(employee.department)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Designation</span>
                    <span className="font-medium text-gray-800">
                      {show(employee.designation)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Experience</span>
                    <span className="font-medium text-gray-800">
                      {show(employee.experience)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Date of Joining</span>
                    <span className="font-medium text-gray-800">
                      {formatDate(employee.dateOfJoining)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Work Location</span>
                    <span className="font-medium text-gray-800">
                      {show(employee.workLocation)}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 block">
                      Reporting Manager
                    </span>
                    <span className="font-medium text-gray-800">
                      {show(getReportingManagerName())}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Branch Code</span>
                    <span className="font-medium text-gray-800">
                      {show(employee.branchCode || employee.branch?.code)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Branch Name</span>
                    <span className="font-medium text-gray-800">
                      {show(employee.branchName || employee.branch?.name)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Branch Type</span>
                    <span className="font-medium text-gray-800">
                      {show(employee.branch?.type)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">
                      Role Title / Name
                    </span>
                    <span className="font-medium text-gray-800">
                      {show(
                        `${employee.employeeRole?.roleTitle || employee.roleTitle || "-"} / ${employee.employeeRole?.roleName || employee.roleName || "-"}`,
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b pb-2 mb-4">
                  Address
                </h3>
                <div className="text-sm">
                  <p className="font-medium text-gray-800">
                    {show(employee.address)}
                  </p>
                  <p className="text-gray-600">
                    {show(employee.city)}, {show(employee.state)} -{" "}
                    {show(employee.pincode || employee.pinCode)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b pb-2 mb-4">
                  Banking Details
                </h3>
                <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Bank Name:</span>
                    <span className="font-bold text-gray-800">
                      {show(
                        nonEmpty(employee.bankName, employee.accountDetails?.bankName),
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account No:</span>
                    <span className="font-mono text-gray-800">
                      {show(
                        nonEmpty(
                          employee.bankAccountNo,
                          employee.accountNo,
                          employee.accountDetails?.bankAccountNo,
                        ),
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>IFSC Code:</span>
                    <span className="font-mono text-gray-800">
                      {show(nonEmpty(employee.ifsc, employee.accountDetails?.ifsc))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account Holder:</span>
                    <span className="font-medium text-gray-800">
                      {show(
                        nonEmpty(
                          employee.accountHolder,
                          employee.accountDetails?.accountHolder,
                        ),
                      )}
                    </span>
                  </div>
                  {show(nonEmpty(employee.upiId, employee.accountDetails?.upiId)) !==
                    "-" && (
                    <div className="flex justify-between">
                      <span>UPI ID:</span>
                      <span className="font-medium text-blue-600">
                        {show(nonEmpty(employee.upiId, employee.accountDetails?.upiId))}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b pb-2 mb-4">
                  Salary Structure
                </h3>
                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Basic Salary:</span>
                      <span className="font-bold text-gray-800">
                        {show(
                          nonEmpty(
                            employee.basicSalary,
                            employee.salaryDetails?.basicSalary,
                          ),
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>HRA:</span>
                      <span className="text-gray-700">
                        {show(employee.hra)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conveyance:</span>
                      <span className="text-gray-700">
                        {show(
                          nonEmpty(
                            employee.conveyance,
                            employee.salaryDetails?.conveyance,
                          ),
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Medical Allowance:</span>
                      <span className="text-gray-700">
                        {show(
                          nonEmpty(
                            employee.medicalAllowance,
                            employee.salaryDetails?.medicalAllowance,
                          ),
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other Allowances:</span>
                      <span className="text-gray-700">
                        {show(
                          nonEmpty(
                            employee.otherAllowances,
                            employee.salaryDetails?.otherAllowances,
                          ),
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>PF Deduction:</span>
                      <span className="text-gray-700">
                        {show(
                          nonEmpty(
                            employee.pfDeduction,
                            employee.salaryDetails?.pfDeduction,
                          ),
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax Deduction:</span>
                      <span className="text-gray-700">
                        {show(
                          nonEmpty(
                            employee.taxDeduction,
                            employee.salaryDetails?.taxDeduction,
                          ),
                        )}
                      </span>
                    </div>
                    <div className="border-t border-green-200 pt-2 mt-2">
                      <div className="flex justify-between font-bold text-green-700">
                        <span>Total Salary:</span>
                        <span>{show(computedTotalSalary)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b pb-2 mb-4">
                  KYC & Account
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block">Aadhaar</span>
                    <span className="font-mono text-gray-800">
                      {show(employee.aadhaarNo)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">PAN</span>
                    <span className="font-mono text-gray-800">
                      {show(employee.panNo)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Username</span>
                    <span className="font-medium text-gray-800">
                      {show(employee.username)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Leave Balance</span>
                    <span className="font-bold text-blue-600">
                      {leaveBalanceDisplay}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Status</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${statusClass}`}
                    >
                      {show(employee.status)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">KYC Status</span>
                    <span className="font-medium text-gray-800">
                      {show(employee.user?.kycStatus ?? kycs[0]?.status)}
                    </span>
                  </div>
                </div>
              </div>

              {kycs.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b pb-2 mb-4">
                    KYC Records
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {kycs.map((kyc) => (
                      <div
                        key={kyc.id}
                        className="border border-gray-100 rounded-lg p-3 bg-gray-50"
                      >
                        <p className="text-xs text-gray-500">{show(kyc.id)}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm font-medium text-gray-700">
                            Status: {show(kyc.status)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(kyc.createdAt)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b pb-2 mb-4">
                  Uploaded Documents
                </h3>
                {uploadedDocs.length === 0 ? (
                  <p className="text-sm text-gray-500">No uploaded documents</p>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {uploadedDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="border border-gray-100 rounded-lg p-3 bg-gray-50"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                            {getDocLabel(doc.documentType)}
                          </p>
                          <span className="text-[11px] text-gray-500">
                            {show(doc.verificationStatus)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-800 break-all mt-1">
                          {show(doc.documentPath)}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1">
                          Uploaded: {formatDate(doc.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b pb-2 mb-4">
                  System Permissions
                </h3>
                <div className="space-y-2 text-sm">
                  {PERMISSION_LABELS.filter(
                    ({ key }) => employee.permissions?.[key],
                  ).map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-2">
                      <Check size={14} className="text-green-500" />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
