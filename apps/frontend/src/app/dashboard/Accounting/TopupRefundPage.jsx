import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCcw, ArrowUpCircle, ArrowDownCircle, Plus, AlertCircle, Wallet, History } from 'lucide-react';

export default function TopupRefundPage() {
  // ✅ Load Data from Local Storage
  const [accounts, setAccounts] = useState(() => {
    return JSON.parse(localStorage.getItem('accounts')) || [];
  });

  const [transactions, setTransactions] = useState(() => {
    return JSON.parse(localStorage.getItem('transactions')) || [];
  });

  // Sync to local storage on update
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], // Default to today
    type: 'TOPUP',
    debitAccountId: '',
    creditAccountId: '',
    amount: '',
    description: ''
  });

  // 🔄 Handle Input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔥 Process Topup & Refund Data
  const pageData = useMemo(() => {
    let totalTopups = 0;
    let totalRefunds = 0;
    
    // Filter only Topup and Refund transactions
    const relevantTransactions = transactions.filter(tx => 
      tx.type === 'TOPUP' || tx.type === 'REFUND'
    ).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort newest first

    relevantTransactions.forEach(tx => {
      if (tx.type === 'TOPUP') totalTopups += tx.amount;
      if (tx.type === 'REFUND') totalRefunds += tx.amount;
    });

    return {
      history: relevantTransactions,
      totalTopups,
      totalRefunds,
      netFlow: totalTopups - totalRefunds
    };
  }, [transactions]);

  // 💾 Save Transaction
  const handleAddEntry = () => {
    if (!accounts.length) {
      alert("Please create accounts in Master Setup first");
      return;
    }
    if (!formData.date || !formData.debitAccountId || !formData.creditAccountId || !formData.amount) {
      alert("Please fill all required fields");
      return;
    }
    if (formData.debitAccountId === formData.creditAccountId) {
      alert("Debit and Credit accounts cannot be the same");
      return;
    }
    if (Number(formData.amount) <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    const newEntry = {
      id: Date.now(),
      date: formData.date,
      debitAccountId: Number(formData.debitAccountId),
      creditAccountId: Number(formData.creditAccountId),
      amount: parseFloat(formData.amount),
      type: formData.type,
      description: formData.description || (formData.type === 'TOPUP' ? 'Wallet/Account Topup' : 'Processed Refund')
    };

    setTransactions(prev => [newEntry, ...prev]);

    // Reset form but keep the date and type
    setFormData(prev => ({
      ...prev,
      debitAccountId: '',
      creditAccountId: '',
      amount: '',
      description: ''
    }));
  };

  // 🔍 Account Name Helper
  const getAccountName = (id) => {
    return accounts.find(a => a.id === Number(id))?.name || '-';
  };

  // Format currency helper
  const formatCurrency = (amount) => {
    return `₹${Math.abs(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <RefreshCcw className="text-indigo-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Topups & Refunds</h1>
              <p className="text-sm text-slate-500 font-medium">Manage wallet recharges and customer refunds</p>
            </div>
          </div>
        </header>

        {/* Missing Data Warning */}
        {accounts.length === 0 && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 text-amber-700 p-4 rounded-xl shadow-sm">
            <AlertCircle size={20} />
            <p className="font-medium">No accounts found. Please create accounts in the Master Setup to begin making entries.</p>
          </div>
        )}

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-1.5 bg-emerald-50 rounded-lg"><ArrowUpCircle size={18} className="text-emerald-600"/></div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Topups</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">{formatCurrency(pageData.totalTopups)}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-1.5 bg-orange-50 rounded-lg"><ArrowDownCircle size={18} className="text-orange-600"/></div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Refunds</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">{formatCurrency(pageData.totalRefunds)}</p>
          </div>

          <div className="bg-indigo-600 p-6 rounded-2xl border border-indigo-700 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-1.5 bg-white/20 rounded-lg"><Wallet size={18} className="text-white"/></div>
              <h3 className="text-sm font-bold text-white/90 uppercase tracking-wider">Net Flow</h3>
            </div>
            <p className="text-3xl font-bold text-white">
              {pageData.netFlow < 0 ? '-' : ''}{formatCurrency(pageData.netFlow)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: QUICK ENTRY FORM */}
          <div className="space-y-8 lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <Plus size={20} className="text-indigo-600"/>
                Quick Entry
              </h2>
              
              <div className="space-y-4">
                {/* Type Toggle */}
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${formData.type === 'TOPUP' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setFormData({...formData, type: 'TOPUP'})}
                  >
                    Topup
                  </button>
                  <button
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${formData.type === 'REFUND' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setFormData({...formData, type: 'REFUND'})}
                  >
                    Refund
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    {formData.type === 'TOPUP' ? 'Receiving Account (Debit)' : 'Refunding From (Debit)'}
                  </label>
                  <select
                    name="debitAccountId"
                    value={formData.debitAccountId}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  >
                    <option value="">Select Account...</option>
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    {formData.type === 'TOPUP' ? 'Source Account (Credit)' : 'Customer/Party (Credit)'}
                  </label>
                  <select
                    name="creditAccountId"
                    value={formData.creditAccountId}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  >
                    <option value="">Select Account...</option>
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₹</span>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full border border-slate-200 rounded-xl pl-8 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Reference / Notes</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Transaction ID, Reason, etc."
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  />
                </div>

                <button
                  onClick={handleAddEntry}
                  className={`w-full flex items-center justify-center gap-2 text-white px-5 py-3 rounded-xl font-semibold transition-all shadow-md active:scale-95 mt-2 ${
                    formData.type === 'TOPUP' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-orange-500 hover:bg-orange-600'
                  }`}
                >
                  <Plus size={18} />
                  Record {formData.type === 'TOPUP' ? 'Topup' : 'Refund'}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: HISTORY LEDGER */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <History size={20} className="text-slate-500"/>
                  Activity Ledger
                </h2>
                <span className="text-sm font-semibold text-slate-500 bg-slate-200/50 px-3 py-1 rounded-full">
                  {pageData.history.length} Entries
                </span>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Details</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pageData.history.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-12">
                          <div className="flex flex-col items-center justify-center text-slate-400">
                            <RefreshCcw size={48} className="mb-3 opacity-20" />
                            <p className="font-medium text-slate-500">No Topups or Refunds recorded</p>
                            <p className="text-xs mt-1">Use the quick entry form to log your first transaction.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      pageData.history.map(tx => (
                        <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                            {tx.date}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                              tx.type === 'TOPUP' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                            }`}>
                              {tx.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-slate-900 font-medium">{tx.description}</div>
                            <div className="text-xs text-slate-500 mt-1 flex gap-2">
                              <span className="text-rose-500">Dr: {getAccountName(tx.debitAccountId)}</span>
                              <span className="text-emerald-500">Cr: {getAccountName(tx.creditAccountId)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-slate-900">
                            {formatCurrency(tx.amount)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}