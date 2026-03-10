import { useState } from "react";
import Pagination from "../common/Pagination";
import TableBody from "./core/TableBody";
import TableHead from "./core/TableHead";
import TableLoader from "./core/TableLoader";
import TableShell from "./core/TableShell";

export default function UserTable({ users = [], loading = false }) {

  const [currentPage, setCurrentPage] = useState(1);

  // ✅ Search state
  const [search, setSearch] = useState("");

  // ✅ Filter state
  const [status, setStatus] = useState("all");

  const rowsPerPage = 5;

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    {
      header: "Role",
      accessor: "role",
      render: (value) => (
        <span className="px-2 py-1 text-xs rounded-lg bg-blue-100 text-blue-700">
          {value}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (value) => (
        <span
          className={`px-2 py-1 text-xs rounded-lg ${
            value === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  const actions = [
    { label: "View", onClick: (row) => console.log("View user:", row) },
    { label: "Edit", onClick: (row) => console.log("Edit user:", row) },
    { label: "Delete", onClick: (row) => console.log("Delete user:", row) },
  ];

  // ✅ Filter options
  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];

  /* -------------------- SEARCH + FILTER LOGIC -------------------- */

  const filteredUsers = users.filter((user) => {

    const matchSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      status === "all" || user.status === status;

    return matchSearch && matchStatus;
  });

  /* -------------------- PAGINATION -------------------- */

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;

  const paginatedUsers = filteredUsers.slice(start, end);

  return (
    <TableShell>

      <TableHead
      title="USERS"
        columns={columns}
        search={search}
        setSearch={setSearch}
        filterValue={status}
        setFilterValue={setStatus}
        filterOptions={filterOptions}
        placeholder="Search users..."
      />

      {loading ? (
        <TableLoader colSpan={columns.length + 1} />
      ) : (
        <TableBody
          columns={columns}
          data={paginatedUsers}
          actions={actions}
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

    </TableShell>
  );
}