import React, { useState, useMemo } from "react";
import { Phone, Mail, MapPin, Edit, Trash2, User } from "lucide-react";
import Pagination from "../../../components/common/Pagination";
import ActionMenu from "../../../components/common/ActionMenu";
import SearchField from "../../../components/ui/SearchField";
import {
  LEAD_ACTION_DEFINITIONS,
  LEADS_DUMMY_DATA,
  LEADS_PAGE_DUMMY_CONFIG,
  getLeadLoanTypeColor,
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading && (
            <div className="p-6 text-center text-gray-500">
              Loading user Leads...
            </div>
          )}

          {/* Table */}
          {!isLoading && (
            <>
              <div className="overflow-x-auto flex-1">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Contact Details
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Loan Type
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Loan Amount
                      </th>
                      <th className="px-8 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentItems.length > 0 ? (
                      currentItems.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          {/* Name Column */}
                          <td className="px-8 py-5">
                            <div className="flex items-center">
                              <div className="h-10 w-10 shrink-0 rounded-full bg-linear-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                                {(item.fullName || "")
                                  .charAt(0)
                                  .toUpperCase() || "U"}
                              </div>
                              <div className="ml-4">
                                <div className="text-base font-semibold text-gray-900">
                                  {item.fullName || "Unknown"}
                                </div>
                                <div
                                  className={`text-xs font-medium ${colorVariables.PRIMARY_COLOR} ${colorVariables.LIGHT_BG} px-2 py-0.5 rounded-md inline-block mt-1`}
                                >
                                  {item.leadNumber || "N/A"}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Contact Column */}
                          <td className="px-8 py-5">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Phone size={14} className="text-gray-400" />
                                <span className="text-sm text-gray-900 font-medium">
                                  {item.contactNumber || "No phone number"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <Mail size={12} />
                                {item.email || "No email"}
                              </div>
                            </div>
                          </td>

                          {/* Location Column */}
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-2">
                              <MapPin size={14} className="text-gray-400" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {item.city || "Unknown"}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {item.state || ""}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Loan Type Column */}
                          <td className="px-8 py-5">
                            <span
                              className={`inline-flex items-center px-3 py-1.5 rounded-2xl text-sm font-medium border 
                                ${getLeadLoanTypeColor(item.loanType?.name)}`}
                            >
                              {item.loanType?.name || "—"}
                            </span>
                          </td>

                          <td className="px-8 py-5">
                            <span className="text-sm font-semibold text-gray-900">
                              ₹{" "}
                              {item.loanAmount
                                ? item.loanAmount.toLocaleString("en-IN")
                                : "0"}
                            </span>
                          </td>

                          {/* Actions Column */}
                          <td className="px-8 py-5 text-right relative">
                            <div className="flex justify-end">
                              <ActionMenu actions={getActions(item)} />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-8 py-12 text-center">
                          <div className="text-gray-400 mb-4">
                            <svg
                              className="w-16 h-16 mx-auto"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            {searchTerm
                              ? "No matching users found"
                              : "No lead data available"}
                          </h3>
                          <p className="text-gray-500">
                            {searchTerm
                              ? "Try adjusting your search to find what you're looking for."
                              : "There are no leads in the system yet."}
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          containerClassName="fixed bottom-20 right-6 z-50 flex gap-2 bg-white px-4 py-2 rounded-xl shadow-lg border border-gray-200"
          maxVisiblePages={LEADS_PAGE_DUMMY_CONFIG.MAX_VISIBLE_PAGES}
        />
      )}
    </div>
  );
}
