import React, { useState } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Wallet, 
  Calendar,
  Download,
  Filter,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

export default function BalanceReportPage() {
  const [dateRange, setDateRange] = useState('last30')

  // Mock data for the balance report
  const balanceData = {
    currentBalance: 12450.75,
    previousBalance: 11200.30,
    totalIncome: 8450.50,
    totalExpenses: 7200.05,
    changePercentage: 11.16,
  }

  const monthlyData = [
    { month: 'Jan', balance: 10200, income: 5200, expenses: 4800 },
    { month: 'Feb', balance: 10800, income: 5400, expenses: 4800 },
    { month: 'Mar', balance: 11200, income: 5600, expenses: 5200 },
    { month: 'Apr', balance: 11800, income: 5800, expenses: 5200 },
    { month: 'May', balance: 12450, income: 6200, expenses: 5550 },
    { month: 'Jun', balance: 13200, income: 6400, expenses: 5650 },
  ]

  const recentTransactions = [
    { id: 1, description: 'Salary Deposit', category: 'Income', amount: 5200, date: '2024-05-15', type: 'credit' },
    { id: 2, description: 'Rent Payment', category: 'Housing', amount: 1800, date: '2024-05-14', type: 'debit' },
    { id: 3, description: 'Grocery Shopping', category: 'Food', amount: 450, date: '2024-05-13', type: 'debit' },
    { id: 4, description: 'Freelance Project', category: 'Income', amount: 1200, date: '2024-05-12', type: 'credit' },
    { id: 5, description: 'Electricity Bill', category: 'Utilities', amount: 150, date: '2024-05-11', type: 'debit' },
    { id: 6, description: 'Restaurant Dinner', category: 'Food', amount: 85, date: '2024-05-10', type: 'debit' },
  ]

  const maxBalance = Math.max(...monthlyData.map(d => d.balance))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Balance Report</h1>
              <p className="text-gray-500 mt-1">Track your financial health and balance trends</p>
            </div>
            <div className="flex gap-3">
              <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Calendar className="w-4 h-4" />
                {dateRange === 'last30' ? 'Last 30 Days' : 'Custom'}
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Wallet className="w-5 h-5 text-blue-600" />
              </div>
              <span className={`text-sm font-medium flex items-center gap-1 ${balanceData.changePercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {balanceData.changePercentage >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(balanceData.changePercentage)}%
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-500">Current Balance</h3>
            <p className="text-2xl font-bold text-gray-900">${balanceData.currentBalance.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-2">vs ${balanceData.previousBalance.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-500">Total Income</h3>
            <p className="text-2xl font-bold text-gray-900">${balanceData.totalIncome.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-2">↑ 12.5% from last period</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-50 rounded-lg">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
            <p className="text-2xl font-bold text-gray-900">${balanceData.totalExpenses.toLocaleString()}</p>
            <p className="text-xs text-red-600 mt-2">↑ 8.3% from last period</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-500">Net Savings</h3>
            <p className="text-2xl font-bold text-gray-900">${(balanceData.totalIncome - balanceData.totalExpenses).toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-2">Income - Expenses</p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Balance Trend</h2>
              <p className="text-sm text-gray-500">Monthly balance overview for the last 6 months</p>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
          
          {/* Custom Bar Chart */}
          <div className="relative h-80">
            <div className="absolute inset-0 flex items-end justify-between gap-4">
              {monthlyData.map((data, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full group">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-500 cursor-pointer"
                      style={{ height: `${(data.balance / maxBalance) * 200}px` }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        ${data.balance.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center mt-2">
                    <span className="text-xs font-medium text-gray-600">{data.month}</span>
                    <span className="text-xs text-gray-400 mt-1">
                      ${data.income}k / ${data.expenses}k
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex justify-center gap-6 mt-8 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Balance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-600">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span className="text-sm text-gray-600">Expenses</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Transactions */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                  <p className="text-sm text-gray-500">Your latest financial activities</p>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        transaction.type === 'credit' ? 'bg-green-50' : 'bg-red-50'
                      }`}>
                        {transaction.type === 'credit' ? (
                          <ArrowUpRight className={`w-4 h-4 text-green-600`} />
                        ) : (
                          <ArrowDownRight className={`w-4 h-4 text-red-600`} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{transaction.category}</span>
                          <span className="text-xs text-gray-300">•</span>
                          <span className="text-xs text-gray-500">{transaction.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-semibold ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toLocaleString()}
                      </span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary & Insights */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Financial Insights</h3>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    📈 Your balance has grown by <strong>11.16%</strong> over the last period
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-900">
                    💡 Tip: Reduce dining out expenses which increased by 15% this month
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-900">
                    🎯 You're on track to reach your savings goal by December
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  📊 Generate Detailed Report
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  📅 Set Budget Alerts
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  💰 Create Savings Goal
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}