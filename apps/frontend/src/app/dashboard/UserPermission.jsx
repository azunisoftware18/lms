import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LucideChevronLeft } from "lucide-react";
import UserPermissionsModal from "../../components/modals/UserPermissionsModal";
import {
  usePermissions,
  usePermissionGroups,
  useUserPermissions,
  useUnassignPermissions,
  useAssignPermissions,
  usePermissionUsers,
} from "../../hooks/usePermission";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function UserPermissionPage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const permissionState = useSelector(
    (s) => s.permission ?? { permissions: [], users: [] },
  );
  const permissionsQuery = usePermissions();
  const groupsQuery = usePermissionGroups();
  // ensure we fetch the specific user so `permissionState.users` contains the user object
  const permissionUsersQuery = usePermissionUsers({ id: userId });
  const selectedUserPermissionsQuery = useUserPermissions(userId);
  const unassignPermissionsMutation = useUnassignPermissions();
  const assignPermissionsMutation = useAssignPermissions();

  const allPermissionsRaw = permissionState.permissions;

  const groupLookup = useMemo(() => {
    const lookup = {};
    const groups = Array.isArray(groupsQuery.data) ? groupsQuery.data : [];
    groups.forEach((entry) => {
      const codes = Array.isArray(entry.permissions) ? entry.permissions : [];
      codes.forEach((code) => (lookup[code] = entry.group));
    });
    return lookup;
  }, [groupsQuery.data]);

  const allPermissions = useMemo(() => {
    const rows = Array.isArray(allPermissionsRaw) ? allPermissionsRaw : [];
    return rows.map((perm) => ({
      code: perm.code,
      name: perm.name || perm.code,
      category: groupLookup[perm.code] || perm.code.split("_")[0],
      description: perm.name || perm.code,
    }));
  }, [allPermissionsRaw, groupLookup]);

  const [userPermissions, setUserPermissions] = useState([]);

  useEffect(() => {
    if (!userId) return;
    const selectedRows = Array.isArray(selectedUserPermissionsQuery.data)
      ? selectedUserPermissionsQuery.data
      : [];
    const allowedSet = new Set(
      selectedRows.filter((p) => p.allowed).map((p) => p.code),
    );
    const merged = allPermissions.map((perm) => ({
      ...perm,
      allowed: allowedSet.has(perm.code),
    }));
    // defer setState to avoid synchronous state update inside effect
    setTimeout(() => setUserPermissions(merged), 0);
  }, [userId, selectedUserPermissionsQuery.data, allPermissions]);

  const handleToggle = useCallback((code) => {
    setUserPermissions((prev) =>
      prev.map((p) => (p.code === code ? { ...p, allowed: !p.allowed } : p)),
    );
  }, []);

  const handleRemove = useCallback(
    async (code) => {
      try {
        await unassignPermissionsMutation.mutateAsync({
          userId,
          permissions: [code],
        });
        await selectedUserPermissionsQuery.refetch();
      } catch (err) {
        console.error(err);
        toast.error("Failed to remove permission");
      }
    },
    [userId, unassignPermissionsMutation, selectedUserPermissionsQuery],
  );

  const selectedUserFromStore = (permissionState.users || []).find(
    (u) => String(u.id) === String(userId),
  );
  const selectedUserFromQuery =
    permissionUsersQuery.data && !Array.isArray(permissionUsersQuery.data)
      ? permissionUsersQuery.data
      : null;
  const selectedUser = selectedUserFromStore || selectedUserFromQuery || null;
  const displayName =
    selectedUser?.fullName ||
    selectedUser?.userName ||
    selectedUser?.email ||
    userId;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          <LucideChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <div className="text-sm text-slate-500">Permission Management</div>
          <div className="text-lg font-semibold">
            Manage Permissions — {displayName}
          </div>
        </div>
      </div>

      <UserPermissionsModal
        open={true}
        isPage={true}
        user={
          selectedUser || {
            id: userId,
            fullName: displayName,
            email: selectedUser?.email,
          }
        }
        data={userPermissions}
        loading={
          selectedUserPermissionsQuery.isLoading || permissionsQuery.isLoading
        }
        onTogglePermission={handleToggle}
        onRemovePermission={handleRemove}
        onSelectUser={async (id) => {
          // save only diffs (assign/unassign) compared to original server state
          const targetUserId = id || userId;
          try {
            const original = Array.isArray(selectedUserPermissionsQuery.data)
              ? selectedUserPermissionsQuery.data
                  .filter((p) => p.allowed)
                  .map((p) => p.code)
              : [];

            const currentAllowed = (userPermissions || [])
              .filter((p) => p.allowed)
              .map((p) => p.code);

            const originalSet = new Set(original);
            const currentSet = new Set(currentAllowed);

            const toAssign = Array.from(currentSet).filter(
              (c) => !originalSet.has(c),
            );
            const toUnassign = Array.from(originalSet).filter(
              (c) => !currentSet.has(c),
            );

            // send only diffs; backend limits arrays to <=50 items — batch if needed
            const chunk = (arr, size) => {
              const out = [];
              for (let i = 0; i < arr.length; i += size)
                out.push(arr.slice(i, i + size));
              return out;
            };

            if (toAssign.length) {
              const batches = chunk(toAssign, 50);
              for (const b of batches) {
                await assignPermissionsMutation.mutateAsync({
                  userId: targetUserId,
                  permissions: b,
                });
              }
            }

            if (toUnassign.length) {
              const batches = chunk(toUnassign, 50);
              for (const b of batches) {
                await unassignPermissionsMutation.mutateAsync({
                  userId: targetUserId,
                  permissions: b,
                });
              }
            }

            await selectedUserPermissionsQuery.refetch();
            toast.success("Permissions saved");
            navigate(-1);
          } catch (err) {
            console.error(err);
            toast.error("Failed to save permissions");
          }
        }}
        groups={Array.isArray(groupsQuery.data) ? groupsQuery.data : []}
      />
    </div>
  );
}
