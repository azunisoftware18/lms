import React from 'react';
import { Banknote, Landmark, FileText, Percent } from 'lucide-react';
import StatusCard from './StatusCard';

export default function SummaryCards({ accounts }) {
  const totalAccounts = accounts.length;
  const totalAssets = accounts
    .filter(acc => acc.type === 'loan' || acc.type === 'bank' || acc.type === 'asset')
    .reduce((sum, acc) => sum + acc.currentBalance, 0);
  const totalLiabilities = accounts
    .filter(acc => acc.type === 'liability')
    .reduce((sum, acc) => sum + acc.currentBalance, 0);
  const totalIncome = accounts
    .filter(acc => acc.type === 'income')
    .reduce((sum, acc) => sum + acc.currentBalance, 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Color mapping for different card types
  const getColorClasses = (color) => {
    switch(color) {
      case 'blue':
        return { colorClass: 'text-blue-600', bgClass: 'bg-blue-50' };
      case 'green':
        return { colorClass: 'text-green-600', bgClass: 'bg-green-50' };
      case 'orange':
        return { colorClass: 'text-orange-600', bgClass: 'bg-orange-50' };
      case 'emerald':
        return { colorClass: 'text-emerald-600', bgClass: 'bg-emerald-50' };
      default:
        return { colorClass: 'text-gray-600', bgClass: 'bg-gray-50' };
    }
  };

  const cards = [
    { label: 'Total Accounts', value: totalAccounts, color: 'blue', icon: Banknote, format: false },
    { label: 'Assets (Loans + Bank)', value: totalAssets, color: 'green', icon: Landmark, format: true },
    { label: 'Liabilities', value: totalLiabilities, color: 'orange', icon: FileText, format: true },
    { label: 'Total Income', value: totalIncome, color: 'emerald', icon: Percent, format: true }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const { colorClass, bgClass } = getColorClasses(card.color);
        return (
          <StatusCard
            key={index}
            title={card.label}
            value={card.format ? formatCurrency(card.value) : card.value}
            icon={card.icon}  // Pass the component, not JSX
            colorClass={colorClass}
            bgClass={bgClass}
          />
        );
      })}
    </div>
  );
}