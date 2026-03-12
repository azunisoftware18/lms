import React, { useState } from "react";
import {
  Target,
  TrendingUp,
  Users,
  Building2,
  Calendar,
  Search,
  Download,
  Award,
  ChevronDown,
  Filter,
  BarChart3,
  PieChart,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
} from "lucide-react";
import {
  SALES_TARGET_BRANCH_OPTIONS,
  SALES_TARGET_CHART_DATA,
  SALES_TARGET_KPI_DATA,
  SALES_TARGET_METRICS,
  SALES_TARGET_PERFORMANCE_TABLE_DATA,
  SALES_TARGET_TOP_PERFORMERS,
} from "../../../lib/ReportsDummyData";
import { colorVariables } from "../../../lib";
import Button from "../../../components/ui/Button";
import SelectField from "../../../components/ui/SelectField";
import InputField from "../../../components/ui/InputField";

const KPI_ICON_MAP = {
  Target,
  TrendingUp,
  Award,
  Users,
};

const getKpiIcon = (iconName, iconColor) => {
  const IconComponent = KPI_ICON_MAP[iconName];
  return IconComponent ? <IconComponent className={iconColor} /> : null;
};

export default function SalesTargetAndAchievementPage() {
  const [filters, setFilters] = useState({
    branch: "",
    executive: "",
    period: "monthly",
    fromDate: "",
    toDate: "",
  });

  const [selectedMetric, setSelectedMetric] = useState("all");

  const handleChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const periodOptions = [
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
    { label: "Quarterly", value: "quarterly" },
    { label: "Yearly", value: "yearly" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      {/* Enhanced Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                <Target className="text-white" size={24} />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Sales Performance Dashboard
              </h1>
            </div>
            <p className="text-gray-600">
              Track, analyze, and optimize sales performance against targets
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-none">
              <Download size={18} className="text-blue-800" />
              <span className="text-blue-800">Export Report</span>
            </Button>
            <Button
              className={`flex items-center gap-2 text-white px-4 py-2.5 rounded-xl ${colorVariables.PRIMARY_BUTTON_COLOR}`}
            >
              <Filter size={18} />
              Add Filter
            </Button>
          </div>
        </div>

        {/* Metric Toggle */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2">
          {SALES_TARGET_METRICS.map((metric) => (
            <button
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                selectedMetric === metric.id
                  ? `${colorVariables.ACCENT_COLOR_BG} text-white shadow-md`
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {SALES_TARGET_KPI_DATA.map((kpi) => (
          <KPICard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            isPositive={kpi.isPositive}
            icon={getKpiIcon(kpi.iconName, kpi.iconColor)}
            color={kpi.color}
            subtitle={kpi.subtitle}
          />
        ))}
      </div>

      {/* Main Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Performance Chart Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Performance Overview
                </h2>
                <p className="text-sm text-gray-500">
                  Monthly target vs achievement
                </p>
              </div>
              <select className="bg-gray-50 border-0 rounded-lg px-4 py-2 text-sm">
                <option>Last 6 Months</option>
                <option>Year to Date</option>
                <option>Last Year</option>
              </select>
            </div>
            <PerformanceChart />
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Top Performers
            </h2>
            <BarChart3 className="text-gray-400" size={20} />
          </div>
          <div className="space-y-4">
            {SALES_TARGET_TOP_PERFORMERS.map((exec, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {exec.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{exec.name}</p>
                    <p className="text-xs text-gray-500">
                      {exec.achieved} / {exec.target}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-linear-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                      style={{ width: `${exec.progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {exec.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters & Table Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filter Panel */}
        <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
          <div className="flex items-center gap-2 mb-6">
            <Filter size={20} className="text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          </div>

          <div className="space-y-4">
            <div>
              <SelectField
                label="Period"
                options={periodOptions}
                value={filters.period}
                onChange={(value) => setFilters({ ...filters, period: value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Branch
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SALES_TARGET_BRANCH_OPTIONS.map((branch) => (
                  <button
                    key={branch}
                    className={`py-2 px-3 rounded-lg text-sm ${
                      filters.branch === branch
                        ? `${colorVariables.LIGHT_BG} ${colorVariables.PRIMARY_COLOR} border ${colorVariables.BORDER_COLOR}`
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setFilters({ ...filters, branch })}
                  >
                    {branch}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <InputField
                    type="date"
                    name="fromDate"
                    value={filters.fromDate}
                    onChange={handleChange}
                    className="rounded-xl"
                  />
                  <p className="text-xs text-gray-500 mt-1">From</p>
                </div>
                <div>
                  <InputField
                    type="date"
                    name="toDate"
                    value={filters.toDate}
                    onChange={handleChange}
                    className="rounded-xl"
                  />
                  <p className="text-xs text-gray-500 mt-1">To</p>
                </div>
              </div>
            </div>

            <Button
              className={`w-full text-white py-3 rounded-xl font-medium mt-4 ${colorVariables.PRIMARY_BUTTON_COLOR}`}
            >
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Enhanced Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Performance Details
                  </h3>
                  <p className="text-sm text-gray-500">
                    Individual executive performance
                  </p>
                </div>
                <button className="text-gray-500 hover:text-gray-700">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">
                      Executive
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">
                      Branch
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">
                      Target
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">
                      Achieved
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">
                      Progress
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {SALES_TARGET_PERFORMANCE_TABLE_DATA.map((exec, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {exec.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {exec.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              ID: EXEC{1000 + idx}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${colorVariables.LIGHT_BG} ${colorVariables.PRIMARY_COLOR}`}
                        >
                          <Building2 size={12} />
                          {exec.branch}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-gray-900">
                        {exec.target}
                      </td>
                      <td className="p-4 font-medium text-green-600">
                        {exec.achieved}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-linear-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
                              style={{ width: `${exec.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-900 min-w-10">
                            {exec.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <StatusBadge progress={exec.progress} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, change, isPositive, icon, color, subtitle }) {
  const colorClasses = {
    blue: `${colorVariables.LIGHT_BG} ${colorVariables.BORDER_COLOR}`,
    green: "bg-green-50 border-green-200",
    purple: "bg-purple-50 border-purple-200",
    orange: "bg-orange-50 border-orange-200",
  };

  return (
    <div
      className={`rounded-2xl border p-5 transition-all hover:shadow-md ${colorClasses[color]}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <div className="flex items-center gap-1 mt-2">
            {isPositive ? (
              <TrendingUp size={16} className="text-green-500" />
            ) : (
              <TrendingDown size={16} className="text-red-500" />
            )}
            <span
              className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}
            >
              {change}
            </span>
            <span className="text-xs text-gray-500 ml-1">{subtitle}</span>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-white shadow-sm">{icon}</div>
      </div>
    </div>
  );
}

function PerformanceChart() {
  const { months, targetData, achievedData } = SALES_TARGET_CHART_DATA;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-linear-to-r from-blue-500 to-indigo-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Target</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-linear-to-r from-green-500 to-emerald-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Achieved</span>
        </div>
      </div>

      <div className="h-64 flex items-end gap-2">
        {months.map((month, idx) => (
          <div key={month} className="flex-1 flex flex-col items-center">
            <div className="w-full flex flex-col items-center justify-end h-48">
              {/* Target Bar */}
              <div
                className="w-3/4 bg-linear-to-t from-blue-500 to-indigo-500 rounded-t-lg mb-1 transition-all hover:opacity-90"
                style={{ height: `${targetData[idx]}%` }}
              />
              {/* Achieved Bar */}
              <div
                className="w-3/4 bg-linear-to-t from-green-500 to-emerald-500 rounded-t-lg transition-all hover:opacity-90"
                style={{ height: `${achievedData[idx]}%` }}
              />
            </div>
            <span className="text-sm text-gray-600 mt-2">{month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ progress }) {
  let status, bgColor, textColor, icon;

  if (progress >= 90) {
    status = "Excellent";
    bgColor = "bg-gradient-to-r from-green-50 to-emerald-50";
    textColor = "text-emerald-700";
    icon = <Award size={12} />;
  } else if (progress >= 80) {
    status = "Very Good";
    bgColor = "bg-green-50";
    textColor = "text-green-700";
    icon = <CheckCircle2 size={12} />;
  } else if (progress >= 70) {
    status = "Good";
    bgColor = colorVariables.LIGHT_BG;
    textColor = colorVariables.PRIMARY_COLOR;
    icon = <CheckCircle2 size={12} />;
  } else if (progress >= 60) {
    status = "Fair";
    bgColor = "bg-yellow-50";
    textColor = "text-yellow-700";
    icon = <AlertCircle size={12} />;
  } else {
    status = "Needs Attention";
    bgColor = "bg-red-50";
    textColor = "text-red-700";
    icon = <AlertCircle size={12} />;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${bgColor} ${textColor}`}
    >
      {icon}
      {status}
    </span>
  );
}
