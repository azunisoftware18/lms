import { useState } from "react";

import { Icons } from "../../components/common/Icon";
import { adminRoles as dummyRoles } from "../../lib/dashboardDummyData";

import Button from "../../components/ui/Button";
import SearchField from "../../components/ui/SearchField";

import ActionMenu from "../../components/common/ActionMenu";

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "../../components/tables";

export default function AdminRolePage() {
  const [roles, setRoles] = useState(dummyRoles);
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
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Role</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Permissions</TableCell>
              <TableCell>Users</TableCell>
              <TableCell className="text-right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRoles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  No roles found
                </TableCell>
              </TableRow>
            ) : (
              filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  {/* ROLE */}

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gray-100">
                        <Icons.Shield size={16} />
                      </div>

                      <div>
                        <p className="font-semibold">{role.name}</p>

                        <p className="text-xs text-gray-500">
                          {role.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* EMAIL */}

                  <TableCell>{role.email}</TableCell>

                  {/* PERMISSIONS */}

                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {role.permissions.slice(0, 3).map((p) => (
                        <span
                          key={p}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                        >
                          {p}
                        </span>
                      ))}

                      {role.permissions.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{role.permissions.length - 3} more
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* USERS */}

                  <TableCell>{role.userCount}</TableCell>

                  {/* ACTION */}

                  <TableCell className="text-right">
                    <ActionMenu
                      items={[
                        {
                          label: "Login",
                          icon: Icons.User,
                          onClick: () => alert(`Login as ${role.email}`),
                        },
                        {
                          label: "Edit",
                          icon: Icons.Edit2,
                          onClick: () => console.log("Edit", role.id),
                        },
                        {
                          label: "Delete",
                          icon: Icons.Trash2,
                          onClick: () => console.log("Delete", role.id),
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
