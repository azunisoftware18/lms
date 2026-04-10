import React, { useEffect } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Save, 
  Shield, 
  Mail, 
  Lock,
  Users,
  FileText,
  CreditCard,
  BarChart2,
  Settings,
  User,
  Building2,
  X
} from 'lucide-react';
import { roleSchema } from '../../validations/RoleValidation';
import InputField from '../ui/InputField';
import TextAreaField from '../ui/TextAreaField';
import ToggleSwitch from '../ui/ToggleSwitch';
import Button from '../ui/Button';

export default function RoleForm({ onClose, onSubmit, editingRole, modules = [] }) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid, isDirty }
  } = useForm({
    resolver: zodResolver(roleSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      description: '',
      permissions: {}
    }
  });

  // Watch permissions for summary (use useWatch for stable subscription)
  const watchPermissions = useWatch({ control, name: 'permissions' }) || {};

  // Initialize form data when editing or opening
  useEffect(() => {
    if (modules.length === 0) return; // Don't initialize if no modules

    if (editingRole) {
      const permissionObject = modules.reduce((acc, module) => ({
        ...acc,
        [module.id]: editingRole.permissions?.includes(module.id) || false
      }), {});
      
      reset({
        name: editingRole.name || '',
        email: editingRole.email || '',
        password: '', // Don't pre-fill password for security
        description: editingRole.description || '',
        permissions: permissionObject
      });
    } else {
      // Initialize with all permissions false
      reset({
        name: '',
        email: '',
        password: '',
        description: '',
        permissions: modules.reduce((acc, module) => ({
          ...acc,
          [module.id]: false
        }), {})
      });
    }
  }, [editingRole, modules, reset]);

  // Handle select all permissions
  const handleSelectAll = () => {
    if (modules.length === 0) return;
    
    const allSelected = modules.every(module => watchPermissions?.[module.id]);
    const newPermissions = modules.reduce((acc, module) => ({
      ...acc,
      [module.id]: !allSelected
    }), {});
    
    setValue('permissions', newPermissions, { shouldValidate: true, shouldDirty: true });
  };

  // Get module icon component
  const getModuleIcon = (moduleId) => {
    const icons = {
      dashboard: BarChart2,
      customers: Users,
      loans: CreditCard,
      payments: FileText,
      reports: BarChart2,
      settings: Settings,
      adminManagement: Lock,
      users: Users,
      leads: Users,
      'loan-applications': FileText,
      'loan-accounts': CreditCard,
      nach: FileText,
      branch: Building2
    };
    return icons[moduleId] || Shield;
  };

  // Handle form submission
  const onFormSubmit = (data) => {
    const activePermissions = Object.entries(data.permissions || {})
      .filter(([, isActive]) => isActive)
      .map(([moduleId]) => moduleId);

    const submitData = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      description: data.description?.trim() || '',
      permissions: activePermissions,
      ...(data.password ? { password: data.password } : {})
    };

    onSubmit(submitData);
  };

  // Safe calculations with optional chaining
  const selectedCount = modules?.filter(m => watchPermissions?.[m.id])?.length || 0;

  // Don't render if no modules
  if (modules.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Modules Available</h3>
          <p className="text-sm">Please configure modules before creating roles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {editingRole ? 'Edit Role' : 'Create New Role'}
            </h2>
            <p className="text-gray-600 text-sm">
              {editingRole ? 'Update role details and permissions' : 'Configure new role details and permissions'}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          type="button"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onFormSubmit)} className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Role Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              Role Information
            </h3>
            
            {/* Role Name */}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Role Name"
                  placeholder="e.g., Loan Officer"
                  error={errors.name?.message}
                  isRequired
                  {...field}
                />
              )}
            />

            {/* Email */}
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Email Address"
                  type="email"
                  placeholder="email@example.com"
                  icon={Mail}
                  error={errors.email?.message}
                  isRequired
                  {...field}
                />
              )}
            />
            {!errors.email && (
              <p className="text-xs text-gray-500 -mt-4">
                This email will be used for login
              </p>
            )}

            {/* Password */}
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Password"
                  type="password"
                  placeholder={editingRole ? "Enter new password" : "Enter password"}
                  icon={Lock}
                  error={errors.password?.message}
                  {...field}
                />
              )}
            />
            {!errors.password && (
              <p className="text-xs text-gray-500 -mt-4">
                {editingRole 
                  ? 'Leave empty to keep current password' 
                  : 'Password will be used for login authentication'}
              </p>
            )}

            {/* Description */}
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextAreaField
                  label="Description"
                  placeholder="Describe the role's responsibilities..."
                  rows={4}
                  error={errors.description?.message}
                  {...field}
                />
              )}
            />
          </div>

          {/* Right Column - Permissions */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <h3 className="text-lg font-medium text-gray-900">
                Module Permissions
              </h3>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {modules?.every(module => watchPermissions?.[module.id]) 
                  ? 'Deselect All' 
                  : 'Select All'}
              </button>
            </div>

            {/* Permissions List */}
            <div className="space-y-3 max-h-100 overflow-y-auto pr-2 border border-gray-200 rounded-lg p-4">
              {modules?.map(module => {
                const Icon = getModuleIcon(module.id);
                
                return (
                  <Controller
                    key={module.id}
                    name={`permissions.${module.id}`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <div
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                          value
                            ? 'border-blue-300 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => onChange(!value)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg transition-colors ${
                            value
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{module.name}</p>
                            <p className="text-xs text-gray-500">{module.description || 'Module access'}</p>
                          </div>
                        </div>
                        <ToggleSwitch
                          checked={value}
                          onChange={onChange}
                          size="sm"
                        />
                      </div>
                    )}
                  />
                );
              })}
            </div>

            {/* Permissions Summary */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-700">
                  Selected Permissions: 
                  <span className="ml-2 text-blue-600 font-semibold">
                    {selectedCount}/{modules?.length || 0}
                  </span>
                </p>
              </div>
              
              {errors.permissions && (
                <p className="text-sm text-red-600 mb-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                  {errors.permissions.message}
                </p>
              )}

              <div className="flex flex-wrap gap-2 min-h-10">
                {modules
                  ?.filter(module => watchPermissions?.[module.id])
                  .map(module => (
                    <span
                      key={module.id}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                    >
                      {module.name}
                    </span>
                  ))}
                {selectedCount === 0 && (
                  <span className="text-gray-500 text-sm">No permissions selected</span>
                )}
              </div>
            </div>

            {/* Login Info Preview */}
            {watch('name') && watch('email') && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-800 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Login Information Preview
                </p>
                <div className="text-sm text-green-700 space-y-1">
                  <p><span className="font-medium">Email:</span> {watch('email')}</p>
                  <p><span className="font-medium">Password:</span> {
                    watch('password') ? '•'.repeat(8) : '(will be set during creation)'
                  }</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!isValid || (!isDirty && editingRole)}
          >
            <Save className="w-5 h-5 mr-2" />
            {editingRole ? 'Update Role' : 'Create Role'}
          </Button>
        </div>
      </form>
    </div>
  );
}