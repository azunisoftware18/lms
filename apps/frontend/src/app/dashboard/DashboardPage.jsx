import { useState, useMemo } from "react";

import { Icons } from "../../components/common/Icon";
import { dashboardStats, recentLoans } from "../../lib/dashboardDummyData";

import Table from "../../components/tables/Table";
import TableHead from "../../components/tables/TableHead";
import TableBody from "../../components/tables/TableBody";
import TableRow from "../../components/tables/TableRow";
import TableCell from "../../components/tables/TableCell";

export default function DashboardPage() {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(10.5);
  const [tenure, setTenure] = useState(24);

  /* ---------------- EMI CALCULATOR ---------------- */

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

  /* ---------------- COLOR MAP ---------------- */

  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
  };

  /* ---------------- STAT CARD ---------------- */

  const StatCard = ({ stat }) => {
    const IconComponent = Icons[stat.icon];

    return (
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-sm font-medium">{stat.title}</p>

            <h3 className="text-2xl font-bold text-gray-800 mt-1">
              {stat.value}
            </h3>
          </div>

          <div className={`p-2 rounded-lg ${colorClasses[stat.color]}`}>
            <IconComponent size={20} />
          </div>
        </div>

        {stat.change && (
          <div className="flex items-center text-sm text-green-600 font-medium mt-4">
            <Icons.ArrowUpRight size={16} className="mr-1" />

            {stat.change}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* ---------- TOP STATS ---------- */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* ---------- MAIN GRID ---------- */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ---------- RECENT LOANS TABLE ---------- */}

        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-gray-800">Recent Loan Requests</h2>

            <button className="text-blue-600 text-sm hover:underline">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <Table className="w-full text-left border-collapse">
              <TableHead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <TableRow>
                  <TableCell className="px-6 py-4 font-semibold">
                    Borrower
                  </TableCell>

                  <TableCell className="px-6 py-4 font-semibold">
                    Amount
                  </TableCell>

                  <TableCell className="px-6 py-4 font-semibold">
                    Type
                  </TableCell>

                  <TableCell className="px-6 py-4 font-semibold">
                    Status
                  </TableCell>

                  <TableCell className="px-6 py-4 font-semibold text-right">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody className="divide-y divide-gray-100">
                {recentLoans.map((loan) => (
                  <TableRow
                    key={loan.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800 text-sm">
                          {loan.name}
                        </span>

                        <span className="text-xs text-gray-400">{loan.id}</span>
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-4 text-gray-700 font-medium text-sm">
                      {loan.amount}
                    </TableCell>

                    <TableCell className="px-6 py-4 text-gray-500 text-sm">
                      {loan.type}
                    </TableCell>

                    <TableCell className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border
                        ${loan.status === "Approved" && "bg-green-50 text-green-700 border-green-100"}
                        ${loan.status === "Pending" && "bg-orange-50 text-orange-700 border-orange-100"}
                        ${loan.status === "Rejected" && "bg-red-50 text-red-700 border-red-100"}
                      `}
                      >
                        {loan.status}
                      </span>
                    </TableCell>

                    <TableCell className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Icons.MoreVertical size={16} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* ---------- EMI CALCULATOR ---------- */}

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Icons.Calculator size={20} className="text-blue-600" />
            EMI Calculator
          </h3>

          <div className="space-y-4">
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">
                  Interest (%)
                </label>

                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="w-full p-2 border rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">
                  Tenure (Months)
                </label>

                <input
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(e.target.value)}
                  className="w-full p-2 border rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-blue-700 font-medium">
                  Monthly EMI
                </span>

                <span className="text-xl font-bold text-blue-800">₹{emi}</span>
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
  );
}
