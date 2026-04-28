// src/utils/axiosInstance.js
import axios from 'axios';
import { store } from '../redux/store';
import { logout, setCredentials } from '../redux/slices/authSlice';

const axiosInstance = axios.create({
  // baseURL: "http://localhost:3005/api",

  
  baseURL: "https://api.vedvivah.com/api",
  withCredentials: true,
});

// Request interceptor → attach accessToken & log API URL
axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // ✅ Log full endpoint (baseURL + url)
    const fullUrl = `${config.baseURL?.replace(/\/$/, '')}${config.url}`;
    console.log(`📡 [API CALL] ${config.method?.toUpperCase()} → ${fullUrl}`);

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor → handle 401 refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🔥 HARD STOP for login / auth requests
    if (originalRequest?.skipAuthRefresh) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.get(
          'https://api.vedvivah.com/api/admin/refresh-token',
          // 'http://localhost:3005/api/admin/refresh-token',
          { withCredentials: true }
        );

        const { accessToken, refreshToken } = res.data;

        const currentAdmin = store.getState().auth.admin;
        store.dispatch(
          setCredentials({
            accessToken,
            refreshToken,
            admin: currentAdmin,
          })
        );

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        store.dispatch(logout());
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);



// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         // Call backend refresh endpoint
//         const res = await axios.get(
//           'https://api.vedvivah.com/api/admin/refresh-token',
//           { withCredentials: true }
//         );

//         // ✅ Expect backend to return both tokens
//         const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data;

//         // ✅ Update Redux state and localStorage
//         const currentAdmin = store.getState().auth.admin;
//         store.dispatch(
//           setCredentials({
//             accessToken: newAccessToken,
//             refreshToken: newRefreshToken,
//             admin: currentAdmin,
//           })
//         );

//         // ✅ Retry original request with new access token
//         originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
//         return axiosInstance(originalRequest);
//       } catch (err) {
//         store.dispatch(logout());
//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
