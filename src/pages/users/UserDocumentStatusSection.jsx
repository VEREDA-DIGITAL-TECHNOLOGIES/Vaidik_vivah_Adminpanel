// // src/components/Admin/UserDocumentStatusSection.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   CheckCircle,
//   Clock,
//   ShieldCheck,
//   XCircle,
//   Users,
// } from "lucide-react";
// import { adminStatsApi } from "../../api/adminStatsApi";

// const FILTERS = {
//   ALL: "all",
//   VERIFIED: "verified",
//   UNVERIFIED: "unverified",
// };

// const UserDocumentStatusSection = () => {
//   const [users, setUsers] = useState([]);
//   const [filter, setFilter] = useState(FILTERS.ALL);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [openModal, setOpenModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [nextStatus, setNextStatus] = useState(null);
//   const [remarks, setRemarks] = useState("");
//   const [actionLoading, setActionLoading] = useState(false);

//   /* ---------------- FETCH ---------------- */
//   const fetchVerificationStatus = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await adminStatsApi.getUsersVerificationStatus();
//       setUsers(Array.isArray(res?.data) ? res.data : []);
//     } catch {
//       setError("Failed to load verification data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchVerificationStatus();
//   }, []);

//   /* ---------------- FILTER ---------------- */
//   const filteredUsers = useMemo(() => {
//     if (filter === FILTERS.VERIFIED)
//       return users.filter((u) => u.isVerifiedByAdmin);
//     if (filter === FILTERS.UNVERIFIED)
//       return users.filter((u) => !u.isVerifiedByAdmin);
//     return users;
//   }, [users, filter]);

//   /* ---------------- ACTION ---------------- */
//   const openActionModal = (user, status) => {
//     setSelectedUser(user);
//     setNextStatus(status);
//     setRemarks(user.remarks || "");
//     setOpenModal(true);
//   };

//   const closeModal = () => {
//     setOpenModal(false);
//     setSelectedUser(null);
//     setNextStatus(null);
//     setRemarks("");
//   };

//   const submitAction = async (skipRemarks = false) => {
//     if (!selectedUser) return;

//     const payload = {
//       userId: selectedUser.userId,
//       isVerifiedByAdmin: nextStatus,
//     };

//     if (!skipRemarks && remarks.trim()) {
//       payload.remarks = remarks.trim();
//     }

//     try {
//       setActionLoading(true);
//       await adminStatsApi.verifyUserByAdmin(payload);
//       closeModal();
//       fetchVerificationStatus();
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   /* ---------------- STATUS ---------------- */
//   const StatusBadge = ({ verified }) =>
//     verified ? (
//       <span className="inline-flex items-center gap-1 text-xs text-green-700">
//         <CheckCircle className="w-4 h-4" /> Verified
//       </span>
//     ) : (
//       <span className="inline-flex items-center gap-1 text-xs text-yellow-700">
//         <Clock className="w-4 h-4" /> Unverified
//       </span>
//     );

//   /* ================= RENDER ================= */
//   return (
//     <>
//       <motion.div
//         className="bg-white border border-pink-100 rounded-xl shadow-sm mt-10"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//       >
//         {/* Header */}
//         <div className="px-6 py-4 border-b bg-gradient-to-r from-[#FF5E92] to-[#FF7BB0] text-white rounded-t-xl flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <Users className="w-5 h-5" />
//             <h2 className="text-lg font-semibold">
//               User Admin Verification
//             </h2>
//           </div>

//           {/* Filters */}
//           <div className="flex gap-2 text-sm">
//             {Object.values(FILTERS).map((f) => (
//               <button
//                 key={f}
//                 onClick={() => setFilter(f)}
//                 className={`px-3 py-1 rounded-full border transition ${
//                   filter === f
//                     ? "bg-white text-pink-600 border-white"
//                     : "text-white/80 border-white/40 hover:bg-white/10"
//                 }`}
//               >
//                 {f === "all"
//                   ? "All"
//                   : f === "verified"
//                   ? "Verified"
//                   : "Unverified"}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* States */}
//         {loading && (
//           <div className="py-10 text-center text-gray-500">
//             Loading users…
//           </div>
//         )}

//         {error && (
//           <div className="py-10 text-center text-red-500">
//             {error}
//           </div>
//         )}

//         {!loading && filteredUsers.length === 0 && (
//           <div className="py-10 text-center text-gray-500">
//             No users found
//           </div>
//         )}

//         {/* List Header */}
//         {filteredUsers.length > 0 && (
//           <div className="px-6 py-3 text-xs uppercase text-gray-500 grid grid-cols-12 border-b">
//             <div className="col-span-4">Email</div>
//             <div className="col-span-2">Status</div>
//             <div className="col-span-3">Remarks</div>
//             <div className="col-span-1">Created</div>
//             <div className="col-span-2 text-right">Action</div>
//           </div>
//         )}

//         {/* Rows */}
//         {filteredUsers.map((user) => (
//           <div
//             key={user.userId}
//             className="px-6 py-4 grid grid-cols-12 items-center border-b hover:bg-pink-50/30 transition"
//           >
//             <div className="col-span-4 text-sm text-gray-900">
//               {user.email}
//             </div>

//             <div className="col-span-2">
//               <StatusBadge verified={user.isVerifiedByAdmin} />
//             </div>

//             <div className="col-span-3 text-sm text-gray-600 truncate">
//               {user.remarks || "—"}
//             </div>

//             <div className="col-span-1 text-xs text-gray-500">
//               {user.createdAt
//                 ? new Date(user.createdAt).toLocaleDateString()
//                 : "—"}
//             </div>

//             <div className="col-span-2 flex justify-end">
//               {user.isVerifiedByAdmin ? (
//                 <button
//                   onClick={() => openActionModal(user, false)}
//                   className="text-xs px-3 py-1 rounded-md border border-red-200 text-red-700 hover:bg-red-50"
//                 >
//                   <XCircle className="inline w-4 h-4 mr-1" />
//                   Unverify
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => openActionModal(user, true)}
//                   className="text-xs px-3 py-1 rounded-md border border-green-200 text-green-700 hover:bg-green-50"
//                 >
//                   <ShieldCheck className="inline w-4 h-4 mr-1" />
//                   Verify
//                 </button>
//               )}
//             </div>
//           </div>
//         ))}
//       </motion.div>

//       {/* ================= MODAL ================= */}
//       <AnimatePresence>
//         {openModal && (
//           <motion.div
//             className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <motion.div
//               className="bg-white rounded-xl w-full max-w-md p-6 relative"
//               initial={{ scale: 0.95 }}
//               animate={{ scale: 1 }}
//             >
//               {/* Skip (top-right) */}
//               <button
//                 onClick={() => submitAction(true)}
//                 className="absolute top-4 right-4 text-sm text-gray-500 underline hover:text-gray-700"
//               >
//                 Skip
//               </button>

//               <h3 className="text-lg font-semibold mb-4">
//                 {nextStatus ? "Verify User" : "Unverify User"}
//               </h3>

//               <label className="block text-sm text-gray-600 mb-1">
//                 Remarks (optional)
//               </label>
//               <textarea
//                 rows={4}
//                 value={remarks}
//                 onChange={(e) => setRemarks(e.target.value)}
//                 className="w-full border rounded-md p-3 text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-pink-200"
//               />

//               <div className="flex justify-end gap-3">
//                 <button
//                   onClick={closeModal}
//                   className="px-4 py-2 text-sm border rounded-md"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   disabled={actionLoading}
//                   onClick={() => submitAction(false)}
//                   className="px-4 py-2 text-sm rounded-md bg-pink-600 text-white"
//                 >
//                   Save
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

// export default UserDocumentStatusSection;


import React from 'react'

function UserDocumentStatusSection() {
  return (
    <div>
      
    </div>
  )
}

export default UserDocumentStatusSection
