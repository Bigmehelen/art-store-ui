import React, { useState } from 'react';
import { useAuth } from '../api/authAPI';
import { useGetAllArtworksQuery } from '../api/publicArtworksAPI';
import { useDispatch } from 'react-redux';
import { addToCart } from '../api/cartSlice';
import { Image, X, CheckCircle } from 'lucide-react';

const Gallery = ({ onNavigateToRegister }) => {
  const { isAuthenticated, user } = useAuth();
  const dispatch = useDispatch();
  const { data, isLoading } = useGetAllArtworksQuery();
  const artworks = Array.isArray(data) ? data : (data?.data || []);

  const getImageUrl = (imagesUrls) => {
    if (!imagesUrls) return null;
    if (typeof imagesUrls === 'string' && imagesUrls.startsWith('http')) return imagesUrls;
    if (typeof imagesUrls === 'string') {
      try {
        const parsed = JSON.parse(imagesUrls);
        return Array.isArray(parsed) ? parsed[0] : parsed;
      } catch { return imagesUrls; }
    }
    if (Array.isArray(imagesUrls)) return imagesUrls[0] || null;
    return null;
  };

  const [filter, setFilter] = useState('all');
  const [cartSuccess, setCartSuccess] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddToCart = (artwork) => {
    dispatch(addToCart(artwork));
    setCartSuccess(artwork.id);
    setTimeout(() => setCartSuccess(null), 2000);
  };

  const getUniqueCategories = () => {
    const categories = artworks.map(a => a.category);
    return ['all', ...new Set(categories)];
  };

  const filteredArtworks = artworks
    .filter(a => filter === 'all' || a.category === filter)
    .filter(a =>
      searchQuery.trim() === '' ||
      a.name?.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );

  return (
    <div className="flex-1 bg-[#F9FAFB] w-full min-h-screen pt-24">

      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-3xl md:text-5xl font-black text-[#111827] mb-8 leading-tight tracking-tight">
            Elevate Your Space with <br />
            <span className="text-transparent bg-clip-text bg-linear-to-br from-indigo-600 to-violet-600">
              Timeless Art
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            Discover a handpicked selection of exceptional artworks from the world's most talented creators.
          </p>

          {/* Search */}
          <div className="flex w-full max-w-2xl mx-auto rounded-3xl p-2 glass-premium shadow-2xl">
            <div className="flex-1 flex items-center px-6">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by artwork or artist..."
                className="w-full py-4 text-gray-900 bg-transparent outline-none placeholder:text-gray-400 font-medium"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-2 text-gray-400 hover:text-gray-900">
                  <X size={20} />
                </button>
              )}
            </div>
            <button className="bg-[#111827] text-white px-10 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg active:scale-95">
              Search
            </button>
          </div>
        </div>

        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-200 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-200 rounded-full blur-3xl animate-pulse" />
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-gray-500 font-medium animate-pulse">Loading collection...</p>
          </div>
        ) : (
          <>
            {/* Filter Categories */}
            <div className="mb-12">
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Categories</h2>
              <div className="flex flex-wrap gap-3">
                {getUniqueCategories().filter(Boolean).map(category => (
                  <button
                    key={category}
                    onClick={() => setFilter(category)}
                    className={`px-8 py-3.5 rounded-2xl text-[0.95rem] font-bold transition-all duration-300 ${
                      filter === category
                        ? 'bg-[#111827] text-white shadow-xl scale-105'
                        : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-900 shadow-sm'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Results count */}
            {searchQuery.trim() !== '' && (
              <div className="mb-8 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 inline-block">
                <p className="text-indigo-900 font-medium">
                  {filteredArtworks.length} masterpiece{filteredArtworks.length !== 1 ? 's' : ''} found for "{searchQuery}"
                </p>
              </div>
            )}

            {/* Empty State */}
            {filteredArtworks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center card-premium p-12">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8">
                  <Image size={30} className="text-gray-300" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3">No Results Found</h3>
                <p className="text-gray-500 max-w-sm mb-8">
                  We couldn't find anything matching your request. Try adjusting your search or filters.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setFilter('all'); }}
                  className="bg-[#111827] text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:bg-black transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredArtworks.map(artwork => (
                  <div key={artwork.id} className="group card-premium overflow-hidden flex flex-col h-full">


                    <div className="relative overflow-hidden aspect-square">
                      <img
                        src={getImageUrl(artwork.imageUrls)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        alt={artwork.name}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <div className="absolute top-4 left-4 px-3 py-1.5 glass-premium rounded-xl text-xs font-bold text-gray-900">
                        {artwork.category}
                      </div>
                    </div>


                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-black text-gray-900 mb-0.5">
                            {artwork.name}
                          </h3>
                          <p className="text-gray-700 text-sm font-medium">by {artwork.artist}</p>
                        </div>
                        <span className="text-lg font-black text-indigo-600 whitespace-nowrap ml-4">
                          ₦{artwork.price.toLocaleString()}
                        </span>
                      </div>

                      <p className="text-gray-700 text-sm leading-relaxed mb-6 line-clamp-2">
                        {artwork.description}
                      </p>

                      <div className="mt-auto">
                        <button
                          onClick={() => handleAddToCart(artwork)}
                          disabled={cartSuccess === artwork.id}
                          className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 ${
                            cartSuccess === artwork.id
                              ? 'bg-emerald-500 text-white'
                              : 'bg-gray-50 text-gray-900 hover:bg-[#111827] hover:text-white'
                          } shadow-sm hover:shadow-lg`}
                        >
                          {cartSuccess === artwork.id ? (
                            <span className="flex items-center justify-center gap-2">
                              <CheckCircle size={18} /> Added
                            </span>
                          ) : 'Add to Collection'}
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Gallery;