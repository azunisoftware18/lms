import React, { useState } from 'react';
import TableShell from './core/TableShell';
import TableHead from './core/TableHead';
import { Eye, UserPlus } from 'lucide-react';

export default function RecoveryCasesTable({ cases: casesData = [], onView = () => {}, onAssign = () => {} }) {
  const [search, setSearch] = useState('');
  const [filterValue, setFilterValue] = useState('');

  const columns = [
    { header: 'Loan #', accessor: 'loanNumber' },
    { header: 'Customer', accessor: 'customerName' },
    { header: 'Outstanding', accessor: 'outstandingAmount' },
    { header: 'DPD', accessor: 'daysPastDue' },
    { header: 'Risk', accessor: 'riskCategory' },
    { header: 'Agent', accessor: 'assignedAgent' },
    { header: 'Status', accessor: 'status' },
  ];

  const filtered = casesData.filter((c) => {
    if (!search && !filterValue) return true;
    const s = search.toLowerCase();
    if (s && !(c.loanNumber + c.customerName + (c.assignedAgent || '')).toLowerCase().includes(s)) return false;
    if (filterValue && c.status !== filterValue) return false;
    return true;
  });

  return (
    <TableShell>
      <TableHead
        columns={columns}
        title={`Recovery Cases (${filtered.length})`}
        search={search}
        setSearch={setSearch}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        filterOptions={[{ label: 'All', value: '' }, { label: 'Assigned', value: 'Assigned' }, { label: 'In Progress', value: 'In Progress' }, { label: 'Legal Notice Sent', value: 'Legal Notice Sent' }]}
      />

      <tbody>
        {filtered.map((r) => (
          <tr key={r.id} className="odd:bg-white even:bg-slate-50">
            <td className="px-4 py-3">{r.loanNumber}</td>
            <td className="px-4 py-3">{r.customerName}</td>
            <td className="px-4 py-3">₹{(r.outstandingAmount ?? 0).toLocaleString()}</td>
            <td className="px-4 py-3">{r.daysPastDue}</td>
            <td className="px-4 py-3">{r.riskCategory}</td>
            <td className="px-4 py-3">{r.assignedAgent}</td>
            <td className="px-4 py-3">{r.status}</td>
            <td className="px-4 py-3 text-right">
              <div className="inline-flex items-center gap-2">
                <button onClick={() => onView(r)} className="p-2 rounded-lg hover:bg-slate-100">
                  <Eye size={16} />
                </button>
                <button onClick={() => onAssign(r)} className="p-2 rounded-lg hover:bg-slate-100">
                  <UserPlus size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}
