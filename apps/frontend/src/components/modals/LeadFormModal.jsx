import React from 'react';
import { X } from 'lucide-react';
import LeadForm from '../forms/LeadForm';

const LeadFormModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container - max-w-4xl use kiya hai kyunki form bada hai */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl z-10 animate-in zoom-in-95 duration-200 my-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-slate-800">New Loan Application</h2>
            <p className="text-sm text-slate-500">Fill in the details to create a new lead</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white hover:shadow-sm rounded-full text-slate-400 hover:text-red-500 transition-all border border-transparent hover:border-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Container - Padding aur Scroll handle karne ke liye */}
        <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <LeadForm onSuccess={onClose} />
        </div>
      </div>
    </div>
  );
};

export default LeadFormModal;