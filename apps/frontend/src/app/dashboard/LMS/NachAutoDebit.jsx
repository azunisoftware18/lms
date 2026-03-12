// ─────────────────────────────────────────────────────────────
// NachAutoDebit.jsx (Responsive Version)
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import {
  CreditCard,
  CheckCircle,
  PauseCircle,
  XCircle,
  AlertCircle,
  Plus,
  Zap,
  Shield,
  Activity,
  TrendingUp,
  LayoutGrid,
  IndianRupee,
} from "lucide-react";

import StatusCard from "../../../components/common/StatusCard";
import NachMandateForm from "../../../components/forms/NachMandateForm";
import {
  DebitHistoryTable,
  MandateManagementTable,
} from "../../../components/tables/NachAutoDebitTable";

import { mockMandates, mockDebits } from "../../../lib/dumyData";


// ═════════════════════════════════════════════════════════════
// PAGE 1 — MANDATE CREATION
// ═════════════════════════════════════════════════════════════
function MandateCreation() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Form submitted:", formData);
      alert("Mandate created successfully!");
    } catch (error) {
      alert("Failed to create mandate.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">
            Create NACH Mandate
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Register a new mandate to enable automated EMI debit.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg w-fit">
          <Shield size={14} className="text-blue-600" />
          <span className="text-xs font-semibold text-blue-700">
            RBI Compliant
          </span>
        </div>
      </div>

      <NachMandateForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitButtonText="Create Mandate"
        showFeatures={true}
        defaultValues={{
          bank: "",
          account: "",
          ifsc: "",
          limit: "",
          startDate: "",
        }}
      />
    </div>
  );
}


// ═════════════════════════════════════════════════════════════
// PAGE 2 — MANDATE MANAGEMENT
// ═════════════════════════════════════════════════════════════
function MandateManagement() {
  const [mandates, setMandates] = useState(mockMandates);

  const counts = {
    active: mandates.filter((m) => m.status === "Active").length,
    suspended: mandates.filter((m) => m.status === "Suspended").length,
    cancelled: mandates.filter((m) => m.status === "Cancelled").length,
  };

  const handleStatusChange = (id, newStatus, updated) => {
    setMandates(updated);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">
          Mandate Management
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          View and control all registered NACH mandates.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

        <StatusCard
          title="Total Mandates"
          value={mandates.length}
          subtext="All mandates"
          icon={CreditCard}
          variant="blue"
        />

        <StatusCard
          title="Active"
          value={counts.active}
          subtext="Running debits"
          icon={CheckCircle}
          variant="green"
          trend={{
            value: Math.round((counts.active / mandates.length) * 100),
            isPositive: true,
          }}
        />

        <StatusCard
          title="Suspended"
          value={counts.suspended}
          subtext="On hold"
          icon={PauseCircle}
          variant="orange"
        />

        <StatusCard
          title="Cancelled"
          value={counts.cancelled}
          subtext="Terminated"
          icon={XCircle}
          variant="red"
        />
      </div>

      <MandateManagementTable
        mandates={mandates}
        onStatusChange={handleStatusChange}
        showActions={true}
      />
    </div>
  );
}


// ═════════════════════════════════════════════════════════════
// PAGE 3 — DEBIT HISTORY
// ═════════════════════════════════════════════════════════════
function DebitHistory() {
  const successCount = mockDebits.filter((d) => d.status === "Success").length;
  const failedCount = mockDebits.filter((d) => d.status === "Failed").length;

  const totalAmount = mockDebits
    .filter((d) => d.status === "Success")
    .reduce((s, d) => s + d.amount, 0);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">
          Debit History
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Track all EMI auto-debit transactions.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

        <StatusCard
          title="Total Collected"
          value={"₹" + totalAmount.toLocaleString("en-IN")}
          subtext="Successful debits"
          icon={IndianRupee}
          variant="blue"
        />

        <StatusCard
          title="Successful"
          value={successCount}
          subtext="Transactions cleared"
          icon={CheckCircle}
          variant="green"
        />

        <StatusCard
          title="Failed"
          value={failedCount}
          subtext="Needs attention"
          icon={AlertCircle}
          variant="red"
        />
      </div>

      <DebitHistoryTable debits={mockDebits} />
    </div>
  );
}


// ═════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════
const TABS = [
  { id: "create", label: "Mandate Creation", short: "Create", icon: Plus },
  { id: "manage", label: "Mandate Management", short: "Manage", icon: LayoutGrid },
  { id: "history", label: "Debit History", short: "History", icon: Activity },
];

export default function NachAutoDebit() {
  const [activeTab, setActiveTab] = useState("create");

  const topStats = [
    {
      title: "Total Mandates",
      value: mockMandates.length,
      icon: CreditCard,
      variant: "blue",
    },
    {
      title: "Active",
      value: mockMandates.filter((m) => m.status === "Active").length,
      icon: CheckCircle,
      variant: "green",
    },
    {
      title: "Success Rate",
      value: "62.5%",
      icon: TrendingUp,
      variant: "purple",
    },
    {
      title: "MTD Collection",
      value: "₹1.05L",
      icon: IndianRupee,
      variant: "orange",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={18} className="text-blue-600" />
            <h1 className="text-lg sm:text-xl font-black text-slate-800">
              NACH / Auto Debit
            </h1>
          </div>

          <p className="text-sm text-slate-500">
            Manage mandates and automated EMI collections.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {topStats.map((s) => (
            <StatusCard key={s.title} {...s} />
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-slate-200">
          <nav className="flex overflow-x-auto scrollbar-hide">

            {TABS.map(({ id, label, short, icon: Icon }) => {
              const active = activeTab === id;

              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition
                  ${
                    active
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{short}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "create" && <MandateCreation />}
        {activeTab === "manage" && <MandateManagement />}
        {activeTab === "history" && <DebitHistory />}
      </main>
    </div>
  );
}