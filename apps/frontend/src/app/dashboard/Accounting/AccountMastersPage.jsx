import React, { useState, useMemo } from 'react';
import { Plus, Filter } from 'lucide-react';
import AccountMasterTable from '../../../components/tables/AccountMasterTable';
import AccountFormModal from '../../../components/modals/AccountFormModal';
import SummaryCards from '../../../components/common/SummaryCards';
import SearchField from '../../../components/ui/SearchField';
import SelectField from '../../../components/ui/SelectField';

const initialAccounts = [
  { id: 1, code: '1000', name: 'Assets', type: 'ASSET', parentAccountId: null, openingBalance: 0, status: 'active' },
  { id: 2, code: '1100', name: 'Bank', type: 'ASSET', parentAccountId: 1, openingBalance: 50000, status: 'active' },
  { id: 3, code: '1200', name: 'Cash', type: 'ASSET', parentAccountId: 1, openingBalance: 20000, status: 'active' },

  { id: 4, code: '2000', name: 'Liabilities', type: 'LIABILITY', parentAccountId: null, openingBalance: 0, status: 'active' },
  { id: 5, code: '2100', name: 'Loan Payable', type: 'LIABILITY', parentAccountId: 4, openingBalance: 30000, status: 'active' },

  { id: 6, code: '3000', name: 'Income', type: 'INCOME', parentAccountId: null, openingBalance: 0, status: 'active' },
  { id: 7, code: '3100', name: 'Interest Income', type: 'INCOME', parentAccountId: 6, openingBalance: 15000, status: 'active' },

  { id: 8, code: '4000', name: 'Expenses', type: 'EXPENSE', parentAccountId: null, openingBalance: 0, status: 'active' },
  { id: 9, code: '4100', name: 'Salary Expense', type: 'EXPENSE', parentAccountId: 8, openingBalance: 10000, status: 'active' }
];

export default function AccountMastersPage() {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'ASSET',
    parentAccountId: '',
    openingBalance: 0,
    status: 'active',
    description: ''
  });

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'ASSET', label: 'Asset' },
    { value: 'LIABILITY', label: 'Liability' },
    { value: 'INCOME', label: 'Income' },
    { value: 'EXPENSE', label: 'Expense' }
  ];

  const filteredAccounts = useMemo(() => {
    return accounts.filter(acc =>
      (acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.code.includes(searchTerm)) &&
      (selectedType === 'all' || acc.type === selectedType)
    );
  }, [accounts, searchTerm, selectedType]);

  const getParentName = (id) => {
    const parent = accounts.find(a => a.id === id);
    return parent ? parent.name : '-';
  };

  const handleSaveAccount = () => {
    if (!formData.code || !formData.name) return;

    const newAccount = {
      ...formData,
      id: Date.now(),
      type: formData.type.toUpperCase(),
      parentAccountId: formData.parentAccountId || null,
      openingBalance: parseFloat(formData.openingBalance) || 0
    };

    setAccounts(prev => [...prev, newAccount]);
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (acc) => {
    setEditingAccount(acc);
    setFormData(acc);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
  };

  const resetForm = () => {
    setEditingAccount(null);
    setFormData({
      code: '',
      name: '',
      type: 'ASSET',
      parentAccountId: '',
      openingBalance: 0,
      status: 'active',
      description: ''
    });
  };

  const parentOptions = accounts.map(acc => ({
    value: acc.id,
    label: `${acc.code} - ${acc.name}`
  }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Chart of Accounts</h1>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded flex gap-2 items-center"
        >
          <Plus size={16} /> Add Account
        </button>
      </div>

      <SummaryCards accounts={accounts} />

      <div className="flex gap-3 my-4">
        <SearchField value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <SelectField value={selectedType} onChange={(e) => setSelectedType(e.target.value)} options={typeOptions} />
      </div>

      <AccountMasterTable
        accounts={filteredAccounts.map(acc => ({
          ...acc,
          parentName: getParentName(acc.parentAccountId)
        }))}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AccountFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        onSubmit={handleSaveAccount}
        formData={formData}
        onFormChange={setFormData}
        isEditing={!!editingAccount}
        parentOptions={parentOptions}
      />
    </div>
  );
}