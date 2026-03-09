import { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  User, MapPin, Briefcase, FileText, Landmark, Key, ShieldCheck, Check,
  ChevronRight, ChevronLeft, UploadCloud, DollarSign, Phone, Mail
} from 'lucide-react';

import Button from '../ui/Button';
import InputField from '../ui/InputField';
import SelectField from '../ui/SelectField';
import ToggleSwitch from '../ui/ToggleSwitch';
import TextAreaField from '../ui/TextAreaField';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeSchema } from '../../validations/EmployeeValidation';
import { ToasterProvider } from '../../providers/toasterProvider';

export const AddEmployeeForm = ({
  initialFormState,
  isEditing,
  editId,
  onCancel,
  onSuccess
}) => {
  // Refs for file inputs
  const aadhaarFrontRef = useRef(null);
  const aadhaarBackRef = useRef(null);
  const panRef = useRef(null);
  const photoRef = useRef(null);
  const resumeRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [files, setFiles] = useState({
    aadhaarFrontImg: null,
    aadhaarBackImg: null,
    panImg: null,
    profilePhoto: null,
    resume: null
  });

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting, isValid },
    trigger
  } = useForm({
  resolver: zodResolver(employeeSchema),
  mode: "onChange",
    defaultValues: initialFormState || {
      fullName: '',
      email: '',
      contactNumber: '',
      atlMobileNumber: '',
      dob: '',
      gender: 'MALE',
      maritalStatus: 'SINGLE',
      userName: '',
      password: '',

      address: '',
      city: '',
      state: '',
      pinCode: '',
      emergencyContact: '',
      emergencyRelationship: 'FATHER',

      department: 'Sales',
      designation: '',
      dateOfJoining: '',
      experience: '',
      workLocation: 'OFFICE',

      aadhaarNo: '',
      panNo: '',
      accountHolder: '',
      bankName: '',
      bankAccountNo: '',
      ifsc: '',
      upiId: '',

      basicSalary: '',
      hra: '',
      conveyance: '',
      medicalAllowance: '',
      otherAllowances: '',
      pfDeduction: '',
      taxDeduction: '',

      status: 'Active',
      permissions: {
        canAddCustomer: false,
        canViewAllCustomers: false,
        canProcessLoans: false,
        canManageLeads: false,
        canGenerateReports: false
      }
    }
  });

  const steps = [
    { id: 1, title: "Personal Info", icon: <User size={18} /> },
    { id: 2, title: "Professional", icon: <Briefcase size={18} /> },
    { id: 3, title: "KYC & Banking", icon: <Landmark size={18} /> },
    { id: 4, title: "Salary & Access", icon: <ShieldCheck size={18} /> }
  ];

  // Validation schemas for each step
  const validateStep = async (step) => {
    let fieldsToValidate = [];

    switch (step) {
      case 1:
        fieldsToValidate = ['fullName', 'email', 'contactNumber'];
        break;
      case 2:
        fieldsToValidate = ['address', 'city', 'state', 'pinCode', 'department', 'designation'];
        break;
      case 3:
        fieldsToValidate = ['aadhaarNo', 'panNo', 'accountHolder', 'bankName', 'bankAccountNo', 'ifsc'];
        break;
      case 4:
        fieldsToValidate = ['basicSalary'];
        break;
      default:
        return true;
    }

    const isValid = await trigger(fieldsToValidate);
    return isValid;
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({ ...prev, [fieldName]: file }));
      setValue(fieldName, file); 
    }
  };

  const generateCredentials = () => {
    const fullName = getValues('fullName');
    if (fullName) {
      const username = fullName.toLowerCase().replace(/\s+/g, '.') + Math.floor(Math.random() * 1000);
      const password = Math.random().toString(36).slice(-8) + Math.floor(Math.random() * 100);

      setValue('userName', username);
      setValue('password', password);
      ToasterProvider.success('Credentials generated!');
    } else {
      ToasterProvider.error('Please enter full name first');
    }
  };

  const calculateTotalSalary = () => {
    const basic = Number(watch('basicSalary')) || 0;
    const hra = Number(watch('hra')) || 0;
    const conveyance = Number(watch('conveyance')) || 0;
    const medical = Number(watch('medicalAllowance')) || 0;
    const other = Number(watch('otherAllowances')) || 0;
    const pf = Number(watch('pfDeduction')) || 0;
    const tax = Number(watch('taxDeduction')) || 0;

    const gross = basic + hra + conveyance + medical + other;
    const net = gross - pf - tax;

    return { gross, net };
  };

  const onSubmit = async (data) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const branchId = user?.branchId || user?.employee?.branchId || "";

    const payload = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      role: "EMPLOYEE",
      contactNumber: data.contactNumber,
      atlMobileNumber: data.atlMobileNumber || data.contactNumber,
      userName: data.userName,
      dob: data.dob,
      dateOfJoining: data.dateOfJoining,
      gender: data.gender,
      maritalStatus: data.maritalStatus,
      designation: data.designation,
      department: data.department,
      emergencyContact: data.emergencyContact,
      emergencyRelationship: data.emergencyRelationship,
      address: data.address,
      city: data.city,
      state: data.state,
      pinCode: data.pinCode,
      isActive: data.status === "Active",
      workLocation: data.workLocation,
      salary: Number(data.basicSalary),
      branchId,
    };

    if (onSuccess) {
      onSuccess(payload, files);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* STEPPER HEADER */}
      <div className="bg-gray-50 border-b border-gray-200 p-6">
        <div className="flex items-center justify-between relative mb-6">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 z-0"></div>
          <div
            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-blue-600 z-0 transition-all duration-500"
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          ></div>

          {steps.map((step) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${currentStep >= step.id
                  ? 'bg-blue-600 text-white shadow-blue-200 shadow-lg scale-110'
                  : 'bg-white border-2 border-gray-300 text-gray-400'
                }`}>
                {currentStep > step.id ? <Check size={18} /> : step.id}
              </div>
              <span className={`text-xs font-semibold ${currentStep >= step.id ? 'text-blue-700' : 'text-gray-400'
                }`}>{step.title}</span>
            </div>
          ))}
        </div>
        <h2 className="text-xl font-bold text-gray-800 text-center">
          {isEditing ? `Edit Employee #${editId}` : "Register New Employee"}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8">
        {/* Step 1: Personal Info */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="md:col-span-3 pb-2 border-b border-gray-100 mb-2">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <User size={18} className="text-blue-500" /> Personal Information
              </h3>
            </div>

            <InputField
              label="Full Name"
              {...register('fullName')}
              error={errors.fullName?.message}
              isRequired
              icon={User}
              placeholder="e.g. Rahul Sharma"
            />

            <InputField
              label="Email Address"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              isRequired
              icon={Mail}
              placeholder="rahul@company.com"
            />

            <InputField
              label="Phone Number"
              type="tel"
              {...register('contactNumber')}
              error={errors.contactNumber?.message}
              isRequired
              icon={Phone}
              placeholder="9876543210"
            />

            <InputField
              label="Alternate Phone"
              type="tel"
              {...register('atlMobileNumber')}
              icon={Phone}
              placeholder="Optional"
            />

            <InputField
              label="Date of Birth"
              type="date"
              {...register('dob')}
            />

            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Gender"
                  options={[
                    { value: 'MALE', label: 'Male' },
                    { value: 'FEMALE', label: 'Female' },
                    { value: 'OTHER', label: 'Other' }
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              name="maritalStatus"
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Marital Status"
                  options={[
                    { value: 'SINGLE', label: 'Single' },
                    { value: 'MARRIED', label: 'Married' },
                    { value: 'DIVORCED', label: 'Divorced' },
                    { value: 'WIDOWED', label: 'Widowed' }
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <div className="md:col-span-3 pb-2 border-b border-gray-100 mb-2 mt-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Key size={18} className="text-blue-500" /> Login Credentials
              </h3>
            </div>

            <InputField
              label="Username"
              {...register('userName')}
              error={errors.userName?.message}
              icon={User}
              placeholder="Create username"
            />

            <InputField
              label="Password"
              type="password"
              {...register('password')}
              error={errors.password?.message}
              icon={Key}
              placeholder="••••••••"
            />

            <div className="flex items-end">
              <Button
                type="button"
                onClick={generateCredentials}
                className="w-full"
              >
                <Key size={16} /> Auto Generate
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Professional Details */}
        {currentStep === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="md:col-span-3 pb-2 border-b border-gray-100 mb-2">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <MapPin size={18} className="text-blue-500" /> Address & Contact
              </h3>
            </div>

            <div className="md:col-span-3">
              <TextAreaField
                label="Full Address"
                {...register('address')}
                error={errors.address?.message}
                rows={2}
                placeholder="Complete address..."
              />
            </div>

            <InputField
              label="City"
              {...register('city')}
              error={errors.city?.message}
            />

            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <SelectField
                  label="State"
                  options={[
                    { value: 'Delhi', label: 'Delhi' },
                    { value: 'Maharashtra', label: 'Maharashtra' },
                    { value: 'Karnataka', label: 'Karnataka' },
                    { value: 'Tamil Nadu', label: 'Tamil Nadu' },
                    { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
                    { value: 'Gujarat', label: 'Gujarat' },
                    { value: 'Rajasthan', label: 'Rajasthan' }
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.state?.message}
                  isRequired
                />
              )}
            />

            <InputField
              label="Pin Code"
              {...register('pinCode')}
              error={errors.pinCode?.message}
            />

            <div className="md:col-span-3 pb-2 border-b border-gray-100 mb-2 mt-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Phone size={18} className="text-blue-500" /> Emergency Contact
              </h3>
            </div>

            <InputField
              label="Emergency Contact"
              {...register('emergencyContact')}
              error={errors.emergencyContact?.message}
              placeholder="Emergency phone number"
            />

            <Controller
              name="emergencyRelationship"
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Relationship"
                  options={[
                    { value: 'FATHER', label: 'Father' },
                    { value: 'MOTHER', label: 'Mother' },
                    { value: 'SPOUSE', label: 'Spouse' },
                    { value: 'SIBLING', label: 'Sibling' },
                    { value: 'FRIEND', label: 'Friend' },
                    { value: 'OTHER', label: 'Other' }
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <div className="md:col-span-3 pb-2 border-b border-gray-100 mb-2 mt-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Briefcase size={18} className="text-blue-500" /> Professional Details
              </h3>
            </div>

            <Controller
              name="department"
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Department"
                  options={[
                    { value: 'Sales', label: 'Sales' },
                    { value: 'Marketing', label: 'Marketing' },
                    { value: 'Operations', label: 'Operations' },
                    { value: 'HR', label: 'HR' },
                    { value: 'Finance', label: 'Finance' },
                    { value: 'IT', label: 'IT' },
                    { value: 'Customer Service', label: 'Customer Service' }
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.department?.message}
                  isRequired
                />
              )}
            />

            <InputField
              label="Designation"
              {...register('designation')}
              error={errors.designation?.message}
              placeholder="e.g. Sales Executive"
            />

            <InputField
              label="Date of Joining"
              type="date"
              {...register('dateOfJoining')}
            />

            <InputField
              label="Experience"
              {...register('experience')}
              placeholder="e.g. 3 Years"
            />

            <Controller
              name="workLocation"
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Work Location"
                  options={[
                    { value: 'OFFICE', label: 'Office' },
                    { value: 'REMOTE', label: 'Remote' },
                    { value: 'HYBRID', label: 'Hybrid' }
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        )}

        {/* Step 3: KYC & Banking */}
        {currentStep === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* KYC Section */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText size={18} className="text-blue-500" /> KYC Documents
              </h3>

              <div className="space-y-4">
                <div>
                  <InputField
                    label="Aadhaar Number"
                    {...register('aadhaarNo')}
                    error={errors.aadhaarNo?.message}
                    placeholder="12 Digit Number"
                  />

                  <div className="flex gap-2 mt-2">
                    {/* Aadhaar Front Upload */}
                    <div
                      onClick={() => aadhaarFrontRef.current?.click()}
                      className={`flex-1 border-2 border-dashed rounded-lg h-24 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition relative overflow-hidden ${files.aadhaarFrontImg ? 'border-green-400 bg-green-50' : 'border-gray-300'
                        }`}
                    >
                      <input
                        type="file"
                        ref={aadhaarFrontRef}
                        onChange={(e) => handleFileChange(e, 'aadhaarFrontImg')}
                        className="hidden"
                        accept="image/*"
                      />
                      {files.aadhaarFrontImg ? (
                        <img
                          src={URL.createObjectURL(files.aadhaarFrontImg)}
                          alt="Front"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <>
                          <UploadCloud size={20} className="text-gray-400" />
                          <span className="text-[10px] text-gray-500">Front Image</span>
                        </>
                      )}
                    </div>

                    {/* Aadhaar Back Upload */}
                    <div
                      onClick={() => aadhaarBackRef.current?.click()}
                      className={`flex-1 border-2 border-dashed rounded-lg h-24 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition relative overflow-hidden ${files.aadhaarBackImg ? 'border-green-400 bg-green-50' : 'border-gray-300'
                        }`}
                    >
                      <input
                        type="file"
                        ref={aadhaarBackRef}
                        onChange={(e) => handleFileChange(e, 'aadhaarBackImg')}
                        className="hidden"
                        accept="image/*"
                      />
                      {files.aadhaarBackImg ? (
                        <img
                          src={URL.createObjectURL(files.aadhaarBackImg)}
                          alt="Back"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <>
                          <UploadCloud size={20} className="text-gray-400" />
                          <span className="text-[10px] text-gray-500">Back Image</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <InputField
                    label="PAN Number"
                    {...register('panNo')}
                    error={errors.panNo?.message}
                    placeholder="ABCDE1234F"
                  />

                  <div
                    onClick={() => panRef.current?.click()}
                    className={`mt-2 w-full border-2 border-dashed rounded-lg h-24 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition relative overflow-hidden ${files.panImg ? 'border-green-400 bg-green-50' : 'border-gray-300'
                      }`}
                  >
                    <input
                      type="file"
                      ref={panRef}
                      onChange={(e) => handleFileChange(e, 'panImg')}
                      className="hidden"
                      accept="image/*"
                    />
                    {files.panImg ? (
                      <img
                        src={URL.createObjectURL(files.panImg)}
                        alt="PAN"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <>
                        <UploadCloud size={20} className="text-gray-400" />
                        <span className="text-[10px] text-gray-500">Upload PAN Card</span>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                    Resume (Optional)
                  </label>
                  <div
                    onClick={() => resumeRef.current?.click()}
                    className={`w-full border-2 border-dashed rounded-lg h-24 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition ${files.resume ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                      }`}
                  >
                    <input
                      type="file"
                      ref={resumeRef}
                      onChange={(e) => handleFileChange(e, 'resume')}
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                    />
                    {files.resume ? (
                      <div className="text-center">
                        <FileText size={20} className="text-blue-500 mx-auto" />
                        <span className="text-[10px] text-blue-600">{files.resume.name}</span>
                      </div>
                    ) : (
                      <>
                        <UploadCloud size={20} className="text-gray-400" />
                        <span className="text-[10px] text-gray-500">Upload Resume</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Banking Section */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Landmark size={18} className="text-blue-500" /> Banking Details
              </h3>

              <div className="space-y-3">
                <InputField
                  label="Account Holder Name"
                  {...register('accountHolder')}
                  error={errors.accountHolder?.message}
                />

                <InputField
                  label="Bank Name"
                  {...register('bankName', { required: 'Bank name is required' })}
                  error={errors.bankName?.message}
                />

                <InputField
                  label="Account Number"
                  {...register('bankAccountNo')}
                  error={errors.bankAccountNo?.message}
                />

                <InputField
                  label="IFSC Code"
                  {...register('ifsc')}
                  error={errors.ifsc?.message}
                  placeholder="e.g. HDFC0001234"
                />

                <InputField
                  label="UPI ID (Optional)"
                  {...register('upiId')}
                  placeholder="username@bank"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Salary & Access */}
        {currentStep === 4 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Salary Section */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <DollarSign size={18} className="text-blue-500" /> Salary Structure
              </h3>

              <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                <div className="space-y-3">
                  <InputField
                    label="Basic Salary"
                    type="number"
                    {...register('basicSalary', { valueAsNumber: true })}
                    error={errors.basicSalary?.message}
                    isRequired
                    placeholder="e.g. 45000"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <InputField
                      label="HRA"
                      type="number"
                      {...register('hra')}
                      placeholder="e.g. 9000"
                    />

                    <InputField
                      label="Conveyance"
                      type="number"
                      {...register('conveyance')}
                      placeholder="e.g. 1600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <InputField
                      label="Medical Allowance"
                      type="number"
                      {...register('medicalAllowance')}
                      placeholder="e.g. 1250"
                    />

                    <InputField
                      label="Other Allowances"
                      type="number"
                      {...register('otherAllowances')}
                      placeholder="e.g. 5000"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <InputField
                      label="PF Deduction"
                      type="number"
                      {...register('pfDeduction')}
                      placeholder="e.g. 1800"
                    />

                    <InputField
                      label="Tax Deduction"
                      type="number"
                      {...register('taxDeduction')}
                      placeholder="e.g. 2000"
                    />
                  </div>

                  {/* Salary Preview */}
                  <div className="mt-4 p-3 bg-green-100 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">Total Salary Preview:</span>
                      <span className="text-lg font-bold text-green-700">
                        ₹{calculateTotalSalary().net.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      Gross: ₹{calculateTotalSalary().gross.toLocaleString()} |
                      Net: ₹{calculateTotalSalary().net.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status & Permissions */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ShieldCheck size={18} className="text-blue-500" /> Status & Permissions
              </h3>

              <div className="space-y-4">
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <SelectField
                      label="Account Status"
                      options={[
                        { value: 'Active', label: 'Active' },
                        { value: 'Inactive', label: 'Inactive' },
                        { value: 'On Leave', label: 'On Leave' },
                        { value: 'Probation', label: 'Probation' }
                      ]}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />

                {/* Permissions */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-3">
                    System Permissions
                  </label>

                  <div className="space-y-2">
                    <Controller
                      name="permissions.canAddCustomer"
                      control={control}
                      render={({ field }) => (
                        <ToggleSwitch
                          checked={field.value}
                          onChange={field.onChange}
                          label="Can Add Customer"
                          size="sm"
                        />
                      )}
                    />

                    <Controller
                      name="permissions.canViewAllCustomers"
                      control={control}
                      render={({ field }) => (
                        <ToggleSwitch
                          checked={field.value}
                          onChange={field.onChange}
                          label="Can View All Customers"
                          size="sm"
                        />
                      )}
                    />

                    <Controller
                      name="permissions.canProcessLoans"
                      control={control}
                      render={({ field }) => (
                        <ToggleSwitch
                          checked={field.value}
                          onChange={field.onChange}
                          label="Can Process Loans"
                          size="sm"
                        />
                      )}
                    />

                    <Controller
                      name="permissions.canManageLeads"
                      control={control}
                      render={({ field }) => (
                        <ToggleSwitch
                          checked={field.value}
                          onChange={field.onChange}
                          label="Can Manage Leads"
                          size="sm"
                        />
                      )}
                    />

                    <Controller
                      name="permissions.canGenerateReports"
                      control={control}
                      render={({ field }) => (
                        <ToggleSwitch
                          checked={field.value}
                          onChange={field.onChange}
                          label="Can Generate Reports"
                          size="sm"
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Profile Photo */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-3">
                    Profile Photo
                  </label>

                  <div
                    onClick={() => photoRef.current?.click()}
                    className={`w-32 h-32 mx-auto border-2 border-dashed rounded-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition relative overflow-hidden ${files.profilePhoto ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                      }`}
                  >
                    <input
                      type="file"
                      ref={photoRef}
                      onChange={(e) => handleFileChange(e, 'profilePhoto')}
                      className="hidden"
                      accept="image/*"
                    />
                    {files.profilePhoto ? (
                      <img
                        src={URL.createObjectURL(files.profilePhoto)}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <>
                        <User size={32} className="text-gray-400" />
                        <span className="text-[10px] text-gray-500 mt-1">Upload Photo</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between pt-6 border-t border-gray-100">
          {currentStep === 1 ? (
            <Button
              type="button"
              onClick={onCancel}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600"
            >
              Cancel
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600"
            >
              <ChevronLeft size={18} /> Back
            </Button>
          )}

          {currentStep < 4 ? (
            <Button
              type="button"
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Next Step <ChevronRight size={18} />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isSubmitting ? (
                <>Processing...</>
              ) : (
                <>{isEditing ? "Update Employee" : "Submit Employee"}</>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};