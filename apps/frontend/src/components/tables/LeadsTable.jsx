
import { Mail, MapPin, Phone } from "lucide-react";
import Pagination from "../common/Pagination";
import { TableShell, TableHead, TableBody, TableLoader } from "../tables/core";
import { getLeadLoanTypeColor } from "../../lib/LOSDummyData";
import { colorVariables } from "../../lib";

const statusColors = {
  CONTACTED: "bg-blue-50 text-blue-700 border-blue-200",
  INTERESTED: "bg-cyan-50 text-cyan-700 border-cyan-200",
  APPLICATION_IN_PROGRESS: "bg-yellow-50 text-yellow-800 border-yellow-200",
  APPLICATION_SUBMITTED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  UNDER_REVIEW: "bg-blue-100 text-blue-700 border-blue-300",
  APPROVED: "bg-green-100 text-green-700 border-green-300",
  REJECTED: "bg-red-100 text-red-700 border-red-300",
  FUNDED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CLOSED: "bg-gray-200 text-gray-700 border-gray-300",
  DROPPED: "bg-orange-50 text-orange-700 border-orange-200",
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
  default: "bg-slate-100 text-slate-700 border-slate-300",
};

export default function LeadsTable({
  items = [],
  loading = false,
  getActions,
  currentPage,
  totalPages,
  onPageChange,
  search = "",
  setSearch = () => {},
}) {
  const filterValue = "";
  const setFilterValue = () => {};

  const columns = [
        {
          header: "Status",
          accessor: "status",
          render: (value) => (
            <span
              className={`inline-block px-3 py-1.5 rounded-2xl text-xs font-semibold border transition-colors duration-200 whitespace-nowrap
                ${statusColors[value] || statusColors.default}`}
            >
              {value ? value.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) : "Unknown"}
            </span>
          ),
        },
    {
      header: "Customer",
      accessor: "fullName",
      render: (_, row) => (
        <div className="flex items-center">
          <div className="h-10 w-10 shrink-0 rounded-full bg-linear-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
            {(row?.fullName || "").charAt(0).toUpperCase() || "U"}
          </div>
          <div className="ml-4">
            <div className="text-base font-semibold text-gray-900">
              {row?.fullName || "Unknown"}
            </div>
            <div
              className={`text-xs font-medium ${colorVariables.PRIMARY_COLOR} ${colorVariables.LIGHT_BG} px-2 py-0.5 rounded-md inline-block mt-1`}
            >
              {row?.leadNumber || "N/A"}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Contact Details",
      accessor: "contactNumber",
      render: (_, row) => (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-gray-400" />
            <span className="text-sm text-gray-900 font-medium">
              {row?.contactNumber || "No phone number"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <Mail size={12} />
            {row?.email || "No email"}
          </div>
        </div>
      ),
    },
    {
      header: "Location",
      accessor: "city",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-gray-400" />
          <div>
            <div className="text-sm font-medium text-gray-900">
              {row?.city || "Unknown"}
            </div>
            <div className="text-xs text-gray-500">{row?.state || ""}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Loan Type",
      accessor: "loanType",
      render: (_, row) => (
        <span
          className={`inline-flex items-center px-3 py-1.5 rounded-2xl text-sm font-medium border ${getLeadLoanTypeColor(row?.loanType?.name)}`}
        >
          {row?.loanType?.name || "—"}
        </span>
      ),
    },
    {
      header: "Loan Amount",
      accessor: "loanAmount",
      render: (value) => (
        <span className="text-sm font-semibold text-gray-900">
          ₹ {value ? value.toLocaleString("en-IN") : "0"}
        </span>
      ),
    },
  ];

  return (
    <TableShell>
      {/* HEAD */}
      <TableHead
        title="Leads"
        columns={columns}
        search={search}
        setSearch={setSearch}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        filterOptions={[]}
      />

      {/* BODY */}
      {loading ? (
        <TableLoader colSpan={columns.length + 1} />
      ) : (
        <TableBody
          columns={columns}
          data={items}
          actions={(row) =>
            typeof getActions === "function" ? getActions(row) : []
          }
        />
      )}

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </TableShell>
  );
}
