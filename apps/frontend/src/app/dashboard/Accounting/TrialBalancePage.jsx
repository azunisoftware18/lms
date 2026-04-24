import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  Search, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  Scale
} from 'lucide-react';

export default function TrialBalancePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [reportDate, setReportDate] = useState('2026-04-23');

  // Mock Ledger Data tailored for a retail boutique
  const ledgerAccounts = [
    { code: '1010', name: 'Cash on Hand', type: 'Asset', debit: 15000, credit: 0 },
    { code: '1020', name: 'HDFC Current Account', type: 'Asset', debit: 125000, credit: 0 },
    { code: '1200', name: 'Inventory - Premium Suits', type: 'Asset', debit: 350000, credit: 0 },
    { code: '2010', name: 'Accounts Payable - Fabric Suppliers', type: 'Liability', debit: 0, credit: 85000 },
    { code: '3010', name: "Owner's Equity", type: 'Equity', debit: 0, credit: 200000 },
    { code: '4010', name: 'Sales Revenue - Suits & Apparel', type: 'Revenue', debit: 0, credit: 280000 },
    { code: '5010', name: 'Rent Expense - Boutique', type: 'Expense', debit: 45000, credit: 0 },
    { code: '5020', name: 'Utilities & Maintenance', type: 'Expense', debit: 5000, credit: 0 },
    { code: '5030', name: 'Staff Salaries', type: 'Expense', debit: 25000, credit: 0 },
  ];

  // Filter accounts based on search
  const filteredAccounts = ledgerAccounts.filter(acc => 
    acc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    acc.code.includes(searchTerm)
  );

  // Calculate Totals
  const { totalDebit, totalCredit } = useMemo(() => {
    return filteredAccounts.reduce((acc, curr) => ({
      totalDebit: acc.totalDebit + curr.debit,
      totalCredit: acc.totalCredit + curr.credit
    }), { totalDebit: 0, totalCredit: 0 });
  }, [filteredAccounts]);

  const isBalanced = totalDebit === totalCredit;

  // Helper for pill colors based on account type
  const getTypeColor = (type) => {
    switch(type) {
      case 'Asset': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Liability': return 'bg-red-100 text-red-800 border-red-200';
      case 'Equity': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Revenue': return 'bg-green-100 text-green-800 border-green-200';
      case 'Expense': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Trial Balance</h1>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                <Calendar className="w-4 h-4" /> As of {new Date(reportDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm">
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Debits</h3>
                <p className="text-3xl font-bold text-gray-900">
                  ₹{totalDebit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <TrendingDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Credits</h3>
                <p className="text-3xl font-bold text-gray-900">
                  ₹{totalCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl shadow-sm border ${isBalanced ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <h3 className={`text-sm font-medium mb-1 ${isBalanced ? 'text-green-700' : 'text-red-700'}`}>
              Balance Status
            </h3>
            <p className={`text-3xl font-bold ${isBalanced ? 'text-green-700' : 'text-red-700'}`}>
              ₹{Math.abs(totalDebit - totalCredit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
            <p className={`text-xs mt-2 font-medium ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
              {isBalanced ? '✓ Books are perfectly balanced' : '⚠ Out of balance! Please review entries.'}
            </p>
          </div>
        </div>

        {/* Trial Balance Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Table Toolbar */}
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-gray-500" />
              General Ledger Accounts
            </h2>
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>
          
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                  <th className="p-4 font-medium">Code</th>
                  <th className="p-4 font-medium">Account Name</th>
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium text-right">Debit (₹)</th>
                  <th className="p-4 font-medium text-right">Credit (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredAccounts.length > 0 ? (
                  filteredAccounts.map((acc) => (
                    <tr key={acc.code} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-sm text-gray-500">{acc.code}</td>
                      <td className="p-4 text-sm font-medium text-gray-900">{acc.name}</td>
                      <td className="p-4 text-sm">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getTypeColor(acc.type)}`}>
                          {acc.type}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-right text-gray-700">
                        {acc.debit > 0 ? acc.debit.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '-'}
                      </td>
                      <td className="p-4 text-sm text-right text-gray-700">
                        {acc.credit > 0 ? acc.credit.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500 text-sm">
                      No accounts found matching "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
              {/* Table Footer / Totals Row */}
              {filteredAccounts.length > 0 && (
                <tfoot className="bg-gray-50 border-t-2 border-gray-200 font-semibold text-gray-900">
                  <tr>
                    <td colSpan="3" className="p-4 text-right">Totals:</td>
                    <td className="p-4 text-right border-b-4 border-gray-400">
                      ₹{totalDebit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-right border-b-4 border-gray-400">
                      ₹{totalCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}