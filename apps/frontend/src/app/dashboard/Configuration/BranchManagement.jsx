import React, { useState, useEffect, useMemo } from "react";
import { Building2, CheckCircle, XCircle, Plus } from "lucide-react";
import StatusCard from "../../../components/common/StatusCard";
import BranchTable from "../../../components/tables/BranchTable";
import { dummyBranches } from "../../../lib/dumyData";
import Button from "../../../components/ui/Button";
import AddBranchFormModal from "../../../components/modals/AddBranchFormModal";
import { toast } from "react-hot-toast";

export default function BranchManagement() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openBranchModal, setOpenBranchModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);

  // Memoized main branches for better performance
  const mainBranches = useMemo(() => 
    branches.filter((b) => b.type === "MAIN" && b.isActive),
    [branches]
  );

  // Memoized flattened branches for stats
  const allBranchesFlat = useMemo(() => {
    const flatten = (list) => {
      return list.reduce((acc, branch) => {
        acc.push(branch);
        if (branch.subBranches?.length) {
          acc.push(...flatten(branch.subBranches));
        }
        return acc;
      }, []);
    };
    return flatten(branches);
  }, [branches]);

  // Memoized stats
  const stats = useMemo(() => ({
    total: allBranchesFlat.length,
    main: allBranchesFlat.filter((b) => b.type === "MAIN").length,
    active: allBranchesFlat.filter((b) => b.isActive).length,
    inactive: allBranchesFlat.filter((b) => !b.isActive).length,
  }), [allBranchesFlat]);

  const handleSaveBranch = async (data) => {
    console.log("Saved Branch:", data);
    toast.success("Branch saved successfully");
    setOpenBranchModal(false);
    // Add logic to update branches state with new data
  };

  // Load dummy data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setBranches(dummyBranches);
      setLoading(false);
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* ===== HEADER SECTION ===== */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Branch Master
          </h1>
          <p className="text-gray-500 mt-1">
            Manage all your company locations and branch details with hierarchy.
          </p>
        </div>
        
        {/* Create Button - full width on mobile, auto on desktop */}
        <Button 
          onClick={() => {
            setSelectedBranch(null);
            setOpenBranchModal(true);
          }} 
          className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 
            px-4 py-2 rounded-lg transition-colors text-sm font-medium
            flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Create New Branch
        </Button>
      </div>

      {/* ===== STATUS CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatusCard
          title="Total Branches"
          value={stats.total}
          icon={Building2}
          colorClass="text-blue-600"
          bgClass="bg-blue-50"
        />

        <StatusCard
          title="Main Branches"
          value={stats.main}
          icon={Building2}
          colorClass="text-purple-600"
          bgClass="bg-purple-50"
        />

        <StatusCard
          title="Active"
          value={stats.active}
          icon={CheckCircle}
          colorClass="text-green-600"
          bgClass="bg-green-50"
        />

        <StatusCard
          title="Inactive"
          value={stats.inactive}
          icon={XCircle}
          colorClass="text-red-600"
          bgClass="bg-red-50"
        />
      </div>

      {/* ===== BRANCH TABLE SECTION ===== */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">

        <div className="overflow-x-auto">
          <BranchTable
            branches={branches}
            loading={loading}
          />
        </div>
      </div>

      {/* ===== ADD BRANCH MODAL ===== */}
      <AddBranchFormModal
        isOpen={openBranchModal}
        onClose={() => setOpenBranchModal(false)}
        branch={selectedBranch}
        mainBranches={mainBranches}
        onSave={handleSaveBranch}
      />
    </div>
  );
}