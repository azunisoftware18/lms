import React, { useState, useMemo, useEffect } from "react";
import { KYC_CIBIL_DATA, KYC_APPLICATIONS } from "../../../lib/LOSDummyData";
import { colorVariables } from "../../../lib/index";
import QuickActionCard from "../../../components/common/QuickAction";
import ConfirmationDialog from "../../../components/common/ConfirmationDialog";
import Pagination from "../../../components/common/Pagination";
import Button from "../../../components/ui/Button";
import {
  TableShell,
  TableHead,
  TableBody,
} from "../../../components/tables/core";
import { Icons } from "../../../components/common/Icon";
import { ShieldCheck, BarChart, Activity, Target } from "lucide-react";
import { useUpdateLoanStatus } from "../../../hooks/useLoanApplication.js";
import toast from "react-hot-toast";

export default function KycVerificationPage() {
  // --- STATE ---
  const documents = {};
  const docsLoading = false;
  const fetchDocumentsByLoanId = async () => {};
  const [activeDoc, setActiveDoc] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState(null); // 'approve' | 'reject'
  const cibilData = KYC_CIBIL_DATA;

  // --- DATA ---
  const updateLoan = useUpdateLoanStatus();

  const kycList = useMemo(() => {
    return KYC_APPLICATIONS.map((item) => ({
      ...item,
      normalizedStatus: item.kycStatus || item.status?.toLowerCase() || "",
    }));
  }, []);

  const StatusBadge = ({ status }) => {
    const formattedStatus = status?.toUpperCase();

    const styles = {
      VERIFIED: "bg-green-100 text-green-700 border-green-200",
      KYC_PENDING: "bg-orange-100 text-orange-700 border-orange-200",
      REJECTED: "bg-red-100 text-red-700 border-red-200",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-bold rounded-full border ${styles[formattedStatus]}`}
      >
        {formattedStatus.replace("_", " ")}
      </span>
    );
  };

  const CibilScoreBadge = ({ score }) => {
    const getScoreColor = (score) => {
      if (score >= 750) return "text-green-600 bg-green-50 border-green-200";
      if (score >= 650)
        return `${colorVariables.PRIMARY_COLOR} ${colorVariables.LIGHT_BG} border-blue-200`;
      if (score >= 550) return "text-orange-600 bg-orange-50 border-orange-200";
      return "text-red-600 bg-red-50 border-red-200";
    };

    const getScoreBand = (score) => {
      if (score >= 750) return "Excellent";
      if (score >= 700) return "Good";
      if (score >= 650) return "Fair";
      if (score >= 550) return "Poor";
      return "Very Poor";
    };

    return (
      <div
        className={`inline-flex items-center px-3 py-1 rounded-full border ${getScoreColor(score)}`}
      >
        <Icons.TrendingUp className="w-3 h-3 mr-1" />
        <span className="font-bold">{score}</span>
        <span className="text-xs ml-1">({getScoreBand(score)})</span>
      </div>
    );
  };

  // CIBIL Score Meter Component
  const CibilScoreMeter = ({ score }) => {
    const percentage = Math.min(100, (score / 900) * 100);

    const getGradientColor = () => {
      if (score >= 750) return "from-green-500 to-green-400";
      if (score >= 650) return "from-blue-500 to-blue-400";
      if (score >= 550) return "from-orange-500 to-orange-400";
      return "from-red-500 to-red-400";
    };

    return (
      <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`absolute h-full bg-linear-to-r ${getGradientColor()} transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-between px-4 text-xs font-bold">
          <span className="text-gray-700">300</span>
          <span className="text-gray-700">900</span>
        </div>
        <div
          className="absolute top-0 h-8 w-0.5 bg-gray-900"
          style={{ left: `${percentage}%` }}
        >
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            <div className="bg-gray-900 text-white px-2 py-1 rounded text-xs font-bold">
              {score}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // CIBIL Risk Factors Component
  const CibilRiskFactors = ({ factors }) => {
    return (
      <div className="space-y-3">
        {factors.map((factor, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              {factor.status === "good" && (
                <Icons.CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              )}
              {factor.status === "average" && (
                <Icons.AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />
              )}
              {factor.status === "poor" && (
                <Icons.XCircle className="w-4 h-4 text-red-500 mr-2" />
              )}
              <span className="text-sm text-gray-700">{factor.name}</span>
            </div>
            <div className="flex items-center">
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                <div
                  className={`h-full ${
                    factor.status === "good"
                      ? "bg-green-500"
                      : factor.status === "average"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${factor.score}%` }}
                />
              </div>
              <span className="text-sm font-bold text-gray-900 w-8 text-right">
                {factor.score}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // --- TABLE COLUMN DEFINITIONS ---
  const kycColumns = [
    {
      accessor: "id",
      header: "Request ID",
      render: (val) => <span className="font-mono text-gray-500">{val}</span>,
    },
    {
      accessor: "applicantName",
      header: "Customer",
      render: (val, row) => (
        <div>
          <div className="font-bold text-gray-800">{val}</div>
          <div className={`text-xs ${colorVariables.PRIMARY_COLOR}`}>
            {row.loanNumber}
          </div>
        </div>
      ),
    },
    {
      accessor: "documents",
      header: "Docs Submitted",
      render: (val) =>
        Object.keys(val || {}).length > 0 ? (
          Object.keys(val).map((doc) => (
            <span
              key={doc}
              className="inline-block bg-gray-100 px-2 py-1 rounded text-xs mr-1 uppercase"
            >
              {doc.replaceAll("_", " ")}
            </span>
          ))
        ) : (
          <span className="text-gray-400 text-xs">No Docs</span>
        ),
    },
    {
      accessor: "cibilScore",
      header: "CIBIL Score",
      render: (val) => {
        const getColor = (s) => {
          if (s >= 750) return "text-green-600 bg-green-50 border-green-200";
          if (s >= 650)
            return `${colorVariables.PRIMARY_COLOR} ${colorVariables.LIGHT_BG} border-blue-200`;
          if (s >= 550) return "text-orange-600 bg-orange-50 border-orange-200";
          return "text-red-600 bg-red-50 border-red-200";
        };
        const getBand = (s) =>
          s >= 750
            ? "Excellent"
            : s >= 700
              ? "Good"
              : s >= 650
                ? "Fair"
                : s >= 550
                  ? "Poor"
                  : "Very Poor";
        return (
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full border ${getColor(val)}`}
          >
            <Icons.TrendingUp className="w-3 h-3 mr-1" />
            <span className="font-bold">{val || "N/A"}</span>
            {val && <span className="text-xs ml-1">({getBand(val)})</span>}
          </div>
        );
      },
    },
    {
      accessor: "applicationDate",
      header: "Submitted On",
      render: (val) => <span className="text-gray-500">{val || "—"}</span>,
    },
    {
      accessor: "risk",
      header: "Risk Profile",
      render: (val) => (
        <span
          className={`text-xs font-bold px-2 py-1 rounded ${val === "High" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}
        >
          {val || "—"}
          {val ? " Risk" : ""}
        </span>
      ),
    },
    {
      accessor: "status",
      header: "Status",
      render: (val) => {
        const s = val?.toUpperCase();
        const styles = {
          VERIFIED: "bg-green-100 text-green-700 border-green-200",
          KYC_PENDING: "bg-orange-100 text-orange-700 border-orange-200",
          REJECTED: "bg-red-100 text-red-700 border-red-200",
        };
        return (
          <span
            className={`px-2 py-1 text-xs font-bold rounded-full border ${styles[s] || styles.KYC_PENDING}`}
          >
            {s?.replace("_", " ")}
          </span>
        );
      },
    },
  ];

  // --- LOGIC ---

  const filteredData = useMemo(() => {
    return kycList.filter((item) => {
      const status = item.normalizedStatus;

      const matchesTab =
        activeTab === "all"
          ? true
          : activeTab === "pending"
            ? status === "kyc_pending"
            : activeTab === "verified"
              ? status === "approved"
              : status === "rejected";

      const matchesSearch =
        item.applicantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.loanNumber?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [kycList, activeTab, searchTerm]);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    if (selectedCustomer?.id && documents[selectedCustomer.id]) {
      const keys = Object.keys(documents[selectedCustomer.id]);
      if (keys.length > 0 && !activeDoc) {
        Promise.resolve().then(() => setActiveDoc(keys[0]));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCustomer, documents]);

  const handleVerifyClick = async (customer) => {
    setSelectedCustomer(customer);

    // 🔥 Backend se documents fetch karo
    await fetchDocumentsByLoanId(customer.id);

    setActiveDoc(null); // first doc auto select useEffect karega
    setShowModal(true);
  };

  const handleKycAction = async () => {
    const status = confirmType === "approve" ? "approved" : "rejected";
    await updateLoan.mutateAsync({ id: selectedCustomer.id, status });
    if (confirmType === "approve") toast.success("KYC Verified");
    else toast.error("KYC Rejected");
    setIsConfirmOpen(false);
    setConfirmType(null);
    setShowModal(false);
  };

  const kycActions = [
    {
      label: "Review",
      icon: <Icons.Eye />,
      onClick: (item) => handleVerifyClick(item),
    },
  ];

  const customerDocs = documents[selectedCustomer?.id] || {};
  const docKeys = Object.keys(customerDocs);

  // --- MODAL: VERIFICATION VIEW ---
  const VerificationModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <ShieldCheck className={colorVariables.PRIMARY_COLOR} /> KYC
              Verification
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Reviewing documents for{" "}
              <span className="font-bold text-gray-700">
                {selectedCustomer.applicantName}
              </span>
            </p>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="p-2 hover:bg-gray-200 rounded-full"
          >
            <Icons.XCircle size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Body (Three Column Layout) */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left: Document Preview (40%) */}
          <div className="w-full lg:w-2/5 bg-gray-900 p-6 flex flex-col items-center justify-center relative">
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="bg-black/50 text-white px-3 py-1 rounded text-xs hover:bg-black/70">
                Rotate
              </button>
              <button className="bg-black/50 text-white px-3 py-1 rounded text-xs hover:bg-black/70">
                Zoom
              </button>
            </div>
            {/* Mock Document Image */}
            <div className="w-full h-full bg-gray-800 rounded-lg border-2 border-gray-700 flex items-center justify-center text-gray-500">
              <div className="text-center">
                {docsLoading ? (
                  <p className="text-white">Loading Documents...</p>
                ) : activeDoc ? (
                  <img
                    src={customerDocs[activeDoc]}
                    alt={activeDoc}
                    className="max-h-full object-contain rounded"
                  />
                ) : (
                  <div className="text-gray-400">
                    <Icons.FileText
                      size={64}
                      className="mx-auto mb-4 opacity-50"
                    />
                    <p>No Preview</p>
                  </div>
                )}
                {!activeDoc && !docsLoading && (
                  <p className="text-xs mt-2 text-gray-400">
                    No preview available
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4 flex gap-4 overflow-x-auto w-full p-2">
              {docKeys.length > 0 ? (
                docKeys.map((doc, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveDoc(doc)}
                    className={`min-w-25 h-20 bg-gray-800 rounded border-2 border-gray-700 cursor-pointer flex flex-col items-center justify-center text-xs text-gray-300 hover:${colorVariables.BORDER_COLOR}`}
                  >
                    <img
                      src={customerDocs[doc]}
                      alt={doc}
                      className="h-12 object-contain mb-1"
                    />
                    <span className="uppercase text-[10px] text-center px-1">
                      {doc.replace("_", " ")}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No documents uploaded</p>
              )}
            </div>
          </div>

          {/* Middle: Data Matching Form (30%) */}
          <div className="w-full lg:w-2/5 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="space-y-6">
                {/* Name Match */}
                <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Name Match Score
                  </label>
                  <div className="flex justify-between items-center mt-1">
                    <span className="font-bold text-green-700 text-lg">
                      98% Match
                    </span>
                    <Icons.CheckCircle size={20} className="text-green-600" />
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    System: {selectedCustomer.applicantName}
                    <br />
                    Doc: {selectedCustomer.applicantName}
                  </div>
                </div>

                {/* PAN Field */}

                {/* Risk Flag */}
                {selectedCustomer.risk === "High" && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-start gap-2 text-sm">
                    <Icons.AlertTriangle
                      size={16}
                      className="mt-0.5 shrink-0"
                    />
                    <span>
                      High Risk Flag: Multiple recent inquiries found on credit
                      report.
                    </span>
                  </div>
                )}
              </div>

              {/* CIBIL Quick View */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <Icons.CreditCard size={18} /> CIBIL Score
                  </h3>
                  <CibilScoreBadge score={cibilData.score} />
                </div>
                <div className="mb-4">
                  <CibilScoreMeter score={cibilData.score} />
                </div>
                <p className="text-xs text-gray-500">
                  Last updated: {cibilData.lastUpdated}
                </p>
              </div>
            </div>
          </div>

          {/* Right: CIBIL Detailed View (30%) */}
          <div className="w-full lg:w-2/5 bg-gray-50 border-l border-gray-200 flex flex-col">
            <div className="p-6 flex-1 overflow-y-auto">
              <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                <BarChart size={18} className={colorVariables.PRIMARY_COLOR} />{" "}
                CIBIL Detailed Report
              </h3>

              {/* Score Summary */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Current Score</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {cibilData.score}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full font-bold ${
                      cibilData.score >= 750
                        ? "bg-green-100 text-green-700"
                        : cibilData.score >= 650
                          ? "bg-blue-100 text-blue-700"
                          : cibilData.score >= 550
                            ? "bg-orange-100 text-orange-700"
                            : "bg-red-100 text-red-700"
                    }`}
                  >
                    {cibilData.band}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Credit Age</p>
                    <p className="font-bold text-gray-900">4.2 years</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Active Loans</p>
                    <p className="font-bold text-gray-900">
                      {cibilData.loans.length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Risk Factors */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Activity size={16} /> Risk Factors
                </h4>
                <CibilRiskFactors factors={cibilData.factors} />
              </div>

              {/* Active Loans */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Target size={16} /> Active Credit Lines
                </h4>
                <div className="space-y-2">
                  {cibilData.loans.map((loan, index) => (
                    <div
                      key={index}
                      className="bg-white p-3 rounded-lg border border-gray-200"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">{loan.type}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            loan.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {loan.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Amount: {loan.amount || loan.limit}
                        {loan.emi && ` | EMI: ${loan.emi}`}
                        {loan.utilized && ` | Utilized: ${loan.utilized}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Inquiries */}
              {/* <div>
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <TrendingDown size={16} /> Recent Inquiries
                </h4>
                <div className="space-y-2">
                  {cibilData.inquiries.map((inquiry, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="flex justify-between">
                        <span className="font-medium text-sm">{inquiry.lender}</span>
                        <span className="text-xs text-gray-500">{inquiry.date}</span>
                      </div>
                      <div className="text-xs text-gray-500">{inquiry.type}</div>
                    </div>
                  ))}
                </div>
              </div> */}
            </div>

            {/* CIBIL Actions */}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex gap-3">
            <Button
              onClick={() => {
                setConfirmType("reject");
                setIsConfirmOpen(true);
              }}
              className="flex-1 py-3 border border-red-200 bg-white! text-red-600! rounded-xl font-bold hover:bg-red-50!"
            >
              Reject / Retry
            </Button>
            <Button
              onClick={() => {
                setConfirmType("approve");
                setIsConfirmOpen(true);
              }}
              className="flex-1 py-3"
            >
              Approve KYC
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <ShieldCheck className={colorVariables.PRIMARY_COLOR} size={32} />{" "}
            KYC Verification
          </h1>
          <p className="text-gray-500 mt-1 ml-11">
            Verify customer identity, review documents, and manage compliance.
          </p>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <QuickActionCard
          title="Verify Pending KYC"
          subtitle={`${kycList.filter((k) => k.normalizedStatus === "kyc_pending").length} applications awaiting review`}
          icon={Icons.Shield}
          variant="blue"
          onClick={() => {
            setActiveTab("pending");
            setCurrentPage(1);
          }}
        />
        <QuickActionCard
          title="Export KYC Report"
          subtitle="Download full verification summary"
          icon={Icons.Download}
          variant="indigo"
          onClick={() => console.log("Export KYC report")}
        />
      </div>

      {/* TAB SELECTOR */}
      <div className="flex bg-gray-200/50 p-1 rounded-lg w-fit">
        {["all", "pending", "verified", "rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${activeTab === tab ? `bg-white ${colorVariables.PRIMARY_COLOR} shadow-sm` : "text-gray-500 hover:text-gray-700"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <TableShell>
        <TableHead
          title={`KYC Applications (${filteredData.length})`}
          columns={kycColumns}
          search={searchTerm}
          setSearch={(v) => {
            setSearchTerm(v);
            setCurrentPage(1);
          }}
        />
        <TableBody
          columns={kycColumns}
          data={paginatedData}
          actions={kycActions}
        />
      </TableShell>

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Modal Injection */}
      {showModal && selectedCustomer && <VerificationModal />}

      {/* CONFIRMATION DIALOG */}
      <ConfirmationDialog
        open={isConfirmOpen}
        isPopup
        title={confirmType === "approve" ? "Approve KYC" : "Reject KYC"}
        description={
          confirmType === "approve"
            ? "Are you sure you want to verify and approve this KYC application?"
            : "Are you sure you want to reject this KYC application?"
        }
        confirmText={confirmType === "approve" ? "Approve" : "Reject"}
        cancelText="Cancel"
        variant={confirmType === "reject" ? "danger" : "default"}
        showRemark={confirmType === "reject"}
        onConfirm={handleKycAction}
        onCancel={() => {
          setIsConfirmOpen(false);
          setConfirmType(null);
        }}
      />
    </div>
  );
}
