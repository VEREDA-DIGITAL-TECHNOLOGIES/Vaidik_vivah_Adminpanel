import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Star, Zap, Edit } from "lucide-react";
import { planApi } from "../../api/planApi";
import ApplicationPlan from "../../components/ApplicationPlan/ApplicationPlan";

export default function AdminPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [editedPlan, setEditedPlan] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const result = await planApi.getAllPlans();
        if (result.success) setPlans(result.data);
        else setError(result.message || "Failed to fetch plans");
      } catch (err) {
        setError(err?.message || "Network error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleEditClick = (plan) => {
    setEditingPlan(plan);
    setEditedPlan({
      ...plan,
      featureList: Array.isArray(plan.featureList)
        ? plan.featureList.join("\n")
        : plan.featureList,
    });
  };

  const handleCloseModal = () => {
    setEditingPlan(null);
    setEditedPlan(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPlan((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => setShowConfirm(true);

  const confirmSave = async () => {
    if (!editedPlan) return;

    const payload = {
      planId: editedPlan.id,
      planName: editedPlan.planName,
      price: parseFloat(editedPlan.price),
      durationInMonths: parseInt(editedPlan.durationInMonths),
      description: editedPlan.description,
      planType: editedPlan.planType,
      featureList: editedPlan.featureList
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
    };

    try {
      const result = await planApi.updatePlan(payload);
      if (result.success) {
        const refreshed = await planApi.getAllPlans();
        setPlans(refreshed.data);
      } else {
        setError(result.message || "Failed to update plan");
      }
    } catch (err) {
      setError(err?.message || "Network error occurred during update");
    }

    setShowConfirm(false);
    setEditingPlan(null);
    setEditedPlan(null);
  };

  const cancelSave = () => setShowConfirm(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf6ff] to-[#fff0f5]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-pink-500"
        >
          <Zap className="h-12 w-12" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf6ff] to-[#fff0f5]">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-[#fdf6ff] to-[#fff0f5] relative">
      {editingPlan && <div className="fixed inset-0 z-40 backdrop-blur-md bg-white/20" />}

      {editingPlan && editedPlan && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-pink-500">Edit Plan</h2>
                <button onClick={handleCloseModal} className="p-1 text-gray-500 hover:text-gray-700">&times;</button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                  <input
                    type="text"
                    name="planName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500"
                    value={editedPlan.planName}
                    onChange={handleInputChange}
                    readOnly
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                      type="text"
                      name="price"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500"
                      value={editedPlan.price}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <select
                      name="durationInMonths"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500"
                      value={editedPlan.durationInMonths}
                      onChange={handleInputChange}
                    >
                      <option value="1">1 Month</option>
                      <option value="3">3 Months</option>
                      <option value="12">12 Months</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500"
                    rows="3"
                    value={editedPlan.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Features (one per line)</label>
                  <textarea
                    name="featureList"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500"
                    rows="4"
                    value={editedPlan.featureList}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button onClick={handleCloseModal} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition">Cancel</button>
                  <button onClick={handleSaveChanges} className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition">Save Changes</button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-[999] bg-white/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Changes</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to save these changes?</p>
            <div className="flex justify-end space-x-3">
              <button onClick={cancelSave} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition">Cancel</button>
              <button onClick={confirmSave} className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition">Confirm</button>
            </div>
          </div>
        </div>
      )}

      <div className={`max-w-6xl mx-auto transition duration-300 ${editingPlan ? "blur-sm scale-[0.98]" : ""}`}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-pink-500 mb-2">Manage Subscription Plans</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Admin interface for managing all subscription plans</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#fff0f5] hover:shadow-2xl transition-all"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-2">
                      <h2 className="text-xl font-bold text-pink-500 mr-2">{plan.planName}</h2>
                      {plan.planName === "Diamond" && <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />}
                    </div>
                    <p className="text-gray-500 text-sm mb-4">{plan.planType}</p>
                  </div>
                  <button onClick={() => handleEditClick(plan)} className="p-1 text-gray-500 hover:text-pink-500 transition">
                    <Edit className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-800">₹{plan.price}</span>
                  <span className="text-gray-500"> / {plan.durationInMonths} {plan.durationInMonths > 1 ? "months" : "month"}</span>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </div>

                <div className="border-t border-[#fff0f5] pt-4">
                  <h3 className="font-medium text-pink-500 mb-3">Features</h3>
                  <ul className="space-y-2">
                    {plan.featureList.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 pt-3 border-t border-[#fff0f5]">
                    <p className="text-xs text-gray-500"><span className="font-medium">Plan ID:</span> {plan.id}</p>
                    <p className="text-xs text-gray-500"><span className="font-medium">Duration:</span> {plan.durationInMonths} {plan.durationInMonths > 1 ? "months" : "month"}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <ApplicationPlan/>
    </div>
  );
}
