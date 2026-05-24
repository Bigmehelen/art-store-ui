import React, { useState } from 'react';
import { Palette, Plus } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col items-center justify-center pt-32 pb-16 px-6 bg-[#F9FAFB] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-50 rounded-full blur-3xl translate-y-1/2 translate-x-1/2"></div>

      <div className="card-premium p-10 md:p-16 w-full max-w-2xl relative z-10">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-[#111827] rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl -rotate-3">
            <Palette size={32} />
          </div>
          <h1 className="text-4xl font-black text-[#111827] mb-3 tracking-tight">Create Account</h1>
          <p className="text-gray-500 font-medium text-lg">Join our exclusive community of art lovers</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-2xl mb-8 border border-red-100 text-sm font-bold animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl mb-8 border border-emerald-100 text-sm font-bold animate-in fade-in slide-in-from-top-2">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="username"
                disabled={isLoading}
                className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:shadow-xl transition-all outline-none font-medium"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                disabled={isLoading}
                className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:shadow-xl transition-all outline-none font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="password" className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:shadow-xl transition-all outline-none font-medium"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:shadow-xl transition-all outline-none font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-5 bg-[#111827] text-white rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 active:scale-95 flex items-center justify-center gap-3 mt-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>Create Account <Plus size={20} /></>
            )}
          </button>
        </form>

        <div className="mt-12 text-center pt-8 border-t border-gray-50">
          <p className="text-gray-500 font-medium mb-4">Already have an account?</p>
          <button
            className="text-indigo-600 font-black hover:text-indigo-700 transition-colors"
            onClick={() => window.location.href = '/login'}
            disabled={isLoading}
          >
            Sign In Instead
          </button>
        </div>

        <button
          className="w-full mt-6 py-4 text-gray-400 hover:text-gray-900 font-bold transition-colors text-sm uppercase tracking-widest"
          onClick={onNavigateToGallery}
          disabled={isLoading}
        >
          Explore the Collection
        </button>
      </div>
    </div>
  );
};


export default Register;