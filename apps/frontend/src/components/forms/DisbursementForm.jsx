import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

const DisbursementForm = ({ showModal, selectedLoan, onClose, onSubmit }) => {
  const [isPending, setIsPending] = useState(false);
  const [disbursementData, setDisbursementData] = useState({
    disbursementMode: "BANK_TRANSFER",
    transactionReference: "",
    remarks: "",
    bankName: "",
    bankAccountNumber: "",
    ifscCode: "",
    accountHolderName: "",
    valueDate: "",
    externalTxnId: "",
    utrNumber: ""
  });

  const handleInputChange = (field, value) => {
    setDisbursementData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateTransactionReference = () => {
    const date = new Date();
    const timestamp = date.getFullYear().toString() + 
                    (date.getMonth() + 1).toString().padStart(2, '0') + 
                    date.getDate().toString().padStart(2, '0') + 
                    '-' + 
                    Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `TXN-${timestamp}`;
  };

  const generateExternalTxnId = () => {
    return `EXT-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
  };

  const handleSubmit = async () => {
    setIsPending(true);
    
    // Auto-generate some fields if not provided
    const finalData = {
      ...disbursementData,
      transactionReference: disbursementData.transactionReference || generateTransactionReference(),
      externalTxnId: disbursementData.externalTxnId || generateExternalTxnId(),
      valueDate: disbursementData.valueDate || new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      remarks: disbursementData.remarks || "Disbursed to customer account"
    };
    
    // Add loan information
    const payload = {
      ...finalData,
      loanId: selectedLoan?.id,
      loanNumber: selectedLoan?.loanNumber,
      customerName: selectedLoan?.customer,
      amount: selectedLoan?.amount,
      disbursedAt: new Date().toISOString()
    };
    
    try {
      await onSubmit(payload);
      onClose();
    } catch (error) {
      console.error("Disbursement failed:", error);
    } finally {
      setIsPending(false);
    }
  };

  if (!showModal || !selectedLoan) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-2">
          <h2 className="font-bold text-xl">Disburse Loan</h2>
          <button 
            onClick={onClose}
            className="hover:bg-gray-100 p-1 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Loan Summary */}
        <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between">
            <span className="text-gray-600">Loan Number:</span>
            <span className="font-mono font-medium">{selectedLoan.loanNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Customer:</span>
            <span className="font-medium">{selectedLoan.customer}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-bold text-lg text-green-600">
              ₹{selectedLoan.amount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Bank:</span>
            <span className="font-medium">{selectedLoan.bank}</span>
          </div>
        </div>

        {/* Disbursement Form */}
        <div className="space-y-4">
          {/* Disbursement Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Disbursement Mode <span className="text-red-500">*</span>
            </label>
            <select
              value={disbursementData.disbursementMode}
              onChange={(e) => handleInputChange('disbursementMode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CHEQUE">Cheque</option>
              <option value="CASH">Cash</option>
              <option value="DD">Demand Draft</option>
            </select>
          </div>

          {/* Bank Details Section */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-700 mb-3">Bank Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={disbursementData.bankName}
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter bank name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={disbursementData.bankAccountNumber}
                  onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter account number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IFSC Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={disbursementData.ifscCode}
                  onChange={(e) => handleInputChange('ifscCode', e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter IFSC code"
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Holder Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={disbursementData.accountHolderName}
                  onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter account holder name"
                />
              </div>
            </div>
          </div>

          {/* Transaction Details Section */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-700 mb-3">Transaction Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UTR Number
                </label>
                <input
                  type="text"
                  value={disbursementData.utrNumber}
                  onChange={(e) => handleInputChange('utrNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter UTR number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Reference
                </label>
                <input
                  type="text"
                  value={disbursementData.transactionReference}
                  onChange={(e) => handleInputChange('transactionReference', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Auto-generated if empty"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  External Transaction ID
                </label>
                <input
                  type="text"
                  value={disbursementData.externalTxnId}
                  onChange={(e) => handleInputChange('externalTxnId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Auto-generated if empty"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Value Date
                </label>
                <input
                  type="date"
                  value={disbursementData.valueDate ? disbursementData.valueDate.split('T')[0] : ''}
                  onChange={(e) => handleInputChange('valueDate', new Date(e.target.value).toISOString())}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Remarks
            </label>
            <textarea
              value={disbursementData.remarks}
              onChange={(e) => handleInputChange('remarks', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter remarks (optional)"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending || !disbursementData.bankName || !disbursementData.bankAccountNumber || !disbursementData.ifscCode || !disbursementData.accountHolderName}
            className="flex-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 py-2"
          >
            {isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                <Send size={16} />
                Disburse Loan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisbursementForm;