import { useState, useEffect } from "react";
import { Bell, Loader2, Search, Download, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { adminStatsApi } from "../../api/adminStatsApi";
import FinancialReports from "./FinancialReports";
import { unparse } from "papaparse";

const Transactions = () => {
  const [billingData, setBillingData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [search, setSearch] = useState("");
  const [excludeWomenGold, setExcludeWomenGold] = useState(false);

  const loadBillingData = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await adminStatsApi.getAllBillingInfo();
      setBillingData(data.data);
    } catch (err) {
      setIsError(true);
      console.error("Error loading billing data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBillingData();
  }, []);

  const filtered = billingData
    .filter(
      (entry) =>
        entry.name?.toLowerCase().includes(search.toLowerCase()) ||
        entry.email?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((entry) =>
      excludeWomenGold
        ? !(entry.gender?.toLowerCase() === "female" && entry.currentPlan?.toLowerCase() === "gold")
        : true
    );

  const handleExportCSV = () => {
    const csv = unparse(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `billing_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff0f5] via-white to-[#ffe0eb] p-10 relative overflow-hidden">
      {/* ✨ Soft Gradient Glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FF5E92]/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#ff8fb7]/25 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10 bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/40 p-10">
        {/* 🌸 Header Section */}
        <div className="flex flex-wrap justify-between items-center mb-10 gap-4">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold bg-gradient-to-r from-[#FF5E92] to-[#ff8fb7] text-transparent bg-clip-text"
          >
            User Billing Overview
          </motion.h2>

          <div className="flex items-center gap-5">
            {/* 💖 Toggle Switch */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() => setExcludeWomenGold(!excludeWomenGold)}
              className="flex items-center gap-3 cursor-pointer select-none"
            >
              <span className="text-sm font-semibold text-gray-700">
                {excludeWomenGold ? "Excluding Women (Gold)" : "Showing All"}
              </span>
              <div
                className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                  excludeWomenGold
                    ? "bg-gradient-to-r from-[#FF5E92] to-[#ff8fb7]"
                    : "bg-gray-300"
                }`}
              >
                <motion.div
                  layout
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${
                    excludeWomenGold ? "translate-x-6" : ""
                  }`}
                />
              </div>
            </motion.div>

            {/* 📤 Export Button */}
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 0px 12px rgba(255,94,146,0.6)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FF5E92] to-[#ff8fb7] text-white font-semibold shadow-lg hover:shadow-pink-300/50 transition-all duration-300"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </motion.button>
          </div>
        </div>

        {/* 🔍 Search Bar */}
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-4 top-3 text-[#FF5E92]/70" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 pr-4 py-2.5 w-full border border-[#FF5E92]/40 rounded-full focus:ring-2 focus:ring-[#FF5E92]/60 focus:border-[#FF5E92] outline-none text-gray-700 shadow-sm"
          />
        </div>

        {/* 🧾 Data Section */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 text-[#FF5E92] animate-spin" />
          </div>
        ) : isError ? (
          <div className="flex flex-col justify-center items-center h-60 text-center text-red-500">
            <AlertCircle className="w-10 h-10 mb-2" />
            <p className="font-medium">Failed to load billing data. Please try again.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-2xl border border-[#FF5E92]/20 shadow-lg bg-white"
          >
            <table className="min-w-full text-sm text-left">
              <thead className="bg-[#FF5E92]/10 text-[#FF5E92] uppercase text-xs font-bold tracking-wide">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Gender</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Plan</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Expires</th>
                  <th className="px-6 py-3">Days Left</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3 text-center">Notice</th>
                </tr>
              </thead>

              <tbody>
                <AnimatePresence>
                  {filtered.length > 0 ? (
                    filtered.map((user, index) => (
                      <motion.tr
                        key={user.userId || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className={`border-t ${
                          index % 2 === 0 ? "bg-white" : "bg-[#FFF0F5]/40"
                        } hover:bg-[#FF5E92]/10 transition-all`}
                      >
                        <td className="px-6 py-4 font-semibold text-gray-900">{user.name}</td>
                        <td className="px-6 py-4 text-gray-700">{user.gender}</td>
                        <td className="px-6 py-4 text-gray-700">{user.email}</td>
                        <td className="px-6 py-4 text-[#FF5E92] font-medium">
                          {user.currentPlan}
                        </td>
                        <td className="px-6 py-4">{user.planType}</td>
                        <td className="px-6 py-4">{user.expirationDate}</td>
                        <td className="px-6 py-4 text-[#FF5E92] font-semibold">
                          {user.remainingDays} days
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-800">
                          ₹{user.price}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {user.notifications && (
                            <Bell className="w-5 h-5 text-[#FF5E92] animate-pulse inline-block" />
                          )}
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <td
                        colSpan={9}
                        className="py-10 text-center text-gray-500 font-medium italic"
                      >
                        No users found for your search.
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </motion.div>
        )}
      </div>

      {/* 💹 Financial Reports Section */}
      <div className="mt-16">
        <FinancialReports excludeWomenGold={excludeWomenGold} />
      </div>
    </div>
  );
};

export default Transactions;
