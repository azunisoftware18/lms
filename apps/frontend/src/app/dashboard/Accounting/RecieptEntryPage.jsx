import React, { useState } from 'react';
import { 
  Receipt, 
  Calendar, 
  User, 
  IndianRupee, 
  CreditCard, 
  FileText, 
  CheckCircle,
  Clock,
  Save,
  Printer
} from 'lucide-react';

export default function RecieptEntryPage() {
  // Form State
  const [formData, setFormData] = useState({
    receiptNo: 'REC-1045',
    date: new Date().toISOString().split('T')[0], // Defaults to today
    receivedFrom: '',
    amount: '',
    paymentMode: 'Cash',
    referenceNo: '',
    category: 'Sales',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock data for the sidebar
  const [recentReceipts] = useState([
    { id: 'REC-1044', name: 'Yawar Khan', amount: 4500.00, date: '2026-04-23', mode: 'UPI', category: 'Advance Payment', notes: 'Advance for custom suits' },
    { id: 'REC-1043', name: 'Parvez Ahmad', amount: 1250.00, date: '2026-04-22', mode: 'Cash', category: 'Outstanding Dues', notes: 'Cleared previous balance' },
    { id: 'REC-1042', name: 'Walk-in Customer', amount: 3200.00, date: '2026-04-22', mode: 'Card', category: 'Sales', notes: '2 Premium Suits' },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Reset form but increment receipt number
      setFormData(prev => ({
        ...prev,
        receiptNo: `REC-${parseInt(prev.receiptNo.split('-')[1]) + 1}`,
        receivedFrom: '',
        amount: '',
        referenceNo: '',
        notes: ''
      }));

      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Receipt Entry</h1>
              <p className="text-sm text-gray-500 mt-1">Record incoming payments for Ailif Collection</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Printer className="w-4 h-4" />
              Print Last Receipt
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-800">New Receipt Details</h2>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Row 1: Receipt No & Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FileText className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="receiptNo"
                        value={formData.receiptNo}
                        readOnly
                        className="pl-10 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="date"
                        required
                        value={formData.date}
                        onChange={handleChange}
                        className="pl-10 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Received From & Amount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Received From</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="receivedFrom"
                        required
                        placeholder="Customer Name"
                        value={formData.receivedFrom}
                        onChange={handleChange}
                        className="pl-10 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IndianRupee className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="amount"
                        required
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={handleChange}
                        className="pl-10 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3: Payment Mode & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CreditCard className="h-4 w-4 text-gray-400" />
                      </div>
                      <select
                        name="paymentMode"
                        value={formData.paymentMode}
                        onChange={handleChange}
                        className="pl-10 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none"
                      >
                        <option value="Cash">Cash</option>
                        <option value="UPI">UPI</option>
                        <option value="Card">Credit/Debit Card</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none"
                    >
                      <option value="Sales">General Sales</option>
                      <option value="Advance Payment">Advance Payment</option>
                      <option value="Outstanding Dues">Outstanding Dues Cleared</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Reference Number (Conditional) */}
                {formData.paymentMode !== 'Cash' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Transaction/Reference Number</label>
                    <input
                      type="text"
                      name="referenceNo"
                      required
                      placeholder="e.g., UTR, Txn ID"
                      value={formData.referenceNo}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                )}

                {/* Description/Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description / Notes</label>
                  <textarea
                    name="notes"
                    rows="3"
                    placeholder="Enter details about the items or payment..."
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  ></textarea>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                <div className="flex-1">
                  {showSuccess && (
                    <div className="flex items-center text-green-600 text-sm font-medium animate-pulse">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Receipt generated successfully!
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    onClick={() => setFormData(prev => ({ ...prev, receivedFrom: '', amount: '', notes: '', referenceNo: '' }))}
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Receipt
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar - Recent Receipts */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-6">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  Recent Receipts
                </h2>
              </div>
              <div className="divide-y divide-gray-50">
                {recentReceipts.map((receipt) => (
                  <div key={receipt.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {receipt.name}
                      </p>
                      <p className="font-semibold text-green-600">
                        +₹{receipt.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{receipt.id} • {receipt.date}</span>
                      <span className="px-2 py-1 bg-gray-100 rounded-md font-medium text-gray-600">
                        {receipt.mode}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 truncate">
                      {receipt.category} - {receipt.notes}
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-100">
                <button className="w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                  View All Receipts
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}