import React, { useState } from "react";
import { Edit, Trash2, User, Plus } from "lucide-react";
import SearchField from "../../../components/ui/SearchField";
import LeadsTable from "../../../components/tables/LeadsTable";
import LeadFormModal from "../../../components/modals/LeadFormModal";
import Button from "../../../components/ui/Button";
import {
  LEAD_ACTION_DEFINITIONS,
} from "../../../lib/LOSDummyData";
import { colorVariables } from "../../../lib";
import { useLead } from "../../../hooks/useLead";

export default function LeadsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const getLeads = getLeads();
  
  const itemsPerPage = 10;

  // Use React Query hook
  const { leads = [], loading, refetch } = useLead({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm
  });

  const totalItems = leads?.total || 0;
  const totalPages = leads?.totalPages || 1;

  const getActions = (item) => {
    const iconMap = {
      Edit: <Edit size={16} />,
      Trash2: <Trash2 size={16} />,
    };

    return LEAD_ACTION_DEFINITIONS.map((action) => ({
      ...action,
      icon: iconMap[action.icon],
      onClick: () => {
        if (action.key === "edit") {
          console.log("Edit clicked", item.id);
          // TODO: Open edit modal
        }
        if (action.key === "delete") {
          console.log("Delete clicked", item.id);
          // TODO: Show delete confirmation
        }
      },
    }));
  };

  return (
    <div className="p-6 bg-linear-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Lead Form Modal */}
      <LeadFormModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          refetch(); // Refresh data after closing
        }} 
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              User Lead Management
            </h1>
            <p className="text-gray-600">
              Manage and view all loan application details
            </p>
          </div>
          
          {/* Add New Lead Button */}
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            <span>New Lead</span>
          </Button>
        </div>

        {/* Stats and Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                Leads
              </h2>
              <div className="flex items-center gap-4">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${colorVariables.LIGHT_BG} ${colorVariables.PRIMARY_COLOR} text-sm`}
                >
                  <User size={14} />
                  Total: {totalItems} Records
                </span>
                {searchTerm && (
                  <span className="text-sm text-gray-500">
                    Showing page {currentPage} of {totalPages}
                  </span>
                )}
              </div>
            </div>

            <div className="w-full md:w-64">
              <SearchField
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                onClear={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                showResults={false}
                placeholder="Search users..."
              />
            </div>
          </div>
        </div>

        {/* Table Container */}
        <LeadsTable
          items={leads?.data || []}
          loading={loading}
          getActions={getActions}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          search={searchTerm}
          setSearch={(value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
        />
      </div>
    </div>
  );
}
