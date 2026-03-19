import React from "react";
import { Download, X, Phone, Check } from "lucide-react";

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
  if (!isOpen || !employee) return null;

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
                {employee.designation} • {employee.department} • ID:{" "}
                {employee.employeeId}
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
                      {employee.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Phone</span>
                    <span className="font-medium text-gray-800">
                      {employee.phone}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Alt Phone</span>
                    <span className="font-medium text-gray-800">
                      {employee.altPhone || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Gender</span>
                    <span className="font-medium text-gray-800">
                      {employee.gender}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">DOB</span>
                    <span className="font-medium text-gray-800">
                      {employee.dob || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray500 block">Marital Status</span>
                    <span className="font-medium text-gray-800">
                      {employee.maritalStatus || "-"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b pb-2 mb-4">
                  Emergency Contact
                </h3>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">
                        {employee.emergencyContact || "Not provided"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {employee.emergencyRelation}
                      </p>
                    </div>
                    <Phone size={18} className="text-gray-400" />
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
                      {employee.employeeId}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Department</span>
                    <span className="font-medium text-gray-800">
                      {employee.department}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Designation</span>
                    <span className="font-medium text-gray-800">
                      {employee.designation}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Experience</span>
                    <span className="font-medium text-gray-800">
                      {employee.experience || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Date of Joining</span>
                    <span className="font-medium text-gray-800">
                      {employee.dateOfJoining || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Work Location</span>
                    <span className="font-medium text-gray-800">
                      {employee.workLocation || "Office"}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 block">
                      Reporting Manager
                    </span>
                    <span className="font-medium text-gray-800">
                      {employee.reportingManager || "-"}
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
                    {employee.address}
                  </p>
                  <p className="text-gray-600">
                    {employee.city}, {employee.state} - {employee.pincode}
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
                      {employee.bankName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account No:</span>
                    <span className="font-mono text-gray-800">
                      {employee.bankAccountNo || employee.accountNo}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>IFSC Code:</span>
                    <span className="font-mono text-gray-800">
                      {employee.ifsc}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account Holder:</span>
                    <span className="font-medium text-gray-800">
                      {employee.accountHolder}
                    </span>
                  </div>
                  {employee.upiId && (
                    <div className="flex justify-between">
                      <span>UPI ID:</span>
                      <span className="font-medium text-blue-600">
                        {employee.upiId}
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
                        {employee.basicSalary}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>HRA:</span>
                      <span className="text-gray-700">{employee.hra}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conveyance:</span>
                      <span className="text-gray-700">
                        {employee.conveyance}
                      </span>
                    </div>
                    <div className="border-t border-green-200 pt-2 mt-2">
                      <div className="flex justify-between font-bold text-green-700">
                        <span>Total Salary:</span>
                        <span>{employee.totalSalary}</span>
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
                      {employee.aadhaarNo}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">PAN</span>
                    <span className="font-mono text-gray-800">
                      {employee.panNo}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Username</span>
                    <span className="font-medium text-gray-800">
                      {employee.username}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Leave Balance</span>
                    <span className="font-bold text-blue-600">
                      {employee.leaveBalance} days
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Status</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${employee.status === "Active" ? "bg-green-100 text-green-700" : employee.status === "On Leave" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}
                    >
                      {employee.status}
                    </span>
                  </div>
                </div>
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
