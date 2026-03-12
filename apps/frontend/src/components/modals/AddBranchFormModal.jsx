import React, { useEffect } from "react";
import { X } from "lucide-react";
import AddBranchForm from "../forms/AddBranchForm";

export default function AddBranchFormModal({
  isOpen,
  onClose,
  branch,
  mainBranches,
  onSave,
}) {
  // Jab modal open ho toh background body ka scroll lock karein
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm px-4 py-8"
      onClick={onClose} 
    >
      {/* Yahan flex aur min-h-full use kiya hai taaki modal hamesha 
          center mein rahe aur scroll hone par content na kate 
      */}
      <div className="flex min-h-full items-center justify-center">
        
        <div 
          className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl transition-all duration-300 transform"
          onClick={(e) => e.stopPropagation()} 
        >
          
          {/* Header/Close Button Section 
              Z-index aur relative position ensures it stays on top
          */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full z-20 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* Form Component 
              Yahan humne koi fixed max-height nahi di hai, 
              isliye inner scroller nahi aayega.
          */}
          <div className="overflow-visible">
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
      </div>
    </div>
  );
}