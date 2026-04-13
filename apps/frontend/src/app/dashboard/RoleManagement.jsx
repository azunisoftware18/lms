import React, { useState } from "react";
import useEmployeeRoles from "../../hooks/useEmployeeRoles";
import {
  Plus,
  Users,
} from "lucide-react";
import StatusCard from "../../components/common/StatusCard";
import RoleForm from "../../components/forms/RoleForm";
// import { adminRoles } from '../../lib/dashboardDummyData';
import RoleManagementTable from "../../components/tables/RoleManagementTable";
// import { initialRoles, modules } from '../../lib/dumyData';
import ConfirmationDialog from "../../components/common/ConfirmationDialog";
import Modal from "../../components/modals/RoleModal";
import Button from "../../components/ui/Button";

export default function RoleManagement() {
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
  const { roles, loading, createRole, updateRole, deleteRole } = useEmployeeRoles();
  const [roleToDelete, setRoleToDelete] = useState(null);
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
      await updateRole?.(selectedRole.id, data);
    } else {
      await createRole?.(data);
    }
  };

  // Delete role
  const handleDeleteRole = async () => {
    if (!roleToDelete) return;
    try {
      await deleteRole?.(roleToDelete.id);
      setRoleToDelete(null);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error deleting role");
    }
  };

  // Get module name by ID
  const getModuleName = (moduleId) => {
    const module = modules.find((m) => m.id === moduleId);
    return module ? module.name : moduleId;
  };

  // Handle login with role
  const handleLogin = (role) => {
    const roleLabel = role.roleTitle || role.roleName || role.name || "Selected role";
    alert(
      `Login Credentials:\nEmail: ${role.email || "N/A"}\nPassword: ${role.password || "N/A"}\n\nUse these credentials to login as ${roleLabel}`,
    );
  };

  const getNormalizedStatus = (role) => {
    const rawStatus =
      role.isActive ??
      role.active ??
      role.is_active ??
      role.status ??
      role.roleStatus ??
      role.state;

    if (typeof rawStatus === "boolean") {
      return rawStatus ? "active" : "inactive";
    }

    if (typeof rawStatus === "number") {
      return rawStatus === 1 ? "active" : "inactive";
    }

    if (typeof rawStatus === "string") {
      const normalized = rawStatus.trim().toLowerCase();
      if (["active", "true", "1", "enabled", "yes"].includes(normalized)) {
        return "active";
      }
      if (["pending", "awaiting", "in-review"].includes(normalized)) {
        return "pending";
      }
      if (["inactive", "false", "0", "disabled", "no"].includes(normalized)) {
        return "inactive";
      }
    }

    return "inactive";
  };

  const activeRolesCount = roles.filter((role) => getNormalizedStatus(role) === "active").length;
  const inactiveRolesCount = roles.filter((role) => getNormalizedStatus(role) === "inactive").length;
  const pendingRolesCount = roles.filter((role) => getNormalizedStatus(role) === "pending").length;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Roles Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and assign permissions to different roles
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
          title="Active Roles"
          value={activeRolesCount}
          icon={Users}
          colorClass="text-green-600"
          bgClass="bg-green-50"
        />
        <StatusCard
          title="Inactive Roles"
          value={inactiveRolesCount}
          icon={Users}
          colorClass="text-red-600"
          bgClass="bg-red-50"
        />
        <StatusCard
          title="Pending Users"
          value={pendingRolesCount}
          icon={Users}
          colorClass="text-yellow-600"
          bgClass="bg-yellow-50"
        />
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <RoleForm
          onClose={() => setIsModalOpen(false)}
          onSubmit={async (data) => {
            try {
              await handleRoleSubmit(data);
              setIsModalOpen(false);
            } catch (err) {
              console.error(err);
              alert(err?.message || "Error saving role");
            }
          }}
          editingRole={selectedRole}
          modules={modules}
        />
      </Modal>

      {/* Roles Table */}
      <RoleManagementTable
        roles={roles}
        loading={loading}
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
            ? `Are you sure you want to delete the role "${roleToDelete.roleTitle || roleToDelete.roleName || roleToDelete.name || "-"}"? This will remove permissions for ${roleToDelete.userCount || 0} user${(roleToDelete.userCount || 0) !== 1 ? "s" : ""}.`
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
            <p>{roleToDelete.roleTitle || roleToDelete.roleName || roleToDelete.name || "-"}</p>
          </div>
        )}
      </ConfirmationDialog>
    </div>
  );
}
