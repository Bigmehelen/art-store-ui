import React from 'react';
import { useAuth } from '../api/authAPI';
import { useSelector } from 'react-redux';
import { ShoppingCart } from 'lucide-react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Navbar = ({ onNavigate }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { items } = useSelector(state => state.cart);
  const cartItemCount = items.reduce((total, item) => total + (item.quantity || 1), 0);

  const handleLogout = () => {
    logout();
    AsyncStorage.removeItem('user');
    AsyncStorage.removeItem('token');
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

          <button
            className="relative bg-none border-none text-white text-base cursor-pointer transition-all duration-300 py-2 border-b-2 border-transparent hover:text-[#667eea] hover:border-[#667eea] flex items-center gap-1.5"
            onClick={() => onNavigate('cart')}
          >
            <ShoppingCart size={20} />
            <span>Cart</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-3 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white">
                {cartItemCount}
              </span>
            )}
          </button>

          <div className="flex flex-wrap gap-3.75 items-center w-full md:w-auto justify-center md:justify-start ml-2">
            {isAuthenticated ? (
              <>
                <button
                  className="bg-none border-none text-white text-base cursor-pointer transition-all duration-300 py-2 border-b-2 border-transparent hover:text-[#667eea] hover:border-[#667eea]"
                  onClick={() => onNavigate('artisan-dashboard')}
                >
                  {user?.role === 'ARTISAN' ? 'Artisan Dashboard' : 'Become Artisan'}
                </button>
                <button
                  className="bg-none border-none text-white text-base cursor-pointer transition-all duration-300 py-2 border-b-2 border-transparent hover:text-[#667eea] hover:border-[#667eea]"
                  onClick={() => onNavigate('my-orders')}
                >
                  My Orders
                </button>
                <div className="flex items-center gap-3 ml-2">
                  <span className="text-[0.9rem] text-gray-300 hidden md:inline">Hi, {user?.username}</span>
                  <button
                    className="px-4 py-1.5 rounded-md border border-white/30 bg-white/10 text-white text-[0.9rem] font-semibold cursor-pointer transition-all duration-300 hover:bg-white/20"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  className="px-4 py-2 rounded-md border-none bg-linear-to-br from-[#667eea] to-[#764ba2] text-white text-[0.95rem] font-semibold cursor-pointer transition-all duration-300 hover:translate-y-0.5 hover:shadow-[0_4px_12px_rgba(102,126,234,0.4)]"
                  onClick={() => onNavigate('login')}
                >
                  Login
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
