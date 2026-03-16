import React, { useState } from 'react';
import {
  AlertTriangle,
  RefreshCw,
  FileDown,
  Users,
  AlertCircle,
  IndianRupee,
  TrendingUp,
  Clock,
  ShieldAlert,
  Eye,
  UserCheck,
  Bell,
  Search,
  Filter,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  PieChart,
  BarChart3,
  Download,
  Mail,
  Phone,
  MoreVertical
} from 'lucide-react';

const DelinquencyDashboard = () => {
  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [dpdFilter, setDpdFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [sortField, setSortField] = useState('dpd');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock portfolio summary data
  const portfolioSummary = {
    totalActiveLoans: 1250,
    totalOverdueLoans: 175,
    totalOutstandingAmount: 45678900,
    portfolioRiskPercentage: 14.2,
    previousPeriodRisk: 12.8
  };

  // Mock DPD bucket data
  const dpdBuckets = [
    {
      range: '1–30 DPD',
      count: 120,
      outstanding: 8560000,
      percentage: 68.6,
      color: 'yellow',
      icon: Clock,
      riskLevel: 'Low Risk'
    },
    {
      range: '31–60 DPD',
      count: 40,
      outstanding: 3240000,
      percentage: 22.9,
      color: 'orange',
      icon: AlertTriangle,
      riskLevel: 'Medium Risk'
    },
    {
      range: '61–90 DPD',
      count: 10,
      outstanding: 890000,
      percentage: 5.7,
      color: 'red',
      icon: ShieldAlert,
      riskLevel: 'High Risk'
    },
    {
      range: '90+ DPD',
      count: 5,
      outstanding: 425000,
      percentage: 2.8,
      color: 'darkRed',
      icon: AlertTriangle,
      riskLevel: 'Critical'
    }
  ];

  // Mock overdue loans data
  const mockOverdueLoans = [
    {
      id: 1,
      loanNumber: 'LN-2024-001234',
      customerName: 'Rajesh Kumar Sharma',
      branch: 'Main Branch',
      emiAmount: 32450,
      outstandingAmount: 1245678,
      daysPastDue: 15,
      riskLevel: 'Low',
      phone: '+91 98765 43210',
      email: 'rajesh.k@email.com'
    },
    {
      id: 2,
      loanNumber: 'LN-2024-005678',
      customerName: 'Priya Singh',
      branch: 'North Branch',
      emiAmount: 42850,
      outstandingAmount: 1890456,
      daysPastDue: 32,
      riskLevel: 'Medium',
      phone: '+91 98765 43211',
      email: 'priya.s@email.com'
    },
    {
      id: 3,
      loanNumber: 'LN-2024-009012',
      customerName: 'Amit Patel',
      branch: 'South Branch',
      emiAmount: 28450,
      outstandingAmount: 734890,
      daysPastDue: 45,
      riskLevel: 'Medium',
      phone: '+91 98765 43212',
      email: 'amit.p@email.com'
    },
    {
      id: 4,
      loanNumber: 'LN-2024-003456',
      customerName: 'Sunita Reddy',
      branch: 'Main Branch',
      emiAmount: 38450,
      outstandingAmount: 1567890,
      daysPastDue: 67,
      riskLevel: 'High',
      phone: '+91 98765 43213',
      email: 'sunita.r@email.com'
    },
    {
      id: 5,
      loanNumber: 'LN-2024-007890',
      customerName: 'Vikram Mehta',
      branch: 'East Branch',
      emiAmount: 45600,
      outstandingAmount: 2134567,
      daysPastDue: 92,
      riskLevel: 'Critical',
      phone: '+91 98765 43214',
      email: 'vikram.m@email.com'
    },
    {
      id: 6,
      loanNumber: 'LN-2024-002345',
      customerName: 'Anjali Desai',
      branch: 'West Branch',
      emiAmount: 29800,
      outstandingAmount: 876543,
      daysPastDue: 8,
      riskLevel: 'Low',
      phone: '+91 98765 43215',
      email: 'anjali.d@email.com'
    },
    {
      id: 7,
      loanNumber: 'LN-2024-006789',
      customerName: 'Rahul Verma',
      branch: 'North Branch',
      emiAmount: 52400,
      outstandingAmount: 2345678,
      daysPastDue: 28,
      riskLevel: 'Low',
      phone: '+91 98765 43216',
      email: 'rahul.v@email.com'
    }
  ];

  // Get risk level color
  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Low':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-700',
          border: 'border-yellow-200',
          badge: 'bg-yellow-100 text-yellow-700'
        };
      case 'Medium':
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-700',
          border: 'border-orange-200',
          badge: 'bg-orange-100 text-orange-700'
        };
      case 'High':
        return {
          bg: 'bg-red-100',
          text: 'text-red-700',
          border: 'border-red-200',
          badge: 'bg-red-100 text-red-700'
        };
      case 'Critical':
        return {
          bg: 'bg-red-200',
          text: 'text-red-800',
          border: 'border-red-300',
          badge: 'bg-red-200 text-red-800'
        };
      default:
        return {
          bg: 'bg-slate-100',
          text: 'text-slate-700',
          border: 'border-slate-200',
          badge: 'bg-slate-100 text-slate-700'
        };
    }
  };

  // Get bucket color
  const getBucketColor = (color) => {
    switch (color) {
      case 'yellow':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-700',
          bar: 'bg-yellow-500',
          border: 'border-yellow-200'
        };
      case 'orange':
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-700',
          bar: 'bg-orange-500',
          border: 'border-orange-200'
        };
      case 'red':
        return {
          bg: 'bg-red-100',
          text: 'text-red-700',
          bar: 'bg-red-500',
          border: 'border-red-200'
        };
      case 'darkRed':
        return {
          bg: 'bg-red-200',
          text: 'text-red-800',
          bar: 'bg-red-700',
          border: 'border-red-300'
        };
      default:
        return {
          bg: 'bg-slate-100',
          text: 'text-slate-700',
          bar: 'bg-slate-500',
          border: 'border-slate-200'
        };
    }
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Sort loans
  const sortedLoans = [...mockOverdueLoans].sort((a, b) => {
    if (sortField === 'dpd') {
      return sortDirection === 'asc' 
        ? a.daysPastDue - b.daysPastDue
        : b.daysPastDue - a.daysPastDue;
    }
    if (sortField === 'amount') {
      return sortDirection === 'asc'
        ? a.outstandingAmount - b.outstandingAmount
        : b.outstandingAmount - a.outstandingAmount;
    }
    return 0;
  });

  // Filter loans
  const filteredLoans = sortedLoans.filter(loan => {
    const matchesSearch = loan.loanNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDpd = dpdFilter === 'all' || 
                      (dpdFilter === '1-30' && loan.daysPastDue <= 30) ||
                      (dpdFilter === '31-60' && loan.daysPastDue > 30 && loan.daysPastDue <= 60) ||
                      (dpdFilter === '61-90' && loan.daysPastDue > 60 && loan.daysPastDue <= 90) ||
                      (dpdFilter === '90+' && loan.daysPastDue > 90);
    const matchesBranch = branchFilter === 'all' || loan.branch === branchFilter;
    
    return matchesSearch && matchesDpd && matchesBranch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLoans.length / itemsPerPage);
  const paginatedLoans = filteredLoans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle actions
  const handleRefresh = () => {
    alert('Refreshing data...');
  };

  const handleExport = () => {
    alert('Exporting report...');
  };

  const handleViewLoan = (loanNumber) => {
    alert(`Viewing loan: ${loanNumber}`);
  };

  const handleAssignRecovery = (customerName) => {
    alert(`Assigning recovery for: ${customerName}`);
  };

  const handleSendReminder = (customerName) => {
    alert(`Sending reminder to: ${customerName}`);
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">DPD & Delinquency Engine</h1>
            <p className="text-slate-600 mt-1">Monitor overdue loans and portfolio risk</p>
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

      {/* Portfolio Risk Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Active Loans */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-green-600 flex items-center gap-1">
              <ArrowUp className="w-3 h-3" />
              +2.5%
            </span>
          </div>
          <p className="text-2xl font-semibold text-slate-800">{portfolioSummary.totalActiveLoans.toLocaleString()}</p>
          <p className="text-sm text-slate-500 mt-1">Total Active Loans</p>
        </div>

        {/* Total Overdue Loans */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-xs font-medium text-red-600 flex items-center gap-1">
              <ArrowUp className="w-3 h-3" />
              +1.2%
            </span>
          </div>
          <p className="text-2xl font-semibold text-slate-800">{portfolioSummary.totalOverdueLoans}</p>
          <p className="text-sm text-slate-500 mt-1">Total Overdue Loans</p>
        </div>

        {/* Total Outstanding Amount */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <IndianRupee className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs font-medium text-green-600 flex items-center gap-1">
              <ArrowDown className="w-3 h-3" />
              -0.8%
            </span>
          </div>
          <p className="text-2xl font-semibold text-slate-800">₹{(portfolioSummary.totalOutstandingAmount / 10000000).toFixed(2)}Cr</p>
          <p className="text-sm text-slate-500 mt-1">Total Outstanding Amount</p>
        </div>

        {/* Portfolio Risk % */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-orange-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-xs font-medium text-orange-600 flex items-center gap-1">
              <ArrowUp className="w-3 h-3" />
              +1.4%
            </span>
          </div>
          <p className="text-2xl font-semibold text-slate-800">{portfolioSummary.portfolioRiskPercentage}%</p>
          <p className="text-sm text-slate-500 mt-1">Portfolio Risk %</p>
        </div>
      </div>

      {/* DPD Bucket Distribution */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {dpdBuckets.map((bucket, index) => {
          const colors = getBucketColor(bucket.color);
          const Icon = bucket.icon;
          return (
            <div key={index} className={`bg-white rounded-xl shadow-sm p-6 border ${colors.border}`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${colors.bg}`}>
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${colors.bg} ${colors.text}`}>
                  {bucket.riskLevel}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-2xl font-semibold text-slate-800">{bucket.count}</p>
                <p className="text-sm font-medium text-slate-600">₹{(bucket.outstanding / 100000).toFixed(1)}L</p>
              </div>
              <p className="text-sm text-slate-500 mb-2">{bucket.range}</p>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className={`${colors.bar} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${bucket.percentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-500 mt-2">{bucket.percentage}% of overdue portfolio</p>
            </div>
          );
        })}
      </div>

      {/* DPD Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-800">DPD Distribution</h2>
            </div>
            <select className="px-3 py-1 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Last 30 days</option>
              <option>Last 60 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          
          <div className="space-y-4">
            {dpdBuckets.map((bucket, index) => {
              const colors = getBucketColor(bucket.color);
              const maxCount = Math.max(...dpdBuckets.map(b => b.count));
              const barWidth = (bucket.count / maxCount) * 100;
              
              return (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{bucket.range}</span>
                    <span className="font-medium text-slate-800">{bucket.count} loans</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div 
                      className={`${colors.bar} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${barWidth}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pie Chart Representation */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-800">Portfolio Composition</h2>
          </div>
          
          <div className="space-y-4">
            {dpdBuckets.map((bucket, index) => {
              const colors = getBucketColor(bucket.color);
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${colors.bar}`}></div>
                    <span className="text-sm text-slate-600">{bucket.range}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-800">{bucket.percentage}%</span>
                    <span className="text-xs text-slate-500">₹{(bucket.outstanding / 100000).toFixed(1)}L</span>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600 mb-1">Total Overdue Portfolio</p>
            <p className="text-2xl font-semibold text-slate-800">
              ₹{(dpdBuckets.reduce((sum, b) => sum + b.outstanding, 0) / 10000000).toFixed(2)}Cr
            </p>
          </div>
        </div>
      </div>

      {/* Overdue Loans Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-800">Overdue Loans</h2>
              <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                {filteredLoans.length} loans
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search loans..."
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              
              {/* DPD Filter */}
              <select
                value={dpdFilter}
                onChange={(e) => setDpdFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All DPD</option>
                <option value="1-30">1-30 DPD</option>
                <option value="31-60">31-60 DPD</option>
                <option value="61-90">61-90 DPD</option>
                <option value="90+">90+ DPD</option>
              </select>
              
              {/* Branch Filter */}
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Branches</option>
                <option value="Main Branch">Main Branch</option>
                <option value="North Branch">North Branch</option>
                <option value="South Branch">South Branch</option>
                <option value="East Branch">East Branch</option>
                <option value="West Branch">West Branch</option>
              </select>
              
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
                  Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  EMI Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Outstanding
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700"
                  onClick={() => handleSort('dpd')}
                >
                  <div className="flex items-center gap-1">
                    Days Past Due
                    {sortField === 'dpd' && (
                      sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedLoans.map((loan) => {
                const riskColors = getRiskColor(loan.riskLevel);
                return (
                  <tr 
                    key={loan.id} 
                    className={`hover:bg-slate-50 transition-colors ${
                      loan.daysPastDue > 90 ? 'bg-red-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">
                      {loan.loanNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{loan.customerName}</p>
                        <p className="text-xs text-slate-500">{loan.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{loan.branch}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">₹{loan.emiAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">₹{loan.outstandingAmount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${
                          loan.daysPastDue > 90 ? 'text-red-600' :
                          loan.daysPastDue > 60 ? 'text-red-500' :
                          loan.daysPastDue > 30 ? 'text-orange-500' :
                          'text-yellow-600'
                        }`}>
                          {loan.daysPastDue} days
                        </span>
                        {loan.daysPastDue > 90 && (
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${riskColors.badge}`}>
                        {loan.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewLoan(loan.loanNumber)}
                          className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Loan"
                        >
                          <Eye className="w-4 h-4 text-slate-600" />
                        </button>
                        <button
                          onClick={() => handleAssignRecovery(loan.customerName)}
                          className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Assign Recovery"
                        >
                          <UserCheck className="w-4 h-4 text-slate-600" />
                        </button>
                        <button
                          onClick={() => handleSendReminder(loan.customerName)}
                          className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Send Reminder"
                        >
                          <Bell className="w-4 h-4 text-slate-600" />
                        </button>
                        <button className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4 text-slate-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredLoans.length)} of {filteredLoans.length} loans
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-lg text-sm ${
                currentPage === 1
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Previous
            </button>
            <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-lg text-sm ${
                currentPage === totalPages
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DelinquencyDashboard;