import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatusCard from "../common/StatusCard";
import { Users } from "lucide-react";

export default function UserPermissionsModal({
  open = false,
  isPage = false,
  onClose = () => {},
  user = null,
  data = [],
  loading = false,
  onTogglePermission,
  onRemovePermission,
  onSelectUser,
  groups = [],
}) {
  const navigate = useNavigate();
  const [selectedGroup, setSelectedGroup] = useState("");
  const [expandedGroups, setExpandedGroups] = useState(new Set());

  // currentList: the permissions to display (either all data or the selected group's permissions)
  const currentList = useMemo(() => {
    if (!selectedGroup) return data || [];
    const grp = (groups || []).find((g) => g.group === selectedGroup);
    const codes = Array.isArray(grp?.permissions) ? grp.permissions : [];
    if (codes.length) {
      const codeSet = new Set(codes.map((c) => String(c)));
      return (data || []).filter((p) => codeSet.has(p.code));
    }
    return (data || []).filter((p) => p.category === selectedGroup || p.group === selectedGroup);
  }, [data, groups, selectedGroup]);

  // Status cards should reflect ALL permissions (global), not only the selected group
  const totalPermissions = useMemo(() => (Array.isArray(data) ? data.length : 0), [data]);
  const assignedCount = useMemo(() => (Array.isArray(data) ? data.filter((p) => p.allowed).length : 0), [data]);
  const coveragePercent = useMemo(() => (totalPermissions > 0 ? Math.round((assignedCount / totalPermissions) * 100) : 0), [totalPermissions, assignedCount]);

  const roleValue = useMemo(() => {
    if (!user) return "-";
    if (user.role) return user.role;
    if (Array.isArray(user.roles) && user.roles.length) return user.roles.join(", ");
    if (user.roleName) return user.roleName;
    return "-";
  }, [user]);

  const groupedPermissions = useMemo(() => {
    const map = {};
    (currentList || []).forEach((p) => {
      const key = p.category || p.group || "Other";
      if (!map[key]) map[key] = [];
      map[key].push(p);
    });
    return map;
  }, [currentList]);

  // full grouping based on original data (not filtered) -- used for sidebar lists and counts
  const groupedAll = useMemo(() => {
    const map = {};
    (data || []).forEach((p) => {
      const key = p.category || p.group || "Other";
      if (!map[key]) map[key] = [];
      map[key].push(p);
    });
    return map;
  }, [data]);

  const allGroupKeys = useMemo(() => Object.keys(groupedAll), [groupedAll]);

  const sidebarGroups = useMemo(() => {
    const fromGroups = Array.isArray(groups) ? groups : [];
    const map = new Map();
    fromGroups.forEach((g) => {
      const key = g.group || g.name || String(g);
      map.set(key, {
        key,
        label: g.label || g.name || key,
        count: (groupedAll[key] || []).length,
      });
    });

    // include any groups present in groupedAll but not in groups prop
    Object.keys(groupedAll || {}).forEach((k) => {
      if (!map.has(k)) {
        map.set(k, { key: k, label: k, count: (groupedAll[k] || []).length });
      }
    });

    return Array.from(map.values());
  }, [groups, groupedAll]);

  useEffect(() => {
    if (!allGroupKeys || allGroupKeys.length === 0) return;
    if (expandedGroups.size === 0) setTimeout(() => setExpandedGroups(new Set([allGroupKeys[0]])), 0);
  }, [allGroupKeys, expandedGroups]);

  if (!open && !isPage) return null;

  const outerClass = isPage ? "w-full" : "fixed inset-0 z-50 flex items-start justify-end bg-black/40 p-4 overflow-auto";
  const innerClass = isPage ? "bg-white rounded-2xl shadow-2xl p-4 md:p-6 w-full border border-slate-100" : "bg-white rounded-2xl shadow-2xl p-4 md:p-6 w-full max-w-4xl border border-slate-100";

  return (
    <div className={outerClass}>
      <div className={innerClass}>
        <div className="mb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm text-slate-500">{user?.fullName || user?.userName || user?.email || user?.id || ""}</div>
            </div>

            {/* header actions removed - moved to footer for better UX */}
          </div>

          <div className="mt-4 grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-9">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatusCard title="Total" value={totalPermissions} icon={Users} colorClass="text-slate-700" bgClass="bg-slate-100" />
                <StatusCard title="Assigned" value={assignedCount} icon={Users} colorClass="text-green-600" bgClass="bg-green-100" />
                <StatusCard title="Coverage" value={`${coveragePercent}%`} icon={Users} colorClass="text-blue-600" bgClass="bg-blue-100" />
                <StatusCard 
                title="Role" value={roleValue} icon={Users} colorClass="text-purple-600" bgClass="bg-purple-50" />
              </div>
            </div>
          </div>
        </div>

        

        <div className="space-y-3">
          {loading ? (
            <div className="text-sm text-slate-500">Loading permissions...</div>
          ) : (currentList || []).length === 0 ? (
            <div className="text-sm text-slate-500">No permissions found.</div>
          ) : (
            <div className="flex h-120 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              {/* LEFT SIDEBAR */}
              <div className="w-64 bg-slate-50 border-r border-slate-200 p-3">
                <div className="text-xs font-semibold text-slate-500 mb-3 px-2">PERMISSION GROUPS</div>

                <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-2">
                  {(() => {
                    const allActive = selectedGroup === "" || selectedGroup == null;
                    return (
                      <button
                        onClick={() => setSelectedGroup("")}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${allActive ? "bg-blue-600 text-white shadow" : "text-slate-700 hover:bg-slate-200"}`}
                      >
                        <span className="truncate">All Permissions</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${allActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"}`}>{totalPermissions}</span>
                      </button>
                    );
                  })()}

                  {(sidebarGroups || []).map(({ key, label, count }) => {
                    const isActive = selectedGroup === key;
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          console.debug("UserPermissionsModal: select group", key);
                          setSelectedGroup(key);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${isActive ? "bg-blue-600 text-white shadow" : "text-slate-700 hover:bg-slate-200"}`}
                      >
                        <span className="truncate">{label}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"}`}>{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT PANEL */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800">{selectedGroup || "All Permissions"}</h2>
                    <p className="text-xs text-slate-500">Manage access control</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        const perms = selectedGroup ? (groupedPermissions[selectedGroup] || []) : (currentList || []);
                        perms.forEach((p) => onTogglePermission?.(p.code));
                      }}
                      className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                    >
                      Toggle All
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {(selectedGroup ? (groupedPermissions[selectedGroup] || []) : (currentList || [])).map((perm) => (
                    <div key={perm.code} className="flex items-center justify-between px-5 py-3 border-b border-slate-100 hover:bg-slate-50 transition">
                      <div>
                        <div className="text-sm font-medium text-slate-800">{perm.name}</div>
                        <div className="text-xs text-slate-400">{perm.code}</div>
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!perm.allowed}
                            onChange={() => onTogglePermission && onTogglePermission(perm.code)}
                            disabled={!onTogglePermission}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-green-500 transition"></div>
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
                        </label>

                        <button
                          onClick={() => {
                            if (!onRemovePermission) return;
                            const ok = window.confirm(`Remove permission ${perm.code} from ${user?.fullName || "user"}?`);
                            if (ok) onRemovePermission(perm.code);
                          }}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
                    )}

                  {/* Footer actions: Select / Close placed at bottom for better accessibility */}
                  <div className="mt-4 border-t pt-3 flex items-center justify-end gap-3">
                    {onSelectUser && (
                      <button
                        onClick={() => {
                          try {
                            onSelectUser(user?.id);
                          } catch (err) {
                            // swallow any synchronous errors from caller
                            console.error("UserPermissionsModal: onSelectUser threw", err);
                          }
                          // If this component is rendered as a modal, close it after selection.
                          // When rendered as a full page (`isPage`), navigation should be handled
                          // by the `onSelectUser` implementation itself, so avoid calling navigate(-1).
                          if (!isPage) onClose();
                        }}
                        className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
                      >
                        Save Permission
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (isPage) navigate(-1);
                        else onClose();
                      }}
                      className="px-3 py-1.5 rounded-md border border-slate-200 text-sm text-slate-600 hover:bg-slate-50"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
  );
}
