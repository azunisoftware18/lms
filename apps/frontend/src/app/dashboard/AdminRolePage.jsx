import { useState } from "react";

import * as Icons from "lucide-react";
import { adminRoles as dummyRoles } from "../../lib/dashboardDummyData";

import Button from "../../components/ui/Button";
import SearchField from "../../components/ui/SearchField";
import AdminRoleTable from "../../components/tables/AdminRoleTable";

export default function AdminRolePage() {
  const [roles] = useState(dummyRoles);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Icons.Shield size={28} className="text-blue-600" />

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Roles Management
            </h1>

            <p className="text-sm text-gray-500">
              Manage permissions and access levels
            </p>
          </div>
        </div>

        <Button className=" gap-2">
          <Icons.Plus size={16} />
          <span className="text-sm">Add Role</span>
        </Button>
      </div>

      {/* SEARCH */}

      <div className="mb-6">
        <SearchField
          placeholder="Search roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TABLE */}

      <div className="bg-white border rounded-xl overflow-hidden">
        <AdminRoleTable
          data={filteredRoles}
          actions={[
            {
              label: "Login",
              icon: <Icons.User size={16} />,
              onClick: (role) => alert(`Login as ${role.email}`),
            },
            {
              label: "Edit",
              icon: <Icons.Edit2 size={16} />,
              onClick: (role) => console.log("Edit", role.id),
            },
            {
              label: "Delete",
              icon: <Icons.Trash2 size={16} />,
              onClick: (role) => console.log("Delete", role.id),
            },
          ]}
        />
      </div>
    </div>
  );
}
