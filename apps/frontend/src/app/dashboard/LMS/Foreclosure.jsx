import React, { useState } from 'react';
import {
  Search,
  CreditCard,
  User,
  IndianRupee,
  Calendar,
  Percent,
  Calculator,
  TrendingUp,
  FileText,
  CheckCircle,
  FileCheck,
  Download,
  ToggleLeft,
  ToggleRight,
  Clock,
  Check,
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  History
} from 'lucide-react';

const PrepaymentForeclosure = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('prepayment');
  
  // State for loan search
  const [searchLoanNumber, setSearchLoanNumber] = useState('');
  const [searchedLoan, setSearchedLoan] = useState(null);
  const [searchError, setSearchError] = useState('');

  // State for prepayment form
  const [prepaymentData, setPrepaymentData] = useState({
    amount: '',
    charges: '2.5',
    applyCharges: true
  });

  // State for prepayment calculation results
  const [prepaymentResults, setPrepaymentResults] = useState({
    updatedBalance: '',
    newEmi: '',
    remainingTenure: ''
  });

  // State for foreclosure calculation
  const [foreclosureData, setForeclosureData] = useState({
    outstandingPrincipal: '',
    accruedInterest: '',
    foreclosureCharges: '',
    totalPayable: ''
  });

  // State for confirmation
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [transactionRef, setTransactionRef] = useState('');
  const [loanStatus, setLoanStatus] = useState('');

  // State for transaction history
  const [transactionHistory, setTransactionHistory] = useState([]);

  // Mock loan database
  const mockLoanDatabase = [
    {
      accountNumber: 'LN-2024-001234',
      customerName: 'Rajesh Kumar Sharma',
      loanAmount: '15,00,000',
      interestRate: '8.5',
      tenure: '60',
      outstandingBalance: '12,45,678',
      nextEMIDate: '15 Apr 2024',
      status: 'ACTIVE',
      emiAmount: '32,450'
    },
    {
      accountNumber: 'LN-2024-005678',
      customerName: 'Priya Singh',
      loanAmount: '25,00,000',
      interestRate: '9.0',
      tenure: '84',
      outstandingBalance: '18,90,456',
      nextEMIDate: '20 Apr 2024',
      status: 'ACTIVE',
      emiAmount: '42,850'
    },
    {
      accountNumber: 'LN-2024-009012',
      customerName: 'Amit Patel',
      loanAmount: '10,00,000',
      interestRate: '8.0',
      tenure: '36',
      outstandingBalance: '7,34,890',
      nextEMIDate: '10 Apr 2024',
      status: 'ACTIVE',
      emiAmount: '28,450'
    }
  ];

  // Mock transaction history
  const mockTransactions = [
    {
      loanNumber: 'LN-2023-004567',
      customerName: 'Sunita Reddy',
      transactionType: 'Prepayment',
      amountPaid: '2,00,000',
      status: 'Completed',
      date: '15 Mar 2024'
    },
    {
      loanNumber: 'LN-2023-008901',
      customerName: 'Vikram Mehta',
      transactionType: 'Foreclosure',
      amountPaid: '8,50,000',
      status: 'Completed',
      date: '22 Feb 2024'
    }
  ];

  // Tabs configuration
  const tabs = [
    { id: 'prepayment', label: 'Prepayment', icon: IndianRupee },
    { id: 'foreclosure', label: 'Foreclosure Calculator', icon: Calculator },
    { id: 'confirmation', label: 'Confirmation', icon: CheckCircle }
  ];

  // Handle search loan
  const handleSearchLoan = () => {
    setSearchError('');
    const foundLoan = mockLoanDatabase.find(
      loan => loan.accountNumber === searchLoanNumber
    );

    if (foundLoan) {
      setSearchedLoan(foundLoan);
      setLoanStatus(foundLoan.status);
      setTransactionRef('TXN' + Math.floor(Math.random() * 1000000));
      
      // Reset forms
      setPrepaymentData({
        amount: '',
        charges: '2.5',
        applyCharges: true
      });
      setPrepaymentResults({
        updatedBalance: '',
        newEmi: '',
        remainingTenure: ''
      });
      setForeclosureData({
        outstandingPrincipal: foundLoan.outstandingBalance,
        accruedInterest: '12,450',
        foreclosureCharges: '31,142',
        totalPayable: '12,89,270'
      });
    } else {
      setSearchError('Loan account number not found');
      setSearchedLoan(null);
      setLoanStatus(null);
    }
  };

  // Handle calculate EMI for prepayment
  const handleCalculateEMI = () => {
    if (!prepaymentData.amount) {
      alert('Please enter prepayment amount');
      return;
    }

    // Mock calculation logic
    const prepaymentAmount = parseInt(prepaymentData.amount.replace(/,/g, ''));
    const currentBalance = parseInt(searchedLoan.outstandingBalance.replace(/,/g, ''));
    const updatedBalance = currentBalance - prepaymentAmount;
    
    // Calculate new EMI (simplified mock calculation)
    const newEmi = Math.round(updatedBalance * 0.0085);
    const remainingTenure = Math.round(updatedBalance / newEmi);

    setPrepaymentResults({
      updatedBalance: updatedBalance.toLocaleString('en-IN'),
      newEmi: newEmi.toLocaleString('en-IN'),
      remainingTenure: remainingTenure.toString()
    });
  };

  // Handle apply prepayment
  const handleApplyPrepayment = () => {
    if (!prepaymentResults.updatedBalance) {
      alert('Please calculate EMI first');
      return;
    }

    // Add to transaction history
    const newTransaction = {
      loanNumber: searchedLoan.accountNumber,
      customerName: searchedLoan.customerName,
      transactionType: 'Prepayment',
      amountPaid: prepaymentData.amount,
      status: 'Completed',
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    };

    setTransactionHistory([newTransaction, ...transactionHistory]);
    
    // Update loan outstanding balance
    setSearchedLoan({
      ...searchedLoan,
      outstandingBalance: prepaymentResults.updatedBalance
    });

    alert('Prepayment applied successfully!');
  };

  // Handle calculate foreclosure
  const handleCalculateForeclosure = () => {
    // Mock calculation logic
    const outstandingPrincipal = parseInt(searchedLoan.outstandingBalance.replace(/,/g, ''));
    const accruedInterest = Math.round(outstandingPrincipal * 0.01);
    const foreclosureCharges = Math.round(outstandingPrincipal * 0.025);
    const totalPayable = outstandingPrincipal + accruedInterest + foreclosureCharges;

    setForeclosureData({
      outstandingPrincipal: searchedLoan.outstandingBalance,
      accruedInterest: accruedInterest.toLocaleString('en-IN'),
      foreclosureCharges: foreclosureCharges.toLocaleString('en-IN'),
      totalPayable: totalPayable.toLocaleString('en-IN')
    });
  };

  // Handle proceed to confirmation
  const handleProceedToConfirmation = () => {
    setActiveTab('confirmation');
  };

  // Handle confirm foreclosure
  const handleConfirmForeclosure = () => {
    // Add to transaction history
    const newTransaction = {
      loanNumber: searchedLoan.accountNumber,
      customerName: searchedLoan.customerName,
      transactionType: 'Foreclosure',
      amountPaid: foreclosureData.totalPayable,
      status: 'Completed',
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    };

    setTransactionHistory([newTransaction, ...transactionHistory]);
    
    // Update loan status
    setLoanStatus('CLOSED');
    setSearchedLoan({
      ...searchedLoan,
      status: 'CLOSED',
      outstandingBalance: '0'
    });

    alert('Foreclosure confirmed successfully!');
  };

  // Handle download receipt
  const handleDownloadReceipt = () => {
    alert('Downloading closure receipt...');
  };

  // Handle generate NOC
  const handleGenerateNOC = () => {
    alert('NOC generated successfully!');
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Prepayment & Foreclosure</h1>
        <p className="text-slate-600 mt-1">Manage loan prepayments and foreclosure requests</p>
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-800">Loan Summary</h2>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
              loanStatus === 'ACTIVE' 
                ? 'bg-yellow-100 text-yellow-700' 
                : 'bg-green-100 text-green-700'
            }`}>
              {loanStatus}
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <Percent className="w-4 h-4 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Interest Rate</p>
                <p className="font-medium text-slate-800">{searchedLoan.interestRate}%</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Tenure</p>
                <p className="font-medium text-slate-800">{searchedLoan.tenure} months</p>
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
                <p className="text-xs text-slate-500">Next EMI Date</p>
                <p className="font-medium text-slate-800">{searchedLoan.nextEMIDate}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Navigation - Only show when loan is searched */}
      {searchedLoan && loanStatus === 'ACTIVE' && (
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

      {/* Tab Content - Only show when loan is searched and active */}
      {searchedLoan && loanStatus === 'ACTIVE' && (
        <div className="space-y-6">
          {/* Tab 1: Prepayment */}
          {activeTab === 'prepayment' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Prepayment Form Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <IndianRupee className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-800">Prepayment Details</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Prepayment Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={prepaymentData.amount}
                      onChange={(e) => setPrepaymentData({...prepaymentData, amount: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter amount"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Prepayment Charges (%)
                    </label>
                    <input
                      type="number"
                      value={prepaymentData.charges}
                      onChange={(e) => setPrepaymentData({...prepaymentData, charges: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter charges"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium text-slate-700">Apply Charges</span>
                    <button
                      onClick={() => setPrepaymentData({...prepaymentData, applyCharges: !prepaymentData.applyCharges})}
                      className="focus:outline-none"
                    >
                      {prepaymentData.applyCharges ? (
                        <ToggleRight className="w-6 h-6 text-blue-600" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-slate-400" />
                      )}
                    </button>
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleCalculateEMI}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Calculator className="w-4 h-4" />
                      Calculate EMI
                    </button>
                    <button
                      onClick={handleApplyPrepayment}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                      Apply Prepayment
                    </button>
                  </div>
                </div>
              </div>

              {/* Calculation Results Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-800">Recalculated EMI Details</h2>
                </div>
                
                {prepaymentResults.updatedBalance ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-600 mb-1">Updated Outstanding Balance</p>
                      <p className="text-2xl font-semibold text-blue-700">₹{prepaymentResults.updatedBalance}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">New EMI Amount</p>
                        <p className="font-medium text-slate-800">₹{prepaymentResults.newEmi}</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Remaining Tenure</p>
                        <p className="font-medium text-slate-800">{prepaymentResults.remainingTenure} months</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calculator className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">Enter amount and calculate EMI</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Foreclosure Calculator */}
          {activeTab === 'foreclosure' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Calculation Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-800">Foreclosure Calculation</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-slate-100">
                    <span className="text-slate-600">Outstanding Principal</span>
                    <span className="font-medium text-slate-800">₹{foreclosureData.outstandingPrincipal}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-slate-100">
                    <span className="text-slate-600">Accrued Interest</span>
                    <span className="font-medium text-slate-800">₹{foreclosureData.accruedInterest}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-slate-100">
                    <span className="text-slate-600">Foreclosure Charges</span>
                    <span className="font-medium text-orange-600">₹{foreclosureData.foreclosureCharges}</span>
                  </div>
                  
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-700">Total Payable Amount</span>
                      <span className="text-xl font-bold text-blue-600">₹{foreclosureData.totalPayable}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleCalculateForeclosure}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Calculator className="w-4 h-4" />
                      Calculate
                    </button>
                    <button
                      onClick={handleProceedToConfirmation}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      Proceed to Confirmation
                    </button>
                  </div>
                </div>
              </div>

              {/* Formula Explanation Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-800">Calculation Formula</h2>
                </div>
                
                <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-600">Outstanding Principal</span>
                    <span className="text-slate-400">+</span>
                    <span className="text-slate-600">Accrued Interest</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-600 ml-8">+</span>
                    <span className="text-slate-600">Foreclosure Charges</span>
                  </div>
                  <div className="border-t border-slate-200 my-2"></div>
                  <div className="flex items-center gap-2 font-medium text-blue-600">
                    <span>= Total Payable Amount</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-xs text-yellow-700 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Foreclosure charges are applicable as per loan agreement terms
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Foreclosure Confirmation */}
          {activeTab === 'confirmation' && (
            <div className="grid grid-cols-1 gap-6">
              {/* Payment Summary Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-800">Payment Summary</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Loan Account Number</p>
                    <p className="font-medium text-slate-800">{searchedLoan.accountNumber}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Customer Name</p>
                    <p className="font-medium text-slate-800">{searchedLoan.customerName}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Total Payable Amount</p>
                    <p className="font-medium text-slate-800">₹{foreclosureData.totalPayable}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Transaction Reference</p>
                    <p className="font-medium text-slate-800">{transactionRef}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="upi">UPI</option>
                    <option value="card">Debit/Credit Card</option>
                    <option value="cash">Cash</option>
                  </select>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleConfirmForeclosure}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Confirm Foreclosure
                  </button>
                  <button
                    onClick={handleDownloadReceipt}
                    className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Closure Receipt
                  </button>
                  <button
                    onClick={handleGenerateNOC}
                    className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <FileCheck className="w-4 h-4" />
                    Generate NOC
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Transaction History Table */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-800">Transaction History</h2>
          </div>
          <span className="text-sm text-slate-500">Total: {transactionHistory.length + mockTransactions.length}</span>
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
                    Transaction Type
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
                {/* New transactions */}
                {transactionHistory.map((transaction, index) => (
                  <tr key={`new-${index}`} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{transaction.loanNumber}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{transaction.customerName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.transactionType === 'Prepayment' 
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {transaction.transactionType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">₹{transaction.amountPaid}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{transaction.date}</td>
                  </tr>
                ))}
                
                {/* Mock transactions */}
                {mockTransactions.map((transaction, index) => (
                  <tr key={`mock-${index}`} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{transaction.loanNumber}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{transaction.customerName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.transactionType === 'Prepayment' 
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {transaction.transactionType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">₹{transaction.amountPaid}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{transaction.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {(transactionHistory.length === 0 && mockTransactions.length === 0) && (
            <div className="text-center py-8">
              <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No transaction history found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrepaymentForeclosure;