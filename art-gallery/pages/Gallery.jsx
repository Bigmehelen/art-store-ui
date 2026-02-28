import React, { useState } from 'react';
import { useAuth } from '../api/authAPI';
import { useGetAllArtworksQuery } from '../api/publicArtworksAPI';
import { usePlaceOrderMutation } from '../api/artworksAPI';

const Gallery = ({ onNavigateToRegister }) => {
  const { isAuthenticated, user } = useAuth();
  const { data: artworks = [], isLoading } = useGetAllArtworksQuery();
  const [placeOrderMutation] = usePlaceOrderMutation();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [filter, setFilter] = useState('all');
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleOrderClick = (artwork) => {
    setSelectedArtwork(artwork);
    if (!isAuthenticated) {
      setShowOrderModal(true);
    } else {
      handlePlaceOrder(artwork);
    }
  };

  const handlePlaceOrder = async (artwork) => {
    try {
      await placeOrderMutation({
        artworkId: artwork.id,
        user,
      }).unwrap();

      setOrderSuccess(true);
      setTimeout(() => setOrderSuccess(false), 1000);
    } catch {
      alert('Failed to place order. Please try again.');
    }
  };

  const getUniqueCategories = () => {
    const categories = artworks.map(a => a.category);
    return ['all', ...new Set(categories)];
  };

  const filteredArtworks =
    filter === 'all'
      ? artworks
      : artworks.filter(a => a.category === filter);

  return (
    <div className="flex-1 bg-[#f3f4f6] w-full min-h-screen">
      {/* Header */}
      <div className="min-h-[40vh] md:min-h-[60vh] flex flex-col justify-center items-center px-6 bg-white">
        <h1 className="text-[28px] md:text-[42px] font-bold text-center mb-3 text-[#111827]">Helen Art Gallery</h1>
        <p className="text-[14px] md:text-[18px] text-center text-[#4b5563] max-w-[700px]">
          Discover and order exceptional artwork from our collection
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#111827]"></div>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="py-6 px-4">
            <h2 className="text-[18px] font-semibold mb-3">Filter by Category</h2>

            <div className="flex flex-row flex-wrap gap-2.5">
              {getUniqueCategories().map(category => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`py-2 px-3.5 rounded-full text-[14px] transition-colors duration-200 ${filter === category
                    ? 'bg-[#111827] text-white'
                    : 'bg-[#e5e7eb] text-[#111827] hover:bg-gray-300'
                    }`}
                >
                  {category.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="flex flex-row flex-wrap justify-center md:justify-between px-4 pb-10">
            {filteredArtworks.map(artwork => (
              <div key={artwork.id} className="w-full md:w-[30%] bg-white rounded-[14px] mb-6 overflow-hidden shadow-[0_4px_10px_rgba(0,0,0,0.08)]">
                <img
                  src={artwork.image}
                  className="w-full h-[180px] md:h-[220px] bg-[#e5e7eb] object-cover"
                  alt={artwork.title}
                />

                <div className="p-4">
                  <h3 className="text-[18px] font-semibold mb-1">{artwork.title}</h3>
                  <p className="text-[14px] text-[#6b7280] mb-2">by {artwork.artist}</p>
                  <p className="text-[14px] text-[#374151] mb-3">{artwork.description}</p>
                  <p className="text-[16px] font-bold mb-3">
                    ${artwork.price.toLocaleString()}
                  </p>

                  <button
                    className={`w-full py-2.5 rounded-lg flex items-center justify-center font-semibold text-[14px] transition-colors duration-200 ${orderSuccess && selectedArtwork?.id === artwork.id
                      ? 'bg-[#10b981] text-white'
                      : 'bg-[#111827] text-white hover:bg-black'
                      }`}
                    onClick={() => handleOrderClick(artwork)}
                    disabled={
                      orderSuccess &&
                      selectedArtwork?.id === artwork.id
                    }
                  >
                    {orderSuccess &&
                      selectedArtwork?.id === artwork.id
                      ? '✓ Ordered!'
                      : 'Order Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      {showOrderModal && !isAuthenticated && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[1000]">
          <div className="bg-white rounded-2xl p-6 w-full md:w-[60%] max-w-[500px]">
            <h2 className="text-[22px] font-bold mb-3 text-center">Sign Up to Order</h2>
            <p className="text-[14px] text-center mb-5 text-[#374151]">
              You need to create an account before placing your first order.
            </p>

            <div className="flex flex-col md:flex-row gap-3">
              <button
                className="flex-1 bg-[#111827] text-white py-3 rounded-lg flex items-center justify-center font-semibold hover:bg-black transition-colors"
                onClick={onNavigateToRegister}
              >
                Create Account
              </button>

              <button
                className="flex-1 bg-[#e5e7eb] text-[#111827] py-3 rounded-lg flex items-center justify-center font-semibold hover:bg-gray-300 transition-colors"
                onClick={() => setShowOrderModal(false)}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
