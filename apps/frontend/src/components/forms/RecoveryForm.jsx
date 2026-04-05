import React, { useState } from "react";

export default function RecoveryForm({ onSubmit, onCancel }) {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(Number(amount || 0));
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="block text-sm font-medium text-slate-700 mb-1">Recovery Amount (₹)</label>
      <input
        type="number"
        min="1"
        step="1"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 border border-slate-300 rounded-lg"
        placeholder="Enter amount"
        autoFocus
      />
      <div className="flex justify-end gap-3 mt-6">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Save
        </button>
      </div>
    </form>
  );
}
