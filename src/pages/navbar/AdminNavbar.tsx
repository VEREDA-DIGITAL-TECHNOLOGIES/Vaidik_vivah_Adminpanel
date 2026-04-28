import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  UserCog,
  CreditCard,
  ShieldCheck,
  Bell,
  Settings,
  LogOut,
  BookOpen,
  
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


import logo from '../../assets/Photos/v.png';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

const navItemVariant = {
  hidden: { opacity: 0, x: -10 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.2 + i * 0.08,
      type: "spring",
      stiffness: 80,
      damping: 10,
    },
  }),
};

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { admin } = useSelector((state) => state.auth);
  const isLoggedIn = !!admin;

  const [showLogout, setShowLogout] = useState(false);

  const handleNavigate = (path) => {
    console.log("Navigating to:", path); // Debug log
    navigate(path);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", icon: <Home className="w-4 h-4" />, path: "/" },
    { label: "Users", icon: <UserCog className="w-4 h-4" />, path: "/users" },
    {
      label: "User Verification",
      icon: <ShieldCheck className="w-4 h-4" />,
      path: "/user-verification",
    }
,    
    { label: "Transactions", icon: <CreditCard className="w-4 h-4" />, path: "/transactions" },
    { label: "Settings", icon: <Settings className="w-4 h-4" />, path: "/settings" },
    { label: "Plan Control", icon: <ShieldCheck className="w-4 h-4" />, path: "/plan-control" },
    { label: "In-app Banner ", icon: <Bell className="w-4 h-4" />, path: "/banner-section" },
    { label: "Alerts", icon: <Bell className="w-4 h-4" />, path: "/alerts" },
    { label: "User Manual", icon: <BookOpen className="w-4 h-4" />, path: "/user-manual" },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 shadow-md z-50 flex-col justify-between">
      {/* Top Logo */}
      <motion.div
        onClick={() => handleNavigate("/")}
        className="flex items-center gap-2 px-4 py-6 cursor-pointer hover:scale-105 transition-all duration-300"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="w-10 h-10 bg-gray-200 rounded-full shadow-md flex items-center justify-center">
          <img src={logo} alt="Logo" className="w-6 h-6 object-contain" />
        </div>
        <h1 className="text-lg font-bold text-[#FF5E92] whitespace-nowrap">
          Admin Panel
        </h1>
      </motion.div>

      {/* Navigation Links */}
      <nav className="flex flex-col px-4 gap-2 overflow-y-auto">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.button
              key={item.label}
              custom={index}
              variants={navItemVariant}
              initial="hidden"
              animate="visible"
              onClick={() => handleNavigate(item.path)}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#FF5E92] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon} {item.label}
            </motion.button>
          );
        })}
      </nav>

      {/* Logout Section */}
      {isLoggedIn && (
        <div className="relative px-4 py-6">
          <div className="flex flex-col items-start space-y-2">
            <button
              onClick={() => setShowLogout((prev) => !prev)}
              className="text-sm text-gray-600 hover:text-red-600 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>

            <AnimatePresence>
              {showLogout && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="w-full bg-white border border-gray-200 shadow rounded-md p-2"
                >
                  <button
                    onClick={handleLogout}
                    className="w-full text-sm text-red-600 hover:bg-gray-100 px-3 py-2 rounded-md flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Confirm Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </aside>
  );
};

export default AdminNavbar;
