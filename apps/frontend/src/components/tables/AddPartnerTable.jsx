import { useMemo, useState } from "react";
import { Edit, Trash2, Download } from "lucide-react";
import { TableShell, TableBody } from "./core";
import Pagination from "../common/Pagination";
import Button from "../ui/Button";
import SearchField from "../ui/SearchField";
import FilterDropdown from "../ui/FilterDropdown";

const partnerTypes = [
  { value: "All", label: "All Types" },
  { value: "Individual", label: "Individual" },
  { value: "Company", label: "Company" },
  { value: "Institution", label: "Institution" },
  { value: "Corporate", label: "Corporate" },
  { value: "Agency", label: "Agency" },
];

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "Suspended", label: "Suspended" },
  { value: "Under Review", label: "Under Review" },
];

const getPerformanceColor = (rating) => {
  const value = String(rating || "");
  if (value === "1") return "bg-red-100 text-red-700";
  if (value === "2") return "bg-orange-100 text-orange-700";
  if (value === "3") return "bg-yellow-100 text-yellow-700";
  if (value === "4") return "bg-green-100 text-green-700";
  if (value === "5") return "bg-blue-100 text-blue-700";
  return "bg-slate-100 text-slate-700";
};

export default function AddPartnerTable({ partners = [], onEdit, onDelete }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredPartners = useMemo(() => {
    const safePartners = Array.isArray(partners) ? partners : [];

    return safePartners.filter((partner) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        partner.companyName?.toLowerCase().includes(q) ||
        partner.partnerName?.toLowerCase().includes(q) ||
        partner.contactPerson?.toLowerCase().includes(q) ||
        partner.phone?.includes(q) ||
        partner.email?.toLowerCase().includes(q) ||
        partner.partnerId?.toLowerCase().includes(q) ||
        partner.city?.toLowerCase().includes(q);

      const matchesStatus = !filterStatus || partner.status === filterStatus;
      const matchesType =
        filterType === "All" || partner.partnerType === filterType;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [partners, search, filterStatus, filterType]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPartners.length / itemsPerPage),
  );
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPartners = filteredPartners.slice(startIndex, endIndex);

  const exportPartners = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent +=
      "Partner ID,Company Name,Contact Person,Email,Phone,Type,Status,Commission,Monthly Target,Performance Rating\n";

    filteredPartners.forEach((partner) => {
      const row = `${partner.partnerId || ""},"${partner.companyName || ""}","${partner.contactPerson || ""}","${partner.email || ""}","${partner.phone || ""}","${partner.partnerType || ""}","${partner.status || ""}","${partner.commissionValue || ""}","${partner.monthlyTarget || ""}","${partner.performanceRating || ""}/5"`;
      csvContent += `${row}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "partners_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSearchChange = (event) => {
    setCurrentPage(1);
    setSearch(event.target.value);
  };

  const handleStatusFilterChange = (value) => {
    setCurrentPage(1);
    setFilterStatus(value);
  };

  const handleTypeFilterChange = (value) => {
    setCurrentPage(1);
    setFilterType(value);
  };

  const columns = [
    {
      header: "Partner ID",
      accessor: "partnerId",
      render: (value) => (
        <span className="text-blue-600 text-sm font-semibold">
          #{value || "—"}
        </span>
      ),
    },
    {
      header: "Company Name",
      accessor: "companyName",
      render: (value, row) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
            {value?.charAt(0)?.toUpperCase() || "P"}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-slate-800 truncate">
              {value || "—"}
            </div>
            <div className="text-xs text-slate-500 truncate">
              {row.email || "—"}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Contact Person",
      accessor: "contactPerson",
      render: (value, row) => (
        <div className="text-sm">
          <div className="font-medium text-slate-700">
            {value || row.partnerName || "—"}
          </div>
          <div className="text-xs text-slate-500">
            {row.contactPersonDesignation || "—"}
          </div>
        </div>
      ),
    },
    {
      header: "Type",
      accessor: "partnerType",
      render: (value) => (
        <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-semibold">
          {value || "—"}
        </span>
      ),
    },
    {
      header: "Contact",
      accessor: "phone",
      render: (value, row) => (
        <div className="text-sm">
          <div className="text-slate-700">{value || "—"}</div>
          <div className="text-xs text-slate-500">{row.city || "—"}</div>
        </div>
      ),
    },
    {
      header: "Commission",
      accessor: "commissionValue",
      render: (value, row) => (
        <div>
          <div className="font-bold text-emerald-600 text-sm">
            {value || "—"}
          </div>
          <div className="text-xs text-slate-500">
            {row.paymentCycle || "—"}
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (value, row) => (
        <div className="flex flex-col gap-1.5">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold border w-fit ${
              value === "Active"
                ? "bg-green-50 text-green-700 border-green-200"
                : value === "Inactive"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : value === "Suspended"
                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                    : "bg-slate-50 text-slate-700 border-slate-200"
            }`}
          >
            {value || "Unknown"}
          </span>

          <span
            className={`px-2 py-1 rounded text-xs font-medium ${getPerformanceColor(row.performanceRating)}`}
          >
            {row.performanceRating || "0"}/5 Rating
          </span>
        </div>
      ),
    },
  ];

  const actions = (row) => [
    {
      label: "Edit Partner",
      icon: Edit,
      onClick: () => onEdit?.(row),
    },
    {
      label: "Delete Partner",
      icon: Trash2,
      isDanger: true,
      onClick: () => onDelete?.(row.id),
    },
  ];

  return (
    <TableShell>
      <thead className="bg-white border-b border-slate-200">
        <tr>
          <th colSpan={columns.length + 1} className="px-4 sm:px-6 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <h2 className="text-sm sm:text-base font-semibold text-slate-700">
                Partners
              </h2>

              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 items-stretch sm:items-center">
                <div className="w-full sm:w-72">
                  <SearchField
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Search by company, contact, or ID..."
                    showResults={false}
                  />
                </div>

                <FilterDropdown
                  value={filterType}
                  onChange={handleTypeFilterChange}
                  options={partnerTypes}
                  placeholder="All Types"
                  className="w-full sm:w-44"
                />

                <FilterDropdown
                  value={filterStatus}
                  onChange={handleStatusFilterChange}
                  options={statusOptions}
                  placeholder="All Status"
                  className="w-full sm:w-44"
                />

                <Button
                  onClick={exportPartners}
                  className="justify-center whitespace-nowrap"
                >
                  <Download size={16} /> Export
                </Button>
              </div>
            </div>
          </th>
        </tr>

        <tr className="bg-slate-50 border-t border-slate-200">
          {columns.map((column) => (
            <th
              key={column.accessor}
              className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-slate-500 uppercase tracking-wider text-[10px] sm:text-[11px] whitespace-nowrap"
            >
              {column.header}
            </th>
          ))}
          <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-slate-500 uppercase tracking-wider text-[10px] sm:text-[11px] text-right whitespace-nowrap">
            Actions
          </th>
        </tr>
      </thead>

      <TableBody
        columns={columns}
        data={paginatedPartners}
        actions={actions}
        wrapCells={true}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-slate-500">
          Showing {filteredPartners.length ? startIndex + 1 : 0}–
          {Math.min(endIndex, filteredPartners.length)} of{" "}
          {filteredPartners.length}
        </p>

        <Pagination
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          onPageChange={(page) =>
            setCurrentPage(Math.min(Math.max(1, page), totalPages))
          }
          containerClassName="py-0"
        />
      </div>
    </TableShell>
  );
}
