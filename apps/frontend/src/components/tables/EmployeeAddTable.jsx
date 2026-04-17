import React, { useMemo } from "react";
import { AlertCircle, Eye, Edit, Presentation } from "lucide-react";
import { TableBody, TableLoader, TableShell, TableHead } from "./core";
import Pagination from "../common/Pagination";

export default function EmployeeAddTable({
  // toolbar / page props
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  // handleExport removed (unused)
  // table data
  employees = [],
  presentations = [],
  loading = false,
  onPermission,
  onView,
  onEdit,

  // pagination
  currentPage = 1,
  rowsPerPage = 10,
  setCurrentPage,
  employeesLoading = false,
  employeesFetching = false,
}) {
  const search = (searchQuery || "").toString();
  const itemsPerPage = rowsPerPage;

  const tableRows = useMemo(() => {
    const sourceRows = Array.isArray(employees)
      ? employees
      : Array.isArray(employees?.data)
        ? employees.data
        : [];

    return sourceRows.map((row) => {
      const sanitizeNumber = (v) => {
        if (v == null || v === "") return 0;
        const s = String(v).replace(/[^0-9.-]+/g, "");
        const n = Number(s);
        return Number.isFinite(n) ? n : 0;
      };

      const basicSalary = sanitizeNumber(
        row?.basicSalary ?? row?.basic_salary ?? 0,
      );
      const conveyance = sanitizeNumber(
        row?.conveyance ?? row?.conveyanceAmount ?? 0,
      );
      const medicalAllowance = sanitizeNumber(
        row?.medicalAllowance ?? row?.medical_allowance ?? 0,
      );
      const otherAllowances = sanitizeNumber(
        row?.otherAllowances ?? row?.other_allowances ?? 0,
      );
      const pfDeduction = sanitizeNumber(
        row?.pfDeduction ?? row?.pf_deduction ?? 0,
      );
      const taxDeduction = sanitizeNumber(
        row?.taxDeduction ?? row?.tax_deduction ?? 0,
      );

      const computedSalary =
        basicSalary +
        conveyance +
        medicalAllowance +
        otherAllowances -
        pfDeduction -
        taxDeduction;

      // Normalize totalSalary: prefer server-provided value but format numbers consistently
      let totalSalary = "-";
      if (row?.totalSalary != null && row.totalSalary !== "") {
        const n = sanitizeNumber(row.totalSalary);
        totalSalary =
          n !== 0 || String(row.totalSalary).trim() === "0"
            ? `Rs ${n.toLocaleString()}`
            : String(row.totalSalary);
      } else if (computedSalary > 0) {
        totalSalary = `Rs ${computedSalary.toLocaleString()}`;
      }

      return {
        ...row,
        id: row?.id || row?.employeeId,
        employeeId: row?.employeeId || "-",
        fullName: row?.fullName || row?.user?.fullName || "-",
        email: row?.email || row?.Email || row?.user?.email || "-",
        department: row?.department || "-",
        designation: row?.designation || "-",
        roleTitle:
          row?.roleTitle ||
          row?.role_title ||
          row?.roleTitleName ||
          row?.role_title_name ||
          row?.employeeRole?.roleTitle ||
          row?.employeeRole?.role_title ||
          row?.user?.roleTitle ||
          row?.user?.role_title ||
          (Array.isArray(row?.roles) && row.roles[0]?.title) ||
          row?.role?.title ||
          row?.roleName ||
          row?.role ||
          "-",
        role:
          row?.role ||
          row?.roleName ||
          row?.role_name ||
          row?.user?.role ||
          row?.user?.roleName ||
          (Array.isArray(row?.roles) && row.roles[0]?.name) ||
          "-",
        roleName:
          row?.roleName ||
          row?.role_name ||
          row?.employeeRole?.roleName ||
          row?.employeeRole?.role_name ||
          row?.roleNameDisplay ||
          (Array.isArray(row?.roles) && row.roles[0]?.code) ||
          row?.role ||
          "-",
        phone:
          row?.phone || row?.contactNumber || row?.user?.contactNumber || "-",
        dateOfJoining: row?.dateOfJoining
          ? new Date(row.dateOfJoining).toLocaleDateString()
          : "-",
        totalSalary,
        status: row?.status || (row?.isActive ? "Active" : "Inactive"),
        leaveBalance: row?.leaveBalance ?? "0",
      };
    });
  }, [employees]);

  // debug logs removed

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tableRows;

    return tableRows.filter((row) => {
      const employeeId = String(row.employeeId || "").toLowerCase();
      const fullName = String(row.fullName || "").toLowerCase();
      const email = String(row.email || "").toLowerCase();
      const department = String(row.department || "").toLowerCase();
      const designation = String(row.designation || "").toLowerCase();
      const phone = String(row.phone || "").toLowerCase();

      return (
        employeeId.includes(q) ||
        fullName.includes(q) ||
        email.includes(q) ||
        department.includes(q) ||
        designation.includes(q) ||
        phone.includes(q)
      );
    });
  }, [tableRows, search]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedRows = useMemo(
    () =>
      filteredRows.slice(
        (safeCurrentPage - 1) * itemsPerPage,
        safeCurrentPage * itemsPerPage,
      ),
    [filteredRows, safeCurrentPage, itemsPerPage],
  );

  const columns = useMemo(
    () => [
      {
        header: "Employee Name",
        accessor: "fullName",
        render: (value, row) => {
          const pendingPresentations = presentations.filter(
            (presentation) =>
              presentation.employeeId === row.employeeId &&
              (presentation.status === "Pending" ||
                presentation.status === "In Progress"),
          ).length;

          return (
            <div className="font-medium text-gray-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                {value?.charAt(0) || "?"}
              </div>
              <div>
                <div>
                  <div>{value || "-"}</div>
                  <div className="text-xs text-blue-600">
                    #{row.employeeId || row.id || "-"}
                  </div>
                </div>

                {pendingPresentations > 0 && (
                  <div className="flex items-center gap-1 text-xs text-orange-600 mt-1">
                    <AlertCircle size={10} />
                    <span>{pendingPresentations} pending task(s)</span>
                  </div>
                )}
              </div>
            </div>
          );
        },
      },
      {
        header: "Department / Designation",
        accessor: "department",
        render: (value, row) => (
          <div className="flex flex-col">
            {/* <div className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium inline-block">
              {row.department || value || "-"}
            </div> */}
            <div className="text-sm text-gray-600 mt-1 space-y-0.5">
              {row.designation && row.designation !== "-" && (
                <div className="text-sm text-gray-800">{row.designation}</div>
              )}
              {row.roleTitle && row.roleTitle !== "-" && (
                <div className="text-xs text-slate-500">{row.roleTitle}</div>
              )}
              {row.roleName && row.roleName !== "-" && (
                <div className="text-xs text-indigo-600 font-medium">
                  {String(row.roleName)
                    .replace(/_/g, " ")
                    .toLowerCase()
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </div>
              )}
            </div>
          </div>
        ),
      },
      {
        header: "Contact",
        accessor: "email",
        render: (value, row) => (
          <div>
            <div className="font-medium text-gray-800">
              {row.phone || row.contactNumber || row.user?.contactNumber || "-"}
            </div>
            <div className="text-xs text-gray-500">
              {row.email || value || "-"}
            </div>
            <div className="text-xs text-gray-400">
              Joined: {row.dateOfJoining}
            </div>
          </div>
        ),
      },
      {
        header: "Salary",
        accessor: "totalSalary",
        render: (value, row) => {
          let v = row?.totalSalary ?? value;
          if (v == null || v === "")
            return <span className="text-green-600 font-bold text-sm">-</span>;

          // If already formatted like 'Rs 1,000', use as-is
          if (typeof v === "string" && v.trim().startsWith("Rs")) {
            return (
              <span className="text-green-600 font-bold text-sm">{v}</span>
            );
          }

          // Try numeric formatting for numbers or numeric strings (including 0)
          const n = Number(String(v).replace(/[^0-9.-]+/g, ""));
          if (Number.isFinite(n)) {
            return (
              <span className="text-green-600 font-bold text-sm">{`Rs ${n.toLocaleString()}`}</span>
            );
          }

          // Fallback to raw value
          return (
            <span className="text-green-600 font-bold text-sm">
              {String(v)}
            </span>
          );
        },
      },
      {
        header: "Status",
        accessor: "status",
        render: (value, row) => (
          <div className="flex flex-col gap-1">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium border
                ${
                  value === "Active"
                    ? "bg-green-50 text-green-700 border-green-100"
                    : value === "Inactive"
                      ? "bg-red-50 text-red-700 border-red-100"
                      : value === "On Leave"
                        ? "bg-yellow-50 text-yellow-700 border-yellow-100"
                        : "bg-gray-50 text-gray-700 border-gray-100"
                }`}
            >
              {value || "-"}
            </span>
            <span className="text-xs text-gray-500">
              Leaves: {row.leaveBalance} days
            </span>
          </div>
        ),
      },
    ],
    [presentations],
  );

  const actions = [
    {
      label: "Permissions",
      icon: Presentation,
      onClick: (row) => onPermission?.(row),
    },
    {
      label: "View Employee",
      icon: Eye,
      onClick: (row) => {
        const id = row?.id || row?.employeeId;
        return onView?.(id ?? row);
      },
    },
    {
      label: "Edit Employee",
      icon: Edit,
      onClick: (row) => {
        const id = row?.id || row?.employeeId;
        return onEdit?.(id ?? row);
      },
    },
  ];

  const statusOptions = [
    { value: "All", label: "All" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
    { value: "On Leave", label: "On Leave" },
    { value: "Probation", label: "Probation" },
  ];

  // no headerAction

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in duration-300">
      <TableShell>
        <TableHead
          columns={columns}
          title={`Employees (${tableRows.length})`}
          search={searchQuery}
          setSearch={setSearchQuery}
          filterValue={filterStatus}
          setFilterValue={setFilterStatus}
          filterOptions={statusOptions}
        />

        {loading ? (
          <TableLoader colSpan={columns.length + 1} />
        ) : (
          <TableBody columns={columns} data={paginatedRows} actions={actions} />
        )}
      </TableShell>

      <div className="border-t border-gray-100 px-4 sm:px-6 py-3 bg-gray-50/70">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        {(employeesLoading || employeesFetching) && (
          <p className="text-xs text-slate-500 text-center mt-1">
            Loading employees...
          </p>
        )}
      </div>
    </div>
  );
}
