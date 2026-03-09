import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, X, Phone, MapPin, Clock, User } from "lucide-react";
import { navigationItems } from "../../lib/dumyData";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../store/slices/authSlice"; // ✅ Import clearUser action
import Button from "../ui/Button";
import LeadFormModal from "../modals/LeadFormModal";
// import ApplyLoanModal from "./admin/modals/ApplyLoanModal";

export default function Header() {
  const [showModal, setShowModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileSubmenu, setMobileSubmenu] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // ✅ Loading state for logout

  // ✅ Redux hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // 🔥 ROLE CHECK
  const role = user?.role?.toUpperCase();
  const isSuperAdmin = role === "SUPER_ADMIN";
  const isBranchAdmin = role === "ADMIN" && user?.branchId;

  const closeModal = () => {
    setShowModal(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setMobileSubmenu(null);
  };

  // ✅ Handle logout - Direct Redux action
  const handleLogout = () => {
    setIsLoggingOut(true);
    
    // Simulate API call or directly clear user
    setTimeout(() => {
      dispatch(clearUser()); // Clear user from Redux store
      setIsLoggingOut(false);
      setShowUserDropdown(false);
      setIsMobileMenuOpen(false);
      navigate("/"); // Redirect to home page
    }, 500); // Small delay for UX
  };

  // ✅ Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserDropdown && !event.target.closest('.user-dropdown')) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showUserDropdown]);

  // Top info bar for desktop
  const TopInfoBar = () => (
    <div className="hidden lg:flex bg-blue-900 text-white text-sm py-2 px-6 justify-between items-center">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4" />
          <span>+1-800-FINOVA</span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4" />
          <span>Jaipur, Rajasthan</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span>Mon-Fri: 9AM-6PM</span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Link to="/branch-locator" className="hover:text-blue-200 transition">Branch Locator</Link>
      </div>
    </div>
  );

  // ✅ User Profile Component (Desktop) - WITH LOGOUT
  const UserProfile = () => {
    // Get user initials for avatar
    const getInitials = () => {
      if (user?.fullName) {
        return user.fullName
          .split(' ')
          .map(name => name[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
      }
      if (user?.userName) {
        return user.userName.slice(0, 2).toUpperCase();
      }
      return 'U';
    };

    return (
      <div className="relative user-dropdown">
        <button
          onClick={() => setShowUserDropdown(!showUserDropdown)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-50 transition-all"
          disabled={isLoggingOut}
        >
          {/* User Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white font-semibold">
            {getInitials()}
          </div>

          {/* User Info (hidden on smaller screens) */}
          <div className="hidden md:block text-left">
            <div className="text-sm font-semibold text-gray-800 truncate max-w-[120px]">
              {user?.fullName || user?.userName || 'User'}
            </div>
            <div className="text-xs text-gray-500">
              {user?.role || 'User'}
            </div>
          </div>

          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
        </button>

        {/* User Dropdown Menu */}
        {showUserDropdown && (
          <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-2">
            {/* User Info Section */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white font-semibold">
                  {getInitials()}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">
                    {user?.fullName || user?.userName || 'User'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {user?.email || 'N/A'}
                  </div>
                  <div className="text-xs text-blue-600 font-medium mt-1">
                    ID: {user?.id?.slice(0, 8) || 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <Link
                to="/profile"
                className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-blue-50 transition-all"
                onClick={() => setShowUserDropdown(false)}
              >
                <User className="w-4 h-4" />
                <span>My Profile</span>
              </Link>

              {["ADMIN", "SUPER_ADMIN"].includes(user?.role?.toUpperCase()) && (
                <Link
                  to="/admin"
                  className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-blue-50 transition-all"
                  onClick={() => setShowUserDropdown(false)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Admin Dashboard</span>
                </Link>
              )}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 transition-all border-t border-gray-100 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ✅ Mobile User Profile Component - WITH LOGOUT
  const MobileUserProfile = () => {
    const getInitials = () => {
      if (user?.fullName) {
        return user.fullName
          .split(' ')
          .map(name => name[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
      }
      return 'U';
    };

    return (
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-lg">
            {getInitials()}
          </div>
          <div className="flex-1">
            <div className="font-bold text-gray-800">
              {user?.fullName || user?.userName || 'User'}
            </div>
            <div className="text-sm text-gray-600">
              {user?.email || 'N/A'}
            </div>
            <div className="text-xs text-blue-600 font-medium mt-1">
              ID: {user?.id?.slice(0, 12) || 'N/A'}...
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Role: {user?.role || 'User'}
            </div>
          </div>
        </div>

        <div className="flex space-x-2 mt-3">
          <Link
            to="/profile"
            className="flex-1 bg-white text-blue-600 py-2 rounded-lg text-center font-medium hover:bg-blue-50 transition"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg font-medium hover:bg-red-100 transition disabled:opacity-50"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    );
  };

  // Desktop dropdown menu
  const DesktopDropdownMenu = ({ items }) => {
    return (
      <div className="absolute left-0 top-full mt-1 w-72 bg-white border border-gray-200 shadow-2xl rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transform -translate-y-2 transition-all duration-300 ease-out z-50">
        <div className="p-3">
          {items.map((item, i) => (
            <div key={i} className="relative group/item">
              <Link
                to={item.link}
                className={`flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all rounded-lg ${item.submenu ? "font-semibold" : ""
                  }`}
              >
                <span>{item.name}</span>
                {item.submenu && <ChevronDown className="w-4 h-4 transform -rotate-90" />}
              </Link>

              {item.submenu && (
                <div className="absolute left-full top-0 ml-1 w-72 bg-white border border-gray-200 shadow-2xl rounded-lg opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transform -translate-x-2 transition-all duration-300 ease-out z-50">
                  <div className="p-3">
                    {item.submenu.map((subItem, subI) => (
                      <Link
                        key={subI}
                        to={subItem.link}
                        className="block px-4 py-3 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all rounded-lg"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Tablet dropdown menu
  const TabletDropdownMenu = ({ items, title }) => {
    return (
      <div className="absolute left-0 top-full mt-1 w-80 bg-white border border-gray-200 shadow-2xl rounded-lg z-50">
        <div className="p-4">
          <h4 className="font-bold text-gray-900 mb-3 text-lg border-b pb-2 text-blue-600">
            {title}
          </h4>
          <div className="space-y-2">
            {(isSuperAdmin || isBranchAdmin) && (
              <Link
                to="/admin"
                className="block py-4 px-4 bg-gradient-to-r from-blue-50 to-white rounded-xl hover:from-blue-100 hover:to-blue-50 transition-all font-semibold text-gray-900 border border-blue-100"
                onClick={() => {
                  setActiveDropdown(null);
                  setIsMobileMenuOpen(false);
                }}
              >
                Dashboard
              </Link>
            )}

            {items.map((item, i) => (
              <div key={i}>
                <Link
                  to={item.link}
                  className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all border-l-4 border-transparent hover:border-blue-500"
                  onClick={() => setActiveDropdown(null)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.name}</span>
                    {item.submenu && <ChevronDown className="w-4 h-4" />}
                  </div>
                </Link>
                {item.submenu && (
                  <div className="ml-4 mt-2 space-y-2 border-l-2 border-blue-100 pl-4">
                    {item.submenu.map((subItem, subI) => (
                      <Link
                        key={subI}
                        to={subItem.link}
                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
                        onClick={() => setActiveDropdown(null)}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Mobile menu with submenu support
  const MobileMenu = () => {
    if (mobileSubmenu) {
      const items = navigationItems[mobileSubmenu];
      return (
        <div className="space-y-3">
          {/* Back button */}
          <button
            onClick={() => setMobileSubmenu(null)}
            className="flex items-center space-x-2 text-blue-600 font-semibold mb-4 p-3 bg-blue-50 rounded-lg"
          >
            <ChevronDown className="w-4 h-4 transform rotate-90" />
            <span>Back to Menu</span>
          </button>

          <h3 className="text-lg font-bold text-gray-900 mb-4 px-2">{mobileSubmenu}</h3>

          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i}>
                {item.submenu ? (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition text-sm font-semibold flex items-center justify-between"
                  >
                    <span>{item.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                ) : (
                  <Link
                    to={item.link}
                    className="block px-4 py-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition text-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Show user profile if logged in */}
        {isAuthenticated && user && <MobileUserProfile />}

        {/* Main navigation links */}
        <div className="space-y-2">
          <Link
            to="/"
            className="block py-4 px-4 bg-gradient-to-r from-blue-50 to-white rounded-xl hover:from-blue-100 hover:to-blue-50 transition-all font-semibold text-gray-900 border border-blue-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/products"
            className="block py-4 px-4 bg-gradient-to-r from-blue-50 to-white rounded-xl hover:from-blue-100 hover:to-blue-50 transition-all font-semibold text-gray-900 border border-blue-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Products
          </Link>
        </div>

        {/* Dropdown sections */}
        {Object.entries(navigationItems).map(([title, items]) => (
          <div key={title} className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setMobileSubmenu(title)}
              className="w-full text-left px-4 py-4 bg-white hover:bg-blue-50 transition-all font-semibold text-gray-900 flex items-center justify-between"
            >
              <span>{title}</span>
              <ChevronDown className="w-5 h-5 text-blue-600" />
            </button>
          </div>
        ))}

        <Link
          to="/contact"
          className="block py-4 px-4 bg-gradient-to-r from-blue-50 to-white rounded-xl hover:from-blue-100 hover:to-blue-50 transition-all font-semibold text-gray-900 border border-blue-100 text-center"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Contact Us
        </Link>

        {/* Login link for mobile when not logged in */}
        {!isAuthenticated && (
          <Link
            to="/login"
            className="block w-full border border-blue-600 text-blue-600 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all text-center"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Login
          </Link>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Top Info Bar */}
      <TopInfoBar />

      {/* Main Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-blue-700">Azzunique Capital</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Financial Solutions</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center space-x-1">
              {(isSuperAdmin || isBranchAdmin) && (
                <Link
                  to="/admin"
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-all font-medium rounded-lg hover:bg-blue-50"
                >
                  Dashboard
                </Link>
              )}

              <Link
                to="/"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-all font-medium rounded-lg hover:bg-blue-50"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-all font-medium rounded-lg hover:bg-blue-50"
              >
                Products
              </Link>

              {Object.entries(navigationItems).map(([title, items]) => (
                <div key={title} className="relative group">
                  <button className="flex items-center space-x-1 px-4 py-2 text-gray-700 hover:text-blue-600 transition-all font-medium rounded-lg hover:bg-blue-50">
                    <span>{title}</span>
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  </button>
                  <DesktopDropdownMenu items={items} />
                </div>
              ))}

              <Link
                to="/contact"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-all font-medium rounded-lg hover:bg-blue-50"
              >
                Contact Us
              </Link>
            </nav>

            {/* Tablet Navigation */}
            <nav className="hidden lg:flex xl:hidden items-center space-x-1">
              {(isSuperAdmin || isBranchAdmin) && (
                <Link
                  to="/admin"
                  className="px-3 py-2 text-sm text-gray-700 hover:text-blue-600 transition-all rounded-lg hover:bg-blue-50"
                >
                  Dashboard
                </Link>
              )}

              <Link to="/" className="px-3 py-2 text-sm text-gray-700 hover:text-blue-600 transition-all rounded-lg hover:bg-blue-50">
                Home
              </Link>
              <Link to="/products" className="px-3 py-2 text-sm text-gray-700 hover:text-blue-600 transition-all rounded-lg hover:bg-blue-50">
                Products
              </Link>

              {Object.entries(navigationItems).map(([title, items]) => (
                <div key={title} className="relative">
                  <button
                    className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 hover:text-blue-600 transition-all rounded-lg hover:bg-blue-50"
                    onClick={() => setActiveDropdown(activeDropdown === title ? null : title)}
                  >
                    <span>{title}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === title ? 'rotate-180' : ''}`} />
                  </button>
                  {activeDropdown === title && (
                    <TabletDropdownMenu items={items} title={title} />
                  )}
                </div>
              ))}

              <Link to="/contact" className="px-3 py-2 text-sm text-gray-700 hover:text-blue-600 transition-all rounded-lg hover:bg-blue-50">
                Contact Us
              </Link>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-3">

  {/* Apply Now Button */}
  <Button
    onClick={() => setShowModal(true)}
    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5"
  >
    Apply Now
  </Button>

  {isAuthenticated && user ? (
    <UserProfile />
  ) : (
    <Link
      to="/login"
      className="border border-blue-600 text-blue-600 px-6 py-2.5 rounded-lg hover:bg-blue-50 transition-all font-semibold"
    >
      Login
    </Link>
  )}
</div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs bg-opacity-50">
          <div className="fixed top-0 left-0 w-4/5 sm:w-80 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <div className="flex items-center justify-between mb-6">
                <Link
                  to="/"
                  className="flex items-center space-x-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">F</span>
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">Azzunique Capital</h2>
                    <p className="text-blue-100 text-sm">Financial Solutions</p>
                  </div>
                </Link>
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <MobileMenu />
            </div>

            <div className="p-6 border-t border-gray-200">
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+1-800-FINOVA</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Jaipur, Rajasthan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for tablet dropdowns */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-40 lg:block xl:hidden bg-black bg-opacity-10"
          onClick={() => setActiveDropdown(null)}
        />
      )}
      {showModal && (
  <LeadFormModal
    isOpen={showModal}
    onClose={() => setShowModal(false)}
  />
)}
    </>
  );
}