import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  IndianRupee,
  CreditCard,
  FileText,
  Calendar,
  Banknote,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  XCircle,
  BadgeCheck,
  AlertCircle,
  Zap,
  Building2,
  LayoutGrid,
  Download,
  Printer,
  TrendingUp,
  Landmark,
} from "lucide-react";

// Reusable Components
import Button from "../../../components/ui/Button";
import PageSkeleton from "../../../components/details/PageSkeleton";
import InfoCard from "../../../components/details/InfoCard";
import InfoItem from "../../../components/details/InfoItem";
import CopyableInfoItem from "../../../components/details/CopyableInfoItem";
import StatusOverviewCard from "../../../components/details/StatusOverviewCard";
import TabsNav from "../../../components/details/TabsNav";
import ProfileHeader from "../../../components/details/ProfileHeader";

// Mock data
import { mockLoans } from "../../../lib/dumyData";

// ══════════════════════════════════════════════════════════════════════════════
// LOCAL-ONLY HELPERS
// ══════════════════════════════════════════════════════════════════════════════

const fmt = (n) => (n === 0 ? "₹0" : "₹" + n.toLocaleString("en-IN"));

const StatusBadge = ({ status }) => {
  const cfg =
    {
      Active: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        dot: "bg-emerald-500",
        ring: "ring-emerald-200",
      },
      Delinquent: {
        bg: "bg-red-50",
        text: "text-red-700",
        dot: "bg-red-500",
        ring: "ring-red-200",
      },
      Closed: {
        bg: "bg-slate-100",
        text: "text-slate-500",
        dot: "bg-slate-400",
        ring: "ring-slate-200",
      },
    }[status] ?? {};
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ring-1 ${cfg.bg} ${cfg.text} ${cfg.ring}`}
    >
      <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
};

const NachBadge = ({ status }) => {
  const cfg = {
    Registered: { icon: BadgeCheck, cls: "text-emerald-600 bg-emerald-50" },
    Failed: { icon: AlertCircle, cls: "text-red-600 bg-red-50" },
    Cancelled: { icon: XCircle, cls: "text-slate-500 bg-slate-100" },
  }[status] ?? { icon: AlertCircle, cls: "text-slate-500 bg-slate-100" };
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${cfg.cls}`}
    >
      <Icon size={12} className="hidden sm:block" />
      <Icon size={10} className="sm:hidden" />
      <span className="truncate max-w-15 sm:max-w-none">{status}</span>
    </span>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// LOAN DETAIL VIEW COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
export default function LoanAccountView() {
  const { loanId } = useParams();
  const navigate = useNavigate();
  const [loan, setLoan] = useState(null);
  const [resolvedLoanId, setResolvedLoanId] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = [
    "Overview",
    "Payment History",
    "Documents",
    "Activity",
    "Statements",
  ];

  // Fetch loan details
  useEffect(() => {
    const timer = setTimeout(() => {
      const foundLoan = mockLoans.find((l) => l.id === loanId);
      setLoan(foundLoan || null);
      setResolvedLoanId(loanId);
    }, 500);

    return () => clearTimeout(timer);
  }, [loanId]);

  const loading = resolvedLoanId !== loanId;

  // In the handleBack function:
  const handleBack = () => {
    navigate("/admin/loan-account-creation"); // Navigate back to the list page
    // OR use: navigate(-1) to go back to previous page in history
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert("Downloading loan statement...");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <PageSkeleton />
        </main>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle size={64} className="mx-auto text-red-400 mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Loan Not Found
          </h2>
          <p className="text-slate-500 mb-6">
            The loan account you're looking for doesn't exist or may have been
            removed.
          </p>
          <Button onClick={handleBack}>
            <ArrowLeft size={16} className="mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const overviewItems = [
    { label: "Loan Amount", value: fmt(loan.loanAmount) },
    { label: "Outstanding", value: fmt(loan.outstandingBalance) },
    { label: "EMI Amount", value: fmt(loan.emiAmount) },
    { label: "Interest Rate", value: `${loan.interestRate}% p.a.` },
    { label: "Tenure", value: `${loan.tenure} Months` },
    { label: "Paid EMIs", value: `${loan.paidEMIs}/${loan.totalEMIs}` },
    { label: "Disbursed", value: loan.disbursementDate },
    { label: "Next EMI", value: loan.nextEMIDate },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans print:bg-white">
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 print:px-4 print:py-4">
        {/* Header with Actions */}
        <div className="mb-6 print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBack}
                className="px-3! py-2!"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back
              </Button>
              <div className="hidden sm:block text-slate-300">|</div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Loan ID:</span>
                <CopyableInfoItem label="" value={loan.id} icon={FileText} />
              </div>
              <StatusBadge status={loan.status} />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer size={16} className="mr-2" />
                <span className="hidden sm:inline">Print</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download size={16} className="mr-2" />
                <span className="hidden sm:inline">Download</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Profile Header */}
        <ProfileHeader
          name={loan.customerName}
          subtitle={`${loan.branch} • Member since ${new Date(loan.disbursementDate).getFullYear()}`}
          image={`https://ui-avatars.com/api/?name=${encodeURIComponent(loan.customerName)}&background=6366f1&color=fff&bold=true`}
          onImageClick={() => {}}
        />

        {/* Tabs Navigation */}
        <div className="print:hidden">
          <TabsNav tabs={tabs} active={activeTab} setActive={setActiveTab} />
        </div>

        {/* Overview Tab Content */}
        {activeTab === "Overview" && (
          <>
            {/* Status Overview Cards */}
            <div className="mb-6">
              <StatusOverviewCard items={overviewItems.slice(0, 6)} />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Left Column - Customer & Loan Summary */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                {/* Customer Details Card */}
                <InfoCard title="Customer Details" icon={Users}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <CopyableInfoItem
                      label="Full Name"
                      value={loan.customerName}
                      icon={Users}
                    />
                    <CopyableInfoItem
                      label="Phone"
                      value={loan.phone}
                      icon={Phone}
                    />
                    <CopyableInfoItem
                      label="Email"
                      value={loan.email}
                      icon={Mail}
                    />
                    <InfoItem
                      label="Address"
                      value={loan.address}
                      icon={MapPin}
                    />
                  </div>
                </InfoCard>

                {/* Loan Summary Card */}
                <InfoCard title="Loan Summary" icon={FileText}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
                    <InfoItem
                      label="Loan Amount"
                      value={fmt(loan.loanAmount)}
                      icon={IndianRupee}
                    />
                    <InfoItem
                      label="Interest Rate"
                      value={`${loan.interestRate}% p.a.`}
                      icon={TrendingUp}
                    />
                    <InfoItem
                      label="Tenure"
                      value={`${loan.tenure} Months`}
                      icon={Calendar}
                    />
                    <InfoItem
                      label="EMI Amount"
                      value={fmt(loan.emiAmount)}
                      icon={CreditCard}
                    />
                    <InfoItem
                      label="Disbursed"
                      value={loan.disbursementDate}
                      icon={Banknote}
                    />
                    <InfoItem
                      label="Branch"
                      value={loan.branch}
                      icon={Building2}
                    />
                  </div>
                </InfoCard>

                {/* EMI Progress */}
                <InfoCard title="Repayment Progress" icon={CheckCircle}>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Progress</span>
                      <span className="font-semibold text-slate-700">
                        {Math.round((loan.paidEMIs / loan.totalEMIs) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-teal-400 to-emerald-500 transition-all"
                        style={{
                          width: `${(loan.paidEMIs / loan.totalEMIs) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <InfoItem label="Total EMIs" value={loan.totalEMIs} />
                      <InfoItem label="Paid" value={loan.paidEMIs} />
                      <InfoItem label="Pending" value={loan.pendingEMIs} />
                    </div>
                  </div>
                </InfoCard>
              </div>

              {/* Right Column - Outstanding & Mandate */}
              <div className="space-y-4 sm:space-y-6">
                {/* Outstanding Balance Card */}
                <InfoCard title="Outstanding Balance" icon={IndianRupee}>
                  <div className="mt-2 space-y-3">
                    <div className="rounded-lg bg-amber-50 border border-amber-100 p-3 sm:p-4">
                      <p className="text-xs text-amber-700 font-semibold uppercase">
                        Total Outstanding
                      </p>
                      <p className="text-xl sm:text-2xl font-black text-amber-700">
                        {fmt(loan.outstandingBalance)}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <InfoItem
                        label="Principal"
                        value={fmt(loan.principalOutstanding)}
                      />
                      <InfoItem
                        label="Interest"
                        value={fmt(loan.interestOutstanding)}
                      />
                    </div>
                  </div>
                </InfoCard>

                {/* Mandate Status Card */}
                <InfoCard title="Mandate Status" icon={CreditCard}>
                  <div className="mt-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        NACH Status
                      </span>
                      <NachBadge status={loan.nachStatus} />
                    </div>
                    <CopyableInfoItem
                      label="Registration Date"
                      value={loan.mandateDate}
                      icon={Calendar}
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Auto Debit</span>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full
                        ${
                          loan.autoDebit === "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : loan.autoDebit === "Suspended"
                              ? "bg-red-50 text-red-600"
                              : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {loan.autoDebit}
                      </span>
                    </div>
                    <InfoItem
                      label="Bank Account"
                      value={loan.bankAccount}
                      icon={Landmark}
                    />
                  </div>
                </InfoCard>

                {/* Next EMI Card */}
                <InfoCard title="Next Payment" icon={Calendar}>
                  <div className="mt-2 text-center p-3">
                    <p className="text-sm text-slate-500 mb-1">Due Date</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {loan.nextEMIDate}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      Amount: {fmt(loan.emiAmount)}
                    </p>
                    <Button size="sm" className="w-full mt-3">
                      Pay Now
                    </Button>
                  </div>
                </InfoCard>
              </div>
            </div>
          </>
        )}

        {/* Other Tabs - Placeholder Content */}
        {activeTab === "Payment History" && (
          <InfoCard title="Payment History" icon={Calendar}>
            <div className="text-center py-8 text-slate-500">
              <Calendar size={48} className="mx-auto mb-3 text-slate-300" />
              <p>Payment history will be displayed here</p>
            </div>
          </InfoCard>
        )}

        {activeTab === "Documents" && (
          <InfoCard title="Documents" icon={FileText}>
            <div className="text-center py-8 text-slate-500">
              <FileText size={48} className="mx-auto mb-3 text-slate-300" />
              <p>Loan documents will be displayed here</p>
            </div>
          </InfoCard>
        )}

        {activeTab === "Activity" && (
          <InfoCard title="Activity Log" icon={LayoutGrid}>
            <div className="text-center py-8 text-slate-500">
              <LayoutGrid size={48} className="mx-auto mb-3 text-slate-300" />
              <p>Activity log will be displayed here</p>
            </div>
          </InfoCard>
        )}

        {activeTab === "Statements" && (
          <InfoCard title="Account Statements" icon={Download}>
            <div className="text-center py-8 text-slate-500">
              <Download size={48} className="mx-auto mb-3 text-slate-300" />
              <p>Account statements will be displayed here</p>
            </div>
          </InfoCard>
        )}
      </main>
    </div>
  );
}
