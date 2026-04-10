import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Shield,
  Users,
  FileText,
  CreditCard,
  BarChart2,
  Settings,
  Lock,
  Mail,
  User,
  Building2,
} from "lucide-react";
import StatusCard from "../../components/common/StatusCard";
import RoleForm from "../../components/forms/RoleForm";
// import { adminRoles } from '../../lib/dashboardDummyData';
import RoleManagementTable from "../../components/tables/RoleManagementTable";
// import { initialRoles, modules } from '../../lib/dumyData';
import ConfirmationDialog from "../../components/common/ConfirmationDialog";
import Button from "../../components/ui/Button";

export default function RoleManagement() {
  const initialRoles = [];
  const modules = [
    { id: "dashboard", name: "Dashboard", description: "Overview and metrics" },
    { id: "customers", name: "Customers", description: "Customer management" },
    {
      id: "loan-applications",
      name: "Loan Applications",
      description: "Loan application workflows",
    },
    {
      id: "loan-accounts",
      name: "Loan Accounts",
      description: "Active loan accounts",
    },
    { id: "payments", name: "Payments", description: "Payment processing" },
    { id: "reports", name: "Reports", description: "Analytics and reports" },
  ];
  // State management
  const [roles, setRoles] = useState(initialRoles);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [searchTerm, _setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const handleEdit = (role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedRole(null);
    setIsModalOpen(true);
  };

  // Handle role form submit (create or update)
  const handleRoleSubmit = async (data) => {
    if (selectedRole) {
      // update existing
      setRoles((prev) =>
        prev.map((r) => (r.id === selectedRole.id ? { ...r, ...data } : r)),
      );
    } else {
      // create new role
      const newRole = {
        id: `role-${Date.now()}`,
        name: data.name,
        email: data.email,
        description: data.description || "",
        permissions: data.permissions || [],
        userCount: 0,
      };
      setRoles((prev) => [newRole, ...prev]);
    }
  };

  // Delete role
  const handleDeleteRole = () => {
    if (roleToDelete) {
      setRoles(roles.filter((role) => role.id !== roleToDelete.id));
      setRoleToDelete(null);
    }
  };

  // Filter roles based on search
  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Get module name by ID
  const getModuleName = (moduleId) => {
    const module = modules.find((m) => m.id === moduleId);
    return module ? module.name : moduleId;
  };

  // Handle login with role
  const handleLogin = (role) => {
    alert(
      `Login Credentials:\nEmail: ${role.email}\nPassword: ${role.password}\n\nUse these credentials to login as ${role.name}`,
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Roles Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and assign permissions to different admin roles
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 
            px-4 py-2 rounded-lg transition-colors text-sm font-medium
            flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Role
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatusCard
          title="Total Roles"
          value={roles.length}
          icon={Users}
          colorClass="text-blue-600"
          bgClass="bg-blue-50"
        />
        <StatusCard
          title="Active Users"
          value={roles.reduce((acc, role) => acc + (role.userCount || 0), 0)}
          icon={Users}
          colorClass="text-green-600"
          bgClass="bg-green-50"
        />
        <StatusCard
          title="Inactive Users"
          value={roles.reduce((acc, role) => acc + (role.userCount || 0), 0)}
          icon={Users}
          colorClass="text-red-600"
          bgClass="bg-red-50"
        />
        <StatusCard
          title="Pending Users"
          value={roles.reduce((acc, role) => acc + (role.userCount || 0), 0)}
          icon={Users}
          colorClass="text-yellow-600"
          bgClass="bg-yellow-50"
        />
      </div>

      {isModalOpen && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-slate-100">
          <RoleForm
            onClose={() => setIsModalOpen(false)}
            onSubmit={async (data) => {
              await handleRoleSubmit(data);
              setIsModalOpen(false);
            }}
            editingRole={selectedRole}
            modules={modules}
          />
        </div>
      )}

      {/* Roles Table */}
      <RoleManagementTable
        roles={filteredRoles}
        loading={false}
        onEdit={handleEdit}
        onDelete={(role) => setRoleToDelete(role)}
        onLogin={handleLogin}
        getModuleName={getModuleName}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationDialog
        open={!!roleToDelete}
        title="Delete Role"
        description={
          roleToDelete
            ? `Are you sure you want to delete the role "${roleToDelete.name}"? This will remove permissions for ${roleToDelete.userCount} user${roleToDelete.userCount !== 1 ? "s" : ""}.`
            : ""
        }
        confirmText="Delete Role"
        cancelText="Cancel"
        variant="danger"
        isPopup={true}
        onConfirm={handleDeleteRole}
        onCancel={() => setRoleToDelete(null)}
      >
        {roleToDelete && (
          <div className="text-sm text-slate-600">
            <p className="font-medium">Role:</p>
            <p>{roleToDelete.name}</p>
          </div>
        )}
      </ConfirmationDialog>
    </div>
  );
}
