import React, { useMemo, useState } from "react";
import { 
  Plus, FileText, Check, Ban, AlertCircle, Hash, 
  IndianRupee, Users, ShieldCheck, Briefcase 
} from "lucide-react";
import Button from "../../../components/ui/Button";
import StatusCard from "../../../components/common/StatusCard";
import ApplicationPageTable from "../../../components/tables/ApplicationPageTable";
import LoanApplicationView from "../ViewDetail/LoanApplicationView";
import LoanApplicationForm from "../../../components/forms/LoanApplicationForm";

export default function ProfessionalNBFCPortal() {
  const [showForm, setShowForm] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  // Define Columns based on the Mascot Projects Form
  const nbfcColumns = [
    {
      header: "Applicant Details",
      accessor: "applicant",
      render: (_, app) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-blue-700 font-bold border border-slate-200">
            {app.applicant?.firstName?.charAt(0) || "U"}
          </div>
          <div>
            <div className="font-bold text-slate-900">
              {`${app.applicant?.firstName || ""} ${app.applicant?.lastName || ""}`}
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <Hash size={12} /> {app.applicant?.panNumber || "No PAN"} | {app.applicant?.category || "Gen"}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Employment & Income",
      accessor: "occupation",
      render: (_, app) => (
        <div>
          <div className="text-sm font-medium text-slate-700 flex items-center gap-1">
            <Briefcase size={14} className="text-slate-400" />
            {app.occupation?.category || "Salaried"}
          </div>
          <div className="text-xs text-green-600 font-semibold">
            Monthly: ₹{app.financials?.grossMonthlyIncome?.toLocaleString() || "0"}
          </div>
        </div>
      ),
    },
    {
      header: "Loan Structure",
      accessor: "loanDetails",
      render: (_, app) => (
        <div className="space-y-1">
          <div className="text-sm font-bold text-blue-600 flex items-center">
            <IndianRupee size={14} /> {app.requestedAmount?.toLocaleString()}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
            {app.loanType || "Mortgage Loan"} • {app.tenureMonths} Mo.
          </div>
        </div>
      ),
    },
    {
      header: "Risk Grade (CIBIL)",
      accessor: "cibilScore",
      render: (score) => {
        const safeScore = Math.max(0, Math.min(900, score || 0));
        const pct = (safeScore / 900) * 100;

        return (
          <div className="flex flex-col">
            <span className={`text-sm font-bold ${safeScore >= 750 ? "text-green-600" : "text-orange-500"}`}>
              {score || "---"}
            </span>
            <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: `${pct}%` }}></div>
            </div>
          </div>
        );
      },
    },
    {
      header: "Status",
      accessor: "status",
      render: (status) => (
        <span className={`px-2 py-1 rounded-md text-[11px] font-bold border uppercase ${
          status === 'approved' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700'
        }`}>
          {status}
        </span>
      ),
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6">
      {/* NBFC Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="text-blue-600" size={28} />
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">MASCOT PROJECTS LOS</h1>
            </div>
            <p className="text-slate-500 text-sm font-medium">Non-Banking Finance Operations Control</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
            <Plus size={18} className="mr-2" /> Start New Underwriting
          </Button>
        </div>

        {/* Financial Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatusCard title="Active Files" value="124" icon={FileText} variant="blue" />
          <StatusCard title="Awaiting KYC" value="12" icon={AlertCircle} variant="orange" />
          <StatusCard title="Disbursed" value="84" icon={Check} variant="green" />
          <StatusCard title="Rejected" value="08" icon={Ban} variant="red" />
        </div>

        {/* Application Data Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-700">Recent Applications</h3>
            <div className="text-xs font-medium text-slate-400 italic font-mono">Real-time NBFC Sync Enabled</div>
          </div>
          <ApplicationPageTable 
            applications={[]} // Replace with your hook data
            tableColumns={nbfcColumns} 
            onViewDetails={(app) => { setSelectedApp(app); setViewModalOpen(true); }}
          />
        </div>
      </div>

      {/* Modals */}
      {showForm && <LoanApplicationForm onClose={() => setShowForm(false)} />}
      {viewModalOpen && (
        <LoanApplicationView 
          application={selectedApp} 
          onClose={() => setViewModalOpen(false)} 
        />
      )}
    </div>
  );
}