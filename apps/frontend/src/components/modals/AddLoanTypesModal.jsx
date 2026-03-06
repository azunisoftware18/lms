import React from "react";
import { X } from "lucide-react";
import AddLoanTypesForm from "../forms/AddLoanTypesForm";

function AddLoanTypesModal({ isOpen, onClose, editData }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>   

        {/* Form */}
        <AddLoanTypesForm onClose={onClose} editData={editData} />

      </div>
    </div>
  );
}

export default AddLoanTypesModal;