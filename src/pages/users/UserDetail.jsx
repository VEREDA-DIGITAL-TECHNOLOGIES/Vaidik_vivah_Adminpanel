import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import { adminStatsApi } from "../../api/adminStatsApi";

const UserDetail = ({ user, onBack, refetchUsers }) => {
  const [showSuspendConfirm, setShowSuspendConfirm] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showReportsDialog, setShowReportsDialog] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isSuspending, setIsSuspending] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy hh:mm a");
    } catch {
      return dateString;
    }
  };

  // Get user profile photo - FIXED
  const getProfilePhoto = () => {
    // Check multiple possible locations for profile photo
    const photoSources = [
      user.profilePhoto,
      user.imageUpload?.[0]?.image?.[0],
      user.personalDetails?.[0]?.profilePhoto,
      user.gender === "male"
        ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
        : "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    ];

    // Return the first valid URL
    for (const source of photoSources) {
      if (source && typeof source === "string" && source.length > 0) {
        // Ensure URL is properly formatted
        if (source.startsWith("http") || source.startsWith("data:")) {
          return source;
        } else if (source.startsWith("/")) {
          // Handle relative URLs
          return source;
        }
      }
    }

    // Default placeholder
    return "https://via.placeholder.com/150/cccccc/ffffff?text=No+Photo";
  };

  // Get uploaded images - limited to 3
  const getUploadedImages = () => {
    const images = [];

    // Check multiple possible locations for images
    if (
      user.uploadedImages &&
      Array.isArray(user.uploadedImages) &&
      user.uploadedImages.length > 0
    ) {
      images.push(...user.uploadedImages);
    }

    if (
      user.imageUpload?.[0]?.image &&
      Array.isArray(user.imageUpload[0].image)
    ) {
      images.push(...user.imageUpload[0].image);
    }

    if (
      user.personalDetails?.[0]?.uploadedImages &&
      Array.isArray(user.personalDetails[0].uploadedImages)
    ) {
      images.push(...user.personalDetails[0].uploadedImages);
    }

    // Filter valid images and limit to 3
    const validImages = images.filter(
      (img) => img && typeof img === "string" && img.trim().length > 0
    );

    return validImages.slice(0, 3); // Max 3 images
  };

  const handleSuspendAccount = async () => {
    if (!suspendReason.trim() && !user.isDisabledByAdmin) {
      toast.error("Please provide a reason for disabling the account");
      return;
    }

    setIsSuspending(true);
    try {
      if (user.isDisabledByAdmin) {
        // Enable the user
        const result = await adminStatsApi.enableUser(user.public_user_id);
        toast.success(result.message || "Account enabled successfully");
      } else {
        // Disable the user
        const result = await adminStatsApi.disableUser(
          user.public_user_id,
          suspendReason
        );
        toast.success(result.message || "Account disabled successfully");
      }

      // Simulate delay (for animation, optional)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      refetchUsers?.(); // Refresh list if available
      setShowSuspendConfirm(false);
      setSuspendReason("");
    } catch (error) {
      toast.error(error || "Failed to update account status");
    } finally {
      setIsSuspending(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const result = await adminStatsApi.deleteAccount(user.userId);
      toast.success(result.message || "Account deleted successfully");
      onBack?.();
      refetchUsers?.();
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast.error(error || "Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  const userPhoto = getProfilePhoto();
  const uploadedImages = getUploadedImages();
  const activeSubscription = user.subscriptions?.find(
    (sub) => sub.status === "Active"
  );
  const subscriptionStatus = activeSubscription
    ? `Active (${activeSubscription.plans?.planName || "Premium"})`
    : "No active subscription";

  // Calculate user status
  const getUserStatus = () => {
    if (user.isDisabledByAdmin) return "Disabled";
    if (user.isVerified) return "Verified";
    if (user.userStatus === true || user.userStatus === "active")
      return "Active";
    return "Inactive";
  };

  return (
    <motion.div
      key="detail"
      className="p-4 sm:p-6 max-w-6xl mx-auto"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={onBack}
        className="mb-4 text-sm text-pink-600 hover:underline flex items-center"
        disabled={isSuspending || isDeleting}
      >
        ← Back to user list
      </button>

      {/* Admin Controls Section */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl p-6 shadow-md mb-6"
      >
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Admin Controls
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Reports */}
          <div>
            <p className="text-sm font-medium text-gray-600">Reports</p>
            <button
              onClick={() => setShowReportsDialog(!showReportsDialog)}
              className="text-red-600 underline text-sm"
              disabled={isSuspending || isDeleting}
            >
              View {user.reportedUsers?.length || 0} Reports
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {/* Suspend/Enable Button */}
            <button
              onClick={() => setShowSuspendConfirm(!showSuspendConfirm)}
              className={`flex-1 px-4 py-2 rounded transition ${
                showSuspendConfirm
                  ? "bg-gray-400 hover:bg-gray-500"
                  : user.isDisabledByAdmin
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-yellow-500 hover:bg-yellow-600"
              } text-white disabled:opacity-50 flex items-center justify-center`}
              disabled={isSuspending || isDeleting}
            >
              {isSuspending ? (
                <svg
                  className="animate-spin h-4 w-4 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              ) : null}
              {showSuspendConfirm
                ? "Cancel"
                : isSuspending
                ? "Processing..."
                : user.isDisabledByAdmin
                ? "Enable Account"
                : "Disable Account"}
            </button>

            {/* Delete Button */}
            <button
              onClick={() => setShowDeactivateConfirm(!showDeactivateConfirm)}
              className={`flex-1 px-4 py-2 rounded transition ${
                showDeactivateConfirm
                  ? "bg-gray-400 hover:bg-gray-500"
                  : "bg-red-600 hover:bg-red-700"
              } text-white disabled:opacity-50 flex items-center justify-center`}
              disabled={isSuspending || isDeleting}
            >
              {isDeleting ? (
                <svg
                  className="animate-spin h-4 w-4 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              ) : null}
              {showDeactivateConfirm
                ? "Cancel"
                : isDeleting
                ? "Deleting..."
                : "Delete"}
            </button>
          </div>
        </div>

        {/* Reports Dialog */}
        <AnimatePresence>
          {showReportsDialog && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-6 overflow-hidden"
            >
              <h4 className="text-md font-semibold text-red-600 mb-2">
                Reports Received
              </h4>
              {user.reportedUsers?.length > 0 ? (
                <ul className="text-sm text-gray-700 space-y-2">
                  {user.reportedUsers.map((report, index) => (
                    <li
                      key={index}
                      className="border-l-4 border-red-400 pl-3 py-1"
                    >
                      <strong>Report #{index + 1}</strong>:{" "}
                      {report.reason?.join(", ") || "No reason specified"}
                      <span className="text-gray-500 block text-xs mt-1">
                        Reported on: {formatDate(report.createdAt)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No reports found</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Suspend/Enable Confirmation */}
        <AnimatePresence>
          {showSuspendConfirm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-6 overflow-hidden"
            >
              <div
                className={`p-4 rounded border ${
                  user.isDisabledByAdmin
                    ? "bg-green-50 border-green-300"
                    : "bg-yellow-50 border-yellow-300"
                }`}
              >
                <h4
                  className={`text-md font-semibold mb-2 ${
                    user.isDisabledByAdmin
                      ? "text-green-700"
                      : "text-yellow-700"
                  }`}
                >
                  {user.isDisabledByAdmin
                    ? "Enable Account"
                    : "Disable Account"}
                </h4>

                {!user.isDisabledByAdmin && (
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason for disabling
                    </label>
                    <textarea
                      value={suspendReason}
                      onChange={(e) => setSuspendReason(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      rows="3"
                      placeholder="Enter reason for disabling this account..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Providing a reason helps with transparency and
                      record-keeping.
                    </p>
                  </div>
                )}

                <p className="text-sm mb-3">
                  {user.isDisabledByAdmin
                    ? "This will restore the user's account access and mark their account as active."
                    : "This will restrict the user's account access and mark their account as disabled."}
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    className="px-4 py-1 bg-gray-300 rounded text-sm hover:bg-gray-400 transition"
                    onClick={() => {
                      setShowSuspendConfirm(false);
                      setSuspendReason("");
                    }}
                    disabled={isSuspending}
                  >
                    Cancel
                  </button>
                  <button
                    className={`px-4 py-1 text-white rounded text-sm hover:opacity-90 transition flex items-center justify-center min-w-[80px] ${
                      user.isDisabledByAdmin
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-yellow-600 hover:bg-yellow-700"
                    }`}
                    onClick={handleSuspendAccount}
                    disabled={isSuspending}
                  >
                    {isSuspending ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing
                      </>
                    ) : user.isDisabledByAdmin ? (
                      "Enable"
                    ) : (
                      "Disable"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation */}
        <AnimatePresence>
          {showDeactivateConfirm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-6 overflow-hidden"
            >
              <div className="bg-red-50 p-4 rounded border border-red-300">
                <h4 className="text-md font-semibold text-red-600 mb-2">
                  Confirm Account Deletion
                </h4>
                <p className="text-sm mb-3">
                  This will permanently delete the user account and all
                  associated data. This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    className="px-4 py-1 bg-gray-300 rounded text-sm hover:bg-gray-400 transition"
                    onClick={() => setShowDeactivateConfirm(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition flex items-center justify-center min-w-[80px]"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Deleting
                      </>
                    ) : (
                      "Confirm"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* User Details Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-100 rounded-xl p-6 shadow-inner"
      >
        {/* User Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">User Details</h2>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              getUserStatus() === "Active" || getUserStatus() === "Verified"
                ? "bg-green-100 text-green-800"
                : getUserStatus() === "Disabled"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {getUserStatus()}
            {user.isDisabledByAdmin && user.reasonForDisabledByAdmin && (
              <span className="ml-1 text-xs">
                (Reason: {user.reasonForDisabledByAdmin})
              </span>
            )}
          </span>
        </div>

        {/* User Profile */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
          <img
            src={userPhoto}
            alt="User"
            className="w-20 h-20 rounded-full border-2 border-gray-300 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://via.placeholder.com/150/cccccc/ffffff?text=No+Photo";
            }}
          />
          <div className="text-center sm:text-left">
            <p className="text-lg font-semibold">
              {user.personalDetails?.[0]?.firstName ||
                user.name ||
                user.username ||
                "N/A"}
              {user.personalDetails?.[0]?.lastName
                ? ` ${user.personalDetails[0].lastName}`
                : ""}
            </p>
            <p className="text-gray-600">
              {user.email || "Email not available"}
            </p>
            <p className="text-sm text-gray-500">
              {user.standard || user.usertype || "Standard"} •{" "}
              {subscriptionStatus}
            </p>
            <p className="text-sm text-gray-500">
              Public ID: {user.public_user_id || "N/A"}
            </p>
          </div>
        </div>

        {/* Account Status (Admin) */}
        <div
          className="mb-4 rounded-lg border p-4
  ${user.isDisabledByAdmin 
    ? 'border-yellow-300 bg-yellow-50' 
    : 'border-green-300 bg-green-50'}"
        >
          <h4
            className={`text-sm font-semibold mb-1
    ${user.isDisabledByAdmin ? "text-yellow-800" : "text-green-800"}`}
          >
            {user.isDisabledByAdmin
              ? "Account Disabled by Admin"
              : "Account Active"}
          </h4>

          <p className="text-sm">
            <strong>Status:</strong>{" "}
            {user.isDisabledByAdmin ? "Disabled" : "Active"}
          </p>

          {user.isDisabledByAdmin && user.reasonForDisabledByAdmin && (
            <p className="mt-1 text-sm">
              <strong>Reason:</strong> {user.reasonForDisabledByAdmin}
            </p>
          )}
        </div>

        {/* Basic Info */}
        <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
          <p>
            <strong>Created At:</strong>{" "}
            {user.createdAt ? formatDate(user.createdAt) : "N/A"}
          </p>
          <p>
            <strong>Verified:</strong> {user.isVerified ? "Yes" : "No"}
          </p>
          <p>
            <strong>UID:</strong> {user.userId || user._id || "Not available"}
          </p>
          <p>
            <strong>Public ID:</strong> {user.public_user_id || "Not available"}
          </p>
          <p>
            <strong>Admin Verified:</strong>{" "}
            {user.isVerifiedByAdmin ? "Yes" : "No"}
          </p>
          <p>
            <strong>Last Active:</strong>{" "}
            {user.lastActive ? formatDate(user.lastActive) : "N/A"}
          </p>
        </div>

        {/* Personal Details */}
        {user.personalDetails?.[0] ? (
          <>
            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-2">
              Personal Details
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <p>
                <strong>Name:</strong> {user.personalDetails[0].firstName}{" "}
                {user.personalDetails[0].lastName || ""}
              </p>
              <p>
                <strong>Display Name:</strong>{" "}
                {user.personalDetails[0].displayName || user.username || "N/A"}
              </p>
              <p>
                <strong>Age:</strong> {user.age || "N/A"}
              </p>
              <p>
                <strong>Contact:</strong>{" "}
                {user.personalDetails[0].contactNumber ||
                  user.phoneNumber ||
                  "N/A"}
              </p>
              <p>
                <strong>Marital Status:</strong>{" "}
                {user.personalDetails[0].maritalStatus || "N/A"}
              </p>
              <p>
                <strong>Children:</strong>{" "}
                {user.personalDetails[0].numberOfChildren || "0"}
              </p>
              <p className="sm:col-span-2">
                <strong>About:</strong>{" "}
                {user.personalDetails[0].aboutYourSelf || "Not specified"}
              </p>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500 mt-4">
            No personal details available
          </p>
        )}

        {/* Qualification Details */}
        {user.qualificationDetails?.[0] ? (
          <>
            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-2">
              Qualification
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <p>
                <strong>Qualification:</strong>{" "}
                {user.qualificationDetails[0].qualification || "N/A"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {user.qualificationDetails[0].currentWorkingStatus || "N/A"}
              </p>
              
              <p>
                <strong>Occupation:</strong>{" "}
                {user.qualificationDetails[0].occupation || "N/A"}
              </p>
              <p>
                <strong>Income:</strong>{" "}
                {user?.qualificationDetails?.[0]?.income
                  ? `${user.qualificationDetails[0].income} per annum`
                  : "N/A"}
              </p>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500 mt-4">
            No qualification details available
          </p>
        )}

        {/* Location Details */}
        {user.locationDetails?.[0] ? (
          <>
            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-2">
              Location
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
            
              <p>
                <strong>Full Address:</strong>{" "}
                {user.fullAddress || "Not specified Address"}
              </p>
            
              <p>
                <strong>State:</strong> {user.locationDetails[0].state || "N/A"}
              </p>
              <p>
                <strong>Country:</strong>{" "}
                {user.locationDetails[0].country || "N/A"}
              </p>
              <p>
                <strong>Nationality:</strong>{" "}
                {user.locationDetails[0].nationality || "Not specified"}
              </p>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500 mt-4">
            No location details available
          </p>
        )}

        {/* Other Details */}
        {user.otherDetails?.[0] ? (
          <>
            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-2">
              Other Details
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <p>
                <strong>DOB:</strong>{" "}
                {user.otherDetails[0].dateOfBirth || "N/A"}
              </p>
              <p>
                <strong>Religion:</strong>{" "}
                {user.otherDetails[0].religion || "N/A"}
              </p>
              <p>
                <strong>Caste:</strong> {user.otherDetails[0].caste || "N/A"}
              </p>
              <p>
                <strong>Community:</strong>{" "}
                {user.otherDetails[0].community || "N/A"}
              </p>
              <p>
                <strong>Height:</strong>{" "}
                {user.otherDetails[0].height || "Not specified"}
              </p>
              <p>
                <strong>Weight:</strong>{" "}
                {user.otherDetails[0].weight || "Not specified"}
              </p>
              <p>
                <strong>Body Type:</strong>{" "}
                {user.otherDetails[0].bodyType || "Not specified"}
              </p>
              <p>
                <strong>Complexion:</strong>{" "}
                {user.otherDetails[0].complexion || "Not specified"}
              </p>
              <p>
                <strong>Diet:</strong>{" "}
                {user.otherDetails[0].diet || "Not specified"}
              </p>
              <p>
                <strong>Smoking:</strong>{" "}
                {user.otherDetails[0].smokingHabbit || "Not specified"}
              </p>
              <p>
                <strong>Drinking:</strong>{" "}
                {user.otherDetails[0].drinkingHabbit || "Not specified"}
              </p>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500 mt-4">
            No other details available
          </p>
        )}

        {/* Recommendations / Looking For */}
        {user.recommendations?.[0] ? (
          <>
            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-2">
              Looking For
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <p>
                <strong>Gender:</strong>{" "}
                {user.recommendations[0].lookingFor || user.gender || "N/A"}
              </p>
              <p>
                <strong>Age Range:</strong>{" "}
                {user.recommendations[0].lookingPartnerAge || "N/A"}
              </p>
              <p>
                <strong>Horoscope Match:</strong>{" "}
                {user.recommendations[0].horoscopeMatch || "N/A"}
              </p>
              <p>
                <strong>Caste/Religion:</strong>{" "}
                {user.recommendations[0].castReligionMatterOrNot || "N/A"}
              </p>
              <p className="sm:col-span-2">
                <strong>Hobbies:</strong>{" "}
                {user.recommendations[0].interest_and_hobbies?.join(", ") ||
                  "Not specified"}
              </p>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500 mt-4">
            No preference information available
          </p>
        )}

        {/* Blocked Users */}
        <h3 className="text-lg font-bold text-gray-800 mt-6 mb-2">
          Blocked Users
        </h3>
        {user.blockedUsers?.length > 0 ? (
          <ul className="text-sm text-gray-700 space-y-2">
            {user.blockedUsers.map((blocked, index) => (
              <li key={index} className="border p-2 rounded bg-gray-50">
                <strong>Blocked User ID:</strong>{" "}
                {blocked.blockedUserId || "N/A"}
                <br />
                <strong>Blocked On:</strong>{" "}
                {formatDate(blocked.createdAt) || "N/A"}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No blocked users</p>
        )}

        {/* Favorite Profiles */}
        <h3 className="text-lg font-bold text-gray-800 mt-6 mb-2">
          Favorite Profiles
        </h3>
        {user.FavoritingProfiles?.length > 0 ? (
          <ul className="text-sm text-gray-700 space-y-2">
            {user.FavoritingProfiles.map((fav, index) => (
              <li key={index} className="border p-2 rounded bg-purple-50">
                <strong>User ID:</strong> {fav.favoritedUserId || "N/A"}
                <br />
                <strong>Favorited On:</strong>{" "}
                {formatDate(fav.createdAt) || "N/A"}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No favorite profiles</p>
        )}

        {/* Sent Connections */}
        <h3 className="text-lg font-bold text-gray-800 mt-6 mb-2">
          Sent Connections
        </h3>
        {user.SentConnections?.length > 0 ? (
          <ul className="text-sm text-gray-700 space-y-2">
            {user.SentConnections.map((conn, index) => (
              <li key={index} className="border p-2 rounded bg-blue-50">
                <strong>To:</strong>{" "}
                {conn.Receiver?.email || conn.receiverId || "N/A"}
                <br />
                <strong>Status:</strong>{" "}
                <span className="capitalize">{conn.status || "N/A"}</span>
                <br />
                <strong>Sent On:</strong>{" "}
                {conn.createdAt ? formatDate(conn.createdAt) : "N/A"}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No connections sent</p>
        )}

        {/* Subscriptions */}
        {user.subscriptions?.length > 0 ? (
          <>
            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-2">
              Subscriptions
            </h3>
            <div className="space-y-4">
              {user.subscriptions.map((sub, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
                    <p>
                      <strong>Plan:</strong> {sub.plans?.planName || "N/A"}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span className="capitalize">{sub.status || "N/A"}</span>
                    </p>
                    <p>
                      <strong>Start Date:</strong>{" "}
                      {sub.startDate ? formatDate(sub.startDate) : "N/A"}
                    </p>
                    <p>
                      <strong>End Date:</strong>{" "}
                      {sub.endDate ? formatDate(sub.endDate) : "N/A"}
                    </p>
                    <p className="sm:col-span-2">
                      <strong>Payment:</strong>{" "}
                      <span className="capitalize">
                        {sub.paymentStatus || "N/A"}
                      </span>{" "}
                      (Order ID: {sub.orderId || "N/A"})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500 mt-4">
            No subscription information available
          </p>
        )}

        {/* Uploaded Images - LIMITED TO 3 */}
        <h3 className="text-lg font-bold text-gray-800 mt-6 mb-2">
          Uploaded Images ({uploadedImages.length})
        </h3>
        {uploadedImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {uploadedImages.map((img, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square w-full overflow-hidden rounded-lg border border-gray-300">
                  <img
                    src={img}
                    alt={`User image ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/300/cccccc/ffffff?text=No+Image";
                    }}
                  />
                </div>
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {index + 1}/{uploadedImages.length}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No images uploaded</p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default UserDetail;
