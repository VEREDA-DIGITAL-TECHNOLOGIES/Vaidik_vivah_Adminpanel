import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import store from './redux/store';
import LoginPage from './pages/Login/LoginPage';
import HomePage from './pages/Home/HomePage';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import AutoRefreshToken from './components/AutoRefreshToken';
import { initializeAuthAsync } from './redux/slices/authSlice';
import DashboardLayout from './components/DashboardLayout';
import Users from './pages/users/Users';
import Transactions from './pages/transaction/Transaction';
import AdminSettingsPage from './pages/settings/settings';
import AdminBannerSection from './pages/Banner/AdminBannerSection';
import Plans from './pages/Plan/Plans';
import ErrorBoundary from './pages/Errorboundary';
import Contacts from './pages/Contact/Contacts';
import UserManual from './pages/User-Manual/UserManual';
import UserVerification from './pages/UserVerification/UserVerification';
import UserReadOnlyDetailPage from './pages/UserVerification/UserReadOnlyDetailPage';
const AppWrapper = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuthAsync());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AutoRefreshToken />
      <ErrorBoundary>
        <Routes>
          {/* Login route (no navbar) */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected dashboard routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/users" element={<Users />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/settings" element={<AdminSettingsPage />} />
              <Route path="/banner-section" element={<AdminBannerSection />} />
              <Route path="/plan-control" element={<Plans />} />
              <Route path='/alerts' element={<Contacts></Contacts>}></Route>
              <Route path='/user-manual' element={<UserManual></UserManual>}></Route>
              <Route path='/user-verification' element={<UserVerification></UserVerification>}></Route>
              <Route
      path="/user-verification/:userId"
      element={<UserReadOnlyDetailPage />}
    />
              {/* Add more dashboard routes here */}
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default AppWrapper;
