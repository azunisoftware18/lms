import React, { useState, useEffect, useCallback } from "react";
import {
  RefreshCw,
  FileDown,
  ShieldAlert,
  Users,
  Phone,
  IndianRupee,
  TrendingUp,
  User,
  Mail,
  MapPin,
  CreditCard,
  AlertTriangle,
  PhoneCall,
  FileWarning,
  UserCheck,
  Eye,
  UserPlus,
  Calendar,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  MessageSquare,
  FileText,
  Gavel,
  Bell,
  Download,
  PieChart,
  BarChart3,
  Activity,
  Clock,
  Target,
  Award,
  Briefcase,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Star,
  DollarSign,
  Percent,
  AlertCircle,
  CheckSquare,
  ListFilter,
  SlidersHorizontal,
  ArrowUpDown,
  MoreHorizontal,
  Building2,
  History,
  MailOpen,
  PhoneOff,
  PhoneIncoming,
  Clock as ClockIcon,
  Banknote,
  Shield,
  Zap,
} from "lucide-react";

// Chart components are optional. Static import of 'recharts' can fail
// during Vite's import analysis if the dependency isn't installed
// (e.g. in CI or a fresh workspace). Provide lightweight stubs
// so the app can build without `recharts`. Install `recharts`
// to enable full charts.

const _StubWrapper = ({ children }) => (
  <div className="text-sm text-slate-400 py-8 flex items-center justify-center">
    Charts unavailable
  </div>
);

const LineChart = _StubWrapper;
const Line = () => null;
const AreaChart = _StubWrapper;
const Area = () => null;
const BarChart = _StubWrapper;
const Bar = () => null;
const RePieChart = _StubWrapper;
const Pie = () => null;
const Cell = () => null;
const XAxis = () => null;
const YAxis = () => null;
const CartesianGrid = () => null;
const Tooltip = () => null;
const Legend = () => null;
const ResponsiveContainer = ({ children }) => <div>{children}</div>;
const RadialBarChart = _StubWrapper;
const RadialBar = () => null;
const ComposedChart = _StubWrapper;

// Note: For real charts, install `recharts` in apps/frontend:
//   cd apps/frontend && npm install recharts
// After installation, you can replace these stubs with a
// regular `import { ... } from 'recharts'` to restore charts.

// Toast Notifications
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
        ? "bg-red-500"
        : type === "warning"
          ? "bg-yellow-500"
          : "bg-blue-500";

  return (
    <div
      className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slide-up`}
    >
      {type === "success" && <CheckCircle className="w-5 h-5" />}
      {type === "error" && <XCircle className="w-5 h-5" />}
      {type === "warning" && <AlertTriangle className="w-5 h-5" />}
      {type === "info" && <Bell className="w-5 h-5" />}
      <span>{message}</span>
    </div>
  );
};

// Confirmation Modal
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// Loading Spinner
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
  </div>
);

// Stat Card Component
const StatCard = ({ title, value, change, icon: Icon, color, subtext }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <div className={`p-2 ${color} rounded-lg`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      {change && (
        <span
          className={`text-xs font-medium ${change > 0 ? "text-green-600" : "text-red-600"}`}
        >
          {change > 0 ? "+" : ""}
          {change}%
        </span>
      )}
    </div>
    <p className="text-2xl font-bold text-slate-800">{value}</p>
    <p className="text-sm text-slate-500 mt-1">{title}</p>
    {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
  </div>
);

// Main Recovery Management Component
const RecoveryManagement = () => {
  // State Management
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCase, setSelectedCase] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    action: null,
    data: null,
  });
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock Data - Production ready structure
  const [recoveryMetrics, setRecoveryMetrics] = useState({
    totalCases: 1245,
    assignedCases: 980,
    pendingCalls: 265,
    recoveredAmount: 45678900,
    totalOutstanding: 124567890,
    recoveryPercentage: 36.7,
    collectionEfficiency: 78.5,
    avgResolutionDays: 45,
    totalAgents: 25,
    todayCalls: 145,
    promiseToPay: 89,
    legalEscalations: 34,
  });

  const recoveryAgents = [
    {
      id: 1,
      name: "Rajesh Kumar",
      activeCases: 45,
      recoveredAmount: 5678900,
      efficiency: 92,
      avatar: "RK",
      team: "Premium",
      joinDate: "2023-01-15",
    },
    {
      id: 2,
      name: "Priya Singh",
      activeCases: 38,
      recoveredAmount: 4345678,
      efficiency: 88,
      avatar: "PS",
      team: "Corporate",
      joinDate: "2023-03-20",
    },
    {
      id: 3,
      name: "Amit Patel",
      activeCases: 52,
      recoveredAmount: 6789012,
      efficiency: 85,
      avatar: "AP",
      team: "SME",
      joinDate: "2022-11-10",
    },
    {
      id: 4,
      name: "Sunita Reddy",
      activeCases: 41,
      recoveredAmount: 3987654,
      efficiency: 79,
      avatar: "SR",
      team: "Retail",
      joinDate: "2023-06-05",
    },
    {
      id: 5,
      name: "Vikram Mehta",
      activeCases: 47,
      recoveredAmount: 5234567,
      efficiency: 87,
      avatar: "VM",
      team: "Premium",
      joinDate: "2023-02-28",
    },
    {
      id: 6,
      name: "Neha Gupta",
      activeCases: 35,
      recoveredAmount: 3456789,
      efficiency: 91,
      avatar: "NG",
      team: "Retail",
      joinDate: "2023-08-12",
    },
  ];

  const mockRecoveryCases = [
    {
      id: 1,
      loanNumber: "LN-2024-001234",
      customerName: "Rajesh Kumar Sharma",
      phone: "+91 98765 43210",
      email: "rajesh.k@email.com",
      address: "123, Green Park, New Delhi",
      outstandingAmount: 1245678,
      emiDue: 32450,
      daysPastDue: 45,
      riskCategory: "High",
      assignedAgent: "Priya Singh",
      status: "In Progress",
      lastCallDate: "2024-03-15",
      callOutcome: "Promise to pay",
      nextFollowUp: "2024-03-20",
      priority: 1,
      stage: "Negotiation",
      lastActivity: "2024-03-15T10:30:00",
    },
    {
      id: 2,
      loanNumber: "LN-2024-005678",
      customerName: "Priya Singh",
      phone: "+91 98765 43211",
      email: "priya.s@email.com",
      address: "456, Lake View, Mumbai",
      outstandingAmount: 1890456,
      emiDue: 42850,
      daysPastDue: 32,
      riskCategory: "Medium",
      assignedAgent: "Amit Patel",
      status: "Assigned",
      lastCallDate: "2024-03-14",
      callOutcome: "No response",
      nextFollowUp: "2024-03-18",
      priority: 2,
      stage: "Initial Contact",
      lastActivity: "2024-03-14T15:45:00",
    },
    {
      id: 3,
      loanNumber: "LN-2024-009012",
      customerName: "Amit Patel",
      phone: "+91 98765 43212",
      email: "amit.p@email.com",
      address: "789, Koramangala, Bangalore",
      outstandingAmount: 734890,
      emiDue: 28450,
      daysPastDue: 67,
      riskCategory: "High",
      assignedAgent: "Rajesh Kumar",
      status: "Legal Notice Sent",
      lastCallDate: "2024-03-13",
      callOutcome: "Requested more time",
      nextFollowUp: "2024-03-22",
      priority: 1,
      stage: "Legal Escalation",
      lastActivity: "2024-03-13T11:20:00",
    },
    {
      id: 4,
      loanNumber: "LN-2024-003456",
      customerName: "Sunita Reddy",
      phone: "+91 98765 43213",
      email: "sunita.r@email.com",
      address: "321, Jubilee Hills, Hyderabad",
      outstandingAmount: 1567890,
      emiDue: 38450,
      daysPastDue: 92,
      riskCategory: "Critical",
      assignedAgent: "Vikram Mehta",
      status: "Legal Notice Sent",
      lastCallDate: "2024-03-12",
      callOutcome: "Promised legal action",
      nextFollowUp: "2024-03-19",
      priority: 0,
      stage: "Legal Action",
      lastActivity: "2024-03-12T09:15:00",
    },
    {
      id: 5,
      loanNumber: "LN-2024-007890",
      customerName: "Vikram Mehta",
      phone: "+91 98765 43214",
      email: "vikram.m@email.com",
      address: "654, Andheri East, Mumbai",
      outstandingAmount: 2134567,
      emiDue: 45600,
      daysPastDue: 28,
      riskCategory: "Low",
      assignedAgent: "Sunita Reddy",
      status: "In Progress",
      lastCallDate: "2024-03-16",
      callOutcome: "Payment scheduled",
      nextFollowUp: "2024-03-23",
      priority: 3,
      stage: "Follow-up",
      lastActivity: "2024-03-16T14:00:00",
    },
  ];

  // Chart Data
  const weeklyRecoveryData = [
    { day: "Mon", amount: 1250000, calls: 45, promises: 12 },
    { day: "Tue", amount: 1580000, calls: 52, promises: 18 },
    { day: "Wed", amount: 1420000, calls: 48, promises: 15 },
    { day: "Thu", amount: 1890000, calls: 56, promises: 22 },
    { day: "Fri", amount: 1670000, calls: 51, promises: 19 },
    { day: "Sat", amount: 980000, calls: 32, promises: 11 },
    { day: "Sun", amount: 450000, calls: 18, promises: 6 },
  ];

  const monthlyRecoveryData = [
    { month: "Jan", recovered: 12450000, target: 15000000, efficiency: 83 },
    { month: "Feb", recovered: 14560000, target: 15000000, efficiency: 97 },
    { month: "Mar", recovered: 16780000, target: 16000000, efficiency: 105 },
    { month: "Apr", recovered: 15670000, target: 16000000, efficiency: 98 },
    { month: "May", recovered: 17890000, target: 17000000, efficiency: 105 },
    { month: "Jun", recovered: 18900000, target: 17500000, efficiency: 108 },
  ];

  const riskDistributionData = [
    { name: "Critical", value: 45, color: "#EF4444" },
    { name: "High", value: 234, color: "#F97316" },
    { name: "Medium", value: 456, color: "#EAB308" },
    { name: "Low", value: 510, color: "#10B981" },
  ];

  const agentPerformanceData = [
    { name: "Rajesh K", recovered: 5678900, efficiency: 92, cases: 45 },
    { name: "Priya S", recovered: 4345678, efficiency: 88, cases: 38 },
    { name: "Amit P", recovered: 6789012, efficiency: 85, cases: 52 },
    { name: "Sunita R", recovered: 3987654, efficiency: 79, cases: 41 },
    { name: "Vikram M", recovered: 5234567, efficiency: 87, cases: 47 },
  ];

  // Call Logs Data
  const mockCallHistory = [
    {
      id: 1,
      date: "2024-03-15",
      agentName: "Priya Singh",
      outcome: "Promise to pay",
      remarks: "Customer promised to pay by 20th March",
      duration: "8:32",
      sentiment: "Positive",
    },
    {
      id: 2,
      date: "2024-03-10",
      agentName: "Priya Singh",
      outcome: "No response",
      remarks: "Called 3 times, no answer",
      duration: "0:00",
      sentiment: "Neutral",
    },
    {
      id: 3,
      date: "2024-03-05",
      agentName: "Rajesh Kumar",
      outcome: "Requested more time",
      remarks: "Customer requested extension till 15th March",
      duration: "12:15",
      sentiment: "Negative",
    },
  ];

  const mockLegalNotices = [
    {
      id: 1,
      sentDate: "2024-03-01",
      noticeType: "Demand Notice",
      status: "Delivered",
      response: "Acknowledged",
    },
    {
      id: 2,
      sentDate: "2024-02-15",
      noticeType: "Final Notice",
      status: "Acknowledged",
      response: "Requested settlement",
    },
  ];

  // Helper Functions
  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    showToast("Data refreshed successfully", "success");
    setIsLoading(false);
  };

  const handleExport = async (format = "excel") => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    showToast(`Report exported as ${format.toUpperCase()}`, "success");
    setIsLoading(false);
  };

  const handleViewCase = (loanNumber) => {
    const foundCase = mockRecoveryCases.find(
      (c) => c.loanNumber === loanNumber,
    );
    setSelectedCase(foundCase);
    setActiveTab("case");
  };

  const handleAssignAgent = async (loanNumber, agentName) => {
    setConfirmModal({
      isOpen: true,
      action: "assign",
      data: { loanNumber, agentName },
    });
  };

  const handleAddCallLog = async (customerName) => {
    setConfirmModal({
      isOpen: true,
      action: "callLog",
      data: { customerName },
    });
  };

  const handleSendLegalNotice = async (customerName) => {
    setConfirmModal({
      isOpen: true,
      action: "legalNotice",
      data: { customerName },
    });
  };

  const handleConfirmAction = async () => {
    const { action, data } = confirmModal;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    switch (action) {
      case "assign":
        showToast(
          `Case ${data.loanNumber} assigned to ${data.agentName}`,
          "success",
        );
        break;
      case "callLog":
        showToast(`Call log added for ${data.customerName}`, "success");
        break;
      case "legalNotice":
        showToast(`Legal notice sent to ${data.customerName}`, "success");
        break;
      default:
        break;
    }

    setIsLoading(false);
    setConfirmModal({ isOpen: false, action: null, data: null });
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Filtered and Sorted Cases
  const getFilteredCases = () => {
    let filtered = [...mockRecoveryCases];

    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.loanNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.phone.includes(searchTerm),
      );
    }

    if (riskFilter !== "all") {
      filtered = filtered.filter(
        (c) => c.riskCategory.toLowerCase() === riskFilter.toLowerCase(),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((c) =>
        c.status.toLowerCase().includes(statusFilter.toLowerCase()),
      );
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  };

  const getRiskColor = (risk) => {
    const colors = {
      Low: "bg-emerald-100 text-emerald-700",
      Medium: "bg-amber-100 text-amber-700",
      High: "bg-red-100 text-red-700",
      Critical: "bg-rose-200 text-rose-800",
    };
    return colors[risk] || "bg-slate-100 text-slate-700";
  };

  const getStatusColor = (status) => {
    const colors = {
      Assigned: "bg-blue-100 text-blue-700",
      "In Progress": "bg-purple-100 text-purple-700",
      "Legal Notice Sent": "bg-orange-100 text-orange-700",
      Closed: "bg-green-100 text-green-700",
    };
    return colors[status] || "bg-slate-100 text-slate-700";
  };

  const getPriorityBadge = (priority) => {
    const priorities = {
      0: { label: "Critical", color: "bg-rose-100 text-rose-700" },
      1: { label: "High", color: "bg-red-100 text-red-700" },
      2: { label: "Medium", color: "bg-amber-100 text-amber-700" },
      3: { label: "Low", color: "bg-emerald-100 text-emerald-700" },
    };
    return priorities[priority] || priorities[3];
  };

  // Pagination
  const filteredCases = getFilteredCases();
  const totalPages = Math.ceil(filteredCases.length / itemsPerPage);
  const paginatedCases = filteredCases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Tabs Configuration
  const tabs = [
    { id: "dashboard", label: "Analytics Dashboard", icon: TrendingUp },
    { id: "case", label: "Case Management", icon: ShieldAlert },
    { id: "assignment", label: "Agent Assignment", icon: UserCheck },
    { id: "reports", label: "Reports & Analytics", icon: BarChart3 },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Toast Notifications */}
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() =>
          setConfirmModal({ isOpen: false, action: null, data: null })
        }
        onConfirm={handleConfirmAction}
        title="Confirm Action"
        message="Are you sure you want to proceed with this action?"
      />

      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Recovery Management System
                </h1>
                <p className="text-slate-500 text-sm">
                  NBFC & Banking Recovery Operations
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Refresh
              </button>
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">
                  <FileDown className="w-4 h-4" />
                  Export
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 hidden group-hover:block z-20">
                  <button
                    onClick={() => handleExport("excel")}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700"
                  >
                    Excel Report
                  </button>
                  <button
                    onClick={() => handleExport("pdf")}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700"
                  >
                    PDF Report
                  </button>
                  <button
                    onClick={() => handleExport("csv")}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700"
                  >
                    CSV Format
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-sm p-1 mb-6 inline-flex flex-wrap gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Analytics Dashboard */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Key Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              <StatCard
                title="Total Cases"
                value={recoveryMetrics.totalCases}
                change={12}
                icon={Users}
                color="bg-blue-500"
                subtext="+124 this month"
              />
              <StatCard
                title="Recovered Amount"
                value={`₹${(recoveryMetrics.recoveredAmount / 10000000).toFixed(2)}Cr`}
                change={8.5}
                icon={IndianRupee}
                color="bg-green-500"
              />
              <StatCard
                title="Recovery Rate"
                value={`${recoveryMetrics.recoveryPercentage}%`}
                change={5.2}
                icon={Target}
                color="bg-purple-500"
              />
              <StatCard
                title="Collection Efficiency"
                value={`${recoveryMetrics.collectionEfficiency}%`}
                change={3.1}
                icon={Activity}
                color="bg-orange-500"
              />
              <StatCard
                title="Active Agents"
                value={recoveryMetrics.totalAgents}
                change={0}
                icon={Briefcase}
                color="bg-cyan-500"
              />
              <StatCard
                title="Today's Calls"
                value={recoveryMetrics.todayCalls}
                change={-2.3}
                icon={PhoneCall}
                color="bg-pink-500"
              />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Recovery Trend */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-slate-800">
                      Weekly Recovery Trend
                    </h2>
                  </div>
                  <select className="text-sm border border-slate-200 rounded-lg px-3 py-1">
                    <option>This Week</option>
                    <option>Last Week</option>
                    <option>This Month</option>
                  </select>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={weeklyRecoveryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="day" stroke="#64748B" />
                    <YAxis yAxisId="left" stroke="#64748B" />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#64748B"
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="amount"
                      name="Recovered Amount (₹)"
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="calls"
                      name="Calls Made"
                      stroke="#10B981"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="promises"
                      name="Promises"
                      stroke="#F59E0B"
                      strokeWidth={2}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Risk Distribution */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <div className="flex items-center gap-2 mb-6">
                  <PieChart className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-800">
                    Risk Distribution
                  </h2>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <RePieChart>
                    <Pie
                      data={riskDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {riskDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4">
                  {riskDistributionData.map((risk) => (
                    <div key={risk.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: risk.color }}
                      ></div>
                      <span className="text-xs text-slate-600">
                        {risk.name}: {risk.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Recovery vs Target */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <div className="flex items-center gap-2 mb-6">
                  <Target className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-800">
                    Monthly Recovery vs Target
                  </h2>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyRecoveryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="month" stroke="#64748B" />
                    <YAxis stroke="#64748B" />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="recovered"
                      name="Recovered Amount"
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="target"
                      name="Target Amount"
                      fill="#94A3B8"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Agent Performance */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <div className="flex items-center gap-2 mb-6">
                  <Award className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-800">
                    Top Agent Performance
                  </h2>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={agentPerformanceData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis type="number" stroke="#64748B" />
                    <YAxis
                      type="category"
                      dataKey="name"
                      stroke="#64748B"
                      width={80}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="recovered"
                      name="Amount Recovered (₹)"
                      fill="#3B82F6"
                      radius={[0, 4, 4, 0]}
                    />
                    <Bar
                      dataKey="efficiency"
                      name="Efficiency %"
                      fill="#10B981"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Cases Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-slate-800">
                    High Priority Cases
                  </h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search cases..."
                      className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                    />
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700"
                        onClick={() => handleSort("loanNumber")}
                      >
                        Loan Number{" "}
                        <ArrowUpDown className="w-3 h-3 inline ml-1" />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Outstanding
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        DPD
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Risk
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Agent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {paginatedCases.slice(0, 5).map((case_) => (
                      <tr
                        key={case_.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-slate-800">
                          {case_.loanNumber}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-slate-800">
                              {case_.customerName}
                            </p>
                            <p className="text-xs text-slate-500">
                              {case_.phone}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                          ₹{case_.outstandingAmount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-sm font-medium ${case_.daysPastDue > 90 ? "text-red-600" : case_.daysPastDue > 60 ? "text-orange-600" : case_.daysPastDue > 30 ? "text-yellow-600" : "text-green-600"}`}
                          >
                            {case_.daysPastDue} days
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(case_.riskCategory)}`}
                          >
                            {case_.riskCategory}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {case_.assignedAgent}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(case_.status)}`}
                          >
                            {case_.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewCase(case_.loanNumber)}
                              className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                              title="View Case"
                            >
                              <Eye className="w-4 h-4 text-slate-600" />
                            </button>
                            <button
                              onClick={() =>
                                handleAddCallLog(case_.customerName)
                              }
                              className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Add Call"
                            >
                              <PhoneCall className="w-4 h-4 text-slate-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Case Management */}
        {activeTab === "case" && (
          <div className="space-y-6">
            {/* Case Selection */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
              <div className="flex gap-4">
                <select
                  value={selectedCase?.loanNumber || ""}
                  onChange={(e) => {
                    const found = mockRecoveryCases.find(
                      (c) => c.loanNumber === e.target.value,
                    );
                    setSelectedCase(found);
                  }}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a recovery case</option>
                  {mockRecoveryCases.map((case_) => (
                    <option key={case_.id} value={case_.loanNumber}>
                      {case_.loanNumber} - {case_.customerName} (₹
                      {case_.outstandingAmount.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedCase && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Customer Information Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 lg:col-span-1">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-800">
                      Customer Profile
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {selectedCase.customerName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">
                          {selectedCase.customerName}
                        </p>
                        <p className="text-xs text-slate-500">
                          Customer since 2023
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600">
                          {selectedCase.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600">
                          {selectedCase.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600">
                          {selectedCase.address}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Loan Recovery Details Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 lg:col-span-1">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <CreditCard className="w-5 h-5 text-green-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-800">
                      Loan Details
                    </h2>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Loan Account</span>
                      <span className="font-mono font-medium text-slate-800">
                        {selectedCase.loanNumber}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Outstanding Amount</span>
                      <span className="font-semibold text-red-600">
                        ₹{selectedCase.outstandingAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">EMI Due</span>
                      <span className="font-medium text-slate-800">
                        ₹{selectedCase.emiDue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Days Past Due</span>
                      <span
                        className={`font-semibold ${selectedCase.daysPastDue > 90 ? "text-red-600" : selectedCase.daysPastDue > 60 ? "text-orange-600" : "text-yellow-600"}`}
                      >
                        {selectedCase.daysPastDue} days
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-slate-600">Risk Category</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(selectedCase.riskCategory)}`}
                      >
                        {selectedCase.riskCategory}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Center */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 lg:col-span-1">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Zap className="w-5 h-5 text-purple-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-800">
                      Action Center
                    </h2>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() =>
                        handleAddCallLog(selectedCase.customerName)
                      }
                      className="w-full flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <PhoneCall className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">
                          Log Call
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-blue-600" />
                    </button>

                    <button
                      onClick={() =>
                        handleSendLegalNotice(selectedCase.customerName)
                      }
                      className="w-full flex items-center justify-between p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileWarning className="w-5 h-5 text-orange-600" />
                        <span className="text-sm font-medium text-orange-700">
                          Send Legal Notice
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-orange-600" />
                    </button>

                    <button className="w-full flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-700">
                          Schedule Follow-up
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-green-600" />
                    </button>

                    <button className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="w-5 h-5 text-slate-600" />
                        <span className="text-sm font-medium text-slate-700">
                          Send Reminder
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>

                {/* Call History */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 lg:col-span-3">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <History className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-800">
                      Call History & Communication Log
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {mockCallHistory.map((call) => (
                      <div
                        key={call.id}
                        className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg"
                      >
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <PhoneIncoming className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-slate-800">
                              {call.date} - {call.agentName}
                            </p>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                call.sentiment === "Positive"
                                  ? "bg-green-100 text-green-700"
                                  : call.sentiment === "Negative"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {call.sentiment}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mt-1">
                            {call.outcome}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {call.remarks}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            Duration: {call.duration}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Agent Assignment */}
        {activeTab === "assignment" && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Search by loan number or customer..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                >
                  <option value="all">All Risk Categories</option>
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                  <option value="critical">Critical</option>
                </select>
                <select
                  className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="assigned">Assigned</option>
                  <option value="in progress">In Progress</option>
                  <option value="legal notice sent">Legal Notice Sent</option>
                </select>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Assignment Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Loan Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Outstanding
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        DPD
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Risk
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Current Agent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Reassign Agent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {paginatedCases.map((case_) => (
                      <tr
                        key={case_.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-mono font-medium text-slate-800">
                          {case_.loanNumber}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {case_.customerName}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                          ₹{case_.outstandingAmount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          {case_.daysPastDue} days
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(case_.riskCategory)}`}
                          >
                            {case_.riskCategory}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {case_.assignedAgent}
                        </td>
                        <td className="px-6 py-4">
                          <select className="px-2 py-1 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-36">
                            <option value="">Select Agent</option>
                            {recoveryAgents.map((agent) => (
                              <option key={agent.id} value={agent.name}>
                                {agent.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              handleAssignAgent(case_.loanNumber, "New Agent")
                            }
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            <UserCheck className="w-4 h-4" />
                            Assign
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-slate-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Reports & Analytics */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            {/* Date Range Filter */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
              <div className="flex flex-wrap gap-4 items-center">
                <div>
                  <label className="text-sm text-slate-600">Start Date</label>
                  <input
                    type="date"
                    className="ml-2 px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-600">End Date</label>
                  <input
                    type="date"
                    className="ml-2 px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Generate Report
                </button>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Collection Rate"
                value="78.5%"
                change={5.2}
                icon={Target}
                color="bg-emerald-500"
              />
              <StatCard
                title="Roll Rate"
                value="12.3%"
                change={-2.1}
                icon={TrendingUp}
                color="bg-amber-500"
              />
              <StatCard
                title="Delinquency Rate"
                value="8.7%"
                change={-1.5}
                icon={AlertCircle}
                color="bg-red-500"
              />
              <StatCard
                title="Recovery Cost"
                value="₹2.3L"
                change={-3.2}
                icon={Banknote}
                color="bg-purple-500"
              />
            </div>

            {/* Agent Performance Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800">
                  Agent Performance Dashboard
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Agent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Team
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Active Cases
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Recovered Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Efficiency
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Rating
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {recoveryAgents.map((agent) => (
                      <tr key={agent.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {agent.avatar}
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">
                                {agent.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                Joined {agent.joinDate}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            {agent.team}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {agent.activeCases}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-green-600">
                          ₹{(agent.recoveredAmount / 100000).toFixed(1)}L
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-200 rounded-full h-2 w-24">
                              <div
                                className="bg-green-500 rounded-full h-2"
                                style={{ width: `${agent.efficiency}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">
                              {agent.efficiency}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(agent.efficiency / 20) ? "text-yellow-400 fill-yellow-400" : "text-slate-300"}`}
                              />
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default RecoveryManagement;
