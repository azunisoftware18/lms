import React, { useState, useMemo } from "react";
import SelectField from "../../../components/ui/SelectField";
import FilterDropdown from "../../../components/ui/FilterDropdown";
import Pagination from "../../../components/common/Pagination";
import ConfirmationDialog from "../../../components/common/ConfirmationDialog";
import QuickActionCard from "../../../components/common/QuickAction";
import {
  TableShell,
  TableHead,
  TableBody,
} from "../../../components/tables/core";
import { Icons } from "../../../components/common/Icon";

import { EMI_APPROVED_LOANS, EMI_VOUCHERS } from "../../../lib/LOSDummyData";
import { colorVariables } from "../../../lib/index";

export default function EMIManagementPage() {
  const [activeTab, setActiveTab] = useState("approved");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const itemsPerPage = 5;

  // ---------- DUMMY DATA ----------------
  const loanList = EMI_APPROVED_LOANS;
  const emiVouchers = EMI_VOUCHERS;

  // ---------- APPROVED FILTER ----------
  const approvedApplications = useMemo(() => {
    return loanList.filter((loan) =>
      (loan.applicationStatus || loan.status || loan.loanStatus || "")
        .toLowerCase()
        .includes("approved"),
    );
  }, [loanList]);

  // ---------- TAB DATA ----------
  const filteredByTab = useMemo(() => {
    if (activeTab === "approved") return approvedApplications;
    return emiVouchers;
  }, [activeTab, approvedApplications, emiVouchers]);

  // ---------- SEARCH + FILTER ----------
  const filteredData = useMemo(() => {
    return filteredByTab.filter((item) => {
      const name = item.applicantName || item.customerName || "";
      const loanNumber = item.loanNumber || item.voucherNo || "";
      const status =
        item.applicationStatus || item.status || item.loanStatus || "";

      const matchesSearch =
        searchTerm === "" ||
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loanNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterStatus === "" ||
        status.toUpperCase() === filterStatus.toUpperCase();

      return matchesSearch && matchesFilter;
    });
  }, [filteredByTab, searchTerm, filterStatus]);

  // ---------- PAGINATION ----------
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // ---------- HANDLE ACTION ----------
  const handleActionClick = (action, item) => {
    setConfirmAction({ type: action, item });
    setIsConfirmOpen(true);
  };

  const handleConfirmAction = () => {
    if (confirmAction?.type === "generate") {
      console.log("Generating EMI for:", confirmAction.item);
    } else if (confirmAction?.type === "download") {
      console.log("Downloading EMI for:", confirmAction.item);
    } else if (confirmAction?.type === "print") {
      console.log("Printing EMI for:", confirmAction.item);
    }
    setIsConfirmOpen(false);
    setConfirmAction(null);
  };

  // ---------- FORMAT HELPERS ----------
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount || 0);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // ---------- TABLE COLUMNS ----------
  const approvedColumns = [
    {
      accessor: "applicantName",
      header: "Customer",
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className={`p-2 ${colorVariables.LIGHT_BG} rounded-lg`}>
            <Icons.User className={`w-4 h-4 ${colorVariables.PRIMARY_COLOR}`} />
          </div>
          <div>
            <div className="font-medium text-gray-900">{val || "N/A"}</div>
            <div className="text-xs text-gray-500">ID: {row.id || "N/A"}</div>
          </div>
        </div>
      ),
    },
    {
      accessor: "loanNumber",
      header: "Loan Number",
      render: (val) => (
        <div className="flex items-center gap-2">
          <Icons.FileText className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{val || "N/A"}</span>
        </div>
      ),
    },
    {
      accessor: "tenureMonths",
      header: "Tenure",
      render: (val) => (
        <div className="flex items-center gap-2">
          <Icons.Clock className="w-4 h-4 text-gray-400" />
          <span>{val || 0} months</span>
        </div>
      ),
    },
    {
      accessor: "approvedAmount",
      header: "Loan Amount",
      render: (val) => (
        <span className="font-semibold text-gray-900">
          {formatCurrency(val)}
        </span>
      ),
    },
    {
      accessor: "interestRate",
      header: "Interest",
      render: (val) => <span className="font-medium">{val}%</span>,
    },
    {
      accessor: "applicationStatus",
      header: "Status",
      render: (val) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
          {val || "APPROVED"}
        </span>
      ),
    },
  ];

  const voucherColumns = [
    {
      accessor: "customerName",
      header: "Customer",
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className={`p-2 ${colorVariables.LIGHT_BG} rounded-lg`}>
            <Icons.User className={`w-4 h-4 ${colorVariables.PRIMARY_COLOR}`} />
          </div>
          <div>
            <div className="font-medium text-gray-900">{val || "N/A"}</div>
            <div className="text-xs text-gray-500">
              {row.voucherNo || "N/A"}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessor: "loanNumber",
      header: "Loan Number",
      render: (val) => (
        <div className="flex items-center gap-2">
          <Icons.FileText className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{val || "N/A"}</span>
        </div>
      ),
    },
    {
      accessor: "tenure",
      header: "Tenure",
      render: (val) => `${val || 0} months`,
    },
    {
      accessor: "amount",
      header: "Loan Amount",
      render: (val) => (
        <span className="font-semibold text-gray-900">
          {formatCurrency(val)}
        </span>
      ),
    },
    {
      accessor: "paidAmount",
      header: "Paid Amount",
      render: (val) => (
        <span className="font-semibold text-green-600">
          {formatCurrency(val)}
        </span>
      ),
    },
    {
      accessor: "startDate",
      header: "Start Date",
      render: (val) => (
        <div className="flex items-center gap-2">
          <Icons.Calendar className="w-4 h-4 text-gray-400" />
          <span>{formatDate(val)}</span>
        </div>
      ),
    },
    {
      accessor: "status",
      header: "Status",
      render: (val) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            (val || "").toUpperCase() === "ACTIVE"
              ? colorVariables.INDEPENDENT_COLOR + " border border-green-300"
              : "bg-yellow-100 text-yellow-800 border border-yellow-200"
          }`}
        >
          {val || "PENDING"}
        </span>
      ),
    },
  ];

  const activeColumns =
    activeTab === "approved" ? approvedColumns : voucherColumns;

  const approvedActions = [
    {
      label: "Generate EMI",
      icon: Icons.IndianRupee,
      onClick: (row) => handleActionClick("generate", row),
    },
  ];

  const voucherActions = [
    {
      label: "Download",
      icon: Icons.Download,
      onClick: (row) => handleActionClick("download", row),
    },
    {
      label: "Print",
      icon: Icons.Printer,
      onClick: (row) => handleActionClick("print", row),
    },
  ];

  const activeActions =
    activeTab === "approved" ? approvedActions : voucherActions;

  const filterOptions =
    activeTab === "all"
      ? [
          { value: "", label: "All Statuses" },
          { value: "ACTIVE", label: "Active" },
          { value: "PENDING", label: "Pending" },
        ]
      : [];

  // ---------- UI ----------
  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">EMI Management</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage loan EMIs and track approved applications
        </p>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <QuickActionCard
          title="Generate EMI"
          subtitle={`${approvedApplications.length} approved loans pending`}
          icon={Icons.Calculator}
          variant="blue"
          onClick={() => setActiveTab("approved")}
        />
        <QuickActionCard
          title="Download EMI Report"
          subtitle="Export all EMI voucher data"
          icon={Icons.Download}
          variant="indigo"
          onClick={() => setActiveTab("all")}
        />
      </div>

      {/* TAB SELECTOR */}
      <div className="flex items-center gap-4">
        <SelectField
          label="View"
          value={activeTab}
          onChange={(e) => {
            setActiveTab(e.target.value);
            setFilterStatus("");
            setCurrentPage(1);
          }}
          options={[
            {
              value: "approved",
              label: `Approved Applications (${approvedApplications.length})`,
            },
            { value: "all", label: `EMI Vouchers (${emiVouchers.length})` },
          ]}
          className="w-72"
        />
        {activeTab === "all" && (
          <FilterDropdown
            value={filterStatus}
            onChange={(v) => { setFilterStatus(v); setCurrentPage(1); }}
            options={filterOptions}
            placeholder="Filter by Status"
          />
        )}
      </div>

      {/* TABLE */}
      <TableShell>
        <TableHead
          title={
            activeTab === "approved"
              ? `Approved Applications (${filteredData.length})`
              : `EMI Vouchers (${filteredData.length})`
          }
          columns={activeColumns}
          search={searchTerm}
          setSearch={(v) => { setSearchTerm(v); setCurrentPage(1); }}
          filterValue={filterStatus}
          setFilterValue={(v) => { setFilterStatus(v); setCurrentPage(1); }}
          filterOptions={filterOptions}
        />
        <TableBody
          columns={activeColumns}
          data={paginatedData}
          actions={activeActions}
        />
      </TableShell>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* CONFIRMATION DIALOG */}
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        title={`Confirm ${
          confirmAction?.type === "download"
            ? "Download"
            : confirmAction?.type === "print"
              ? "Print"
              : "Generate EMI"
        }`}
        message={`Are you sure you want to ${confirmAction?.type} EMI for ${
          confirmAction?.item?.applicantName ||
          confirmAction?.item?.customerName ||
          "this loan"
        }?`}
        onConfirm={handleConfirmAction}
        onCancel={() => {
          setIsConfirmOpen(false);
          setConfirmAction(null);
        }}
      />
    </div>
  );
}
