import React, { useState, useMemo } from "react";
import { Edit, Trash2, User } from "lucide-react";
import ActionMenu from "../../../components/common/ActionMenu";
import SearchField from "../../../components/ui/SearchField";
import LeadsTable from "../../../components/tables/LeadsTable";
import {
  LEAD_ACTION_DEFINITIONS,
  LEADS_DUMMY_DATA,
  LEADS_PAGE_DUMMY_CONFIG,
} from "../../../lib/LOSDummyData";
import { colorVariables } from "../../../lib";

export default function LeadsPage() {
  const isLoading = false;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = LEADS_PAGE_DUMMY_CONFIG.ITEMS_PER_PAGE;
  const [searchTerm, setSearchTerm] = useState("");

  // Offline mode: use local dummy data instead of API
  const loanData = useMemo(() => {
    return [...LEADS_DUMMY_DATA].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  }, []);

  const filteredData = useMemo(() => {
    if (!searchTerm) return loanData;

    const lower = searchTerm.toLowerCase();

    return loanData.filter((item) => {
      // Safely handle null/undefined properties
      const fullName = item?.fullName || "";
      const email = item?.email || "";
      const contactNumber = item?.contactNumber || "";
      const city = item?.city || "";
      // Note: In your JSON, loanType is a nested object
      const loanTypeName = item?.loanType?.name || "";

      return (
        fullName.toLowerCase().includes(lower) ||
        email.toLowerCase().includes(lower) ||
        contactNumber.includes(searchTerm) ||
        city.toLowerCase().includes(lower) ||
        loanTypeName.toLowerCase().includes(lower)
      );
    });
  }, [loanData, searchTerm]);

  const totalItems = Array.isArray(filteredData) ? filteredData.length : 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentItems = filteredData.slice(startIndex, endIndex);

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
          return;
        }

        if (action.key === "delete") {
          console.log("Delete clicked", item.id);
        }
      },
    }));
  };

  return (
    <div className="p-6 bg-linear-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            User Lead Management
          </h1>
          <p className="text-gray-600">
            Manage and view all loan application details
          </p>
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
                    Found {filteredData.length} matching records
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
          items={currentItems}
          loading={isLoading}
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
