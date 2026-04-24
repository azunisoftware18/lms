import React, { useState, useMemo } from 'react';

export default function ReconcileBankBalancePage() {
  // Initial mock data tailored for a retail/boutique business
  const [transactions, setTransactions] = useState([
    { id: 'TRX-001', date: '2026-04-20', description: 'Ailif Collection Daily Sales', amount: 12500.00, type: 'credit', cleared: false },
    { id: 'TRX-002', date: '2026-04-21', description: 'Vendor Payment - Premium Suits', amount: -4200.00, type: 'debit', cleared: true },
    { id: 'TRX-003', date: '2026-04-21', description: 'Boutique Maintenance & Utilities', amount: -350.00, type: 'debit', cleared: false },
    { id: 'TRX-004', date: '2026-04-22', description: 'Online Gateway Payout', amount: 8450.50, type: 'credit', cleared: false },
    { id: 'TRX-005', date: '2026-04-23', description: 'Fabric Supplier Invoice', amount: -2100.00, type: 'debit', cleared: false },
  ]);

  // Base statement balance (what the bank says you have)
  const statementBalance = 45800.00;

  // Toggle the cleared status of a transaction
  const toggleClearStatus = (id) => {
    setTransactions(transactions.map(trx => 
      trx.id === id ? { ...trx, cleared: !trx.cleared } : trx
    ));
  };

  // Calculate dynamic balances based on cleared transactions
  const { clearedBalance, difference } = useMemo(() => {
    const clearedTotal = transactions
      .filter(t => t.cleared)
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Assuming a starting balance before these transactions of 40,000
    const calculatedClearedBalance = 40000 + clearedTotal; 
    const calcDifference = statementBalance - calculatedClearedBalance;

    return { clearedBalance: calculatedClearedBalance, difference: calcDifference };
  }, [transactions, statementBalance]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reconcile Bank Balance</h1>
            <p className="text-sm text-gray-500 mt-1">Match your book transactions with your bank statement.</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Save for Later
            </button>
            <button className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm">
              Finish Reconciliation
            </button>
          </div>
        </div>

        {/* Balance Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Statement Ending Balance</h3>
            <p className="text-3xl font-bold text-gray-900">
              ₹{statementBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Cleared Balance</h3>
            <p className="text-3xl font-bold text-gray-900">
              ₹{clearedBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className={`p-6 rounded-xl shadow-sm border ${difference === 0 ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
            <h3 className={`text-sm font-medium mb-1 ${difference === 0 ? 'text-green-700' : 'text-orange-700'}`}>
              Difference
            </h3>
            <p className={`text-3xl font-bold ${difference === 0 ? 'text-green-700' : 'text-orange-700'}`}>
              ₹{Math.abs(difference).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
            {difference === 0 ? (
              <p className="text-xs text-green-600 mt-2 font-medium">Balances match perfectly! ✓</p>
            ) : (
              <p className="text-xs text-orange-600 mt-2 font-medium">Reconciliation required to reach 0.00</p>
            )}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h2 className="font-semibold text-gray-800">Unreconciled Transactions</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-sm text-gray-500">
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Description</th>
                  <th className="p-4 font-medium text-right">Payment (Debit)</th>
                  <th className="p-4 font-medium text-right">Deposit (Credit)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((trx) => (
                  <tr 
                    key={trx.id} 
                    className={`transition-colors hover:bg-gray-50 ${trx.cleared ? 'bg-blue-50/30' : ''}`}
                  >
                    <td className="p-4">
                      <button
                        onClick={() => toggleClearStatus(trx.id)}
                        className={`w-6 h-6 rounded flex items-center justify-center border transition-colors ${
                          trx.cleared 
                            ? 'bg-blue-600 border-blue-600 text-white' 
                            : 'bg-white border-gray-300 text-transparent hover:border-blue-400'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{trx.date}</td>
                    <td className="p-4 text-sm font-medium text-gray-900">{trx.description}</td>
                    <td className="p-4 text-sm text-right text-red-600 font-medium">
                      {trx.type === 'debit' ? `₹${Math.abs(trx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'}
                    </td>
                    <td className="p-4 text-sm text-right text-green-600 font-medium">
                      {trx.type === 'credit' ? `₹${trx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Table Footer Summary */}
          <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center text-sm">
            <span className="text-gray-500">
              Showing {transactions.length} transactions ({transactions.filter(t => t.cleared).length} cleared)
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}