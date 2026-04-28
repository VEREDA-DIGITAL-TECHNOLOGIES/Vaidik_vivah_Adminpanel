import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkTokenExpiration } from '../utils/auth';
import { refreshToken } from '../hooks/useRefreshToken';

const AutoRefreshToken = () => {
  const { accessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!accessToken) return;

    const checkAndRefresh = () => {
      if (checkTokenExpiration(accessToken)) {
        refreshToken();
      }
    };

    checkAndRefresh();
    const interval = setInterval(checkAndRefresh, 60000);
    
    return () => clearInterval(interval);
  }, [accessToken, dispatch]);

  return null;
};

export default AutoRefreshToken;