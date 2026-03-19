import React from 'react';
import { X, ShieldCheck } from 'lucide-react';
import BranchAdminForm from '../forms/BranchAdminForm';

export default function BranchAdminFormModal({ isOpen, onClose, admin, branches, onSave, loading, branchesLoading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-6 border-b bg-slate-50/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-bold text-xl text-slate-800">
                {admin ? "Edit Branch Admin" : "Add New Admin"}
              </h3>
              <p className="text-slate-500 text-sm">
                {admin ? "Modify administrator permissions" : "Register a new branch manager"}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body - Scroll Disabled as requested */}
        <div className="overflow-hidden">
          <BranchAdminForm
            admin={admin} 
            branches={branches} 
            onSave={onSave} 
            onClose={onClose}
            loading={loading}
            branchesLoading={branchesLoading}
          />
        </div>
        
      </div>
    </div>
  );
}