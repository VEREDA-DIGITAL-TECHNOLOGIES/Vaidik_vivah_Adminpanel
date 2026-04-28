// src/pages/admin/Contacts.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Mail,
  Phone,
  User,
  MessageSquare,
  Calendar,
  ChevronDown,
  ChevronUp,
  Trash2,
} from "lucide-react";
import adminContactApi from "../../api/adminContactApi";

/* ---------------- Snackbar Component ---------------- */
function Snackbar({ message, type, onClose }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg text-white z-[999] ${
            type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{message}</span>
            <button onClick={onClose} className="ml-2 text-white font-bold">
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- Confirm Modal Component ---------------- */
function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1000] bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-[#FF5E92] text-white hover:bg-[#e25484] transition"
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------------- Main Component ---------------- */
export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState("all"); // all | contacted | notContacted

  // snackbar state
  const [snackbar, setSnackbar] = useState({ message: "", type: "" });

  // confirm modal state
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmContactId, setConfirmContactId] = useState(null);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await adminContactApi.getAllContacts();
      if (res.success) setContacts(res.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setSnackbar({ message: "Failed to load contacts", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const toggleExpand = (id) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const handleMarkContactedBack = async (id) => {
    try {
      const res = await adminContactApi.markContactedBack(id);
      if (res.success) {
        setContacts((prev) =>
          prev.map((c) => (c.id === id ? { ...c, contactedBack: true } : c))
        );
        setSnackbar({ message: "Marked as contacted", type: "success" });
      }
    } catch (error) {
      console.error("Error marking contacted back:", error);
      setSnackbar({ message: "Failed to update contact", type: "error" });
    }
  };

  const handleDeleteClick = (id) => {
    setConfirmContactId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!confirmContactId) return;
    try {
      const res = await adminContactApi.deleteContact(confirmContactId);
      if (res.success) {
        setContacts((prev) =>
          prev.filter((c) => c.id !== confirmContactId)
        );
        if (expandedId === confirmContactId) setExpandedId(null);
        setSnackbar({ message: "Contact deleted", type: "success" });
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      setSnackbar({ message: "Failed to delete contact", type: "error" });
    } finally {
      setShowConfirm(false);
      setConfirmContactId(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setConfirmContactId(null);
  };

  const filteredContacts = contacts
    .filter((c) => {
      if (filter === "contacted") return c.contactedBack;
      if (filter === "notContacted") return !c.contactedBack;
      return true;
    })
    .filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.mobile.includes(searchTerm)
    );

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold text-[#FF5E92] mb-2">
            Contact Submissions
          </h1>
          <p className="text-gray-600">
            Review all customer inquiries and messages
          </p>
        </motion.div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 mb-6">
          <div className="flex gap-2">
            {["all", "contacted", "notContacted"].map((f) => (
              <button
                key={f}
                className={`px-4 py-2 rounded-full font-medium text-sm ${
                  filter === f
                    ? "bg-[#FF5E92] text-white shadow-md"
                    : "bg-white border border-[#fff0f5] text-gray-700 hover:bg-[#ffe6f0]"
                }`}
                onClick={() => setFilter(f)}
              >
                {f === "all"
                  ? "All"
                  : f === "contacted"
                  ? "Contacted"
                  : "Not Contacted"}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search contacts..."
            className="px-4 py-2 rounded-full border border-[#fff0f5] focus:outline-none focus:ring-2 focus:ring-[#FF5E92] shadow-sm w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Loading / Empty */}
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-20">
            <Loader2 className="animate-spin h-12 w-12 text-[#FF5E92]" />
            <span className="mt-4 text-[#FF5E92] text-lg font-medium">
              Loading contacts...
            </span>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="text-center py-20 text-gray-700">
            No contacts found.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-min">
            <AnimatePresence>
              {filteredContacts.map((contact) => {
                const isExpanded = expandedId === contact.id;
                const spanClass = isExpanded
                  ? "md:col-span-2 lg:col-span-3"
                  : "";

                return (
                  <motion.div
                    key={contact.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`bg-white rounded-xl shadow-md border border-[#fff0f5] flex flex-col overflow-hidden ${spanClass}`}
                  >
                    {/* Summary */}
                    <motion.div
                      className="p-5 cursor-pointer"
                      onClick={() => toggleExpand(contact.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-[#FF5E92] flex items-center justify-center text-white mr-3">
                            <User className="h-5 w-5" />
                          </div>
                          <h2 className="text-xl font-semibold text-[#FF5E92]">
                            {contact.name}
                          </h2>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-[#FF5E92]" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-[#FF5E92]" />
                          )}
                        </motion.div>
                      </div>

                      <div className="mt-3 space-y-2">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-500 mr-2" />
                          <p className="text-sm text-gray-700 truncate">
                            {contact.email}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-500 mr-2" />
                          <p className="text-sm text-gray-700">
                            {contact.mobile}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Expanded details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.28 }}
                          className="px-5 pb-5 border-t border-[#fff0f5] space-y-3"
                        >
                          <div className="bg-[#fff0f5] p-3 rounded-lg">
                            <div className="flex items-center text-sm font-medium text-[#FF5E92] mb-1">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Message
                            </div>
                            <p className="text-gray-700 text-sm">
                              {contact.message}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Submitted:{" "}
                              {new Date(contact.createdAt).toLocaleString()}
                            </div>

                            <div className="flex items-center gap-2">
                              {!contact.contactedBack ? (
                                <button
                                  onClick={() =>
                                    handleMarkContactedBack(contact.id)
                                  }
                                  className="px-3 py-1 bg-[#FF5E92] text-white rounded-md text-sm hover:bg-[#e25484]"
                                >
                                  Mark Contacted Back
                                </button>
                              ) : (
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm">
                                  Contacted
                                </span>
                              )}

                              {/* Delete button */}
                              <button
                                onClick={() => handleDeleteClick(contact.id)}
                                className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200 flex items-center gap-1"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <ConfirmModal
          title="Delete Contact"
          message="Are you sure you want to delete this contact? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      {/* Snackbar */}
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar({ message: "", type: "" })}
      />
    </div>
  );
}
