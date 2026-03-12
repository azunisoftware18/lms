import React, { useState, useMemo } from "react";
import {
  Filter,
  Download,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  Calendar,
  Building,
  Briefcase,
  Home,
  Car,
  Users,
  UserCheck,
  DollarSign,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  RefreshCw,
  BarChart3,
  FileText,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Send,
  Printer,
  MessageSquare,
  PhoneCall,
  Hash,
  Percent,
  Shield,
} from "lucide-react";
import {
  BOOKING_LIST_DUMMY_DATA,
  CUSTOMER_LIST_DUMMY_DATA,
} from "../../../lib/ReportsDummyData";
import { colorVariables } from "../../../lib";
import Button from "../../../components/ui/Button";
import SearchField from "../../../components/ui/SearchField";

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

const getStatusColor = (status) => {
  switch (status) {
    case "Approved":
    case "Active":
    case "Regular":
      return "bg-green-50 text-green-700 border-green-200";
    case "Pending":
    case "Processing":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "Rejected":
    case "Overdue":
      return "bg-red-50 text-red-700 border-red-200";
    case "Disbursed":
    case "Closed":
      return "bg-blue-50 text-blue-700 border-blue-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "Approved":
    case "Active":
      return <CheckCircle className="w-3 h-3 mr-1" />;
    case "Rejected":
    case "Overdue":
      return <XCircle className="w-3 h-3 mr-1" />;
    case "Pending":
      return <Clock className="w-3 h-3 mr-1" />;
    default:
      return null;
  }
};

// --- STATUS BADGE COMPONENT ---
const StatusBadge = ({ status }) => {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(status)}`}
    >
      {getStatusIcon(status)} {status}
    </span>
  );
};

// --- FILTER PANEL COMPONENT ---
const FilterPanel = ({ filters, setFilters, filterType, onApply, onReset }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const bookingFilters = [
    {
      label: "Application Date",
      type: "date-range",
      value: filters.dateRange,
      onChange: (val) => setFilters({ ...filters, dateRange: val }),
    },
    {
      label: "Branch",
      type: "select",
      options: [
        "All Branches",
        "Delhi Main",
        "Mumbai West",
        "Bangalore South",
        "Chennai Central",
      ],
      value: filters.branch,
      onChange: (val) => setFilters({ ...filters, branch: val }),
    },
    {
      label: "Loan Product",
      type: "select",
      options: [
        "All Products",
        "Personal Loan",
        "Business Loan",
        "Home Loan",
        "Vehicle Loan",
      ],
      value: filters.product,
      onChange: (val) => setFilters({ ...filters, product: val }),
    },
    {
      label: "Application Status",
      type: "select",
      options: ["All Status", "Pending", "Approved", "Rejected", "Disbursed"],
      value: filters.status,
      onChange: (val) => setFilters({ ...filters, status: val }),
    },
    {
      label: "Sales Executive",
      type: "select",
      options: [
        "All Executives",
        "John Doe",
        "Jane Smith",
        "Robert Johnson",
        "Sarah Williams",
      ],
      value: filters.executive,
      onChange: (val) => setFilters({ ...filters, executive: val }),
    },
    {
      label: "Source Type",
      type: "select",
      options: ["All Sources", "Agent", "Walk-in", "Online", "Partner"],
      value: filters.source,
      onChange: (val) => setFilters({ ...filters, source: val }),
    },
    {
      label: "Loan Amount Range",
      type: "range",
      min: 0,
      max: 5000000,
      step: 100000,
      value: filters.amountRange,
      onChange: (val) => setFilters({ ...filters, amountRange: val }),
    },
  ];

  const customerFilters = [
    {
      label: "Branch",
      type: "select",
      options: [
        "All Branches",
        "Delhi Main",
        "Mumbai West",
        "Bangalore South",
        "Chennai Central",
      ],
      value: filters.branch,
      onChange: (val) => setFilters({ ...filters, branch: val }),
    },
    {
      label: "Loan Product",
      type: "select",
      options: [
        "All Products",
        "Personal Loan",
        "Business Loan",
        "Home Loan",
        "Vehicle Loan",
      ],
      value: filters.product,
      onChange: (val) => setFilters({ ...filters, product: val }),
    },
    {
      label: "Loan Status",
      type: "select",
      options: ["All Status", "Active", "Closed", "Overdue"],
      value: filters.loanStatus,
      onChange: (val) => setFilters({ ...filters, loanStatus: val }),
    },
    {
      label: "EMI Status",
      type: "select",
      options: ["All Status", "Regular", "Late"],
      value: filters.emiStatus,
      onChange: (val) => setFilters({ ...filters, emiStatus: val }),
    },
    {
      label: "Disbursement Date",
      type: "date-range",
      value: filters.disbursementDate,
      onChange: (val) => setFilters({ ...filters, disbursementDate: val }),
    },
    {
      label: "Outstanding Balance",
      type: "range",
      min: 0,
      max: 10000000,
      step: 100000,
      value: filters.outstandingRange,
      onChange: (val) => setFilters({ ...filters, outstandingRange: val }),
    },
  ];

  const currentFilters =
    filterType === "booking" ? bookingFilters : customerFilters;

  const renderFilterInput = (filter) => {
    switch (filter.type) {
      case "select":
        return (
          <select
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            {filter.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "date-range":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="date"
              value={filter.value?.from || ""}
              onChange={(e) =>
                filter.onChange({ ...filter.value, from: e.target.value })
              }
              className="w-full min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <input
              type="date"
              value={filter.value?.to || ""}
              onChange={(e) =>
                filter.onChange({ ...filter.value, to: e.target.value })
              }
              className="w-full min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        );
      case "range":
        return (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{formatCurrency(filter.value?.min || 0)}</span>
              <span>{formatCurrency(filter.value?.max || filter.max)}</span>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filter.value?.min || ""}
                onChange={(e) =>
                  filter.onChange({
                    ...filter.value,
                    min: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                value={filter.value?.max || ""}
                onChange={(e) =>
                  filter.onChange({
                    ...filter.value,
                    max: parseInt(e.target.value) || filter.max,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
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
            {
              Object.values(filters).filter(
                (v) =>
                  v !== "All" &&
                  v !== "All Branches" &&
                  v !== "All Products" &&
                  v !== "All Status" &&
                  v !== "All Executives" &&
                  v !== "All Sources",
              ).length
            }{" "}
            active
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentFilters.map((filter, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {filter.label}
                </label>
                {renderFilterInput(filter)}
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end gap-3">
            <Button
              onClick={onReset}
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-none"
            >
              Reset
            </Button>
            <Button
              onClick={onApply}
              className={`${colorVariables.PRIMARY_BUTTON_COLOR}`}
            >
              <Filter className="w-4 h-4" />
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- TABLE COMPONENT ---
const DataTable = ({
  columns,
  data,
  onAction,
  pagination,
  sortConfig,
  onSort,
  rowActions,
}) => {
  const handleSort = (key) => {
    if (sortConfig.key === key) {
      onSort(key, sortConfig.direction === "asc" ? "desc" : "asc");
    } else {
      onSort(key, "asc");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Mobile card view */}
      <div className="md:hidden divide-y divide-gray-200">
        {data.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`p-4 space-y-3 ${row.status?.includes("Overdue") ? "bg-red-50/50" : row.status === "Pending" ? "bg-yellow-50/50" : ""}`}
          >
            {columns.map((column, colIndex) => (
              <div
                key={colIndex}
                className="grid grid-cols-2 gap-3 items-start"
              >
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {column.label}
                </span>
                <div className="text-sm text-gray-800 wrap-break-word text-right">
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </div>
              </div>
            ))}

            {rowActions && (
              <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-1">
                {rowActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => onAction(action.type, row)}
                    className={`p-2 rounded-lg hover:bg-opacity-10 ${
                      action.type === "view"
                        ? "text-blue-600 hover:bg-blue-100"
                        : action.type === "edit"
                          ? "text-yellow-600 hover:bg-yellow-100"
                          : action.type === "approve"
                            ? "text-green-600 hover:bg-green-100"
                            : action.type === "reject"
                              ? "text-red-600 hover:bg-red-100"
                              : "text-gray-600 hover:bg-gray-100"
                    }`}
                    title={action.label}
                  >
                    {action.icon}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  onClick={() => column.sortable && handleSort(column.key)}
                  className={`py-3 px-4 text-left text-sm font-semibold text-gray-700 ${column.sortable ? "cursor-pointer hover:bg-gray-100" : ""}`}
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    {column.sortable &&
                      sortConfig.key === column.key &&
                      (sortConfig.direction === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>
              ))}
              {rowActions && (
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`hover:bg-gray-50 transition-colors ${row.status?.includes("Overdue") ? "bg-red-50/50" : row.status === "Pending" ? "bg-yellow-50/50" : ""}`}
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="py-3 px-4">
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
                {rowActions && (
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      {rowActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => onAction(action.type, row)}
                          className={`p-1.5 rounded hover:bg-opacity-10 ${
                            action.type === "view"
                              ? "text-blue-600 hover:bg-blue-100"
                              : action.type === "edit"
                                ? "text-yellow-600 hover:bg-yellow-100"
                                : action.type === "approve"
                                  ? "text-green-600 hover:bg-green-100"
                                  : action.type === "reject"
                                    ? "text-red-600 hover:bg-red-100"
                                    : "text-gray-600 hover:bg-gray-100"
                          }`}
                          title={action.label}
                        >
                          {action.icon}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="px-6 py-4 border-t border-gray-200 flex flex-col md:flex-row md:items-center justify-between">
          <div className="text-sm text-gray-500 mb-2 md:mb-0">
            Showing {pagination.start} to {pagination.end} of {pagination.total}{" "}
            entries
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={pagination.onPrev}
              disabled={!pagination.hasPrev}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <div className="flex flex-wrap items-center gap-2">
              {pagination.pages.map((page) => (
                <button
                  key={page}
                  onClick={() => pagination.onPage(page)}
                  className={`px-3 py-1 border rounded text-sm ${pagination.current === page ? `${colorVariables.ACCENT_COLOR_BG} text-white ${colorVariables.BORDER_COLOR}` : "border-gray-300 hover:bg-gray-50"}`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={pagination.onNext}
              disabled={!pagination.hasNext}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function CustomerAndBookingListPage() {
  const [activeTab, setActiveTab] = useState("booking");
  const [searchTerm, setSearchTerm] = useState("");
  const [bookingFilters, setBookingFilters] = useState({
    dateRange: { from: "", to: "" },
    branch: "All Branches",
    product: "All Products",
    status: "All Status",
    executive: "All Executives",
    source: "All Sources",
    amountRange: { min: 0, max: 5000000 },
  });

  const [customerFilters, setCustomerFilters] = useState({
    branch: "All Branches",
    product: "All Products",
    loanStatus: "All Status",
    emiStatus: "All Status",
    disbursementDate: { from: "", to: "" },
    outstandingRange: { min: 0, max: 10000000 },
  });

  const [bookingSort, setBookingSort] = useState({
    key: "applicationDate",
    direction: "desc",
  });
  const [customerSort, setCustomerSort] = useState({
    key: "outstandingBalance",
    direction: "desc",
  });
  const [bookingPage, setBookingPage] = useState(1);
  const [customerPage, setCustomerPage] = useState(1);
  const itemsPerPage = 10;

  const bookingData = BOOKING_LIST_DUMMY_DATA;

  const customerData = CUSTOMER_LIST_DUMMY_DATA;

  // --- TABLE CONFIGURATIONS ---
  const bookingColumns = [
    {
      key: "id",
      label: "Application ID",
      sortable: true,
      render: (value) => (
        <span className={`font-mono ${colorVariables.PRIMARY_COLOR}`}>
          {value}
        </span>
      ),
    },
    {
      key: "customerName",
      label: "Customer Name",
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-800">{value}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Phone size={12} />
            {row.mobile}
          </div>
        </div>
      ),
    },
    {
      key: "loanAmount",
      label: "Loan Amount",
      sortable: true,
      render: (value) => (
        <span className="font-bold text-gray-800">{formatCurrency(value)}</span>
      ),
    },
    {
      key: "product",
      label: "Product Type",
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium leading-none whitespace-nowrap">
            {value}
          </span>
        </div>
      ),
    },
    {
      key: "branch",
      label: "Branch",
      sortable: true,
      render: (value) => <span className="text-gray-700">{value}</span>,
    },
    {
      key: "applicationDate",
      label: "Application Date",
      sortable: true,
      render: (value) => (
        <span className="text-gray-700">{formatDate(value)}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: "assignedExecutive",
      label: "Assigned Executive",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs">
            {value.charAt(0)}
          </div>
          <span className="text-sm">{value}</span>
        </div>
      ),
    },
  ];

  const customerColumns = [
    {
      key: "customerId",
      label: "Customer ID",
      sortable: true,
      render: (value) => (
        <span className="font-mono text-purple-600">{value}</span>
      ),
    },
    {
      key: "loanAccount",
      label: "Loan Account",
      sortable: true,
      render: (value) => (
        <span className={`font-mono font-bold ${colorVariables.PRIMARY_COLOR}`}>
          {value}
        </span>
      ),
    },
    {
      key: "customerName",
      label: "Customer Name",
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-800">{value}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Phone size={12} />
            {row.mobile}
          </div>
        </div>
      ),
    },
    {
      key: "disbursedAmount",
      label: "Disbursed",
      sortable: true,
      render: (value) => (
        <span className="font-bold text-gray-800">{formatCurrency(value)}</span>
      ),
    },
    {
      key: "emiAmount",
      label: "EMI Amount",
      sortable: true,
      render: (value) => (
        <span className="text-gray-700">{formatCurrency(value)}</span>
      ),
    },
    {
      key: "outstandingBalance",
      label: "Outstanding",
      sortable: true,
      render: (value) => (
        <span
          className={`font-bold ${value === 0 ? "text-green-600" : "text-orange-600"}`}
        >
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: "dueDate",
      label: "Due Date",
      sortable: true,
      render: (value, row) => (
        <div>
          <div
            className={`text-sm ${row.loanStatus === "Overdue" ? "text-red-600 font-bold" : "text-gray-700"}`}
          >
            {formatDate(value)}
          </div>
          {row.loanStatus === "Overdue" && (
            <div className="text-xs text-red-500">Overdue</div>
          )}
        </div>
      ),
    },
    {
      key: "loanStatus",
      label: "Loan Status",
      sortable: true,
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: "collectionExecutive",
      label: "Collection Executive",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs text-green-600">
            {value.charAt(0)}
          </div>
          <span className="text-sm">{value}</span>
        </div>
      ),
    },
  ];

  // --- ACTION HANDLERS ---
  const handleBookingAction = (type, row) => {
    switch (type) {
      case "view":
        alert(`View application: ${row.id}`);
        break;
      case "edit":
        alert(`Edit application: ${row.id}`);
        break;
      case "approve":
        alert(`Approve application: ${row.id}`);
        break;
      case "reject":
        alert(`Reject application: ${row.id}`);
        break;
      default:
        break;
    }
  };

  const handleCustomerAction = (type, row) => {
    switch (type) {
      case "view":
        alert(`View statement: ${row.loanAccount}`);
        break;
      case "payment":
        alert(`Make payment: ${row.loanAccount}`);
        break;
      case "ledger":
        alert(`View ledger: ${row.loanAccount}`);
        break;
      case "contact":
        alert(`Contact: ${row.customerName} - ${row.mobile}`);
        break;
      default:
        break;
    }
  };

  const bookingActions = [
    { type: "view", label: "View Details", icon: <Eye className="w-4 h-4" /> },
    { type: "edit", label: "Edit", icon: <Edit className="w-4 h-4" /> },
    {
      type: "approve",
      label: "Approve",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    { type: "reject", label: "Reject", icon: <XCircle className="w-4 h-4" /> },
  ];

  const customerActions = [
    {
      type: "view",
      label: "View Statement",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      type: "payment",
      label: "Make Payment",
      icon: <CreditCard className="w-4 h-4" />,
    },
    {
      type: "ledger",
      label: "Ledger",
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      type: "contact",
      label: "Contact",
      icon: <PhoneCall className="w-4 h-4" />,
    },
  ];

  // --- FILTERED DATA ---
  const filteredBookingData = useMemo(() => {
    let data = [...bookingData];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(
        (item) =>
          item.customerName.toLowerCase().includes(term) ||
          item.id.toLowerCase().includes(term) ||
          item.mobile.includes(searchTerm),
      );
    }

    // Apply filters
    if (bookingFilters.branch !== "All Branches") {
      data = data.filter((item) => item.branch === bookingFilters.branch);
    }
    if (bookingFilters.product !== "All Products") {
      data = data.filter((item) => item.product === bookingFilters.product);
    }
    if (bookingFilters.status !== "All Status") {
      data = data.filter((item) => item.status === bookingFilters.status);
    }
    if (bookingFilters.executive !== "All Executives") {
      data = data.filter(
        (item) => item.assignedExecutive === bookingFilters.executive,
      );
    }
    if (bookingFilters.source !== "All Sources") {
      data = data.filter((item) => item.source === bookingFilters.source);
    }
    if (bookingFilters.amountRange?.min > 0) {
      data = data.filter(
        (item) => item.loanAmount >= bookingFilters.amountRange.min,
      );
    }
    if (bookingFilters.amountRange?.max < 5000000) {
      data = data.filter(
        (item) => item.loanAmount <= bookingFilters.amountRange.max,
      );
    }

    // Apply sorting
    data.sort((a, b) => {
      const aVal = a[bookingSort.key];
      const bVal = b[bookingSort.key];

      if (aVal < bVal) return bookingSort.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return bookingSort.direction === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }, [bookingData, searchTerm, bookingFilters, bookingSort]);

  const filteredCustomerData = useMemo(() => {
    let data = [...customerData];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(
        (item) =>
          item.customerName.toLowerCase().includes(term) ||
          item.loanAccount.toLowerCase().includes(term) ||
          item.customerId.toLowerCase().includes(term) ||
          item.mobile.includes(searchTerm),
      );
    }

    // Apply filters
    if (customerFilters.branch !== "All Branches") {
      data = data.filter((item) => item.branch === customerFilters.branch);
    }
    if (customerFilters.product !== "All Products") {
      data = data.filter((item) => item.product === customerFilters.product);
    }
    if (customerFilters.loanStatus !== "All Status") {
      data = data.filter(
        (item) => item.loanStatus === customerFilters.loanStatus,
      );
    }
    if (customerFilters.emiStatus !== "All Status") {
      data = data.filter(
        (item) => item.emiStatus === customerFilters.emiStatus,
      );
    }
    if (customerFilters.outstandingRange?.min > 0) {
      data = data.filter(
        (item) =>
          item.outstandingBalance >= customerFilters.outstandingRange.min,
      );
    }
    if (customerFilters.outstandingRange?.max < 10000000) {
      data = data.filter(
        (item) =>
          item.outstandingBalance <= customerFilters.outstandingRange.max,
      );
    }

    // Apply sorting
    data.sort((a, b) => {
      const aVal = a[customerSort.key];
      const bVal = b[customerSort.key];

      if (aVal < bVal) return customerSort.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return customerSort.direction === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }, [customerData, searchTerm, customerFilters, customerSort]);

  // --- PAGINATION ---
  const bookingPagination = {
    start: (bookingPage - 1) * itemsPerPage + 1,
    end: Math.min(bookingPage * itemsPerPage, filteredBookingData.length),
    total: filteredBookingData.length,
    current: bookingPage,
    pages: Array.from(
      { length: Math.ceil(filteredBookingData.length / itemsPerPage) },
      (_, i) => i + 1,
    ),
    hasPrev: bookingPage > 1,
    hasNext: bookingPage < Math.ceil(filteredBookingData.length / itemsPerPage),
    onPrev: () => setBookingPage((prev) => Math.max(1, prev - 1)),
    onNext: () =>
      setBookingPage((prev) =>
        Math.min(
          Math.ceil(filteredBookingData.length / itemsPerPage),
          prev + 1,
        ),
      ),
    onPage: (page) => setBookingPage(page),
  };

  const customerPagination = {
    start: (customerPage - 1) * itemsPerPage + 1,
    end: Math.min(customerPage * itemsPerPage, filteredCustomerData.length),
    total: filteredCustomerData.length,
    current: customerPage,
    pages: Array.from(
      { length: Math.ceil(filteredCustomerData.length / itemsPerPage) },
      (_, i) => i + 1,
    ),
    hasPrev: customerPage > 1,
    hasNext:
      customerPage < Math.ceil(filteredCustomerData.length / itemsPerPage),
    onPrev: () => setCustomerPage((prev) => Math.max(1, prev - 1)),
    onNext: () =>
      setCustomerPage((prev) =>
        Math.min(
          Math.ceil(filteredCustomerData.length / itemsPerPage),
          prev + 1,
        ),
      ),
    onPage: (page) => setCustomerPage(page),
  };

  const paginatedBookingData = filteredBookingData.slice(
    (bookingPage - 1) * itemsPerPage,
    bookingPage * itemsPerPage,
  );

  const paginatedCustomerData = filteredCustomerData.slice(
    (customerPage - 1) * itemsPerPage,
    customerPage * itemsPerPage,
  );

  // --- EXPORT FUNCTIONS ---
  const exportData = () => {
    const data =
      activeTab === "booking" ? filteredBookingData : filteredCustomerData;
    const headers =
      activeTab === "booking"
        ? [
            "Application ID",
            "Customer Name",
            "Mobile",
            "Loan Amount",
            "Product",
            "Branch",
            "Application Date",
            "Status",
            "Executive",
          ]
        : [
            "Customer ID",
            "Loan Account",
            "Customer Name",
            "Mobile",
            "Disbursed Amount",
            "EMI Amount",
            "Outstanding Balance",
            "Due Date",
            "Loan Status",
            "Collection Executive",
          ];

    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        activeTab === "booking"
          ? [
              row.id,
              row.customerName,
              row.mobile,
              row.loanAmount,
              row.product,
              row.branch,
              row.applicationDate,
              row.status,
              row.assignedExecutive,
            ].join(",")
          : [
              row.customerId,
              row.loanAccount,
              row.customerName,
              row.mobile,
              row.disbursedAmount,
              row.emiAmount,
              row.outstandingBalance,
              row.dueDate,
              row.loanStatus,
              row.collectionExecutive,
            ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeTab === "booking" ? "booking_list" : "customer_list"}_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  // --- RESET FILTERS ---
  const resetBookingFilters = () => {
    setBookingFilters({
      dateRange: { from: "", to: "" },
      branch: "All Branches",
      product: "All Products",
      status: "All Status",
      executive: "All Executives",
      source: "All Sources",
      amountRange: { min: 0, max: 5000000 },
    });
    setBookingPage(1);
  };

  const resetCustomerFilters = () => {
    setCustomerFilters({
      branch: "All Branches",
      product: "All Products",
      loanStatus: "All Status",
      emiStatus: "All Status",
      disbursementDate: { from: "", to: "" },
      outstandingRange: { min: 0, max: 10000000 },
    });
    setCustomerPage(1);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
              <div className="p-2 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl">
                <Users className="text-white" size={28} />
              </div>
              <span>Customer & Booking Management</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Manage loan applications and active customers in one place
            </p>
          </div>

          <div className="flex gap-3 mt-4 md:mt-0">
            <Button
              onClick={exportData}
              className="bg-green-600 hover:bg-green-700"
            >
              <Download size={18} />
              Export {activeTab === "booking" ? "Applications" : "Customers"}
            </Button>
            <Button
              onClick={() =>
                activeTab === "booking"
                  ? resetBookingFilters()
                  : resetCustomerFilters()
              }
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-none"
            >
              <RefreshCw size={18} />
              Reset
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => {
                setActiveTab("booking");
                setSearchTerm("");
              }}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === "booking"
                  ? `${colorVariables.PRIMARY_COLOR} border-b-2 ${colorVariables.BORDER_COLOR}`
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" />
                Booking List ({bookingData.length})
              </div>
            </button>
            <button
              onClick={() => {
                setActiveTab("customer");
                setSearchTerm("");
              }}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === "customer"
                  ? `${colorVariables.PRIMARY_COLOR} border-b-2 ${colorVariables.BORDER_COLOR}`
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <UserCheck className="w-5 h-5" />
                Loan Customer List ({customerData.length})
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <SearchField
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClear={() => setSearchTerm("")}
                    showResults={false}
                    placeholder={`Search by ${activeTab === "booking" ? "customer name, application ID, or mobile..." : "customer name, loan account, or mobile..."}`}
                    className="py-3"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center px-4 py-3 bg-gray-100 rounded-lg">
                    <span className="text-sm text-gray-600">
                      {activeTab === "booking"
                        ? "Total Applications:"
                        : "Active Loans:"}
                    </span>
                    <span className="ml-2 font-bold text-gray-800">
                      {activeTab === "booking"
                        ? bookingData.length
                        : customerData.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Panel */}
            {activeTab === "booking" ? (
              <FilterPanel
                filters={bookingFilters}
                setFilters={setBookingFilters}
                filterType="booking"
                onApply={() => setBookingPage(1)}
                onReset={resetBookingFilters}
              />
            ) : (
              <FilterPanel
                filters={customerFilters}
                setFilters={setCustomerFilters}
                filterType="customer"
                onApply={() => setCustomerPage(1)}
                onReset={resetCustomerFilters}
              />
            )}

            {/* Data Table */}
            {activeTab === "booking" ? (
              <DataTable
                columns={bookingColumns}
                data={paginatedBookingData}
                onAction={handleBookingAction}
                pagination={bookingPagination}
                sortConfig={bookingSort}
                onSort={(key, direction) => setBookingSort({ key, direction })}
                rowActions={bookingActions}
              />
            ) : (
              <DataTable
                columns={customerColumns}
                data={paginatedCustomerData}
                onAction={handleCustomerAction}
                pagination={customerPagination}
                sortConfig={customerSort}
                onSort={(key, direction) => setCustomerSort({ key, direction })}
                rowActions={customerActions}
              />
            )}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Applications</p>
              <p className="text-2xl font-bold text-gray-800">
                {bookingData.filter((item) => item.status === "Pending").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Loans</p>
              <p className="text-2xl font-bold text-gray-800">
                {
                  customerData.filter((item) => item.loanStatus === "Active")
                    .length
                }
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Overdue Loans</p>
              <p className="text-2xl font-bold text-gray-800">
                {
                  customerData.filter((item) => item.loanStatus === "Overdue")
                    .length
                }
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Outstanding</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(
                  customerData.reduce(
                    (sum, item) => sum + item.outstandingBalance,
                    0,
                  ),
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
