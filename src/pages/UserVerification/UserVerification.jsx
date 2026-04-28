import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Search,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { adminStatsApi } from "../../api/adminStatsApi";
import DisabledUsersPanel from "./DisabledUsersPanel";

/* ================= CONSTANTS ================= */
const FILTERS = {
  ALL: "all",
  VERIFIED: "verified",
  UNVERIFIED: "unverified",
};

/* ================= SNACKBAR ================= */
const Snackbar = ({ open, type, message, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-pink-500 text-white px-4 py-3 rounded shadow-lg flex items-center gap-3 z-50">
      {type === "success" ? (
        <CheckCircle className="w-4 h-4" />
      ) : (
        <XCircle className="w-4 h-4" />
      )}
      <span className="text-sm">{message}</span>
      <button onClick={onClose} className="ml-2 text-white/80 hover:text-white">
        ✕
      </button>
    </div>
  );
};

/* ================= STATUS BADGE ================= */
const StatusBadge = ({ verified }) => (
  <span
    className={`inline-flex px-2.5 py-1 rounded text-xs font-medium border
      ${
        verified
          ? "border-pink-300 text-black"
          : "border-pink-200 text-black"
      }`}
  >
    {verified ? "Verified" : "Pending"}
  </span>
);

/* ================= MAIN COMPONENT ================= */
const UserVerification = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState(FILTERS.ALL);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [nextStatus, setNextStatus] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "success",
    message: "",
  });

  const showSnackbar = (type, message) => {
    setSnackbar({ open: true, type, message });
    setTimeout(() => setSnackbar((s) => ({ ...s, open: false })), 3000);
  };

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminStatsApi.getUsersVerificationStatus();
      setUsers(Array.isArray(res?.data) ? res.data : []);
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= FILTERING ================= */
  const filteredUsers = useMemo(() => {
    let list = users;

    if (filter === FILTERS.VERIFIED)
      list = list.filter((u) => u.isVerifiedByAdmin);
    if (filter === FILTERS.UNVERIFIED)
      list = list.filter((u) => !u.isVerifiedByAdmin);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (u) =>
          u.email?.toLowerCase().includes(q) ||
          u.remarks?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [users, filter, searchQuery]);

  /* ================= STATS ================= */
  const stats = useMemo(() => {
    const total = users.length;
    const verified = users.filter((u) => u.isVerifiedByAdmin).length;
    return {
      total,
      verified,
      unverified: total - verified,
    };
  }, [users]);

  /* ================= ACTION ================= */
  const openActionModal = (user, status) => {
    setSelectedUser(user);
    setNextStatus(status);
    setRemarks(user.remarks || "");
    setOpenModal(true);
  };

  const submitAction = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      await adminStatsApi.verifyUserByAdmin({
        userId: selectedUser.userId,
        isVerifiedByAdmin: nextStatus,
        remarks: remarks.trim() || undefined,
      });

      showSnackbar(
        "success",
        nextStatus ? "User verified" : "Verification revoked"
      );

      setOpenModal(false);
      fetchUsers();
    } catch {
      showSnackbar("error", "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-white p-6">
      {/* HEADER */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-black">
            User Verification
          </h1>
          <p className="text-sm text-gray-600">
            Manage user verification status
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-pink-500 text-white rounded hover:bg-pink-600"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          ["Total Users", stats.total],
          ["Verified", stats.verified],
          ["Pending", stats.unverified],
        ].map(([label, value]) => (
          <div
            key={label}
            className="bg-white border border-pink-200 rounded p-4"
          >
            <p className="text-sm text-gray-600">{label}</p>
            <p className="text-2xl font-semibold text-black">{value}</p>
          </div>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white border border-pink-200 rounded overflow-hidden">
        {/* CONTROLS */}
        <div className="p-4 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="pl-9 pr-4 py-2 border border-pink-300 rounded text-sm w-64"
            />
          </div>

          <div className="flex gap-2">
            {Object.values(FILTERS).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-sm rounded border
                  ${
                    filter === f
                      ? "bg-pink-500 text-white border-pink-500"
                      : "bg-white text-black border-pink-300"
                  }`}
              >
                {f === "all"
                  ? "All"
                  : f === "verified"
                  ? "Verified"
                  : "Pending"}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="py-12 text-center text-gray-600">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Loading users…
          </div>
        )}

        {error && (
          <div className="py-12 text-center text-red-600">
            <AlertCircle className="w-6 h-6 mx-auto mb-2" />
            {error}
          </div>
        )}

        {!loading && filteredUsers.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            No users found
          </div>
        )}

        {!loading && filteredUsers.length > 0 && (
          <table className="w-full">
            <thead className="bg-white border-b border-pink-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase">
                  Remarks
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-pink-200">
              {filteredUsers.map((u) => (
                <tr key={u.userId} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        navigate(`/user-verification/${u.userId}`)
                      }
                      className="text-sm text-black hover:underline"
                    >
                      {u.email}
                    </button>
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge verified={u.isVerifiedByAdmin} />
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {u.remarks || "—"}
                  </td>

                  <td className="px-6 py-4">
                    {u.isVerifiedByAdmin ? (
                      <button
                        onClick={() => openActionModal(u, false)}
                        className="text-sm px-3 py-1.5 border border-pink-300 rounded"
                      >
                        Revoke
                      </button>
                    ) : (
                      <button
                        onClick={() => openActionModal(u, true)}
                        className="text-sm px-3 py-1.5 bg-pink-500 text-white rounded hover:bg-pink-600"
                      >
                        Verify
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {openModal && selectedUser && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-full max-w-md rounded shadow-xl"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              <div className="p-5 border-b border-pink-200">
                <h3 className="font-medium text-black">
                  {nextStatus ? "Verify User" : "Revoke Verification"}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedUser.email}
                </p>
              </div>

              <div className="p-5">
                <textarea
                  rows={4}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Optional remarks"
                  className="w-full border border-pink-300 rounded px-3 py-2 text-sm"
                />
              </div>

              <div className="p-4 border-t border-pink-200 flex justify-end gap-3">
                <button
                  onClick={() => setOpenModal(false)}
                  className="px-3 py-2 text-sm border border-pink-300 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={submitAction}
                  disabled={actionLoading}
                  className="px-3 py-2 text-sm bg-pink-500 text-white rounded hover:bg-pink-600"
                >
                  {actionLoading ? "Saving..." : "Confirm"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <DisabledUsersPanel></DisabledUsersPanel>

      <Snackbar
        open={snackbar.open}
        type={snackbar.type}
        message={snackbar.message}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      />
    </div>
  );
};

export default UserVerification;
