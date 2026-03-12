import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, X, Phone, MapPin, Clock, User, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { navigationItems } from "../lib/dumyData";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../store/slices/authSlice";
import Button from "./ui/Button";
import LeadFormModal from "./modals/LeadFormModal";

export default function Header() {
  const [showModal, setShowModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpandedSection, setMobileExpandedSection] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const userDropdownRef = useRef(null);
  const navRef = useRef(null);

  const role = user?.role?.toUpperCase();
  const isSuperAdmin = role === "SUPER_ADMIN";
  const isAdmin = role === "ADMIN";
  const hasAdminAccess = isSuperAdmin || (isAdmin && user?.branchId);

  // Scroll shadow effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      dispatch(clearUser());
      setIsLoggingOut(false);
      setShowUserDropdown(false);
      setIsMobileMenuOpen(false);
      navigate("/");
    }, 500);
  };

  const getInitials = (u) => {
    if (u?.fullName) return u.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    if (u?.userName) return u.userName.slice(0, 2).toUpperCase();
    return "U";
  };

  const Avatar = ({ size = "sm" }) => (
    <div className={`
      rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center
      text-white font-bold flex-shrink-0
      ${size === "sm" ? "w-9 h-9 text-sm" : "w-11 h-11 text-base"}
    `}>
      {getInitials(user)}
    </div>
  );

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Products", to: "/products" },
    { label: "Contact Us", to: "/contact" },
  ];

  return (
    <>
      {/* ── TOP INFO BAR (desktop only) ── */}
      <div className="hidden lg:block bg-blue-900 text-white text-xs">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><Phone size={12} /> +1-800-FINOVA</span>
            <span className="flex items-center gap-1.5"><MapPin size={12} /> Jaipur, Rajasthan</span>
            <span className="flex items-center gap-1.5"><Clock size={12} /> Mon–Fri: 9AM–6PM</span>
          </div>
          <Link to="/branch-locator" className="hover:text-blue-200 transition-colors">Branch Locator</Link>
        </div>
      </div>

      {/* ── MAIN HEADER ── */}
      <header className={`
        sticky top-0 z-50 bg-white transition-shadow duration-200
        ${scrolled ? "shadow-md" : "shadow-sm border-b border-gray-100"}
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 lg:h-[68px] gap-3">

            {/* LOGO */}
            <Link
              to="/"
              className="flex items-center gap-2.5 shrink-0 group min-w-[180px]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="w-9 h-9 bg-linear-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-blue-200 group-hover:shadow-md transition-shadow">
                <span className="text-white font-black text-base">F</span>
              </div>
              <div className="leading-tight">
                <div className="text-lg font-black text-blue-700 tracking-tight">Azzunique Capital</div>
                <div className="text-[10px] text-gray-400 font-medium hidden sm:block -mt-0.5">Financial Solutions</div>
              </div>
            </Link>

            {/* ── DESKTOP NAV (1280px+) ── */}
            <nav ref={navRef} className="hidden xl:flex items-center gap-0.5">
              {hasAdminAccess && (
                <Link to="/admin" className="nav-link flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-blue-700 rounded-lg hover:bg-blue-50 transition-colors">
                  <LayoutDashboard size={14} /> Dashboard
                </Link>
              )}
              {navLinks.map(({ label, to }) => (
                <Link key={to} to={to} className="px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors">
                  {label}
                </Link>
              ))}
              {Object.entries(navigationItems).map(([title, items]) => (
                <div key={title} className="relative group">
                  <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors">
                    {title}
                    <ChevronDown size={14} className="opacity-60 transition-transform group-hover:rotate-180" />
                  </button>
                  {/* Desktop mega dropdown */}
                  <div className="absolute left-0 top-full mt-1.5 w-64 bg-white border border-gray-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible -translate-y-1 group-hover:translate-y-0 transition-all duration-200 z-50">
                    <div className="p-1.5">
                      {items.map((item, i) => (
                        <div key={i} className="relative group/sub">
                          <Link
                            to={item.link}
                            className="flex items-center justify-between px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                          >
                            <span>{item.name}</span>
                            {item.submenu && <ChevronDown size={12} className="-rotate-90 opacity-50" />}
                          </Link>
                          {item.submenu && (
                            <div className="absolute left-full top-0 ml-1 w-60 bg-white border border-gray-200 rounded-xl shadow-xl opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-150 z-50">
                              <div className="p-1.5">
                                {item.submenu.map((sub, si) => (
                                  <Link key={si} to={sub.link} className="block px-3 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                                    {sub.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </nav>

            {/* ── LAPTOP NAV (1024–1279px) ── */}
            <nav ref={navRef} className="hidden lg:flex xl:hidden items-center gap-0.5 flex-1 justify-center">
              {hasAdminAccess && (
                <Link to="/admin" className="px-2.5 py-1.5 text-xs font-semibold text-blue-700 rounded-lg hover:bg-blue-50 transition-colors">
                  Dashboard
                </Link>
              )}
              <Link to="/" className="px-2.5 py-1.5 text-xs font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors">Home</Link>
              <Link to="/products" className="px-2.5 py-1.5 text-xs font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors">Products</Link>

              {Object.entries(navigationItems).map(([title, items]) => (
                <div key={title} className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === title ? null : title)}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors"
                  >
                    {title}
                    <ChevronDown size={12} className={`opacity-60 transition-transform ${activeDropdown === title ? "rotate-180" : ""}`} />
                  </button>
                  {activeDropdown === title && (
                    <div className="absolute left-0 top-full mt-1.5 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50">
                      <div className="p-1.5">
                        {hasAdminAccess && (
                          <Link to="/admin" className="block px-3 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50 rounded-lg mb-1 transition-colors" onClick={() => setActiveDropdown(null)}>
                            Dashboard
                          </Link>
                        )}
                        {items.map((item, i) => (
                          <div key={i}>
                            <Link to={item.link} className="flex items-center justify-between px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors" onClick={() => setActiveDropdown(null)}>
                              <span>{item.name}</span>
                              {item.submenu && <ChevronDown size={12} className="opacity-50" />}
                            </Link>
                            {item.submenu && (
                              <div className="ml-4 pl-3 border-l-2 border-blue-100 space-y-0.5 mb-1">
                                {item.submenu.map((sub, si) => (
                                  <Link key={si} to={sub.link} className="block px-2 py-2 text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" onClick={() => setActiveDropdown(null)}>
                                    {sub.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <Link to="/contact" className="px-2.5 py-1.5 text-xs font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors">Contact</Link>
            </nav>

            {/* ── RIGHT ACTIONS ── */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Apply Now — hidden on small mobile, shown md+ */}
              <div className="hidden md:block">
                <Button
                  onClick={() => setShowModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 lg:px-5 lg:py-2.5 rounded-lg font-semibold shadow-sm hover:shadow-blue-200 hover:shadow-md transition-all"
                >
                  Apply Now
                </Button>
              </div>

              {/* User profile / login — hidden on mobile (shown in drawer) */}
              <div className="hidden lg:block">
                {isAuthenticated && user ? (
                  <div className="relative" ref={userDropdownRef}>
                    <button
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                      disabled={isLoggingOut}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                    >
                      <Avatar />
                      <div className="hidden xl:block text-left max-w-[110px]">
                        <div className="text-sm font-semibold text-gray-800 truncate leading-tight">
                          {user?.fullName || user?.userName || "User"}
                        </div>
                        <div className="text-[10px] text-gray-400 capitalize">{user?.role?.toLowerCase() || "user"}</div>
                      </div>
                      <ChevronDown size={14} className={`opacity-50 transition-transform ${showUserDropdown ? "rotate-180" : ""}`} />
                    </button>

                    {showUserDropdown && (
                      <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                        {/* User card */}
                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-4 text-white">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-black text-lg">
                              {getInitials(user)}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold truncate">{user?.fullName || user?.userName || "User"}</div>
                              <div className="text-blue-200 text-xs truncate">{user?.email || "N/A"}</div>
                              <div className="text-blue-300 text-[10px] mt-0.5">ID: {user?.id?.slice(0, 10) || "N/A"}</div>
                            </div>
                          </div>
                        </div>
                        {/* Menu */}
                        <div className="p-2">
                          <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors" onClick={() => setShowUserDropdown(false)}>
                            <User size={15} className="text-gray-400" /> My Profile
                          </Link>
                          {hasAdminAccess && (
                            <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors" onClick={() => setShowUserDropdown(false)}>
                              <LayoutDashboard size={15} className="text-gray-400" /> Admin Dashboard
                            </Link>
                          )}
                          <div className="border-t border-gray-100 mt-1.5 pt-1.5">
                            <button
                              onClick={handleLogout}
                              disabled={isLoggingOut}
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                            >
                              <LogOut size={15} /> {isLoggingOut ? "Logging out…" : "Logout"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link to="/login" className="border border-blue-600 text-blue-600 px-4 py-2 lg:px-5 lg:py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors">
                    Login
                  </Link>
                )}
              </div>

              {/* Hamburger — visible below lg */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── MOBILE / TABLET DRAWER ── */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="lg:hidden fixed top-0 left-0 h-full w-[min(320px,85vw)] bg-white z-50 flex flex-col shadow-2xl">
            {/* Drawer header */}
            <div className="bg-gradient-to-br from-blue-700 to-blue-900 px-5 py-5 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <Link to="/" className="flex items-center gap-2.5" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-white font-black text-base">F</span>
                  </div>
                  <div>
                    <div className="text-white font-bold">Azzunique Capital</div>
                    <div className="text-blue-200 text-xs">Financial Solutions</div>
                  </div>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Mobile: user card inside drawer header */}
              {isAuthenticated && user ? (
                <div className="bg-white/10 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {getInitials(user)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-white font-semibold text-sm truncate">{user?.fullName || user?.userName || "User"}</div>
                    <div className="text-blue-200 text-xs truncate">{user?.email || "N/A"}</div>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="block text-center bg-white text-blue-700 font-semibold py-2.5 rounded-xl text-sm hover:bg-blue-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>

            {/* Drawer nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {/* Apply Now — shown in drawer on small screens */}
              <div className="md:hidden pb-3 mb-2 border-b border-gray-100">
                <button
                  onClick={() => { setShowModal(true); setIsMobileMenuOpen(false); }}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
                >
                  Apply Now
                </button>
              </div>

              {hasAdminAccess && (
                <Link
                  to="/admin"
                  className="flex items-center gap-3 px-3 py-3 text-sm font-semibold text-blue-700 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
              )}

              {navLinks.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center px-3 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}

              <div className="pt-1 border-t border-gray-100 space-y-1">
                {Object.entries(navigationItems).map(([title, items]) => (
                  <div key={title}>
                    <button
                      onClick={() => setMobileExpandedSection(mobileExpandedSection === title ? null : title)}
                      className="w-full flex items-center justify-between px-3 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      {title}
                      <ChevronDown size={15} className={`opacity-50 transition-transform ${mobileExpandedSection === title ? "rotate-180" : ""}`} />
                    </button>

                    {mobileExpandedSection === title && (
                      <div className="ml-3 pl-3 border-l-2 border-blue-100 space-y-0.5 mb-1">
                        {items.map((item, i) => (
                          <div key={i}>
                            <Link
                              to={item.link}
                              className="block px-3 py-2.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {item.name}
                            </Link>
                            {item.submenu && (
                              <div className="ml-3 pl-3 border-l border-gray-100">
                                {item.submenu.map((sub, si) => (
                                  <Link
                                    key={si}
                                    to={sub.link}
                                    className="block px-2 py-2 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    {sub.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Logged-in actions */}
              {isAuthenticated && user && (
                <div className="pt-2 border-t border-gray-100 space-y-1">
                  <Link to="/profile" className="flex items-center gap-3 px-3 py-3 text-sm text-gray-700 rounded-xl hover:bg-gray-50 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                    <User size={15} className="text-gray-400" /> My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-3 px-3 py-3 text-sm text-red-600 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <LogOut size={15} /> {isLoggingOut ? "Logging out…" : "Logout"}
                  </button>
                </div>
              )}
            </nav>

            {/* Drawer footer */}
            <div className="flex-shrink-0 px-5 py-4 border-t border-gray-100 space-y-1.5 text-xs text-gray-500">
              <div className="flex items-center gap-2"><Phone size={11} /> +1-800-FINOVA</div>
              <div className="flex items-center gap-2"><MapPin size={11} /> Jaipur, Rajasthan</div>
            </div>
          </div>
        </>
      )}

      {/* Overlay to close laptop dropdown */}
      {activeDropdown && (
        <div className="fixed inset-0 z-40 xl:hidden" onClick={() => setActiveDropdown(null)} />
      )}

      {showModal && <LeadFormModal isOpen={showModal} onClose={() => setShowModal(false)} />}
    </>
  );
}