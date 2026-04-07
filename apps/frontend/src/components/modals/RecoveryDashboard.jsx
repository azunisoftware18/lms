import React from 'react';

export default function RecoveryDashboard({ metrics = {}, agents = [] }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="text-xs text-slate-500">Total Cases</div>
          <div className="text-lg font-semibold">{metrics.totalCases ?? 0}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="text-xs text-slate-500">Assigned Cases</div>
          <div className="text-lg font-semibold">{metrics.assignedCases ?? 0}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="text-xs text-slate-500">Pending Calls</div>
          <div className="text-lg font-semibold">{metrics.pendingCalls ?? 0}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="text-xs text-slate-500">Recovered Amount</div>
          <div className="text-lg font-semibold">₹{(metrics.recoveredAmount ?? 0).toLocaleString()}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="text-xs text-slate-500">Total Outstanding</div>
          <div className="text-lg font-semibold">₹{(metrics.totalOutstanding ?? 0).toLocaleString()}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="text-xs text-slate-500">Recovery %</div>
          <div className="text-lg font-semibold">{(metrics.recoveryPercentage ?? 0).toFixed(1)}%</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <h3 className="text-sm font-semibold mb-3">Top Agents</h3>
        <ul className="space-y-2 text-sm text-slate-700">
          {agents.map((a) => (
            <li key={a.id} className="flex justify-between">
              <span>{a.name}</span>
              <span className="text-slate-500">{a.activeCases} cases</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
