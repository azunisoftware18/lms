import { useState } from "react";

import { Icons } from "../../components/common/Icon";

export default function SecuritySettingPage() {
  const [securitySettings, setSecuritySettings] = useState({
    minPasswordLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    passwordExpiryDays: 90,
    passwordHistoryCount: 5,
    maxPasswordAge: 365,

    maxLoginAttempts: 5,
    lockDuration: 30,
    sessionTimeout: 30,
    rememberMeDuration: 30,
    concurrentSessions: 3,

    twoFactorAuth: true,
    mandatory2FA: false,
    backupCodesCount: 10,

    ipWhitelisting: false,
    ipBlacklisting: true,
    allowedIPs: ["192.168.1.1", "10.0.0.1"],

    deviceTracking: true,
    maxDevicesPerUser: 5,
    autoLogoutInactive: true,
    inactiveTimeout: 15,

    auditLogRetention: 365,
    loginLogging: true,
    sensitiveActionLogging: true,
    logExportEnabled: true,

    encryptionLevel: "high",
    sslEnforcement: true,
    csrfProtection: true,
    xssProtection: true,
    sqlInjectionProtection: true,
  });

  const [activeSection, setActiveSection] = useState("password");
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field, value) => {
    setSecuritySettings((prev) => ({ ...prev, [field]: value }));
  };

  const toggle = (field) => {
    setSecuritySettings((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
    alert("Security settings saved successfully");
  };

  const sections = [
    { id: "password", label: "Password Policy", icon: Icons.Key },
    { id: "login", label: "Login Security", icon: Icons.Lock },
    { id: "2fa", label: "Two Factor Auth", icon: Icons.Shield },
    { id: "network", label: "Network Security", icon: Icons.Globe },
    { id: "device", label: "Device Management", icon: Icons.User },
    { id: "audit", label: "Audit Logs", icon: Icons.Clipboard },
    { id: "advanced", label: "Advanced Security", icon: Icons.Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER */}

        <div className="bg-white rounded-2xl shadow-md p-6 border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Icons.Shield className="text-white w-7 h-7" />
            </div>

            <div>
              <h1 className="text-2xl font-bold">Security Settings</h1>

              <p className="text-gray-500 text-sm">
                Configure authentication, policies and protection
              </p>
            </div>
          </div>
        </div>

        {/* TABS */}

        <div className="bg-white rounded-2xl border shadow-sm">
          <div className="flex overflow-x-auto">
            {sections.map((s) => {
              const Icon = s.icon;

              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 whitespace-nowrap
                  ${
                    activeSection === s.id
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-transparent text-gray-500"
                  }`}
                >
                  <Icon size={18} />
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN CARD */}

        <div className="bg-white rounded-2xl border shadow-md">
          <div className="p-8 space-y-8">
            {/* PASSWORD POLICY */}

            {activeSection === "password" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Icons.Key size={20} />
                  Password Policy
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                  <input
                    type="number"
                    value={securitySettings.minPasswordLength}
                    onChange={(e) =>
                      handleInputChange(
                        "minPasswordLength",
                        parseInt(e.target.value),
                      )
                    }
                    className="border rounded-lg p-3"
                    placeholder="Min Password Length"
                  />

                  <input
                    type="number"
                    value={securitySettings.passwordExpiryDays}
                    onChange={(e) =>
                      handleInputChange(
                        "passwordExpiryDays",
                        parseInt(e.target.value),
                      )
                    }
                    className="border rounded-lg p-3"
                    placeholder="Password Expiry Days"
                  />

                  <input
                    type="number"
                    value={securitySettings.passwordHistoryCount}
                    onChange={(e) =>
                      handleInputChange(
                        "passwordHistoryCount",
                        parseInt(e.target.value),
                      )
                    }
                    className="border rounded-lg p-3"
                    placeholder="Password History"
                  />
                </div>

                {/* TOGGLES */}

                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    ["requireUppercase", "Require Uppercase"],
                    ["requireLowercase", "Require Lowercase"],
                    ["requireNumbers", "Require Numbers"],
                    ["requireSpecialChars", "Require Special Characters"],
                  ].map(([field, label]) => (
                    <div
                      key={field}
                      className="flex items-center justify-between border rounded-lg p-4"
                    >
                      <span>{label}</span>

                      <input
                        type="checkbox"
                        checked={securitySettings[field]}
                        onChange={() => toggle(field)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LOGIN SECURITY */}

            {activeSection === "login" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Icons.Lock size={20} />
                  Login Security
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                  <input
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) =>
                      handleInputChange(
                        "maxLoginAttempts",
                        parseInt(e.target.value),
                      )
                    }
                    className="border rounded-lg p-3"
                    placeholder="Max Login Attempts"
                  />

                  <input
                    type="number"
                    value={securitySettings.lockDuration}
                    onChange={(e) =>
                      handleInputChange(
                        "lockDuration",
                        parseInt(e.target.value),
                      )
                    }
                    className="border rounded-lg p-3"
                    placeholder="Lock Duration"
                  />

                  <input
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) =>
                      handleInputChange(
                        "sessionTimeout",
                        parseInt(e.target.value),
                      )
                    }
                    className="border rounded-lg p-3"
                    placeholder="Session Timeout"
                  />
                </div>
              </div>
            )}

            {/* ADVANCED SECURITY */}

            {activeSection === "advanced" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Icons.Shield size={20} />
                  Advanced Security
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    ["sslEnforcement", "SSL Enforcement"],
                    ["csrfProtection", "CSRF Protection"],
                    ["xssProtection", "XSS Protection"],
                    ["sqlInjectionProtection", "SQL Injection Protection"],
                  ].map(([field, label]) => (
                    <div
                      key={field}
                      className="flex items-center justify-between border rounded-lg p-4"
                    >
                      <span>{label}</span>

                      <input
                        type="checkbox"
                        checked={securitySettings[field]}
                        onChange={() => toggle(field)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* FOOTER */}

          <div className="border-t p-6 flex justify-between">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 border px-5 py-3 rounded-lg"
            >
              <Icons.Loader size={16} />
              Reset
            </button>

            <button
              onClick={saveSettings}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              {isSaving ? (
                <>
                  <Icons.Loader className="animate-spin" size={16} />
                  Saving...
                </>
              ) : (
                <>
                  <Icons.Save size={16} />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
