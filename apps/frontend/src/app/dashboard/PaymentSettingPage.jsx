import React, { useState } from "react";
import * as Icons from "lucide-react";

import Button from "../../components/ui/Button";
import InputField from "../../components/ui/InputField";
import SelectField from "../../components/ui/SelectField";
import TextAreaField from "../../components/ui/TextAreaField";
import ToggleSwitch from "../../components/ui/ToggleSwitch";

import { paymentModeConfig } from "../../lib/dashboardDummyData";

export default function PaymentSettingPage() {
  const {
    Wallet,
    Save,
    RefreshCw,
    CreditCard,
    Smartphone,
    Percent,
    Clock,
    Building,
    Shield,
  } = Icons;

  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);

  const [paymentSettings, setPaymentSettings] = useState({
    currency: "INR",
    taxRate: 18,
    tdsDeduction: 10,
    gstInclusive: true,

    bankName: "State Bank of India",
    accountHolderName: "Quick Loan Finance Ltd.",
    accountNumber: "123456789012",
    ifscCode: "SBIN0001234",
    branchName: "Sector 18, Noida",
    bankAddress: "Sector 18, Noida, Uttar Pradesh - 201301",

    upiId: "quickloan@sbi",
    merchantId: "MERCHANT123",
    paymentGateway: "razorpay",
    qrCode: null,

    activePaymentModes: ["upi", "netbanking", "credit_card", "debit_card"],

    autoPaymentProcessing: true,
    manualApprovalRequired: false,
    holidayProcessing: false,
    paymentCutoffTime: "18:00",
    processingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],

    minTransactionAmount: 100,
    maxTransactionAmount: 500000,
    dailyTransactionLimit: 1000000,
    monthlyTransactionLimit: 5000000,

    transactionFee: 0.5,
    gatewayFee: 2,
    latePaymentFee: 50,
    chequeBounceCharge: 500,
  });

  const handleInputChange = (field, value) => {
    setPaymentSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggle = (field) => {
    setPaymentSettings((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
    alert("Payment settings saved successfully!");
  };

  const resetForm = () => {
    window.location.reload();
  };

  const tabs = [
    { id: "general", label: "General", icon: Wallet },
    { id: "bank", label: "Bank Details", icon: Building },
    { id: "digital", label: "Digital Payments", icon: Smartphone },
    { id: "modes", label: "Payment Modes", icon: CreditCard },
    { id: "processing", label: "Processing", icon: Clock },
    { id: "limits", label: "Limits", icon: Shield },
    { id: "fees", label: "Fees & Charges", icon: Percent },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}

        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-linear-to-r from-purple-600 to-indigo-600 rounded-xl shadow-md">
              <Wallet className="w-8 h-8 text-white" />
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Payment Settings
              </h1>

              <p className="text-gray-600 mt-1">
                Configure payment gateways, bank details, and transaction
                settings
              </p>
            </div>
          </div>
        </div>

        {/* TABS */}

        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden mb-6">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-4 border-b-2 transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-purple-600 text-purple-700 bg-purple-50 font-semibold"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTENT */}

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-8">
            {/* GENERAL */}

            {activeTab === "general" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SelectField
                  label="Currency"
                  value={paymentSettings.currency}
                  onChange={(v) => handleInputChange("currency", v)}
                  options={[
                    { label: "Indian Rupee (₹)", value: "INR" },
                    { label: "USD", value: "USD" },
                    { label: "EUR", value: "EUR" },
                  ]}
                />

                <InputField
                  label="Tax Rate (%)"
                  type="number"
                  value={paymentSettings.taxRate}
                  onChange={(v) => handleInputChange("taxRate", v)}
                  icon={Percent}
                />

                <InputField
                  label="TDS Deduction (%)"
                  type="number"
                  value={paymentSettings.tdsDeduction}
                  onChange={(v) => handleInputChange("tdsDeduction", v)}
                  icon={Percent}
                />

                <div className="col-span-3">
                  <ToggleSwitch
                    label="GST Inclusive Pricing"
                    checked={paymentSettings.gstInclusive}
                    onChange={() => handleToggle("gstInclusive")}
                  />
                </div>
              </div>
            )}

            {/* BANK */}

            {activeTab === "bank" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Bank Name"
                  value={paymentSettings.bankName}
                  onChange={(v) => handleInputChange("bankName", v)}
                />

                <InputField
                  label="Account Holder Name"
                  value={paymentSettings.accountHolderName}
                  onChange={(v) => handleInputChange("accountHolderName", v)}
                />

                <InputField
                  label="Account Number"
                  value={paymentSettings.accountNumber}
                  onChange={(v) => handleInputChange("accountNumber", v)}
                />

                <InputField
                  label="IFSC Code"
                  value={paymentSettings.ifscCode}
                  onChange={(v) => handleInputChange("ifscCode", v)}
                />

                <InputField
                  label="Branch Name"
                  value={paymentSettings.branchName}
                  onChange={(v) => handleInputChange("branchName", v)}
                />

                <TextAreaField
                  label="Bank Address"
                  value={paymentSettings.bankAddress}
                  onChange={(v) => handleInputChange("bankAddress", v)}
                />
              </div>
            )}

            {/* PAYMENT MODES */}

            {activeTab === "modes" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paymentModeConfig.map((mode) => {
                  const isActive = paymentSettings.activePaymentModes.includes(
                    mode.id,
                  );

                  const Icon = Icons[mode.icon];

                  return (
                    <div
                      key={mode.id}
                      onClick={() => {
                        const modes = isActive
                          ? paymentSettings.activePaymentModes.filter(
                              (m) => m !== mode.id,
                            )
                          : [...paymentSettings.activePaymentModes, mode.id];

                        handleInputChange("activePaymentModes", modes);
                      }}
                      className={`p-5 border-2 rounded-xl cursor-pointer transition-all ${
                        isActive
                          ? `${mode.bgColor} ${mode.borderColor} transform scale-[1.02] shadow-md`
                          : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`p-2 rounded-lg ${isActive ? mode.bgColor : "bg-gray-100"}`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>

                        <div
                          className={`w-8 h-5 rounded-full flex items-center p-0.5 ${
                            isActive
                              ? "bg-green-500 justify-end"
                              : "bg-gray-300 justify-start"
                          }`}
                        >
                          <div className="w-4 h-4 bg-white rounded-full" />
                        </div>
                      </div>

                      <p className="font-medium">{mode.label}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* FOOTER */}

          <div className="p-6 border-t border-gray-200 bg-linear-to-r from-gray-50 to-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Wallet className="w-6 h-6 text-purple-600" />
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    Payment Configuration
                  </p>

                  <p className="text-sm text-gray-600">
                    Click save to update all payment settings
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  icon={RefreshCw}
                  onClick={resetForm}
                >
                  Reset All
                </Button>

                <Button
                  variant="primary"
                  icon={Save}
                  loading={isSaving}
                  onClick={saveSettings}
                >
                  Save All Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
