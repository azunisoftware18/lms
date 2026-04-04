import React from 'react';
import { useEmiPayableAmount, usePayEmi } from '../../hooks/useEmi';

export default function PayEmiModal({ emiId, open, onClose }) {
  const { data, isLoading, error, refetch } = useEmiPayableAmount(emiId);
  const payMutation = usePayEmi();

  if (!open) return null;

  const payload = data?.data ?? data;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);

  const handlePay = () => {
    if (!emiId || !payload) return;
    const amount = payload.totalPayable ?? payload.totalPayableAmount ?? payload.emiAmount ?? 0;
    payMutation.mutate(
      { emiId, amountPaid: Number(amount), paymentMode: 'CASH' },
      {
        onSuccess: () => {
          onClose?.();
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4">Pay EMI</h3>

        {isLoading && <p>Loading payable amount...</p>}
        {error && <p className="text-red-600">Failed to load payable amount</p>}

        {payload && (
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">EMI</span>
              <span className="font-medium">{payload.emiNo ?? payload.emiId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Due Date</span>
              <span className="font-medium">{new Date(payload.dueDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">EMI Amount</span>
              <span className="font-medium">{formatCurrency(payload.emiAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Late Fee</span>
              <span className="font-medium">{formatCurrency(payload.lateFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Already Paid</span>
              <span className="font-medium">{formatCurrency(payload.alreadyPaid)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Payable</span>
              <span className="font-semibold text-indigo-600">{formatCurrency(payload.totalPayable)}</span>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
          <button
            onClick={handlePay}
            disabled={payMutation.isLoading || isLoading || !payload}
            className="px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-60"
          >
            {payMutation.isLoading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
