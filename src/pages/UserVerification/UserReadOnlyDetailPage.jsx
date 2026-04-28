import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Download } from "lucide-react";
import { adminStatsApi } from "../../api/adminStatsApi";

/* ================= HELPERS ================= */

const Section = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="mb-12 bg-white rounded-xl shadow-sm border border-gray-100"
  >
    <div className="px-6 py-4 border-l-4 border-pink-500 bg-gray-50 rounded-t-xl">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="p-6 grid sm:grid-cols-2 gap-5 text-sm text-gray-700">
      {children}
    </div>
  </motion.div>
);

const Field = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs uppercase tracking-wide text-gray-400">
      {label}
    </span>
    <span className="text-sm font-medium text-gray-800">
      {value ?? "—"}
    </span>
  </div>
);

/* ===== IMAGE HELPERS ===== */

const getProfilePhoto = (user) =>
  user.profilePhoto ||
  user.imageUpload?.[0]?.image?.[0] ||
  user.personalDetails?.[0]?.profilePhoto ||
  "https://via.placeholder.com/300/cccccc/ffffff?text=No+Photo";

const getUploadedImages = (user, limit = 3) => {
  const imgs = [];
  if (Array.isArray(user.imageUpload?.[0]?.image)) {
    imgs.push(...user.imageUpload[0].image);
  }
  return imgs.filter(Boolean).slice(0, limit);
};

/* ===== DOWNLOAD ===== */

const downloadImage = (url, filename = "image.jpg") => {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

/* ================= PAGE ================= */

const UserReadOnlyDetailPage = () => {
  const { userId } = useParams(); // public_user_id
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* -------- FETCH -------- */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);

        const res = await adminStatsApi.getAllUsers();
        const users = Array.isArray(res?.data) ? res.data : [];

        const found = users.find(
          (u) =>
            u.public_user_id === userId || // preferred
            u.userId === userId             // fallback
        );

        if (!found) throw new Error("User not found");
        setUser(found);
      } catch (err) {
        setError(err?.message || "Failed to load user details");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  /* -------- STATES -------- */

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-7 h-7 animate-spin text-pink-600" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center text-red-600 mt-10">
        {error || "User not found"}
      </div>
    );
  }

  /* -------- DERIVED DATA -------- */

  const profilePhoto = getProfilePhoto(user);
  const uploadedImages = getUploadedImages(user);

  const personal = user.personalDetails?.[0];
  const qualification = user.qualificationDetails?.[0];
  const location = user.locationDetails?.[0];
  // console.log("location data are ",location)
  const other = user.otherDetails?.[0];
  const recommendation = user.recommendations?.[0];

  const fullName = personal?.firstName
    ? `${personal.firstName} ${personal.lastName || ""}`
    : "N/A";

  /* ================= RENDER ================= */

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">

        {/* Back */}
        <button onClick={() => navigate(-1)} className="mb-6 text-sm text-pink-600 hover:underline">
          ← Back
        </button>

        {/* HEADER */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-pink-500 rounded-2xl p-8 text-white shadow-lg mb-12"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-32 h-32 rounded-full bg-white/20 overflow-hidden ring-4 ring-white/30">
              <img src={profilePhoto} alt="User" className="w-full h-full object-contain" />
              <button
                onClick={() => downloadImage(profilePhoto, "profile.jpg")}
                className="absolute bottom-2 right-2 bg-black/60 p-2 rounded-full"
              >
                <Download className="w-4 h-4 text-white" />
              </button>
            </div>

            <div>
              <h1 className="text-3xl font-bold">{fullName}</h1>
              <p className="text-white/90">{user.email}</p>
              <p className="text-xs text-white/70 mt-1">
                Public User ID: <span className="font-semibold">{user.public_user_id}</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* ACCOUNT */}
        <Section title="Account Information">
          <Field label="Public User ID" value={user.public_user_id} />
          <Field label="User Type" value={user.usertype} />
          <Field label="Admin Verified" value={user.isVerifiedByAdmin ? "Yes" : "No"} />
          <Field label="Created At" value={new Date(user.createdAt).toLocaleString()} />
        </Section>

        {/* PERSONAL */}
        {personal && (
          <Section title="Personal Details">
            <Field label="First Name" value={personal.firstName} />
            <Field label="Last Name" value={personal.lastName} />
            <Field label="Contact" value={personal.contactNumber} />
            <Field label="Marital Status" value={personal.maritalStatus} />
            <div className="sm:col-span-2">
              <Field label="About" value={personal.aboutYourSelf} />
            </div>
          </Section>
        )}

        {/* LOCATION */}
        {location && (
          <Section title="Location Details">
            <Field label="City" value={location.cityOfResidence} />
            <Field label="State" value={location.state} />
            <Field label="Country" value={location.country} />
            <Field label="Nationality" value={location.nationality} />
            <Field label="Full Address" value={location.fullAddress} />

          </Section>
        )}

        {/* QUALIFICATION */}
        {qualification && (
          <Section title="Qualification">
            <Field label="Qualification" value={qualification.qualification} />
            <Field label="Occupation" value={qualification.occupation} />
            <Field label="Income" value={qualification.income+" per annum"} />
          </Section>
        )}

        {/* OTHER */}
        {other && (
          <Section title="Other Details">
            <Field label="Religion" value={other.religion} />
            <Field label="Caste" value={other.caste} />
            <Field label="Height" value={other.height} />
            <Field label="Weight" value={other.weight} />
            <Field label="Diet" value={other.diet} />
          </Section>
        )}

        {/* PARTNER PREF */}
        {recommendation && (
          <Section title="Partner Preferences">
            <Field label="Looking For" value={recommendation.lookingFor} />
            <Field label="Age Range" value={recommendation.lookingPartnerAge} />
            <Field label="Horoscope Match" value={recommendation.horoscopeMatch} />
          </Section>
        )}

        {/* IMAGES */}
        {uploadedImages.length > 0 && (
          <Section title="Uploaded Images">
            {uploadedImages.map((img, i) => (
              <div key={i} className="relative bg-gray-100 rounded-xl p-3 border">
                <img src={img} alt={`Upload ${i}`} className="h-48 w-full object-contain rounded-lg" />
                <button
                  onClick={() => downloadImage(img, `upload-${i + 1}.jpg`)}
                  className="absolute top-3 right-3 bg-black/60 p-2 rounded-full"
                >
                  <Download className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
          </Section>
        )}
      </div>
    </motion.div>
  );
};

export default UserReadOnlyDetailPage;
