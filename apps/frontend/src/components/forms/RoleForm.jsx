import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Save,
  Shield,
  X,
} from "lucide-react";
import { roleSchema } from "../../validations/RoleValidation";
import Button from "../ui/Button";
import { DOCUMENT_OPTIONS } from "../../constants/loanType";
import SelectField from "../ui/SelectField";
import { useWatch } from "react-hook-form";
import ToggleSwitch from "../ui/ToggleSwitch";

export default function RoleForm({
  onClose,
  onSubmit,
  editingRole,
  modules = [],
}) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid, isDirty, isSubmitted },
  } = useForm({
    resolver: zodResolver(roleSchema),
    mode: "onChange",
    defaultValues: {
      roleTitle: "",
      roleName: "",
      documentsRequired: [],
      documentsOptions: [],
      isActive: true,
    },
  });

  const toMachineName = (str) => {
    if (!str) return "";
    return str
      .replace(/\s+/g, "_")
      .replace(/[^A-Za-z0-9_]/g, "_")
      .replace(/__+/g, "_")
      .replace(/^_+|_+$/g, "")
      .toUpperCase();
  };
 
  const documentsRequiredWatch = useWatch({ control, name: "documentsRequired" }) || [];
  const documentsOptionsWatch = useWatch({ control, name: "documentsOptions" }) || [];
  const roleTitleWatch = useWatch({ control, name: "roleTitle" }) || "";


  // (removed unused watchPermissions)

  // Initialize form data when editing or opening
  useEffect(() => {
    if (editingRole) {
      reset({
        roleTitle: editingRole.roleTitle || "",
        roleName: editingRole.roleName || "",
        documentsRequired: editingRole.documentsRequired
          ? String(editingRole.documentsRequired).split(",").filter(Boolean)
          : [],
        documentsOptions: editingRole.documentsOptions
          ? String(editingRole.documentsOptions).split(",").filter(Boolean)
          : [],
        isActive: editingRole.isActive ?? true,
      });
    } else {
      reset({
        roleTitle: "",
        roleName: "",
        documentsRequired: [],
        documentsOptions: [],
        isActive: true,
      });
    }
  }, [editingRole, reset]);

  

  const onFormSubmit = (data) => {
    const payload = {
      roleTitle: data.roleTitle?.trim(),
      roleName: data.roleName?.trim() || toMachineName(data.roleTitle),
      roleFor: editingRole?.roleFor || "Employee",
      // serialize arrays into comma-separated string (backend expects string fields)
      documentsRequired: (data.documentsRequired || []).join(","),
      documentsOptions: (data.documentsOptions || []).length
        ? (data.documentsOptions || []).join(",")
        : undefined,
      isActive: data.isActive ?? true,
    };

    console.log("RoleForm submit payload:", payload);

    onSubmit(payload);
  };

  // Grouped role options (organization structure)
  const roleGroups = [
    {
      id: 1,
      title: "Leadership / Management",
      roles: [
        "Managing Director/Director/Executive Director",
        "Chief Executive Officer (CEO)",
        "Chief Financial Officer (CFO)",
        "Head – Business",
        "Head – Credit",
        "Head – Operations",
        "Head – Collections",
        "Head – Human Resources",
        "Head – Technology",
      ],
    },
    {
      id: 2,
      title: "Sales / Sourcing Team",
      roles: [
        "Relationship Officer",
        "Branch Sales Manager",
        "Branch Manager",
        "Area Head",
        "Regional Head",
        "Zonal Head",
        "Relationship Manager – Partnerships",
      ],
    },
    {
      id: 3,
      title: "Credit / Underwriting Team",
      roles: [
        "Credit Analyst",
        "Credit Manager",
        "Assistant Credit Manager",
        "Underwriter",
        "Regional Credit Manager",
      ],
    },
    {
      id: 4,
      title: "Operations Team",
      roles: [
        "Operations Executive",
        "Senior Operations Executive",
        "Disbursement Executive",
        "Operations Manager",
      ],
    },
    {
      id: 5,
      title: "Collections / Recovery Team",
      roles: [
        "Collection Executive",
        "Telecaller (Collections)",
        "Field Collection Officer",
        "Collection Manager",
        "Recovery Manager",
      ],
    },
    {
      id: 6,
      title: "Finance & Accounts",
      roles: ["Accounts Executive", "Finance Executive", "Finance Manager"],
    },
    {
      id: 7,
      title: "Compliance & Legal",
      roles: ["Compliance Officer", "Legal Executive", "Legal Manager"],
    },
    {
      id: 8,
      title: "MIS / Analytics / IT",
      roles: ["MIS Executive", "Data Analyst", "IT Executive / System Admin"],
    },
    {
      id: 9,
      title: "HR & Admin",
      roles: ["HR Executive", "Admin Executive", "HR Manager", "Admin Manager"],
    },
    {
      id: 10,
      title: "Technology",
      roles: ["Business Analyst", "IT Executive", "IT Manager"],
    },
    {
      id: 11,
      title: "Treasury/PIVG",
      roles: [
        "Treasury Head",
        "Manager – Lenders",
        "Manager – Equity",
        "Deputy Manager – Lenders",
        "Deputy Manager – Equity",
        "ALM & Liquidity Manager",
      ],
    },
    {
      id: 12,
      title: "Secretarial, Audit & Risk Control",
      roles: [
        "Company Secretary",
        "Internal Auditor",
        "Risk & Control Officer",
      ],
    },
  ];

  const titleOptions = roleGroups.map((g) => ({
    label: g.title,
    value: String(g.id),
  }));

  const selectedGroupId =
    roleGroups.find((g) => g.title === roleTitleWatch)?.id?.toString() || null;
  const selectedGroup = roleGroups.find((g) => String(g.id) === selectedGroupId);
  const roleNameOptions = selectedGroup
    ? selectedGroup.roles.map((r) => ({
        label: r,
        value: toMachineName(r),
      }))
    : [];

  const getOptionValue = (v) => {
    if (v == null) return v;
    if (typeof v === "object" && v !== null && "value" in v) return v.value;
    return v;
  };

  // Don't render if no modules
  if (modules.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Modules Available
          </h3>
          <p className="text-sm">
            Please configure modules before creating roles.
          </p>
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
              {editingRole ? "Edit Role" : "Create New Role"}
            </h2>
            <p className="text-gray-600 text-sm">
              {editingRole
                ? "Update role details and permissions"
                : "Configure new role details and permissions"}
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
        <div className="grid grid-cols-1  gap-8">
          
          <div className="space-y-6">

           
            <Controller
              name="roleTitle"
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Role Title"
                  options={titleOptions}
                  value={selectedGroupId || null}
                  onChange={(value) => {
                    const val = getOptionValue(value);
                    const group = roleGroups.find((g) => String(g.id) === String(val));
                    field.onChange(group?.title || "");
                    setValue("roleName", "", {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                  isSearchable
                  inlineMenu
                  placeholder="Choose title"
                  error={isSubmitted ? errors.roleTitle?.message : undefined}
                />
              )}
            />

            {/* Role Name (roles of selected title) */}
            <Controller
              name="roleName"
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Role Name"
                  options={roleNameOptions}
                  value={field.value || ""}
                  onChange={(value) => field.onChange(getOptionValue(value) || "")}
                  isSearchable
                  isDisabled={!selectedGroupId}
                  inlineMenu
                  placeholder={selectedGroupId ? "Choose role" : "Choose title first"}
                  error={errors.roleName?.message}
                />
              )}
            />

            

            {/* Documents Required (select from predefined options) */}
            <Controller
              name="documentsRequired"
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Documents Required"
                  options={DOCUMENT_OPTIONS.filter(
                    (opt) => !documentsOptionsWatch.includes(opt.value)
                  )}
                  value={field.value || []}
                  onChange={(value) => field.onChange(value || [])}
                  isMulti
                  isSearchable
                  placeholder="Select required documents"
                  error={errors.documentsRequired?.message}
                />
              )}
            />

            {/* Documents Options (optional) */}
            <Controller
              name="documentsOptions"
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Documents Options (optional)"
                  options={DOCUMENT_OPTIONS.filter(
                    (opt) => !documentsRequiredWatch.includes(opt.value)
                  )}
                  value={field.value || []}
                  onChange={(value) => field.onChange(value || [])}
                  isMulti
                  isSearchable
                  placeholder="Select optional documents"
                  error={errors.documentsOptions?.message}
                />
              )}
            />

            {/* Active Toggle */}
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <div className="rounded-lg border border-slate-200 px-3 py-2">
                  <ToggleSwitch
                    checked={!!field.value}
                    onChange={(checked) => field.onChange(checked)}
                    label={field.value ? "Active" : "Inactive"}
                  />
                </div>
              )}
            />

            
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
          <Button type="button" onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!isValid || (!isDirty && editingRole)}
          >
            <Save className="w-5 h-5 mr-2" />
            {editingRole ? "Update Role" : "Create Role"}
          </Button>
        </div>
      </form>
    </div>
  );
}
