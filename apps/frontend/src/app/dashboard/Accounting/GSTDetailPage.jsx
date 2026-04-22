import React, { useState, useMemo } from 'react';
import { FileText, ArrowDownRight, ArrowUpRight, Scale, AlertCircle, Receipt, ShieldCheck } from 'lucide-react';

export default function GSTDetailPage() {
  // ✅ Load Data from Local Storage
  const [accounts] = useState(() => {
    return JSON.parse(localStorage.getItem('accounts')) || [];
  });

  const [transactions] = useState(() => {
    return JSON.parse(localStorage.getItem('transactions')) || [];
  });

  // 🔥 Process GST Data dynamically
  const gstData = useMemo(() => {
    // 1. Identify GST Accounts by name
    const gstAccounts = accounts.filter(acc => 
      acc.name.toUpperCase().includes('GST') || 
      acc.name.toUpperCase().includes('CGST') || 
      acc.name.toUpperCase().includes('SGST') || 
      acc.name.toUpperCase().includes('IGST')
    ).map(acc => ({ ...acc, balance: 0 }));

    const gstMap = new Map(gstAccounts.map(a => [a.id, a]));

    // 2. Calculate balances based on transactions
    transactions.forEach(tx => {
      // Debits increase Input GST (Assets) and decrease Output GST (Liabilities)
      if (gstMap.has(tx.debitAccountId)) {
        gstMap.get(tx.debitAccountId).balance += tx.amount;
      }
      // Credits increase Output GST (Liabilities) and decrease Input GST (Assets)
      if (gstMap.has(tx.creditAccountId)) {
        gstMap.get(tx.creditAccountId).balance -= tx.amount;
      }
    });

    // 3. Categorize into Input (ITC) and Output (Liability)
    // Assuming accounts with "Input" in name or positive Debit balances are ITC
    // Assuming accounts with "Output" in name or negative Debit (Credit) balances are Liability
    let totalInput = 0;
    let totalOutput = 0;
    const inputAccounts = [];
    const outputAccounts = [];

    gstAccounts.forEach(acc => {
      const isExplicitInput = acc.name.toUpperCase().includes('INPUT');
      const isExplicitOutput = acc.name.toUpperCase().includes('OUTPUT');

      if (isExplicitInput || acc.balance > 0) {
        inputAccounts.push(acc);
        totalInput += Math.abs(acc.balance);
      } else if (isExplicitOutput || acc.balance < 0) {
        outputAccounts.push(acc);
        totalOutput += Math.abs(acc.balance);
      }
    });

    const netPayable = totalOutput - totalInput;

    return {
      inputAccounts,
      outputAccounts,
      totalInput,
      totalOutput,
      netPayable,
      hasGSTAccounts: gstAccounts.length > 0
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
            <div className="p-2 bg-blue-50 rounded-xl">
              <Receipt className="text-blue-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">GST Tax Summary</h1>
              <p className="text-sm text-slate-500 font-medium">Auto-calculated Input Tax Credit & Liability</p>
            </div>
          </div>
          <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-md">
            <FileText size={16} />
            Generate Return File
          </div>
        </header>

        {/* Warning if no GST Accounts */}
        {!gstData.hasGSTAccounts && (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 text-blue-700 p-4 rounded-xl shadow-sm">
            <AlertCircle size={20} />
            <p className="font-medium text-sm">
              No GST accounts detected. To track GST, ensure your account names in Master Setup include "GST", "CGST", "SGST", or "IGST" (e.g., "Input CGST", "Output IGST").
            </p>
          </div>
        )}

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-1.5 bg-emerald-50 rounded-lg"><ArrowDownRight size={18} className="text-emerald-600"/></div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Input GST (ITC)</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">{formatCurrency(gstData.totalInput)}</p>
            <p className="text-xs text-slate-400 mt-2 font-medium">Taxes paid on purchases</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-1.5 bg-rose-50 rounded-lg"><ArrowUpRight size={18} className="text-rose-600"/></div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Output GST</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">{formatCurrency(gstData.totalOutput)}</p>
            <p className="text-xs text-slate-400 mt-2 font-medium">Taxes collected on sales</p>
          </div>

          <div className={`p-6 rounded-2xl border shadow-sm ${gstData.netPayable > 0 ? 'bg-rose-600 border-rose-700' : 'bg-emerald-600 border-emerald-700'}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-1.5 bg-white/20 rounded-lg"><Scale size={18} className="text-white"/></div>
              <h3 className="text-sm font-bold text-white/90 uppercase tracking-wider">
                {gstData.netPayable > 0 ? 'Net GST Payable' : 'ITC Carried Forward'}
              </h3>
            </div>
            <p className="text-3xl font-bold text-white">{formatCurrency(gstData.netPayable)}</p>
            <p className="text-xs text-white/70 mt-2 font-medium">
              {gstData.netPayable > 0 ? 'Amount to be paid to Govt.' : 'Excess credit available'}
            </p>
          </div>
        </div>

        {/* Detailed Breakdown Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Input GST Breakdown */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                Input Tax Credit Ledger
              </h2>
            </div>
            <div className="p-6 flex-1">
              {gstData.inputAccounts.length === 0 ? (
                <p className="text-slate-400 italic text-center py-8">No Input GST recorded yet.</p>
              ) : (
                <div className="space-y-4">
                  {gstData.inputAccounts.map(acc => (
                    <div key={acc.id} className="flex justify-between items-center pb-3 border-b border-slate-100 last:border-0">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-emerald-500"/>
                        <span className="text-slate-700 font-medium">{acc.name}</span>
                      </div>
                      <span className="text-slate-900 font-semibold">{formatCurrency(acc.balance)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Output GST Breakdown */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                Tax Liability Ledger
              </h2>
            </div>
            <div className="p-6 flex-1">
              {gstData.outputAccounts.length === 0 ? (
                <p className="text-slate-400 italic text-center py-8">No Output GST recorded yet.</p>
              ) : (
                <div className="space-y-4">
                  {gstData.outputAccounts.map(acc => (
                    <div key={acc.id} className="flex justify-between items-center pb-3 border-b border-slate-100 last:border-0">
                      <div className="flex items-center gap-2">
                        <Receipt size={16} className="text-rose-400"/>
                        <span className="text-slate-700 font-medium">{acc.name}</span>
                      </div>
                      <span className="text-slate-900 font-semibold">{formatCurrency(acc.balance)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}