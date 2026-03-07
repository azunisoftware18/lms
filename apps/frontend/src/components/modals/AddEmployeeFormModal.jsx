import React from "react";
import { X } from "lucide-react";
import { AddEmployeeForm } from "../forms/AddEmployeeForm";

export const EmployeeFormModal = ({ isOpen, onClose, isEditing, editId }) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl z-10 my-8">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {isEditing ? "Edit Employee" : "Add New Employee"}
            </h2>

            <p className="text-sm text-slate-500">
              Fill employee details to register
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-red-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 md:p-8 max-h-[85vh] overflow-y-auto">

          <AddEmployeeForm
            isEditing={isEditing}
            editId={editId}
            onCancel={onClose}
            onSuccess={onClose}
          />

        </div>

      </div>
    </div>
  );
};