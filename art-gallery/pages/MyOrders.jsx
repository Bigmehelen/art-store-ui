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
    <div className="min-h-screen bg-[#F9FAFB] py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-16">
          <span className="text-indigo-600 font-bold tracking-widest uppercase text-xs mb-4 block">Order History</span>
          <h1 className="text-4xl md:text-5xl font-black text-[#111827] mb-2 tracking-tight">My Collection</h1>
          <p className="text-gray-500 font-medium text-lg">Curating your personal gallery of acquired masterpieces.</p>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">Retrieving your orders...</p>
          </div>
        ) : error ? (
          <div className="card-premium p-12 text-center border-red-100 bg-red-50/30">
            <p className="text-red-900 font-black text-xl mb-2">Acquisition Sync Failed</p>
            <p className="text-red-600/70 font-medium">We encountered an issue retrieving your collection. Please refresh.</p>
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="card-premium p-20 text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-300">
              <ShoppingBag size={40} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">No Acquisitions Yet</h2>
            <p className="text-gray-500 mb-10 text-lg">Your personal gallery is waiting for its first masterpiece.</p>
            <button 
              className="bg-[#111827] text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:bg-black transition-all active:scale-95"
              onClick={() => window.location.href = '/'}
            >
              Discover Art
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="card-premium group overflow-hidden hover:translate-x-2 transition-all duration-500">
                <div className="p-8 flex flex-col md:flex-row gap-10 items-center">
                  <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden shrink-0 shadow-lg relative">
                    <img 
                      src={order.artwork?.imageUrls?.[0]} 
                      alt={order.artwork?.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl"></div>
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-black text-[#111827] tracking-tight">{order.artwork?.name || 'Untitled Piece'}</h3>
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                            Verified
                          </span>
                        </div>
                        <p className="text-gray-400 font-bold text-sm uppercase tracking-wider">
                          Acquired on {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                      <div className={`px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest ${
                        order.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {order.status || 'In Transit'}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-6 border-t border-gray-50">
                      <div>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Price</p>
                        <p className="text-lg font-black text-[#111827]">N{order.totalPrice?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Artist</p>
                        <p className="text-lg font-black text-[#111827]">{order.artwork?.artist || 'Unknown'}</p>
                      </div>
                      <div className="col-span-2 flex justify-end items-end">
                        <button className="flex items-center gap-2 text-indigo-600 font-black text-sm hover:translate-x-1 transition-transform">
                          Download Certificate <Plus size={16} />
                        </button>
                      </div>
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
