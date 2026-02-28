import React, { useState } from 'react';
import { useRegisterMutation } from '../api/authAPI';
import { useDispatch } from 'react-redux';
import { setUser } from '../api/authSlice';

const Register = ({ onNavigateToGallery }) => {
  const [registerMutation, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.email) {
      setError('Please enter a valid email');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await registerMutation({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      }).unwrap();

      dispatch(setUser(result));
      setSuccess('Registration successful! Redirecting to gallery...');
      setFormData({ username: '', email: '', password: '', confirmPassword: '' });

      setTimeout(() => {
        onNavigateToGallery();
      }, 1500);
    } catch (err) {
      setError(err.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-linear-to-br from-[#667eea] to-[#764ba2]">
      <div className="bg-white rounded-2xl p-5 py-[30px] md:p-10 w-full max-w-[450px] shadow-2xl">
        <h1 className="m-0 mb-2.5 text-[#2c3e50] text-[1.5rem] md:text-[2rem] text-center font-bold">Create Your Account</h1>
        <p className="text-center text-[#7f8c8d] m-0 mb-[30px] text-[1.05rem]">Join us to order beautiful artwork</p>

        {error && <div className="bg-[#fee] text-[#c33] p-3 rounded-lg mb-5 border-l-4 border-[#c33]">{error}</div>}
        {success && <div className="bg-[#efe] text-[#3c3] p-3 rounded-lg mb-5 border-l-4 border-[#3c3]">{success}</div>}

        <form onSubmit={handleRegister} className="flex flex-col gap-4 md:gap-5 mb-5">
          <div className="flex flex-col">
            <label htmlFor="username" className="mb-2 text-[#2c3e50] font-semibold text-[0.95rem]">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              disabled={isLoading}
              className="p-3 border-2 border-[#ecf0f1] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] disabled:bg-[#f8f9fa] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

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
              placeholder="Enter password (min. 6 characters)"
              disabled={isLoading}
              className="p-3 border-2 border-[#ecf0f1] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] disabled:bg-[#f8f9fa] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className="mb-2 text-[#2c3e50] font-semibold text-[0.95rem]">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              disabled={isLoading}
              className="p-3 border-2 border-[#ecf0f1] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] disabled:bg-[#f8f9fa] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            className="p-3.5 bg-linear-to-br from-[#667eea] to-[#764ba2] text-white border-none rounded-lg text-[1.05rem] font-semibold cursor-pointer transition-all duration-300 hover:enabled:translate-y-[-2px] hover:enabled:shadow-[0_4px_15px_rgba(102,126,234,0.4)] active:enabled:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

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

export default Register;