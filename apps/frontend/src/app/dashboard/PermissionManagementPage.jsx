import { useState, useEffect } from "react";

import * as Icons from "lucide-react";
import {
  users as dummyUsers,
  permissions as dummyPermissions,
} from "../../lib/dashboardDummyData";

import Button from "../../components/ui/Button";
import SelectField from "../../components/ui/SelectField";

export default function PermissionManagementPage() {
  const [selectedUser, setSelectedUser] = useState("");
  const [userPermissions, setUserPermissions] = useState([]);
  const [success, setSuccess] = useState("");
  const [localError, setLocalError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const permissionList = dummyPermissions;
  const userList = dummyUsers;

  /* GET CURRENT USER */

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");

      if (userStr) {
        setCurrentUser(JSON.parse(userStr));
      }
    } catch (e) {
      console.log("User parse error");
    }
  }, []);

  /* TOGGLE PERMISSION */

  const togglePermission = (code) => {
    setUserPermissions((prev) => {
      const exists = prev.includes(code);

      if (exists) {
        return prev.filter((p) => p !== code);
      }

      return [...prev, code];
    });
  };

  /* CHECK PERMISSION */

  const isAllowed = (code) => {
    return userPermissions.includes(code);
  };

  /* SAVE PERMISSIONS */

  const savePermissions = () => {
    if (!selectedUser) {
      setLocalError("Please select a user first");
      return;
    }

    setLocalError("");
    setSuccess("Permissions saved successfully");

    console.log("Selected User:", selectedUser);
    console.log("Permissions:", userPermissions);
  };

  /* AUTO CLEAR MESSAGE */

  useEffect(() => {
    if (success || localError) {
      const timer = setTimeout(() => {
        setSuccess("");
        setLocalError("");
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [success, localError]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* HEADER */}

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Icons.Key className="text-blue-600" />
          Permission Management
        </h1>

        <p className="text-gray-600 mt-1">Manage user permissions</p>
      </div>

      {/* ERROR */}

      {localError && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-center">
          <Icons.AlertCircle className="text-red-500 mr-2" />
          {localError}
        </div>
      )}

      {/* SUCCESS */}

      {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded flex items-center">
          <Icons.CheckCircle className="text-green-500 mr-2" />
          {success}
        </div>
      )}

      {/* GRID */}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* USER SELECT */}

        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Icons.User size={18} />
            Select User
          </h2>

          <SelectField
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">Select User</option>

            {userList.map((user) => (
              <option key={user.id} value={user.id}>
                {user.fullName || user.email} ({user.role})
              </option>
            ))}
          </SelectField>

          {selectedUser && (
            <div className="mt-5 text-sm text-blue-700 bg-blue-50 p-3 rounded-lg">
              Select permissions from the right panel and click save.
            </div>
          )}
        </div>

        {/* PERMISSIONS */}

        <div className="lg:col-span-3 bg-white rounded-xl border p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Icons.Key size={18} />
            Available Permissions
          </h2>

          {!selectedUser ? (
            <div className="text-center py-16 text-gray-500">
              <Icons.User className="mx-auto mb-4 text-gray-400" size={40} />
              Select a user to manage permissions
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {permissionList.map((perm) => {
                const active = isAllowed(perm.code);

                return (
                  <div
                    key={perm.code}
                    onClick={() => togglePermission(perm.code)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                      active
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {perm.name}
                        </h3>

                        <p className="text-xs text-gray-500">{perm.code}</p>
                      </div>

                      {active && (
                        <Icons.CheckCircle
                          className="text-green-600"
                          size={20}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* SAVE BUTTON */}

          {selectedUser && (
            <div className="mt-6 flex justify-end">
              <Button
                onClick={savePermissions}
                className="flex items-center gap-2"
              >
                <Icons.Save size={16} />
                Save Permissions
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* STATS */}

      {selectedUser && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border rounded-xl p-5 text-center">
            <p className="text-2xl font-bold">{permissionList.length}</p>
            <p className="text-sm text-gray-500">Total Permissions</p>
          </div>

          <div className="bg-white border rounded-xl p-5 text-center">
            <p className="text-2xl font-bold text-green-600">
              {userPermissions.length}
            </p>
            <p className="text-sm text-gray-500">Assigned Permissions</p>
          </div>

          <div className="bg-white border rounded-xl p-5 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {permissionList.length
                ? Math.round(
                    (userPermissions.length / permissionList.length) * 100,
                  )
                : 0}
              %
            </p>
            <p className="text-sm text-gray-500">Permission Coverage</p>
          </div>
        </div>
      )}
    </div>
  );
}
