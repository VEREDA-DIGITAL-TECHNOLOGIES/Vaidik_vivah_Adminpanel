import { jwtDecode } from 'jwt-decode';
import { getAccessToken, getRefreshToken } from './tokenService';

export const isAuthenticated = () => {
  const token = getAccessToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    return decoded.exp > Date.now() / 1000;
  } catch (error) {
    console.error('Token decode error:', error);
    return false;
  }
};

export const getAdminFromToken = () => {
  const token = getAccessToken();
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
};

export const checkTokenExpiration = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    const bufferTime = 300; // 5 minutes buffer
    return decoded.exp - currentTime < bufferTime;
  } catch (error) {
    console.error('Token decode error:', error);
    return true;
  }
};