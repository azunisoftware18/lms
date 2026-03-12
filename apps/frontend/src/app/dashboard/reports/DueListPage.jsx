import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  Filter,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  MessageSquare,
  Users,
  Building,
  Briefcase,
  UserCheck,
  FileText,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  PieChart,
  BarChart3,
  MoreVertical,
  RefreshCw,
  Printer,
  Eye,
  Edit,
  Trash2,
  Send,
  Bell,
  Shield,
  Target,
  DollarSign,
  Percent,
  Hash,
  PhoneCall,
  UserPlus,
  Check,
  X,
  CalendarDays,
  ClipboardCheck,
  FileCheck,
  SendToBack,
  FileEdit,
  Copy,
  Share2,
  ExternalLink,
  UserMinus,
  ShieldAlert,
  History,
} from "lucide-react";
import {
  DUE_LIST_COLLECTION_EXECUTIVES,
  DUE_LIST_DEFAULT_FILTERS,
  DUE_LIST_FILTER_OPTIONS,
  DUE_LIST_INITIAL_DATA,
  DUE_LIST_ITEMS_PER_PAGE,
  DUE_LIST_SUMMARY_CARD_CONFIG,
} from "../../../lib/ReportsDummyData";
import { colorVariables } from "../../../lib";
import SharedActionMenu from "../../../components/common/ActionMenu";
import Pagination from "../../../components/common/Pagination";
import StatusCard from "../../../components/common/StatusCard";
import Button from "../../../components/ui/Button";
import SearchField from "../../../components/ui/SearchField";
import SelectField from "../../../components/ui/SelectField";
import ToggleSwitch from "../../../components/ui/ToggleSwitch";

const DUE_LIST_SUMMARY_ICON_MAP = {
  DollarSign,
  Users,
  AlertTriangle,
  ClipboardCheck,
};

const buildSelectOptions = (items) =>
  items.map((item) => ({ label: item, value: item }));

const SORT_OPTIONS = [
  { label: "Overdue Days", value: "overdueDays" },
  { label: "Total Due", value: "totalDue" },
  { label: "Due Date", value: "dueDate" },
  { label: "Customer Name", value: "customerName" },
];

// --- UTILITY FUNCTIONS ---
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getRiskColor = (overdueDays) => {
  if (overdueDays <= 7) return "bg-green-50 text-green-700 border-green-200";
  if (overdueDays <= 30)
    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  if (overdueDays <= 90)
    return "bg-orange-50 text-orange-700 border-orange-200";
  return "bg-red-50 text-red-700 border-red-200";
};

// --- STATUS BADGE COMPONENT ---
const StatusBadge = ({ status }) => {
  const config = {
    Due: {
      color: "bg-blue-50 text-blue-700 border-blue-200",
      icon: <Clock className="w-3 h-3 mr-1" />,
    },
    Overdue: {
      color: "bg-red-50 text-red-700 border-red-200",
      icon: <AlertTriangle className="w-3 h-3 mr-1" />,
    },
    Critical: {
      color: "bg-purple-50 text-purple-700 border-purple-200",
      icon: <AlertTriangle className="w-3 h-3 mr-1" />,
    },
    Paid: {
      color: "bg-green-50 text-green-700 border-green-200",
      icon: <CheckCircle className="w-3 h-3 mr-1" />,
    },
    Settled: {
      color: "bg-gray-50 text-gray-700 border-gray-200",
      icon: <CheckCircle className="w-3 h-3 mr-1" />,
    },
    Assigned: {
      color: "bg-indigo-50 text-indigo-700 border-indigo-200",
      icon: <UserCheck className="w-3 h-3 mr-1" />,
    },
  };

  const { color, icon } = config[status] || config["Due"];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${color}`}
    >
      {icon} {status}
    </span>
  );
};

// --- TASK ASSIGNMENT MODAL ---
const TaskAssignmentModal = ({ isOpen, onClose, customer, onAssign }) => {
  const [selectedExecutive, setSelectedExecutive] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [followUpDate, setFollowUpDate] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!selectedExecutive) {
      alert("Please select an executive");
      return;
    }

    const task = {
      id: Date.now(),
      customerId: customer.id,
      customerName: customer.customerName,
      loanNumber: customer.loanNumber,
      amount: customer.totalDue,
      assignedTo: selectedExecutive,
      priority: priority,
      followUpDate: followUpDate || new Date().toISOString().split("T")[0],
      notes: notes,
      assignedDate: new Date().toISOString(),
      status: "Pending",
    };

    onAssign(task);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <UserPlus
                  className={`w-5 h-5 ${colorVariables.PRIMARY_COLOR}`}
                />
                Assign Collection Task
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Assign recovery task to collection executive
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium text-gray-800">
                  {customer.customerName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Loan Number</p>
                <p className={`font-medium ${colorVariables.PRIMARY_COLOR}`}>
                  {customer.loanNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount Due</p>
                <p className="font-bold text-gray-800">
                  {formatCurrency(customer.totalDue)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Overdue Days</p>
                <p
                  className={`font-medium ${customer.overdueDays > 30 ? "text-red-600" : "text-orange-600"}`}
                >
                  {customer.overdueDays} days
                </p>
              </div>
            </div>
          </div>

          {/* Assignment Form */}
          <div className="space-y-4">
            {/* Executive Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Collection Executive *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {DUE_LIST_COLLECTION_EXECUTIVES.map((exec) => (
                  <div
                    key={exec.id}
                    onClick={() => setSelectedExecutive(exec.name)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${selectedExecutive === exec.name ? `${colorVariables.BORDER_COLOR} ${colorVariables.LIGHT_BG}` : "border-gray-300 hover:border-blue-300"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{exec.name}</p>
                        <p className="text-sm text-gray-500">{exec.phone}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {exec.currentLoad} tasks
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <SelectField
                  value={priority}
                  onChange={setPriority}
                  options={buildSelectOptions([
                    "Low",
                    "Medium",
                    "High",
                    "Critical",
                  ])}
                  placeholder="Select priority"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Follow-up Date
                </label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add instructions, remarks, or special notes for the executive..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <Button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-lg"
            >
              <Check className="w-4 h-4" />
              Assign Task
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SUMMARY CARDS ---
const SummaryCards = ({ summaryData }) => {
  const cards = DUE_LIST_SUMMARY_CARD_CONFIG.map((card) => {
    const Icon = DUE_LIST_SUMMARY_ICON_MAP[card.iconName] || DollarSign;

    let value = summaryData.assignedTasks;

    if (card.title === "Total Due Amount")
      value = formatCurrency(summaryData.totalDueAmount);
    if (card.title === "Total Accounts")
      value = summaryData.totalAccounts.toLocaleString();
    if (card.title === "Critical Overdue") value = summaryData.criticalOverdue;

    return {
      ...card,
      value,
      icon: Icon,
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card, index) => (
        <StatusCard
          key={index}
          title={card.title}
          value={card.value}
          icon={card.icon}
          variant={
            card.iconName === "Users"
              ? "green"
              : card.iconName === "AlertTriangle"
                ? "red"
                : card.iconName === "ClipboardCheck"
                  ? "purple"
                  : "blue"
          }
          trend={{
            value: Number.parseFloat(card.change.replace(/[^0-9.]/g, "")) || 0,
            isPositive: card.trend === "up",
          }}
          subtext={card.change}
        />
      ))}
    </div>
  );
};

// --- FILTER PANEL ---
const FilterPanel = ({ filters, setFilters, onSearch }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const activeFilterCount = Object.values(filters).filter(
    (value) =>
      value !== "All" &&
      value !== "All Types" &&
      value !== "All Branches" &&
      value !== "All Products" &&
      value !== "All Slabs" &&
      value !== "All Executives" &&
      value !== "All Sources" &&
      value !== false &&
      value !== "",
  ).length;

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className={`w-5 h-5 ${colorVariables.PRIMARY_COLOR}`} />
          <h3 className="font-semibold text-gray-800">Filters</h3>
          <span
            className={`text-xs ${colorVariables.LIGHT_BG} ${colorVariables.PRIMARY_COLOR} px-2 py-1 rounded-full`}
          >
            {activeFilterCount} active
          </span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <SelectField
                value={filters.type}
                onChange={(value) => handleFilterChange("type", value)}
                options={buildSelectOptions(DUE_LIST_FILTER_OPTIONS.loanTypes)}
                placeholder="Select type"
              />
            </div>

            {/* Branch Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branch
              </label>
              <SelectField
                value={filters.branch}
                onChange={(value) => handleFilterChange("branch", value)}
                options={buildSelectOptions(DUE_LIST_FILTER_OPTIONS.branches)}
                placeholder="Select branch"
              />
            </div>

            {/* Product Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product
              </label>
              <SelectField
                value={filters.product}
                onChange={(value) => handleFilterChange("product", value)}
                options={buildSelectOptions(DUE_LIST_FILTER_OPTIONS.products)}
                placeholder="Select product"
              />
            </div>

            {/* Bucket Slab Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bucket Slab
              </label>
              <SelectField
                value={filters.bucketSlab}
                onChange={(value) => handleFilterChange("bucketSlab", value)}
                options={buildSelectOptions(DUE_LIST_FILTER_OPTIONS.bucketSlabs)}
                placeholder="Select bucket slab"
              />
            </div>

            {/* Collection Executive Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Collection Executive
              </label>
              <SelectField
                value={filters.executive}
                onChange={(value) => handleFilterChange("executive", value)}
                options={buildSelectOptions(DUE_LIST_FILTER_OPTIONS.executives)}
                placeholder="Select executive"
                isSearchable
              />
            </div>

            {/* Source Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source Type
              </label>
              <SelectField
                value={filters.source}
                onChange={(value) => handleFilterChange("source", value)}
                options={buildSelectOptions(DUE_LIST_FILTER_OPTIONS.sources)}
                placeholder="Select source"
              />
            </div>

            {/* Assignment Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignment Status
              </label>
              <SelectField
                value={filters.assignmentStatus}
                onChange={(value) =>
                  handleFilterChange("assignmentStatus", value)
                }
                options={buildSelectOptions(
                  DUE_LIST_FILTER_OPTIONS.assignmentStatus,
                )}
                placeholder="Select status"
              />
            </div>

            {/* Due Up To Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Up To
              </label>
              <input
                type="date"
                value={filters.dueUpTo}
                onChange={(e) => handleFilterChange("dueUpTo", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* With LPI Filter */}
            <div className="flex items-center">
              <ToggleSwitch
                checked={filters.withLPI}
                onChange={(value) => handleFilterChange("withLPI", value)}
                label="With LPI Only"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
            <Button
              onClick={onSearch}
              className="px-6 py-2.5 rounded-lg shadow-sm hover:shadow-md"
            >
              <Search className="w-4 h-4" />
              Search
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- QUICK ACTIONS SIDEBAR ---
const QuickActionsSidebar = ({ recentTasks, onViewAllTasks }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
        <ClipboardCheck className={`w-5 h-5 ${colorVariables.PRIMARY_COLOR}`} />
        Recent Task Assignments
      </h3>
      <div className="space-y-3">
        {recentTasks.slice(0, 5).map((task) => (
          <div
            key={task.id}
            className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium text-gray-800">{task.customerName}</p>
                <p className="text-xs text-gray-500">{task.loanNumber}</p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  task.priority === "Critical"
                    ? "bg-red-50 text-red-600"
                    : task.priority === "High"
                      ? "bg-orange-50 text-orange-600"
                      : `${colorVariables.LIGHT_BG} ${colorVariables.PRIMARY_COLOR}`
                }`}
              >
                {task.priority}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">{task.assignedTo}</span>
              <span className="text-gray-500">
                {formatDate(task.assignedDate)}
              </span>
            </div>
          </div>
        ))}
        {recentTasks.length === 0 && (
          <div className="text-center py-4 text-gray-400">
            <ClipboardCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No recent task assignments</p>
          </div>
        )}
        <Button
          onClick={onViewAllTasks}
          className="w-full mt-4 px-4 py-2 text-sm rounded-lg"
        >
          <Eye className="w-4 h-4" />
          View All Tasks
        </Button>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function DueListPage() {
  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(DUE_LIST_ITEMS_PER_PAGE);
  const [sortConfig, setSortConfig] = useState({
    key: "overdueDays",
    direction: "desc",
  });
  const [filters, setFilters] = useState(DUE_LIST_DEFAULT_FILTERS);
  const [filteredData, setFilteredData] = useState(DUE_LIST_INITIAL_DATA);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // --- CALCULATE SUMMARY DATA ---
  const summaryData = useMemo(() => {
    return {
      totalDueAmount: filteredData.reduce(
        (sum, item) => sum + item.totalDue,
        0,
      ),
      totalAccounts: filteredData.length,
      criticalOverdue: filteredData.filter((item) => item.status === "Critical")
        .length,
      assignedTasks: filteredData.filter(
        (item) => item.assignmentStatus === "Assigned",
      ).length,
    };
  }, [filteredData]);

  // --- HANDLE TASK ASSIGNMENT ---
  const handleAssignTask = (customer) => {
    setSelectedCustomer(customer);
    setShowAssignmentModal(true);
  };

  const handleTaskAssignment = (task) => {
    // Update the customer record with assignment
    const updatedData = filteredData.map((item) => {
      if (item.id === selectedCustomer.id) {
        return {
          ...item,
          collectionExecutive: task.assignedTo,
          assignmentStatus: "Assigned",
          status: "Assigned",
        };
      }
      return item;
    });

    setFilteredData(updatedData);
    setAssignedTasks((prev) => [task, ...prev]);
    setShowNotification(true);

    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // --- ACTION HANDLERS ---
  const handleViewDetails = (item) => {
    console.log("View details for:", item);
    alert(`Viewing details for ${item.customerName}`);
  };

  const handleCallCustomer = (item) => {
    console.log("Calling:", item.contact);
    alert(`Calling ${item.customerName} at ${item.contact}`);
  };

  const handleReassignTask = (item) => {
    setSelectedCustomer(item);
    setShowAssignmentModal(true);
  };

  const getActions = (item) => {
    const actions = [
      {
        label: "View Details",
        icon: <Eye />,
        onClick: () => handleViewDetails(item),
      },
      {
        label: "Call Customer",
        icon: <Phone />,
        onClick: () => handleCallCustomer(item),
      },
      {
        label: "Send SMS",
        icon: <MessageSquare />,
        onClick: () => alert(`Sending SMS to ${item.customerName}`),
      },
      {
        label: "Send Email",
        icon: <Mail />,
        onClick: () => alert(`Sending email to ${item.customerName}`),
      },
      { divider: true },
      !item.collectionExecutive
        ? {
            label: "Assign to Executive",
            icon: <UserPlus />,
            onClick: () => handleAssignTask(item),
          }
        : {
            label: "Reassign Task",
            icon: <UserMinus />,
            onClick: () => handleReassignTask(item),
          },
      item.collectionExecutive
        ? {
            label: "Escalate Case",
            icon: <ShieldAlert />,
            onClick: () => alert(`Escalating ${item.customerName}`),
            isDanger: true,
          }
        : null,
      { divider: true },
      {
        label: "Generate Notice",
        icon: <FileText />,
        onClick: () => alert(`Generating notice for ${item.customerName}`),
      },
      {
        label: "Update Payment",
        icon: <FileEdit />,
        onClick: () => alert(`Updating payment for ${item.customerName}`),
      },
      {
        label: "Print Statement",
        icon: <Printer />,
        onClick: () => alert(`Printing statement for ${item.customerName}`),
      },
      { divider: true },
      {
        label: "View History",
        icon: <History />,
        onClick: () => alert(`Viewing history for ${item.customerName}`),
      },
      {
        label: "Duplicate Record",
        icon: <Copy />,
        onClick: () => alert(`Duplicating record for ${item.customerName}`),
      },
      { divider: true },
      {
        label: "Delete Record",
        icon: <Trash2 />,
        onClick: () => alert(`Deleting record for ${item.customerName}`),
        isDanger: true,
      },
    ];

    return actions.filter(Boolean);
  };

  // --- SORTING FUNCTION ---
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // --- FILTER AND SORT DATA ---
  const processedData = useMemo(() => {
    let data = [...filteredData];

    // Apply sorting
    if (sortConfig.key) {
      data.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    // Apply pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return data.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredData, sortConfig, currentPage, itemsPerPage]);

  // --- HANDLE SEARCH ---
  const handleSearch = () => {
    let filtered = DUE_LIST_INITIAL_DATA;

    // Apply filters
    if (filters.type !== "All Types") {
      filtered = filtered.filter((item) => item.type === filters.type);
    }
    if (filters.branch !== "All Branches") {
      filtered = filtered.filter((item) => item.branch === filters.branch);
    }
    if (filters.product !== "All Products") {
      filtered = filtered.filter((item) => item.product === filters.product);
    }
    if (filters.bucketSlab !== "All Slabs") {
      filtered = filtered.filter(
        (item) => item.bucketSlab === filters.bucketSlab,
      );
    }
    if (filters.executive !== "All Executives") {
      filtered = filtered.filter(
        (item) => item.collectionExecutive === filters.executive,
      );
    }
    if (filters.source !== "All Sources") {
      filtered = filtered.filter((item) => item.source === filters.source);
    }
    if (filters.assignmentStatus !== "All") {
      filtered = filtered.filter(
        (item) => item.assignmentStatus === filters.assignmentStatus,
      );
    }
    if (filters.dueUpTo) {
      filtered = filtered.filter(
        (item) => new Date(item.dueDate) <= new Date(filters.dueUpTo),
      );
    }
    if (filters.withLPI) {
      filtered = filtered.filter((item) => item.lpiAmount > 0);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.customerName.toLowerCase().includes(term) ||
          item.loanNumber.toLowerCase().includes(term) ||
          item.contact.includes(term),
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  // --- EXPORT FUNCTIONS ---
  const exportToExcel = () => {
    const headers = [
      "Customer Name",
      "Loan Number",
      "EMI Amount",
      "Due Date",
      "Overdue Days",
      "LPI Amount",
      "Total Due",
      "Branch",
      "Product",
      "Collection Executive",
      "Contact",
      "Status",
      "Assignment Status",
    ];

    const rows = filteredData.map((item) => [
      item.customerName,
      item.loanNumber,
      item.emiAmount,
      item.dueDate,
      item.overdueDays,
      item.lpiAmount,
      item.totalDue,
      item.branch,
      item.product,
      item.collectionExecutive,
      item.contact,
      item.status,
      item.assignmentStatus,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `due_list_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- RESET FILTERS ---
  const resetFilters = () => {
    setFilters(DUE_LIST_DEFAULT_FILTERS);
    setSearchTerm("");
    setFilteredData(DUE_LIST_INITIAL_DATA);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-slide-in">
          <CheckCircle className="w-5 h-5" />
          Task assigned successfully to {selectedCustomer?.collectionExecutive}
        </div>
      )}

      {/* Task Assignment Modal */}
      <TaskAssignmentModal
        isOpen={showAssignmentModal}
        onClose={() => setShowAssignmentModal(false)}
        customer={selectedCustomer}
        onAssign={handleTaskAssignment}
      />

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
              <div className="p-2 bg-linear-to-br from-red-600 to-red-700 rounded-xl">
                <AlertTriangle className="text-white" size={28} />
              </div>
              <span>Due List Management</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Track overdue loans, assign tasks, and manage collections
            </p>
          </div>

          <div className="flex gap-3 mt-4 md:mt-0">
            <Button
              onClick={resetFilters}
              className="px-4 py-2 rounded-lg"
            >
              <RefreshCw size={18} />
              Reset
            </Button>
            <Button
              onClick={exportToExcel}
              className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700"
            >
              <Download size={18} />
              Export Excel
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <SummaryCards summaryData={summaryData} />
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Content - Table */}
        <div className="lg:w-2/3">
          {/* Search and Filters */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <SearchField
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClear={() => setSearchTerm("")}
                onSearch={handleSearch}
                placeholder="Search by customer name, loan number, or contact..."
                showResults={false}
                showButton
                buttonText="Search"
                containerClassName="flex-1"
                className="py-3"
              />
            </div>

            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              onSearch={handleSearch}
            />
          </div>

          {/* Main Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Due List Records
                  </h2>
                  <p className="text-sm text-gray-500">
                    Showing {processedData.length} of {filteredData.length}{" "}
                    records
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-2 md:mt-0">
                  <span className="text-sm text-gray-600">Sorted by: </span>
                  <SelectField
                    value={sortConfig.key}
                    onChange={requestSort}
                    options={SORT_OPTIONS}
                    className="w-48"
                  />
                  <span className="text-sm text-gray-600 ml-2">
                    {sortConfig.direction === "asc"
                      ? "↑ Ascending"
                      : "↓ Descending"}
                  </span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Customer Name
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Loan Number
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Total Due
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Overdue Days
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Executive
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {processedData.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">
                          {item.customerName}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <Phone size={12} />
                          {item.contact}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-mono text-sm ${colorVariables.PRIMARY_COLOR}`}
                        >
                          {item.loanNumber}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {item.product}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-900">
                          {formatCurrency(item.totalDue)}
                        </div>
                        <div className="text-xs text-red-500">
                          +{formatCurrency(item.lpiAmount)} LPI
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(item.overdueDays)}`}
                        >
                          {item.overdueDays} days
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {item.collectionExecutive ? (
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${colorVariables.LIGHT_BG.replace("50", "100")} ${colorVariables.PRIMARY_COLOR}`}
                            >
                              {item.collectionExecutive.charAt(0)}
                            </div>
                            <span className="text-sm">
                              {item.collectionExecutive}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 italic">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="py-3 px-4">
                        <SharedActionMenu actions={getActions(item)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex flex-col md:flex-row md:items-center justify-between">
              <div className="text-sm text-gray-500 mb-2 md:mb-0">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
                {filteredData.length} entries
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                containerClassName="py-0"
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar - Quick Actions */}
        <div className="lg:w-1/3 space-y-6">
          <QuickActionsSidebar
            recentTasks={assignedTasks}
            onViewAllTasks={() => {
              console.log("View all tasks clicked");
            }}
          />

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart3
                className={`w-5 h-5 ${colorVariables.PRIMARY_COLOR}`}
              />
              Assignment Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Unassigned Cases</span>
                <span className="font-bold text-red-600">
                  {
                    filteredData.filter((item) => !item.collectionExecutive)
                      .length
                  }
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Assigned Today</span>
                <span className="font-bold text-green-600">
                  {
                    assignedTasks.filter(
                      (task) =>
                        new Date(task.assignedDate).toDateString() ===
                        new Date().toDateString(),
                    ).length
                  }
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">High Priority</span>
                <span className="font-bold text-orange-600">
                  {
                    assignedTasks.filter(
                      (task) =>
                        task.priority === "High" ||
                        task.priority === "Critical",
                    ).length
                  }
                </span>
              </div>
            </div>
            <Button
              onClick={() => {
                // Find first unassigned customer and assign
                const unassigned = filteredData.find(
                  (item) => !item.collectionExecutive,
                );
                if (unassigned) {
                  handleAssignTask(unassigned);
                } else {
                  alert("All cases are already assigned!");
                }
              }}
              className="w-full mt-4 px-4 py-2.5 rounded-lg"
            >
              <UserPlus className="w-4 h-4" />
              Quick Assign Next Case
            </Button>
          </div>

          {/* Executive Performance */}
          <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
            <h3 className="font-bold text-xl mb-4">Executive Performance</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>John Doe</span>
                <span className="font-bold">₹2,45,000 collected</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Jane Smith</span>
                <span className="font-bold">₹1,89,500 collected</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Robert Johnson</span>
                <span className="font-bold">₹3,12,000 collected</span>
              </div>
              <div className="pt-3 border-t border-blue-500 mt-3">
                <div className="flex items-center gap-2">
                  <TrendingUp size={18} className="text-green-300" />
                  <span className="text-sm">
                    Collection efficiency up by 18% this month
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
