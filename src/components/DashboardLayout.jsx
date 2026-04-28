import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../pages/navbar/AdminNavbar";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 h-full w-64 z-50 bg-white shadow-md">
        <AdminNavbar />
      </div>

      {/* Page Content (with left margin to avoid overlapping sidebar) */}
      <main className="ml-64 flex-1 overflow-auto p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
