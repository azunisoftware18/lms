import { useState, useMemo } from "react";

import { Icons } from "../../components/common/Icon";
import { foreclosureData, nocData } from "../../lib/dashboardDummyData";

import ActionMenu from "../../components/common/ActionMenu";
import Pagination from "../../components/common/Pagination";

import SearchField from "../../components/ui/SearchField";

import { Table } from "../../components/tables";

export default function LoanCloserPage() {
  const [activeTab, setActiveTab] = useState("foreclosure");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  /* ---------------- DATA SELECT ---------------- */

  const data = activeTab === "foreclosure" ? foreclosureData : nocData;

  /* ---------------- FILTER ---------------- */

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const id = item.id || item.loanId;

      return (
        id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [data, searchTerm]);

  /* ---------------- PAGINATION ---------------- */

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  /* ---------------- STATUS BADGE ---------------- */

  const StatusBadge = ({ status }) => {
    let style = "bg-gray-50 text-gray-700 border-gray-200";

    if (status === "Approved" || status === "Printed")
      style = "bg-green-50 text-green-700 border-green-200";
    else if (status === "Pending Approval" || status === "Pending Sign-off")
      style = "bg-amber-50 text-amber-700 border-amber-200";
    else if (status === "Rejected")
      style = "bg-red-50 text-red-700 border-red-200";
    else if (status === "Ready to Print")
      style = "bg-blue-50 text-blue-700 border-blue-200";

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${style}`}
      >
        {status}
      </span>
    );
  };

  /* ---------------- TAB CHANGE ---------------- */

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10 font-sans">
      {/* HEADER */}

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Icons.Users className="text-blue-600" size={32} />
            Loan Closure & NOC Management
          </h1>

          <p className="text-gray-500 mt-1 ml-11">
            Manage loan foreclosures and No Objection Certificates
          </p>
        </div>
      </div>

      {/* TABS */}

      <div className="flex gap-6 mb-8 border-b border-gray-200">
        <button
          onClick={() => handleTabChange("foreclosure")}
          className={`flex items-center gap-2 px-5 py-3 font-medium ${
            activeTab === "foreclosure"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
        >
          <Icons.FileText size={18} />
          Loan Foreclosure
        </button>

        <button
          onClick={() => handleTabChange("noc")}
          className={`flex items-center gap-2 px-5 py-3 font-medium ${
            activeTab === "noc"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
        >
          <Icons.Printer size={18} />
          NOC Print
        </button>
      </div>

      {/* SEARCH */}

      <div className="mb-6">
        <SearchField
          placeholder="Search by Loan ID or Customer..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          icon={<Icons.Search size={16} />}
        />
      </div>

      {/* TABLE */}

      <div className="bg-white shadow-sm rounded-2xl border border-gray-200 overflow-hidden">
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Cell>Loan ID</Table.Cell>
              <Table.Cell>Customer</Table.Cell>
              <Table.Cell>Status</Table.Cell>
              <Table.Cell className="text-right">Actions</Table.Cell>
            </Table.Row>
          </Table.Head>

          <Table.Body>
            {currentData.length === 0 ? (
              <Table.Row>
                <Table.Cell
                  colSpan={4}
                  className="text-center py-12 text-gray-500"
                >
                  No records found
                </Table.Cell>
              </Table.Row>
            ) : (
              currentData.map((item) => (
                <Table.Row key={item.id || item.loanId}>
                  <Table.Cell>{item.id || item.loanId}</Table.Cell>

                  <Table.Cell>{item.customer}</Table.Cell>

                  <Table.Cell>
                    <StatusBadge status={item.status || item.printStatus} />
                  </Table.Cell>

                  <Table.Cell className="text-right">
                    <ActionMenu
                      items={[
                        {
                          label: "View Details",
                          icon: Icons.FileText,
                          onClick: () =>
                            console.log("View", item.id || item.loanId),
                        },
                        {
                          label: "Print",
                          icon: Icons.Printer,
                          onClick: () =>
                            console.log("Print", item.id || item.loanId),
                        },
                      ]}
                    />
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      </div>

      {/* PAGINATION */}

      {filteredData.length > itemsPerPage && (
        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
