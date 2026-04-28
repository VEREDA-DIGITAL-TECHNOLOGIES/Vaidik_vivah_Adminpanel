// src/api/planApi.js
import axiosInstance from "./axiosInstance";

export const planApi = {

  createPlan: async (payload) => {
    try {
      const res = await axiosInstance.post("v1/plan/createPlan", payload);
      return res.data;
    } catch (err) {
      throw err?.response?.data?.message || err.message;
    }
  },


  getAllPlans: async () => {
    try {
      const res = await axiosInstance.get("v1/plan/getAllPlans");
      return res.data;
    } catch (err) {
      throw err?.response?.data?.message || err.message;
    }
  },

 
  getPlanById: async (planId) => {
    try {
      const res = await axiosInstance.post("v1/plan/getPlan", { planId });
      return res.data;
    } catch (err) {
      throw err?.response?.data?.message || err.message;
    }
  },


  updatePlan: async (payload) => {
    try {
      const res = await axiosInstance.put("v1/plan/updatePlan", payload);
      return res.data;
    } catch (err) {
      throw err?.response?.data?.message || err.message;
    }
  },


  deletePlan: async (planId) => {
    try {
      const res = await axiosInstance.delete("v1/plan/deletePlan", {
        data: { planId }
      });
      return res.data;
    } catch (err) {
      throw err?.response?.data?.message || err.message;
    }
  },
  getAllPlanApplication: async () => {
    try {
      const res = await axiosInstance.get("v1/application-plan/applications-get");
      return res.data;
    } catch (err) {
      throw err?.response?.data?.message || err.message;
    }
  },
};
