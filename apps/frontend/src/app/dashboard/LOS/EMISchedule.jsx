import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import ConfirmationDialog from "../../../components/common/ConfirmationDialog";
import QuickActionCard from "../../../components/common/QuickAction";
import EMIScheduleTableView from "../../../components/tables/EMIScheduleTable";
import * as Icons from "lucide-react";

import { useLoanApplications } from "../../../hooks/useLoanApplication";
import {
  useAllEmis,
  useGenerateSchedule,
  usePayEmi,
} from "../../../hooks/useEmi";
import GenerateEmiModal from "../../../components/modals/GenerateEmiModal";
import { colorVariables } from "../../../lib/index";

export default function EMISchedulePage() {
  const [activeTab, setActiveTab] = useState("approved");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const itemsPerPage = 5;

  // ---------- DATA (from API) ----------------
  const loanQuery = useLoanApplications({ status: "APPROVED", limit: 1000 });
  const {
    emis: emiVouchers,
    meta: emisMeta,
    refetch: emisRefetch,
  } = useAllEmis({
    page: currentPage,
    limit: itemsPerPage,
    q: searchTerm,
    status: filterStatus,
  });

  // Prefer normalized data from react-query but fall back to Redux store
  const loanAppsFromStore = useSelector(
    (s) => s.loanApplication?.loanApplications || [],
  );

  const loanList = useMemo(() => {
    const qData = loanQuery?.data?.data || loanQuery?.data;
    if (Array.isArray(qData) && qData.length) return qData;
    if (Array.isArray(loanAppsFromStore) && loanAppsFromStore.length)
      return loanAppsFromStore;
    return [];
  }, [loanQuery?.data, loanAppsFromStore]);

  // ---------- APPROVED FILTER ----------
  const approvedApplications = useMemo(() => {
    return (loanList || []).filter((loan) => {
      const candidates = [
        loan.applicationStatus,
        loan.status,
        loan.loanStatus,
        loan.loanApplication?.status,
        loan.application?.status,
      ]
        .filter(Boolean)
        .map((s) => String(s).toLowerCase());

      return candidates.some((s) => s.includes("approved"));
    });
  }, [loanList]);

  // ---------- TAB DATA ----------
  const filteredByTab = useMemo(() => {
    if (activeTab === "approved") return approvedApplications;
    return emiVouchers || [];
  }, [activeTab, approvedApplications, emiVouchers]);

  // ---------- SEARCH + FILTER (client-side only for approved tab) ----------
  const filteredData = useMemo(() => {
    if (activeTab === "all") {
      if (!searchTerm && !filterStatus) return filteredByTab;
      return (filteredByTab || []).filter((item) => {
        const name =
          item.loanApplication?.customer?.firstName ||
          item.customerName ||
          item.applicantName ||
          "";
        const loanNumber =
          item.loanApplication?.loanNumber ||
          item.loanNumber ||
          item.voucherNo ||
          "";
        const status = item.status || item.voucherStatus || "";

        const matchesSearch =
          searchTerm === "" ||
          name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          loanNumber.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
          filterStatus === "" ||
          status.toUpperCase() === filterStatus.toUpperCase();

        return matchesSearch && matchesFilter;
      });
    }

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
        activeTab !== "all" ||
        filterStatus === "" ||
        status.toUpperCase() === filterStatus.toUpperCase();

      return matchesSearch && matchesFilter;
    });
  }, [filteredByTab, searchTerm, filterStatus, activeTab]);

  // ---------- PAGINATION ----------
  const totalPages = useMemo(() => {
    if (activeTab === "all" && emisMeta && emisMeta.total != null) {
      return Math.max(1, Math.ceil((emisMeta.total || 0) / itemsPerPage));
    }
    return Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  }, [activeTab, filteredData.length, emisMeta]);

  const paginatedData = useMemo(() => {
    if (activeTab === "all" && emiVouchers) return emiVouchers;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [activeTab, emiVouchers, filteredData, currentPage]);

  // ---------- HANDLE ACTION ----------
  const generateSchedule = useGenerateSchedule();
  const payEmi = usePayEmi();

  const handleActionClick = (action, item) => {
    if (action === "generate") {
      setSelectedLoan(item);
      setIsGenerateOpen(true);
      return;
    }
    setConfirmAction({ type: action, item });
    setIsConfirmOpen(true);
  };

  const handleConfirmAction = () => {
    const item = confirmAction?.item;
    if (confirmAction?.type === "generate") {
      if (item?.id) {
        generateSchedule.mutate(item.id, {
          onSuccess: () => {
            if (loanQuery?.refetch) loanQuery.refetch();
            if (emisRefetch) emisRefetch();
          },
        });
      }
    } else if (confirmAction?.type === "download") {
      // TODO
    } else if (confirmAction?.type === "print") {
      // TODO
    } else if (confirmAction?.type === "pay") {
      if (item?.id) {
        const amount = Number(item.emiAmount || item.totalPayable || 0);
        if (amount > 0) {
          payEmi.mutate(
            { emiId: item.id, amountPaid: amount, paymentMode: "CASH" },
            {
              onSuccess: () => {
                if (loanQuery?.refetch) loanQuery.refetch();
                if (emisRefetch) emisRefetch();
              },
            },
          );
        }
      }
    }
    setIsConfirmOpen(false);
    setConfirmAction(null);
  };

  // ---------- GENERATE MODAL ----------
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  const handleGenerate = (loanId) =>
    new Promise((resolve, reject) => {
      generateSchedule.mutate(loanId, {
        onSuccess: (data) => {
          if (loanQuery?.refetch) loanQuery.refetch();
          if (emisRefetch) emisRefetch();
          resolve(data);
        },
        onError: (err) => reject(err),
      });
    });

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
      render: (_val, row) => {
        const first =
          row.customer?.firstName ||
          row.applicant?.firstName ||
          row.firstName ||
          row.customerName ||
          row.applicantName;
        const last =
          row.customer?.lastName ||
          row.applicant?.lastName ||
          row.lastName ||
          "";
        const name = [first, last].filter(Boolean).join(" ") || "N/A";
        return (
          <div className="flex items-center gap-3">
            <div className={`p-2 ${colorVariables.LIGHT_BG} rounded-lg`}>
              <Icons.User
                className={`w-4 h-4 ${colorVariables.PRIMARY_COLOR}`}
              />
            </div>
            <div>
              <div className="font-medium text-gray-900">{name}</div>
              <div className="text-xs text-gray-500">
                {row.loanNumber || row.loanApplication?.loanNumber || "N/A"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessor: "tenureMonths",
      header: "Tenure",
      render: (_val, row) => (
        <div className="flex items-center gap-2">
          <Icons.Clock className="w-4 h-4 text-gray-400" />
          <span>
            {row.tenureMonths ||
              row.tenure ||
              row.loanApplication?.tenureMonths ||
              0}{" "}
            months
          </span>
        </div>
      ),
    },
    {
      accessor: "approvedAmount",
      header: "Loan Amount",
      render: (_val, row) => (
        <span className="font-semibold text-gray-900">
          {formatCurrency(
            row.approvedAmount ||
              row.approvedLoanAmount ||
              row.requestedAmount ||
              row.loanApplication?.approvedAmount ||
              0,
          )}
        </span>
      ),
    },
    {
      accessor: "interestRate",
      header: "Interest",
      render: (_val, row) => (
        <span className="font-medium">
          {row.interestRate || row.loanApplication?.interestRate || 0}%
        </span>
      ),
    },
    {
      accessor: "applicationStatus",
      header: "Status",
      render: (_val, row) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
          {(
            row.applicationStatus ||
            row.status ||
            row.loanApplication?.status ||
            "APPROVED"
          ).toString()}
        </span>
      ),
    },
  ];

  const voucherColumns = [
    {
      accessor: "customerName",
      header: "Customer",
      render: (_val, row) => {
        const first =
          row.loanApplication?.customer?.firstName ||
          row.customerName ||
          row.customer?.firstName ||
          row.applicantName;
        const last =
          row.loanApplication?.customer?.lastName ||
          row.customer?.lastName ||
          "";
        const name = [first, last].filter(Boolean).join(" ") || "N/A";
        return (
          <div className="flex items-center gap-3">
            <div className={`p-2 ${colorVariables.LIGHT_BG} rounded-lg`}>
              <Icons.User
                className={`w-4 h-4 ${colorVariables.PRIMARY_COLOR}`}
              />
            </div>
            <div>
              <div className="font-medium text-gray-900">{name}</div>
              <div className="text-xs text-gray-500">
                {row.voucherNo || row.loanApplication?.voucherNo || "N/A"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessor: "loanNumber",
      header: "Loan Number",
      render: (_val, row) => (
        <div className="flex items-center gap-2">
          <Icons.FileText className="w-4 h-4 text-gray-400" />
          <span className="font-medium">
            {row.loanNumber || row.loanApplication?.loanNumber || "N/A"}
          </span>
        </div>
      ),
    },
    {
      accessor: "tenure",
      header: "Tenure",
      render: (_val, row) =>
        `${row.tenure || row.loanApplication?.tenureMonths || row.loanApplication?.tenure || 0} months`,
    },
    {
      accessor: "amount",
      header: "Loan Amount",
      render: (_val, row) => (
        <span className="font-semibold text-gray-900">
          {formatCurrency(
            row.amount ||
              row.loanApplication?.approvedAmount ||
              row.loanApplication?.requestedAmount ||
              row.approvedAmount ||
              0,
          )}
        </span>
      ),
    },
    {
      accessor: "paidAmount",
      header: "Paid Amount",
      render: (_val, row) => (
        <span className="font-semibold text-green-600">
          {formatCurrency(row.paidAmount || row.emiPaymentAmount || 0)}
        </span>
      ),
    },
    {
      accessor: "startDate",
      header: "Start Date",
      render: (_val, row) => (
        <div className="flex items-center gap-2">
          <Icons.Calendar className="w-4 h-4 text-gray-400" />
          <span>
            {formatDate(
              row.startDate || row.dueDate || row.loanApplication?.emiStartDate,
            )}
          </span>
        </div>
      ),
    },
    {
      accessor: "status",
      header: "Status",
      render: (_val, row) => {
        const s = (
          row.status ||
          row.loanApplication?.status ||
          row.voucherStatus ||
          "PENDING"
        ).toString();
        const isActive =
          s.toUpperCase() === "ACTIVE" || s.toUpperCase() === "PAID";
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
              isActive
                ? colorVariables.INDEPENDENT_COLOR + " border border-green-300"
                : "bg-yellow-100 text-yellow-800 border border-yellow-200"
            }`}
          >
            {s}
          </span>
        );
      },
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
      label: "Pay",
      icon: Icons.CreditCard,
      onClick: (row) => handleActionClick("pay", row),
    },
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

  const viewOptions = [
    {
      value: "approved",
      label: `Approved Applications (${approvedApplications.length})`,
    },
    {
      value: "all",
      label: `EMI Vouchers (${emisMeta?.total ?? (emiVouchers || []).length})`,
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">EMI Schedule</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage loan EMIs and track approved applications
        </p>
      </div>

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

      <GenerateEmiModal
        isOpen={isGenerateOpen}
        onClose={() => {
          setIsGenerateOpen(false);
          setSelectedLoan(null);
        }}
        loan={selectedLoan}
        onGenerate={handleGenerate}
      />

      <EMIScheduleTableView
        title={
          activeTab === "approved"
            ? `Approved Applications (${filteredData.length})`
            : `EMI Vouchers (${filteredData.length})`
        }
        columns={activeColumns}
        data={paginatedData}
        actions={activeActions}
        search={searchTerm}
        onSearchChange={(v) => {
          setSearchTerm(v);
          setCurrentPage(1);
        }}
        filterValue={activeTab}
        onFilterChange={(v) => {
          setActiveTab(v);
          setFilterStatus("");
          setCurrentPage(1);
        }}
        filterOptions={viewOptions}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

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
