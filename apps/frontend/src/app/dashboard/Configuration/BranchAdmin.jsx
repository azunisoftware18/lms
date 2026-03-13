import { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  AlertCircle,
  User,
  Wallet,
  Users
} from 'lucide-react';
import { dummyBranchAdmins, dummyBranches } from '../../../lib/dumyData';
import StatusCard from '../../../components/common/StatusCard';
import BranchAdminTable from '../../../components/tables/BranchAdminTable';
import Button from '../../../components/ui/Button';
import BranchAdminFormModal from '../../../components/modals/BranchAdminFormModal';


export default function BranchAdmin() {

  const [branchAdmins, setBranchAdmins] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [localError, setLocalError] = useState('');
  const getAdminActions = (admin) => [
    {
      label: "Edit",
      icon: <Edit size={16} />,
      onClick: () => openEditModal(admin),
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    setTimeout(() => {
      setBranchAdmins(dummyBranchAdmins);
      setBranches(dummyBranches);
      setLoading(false);
    }, 500);
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

      // Update Admin
      const updated = branchAdmins.map((a) =>
        a.id === selectedAdmin.id ? { ...a, ...formData } : a
      );

      setBranchAdmins(updated);

    } else {

      // Create Admin
      const newAdmin = {
        id: Date.now().toString(),
        ...formData,
        isActive: true,
        branch: branches.find((b) => b.id === formData.branchId)
      };

      setBranchAdmins([...branchAdmins, newAdmin]);
    }

    setIsModalOpen(false);
    setSelectedAdmin(null);
  };

  // Safely filter branch admins based on search
  const filteredAdmins = Array.isArray(branchAdmins)
    ? branchAdmins.filter(admin => {
      if (!admin) return false;

      const searchLower = searchTerm.toLowerCase();
      return (
        (admin.fullName?.toLowerCase() || '').includes(searchLower) ||
        (admin.email?.toLowerCase() || '').includes(searchLower) ||
        (admin.userName?.toLowerCase() || '').includes(searchLower) ||
        (admin.contactNumber || '').includes(searchTerm) ||
        (admin.branch?.name?.toLowerCase() || '').includes(searchLower)
      );
    })
    : [];

  // Status Badge Component


  // Calculate stats safely
  const totalAdmins = Array.isArray(branchAdmins) ? branchAdmins.length : 0;
  const activeAdmins = Array.isArray(branchAdmins)
    ? branchAdmins.filter(a => a?.isActive).length
    : 0;
  const inactiveAdmins = Array.isArray(branchAdmins)
    ? branchAdmins.filter(a => a && !a.isActive).length
    : 0;
  const totalBranches = Array.isArray(branches) ? branches.length : 0;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Branch Admin Management</h1>
          <p className="text-gray-500 mt-1">Manage administrators for all branches</p>
        </div>

        <Button
          onClick={openAddModal}
          className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 
            px-4 py-2 rounded-lg transition-colors text-sm font-medium
            flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Add Branch Admin
        </Button>
      </div>

      {/* Error Message */}
      {localError && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{localError}</p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatusCard title="Total Admins" value={totalAdmins} icon={Wallet} colorClass="text-green-500" bgClass="bg-green-50" />

        <StatusCard title="Active Admins" value={activeAdmins} icon={User} colorClass="text-green-500" bgClass="bg-green-50" />

        <StatusCard title="Inactive Admins" value={inactiveAdmins} icon={AlertCircle} colorClass="text-red-500" bgClass="bg-red-50" />

        <StatusCard title="Total Branches" value={totalBranches} icon={Users} colorClass="text-green-500" bgClass="bg-green-50" />
      </div>

      {/* Main Content Card */}
      <BranchAdminTable
        admins={filteredAdmins}
        loading={loading}
        onEdit={openEditModal}
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
        loading={loading}
      />

    </div>
  );
};

