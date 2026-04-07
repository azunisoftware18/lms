import React from 'react';

export default function RecoveryAssignment({ casesList = [], agents = [] }) {
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <h3 className="text-sm font-semibold">Assignment Overview</h3>
        <p className="text-sm text-slate-600 mt-2">Simple assignment view — use Recovery Cases table to assign agents.</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <h4 className="text-sm font-medium">Agents</h4>
        <ul className="text-sm text-slate-700 mt-2">
          {agents.map((a) => (
            <li key={a.id} className="flex justify-between py-2 border-b last:border-b-0">
              <span>{a.name}</span>
              <span className="text-slate-500">{a.activeCases} cases</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
