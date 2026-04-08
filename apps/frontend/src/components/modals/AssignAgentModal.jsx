import React, { useState } from 'react';

export default function AssignAgentModal({ open = false, onClose = () => {}, agents = [], onAssign = () => {}, loan = null }) {
  const [agentId, setAgentId] = useState(agents[0]?.id ?? '');
  if (!open) return null;

  return (
    <div>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg">
        <h3 className="text-lg font-semibold mb-3">Assign Agent</h3>
        <p className="text-sm text-slate-600 mb-4">Loan: {loan?.loanNumber}</p>
        <select value={agentId} onChange={(e) => setAgentId(e.target.value)} className="w-full p-2 border rounded">
          {agents.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-slate-100">Cancel</button>
          <button onClick={() => { onAssign(agentId); onClose(); }} className="px-4 py-2 rounded bg-blue-600 text-white">Assign</button>
        </div>
      </div>
    </div>
  );
}
