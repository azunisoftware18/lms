// src/layouts/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader.jsx";
import Sidebar from "../components/Sidebar.jsx";
// import AdminFooter from "../components/dashboard/AdminFooter";

export default function AdminLayout() {
  return (
    <div className="w-full h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Navbar */}
        <DashboardHeader />

        {/* Page Content */}
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-4 md:p-6 bg-gray-100">
          <Outlet />
        </main>

        {/* Footer */}
        {/* <AdminFooter /> */}
      </div>
    </div>
  );
}
