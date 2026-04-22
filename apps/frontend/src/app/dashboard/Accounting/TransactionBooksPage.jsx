import React, { useState, useEffect, useMemo } from 'react';
import { Plus, BookOpen, AlertCircle, ArrowRightLeft, CreditCard, Landmark } from 'lucide-react';

export default function TransactionBooksPage() {
  // ✅ Synchronously load accounts to prevent UI flicker
  const [accounts, setAccounts] = useState(() => {
    return JSON.parse(localStorage.getItem('accounts')) || [];
  });

  // ✅ Transactions (persist)
  const [transactions, setTransactions] = useState(() => {
    return JSON.parse(localStorage.getItem('transactions')) || [];
  });

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const [formData, setFormData] = useState({
    date: '',
    debitAccountId: '',
    creditAccountId: '',
    amount: '',
    type: 'GENERAL',
    description: ''
  });

  // 🔄 Handle Input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 🔥 Optimized Balance Calculation (Calculates all at once instead of looping per account)
  const accountBalances = useMemo(() => {
    const balances = {};
    
    // Initialize with opening balances
    accounts.forEach(acc => {
      balances[acc.id] = Number(acc.openingBalance) || 0;
    });

    // Apply all transactions in a single pass
    transactions.forEach(tx => {
      if (balances[tx.debitAccountId] !== undefined) {
        balances[tx.debitAccountId] += tx.amount;
      }
      if (balances[tx.creditAccountId] !== undefined) {
        balances[tx.creditAccountId] -= tx.amount;
      }
    });

    return balances;
  }, [accounts, transactions]);

  // 💾 Save Transaction
  const handleAddTransaction = () => {
    if (!accounts.length) {
      alert("Please create accounts first");
      return;
    }

    if (!formData.date || !formData.debitAccountId || !formData.creditAccountId || !formData.amount) {
      alert("Fill all required fields");
      return;
    }

    if (formData.debitAccountId === formData.creditAccountId) {
      alert("Debit and Credit cannot be same");
      return;
    }

    if (Number(formData.amount) <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      date: formData.date,
      debitAccountId: Number(formData.debitAccountId),
      creditAccountId: Number(formData.creditAccountId),
      amount: parseFloat(formData.amount),
      type: formData.type,
      description: formData.description
    };

    setTransactions(prev => [newTransaction, ...prev]);

    // Reset form
    setFormData({
      date: '',
      debitAccountId: '',
      creditAccountId: '',
      amount: '',
      type: 'GENERAL',
      description: ''
    });
  };

  // 🔍 Account Name Helper
  const getAccountName = (id) => {
    return accounts.find(a => a.id === Number(id))?.name || '-';
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex items-center gap-3 pb-4 border-b border-slate-200">
          <div className="p-2 bg-blue-50 rounded-xl">
            <BookOpen className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Transaction Books</h1>
            <p className="text-sm text-slate-500 font-medium">Record and track your financial movements</p>
          </div>
        </header>

        {/* ❗ No Account Warning */}
        {accounts.length === 0 && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl shadow-sm">
            <AlertCircle size={20} />
            <p className="font-medium">No accounts found. Please create accounts in the Master Setup before adding transactions.</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: FORM & BALANCES */}
          <div className="space-y-8 lg:col-span-1">
            
            {/* New Transaction Form */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <Plus size={20} className="text-blue-600"/>
                New Entry
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  >
                    <option value="GENERAL">General</option>
                    <option value="EMI">EMI</option>
                    <option value="DISBURSEMENT">Disbursement</option>
                    <option value="FORECLOSURE">Foreclosure</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Debit</label>
                    <select
                      name="debitAccountId"
                      value={formData.debitAccountId}
                      onChange={handleChange}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    >
                      <option value="">Select...</option>
                      {accounts.map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Credit</label>
                    <select
                      name="creditAccountId"
                      value={formData.creditAccountId}
                      onChange={handleChange}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    >
                      <option value="">Select...</option>
                      {accounts.map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                      ))}
                    </select>
                  </div>
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
                      className="w-full border border-slate-200 rounded-xl pl-8 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Brief details..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>

                <button
                  onClick={handleAddTransaction}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-md active:scale-95 mt-2"
                >
                  <Plus size={18} />
                  Post Transaction
                </button>
              </div>
            </div>

            {/* Live Account Balances */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Landmark size={20} className="text-indigo-600"/>
                Live Balances
              </h2>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {accounts.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No accounts to display</p>
                ) : (
                  accounts.map(acc => (
                    <div key={acc.id} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-medium text-slate-700 text-sm">{acc.name}</span>
                      <span className={`font-semibold ${accountBalances[acc.id] < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                        ₹{accountBalances[acc.id].toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: TRANSACTION LEDGER */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <ArrowRightLeft size={20} className="text-slate-500"/>
                  Recent Transactions
                </h2>
                <span className="text-sm font-semibold text-slate-500 bg-slate-200/50 px-3 py-1 rounded-full">
                  {transactions.length} Entries
                </span>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Date / Type</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">Debit</th>
                      <th className="px-6 py-4">Credit</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-12">
                          <div className="flex flex-col items-center justify-center text-slate-400">
                            <CreditCard size={48} className="mb-3 opacity-20" />
                            <p className="font-medium text-slate-500">No transactions yet</p>
                            <p className="text-xs mt-1">Use the form to record your first entry.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      transactions.map(tx => (
                        <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-slate-900">{tx.date}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{tx.type}</div>
                          </td>
                          <td className="px-6 py-4 text-slate-600 max-w-[200px] truncate">
                            {tx.description || <span className="italic text-slate-400">No description</span>}
                          </td>
                          <td className="px-6 py-4 font-medium text-red-600/90 bg-red-50/30">
                            {getAccountName(tx.debitAccountId)}
                          </td>
                          <td className="px-6 py-4 font-medium text-emerald-600/90 bg-emerald-50/30">
                            {getAccountName(tx.creditAccountId)}
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-slate-900">
                            ₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
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