import React, { useState } from 'react';
import { useAuth, useCart, usePlaceOrder } from '../api/hooks';
import { useGetAllArtworksQuery, usePlaceOrderMutation } from '../api/artworksAPI';
import '../styles/Gallery.css';

const Gallery = ({ onNavigateToRegister }) => {
  const { isAuthenticated, user } = useAuth();
  const { data: artworks = [], isLoading, error } = useGetAllArtworksQuery();
  const [placeOrderMutation] = usePlaceOrderMutation();
  const { addToCart } = useCart();
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
        user: user
      }).unwrap();
      setOrderSuccess(true);
      setTimeout(() => {
        setOrderSuccess(false);
        alert(`Order placed successfully for ${artwork.title}!`);
      }, 1000);
    } catch (error) {
      alert('Failed to place order. Please try again.');
    }
  };

  const handleRegisterRedirect = () => {
    setShowOrderModal(false);
    onNavigateToRegister();
  };

  const getUniqueCategories = () => {
    const categories = artworks.map(art => art.category);
    return ['all', ...new Set(categories)];
  };

  const filteredArtworks = filter === 'all' 
    ? artworks 
    : artworks.filter(art => art.category === filter);

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h1>🎨 Art Gallery</h1>
        <p>Discover and order exceptional artwork from around the world</p>
      </div>

      {isLoading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading artworks...</p>
        </div>
      ) : (
        <>
          <div className="filter-section">
            <h3>Filter by Category</h3>
            <div className="filter-buttons">
              {getUniqueCategories().map((category) => (
                <button
                  key={category}
                  className={`filter-btn ${filter === category ? 'active' : ''}`}
                  onClick={() => setFilter(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {filteredArtworks.length === 0 ? (
            <div className="no-artworks">
              <p>No artworks found in this category.</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {filteredArtworks.map((artwork) => (
                <div key={artwork.id} className={`artwork-card ${orderSuccess && selectedArtwork?.id === artwork.id ? 'order-success' : ''}`}>
                  <div className="artwork-image">
                    <img src={artwork.image} alt={artwork.title} />
                    <div className="artwork-overlay">
                      <span className="category-badge">{artwork.category}</span>
                      <span className="year-badge">{artwork.year}</span>
                    </div>
                  </div>
                  <div className="artwork-info">
                    <h3>{artwork.title}</h3>
                    <p className="artist">by {artwork.artist}</p>
                    <p className="description">{artwork.description}</p>
                    <p className="price">${artwork.price.toLocaleString()}</p>
                    <button
                      className="order-btn"
                      onClick={() => handleOrderClick(artwork)}
                      disabled={orderSuccess && selectedArtwork?.id === artwork.id}
                    >
                      {orderSuccess && selectedArtwork?.id === artwork.id ? '✓ Ordered!' : 'Order Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {showOrderModal && !isAuthenticated && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowOrderModal(false)}>×</button>
            <div className="modal-header">
              <h2>🎯 Sign Up to Order</h2>
            </div>
            <p className="modal-text">You need to create an account before placing your first order.</p>
            <p className="artwork-title">Selected Artwork: <strong>{selectedArtwork?.title}</strong></p>
            <p className="artwork-price">Price: <strong className="price-highlight">${selectedArtwork?.price.toLocaleString()}</strong></p>
            <div className="modal-buttons">
              <button className="btn-register" onClick={handleRegisterRedirect}>
                ✨ Create Account
              </button>
              <button className="btn-cancel" onClick={() => setShowOrderModal(false)}>
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