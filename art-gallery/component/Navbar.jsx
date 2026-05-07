import React, { useState, useEffect } from 'react';
import { useAuth } from '../api/authAPI';
import { useSelector } from 'react-redux';
import { ShoppingCart, Palette } from 'lucide-react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Navbar = ({ onNavigate }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { items } = useSelector(state => state.cart);
  const cartItemCount = items.reduce((total, item) => total + (item.quantity || 1), 0);
  const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
 

  const handleLogout = () => {
    logout();
    AsyncStorage.removeItem('user');
    AsyncStorage.removeItem('token');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-100 px-6 pt-6 pb-2 
                    bg-linear-to-br from-black/10 to-transparent pointer-events-none">
      <nav className="max-w-7xl mx-auto bg-linear-to-br bg-white/10 backdrop-blur-xl border border-white/10
      rounded-2xl px-6 py-3 flex justify-between items-center shadow-[0_15px_35px_rgba(79,70,229,0.25)] pointer-events-auto"
      >
        
        <div
          onClick={() => onNavigate('gallery')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center 
                          text-indigo-600 transition-transform group-hover:rotate-12 shadow-lg">
            <Palette size={20} />
          </div>
          <h1 className="text-[1.2rem] font-bold text-indigo-600 tracking-tight">
            Helen Art
          </h1>
        </div>


        <div className="flex items-center gap-2 md:gap-6">
          <button
            className=" text-indigo-600 font-semibold text-[0.95rem] 
                       transition-colors py-2 px-4 rounded-xl "
            onClick={() => onNavigate('gallery')}
          >
            Gallery
          </button>

          <div className="h-6 w-px bg-white/20 hidden md:block" />


          <button
            className="relative p-2.5 text-indigo-600 transition-all 
                       rounded-xl flex items-center gap-2 group"
            onClick={() => onNavigate('cart')}
          >
            <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-indigo-600 text-[10px] 
                               font-bold min-w-45 h-45 flex items-center justify-center 
                               rounded-full border-2 border-indigo-600 leading-none">
                {cartItemCount}
              </span>
            )}
          </button>


          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <button
                  className="hidden md:block text-white/80 hover:text-white font-semibold 
                             text-[0.95rem] transition-colors py-2 px-4 rounded-xl hover:bg-white/10"
                  onClick={() => onNavigate('artisan-dashboard')}
                >
                  {user?.role === 'ARTISAN' ? 'Dashboard' : 'Sell Art'}
                </button>
                <button
                  className="hidden md:block text-white/80 hover:text-white font-semibold 
                             text-[0.95rem] transition-colors py-2 px-4 rounded-xl hover:bg-white/10"
                  onClick={() => onNavigate('my-orders')}
                >
                  Orders
                </button>
                <button
                  className="bg-white text-indigo-600 px-5 py-2.5 rounded-xl font-bold 
                             text-[0.9rem] hover:bg-gray-50 transition-all shadow-md active:scale-95"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                className="bg-white text-indigo-600 px-6 py-2.5 rounded-xl font-bold 
                           text-[0.95rem] hover:bg-gray-50 transition-all shadow-md active:scale-95"
                onClick={() => onNavigate('login')}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;