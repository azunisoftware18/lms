import React, { useState, useEffect } from 'react';
import {
  Bell,
  Search,
  Menu,
  User,
  LogOut,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';

export default function DashboardHeader({ toggleSidebar }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const handleLogout = () => {
    dispatch(logout());
    setShowDropdown(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.user-dropdown-area')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDropdown]);

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
    return 'SA';
  };

  const getUserName = () => {
    if (user?.fullName) {
      const names = user.fullName.split(' ');
      if (names.length > 1) {
        return `${names[0]} ${names[names.length - 1][0]}.`;
      }
      return user.fullName;
    }
    return user?.userName || 'User';
  };

  const getUserRole = () => {
    switch (user?.role) {
      case 'ADMIN': return 'Super Admin';
      case 'MANAGER': return 'Manager';
      case 'STAFF': return 'Staff';
      default: return user?.role || 'User';
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10">

      {/* LEFT SIDE: Mobile Menu & Search */}
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Menu Button - Visible only on mobile */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 lg:hidden text-gray-600"
        >
          <Menu size={24} />
        </button>

      </div>

      {/* RIGHT SIDE: Icons & Profile */}
      <div className="flex items-center gap-4 lg:gap-6">
        {/* Separator */}
        <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

        {/* User Profile Dropdown Area */}
        <div className="user-dropdown-area flex items-center gap-3 cursor-pointer group relative">
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold text-gray-700 truncate max-w-30">
              {getUserName()}
            </p>
            <p className="text-xs text-gray-500">{getUserRole()}</p>
          </div>

          {/* User Avatar with Initials */}
          <div
            className="w-9 h-9 rounded-full bg-linear-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white font-semibold border border-gray-200 shadow-sm cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {getInitials()}
          </div>

              

          {/* Dropdown Menu - Shows on click for mobile, hover for desktop */}
          <div
            className={`absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 ${showDropdown ? 'block' : 'hidden'} md:group-hover:block animate-in fade-in slide-in-from-top-2 z-20`}
          >
            {/* User Info in Dropdown (Mobile only) */}
            <div className="md:hidden px-4 py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-linear-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white font-semibold text-sm">
                  {getInitials()}
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">
                    {getUserName()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {getUserRole()}
                  </div>
                </div>
              </div>
            </div>

            {/* Dropdown Menu Items */}
            <button
              onClick={() => {
                navigate("/admin/profile");
                setShowDropdown(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <User size={16} /> My Profile
            </button>

            {/* Additional Admin Links */}
            {user?.role === 'ADMIN' && (
              <>
                <div className="border-t border-gray-100 my-1"></div>
                <a
                  href="/admin/users"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.67 3.623a10.953 10.953 0 01-1.67.623 5.002 5.002 0 00-10 0 10.953 10.953 0 01-1.67-.623m13.67 0a9 9 0 10-13.34 0" />
                  </svg>
                  User Management
                </a>
              </>
            )}

            <hr className="my-1 border-gray-100" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};