import React, { useState } from 'react';
import { useAuth, useBecomeArtistMutation } from '../api/authAPI';
import { useCreateArtworkMutation, useGetMyArtworksQuery } from '../api/artworksAPI';
import { Palette, DollarSign, Globe, Upload, Layout } from 'lucide-react';

const ArtisanDashboard = ({ onNavigateToLogin }) => {
  const { user, isAuthenticated } = useAuth();
  const [becomeArtist] = useBecomeArtistMutation();
  const [createArtwork, { isLoading: isUploading }] = useCreateArtworkMutation();
  const { data: myArtworks, isLoading: isLoadingArtworks, refetch } = useGetMyArtworksQuery(undefined, {
    skip: user?.role !== 'ARTISAN'
  });

  const [formData, setFormData] = useState({
    name: '',
    artist: user?.username || '',
    description: '',
    price: '',
    category: '',
    imageUrls: ''
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleBecomeArtisan = async () => {
    try {
      await becomeArtist().unwrap();
      setSuccess('Congratulations! You are now an Artisan. Please log in again or refresh to see your dashboard.');
      // In a real app, we'd update the local user state or force a re-fetch of user data
      setTimeout(() => window.location.reload(), 2000);
    } catch (err) {
      setError(err.data?.message || 'Failed to upgrade account.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Basic validation
      if (!formData.name || !formData.price || !formData.imageUrls) {
        throw new Error('Please fill in all required fields.');
      }

      const artworkData = {
        ...formData,
        price: parseFloat(formData.price),
        imageUrls: formData.imageUrls.split(',').map(url => url.trim())
      };

      await createArtwork(artworkData).unwrap();
      setSuccess('Artwork uploaded successfully!');
      setFormData({
        name: '',
        artist: user?.username || '',
        description: '',
        price: '',
        category: '',
        imageUrls: ''
      });
      refetch();
    } catch (err) {
      setError(err.message || err.data?.message || 'Failed to upload artwork.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-6">
        <div className="card-premium p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-indigo-600">
            <Key size={32} />
          </div>
          <h2 className="text-3xl font-black mb-4 text-gray-900">Access Denied</h2>
          <p className="text-gray-500 mb-8 text-lg">Please sign in to your gallery account to access the creator portal.</p>
          <button 
            onClick={onNavigateToLogin}
            className="w-full py-4 bg-[#111827] text-white rounded-2xl font-black shadow-xl hover:bg-black transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (user?.role !== 'ARTISAN') {
    return (
      <div className="min-h-screen bg-[#F9FAFB] py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="card-premium overflow-hidden border-none shadow-2xl">
            <div className="bg-linear-to-br from-[#111827] to-[#374151] p-16 text-center text-white relative">
               <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
                <Palette size={300} className="absolute -top-20 -left-20 rotate-12" />
               </div>
              <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight relative z-10">Join Our Creator <br/> Community</h1>
              <p className="text-xl text-white/70 max-w-xl mx-auto relative z-10">Share your creative vision with the world and build your empire.</p>
            </div>
            <div className="p-16 text-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-indigo-50 rounded-4xl flex items-center justify-center text-indigo-600 mb-6 shadow-sm">
                    <Palette size={32} />
                  </div>
                  <h3 className="font-black text-gray-900 mb-2">Showcase Art</h3>
                  <p className="text-sm text-gray-500 font-medium">Curate your own digital gallery with ease.</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-violet-50 rounded-4xl flex items-center justify-center text-violet-600 mb-6 shadow-sm">
                    <DollarSign size={32} />
                  </div>
                  <h3 className="font-black text-gray-900 mb-2">Earn Royalties</h3>
                  <p className="text-sm text-gray-500 font-medium">Get paid directly for your artistic talent.</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-emerald-50 rounded-4xl flex items-center justify-center text-emerald-600 mb-6 shadow-sm">
                    <Globe size={32} />
                  </div>
                  <h3 className="font-black text-gray-900 mb-2">Reach Millions</h3>
                  <p className="text-sm text-gray-500 font-medium">Connect with collectors around the globe.</p>
                </div>
              </div>
              
              {success && <div className="mb-8 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 font-bold">{success}</div>}
              {error && <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 font-bold">{error}</div>}

              <button
                onClick={handleBecomeArtisan}
                className="px-12 py-5 bg-[#111827] text-white rounded-2xl font-black text-xl hover:bg-black transition-all transform hover:scale-105 shadow-2xl active:scale-95"
              >
                Become an Artisan
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-indigo-600 font-bold tracking-widest uppercase text-xs mb-4 block">Creator Portal</span>
            <h1 className="text-4xl md:text-5xl font-black text-[#111827] mb-2 tracking-tight">Artisan Dashboard</h1>
            <p className="text-gray-500 font-medium text-lg">Welcome back, {user?.username}. Your creative empire awaits.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total Pieces</p>
              <p className="text-2xl font-black text-[#111827]">{myArtworks?.length || 0}</p>
            </div>
            <div className="bg-indigo-600 px-6 py-4 rounded-2xl shadow-lg shadow-indigo-100 text-white">
              <p className="text-xs text-white/70 font-bold uppercase tracking-wider mb-1">Status</p>
              <p className="text-2xl font-black">Active Artist</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Upload Form */}
          <div className="lg:col-span-4">
            <div className="card-premium p-8 sticky top-32">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-[#111827]">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <Upload size={20} />
                </div>
                New Creation
              </h2>
              
              {success && <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold border border-emerald-100 animate-in fade-in slide-in-from-top-2">{success}</div>}
              {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm font-bold border border-red-100 animate-in fade-in slide-in-from-top-2">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-black text-gray-700 uppercase tracking-wider">Artwork Title</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:shadow-xl transition-all outline-none font-medium"
                    placeholder="e.g. Celestial Symphony"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-black text-gray-700 uppercase tracking-wider">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:shadow-xl transition-all outline-none font-medium"
                      placeholder="e.g. Abstract"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-black text-gray-700 uppercase tracking-wider">Price (N)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:shadow-xl transition-all outline-none font-medium"
                      placeholder="50000"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-black text-gray-700 uppercase tracking-wider">The Story Behind</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:shadow-xl transition-all outline-none h-32 resize-none font-medium"
                    placeholder="Tell collectors about your inspiration..."
                  ></textarea>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-black text-gray-700 uppercase tracking-wider">High-Res Image URL</label>
                  <input
                    type="text"
                    name="imageUrls"
                    value={formData.imageUrls}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:shadow-xl transition-all outline-none font-medium"
                    placeholder="https://images.unsplash.com/..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full py-5 bg-[#111827] text-white rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 active:scale-95 flex items-center justify-center gap-3"
                >
                  {isUploading ? (
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>Publish Masterpiece <Upload size={20} /></>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* My Artworks List */}
          <div className="lg:col-span-8">
            <div className="card-premium p-8 min-h-150">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black flex items-center gap-3 text-[#111827]">
                  <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center text-violet-600">
                    <Layout size={20} />
                  </div>
                  Your Collection
                </h2>
                <div className="flex gap-2">
                  <span className="px-4 py-2 bg-gray-50 text-gray-500 rounded-xl text-sm font-bold">Newest First</span>
                </div>
              </div>

              {isLoadingArtworks ? (
                <div className="flex flex-col items-center justify-center py-40 gap-4">
                  <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                  <p className="text-gray-500 font-medium">Refining your collection...</p>
                </div>
              ) : myArtworks?.length === 0 || !myArtworks ? (
                <div className="text-center py-32 bg-gray-50/50 rounded-4xl border-2 border-dashed border-gray-100">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300 shadow-sm">
                    <Palette size={32} />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">The canvas is blank</h3>
                  <p className="text-gray-500 max-w-xs mx-auto mb-8 font-medium">Your collection is empty. Start uploading your work to reach collectors worldwide.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {myArtworks.map(art => (
                    <div key={art.id} className="card-premium group overflow-hidden border-none shadow-sm hover:shadow-2xl transition-all duration-500">
                      <div className="relative h-56 overflow-hidden">
                        <img 
                          src={Array.isArray(art.imageUrls) ? art.imageUrls[0] : (typeof art.imageUrls === 'string' && art.imageUrls.startsWith('[') ? JSON.parse(art.imageUrls)[0] : art.imageUrls)} 
                          alt={art.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-sm font-black shadow-lg text-indigo-600">
                          N{art.price.toLocaleString()}
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                           <button className="p-3 bg-white text-gray-900 rounded-xl hover:bg-indigo-600 hover:text-white transition-all transform -translate-y-4 group-hover:translate-y-0 duration-300">
                            Edit
                           </button>
                           <button className="p-3 bg-white text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300">
                            Delete
                           </button>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-black text-xl text-[#111827]">{art.name}</h3>
                          <span className="text-xs font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-lg">{art.category || 'Fine Art'}</span>
                        </div>
                        <p className="text-gray-500 text-sm font-medium line-clamp-2 leading-relaxed">{art.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ArtisanDashboard;
