import React, { useState } from 'react';
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
  ArrowRight,
  Eye,
  UserPlus,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical,
  Search,
  Filter,
  ChevronDown,
  MessageSquare,
  FileText,
  Gavel,
  Bell,
  Download
} from 'lucide-react';
import {
  useRecoveries,
  useRecoveryDashboard,
  useAssignRecoveryAgent,
} from '../../../hooks/useRecoveries';

const RecoveryManagement = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [agentFilter, setAgentFilter] = useState('all');
  const [selectedCase, setSelectedCase] = useState(null);
  // Fetch data from API (replaces mock data)
  const { data: dashboardResp, isLoading: dashboardLoading } = useRecoveryDashboard();
  const assignMutation = useAssignRecoveryAgent();

  // Use dashboardResp.data as the array of recoveries
  const recoveryCases = Array.isArray(dashboardResp?.data) ? dashboardResp.data : [];

  // Calculate metrics from the array
  const recoveryMetrics = {
    totalCases: recoveryCases.length,
    assignedCases: recoveryCases.filter(r => r.assignedTo).length,
    pendingCalls: recoveryCases.length, // You can adjust this logic as needed
    recoveredAmount: recoveryCases.reduce((sum, r) => sum + (r.recoveredAmount || 0), 0),
    totalOutstanding: recoveryCases.reduce((sum, r) => sum + (r.totalOutstandingAmount || 0), 0),
    recoveryPercentage: recoveryCases.length > 0 ?
      (recoveryCases.reduce((sum, r) => sum + (r.recoveredAmount || 0), 0) /
      recoveryCases.reduce((sum, r) => sum + (r.totalOutstandingAmount || 0), 0)) * 100 : 0
  };

  const mockCallHistory = dashboardResp?.data?.callHistory ?? dashboardResp?.callHistory ?? [];
  const mockLegalNotices = dashboardResp?.data?.legalNotices ?? dashboardResp?.legalNotices ?? [];

  // Tabs configuration
  const tabs = [
    { id: 'dashboard', label: 'Recovery Dashboard', icon: TrendingUp },
    { id: 'case', label: 'Recovery Case Details', icon: ShieldAlert },
    { id: 'assignment', label: 'Recovery Assignment', icon: UserCheck }
  ];

  // Get risk color
  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low':
        return 'bg-yellow-100 text-yellow-700';
      case 'Medium':
        return 'bg-orange-100 text-orange-700';
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Critical':
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Assigned':
        return 'bg-blue-100 text-blue-700';
      case 'In Progress':
        return 'bg-purple-100 text-purple-700';
      case 'Legal Notice Sent':
        return 'bg-orange-100 text-orange-700';
      case 'Closed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  // Handle actions
  const handleRefresh = () => {
    alert('Refreshing data...');
  };

  const handleExport = () => {
    alert('Exporting recovery report...');
  };

  const handleViewCase = (loanNumber) => {
    const foundCase = recoveryCases.find((c) => c.loanNumber === loanNumber);
    setSelectedCase(foundCase || null);
    setActiveTab('case');
  };

  const handleAssignAgent = (loanNumber) => {
    const foundCase = recoveryCases.find((c) => c.loanNumber === loanNumber);
    setSelectedCase(foundCase || null);
    setActiveTab('assignment');
  };

  const handleAddCallLog = (customerName) => {
    alert(`Adding call log for: ${customerName}`);
  };

  const handleSendLegalNotice = (customerName) => {
    alert(`Sending legal notice to: ${customerName}`);
  };

  const handleScheduleFollowUp = (customerName) => {
    alert(`Scheduling follow-up for: ${customerName}`);
  };

  const handleAssignCase = (loanNumber, agent) => {
    if (!loanNumber) return;
    const foundCase = recoveryCases.find((c) => c.id === loanNumber);
    if (!foundCase) return;
    const agentId = agent?.id ?? agent;
    assignMutation.mutate({ recoveryId: foundCase.id, data: { assignedTo: agentId } });
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-orange-500" />
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Recovery Management</h1>
            <p className="text-slate-600 mt-1">Manage overdue loan recovery operations</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Data
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FileDown className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-xl shadow-sm p-1 inline-flex flex-wrap mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Recovery Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-green-600">+12 this week</span>
              </div>
              <p className="text-2xl font-semibold text-slate-800">{recoveryMetrics.totalCases}</p>
              <p className="text-sm text-slate-500 mt-1">Total Recovery Cases</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-green-50 rounded-lg">
                  <UserCheck className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-xs font-medium text-green-600">{recoveryMetrics.assignedCases} active</span>
              </div>
              <p className="text-2xl font-semibold text-slate-800">{recoveryMetrics.assignedCases}</p>
              <p className="text-sm text-slate-500 mt-1">Assigned Cases</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <Phone className="w-5 h-5 text-yellow-600" />
                </div>
                <span className="text-xs font-medium text-yellow-600">High priority</span>
              </div>
              <p className="text-2xl font-semibold text-slate-800">{recoveryMetrics.pendingCalls}</p>
              <p className="text-sm text-slate-500 mt-1">Pending Calls</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <IndianRupee className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-xs font-medium text-purple-600">This month</span>
              </div>
              <p className="text-2xl font-semibold text-slate-800">₹{(recoveryMetrics.recoveredAmount / 100000).toFixed(1)}L</p>
              <p className="text-sm text-slate-500 mt-1">Recovery Amount Collected</p>
            </div>
          </div>

          {/* Recovery Progress Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progress Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-800">Recovery Progress</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Total Outstanding</span>
                  <span className="text-lg font-semibold text-slate-800">
                    ₹{(recoveryMetrics.totalOutstanding / 100000).toFixed(1)}L
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Amount Recovered</span>
                  <span className="text-lg font-semibold text-green-600">
                    ₹{(recoveryMetrics.recoveredAmount / 100000).toFixed(1)}L
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Remaining Balance</span>
                  <span className="text-lg font-semibold text-orange-600">
                    ₹{((recoveryMetrics.totalOutstanding - recoveryMetrics.recoveredAmount) / 100000).toFixed(1)}L
                  </span>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-600">Recovery Percentage</span>
                    <span className="text-sm font-semibold text-blue-600">{recoveryMetrics.recoveryPercentage.toFixed(2)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${recoveryMetrics.recoveryPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Card (Agent Performance) removed: no agent data in API */}
          </div>

          {/* Recovery Cases Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-slate-800">Active Recovery Cases</h3>
                <div className="flex gap-2">
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
                  <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <Filter className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Loan Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Customer Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Outstanding Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Days Past Due
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Assigned Agent
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
                  {recoveryCases.map((case_, idx) => (
                    <tr key={case_.recoveryId || case_.id || case_.loanNumber || idx} className={`hover:bg-slate-50 transition-colors ${
                      case_.daysPastDue > 90 ? 'bg-red-50' : ''
                    }`}>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">
                        {case_.loanNumber}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-slate-800">{case_.customerName}</p>
                          <p className="text-xs text-slate-500">{case_.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        ₹{Number(case_.outstandingAmount ?? case_.totalOutstandingAmount ?? 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${
                            case_.daysPastDue > 90 ? 'text-red-600' :
                            case_.daysPastDue > 60 ? 'text-orange-600' :
                            case_.daysPastDue > 30 ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {case_.daysPastDue} days
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{case_.assignedAgent}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(case_.status)}`}>
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
                            onClick={() => handleAssignAgent(case_.loanNumber)}
                            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Assign Agent"
                          >
                            <UserPlus className="w-4 h-4 text-slate-600" />
                          </button>
                          <button
                            onClick={() => handleAddCallLog(case_.customerName)}
                            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Add Call Log"
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

      {/* Tab 2: Recovery Case Details */}
      {activeTab === 'case' && (
        <div className="space-y-6">
          {/* Case Selection */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
            <div className="flex gap-4">
              <select
                value={selectedCase?.loanNumber || ''}
                onChange={(e) => {
                  const found = recoveryCases.find(c => c.loanNumber === e.target.value);
                  setSelectedCase(found);
                }}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a recovery case</option>
                {recoveryCases.map(case_ => (
                  <option key={case_.recoveryId || case_.id || case_.loanNumber} value={case_.loanNumber}>
                    {case_.loanNumber} - {case_.customerName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedCase && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Customer Information Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-800">Customer Information</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Customer Name</p>
                      <p className="font-medium text-slate-800">{selectedCase.customerName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Phone className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Phone Number</p>
                      <p className="font-medium text-slate-800">{selectedCase.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Email</p>
                      <p className="font-medium text-slate-800">{selectedCase.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <MapPin className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Address</p>
                      <p className="font-medium text-slate-800">{selectedCase.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loan Recovery Details Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-800">Loan Recovery Details</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Loan Account Number</span>
                    <span className="font-medium text-slate-800">{selectedCase.loanNumber}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Outstanding Amount</span>
                    <span className="font-medium text-slate-800">₹{selectedCase.outstandingAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">EMI Due</span>
                    <span className="font-medium text-slate-800">₹{selectedCase.emiDue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Days Past Due</span>
                    <span className={`font-medium ${
                      selectedCase.daysPastDue > 90 ? 'text-red-600' :
                      selectedCase.daysPastDue > 60 ? 'text-orange-600' :
                      selectedCase.daysPastDue > 30 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {selectedCase.daysPastDue} days
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600">Risk Category</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(selectedCase.riskCategory)}`}>
                      {selectedCase.riskCategory}
                    </span>
                  </div>
                </div>
              </div>

              {/* Call History & Legal Notices Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <PhoneCall className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-800">Call History</h2>
                </div>
                
                <div className="space-y-3 max-h-40 overflow-y-auto mb-4">
                  {mockCallHistory.map((call) => (
                    <div key={call.id} className="p-2 bg-slate-50 rounded-lg text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-slate-700">{call.date}</span>
                        <span className="text-xs text-slate-500">{call.agentName}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{call.outcome}</p>
                      <p className="text-xs text-slate-500 mt-1">{call.remarks}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <FileWarning className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-800">Legal Notices</h2>
                </div>
                
                <div className="space-y-2 mb-4">
                  {mockLegalNotices.map((notice) => (
                    <div key={notice.id} className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                      <div>
                        <p className="text-xs font-medium text-slate-700">{notice.noticeType}</p>
                        <p className="text-xs text-slate-500">{notice.sentDate}</p>
                      </div>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                        {notice.status}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={() => handleAddCallLog(selectedCase.customerName)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <PhoneCall className="w-4 h-4" />
                    Add Call Log
                  </button>
                  <button
                    onClick={() => handleSendLegalNotice(selectedCase.customerName)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors text-sm"
                  >
                    <FileWarning className="w-4 h-4" />
                    Send Notice
                  </button>
                  <button
                    onClick={() => handleScheduleFollowUp(selectedCase.customerName)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                  >
                    <Calendar className="w-4 h-4" />
                    Follow-up
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Recovery Assignment */}
      {activeTab === 'assignment' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-50">
                <input
                  type="text"
                  placeholder="Search by loan number or customer..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">All Risk Categories</option>
                <option value="low">Low Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="high">High Risk</option>
                <option value="critical">Critical</option>
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
                      Customer Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Outstanding Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Days Past Due
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Current Agent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Assign Agent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {recoveryCases.map((case_) => (
                    <tr key={case_.id || case_.loanNumber || Math.random()} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">
                        {case_.loanNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{case_.customerName}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        ₹{(case_.outstandingAmount ?? case_.totalOutstandingAmount ?? 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${
                          case_.daysPastDue > 90 ? 'text-red-600' :
                          case_.daysPastDue > 60 ? 'text-orange-600' :
                          case_.daysPastDue > 30 ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {case_.daysPastDue} days
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{case_.assignedAgent}</td>
                      {/* Agent dropdown removed: no agent data available */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleAssignCase(case_.id, 'Agent')}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          disabled={!case_.id}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default RecoveryManagement;