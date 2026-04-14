import { useState } from "react";
import {
  Edit,
  Trash2,
  User,
  Plus,
  CalendarDays,
  Clock,
  XCircle,
  DollarSign,
  Hourglass,
} from "lucide-react";
import * as Icons from "lucide-react";

import LeadsTable from "../../../components/tables/LeadsTable";
import { useLead, getLeadByIdOrNumber } from "../../../hooks/useLead";
import toast from "react-hot-toast";
import StatusCard from "../../../components/common/StatusCard";

import LeadFormModal from "../../../components/modals/LeadFormModal";
import Button from "../../../components/ui/Button";

import { LEAD_ACTION_DEFINITIONS } from "../../../lib/LOSDummyData";
// import { colorVariables } from "../../../lib";

export default function LoginFee() {
  const [activeTab, setActiveTab] = useState("charge-fee");
  const [formData, setFormData] = useState({
    leadId: "",
    applicantName: "",
    mobileNumber: "",
    email: "",
    loanAmount: "",
    feeAmount: "",
    paymentMode: "online",
    transactionId: "",
  });

  const [generatedFees, setGeneratedFees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFee, setSelectedFee] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // Lead listing state for Track Leads tab
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState("ALL");
  const itemsPerPage = 10;

  const {
    leads = [],
    loading,
    refetch: _refetch,
  } = useLead({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    status: statusFilter,
  });

  const _totalItems = leads?.total || 0;
  const _totalPages = leads?.totalPages || 1;

  const statusCounts = (leads?.data || []).reduce((acc, item) => {
    const s = item?.status || "UNKNOWN";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generateUniqueNumber = () => {
    const prefix = "TXN";
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `${prefix}-${year}${month}${day}-${random}`;
  };

  const handleChargeFee = (e) => {
    e.preventDefault();
    const uniqueNumber = generateUniqueNumber();
    const newFee = {
      id: `LF${Date.now()}`,
      uniqueNumber: uniqueNumber,
      applicantName: formData.applicantName,
      mobile: formData.mobileNumber,
      email: formData.email,
      amount: formData.feeAmount,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      paymentMode: formData.paymentMode,
      transactionId: formData.transactionId || "",
      leadId: formData.leadId || `LD-${Date.now()}`,
    };

    setGeneratedFees([newFee, ...generatedFees]);
    setSelectedFee(newFee);
    setShowReceipt(true);

    // Reset form
    setFormData({
      leadId: "",
      applicantName: "",
      mobileNumber: "",
      email: "",
      loanAmount: "",
      feeAmount: "",
      paymentMode: "online",
      transactionId: "",
    });
  };

  const ReceiptModal = () => {
    if (!showReceipt || !selectedFee) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">
              Application Fee Receipt
            </h3>
            <button
              onClick={() => setShowReceipt(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Icons.X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {/* Receipt Header */}
            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-blue-100 rounded-full mb-3">
                <Icons.Receipt className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Payment Receipt
              </h2>
              <p className="text-gray-500">Loan Application Fee</p>
            </div>

            {/* Receipt Details */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Application Number</p>
                    <p className="font-semibold text-gray-900 mt-1">
                      {selectedFee.uniqueNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-semibold text-gray-900 mt-1">
                      {selectedFee.date}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Applicant Name</p>
                    <p className="font-semibold text-gray-900 mt-1">
                      {selectedFee.applicantName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Mobile Number</p>
                    <p className="font-semibold text-gray-900 mt-1">
                      {selectedFee.mobile}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email ID</p>
                    <p className="font-semibold text-gray-900 mt-1">
                      {selectedFee.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Payment Mode</p>
                    <p className="font-semibold text-gray-900 mt-1 capitalize">
                      {selectedFee.paymentMode}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-b border-gray-200 py-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Applicationlogin Fee</span>
                  <span className="text-xl font-bold text-gray-900">
                    ₹{selectedFee.amount}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Icons.Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-900 font-medium">
                      Next Steps
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Please use this Application Number to upload your
                      documents. You will receive a confirmation email shortly.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
              >
                <Icons.Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Formatter and computed amounts for the Fee Information panel
  const formatINR = (amount) => {
    const num = Number(amount) || 0;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(num);
  };

  const feeAmountNum = Number(formData.feeAmount) || 0;
  const gstAmount = Math.round(feeAmountNum * 0.18 * 100) / 100;
  const totalAmount = Math.round((feeAmountNum + gstAmount) * 100) / 100;

  // Populate form fields by searching local leads first, then calling API
  const fetchAndFillLead = async (leadId) => {
    if (!leadId) return;
    // Try local cache first
    const foundLocal = (leads?.data || []).find(
      (l) => l.id === leadId || l.leadId === leadId || l.uniqueId === leadId,
    );
    if (foundLocal) {
      setFormData((prev) => ({
        ...prev,
        leadId: foundLocal.LeadNumber || leadNumber,
        applicantName:
          foundLocal.fullName || foundLocal.name || foundLocal.applicantName || prev.applicantName || "",
        mobileNumber: foundLocal.contactNumber || foundLocal.mobile || foundLocal.mobileNumber || prev.mobileNumber || "",
        email: foundLocal.email || prev.email || "",
        loanAmount: foundLocal.loanAmount || prev.loanAmount || "",
      }));
      toast.success("Lead loaded from cache");
      return;
    }

    // Fallback: call API to fetch lead by id or lead number
    try {
      const data = await getLeadByIdOrNumber(leadId);
      if (!data) {
        toast.error("Lead not found");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        leadId: data.leadNumber || leadNumber,
        applicantName: data.fullName || data.name || data.applicantName || prev.applicantName || "",
        mobileNumber: data.contactNumber || data.mobile || data.phone || prev.mobileNumber || "",
        email: data.email || prev.email || "",
        loanAmount: data.loanAmount || prev.loanAmount || "",
      }));
      toast.success("Lead loaded");
    } catch (err) {
      toast.error(err?.message || "Failed to fetch lead");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Login Fee Management
            </h1>
            <p className="text-gray-600">
              Manage and view all login fee details
            </p>
          </div>

          {/* Add New Lead Button */}
          <Button
            // onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Icons.Plus size={18} />
            <span>New Lead</span>
          </Button>
        </div>

        {/* Top Stats & Search */}

        <div className="flex flex-col gap-6">
          {/* Status Cards - responsive wrap */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6">
              <StatusCard
                title="Total Leads"
                value={_totalItems}
                icon={Icons.User}
                colorClass="text-white"
                bgClass="bg-gradient-to-r from-blue-500 to-blue-600"
                percent={_totalItems ? 100 : 0}
              />
            </div>

            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6">
              <StatusCard
                title="Interested"
                value={statusCounts.INTERESTED || 0}
                icon={Icons.CalendarDays}
                colorClass="text-cyan-600"
                bgClass="bg-cyan-50"
                percent={
                  _totalItems
                    ? Math.round(
                        ((statusCounts.INTERESTED || 0) / _totalItems) * 100,
                      )
                    : 0
                }
              />
            </div>

            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6">
              <StatusCard
                title="Approved"
                value={statusCounts.APPROVED || 0}
                icon={Icons.User}
                colorClass="text-green-600"
                bgClass="bg-green-50"
                percent={
                  _totalItems
                    ? Math.round(
                        ((statusCounts.APPROVED || 0) / _totalItems) * 100,
                      )
                    : 0
                }
              />
            </div>

            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6">
              <StatusCard
                title="Rejected"
                value={statusCounts.REJECTED || 0}
                icon={Icons.XCircle}
                colorClass="text-red-600"
                bgClass="bg-red-50"
                percent={
                  _totalItems
                    ? Math.round(
                        ((statusCounts.REJECTED || 0) / _totalItems) * 100,
                      )
                    : 0
                }
              />
            </div>

            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6">
              <StatusCard
                title="Pending"
                value={statusCounts.PENDING || 0}
                icon={Icons.Hourglass}
                colorClass="text-yellow-700"
                bgClass="bg-yellow-50"
                percent={
                  _totalItems
                    ? Math.round(
                        ((statusCounts.PENDING || 0) / _totalItems) * 100,
                      )
                    : 0
                }
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {[  
            {
              id: "charge-fee",
              label: "Charge Login Fee",
              icon: "CreditCard",
            },
          ].map((tab) => {
            const IconComp = Icons[tab.icon];
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium transition-all relative ${
                  activeTab === tab.id
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <IconComp className="w-4 h-4 inline mr-2" />
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Track Fees Tab: show leads table instead of the static fee records */}
        {activeTab === "track-leads" && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <LeadsTable
              items={leads?.data || []}
              loading={loading}
              getActions={() => []}
              currentPage={currentPage}
              totalPages={_totalPages}
              onPageChange={setCurrentPage}
              search={searchTerm}
              setSearch={(value) => {
                const v = typeof value === "string" ? value : value?.target?.value ?? "";
                setSearchTerm(v);
                setCurrentPage(1);
              }}
              filterValue={statusFilter}
              setFilterValue={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
              filterOptions={[]}
              dateRange={dateRange}
              setDateRange={(v) => {
                setDateRange(v);
                setCurrentPage(1);
              }}
            />
          </div>
        )}

        {/* Charge Fee Tab */}
        {activeTab === "charge-fee" && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Icons.FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Lead Application Details
                  </h2>
                  <p className="text-xs text-gray-500">
                    Enter lead information to generate application fee
                  </p>
                </div>
              </div>

              <form onSubmit={handleChargeFee} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lead ID <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="leadId"
                        value={formData.leadId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [e.target.name]: e.target.value,
                          })
                        }
                        onBlur={(e) => fetchAndFillLead(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.currentTarget.blur();
                            fetchAndFillLead(e.currentTarget.value);
                          }
                        }}
                        placeholder="Enter Lead ID"
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => fetchAndFillLead(formData.leadId)}
                        className="inline-flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
                        aria-label="Fetch lead"
                      >
                        <Icons.Search className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Applicant Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="applicantName"
                      value={formData.applicantName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [e.target.name]: e.target.value,
                        })
                      }
                      placeholder="Full Name"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [e.target.name]: e.target.value,
                        })
                      }
                      placeholder="10-digit mobile number"
                      pattern="[0-9]{10}"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [e.target.name]: e.target.value,
                        })
                      }
                      placeholder="email@example.com"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loan Amount
                    </label>
                    <input
                      type="number"
                      name="loanAmount"
                      value={formData.loanAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [e.target.name]: e.target.value,
                        })
                      }
                      placeholder="Enter loan amount"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Login Fee (₹)
                    </label>
                    <input
                      type="number"
                      name="feeAmount"
                      value={formData.feeAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [e.target.name]: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Mode <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="paymentMode"
                      value={formData.paymentMode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [e.target.name]: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      required
                    >
                      <option value="online">Online Payment</option>
                      <option value="offline">Offline / Cash</option>
                      <option value="bank_transfer">Bank Transfer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transaction ID
                    </label>
                    <input
                      type="text"
                      name="transactionId"
                      value={formData.transactionId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [e.target.name]: e.target.value,
                        })
                      }
                      placeholder="Enter transaction reference"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all font-semibold flex items-center justify-center gap-2"
                >
                  <Icons.CreditCard className="w-5 h-5" />
                  Charge Fee & Generate Application Number
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Icons.Info className="w-6 h-6 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Fee Information</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Application Fee</span>
                  <span className="font-bold text-gray-900">
                    {formatINR(feeAmountNum)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">GST (18%)</span>
                  <span className="font-bold text-gray-900">
                    {formatINR(gstAmount)}
                  </span>
                </div>
                <div className="border-t border-blue-200 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">
                      Total Amount
                    </span>
                    <span className="font-bold text-xl text-blue-600">
                      {formatINR(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Important Notes
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <Icons.CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Application fee is non-refundable</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icons.CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Unique number generated after fee payment</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icons.CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Use unique number for document upload</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icons.AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
                  <span>Valid for 30 days from generation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
 