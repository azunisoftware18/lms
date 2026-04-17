import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LucideSave,
  LucideUser,
  LucideKey,
  LucideAlertCircle,
  LucideLoader,
  LucideCheckCircle,
  LucideShield,
  LucideUsers,
  LucideSearch,
  LucideChevronDown,
  LucideChevronUp,
  LucideChevronLeft,
  LucideRefreshCw,
  LucideBadgeCheck,
  LucidePlus,
} from "lucide-react";

import PermissionManagementTable from "../../components/tables/PermissionManagementTable";
import PermissionManagementModal from "../../components/modals/PermissionManagementModal";
import UserPermissionsModal from "../../components/modals/UserPermissionsModal";
import ErrorBoundary from "../../components/common/ErrorBoundary";
import StatusCard from "../../components/common/StatusCard";
import Button from "../../components/ui/Button";
import ConfirmationDialog from "../../components/common/ConfirmationDialog";
import Pagination from "../../components/common/Pagination";
import { useSelector } from "react-redux";
import {
  usePermissionGroups,
  usePermissions,
  usePermissionUsers,
  useUserPermissions,
} from "../../hooks/usePermission";

const GROUP_LABELS = {
  CREDIT_RISK: "Credit & Risk",
  DOCUMENTS: "Documents",
  EMI: "EMI",
  LOAN_LIFECYCLE: "Loan Lifecycle",
  DEFAULTS_RECOVERIES: "Defaults & Recoveries",
  FORECLOSURE_MORATORIUM: "Foreclosure & Moratorium",
  LEADS: "Leads",
  EMPLOYEES: "Employees",
  BRANCHES: "Branches",
  PARTNERS: "Partners",
  LOAN_TYPES: "Loan Types",
  LEGAL_TECHNICAL: "Legal & Technical",
  SETTLEMENT: "Settlement",
  PERMISSIONS: "Permissions",
  KYC: "KYC",
  NACH: "NACH",
  USER_MANAGEMENT: "User Management",
  MONITORING_DASHBOARD: "Monitoring & Dashboard",
};

// uses core table styling via PermissionManagementTable

const toInitials = (name) => {
  if (!name) return "U";
  const parts = String(name).trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() || "").join("") || "U";
};

const normalizeUsers = (rows) => {
  if (!Array.isArray(rows)) return [];
  return rows.map((u) => ({
    id: u.id,
    fullName: u.fullName || u.userName || "Unknown User",
    email: u.email || "-",
    role: (u.role || "EMPLOYEE").toUpperCase(),
    status: u.isActive ? "active" : "inactive",
    avatar: toInitials(u.fullName || u.userName || "U"),
    userName: u.userName || "-",
    contactNumber: u.contactNumber || "-",
  }));
};

const inferCategory = (code) => {
  if (!code) return "Other";
  if (
    code.startsWith("VIEW_") ||
    code.startsWith("UPDATE_") ||
    code.startsWith("CREATE_")
  ) {
    const second = code.split("_")[1] || "OTHER";
    return second.replaceAll("-", " ");
  }
  const first = code.split("_")[0] || "OTHER";
  return first.replaceAll("-", " ");
};

export default function PermissionManagementPage() {
  const [selectedUser, setSelectedUser] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userPage, setUserPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const pageSize = 6;

  const storedCurrentUser = useMemo(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  const permissionState = useSelector(
    (state) => state.permission ?? { permissions: [], users: [], error: null },
  );

  const permissionsQuery = usePermissions();
  const usersQuery = usePermissionUsers();
  const groupsQuery = usePermissionGroups();
  const myPermissionsQuery = useUserPermissions(storedCurrentUser?.id);

  const allPermissionsRaw = permissionState.permissions;
  const usersRaw = permissionState.users;
  const users = useMemo(() => normalizeUsers(usersRaw), [usersRaw]);

  const groupLookup = useMemo(() => {
    const lookup = {};
    const groups = Array.isArray(groupsQuery.data) ? groupsQuery.data : [];

    groups.forEach((entry) => {
      const groupName = GROUP_LABELS[entry.group] || entry.group || "Other";
      const codes = Array.isArray(entry.permissions) ? entry.permissions : [];
      codes.forEach((code) => {
        lookup[code] = groupName;
      });
    });

    return lookup;
  }, [groupsQuery.data]);

  const _allPermissions = useMemo(() => {
    const rows = Array.isArray(allPermissionsRaw) ? allPermissionsRaw : [];
    return rows.map((perm) => ({
      code: perm.code,
      name: perm.name || perm.code,
      category: groupLookup[perm.code] || inferCategory(perm.code),
      description: perm.name || perm.code,
    }));
  }, [allPermissionsRaw, groupLookup]);

  const myAllowedCodes = useMemo(() => {
    const rows = Array.isArray(myPermissionsQuery.data)
      ? myPermissionsQuery.data
      : [];
    return new Set(rows.filter((p) => p.allowed).map((p) => p.code));
  }, [myPermissionsQuery.data]);

  const isSuperAdmin = storedCurrentUser?.role === "SUPER_ADMIN";
  const isAdmin = storedCurrentUser?.role === "ADMIN";
  const canViewPermissions =
    isSuperAdmin || isAdmin || myAllowedCodes.has("VIEW_ALL_PERMISSIONS");

  // user-specific permission management is handled on the dedicated per-user page

  // if a user query param is present, preselect that user
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const u = params.get("user");
    if (u) setSelectedUser(u);
  }, [location.search]);

  const filteredUsers = useMemo(() => {
    // base by status filter
    const sf = String(statusFilter || "").toLowerCase();
    let list = users.filter((u) => {
      if (!sf) return true;
      const role = String(u.role || "").toLowerCase();
      if (sf === "employee") return role === "employee";
      if (sf === "admin")
        return (
          role === "admin" || role === "super_admin" || role === "super-admin"
        );
      if (sf === "other")
        return !(
          role === "employee" ||
          role === "admin" ||
          role === "super_admin" ||
          role === "super-admin"
        );
      return true;
    });

    // search filtering
    const q = String(searchQuery || "")
      .trim()
      .toLowerCase();
    if (q) {
      list = list.filter((u) => {
        const name = String(u.fullName || u.userName || "").toLowerCase();
        const email = String(u.email || "").toLowerCase();
        const username = String(u.userName || "").toLowerCase();
        return name.includes(q) || email.includes(q) || username.includes(q);
      });
    }

    // date filtering (created/joined date). Accepts several common fields.
    const df = String(dateFilter || "");
    if (df && df !== "ALL") {
      const now = new Date();
      const start = (d) => new Date(d).setHours(0, 0, 0, 0);
      const inRange = (u) => {
        const raw =
          u.createdAt ||
          u.created_at ||
          u.joinedAt ||
          u.joined_at ||
          u.createdOn ||
          u.created_on;
        if (!raw) return false;
        const d = new Date(raw);
        if (isNaN(d.getTime())) return false;
        if (df === "TODAY") return start(d) === start(now);
        if (df === "WEEK") {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(now.getDate() - 7);
          return d >= oneWeekAgo && d <= now;
        }
        if (df === "MONTH") {
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(now.getMonth() - 1);
          return d >= oneMonthAgo && d <= now;
        }
        if (df === "LAST_3_MONTHS") {
          const p = new Date();
          p.setMonth(now.getMonth() - 3);
          return d >= p && d <= now;
        }
        if (df === "LAST_6_MONTHS") {
          const p = new Date();
          p.setMonth(now.getMonth() - 6);
          return d >= p && d <= now;
        }
        if (df === "YEAR") {
          return d.getFullYear() === now.getFullYear();
        }
        return true;
      };

      list = list.filter(inRange);
    }

    return list;
  }, [users, statusFilter, searchQuery, dateFilter]);

  const statusFilterOptions = useMemo(() => {
    const total = users.length;
    const employees = users.filter(
      (u) => (u.role || "").toLowerCase() === "employee",
    ).length;
    const admins = users.filter((u) => {
      const r = (u.role || "").toLowerCase();
      return r === "admin" || r === "super_admin" || r === "super-admin";
    }).length;
    const others = total - employees - admins;

    return [
      { label: "All", value: "", count: total },
      { label: "Employee", value: "employee", count: employees },
      { label: "Admin", value: "admin", count: admins },
      { label: "Other", value: "other", count: others },
    ];
  }, [users]);

  const totalUserPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / pageSize),
  );
  const pagedUsers = useMemo(() => {
    const start = (userPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, userPage]);

  useEffect(() => {
    if (userPage > totalUserPages) {
      setUserPage(totalUserPages);
    }
  }, [userPage, totalUserPages]);

  const employeeCount = useMemo(
    () =>
      users.filter((u) => (u.role || "").toUpperCase() === "EMPLOYEE").length,
    [users],
  );
  const partnerCount = useMemo(
    () =>
      users.filter((u) => (u.role || "").toUpperCase() === "PARTNER").length,
    [users],
  );
  const adminCount = useMemo(
    () =>
      users.filter((u) => {
        const r = (u.role || "").toUpperCase();
        return r === "ADMIN" || r === "SUPER_ADMIN" || r === "SUPER-ADMIN";
      }).length,
    [users],
  );
  const totalUsers = useMemo(() => users.length, [users]);

  // toggling user permissions is handled on the dedicated user page

  const handleUserSelect = useCallback((userId) => {
    setSelectedUser(userId);
  }, []);

  // removal handled in per-user page

  // saving assignments is performed on the per-user page

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        permissionsQuery.refetch(),
        usersQuery.refetch(),
        myPermissionsQuery.refetch(),
        Promise.resolve(),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!canViewPermissions) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg text-center">
          <LucideAlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-700">Access Denied</h2>
          <p className="text-red-600 mt-2">
            You don't have permission to view permission management.
          </p>
        </div>
      </div>
    );
  }

  const isUsersLoading = usersQuery.isLoading || usersQuery.isFetching;

  const pageError =
    permissionState.error ||
    permissionsQuery.error?.message ||
    usersQuery.error?.message ||
    myPermissionsQuery.error?.message;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <LucideShield className="h-6 w-6 text-blue-600" />
                  </div>
                  <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Permission Management
                  </h1>
                </div>
                <p className="text-gray-600 ml-11">
                  Manage dynamic permission assignment from backend roles and
                  users.
                </p>
                {(isSuperAdmin || isAdmin) && (
                  <div className="ml-11 mt-2 inline-flex items-center px-3 py-1 bg-linear-to-r from-purple-100 to-purple-50 text-purple-800 rounded-full text-sm font-medium border border-purple-200">
                    <LucideBadgeCheck className="h-3 w-3 mr-1" />
                    {storedCurrentUser?.role} - elevated access
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3 mt-4 md:mt-0">
                <Button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  aria-label="Refresh permissions"
                  className="p-2 text-gray-700 bg-green-600 hover:bg-green-700/90 shadow-none px-3 py-2 rounded-lg"
                >
                  <LucideRefreshCw
                    className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  <span className="ml-2">Refresh</span>
                </Button>
              </div>
            </div>
          </div>

          {pageError && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <LucideAlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700">{pageError}</p>
              </div>
            </div>
          )}

          {users.length > 0 && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
              <StatusCard
                title="Total Users"
                value={totalUsers}
                icon={LucideUsers}
                colorClass="text-slate-700"
                bgClass="bg-slate-100"
              />

              <StatusCard
                title="Employees"
                value={employeeCount}
                icon={LucideUser}
                colorClass="text-indigo-600"
                bgClass="bg-indigo-50"
              />

              <StatusCard
                title="Partners"
                value={partnerCount}
                icon={LucideUsers}
                colorClass="text-green-600"
                bgClass="bg-green-50"
              />

              <StatusCard
                title="Admins"
                value={adminCount}
                icon={LucideShield}
                colorClass="text-purple-600"
                bgClass="bg-purple-50"
              />
            </div>
          )}

          <div className="grid  gap-6 mt-6">
            <div className="lg:col-span-6 xl:col-span-5">
              <div className="p-1">
                <PermissionManagementTable
                  mode="users"
                  title="System Users"
                  data={pagedUsers}
                  loading={isUsersLoading}
                  page={userPage}
                  totalPages={totalUserPages}
                  onPageChange={(p) => setUserPage(p)}
                  onRowClick={handleUserSelect}
                  selectedId={selectedUser}
                  onManage={(row) => {
                    // navigate to the dedicated per-user manage page
                    navigate(
                      `/admin/permission-management/user/${encodeURIComponent(row.id)}`,
                    );
                  }}
                  filterValue={statusFilter}
                  setFilterValue={setStatusFilter}
                  filterOptions={statusFilterOptions}
                  search={searchQuery}
                  setSearch={setSearchQuery}
                  dateValue={dateFilter}
                  setDateValue={setDateFilter}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation dialog removed — saving is done on the per-user page */}
        <PermissionManagementModal
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            permissionsQuery.refetch();
            setIsCreateModalOpen(false);
          }}
        />

        {/* Inline modal removed — Manage now opens full-page view */}

        {/* Manage-permissions full-page view is rendered by the dedicated route `/permission-management/user/:userId` */}
      </div>
    </ErrorBoundary>
  );
}
