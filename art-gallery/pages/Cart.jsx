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
    <div className="min-h-screen bg-[#f3f4f6] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-[#111827]">Your Shopping Cart</h1>
            <p className="text-gray-600">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
          </div>
          {items.length > 0 && (
            <button 
              onClick={() => dispatch(clearCart())}
              className="text-red-500 text-sm font-semibold hover:underline"
            >
              Clear Cart
            </button>
          )}
        </header>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-lg">
            <ShoppingCart size={64} className="mx-auto mb-6 text-gray-300" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added any artwork yet.</p>
            <button 
              onClick={onNavigateToGallery}
              className="px-8 py-3 bg-[#111827] text-white rounded-full font-bold hover:bg-black transition-all"
            >
              Start Exploring
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                    <img 
                      src={Array.isArray(item.imageUrls) ? item.imageUrls[0] : (typeof item.imageUrls === 'string' && item.imageUrls.startsWith('[') ? JSON.parse(item.imageUrls)[0] : item.imageUrls)} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">by {item.artist}</p>
                    <p className="font-bold mt-1">N{item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                      <button 
                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, (item.quantity || 1) - 1) }))}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity || 1}</span>
                      <button 
                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: (item.quantity || 1) + 1 }))}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button 
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-lg sticky top-24">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>N{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-bold text-xl">
                    <span>Total</span>
                    <span>N{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
                <button 
                  onClick={handleCheckout}
                  disabled={isOrdering}
                  className="w-full py-4 bg-[#111827] text-white rounded-xl font-bold text-lg hover:bg-black transition-all transform hover:scale-[1.02] active:scale-100 disabled:opacity-50"
                >
                  {isOrdering ? 'Processing...' : 'Proceed to Checkout'}
                </button>
                <p className="text-xs text-center text-gray-400 mt-4">
                  Secure Checkout with Helen Art Gallery
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-1000 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md text-center shadow-2xl animate-in fade-in zoom-in duration-300">
            <Key size={48} className="mx-auto mb-4 text-[#111827]" />
            <h2 className="text-2xl font-bold mb-4">One last step...</h2>
            <p className="text-gray-600 mb-8">
              Please sign in or create an account to securely process your payment and complete your order.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={onNavigateToLogin}
                className="py-3 px-6 bg-[#111827] text-white rounded-xl font-bold hover:bg-black transition-all"
              >
                Login
              </button>
              <button 
                onClick={onNavigateToRegister}
                className="py-3 px-6 bg-gray-100 text-[#111827] rounded-xl font-bold hover:bg-gray-200 transition-all"
              >
                Register
              </button>
            </div>
            <button 
              onClick={() => setShowAuthModal(false)}
              className="mt-6 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Not now, keep shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
