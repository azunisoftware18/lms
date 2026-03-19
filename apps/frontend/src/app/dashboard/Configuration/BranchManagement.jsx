import React, { useState, useEffect, useMemo } from "react";
import { Building2, CheckCircle, XCircle, Plus } from "lucide-react";
import StatusCard from "../../../components/common/StatusCard";
import BranchManagementTable from "../../../components/tables/BranchManagementTable";
import Button from "../../../components/ui/Button";
import AddBranchFormModal from "../../../components/modals/AddBranchFormModal";
import { toast } from "react-hot-toast";
import {
  useBranches,
  useCreateBranch,
  useUpdateBranch,
  useDeleteBranch,
} from "../../../hooks/useBranches";

export default function BranchManagement() {
  const isTopLevelType = (type) => type === "HEAD_OFFICE" || type === "MAIN";
  const buildBranchTree = (records) => {
    const list = Array.isArray(records) ? records : [];
    const nodeMap = new Map();

    list.forEach((item) => {
      nodeMap.set(item.id, {
        ...(nodeMap.get(item.id) || {}),
        ...item,
        subBranches: [],
      });
    });

    list.forEach((item) => {
      const parentId = item?.parentBranch?.id;
      if (parentId && nodeMap.has(parentId) && nodeMap.has(item.id)) {
        const parent = nodeMap.get(parentId);
        const child = nodeMap.get(item.id);
        if (!parent.subBranches.some((branch) => branch.id === child.id)) {
          parent.subBranches.push(child);
        }
      }
    });

    const roots = [];
    nodeMap.forEach((node) => {
      const hasParentInList = Boolean(
        node?.parentBranch?.id && nodeMap.has(node.parentBranch.id),
      );
      if (!hasParentInList) {
        roots.push(node);
      }
    });

    return roots;
  };

  const [openBranchModal, setOpenBranchModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);

  const { branches: branchList = [], loading, refetch } = useBranches();
  const createBranchMutation = useCreateBranch();
  const updateBranchMutation = useUpdateBranch();
  const deleteBranchMutation = useDeleteBranch();

  const branches = useMemo(() => buildBranchTree(branchList), [branchList]);

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
    return flatten(Array.isArray(branches) ? branches : []);
  }, [branches]);

  // Memoized stats
  const stats = useMemo(
    () => ({
      total: allBranchesFlat.length,
      main: allBranchesFlat.filter((b) => isTopLevelType(b.type)).length,
      active: allBranchesFlat.filter((b) => b.isActive).length,
      inactive: allBranchesFlat.filter((b) => !b.isActive).length,
    }),
    [allBranchesFlat],
  );

  const statusCards = [
    {
      key: "total",
      title: "Total Branches",
      value: stats.total,
      icon: Building2,
      colorClass: "text-blue-600",
      bgClass: "bg-blue-50",
    },
    {
      key: "main",
      title: "Main Branches",
      value: stats.main,
      icon: Building2,
      colorClass: "text-purple-600",
      bgClass: "bg-purple-50",
    },
    {
      key: "active",
      title: "Active",
      value: stats.active,
      icon: CheckCircle,
      colorClass: "text-green-600",
      bgClass: "bg-green-50",
    },
    {
      key: "inactive",
      title: "Inactive",
      value: stats.inactive,
      icon: XCircle,
      colorClass: "text-red-600",
      bgClass: "bg-red-50",
    },
  ];

  const handleSaveBranch = async (data) => {
    try {
      if (selectedBranch?.id) {
        await updateBranchMutation.mutateAsync({
          id: selectedBranch.id,
          branchData: data,
        });
      } else {
        await createBranchMutation.mutateAsync(data);
      }

      await refetch();

      setOpenBranchModal(false);
      setSelectedBranch(null);
    } catch (error) {
      toast.error(error.message || "Failed to save branch");
    }
  };

  const handleEditBranch = (branch) => {
    setSelectedBranch(branch);
    setOpenBranchModal(true);
  };

  const handleRefreshBranches = async () => {
    try {
      await refetch();
      toast.success("Branch data refreshed");
    } catch (error) {
      toast.error(error.message || "Failed to refresh branch data");
    }
  };

  const handleDeleteBranch = async (branch) => {
    if (!branch?.id) return;

    try {
      await deleteBranchMutation.mutateAsync(branch.id);
      await refetch();
    } catch (error) {
      toast.error(error.message || "Failed to delete branch");
    }
  };

  // Initial fetch
  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* ===== HEADER SECTION ===== */}
      <div className="mb-8 flex w-full flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="min-w-0">
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
          className="w-full sm:w-auto shrink-0 whitespace-nowrap bg-blue-600 text-white hover:bg-blue-700 
            px-4 py-2 rounded-lg transition-colors text-sm font-medium
            flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Create New Branch
        </Button>
      </div>

      {/* ===== STATUS CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {statusCards.map((card) => (
          <StatusCard
            key={card.key}
            title={card.title}
            value={card.value}
            icon={card.icon}
            colorClass={card.colorClass}
            bgClass={card.bgClass}
          />
        ))}
      </div>

      {/* ===== BRANCH TABLE SECTION ===== */}
      <BranchManagementTable
        key={allBranchesFlat.length}
        branches={branches}
        loading={loading}
        onEdit={handleEditBranch}
        onDelete={handleDeleteBranch}
        onRefresh={handleRefreshBranches}
      />

      {/* ===== ADD BRANCH MODAL ===== */}
      <AddBranchFormModal
        isOpen={openBranchModal}
        onClose={() => setOpenBranchModal(false)}
        branch={selectedBranch}
        mainBranches={allBranchesFlat}
        onSave={handleSaveBranch}
      />
    </div>
  );
}
