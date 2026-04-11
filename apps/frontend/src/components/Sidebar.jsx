import React, { useEffect, useState } from "react";
import {
  Users, FileText, Settings, ShieldCheck, Banknote, PieChart,
  ChevronLeft, ChevronRight, Menu, X, Briefcase,
  Calculator, Sliders, FilePlus2, ChevronDown, UserPlus, Handshake,
  Plus, ArrowRight, List,
  User
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";


export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const currentUser = user;
  const role = user?.role?.toUpperCase();
  const isSuperAdmin = role === "SUPER_ADMIN";
  const isBranchAdmin =
    user?.role?.toUpperCase() === "ADMIN" && user?.branchId;
  const [openMenu, setOpenMenu] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState({});

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setExpanded(true);
      } else {
        setExpanded(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const location = useLocation();
  const handleMenuClick = (name) => {
    if (!expanded) setExpanded(true);
    setOpenMenu(openMenu === name ? null : name);
  };
  const handleSubMenuClick = (name, e) => {
    e.stopPropagation();
    setOpenSubMenu(prev => ({
      ...prev,
      [name]: !prev[name],
    }));
  };
  const menuItems = [
    {
      category: "Core",
      items: [
        {
          name: "Dashboard",
          icon: <PieChart size={20} />,
          path: currentUser?.role === "EMPLOYEE" ? "/employee" : "/admin",
          permission: "VIEW_DASHBOARD"
        }

      ]
    },
    {
      category: "Loan Ops",
      items: [
        {
          name: "LOS",
          icon: <FilePlus2 size={20} />,
          permission: "VIEW_LOS",
          subItems: [

            { name: "Leads", path: "/admin/los/leads" },
            // {name:"Login Fee", path:"/admin/los/login-fee"},
            { name: "Applications", path: "/admin/los/applications" },
            { name: "Documents", path: "/admin/los/documents" },
            { name: "Eligibility", path: "/admin/los/eligibility" },
            // { name: "Kyc Verification", path: "/admin/los/kyc-verification" },
            { name: "Credit Check", path: "/admin/los/credit-check" },
            { name: "Technical Review", path: "/admin/los/technical-review" },
            { name: "Legal Report", path: "/admin/los/legal-compliance" },
            {name:"EMI Schedule", path:"/admin/los/emi-schedule"},
            { name: "Sanction", path: "/admin/los/sanction" },
                {
              name: "NACH Auto Debit",
              path: currentUser?.role === "EMPLOYEE"
                ? "/employee/los/nach-auto-debit"
                : "/admin/los/nach-auto-debit",
              permission: "VIEW_NACH_AUTO_DEBIT"
            },
         
            { name: "Disbursement", path: "/admin/los/disbursement" },
          ]
        },

        // --- LMS SECTION ---
        {
          name: "LMS",
          icon: <Briefcase size={20} />,
          permission: "VIEW_LMS",
          subItems: [

            {
              name: "Loan Account Management",
              path: currentUser?.role === "EMPLOYEE"
                ? "/employee/lms/loan-account-management"
                : "/admin/lms/loan-account-management",
              permission: "CREATE_LOAN"
            },

            // {
            //   name: "EMI Schedule",
            //   path: currentUser?.role === "EMPLOYEE"
            //     ? "/employee/lms/emi-schedule"
            //     : "/admin/lms/emi-schedule",
            //   permission: "VIEW_EMI_SCHEDULE"
            // },
            { name: "EMI Management", path: "/admin/lms/emi-management" },
            // {
            //   name: "Repayment Management",
            //   path: currentUser?.role === "EMPLOYEE"
            //     ? "/employee/lms/repayment-management"
            //     : "/admin/lms/repayment-management",
            //   permission: "VIEW_REPAYMENT_MANAGEMENT"
            // },

            // // --- REPAYMENT (Dropdown) ---
            // {
            //   name: "Repayment",
            //   permission: "VIEW_REPAYMENT",
            //   subItems: [
            //     {
            //       name: "NACH Registration",
            //       path: currentUser?.role === "EMPLOYEE"
            //         ? "/employee/nach"
            //         : "/admin/nach",
            //       permission: "VIEW_NACH"
            //     },
            //     {
            //       name: "PDC Receipt",
            //       path: currentUser?.role === "EMPLOYEE"
            //         ? "/employee/PdcReceipts"
            //         : "/admin/PdcReceipts",
            //       permission: "VIEW_PDC"
            //     }
            //   ]
            // },


        
            
            {
              name: "DPD Tracking",
              path: currentUser?.role === "EMPLOYEE"
                ? "/employee/lms/dpd-tracking"
                : "/admin/lms/dpd-tracking",
              permission: "VIEW_DPD_TRACKING"
            },
            {
              name: "Recovery Management",
              path: currentUser?.role === "EMPLOYEE"
                ? "/employee/lms/recovery-management"
                : "/admin/lms/recovery-management",
              permission: "VIEW_RECOVERY_MANAGEMENT"
            },
            {
              name: "Foreclosure",
              path: currentUser?.role === "EMPLOYEE"
                ? "/employee/lms/foreclosure"
                : "/admin/lms/foreclosure",
              permission: "VIEW_FORECLOSURE"
            },
            {name:"Default Management",
               path:"/employee/lms/default-management",
                permission:"VIEW_DEFAULT_MANAGEMENT"

            },
            {
              name: "Loan Closure",
              path: currentUser?.role === "EMPLOYEE"
                ? "/employee/lms/loan-closure"
                : "/admin/lms/loan-closure",
              permission: "VIEW_LOAN_CLOSURE"
            },
          ]
        },


        // { name: "Loan Requests", icon: <Banknote size={20} />, path: "/admin/loan-requests" },
        {
          name: "Borrowers",
          icon: <Users size={20} />,
          path: currentUser?.role === "EMPLOYEE"
            ? "/employee/borrowers"
            : "/admin/borrowers",
          permission: "VIEW_BORROWERS"
        },
        // {
        //   name: "Leads",
        //   icon: <User size={20} />,
        //   path: currentUser?.role === "EMPLOYEE"
        //     ? "/employee/reports/leads"
        //     : "/admin/reports/leads",
        //   permission: "VIEW_LEADS"
        // },

      ]
    },
    {
      category: "Finance",
      items: [
        {
          name: "Accounting",
          icon: <Calculator size={20} />,
          subItems: [
            { name: "Account Masters", path: "/admin/accounting/account-group-masters" },
            { name: "Transaction Books", path: "/admin/accounting/transaction-books" },
            { name: "Profit And Loss Balances", path: "/admin/accounting/profit-loss-balances" },
            { name: "Vouchers", path: "/admin/accounting/vouchers" },
            // { name: "GST Detail", path: "/admin/accounting/gst" },
            { name: "Topup Refund", path: "/admin/accounting/topup-refund" },
            { name: "Balance Report", path: "/admin/accounting/balance-report" },
            { name: "Reconcile Bank Balance", path: "/admin/accounting/reconcile" },
            { name: "IMD Authorization", path: "/admin/accounting/imd-authorization" },
            { name: "Reciept Entry", path: "/admin/accounting/reciept-entry" },
            // { name: "Trial Balance", path: "/admin/accounting/trial-balance" },
          ]
        },

        // --- REPORTS SECTION (Updated with List) ---
        {
          name: "Reports",
          icon: <FileText size={20} />,
          subItems: [
            { name: "DUE List", path: "/admin/due-list" },

            // --- BUSINESS REPORTS (Dropdown) ---
            {
              name: "Business Reports",
              subItems: [
                { name: "Disburs & Collection", path: "/admin/reports/disburs-collection" },
                { name: "Customer And Booking List", path: "/admin/reports/customer-and-booking-list" },
                { name: "Sales Target/Achievement", path: "/admin/reports/sales-target-and-achievement" },
              ]
            },
            { name: "NPA Reports", path: "/admin/reports/npa-reports" },
            { name: "CRC Report", path: "/admin/reports/crc-report" },
          ]
        },
      ]
    },
    
    {
      category: "Admin Control",
      
      items: [
        // --- CONFIGURATION ---
        { name: "Role Management", icon: <ShieldCheck size={20} />, path: "/admin/role-management" },
        {
          name: "Configuration",
          icon: <Sliders size={20} />,
          subItems: [
            { name: "Employee Add", path: "/admin/employee" },
            { name: "Partner Add", path: "/admin/partner" },
            { name: "Branch Management", path: "/admin/branch-management" },
            { name: "Branch Admin", path: "/admin/branch-admin" },
            { name: "Loan Swap", path: "/admin/loan-swap" },
            { name: "Loan Product", path: "/admin/loan-product" },
            { name: "Location", path: "/admin/location" },
            { name: "masters setup", path: "/admin/masters-setup" },
            { name: "Vehicle Masters", path: "/admin/vehicle-masters" },
            { name: "Consumer Durable", path: "/admin/consumer-durable" },

          ]
        },
        // { name: "Role Management", icon: <ShieldCheck size={20} />, path: "/admin/role-management" },
        { name: "Permission Management", icon: <ShieldCheck size={20} />, path: "/admin/permission-management" },

        {
          name: "System Settings",
          icon: <Settings size={20} />,
          subItems: [
            { name: "Company Details", path: "/admin/system-setting/company-details" },
            { name: "Loan Configuration", path: "/admin/system-setting/loan-configuration" },
            { name: "Security Settings", path: "/admin/system-setting/security-settings" },
            { name: "Payment Settings", path: "/admin/system-setting/payment-settings" },
          ]
        },
      ]
    }
  ];

  const hasPermission = (permission) => {
    if (!user) return false;

    if (["ADMIN", "SUPER_ADMIN"].includes(currentUser.role?.toUpperCase())) {
      return true;
    }

    return user.permissions?.includes(permission);
  };

  if (!user) {
    return null;
  }


  return (
    <>
      {/* Mobile top menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 shadow-lg bg-blue-600 text-white p-2 rounded-md"
      >
        <Menu size={22} />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative z-50 h-full bg-[#0d1117] text-gray-400
          flex flex-col transition-all duration-300
          ${mobileOpen ? "w-65" : expanded ? "w-65" : "w-20"}
          ${mobileOpen ? "translate-x-0 w-65" : "-translate-x-full lg:translate-x-0"}
        `}
      >

        {/* LOGO SECTION */}
        <div className="h-16 flex items-center justify-center border-b border-gray-800 relative">
          <div className="flex items-center gap-2 text-white text-xl font-semibold">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">L</div>
            {expanded && <span>LoanAdmin</span>}
          </div>

          <button
            onClick={() => {
              if (window.innerWidth >= 1024) {
                setExpanded(!expanded);
              }
            }}
            className="absolute -right-3 top-6 hidden lg:flex bg-blue-600 text-white p-1 rounded-full"
          >
            {expanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>

          <button
            onClick={() => setMobileOpen(false)}
            className="absolute right-4 top-5 text-gray-400 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* MENU LIST */}
        <div className="flex-1 overflow-y-auto py-4 [&::-webkit-scrollbar]:hidden">
          {menuItems.map((section, index) => {

            // 👑 SUPER ADMIN → SAB CATEGORY SHOW
            if (isSuperAdmin) {
              // No restriction
            }

            // 🔒 Admin Control only Admin types
            else if (
              section.category === "Admin Control" &&
              !["ADMIN", "SUPER_ADMIN"].includes(role)
            ) {
              return null;
            }

            // 🏢 Branch Admin Category Restriction
            if (isBranchAdmin) {
              const allowedCategories = [
                "Core",
                "Loan Ops",
                "Admin Control"
              ];

              if (!allowedCategories.includes(section.category)) {
                return null;
              }
            }

            return (
              <div key={index} className="mb-6">

                {/* Category Label */}
                {expanded && (
                  <div className="px-4 mb-2 text-xs uppercase font-semibold text-gray-500">
                    {section.category}
                  </div>
                )}

                <div className={`space-y-1 ${expanded ? "px-3" : "px-2"}`}>
                  {section.items
                    .filter((item) => {

                      // 👑 SUPER ADMIN → SAB SHOW
                      if (isSuperAdmin) {
                        return true;
                      }

                      // 🏢 BRANCH ADMIN → LIMITED
                      if (isBranchAdmin) {
                        return [
                          "Dashboard",
                          "LOS",
                          "LMS",
                          "Configuration",
                          "Leads"
                        ].includes(item.name);
                      }

                      // 🔐 OTHER USERS → PERMISSION BASED
                      return !item.permission || hasPermission(item.permission);
                    })

                    .map((item) => {

                      const hasSubMenu = item.subItems && item.subItems.length > 0;
                      const isMenuOpen = openMenu === item.name;
                      const isActive =
                        !hasSubMenu && location.pathname.startsWith(item.path);

                      return (
                        <div key={item.name}>

                          {/* LEVEL 1 */}
                          {hasSubMenu ? (
                            <button
                              onClick={() => handleMenuClick(item.name)}
                              className={`
                      w-full flex items-center justify-between p-3 rounded-xl transition-all
                      ${isMenuOpen ? "bg-gray-800 text-white" : "hover:bg-gray-800 hover:text-white"}
                      ${expanded ? "" : "justify-center items-center"}
                    `}
                            >
                              <div className={`flex items-center ${expanded ? "gap-3" : ""}`}>
                                <span className={isMenuOpen ? "text-blue-500" : ""}>{item.icon}</span>
                                {expanded && <span className="text-sm font-medium">{item.name}</span>}
                              </div>
                              {expanded && (
                                <ChevronDown
                                  size={16}
                                  className={`transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
                                />
                              )}
                            </button>
                          ) : (
                            <Link
                              to={item.path}
                              onClick={() => setMobileOpen(false)}
                              className={`
                      flex items-center p-3 rounded-xl transition-all
                      ${expanded ? "gap-3" : "justify-center"}
                      ${isActive ? "bg-white text-gray-900 shadow" : "hover:bg-gray-800 hover:text-white"}
                    `}
                            >
                              <span className={isActive ? "text-blue-600" : ""}>{item.icon}</span>
                              {expanded && <span className="text-sm">{item.name}</span>}
                            </Link>
                          )}

                          {/* LEVEL 2 */}
                          {hasSubMenu && isMenuOpen && expanded && (
                            <div className="mt-1 ml-4 pl-4 border-l border-gray-700 space-y-1">
                              {item.subItems
                                .filter(sub => !sub.permission || hasPermission(sub.permission))
                                .map((sub) => {

                                  const hasDeep = sub.subItems && sub.subItems.length > 0;
                                  const isDeepOpen = openSubMenu[sub.name];


                                  return (
                                    <div key={sub.name}>
                                      {hasDeep ? (
                                        <button
                                          onClick={(e) => handleSubMenuClick(sub.name, e)}
                                          className="w-full flex justify-between px-4 py-2 text-sm rounded-lg text-gray-400 hover:bg-gray-800/50 hover:text-white"
                                        >
                                          <span>{sub.name}</span>
                                          <ChevronDown
                                            size={14}
                                            className={`transition-transform ${isDeepOpen ? "rotate-180" : ""}`}
                                          />
                                        </button>
                                      ) : (
                                        <Link
                                          to={sub.path}
                                          onClick={() => setMobileOpen(false)}
                                          className="block px-4 py-2 text-sm rounded-lg text-gray-400 hover:bg-gray-800/50 hover:text-white"
                                        >
                                          {sub.name}
                                        </Link>
                                      )}

                                      {/* LEVEL 3 */}
                                      {hasDeep && isDeepOpen && (
                                        <div className="ml-4 mt-1 space-y-1">
                                          {sub.subItems
                                            .filter(d => !d.permission || hasPermission(d.permission))
                                            .map((deep) => (
                                              <Link
                                                key={deep.name}
                                                to={deep.path}
                                                className="block px-4 py-2 text-xs text-gray-400 hover:bg-gray-800/50 hover:text-white rounded"
                                              >
                                                {deep.name}
                                              </Link>
                                            ))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          })}


        </div>

        {/* PROFILE SECTION */}
        <div className="p-4 border-t border-gray-800">
          <div className={`flex items-center p-2 rounded-xl bg-gray-800/40 ${expanded ? "gap-3" : "justify-center"}`}>
            <img
              src="https://i.pravatar.cc/100?img=11"
              alt="User"
              className="w-10 h-10 rounded-full border border-gray-700"
            />
            {expanded && (
              <div>
                <h4 className="text-white text-sm font-semibold">
                  {currentUser?.name || "User"}
                </h4>
                <p className="text-xs text-gray-400">{currentUser?.role}</p>

              </div>
            )}
          </div>
        </div>

      </aside>
    </>
  );
}