import React from 'react';
import { useAuth } from '../api/authAPI';

const Navbar = ({ onNavigate }) => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    onNavigate('gallery');
  };

  return (
    <nav className="bg-linear-to-br from-[#2c3e50] to-[#3d4e60] text-white p-0 shadow-lg sticky top-0 z-100">
      <div className="max-w-350 mx-auto px-5 py-3.75 flex flex-col md:flex-row justify-between items-center gap-3.75 md:gap-0">
        <div className="navbar-brand">
          <h1
            onClick={() => onNavigate('gallery')}
            className="m-0 text-[1.4rem] md:text-[1.8rem] cursor-pointer transition-all duration-300 text-white hover:scale-105 hover:text-[#667eea]"
          >
            Art Gallery
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-3.75 md:gap-3.75 items-center w-full md:w-auto">
          <button
            className="bg-none border-none text-white text-base cursor-pointer transition-all duration-300 py-2 border-b-2 border-transparent hover:text-[#667eea] hover:border-[#667eea]"
            onClick={() => onNavigate('gallery')}
          >
            Gallery
          </button>

          <div className="flex flex-wrap gap-3.75 items-center w-full md:w-auto justify-center md:justify-start">
            {isAuthenticated ? (
              <>
                <span className="text-[0.95rem] text-[#ecf0f1] block text-center w-full md:w-auto">Welcome, {user?.username}!</span>
                <button
                  className="px-4 py-2 rounded-md border-2 border-white bg-white/20 text-white text-[0.95rem] font-semibold cursor-pointer transition-all duration-300 hover:bg-white/30"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="px-4 py-2 rounded-md border-none bg-linear-to-br from-[#667eea] to-[#764ba2] text-white text-[0.95rem] font-semibold cursor-pointer transition-all duration-300 hover:translate-y-0.5 hover:shadow-[0_4px_12px_rgba(102,126,234,0.4)]"
                  onClick={() => onNavigate('login')}
                >
                  Login
                </button>
                <button
                  className="px-4 py-2 rounded-md border-none bg-linear-to-br from-[#667eea] to-[#764ba2] text-white text-[0.95rem] font-semibold cursor-pointer transition-all duration-300 hover:translate-y-0.5 hover:shadow-[0_4px_12px_rgba(102,126,234,0.4)]"
                  onClick={() => onNavigate('register')}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
