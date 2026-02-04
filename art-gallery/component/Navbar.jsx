import React from 'react';
import { useAuth } from '../api/hooks';
import '../styles/Navbar.css';

const Navbar = ({ onNavigate }) => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    onNavigate('gallery');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1 onClick={() => onNavigate('gallery')}>Art Gallery</h1>
        </div>

        <div className="navbar-menu">
          <button className="nav-link" onClick={() => onNavigate('gallery')}>
            Gallery
          </button>

          <div className="navbar-auth">
            {isAuthenticated ? (
              <>
                <span className="user-greeting">Welcome, {user?.username}!</span>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button className="login-btn" onClick={() => onNavigate('login')}>
                  Login
                </button>
                <button className="login-btn" onClick={() => onNavigate('register')}>
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
