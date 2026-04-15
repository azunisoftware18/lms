// PermissionManagement.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  LucideSave,
  LucideUser,
  LucideKey,
  LucideAlertCircle,
  LucideLoader,
  LucidePlus,
  LucideCheckCircle,
  LucideXCircle,
  LucideShield,
  LucideUsers,
  LucideLock,
  LucideEye,
  LucideEdit,
  LucideTrash2,
  LucideSearch,
  LucideFilter,
  LucideChevronDown,
  LucideChevronUp,
  LucideInfo,
  LucideRefreshCw,
  LucideUserCheck,
  LucideUserX,
  LucideClock,
  LucideBadgeCheck,
  LucideBuilding,
} from "lucide-react";

import Button from "../../components/ui/Button";
import SearchField from "../../components/ui/SearchField";
import InputField from "../../components/ui/InputField";
import SelectField from "../../components/ui/SelectField";
import TextAreaField from "../../components/ui/TextAreaField";
import PermissionManagementModal from "../../components/modals/PermissionManagementModal";
import ErrorBoundary from "../../components/common/ErrorBoundary";
import Section from "../../components/common/Section";
import StatusCard from "../../components/common/StatusCard";
import ConfirmationDialog from "../../components/common/ConfirmationDialog";
import Pagination from "../../components/common/Pagination";

// ============================================
// DUMMY DATA
// ============================================

// Available permissions in the system
const AVAILABLE_PERMISSIONS = [
  {
    id: "perm_1",
    code: "VIEW_LOANS",
    name: "View Loans",
    category: "Loans",
    description: "Can view all loan applications and details",
  },
  {
    id: "perm_2",
    code: "CREATE_LOANS",
    name: "Create Loans",
    category: "Loans",
    description: "Can create new loan applications",
  },
  {
    id: "perm_3",
    code: "EDIT_LOANS",
    name: "Edit Loans",
    category: "Loans",
    description: "Can edit existing loan applications",
  },
  {
    id: "perm_4",
    code: "DELETE_LOANS",
    name: "Delete Loans",
    category: "Loans",
    description: "Can delete loan applications",
  },
  {
    id: "perm_5",
    code: "APPROVE_LOANS",
    name: "Approve Loans",
    category: "Loans",
    description: "Can approve loan applications",
  },
  {
    id: "perm_6",
    code: "REJECT_LOANS",
    name: "Reject Loans",
    category: "Loans",
    description: "Can reject loan applications",
  },
  {
    id: "perm_7",
    code: "VIEW_CUSTOMERS",
    name: "View Customers",
    category: "Customers",
    description: "Can view customer information",
  },
  {
    id: "perm_8",
    code: "CREATE_CUSTOMERS",
    name: "Create Customers",
    category: "Customers",
    description: "Can add new customers",
  },
  {
    id: "perm_9",
    code: "EDIT_CUSTOMERS",
    name: "Edit Customers",
    category: "Customers",
    description: "Can edit customer information",
  },
  {
    id: "perm_10",
    code: "DELETE_CUSTOMERS",
    name: "Delete Customers",
    category: "Customers",
    description: "Can delete customer records",
  },
  {
    id: "perm_11",
    code: "VIEW_PAYMENTS",
    name: "View Payments",
    category: "Payments",
    description: "Can view payment history",
  },
  {
    id: "perm_12",
    code: "RECORD_PAYMENTS",
    name: "Record Payments",
    category: "Payments",
    description: "Can record new payments",
  },
  {
    id: "perm_13",
    code: "VIEW_REPORTS",
    name: "View Reports",
    category: "Reports",
    description: "Can access reports dashboard",
  },
  {
    id: "perm_14",
    code: "EXPORT_REPORTS",
    name: "Export Reports",
    category: "Reports",
    description: "Can export reports to CSV/PDF",
  },
  {
    id: "perm_15",
    code: "MANAGE_USERS",
    name: "Manage Users",
    category: "Admin",
    description: "Can manage system users",
  },
  {
    id: "perm_16",
    code: "MANAGE_PERMISSIONS",
    name: "Manage Permissions",
    category: "Admin",
    description: "Can manage user permissions",
  },
  {
    id: "perm_17",
    code: "VIEW_AUDIT_LOGS",
    name: "View Audit Logs",
    category: "Admin",
    description: "Can view system audit logs",
  },
  {
    id: "perm_18",
    code: "MANAGE_SETTINGS",
    name: "Manage Settings",
    category: "Admin",
    description: "Can modify system settings",
  },
];

// System users with roles
const SYSTEM_USERS = [
  {
    id: "user_1",
    fullName: "Super Admin User",
    email: "superadmin@loanms.com",
    role: "SUPER_ADMIN",
    avatar: "SA",
    department: "IT",
    status: "active",
    lastActive: "2024-01-15T10:30:00",
  },
  {
    id: "user_2",
    fullName: "John Doe",
    email: "john.doe@loanms.com",
    role: "LOAN_OFFICER",
    avatar: "JD",
    department: "Loans",
    status: "active",
    lastActive: "2024-01-14T15:45:00",
  },
  {
    id: "user_3",
    fullName: "Jane Smith",
    email: "jane.smith@loanms.com",
    role: "LOAN_MANAGER",
    avatar: "JS",
    department: "Management",
    status: "active",
    lastActive: "2024-01-15T09:20:00",
  },
  {
    id: "user_4",
    fullName: "Mike Johnson",
    email: "mike.johnson@loanms.com",
    role: "PARTNER",
    avatar: "MJ",
    department: "Partner Network",
    status: "active",
    lastActive: "2024-01-13T14:10:00",
  },
  {
    id: "user_5",
    fullName: "Sarah Williams",
    email: "sarah.williams@loanms.com",
    role: "UNDERWRITER",
    avatar: "SW",
    department: "Underwriting",
    status: "active",
    lastActive: "2024-01-15T11:00:00",
  },
  {
    id: "user_6",
    fullName: "David Brown",
    email: "david.brown@loanms.com",
    role: "COLLECTOR",
    avatar: "DB",
    department: "Collections",
    status: "inactive",
    lastActive: "2024-01-10T16:30:00",
  },
  {
    id: "user_7",
    fullName: "Emily Davis",
    email: "emily.davis@loanms.com",
    role: "PARTNER",
    avatar: "ED",
    department: "Partner Network",
    status: "active",
    lastActive: "2024-01-14T13:20:00",
  },
  {
    id: "user_8",
    fullName: "Robert Wilson",
    email: "robert.wilson@loanms.com",
    role: "LOAN_OFFICER",
    avatar: "RW",
    department: "Loans",
    status: "active",
    lastActive: "2024-01-15T08:45:00",
  },
];

// Pre-assigned permissions for each user (excluding SUPER_ADMIN who has all)
const USER_PERMISSIONS_ASSIGNMENTS = {
  user_2: [
    "VIEW_LOANS",
    "CREATE_LOANS",
    "EDIT_LOANS",
    "VIEW_CUSTOMERS",
    "CREATE_CUSTOMERS",
    "EDIT_CUSTOMERS",
    "VIEW_PAYMENTS",
    "RECORD_PAYMENTS",
  ],
  user_3: [
    "VIEW_LOANS",
    "CREATE_LOANS",
    "EDIT_LOANS",
    "APPROVE_LOANS",
    "REJECT_LOANS",
    "VIEW_CUSTOMERS",
    "CREATE_CUSTOMERS",
    "EDIT_CUSTOMERS",
    "DELETE_CUSTOMERS",
    "VIEW_PAYMENTS",
    "RECORD_PAYMENTS",
    "VIEW_REPORTS",
  ],
  user_4: ["VIEW_LOANS", "VIEW_CUSTOMERS", "VIEW_PAYMENTS"],
  user_5: [
    "VIEW_LOANS",
    "APPROVE_LOANS",
    "REJECT_LOANS",
    "VIEW_CUSTOMERS",
    "VIEW_PAYMENTS",
    "VIEW_REPORTS",
  ],
  user_6: ["VIEW_LOANS", "VIEW_CUSTOMERS", "VIEW_PAYMENTS", "RECORD_PAYMENTS"],
  user_7: ["VIEW_LOANS", "VIEW_CUSTOMERS", "VIEW_PAYMENTS"],
  user_8: [
    "VIEW_LOANS",
    "CREATE_LOANS",
    "EDIT_LOANS",
    "VIEW_CUSTOMERS",
    "CREATE_CUSTOMERS",
    "VIEW_PAYMENTS",
    "RECORD_PAYMENTS",
  ],
};

// Helper function to get user permissions
const getUserAssignedPermissions = (userId, role) => {
  if (role === "SUPER_ADMIN") {
    return AVAILABLE_PERMISSIONS.map((p) => p.code);
  }
  return USER_PERMISSIONS_ASSIGNMENTS[userId] || [];
};

// ============================================
// CUSTOM HOOK
// ============================================
const usePermissions = () => {
  const [loading, setLoading] = useState({
    getAllPerms: false,
    getMyPerms: false,
    getUsers: false,
    getUserPerms: false,
    assign: false,
  });
  const [error, setError] = useState(null);
  const [allPermissions, setAllPermissions] = useState([]);
  const [users, setUsers] = useState([]);
  const [myPermissions, setMyPermissions] = useState([]);

  // Current logged-in user (simulated)
  const [currentUser, setCurrentUser] = useState(null);

  // Simulate API calls with delay
  const simulateApi = useCallback(async (data, shouldFail = false) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (shouldFail) throw new Error("API Error");
    return data;
  }, []);

  const fetchAllPermissions = useCallback(async () => {
    setLoading((prev) => ({ ...prev, getAllPerms: true }));
    try {
      const perms = await simulateApi(AVAILABLE_PERMISSIONS);
      setAllPermissions(perms);
      setError(null);
      return perms;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading((prev) => ({ ...prev, getAllPerms: false }));
    }
  }, [simulateApi]);

  const fetchUsers = useCallback(async () => {
    setLoading((prev) => ({ ...prev, getUsers: true }));
    try {
      const usersList = await simulateApi(SYSTEM_USERS);
      setUsers(usersList);
      setError(null);
      return usersList;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading((prev) => ({ ...prev, getUsers: false }));
    }
  }, [simulateApi]);

  const fetchMyPermissions = useCallback(
    async (userId, role) => {
      setLoading((prev) => ({ ...prev, getMyPerms: true }));
      try {
        let perms;
        if (role === "SUPER_ADMIN") {
          perms = AVAILABLE_PERMISSIONS.map((p) => ({ ...p, allowed: true }));
        } else {
          const userPerms = getUserAssignedPermissions(userId, role);
          perms = AVAILABLE_PERMISSIONS.map((p) => ({
            ...p,
            allowed: userPerms.includes(p.code),
          }));
        }
        await simulateApi(perms);
        setMyPermissions(perms);
        return perms;
      } catch (err) {
        setError(err.message);
        return [];
      } finally {
        setLoading((prev) => ({ ...prev, getMyPerms: false }));
      }
    },
    [simulateApi],
  );

  const getUserPermissions = useCallback(
    async (userId) => {
      setLoading((prev) => ({ ...prev, getUserPerms: true }));
      try {
        const user = SYSTEM_USERS.find((u) => u.id === userId);
        if (!user) throw new Error("User not found");

        const assignedCodes = getUserAssignedPermissions(userId, user.role);
        const perms = AVAILABLE_PERMISSIONS.map((p) => ({
          ...p,
          allowed: assignedCodes.includes(p.code),
        }));
        await simulateApi(perms);
        return perms;
      } catch (err) {
        setError(err.message);
        return [];
      } finally {
        setLoading((prev) => ({ ...prev, getUserPerms: false }));
      }
    },
    [simulateApi],
  );

  const assignPermissions = useCallback(
    async (userId, permissionCodes) => {
      setLoading((prev) => ({ ...prev, assign: true }));
      try {
        await simulateApi({ success: true });
        // Update the assignments in memory
        USER_PERMISSIONS_ASSIGNMENTS[userId] = permissionCodes;
        setError(null);
        return true;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading((prev) => ({ ...prev, assign: false }));
      }
    },
    [simulateApi],
  );

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchAllPermissions(), fetchUsers()]);
    if (currentUser) {
      await fetchMyPermissions(currentUser.id, currentUser.role);
    }
  }, [fetchAllPermissions, fetchUsers, fetchMyPermissions, currentUser]);

  // Initialize current user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    } else {
      // Set default as SUPER_ADMIN for demo
      const defaultUser = SYSTEM_USERS[0];
      setCurrentUser(defaultUser);
      localStorage.setItem("currentUser", JSON.stringify(defaultUser));
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (currentUser) {
      refreshAll();
    }
  }, [currentUser, refreshAll]);

  return {
    myPermissions,
    allPermissions,
    users,
    loading,
    error,
    assignPermissions,
    getUserPermissions,
    refreshAll,
    currentUser,
  };
};

// ============================================
// PERMISSION MODAL COMPONENT
// ============================================

// ============================================
// MAIN COMPONENT
// ============================================
export default function PermissionManagementPage() {
  const {
    myPermissions,
    allPermissions,
    users,
    loading,
    error: hookError,
    assignPermissions,
    getUserPermissions,
    refreshAll,
    currentUser,
  } = usePermissions();

  const [selectedUser, setSelectedUser] = useState("");
  const [userPermissions, setUserPermissions] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [userPage, setUserPage] = useState(1);
  const pageSize = 6;
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedCategories, setExpandedCategories] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirmSave = async () => {
    setConfirmOpen(false);
    await handleSavePermissions();
  };

  // Check permissions
  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";
  const hasPermission = (code) => {
    if (!myPermissions) return false;
    return myPermissions.some((p) => p.code === code && p.allowed);
  };

  const canViewPermissions =
    isSuperAdmin || hasPermission("MANAGE_PERMISSIONS");
  const canAssignPermissions =
    isSuperAdmin || hasPermission("MANAGE_PERMISSIONS");

  // Filter permissions by category
  const categories = useMemo(() => {
    const cats = ["all", ...new Set(allPermissions.map((p) => p.category))];
    return cats;
  }, [allPermissions]);

  const filteredPermissions = useMemo(() => {
    let filtered = allPermissions;
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    return filtered;
  }, [allPermissions, selectedCategory, searchTerm]);

  const groupedPermissions = useMemo(() => {
    const grouped = {};
    filteredPermissions.forEach((perm) => {
      if (!grouped[perm.category]) grouped[perm.category] = [];
      grouped[perm.category].push(perm);
    });
    return grouped;
  }, [filteredPermissions]);

  const filteredUsers = useMemo(() => {
    if (!userSearch) return users;
    const q = userSearch.toLowerCase();
    return users.filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.role || "").toLowerCase().includes(q),
    );
  }, [users, userSearch]);

  const totalUserPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / pageSize),
  );
  const pagedUsers = useMemo(() => {
    const start = (userPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, userPage]);

  const isPermissionAllowed = (permissionCode) => {
    const permission = userPermissions.find((p) => p.code === permissionCode);
    return permission ? permission.allowed : false;
  };

  const handleSavePermissions = async () => {
    if (!selectedUser) {
      // toast error handled in UI
      return;
    }
    if (!canAssignPermissions) return;

    try {
      const permissionsToAssign = userPermissions
        .filter((p) => p.allowed)
        .map((p) => p.code);
      await assignPermissions(selectedUser, permissionsToAssign);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

      const updatedPerms = await getUserPermissions(selectedUser);
      setUserPermissions(updatedPerms || []);
    } catch (err) {
      console.error("Failed to save permissions", err);
    }
  };

  const handleUserSelect = async (userId) => {
    setSelectedUser(userId);
    if (userId) {
      const perms = await getUserPermissions(userId);
      setUserPermissions(perms || []);
    } else {
      setUserPermissions([]);
    }
  };

  const handlePermissionToggle = (permissionCode) => {
    if (!canAssignPermissions) return;
    setUserPermissions((prev) => {
      const existingPermission = prev.find((p) => p.code === permissionCode);
      if (existingPermission) {
        return prev.map((p) =>
          p.code === permissionCode ? { ...p, allowed: !p.allowed } : p,
        );
      } else {
        const permission = allPermissions.find(
          (p) => p.code === permissionCode,
        );
        if (permission) {
          return [...prev, { ...permission, allowed: true }];
        }
        return prev;
      }
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshAll();
    if (selectedUser) {
      const perms = await getUserPermissions(selectedUser);
      setUserPermissions(perms || []);
    }
    setIsRefreshing(false);
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-purple-100 text-purple-800";
      case "LOAN_MANAGER":
        return "bg-blue-100 text-blue-800";
      case "LOAN_OFFICER":
        return "bg-green-100 text-green-800";
      case "UNDERWRITER":
        return "bg-orange-100 text-orange-800";
      case "COLLECTOR":
        return "bg-red-100 text-red-800";
      case "PARTNER":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadge = (status) => {
    if (status === "active") {
      return (
        <span className="flex items-center text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
          <LucideBadgeCheck className="h-3 w-3 mr-1" />
          Active
        </span>
      );
    }
    return (
      <span className="flex items-center text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
        <LucideClock className="h-3 w-3 mr-1" />
        Inactive
      </span>
    );
  };

  // Permission guard
  if (!canViewPermissions && !canAssignPermissions) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg text-center">
          <LucideAlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-700">Access Denied</h2>
          <p className="text-red-600 mt-2">
            You don't have permission to manage permissions.
          </p>
        </div>
      </div>
    );
  }

  const selectedUserData = users.find((u) => u.id === selectedUser);
  const assignedCount = userPermissions.filter((p) => p.allowed).length;
  const totalPermissions = allPermissions.length;
  const coveragePercent =
    totalPermissions > 0
      ? Math.round((assignedCount / totalPermissions) * 100)
      : 0;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header Section */}
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
                  Control access rights for users across the Loan Management
                  System
                </p>
                {isSuperAdmin && (
                  <div className="ml-11 mt-2 inline-flex items-center px-3 py-1 bg-linear-to-r from-purple-100 to-purple-50 text-purple-800 rounded-full text-sm font-medium border border-purple-200">
                    <LucideBadgeCheck className="h-3 w-3 mr-1" />
                    SUPER_ADMIN • Full System Access
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3 mt-4 md:mt-0">
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  aria-label="Refresh permissions"
                  className="flex items-center p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100"
                >
                  <LucideRefreshCw
                    className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  <span className="ml-2">Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {hookError && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <LucideAlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700">{hookError}</p>
              </div>
            </div>
          )}

          {/* Success Toast */}
          {saveSuccess && (
            <div className="fixed top-20 right-6 z-50 animate-slide-down">
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-lg flex items-center">
                <LucideCheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <p className="text-green-700 font-medium">
                  Permissions saved successfully!
                </p>
              </div>
            </div>
          )}

          {/* Stats Summary */}
          {selectedUser && allPermissions.length > 0 && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <p className="text-2xl font-bold text-gray-800">
                  {totalPermissions}
                </p>
                <p className="text-sm text-gray-500">Total Permissions</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <p className="text-2xl font-bold text-green-600">
                  {assignedCount}
                </p>
                <p className="text-sm text-gray-500">Assigned Permissions</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <p className="text-2xl font-bold text-blue-600">
                  {coveragePercent}%
                </p>
                <p className="text-sm text-gray-500">Coverage</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <p className="text-2xl font-bold text-purple-600">
                  {selectedUserData?.role}
                </p>
                <p className="text-sm text-gray-500">User Role</p>
              </div>
            </div>
          )}

          {selectedUser && (
            <div className="mt-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">
                Status Summary
              </h4>
              <div className="flex flex-wrap gap-6">
                <div>
                  <div className="text-xs text-gray-500">Status</div>
                  <div
                    className={`mt-1 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${selectedUserData?.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-700"}`}
                  >
                    {selectedUserData?.status || "N/A"}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Last Active</div>
                  <div className="mt-1 text-sm text-gray-700">
                    {selectedUserData?.lastActive
                      ? new Date(selectedUserData.lastActive).toLocaleString()
                      : "N/A"}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Department</div>
                  <div className="mt-1 text-sm text-gray-700">
                    {selectedUserData?.department || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* User Selection Panel */}
            <div className="lg:col-span-6 xl:col-span-5">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <LucideUsers className="h-5 w-5 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800 ml-3">
                      System Users
                    </h2>
                  </div>
                </div>

                <div className="p-4">
                  <div className="relative mb-4">
                    <SearchField
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Search users..."
                      className="w-full"
                      containerClassName="w-full"
                      showButton={false}
                    />
                  </div>

                  <div className="space-y-2 max-h-125 overflow-y-auto pr-1">
                    {pagedUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleUserSelect(user.id)}
                        className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                          selectedUser === user.id
                            ? "bg-blue-50 border-2 border-blue-500 shadow-md"
                            : "hover:bg-gray-50 border-2 border-transparent"
                        }`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium ${
                              user.role === "SUPER_ADMIN"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {user.avatar}
                          </div>
                          <div className="ml-3 flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {user.fullName}
                                {user.id === currentUser?.id && (
                                  <span className="ml-1 text-xs text-blue-600">
                                    (You)
                                  </span>
                                )}
                              </p>
                              {selectedUser === user.id && (
                                <LucideCheckCircle className="h-4 w-4 text-blue-500" />
                              )}
                            </div>
                            <p className="text-xs text-gray-500 truncate">
                              {user.email}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor(user.role)}`}
                              >
                                {user.role}
                              </span>
                              {getStatusBadge(user.status)}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <Pagination
                    currentPage={userPage}
                    totalPages={totalUserPages}
                    onPageChange={(p) => setUserPage(p)}
                    containerClassName="px-2"
                  />

                  {loading?.getUsers && (
                    <div className="flex justify-center py-4">
                      <LucideLoader className="h-6 w-6 animate-spin text-blue-500" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Permissions Panel */}
            <div className="lg:col-span-6 xl:col-span-7">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <LucideKey className="h-5 w-5 text-blue-600" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-800 ml-3">
                        {selectedUser
                          ? `Permissions for ${selectedUserData?.fullName}`
                          : "Select a User"}
                      </h2>
                    </div>

                    {selectedUser && (
                      <div className="flex items-center space-x-3">
                        <div className="px-3 py-1.5 bg-gray-100 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">
                            {assignedCount} / {totalPermissions} assigned
                          </span>
                        </div>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${coveragePercent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Filters Bar */}
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                      <InputField
                        placeholder="Search permissions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        icon={LucideSearch}
                        className="text-sm"
                        containerClassName="w-full"
                      />
                    </div>
                    <div className="sm:w-48 relative">
                      <SelectField
                        options={categories.map((cat) => ({
                          value: cat,
                          label: cat === "all" ? "All Categories" : cat,
                        }))}
                        value={selectedCategory}
                        onChange={(v) => setSelectedCategory(v)}
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Permissions List */}
                <div className="p-5">
                  {!selectedUser ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LucideUser className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        No User Selected
                      </h3>
                      <p className="text-gray-500">
                        Please select a user from the left panel to view and
                        manage their permissions.
                      </p>
                    </div>
                  ) : loading?.getUserPerms || loading?.getAllPerms ? (
                    <div className="flex justify-center py-16">
                      <LucideLoader className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                  ) : filteredPermissions.length === 0 ? (
                    <div className="text-center py-16">
                      <LucideAlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">
                        No permissions found matching your criteria.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(groupedPermissions).map(
                        ([category, perms]) => (
                          <div
                            key={category}
                            className="border border-gray-100 rounded-xl overflow-hidden"
                          >
                            <button
                              onClick={() => toggleCategory(category)}
                              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center">
                                <div className="p-1.5 bg-white rounded-lg shadow-sm mr-3">
                                  {category === "Loans" && (
                                    <LucideBuilding className="h-4 w-4 text-blue-500" />
                                  )}
                                  {category === "Customers" && (
                                    <LucideUsers className="h-4 w-4 text-green-500" />
                                  )}
                                  {category === "Payments" && (
                                    <LucideClock className="h-4 w-4 text-orange-500" />
                                  )}
                                  {category === "Reports" && (
                                    <LucideEye className="h-4 w-4 text-purple-500" />
                                  )}
                                  {category === "Admin" && (
                                    <LucideShield className="h-4 w-4 text-red-500" />
                                  )}
                                </div>
                                <h3 className="font-semibold text-gray-800">
                                  {category}
                                </h3>
                                <span className="ml-2 text-xs text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded-full">
                                  {perms.length}
                                </span>
                              </div>
                              {expandedCategories[category] ? (
                                <LucideChevronUp className="h-4 w-4 text-gray-400" />
                              ) : (
                                <LucideChevronDown className="h-4 w-4 text-gray-400" />
                              )}
                            </button>

                            {expandedCategories[category] && (
                              <div className="divide-y divide-gray-100">
                                {perms.map((permission) => (
                                  <div
                                    key={permission.code}
                                    onClick={() =>
                                      canAssignPermissions &&
                                      handlePermissionToggle(permission.code)
                                    }
                                    className={`p-4 transition-all duration-150 ${
                                      canAssignPermissions
                                        ? "cursor-pointer hover:bg-gray-50"
                                        : ""
                                    } ${
                                      isPermissionAllowed(permission.code)
                                        ? "bg-blue-50/30"
                                        : ""
                                    }`}
                                  >
                                    <div className="flex items-start">
                                      <div className="flex items-center h-5 mt-0.5">
                                        <input
                                          type="checkbox"
                                          checked={isPermissionAllowed(
                                            permission.code,
                                          )}
                                          onChange={() => {}}
                                          disabled={!canAssignPermissions}
                                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 disabled:opacity-50"
                                        />
                                      </div>
                                      <div className="ml-3 flex-1">
                                        <div className="flex items-center flex-wrap gap-2">
                                          <span className="font-medium text-gray-900">
                                            {permission.name}
                                          </span>
                                          <code className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-mono">
                                            {permission.code}
                                          </code>
                                          {isPermissionAllowed(
                                            permission.code,
                                          ) && (
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center">
                                              <LucideCheckCircle className="h-3 w-3 mr-1" />
                                              Granted
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                          {permission.description}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>

                {/* Action Footer */}
                {selectedUser && canAssignPermissions && (
                  <div className="p-5 border-t border-gray-100 bg-gray-50/50">
                    <button
                      onClick={() => setConfirmOpen(true)}
                      disabled={loading?.assign}
                      className="w-full px-4 py-3 bg-gradient-to-r-to-r from-blue-600 to-blue-500 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading?.assign ? (
                        <>
                          <LucideLoader className="h-5 w-5 animate-spin mr-2" />
                          Saving Permissions...
                        </>
                      ) : (
                        <>
                          <LucideSave className="h-5 w-5 mr-2" />
                          Save All Permissions
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Create Permission Modal */}
        <ConfirmationDialog
          open={confirmOpen}
          title="Confirm Save"
          description={`Save permissions for ${selectedUserData?.fullName || "selected user"}?`}
          confirmText="Save"
          cancelText="Cancel"
          onConfirm={handleConfirmSave}
          onCancel={() => setConfirmOpen(false)}
          loading={loading?.assign}
          variant="danger"
          isPopup={true}
        />
        <PermissionManagementModal
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            refreshAll();
            setIsCreateModalOpen(false);
          }}
        />

        <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
      </div>
    </ErrorBoundary>
  );
}
