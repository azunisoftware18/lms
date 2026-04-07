import React from "react";
import DocumentUploadForm from "../forms/DocumentUploadForm";

export default function DocumentUploadModal(props) {
  const { onClose } = props;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 bg-black bg-opacity-40 lg:pl-64">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-6xl relative max-h-[90vh] overflow-y-auto mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Upload Documents</h2>
          <div className="flex items-center gap-3">
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={onClose}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
        <DocumentUploadForm {...props} />
      </div>
    </div>
  );
}
