import { AlertTriangle, DollarSign, IndianRupee, TrendingUp, Users } from "lucide-react";

function StatCard({ label, value, hint, icon }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">{label}</div>
        {icon}
      </div>
      <div className="text-2xl font-bold text-slate-800 mt-2">{value}</div>
      <div className="text-xs text-slate-400 mt-1">{hint}</div>
    </div>
  );
}

export default function DefaultManagementStats({ totals }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        label="Defaulted Loans"
        value={totals.totalLoans}
        hint="Active defaults"
        icon={<AlertTriangle size={20} className="text-orange-500" />}
      />
      <StatCard
        label="Total Outstanding"
        value={`₹${totals.totalOutstanding.toLocaleString()}`}
        hint="Principal + Interest"
        icon={<IndianRupee size={20} className="text-red-500" />}
      />
      <StatCard
        label="Total Recovered"
        value={`₹${totals.totalRecovered.toLocaleString()}`}
        hint={`Recovery Rate: ${totals.recoveryRate.toFixed(1)}%`}
        icon={<TrendingUp size={20} className="text-green-500" />}
      />
      <StatCard
        label="Average DPD"
        value={totals.avgDpd}
        hint="Days Past Due"
        icon={<Users size={20} className="text-blue-500" />}
      />
      <StatCard
        label="Total Approved"
        value={`₹${totals.totalApproved.toLocaleString()}`}
        hint="Original loan amount"
        icon={<IndianRupee size={20} className="text-slate-700" />}
      />
    </div>
  );
}
