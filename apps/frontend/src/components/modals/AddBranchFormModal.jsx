import React from 'react';
import { X } from 'lucide-react';
import AddBranchForm from '../forms/AddBranchForm';

export default function AddBranchFormModal({ isOpen, onClose, branch, mainBranches, onSave }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[95vh] overflow-y-auto bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300">
        
        {/* Close Button (Top Right) */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all z-10"
        >
          <X size={20} />
        </button>

        {/* Reusing your existing Form Component */}
        <AddBranchForm
          branch={branch} 
          mainBranches={mainBranches} 
          onSave={async (data) => {
             await onSave(data);
             onClose();
          }} 
          onClose={onClose} 
        />
        
      </div>
    </div>
  );
}