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
  ArrowUp,
  ArrowDown,
  PieChart,
  BarChart3,
  MoreVertical
} from 'lucide-react';
import { useLoanApplications } from '../../../hooks/useLoanApplication';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

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

  // Mock DPD bucket data (fallback)
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

  // Fetch real loan applications from API and map to UI shape
  const { data: loanQueryData, totalOutstandingAmount: hookTotalOutstanding } = useLoanApplications();
  const apiLoansRaw = loanQueryData?.data?.data ?? loanQueryData?.data ?? loanQueryData ?? [];
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [menuOpenFor, setMenuOpenFor] = useState(null);
  const [exportOpen, setExportOpen] = useState(false);

  const getRiskFromDpd = (dpd) => {
    if (dpd > 90) return 'Critical';
    if (dpd > 60) return 'High';
    if (dpd > 30) return 'Medium';
    return 'Low';
  };

  const apiOverdueLoans = Array.isArray(apiLoansRaw)
    ? apiLoansRaw.map((l, idx) => ({
        id: l.id ?? l._id ?? idx,
        loanNumber: l.loanNumber ?? l.loan_number ?? l.applicationNumber ?? l.loanId ?? `LN-${idx}`,
        customerName:
          l.customer?.name ?? l.customerName ?? l.applicantName ?? l.borrowerName ?? l.name ?? 'Unknown',
        branch: l.branch?.name ?? l.branchName ?? l.branch ?? 'N/A',
        emiAmount: l.emiAmount ?? l.emi_amount ?? l.monthlyInstallment ?? 0,
        outstandingAmount:
          l.outstandingAmount ?? l.outstanding_amount ?? l.loanOutstanding ?? l.outstanding ?? 0,
        daysPastDue: l.daysPastDue ?? l.dpd ?? l.daysPastDueCount ?? 0,
        riskLevel: l.riskLevel ?? l.risk_level ?? getRiskFromDpd(l.daysPastDue ?? l.dpd ?? 0),
        phone: l.customer?.phone ?? l.phone ?? l.mobile ?? '',
        email: l.customer?.email ?? l.email ?? ''
      }))
    : [];

  // Use API data if available, otherwise fall back to mock data
  const dataSource = apiOverdueLoans.length ? apiOverdueLoans : mockOverdueLoans;

    // Compute summary and DPD buckets from API data when available
    const computeNumber = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    };

    const totalActive = apiLoansRaw && apiLoansRaw.length ? apiLoansRaw.length : portfolioSummary.totalActiveLoans;
    const overdueLoansList = dataSource.filter(l => (l.daysPastDue ?? 0) > 0);
    const totalOverdue = overdueLoansList.length;

    const apiTotalOutstanding =
      hookTotalOutstanding ??
      loanQueryData?.totalOutstandingAmount ??
      loanQueryData?.data?.totalOutstandingAmount ??
      loanQueryData?.data?.data?.totalOutstandingAmount ??
      null;

    const hasApiTotalOutstanding = typeof apiTotalOutstanding === 'number' && !Number.isNaN(apiTotalOutstanding);

    const computedTotalOutstanding = dataSource.reduce((sum, l) => sum + computeNumber(l.outstandingAmount), 0);

    const totalOutstanding = hasApiTotalOutstanding
      ? apiTotalOutstanding
      : (computedTotalOutstanding || portfolioSummary.totalOutstandingAmount);

    const totalOverdueOutstanding = overdueLoansList.reduce((sum, l) => sum + computeNumber(l.outstandingAmount), 0) || 0;

    const portfolioSummaryLive = {
      totalActiveLoans: totalActive,
      totalOverdueLoans: totalOverdue,
      totalOutstandingAmount: totalOutstanding,
      portfolioRiskPercentage: totalActive ? Number(((totalOverdue / totalActive) * 100).toFixed(1)) : portfolioSummary.portfolioRiskPercentage
    };

    const dpdBucketsLive = [
      { key: '1-30', range: '1–30 DPD', min: 1, max: 30, color: 'yellow', icon: Clock },
      { key: '31-60', range: '31–60 DPD', min: 31, max: 60, color: 'orange', icon: AlertTriangle },
      { key: '61-90', range: '61–90 DPD', min: 61, max: 90, color: 'red', icon: ShieldAlert },
      { key: '90+', range: '90+ DPD', min: 91, max: Infinity, color: 'darkRed', icon: AlertTriangle }
    ].map(b => {
      const loansInBucket = overdueLoansList.filter(l => (l.daysPastDue ?? 0) >= b.min && (l.daysPastDue ?? 0) <= b.max);
      const outstanding = loansInBucket.reduce((s, x) => s + computeNumber(x.outstandingAmount), 0);
      const count = loansInBucket.length;
      const percentage = totalOverdueOutstanding ? Number(((outstanding / totalOverdueOutstanding) * 100).toFixed(1)) : 0;
      return {
        range: b.range,
        count,
        outstanding,
        percentage,
        color: b.color,
        icon: b.icon,
        riskLevel: count === 0 ? 'Low Risk' : (b.key === '90+' ? 'Critical' : b.key === '61-90' ? 'High Risk' : b.key === '31-60' ? 'Medium Risk' : 'Low Risk')
      };
    });

    const dpdBucketsDisplay = dpdBucketsLive.some(b => b.count > 0) ? dpdBucketsLive : dpdBuckets;

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
  const sortedLoans = [...dataSource].sort((a, b) => {
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
    qc.invalidateQueries({ queryKey: ['loanApplications'] });
  };

  const exportCSV = () => {
    const rows = filteredLoans && filteredLoans.length ? filteredLoans : dataSource;
    const header = ['Loan Number', 'Customer Name', 'Branch', 'EMI Amount', 'Outstanding', 'Days Past Due', 'Risk Level'];
    const csv = [header.join(',')].concat(
      rows.map(r => [r.loanNumber, r.customerName, r.branch, r.emiAmount, r.outstandingAmount, r.daysPastDue, r.riskLevel]
        .map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `overdue_loans_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setExportOpen(false);
  };

  const exportXLS = () => {
    const rows = filteredLoans && filteredLoans.length ? filteredLoans : dataSource;
    // Simple Excel XML (SpreadsheetML) compatible with Excel
    const header = ['Loan Number','Customer Name','Branch','EMI Amount','Outstanding','Days Past Due','Risk Level'];
    const escapeXml = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const rowsXml = [header].concat(rows.map(r => [r.loanNumber, r.customerName, r.branch, r.emiAmount, r.outstandingAmount, r.daysPastDue, r.riskLevel]))
      .map(cols => '<Row>' + cols.map(c => `<Cell><Data ss:Type="String">${escapeXml(c)}</Data></Cell>`).join('') + '</Row>')
      .join('');

    const xml = `<?xml version="1.0"?>\n<?mso-application progid="Excel.Sheet"?>\n<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n  <Worksheet ss:Name="OverdueLoans">\n    <Table>\n      ${rowsXml}\n    </Table>\n  </Worksheet>\n</Workbook>`;

    const blob = new Blob([xml], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `overdue_loans_${new Date().toISOString().slice(0,10)}.xls`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setExportOpen(false);
  };

  const exportPDF = () => {
    const rows = filteredLoans && filteredLoans.length ? filteredLoans : dataSource;
    const htmlRows = rows.map(r => `
      <tr>
        <td style="padding:6px;border:1px solid #ddd;">${r.loanNumber}</td>
        <td style="padding:6px;border:1px solid #ddd;">${r.customerName}</td>
        <td style="padding:6px;border:1px solid #ddd;">${r.branch}</td>
        <td style="padding:6px;border:1px solid #ddd;">${r.emiAmount}</td>
        <td style="padding:6px;border:1px solid #ddd;">${r.outstandingAmount}</td>
        <td style="padding:6px;border:1px solid #ddd;">${r.daysPastDue}</td>
        <td style="padding:6px;border:1px solid #ddd;">${r.riskLevel}</td>
      </tr>`).join('');

    const html = `
      <html><head><title>Overdue Loans</title></head><body>
      <h2>Overdue Loans</h2>
      <table style="border-collapse:collapse;width:100%;font-family:Arial,Helvetica,sans-serif;">\n<thead><tr>
        <th style="padding:6px;border:1px solid #ddd;text-align:left">Loan Number</th>
        <th style="padding:6px;border:1px solid #ddd;text-align:left">Customer Name</th>
        <th style="padding:6px;border:1px solid #ddd;text-align:left">Branch</th>
        <th style="padding:6px;border:1px solid #ddd;text-align:right">EMI Amount</th>
        <th style="padding:6px;border:1px solid #ddd;text-align:right">Outstanding</th>
        <th style="padding:6px;border:1px solid #ddd;text-align:right">Days Past Due</th>
        <th style="padding:6px;border:1px solid #ddd;text-align:left">Risk Level</th>
      </tr></thead><tbody>\n${htmlRows}\n</tbody></table>
      <script>setTimeout(()=>{window.print();},300);</script>
      </body></html>`;

    const w = window.open('', '_blank', 'noopener');
    if (w) {
      w.document.write(html);
      w.document.close();
    }
    setExportOpen(false);
  };

  const handleViewLoan = (loanId) => {
    if (!loanId) return;
    navigate(`/loan-applications/${loanId}`);
  };

  const handleAssignRecovery = (loanId) => {
    if (!loanId) return;
    navigate(`/recovery/assign/${loanId}`);
  };

  const handleSendReminder = (loanId) => {
    if (!loanId) return;
    navigate(`/loan-applications/${loanId}/reminders`);
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
          <div className="relative">
            <button
              onClick={() => setExportOpen(e => !e)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FileDown className="w-4 h-4" />
              Export Report
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>
            {exportOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-md shadow-lg z-50">
                <button onClick={exportCSV} className="w-full text-left px-3 py-2 hover:bg-slate-50">Export CSV</button>
                <button onClick={exportXLS} className="w-full text-left px-3 py-2 hover:bg-slate-50">Export Excel (.xls)</button>
                <button onClick={exportPDF} className="w-full text-left px-3 py-2 hover:bg-slate-50">Export PDF</button>
              </div>
            )}
          </div>
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
          <p className="text-2xl font-semibold text-slate-800">{portfolioSummaryLive.totalActiveLoans.toLocaleString()}</p>
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
          <p className="text-2xl font-semibold text-slate-800">{portfolioSummaryLive.totalOverdueLoans}</p>
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
          <p className="text-2xl font-semibold text-slate-800">₹{(portfolioSummaryLive.totalOutstandingAmount / 10000000).toFixed(2)}Cr</p>
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
          <p className="text-2xl font-semibold text-slate-800">{portfolioSummaryLive.portfolioRiskPercentage}%</p>
          <p className="text-sm text-slate-500 mt-1">Portfolio Risk %</p>
        </div>
      </div>

      {/* DPD Bucket Distribution */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {dpdBucketsDisplay.map((bucket, index) => {
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
            {dpdBucketsDisplay.map((bucket, index) => {
              const colors = getBucketColor(bucket.color);
              const maxCount = Math.max(...dpdBucketsDisplay.map(b => b.count));
              const barWidth = (bucket.count / (maxCount || 1)) * 100;
              
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
            {dpdBucketsDisplay.map((bucket, index) => {
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
              ₹{(dpdBucketsDisplay.reduce((sum, b) => sum + b.outstanding, 0) / 10000000).toFixed(2)}Cr
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
                      <div className="flex items-center gap-2 relative">
                        <button
                          onClick={() => handleViewLoan(loan.id)}
                          className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Loan"
                        >
                          <Eye className="w-4 h-4 text-slate-600" />
                        </button>
                        <button
                          onClick={() => handleAssignRecovery(loan.id)}
                          className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Assign Recovery"
                        >
                          <UserCheck className="w-4 h-4 text-slate-600" />
                        </button>
                        <button
                          onClick={() => handleSendReminder(loan.id)}
                          className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Send Reminder"
                        >
                          <Bell className="w-4 h-4 text-slate-600" />
                        </button>

                        <div className="relative">
                          <button
                            onClick={() => setMenuOpenFor(menuOpenFor === loan.id ? null : loan.id)}
                            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                            title="More"
                          >
                            <MoreVertical className="w-4 h-4 text-slate-600" />
                          </button>
                          {menuOpenFor === loan.id && (
                            <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-md shadow-lg z-50">
                              <button
                                onClick={() => { handleViewLoan(loan.id); setMenuOpenFor(null); }}
                                className="w-full text-left px-3 py-2 hover:bg-slate-50"
                              >
                                View Loan
                              </button>
                              <button
                                onClick={() => { handleAssignRecovery(loan.id); setMenuOpenFor(null); }}
                                className="w-full text-left px-3 py-2 hover:bg-slate-50"
                              >
                                Assign Recovery
                              </button>
                              <button
                                onClick={() => { handleSendReminder(loan.id); setMenuOpenFor(null); }}
                                className="w-full text-left px-3 py-2 hover:bg-slate-50"
                              >
                                Send Reminder
                              </button>
                            </div>
                          )}
                        </div>
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