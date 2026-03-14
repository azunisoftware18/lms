import React, { useState, useMemo } from "react";
import {
  Trash2,
  FileText,
  Eye,
  XCircle,
  CheckCircle,
  Clock,
  Filter,
  Users,
  Building,
  Edit2,
  Shield,
  ArrowLeft,
} from "lucide-react";
import {
  MOCK_EMPLOYEES,
  MOCK_PARTNERS,
  INITIAL_ADMIN_LOAN_DATA,
} from "../../lib/dashboardDummyData.js";
import { colorVariables } from "../../lib/index.js";
import Button from "../../components/ui/Button.jsx";
import InputField from "../../components/ui/InputField.jsx";
import StatusCard from "../../components/common/StatusCard";
import LoanRequestTable from "../../components/tables/LoanRequestTable.jsx";
const DetailItem = ({ label, value }) => (
  <div className="flex flex-col p-3 bg-gray-50 rounded-lg">
    <p className="text-xs font-medium text-gray-500 uppercase">{label}</p>
    <p className="text-sm font-bold text-gray-800 wrap-break-word mt-1">
      {value}
    </p>
  </div>
);
export const StatusBadge = ({ status }) => {
  let colorClass = "";
  let Icon = Clock;

  switch (status) {
    case "Approved":
      colorClass = "bg-green-100 text-green-700 border-green-300";
      Icon = CheckCircle;
      break;
    case "Rejected":
      colorClass = "bg-red-100 text-red-700 border-red-300";
      Icon = XCircle;
      break;
    case "Disbursed":
      colorClass = "bg-blue-100 text-blue-700 border-blue-300";
      Icon = CheckCircle;
      break;
    default:
      colorClass = "bg-yellow-100 text-yellow-700 border-yellow-300";
      Icon = Clock;
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${colorClass}`}
    >
      <Icon size={14} className="mr-1" />
      {status}
    </span>
  );
};

// --- 3. Loan Detail Modal ---

const LoanDetailModal = ({
  loan,
  onClose,
  handleUpdateStatus,
  handleDeleteLoan,
  handleEditClick,
}) => {
  if (!loan) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all scale-100">
        <div
          className={`flex justify-between items-center p-6 border-b border-gray-100 ${colorVariables.LIGHT_BG} rounded-t-2xl`}
        >
          <h3 className="text-xl font-extrabold text-blue-800 flex items-center gap-3">
            <FileText size={24} className="text-blue-500" /> Loan Details:{" "}
            {loan.id}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-colors p-1 rounded-full hover:bg-white"
          >
            <XCircle size={28} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <DetailItem label="Borrower" value={loan.borrower} />
            <DetailItem label="Amount" value={loan.amount} />
            <DetailItem
              label="Status"
              value={<StatusBadge status={loan.status} />}
            />
            <DetailItem label="Product Type" value={loan.type} />
            <DetailItem label="Source" value={loan.loanSource} />
            <DetailItem label="Approved By" value={loan.approvedBy || "N/A"} />
            {/* Optional: Add more details here */}
            {loan.details.tenure && (
              <DetailItem label="Tenure" value={loan.details.tenure} />
            )}
            {loan.details?.loanCategory && (
              <DetailItem label="Category" value={loan.details.loanCategory} />
            )}
          </div>

          <div className="border-t pt-4 border-gray-100">
            <h4 className="font-bold text-lg text-gray-700 mb-3">
              Admin Actions
            </h4>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => handleUpdateStatus(loan.id, "Approved")}
                disabled={loan.status === "Approved"}
              >
                Approve
              </Button>
              <Button
                onClick={() => handleUpdateStatus(loan.id, "Disbursed")}
                disabled={
                  loan.status === "Disbursed" || loan.status !== "Approved"
                }
              >
                Disburse
              </Button>
              <Button
                onClick={() => handleUpdateStatus(loan.id, "Rejected")}
                disabled={loan.status === "Rejected"}
              >
                Reject
              </Button>
              <Button
                onClick={() => {
                  onClose();
                  handleEditClick(loan);
                }}
              >
                <Edit2 size={16} /> Edit
              </Button>
              <Button onClick={() => handleDeleteLoan(loan.id)}>
                <Trash2 size={16} /> Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 4. मुख्य कंपोनेंट: LoanRequests (Admin Dashboard) ---

export default function LoanRequestPage() {
  // Retaining the state management logic to allow actions inside the modal/form
  const [loans, setLoans] = useState(INITIAL_ADMIN_LOAN_DATA);
  const [showForm, setShowForm] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [filters, setFilters] = useState({
    status: "All",
    sourceType: "All",
    sourceName: "All",
  });
  const [searchTerm, setSearchTerm] = useState("");

  // --- Functions for State Management (No Local Storage) ---
  const saveLoans = (currentLoans) => {
    setLoans(currentLoans);
  };

  const stats = {
    total: loans.length,
    pending: loans.filter((l) => l.status === "Pending").length,
    approved: loans.filter((l) => l.status === "Approved").length,
    rejected: loans.filter((l) => l.status === "Rejected").length,
    disbursed: loans.filter((l) => l.status === "Disbursed").length,
  };

  // --- Handlers ---

  const _handleLoanSubmit = (loanData) => {
    const isNew = !loans.some((l) => l.id === loanData.id);
    let updatedLoans;

    if (isNew) {
      const newId = `LN-${Date.now()}`;

      const amountValue = Number(loanData?.amount || 0);

      const newLoanWithAdminData = {
        ...loanData,
        id: newId,
        amount: `₹${amountValue.toLocaleString("en-IN")}`,
        loanSource: MOCK_EMPLOYEES[0],
        approvedBy: null,
        status: "Pending",
        tenure: `${loanData?.tenure || 0} months`,
        details: { ...loanData },
      };

      updatedLoans = [newLoanWithAdminData, ...loans];
    } else {
      updatedLoans = loans.map((loan) =>
        loan.id === loanData.id
          ? {
              ...loan,
              borrower: loanData?.customerName || loan.borrower,
              amount: `₹${Number(loanData?.amount || 0).toLocaleString("en-IN")}`,
              type: loanData?.product || loan.type,
              details: { ...loan.details, ...loanData },
            }
          : loan,
      );
    }

    saveLoans(updatedLoans);
    setShowForm(false);
    setIsEditing(false);
    setSelectedLoan(null);
  };

  const handleDeleteLoan = (loanId) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this loan application?",
      )
    ) {
      const updatedLoans = loans.filter((loan) => loan.id !== loanId);
      saveLoans(updatedLoans);
      setSelectedLoan(null);
    }
  };

  const handleUpdateStatus = (loanId, newStatus) => {
    const updatedLoans = loans.map((loan) => {
      if (loan.id === loanId) {
        return {
          ...loan,
          status: newStatus,
          approvedBy:
            newStatus === "Approved" ||
            newStatus === "Rejected" ||
            newStatus === "Disbursed"
              ? "Admin"
              : loan.approvedBy,
        };
      }
      return loan;
    });
    saveLoans(updatedLoans);
    // Update the selected loan in the modal to reflect the new status immediately
    setSelectedLoan((prev) =>
      prev && prev.id === loanId
        ? updatedLoans.find((l) => l.id === loanId)
        : null,
    );
  };

  const handleEditClick = (loan) => {
    setSelectedLoan(loan);
    setIsEditing(true);
    setShowForm(true);
  };

  // --- Filtering & Memoization ---

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredLoans = useMemo(() => {
    let list = loans;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      list = list.filter(
        (loan) =>
          loan.borrower.toLowerCase().includes(searchLower) ||
          loan.id.toLowerCase().includes(searchLower) ||
          loan.loanSource.toLowerCase().includes(searchLower),
      );
    }

    if (filters.status !== "All") {
      list = list.filter((loan) => loan.status === filters.status);
    }

    if (filters.sourceType === "Employee") {
      list = list.filter((loan) => MOCK_EMPLOYEES.includes(loan.loanSource));
    } else if (filters.sourceType === "Partner") {
      list = list.filter((loan) => MOCK_PARTNERS.includes(loan.loanSource));
    }

    if (filters.sourceName !== "All") {
      list = list.filter((loan) => loan.loanSource === filters.sourceName);
    }

    return list;
  }, [loans, filters, searchTerm]);

  const availableSourceNames = useMemo(() => {
    if (filters.sourceType === "Employee") return MOCK_EMPLOYEES;
    if (filters.sourceType === "Partner") return MOCK_PARTNERS;
    return [];
  }, [filters.sourceType]);

  if (showForm) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={() => {
              setShowForm(false);
              setIsEditing(false);
              setSelectedLoan(null);
            }}
            className="mb-6"
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
            {isEditing
              ? "Edit Loan Application"
              : "Loan Application Form (Mock)"}
          </h1>
          {/* <LoanForm 
            onSubmit={handleLoanSubmit} 
            onCancel={() => { setShowForm(false); setIsEditing(false); setSelectedLoan(null); }} 
            initialFormData={initialData}
          /> */}
          <div className="bg-yellow-100 p-4 rounded-lg border border-yellow-300">
            <p className="font-semibold text-yellow-800">
              ⚠️ **LoanForm Component Missing:** The actual form rendering and
              submission logic is skipped here because the `LoanForm` component
              is not provided. The Edit view is functional in terms of state
              management (`showForm`, `isEditing`).
            </p>
            <p className="text-sm mt-2">
              **Mock Data Used:** The `_handleLoanSubmit` function uses a mock
              logic to update the main loan table upon submission.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* === Header (Simplified) === */}

        {/* === Status Cards === */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <StatusCard
            title="Total Loans"
            value={stats.total}
            icon={FileText}
            variant="blue"
            subtext="All applications"
          />

          <StatusCard
            title="Pending"
            value={stats.pending}
            icon={Clock}
            variant="orange"
            subtext="Awaiting approval"
          />

          <StatusCard
            title="Approved"
            value={stats.approved}
            icon={CheckCircle}
            variant="green"
            subtext="Approved loans"
          />

          <StatusCard
            title="Rejected"
            value={stats.rejected}
            icon={XCircle}
            variant="red"
            subtext="Rejected loans"
          />

          <StatusCard
            title="Disbursed"
            value={stats.disbursed}
            icon={Shield}
            variant="purple"
            subtext="Funds released"
          />
        </div>
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
            <Shield size={32} className={colorVariables.PRIMARY_COLOR} /> Loan
            Requests Dashboard
          </h1>
          {/* Removed Reset Data and New Application buttons */}
        </div>

        {/* === Filter and Search Section === */}
        <div className="bg-white p-5 rounded-xl shadow-lg mb-6 border border-gray-100">
          <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
            <Filter size={20} /> Filter Loan Requests
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <InputField
              placeholder="Search by ID, Borrower, or Source..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              containerClassName="lg:col-span-2"
            />

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white pr-8"
            >
              <option value="All">Status: All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Disbursed">Disbursed</option>
            </select>

            {/* Source Type Filter */}
            <select
              value={filters.sourceType}
              onChange={(e) => {
                handleFilterChange("sourceType", e.target.value);
                handleFilterChange("sourceName", "All");
              }}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white pr-8"
            >
              <option value="All">Source Type: All</option>
              <option value="Employee">Employee</option>
              <option value="Partner">Partner</option>
            </select>

            {/* Specific Source Filter */}
            <select
              value={filters.sourceName}
              onChange={(e) => handleFilterChange("sourceName", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white pr-8"
              disabled={filters.sourceType === "All"}
            >
              <option value="All">{filters.sourceType} Name: All</option>
              {availableSourceNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* === Loan Table === */}
        <div className="bg-white rounded-xl shadow-lg overflow-x-auto border border-gray-100">
          <LoanRequestTable
            items={filteredLoans}
            onView={setSelectedLoan}
            employees={MOCK_EMPLOYEES}
            primaryColorClass={colorVariables.PRIMARY_COLOR}
            statusBadge={(status) => <StatusBadge status={status} />}
            footer={
              filteredLoans.length > 0 ? (
                <div className="p-4 text-center text-sm font-medium text-gray-600 border-t bg-gray-50 rounded-b-xl">
                  Showing {filteredLoans.length} of {loans.length} total
                  applications.
                </div>
              ) : null
            }
          />
        </div>
      </div>

      {/* Detail Modal */}
      {selectedLoan && !showForm && (
        <LoanDetailModal
          loan={selectedLoan}
          onClose={() => setSelectedLoan(null)}
          handleUpdateStatus={handleUpdateStatus}
          handleDeleteLoan={handleDeleteLoan}
          handleEditClick={handleEditClick}
        />
      )}
    </div>
  );
}
