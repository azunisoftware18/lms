import { useState, useMemo } from "react";

import { Icons } from "../../components/common/Icon";
import { loanRequests } from "../../lib/dashboardDummyData";

import SearchField from "../../components/ui/SearchField";
import ActionMenu from "../../components/common/ActionMenu";
import Pagination from "../../components/common/Pagination";

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "../../components/tables";

export default function LoanRequestPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const filteredLoans = useMemo(() => {
    return loanRequests.filter((loan) => {
      const search = searchTerm.toLowerCase();

      return (
        loan.borrower.toLowerCase().includes(search) ||
        loan.id.toLowerCase().includes(search) ||
        loan.loanSource.toLowerCase().includes(search)
      );
    });
  }, [searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredLoans.length / itemsPerPage),
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentData = filteredLoans.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10">
      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Icons.Shield size={30} className="text-red-600" />
          Admin Loan Dashboard
        </h1>
      </div>

      {/* SEARCH */}

      <div className="mb-6">
        <SearchField
          placeholder="Search by Loan ID, Borrower, Source..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          icon={<Icons.Search size={16} />}
        />
      </div>

      {/* TABLE */}

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Loan ID</TableCell>
              <TableCell>Borrower</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Approved By</TableCell>
              <TableCell className="text-right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {currentData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No Loan Requests Found
                </TableCell>
              </TableRow>
            ) : (
              currentData.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell>{loan.id}</TableCell>

                  <TableCell>{loan.borrower}</TableCell>

                  <TableCell>{loan.amount}</TableCell>

                  <TableCell>{loan.loanSource}</TableCell>

                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        loan.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : loan.status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : loan.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {loan.status}
                    </span>
                  </TableCell>

                  <TableCell>{loan.approvedBy || "N/A"}</TableCell>

                  <TableCell className="text-right">
                    <ActionMenu
                      items={[
                        {
                          label: "View Details",
                          icon: Icons.Eye,
                          onClick: () => console.log("View", loan.id),
                        },
                        {
                          label: "Approve",
                          icon: Icons.CheckCircle,
                          onClick: () => console.log("Approve", loan.id),
                        },
                        {
                          label: "Reject",
                          icon: Icons.XCircle,
                          onClick: () => console.log("Reject", loan.id),
                        },
                        {
                          label: "Delete",
                          icon: Icons.Trash2,
                          onClick: () => console.log("Delete", loan.id),
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}

      {filteredLoans.length > itemsPerPage && (
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
