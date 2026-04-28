import axiosInstance from "./axiosInstance";

export const adminStatsApi = {
  // 🟦 Admin Dashboard APIs
  getUserStats: async () => {
    try {
      const res = await axiosInstance.get('admin-dashboard/user-details/user-stats');
      return res.data;
    } catch (err) {
      throw err?.response?.data?.message || err.message;
    }
  },

  getNewUserData: async () => {
    try {
      const res = await axiosInstance.get('admin-dashboard/user-details/new-user-data');
      return res.data;
    } catch (err) {
      throw err?.response?.data?.message || err.message;
    }
  },

  getGenderRatio: async () => {
    try {
      const res = await axiosInstance.get('admin-dashboard/user-details/gender-ratio');
      return res.data;
    } catch (err) {
      throw err?.response?.data?.message || err.message;
    }
  },

  getProfileCompletionStats: async () => {
    try {
      const res = await axiosInstance.get('admin-dashboard/user-details/profile-fill-percentage');
      return res.data;
    } catch (err) {
      throw err?.response?.data?.message || err.message;
    }
  },

  getConnectionStats: async () => {
    try {
      const res = await axiosInstance.get('admin-dashboard/user-details/connection-data');
      return res.data;
    } catch (err) {
      throw err?.response?.data?.message || err.message;
    }
  },

  // 🟪 Admin User Details APIs
  getAllUsers: async () => {
    try {
      const res = await axiosInstance.get('admin-dashboard/all-users');
      return res.data;
    } catch (err) {
      throw err?.response?.data?.message || err.message;
    }
  },

   disableUser: async (publicUserId, reason = null) => {
    try {
      const res = await axiosInstance.put(
        `admin-dashboard/users/${publicUserId}/disable`,
        reason ? { reason } : {} // optional payload
      );
      return res.data;
    } catch (err) {
      throw err?.response?.data?.message || err.message;
    }
  },

  getDisabledUsers: async () => {
    try {
      const res = await axiosInstance.get(
        "admin-dashboard/disabled-users"
      );
      return res.data;
    } catch (err) {
      throw err?.response?.data?.message || err.message;
    }
  },

  /* ---------------------------------
     ENABLE USER
     public_user_id required
  --------------------------------- */
  enableUser: async (publicUserId) => {
    try {
      const res = await axiosInstance.put(
        `admin-dashboard/users/${publicUserId}/enable`
      );
      return res.data;
    } catch (err) {
      throw err?.response?.data?.message || err.message;
    }
  },


  getUserStatus: async () => {
    try {
      const res = await axiosInstance.get('admin-dashboard/user-status');
      return res.data;
    } catch (err) {
      throw err?.response?.data?.message || err.message;
    }
  },

  // 🟨 Admin Transaction APIs
  getAllBillingInfo: async () => {
    try {
      const res = await axiosInstance.get('admin/transactions/allbillinginfo');
      return res.data;
    } catch (err) {
      throw err?.response?.data?.message || err.message;
    }
  },

  getFinancialReport: async () => {
    try {
      const res = await axiosInstance.get('admin/transactions/financial-report');
      return res.data;
    } catch (err) {
      throw err?.response?.data?.message || err.message;
    }
  },

  // 🟥 Admin Control APIs
  deleteAccount: async (userId) => {
    try {
      const res = await axiosInstance.delete('admin/control/delete-account', {
        data: { userId }
      });
      return res.data;
    } catch (err) {
      throw err?.response?.data?.message || err.message;
    }
  },
  // Add to adminStatsApi object
getLogs: async () => {
    try {
      const res = await axiosInstance.get('admin/logs');
      return res.data;
    } catch (err) {
      throw err?.response?.data?.message || err.message;
    }
  },

  suspendAccount: async (userId) => {
    try {
      const res = await axiosInstance.put('/admin/control/suspend-account', { userId });
      return res.data;
    } catch (err) {
      throw err?.response?.data?.message || err.message;
    }
  },

  updateDocumentStatus: async (userId, status) => {
    try {
      const res = await axiosInstance.put('/admin/control/update-document-status', {
        userId,
        status
      });
      return res.data;
    } catch (err) {
      throw err?.response?.data?.message || err.message;
    }
  },



  getUserDocumentStatus: async () => {
    try {
      const res = await axiosInstance.get('admin/control/user-documents-details');
      return res.data;
    } catch (err) {
      throw err?.response?.data?.message || err.message;
    }
  },

  getUsersVerificationStatus: async (params = {}) => {
    try {
      const res = await axiosInstance.get(
        "admin/control/users-verification-status",
        { params }
      );
      return res.data;
    } catch (err) {
      throw err?.response?.data?.message || err.message;
    }
  },
  
  verifyUserByAdmin: async ({ userId, isVerifiedByAdmin, remarks }) => {
    try {
      const payload = {
        userId,
        isVerifiedByAdmin,
      };
  
      // ✅ send remarks ONLY if admin actually provided it
      if (typeof remarks === "string" && remarks.trim()) {
        payload.remarks = remarks.trim();
      }
  
      const res = await axiosInstance.put(
        "admin/control/verify-user",
        payload
      );
  
      return res.data;
    } catch (err) {
      throw err?.response?.data?.message || err.message;
    }
  },
  
  
};


