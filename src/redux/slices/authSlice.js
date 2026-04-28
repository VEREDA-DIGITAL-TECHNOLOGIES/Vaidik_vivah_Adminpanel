import { createSlice } from '@reduxjs/toolkit';
import {
  setAccessToken,
  setRefreshToken,
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
} from '../../utils/tokenService';
import { checkTokenExpiration } from '../../utils/auth';

const initialState = {
  accessToken: null,
  refreshToken: null,
  admin: null,
  isAuthenticated: false,
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, refreshToken, admin } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.admin = admin;
      state.isAuthenticated = true;
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      // localStorage.setItem('access-token',accessToken);
      // localStorage.setItem('refresh-token',refreshToken);
      localStorage.setItem('admin', JSON.stringify(admin)); // ✅ persist admin
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.admin = null;
      state.isAuthenticated = false;
      clearAuthTokens();
      localStorage.removeItem('admin'); 
      // localStorage.removeItem('access-token');
      // localStorage.removeItem('refresh-token');// ✅ remove admin
    },
    initializeAuth: (state) => {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();
      const admin = JSON.parse(localStorage.getItem('admin')); // ✅ retrieve admin

      if (accessToken && refreshToken && admin) {
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.admin = admin;
        state.isAuthenticated = true;
      }
    },
  },
});

export const { setCredentials, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;


import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

 // adjust if path differs

export const initializeAuthAsync = createAsyncThunk(
  'auth/initializeAuthAsync',
  async (_, { dispatch }) => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    const admin = JSON.parse(localStorage.getItem('admin'));

    if (!accessToken || !refreshToken || !admin) {
      dispatch(logout());
      return;
    }

    const isExpired = (() => {
      try {
        const decoded = jwtDecode(accessToken);
        return decoded.exp < Date.now() / 1000;
      } catch {
        return true;
      }
    })();

    if (!isExpired) {
      dispatch(setCredentials({ accessToken, refreshToken, admin }));
      return;
    }

    // accessToken expired, try to refresh
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/refresh-token`,
        { withCredentials: true }
      );
    
      const { accessToken, refreshToken } = response.data;
    
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
    
      dispatch(setCredentials({
        accessToken,
        refreshToken,
        admin,
      }));
    } catch (err) {
      dispatch(logout());
    }
    
  }
);
