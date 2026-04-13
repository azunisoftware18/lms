import React, { useState } from "react";
// Lead status options for filter dropdown
const leadStatusOptions = [
  { label: "Contacted", value: "CONTACTED" },
  { label: "Interested", value: "INTERESTED" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Pending", value: "PENDING" },
];
import EditLeadDialog from "../reports/EditLeadDialog";
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
// SearchField removed from this view - only status cards shown
import LeadsTable from "../../../components/tables/LeadsTable";
import LeadFormModal from "../../../components/modals/LeadFormModal";
import Button from "../../../components/ui/Button";
import StatusCard from "../../../components/common/StatusCard";
import { LEAD_ACTION_DEFINITIONS } from "../../../lib/LOSDummyData";
// import { colorVariables } from "../../../lib";
import {
  useLead,
  useUpdateLeadStatus,
  useGetLead,
} from "../../../hooks/useLead";
import toast from "react-hot-toast";

export default function LeadsPage() {
  const updateLeadStatus = useUpdateLeadStatus();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [activeTab, setActiveTab] = useState("track-leads");

  // Charge fee form state (same as LoginFee)
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

  const [_generatedFees, setGeneratedFees] = useState([]);
  const [selectedFee, setSelectedFee] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  // hook to fetch single lead by id/number on demand
  const leadQueryHook = useGetLead(formData.leadId, { enabled: false });

  const fetchAndFillLead = async (idOrNumber) => {
    if (!idOrNumber) return;
    try {
      const res = await leadQueryHook.refetch();
      const data = res?.data ?? null;
      if (!data) {
        toast.error("Lead not found");
        return;
      }
      // map lead fields into formData
      const name = data.fullName || data.name || data.applicantName || "";
      const mobile = data.contactNumber || data.mobile || data.phone || "";
      const email = data.email || "";
      const loanAmount = data.loanAmount ?? formData.loanAmount;
      setFormData((f) => ({
        ...f,
        applicantName: name,
        mobileNumber: String(mobile || ""),
        email: email || "",
        loanAmount,
      }));
      toast.success("Lead details loaded");
    } catch (err) {
      toast.error(err?.message || "Failed to load lead");
    }
  };

  // Status filter state
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState("ALL");

  // const getLeads = getLeads();

  const itemsPerPage = 10;

  // Use React Query hook
  const {
    leads = [],
    loading,
    refetch,
  } = useLead({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    status: statusFilter,
  });

  const totalItems = leads?.total || 0;
  const totalPages = leads?.totalPages || 1;

  // compute status counts for StatusCard display
  const statusCounts = (leads?.data || []).reduce((acc, item) => {
    const s = item?.status || "UNKNOWN";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const getActions = (item) => {
    const iconMap = {
      Edit: <Edit size={16} />,
      Trash2: <Trash2 size={16} />,
    };

    const defaultDefs = [
      { key: "edit", label: "Edit", icon: "Edit" },
      { key: "delete", label: "Delete", icon: "Trash2" },
    ];

    const defs =
      typeof LEAD_ACTION_DEFINITIONS !== "undefined" &&
      Array.isArray(LEAD_ACTION_DEFINITIONS)
        ? LEAD_ACTION_DEFINITIONS
        : defaultDefs;

    return defs.map((action) => ({
      ...action,
      icon: iconMap[action.icon] || iconMap.Edit,
      onClick: () => {
        if (action.key === "edit") {
          setSelectedLead(item);
          setEditDialogOpen(true);
        }
        if (action.key === "delete") {
          console.log("Delete clicked", item.id);
        }
      },
    }));
  };

  // Fee calculations (live based on entered fee or selectedFee)
  const feeAmountNum =
    Number(formData.feeAmount) ||
    (selectedFee?.amount ? Number(selectedFee.amount) : 0);
  const gstAmount = Math.round(feeAmountNum * 0.18);
  const totalAmount = feeAmountNum + gstAmount;
  const formatINR = (n) => (typeof n === "number" ? `₹${n}` : "₹0");

  const handleChargeFee = (e) => {
    e.preventDefault();
    const amount = Number(formData.feeAmount) || 0;
    const uniqueNumber = `TXN-${Date.now()}`;
    const newFee = {
      id: `LF${Date.now()}`,
      uniqueNumber,
      applicantName: formData.applicantName,
      mobile: formData.mobileNumber,
      email: formData.email,
      amount,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      paymentMode: formData.paymentMode,
      transactionId: formData.transactionId || "",
      leadId: formData.leadId || `LD-${Date.now()}`,
    };
    setGeneratedFees((s) => [newFee, ...s]);
    setSelectedFee(newFee);
    setShowReceipt(true);
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
    toast.success("Application fee recorded");
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
            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-blue-100 rounded-full mb-3">
                <Icons.Receipt className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Payment Receipt
              </h2>
              <p className="text-gray-500">Loan Application Fee</p>
            </div>

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
                  <span className="text-gray-600">Application Fee</span>
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

  return (
    <div className="p-6 bg-linear-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Lead Form Modal */}
      <LeadFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          refetch(); // Refresh data after closing
        }}
      />

      {/* Edit Lead Dialog */}
      <EditLeadDialog
        open={editDialogOpen}
        lead={selectedLead}
        onClose={() => setEditDialogOpen(false)}
        onSave={({ id, status }) => {
          updateLeadStatus.mutate(
            { id, status },
            {
              onSuccess: () => {
                setEditDialogOpen(false);
                setSelectedLead(null);
                refetch();
              },
              onError: (error) => {
                // Consider using a toast notification or error state
                toast.error(
                  error?.response?.data?.message ||
                    "Failed to update lead status",
                );
                // TODO: Show user-friendly error message
              },
            },
          );
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              User Lead Management
            </h1>
            <p className="text-gray-600">
              Manage and view all loan application details
            </p>
          </div>

          {/* Add New Lead Button */}
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
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
                value={totalItems}
                icon={User}
                colorClass="text-white"
                bgClass="bg-gradient-to-r from-blue-500 to-blue-600"
                percent={totalItems ? 100 : 0}
              />
            </div>

            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6">
              <StatusCard
                title="Interested"
                value={statusCounts.INTERESTED || 0}
                icon={CalendarDays}
                colorClass="text-cyan-600"
                bgClass="bg-cyan-50"
                percent={
                  totalItems
                    ? Math.round(
                        ((statusCounts.INTERESTED || 0) / totalItems) * 100,
                      )
                    : 0
                }
              />
            </div>

            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6">
              <StatusCard
                title="Approved"
                value={statusCounts.APPROVED || 0}
                icon={User}
                colorClass="text-green-600"
                bgClass="bg-green-50"
                percent={
                  totalItems
                    ? Math.round(
                        ((statusCounts.APPROVED || 0) / totalItems) * 100,
                      )
                    : 0
                }
              />
            </div>

            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6">
              <StatusCard
                title="Rejected"
                value={statusCounts.REJECTED || 0}
                icon={XCircle}
                colorClass="text-red-600"
                bgClass="bg-red-50"
                percent={
                  totalItems
                    ? Math.round(
                        ((statusCounts.REJECTED || 0) / totalItems) * 100,
                      )
                    : 0
                }
              />
            </div>

            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6">
              <StatusCard
                title="Pending"
                value={statusCounts.PENDING || 0}
                icon={Hourglass}
                colorClass="text-yellow-700"
                bgClass="bg-yellow-50"
                percent={
                  totalItems
                    ? Math.round(
                        ((statusCounts.PENDING || 0) / totalItems) * 100,
                      )
                    : 0
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {[
          { id: "track-leads", label: "Track Leads", icon: "List" },
          {
            id: "charge-fee",
            label: "Charge Application Fee",
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

      {/* Track Leads Tab */}
      {activeTab === "track-leads" && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <LeadsTable
            items={leads?.data || []}
            loading={loading}
            getActions={getActions}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            search={searchTerm}
            setSearch={(value) => {
              setSearchTerm(value);
              setCurrentPage(1);
            }}
            filterValue={statusFilter}
            setFilterValue={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}
            filterOptions={leadStatusOptions}
            dateRange={dateRange}
            setDateRange={(v) => {
              setDateRange(v);
              setCurrentPage(1);
            }}
          />
        </div>
      )}

      {/* Charge Fee Tab */}
      {/* {activeTab === "charge-fee" && (
       
      )} */}
    </div>
  );
}
