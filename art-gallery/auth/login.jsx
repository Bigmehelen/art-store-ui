import React, { useState } from 'react';
import { useLoginMutation } from '../api/authAPI';
import { useDispatch } from 'react-redux';
import { setUser } from '../api/authSlice';

const Login = ({ onNavigateToGallery, onNavigateToRegister }) => {
  const [loginMutation, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setLocalError('');
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setLocalError('Email is required');
      return false;
    }
    if (!formData.email) {
      setLocalError('Please enter a valid email');
      return false;
    }
    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await loginMutation({
        email: formData.email,
        password: formData.password,
      }).unwrap();

      dispatch(setUser(result));
      setSuccess('Login successful! Redirecting to gallery...');
      setFormData({ email: '', password: '' });

      setTimeout(() => {
        onNavigateToGallery();
      }, 1500);
    } catch (err) {
      setLocalError(err.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-linear-to-br from-[#667eea] to-[#764ba2]">
      <div className="bg-white rounded-2xl p-5 py-[30px] md:p-10 w-full max-w-[450px] shadow-2xl">
        <h1 className="m-0 mb-2.5 text-[#2c3e50] text-[1.5rem] md:text-[2rem] text-center font-bold">Welcome Back</h1>
        <p className="text-center text-[#7f8c8d] m-0 mb-[30px] text-[1.05rem]">Login to continue shopping</p>

        {localError && <div className="bg-[#fee] text-[#c33] p-3 rounded-lg mb-5 border-l-4 border-[#c33]">{localError}</div>}
        {success && <div className="bg-[#efe] text-[#3c3] p-3 rounded-lg mb-5 border-l-4 border-[#3c3]">{success}</div>}

        <form onSubmit={handleLogin} className="flex flex-col gap-4 md:gap-5 mb-5">
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-2 text-[#2c3e50] font-semibold text-[0.95rem]">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              disabled={isLoading}
              className="p-3 border-2 border-[#ecf0f1] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] disabled:bg-[#f8f9fa] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="mb-2 text-[#2c3e50] font-semibold text-[0.95rem]">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              disabled={isLoading}
              className="p-3 border-2 border-[#ecf0f1] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] disabled:bg-[#f8f9fa] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            className="p-3.5 bg-linear-to-br from-[#667eea] to-[#764ba2] text-white border-none rounded-lg text-[1.05rem] font-semibold cursor-pointer transition-all duration-300 hover:enabled:translate-y-[-2px] hover:enabled:shadow-[0_4px_15px_rgba(102,126,234,0.4)] active:enabled:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="text-center mb-4">
          <p className="text-[#2c3e50]">Don't have an account?
            <button
              className="bg-transparent border-none text-[#667eea] font-semibold cursor-pointer ml-1 hover:underline"
              onClick={onNavigateToRegister}
              disabled={isLoading}
            >
              Sign up here
            </button>
          </p>
        </div>

        <button
          className="w-full p-3 bg-[#f8f9fa] text-[#667eea] border-2 border-[#667eea] rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 hover:enabled:bg-[#667eea] hover:enabled:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onNavigateToGallery}
          disabled={isLoading}
        >
          Back to Gallery
        </button>
      </div>
    </div>
  );
};

export default Login;
