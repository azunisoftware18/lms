import React, { useState, useMemo } from "react";
import LoanAccountTable from "../../../components/tables/LoanAccountTable";
import EMIManagementTableView from "../../../components/tables/EMIManagementTable";
import { useAllEmis } from "../../../hooks/useEmi";
import { useLoanApplications } from "../../../hooks/useLoanApplication";
import StatusCard from "../../../components/common/StatusCard";
import {
  Wallet,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Bell,
} from "lucide-react";

export default function EMIManagementPage() {
  const [_filterStatus, setFilterStatus] = useState("");

  // Fetch EMIs from API / store
  const {
    emis: rawEmis = [],
    meta: _meta,
    loading,
    isFetching,
    _refetch,
  } = useAllEmis({ page: 1, limit: 100 });

  // Map backend EMI shape to table-friendly shape
  const data = useMemo(() => {
    if (!Array.isArray(rawEmis)) return [];
    return rawEmis
      .map((e, idx) => {
        const due = e.dueDate || e.due_date || e.due || null;
        const emiNo = e.emiNo ?? e.emi_no ?? e.emiNo;
        const emiNumber = `EMI${String(emiNo ?? idx + 1).padStart(3, "0")}`;
        const principal = e.principalAmount ?? e.openingBalance ?? 0;
        const interest = e.interestAmount ?? 0;
        const emiAmount = e.emiAmount ?? e.emi_amount ?? 0;
        const status = (e.status || "").toString().toLowerCase();
        // Map loan status when returned on EMI payload (backend may include loan or loanApplication)
        const loanStatus = (
          e.loanStatus || e.loan?.status || e.loanApplication?.status || ""
        )
          .toString()
          .toLowerCase();
        const isToday = due
          ? new Date(due).toISOString().split("T")[0] ===
            new Date().toISOString().split("T")[0]
          : false;
        return {
          ...e,
          id: e.loanNumber || `${emiNumber}-${idx}`,
          emiNumber,
          dueDate: due,
          principal,
          interest,
          emiAmount,
          status,
          loanStatus,
          isToday,
        };
      })
      .filter(Boolean);
  }, [rawEmis]);

  // Fetch loan applications so we can map loan status into each EMI (avoid relying on EMI API)
  const { data: loanApiData } = useLoanApplications({ page: 1, limit: 500 });

  const rawLoans = Array.isArray(loanApiData)
    ? loanApiData
    : Array.isArray(loanApiData?.data)
    ? loanApiData.data
    : Array.isArray(loanApiData?.data?.data)
    ? loanApiData.data.data
    : [];

  // build loan lookup maps by id and loanNumber
  const loanMapById = {};
  const loanMapByNumber = {};
  rawLoans.forEach((L) => {
    const id = L.loanNumber || L.id;
    const number = L.loanNumber || L.id;
    const statusKey = (L.status || "").toString().toLowerCase();
    if (id) loanMapById[id] = { ...L, status: statusKey };
    if (number) loanMapByNumber[number] = { ...L, status: statusKey };
  });

  // If EMI item does not contain loanStatus, try to derive it from the loan maps
  const dataWithLoanStatus = data.map((d) => {
    if (d.loanStatus) return d;
    const fromId = d.loanApplicationId && loanMapById[d.loanApplicationId];
    const fromNumber = d.loanNumber && loanMapByNumber[d.loanNumber];
    const fromLoan = d.loan && (loanMapById[d.loan?.id] || loanMapByNumber[d.loan?.loanNumber]);
    const resolved = fromId || fromNumber || fromLoan;
    return {
      ...d,
      loanStatus: resolved ? resolved.status : d.loanStatus || "",
    };
  });

  // Only include EMIs that belong to loans with these statuses
  const allowedLoanStatuses = [
    "active",
    "closed",
    "delinquent",
    "written_off",
    "defaulted",
  ];

  const filteredByLoanStatus = dataWithLoanStatus.filter((d) =>
    d.loanStatus ? allowedLoanStatuses.includes(d.loanStatus) : false
  );

  // If there are no EMIs to show, fall back to showing loan applications (so the user can click View EMIs)
  const formatStatusDisplay = (s) => {
    if (!s) return "";
    const key = String(s).toLowerCase();
    return key
      .replace(/_/g, " ")
      .split(" ")
      .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ""))
      .join(" ");
  };

  // Show only loan applications whose status is in allowedLoanStatuses
  const loanRows = rawLoans
    .filter((L) => {
      const s = (L.status || L.applicationStatus || L.loanStatus || "").toString().toLowerCase();
      return allowedLoanStatuses.includes(s);
    })
    .map((L) => {
      const customerName = L.customer
        ? `${L.customer.firstName || ""} ${L.customer.lastName || ""}`.trim()
        : L.customerName || "";
      return {
        id: L.id || L.loanNumber,
        loanNumber: L.loanNumber || L.id,
        customerName,
        branch: L.branch?.name || L.branchName || "",
        loanAmount: Math.round(L.approvedAmount || L.requestedAmount || 0),
        outstandingBalance: Math.round(L.outstandingAmount || L.outstandingBalance || 0),
        status: formatStatusDisplay(L.status || L.applicationStatus || L.loanStatus || ""),
        loanApplicationId: L.id,
        loan: L,
      };
    });

  const displayData = (filteredByLoanStatus && filteredByLoanStatus.length > 0)
    ? filteredByLoanStatus
    : loanRows;

  // Debug logs to help diagnose empty table
  // eslint-disable-next-line no-console
  console.log("EMI Management: rawEmis:", rawEmis.length, "rawLoans:", rawLoans.length, "filteredByLoanStatus:", filteredByLoanStatus.length, "displayData:", displayData.length);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  // Calculate totals from fetched data (restricted to allowed loan statuses)
  const totals = useMemo(
    () => ({
      totalPrincipal: filteredByLoanStatus.reduce(
        (sum, item) => sum + (item?.principal || 0),
        0,
      ),
      totalInterest: filteredByLoanStatus.reduce((sum, item) => sum + (item?.interest || 0), 0),
      totalEMI: filteredByLoanStatus.reduce((sum, item) => sum + (item?.emiAmount || 0), 0),
      paidCount: filteredByLoanStatus.filter((item) => item?.status === "paid").length,
      pendingCount: filteredByLoanStatus.filter((item) => item?.status === "pending").length,
      overdueCount: filteredByLoanStatus.filter((item) => item?.status === "overdue").length,
      paidAmount: filteredByLoanStatus
        .filter((item) => item?.status === "paid")
        .reduce((s, i) => s + (i?.emiAmount || 0), 0),
      pendingAmount: filteredByLoanStatus
        .filter((item) => item?.status === "pending")
        .reduce((s, i) => s + (i?.emiAmount || 0), 0),
      overdueAmount: filteredByLoanStatus
        .filter((item) => item?.status === "overdue")
        .reduce((s, i) => s + (i?.emiAmount || 0), 0),
    }),
    [filteredByLoanStatus],
  );

  // Handlers
  const handleView = (row) => {
    alert(
      `📋 EMI Details:\nEMI: ${row.emiNumber}\nDue Date: ${formatDate(row.dueDate)}\nAmount: ${formatCurrency(row.emiAmount)}\nStatus: ${row.status}`,
    );
  };

  const handlePayEMI = (row) => {
    if (
      window.confirm(
        `💰 Pay ${formatCurrency(row.emiAmount)} for ${formatDate(row.dueDate)}?`,
      )
    ) {
      alert("Payment processing...");
    }
  };

  const handleEdit = (row) => {
    alert(`✏️ Editing EMI: ${row.emiNumber}`);
  };

  const handleDownload = (row) => {
    alert(`📥 Downloading receipt for EMI: ${row.emiNumber}`);
  };

  const handleViewStatement = (row) => {
    alert(`📄 Viewing statement for EMI: ${row.emiNumber}`);
  };

  const handleDownloadReceipt = (row) => {
    alert(`📑 Downloading summary for EMI: ${row.emiNumber}`);
  };

  const handleCardClick = (status) => {
    setFilterStatus(status);
  };

  if (loading || isFetching) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            EMI Management
          </h1>
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading EMI data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">EMI Management</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage and track all your EMI payments
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatusCard
            title="TOTAL EMI"
            value={formatCurrency(totals.totalEMI)}
            subtext={`${filteredByLoanStatus.length} EMIs`}
            icon={Wallet}
            variant="purple"
          />
          <div
            onClick={() => handleCardClick("paid")}
            className="cursor-pointer"
          >
            <StatusCard
              title="PAID"
              value={totals.paidCount.toString()}
              subtext={formatCurrency(totals.paidAmount)}
              icon={CheckCircle}
              variant="green"
            />
          </div>
          <div
            onClick={() => handleCardClick("pending")}
            className="cursor-pointer"
          >
            <StatusCard
              title="PENDING"
              value={totals.pendingCount.toString()}
              subtext={formatCurrency(totals.pendingAmount)}
              icon={Clock}
              variant="orange"
            />
          </div>
          <div
            onClick={() => handleCardClick("overdue")}
            className="cursor-pointer"
          >
            <StatusCard
              title="OVERDUE"
              value={totals.overdueCount.toString()}
              subtext={formatCurrency(totals.overdueAmount)}
              icon={AlertCircle}
              variant="red"
            />
          </div>
        </div>

        <LoanAccountTable
          loans={displayData}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDownload={handleDownload}
          onPayEMI={handlePayEMI}
          onViewStatement={handleViewStatement}
          onDownloadReceipt={handleDownloadReceipt}
        />
      </div>
    </div>
  );
}
