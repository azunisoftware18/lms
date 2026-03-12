// ─────────────────────────────────────────────────────────────────────────────
// NachAutoDebit.jsx
//
// Integrated with your reusable components:
//   ✅ StatusCard   → components/common/StatusCard.jsx
//   ✅ NachMandateForm → components/forms/NachMandateForm.jsx
//   ✅ NachAutoDebitTable → components/tables/NachAutoDebitTable.jsx
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import {
  CreditCard, CheckCircle, PauseCircle, XCircle, AlertCircle,
  Plus, Zap, Shield, Activity, TrendingUp, LayoutGrid, IndianRupee
} from "lucide-react";

// ── Reusable components ─────────────────────────────────────────────────────
import StatusCard from "../../../components/common/StatusCard";
import NachMandateForm from "../../../components/forms/NachMandateForm";
import { DebitHistoryTable, MandateManagementTable } from "../../../components/tables/NachAutoDebitTable";

// ── Data ─────────────────────────────────────────────────────────────────────
import { mockMandates, mockDebits } from "../../../lib/dumyData";

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 1 — MANDATE CREATION (now using NachMandateForm)
// ══════════════════════════════════════════════════════════════════════════════
function MandateCreation() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Form submitted:", formData);
      
      // You can add your API call here
      // await api.createMandate(formData);
      
      // Show success message or redirect
      alert("Mandate created successfully!");
      
    } catch (error) {
      console.error("Error creating mandate:", error);
      alert("Failed to create mandate. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    console.log("Form cancelled/reset");
    // Optional: Add any cleanup or navigation
  };

  return (
    <div className="space-y-6">
      {/* ── Section header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-800 tracking-tight">Create NACH Mandate</h2>
          <p className="text-sm text-slate-500 mt-0.5">Register a new mandate to enable automated EMI debit.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg shrink-0">
          <Shield size={13} className="text-blue-600" />
          <span className="text-xs font-semibold text-blue-700">RBI Compliant</span>
        </div>
      </div>

      {/* ── Using the extracted NachMandateForm component ── */}
      <NachMandateForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
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

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 2 — MANDATE MANAGEMENT
// ══════════════════════════════════════════════════════════════════════════════
function MandateManagement() {
  const [mandates, setMandates] = useState(mockMandates);

  const counts = {
    active:    mandates.filter((m) => m.status === "Active").length,
    suspended: mandates.filter((m) => m.status === "Suspended").length,
    cancelled: mandates.filter((m) => m.status === "Cancelled").length,
  };

  const handleStatusChange = (id, newStatus, updatedMandates) => {
    setMandates(updatedMandates);
    console.log(`Mandate ${id} status changed to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      {/* ── Section header ── */}
      <div>
        <h2 className="text-lg font-black text-slate-800 tracking-tight">Mandate Management</h2>
        <p className="text-sm text-slate-500 mt-0.5">View and control all registered NACH mandates.</p>
      </div>

      {/* ── StatusCard summary row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
          trend={{ value: Math.round((counts.active / mandates.length) * 100), isPositive: true }}
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

      {/* ── Mandate Management Table ── */}
      <MandateManagementTable 
        mandates={mandates}
        onStatusChange={handleStatusChange}
        showActions={true}
      />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 3 — DEBIT HISTORY
// ══════════════════════════════════════════════════════════════════════════════
function DebitHistory() {
  const successCount = mockDebits.filter((d) => d.status === "Success").length;
  const failedCount  = mockDebits.filter((d) => d.status === "Failed").length;
  const totalAmount  = mockDebits
    .filter((d) => d.status === "Success")
    .reduce((s, d) => s + d.amount, 0);

  return (
    <div className="space-y-6">
      {/* ── Section header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-800 tracking-tight">Debit History</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Track all EMI auto-debit transactions and failure analysis.
          </p>
        </div>
      </div>

      {/* ── StatusCard summary ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatusCard
          title="Total Collected"
          value={"₹" + totalAmount.toLocaleString("en-IN")}
          subtext="From successful debits"
          icon={IndianRupee}
          variant="blue"
        />
        <StatusCard
          title="Successful"
          value={successCount}
          subtext="Transactions cleared"
          icon={CheckCircle}
          variant="green"
          trend={{ value: Math.round((successCount / mockDebits.length) * 100), isPositive: true }}
        />
        <StatusCard
          title="Failed"
          value={failedCount}
          subtext="Requires attention"
          icon={AlertCircle}
          variant="red"
          trend={{ value: Math.round((failedCount / mockDebits.length) * 100), isPositive: false }}
        />
      </div>

      {/* ── Debit History Table ── */}
      <DebitHistoryTable 
        debits={mockDebits}
        showDateFilter={true}
      />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT — NachAutoDebit
// ══════════════════════════════════════════════════════════════════════════════
const TABS = [
  { id: "create",  label: "Mandate Creation",   short: "Create",  icon: Plus       },
  { id: "manage",  label: "Mandate Management", short: "Manage",  icon: LayoutGrid },
  { id: "history", label: "Debit History",       short: "History", icon: Activity   },
];

export default function NachAutoDebit() {
  const [activeTab, setActiveTab] = useState("create");

  // Top-level stats
  const topStats = [
    {
      title: "Total Mandates",
      value: mockMandates.length,
      icon:  CreditCard,
      variant: "blue",
    },
    {
      title: "Active",
      value: mockMandates.filter((m) => m.status === "Active").length,
      icon:  CheckCircle,
      variant: "green",
      trend: {
        value: Math.round(
          (mockMandates.filter((m) => m.status === "Active").length / mockMandates.length) * 100
        ),
        isPositive: true,
      },
    },
    {
      title:   "Success Rate",
      value:   "62.5%",
      subtext: "MTD collections",
      icon:    TrendingUp,
      variant: "purple",
    },
    {
      title:   "MTD Collection",
      value:   "₹1.05L",
      subtext: "This month",
      icon:    IndianRupee,
      variant: "orange",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ── Page heading ── */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={18} className="text-blue-600" />
            <h1 className="text-xl font-black text-slate-800 tracking-tight">NACH / Auto Debit</h1>
          </div>
          <p className="text-sm text-slate-500">
            Manage NACH mandates and track automated EMI collections.
          </p>
        </div>

        {/* ── Quick stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {topStats.map(({ title, value, subtext, icon, variant, trend }) => (
            <StatusCard
              key={title}
              title={title}
              value={value}
              subtext={subtext}
              icon={icon}
              variant={variant}
              trend={trend}
            />
          ))}
        </div>

        {/* ── Tab navigation ── */}
        <div className="mb-6 border-b border-slate-200">
          <nav className="flex -mb-px overflow-x-auto">
            {TABS.map(({ id, label, short, icon: Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-4 sm:px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all
                    ${active
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                    }`}
                >
                  <Icon size={15} />
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{short}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* ── Tab content ── */}
        {activeTab === "create"  && <MandateCreation />}
        {activeTab === "manage"  && <MandateManagement />}
        {activeTab === "history" && <DebitHistory />}

      </main>
    </div>
  );
}