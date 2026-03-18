import React, { useState, useEffect, useMemo } from "react";
import { Plus, Users, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { dummyBranchAdmins, dummyBranches } from "../../../lib/dumyData";
import StatusCard from "../../../components/common/StatusCard";
import BranchAdminTable from "../../../components/tables/BranchAdminTable";
import Button from "../../../components/ui/Button";
import BranchAdminFormModal from "../../../components/modals/BranchAdminFormModal";

export default function BranchAdmin() {
  const [branchAdmins, setBranchAdmins] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const stats = useMemo(
    () => ({
      totalAdmins: branchAdmins.length,
      activeAdmins: branchAdmins.filter((admin) => admin?.isActive).length,
      inactiveAdmins: branchAdmins.filter((admin) => !admin?.isActive).length,
      totalBranches: branches.length,
    }),
    [branchAdmins, branches],
  );

  const loadData = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setBranchAdmins(dummyBranchAdmins);
    setBranches(dummyBranches);
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setBranchAdmins(dummyBranchAdmins);
      setBranches(dummyBranches);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleRefreshAdmins = async () => {
    await loadData();
    toast.success("Branch admins refreshed");
  };

  const openAddModal = () => {
    setSelectedAdmin(null);
    setIsModalOpen(true);
  };

  const openEditModal = (admin) => {
    setSelectedAdmin(admin);
    setIsModalOpen(true);
  };

  const handleSaveAdmin = (formData) => {
    if (selectedAdmin) {
      const updated = branchAdmins.map((admin) =>
        admin.id === selectedAdmin.id ? { ...admin, ...formData } : admin,
      );
      setBranchAdmins(updated);
    } else {
      const newAdmin = {
        id: Date.now().toString(),
        ...formData,
        isActive: true,
        branch: branches.find((branch) => branch.id === formData.branchId),
      };
      setBranchAdmins([...branchAdmins, newAdmin]);
    }

    toast.success("Branch admin saved successfully");
    setIsModalOpen(false);
    setSelectedAdmin(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* ===== HEADER SECTION ===== */}
      <div className="mb-8 flex w-full flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Branch Admin Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage administrators for all branches
          </p>
        </div>

        <Button
          onClick={openAddModal}
          className="w-full sm:w-auto shrink-0 whitespace-nowrap bg-blue-600 text-white hover:bg-blue-700 
            px-4 py-2 rounded-lg transition-colors text-sm font-medium
            flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Add Branch Admin
        </Button>
      </div>

      {/* ===== STATUS CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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

      {/* ===== BRANCH ADMIN TABLE SECTION ===== */}
      <BranchAdminTable
        admins={branchAdmins}
        loading={loading}
        onEdit={openEditModal}
        onRefresh={handleRefreshAdmins}
      />

      {/* ===== ADD / EDIT ADMIN MODAL ===== */}
      <BranchAdminFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAdmin(null);
        }}
        admin={selectedAdmin}
        branches={branches}
        onSave={handleSaveAdmin}
        loading={loading}
      />
    </div>
  );
}
