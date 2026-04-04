// components/tables/EMIScheduleTable.jsx
import React, { useState } from 'react';
import TableShell from './core/TableShell';
import TableHead from './core/TableHead';
import TableBody from './core/TableBody';
import TableLoader from './core/TableLoader';
import ActionMenu from '../common/ActionMenu';
import Pagination from '../common/Pagination';
import { Eye, Edit, Download, CheckCircle, Clock, AlertCircle, Calendar, CreditCard, FileText, Receipt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Component ka naam badal diya - ab ye EMIScheduleTableView hai
const EMIManagementTableView = ({ 
  data = [], 
  loading = false,
  onView,
  onEdit,
  onDownload,
  onPayEMI,
  onViewStatement,
  onDownloadReceipt
}) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Status Badge Component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      paid: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Paid',
        icon: CheckCircle
      },
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'Pending',
        icon: Clock
      },
      overdue: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: 'Overdue',
        icon: AlertCircle
      },
      partial: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        label: 'Partial',
        icon: Clock
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`px-3 py-1 inline-flex items-center gap-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        <Icon size={12} />
        {config.label}
      </span>
    );
  };

  // If EMI items include `loanStatus`, show loan-status filters restricted to allowed list.
  const allowedLoanStatuses = ['active', 'closed', 'delinquent', 'written_off', 'defaulted'];

  const hasLoanStatus = data.some((d) => !!d.loanStatus);

  const filterOptions = hasLoanStatus
    ? [
        { value: '', label: 'All Status', count: data.length },
        ...allowedLoanStatuses.map((s) => ({
          value: s,
          label: s
            .replace(/_/g, ' ')
            .split(' ')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' '),
          count: data.filter((d) => d.loanStatus === s).length,
        })),
      ]
    : [
        { value: '', label: 'All Status', count: data.length },
        { value: 'paid', label: 'Paid', count: data.filter(d => d.status === 'paid').length },
        { value: 'pending', label: 'Pending', count: data.filter(d => d.status === 'pending').length },
        { value: 'overdue', label: 'Overdue', count: data.filter(d => d.status === 'overdue').length },
      ];

  // Table columns
  const columns = [
    {
      header: 'Loan',
      accessor: 'loanNumber',
      render: (value, row) => (
        <div className="font-medium text-sm text-slate-700">
          <div>{row.loanNumber || row.loanApplication?.loanNumber || 'N/A'}</div>
          <div className="text-xs text-slate-400">{row.customerName || row.loanApplication?.customer?.firstName || ''}</div>
        </div>
      ),
    },
    {
      header: 'EMI No.',
      accessor: 'emiNumber',
      render: (value) => (
        <span className="font-mono text-xs font-medium text-indigo-600">
          #{value}
        </span>
      )
    },
    {
      header: 'Due Date',
      accessor: 'dueDate',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">{formatDate(value)}</p>
            {row.isToday && (
              <span className="text-xs text-indigo-600">Today</span>
            )}
          </div>
        </div>
      )
    },
    {
      header: 'Principal',
      accessor: 'principal',
      render: (value) => (
        <span className="text-gray-900">
          {formatCurrency(value)}
        </span>
      )
    },
    {
      header: 'Interest',
      accessor: 'interest',
      render: (value) => (
        <span className="text-gray-600">
          {formatCurrency(value)}
        </span>
      )
    },
    {
      header: 'EMI Amount',
      accessor: 'emiAmount',
      render: (value) => (
        <span className="font-semibold text-indigo-600">
          {formatCurrency(value)}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => <StatusBadge status={value} />
    }
  ];

  // Render actions for each row
  const renderActions = (row) => {
    const rowActions = [
      {
        label: 'View EMIs',
        icon: <FileText size={16} />,
        onClick: () => {
          // Prefer loanApplicationId, fallback to loanNumber
          const loanId = row.loanApplicationId || row.loanId || row.loan?.id;
          const loanNumber = row.loanNumber || row.loanApplication?.loanNumber || row.loan?.loanNumber;
          if (loanId) navigate(`/los/emi-schedule?loanId=${loanId}`);
          else if (loanNumber) navigate(`/los/emi-schedule?loanNumber=${encodeURIComponent(loanNumber)}`);
          else navigate(`/los/emi-schedule`);
        }
      },
      {
        label: 'View Details',
        icon: <Eye size={16} />,
        onClick: () => onView?.(row)
      }
    ];

    if (row.status === 'pending' || row.status === 'overdue') {
      rowActions.push({
        label: 'Pay Now',
        icon: <CreditCard size={16} />,
        onClick: () => onPayEMI?.(row)
      });
    }

    if (row.status !== 'paid') {
      rowActions.push({
        label: 'Edit EMI',
        icon: <Edit size={16} />,
        onClick: () => onEdit?.(row)
      });
    }

    if (row.status === 'paid') {
      rowActions.push({
        label: 'Download Receipt',
        icon: <Download size={16} />,
        onClick: () => onDownload?.(row)
      });
    }

    rowActions.push({ divider: true });

    rowActions.push({
      label: 'View Statement',
      icon: <FileText size={16} />,
      onClick: () => onViewStatement?.(row)
    });

    rowActions.push({
      label: 'Download Summary',
      icon: <Receipt size={16} />,
      onClick: () => onDownloadReceipt?.(row)
    });

    return (
      <div className="flex justify-end">
        <ActionMenu 
          actions={rowActions}
          align="right"
        />
      </div>
    );
  };

  // Filter and search data
  const filteredData = data.filter(item => {
    // If filtering by loanStatus (when present), use loanStatus; otherwise fallback to EMI status
    if (filterStatus) {
      if (item.loanStatus) {
        if (item.loanStatus !== filterStatus) return false;
      } else if (item.status !== filterStatus) return false;
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        item?.emiNumber?.toString().toLowerCase().includes(searchLower) ||
        formatDate(item?.dueDate).toLowerCase().includes(searchLower) ||
        item?.principal?.toString().includes(searchLower) ||
        item?.interest?.toString().includes(searchLower) ||
        item?.emiAmount?.toString().includes(searchLower) ||
        item?.status?.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  // Pagination
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Debug - check if data exists
  console.log('Filtered Data:', filteredData.length);
  console.log('Total Pages:', totalPages);

  // Reset to first page when filter changes
  const handleFilterChange = (value) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    console.log('Page changed to:', page);
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    console.log('Page size changed to:', size);
    setPageSize(size);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <TableShell>
        <TableHead 
          columns={columns}
          title="EMI Schedule"
          search={search}
          setSearch={handleSearchChange}
          filterValue={filterStatus}
          setFilterValue={handleFilterChange}
          filterOptions={filterOptions}
        />
        <TableLoader colSpan={columns.length + 1} />
      </TableShell>
    );
  }

  return (
    <>
      <TableShell>
        <TableHead 
          columns={columns}
          title="EMI Management"
          search={search}
          setSearch={handleSearchChange}
          filterValue={filterStatus}
          setFilterValue={handleFilterChange}
          filterOptions={filterOptions}
        />
        
        <TableBody 
          columns={columns}
          data={paginatedData}
          renderActions={renderActions}
        />
      </TableShell>

      {/* Pagination - Only show if there's data */}
      {filteredData.length > 0 ? (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          showPageSize={true}
          showTotal={true}
        />
      ) : (
        <div className="text-center py-4 text-gray-500">
          No data to display
        </div>
      )}
    </>
  );
};

export default EMIManagementTableView;