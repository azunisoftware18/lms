import React, { useState } from 'react';
import { XCircle } from 'lucide-react';
import AccountForm from '../forms/AccountForm';

export default function AccountFormModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onFormChange,
  isEditing,
  parentOptions = []
}) {
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.code) newErrors.code = 'Account code required';
    if (!formData.name) newErrors.name = 'Account name required';
    if (!formData.type) newErrors.type = 'Account type required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="font-semibold">
            {isEditing ? 'Edit Account' : 'Create Account'}
          </h2>

          <button onClick={onClose}>
            <XCircle size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <AccountForm
            formData={formData}
            onChange={onFormChange}
            errors={errors}
            parentOptions={parentOptions}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {isEditing ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}