import React, { useState } from 'react';
import { useLoginMutation } from '../api/authAPI';
import { useDispatch } from 'react-redux';
import { setUser } from '../api/authSlice';
import '../styles/Register.css';

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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
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
    <div className="register-container">
      <div className="register-card">
        <h1>Welcome Back</h1>
        <p className="register-subtitle">Login to continue shopping</p>

        {localError && <div className="error-message">{localError}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleLogin} className="register-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="register-btn"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-toggle">
          <p>Don't have an account? 
            <button
              className="toggle-btn"
              onClick={onNavigateToRegister}
              disabled={loading}
            >
              Sign up here
            </button>
          </p>
        </div>

        <button
          className="back-to-gallery-btn"
          onClick={onNavigateToGallery}
          disabled={loading}
        >
          Back to Gallery
        </button>
      </div>
    </div>
  );
};

export default Login;
