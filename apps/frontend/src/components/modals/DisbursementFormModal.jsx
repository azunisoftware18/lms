// models/DisbursementFormModal.jsx

import React, { useState, useEffect } from 'react';
import { X, Send, CreditCard, Banknote, FileText, User, Building2 } from 'lucide-react';

const DisbursementFormModal = ({ isOpen, onClose, loanData, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: 5000,
    principalAmount: 500,
    interestAmount: 1000,
    chargesAmount: 800,
    currency: "INR",
    disbursementMode: "BANK_TRANSFER",
    transactionReference: "TXN-20260403-12345",
    remarks: "Disbursed to customer account",
    bankName: "Example Bank",
    bankAccountNumber: "123456789012",
    ifscCode: "EXAMP0001234",
    accountHolderName: "John Doe",
    valueDate: "2026-04-04T00:00:00.000Z",
    externalTxnId: "EXT-98765",
    utrNumber: "UTR123456789"
  });

  // Reset form when modal opens with new loan data
  useEffect(() => {
    if (isOpen && loanData) {
      setFormData(prev => ({
        ...prev,
        // Preserve the provided data but allow loan-specific overrides
        amount: loanData.amount || 5000,
        principalAmount: loanData.principalAmount || 500,
        interestAmount: loanData.interestAmount || 1000,
        chargesAmount: loanData.chargesAmount || 800,
      }));
    }
  }, [isOpen, loanData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
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
    setIsLoading(true);
    
    const finalData = {
      ...formData,
      transactionReference: formData.transactionReference || generateTransactionReference(),
      externalTxnId: formData.externalTxnId || generateExternalTxnId(),
      valueDate: formData.valueDate || new Date(Date.now() + 86400000).toISOString(),
      remarks: formData.remarks || "Disbursed to customer account",
      loanId: loanData?.id,
      loanNumber: loanData?.loanNumber,
      customerName: loanData?.customer,
      disbursedAt: new Date().toISOString()
    };
    
    try {
      await onSubmit(finalData);
      onClose();
    } catch (error) {
      console.error("Disbursement failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Disburse Loan</h2>
            <p className="text-sm text-gray-500 mt-1">Enter disbursement details</p>
          </div>
          <button 
            onClick={onClose}
            className="hover:bg-gray-100 p-2 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Loan Summary */}
        {loanData && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 m-6 p-4 rounded-lg border border-blue-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FileText size={16} className="text-blue-600" />
              Loan Details
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500">Loan Number</p>
                <p className="font-mono font-medium text-gray-800">{loanData.loanNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Customer Name</p>
                <p className="font-medium text-gray-800 flex items-center gap-1">
                  <User size={12} />
                  {loanData.customer}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Loan Amount</p>
                <p className="font-bold text-lg text-green-600">
                  ₹{formData.amount?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Bank</p>
                <p className="font-medium text-gray-800 flex items-center gap-1">
                  <Building2 size={12} />
                  {loanData.bank}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Financial Breakdown */}
        <div className="px-6 mb-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Financial Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Principal Amount:</span>
                <span className="font-medium">₹{formData.principalAmount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Interest Amount:</span>
                <span className="font-medium">₹{formData.interestAmount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Charges Amount:</span>
                <span className="font-medium">₹{formData.chargesAmount?.toLocaleString()}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total Disbursement:</span>
                  <span className="text-green-600">₹{formData.amount?.toLocaleString()}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Currency: {formData.currency}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="px-6 pb-6 space-y-5">
          {/* Disbursement Mode */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Disbursement Mode <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleChange('disbursementMode', 'BANK_TRANSFER')}
                className={`p-3 border-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  formData.disbursementMode === 'BANK_TRANSFER'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCard size={18} />
                <span className="font-medium">Bank Transfer</span>
              </button>
              <button
                type="button"
                onClick={() => handleChange('disbursementMode', 'CHEQUE')}
                className={`p-3 border-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  formData.disbursementMode === 'CHEQUE'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Banknote size={18} />
                <span className="font-medium">Cheque</span>
              </button>
            </div>
          </div>

          {/* Bank Details */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Building2 size={16} />
              Bank Account Details
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => handleChange('bankName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter bank name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.bankAccountNumber}
                  onChange={(e) => handleChange('bankAccountNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter account number"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IFSC Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.ifscCode}
                    onChange={(e) => handleChange('ifscCode', e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
                    placeholder="IFSC code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Holder Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.accountHolderName}
                    onChange={(e) => handleChange('accountHolderName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Account holder name"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <CreditCard size={16} />
              Transaction Details
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Reference
                </label>
                <input
                  type="text"
                  value={formData.transactionReference}
                  onChange={(e) => handleChange('transactionReference', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  placeholder="Transaction reference"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  External Transaction ID
                </label>
                <input
                  type="text"
                  value={formData.externalTxnId}
                  onChange={(e) => handleChange('externalTxnId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  placeholder="External transaction ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  UTR Number
                </label>
                <input
                  type="text"
                  value={formData.utrNumber}
                  onChange={(e) => handleChange('utrNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  placeholder="UTR number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Value Date
                </label>
                <input
                  type="date"
                  value={formData.valueDate ? formData.valueDate.split('T')[0] : ''}
                  onChange={(e) => handleChange('valueDate', new Date(e.target.value).toISOString())}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks
            </label>
            <textarea
              value={formData.remarks}
              onChange={(e) => handleChange('remarks', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter remarks"
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !formData.bankName || !formData.bankAccountNumber || !formData.ifscCode || !formData.accountHolderName}
            className="flex-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 py-2 font-medium"
          >
            {isLoading ? (
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

export default DisbursementFormModal;