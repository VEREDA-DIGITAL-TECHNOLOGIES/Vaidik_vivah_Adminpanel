import { useDispatch } from 'react-redux';
import axiosInstance from '../api/axiosInstance';
import { setCredentials } from '../redux/slices/authSlice';

export const refreshToken = async () => {
  try {
    const response = await axiosInstance.get('/admin/refresh-token');
    const { accessToken } = response.data;
    
    const dispatch = useDispatch();
    dispatch(setCredentials({ accessToken }));
    
    return accessToken;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    throw error;
  }
};