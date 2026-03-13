import React, { useState } from "react";
import {
  Clock,
  CreditCard,
  X,
  Building,
  Send,
  Shield,
  ChevronRight,
} from "lucide-react";

// External Component Import
import Button from "../../../components/ui/Button";
import SearchField from "../../../components/ui/SearchField";
import InputField from "../../../components/ui/InputField";
import SelectField from "../../../components/ui/SelectField";
import DisbursementManagementTable from "../../../components/tables/DisbursementManagementTable";

// Data and Utilities
import {
  DISBURSEMENT_PENDING_LOANS,
  DISBURSEMENT_APPROVED_DVS,
  DISBURSEMENT_PAID_DVS,
} from "../../../lib/LOSDummyData";
import { colorVariables } from "../../../lib/index";

export default function DisbursementManagementPage() {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- DATA FROM LOSDummyData.js ---
  const [pendingLoans, setPendingLoans] = useState(DISBURSEMENT_PENDING_LOANS);
  const [allDVs, setAllDVs] = useState([
    ...DISBURSEMENT_APPROVED_DVS,
    ...DISBURSEMENT_PAID_DVS,
  ]);

  const [dvForm, setDvForm] = useState({
    date: new Date().toISOString().split("T")[0],
    mode: "NEFT",
  });

  // --- SIMPLIFIED TAB MAPPING ---
  const tabData = {
    pending: {
      title: "Pending Loans",
      data: pendingLoans.filter(
        (l) =>
          l.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.id.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
      icon: <Clock size={18} />,
      color: "orange",
    },
    approved: {
      title: "Approved for Payment",
      data: allDVs.filter((dv) => dv.status === "approved"),
      icon: <Shield size={18} />,
      color: "blue",
    },
    paid: {
      title: "Paid Vouchers",
      data: allDVs.filter((dv) => dv.status === "paid"),
      icon: <CreditCard size={18} />,
      color: "green",
    },
  };

  // --- DISBURSEMENT ACTIONS ---
  const handleCreateDV = (loan) => {
    setSelectedLoan(loan);
    setShowCreateModal(true);
  };

  const submitCreateDV = () => {
    const newDV = {
      dvNo: `DV-${1000 + allDVs.length + 1}`,
      loanId: selectedLoan.id,
      customer: selectedLoan.customer,
      amount: selectedLoan.amount,
      status: "approved",
      date: dvForm.date,
      bank: selectedLoan.bank,
      mode: dvForm.mode,
    };

    setAllDVs([...allDVs, newDV]);
    setPendingLoans(pendingLoans.filter((l) => l.id !== selectedLoan.id));

    setShowCreateModal(false);
    setActiveTab("approved");
    setCurrentPage(1);
  };

  const handlePayNow = (dv) => {
    setAllDVs(
      allDVs.map((item) =>
        item.dvNo === dv.dvNo ? { ...item, status: "paid" } : item,
      ),
    );
    alert(
      `Payment of ₹${dv.amount.toLocaleString()} initiated for ${dv.customer}`,
    );
  };

  const handleViewDetails = (item) => {
    setSelectedLoan(item);
    setShowDetailsModal(true);
  };

  // --- PAGINATION ---
  const currentTab = tabData[activeTab];
  const totalItems = currentTab.data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentPageData = currentTab.data.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      {/* HEADER */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
          <span>Admin</span>
          <ChevronRight size={14} />
          <span className={colorVariables.PRIMARY_COLOR}>Disbursement</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Disbursement</h1>
        <p className="text-gray-500 mt-1">Manage loan payments to customers</p>
      </div>

      {/* TABS */}
      <div className="flex gap-1 mb-6 bg-white p-1 rounded-xl border border-gray-200 shadow-sm w-fit">
        {Object.entries(tabData).map(([key, tab]) => (
          <button
            key={key}
            onClick={() => handleTabChange(key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === key
                ? `${colorVariables.LIGHT_BG} ${colorVariables.PRIMARY_COLOR} border border-blue-100 shadow-sm`
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            {tab.icon}
            {tab.title}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === key
                  ? `bg-blue-100 ${colorVariables.PRIMARY_COLOR}`
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {tab.data.length}
            </span>
          </button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* SEARCH BAR */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <div>
            <h2 className="font-bold text-gray-800">{currentTab.title}</h2>
            <p className="text-sm text-gray-500">
              {totalItems === 0
                ? "No loans"
                : `Showing ${totalItems} loan${totalItems !== 1 ? "s" : ""}`}
            </p>
          </div>
          <div className="w-full sm:w-64">
            <SearchField
              value={searchQuery}
              placeholder="Search by Name or Loan ID"
              showResults={false}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              onClear={() => {
                setSearchQuery("");
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <DisbursementManagementTable
          data={currentPageData}
          activeTab={activeTab}
          loading={false}
          onViewDetails={handleViewDetails}
          onDisburse={handleCreateDV}
          onPayNow={handlePayNow}
          onPrint={() => window.print()}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* MODAL: CREATE DISBURSEMENT */}
      {showCreateModal && selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            {/* HEADER */}
            <div className="p-5 border-b flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Create Disbursement</h3>
                <p className="text-sm text-gray-500">
                  Send payment to customer
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="hover:bg-gray-100 p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* LOAN INFO */}
            <div
              className={`p-5 space-y-3 ${colorVariables.LIGHT_BG} m-4 rounded-lg`}
            >
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Customer:</span>
                <span className="font-medium">{selectedLoan.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Loan ID:</span>
                <span className={`font-mono ${colorVariables.PRIMARY_COLOR}`}>
                  {selectedLoan.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Amount:</span>
                <span className="font-bold text-lg">
                  &#8377;{selectedLoan.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Bank:</span>
                <span className="font-medium">{selectedLoan.bank}</span>
              </div>
            </div>

            {/* FORM */}
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Disbursement Date
                </label>
                <InputField
                  type="date"
                  value={dvForm.date}
                  onChange={(e) =>
                    setDvForm({ ...dvForm, date: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <SelectField
                  value={dvForm.mode}
                  onChange={(value) => setDvForm({ ...dvForm, mode: value })}
                  options={[
                    { label: "NEFT", value: "NEFT" },
                    { label: "IMPS", value: "IMPS" },
                    { label: "RTGS", value: "RTGS" },
                  ]}
                  placeholder="Select payment method"
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="p-5 border-t flex justify-end gap-3">
              <Button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={submitCreateDV}
                className={`px-5 py-2.5 ${colorVariables.PRIMARY_BUTTON_COLOR} text-white`}
              >
                <Send size={16} />
                Generate Payment
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VIEW DETAILS */}
      {showDetailsModal && selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-5 border-b flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Loan Details</h3>
                <p className="text-sm text-gray-500">{selectedLoan.id}</p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="hover:bg-gray-100 p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium">{selectedLoan.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Loan Type</p>
                  <p className="font-medium">{selectedLoan.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-bold">
                    &#8377;{selectedLoan.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Approved Date</p>
                  <p className="font-medium">{selectedLoan.approvedDate}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Building size={16} />
                  Bank Details
                </h4>
                <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Bank:</span>
                    <span className="font-medium">{selectedLoan.bank}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Account:</span>
                    <span className="font-mono">{selectedLoan.acc}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">IFSC:</span>
                    <span className="font-mono">{selectedLoan.ifsc}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 border-t">
              <Button
                onClick={() => setShowDetailsModal(false)}
                className={`w-full py-2.5 ${colorVariables.PRIMARY_BUTTON_COLOR} text-white`}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
