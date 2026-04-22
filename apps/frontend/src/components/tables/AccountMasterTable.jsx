import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const accountTypeColors = {
  ASSET: 'bg-purple-100 text-purple-700',
  LIABILITY: 'bg-orange-100 text-orange-700',
  INCOME: 'bg-green-100 text-green-700',
  EXPENSE: 'bg-red-100 text-red-700'
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount || 0);
};

export default function AccountMasterTable({ accounts, onEdit, onDelete }) {
  return (
    <table className="w-full bg-white rounded-xl overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-3 text-left">Code</th>
          <th className="p-3 text-left">Name</th>
          <th className="p-3 text-left">Type</th>
          <th className="p-3 text-left">Parent</th>
          <th className="p-3 text-right">Opening Balance</th>
          <th className="p-3 text-center">Actions</th>
        </tr>
      </thead>

      <tbody>
        {accounts.map(acc => (
          <tr key={acc.id} className="border-t">
            <td className="p-3">{acc.code}</td>
            <td className="p-3">{acc.name}</td>
            <td className="p-3">
              <span className={`px-2 py-1 rounded text-xs ${accountTypeColors[acc.type]}`}>
                {acc.type}
              </span>
            </td>
            <td className="p-3">{acc.parentName}</td>
            <td className="p-3 text-right">{formatCurrency(acc.openingBalance)}</td>
            <td className="p-3 flex gap-2 justify-center">
              <button onClick={() => onEdit(acc)}><Edit size={16} /></button>
              <button onClick={() => onDelete(acc.id)}><Trash2 size={16} /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}