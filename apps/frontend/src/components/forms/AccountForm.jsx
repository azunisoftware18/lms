import React from 'react';
import SelectField from '../../components/ui/SelectField';
import InputField from '../../components/ui/InputField';
import TextAreaField from '../../components/ui/TextAreaField';

const accountTypes = [
  { value: 'ASSET', label: 'Asset' },
  { value: 'LIABILITY', label: 'Liability' },
  { value: 'INCOME', label: 'Income' },
  { value: 'EXPENSE', label: 'Expense' }
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

export default function AccountForm({ formData, onChange, errors = {}, parentOptions = [] }) {

  const handleChange = (e) => {
    const { name, value } = e.target;

    const processedValue =
      name === 'openingBalance'
        ? parseFloat(value) || 0
        : value;

    onChange({
      ...formData,
      [name]: processedValue
    });
  };

  return (
    <div className="space-y-4">

      {/* Code + Type */}
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Account Code *"
          name="code"
          value={formData.code}
          onChange={handleChange}
          placeholder="e.g., 1001"
          error={errors.code}
        />

        <SelectField
          label="Account Type *"
          name="type"
          value={formData.type}
          onChange={handleChange}
          options={accountTypes}
          error={errors.type}
        />
      </div>

      {/* Name */}
      <InputField
        label="Account Name *"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="e.g., Bank Account"
        error={errors.name}
      />

      {/* Parent + Status */}
      <div className="grid grid-cols-2 gap-4">

        <SelectField
          label="Parent Account"
          name="parentAccountId"
          value={formData.parentAccountId || ''}
          onChange={handleChange}
          options={[
            { value: '', label: 'None' },
            ...parentOptions
          ]}
        />

        <SelectField
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
        />
      </div>

      {/* Opening Balance */}
      <InputField
        label="Opening Balance (₹)"
        name="openingBalance"
        type="number"
        value={formData.openingBalance}
        onChange={handleChange}
        placeholder="0"
      />

      {/* Description */}
      <TextAreaField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows={3}
        placeholder="Optional..."
      />
    </div>
  );
}