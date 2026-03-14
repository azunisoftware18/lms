import { useState, useMemo } from "react";
import {
  TableShell,
  TableHead,
  TableBody,
  TableLoader,
} from "./core";

import Pagination from "../common/Pagination";

import {
  Percent,
  Calendar,
  Tag,
  IndianRupee,
  Users,
  Edit,
  Trash2
} from "lucide-react";

export default function LoanProductTable({
  products = [],
  loading = false,
  onEdit,
  onDelete,
}) {

  const [search, setSearch] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  /* ---------------- Filter Logic ---------------- */

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {

      const matchSearch =
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase());

      const matchFilter =
        !filterValue || p.status === filterValue;

      return matchSearch && matchFilter;
    });
  }, [products, search, filterValue]);

  /* ---------------- Pagination ---------------- */

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* ---------------- Columns ---------------- */

  const columns = [
    {
      header: "Product Name",
      accessor: "name",
      render: (value, row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800">
            {value}
          </span>

          <span className="text-xs text-slate-400">
            {row.category}
          </span>
        </div>
      ),
    },

    {
      header: "Interest",
      accessor: "interest",
      render: (value) => (
        <div className="flex items-center gap-1 text-slate-700">
          <Percent size={14} />
          {value}
        </div>
      ),
    },

    {
      header: "Loan Amount",
      accessor: "amount",
      render: (value) => (
        <div className="flex items-center gap-1 text-slate-700">
          <IndianRupee size={14} />
          {value}
        </div>
      ),
    },

    {
      header: "Tenure",
      accessor: "tenure",
      render: (value) => (
        <div className="flex items-center gap-1 text-slate-700">
          <Calendar size={14} />
          {value}
        </div>
      ),
    },

    {
      header: "Processing Fee",
      accessor: "fee",
      render: (value) => (
        <div className="flex items-center gap-1 text-slate-700">
          <Tag size={14} />
          {value}
        </div>
      ),
    },

    {
      header: "Applicants",
      accessor: "applicants",
      render: (value) => (
        <div className="flex items-center gap-1 text-slate-700">
          <Users size={14} />
          {value}
        </div>
      ),
    },

    {
      header: "Status",
      accessor: "status",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border
          ${
            value === "active"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-600 border-red-200"
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  /* ---------------- Actions ---------------- */

  const actions = [
    {
      label: "Edit",
      icon: Edit,
      onClick: (row) => onEdit?.(row.original || row),
    },

    {
      label: "Delete",
      icon: Trash2,
      onClick: (row) => onDelete?.(row.id),
    },
  ];

  /* ---------------- Render ---------------- */

  return (
    <TableShell>

      <TableHead
        title="Loan Products"
        columns={columns}
        search={search}
        setSearch={setSearch}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        filterOptions={[
          { label: "All Status", value: "" },
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" },
        ]}
      />

      {loading ? (
        <TableLoader colSpan={columns.length + 1} />
      ) : (
        <>
          <TableBody
            columns={columns}
            data={paginatedProducts}
            actions={actions}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

    </TableShell>
  );
}