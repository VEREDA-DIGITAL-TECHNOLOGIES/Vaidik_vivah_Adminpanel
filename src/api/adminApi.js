// adminApi.js
import axiosInstance from '../api/axiosInstance';

const adminApi = {
  // 🔐 REGISTER ADMIN
  register: async (email, password) => {
    const res = await axiosInstance.post('/admin/register', { email, password });
    return res.data;
  },

  // 🔑 LOGIN (SEND OTP)
  login: async (email, password) => {
  const res = await axiosInstance.post(
    "/admin/login",
    { email, password },
    { skipAuthRefresh: true } // 👈 THIS IS THE KEY
  );
  return res.data;
},

  // login: async (email, password) => {
  //   const res = await axiosInstance.post('/admin/login', { email, password });
  //   return res.data;
  // },

  // 🧾 VERIFY LOGIN OTP
  verifyOtp: async (email, otp) => {
    const res = await axiosInstance.post('/admin/verify-otp', { email, otp },{ skipAuthRefresh: true });
    return res.data;
  },

  // 🔁 REFRESH ACCESS TOKEN
  refreshToken: async () => {
    const res = await axiosInstance.get('/admin/refresh-token');
    return res.data;
  },

  // 🚪 LOGOUT ADMIN
  logout: async () => {
    const res = await axiosInstance.post('/admin/logout');
    return res.data;
  },

  // 📜 FETCH ALL ADMIN LOGS
  getAdminLogs: async () => {
    const res = await axiosInstance.get('/admin/logs');
    return res.data;
  },

  // 📜 FETCH LOGS BY ADMIN ID
  getLogsByAdminId: async (adminId) => {
    const res = await axiosInstance.get('/admin/user-logs', { params: { adminId } });
    return res.data;
  },

  // 👤 GET ADMIN PROFILE (if endpoint exists)
  getProfile: async () => {
    const res = await axiosInstance.get('/admin/profile');
    return res.data;
  },

  // ✏️ UPDATE ADMIN PROFILE (if endpoint exists)
  updateProfile: async (profileData) => {
    const res = await axiosInstance.put('/admin/profile', profileData);
    return res.data;
  },

  // 🔒 FORGOT PASSWORD - SEND OTP
  forgotPassword: async (email) => {
    const res = await axiosInstance.post('/admin/forgot-password', { email });
    return res.data;
  },

  // 🔄 RESET PASSWORD (VERIFY OTP & CHANGE PASSWORD)
  resetPassword: async (email, otp, newPassword) => {
    const res = await axiosInstance.post('/admin/reset-password', {
      email,
      otp,
      newPassword,
    });
    return res.data;
  },

  // 🔁 RESEND OTP (for login or forgot password)
  resendOtp: async (email, type) => {
    const res = await axiosInstance.post('/admin/resend-otp', { email, type });
    return res.data;
  },
};

export default adminApi;
