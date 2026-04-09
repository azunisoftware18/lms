import { useState, useMemo } from "react";
import * as Icons from "lucide-react";
import { recentLoans } from "../../lib/dashboardDummyData";
import DashboardTable from "../../components/tables/DashboardTable";

export default function AdminDashboardPage() {
  /* EMI STATE */
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(10.5);
  const [tenure, setTenure] = useState(24);
  const [selectedPeriod, setSelectedPeriod] = useState("weekly");
  const [selectedChart, setSelectedChart] = useState("both");
  const [selectedLoanType, setSelectedLoanType] = useState("all");

  /* EMI CALCULATION */
  const { emi, totalInterest, totalPayment } = useMemo(() => {
    const p = parseFloat(loanAmount);
    const r = parseFloat(interestRate) / 12 / 100;
    const n = parseFloat(tenure);

    const calculatedEmi =
      (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPay = calculatedEmi * n;
    const totalInt = totalPay - p;

    return {
      emi: Math.round(calculatedEmi).toLocaleString("en-IN"),
      totalInterest: Math.round(totalInt).toLocaleString("en-IN"),
      totalPayment: Math.round(totalPay).toLocaleString("en-IN"),
    };
  }, [loanAmount, interestRate, tenure]);

  const stats = [
    {
      label: "Total Loans",
      value: "₹24.5L",
      change: "+12%",
      icon: "Wallet",
      color: "blue",
      subtext: "234 active loans",
    },
    {
      label: "Active Loans",
      value: "₹18.2L",
      change: "+5%",
      icon: "CreditCard",
      color: "green",
      subtext: "156 ongoing",
    },
    {
      label: "Recovered",
      value: "₹6.3L",
      change: "+18%",
      icon: "CheckCircle",
      color: "emerald",
      subtext: "78 completed",
    },
    {
      label: "Default Rate",
      value: "2.4%",
      change: "-0.5%",
      icon: "AlertTriangle",
      color: "orange",
      subtext: "12 defaults",
    },
  ];

  // Loan Distribution Data
  const loanDistribution = [
    {
      type: "Personal Loan",
      amount: "₹8.5L",
      percentage: 35,
      color: "blue",
      count: 82,
    },
    {
      type: "Home Loan",
      amount: "₹12.2L",
      percentage: 50,
      color: "green",
      count: 45,
    },
    {
      type: "Business Loan",
      amount: "₹3.8L",
      percentage: 15,
      color: "orange",
      count: 29,
    },
  ];

  // Monthly Trends
  const monthlyTrends = [
    { month: "Jan", disbursed: 4.2, recovered: 3.8, pending: 2.1 },
    { month: "Feb", disbursed: 4.8, recovered: 4.1, pending: 2.4 },
    { month: "Mar", disbursed: 5.1, recovered: 4.5, pending: 2.6 },
    { month: "Apr", disbursed: 5.5, recovered: 4.9, pending: 2.8 },
    { month: "May", disbursed: 6.2, recovered: 5.2, pending: 3.1 },
    { month: "Jun", disbursed: 6.8, recovered: 5.8, pending: 3.4 },
    { month: "Jul", disbursed: 7.8, recovered: 3.8, pending: 4.4 },
    { month: "Aug", disbursed: 6.8, recovered: 5.8, pending: 3.4 },
    { month: "Sep", disbursed: 6.8, recovered: 5.8, pending: 3.4 },
    { month: "Oct", disbursed: 6.8, recovered: 5.8, pending: 3.4 },
    { month: "Nov", disbursed: 6.8, recovered: 5.8, pending: 3.4 },
    { month: "Dec", disbursed: 6.8, recovered: 5.8, pending: 3.4 },
  ];

  // compute max for scaling vertical bars
  const maxTrend =
    Math.max(
      ...monthlyTrends.flatMap((t) => [t.disbursed || 0, t.recovered || 0]),
    ) || 1;

  // Recent Applications
  const recentApplications = [
    {
      id: 1,
      name: "Rahul Sharma",
      amount: "₹5,00,000",
      type: "Personal",
      status: "pending",
      date: "2024-03-15",
      score: 750,
    },
    {
      id: 2,
      name: "Priya Patel",
      amount: "₹12,00,000",
      type: "Home",
      status: "approved",
      date: "2024-03-14",
      score: 820,
    },
    {
      id: 3,
      name: "Amit Kumar",
      amount: "₹3,50,000",
      type: "Business",
      status: "reviewing",
      date: "2024-03-14",
      score: 680,
    },
    {
      id: 4,
      name: "Neha Singh",
      amount: "₹7,50,000",
      type: "Personal",
      status: "pending",
      date: "2024-03-13",
      score: 710,
    },
    {
      id: 5,
      name: "Vikram Mehta",
      amount: "₹15,00,000",
      type: "Home",
      status: "approved",
      date: "2024-03-12",
      score: 790,
    },
  ];

  // Upcoming EMIs
  const upcomingEmis = [
    {
      id: 1,
      name: "Rajesh Kumar",
      amount: "₹12,500",
      dueDate: "Mar 20, 2024",
      status: "upcoming",
      daysLeft: 3,
    },
    {
      id: 2,
      name: "Sneha Reddy",
      amount: "₹8,200",
      dueDate: "Mar 22, 2024",
      status: "upcoming",
      daysLeft: 5,
    },
    {
      id: 3,
      name: "Amit Patel",
      amount: "₹15,000",
      dueDate: "Mar 18, 2024",
      status: "urgent",
      daysLeft: 1,
    },
    {
      id: 4,
      name: "Neha Gupta",
      amount: "₹6,800",
      dueDate: "Mar 25, 2024",
      status: "upcoming",
      daysLeft: 8,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "reviewing":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {stats.map((stat, idx) => {
            const IconComponent = Icons[stat.icon];
            const colorClasses = {
              blue: "from-blue-500 to-blue-600",
              green: "from-green-500 to-green-600",
              emerald: "from-emerald-500 to-emerald-600",
              orange: "from-orange-500 to-orange-600",
            };

            return (
              <div
                key={idx}
                className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                    <p
                      className={`text-xs font-medium mt-2 ${
                        stat.change.startsWith("+")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change} from last month
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{stat.subtext}</p>
                  </div>
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[stat.color]} shadow-lg`}
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Grid - 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chart Section with Tabs */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Loan Performance Trends
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Monthly disbursement vs recovery
                  </p>
                </div>
                <div className="flex gap-2">
                  {["disbursement", "recovery", "both"].map((chart) => (
                    <button
                      key={chart}
                      onClick={() => setSelectedChart(chart)}
                      className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                        selectedChart === chart
                          ? "bg-green-600 text-white shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {chart.charAt(0).toUpperCase() + chart.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vertical Grouped Bar Chart with Y-axis */}
              <div className="pt-2">
                <div className="flex">
                  {/* Y-axis */}
                  <div className="w-12 flex flex-col items-end pr-3">
                    {[100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0].map((v) => (
                      <div key={v} className="h-5 flex items-center">
                        <span className="text-xs text-gray-400">{v}%</span>
                      </div>
                    ))}
                  </div>

                  {/* Bars area */}
                  <div className="flex-1 relative">
                    {/* horizontal grid lines */}
                    {[100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0].map((v) => (
                      <div
                        key={v}
                        style={{ top: `${100 - v}px` }}
                        className="absolute left-0 right-0 border-t border-dashed border-gray-100 pointer-events-none"
                      />
                    ))}

                    <div className="flex items-end gap-2 h-56 px-2">
                      {monthlyTrends.map((trend, idx) => {
                        const disbPct = Math.max(
                          0,
                          Math.round((trend.disbursed / maxTrend) * 100),
                        );
                        const recPct = Math.max(
                          0,
                          Math.round((trend.recovered / maxTrend) * 100),
                        );
                        const showDisb =
                          selectedChart === "disbursement" ||
                          selectedChart === "both";
                        const showRec =
                          selectedChart === "recovery" ||
                          selectedChart === "both";

                        return (
                          <div
                            key={idx}
                            className="flex flex-col items-center w-10"
                          >
                            <div className="flex items-end gap-2 h-44">
                              {showDisb ? (
                                <div
                                  className="w-1 rounded-t-md shadow-sm transition-all hover:scale-105"
                                  style={{
                                    height: `${disbPct}%`,
                                    background:
                                      "linear-gradient(180deg,#fb7185,#ef4444)",
                                  }}
                                  title={`Disbursed: ${trend.disbursed}L`}
                                />
                              ) : (
                                <div className="w-3" />
                              )}

                              {showRec ? (
                                <div
                                  className="w-1 rounded-t-md shadow-sm transition-all hover:scale-105"
                                  style={{
                                    height: `${recPct}%`,
                                    background:
                                      "linear-gradient(180deg,#34d399,#059669)",
                                  }}
                                  title={`Recovered: ${trend.recovered}L`}
                                />
                              ) : (
                                <div className="w-3" />
                              )}
                            </div>
                            <div className="text-xs text-gray-600 mt-2">
                              {trend.month}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-700"></div>
                    <span className="text-sm text-gray-600">
                      Disbursed Amount
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-700"></div>
                    <span className="text-sm text-gray-600">
                      Recovered Amount
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Loan Distribution */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Loan Portfolio Distribution
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    By loan type and volume
                  </p>
                </div>
                <select
                  className="px-3 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  value={selectedLoanType}
                  onChange={(e) => setSelectedLoanType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="personal">Personal Loan</option>
                  <option value="home">Home Loan</option>
                  <option value="business">Business Loan</option>
                </select>
              </div>

              <div className="space-y-4">
                {loanDistribution.map((loan, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-2">
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          {loan.type}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {loan.count} loans
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {loan.amount}
                      </span>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`bg-${loan.color}-500 h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${loan.percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500">
                          {loan.percentage}% of portfolio
                        </span>
                        <span className="text-xs text-gray-500">
                          ₹{loan.amount}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">
                      Total Portfolio Value
                    </p>
                    <p className="text-2xl font-bold text-gray-900">₹24.5L</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      Average Interest Rate
                    </p>
                    <p className="text-2xl font-bold text-gray-900">10.5%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Applications Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Recent Applications
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    New loan applications waiting for review
                  </p>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Applicant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Credit Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentApplications.map((app) => (
                      <tr
                        key={app.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {app.name}
                            </p>
                            <p className="text-xs text-gray-500">{app.date}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          {app.amount}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {app.type}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-sm font-medium ${
                              app.score >= 750
                                ? "text-green-600"
                                : app.score >= 700
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }`}
                          >
                            {app.score}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(app.status)}`}
                          >
                            {app.status.charAt(0).toUpperCase() +
                              app.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Recovery Chart */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex flex-col">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Recovery Status
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Overall collection rate
                  </p>
                </div>
                <div className="flex gap-3 mt-3 mb-3">
                  {["weekly", "monthly", "yearly"].map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className={`px-3 py-1 text-xs font-medium rounded-lg transition-all text-left ${
                        selectedPeriod === period
                          ? "bg-green-600 text-white shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative flex justify-center">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      fill="none"
                      stroke="#FECACA"
                      strokeWidth="12"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      fill="none"
                      stroke="#16A34A"
                      strokeWidth="12"
                      strokeDasharray={`${2 * Math.PI * 88}`}
                      strokeDashoffset={`${2 * Math.PI * 88 * (1 - 0.85)}`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">
                      85%
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      Recovered
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-600"></div>
                  <span className="text-sm text-gray-600">
                    Collected (₹5.4L)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-200"></div>
                  <span className="text-sm text-gray-600">Pending (₹0.9L)</span>
                </div>
              </div>
            </div>

            {/* Upcoming EMIs */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900">Upcoming EMIs</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Due in next 7 days
                  </p>
                </div>
                <Icons.Bell className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {upcomingEmis.map((emi) => (
                  <div
                    key={emi.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          emi.status === "urgent" ? "bg-red-100" : "bg-blue-100"
                        }`}
                      >
                        <Icons.User
                          className={`w-5 h-5 ${
                            emi.status === "urgent"
                              ? "text-red-600"
                              : "text-blue-600"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {emi.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Due: {emi.dueDate}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{emi.amount}</p>
                      {emi.status === "urgent" && (
                        <span className="text-xs text-red-600 font-medium">
                          {emi.daysLeft} day left
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-center text-sm text-blue-600 font-medium hover:text-blue-700">
                View All EMIs →
              </button>
            </div>

            {/* EMI Calculator */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Icons.Calculator className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    EMI Calculator
                  </h3>
                  <p className="text-xs text-gray-500">
                    Calculate your monthly payments
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Loan Amount */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Loan Amount</span>
                    <span className="font-semibold text-gray-900">
                      ₹{loanAmount.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="5000000"
                    step="10000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>₹50K</span>
                    <span>₹50L</span>
                  </div>
                </div>

                {/* Interest Rate */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Interest Rate</span>
                    <span className="font-semibold text-gray-900">
                      {interestRate}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    step="0.5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Tenure */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Tenure</span>
                    <span className="font-semibold text-gray-900">
                      {tenure} months
                    </span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="60"
                    step="1"
                    value={tenure}
                    onChange={(e) => setTenure(e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Results */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 mt-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-blue-700 font-medium">
                      Monthly EMI
                    </span>
                    <span className="text-2xl font-bold text-blue-900">
                      ₹{emi}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-blue-200">
                    <div>
                      <p className="text-xs text-blue-600">Total Interest</p>
                      <p className="text-sm font-semibold text-blue-900">
                        ₹{totalInterest}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600">Total Payment</p>
                      <p className="text-sm font-semibold text-blue-900">
                        ₹{totalPayment}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm font-medium">
                  <Icons.Plus className="w-4 h-4" />
                  New Loan
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all text-sm font-medium">
                  <Icons.Download className="w-4 h-4" />
                  Export Data
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all text-sm font-medium">
                  <Icons.Mail className="w-4 h-4" />
                  Send Report
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all text-sm font-medium">
                  <Icons.Settings className="w-4 h-4" />
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Loans Table - Full Width */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">All Active Loans</h2>
              <p className="text-xs text-gray-500 mt-1">
                Complete list of all loan accounts
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-all">
                <Icons.Filter className="w-4 h-4 inline mr-1" />
                Filter
              </button>
              <button className="px-3 py-1.5 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-all">
                <Icons.Search className="w-4 h-4 inline mr-1" />
                Search
              </button>
            </div>
          </div>
          <DashboardTable loans={recentLoans} />
        </div>
      </div>
    </div>
  );
}
