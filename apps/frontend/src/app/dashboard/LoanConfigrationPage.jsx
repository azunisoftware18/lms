import React, { useState } from "react";
import { Icons } from "../../components/common/Icon";

import {
  loanConfigurationDummy,
  loanConfigCategories,
  loanConfigStats,
} from "../../lib/dashboardDummyData";

import Button from "../../components/ui/Button";
import SearchField from "../../components/ui/SearchField";

import { TableShell } from "../../components/tables/core";

import ActionMenu from "../../components/common/ActionMenu";

import Pagination from "../../components/common/Pagination";

export default function LoanConfigurationPage() {
  const [loanConfig, setLoanConfig] = useState(loanConfigurationDummy);

  const [isSaving, setIsSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState("interest");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (field, value) => {
    setLoanConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleChange = (field) => {
    setLoanConfig((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const updateLoanCategory = (index, updates) => {
    const updatedCategories = [...loanConfig.loanCategories];
    updatedCategories[index] = { ...updatedCategories[index], ...updates };
    handleInputChange("loanCategories", updatedCategories);
  };

  const saveSettings = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    // Simulate success notification
    const notification = document.createElement("div");
    notification.className =
      "fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in";
    notification.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      Loan configuration saved successfully!
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.classList.add(
        "opacity-0",
        "transition-opacity",
        "duration-300",
      );
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  const resetForm = () => {
    if (
      window.confirm("Are you sure you want to reset all settings to default?")
    ) {
      setLoanConfig(loanConfigurationDummy);
    }
  };

  const categories = loanConfigCategories.map((cat) => ({
    ...cat,
    icon: Icons[cat.icon],
  }));

  const stats = loanConfigStats.map((stat) => {
    let value = "";

    if (stat.key === "loanTypes") {
      value = loanConfig.loanCategories.filter((c) => c.active).length;
    }

    if (stat.key === "interest") {
      value = `${loanConfig.defaultInterestRate}%`;
    }

    if (stat.key === "autoApproval") {
      value = `₹${loanConfig.autoApprovalLimit.toLocaleString()}`;
    }

    if (stat.key === "creditScore") {
      value = loanConfig.creditScoreMin;
    }

    return {
      ...stat,
      value,
      icon: Icons[stat.icon],
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-green-500 to-emerald-600 rounded-xl shadow-sm">
                  <Icons.CreditCard className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Loan Configuration
                </h1>
              </div>
              <p className="text-gray-600 ml-11">
                Configure loan parameters, interest rates, and eligibility
                criteria
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Icons.Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search settings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-64 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                />
              </div>
              <Button className="p-2.5 border border-gray-300 rounded-xl hover:bg-gray-50">
                <Icons.Filter className="w-5 h-5 text-gray-600" />
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-xl ${
                      stat.icon === Icons.TrendingUp
                        ? "bg-green-50 text-green-600"
                        : stat.icon === Icons.CreditCard
                          ? "bg-blue-50 text-blue-600"
                          : stat.icon === Icons.CheckCircle
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-purple-50 text-purple-600"
                    }`}
                  >
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      stat.change.startsWith("+")
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500">vs last month</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Category Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-6">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">
                  Configuration Sections
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Manage loan settings
                </p>
              </div>
              <div className="p-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full justify-between bg-transparent text-gray-700 shadow-none px-3 py-3 mb-1 ${
                      activeCategory === category.id
                        ? "bg-green-50 to-emerald-50 border border-green-200"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          activeCategory === category.id
                            ? "bg-green-100"
                            : category.color
                        }`}
                      >
                        <category.icon
                          className={`w-4 h-4 ${
                            activeCategory === category.id
                              ? "text-green-600"
                              : category.color.replace("bg-", "text-")
                          }`}
                        />
                      </div>

                      <span className="font-medium text-gray-700">
                        {category.label}
                      </span>
                    </div>

                    {activeCategory === category.id && (
                      <Icons.ChevronRight className="w-4 h-4 text-green-600" />
                    )}
                  </Button>
                ))}
              </div>
              <div className="p-4 border-t border-gray-200">
                <Button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full justify-between bg-transparent text-gray-700 shadow-none px-3 py-3 hover:bg-gray-50"
                >
                  <span>Advanced Settings</span>

                  {showAdvanced ? (
                    <Icons.EyeOff className="w-4 h-4" />
                  ) : (
                    <Icons.Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Configuration Panel */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50 ">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {categories.find((c) => c.id === activeCategory)?.label}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Configure and manage{" "}
                      {categories
                        .find((c) => c.id === activeCategory)
                        ?.label.toLowerCase()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button className="bg-white text-gray-700 shadow-none border border-gray-300 px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition">
                      <Icons.Download className="w-4 h-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Interest & Fees Section */}
                {activeCategory === "interest" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {[
                        {
                          field: "defaultInterestRate",
                          label: "Default Interest Rate",
                          description: "Standard rate applied to loans",
                          icon: Icons.Percent,
                          unit: "%",
                          min: 0,
                          max: 100,
                          step: 0.1,
                        },
                        {
                          field: "minInterestRate",
                          label: "Minimum Rate",
                          description: "Lowest possible interest rate",
                          icon: Icons.Percent,
                          unit: "%",
                          min: 0,
                          max: 100,
                          step: 0.1,
                        },
                        {
                          field: "maxInterestRate",
                          label: "Maximum Rate",
                          description: "Highest possible interest rate",
                          icon: Icons.Percent,
                          unit: "%",
                          min: 0,
                          max: 100,
                          step: 0.1,
                        },
                        {
                          field: "latePaymentPenalty",
                          label: "Late Payment Penalty",
                          description: "Additional charge for delayed payments",
                          icon: Icons.AlertCircle,
                          unit: "%",
                          min: 0,
                          max: 100,
                          step: 0.1,
                        },
                        {
                          field: "processingFee",
                          label: "Processing Fee",
                          description: "One-time loan processing charge",
                          icon: Icons.Percent,
                          unit: "%",
                          min: 0,
                          max: 100,
                          step: 0.1,
                        },
                        {
                          field: "prepaymentCharge",
                          label: "Prepayment Charge",
                          description: "Fee for early loan repayment",
                          icon: Icons.Percent,
                          unit: "%",
                          min: 0,
                          max: 100,
                          step: 0.1,
                        },
                      ].map((item) => (
                        <div
                          key={item.field}
                          className="bg-gray-50 to-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {item.label}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {item.description}
                              </p>
                            </div>
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <item.icon className="w-4 h-4 text-gray-600" />
                            </div>
                          </div>
                          <div className="relative">
                            <input
                              type="number"
                              step={item.step}
                              min={item.min}
                              max={item.max}
                              value={loanConfig[item.field]}
                              onChange={(e) =>
                                handleInputChange(
                                  item.field,
                                  parseFloat(e.target.value),
                                )
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white"
                            />
                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                              {item.unit}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <span className="text-xs text-gray-500">
                              Min: {item.min}
                              {item.unit}
                            </span>
                            <span className="text-xs text-gray-500">
                              Max: {item.max}
                              {item.unit}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Loan Amounts Section */}
                {activeCategory === "amount" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {[
                        {
                          field: "minLoanAmount",
                          label: "Minimum Loan Amount",
                          description: "Smallest loan allowed",
                          icon: Icons.IndianRupee,
                        },
                        {
                          field: "maxLoanAmount",
                          label: "Maximum Loan Amount",
                          description: "Largest loan allowed",
                          icon: Icons.IndianRupee,
                        },
                        {
                          field: "defaultLoanAmount",
                          label: "Default Amount",
                          description: "Pre-filled loan amount",
                          icon: Icons.IndianRupee,
                        },
                        {
                          field: "autoApprovalLimit",
                          label: "Auto Approval Limit",
                          description: "Automatic approval below this amount",
                          icon: Icons.CheckCircle,
                        },
                        {
                          field: "maxLoanPerCustomer",
                          label: "Max per Customer",
                          description: "Maximum total loans per customer",
                          icon: Icons.Users,
                        },
                      ].map((item) => (
                        <div
                          key={item.field}
                          className="bg-blue-50 to-white border border-blue-100 rounded-xl p-5 hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {item.label}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {item.description}
                              </p>
                            </div>
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <item.icon className="w-4 h-4 text-blue-600" />
                            </div>
                          </div>
                          <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                              ₹
                            </div>
                            <input
                              type="number"
                              min="0"
                              value={loanConfig[item.field]}
                              onChange={(e) =>
                                handleInputChange(
                                  item.field,
                                  parseInt(e.target.value),
                                )
                              }
                              className="w-full px-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                            />
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-600">
                                INR
                              </span>
                            </div>
                          </div>
                          <div className="mt-3 text-sm text-gray-600">
                            <span className="font-medium">
                              ₹{loanConfig[item.field].toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tenure Section */}
                {activeCategory === "tenure" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {[
                        {
                          field: "minTenure",
                          label: "Minimum Tenure",
                          description: "Shortest loan duration",
                          unit: "Months",
                        },
                        {
                          field: "maxTenure",
                          label: "Maximum Tenure",
                          description: "Longest loan duration",
                          unit: "Months",
                        },
                        {
                          field: "defaultTenure",
                          label: "Default Tenure",
                          description: "Pre-selected tenure",
                          unit: "Months",
                        },
                        {
                          field: "gracePeriodDays",
                          label: "Grace Period",
                          description: "Days before late penalty",
                          unit: "Days",
                        },
                      ].map((item) => (
                        <div
                          key={item.field}
                          className="bg-green-50 to-white border border-green-100 rounded-xl p-5 hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {item.label}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {item.description}
                              </p>
                            </div>
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Icons.Clock className="w-4 h-4 text-green-600" />
                            </div>
                          </div>
                          <input
                            type="number"
                            min="1"
                            value={loanConfig[item.field]}
                            onChange={(e) =>
                              handleInputChange(
                                item.field,
                                parseInt(e.target.value),
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white"
                          />
                          <div className="mt-2 text-right">
                            <span className="text-sm text-gray-500">
                              {item.unit}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-gray-50 to-white border border-gray-200 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            EMI Calculation Method
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Select how EMI is calculated
                          </p>
                        </div>
                        <Icons.Info className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          {
                            value: "reducing_balance",
                            label: "Reducing Balance",
                            description: "Interest on remaining balance",
                          },
                          {
                            value: "flat_rate",
                            label: "Flat Rate",
                            description: "Interest on original amount",
                          },
                          {
                            value: "daily_reducing",
                            label: "Daily Reducing",
                            description: "Daily interest calculation",
                          },
                        ].map((method) => (
                          <Button
                            key={method.value}
                            onClick={() =>
                              handleInputChange("emiMethod", method.value)
                            }
                            className={`w-full bg-transparent text-left shadow-none px-4 py-4 border rounded-xl transition-all ${
                              loanConfig.emiMethod === method.value
                                ? "border-green-500 bg-green-50 ring-1 ring-green-500"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="font-medium text-gray-900">
                                {method.label}
                              </span>

                              {loanConfig.emiMethod === method.value && (
                                <Icons.CheckCircle className="w-5 h-5 text-green-600" />
                              )}
                            </div>

                            <p className="text-sm text-gray-600 mt-2">
                              {method.description}
                            </p>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Tenure Steps */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                      <h3 className="font-semibold text-gray-900 mb-4">
                        Available Tenure Options
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Select which tenure options are available to customers
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                        {[3, 6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 120].map(
                          (month) => (
                            <Button
                              key={month}
                              type="button"
                              onClick={() => {
                                const steps = loanConfig.tenureSteps.includes(
                                  month,
                                )
                                  ? loanConfig.tenureSteps.filter(
                                      (m) => m !== month,
                                    )
                                  : [...loanConfig.tenureSteps, month].sort(
                                      (a, b) => a - b,
                                    );

                                handleInputChange("tenureSteps", steps);
                              }}
                              className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-all duration-200 ${
                                loanConfig.tenureSteps.includes(month)
                                  ? "bg-green-100 border-green-400 text-green-800 ring-1 ring-green-300"
                                  : "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              <span className="text-lg font-bold">{month}</span>
                              <span className="text-xs">Months</span>
                            </Button>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Features Section */}
                {activeCategory === "features" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {[
                        {
                          field: "prepaymentAllowed",
                          label: "Prepayment",
                          description: "Enable early loan repayment",
                          icon: Icons.TrendingUp,
                        },
                        {
                          field: "foreclosureAllowed",
                          label: "Foreclosure",
                          description:
                            "Allow complete loan closure before term",
                          icon: Icons.CheckCircle,
                        },
                        {
                          field: "topUpAllowed",
                          label: "Top-up",
                          description:
                            "Enable additional loan on existing loan",
                          icon: Icons.Plus,
                        },
                        {
                          field: "loanTransferAllowed",
                          label: "Loan Transfer",
                          description: "Transfer loan to another lender",
                          icon: Icons.RefreshCw,
                        },
                        {
                          field: "coApplicantRequired",
                          label: "Co-Applicant Required",
                          description:
                            "Mandatory co-applicant for high amount loans",
                          icon: Icons.Users,
                        },
                        {
                          field: "holidayProcessing",
                          label: "Holiday Processing",
                          description: "Process payments on holidays",
                          icon: Icons.Calendar,
                        },
                      ].map((item) => (
                        <div
                          key={item.field}
                          className={`p-5 border rounded-xl transition-all ${
                            loanConfig[item.field]
                              ? "border border-orange-200  from-orange-50 to-white"
                              : "border-gray-200 bg-white hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div
                                className={`p-2 rounded-lg ${
                                  loanConfig[item.field]
                                    ? "bg-orange-100"
                                    : "bg-gray-100"
                                }`}
                              >
                                <item.icon
                                  className={`w-4 h-4 ${
                                    loanConfig[item.field]
                                      ? "text-orange-600"
                                      : "text-gray-500"
                                  }`}
                                />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {item.label}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              onClick={() => handleToggleChange(item.field)}
                              className={`w-12 h-6 rounded-full relative transition-all duration-200 ${
                                loanConfig[item.field]
                                  ? "bg-orange-500 to-orange-600"
                                  : "bg-gray-300"
                              }`}
                            >
                              <div
                                className={`absolute w-5 h-5 bg-white rounded-full shadow-sm transform transition-all ${
                                  loanConfig[item.field]
                                    ? "translate-x-7"
                                    : "translate-x-1"
                                } top-0.5`}
                              />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Co-applicant Income Requirement */}
                    {loanConfig.coApplicantRequired && (
                      <div className="bg-blue-50 to-white border border-blue-100 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Co-Applicant Requirements
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Configure minimum income for co-applicants
                            </p>
                          </div>
                          <Icons.Users className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="relative w-full md:w-96">
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                            ₹
                          </div>
                          <input
                            type="number"
                            min="0"
                            value={loanConfig.minCoApplicantIncome}
                            onChange={(e) =>
                              handleInputChange(
                                "minCoApplicantIncome",
                                parseInt(e.target.value),
                              )
                            }
                            className="w-full px-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                            placeholder="Enter minimum income"
                          />
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <span className="text-sm bg-gray-100 px-2 py-1 rounded-md text-gray-600">
                              Monthly
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Risk Settings Section */}
                {activeCategory === "risk" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {[
                        {
                          field: "maxDbrRatio",
                          label: "Max DBR Ratio",
                          description: "Maximum Debt-to-Income ratio allowed",
                          unit: "%",
                          icon: Icons.BarChart3,
                          color: "from-red-50 to-white",
                          border: "border-red-100",
                        },
                        {
                          field: "minIncomeRequirement",
                          label: "Minimum Income",
                          description: "Minimum monthly income required",
                          unit: "₹",
                          icon: Icons.IndianRupee,
                          color: "from-blue-50 to-white",
                          border: "border-blue-100",
                        },
                        {
                          field: "creditScoreMin",
                          label: "Minimum Credit Score",
                          description: "Lowest acceptable credit score",
                          unit: "Points",
                          icon: Icons.TrendingUp,
                          color: "from-purple-50 to-white",
                          border: "border-purple-100",
                        },
                        {
                          field: "employmentMinMonths",
                          label: "Employment Duration",
                          description: "Minimum months in current job",
                          unit: "Months",
                          icon: Icons.Clock,
                          color: "from-green-50 to-white",
                          border: "border-green-100",
                        },
                      ].map((item) => (
                        <div
                          key={item.field}
                          className={`bg-linear-to-br ${item.color} border ${item.border} rounded-xl p-5 hover:shadow-sm transition-shadow`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {item.label}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {item.description}
                              </p>
                            </div>
                            <div
                              className={`p-2 ${
                                item.field === "maxDbrRatio"
                                  ? "bg-red-100 text-red-600"
                                  : item.field === "minIncomeRequirement"
                                    ? "bg-blue-100 text-blue-600"
                                    : item.field === "creditScoreMin"
                                      ? "bg-purple-100 text-purple-600"
                                      : "bg-green-100 text-green-600"
                              } rounded-lg`}
                            >
                              <item.icon className="w-4 h-4" />
                            </div>
                          </div>
                          <div className="relative">
                            <input
                              type="number"
                              step={item.field === "maxDbrRatio" ? 0.1 : 1}
                              min={item.field === "creditScoreMin" ? 300 : 0}
                              max={item.field === "creditScoreMin" ? 900 : 100}
                              value={loanConfig[item.field]}
                              onChange={(e) =>
                                handleInputChange(
                                  item.field,
                                  item.field === "maxDbrRatio"
                                    ? parseFloat(e.target.value)
                                    : parseInt(e.target.value),
                                )
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white"
                            />
                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                              {item.unit}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {showAdvanced && (
                      <div className="bg-gray-50 to-white border border-gray-200 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">
                          Advanced Risk Settings
                        </h3>
                        <div className="space-y-4">
                          <p className="text-sm text-gray-600">
                            Additional risk parameters for fine-tuning approval
                            criteria
                          </p>
                          {/* Add more advanced settings here */}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Loan Types Section */}
                {activeCategory === "loanTypes" && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      {loanConfig.loanCategories.map((category, index) => (
                        <div
                          key={category.id}
                          className={`border rounded-xl overflow-hidden transition-all ${
                            category.active
                              ? "border-gray-300 bg-white to-gray-50 hover:shadow-sm"
                              : "border-gray-200 bg-gray-50 opacity-75"
                          }`}
                        >
                          <div className="p-5">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-3 h-8 ${category.color} rounded-full`}
                                ></div>
                                <div>
                                  <h3 className="font-semibold text-gray-900">
                                    {category.name}
                                  </h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span
                                      className={`text-xs px-2 py-1 rounded-full ${
                                        category.active
                                          ? "bg-green-100 text-green-800"
                                          : "bg-gray-200 text-gray-600"
                                      }`}
                                    >
                                      {category.active ? "Active" : "Inactive"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Button
                                  type="button"
                                  onClick={() =>
                                    updateLoanCategory(index, {
                                      active: !category.active,
                                    })
                                  }
                                  className={`shadow-none px-4 py-2 rounded-lg text-sm font-medium ${
                                    category.active
                                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                      : "bg-green-100 text-green-700 hover:bg-green-200"
                                  }`}
                                >
                                  {category.active ? "Deactivate" : "Activate"}
                                </Button>
                              </div>
                            </div>

                            {category.active && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                                <div className="bg-white p-4 border border-gray-200 rounded-xl">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Minimum Amount
                                  </label>
                                  <div className="relative">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                      ₹
                                    </div>
                                    <input
                                      type="number"
                                      min="0"
                                      value={category.minAmount}
                                      onChange={(e) =>
                                        updateLoanCategory(index, {
                                          minAmount: parseInt(e.target.value),
                                        })
                                      }
                                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                                    />
                                  </div>
                                  <div className="mt-2 text-sm text-gray-500">
                                    Minimum loan amount for this category
                                  </div>
                                </div>

                                <div className="bg-white p-4 border border-gray-200 rounded-xl">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Maximum Amount
                                  </label>
                                  <div className="relative">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                      ₹
                                    </div>
                                    <input
                                      type="number"
                                      min="0"
                                      value={category.maxAmount}
                                      onChange={(e) =>
                                        updateLoanCategory(index, {
                                          maxAmount: parseInt(e.target.value),
                                        })
                                      }
                                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                                    />
                                  </div>
                                  <div className="mt-2 text-sm text-gray-500">
                                    Maximum loan amount for this category
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      type="button"
                      onClick={() => {
                        const colors = [
                          "bg-blue-500",
                          "bg-green-500",
                          "bg-purple-500",
                          "bg-orange-500",
                          "bg-red-500",
                          "bg-pink-500",
                        ];

                        const newCategory = {
                          id: loanConfig.loanCategories.length + 1,
                          name: "New Loan Type",
                          active: true,
                          minAmount: 10000,
                          maxAmount: 100000,
                          color:
                            colors[Math.floor(Math.random() * colors.length)],
                        };

                        handleInputChange("loanCategories", [
                          ...loanConfig.loanCategories,
                          newCategory,
                        ]);
                      }}
                      className="w-full bg-transparent text-gray-600 shadow-none p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Icons.Plus className="w-5 h-5" />
                      Add New Loan Type
                    </Button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-6 border-t border-gray-200 bg-gray-50 to-white">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-green-100 rounded-lg">
                      <Icons.Settings className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Configuration Ready
                      </p>
                      <p className="text-sm text-gray-600">
                        Review and save your loan settings
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      type="button"
                      onClick={resetForm}
                      className="bg-transparent text-gray-700 shadow-none flex items-center gap-2 px-5 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 font-medium"
                    >
                      <Icons.RefreshCw className="w-4 h-4" />
                      Reset to Default
                    </Button>
                    <Button
                      type="button"
                      onClick={saveSettings}
                      disabled={isSaving}
                      className={`text-white px-6 py-3 rounded-xl font-medium transition-all shadow-sm hover:shadow flex items-center gap-2 ${
                        isSaving
                          ? "bg-green-400 to-emerald-400 cursor-not-allowed"
                          : "bg-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      }`}
                    >
                      {isSaving ? (
                        <>
                          <Icons.RefreshCw className="w-4 h-4 animate-spin" />
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <Icons.Save className="w-4 h-4" />
                          Save Configuration
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-6 p-4 bg-indigo-50 border border-blue-100 rounded-xl">
              <div className="flex items-center gap-3">
                <Icons.Info className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Note:</span> Changes will be
                  applied to all new loans immediately. Existing loans will
                  continue with their original terms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animation for notification */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
