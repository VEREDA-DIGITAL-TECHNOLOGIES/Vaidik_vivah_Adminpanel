import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, Clock } from "lucide-react";

const UserList = ({ profiles, onSelectUser }) => {
  const [sortNewest, setSortNewest] = useState(false);

  // Ensure every profile has profileCompletionPercentage defined
  const normalizedProfiles = useMemo(() => {
    return profiles.map((p) => ({
      ...p,
      profileCompletionPercentage:
        p.profileCompletionPercentage !== undefined && p.profileCompletionPercentage !== null
          ? p.profileCompletionPercentage
          : 0, // default 0% if missing
    }));
  }, [profiles]);

  // Sort profiles by newest first if toggle active
  const sortedProfiles = useMemo(() => {
    if (!sortNewest) return normalizedProfiles;
    return [...normalizedProfiles].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [normalizedProfiles, sortNewest]);

  return (
    <motion.div
      key="list"
      className="max-h-[550px] overflow-y-auto relative"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
    >
      {/* Floating Filter Bar */}
      <div className="sticky top-0 z-20 bg-gradient-to-r from-pink-50 via-white to-pink-50 flex items-center justify-between p-4 border-b border-gray-200 rounded-t-xl shadow-sm">
        <div className="flex items-center space-x-2">
          <Clock className="text-pink-500" size={18} />
          <h2 className="text-lg font-semibold text-gray-700">Users List</h2>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {sortedProfiles.length} users
          </span>
        </div>

        {/* Toggle */}
        <motion.div
          className="flex items-center space-x-3 cursor-pointer select-none"
          onClick={() => setSortNewest((prev) => !prev)}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-sm text-gray-600">
            {sortNewest ? "Newest First" : "Default Order"}
          </span>
          <motion.div
            className={`relative w-14 h-7 rounded-full ${
              sortNewest ? "bg-pink-500" : "bg-gray-300"
            } transition-colors duration-300`}
          >
            <motion.div
              layout
              className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md"
              animate={{ x: sortNewest ? 28 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            />
          </motion.div>
          {sortNewest && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Sparkles className="text-pink-500" size={18} />
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Header */}
      <div className="grid grid-cols-3 sm:grid-cols-7 gap-4 sm:gap-6 p-6 border-b border-gray-100 bg-white sticky top-[60px] z-10">
        <div className="font-semibold text-gray-700">Name</div>
        <div className="font-semibold text-gray-700">Email</div>
        <div className="font-semibold text-gray-700 hidden sm:block">Public ID</div>
        <div className="font-semibold text-gray-700 hidden sm:block">Created At</div>
        <div className="font-semibold text-gray-700 hidden sm:block">Subscription Type</div>
        <div className="font-semibold text-gray-700 hidden sm:block">Days Left</div>
        <div className="font-semibold text-gray-700 hidden sm:block">Profile %</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-100 bg-white">
        {sortedProfiles.length === 0 ? (
          <div className="p-6 text-center text-gray-500 italic">
            No profiles found
          </div>
        ) : (
          sortedProfiles.map((profile) => {
            const personal = profile.personalDetails?.[0];
            const fullName =
              personal?.displayName ||
              `${personal?.firstName || ""} ${personal?.lastName || ""}`.trim();

            // Get public ID from various possible fields
            const publicId =
            profile.public_user_id ||
            profile.publicId ||        // fallback if backend ever changes
            "—";
          

            return (
              <motion.div
              key={profile.public_user_id || profile.userId}
                className="grid grid-cols-3 sm:grid-cols-7 gap-4 sm:gap-6 p-6 hover:bg-pink-50/50 transition-all duration-200 cursor-pointer"
                whileHover={{ scale: 1.01 }}
                onClick={() => onSelectUser(profile)}
              >
                {/* Avatar + Name */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={
                        profile.imageUpload?.[0]?.image?.[0] ||
                        "https://via.placeholder.com/150"
                      }
                      alt="User"
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-pink-100 object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-pink-500 rounded-full border-2 border-white" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-gray-800 font-medium text-sm sm:text-base truncate block max-w-[120px] sm:max-w-[140px]">
                      {fullName || "Unnamed"}
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="text-gray-600 text-sm flex items-center min-w-0">
                  <div className="truncate max-w-[140px] sm:max-w-[180px]">
                    {profile.email}
                  </div>
                </div>

                {/* Public ID */}
                <div className="text-gray-400 hidden sm:flex items-center text-sm min-w-0">
                  <div className="truncate max-w-[140px] font-mono text-xs">
                    {publicId.length > 20 ? `${publicId.substring(0, 20)}...` : publicId}
                  </div>
                </div>

                {/* Created At */}
                <div className="text-gray-400 hidden sm:flex items-center text-sm">
                  {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "—"}
                </div>

                {/* Subscription Type */}
                <div className="text-gray-700 hidden sm:flex items-center text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    profile.usertype === "Platinum" 
                      ? "bg-purple-100 text-purple-800" 
                      : profile.usertype === "Gold" 
                      ? "bg-yellow-100 text-yellow-800" 
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {profile.usertype || "Standard"}
                  </span>
                </div>

                {/* Days Left */}
                <div className="text-gray-700 hidden sm:flex items-center text-sm">
                  {profile.subscriptionDaysLeft !== null && profile.subscriptionDaysLeft !== undefined ? (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      profile.subscriptionDaysLeft <= 0 
                        ? "bg-red-100 text-red-800" 
                        : profile.subscriptionDaysLeft <= 7 
                        ? "bg-orange-100 text-orange-800" 
                        : "bg-green-100 text-green-800"
                    }`}>
                      {profile.subscriptionDaysLeft} days
                    </span>
                  ) : (
                    "—"
                  )}
                </div>

                {/* Profile Completion Percentage */}
                <div className="text-gray-700 hidden sm:flex items-center text-sm">
                  <div className="w-full max-w-[100px]">
                    <div className="flex justify-between text-xs mb-1">
                      <span>{profile.profileCompletionPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          profile.profileCompletionPercentage >= 80 
                            ? "bg-green-500" 
                            : profile.profileCompletionPercentage >= 50 
                            ? "bg-yellow-500" 
                            : "bg-red-500"
                        }`}
                        style={{ width: `${Math.min(profile.profileCompletionPercentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
};

export default UserList;