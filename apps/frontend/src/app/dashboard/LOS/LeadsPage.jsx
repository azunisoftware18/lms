import React, { useState } from "react";
// Lead status options for filter dropdown
const leadStatusOptions = [
  { label: "Contacted", value: "CONTACTED" },
  { label: "Interested", value: "INTERESTED" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Pending", value: "PENDING" },
];
import EditLeadDialog from "../reports/EditLeadDialog";
import {
  Edit,
  Trash2,
  User,
  Plus,
  CalendarDays,
  Clock,
  XCircle,
  DollarSign,
  Hourglass,
} from "lucide-react";
// SearchField removed from this view - only status cards shown
import LeadsTable from "../../../components/tables/LeadsTable";
import LeadFormModal from "../../../components/modals/LeadFormModal";
import Button from "../../../components/ui/Button";
import StatusCard from "../../../components/common/StatusCard";
import { LEAD_ACTION_DEFINITIONS } from "../../../lib/LOSDummyData";
// import { colorVariables } from "../../../lib";
import { useLead, useUpdateLeadStatus } from "../../../hooks/useLead";
import toast from "react-hot-toast";

export default function LeadsPage() {
  const updateLeadStatus = useUpdateLeadStatus();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  // Status filter state
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState("ALL");

  // const getLeads = getLeads();

  const itemsPerPage = 10;

  // Use React Query hook
  const {
    leads = [],
    loading,
    refetch,
  } = useLead({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    status: statusFilter,
  });

  const totalItems = leads?.total || 0;
  const totalPages = leads?.totalPages || 1;

  // compute status counts for StatusCard display
  const statusCounts = (leads?.data || []).reduce((acc, item) => {
    const s = item?.status || "UNKNOWN";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const getActions = (item) => {
    const iconMap = {
      Edit: <Edit size={16} />,
      Trash2: <Trash2 size={16} />,
    };

    const defaultDefs = [
      { key: "edit", label: "Edit", icon: "Edit" },
      { key: "delete", label: "Delete", icon: "Trash2" },
    ];

    const defs =
      typeof LEAD_ACTION_DEFINITIONS !== "undefined" &&
      Array.isArray(LEAD_ACTION_DEFINITIONS)
        ? LEAD_ACTION_DEFINITIONS
        : defaultDefs;

    return defs.map((action) => ({
      ...action,
      icon: iconMap[action.icon] || iconMap.Edit,
      onClick: () => {
        if (action.key === "edit") {
          setSelectedLead(item);
          setEditDialogOpen(true);
        }
        if (action.key === "delete") {
          console.log("Delete clicked", item.id);
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

      {/* Edit Lead Dialog */}
      <EditLeadDialog
        open={editDialogOpen}
        lead={selectedLead}
        onClose={() => setEditDialogOpen(false)}
        onSave={({ id, status }) => {
          updateLeadStatus.mutate(
            { id, status },
            {
              onSuccess: () => {
                setEditDialogOpen(false);
                setSelectedLead(null);
                refetch();
              },
              onError: (error) => {
                // Consider using a toast notification or error state
                toast.error(
                  error?.response?.data?.message ||
                    "Failed to update lead status",
                );
                // TODO: Show user-friendly error message
              },
            },
          );
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

        {/* Top Stats & Search */}

        <div className="flex flex-col gap-6">
          {/* Status Cards - responsive wrap */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6">
              <StatusCard
                title="Total Leads"
                value={totalItems}
                icon={User}
                colorClass="text-white"
                bgClass="bg-gradient-to-r from-blue-500 to-blue-600"
                percent={totalItems ? 100 : 0}
              />
            </div>

            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6">
              <StatusCard
                title="Interested"
                value={statusCounts.INTERESTED || 0}
                icon={CalendarDays}
                colorClass="text-cyan-600"
                bgClass="bg-cyan-50"
                percent={
                  totalItems
                    ? Math.round(
                        ((statusCounts.INTERESTED || 0) / totalItems) * 100,
                      )
                    : 0
                }
              />
            </div>

            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6">
              <StatusCard
                title="Approved"
                value={statusCounts.APPROVED || 0}
                icon={User}
                colorClass="text-green-600"
                bgClass="bg-green-50"
                percent={
                  totalItems
                    ? Math.round(
                        ((statusCounts.APPROVED || 0) / totalItems) * 100,
                      )
                    : 0
                }
              />
            </div>

            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6">
              <StatusCard
                title="Rejected"
                value={statusCounts.REJECTED || 0}
                icon={XCircle}
                colorClass="text-red-600"
                bgClass="bg-red-50"
                percent={
                  totalItems
                    ? Math.round(
                        ((statusCounts.REJECTED || 0) / totalItems) * 100,
                      )
                    : 0
                }
              />
            </div>

            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6">
              <StatusCard
                title="Pending"
                value={statusCounts.PENDING || 0}
                icon={Hourglass}
                colorClass="text-yellow-700"
                bgClass="bg-yellow-50"
                percent={
                  totalItems
                    ? Math.round(
                        ((statusCounts.PENDING || 0) / totalItems) * 100,
                      )
                    : 0
                }
              />
            </div>
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
        filterValue={statusFilter}
        setFilterValue={(value) => {
          setStatusFilter(value);
          setCurrentPage(1);
        }}
        filterOptions={leadStatusOptions}
        dateRange={dateRange}
        setDateRange={(v) => {
          setDateRange(v);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}
