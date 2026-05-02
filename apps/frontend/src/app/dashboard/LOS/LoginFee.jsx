import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import toast from "react-hot-toast";

import { useLead, getLeadByIdOrNumber } from "../../../hooks/useLead";
import {
  useChargeLogginFee,
  useLogginFeeList,
  usePayLogginFee,
} from "../../../hooks/useLogginFee";
import StatusCard from "../../../components/common/StatusCard";

const paymentModeOptions = [
  { label: "UPI", value: "UPI" },
  { label: "Cash", value: "CASH" },
  { label: "Bank Transfer", value: "BANK" },
  { label: "Cheque", value: "CHEQUE" },
];

const statusOptions = ["PENDING", "PAID", "FAILED", "REFUNDED", "CANCELLED"];

const statusClasses = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-700",
  REFUNDED: "bg-purple-100 text-purple-700",
  CANCELLED: "bg-gray-100 text-gray-700",
};

const formatINR = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(num);
};

export default function LoginFee() {
  const [activeTab, setActiveTab] = useState("pay");
  const [searchInput, setSearchInput] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [paymentMode, setPaymentMode] = useState("UPI");
  const [selectedFee, setSelectedFee] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { leads = {} } = useLead({ page: 1, limit: 10, search: "", status: "" });

  const { fees, meta, loading, isFetching } = useLogginFeeList({
    page: currentPage,
    limit: 10,
    q: searchTerm,
    status: statusFilter,
  });

  const chargeFee = useChargeLogginFee();
  const payFee = usePayLogginFee();

  const rawFee =
    selectedLead?.defaultLoggingFeeAmount ??
    selectedLead?.defaultLoginCharges ??
    selectedLead?.loanType?.defaultLoginCharges ??
    selectedLead?.defaultLoggingfeeamount ??
    500;
  const feeAmount = Number(rawFee) || 0;
  const gstAmount = Number((feeAmount * 0.18).toFixed(2));
  const totalAmount = Number((feeAmount + gstAmount).toFixed(2));

  const feeStatusCounts = useMemo(() => {
    return (fees || []).reduce(
      (acc, item) => {
        acc.total += 1;
        if (item?.status === "PENDING") acc.pending += 1;
        if (item?.status === "PAID") acc.paid += 1;
        if (item?.status === "FAILED") acc.failed += 1;
        if (item?.status === "REFUNDED") acc.refunded += 1;
        return acc;
      },
      { total: 0, pending: 0, paid: 0, failed: 0, refunded: 0 },
    );
  }, [fees]);

  const filteredFees = useMemo(() => {
    const q = (searchTerm || "").toLowerCase();
    return (fees || []).filter((item) => {
      if (statusFilter && item.status !== statusFilter) return false;
      if (!q) return true;
      return [
        item.applicationNumber,
        item.leadNumber,
        item.applicantName,
        item.mobileNumber,
        item.email,
        item.transactionId,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [fees, searchTerm, statusFilter]);

  const totalLeadItems = leads?.total || 0;
  

  const fetchAndSearchLead = async (leadNumber) => {
    if (!leadNumber || !leadNumber.trim()) {
      setSelectedLead(null);
      return;
    }

    const trimmed = leadNumber.trim();
    const foundLocal = (leads?.data || []).find(
      (l) => l.id === trimmed || l.leadId === trimmed || l.leadNumber === trimmed,
    );

    if (foundLocal) {
      setSelectedLead(foundLocal);
      toast.success("Lead found");
      return;
    }

    try {
      const data = await getLeadByIdOrNumber(trimmed);
      if (!data) {
        setSelectedLead(null);
        toast.error("Lead not found");
        return;
      }
      setSelectedLead(data);
      toast.success("Lead found");
    } catch (err) {
      setSelectedLead(null);
      toast.error(err?.message || "Failed to fetch lead");
    }
  };

  const handlePay = async (e) => {
    e.preventDefault();
    if (!selectedLead) {
      toast.error("Please search and select a lead first");
      return;
    }

    try {
      const payload = {
        leadId: selectedLead.id || selectedLead.leadId,
        applicantName: selectedLead.fullName || selectedLead.name,
        mobileNumber: selectedLead.contactNumber || selectedLead.mobile,
        email: selectedLead.email,
        loanAmount: selectedLead.loanAmount || 0,
        feeAmount,
        paymentMode,
        institutionType: "NBFC",
      };

      const res = await chargeFee.mutateAsync(payload);
      const created = res?.data;
      if (!created) {
        toast.error("Unexpected response from server");
        return;
      }

      const paidRes = await payFee.mutateAsync(created.id);
      const paidRecord = paidRes?.data;
      if (!paidRecord) {
        toast.error("Unexpected payment response from server");
        return;
      }

      setSelectedFee(paidRecord);
      setShowReceipt(true);
      setSelectedLead(null);
      setSearchInput("");
      setActiveTab("history");
    } catch (err) {
      toast.error(err?.message || "Payment failed");
    }
  };


  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Login Fee</h1>
          <p className="text-slate-600 mt-1">Quick payment interface — search by lead number and pay.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
          <StatusCard title="Total Leads" value={totalLeadItems} icon={Icons.Users} colorClass="text-white" bgClass="bg-gradient-to-r from-blue-500 to-blue-600" percent={100} />
          <StatusCard title="Fees In View" value={meta?.total || feeStatusCounts.total} icon={Icons.Receipt} colorClass="text-indigo-700" bgClass="bg-indigo-50" percent={0} />
          <StatusCard title="Paid" value={feeStatusCounts.paid} icon={Icons.CheckCircle} colorClass="text-green-700" bgClass="bg-green-50" percent={0} />
          <StatusCard title="Pending" value={feeStatusCounts.pending} icon={Icons.Clock3} colorClass="text-yellow-700" bgClass="bg-yellow-50" percent={0} />
        </div>

        <div className="flex gap-2 mb-6 border-b border-slate-200">
          {[{ id: "pay", label: "Pay Login Fee", icon: Icons.CreditCard }, { id: "history", label: "Payment History", icon: Icons.History }].map((tab) => {
            const IconComp = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 ${activeTab === tab.id ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
                <IconComp className="w-4 h-4 inline mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "pay" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Icons.Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Process Payment</h2>
                  <p className="text-xs text-slate-500">Search lead and complete payment</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-3">Lead Number</label>
                  <div className="flex gap-2">
                    <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Enter lead number" className="flex-1 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button type="button" onClick={() => fetchAndSearchLead(searchInput)} className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
                      <Icons.Search className="w-4 h-4" />
                      Search
                    </button>
                  </div>
                </div>

                {selectedLead && (
                  <div className="border border-slate-200 rounded-xl p-5 bg-slate-50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-slate-900">Lead Details</h3>
                      <button type="button" onClick={() => setSelectedLead(null)} className="text-slate-500 hover:text-slate-700"><Icons.X className="w-4 h-4" /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-600 text-xs">Applicant Name</p>
                        <p className="font-semibold text-slate-900">{selectedLead.fullName || selectedLead.name || "-"}</p>
                      </div>
                      <div>
                        <p className="text-slate-600 text-xs">Mobile</p>
                        <p className="font-semibold text-slate-900">{selectedLead.contactNumber || selectedLead.mobile || "-"}</p>
                      </div>
                      <div>
                        <p className="text-slate-600 text-xs">Email</p>
                        <p className="font-semibold text-slate-900">{selectedLead.email || "-"}</p>
                      </div>
                      <div>
                        <p className="text-slate-600 text-xs">Loan Amount</p>
                        <p className="font-semibold text-slate-900">{formatINR(selectedLead.loanAmount || 0)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedLead && (
                  <form onSubmit={handlePay} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-3">Payment Method</label>
                      <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {paymentModeOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <button type="submit" disabled={chargeFee.isPending || payFee.isPending || !selectedLead} className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all font-semibold flex items-center justify-center gap-2 text-lg">
                      <Icons.Zap className="w-5 h-5" />{chargeFee.isPending || payFee.isPending ? "Processing..." : "Pay Login Fee"}
                    </button>
                  </form>
                )}

                {!selectedLead && (
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
                    <Icons.Search className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600 font-medium">Search a lead to process payment</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {selectedLead && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <div className="flex items-center gap-3 mb-4"><Icons.Calculator className="w-6 h-6 text-blue-600" /><h3 className="font-semibold text-slate-900">Fee Breakdown</h3></div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Base Fee</span><span className="font-bold text-slate-900">{formatINR(feeAmount)}</span></div>
                    <div className="flex justify-between items-center text-sm"><span className="text-slate-600">GST (18%)</span><span className="font-bold text-slate-900">{formatINR(gstAmount)}</span></div>
                    <div className="border-t border-blue-200 pt-3 flex justify-between items-center"><span className="font-semibold text-slate-900">Total Amount</span><span className="font-bold text-2xl text-blue-700">{formatINR(totalAmount)}</span></div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2"><Icons.Info className="w-4 h-4 text-blue-600" />Payment Info</h3>
                <ul className="space-y-2.5 text-sm text-slate-600">
                  <li className="flex items-start gap-2"><Icons.CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /><span>Receipt generated instantly</span></li>
                  <li className="flex items-start gap-2"><Icons.CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /><span>Transaction ID auto-generated by system</span></li>
                  <li className="flex items-start gap-2"><Icons.CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /><span>Supports all payment methods</span></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between mb-5">
              <h3 className="text-lg font-semibold text-slate-900">Payment History</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Icons.Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input type="text" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} placeholder="Search by app no / lead / name" className="pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
                </div>
                <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"><option value="">All Statuses</option>{statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}</select>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full min-w-[900px]"><thead className="bg-slate-50"><tr><th className="text-left text-xs font-semibold text-slate-600 px-4 py-3">Lead</th><th className="text-left text-xs font-semibold text-slate-600 px-4 py-3">Applicant</th><th className="text-left text-xs font-semibold text-slate-600 px-4 py-3">Amount</th><th className="text-left text-xs font-semibold text-slate-600 px-4 py-3">Payment</th><th className="text-left text-xs font-semibold text-slate-600 px-4 py-3">Status</th><th className="text-left text-xs font-semibold text-slate-600 px-4 py-3">Action</th></tr></thead>
                <tbody>
                  {(loading || isFetching) && (<tr><td colSpan={6} className="px-4 py-6 text-center text-slate-500">Loading fee records...</td></tr>)}

                  {!loading && !isFetching && filteredFees.length === 0 && (<tr><td colSpan={6} className="px-4 py-6 text-center text-slate-500">No login fee records found</td></tr>)}

                  {!loading && !isFetching && filteredFees.map((item) => (
                    <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm text-slate-700">{item.leadNumber || item.leadId}</td>
                      <td className="px-4 py-3 text-sm text-slate-700"><div>{item.applicantName}</div><div className="text-xs text-slate-500">{item.mobileNumber}</div></td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900">{formatINR(item.totalAmount)}</td>
                      <td className="px-4 py-3 text-sm text-slate-700"><div>{item.paymentMode}</div><div className="text-xs text-slate-500 font-mono">{item.transactionId || "Auto-Gen"}</div></td>
                      <td className="px-4 py-3 text-sm"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClasses[item.status] || "bg-slate-100 text-slate-700"}`}>{item.status}</span></td>
                      <td className="px-4 py-3 text-sm"><div className="flex gap-2"><button type="button" className="px-3 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50 text-xs font-medium" onClick={() => { setSelectedFee(item); setShowReceipt(true); }}>Receipt</button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-slate-600">Page {meta?.page || 1} of {meta?.totalPages || 1}</p>
              <div className="flex gap-2">
                <button type="button" disabled={(meta?.page || 1) <= 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className="px-3 py-1.5 border border-slate-200 rounded-md disabled:opacity-50 text-sm font-medium hover:bg-slate-50">Previous</button>
                <button type="button" disabled={(meta?.page || 1) >= (meta?.totalPages || 1)} onClick={() => setCurrentPage((p) => Math.min(meta?.totalPages || p, p + 1))} className="px-3 py-1.5 border border-slate-200 rounded-md disabled:opacity-50 text-sm font-medium hover:bg-slate-50">Next</button>
              </div>
            </div>
          </div>
        )}

        {showReceipt && selectedFee && (
          <div className="fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-3"><Icons.CheckCircle className="w-6 h-6 text-green-500" /><div><h3 className="text-lg font-semibold text-slate-900">Payment Receipt</h3><p className="text-xs text-slate-500">Login Fee Payment</p></div></div>
                <button type="button" onClick={() => setShowReceipt(false)} className="p-2 rounded-md hover:bg-slate-100"><Icons.X className="w-4 h-4" /></button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm"><div><p className="text-slate-500 text-xs uppercase font-semibold">Application Number</p><p className="font-mono font-semibold text-slate-900 mt-1">{selectedFee.applicationNumber}</p></div><div><p className="text-slate-500 text-xs uppercase font-semibold">Lead Number</p><p className="font-mono font-semibold text-slate-900 mt-1">{selectedFee.leadNumber || selectedFee.leadId}</p></div><div><p className="text-slate-500 text-xs uppercase font-semibold">Applicant</p><p className="font-semibold text-slate-900 mt-1">{selectedFee.applicantName}</p></div><div><p className="text-slate-500 text-xs uppercase font-semibold">Mobile</p><p className="font-semibold text-slate-900 mt-1">{selectedFee.mobileNumber}</p></div></div>
                <div className="border rounded-xl p-5 bg-gradient-to-br from-slate-50 to-slate-100"><h4 className="text-sm font-semibold text-slate-900 mb-3">Amount Details</h4><div className="space-y-2.5 text-sm"><div className="flex justify-between"><span className="text-slate-600">Base Fee</span><span className="font-semibold text-slate-900">{formatINR(selectedFee.feeAmount)}</span></div><div className="flex justify-between"><span className="text-slate-600">GST (18%)</span><span className="font-semibold text-slate-900">{formatINR(selectedFee.gstAmount)}</span></div><div className="pt-2.5 border-t border-slate-300 flex justify-between items-center"><span className="font-semibold text-slate-900">Total Amount Paid</span><span className="font-bold text-2xl text-blue-700">{formatINR(selectedFee.totalAmount)}</span></div></div></div>
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-200"><h4 className="text-sm font-semibold text-slate-900 mb-3">Payment Details</h4><div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-slate-600">Payment Mode</span><span className="font-semibold text-slate-900">{selectedFee.paymentMode}</span></div><div className="flex justify-between"><span className="text-slate-600">Transaction ID</span><span className="font-mono font-semibold text-slate-900">{selectedFee.transactionId || "Generated by System"}</span></div><div className="flex justify-between"><span className="text-slate-600">Status</span><span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClasses[selectedFee.status]}`}>{selectedFee.status}</span></div></div></div>
                <div className="flex justify-end gap-2"><button type="button" onClick={() => window.print()} className="px-6 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 font-medium text-slate-900 flex items-center gap-2"><Icons.Printer className="w-4 h-4" />Print Receipt</button><button type="button" onClick={() => setShowReceipt(false)} className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium">Done</button></div>
              </div>
            </div>
          </div>
        )}

        {(loading || isFetching) && (<div className="fixed bottom-4 right-4 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm shadow-lg flex items-center gap-2"><Icons.Loader className="w-4 h-4 animate-spin" />Syncing data...</div>)}
      </div>
    </div>
  );
}
