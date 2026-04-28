import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  UserX,
  Search,
  X,
} from "lucide-react";
import { adminStatsApi } from "../../api/adminStatsApi";

const DisabledUsersPanel = () => {
  const [users, setUsers] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔍 Filters
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchDisabledUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminStatsApi.getDisabledUsers();
      setUsers(Array.isArray(res?.data) ? res.data : []);
    } catch {
      setError("Failed to load disabled users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisabledUsers();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  /* ================= FILTER LOGIC ================= */
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // 🔍 TEXT SEARCH
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        u.email?.toLowerCase().includes(q) ||
        u.public_user_id?.toLowerCase().includes(q) ||
        u.reasonForDisabledByAdmin?.toLowerCase().includes(q);

      // 📅 DATE FILTER (Disabled date = updatedAt)
      const disabledDate = new Date(u.updatedAt).setHours(0, 0, 0, 0);
      const from = fromDate ? new Date(fromDate).setHours(0, 0, 0, 0) : null;
      const to = toDate ? new Date(toDate).setHours(23, 59, 59, 999) : null;

      const matchesDate =
        (!from || disabledDate >= from) &&
        (!to || disabledDate <= to);

      return matchesSearch && matchesDate;
    });
  }, [users, search, fromDate, toDate]);

  const clearFilters = () => {
    setSearch("");
    setFromDate("");
    setToDate("");
  };

  return (
    <div className="mt-12">
      {/* HEADER */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-black flex items-center gap-2">
            <UserX className="w-5 h-5 text-red-600" />
            Disabled Users
          </h2>
          <p className="text-sm text-gray-600">
            Accounts disabled by admin with complete profile details
          </p>
        </div>

        <p className="text-sm text-gray-600">
          Showing <b>{filteredUsers.length}</b> of {users.length}
        </p>
      </div>

      {/* 🔍 FILTER BAR */}
      <div className="mb-6 bg-white border border-pink-200 rounded p-4 flex flex-col lg:flex-row gap-4">
        {/* SEARCH */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email, public ID, reason…"
            className="w-full pl-9 pr-3 py-2 border border-pink-300 rounded text-sm"
          />
        </div>

        {/* DATE FROM */}
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border border-pink-300 rounded px-3 py-2 text-sm"
        />

        {/* DATE TO */}
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border border-pink-300 rounded px-3 py-2 text-sm"
        />

        {/* CLEAR */}
        {(search || fromDate || toDate) && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2 text-sm border border-pink-300 rounded hover:bg-gray-50"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* STATES */}
      {loading && (
        <div className="py-16 text-center text-gray-600">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
          Loading disabled users…
        </div>
      )}

      {error && (
        <div className="py-16 text-center text-red-600">
          <AlertCircle className="w-6 h-6 mx-auto mb-2" />
          {error}
        </div>
      )}

      {!loading && !error && filteredUsers.length === 0 && (
        <div className="py-16 text-center text-gray-500">
          No matching users found
        </div>
      )}

      {/* USERS LIST */}
      <div className="space-y-4">
        {filteredUsers.map((u) => {
          const personal = u.personalDetails?.[0] || {};
          const other = u.otherDetails?.[0] || {};
          const location = u.locationDetails?.[0] || {};
          const qualification = u.qualificationDetails?.[0] || {};

          return (
            <div
              key={u.userId}
              className="bg-white border border-pink-200 rounded-lg"
            >
              {/* SUMMARY */}
              <div className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-black">{u.email}</p>
                  <p className="text-xs text-gray-500">
                    Public ID: {u.public_user_id}
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    Disabled Reason: {u.reasonForDisabledByAdmin || "—"}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <Stat label="Profile" value={`${u.profileCompletionPercentage}%`} />
                  <Stat label="Subscription" value={`${u.subscriptionDaysLeft} days`} />

                  <button
                    onClick={() => toggleExpand(u.userId)}
                    className="flex items-center gap-1 text-sm text-pink-600 hover:underline"
                  >
                    {expandedId === u.userId ? (
                      <>Hide <ChevronUp className="w-4 h-4" /></>
                    ) : (
                      <>View <ChevronDown className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              </div>

              {/* DETAILS */}
              <AnimatePresence>
                {expandedId === u.userId && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-pink-200 bg-gray-50"
                  >
                    <div className="p-6 space-y-6 text-sm">
                      <Section title="Basic Information">
                        <Grid>
                          <Field label="Name" value={personal.displayName} />
                          <Field label="Gender" value={personal.gender} />
                          <Field label="Age" value={personal.age} />
                          <Field label="Marital Status" value={personal.maritalStatus} />
                        </Grid>
                      </Section>

                      <Section title="Location">
                        <Grid>
                          <Field label="Current Location" value={location.currentLocation} />
                          <Field label="Nationality" value={location.nationality} />
                          <Field label="Visa Status" value={location.residencyVisaStatus} />
                        </Grid>
                      </Section>

                      <Section title="Education & Work">
                        <Grid>
                          <Field label="Qualification" value={qualification.qualification} />
                          <Field label="Occupation" value={qualification.occupation} />
                          <Field label="Income" value={qualification.income} />
                        </Grid>
                      </Section>

                      <Section title="System Info">
                        <Grid>
                          <Field label="Disabled On" value={new Date(u.updatedAt).toLocaleString()} />
                          <Field label="User Type" value={u.usertype} />
                          <Field label="Role" value={u.role} />
                        </Grid>
                      </Section>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ===== SMALL COMPONENTS ===== */

const Section = ({ title, children }) => (
  <div>
    <h4 className="text-sm font-semibold text-black mb-3">{title}</h4>
    {children}
  </div>
);

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {children}
  </div>
);

const Field = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm text-black">{value || "—"}</p>
  </div>
);

const Stat = ({ label, value }) => (
  <div className="text-right">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-semibold text-black">{value}</p>
  </div>
);

export default DisabledUsersPanel;
