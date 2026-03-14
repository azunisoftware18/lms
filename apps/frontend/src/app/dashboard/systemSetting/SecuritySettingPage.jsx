import React, { useState } from "react";
import {
  securitySettingsData,
  securitySections as importedSecuritySections,
} from "../../../lib/dashboardDummyData";
import {
  Shield,
  Save,
  RefreshCw,
  Lock,
  UserCheck,
  Clock,
  AlertTriangle,
  Key,
  Fingerprint,
  Network,
  ShieldCheck,
  Eye,
  EyeOff,
  Server,
  Database,
  Cpu,
  Globe,
  CheckCircle,
} from "lucide-react";
// Map icon names to icon components
const iconMap = {
  Key,
  Lock,
  ShieldCheck,
  Network,
  Fingerprint,
  Clock,
  Cpu,
};
import SecuritySettingTable from "../../../components/tables/SecuritySettingTable";
import InputField from "../../../components/ui/InputField";
import ToggleSwitch from "../../../components/ui/ToggleSwitch";
import Button from "../../../components/ui/Button";
import SelectField from "../../../components/ui/SelectField";
import ConfirmationDialog from "../../../components/common/ConfirmationDialog";

export default function SecuritySettingPage() {
  const [securitySettings, setSecuritySettings] =
    useState(securitySettingsData);

  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("password");
  const [ipInput, setIpInput] = useState("");
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const handleInputChange = (field, value) => {
    setSecuritySettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleChange = (field) => {
    setSecuritySettings((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const addIpAddress = (targetList) => {
    const ipValue = ipInput.trim();

    if (!ipValue) {
      return;
    }

    const field = targetList === "allowed" ? "allowedIPs" : "blockedIPs";

    if (securitySettings[field].includes(ipValue)) {
      return;
    }

    handleInputChange(field, [...securitySettings[field], ipValue]);
    setIpInput("");
  };

  const removeIpAddress = (row) => {
    const field = row.type === "Allowed" ? "allowedIPs" : "blockedIPs";
    handleInputChange(
      field,
      securitySettings[field].filter((ip) => ip !== row.ip),
    );
  };

  const saveSettings = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setShowSaveDialog(false);
    alert("Security settings saved successfully!");
  };

  const resetForm = () => {
    setSecuritySettings(securitySettingsData);
    setShowResetDialog(false);
  };

  // Map icon names from imported data to icon components
  const sections = importedSecuritySections.map((section) => ({
    ...section,
    icon: iconMap[section.icon],
  }));

  const ipTableColumns = [
    {
      header: "IP Address",
      accessor: "ip",
      render: (value) => (
        <span className="font-mono text-xs md:text-sm text-slate-700">
          {value}
        </span>
      ),
    },
    {
      header: "List",
      accessor: "type",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === "Allowed"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  const ipTableData = [
    ...securitySettings.allowedIPs.map((ip) => ({ ip, type: "Allowed" })),
    ...securitySettings.blockedIPs.map((ip) => ({ ip, type: "Blocked" })),
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl shadow-md">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  Security Settings
                </h1>
                <p className="text-gray-600 mt-1">
                  Configure security policies, authentication, and access
                  controls
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">
                Security Active
              </span>
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md border border-gray-200 overflow-hidden mb-6">
          <div className="flex overflow-x-auto">
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              const colorClass = isActive
                ? `border-${section.color}-500 text-${section.color}-700 bg-${section.color}-50`
                : "border-transparent text-gray-600 hover:bg-gray-50";

              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-3 px-6 py-4 border-b-2 transition-all whitespace-nowrap ${colorClass}`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      isActive
                        ? `bg-${section.color}-100 text-${section.color}-600`
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <section.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">{section.label}</span>
                  {isActive && (
                    <div
                      className={`ml-2 w-2 h-2 bg-${section.color}-500 rounded-full`}
                    ></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-8">
            {/* Password Policy Section */}
            {activeSection === "password" && (
              <div className="space-y-8">
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Key className="w-6 h-6 text-blue-600" />
                    </div>
                    Password Policy
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Configure password requirements and expiration rules
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      field: "minPasswordLength",
                      label: "Minimum Password Length",
                      min: 6,
                      max: 32,
                      icon: "🔢",
                    },
                    {
                      field: "passwordExpiryDays",
                      label: "Password Expiry (Days)",
                      min: 0,
                      max: 365,
                      icon: "📅",
                    },
                    {
                      field: "passwordHistoryCount",
                      label: "Password History Count",
                      min: 0,
                      max: 10,
                      icon: "🔄",
                    },
                    {
                      field: "maxPasswordAge",
                      label: "Maximum Password Age (Days)",
                      min: 30,
                      max: 730,
                      icon: "⏳",
                    },
                  ].map((item) => (
                    <div key={item.field} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {item.label}
                      </label>
                      <InputField
                        type="number"
                        min={item.min}
                        max={item.max}
                        value={securitySettings[item.field]}
                        onChange={(e) =>
                          handleInputChange(
                            item.field,
                            parseInt(e.target.value),
                          )
                        }
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <span>Password Requirements</span>
                    <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {
                        Object.keys(securitySettings).filter(
                          (k) => k.startsWith("require") && securitySettings[k],
                        ).length
                      }
                      /4 enabled
                    </div>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        field: "requireUppercase",
                        label: "Uppercase Letters (A-Z)",
                        icon: "🔠",
                        color: "blue",
                      },
                      {
                        field: "requireLowercase",
                        label: "Lowercase Letters (a-z)",
                        icon: "🔡",
                        color: "green",
                      },
                      {
                        field: "requireNumbers",
                        label: "Numbers (0-9)",
                        icon: "🔢",
                        color: "purple",
                      },
                      {
                        field: "requireSpecialChars",
                        label: "Special Characters (!@#$)",
                        icon: "⚡",
                        color: "amber",
                      },
                    ].map((item) => (
                      <div
                        key={item.field}
                        className={`p-4 border rounded-xl transition-all ${
                          securitySettings[item.field]
                            ? `border-${item.color}-300 bg-${item.color}-50`
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{item.icon}</div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {item.label}
                              </p>
                              <p className="text-sm text-gray-500">
                                {securitySettings[item.field]
                                  ? "Required"
                                  : "Optional"}
                              </p>
                            </div>
                          </div>
                          <ToggleSwitch
                            checked={securitySettings[item.field]}
                            onChange={() => handleToggleChange(item.field)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-200">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <ShieldCheck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Password Strength Meter
                      </p>
                      <p className="text-sm text-gray-600">
                        Configure password requirements based on your security
                        needs. Stronger passwords provide better protection
                        against brute force attacks.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Login Security Section */}
            {activeSection === "login" && (
              <div className="space-y-8">
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Lock className="w-6 h-6 text-indigo-600" />
                    </div>
                    Login & Session Security
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Configure login attempts, session timeout, and concurrent
                    sessions
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      field: "maxLoginAttempts",
                      label: "Max Login Attempts",
                      min: 1,
                      max: 10,
                      icon: "🔐",
                    },
                    {
                      field: "lockDuration",
                      label: "Account Lock Duration (Minutes)",
                      min: 1,
                      max: 1440,
                      icon: "⏱️",
                    },
                    {
                      field: "sessionTimeout",
                      label: "Session Timeout (Minutes)",
                      min: 1,
                      max: 480,
                      icon: "⏰",
                    },
                    {
                      field: "rememberMeDuration",
                      label: "Remember Me Duration (Days)",
                      min: 1,
                      max: 90,
                      icon: "💾",
                    },
                    {
                      field: "concurrentSessions",
                      label: "Max Concurrent Sessions",
                      min: 1,
                      max: 10,
                      icon: "👥",
                    },
                  ].map((item) => (
                    <div key={item.field} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {item.label}
                      </label>
                      <InputField
                        type="number"
                        min={item.min}
                        max={item.max}
                        value={securitySettings[item.field]}
                        onChange={(e) =>
                          handleInputChange(
                            item.field,
                            parseInt(e.target.value),
                          )
                        }
                      />
                    </div>
                  ))}
                </div>

                <div className="bg-linear-to-r from-indigo-50 to-purple-50 p-5 rounded-2xl border border-indigo-200">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-indigo-100 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-2">
                        Login Security Tips
                      </p>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                          <span>
                            Lower session timeouts increase security but may
                            inconvenience users
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                          <span>
                            Limit concurrent sessions to prevent account sharing
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                          <span>
                            Account lockout prevents brute force attacks
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Two-Factor Authentication Section */}
            {activeSection === "2fa" && (
              <div className="space-y-8">
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <ShieldCheck className="w-6 h-6 text-purple-600" />
                    </div>
                    Two-Factor Authentication
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Add an extra layer of security to user accounts
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Enable 2FA */}
                  <div
                    className={`p-5 rounded-xl border transition-all ${
                      securitySettings.twoFactorAuth
                        ? "border-purple-300 bg-linear-to-r from-purple-50 to-pink-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-lg ${
                            securitySettings.twoFactorAuth
                              ? "bg-purple-100"
                              : "bg-gray-100"
                          }`}
                        >
                          <ShieldCheck
                            className={`w-6 h-6 ${
                              securitySettings.twoFactorAuth
                                ? "text-purple-600"
                                : "text-gray-500"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            Enable Two-Factor Authentication
                          </p>
                          <p className="text-sm text-gray-600">
                            Add an extra layer of security to user accounts
                          </p>
                        </div>
                      </div>
                      <ToggleSwitch
                        checked={securitySettings.twoFactorAuth}
                        onChange={() => handleToggleChange("twoFactorAuth")}
                        size="lg"
                      />
                    </div>
                  </div>

                  {securitySettings.twoFactorAuth && (
                    <>
                      {/* Mandatory 2FA */}
                      <div className="p-5 border border-gray-200 rounded-xl bg-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-100 rounded-lg">
                              <UserCheck className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                Mandatory 2FA for All Users
                              </p>
                              <p className="text-sm text-gray-600">
                                Force all users to enable two-factor
                                authentication
                              </p>
                            </div>
                          </div>
                          <ToggleSwitch
                            checked={securitySettings.mandatory2FA}
                            onChange={() => handleToggleChange("mandatory2FA")}
                            size="lg"
                          />
                        </div>
                      </div>

                      {/* 2FA Methods */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          Authentication Methods
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            {
                              id: "authenticator",
                              label: "Authenticator App",
                              description: "Google Authenticator, Authy, etc.",
                              icon: "📱",
                              color: "green",
                            },
                            {
                              id: "sms",
                              label: "SMS Verification",
                              description: "One-time code via SMS",
                              icon: "💬",
                              color: "blue",
                            },
                            {
                              id: "email",
                              label: "Email Verification",
                              description: "One-time code via Email",
                              icon: "✉️",
                              color: "purple",
                            },
                          ].map((method) => {
                            const isActive =
                              securitySettings.twoFactorMethods.includes(
                                method.id,
                              );
                            return (
                              <div
                                key={method.id}
                                onClick={() => {
                                  const methods = isActive
                                    ? securitySettings.twoFactorMethods.filter(
                                        (m) => m !== method.id,
                                      )
                                    : [
                                        ...securitySettings.twoFactorMethods,
                                        method.id,
                                      ];
                                  handleInputChange(
                                    "twoFactorMethods",
                                    methods,
                                  );
                                }}
                                className={`p-5 border rounded-xl cursor-pointer transition-all ${
                                  isActive
                                    ? `border-${method.color}-300 bg-${method.color}-50 transform scale-[1.02]`
                                    : "border-gray-200 bg-white hover:bg-gray-50"
                                }`}
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="text-3xl">{method.icon}</div>
                                  <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                      isActive
                                        ? `bg-${method.color}-500`
                                        : "bg-gray-300"
                                    }`}
                                  >
                                    {isActive && (
                                      <div className="w-2 h-2 bg-white rounded-full"></div>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <p
                                    className={`font-medium ${
                                      isActive
                                        ? `text-${method.color}-700`
                                        : "text-gray-900"
                                    }`}
                                  >
                                    {method.label}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {method.description}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Backup Codes */}
                      <div className="p-5 border border-gray-200 rounded-xl bg-white">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 bg-amber-100 rounded-lg">
                            <Key className="w-6 h-6 text-amber-600" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Number of Backup Codes
                            </label>
                            <p className="text-sm text-gray-500">
                              Number of backup codes generated for each user
                            </p>
                          </div>
                        </div>
                        <InputField
                          type="number"
                          min={1}
                          max={20}
                          value={securitySettings.backupCodesCount}
                          onChange={(e) =>
                            handleInputChange(
                              "backupCodesCount",
                              parseInt(e.target.value),
                            )
                          }
                          containerClassName="w-48"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Network Security Section */}
            {activeSection === "network" && (
              <div className="space-y-8">
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Network className="w-6 h-6 text-green-600" />
                    </div>
                    Network Security
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Restrict access based on IP addresses
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* IP Whitelisting */}
                    <div
                      className={`p-5 rounded-xl border transition-all ${
                        securitySettings.ipWhitelisting
                          ? "border-green-300 bg-linear-to-r from-green-50 to-emerald-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Globe
                            className={`w-5 h-5 ${
                              securitySettings.ipWhitelisting
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              IP Whitelisting
                            </p>
                            <p className="text-sm text-gray-600">
                              Restrict access to specific IPs
                            </p>
                          </div>
                        </div>
                        <ToggleSwitch
                          checked={securitySettings.ipWhitelisting}
                          onChange={() => handleToggleChange("ipWhitelisting")}
                          size="lg"
                        />
                      </div>
                    </div>

                    {/* IP Blacklisting */}
                    <div
                      className={`p-5 rounded-xl border transition-all ${
                        securitySettings.ipBlacklisting
                          ? "border-red-300 bg-linear-to-r from-red-50 to-rose-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Shield
                            className={`w-5 h-5 ${
                              securitySettings.ipBlacklisting
                                ? "text-red-600"
                                : "text-gray-500"
                            }`}
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              IP Blacklisting
                            </p>
                            <p className="text-sm text-gray-600">
                              Block specific IP addresses
                            </p>
                          </div>
                        </div>
                        <ToggleSwitch
                          checked={securitySettings.ipBlacklisting}
                          onChange={() => handleToggleChange("ipBlacklisting")}
                          size="lg"
                        />
                      </div>
                    </div>
                  </div>

                  {(securitySettings.ipWhitelisting ||
                    securitySettings.ipBlacklisting) && (
                    <div className="p-5 border border-slate-200 rounded-xl bg-white space-y-4">
                      <div className="flex items-center gap-3">
                        <Server className="w-5 h-5 text-slate-600" />
                        <label className="block text-sm font-medium text-gray-700">
                          Managed IP Addresses
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <InputField
                          value={ipInput}
                          onChange={(e) => setIpInput(e.target.value)}
                          placeholder="Enter IP address (e.g., 192.168.1.1)"
                          containerClassName="md:col-span-2"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => addIpAddress("allowed")}
                            disabled={!securitySettings.ipWhitelisting}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-sm"
                          >
                            Add Allow
                          </Button>
                          <Button
                            onClick={() => addIpAddress("blocked")}
                            disabled={!securitySettings.ipBlacklisting}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-sm"
                          >
                            Add Block
                          </Button>
                        </div>
                      </div>

                      <SecuritySettingTable
                        columns={ipTableColumns}
                        data={ipTableData}
                        onRemove={removeIpAddress}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Device Management Section */}
            {activeSection === "device" && (
              <div className="space-y-8">
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Fingerprint className="w-6 h-6 text-amber-600" />
                    </div>
                    Device Management
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Track and manage user devices
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Device Tracking */}
                    <div
                      className={`p-5 rounded-xl border transition-all ${
                        securitySettings.deviceTracking
                          ? "border-amber-300 bg-linear-to-r from-amber-50 to-yellow-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Fingerprint
                            className={`w-5 h-5 ${
                              securitySettings.deviceTracking
                                ? "text-amber-600"
                                : "text-gray-500"
                            }`}
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              Device Tracking
                            </p>
                            <p className="text-sm text-gray-600">
                              Track devices used for login
                            </p>
                          </div>
                        </div>
                        <ToggleSwitch
                          checked={securitySettings.deviceTracking}
                          onChange={() => handleToggleChange("deviceTracking")}
                          size="lg"
                        />
                      </div>
                    </div>

                    {/* Auto Logout */}
                    <div
                      className={`p-5 rounded-xl border transition-all ${
                        securitySettings.autoLogoutInactive
                          ? "border-blue-300 bg-linear-to-r from-blue-50 to-cyan-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Clock
                            className={`w-5 h-5 ${
                              securitySettings.autoLogoutInactive
                                ? "text-blue-600"
                                : "text-gray-500"
                            }`}
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              Auto Logout Inactive
                            </p>
                            <p className="text-sm text-gray-600">
                              Logout users after inactivity
                            </p>
                          </div>
                        </div>
                        <ToggleSwitch
                          checked={securitySettings.autoLogoutInactive}
                          onChange={() =>
                            handleToggleChange("autoLogoutInactive")
                          }
                          size="lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Max Devices */}
                  <div className="p-5 border border-gray-200 rounded-xl bg-white">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-gray-100 rounded-lg">
                        <div className="text-lg">📱</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Maximum Devices per User
                        </label>
                        <p className="text-sm text-gray-500">
                          Limit number of devices per user account
                        </p>
                      </div>
                    </div>
                    <InputField
                      type="number"
                      min={1}
                      max={20}
                      value={securitySettings.maxDevicesPerUser}
                      onChange={(e) =>
                        handleInputChange(
                          "maxDevicesPerUser",
                          parseInt(e.target.value),
                        )
                      }
                      containerClassName="w-48"
                    />
                  </div>

                  {/* Inactivity Timeout */}
                  {securitySettings.autoLogoutInactive && (
                    <div className="p-5 border border-blue-200 rounded-xl bg-blue-50">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <Clock className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Inactivity Timeout (Minutes)
                          </label>
                          <p className="text-sm text-gray-500">
                            Time after which inactive users are automatically
                            logged out
                          </p>
                        </div>
                      </div>
                      <InputField
                        type="number"
                        min={1}
                        max={240}
                        value={securitySettings.inactiveTimeout}
                        onChange={(e) =>
                          handleInputChange(
                            "inactiveTimeout",
                            parseInt(e.target.value),
                          )
                        }
                        containerClassName="w-48"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Audit & Logging Section */}
            {activeSection === "audit" && (
              <div className="space-y-8">
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Database className="w-6 h-6 text-gray-600" />
                    </div>
                    Audit & Logging
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Configure system auditing and log retention
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Audit Log Retention (Days)
                    </label>
                    <InputField
                      type="number"
                      min={1}
                      max={1095}
                      value={securitySettings.auditLogRetention}
                      onChange={(e) =>
                        handleInputChange(
                          "auditLogRetention",
                          parseInt(e.target.value),
                        )
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      field: "loginLogging",
                      label: "Login Activity Logging",
                      description: "Log all user login attempts",
                      icon: "👤",
                      color: "blue",
                    },
                    {
                      field: "sensitiveActionLogging",
                      label: "Sensitive Action Logging",
                      description: "Log sensitive operations",
                      icon: "⚡",
                      color: "red",
                    },
                    {
                      field: "logExportEnabled",
                      label: "Log Export Enabled",
                      description: "Allow exporting audit logs",
                      icon: "📤",
                      color: "green",
                    },
                  ].map((item) => (
                    <div
                      key={item.field}
                      className={`p-4 border rounded-xl transition-all ${
                        securitySettings[item.field]
                          ? `border-${item.color}-300 bg-${item.color}-50`
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{item.icon}</div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {item.label}
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <ToggleSwitch
                          checked={securitySettings[item.field]}
                          onChange={() => handleToggleChange(item.field)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Advanced Security Section */}
            {activeSection === "advanced" && (
              <div className="space-y-8">
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Cpu className="w-6 h-6 text-red-600" />
                    </div>
                    Advanced Security Settings
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Configure advanced security protections
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      field: "sslEnforcement",
                      label: "SSL/TLS Enforcement",
                      description: "Force HTTPS connections",
                      icon: "🔒",
                      color: "green",
                    },
                    {
                      field: "csrfProtection",
                      label: "CSRF Protection",
                      description:
                        "Enable Cross-Site Request Forgery protection",
                      icon: "🛡️",
                      color: "blue",
                    },
                    {
                      field: "xssProtection",
                      label: "XSS Protection",
                      description: "Enable Cross-Site Scripting protection",
                      icon: "⚠️",
                      color: "amber",
                    },
                    {
                      field: "sqlInjectionProtection",
                      label: "SQL Injection Protection",
                      description: "Enable SQL injection protection",
                      icon: "💉",
                      color: "red",
                    },
                  ].map((item) => (
                    <div
                      key={item.field}
                      className={`p-4 border rounded-xl transition-all ${
                        securitySettings[item.field]
                          ? `border-${item.color}-300 bg-${item.color}-50`
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{item.icon}</div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {item.label}
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <ToggleSwitch
                          checked={securitySettings[item.field]}
                          onChange={() => handleToggleChange(item.field)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Encryption Level */}
                <div className="p-5 border border-red-200 rounded-xl bg-red-50">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <Shield className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Encryption Level
                      </label>
                      <SelectField
                        value={securitySettings.encryptionLevel}
                        onChange={(val) =>
                          handleInputChange("encryptionLevel", val)
                        }
                        options={[
                          { label: "🔓 Low (128-bit)", value: "low" },
                          { label: "🔐 Medium (256-bit)", value: "medium" },
                          { label: "🛡️ High (512-bit)", value: "high" },
                          { label: "🚀 Maximum (2048-bit)", value: "maximum" },
                        ]}
                        className="w-full md:w-1/3"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Higher encryption provides better security but may
                        impact performance
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-6 border-t border-gray-200 bg-linear-to-r from-gray-50 to-blue-50">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-linear-to-r from-blue-100 to-indigo-100 rounded-lg">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Security Configuration
                  </p>
                  <p className="text-sm text-gray-600">
                    Click save to update all security settings
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={() => setShowResetDialog(true)}
                  className="bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <RefreshCw className="w-5 h-5" />
                  Reset All
                </Button>
                <Button
                  onClick={() => setShowSaveDialog(true)}
                  disabled={isSaving}
                  className="px-8"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Securing Settings...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Security Settings
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        open={showResetDialog}
        title="Reset Security Settings"
        description="Are you sure you want to reset all security settings to default? This action cannot be undone."
        confirmText="Reset All"
        cancelText="Cancel"
        onConfirm={resetForm}
        onCancel={() => setShowResetDialog(false)}
        variant="danger"
        isPopup={true}
      />

      <ConfirmationDialog
        open={showSaveDialog}
        title="Save Security Settings"
        description="Are you sure you want to save all security settings? These changes will be applied immediately."
        confirmText="Save Settings"
        cancelText="Cancel"
        onConfirm={saveSettings}
        onCancel={() => setShowSaveDialog(false)}
        loading={isSaving}
        variant="info"
        isPopup={true}
      />
    </div>
  );
}
