import React from 'react';
import { useAuth } from '../api/authAPI';
import { useGetMyOrdersQuery } from '../api/artworksAPI';
import { ShoppingBag } from 'lucide-react';

const MyOrders = () => {
  const { isAuthenticated, user } = useAuth();
  const { data: orders, isLoading, error } = useGetMyOrdersQuery(undefined, {
    skip: !isAuthenticated
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6]">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Sign in to view orders</h2>
          <p className="text-gray-600">You need to be logged in to see your purchase history.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-[#111827]">My Orders</h1>
          <p className="text-gray-600">Track and manage your art collection purchases.</p>
        </header>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#111827]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200 text-center">
            <p className="font-semibold">Unable to load orders</p>
            <p className="text-sm opacity-80 mt-1">Please try again later or contact support.</p>
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-lg border border-gray-100">
            <ShoppingBag size={64} className="mx-auto mb-6 text-gray-300" />
            <h2 className="text-2xl font-bold text-[#111827] mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Your collection is empty! Head over to the gallery to find something special.
            </p>
            <button 
              className="px-8 py-3 bg-[#111827] text-white rounded-full font-bold hover:bg-black transition-all"
              onClick={() => window.location.reload()} // In this simple router, we might just reload or use onNavigate
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 transition-transform hover:scale-[1.01]">
                <div className="p-6 flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-full md:w-32 h-32 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                    <img 
                      src={order.artwork?.imageUrls?.[0]} 
                      alt={order.artwork?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-[#111827]">{order.artwork?.name || 'Untitled Artwork'}</h3>
                        <p className="text-sm text-gray-500">Ordered on {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="mt-2 md:mt-0 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
                        {order.status || 'Processing'}
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center mt-4 pt-4 border-t border-gray-50">
                      <div className="mb-2 md:mb-0">
                        <span className="text-sm text-gray-400">Total Paid: </span>
                        <span className="text-lg font-bold text-[#111827]">N{order.totalPrice?.toLocaleString() || '0'}</span>
                      </div>
                      <button className="text-[#111827] font-semibold text-sm hover:underline">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
