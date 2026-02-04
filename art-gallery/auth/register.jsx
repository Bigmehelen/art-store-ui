import React, { useState } from 'react';
import { useRegisterMutation } from '../api/authAPI';
import { useDispatch } from 'react-redux';
import { setUser } from '../api/authSlice';
import '../styles/Register.css';

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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
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
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Create Your Account</h1>
        <p className="register-subtitle">Join us to order beautiful artwork</p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleRegister} className="register-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              disabled={isLoading}
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
              placeholder="Enter password (min. 6 characters)"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="register-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <button
          className="back-to-gallery-btn"
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