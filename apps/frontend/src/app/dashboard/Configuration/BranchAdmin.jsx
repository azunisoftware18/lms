import React, { useMemo, useState, useEffect } from "react";
import { Plus, Users, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import StatusCard from "../../../components/common/StatusCard";
import BranchAdminTable from "../../../components/tables/BranchAdminTable";
import Button from "../../../components/ui/Button";
import BranchAdminFormModal from "../../../components/modals/BranchAdminFormModal";
import {
  useBranchAdmins,
  useCreateBranchAdmin,
  useUpdateBranchAdmin,
} from "../../../hooks/useBranchAdmin";
import { useBranches } from "../../../hooks/useBranches";

const ITEMS_PER_PAGE = 8;

export default function BranchAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [search, setSearch] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    branchAdmins,
    loading: adminsLoading,
    isFetching: adminsFetching,
    total,
    activeCount,
    inactiveCount,
    totalPages,
    refetch: refetchAdmins,
  } = useBranchAdmins({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search,
    status: filterValue || undefined,
  });

  const {
    branches,
    loading: branchesLoading,
    refetch: refetchBranches,
  } = useBranches({ page: 1, limit: 100 });

  const createBranchAdminMutation = useCreateBranchAdmin();
  const updateBranchAdminMutation = useUpdateBranchAdmin();

  const saveLoading =
    createBranchAdminMutation.isPending || updateBranchAdminMutation.isPending;

  // Ensure branches load on mount
  useEffect(() => {
    refetchBranches();
  }, [refetchBranches]);

  const stats = useMemo(
    () => {
      const pageActiveCount = branchAdmins.filter((admin) => admin?.isActive).length;
      const pageInactiveCount = branchAdmins.filter((admin) => !admin?.isActive).length;

      return {
        totalAdmins: total || 0,
        activeAdmins:
          typeof activeCount === "number" ? activeCount : pageActiveCount,
        inactiveAdmins:
          typeof inactiveCount === "number" ? inactiveCount : pageInactiveCount,
        totalBranches: branches.length,
      };
    },
    [branchAdmins, branches, total, activeCount, inactiveCount],
  );

  const openAddModal = () => {
    setSelectedAdmin(null);
    setIsModalOpen(true);
  };

  const openEditModal = (admin) => {
    setSelectedAdmin(admin);
    setIsModalOpen(true);
  };

  const handleSearchChange = (valueOrEvent) => {
    const value =
      typeof valueOrEvent === "string"
        ? valueOrEvent
        : valueOrEvent?.target?.value || "";

    setCurrentPage(1);
    setSearch(value);
  };

  const handleFilterChange = (value) => {
    setCurrentPage(1);
    setFilterValue(value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRefreshAdmins = async () => {
    try {
      await Promise.all([refetchAdmins(), refetchBranches()]);
      toast.success("Branch admins refreshed");
    } catch (error) {
      toast.error(error?.message || "Failed to refresh branch admins");
    }
  };

  const handleSaveAdmin = async (formData) => {
    try {
      if (selectedAdmin?.id) {
        await updateBranchAdminMutation.mutateAsync({
          id: selectedAdmin.id,
          data: formData,
        });
      } else {
        await createBranchAdminMutation.mutateAsync(formData);
      }

      await refetchAdmins();
      setIsModalOpen(false);
      setSelectedAdmin(null);
    } catch (error) {
      toast.error(error?.message || "Failed to save branch admin");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mb-8 flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
            Branch Admin Management
          </h1>
          <p className="mt-1 text-gray-500">
            Manage administrators for all branches
          </p>
        </div>

        <Button
          onClick={openAddModal}
          className="w-full shrink-0 whitespace-nowrap bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:w-auto"
        >
          <span className="flex items-center justify-center gap-2">
            <Plus size={18} />
            Add Branch Admin
          </span>
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <StatusCard
          title="Total Admins"
          value={stats.totalAdmins}
          icon={Users}
          colorClass="text-blue-600"
          bgClass="bg-blue-50"
        />

        <StatusCard
          title="Active Admins"
          value={stats.activeAdmins}
          icon={CheckCircle}
          colorClass="text-green-600"
          bgClass="bg-green-50"
        />

        <StatusCard
          title="Inactive Admins"
          value={stats.inactiveAdmins}
          icon={XCircle}
          colorClass="text-red-600"
          bgClass="bg-red-50"
        />

        <StatusCard
          title="Total Branches"
          value={stats.totalBranches}
          icon={Users}
          colorClass="text-purple-600"
          bgClass="bg-purple-50"
        />
      </div>

      <BranchAdminTable
        admins={branchAdmins}
        loading={adminsLoading || adminsFetching}
        onEdit={openEditModal}
        onRefresh={handleRefreshAdmins}
        search={search}
        setSearch={handleSearchChange}
        filterValue={filterValue}
        setFilterValue={handleFilterChange}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalPages={Math.max(1, totalPages || 1)}
      />

      <BranchAdminFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAdmin(null);
        }}
        admin={selectedAdmin}
        branches={branches}
        onSave={handleSaveAdmin}
        loading={saveLoading}
        branchesLoading={branchesLoading}
      />
    </div>
  );
}
