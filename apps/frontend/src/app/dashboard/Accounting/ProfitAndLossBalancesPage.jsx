import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Activity, AlertCircle } from 'lucide-react';

export default function ProfitAndLossBalancesPage() {
  // ✅ Load Data from Local Storage
  const [accounts, setAccounts] = useState(() => {
    return JSON.parse(localStorage.getItem('accounts')) || [];
  });

  const [transactions, setTransactions] = useState(() => {
    return JSON.parse(localStorage.getItem('transactions')) || [];
  });

  // 🔥 Process P&L Data (Calculated in one pass for performance)
  const pnlData = useMemo(() => {
    let totalRevenue = 0;
    let totalExpense = 0;
    
    // 1. Filter out only Revenue and Expense accounts
    const revenueAccounts = accounts.filter(acc => acc.type === 'Revenue').map(acc => ({ ...acc, balance: 0 }));
    const expenseAccounts = accounts.filter(acc => acc.type === 'Expense').map(acc => ({ ...acc, balance: 0 }));

    // Helper maps for quick lookup
    const revMap = new Map(revenueAccounts.map(a => [a.id, a]));
    const expMap = new Map(expenseAccounts.map(a => [a.id, a]));

    // 2. Calculate balances based on transactions
    transactions.forEach(tx => {
      // Logic for Revenue (Credits increase revenue, Debits decrease it)
      if (revMap.has(tx.creditAccountId)) revMap.get(tx.creditAccountId).balance += tx.amount;
      if (revMap.has(tx.debitAccountId)) revMap.get(tx.debitAccountId).balance -= tx.amount;

      // Logic for Expenses (Debits increase expense, Credits decrease it)
      if (expMap.has(tx.debitAccountId)) expMap.get(tx.debitAccountId).balance += tx.amount;
      if (expMap.has(tx.creditAccountId)) expMap.get(tx.creditAccountId).balance -= tx.amount;
    });

    // 3. Aggregate Totals
    revenueAccounts.forEach(acc => totalRevenue += acc.balance);
    expenseAccounts.forEach(acc => totalExpense += acc.balance);

    const netProfit = totalRevenue - totalExpense;

    return {
      revenueAccounts: revenueAccounts.filter(a => a.balance !== 0), // Only show active accounts
      expenseAccounts: expenseAccounts.filter(a => a.balance !== 0), // Only show active accounts
      totalRevenue,
      totalExpense,
      netProfit,
      isProfit: netProfit >= 0
    };
  }, [accounts, transactions]);

  // Format currency helper
  const formatCurrency = (amount) => {
    return `₹${Math.abs(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-[1200px] mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <PieChart className="text-indigo-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Profit & Loss Statement</h1>
              <p className="text-sm text-slate-500 font-medium">Overview of your revenues and expenses</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-sm font-semibold text-slate-600 flex items-center gap-2">
            <Activity size={16} className="text-slate-400" />
            All Time
          </div>
        </header>

        {/* Missing Data Warning */}
        {accounts.length === 0 && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 text-amber-700 p-4 rounded-xl shadow-sm">
            <AlertCircle size={20} />
            <p className="font-medium">No accounts found. Data will populate once Master Accounts and Transactions are added.</p>
          </div>
        )}

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-1.5 bg-emerald-50 rounded-lg"><TrendingUp size={18} className="text-emerald-600"/></div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Revenue</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">{formatCurrency(pnlData.totalRevenue)}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-1.5 bg-rose-50 rounded-lg"><TrendingDown size={18} className="text-rose-600"/></div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Expenses</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">{formatCurrency(pnlData.totalExpense)}</p>
          </div>

          <div className={`p-6 rounded-2xl border shadow-sm ${pnlData.isProfit ? 'bg-emerald-600 border-emerald-700' : 'bg-rose-600 border-rose-700'}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-1.5 bg-white/20 rounded-lg"><DollarSign size={18} className="text-white"/></div>
              <h3 className="text-sm font-bold text-white/90 uppercase tracking-wider">
                {pnlData.isProfit ? 'Net Profit' : 'Net Loss'}
              </h3>
            </div>
            <p className="text-3xl font-bold text-white">{formatCurrency(pnlData.netProfit)}</p>
          </div>
        </div>

        {/* Detailed Breakdown Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Revenue Breakdown */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 bg-emerald-50/30 flex justify-between items-center">
              <h2 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                Operating Revenues
              </h2>
            </div>
            <div className="p-6 flex-1">
              {pnlData.revenueAccounts.length === 0 ? (
                <p className="text-slate-400 italic text-center py-8">No revenue recorded yet.</p>
              ) : (
                <div className="space-y-4">
                  {pnlData.revenueAccounts.map(acc => (
                    <div key={acc.id} className="flex justify-between items-center pb-3 border-b border-slate-100 last:border-0">
                      <span className="text-slate-700 font-medium">{acc.name}</span>
                      <span className="text-slate-900 font-semibold">{formatCurrency(acc.balance)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <span className="font-bold text-slate-700">Total Revenue</span>
              <span className="font-bold text-emerald-600 text-lg">{formatCurrency(pnlData.totalRevenue)}</span>
            </div>
          </div>

          {/* Expense Breakdown */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 bg-rose-50/30 flex justify-between items-center">
              <h2 className="text-lg font-bold text-rose-900 flex items-center gap-2">
                Operating Expenses
              </h2>
            </div>
            <div className="p-6 flex-1">
              {pnlData.expenseAccounts.length === 0 ? (
                <p className="text-slate-400 italic text-center py-8">No expenses recorded yet.</p>
              ) : (
                <div className="space-y-4">
                  {pnlData.expenseAccounts.map(acc => (
                    <div key={acc.id} className="flex justify-between items-center pb-3 border-b border-slate-100 last:border-0">
                      <span className="text-slate-700 font-medium">{acc.name}</span>
                      <span className="text-slate-900 font-semibold">{formatCurrency(acc.balance)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <span className="font-bold text-slate-700">Total Expenses</span>
              <span className="font-bold text-rose-600 text-lg">{formatCurrency(pnlData.totalExpense)}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}