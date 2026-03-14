import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Info,
  Percent,
  Users,
  Shield,
  Eye,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Home,
  Car,
  GraduationCap,
  Gem,
  User,
  FileText,
  Clock,
  CreditCard,
  IndianRupee,
  Building,
  DollarSign,
  BadgeCheck,
  Calendar,
  Settings
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useCreateLoanType, useUpdateLoanType } from '../../hooks/useLoanType';
import InputField from '../ui/InputField';
import ToggleSwitch from '../ui/ToggleSwitch';
import TextAreaField from '../ui/TextAreaField';
import SelectField from '../ui/SelectField';
import Button from '../ui/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { loanTypeSchema } from '../../validations/LoanTypeValidation';

export default function AddLoanTypesForm({ onClose, editData }) {
  const createLoanTypeMutation = useCreateLoanType();
  const updateLoanTypeMutation = useUpdateLoanType();

  // Loan category options with icons
  const loanCategories = [
    { value: 'PERSONAL_LOAN', label: 'Personal Loan', icon: User },
    { value: 'VEHICLE_LOAN', label: 'Vehicle Loan', icon: Car },
    { value: 'HOME_LOAN', label: 'Home Loan', icon: Home },
    { value: 'EDUCATION_LOAN', label: 'Education Loan', icon: GraduationCap },
    { value: 'BUSINESS_LOAN', label: 'Business Loan', icon: Briefcase },
    { value: 'GOLD_LOAN', label: 'Gold Loan', icon: Gem },
  ];

  // Interest type options
  const interestTypes = [
    { value: 'FLAT', label: 'Flat' },
    { value: 'REDUCING', label: 'Reducing Balance' },
  ];

  // Processing fee type options
  const processingFeeTypes = [
    { value: 'PERCENTAGE', label: 'Percentage' },
    { value: 'FIXED', label: 'Fixed Amount' },
  ];

  // Employment type options
  const employmentTypes = [
    { value: 'salaried', label: 'Salaried' },
    { value: 'self_employed', label: 'Self-Employed' },
  ];

  // Document requirement options
  const documentOptions = [
    { value: 'Aadhaar_Card', label: 'Aadhaar Card' },
    { value: 'PAN_Card', label: 'PAN Card' },
    { value: 'Photo', label: 'Photo' },
    { value: 'Salary_Slip', label: 'Salary Slip' },
    { value: 'Bank_Statement', label: 'Bank Statement' },
    { value: 'Income_Proof', label: 'Income Proof' },
    { value: 'Address_Proof', label: 'Address Proof' },
    { value: 'Property_Docs', label: 'Property Documents' },
  ];

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    reset
  } = useForm({
    resolver: zodResolver(loanTypeSchema),
    mode: "onChange",
    defaultValues: {
      loanCode: '',
      loanName: '',
      loanCategory: '',
      securedLoan: false,
      description: '',
      minLoanAmount: '',
      maxLoanAmount: '',
      minTenure: '',
      maxTenure: '',
      interestType: 'FLAT',
      minInterestRate: '',
      maxInterestRate: '',
      defaultInterestRate: '',
      processingFeeType: 'PERCENTAGE',
      processingFeeValue: '',
      gstApplicable: false,
      gstPercentage: '',
      minAge: '',
      maxAge: '',
      minMonthlyIncome: '',
      employmentType: '',
      minCibilScore: '',
      maxCibilScore: '',
      prepaymentAllowed: false,
      foreclosureAllowed: false,
      prepaymentCharges: '',
      foreclosureCharges: '',
      activeStatus: true,
      publicVisibility: true,
      approvalRequired: true,
      estimatedProcessingTimeDays: '',
      documentsRequired: [],
    }
  });

  // Watch values for conditional rendering
  const watchLoanCategory = watch('loanCategory');
  const watchGstApplicable = watch('gstApplicable');
  const watchPrepaymentAllowed = watch('prepaymentAllowed');
  const watchForeclosureAllowed = watch('foreclosureAllowed');
  const watchDocumentsRequired = watch('documentsRequired');

  // Set edit data
  useEffect(() => {
    if (editData) {
      reset({
        loanCode: editData.code || '',
        loanName: editData.name || '',
        loanCategory: editData.category || '',
        securedLoan: editData.secured || false,
        description: editData.description || '',
        minLoanAmount: editData.minAmount || '',
        maxLoanAmount: editData.maxAmount || '',
        minTenure: editData.minTenureMonths || '',
        maxTenure: editData.maxTenureMonths || '',
        interestType: editData.interestType || 'FLAT',
        minInterestRate: editData.minInterestRate || '',
        maxInterestRate: editData.maxInterestRate || '',
        defaultInterestRate: editData.defaultInterestRate || '',
        processingFeeType: editData.processingFeeType || 'PERCENTAGE',
        processingFeeValue: editData.processingFee || '',
        gstApplicable: editData.gstApplicable || false,
        gstPercentage: editData.gstPercentage || '',
        minAge: editData.minAge || '',
        maxAge: editData.maxAge || '',
        minMonthlyIncome: editData.minIncome || '',
        employmentType: editData.employmentType || '',
        minCibilScore: editData.minCibilScore || '',
        maxCibilScore: editData.maxCibilScore || '',
        prepaymentAllowed: editData.prepaymentAllowed || false,
        foreclosureAllowed: editData.foreclosureAllowed || false,
        prepaymentCharges: editData.prepaymentCharges || '',
        foreclosureCharges: editData.foreclosureCharges || '',
        activeStatus: editData.isActive ?? true,
        publicVisibility: editData.isPublic ?? true,
        approvalRequired: editData.approvalRequired ?? true,
        estimatedProcessingTimeDays: editData.estimatedProcessingTimeDays || '',
        documentsRequired: editData.documentsRequired
          ? editData.documentsRequired.split(",")
          : [],
      });
    }
  }, [editData, reset]);

  // Generate loan code based on category
  useEffect(() => {
    if (watchLoanCategory) {
      const category = loanCategories.find(c => c.value === watchLoanCategory);
      const prefix = category?.label.substring(0, 3).toUpperCase() || 'LON';
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setValue('loanCode', `${prefix}-${randomNum}`);
    }
  }, [watchLoanCategory, setValue]);

  const handleDocumentChange = (doc) => {
    const currentDocs = watchDocumentsRequired || [];
    if (currentDocs.includes(doc)) {
      setValue('documentsRequired', currentDocs.filter(d => d !== doc));
    } else {
      setValue('documentsRequired', [...currentDocs, doc]);
    }
  };

  const onSubmit = async (data) => {
    const payload = {
      code: data.loanCode,
      name: data.loanName,
      category: data.loanCategory,
      secured: data.securedLoan,
      description: data.description || undefined,
      minAmount: Number(data.minLoanAmount),
      maxAmount: Number(data.maxLoanAmount),
      minTenureMonths: Number(data.minTenure),
      maxTenureMonths: Number(data.maxTenure),
      interestType: data.interestType,
      minInterestRate: Number(data.minInterestRate),
      maxInterestRate: Number(data.maxInterestRate),
      defaultInterestRate: Number(data.defaultInterestRate),
      processingFeeType: data.processingFeeType,
      processingFee: data.processingFeeValue ? Number(data.processingFeeValue) : undefined,
      gstApplicable: data.gstApplicable,
      gstPercentage: data.gstApplicable && data.gstPercentage ? Number(data.gstPercentage) : undefined,
      minAge: Number(data.minAge),
      maxAge: Number(data.maxAge),
      minIncome: data.minMonthlyIncome ? Number(data.minMonthlyIncome) : undefined,
      employmentType: data.employmentType || undefined,
      minCibilScore: data.minCibilScore ? Number(data.minCibilScore) : undefined,
      maxCibilScore: data.maxCibilScore ? Number(data.maxCibilScore) : undefined,
      prepaymentAllowed: data.prepaymentAllowed,
      foreclosureAllowed: data.foreclosureAllowed,
      prepaymentCharges: data.prepaymentAllowed && data.prepaymentCharges ? Number(data.prepaymentCharges) : undefined,
      foreclosureCharges: data.foreclosureAllowed && data.foreclosureCharges ? Number(data.foreclosureCharges) : undefined,
      isActive: data.activeStatus,
      isPublic: data.publicVisibility,
      approvalRequired: data.approvalRequired,
      estimatedProcessingTimeDays: data.estimatedProcessingTimeDays ? Number(data.estimatedProcessingTimeDays) : undefined,
      documentsRequired: data.documentsRequired.length > 0 ? data.documentsRequired.join(",") : undefined,
    };

    try {
      if (editData) {
        await updateLoanTypeMutation.mutateAsync({ id: editData.id, data: payload });
        toast.success("Loan Type updated successfully");
      } else {
        await createLoanTypeMutation.mutateAsync(payload);
        toast.success("Loan Type created successfully");
      }
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Operation failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Header - Now part of the form but styled consistently */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <h2 className="text-xl font-semibold text-gray-900">
          {editData ? 'Edit Loan Type' : 'Create New Loan Type'}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Fill in the details below to {editData ? 'update' : 'create'} a loan product
        </p>
      </div>

      {/* Form Content */}
      <div className="p-6 space-y-6 max-h-[calc(90vh-180px)] overflow-y-auto">
        {/* Section 1: Basic Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                name="loanCode"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Loan Code"
                    {...field}
                    readOnly
                    className="bg-gray-50 cursor-not-allowed"
                    icon={FileText}
                  />
                )}
              />

              <Controller
                name="loanName"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Loan Name"
                    placeholder="Enter loan product name"
                    error={errors.loanName?.message}
                    isRequired
                    icon={BadgeCheck}
                    {...field}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Loan Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {loanCategories.map(category => {
                  const Icon = category.icon;
                  const isSelected = watchLoanCategory === category.value;
                  return (
                    <button
                      key={category.value}
                      type="button"
                      onClick={() => setValue('loanCategory', category.value, { shouldValidate: true })}
                      className={`p-3 border-2 rounded-lg text-center transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mx-auto mb-1 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                      <span className="text-xs font-medium">{category.label}</span>
                    </button>
                  );
                })}
              </div>
              {errors.loanCategory && (
                <p className="text-red-500 text-xs flex items-center mt-1">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.loanCategory.message}
                </p>
              )}
            </div>

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextAreaField
                  label="Description (optional)"
                  placeholder="Enter a brief description of this loan product..."
                  rows={2}
                  maxLength={500}
                  error={errors.description?.message}
                  {...field}
                />
              )}
            />

            <div className="pt-2 border-t border-gray-100">
              <Controller
                name="securedLoan"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ToggleSwitch
                    label="Secured Loan"
                    checked={value}
                    onChange={onChange}
                    description="Requires collateral or security"
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Loan Amount & Tenure */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <IndianRupee className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Loan Amount & Tenure</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="minLoanAmount"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Minimum Loan Amount"
                  type="number"
                  placeholder="0.00"
                  error={errors.minLoanAmount?.message}
                  isRequired
                  icon={IndianRupee}
                  {...field}
                />
              )}
            />

            <Controller
              name="maxLoanAmount"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Maximum Loan Amount"
                  type="number"
                  placeholder="0.00"
                  error={errors.maxLoanAmount?.message}
                  isRequired
                  icon={IndianRupee}
                  {...field}
                />
              )}
            />

            <Controller
              name="minTenure"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Minimum Tenure (months)"
                  type="number"
                  placeholder="0"
                  error={errors.minTenure?.message}
                  isRequired
                  icon={Calendar}
                  {...field}
                />
              )}
            />

            <Controller
              name="maxTenure"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Maximum Tenure (months)"
                  type="number"
                  placeholder="0"
                  error={errors.maxTenure?.message}
                  isRequired
                  icon={Calendar}
                  {...field}
                />
              )}
            />
          </div>
        </div>

        {/* Section 3: Interest Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Percent className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Interest Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="interestType"
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Interest Type"
                  options={interestTypes}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.interestType?.message}
                />
              )}
            />

            <Controller
              name="minInterestRate"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Minimum Interest Rate (%)"
                  type="number"
                  placeholder="0.00"
                  error={errors.minInterestRate?.message}
                  icon={Percent}
                  {...field}
                />
              )}
            />

            <Controller
              name="maxInterestRate"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Maximum Interest Rate (%)"
                  type="number"
                  placeholder="0.00"
                  error={errors.maxInterestRate?.message}
                  icon={Percent}
                  {...field}
                />
              )}
            />

            <Controller
              name="defaultInterestRate"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Default Interest Rate (%)"
                  type="number"
                  placeholder="0.00"
                  error={errors.defaultInterestRate?.message}
                  icon={Percent}
                  {...field}
                />
              )}
            />
          </div>
        </div>

        {/* Section 4: Processing Fee & Tax */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Processing Fee & Tax</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="processingFeeType"
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Processing Fee Type"
                  options={processingFeeTypes}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.processingFeeType?.message}
                />
              )}
            />

            <Controller
              name="processingFeeValue"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Processing Fee Value"
                  type="number"
                  placeholder="0.00"
                  error={errors.processingFeeValue?.message}
                  icon={IndianRupee}
                  {...field}
                />
              )}
            />

            <div className="space-y-3">
              <Controller
                name="gstApplicable"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ToggleSwitch
                    label="GST Applicable"
                    checked={value}
                    onChange={onChange}
                    description="Goods and Services Tax"
                  />
                )}
              />

              {watchGstApplicable && (
                <Controller
                  name="gstPercentage"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="GST Percentage (%)"
                      type="number"
                      placeholder="0.00"
                      error={errors.gstPercentage?.message}
                      icon={Percent}
                      {...field}
                    />
                  )}
                />
              )}
            </div>
          </div>
        </div>

        {/* Section 5: Eligibility Criteria */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Eligibility Criteria</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="minAge"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Minimum Age"
                  type="number"
                  placeholder="18"
                  error={errors.minAge?.message}
                  isRequired
                  icon={User}
                  {...field}
                />
              )}
            />

            <Controller
              name="maxAge"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Maximum Age"
                  type="number"
                  placeholder="65"
                  error={errors.maxAge?.message}
                  isRequired
                  icon={User}
                  {...field}
                />
              )}
            />

            <Controller
              name="minMonthlyIncome"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Minimum Monthly Income"
                  type="number"
                  placeholder="0.00"
                  error={errors.minMonthlyIncome?.message}
                  icon={IndianRupee}
                  {...field}
                />
              )}
            />

            <Controller
              name="employmentType"
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Employment Type"
                  options={employmentTypes}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.employmentType?.message}
                />
              )}
            />

            <Controller
              name="minCibilScore"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Minimum CIBIL Score"
                  type="number"
                  placeholder="300"
                  error={errors.minCibilScore?.message}
                  icon={CreditCard}
                  {...field}
                />
              )}
            />

            <Controller
              name="maxCibilScore"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Maximum CIBIL Score"
                  type="number"
                  placeholder="900"
                  error={errors.maxCibilScore?.message}
                  icon={CreditCard}
                  {...field}
                />
              )}
            />
          </div>
        </div>

        {/* Section 6: Loan Rules */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Loan Rules</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                name="prepaymentAllowed"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ToggleSwitch
                    label="Prepayment Allowed"
                    checked={value}
                    onChange={onChange}
                    description="Allow early partial repayment"
                  />
                )}
              />

              <Controller
                name="foreclosureAllowed"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ToggleSwitch
                    label="Foreclosure Allowed"
                    checked={value}
                    onChange={onChange}
                    description="Allow complete early repayment"
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {watchPrepaymentAllowed && (
                <Controller
                  name="prepaymentCharges"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="Prepayment Charges (%)"
                      type="number"
                      placeholder="0.00"
                      error={errors.prepaymentCharges?.message}
                      icon={Percent}
                      {...field}
                    />
                  )}
                />
              )}

              {watchForeclosureAllowed && (
                <Controller
                  name="foreclosureCharges"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="Foreclosure Charges (%)"
                      type="number"
                      placeholder="0.00"
                      error={errors.foreclosureCharges?.message}
                      icon={Percent}
                      {...field}
                    />
                  )}
                />
              )}
            </div>
          </div>
        </div>

        {/* Section 7: Status & Visibility */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Eye className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Status & Visibility</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Controller
                name="activeStatus"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ToggleSwitch
                    label="Active Status"
                    checked={value}
                    onChange={onChange}
                    description="Enable this loan product"
                  />
                )}
              />

              <Controller
                name="publicVisibility"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ToggleSwitch
                    label="Public Visibility"
                    checked={value}
                    onChange={onChange}
                    description="Show on customer portal"
                  />
                )}
              />

              <Controller
                name="approvalRequired"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ToggleSwitch
                    label="Approval Required"
                    checked={value}
                    onChange={onChange}
                    description="Requires manual approval"
                  />
                )}
              />
            </div>

            <div className="space-y-4">
              <Controller
                name="estimatedProcessingTimeDays"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Estimated Processing Time (days)"
                    type="number"
                    placeholder="e.g., 7"
                    error={errors.estimatedProcessingTimeDays?.message}
                    icon={Clock}
                    {...field}
                  />
                )}
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Documents Required
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {documentOptions.map((doc) => (
                    <label
                      key={doc.value}
                      className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={watchDocumentsRequired?.includes(doc.value)}
                        onChange={() => handleDocumentChange(doc.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-700">{doc.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Actions */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!isValid || createLoanTypeMutation.isLoading || updateLoanTypeMutation.isLoading}
            className="min-w-[140px]"
          >
            {createLoanTypeMutation.isLoading || updateLoanTypeMutation.isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{editData ? "Updating..." : "Creating..."}</span>
              </div>
            ) : (
              editData ? "Update Loan Type" : "Create Loan Type"
            )}
          </Button>
        </div>

        {!isValid && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              Please fill all required fields correctly to create the loan type
            </p>
          </div>
        )}
      </div>
    </form>
  );
}