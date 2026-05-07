import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../api/authAPI';
import { removeFromCart, updateQuantity, clearCart } from '../api/cartSlice';
import { usePlaceOrderMutation } from '../api/artworksAPI';
import { CheckCircle, ShoppingCart, Key, X, Minus, Plus } from 'lucide-react';

const Cart = ({ onNavigateToLogin, onNavigateToRegister, onNavigateToGallery }) => {
  const { items, totalAmount } = useSelector(state => state.cart);
  const { isAuthenticated, user } = useAuth();
  const dispatch = useDispatch();
  const [placeOrderMutation, { isLoading: isOrdering }] = usePlaceOrderMutation();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    try {
      for (const item of items) {
        await placeOrderMutation({ 
          artworkId: item.id, 
          user,
          quantity: item.quantity 
        }).unwrap();
      }
      
      setOrderSuccess(true);
      dispatch(clearCart());
    } catch (err) {
      alert('Failed to place order. Please try again.');
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-3xl font-bold mb-4">Order Successful!</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          Thank you for your purchase. Your artwork will be prepared for delivery shortly. 
          You can track your order in the "My Orders" section.
        </p>
        <button 
          onClick={onNavigateToGallery}
          className="px-8 py-3 bg-[#111827] text-white rounded-full font-bold hover:bg-black transition-all"
        >
          Back to Gallery
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <span className="text-indigo-600 font-bold tracking-widest uppercase text-xs mb-4 block">Your Selection</span>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-[#111827] mb-2 tracking-tight">Shopping Cart</h1>
              <p className="text-gray-500 font-medium">You have {items.length} masterpiece{items.length !== 1 ? 's' : ''} reserved</p>
            </div>
            {items.length > 0 && (
              <button 
                onClick={() => dispatch(clearCart())}
                className="text-red-500 text-sm font-bold hover:bg-red-50 px-4 py-2 rounded-xl transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </header>

        {items.length === 0 ? (
          <div className="card-premium p-20 text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-300">
              <ShoppingCart size={40} />
            </div>
            <h2 className="text-3xl font-black mb-4 text-gray-900">Your cart is empty</h2>
            <p className="text-gray-500 mb-10 text-lg">Looks like you haven't discovered your next favorite piece yet.</p>
            <button 
              onClick={onNavigateToGallery}
              className="bg-[#111827] text-white px-10 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl active:scale-95"
            >
              Explore the Gallery
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-6">
              {items.map((item) => (
                <div key={item.id} className="card-premium p-6 flex flex-col sm:flex-row items-center gap-8 group">
                  <div className="w-full sm:w-40 h-40 rounded-2xl overflow-hidden shrink-0 shadow-md">
                    <img 
                      src={Array.isArray(item.imageUrls) ? item.imageUrls[0] : (typeof item.imageUrls === 'string' && item.imageUrls.startsWith('[') ? JSON.parse(item.imageUrls)[0] : item.imageUrls)} 
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-black text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-gray-500 font-medium mb-4">by {item.artist}</p>
                    <p className="text-xl font-black text-indigo-600">N{item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col sm:items-end gap-6 w-full sm:w-auto">
                    <div className="flex items-center bg-gray-50 rounded-2xl p-1.5 border border-gray-100">
                      <button 
                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, (item.quantity || 1) - 1) }))}
                        className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-all shadow-sm active:scale-90"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="w-12 text-center font-black text-lg">{item.quantity || 1}</span>
                      <button 
                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: (item.quantity || 1) + 1 }))}
                        className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-all shadow-sm active:scale-90"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <button 
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="flex items-center gap-2 text-gray-400 hover:text-red-500 font-bold transition-colors text-sm px-4 py-2 hover:bg-red-50 rounded-xl"
                    >
                      <X size={18} /> Remove Item
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-4">
              <div className="card-premium p-8 sticky top-32 bg-[#111827] text-white">
                <h2 className="text-2xl font-black mb-8 border-b border-white/10 pb-4">Order Summary</h2>
                <div className="space-y-6 mb-10">
                  <div className="flex justify-between text-gray-400 font-medium">
                    <span>Subtotal</span>
                    <span className="text-white">N{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 font-medium">
                    <span>Shipping</span>
                    <span className="text-emerald-400 font-black">Complementary</span>
                  </div>
                  <div className="flex justify-between text-gray-400 font-medium">
                    <span>Tax (VAT)</span>
                    <span className="text-white">Included</span>
                  </div>
                  <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                    <div>
                      <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Total Amount</p>
                      <span className="text-3xl font-black">N{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleCheckout}
                  disabled={isOrdering}
                  className="w-full py-5 bg-white text-black rounded-2xl font-black text-lg hover:bg-gray-100 transition-all transform hover:scale-[1.02] active:scale-100 disabled:opacity-50 shadow-2xl flex items-center justify-center gap-3"
                >
                  {isOrdering ? (
                    <div className="w-6 h-6 border-2 border-black/10 border-t-black rounded-full animate-spin"></div>
                  ) : (
                    <>Complete Purchase <Plus size={20} /></>
                  )}
                </button>
                <div className="flex items-center justify-center gap-2 mt-6 text-gray-500 text-xs font-bold uppercase tracking-widest">
                  <CheckCircle size={14} className="text-emerald-500" /> Secure Encryption
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-1000 backdrop-blur-md transition-all duration-500">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-lg text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-indigo-600 to-violet-600"></div>
            <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-indigo-600">
              <Key size={32} />
            </div>
            <h2 className="text-3xl font-black mb-4 text-gray-900">Secure Checkout</h2>
            <p className="text-gray-500 mb-10 text-lg leading-relaxed">
              Please sign in to your gallery account to securely complete your acquisition.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={onNavigateToLogin}
                className="py-4 bg-[#111827] text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl active:scale-95"
              >
                Sign In
              </button>
              <button 
                onClick={onNavigateToRegister}
                className="py-4 bg-gray-50 text-gray-900 rounded-2xl font-black hover:bg-gray-100 transition-all border border-gray-100 active:scale-95"
              >
                Create Account
              </button>
            </div>
            <button 
              onClick={() => setShowAuthModal(false)}
              className="mt-8 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


export default Cart;
