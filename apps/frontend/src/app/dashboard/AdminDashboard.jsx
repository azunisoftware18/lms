import { useState, useMemo } from "react";

import { Icons } from "../../components/common/Icon";
import { dashboardStats, recentLoans } from "../../lib/dashboardDummyData";
import DashboardTable from "../../components/tables/DashboardTable";

export default function AdminDashboardPage() {
  /* EMI STATE */

  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(10.5);
  const [tenure, setTenure] = useState(24);

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

  return (
    <div className="space-y-6">
      {/* ===== TOP STATS ===== */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat) => {
          const Icon = Icons?.[stat.icon] || Icons.AlertCircle;

          return (
            <div
              key={stat.title}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-36 hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    {stat.title}
                  </p>

                  <h3 className="text-2xl font-bold text-gray-800 mt-1">
                    {stat.value}
                  </h3>
                </div>

                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <Icon size={20} />
                </div>
              </div>

              <p className="text-xs text-gray-400">{stat.note}</p>
            </div>
          );
        })}
      </div>

      {/* ===== MAIN GRID ===== */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== LEFT SIDE TABLE ===== */}

        <div className="lg:col-span-2">
          <DashboardTable loans={recentLoans} />
        </div>

        {/* ===== RIGHT SIDE ===== */}

        <div className="space-y-6">
          {/* ===== RECOVERY CHART ===== */}

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Icons.PieChart size={18} className="text-blue-600" />
              Recovery Status
            </h3>

            <div className="flex items-center justify-center py-4">
              <div className="relative w-32 h-32 rounded-full border-[10px] border-gray-100 flex items-center justify-center">
                <div
                  className="absolute inset-0 rounded-full border-[10px] border-blue-600 border-t-transparent border-r-transparent transform -rotate-45"
                  style={{ clipPath: "circle(50%)" }}
                />

                <div className="text-center">
                  <span className="block text-2xl font-bold text-gray-800">
                    85%
                  </span>

                  <span className="text-xs text-gray-400">Recovered</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between text-sm mt-4 text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                Collected
              </div>

              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                Pending
              </div>
            </div>
          </div>

          {/* ===== EMI CALCULATOR ===== */}

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg shadow-blue-50">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Icons.Calculator size={20} className="text-blue-600" />
              EMI Calculator
            </h3>

            <div className="space-y-4">
              {/* Amount */}

              <div>
                <div className="flex justify-between text-xs font-medium text-gray-500 mb-1">
                  <span>Loan Amount</span>

                  <span>₹{loanAmount.toLocaleString()}</span>
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
              </div>

              {/* Interest + Tenure */}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">
                    Interest (%)
                  </label>

                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">
                    Tenure (Mo)
                  </label>

                  <input
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* RESULT */}

              <div className="bg-blue-50 rounded-xl p-4 mt-4 border border-blue-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-blue-700 font-medium">
                    Monthly EMI
                  </span>

                  <span className="text-xl font-bold text-blue-800">
                    ₹{emi}
                  </span>
                </div>

                <div className="w-full h-[1px] bg-blue-200 my-2"></div>

                <div className="flex justify-between text-xs text-blue-600">
                  <span>Total Interest</span>

                  <span className="font-semibold">₹{totalInterest}</span>
                </div>

                <div className="flex justify-between text-xs text-blue-600 mt-1">
                  <span>Total Payable</span>

                  <span className="font-semibold">₹{totalPayment}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
