import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import StatsWidget from "./StatsWidget";
import UserDetail from "./UserDetail";
import UserList from "./UserList";
import UserDocumentStatusSection from "./UserDocumentStatusSection";
import axiosInstance from "../../api/axiosInstance";

const Users = () => {
  const [selectedPlan, setSelectedPlan] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [userStats, setUserStats] = useState({
    standardUsers: 0,
    goldUsers: 0,
    platinumUsers: 0,
    diamondUsers: 0,
    totalUsers: 0,
    newUsersLast7Days: 0,
  });
  const [loading, setLoading] = useState({
    users: false,
    status: false,
  });

  // API functions
  const getAllUsers = async () => {
    setLoading(prev => ({ ...prev, users: true }));
    try {
      const res = await axiosInstance.get("admin-dashboard/all-users");
      console.log("✅ getAllUsers response:", res);
      return res.data;
    } catch (err) {
      console.error("❌ Error in getAllUsers:", err);
      throw err?.response?.data?.message || err.message;
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  const getUserStatus = async () => {
    setLoading(prev => ({ ...prev, status: true }));
    try {
      const res = await axiosInstance.get("admin-dashboard/user-status");
      console.log("✅ getUserStatus response:", res);
      return res.data;
    } catch (err) {
      console.error("❌ Error in getUserStatus:", err);
      throw err?.response?.data?.message || err.message;
    } finally {
      setLoading(prev => ({ ...prev, status: false }));
    }
  };

  // Fetch data
  const fetchData = async () => {
    try {
      const [userListData, userStatusData] = await Promise.all([
        getAllUsers(),
        getUserStatus()
      ]);

      console.log("📦 userListData:", userListData);
      console.log("📦 userStatusData:", userStatusData);

      if (userListData?.data && Array.isArray(userListData.data)) {
        setProfiles(userListData.data);
        console.log("👥 Set profiles:", userListData.data);
      } else {
        setProfiles([]);
        console.warn("⚠️ No valid user list data found.");
      }

      const stats = userStatusData?.stats || {};
      console.log("📊 Parsed stats:", stats);

      setUserStats({
        standardUsers: stats.standardUsers || 0,
        goldUsers: stats.goldUsers || 0,
        platinumUsers: stats.platinumUsers || 0,
        diamondUsers: stats.diamondUsers || 0,
        totalUsers: stats.totalUsers || 0,
        newUsersLast7Days: stats.newUsersLast7Days || 0,
      });
    } catch (error) {
      console.error("❌ Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProfiles = useMemo(() => {
    const filteredByPlan =
      selectedPlan === "All"
        ? profiles
        : profiles.filter((p) => p.usertype === selectedPlan);

    const finalFiltered = filteredByPlan.filter((profile) => {
      const personal = profile.personalDetails?.[0];
      const nameMatch =
        personal?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        personal?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        personal?.displayName?.toLowerCase().includes(searchQuery.toLowerCase());

      const emailMatch = profile.email?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // ADDED: Search by public ID
      const publicIdMatch = profile.public_user_id?.toLowerCase().includes(searchQuery.toLowerCase());

      return nameMatch || emailMatch || publicIdMatch;
    });

    console.log("🔍 Filtered profiles:", finalFiltered);
    return finalFiltered;
  }, [profiles, searchQuery, selectedPlan]);

  const handlePlanSelect = (plan) => {
    console.log(`🟢 Plan selected: ${plan}`);
    setSelectedPlan(plan);
    setSelectedUser(null);
  };

  return (
    <motion.div
      className="p-6 sm:p-8 bg-gray-50 min-h-screen"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Plan Filter */}
      <motion.div className="flex flex-wrap items-center justify-start gap-4 mb-8 p-4 bg-white rounded-lg shadow-sm">
        {["All", "Standard", "Gold", "Platinum", "Diamond"].map((plan) => (
          <motion.button
            key={plan}
            onClick={() => handlePlanSelect(plan)}
            disabled={!!selectedUser}
            className={`px-6 py-2 text-sm sm:text-base font-semibold transition-all duration-300 ease-in-out transform ${
              selectedPlan === plan
                ? "text-pink-600 border-b-4 border-pink-600"
                : "text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg"
            } ${selectedUser ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {plan}
          </motion.button>
        ))}
      </motion.div>

      {/* Stats */}
      <motion.div
        className="bg-white rounded-xl p-6 my-9 shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <StatsWidget
          totalUser={userStats.totalUsers}
          newUser={userStats.newUsersLast7Days}
          deleted={0}
        />
      </motion.div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* User List or Detail View */}
        <motion.div
          className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden flex-1"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="p-6 border-b border-gray-200">
            {/* UPDATED: Changed placeholder text to include public ID */}
            <input
              type="text"
              placeholder="Search by name, email, or public ID..."
              className="w-full p-2 border border-gray-300 rounded-lg"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>

          {loading.users || loading.status ? (
            <div className="p-6 text-center text-gray-500">Loading users...</div>
          ) : (
            <AnimatePresence mode="wait">
              {selectedUser ? (
                <UserDetail
                  user={selectedUser}
                  onBack={() => setSelectedUser(null)}
                  refetchUsers={fetchData}
                />
              ) : (
                <UserList profiles={filteredProfiles} onSelectUser={setSelectedUser} />
              )}
            </AnimatePresence>
          )}
        </motion.div>
         
     
      </div>
      <UserDocumentStatusSection />

    {/* Right Side – Plan Insights */}
<motion.div
  className="w-full"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.5 }}
>
  <div className="bg-white rounded-xl shadow-lg p-6">
    <motion.h2
      className="text-lg font-semibold text-gray-700 mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      Plan Insights
    </motion.h2>

    {/* HORIZONTAL LAYOUT */}
    <div className="flex flex-wrap gap-4 justify-between">
      {[
        { name: "Standard", color: "#D1C4E9", text: "purple", value: userStats.standardUsers },
        { name: "Gold", color: "#C8E6C9", text: "green", value: userStats.goldUsers },
        { name: "Platinum", color: "#FFECB3", text: "orange", value: userStats.platinumUsers },
        { name: "Diamond", color: "#FFCDD2", text: "rose", value: userStats.diamondUsers },
      ].map((plan, i) => (
        <motion.div
          key={plan.name}
          className="flex-1 min-w-[220px] max-w-[260px] rounded-lg p-4 shadow-md"
          style={{ backgroundColor: plan.color }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + i * 0.1 }}
        >
          <div className={`text-sm font-medium text-${plan.text}-800`}>
            {plan.name}
          </div>
          <div className={`text-2xl font-bold text-${plan.text}-700`}>
            {plan.value}
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</motion.div>

    </motion.div>

    
  );
};

export default Users;