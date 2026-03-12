import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  Download,
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MoreVertical,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
  Building,
  Briefcase,
  Home,
  Car,
  FileText,
  Target,
  Percent,
  Hash,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Mail,
  PhoneCall,
  MessageSquare,
  Banknote,
  CreditCard,
} from "lucide-react";
import {
  DISBURS_COLLECTION_BRANCHES_DATA,
  DISBURS_COLLECTION_COMPARISON_DATA,
  DISBURS_COLLECTION_FINANCIAL_SUMMARY,
  DISBURS_COLLECTION_PERFORMANCE_CARD_CONFIG,
  DISBURS_COLLECTION_PERFORMANCE_DATA,
  DISBURS_COLLECTION_PRODUCTS_DATA,
  DISBURS_COLLECTION_RECENT_DISBURSEMENTS,
  DISBURS_COLLECTION_SECONDARY_PERFORMANCE_CARD_CONFIG,
  DISBURS_COLLECTION_TOP_COLLECTORS,
} from "../../../lib/ReportsDummyData";
import { colorVariables } from "../../../lib";
import StatusCard from "../../../components/common/StatusCard";
import ActionMenu from "../../../components/common/ActionMenu";
import Button from "../../../components/ui/Button";
import SelectField from "../../../components/ui/SelectField";

const DISBURS_COLLECTION_ICON_MAP = {
  TrendingUp,
  Banknote,
  Percent,
  Users,
  DollarSign,
  AlertCircle,
  Target,
  Clock,
  Calendar,
};

const TIME_RANGE_OPTIONS = [
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Yearly", value: "yearly" },
];

const COMPARISON_RANGE_OPTIONS = [
  { label: "Last 6 Months", value: "last_6_months" },
  { label: "Last 12 Months", value: "last_12_months" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Yearly", value: "yearly" },
];

// --- UTILITY FUNCTIONS ---
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatNumber = (num) => {
  return new Intl.NumberFormat("en-IN").format(num);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// --- PERFORMANCE CARD COMPONENT ---
const PerformanceCard = ({ title, value, change, trend, icon, color }) => {
  const numericTrend = Number.parseFloat(String(change).replace(/[^0-9.]/g, ""));
  const variant = color.includes("green")
    ? "green"
    : color.includes("red")
      ? "red"
      : color.includes("orange")
        ? "orange"
        : color.includes("purple")
          ? "purple"
          : "blue";

  return (
    <StatusCard
      title={title}
      value={value}
      subtext={change}
      icon={icon}
      variant={variant}
      trend={{ value: Number.isFinite(numericTrend) ? numericTrend : 0, isPositive: trend !== "down" }}
      className={`border-l-4 ${color}`}
    />
  );
};

// --- COMPARISON CHART COMPONENT ---
const ComparisonChart = ({ data }) => {
  const [comparisonRange, setComparisonRange] = useState("last_6_months");
  const maxValue = Math.max(
    ...data.months.map((m) => Math.max(m.disbursed, m.collected)),
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Monthly Comparison
          </h3>
          <p className="text-sm text-gray-500">
            Disbursement vs Collection trends
          </p>
        </div>
        <SelectField
          value={comparisonRange}
          onChange={setComparisonRange}
          options={COMPARISON_RANGE_OPTIONS}
          className="w-44"
        />
      </div>

      <div className="space-y-4">
        {data.months.map((month, index) => {
          const disbursedWidth = (month.disbursed / maxValue) * 100;
          const collectedWidth = (month.collected / maxValue) * 100;

          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">{month.name}</span>
                <div className="flex gap-4">
                  <span className={colorVariables.PRIMARY_COLOR}>
                    {formatCurrency(month.disbursed)}
                  </span>
                  <span className="text-green-600">
                    {formatCurrency(month.collected)}
                  </span>
                </div>
              </div>
              <div className="h-8 flex gap-2">
                <div
                  className="bg-blue-100 rounded-l-lg relative group"
                  style={{ width: `${disbursedWidth}%` }}
                >
                  <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-blue-600 rounded-l-lg"></div>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Disbursed: {formatCurrency(month.disbursed)}
                  </div>
                </div>
                <div
                  className="bg-green-100 rounded-r-lg relative group"
                  style={{ width: `${collectedWidth}%` }}
                >
                  <div className="absolute inset-0 bg-linear-to-r from-green-500 to-green-600 rounded-r-lg"></div>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Collected: {formatCurrency(month.collected)}
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Disbursement</span>
                <span>Collection</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-linear-to-r from-blue-500 to-blue-600"></div>
          <span className="text-sm text-gray-600">Disbursement</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-linear-to-r from-green-500 to-green-600"></div>
          <span className="text-sm text-gray-600">Collection</span>
        </div>
      </div>
    </div>
  );
};

// --- PRODUCT PERFORMANCE COMPONENT ---
const ProductPerformance = ({ products }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        Product Performance
      </h3>
      <div className="space-y-4">
        {products.map((product, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    product.name === "Personal Loan"
                      ? `${colorVariables.LIGHT_BG} ${colorVariables.PRIMARY_COLOR}`
                      : product.name === "Business Loan"
                        ? "bg-purple-50 text-purple-600"
                        : product.name === "Home Loan"
                          ? "bg-green-50 text-green-600"
                          : "bg-orange-50 text-orange-600"
                  }`}
                >
                  {product.name === "Personal Loan" ? (
                    <Briefcase className="w-5 h-5" />
                  ) : product.name === "Business Loan" ? (
                    <Building className="w-5 h-5" />
                  ) : product.name === "Home Loan" ? (
                    <Home className="w-5 h-5" />
                  ) : (
                    <Car className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{product.name}</h4>
                  <p className="text-xs text-gray-500">
                    {product.loans} active loans
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-800">
                  {formatCurrency(product.disbursed)}
                </div>
                <div className="text-sm text-green-600">
                  {formatCurrency(product.collected)}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Collection Ratio</span>
                <span
                  className={`font-medium ${
                    product.ratio >= 80
                      ? "text-green-600"
                      : product.ratio >= 60
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {product.ratio}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    product.ratio >= 80
                      ? "bg-green-500"
                      : product.ratio >= 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${product.ratio}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- BRANCH PERFORMANCE COMPONENT ---
const BranchPerformance = ({ branches }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Branch Performance
          </h3>
          <p className="text-sm text-gray-500">
            Disbursement vs Collection by branch
          </p>
        </div>
        <button
          className={`text-sm font-medium ${colorVariables.PRIMARY_COLOR} hover:text-blue-700`}
        >
          View All Branches
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                Branch
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                Disbursed
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                Collected
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                Ratio
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                Performance
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {branches.map((branch, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Building className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        {branch.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {branch.manager}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div
                    className={`font-medium ${colorVariables.PRIMARY_COLOR}`}
                  >
                    {formatCurrency(branch.disbursed)}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="font-medium text-green-600">
                    {formatCurrency(branch.collected)}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold ${
                        branch.ratio >= 80
                          ? "text-green-600"
                          : branch.ratio >= 60
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {branch.ratio}%
                    </span>
                    {branch.ratio >= 80 ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                    ) : branch.ratio >= 60 ? (
                      <ArrowUpRight className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      branch.performance === "Excellent"
                        ? "bg-green-50 text-green-700"
                        : branch.performance === "Good"
                          ? `${colorVariables.LIGHT_BG} text-blue-700`
                          : branch.performance === "Average"
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-red-50 text-red-700"
                    }`}
                  >
                    {branch.performance}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- RECENT DISBURSEMENTS COMPONENT ---
const RecentDisbursements = ({ disbursements }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Recent Disbursements
          </h3>
          <p className="text-sm text-gray-500">Latest loan disbursements</p>
        </div>
        <button
          className={`text-sm font-medium ${colorVariables.PRIMARY_COLOR} hover:text-blue-700`}
        >
          View All
        </button>
      </div>

      <div className="space-y-4">
        {disbursements.map((disbursement, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-medium text-gray-800">
                  {disbursement.customer}
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                  <span className={`font-mono ${colorVariables.PRIMARY_COLOR}`}>
                    {disbursement.loanNumber}
                  </span>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                    {disbursement.product}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-800">
                  {formatCurrency(disbursement.amount)}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDate(disbursement.date)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-gray-600">
                  <Building className="w-3 h-3" />
                  {disbursement.branch}
                </span>
                <span className="flex items-center gap-1 text-gray-600">
                  <Users className="w-3 h-3" />
                  {disbursement.officer}
                </span>
              </div>
              <ActionMenu
                actions={[
                  {
                    label: "View Details",
                    icon: <Eye />,
                    onClick: () => alert(`Viewing ${disbursement.loanNumber}`),
                  },
                  {
                    label: "Call Customer",
                    icon: <PhoneCall />,
                    onClick: () => alert(`Calling ${disbursement.customer}`),
                  },
                ]}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- TOP COLLECTORS COMPONENT ---
const TopCollectors = ({ collectors }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Top Collectors
          </h3>
          <p className="text-sm text-gray-500">
            Highest performing collection executives
          </p>
        </div>
        <button
          className={`text-sm font-medium ${colorVariables.PRIMARY_COLOR} hover:text-blue-700`}
        >
          View All
        </button>
      </div>

      <div className="space-y-4">
        {collectors.map((collector, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {collector.name.charAt(0)}
                </div>
                {index < 3 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                    {index + 1}
                  </div>
                )}
              </div>
              <div>
                <div className="font-medium text-gray-800">
                  {collector.name}
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Building className="w-3 h-3" />
                  {collector.branch} • {collector.assigned} loans
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-bold text-gray-800">
                {formatCurrency(collector.collected)}
              </div>
              <div
                className={`text-xs font-medium ${
                  collector.performance >= 90
                    ? "text-green-600"
                    : collector.performance >= 80
                      ? colorVariables.PRIMARY_COLOR
                      : "text-yellow-600"
                }`}
              >
                {collector.performance}% efficiency
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function DisbursCollectionPage() {
  const [timeRange, setTimeRange] = useState("monthly");

  const performanceCards = DISBURS_COLLECTION_PERFORMANCE_CARD_CONFIG.map(
    (card) => {
      const Icon = DISBURS_COLLECTION_ICON_MAP[card.iconName] || BarChart3;
      const rawValue = DISBURS_COLLECTION_PERFORMANCE_DATA[card.valueKey];

      let value = rawValue;

      if (card.valueFormat === "currency") value = formatCurrency(rawValue);
      if (card.valueFormat === "number") value = formatNumber(rawValue);
      if (card.valueSuffix) value = `${rawValue}${card.valueSuffix}`;

      return {
        ...card,
        value,
        icon: Icon,
      };
    },
  );

  const performanceCards2 =
    DISBURS_COLLECTION_SECONDARY_PERFORMANCE_CARD_CONFIG.map((card) => {
      const Icon = DISBURS_COLLECTION_ICON_MAP[card.iconName] || BarChart3;
      const rawValue = DISBURS_COLLECTION_PERFORMANCE_DATA[card.valueKey];

      let value = rawValue;

      if (card.valueFormat === "currency") value = formatCurrency(rawValue);
      if (card.valueFormat === "number") value = formatNumber(rawValue);
      if (card.valueSuffix) value = `${rawValue}${card.valueSuffix}`;

      return {
        ...card,
        value,
        icon: Icon,
      };
    });

  const financialSummaryCards = DISBURS_COLLECTION_FINANCIAL_SUMMARY.map(
    (card) => {
      const Icon = DISBURS_COLLECTION_ICON_MAP[card.iconName] || DollarSign;

      const value =
        card.valueType === "netDisbursement"
          ? formatCurrency(
              DISBURS_COLLECTION_PERFORMANCE_DATA.totalDisbursed -
                DISBURS_COLLECTION_PERFORMANCE_DATA.totalCollected,
            )
          : card.value;

      return {
        ...card,
        value,
        icon: <Icon className={`w-5 h-5 ${card.iconColorClass}`} />,
      };
    },
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
              <div className="p-2 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl">
                <BarChart3 className="text-white" size={28} />
              </div>
              <span>Disbursement vs Collection</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Track loan disbursements, collections, and financial performance
            </p>
          </div>

          <div className="flex gap-3 mt-4 md:mt-0">
            <SelectField
              value={timeRange}
              onChange={setTimeRange}
              options={TIME_RANGE_OPTIONS}
              className="w-40"
            />
            <Button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
              <Download size={18} />
              Export
            </Button>
          </div>
        </div>

        {/* Performance Cards Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {performanceCards.map((card, index) => (
            <PerformanceCard key={index} {...card} />
          ))}
        </div>

        {/* Performance Cards Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {performanceCards2.map((card, index) => (
            <PerformanceCard key={index} {...card} />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Comparison Chart */}
          <ComparisonChart data={DISBURS_COLLECTION_COMPARISON_DATA} />

          {/* Branch Performance */}
          <BranchPerformance branches={DISBURS_COLLECTION_BRANCHES_DATA} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Product Performance */}
          <ProductPerformance products={DISBURS_COLLECTION_PRODUCTS_DATA} />

          {/* Top Collectors */}
          <TopCollectors collectors={DISBURS_COLLECTION_TOP_COLLECTORS} />
        </div>
      </div>

      {/* Recent Disbursements */}
      <div className="mb-6">
        <RecentDisbursements
          disbursements={DISBURS_COLLECTION_RECENT_DISBURSEMENTS}
        />
      </div>

      {/* Summary Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Financial Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {financialSummaryCards.map((card) => (
            <div
              key={card.title}
              className={`p-4 ${card.backgroundClass} rounded-lg`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white rounded-lg">{card.icon}</div>
                <div>
                  <p className="text-sm text-gray-600">{card.title}</p>
                  <p className="text-xl font-bold text-gray-800">
                    {card.value}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
