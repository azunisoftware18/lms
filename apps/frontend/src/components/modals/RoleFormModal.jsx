import React, { useEffect } from "react";
import { X } from "lucide-react";
import RoleForm from "../forms/RoleForm";

export default function RoleFormModal({
  isOpen,
  onClose,
  editingRole,
  modules,
  onSubmit,
}) {
  // Background scroll prevent karne ke liye
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
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm px-4 py-6 sm:py-12"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center">
        <div 
          className="relative w-full max-w-5xl bg-white rounded-xl shadow-2xl transition-all"
          onClick={(e) => e.stopPropagation()} // Form pe click karne se modal band na ho
        >
          {/* RoleForm ko yahan call kiya gaya hai */}
          {/* Note: RoleForm ke andar ka header aur footer already styling handles kar rahe hain */}
          <RoleForm 
            onClose={onClose}
            onSubmit={async (data) => {
              await onSubmit(data);
              onClose();
            }}
            editingRole={editingRole}
            modules={modules}
          />
        </div>
      </div>
    </div>
  );
}