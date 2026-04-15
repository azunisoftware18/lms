import { useMemo, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { User, MapPin, Briefcase, Key, Phone, Mail } from "lucide-react";
import { z } from "zod";

import Button from "../ui/Button";
import InputField from "../ui/InputField";
import SelectField from "../ui/SelectField";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeSchema } from "../../validations/EmployeeValidation";
import { showError, showSuccess } from "../../lib/utils/toastService";
import useEmployeeRoles from "../../hooks/useEmployeeRoles";
import { useBranches } from "../../hooks/useBranches";
import { useBranchAdmins } from "../../hooks/useBranchAdmin";

export default function AddEmployeeForm({
  initialFormState,
  isEditing,
  onCancel,
  onSuccess,
}) {
  const formSchema = isEditing
    ? employeeSchema.extend({
        password: z.union([employeeSchema.shape.password, z.literal("")]),
      })
    : employeeSchema;

  const { roles: employeeRoles = [], loading: rolesLoading } =
    useEmployeeRoles();
  const { branches = [], loading: branchesLoading } = useBranches({
    page: 1,
    limit: 500,
  });
  const { branchAdmins = [], loading: branchAdminsLoading } = useBranchAdmins({
    page: 1,
    limit: 500,
  });

  const [documentUploads, setDocumentUploads] = useState({});

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: initialFormState || {
      fullName: "",
      email: "",
      contactNumber: "",
      atlMobileNumber: "",
      dob: "",
      gender: "MALE",
      maritalStatus: "SINGLE",
      userName: "",
      password: "",
      address: "",
      city: "",
      state: "",
      pinCode: "",
      designation: "",
      roleTitle: "",
      employeeRoleId: "",
      gradeBand: "",
      reportingManager: "",
      branchCode: "",
      regionZone: "",
      dateOfJoining: "",
      experience: "",
      workLocation: "OFFICE",
      aadhaarNo: "",
      panNo: "",
      accountHolder: "",
      bankName: "",
      bankAccountNo: "",
      ifsc: "",
      upiId: "",
      basicSalary: "",
      conveyance: "",
      medicalAllowance: "",
      otherAllowances: "",
      pfDeduction: "",
      taxDeduction: "",
      status: "Active",
    },
  });

  const roleTitleValue = useWatch({ control, name: "roleTitle" }) || "";
  const selectedRoleId = useWatch({ control, name: "employeeRoleId" }) || "";
  const selectedBranchCode = useWatch({ control, name: "branchCode" }) || "";

  const generateCredentials = () => {
    const fullName = getValues("fullName");
    if (fullName) {
      const username =
        fullName.toLowerCase().replace(/\s+/g, ".") +
        Math.floor(Math.random() * 1000);
      const password =
        Math.random().toString(36).slice(-8) + Math.floor(Math.random() * 100);

      setValue("userName", username);
      setValue("password", password);
      showSuccess("Credentials generated!");
    } else {
      showError("Please enter full name first");
    }
  };

  const getOptionValue = (v) => {
    if (v == null) return v;
    if (typeof v === "object" && v !== null && "value" in v) return v.value;
    return v;
  };

  const activeRoles = employeeRoles.filter((r) => r.isActive ?? true);
  const roleTitleOptions = Array.from(
    new Set(activeRoles.map((r) => r.roleTitle).filter(Boolean)),
  ).map((title) => ({ label: title, value: title }));

  const roleOptions = activeRoles
    .filter((r) => !roleTitleValue || r.roleTitle === roleTitleValue)
    .map((r) => ({
      label: r.roleName || r.name || "-",
      value: r.id,
    }));

  const branchCodeOptions = Array.isArray(branches)
    ? branches
        .filter((b) => b?.code)
        .map((b) => ({
          value: b.code,
          label: b.name ? `${b.code} - ${b.name}` : b.code,
        }))
    : [];

  const selectedBranch = Array.isArray(branches)
    ? branches.find((b) => b?.code === selectedBranchCode)
    : null;

  const allowedBranchIds = (() => {
    if (!selectedBranch?.id) return [];
    const visited = new Set();
    const result = [];
    let current = selectedBranch;

    while (current?.id && !visited.has(current.id)) {
      visited.add(current.id);
      result.push(current.id);

      const parentId = current.parentBranchId || current.parentBranch?.id;
      if (!parentId) break;
      current = branches.find((b) => b.id === parentId);
    }

    return result;
  })();

  const reportingManagerOptions = Array.isArray(branchAdmins)
    ? branchAdmins
        .filter((admin) => {
          if (!allowedBranchIds.length) return false;
          const adminBranchId = admin?.branchId || admin?.branch?.id;
          return adminBranchId && allowedBranchIds.includes(adminBranchId);
        })
        .map((admin) => ({
          value: admin?.id || "",
          label:
            admin?.fullName || admin?.name || admin?.email || "Unknown Admin",
        }))
        .filter((opt) => opt.value)
    : [];

  const selectedRole = activeRoles.find((r) => r.id === selectedRoleId);
  const requiredDocuments = (selectedRole?.documentsRequired || "")
    .split(",")
    .map((doc) => doc.trim())
    .filter(Boolean);
  const optionalDocuments = (selectedRole?.documentsOptions || "")
    .split(",")
    .map((doc) => doc.trim())
    .filter(Boolean);

  const toDocKey = (doc) =>
    String(doc || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");

  const isAadhaarDocument = (doc) => {
    const key = toDocKey(doc);
    return (
      key.includes("aadhaar") ||
      key.includes("aadhar") ||
      key.includes("adhaar")
    );
  };

  const handleRoleDocumentUpload = (doc, side, file) => {
    if (!file) return;
    const key = toDocKey(doc);
    setDocumentUploads((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        [side]: file,
      },
    }));
  };

  const existingDocumentUploads = useMemo(() => {
    if (!isEditing) return {};

    const docs = Array.isArray(initialFormState?.documents)
      ? initialFormState.documents
      : [];
    if (!docs.length) return {};

    return docs.reduce((acc, doc) => {
      const docType = String(doc?.documentType || "").toUpperCase();
      if (!docType || docType.startsWith("EMP_")) return acc;

      const parts = docType.split("_");
      const maybeSide = parts[parts.length - 1];
      const side =
        maybeSide === "FRONT" || maybeSide === "BACK" || maybeSide === "FILE"
          ? maybeSide.toLowerCase()
          : "file";

      const baseType =
        side === "file" ? parts.join("_") : parts.slice(0, -1).join("_");
      const key = toDocKey(baseType);
      if (!key) return acc;

      acc[key] = {
        ...(acc[key] || {}),
        [side]: {
          name: doc?.documentPath || `${baseType}_${side}`,
          type: "existing",
          size: 0,
          isExisting: true,
        },
      };

      return acc;
    }, {});
  }, [isEditing, initialFormState]);

  const mergedDocumentUploads = useMemo(
    () => ({ ...existingDocumentUploads, ...documentUploads }),
    [existingDocumentUploads, documentUploads],
  );

  const onSubmit = async (data) => {
    const serializedRoleDocuments = Object.entries(documentUploads).reduce(
      (acc, [docKey, docSides]) => {
        acc[docKey] = Object.entries(docSides || {}).reduce(
          (sideAcc, [sideKey, file]) => {
            if (file?.name && !file?.isExisting) {
              sideAcc[sideKey] = {
                name: file.name,
                type: file.type || "",
                size: file.size || 0,
              };
            }
            return sideAcc;
          },
          {},
        );
        return acc;
      },
      {},
    );

    const payload = {
      fullName: data.fullName,
      email: data.email,
      password: data.password || undefined,
      role: "EMPLOYEE",
      contactNumber: data.contactNumber,
      atlMobileNumber: data.atlMobileNumber || "",
      userName: data.userName,
      dob: data.dob,
      gender: data.gender,
      maritalStatus: data.maritalStatus,
      designation: data.designation,
      roleTitle: data.roleTitle,
      employeeRoleId: data.employeeRoleId,
      gradeBand: data.gradeBand || "",
      reportingManager: data.reportingManager,
      branchCode: data.branchCode,
      regionZone: data.regionZone || "",
      dateOfJoining: data.dateOfJoining,
      experience: data.experience || "",
      workLocation: data.workLocation,
      city: data.city,
      state: data.state,
      pinCode: data.pinCode,
      accountHolder: data.accountHolder,
      bankName: data.bankName,
      bankAccountNo: data.bankAccountNo,
      ifsc: data.ifsc,
      upiId: data.upiId || "",
      basicSalary: Number(data.basicSalary || 0),
      conveyance: Number(data.conveyance || 0),
      medicalAllowance: Number(data.medicalAllowance || 0),
      otherAllowances: Number(data.otherAllowances || 0),
      pfDeduction: Number(data.pfDeduction || 0),
      taxDeduction: Number(data.taxDeduction || 0),
      status: data.status || "Active",
      isActive: data.status === "Active",
      salary: Number(data.basicSalary || 0),
      branchId: selectedBranch?.id || "",
      roleDocuments: serializedRoleDocuments,
    };

    if (isEditing && !payload.password) {
      delete payload.password;
    }

    if (onSuccess) {
      onSuccess(payload);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-8"
        autoComplete="off"
      >
        <input
          type="text"
          name="fake-username"
          autoComplete="username"
          className="hidden"
          tabIndex={-1}
        />
        <input
          type="password"
          name="fake-password"
          autoComplete="current-password"
          className="hidden"
          tabIndex={-1}
        />
        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="md:col-span-3 pb-2 border-b border-gray-100 mb-2">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <User size={18} className="text-blue-500" /> Personal Information
            </h3>
          </div>

          <InputField
            label="Full Name"
            {...register("fullName")}
            error={errors.fullName?.message}
            isRequired
            icon={User}
            placeholder="e.g. Rahul Sharma"
          />

          <InputField
            label="Email Address"
            type="email"
            {...register("email")}
            error={errors.email?.message}
            isRequired
            icon={Mail}
            placeholder="rahul@company.com"
          />

          <InputField
            label="Phone Number"
            type="tel"
            {...register("contactNumber")}
            error={errors.contactNumber?.message}
            isRequired
            icon={Phone}
            placeholder="9876543210"
          />

          <InputField
            label="Alternate Phone"
            type="tel"
            {...register("atlMobileNumber")}
            icon={Phone}
            placeholder="Optional"
          />

          <InputField
            label="Date of Birth"
            type="date"
            {...register("dob")}
            isRequired
          />

          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Gender"
                options={[
                  { value: "MALE", label: "Male" },
                  { value: "FEMALE", label: "Female" },
                  { value: "OTHER", label: "Other" },
                ]}
                value={field.value}
                onChange={field.onChange}
                isRequired
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
                  { value: "SINGLE", label: "Single" },
                  { value: "MARRIED", label: "Married" },
                  { value: "DIVORCED", label: "Divorced" },
                  { value: "WIDOWED", label: "Widowed" },
                ]}
                value={field.value}
                onChange={field.onChange}
                isRequired
              />
            )}
          />

          {/* Professional Details */}

          <InputField
            label="City"
            {...register("city")}
            error={errors.city?.message}
            isRequired
            icon={MapPin}
            placeholder="e.g. Ajmer"
          />

          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <SelectField
                label="State"
                options={[
                  { value: "Delhi", label: "Delhi" },
                  { value: "Maharashtra", label: "Maharashtra" },
                  { value: "Karnataka", label: "Karnataka" },
                  { value: "Tamil Nadu", label: "Tamil Nadu" },
                  { value: "Uttar Pradesh", label: "Uttar Pradesh" },
                  { value: "Gujarat", label: "Gujarat" },
                  { value: "Rajasthan", label: "Rajasthan" },
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
            {...register("pinCode")}
            error={errors.pinCode?.message}
            isRequired
            placeholder="e.g. 123456"
          />

          <div className="md:col-span-3 pb-2 border-b border-gray-100 mb-2 mt-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Briefcase size={18} className="text-blue-500" /> Professional
              Details
            </h3>
          </div>

          <Controller
            name="roleTitle"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Role Title"
                options={roleTitleOptions}
                value={field.value || ""}
                onChange={(value) => {
                  const nextTitle = getOptionValue(value) || "";
                  field.onChange(nextTitle);
                  setValue("employeeRoleId", "", {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                isSearchable
                placeholder={
                  rolesLoading ? "Loading role titles..." : "Choose role title"
                }
                error={errors.roleTitle?.message}
                isRequired
              />
            )}
          />

          <Controller
            name="employeeRoleId"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Role"
                options={roleOptions}
                value={field.value || ""}
                onChange={(value) =>
                  field.onChange(getOptionValue(value) || "")
                }
                isSearchable
                isDisabled={!roleTitleValue}
                placeholder={
                  roleTitleValue ? "Choose role" : "Choose role title first"
                }
                error={errors.employeeRoleId?.message}
                isRequired
              />
            )}
          />
          <InputField
            label="Designation"
            {...register("designation")}
            error={errors.designation?.message}
            placeholder="e.g. Sales Executive"
          />

          <Controller
            name="branchCode"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Branch Code"
                options={branchCodeOptions}
                value={field.value || ""}
                onChange={(value) => {
                  field.onChange(getOptionValue(value) || "");
                  setValue("reportingManager", "", {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                isSearchable
                isLoading={branchesLoading}
                placeholder={
                  branchesLoading ? "Loading branches..." : "Select branch code"
                }
                error={errors.branchCode?.message}
                isRequired
              />
            )}
          />
          <Controller
            name="reportingManager"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Reporting Manager"
                options={reportingManagerOptions}
                value={field.value || ""}
                onChange={(value) =>
                  field.onChange(getOptionValue(value) || "")
                }
                isSearchable
                isLoading={branchAdminsLoading}
                placeholder={
                  branchAdminsLoading
                    ? "Loading admins..."
                    : "Select reporting manager"
                }
                isRequired
                error={errors.reportingManager?.message}
              />
            )}
          />
          <InputField
            label="Date of Joining"
            type="date"
            {...register("dateOfJoining")}
          />

          <InputField
            label="Experience"
            {...register("experience")}
            placeholder="e.g. 3 Years"
          />

          <Controller
            name="workLocation"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Work Location/Branch"
                options={[
                  { value: "OFFICE", label: "Office" },
                  { value: "REMOTE", label: "Remote" },
                  { value: "HYBRID", label: "Hybrid" },
                ]}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <div className="md:col-span-3 rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
              <p className="text-sm font-semibold text-slate-800">
                Documents Based On Selected Role
              </p>
              {selectedRole && (
                <span className="text-xs rounded-full bg-blue-50 text-blue-700 px-2.5 py-1 font-medium">
                  {selectedRole.roleName || "Selected Role"}
                </span>
              )}
            </div>

            {!selectedRole ? (
              <p className="text-sm text-slate-500 bg-slate-50 border border-dashed border-slate-300 rounded-xl p-3">
                Choose Role Title and Role to view required and optional
                documents.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-red-100 bg-red-50/50 p-3">
                  <p className="text-xs font-bold uppercase text-slate-500 mb-2">
                    Required Documents
                  </p>
                  {requiredDocuments.length ? (
                    <div className="flex flex-wrap gap-2">
                      {requiredDocuments.map((doc) => (
                        <span
                          key={`req-${doc}`}
                          className="rounded-full bg-red-100 text-red-700 px-2.5 py-1 text-xs font-medium"
                        >
                          {doc}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">
                      No required documents.
                    </p>
                  )}
                </div>

                <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3">
                  <p className="text-xs font-bold uppercase text-slate-500 mb-2">
                    Optional Documents
                  </p>
                  {optionalDocuments.length ? (
                    <div className="flex flex-wrap gap-2">
                      {optionalDocuments.map((doc) => (
                        <span
                          key={`opt-${doc}`}
                          className="rounded-full bg-amber-100 text-amber-700 px-2.5 py-1 text-xs font-medium"
                        >
                          {doc}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">
                      No optional documents.
                    </p>
                  )}
                </div>
              </div>
            )}

            {selectedRole && (
              <div className="mt-5 border-t border-slate-200 pt-4">
                <p className="text-xs font-bold uppercase text-slate-500 mb-3">
                  Upload Role Documents
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...requiredDocuments, ...optionalDocuments].map((doc) => {
                    const key = toDocKey(doc);
                    const upload = mergedDocumentUploads[key] || {};
                    const needsFrontBack = isAadhaarDocument(doc);

                    return (
                      <div
                        key={`upload-${key}`}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <p className="text-sm font-medium text-slate-700 mb-2">
                          {doc}
                        </p>

                        {needsFrontBack ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs text-slate-500 block mb-1">
                                Front
                              </label>
                              <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) =>
                                  handleRoleDocumentUpload(
                                    doc,
                                    "front",
                                    e.target.files?.[0],
                                  )
                                }
                                className="block w-full text-xs text-slate-600 file:mr-2 file:rounded-md file:border-0 file:bg-blue-100 file:px-2.5 file:py-1.5 file:text-xs file:font-medium file:text-blue-700 hover:file:bg-blue-200"
                              />
                              {upload.front?.name && (
                                <p className="text-[11px] text-green-700 mt-1 truncate">
                                  {upload.front.name}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="text-xs text-slate-500 block mb-1">
                                Back
                              </label>
                              <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) =>
                                  handleRoleDocumentUpload(
                                    doc,
                                    "back",
                                    e.target.files?.[0],
                                  )
                                }
                                className="block w-full text-xs text-slate-600 file:mr-2 file:rounded-md file:border-0 file:bg-blue-100 file:px-2.5 file:py-1.5 file:text-xs file:font-medium file:text-blue-700 hover:file:bg-blue-200"
                              />
                              {upload.back?.name && (
                                <p className="text-[11px] text-green-700 mt-1 truncate">
                                  {upload.back.name}
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <label className="text-xs text-slate-500 block mb-1">
                              Upload
                            </label>
                            <input
                              type="file"
                              accept="image/*,.pdf,.doc,.docx"
                              onChange={(e) =>
                                handleRoleDocumentUpload(
                                  doc,
                                  "file",
                                  e.target.files?.[0],
                                )
                              }
                              className="block w-full text-xs text-slate-600 file:mr-2 file:rounded-md file:border-0 file:bg-blue-100 file:px-2.5 file:py-1.5 file:text-xs file:font-medium file:text-blue-700 hover:file:bg-blue-200"
                            />
                            {upload.file?.name && (
                              <p className="text-[11px] text-green-700 mt-1 truncate">
                                {upload.file.name}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="md:col-span-3 pb-2 border-b border-gray-100 mb-2">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              Account Details
            </h3>
          </div>

          <InputField
            label="Account Holder Name"
            {...register("accountHolder")}
            error={errors.accountHolder?.message}
            placeholder="e.g. Rahul Sharma"
            isRequired
          />

          <InputField
            label="Bank Name"
            {...register("bankName")}
            error={errors.bankName?.message}
            placeholder="e.g. HDFC Bank"
            isRequired
          />

          <InputField
            label="Bank Account Number"
            {...register("bankAccountNo")}
            error={errors.bankAccountNo?.message}
            placeholder="e.g. 123456789012"
            isRequired
          />

          <InputField
            label="IFSC Code"
            {...register("ifsc")}
            error={errors.ifsc?.message}
            placeholder="e.g. HDFC0001234"
            isRequired
          />

          <InputField
            label="UPI ID"
            {...register("upiId")}
            error={errors.upiId?.message}
            placeholder="e.g. rahul@hdfc"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="md:col-span-3 pb-2 border-b border-gray-100 mb-2">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              Salary Details
            </h3>
          </div>

          <InputField
            label="Basic Salary"
            type="number"
            {...register("basicSalary")}
            error={errors.basicSalary?.message}
            placeholder="e.g. 25000"
            isRequired
          />

          <InputField
            label="Conveyance"
            type="number"
            {...register("conveyance")}
            error={errors.conveyance?.message}
            placeholder="e.g. 1600"
          />

          <InputField
            label="Medical Allowance"
            type="number"
            {...register("medicalAllowance")}
            error={errors.medicalAllowance?.message}
            placeholder="e.g. 1250"
          />

          <InputField
            label="Other Allowances"
            type="number"
            {...register("otherAllowances")}
            error={errors.otherAllowances?.message}
            placeholder="e.g. 1000"
          />

          <InputField
            label="PF Deduction"
            type="number"
            {...register("pfDeduction")}
            error={errors.pfDeduction?.message}
            placeholder="e.g. 1800"
          />

          <InputField
            label="Tax Deduction"
            type="number"
            {...register("taxDeduction")}
            error={errors.taxDeduction?.message}
            placeholder="e.g. 2000"
          />

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Status"
                options={[
                  { value: "Active", label: "Active" },
                  { value: "Inactive", label: "Inactive" },
                ]}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="pb-2 border-b border-gray-100 mb-2 mt-8">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Key size={18} className="text-blue-500" /> Login Credentials
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            label="Username"
            {...register("userName")}
            error={errors.userName?.message}
            icon={User}
            placeholder="Create username"
            autoComplete="off"
          />

          <InputField
            label="Password"
            type="password"
            {...register("password")}
            error={errors.password?.message}
            icon={Key}
            placeholder="••••••••"
            autoComplete="new-password"
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

        {/* Form Actions */}
        <div className="mt-8 flex justify-between pt-6 border-t border-gray-100">
          <Button
            type="button"
            onClick={onCancel}
            className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-none"
          >
            <span className="text-blue-700">Cancel</span>
          </Button>

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
        </div>
      </form>
    </div>
  );
}
