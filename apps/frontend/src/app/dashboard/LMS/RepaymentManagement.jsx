import React, { useState } from 'react';
import {
  Search,
  CreditCard,
  User,
  IndianRupee,
  Calendar,
  Wallet,
  Receipt,
  FileText,
  Filter,
  Sliders,
  ArrowRight,
  CheckCircle,
  Clock,
  Check,
  AlertCircle,
  Download,
  Printer,
  XCircle,
  ChevronDown,
  ChevronUp,
  History
} from 'lucide-react';

const RepaymentProcessing = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('collection');
  
  // State for loan search
  const [searchLoanNumber, setSearchLoanNumber] = useState('');
  const [searchedLoan, setSearchedLoan] = useState(null);
  const [searchError, setSearchError] = useState('');

  // State for payment collection
  const [paymentData, setPaymentData] = useState({
    amount: '',
    mode: 'upi'
  });

  // State for EMI selection
  const [selectedEMIs, setSelectedEMIs] = useState([]);

  // State for payment allocation
  const [allocationAmount, setAllocationAmount] = useState('');
  const [selectedEMIForAllocation, setSelectedEMIForAllocation] = useState(null);

  // State for payment history
  const [paymentHistory, setPaymentHistory] = useState([]);

  // State for filters
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [branchFilter, setBranchFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Mock loan database
  const mockLoanDatabase = [
    {
      accountNumber: 'LN-2024-001234',
      customerName: 'Rajesh Kumar Sharma',
      loanAmount: '15,00,000',
      emiAmount: '32,450',
      outstandingBalance: '12,45,678',
      nextEMIDue: '15 Apr 2024',
      status: 'ACTIVE',
      branch: 'Main Branch'
    },
    {
      accountNumber: 'LN-2024-005678',
      customerName: 'Priya Singh',
      loanAmount: '25,00,000',
      emiAmount: '42,850',
      outstandingBalance: '18,90,456',
      nextEMIDue: '20 Apr 2024',
      status: 'ACTIVE',
      branch: 'North Branch'
    },
    {
      accountNumber: 'LN-2024-009012',
      customerName: 'Amit Patel',
      loanAmount: '10,00,000',
      emiAmount: '28,450',
      outstandingBalance: '7,34,890',
      nextEMIDue: '10 Apr 2024',
      status: 'ACTIVE',
      branch: 'South Branch'
    }
  ];

  // Mock EMI schedule
  const mockEMISchedule = [
    { number: 1, dueDate: '15 Jan 2024', amount: '32,450', status: 'Paid' },
    { number: 2, dueDate: '15 Feb 2024', amount: '32,450', status: 'Paid' },
    { number: 3, dueDate: '15 Mar 2024', amount: '32,450', status: 'Paid' },
    { number: 4, dueDate: '15 Apr 2024', amount: '32,450', status: 'Due' },
    { number: 5, dueDate: '15 May 2024', amount: '32,450', status: 'Due' },
    { number: 6, dueDate: '15 Jun 2024', amount: '32,450', status: 'Due' },
    { number: 7, dueDate: '15 Jul 2024', amount: '32,450', status: 'Due' },
    { number: 8, dueDate: '15 Aug 2024', amount: '32,450', status: 'Due' }
  ];

  // Mock payment history
  const mockPaymentHistory = [
    {
      transactionId: 'TXN-2024-001',
      loanNumber: 'LN-2024-001234',
      customerName: 'Rajesh Kumar Sharma',
      paymentAmount: '32,450',
      paymentMode: 'UPI',
      paymentDate: '15 Mar 2024',
      status: 'Completed'
    },
    {
      transactionId: 'TXN-2024-002',
      loanNumber: 'LN-2024-005678',
      customerName: 'Priya Singh',
      paymentAmount: '42,850',
      paymentMode: 'Bank Transfer',
      paymentDate: '20 Mar 2024',
      status: 'Completed'
    },
    {
      transactionId: 'TXN-2024-003',
      loanNumber: 'LN-2024-009012',
      customerName: 'Amit Patel',
      paymentAmount: '28,450',
      paymentMode: 'Cash',
      paymentDate: '10 Mar 2024',
      status: 'Completed'
    }
  ];

  // Tabs configuration
  const tabs = [
    { id: 'collection', label: 'Payment Collection', icon: Wallet },
    { id: 'history', label: 'Payment History', icon: FileText },
    { id: 'allocation', label: 'Payment Allocation', icon: Sliders }
  ];

  // Payment modes
  const paymentModes = [
    { id: 'upi', label: 'UPI', icon: Wallet },
    { id: 'cash', label: 'Cash', icon: IndianRupee },
    { id: 'bank_transfer', label: 'Bank Transfer', icon: CreditCard },
    { id: 'nach', label: 'NACH', icon: Clock }
  ];

  // Handle search loan
  const handleSearchLoan = () => {
    setSearchError('');
    const foundLoan = mockLoanDatabase.find(
      loan => loan.accountNumber === searchLoanNumber
    );

    if (foundLoan) {
      setSearchedLoan(foundLoan);
      setPaymentData({ amount: foundLoan.emiAmount, mode: 'upi' });
      setSelectedEMIs([]);
    } else {
      setSearchError('Loan account number not found');
      setSearchedLoan(null);
    }
  };

  // Handle EMI selection
  const toggleEMISelection = (emiNumber) => {
    if (selectedEMIs.includes(emiNumber)) {
      setSelectedEMIs(selectedEMIs.filter(num => num !== emiNumber));
    } else {
      setSelectedEMIs([...selectedEMIs, emiNumber]);
    }
  };

  // Handle collect payment
  const handleCollectPayment = () => {
    if (!paymentData.amount) {
      alert('Please enter payment amount');
      return;
    }

    if (selectedEMIs.length === 0) {
      alert('Please select at least one EMI to pay');
      return;
    }

    // Calculate total selected EMI amount
    const totalAmount = selectedEMIs.reduce((sum, emiNum) => {
      const emi = mockEMISchedule.find(e => e.number === emiNum);
      return sum + parseInt(emi.amount.replace(/,/g, ''));
    }, 0);

    if (parseInt(paymentData.amount.replace(/,/g, '')) < totalAmount) {
      alert('Payment amount is less than selected EMI total');
      return;
    }

    // Create new payment record
    const newPayment = {
      transactionId: 'TXN-' + Date.now(),
      loanNumber: searchedLoan.accountNumber,
      customerName: searchedLoan.customerName,
      paymentAmount: paymentData.amount,
      paymentMode: paymentModes.find(m => m.id === paymentData.mode)?.label,
      paymentDate: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      status: 'Completed'
    };

    setPaymentHistory([newPayment, ...paymentHistory]);
    alert('Payment collected successfully!');
  };

  // Handle generate receipt
  const handleGenerateReceipt = () => {
    alert('Receipt generated successfully!');
  };

  // Handle allocate payment
  const handleAllocatePayment = () => {
    if (!allocationAmount) {
      alert('Please enter allocation amount');
      return;
    }

    if (!selectedEMIForAllocation) {
      alert('Please select an EMI for allocation');
      return;
    }

    alert(`Payment of ₹${allocationAmount} allocated to EMI #${selectedEMIForAllocation}`);
  };

  // Handle adjust payment
  const handleAdjustPayment = () => {
    alert('Payment adjustment completed');
  };

  // Handle filter payments
  const handleFilterPayments = () => {
    alert('Applying filters...');
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setDateRange({ start: '', end: '' });
    setBranchFilter('');
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Repayment Processing</h1>
        <p className="text-slate-600 mt-1">Record and manage loan repayments</p>
      </div>

      {/* Loan Search Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Loan Account Number
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchLoanNumber}
                onChange={(e) => setSearchLoanNumber(e.target.value)}
                placeholder="Enter loan account number"
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSearchLoan()}
              />
            </div>
            {searchError && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {searchError}
              </p>
            )}
          </div>
          <button
            onClick={handleSearchLoan}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors md:self-center"
          >
            <Search className="w-4 h-4" />
            Search Loan
          </button>
        </div>
      </div>

      {/* Loan Summary Card - Only show when loan is searched */}
      {searchedLoan && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-800">Loan Summary</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                <CreditCard className="w-4 h-4 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Loan Account Number</p>
                <p className="font-medium text-slate-800 truncate">{searchedLoan.accountNumber}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Customer Name</p>
                <p className="font-medium text-slate-800 truncate">{searchedLoan.customerName}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                <IndianRupee className="w-4 h-4 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Loan Amount</p>
                <p className="font-medium text-slate-800">₹{searchedLoan.loanAmount}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                <IndianRupee className="w-4 h-4 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500">EMI Amount</p>
                <p className="font-medium text-slate-800">₹{searchedLoan.emiAmount}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                <IndianRupee className="w-4 h-4 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Outstanding Balance</p>
                <p className="font-medium text-slate-800">₹{searchedLoan.outstandingBalance}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Next EMI Due Date</p>
                <p className="font-medium text-slate-800">{searchedLoan.nextEMIDue}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Navigation - Only show when loan is searched */}
      {searchedLoan && (
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
      )}

      {/* Tab Content - Only show when loan is searched */}
      {searchedLoan && (
        <div className="space-y-6">
          {/* Tab 1: Payment Collection */}
          {activeTab === 'collection' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Payment Form Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <Wallet className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-800">Payment Details</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Payment Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={paymentData.amount}
                      onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter amount"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Payment Mode
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {paymentModes.map((mode) => {
                        const Icon = mode.icon;
                        return (
                          <button
                            key={mode.id}
                            onClick={() => setPaymentData({...paymentData, mode: mode.id})}
                            className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                              paymentData.mode === mode.id
                                ? 'border-blue-600 bg-blue-50 text-blue-600'
                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-sm">{mode.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleCollectPayment}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Wallet className="w-4 h-4" />
                      Collect Payment
                    </button>
                    <button
                      onClick={handleGenerateReceipt}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Receipt className="w-4 h-4" />
                      Generate Receipt
                    </button>
                  </div>
                </div>
              </div>

              {/* EMI Selection Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-800">EMI Schedule</h2>
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {mockEMISchedule.map((emi) => (
                    <div
                      key={emi.number}
                      className={`p-3 rounded-lg border transition-all ${
                        emi.status === 'Paid'
                          ? 'bg-green-50 border-green-200'
                          : selectedEMIs.includes(emi.number)
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {emi.status === 'Due' && (
                            <input
                              type="checkbox"
                              checked={selectedEMIs.includes(emi.number)}
                              onChange={() => toggleEMISelection(emi.number)}
                              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                            />
                          )}
                          <div>
                            <p className="font-medium text-slate-800">EMI #{emi.number}</p>
                            <p className="text-xs text-slate-500">Due: {emi.dueDate}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-slate-800">₹{emi.amount}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            emi.status === 'Paid'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {emi.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Payment History */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              {/* Filters Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center justify-between w-full"
                >
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-slate-800">Filters</h2>
                  </div>
                  {showFilters ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                
                {showFilters && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Date Range
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="date"
                          value={dateRange.start}
                          onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                          className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="date"
                          value={dateRange.end}
                          onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                          className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Branch
                      </label>
                      <select
                        value={branchFilter}
                        onChange={(e) => setBranchFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All Branches</option>
                        <option value="main">Main Branch</option>
                        <option value="north">North Branch</option>
                        <option value="south">South Branch</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Loan Account
                      </label>
                      <input
                        type="text"
                        placeholder="Search by loan number"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="md:col-span-3 flex gap-2">
                      <button
                        onClick={handleFilterPayments}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Filter className="w-4 h-4" />
                        Apply Filters
                      </button>
                      <button
                        onClick={handleResetFilters}
                        className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Reset
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment History Table */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Transaction ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Loan Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Customer Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Payment Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Payment Mode
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Payment Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {/* New payments */}
                      {paymentHistory.map((payment, index) => (
                        <tr key={`new-${index}`} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-slate-800">{payment.transactionId}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{payment.loanNumber}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{payment.customerName}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">₹{payment.paymentAmount}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{payment.paymentMode}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{payment.paymentDate}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      
                      {/* Mock payments */}
                      {mockPaymentHistory.map((payment, index) => (
                        <tr key={`mock-${index}`} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-slate-800">{payment.transactionId}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{payment.loanNumber}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{payment.customerName}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">₹{payment.paymentAmount}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{payment.paymentMode}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{payment.paymentDate}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {(paymentHistory.length === 0 && mockPaymentHistory.length === 0) && (
                  <div className="text-center py-8">
                    <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No payment history found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Payment Allocation */}
          {activeTab === 'allocation' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Allocation Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <Sliders className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-800">Allocate Payment</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Allocation Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={allocationAmount}
                      onChange={(e) => setAllocationAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter amount to allocate"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Select EMI for Allocation
                    </label>
                    <select
                      value={selectedEMIForAllocation || ''}
                      onChange={(e) => setSelectedEMIForAllocation(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select an EMI</option>
                      {mockEMISchedule
                        .filter(emi => emi.status === 'Due')
                        .map(emi => (
                          <option key={emi.number} value={emi.number}>
                            EMI #{emi.number} - Due: {emi.dueDate} - Amount: ₹{emi.amount}
                          </option>
                        ))}
                    </select>
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleAllocatePayment}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                      Allocate Payment
                    </button>
                    <button
                      onClick={handleAdjustPayment}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Sliders className="w-4 h-4" />
                      Adjust Payment
                    </button>
                  </div>
                </div>
              </div>

              {/* EMI List Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-800">EMI Schedule</h2>
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {mockEMISchedule.map((emi) => (
                    <div
                      key={emi.number}
                      className={`p-3 rounded-lg border ${
                        emi.status === 'Paid'
                          ? 'bg-green-50 border-green-200'
                          : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-800">EMI #{emi.number}</p>
                          <p className="text-xs text-slate-500">Due: {emi.dueDate}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-slate-800">₹{emi.amount}</p>
                          <p className="text-xs text-slate-500">
                            Outstanding: {emi.status === 'Paid' ? '₹0' : `₹${emi.amount}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent Payments Table */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-800">Recent Payments</h2>
          </div>
          <span className="text-sm text-slate-500">Last 10 transactions</span>
        </div>
        
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
                    Payment Mode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Amount Paid
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {[...paymentHistory, ...mockPaymentHistory].slice(0, 5).map((payment, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{payment.loanNumber}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{payment.customerName}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{payment.paymentMode}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">₹{payment.paymentAmount}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{payment.paymentDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepaymentProcessing;