import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loginAnimation from '../../assets/LottieFiles/login_animation.json';
import logo from '../../assets/Photos/v.png';
import { setCredentials } from '../../redux/slices/authSlice';
import adminApi from '../../api/adminApi';

const LoginPage = () => {
  const [step, setStep] = useState('login'); // login | otp | forgot | forgotOtp | reset
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(''.padStart(6, ''));
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [timer, setTimer] = useState(0);
  const [newPassword, setNewPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // redirect if logged in
  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  // resend timer countdown (2.3 minutes = 138 seconds)
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await adminApi.login(email, password);
      if (res.success) {
        setStep('otp');
        setTimer(138);
        toast.success('OTP sent to your email');
      }
    } catch (err) {
      const msg =
      err?.response?.data?.message || 'Something went wrong';
      
      setError(msg);
      toast.error(msg);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await adminApi.verifyOtp(email, otp);
      if (res.success) {
        dispatch(setCredentials({
          accessToken: res.tokens.accessToken,
          refreshToken: res.tokens.refreshToken,
          admin: res.admin,
        }));
        toast.success('Login successful');
        navigate('/');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Invalid OTP';
      setError(msg);
      toast.error(msg);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await adminApi.forgotPassword(email);
      if (res.success) {
        setStep('forgotOtp');
        setTimer(138);
        toast.success('OTP sent for password reset');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Error sending OTP';
      setError(msg);
      toast.error(msg);
    }
  };

  const handleForgotOtpSubmit = (e) => {
    e.preventDefault();
    setStep('reset');
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await adminApi.resetPassword(email, otp, newPassword);
      if (res.success) {
        toast.success('Password reset successful! Please login.');
        setStep('login');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Reset failed';
      setError(msg);
      toast.error(msg);
    }
  };

  const handleResendOtp = async (type) => {
    try {
      const res = await adminApi.resendOtp(email, type);
      if (res.success) {
        setTimer(138);
        toast.success('OTP resent successfully');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Resend failed';
      toast.error(msg);
    }
  };

  const formatTimer = (t) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', damping: 20, stiffness: 80, delay: 0.4 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFB3C5] via-[#fff0f5] to-[#FFB3C5] flex items-center justify-center px-4 py-12">
      <motion.div
        variants={cardVariant}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-md bg-white/60 backdrop-blur-2xl border border-[#fce4ec] rounded-3xl shadow-2xl px-6 py-14"
      >
        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2">
          <div className="w-24 h-24 bg-white rounded-full border-4 border-[#fff0f5] shadow-md flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-14 h-14 object-contain" />
          </div>
        </div>

        <div className="w-24 h-24 mx-auto mb-2">
          <Lottie animationData={loginAnimation} loop autoplay />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">
          {step === 'login' && 'Welcome to Admin Dashboard'}
          {step === 'otp' && 'Verify OTP'}
          {step === 'forgot' && 'Forgot Password'}
          {step === 'forgotOtp' && 'Verify Reset OTP'}
          {step === 'reset' && 'Reset Password'}
        </h2>

        <p className="text-sm text-center text-gray-600 mb-6">
          {step === 'login'
            ? 'Sign in to manage the platform'
            : step === 'otp'
            ? `OTP sent to ${email}`
            : step === 'forgot'
            ? 'Enter your registered email to reset password'
            : step === 'forgotOtp'
            ? `OTP sent to ${email}`
            : 'Enter new password'}
        </p>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        {/* FORMS */}
        {step === 'login' && (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white/80 focus:ring-2 focus:ring-[#FF5E92]"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white/80 focus:ring-2 focus:ring-[#FF5E92]"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 cursor-pointer text-gray-500"
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#FF5E92] hover:bg-[#e95485] text-white font-medium rounded-xl shadow-lg"
            >
              Send OTP
            </button>

            <p
              className="text-sm text-center text-[#FF5E92] cursor-pointer hover:underline"
              onClick={() => setStep('forgot')}
            >
              Forgot Password?
            </p>
          </form>
        )}

        {(step === 'otp' || step === 'forgotOtp') && (
          <form
            onSubmit={step === 'otp' ? handleOtpSubmit : handleForgotOtpSubmit}
            className="space-y-5"
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
            <div className="flex justify-center gap-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-12 h-12 text-center text-xl border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF5E92] bg-white/80"
                  value={otp[i] || ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/, '');
                    const newOtp = otp.split('');
                    newOtp[i] = val;
                    setOtp(newOtp.join(''));
                    if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace') {
                      const newOtp = otp.split('');
                      newOtp[i] = '';
                      setOtp(newOtp.join(''));
                      if (i > 0 && !otp[i]) document.getElementById(`otp-${i - 1}`)?.focus();
                    }
                  }}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={otp.length < 6}
              className="w-full py-2.5 bg-[#FF5E92] hover:bg-[#e95485] text-white font-medium rounded-xl shadow-lg"
            >
              Verify OTP
            </button>

            <p className="text-sm text-center text-gray-600">
              {timer > 0 ? (
                <>Resend OTP in <span className="text-[#FF5E92] font-medium">{formatTimer(timer)}</span></>
              ) : (
                <span
                  onClick={() => handleResendOtp(step === 'otp' ? 'login' : 'forgot')}
                  className="text-[#FF5E92] font-medium cursor-pointer hover:underline"
                >
                  Resend OTP
                </span>
              )}
            </p>
          </form>
        )}

        {step === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white/80 focus:ring-2 focus:ring-[#FF5E92]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#FF5E92] hover:bg-[#e95485] text-white font-medium rounded-xl shadow-lg"
            >
              Send Reset OTP
            </button>

            <p
              className="text-sm text-center text-[#FF5E92] cursor-pointer hover:underline"
              onClick={() => setStep('login')}
            >
              Back to Login
            </p>
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white/80 focus:ring-2 focus:ring-[#FF5E92]"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 cursor-pointer text-gray-500"
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#FF5E92] hover:bg-[#e95485] text-white font-medium rounded-xl shadow-lg"
            >
              Reset Password
            </button>
          </form>
        )}

        <p className="text-xs text-gray-500 text-center mt-8">
          © {new Date().getFullYear()} Admin Dashboard. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
