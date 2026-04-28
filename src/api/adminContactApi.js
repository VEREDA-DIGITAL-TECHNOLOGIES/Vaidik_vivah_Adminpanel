// adminContactApi.js
import axiosInstance from "./axiosInstance";

const adminContactApi = {
  // Create a new contact (user-facing)
  createContact: async (contactData) => {
    const res = await axiosInstance.post('/admin/contact', contactData);
    return res.data;
  },

  // Get all contacts (admin)
  getAllContacts: async () => {
    const res = await axiosInstance.post('/admin/contact/admin/get-all');
    return res.data;
  },

  // Get a single contact by ID (admin)
  getContactById: async (id) => {
    const res = await axiosInstance.post('/admin/contact/admin/get', { id });
    return res.data;
  },

  // Delete a contact by ID (admin)
  deleteContact: async (id) => {
    const res = await axiosInstance.post('/admin/contact/admin/delete', { id });
    return res.data;
  },

  // Mark contact as contacted back by ID (admin)
  markContactedBack: async (id) => {
    const res = await axiosInstance.post('/admin/contact/admin/contacted-back', { id });
    return res.data;
  },
};

export default adminContactApi;
