import React, { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  X,
} from "lucide-react";
import { roleSchema } from "../../validations/RoleValidation";
import InputField from "../ui/InputField";
import TextAreaField from "../ui/TextAreaField";
import ToggleSwitch from "../ui/ToggleSwitch";
import Button from "../ui/Button";

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
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver: zodResolver(roleSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      description: "",
      permissions: {},
    },
  });

  // (removed unused watchPermissions)

  // Initialize form data when editing or opening
  useEffect(() => {
    if (modules.length === 0) return; // Don't initialize if no modules

    if (editingRole) {
      const permissionObject = modules.reduce(
        (acc, module) => ({
          ...acc,
          [module.id]: editingRole.permissions?.includes(module.id) || false,
        }),
        {},
      );

      reset({
        name: editingRole.name || "",
        email: editingRole.email || "",
        password: "", // Don't pre-fill password for security
        description: editingRole.description || "",
        permissions: permissionObject,
      });
    } else {
      // Initialize with all permissions false
      reset({
        name: "",
        email: "",
        password: "",
        description: "",
        permissions: modules.reduce(
          (acc, module) => ({
            ...acc,
            [module.id]: false,
          }),
          {},
        ),
      });
    }
  }, [editingRole, modules, reset]);

  // Handle form submission
  const onFormSubmit = (data) => {
    const activePermissions = Object.entries(data.permissions || {})
      .filter(([, isActive]) => isActive)
      .map(([moduleId]) => moduleId);

    const submitData = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      description: data.description?.trim() || "",
      permissions: activePermissions,
      ...(data.password ? { password: data.password } : {}),
    };

    onSubmit(submitData);
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

  // Custom select component for grouped roles
  function RoleSelect({ field, error }) {
    const [openGroup, setOpenGroup] = useState(false);
    const [openRole, setOpenRole] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [selectedRole, setSelectedRole] = useState(field.value || "");
    const [isCustomRole, setIsCustomRole] = useState(false);
    const [customRole, setCustomRole] = useState("");
    const containerRef = useRef(null);

    useEffect(() => {
      // initialize selected group from field value if possible
      if (field && field.value) {
        const found = roleGroups.find((g) => g.roles.includes(field.value));
        if (found) {
          setSelectedGroupId(found.id);
          setSelectedRole(field.value);
          setIsCustomRole(false);
          setCustomRole("");
        } else {
          // treat as custom role
          setIsCustomRole(true);
          setCustomRole(field.value);
          setSelectedRole(field.value);
        }
      }

      function handleClickOutside(e) {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
          setOpenGroup(false);
          setOpenRole(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [field]);

    useEffect(() => {
      // keep field value in sync when selectedRole changes
      if (selectedRole && !isCustomRole && field && field.onChange)
        field.onChange(selectedRole);
    }, [selectedRole, field, isCustomRole]);

    useEffect(() => {
      // keep field value in sync when customRole changes
      if (isCustomRole && customRole && field && field.onChange)
        field.onChange(customRole);
    }, [customRole, isCustomRole, field]);

    const groupsList = roleGroups;
    const rolesForSelected = selectedGroupId
      ? roleGroups.find((g) => g.id === selectedGroupId)?.roles || []
      : [];

    return (
      <div className="relative" ref={containerRef}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Role Title
        </label>

        <div className="flex gap-3">
          <div className="w-1/2 relative">
            <button
              type="button"
              onClick={() => {
                setOpenGroup((s) => !s);
                setOpenRole(false);
              }}
              className="w-full text-left bg-white border border-gray-200 rounded-md px-3 py-2 flex items-center justify-between"
            >
              <span
                className={selectedGroupId ? "text-slate-800" : "text-gray-400"}
              >
                {selectedGroupId
                  ? roleGroups.find((g) => g.id === selectedGroupId).title
                  : "Select title"}
              </span>
              <span className="text-gray-500">▾</span>
            </button>

            {openGroup && (
              <div className="absolute z-40 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                {groupsList.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      setSelectedGroupId(g.id);
                      setOpenGroup(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 flex items-center justify-center rounded bg-blue-100 text-blue-700 font-semibold">
                        {g.id}
                      </div>
                      <div>{g.title}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-1/2 relative">
            <label className="sr-only">Role</label>
            <button
              type="button"
              onClick={() => selectedGroupId && setOpenRole((s) => !s)}
              disabled={!selectedGroupId}
              className={`w-full text-left bg-white border ${selectedGroupId ? "border-gray-200" : "border-gray-100"} rounded-md px-3 py-2 flex items-center justify-between ${!selectedGroupId ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <span
                className={selectedRole ? "text-slate-800" : "text-gray-400"}
              >
                {selectedRole ||
                  (selectedGroupId ? "Select role" : "Choose title first")}
              </span>
              <span className="text-gray-500">▾</span>
            </button>

            {openRole && (
              <div className="absolute z-40 mt-2 right-0 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                {rolesForSelected.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setSelectedRole(r);
                      setIsCustomRole(false);
                      setCustomRole("");
                      setOpenRole(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                  >
                    {r}
                  </button>
                ))}

                {/* Other option */}
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomRole(true);
                    setCustomRole("");
                    setOpenRole(false);
                    setSelectedRole("");
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm font-medium border-t mt-2 pt-2"
                >
                  Other (custom)
                </button>
              </div>
            )}
          </div>
        </div>

        {isCustomRole && (
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Custom Role
            </label>
            <input
              type="text"
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
              placeholder="Enter custom role"
              className="w-full border border-gray-200 rounded-md px-3 py-2"
            />
          </div>
        )}

        {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
      </div>
    );
  }

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
                <RoleSelect field={field} error={errors.name?.message} />
              )}
            />

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
