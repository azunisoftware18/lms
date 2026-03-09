import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  X,
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
  IndianRupee
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

function AddLoanTypesForm({ onClose, editData }) {
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
  ];

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isValid },
    reset
 } = useForm({
  resolver: zodResolver(loanTypeSchema),
  mode: "onChange",
    defaultValues: {
      // Section 1: Basic Information
      loanCode: '',
      loanName: '',
      loanCategory: '',
      securedLoan: false,
      description: '',
      
      // Section 2: Loan Amount & Tenure
      minLoanAmount: '',
      maxLoanAmount: '',
      minTenure: '',
      maxTenure: '',
      
      // Section 3: Interest Details
      interestType: 'FLAT',
      minInterestRate: '',
      maxInterestRate: '',
      defaultInterestRate: '',
      
      // Section 4: Processing Fee & Tax
      processingFeeType: 'PERCENTAGE',
      processingFeeValue: '',
      gstApplicable: false,
      gstPercentage: '',
      
      // Section 5: Eligibility Criteria
      minAge: '',
      maxAge: '',
      minMonthlyIncome: '',
      employmentType: '',
      minCibilScore: '',
      maxCibilScore: '',
      
      // Section 6: Loan Rules
      prepaymentAllowed: false,
      foreclosureAllowed: false,
      prepaymentCharges: '',
      foreclosureCharges: '',
      
      // Section 7: Status & Visibility
      activeStatus: true,
      publicVisibility: true,
      approvalRequired: true,
      estimatedProcessingTimeDays: '',
      
      // Section 8: Documentation
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
      const prefix = watchLoanCategory.split('_')[0].substring(0, 3).toUpperCase();
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


  // Handle form submission
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
      processingFee: data.processingFeeValue
        ? Number(data.processingFeeValue)
        : undefined,

      gstApplicable: data.gstApplicable,
      gstPercentage:
        data.gstApplicable && data.gstPercentage
          ? Number(data.gstPercentage)
          : undefined,

      minAge: Number(data.minAge),
      maxAge: Number(data.maxAge),

      minIncome: data.minMonthlyIncome
        ? Number(data.minMonthlyIncome)
        : undefined,

      employmentType: data.employmentType || undefined,

      minCibilScore: data.minCibilScore
        ? Number(data.minCibilScore)
        : undefined,

      maxCibilScore: data.maxCibilScore
        ? Number(data.maxCibilScore)
        : undefined,

      prepaymentAllowed: data.prepaymentAllowed,
      foreclosureAllowed: data.foreclosureAllowed,

      prepaymentCharges:
        data.prepaymentAllowed && data.prepaymentCharges
          ? Number(data.prepaymentCharges)
          : undefined,

      foreclosureCharges:
        data.foreclosureAllowed && data.foreclosureCharges
          ? Number(data.foreclosureCharges)
          : undefined,

      isActive: data.activeStatus,
      isPublic: data.publicVisibility,
      approvalRequired: data.approvalRequired,

      estimatedProcessingTimeDays:
        data.estimatedProcessingTimeDays
          ? Number(data.estimatedProcessingTimeDays)
          : undefined,

      documentsRequired:
        data.documentsRequired.length > 0
          ? data.documentsRequired.join(",")
          : undefined,
    };

    try {
      if (editData) {
        await updateLoanTypeMutation.mutateAsync({
          id: editData.id,
          data: payload,
        });

        toast.success("Loan Type updated successfully");
      } else {
        await createLoanTypeMutation.mutateAsync(payload);

        toast.success("Loan Type created successfully");
      }

      onClose();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        "Operation failed"
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {editData ? 'Edit Loan Type' : 'Create New Loan Type'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-b-xl shadow-sm">
        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Section 1: Basic Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center mb-6">
              <Info className="w-5 h-5 text-blue-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Loan Code */}
                <Controller
                  name="loanCode"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="Loan Code"
                      {...field}
                      readOnly
                      className="bg-gray-50 cursor-not-allowed"
                    />
                  )}
                />

                {/* Loan Name */}
                <Controller
                  name="loanName"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="Loan Name"
                      placeholder="Enter loan product name"
                      error={errors.loanName?.message}
                      isRequired
                      {...field}
                    />
                  )}
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Loan Category <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {loanCategories.map(category => {
                    const Icon = category.icon;
                    const isSelected = watchLoanCategory === category.value;
                    return (
                      <button
                        key={category.value}
                        type="button"
                        onClick={() => setValue('loanCategory', category.value, { shouldValidate: true, shouldDirty: true })}
                        className={`p-4 border rounded-lg text-center transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className={`w-6 h-6 mx-auto mb-2 ${
                          isSelected ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                        <span className="text-sm font-medium">{category.label}</span>
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
              
              {/* Description */}
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextAreaField
                    label="Description (optional)"
                    placeholder="Enter a brief description of this loan product..."
                    rows={3}
                    maxLength={500}
                    error={errors.description?.message}
                    {...field}
                  />
                )}
              />
              
              <div className="pt-4 border-t border-gray-100">
                <Controller
                  name="securedLoan"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <ToggleSwitch
                      label="Secured Loan"
                      checked={value}
                      onChange={onChange}
                    />
                  )}
                />
                <p className="text-xs text-gray-500 mt-1 ml-1">Requires collateral or security</p>
              </div>
            </div>
          </div>

          {/* Section 2: Loan Amount & Tenure */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center mb-6">
              <IndianRupee className="w-5 h-5 text-blue-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Loan Amount & Tenure</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Min Loan Amount */}
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
                    {...field}
                  />
                )}
              />

              {/* Max Loan Amount */}
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
                    {...field}
                  />
                )}
              />

              {/* Min Tenure */}
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
                    {...field}
                  />
                )}
              />

              {/* Max Tenure */}
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
                    {...field}
                  />
                )}
              />
            </div>
          </div>

          {/* Section 3: Interest Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center mb-6">
              <Percent className="w-5 h-5 text-blue-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Interest Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Interest Type */}
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

              {/* Min Interest Rate */}
              <Controller
                name="minInterestRate"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Minimum Interest Rate (%)"
                    type="number"
                    placeholder="0.00"
                    error={errors.minInterestRate?.message}
                    {...field}
                  />
                )}
              />

              {/* Max Interest Rate */}
              <Controller
                name="maxInterestRate"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Maximum Interest Rate (%)"
                    type="number"
                    placeholder="0.00"
                    error={errors.maxInterestRate?.message}
                    {...field}
                  />
                )}
              />

              {/* Default Interest Rate */}
              <Controller
                name="defaultInterestRate"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Default Interest Rate (%)"
                    type="number"
                    placeholder="0.00"
                    error={errors.defaultInterestRate?.message}
                    {...field}
                  />
                )}
              />
            </div>
          </div>

          {/* Section 4: Processing Fee & Tax */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center mb-6">
              <CheckCircle className="w-5 h-5 text-blue-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Processing Fee & Tax</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Processing Fee Type */}
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

              {/* Processing Fee Value */}
              <Controller
                name="processingFeeValue"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Processing Fee Value"
                    type="number"
                    placeholder="0.00"
                    error={errors.processingFeeValue?.message}
                    {...field}
                  />
                )}
              />
              
              <div className="space-y-4">
                <Controller
                  name="gstApplicable"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <ToggleSwitch
                      label="GST Applicable"
                      checked={value}
                      onChange={onChange}
                    />
                  )}
                />
                <p className="text-xs text-gray-500 mt-1 ml-1">Goods and Services Tax</p>
                
                {watchGstApplicable && (
                  <div className="transition-all duration-300 ease-in-out">
                    <Controller
                      name="gstPercentage"
                      control={control}
                      render={({ field }) => (
                        <InputField
                          label="GST Percentage (%)"
                          type="number"
                          placeholder="0.00"
                          error={errors.gstPercentage?.message}
                          {...field}
                        />
                      )}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 5: Eligibility Criteria */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center mb-6">
              <Users className="w-5 h-5 text-blue-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Eligibility Criteria</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Min Age */}
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
                    {...field}
                  />
                )}
              />

              {/* Max Age */}
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
                    {...field}
                  />
                )}
              />

              {/* Min Monthly Income */}
              <Controller
                name="minMonthlyIncome"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Minimum Monthly Income (optional)"
                    type="number"
                    placeholder="0.00"
                    error={errors.minMonthlyIncome?.message}
                    {...field}
                  />
                )}
              />

              {/* Employment Type */}
              <Controller
                name="employmentType"
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Employment Type (optional)"
                    options={employmentTypes}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.employmentType?.message}
                  />
                )}
              />
              
              {/* Min CIBIL Score */}
              <Controller
                name="minCibilScore"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Minimum CIBIL Score (optional)"
                    type="number"
                    placeholder="300"
                    error={errors.minCibilScore?.message}
                    icon={CreditCard}
                    {...field}
                  />
                )}
              />

              {/* Max CIBIL Score */}
              <Controller
                name="maxCibilScore"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Maximum CIBIL Score (optional)"
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
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center mb-6">
              <Shield className="w-5 h-5 text-blue-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Loan Rules</h3>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Controller
                    name="prepaymentAllowed"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <ToggleSwitch
                        label="Prepayment Allowed"
                        checked={value}
                        onChange={onChange}
                      />
                    )}
                  />
                  <p className="text-xs text-gray-500 mt-1 ml-1">Allow early partial repayment</p>
                </div>
                
                <div>
                  <Controller
                    name="foreclosureAllowed"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <ToggleSwitch
                        label="Foreclosure Allowed"
                        checked={value}
                        onChange={onChange}
                      />
                    )}
                  />
                  <p className="text-xs text-gray-500 mt-1 ml-1">Allow complete early repayment</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {watchPrepaymentAllowed && (
                  <div className="transition-all duration-300 ease-in-out">
                    <Controller
                      name="prepaymentCharges"
                      control={control}
                      render={({ field }) => (
                        <InputField
                          label="Prepayment Charges (%)"
                          type="number"
                          placeholder="0.00"
                          error={errors.prepaymentCharges?.message}
                          {...field}
                        />
                      )}
                    />
                  </div>
                )}
                
                {watchForeclosureAllowed && (
                  <div className="transition-all duration-300 ease-in-out">
                    <Controller
                      name="foreclosureCharges"
                      control={control}
                      render={({ field }) => (
                        <InputField
                          label="Foreclosure Charges (%)"
                          type="number"
                          placeholder="0.00"
                          error={errors.foreclosureCharges?.message}
                          {...field}
                        />
                      )}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 7: Status & Visibility */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center mb-6">
              <Eye className="w-5 h-5 text-blue-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Status & Visibility</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Controller
                    name="activeStatus"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <ToggleSwitch
                        label="Active Status"
                        checked={value}
                        onChange={onChange}
                      />
                    )}
                  />
                  <p className="text-xs text-gray-500 mt-1 ml-1">Enable this loan product</p>
                </div>
                
                <div>
                  <Controller
                    name="publicVisibility"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <ToggleSwitch
                        label="Public Visibility"
                        checked={value}
                        onChange={onChange}
                      />
                    )}
                  />
                  <p className="text-xs text-gray-500 mt-1 ml-1">Show on customer portal</p>
                </div>
                
                <div>
                  <Controller
                    name="approvalRequired"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <ToggleSwitch
                        label="Approval Required"
                        checked={value}
                        onChange={onChange}
                      />
                    )}
                  />
                  <p className="text-xs text-gray-500 mt-1 ml-1">Requires manual approval</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Estimated Processing Time */}
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
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Documents Required
                  </label>
                  <div className="flex items-start space-x-2">
                    <FileText className="w-4 h-4 text-gray-400 mt-1" />
                    <div className="relative w-full">
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-3">
                          {documentOptions.map((doc) => (
                            <label
                              key={doc.value}
                              className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                            >
                              <input
                                type="checkbox"
                                checked={watchDocumentsRequired?.includes(doc.value)}
                                onChange={() => handleDocumentChange(doc.value)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">
                                {doc.label}
                              </span>
                            </label>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">
                          Select required documents for this loan
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-white px-6 py-4 rounded-b-xl">
          <div className="flex flex-col sm:flex-row-reverse sm:justify-start gap-3">
            <Button
              type="submit"
              disabled={!isValid || createLoanTypeMutation.isLoading || updateLoanTypeMutation.isLoading}
            >
              {createLoanTypeMutation.isLoading || updateLoanTypeMutation.isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{editData ? "Updating..." : "Creating..."}</span>
                </div>
              ) : (
                editData ? "Update Loan Type" : "Create Loan Type"
              )}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
          
          {!isValid && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Please fill all required fields correctly to create the loan type
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default AddLoanTypesForm;