import React, { useState } from 'react';
import { useAuth, useBecomeArtistMutation } from '../api/authAPI';
import { useCreateArtworkMutation, useGetMyArtworksQuery } from '../api/artworksAPI';
import { Palette, DollarSign, Globe, Upload, Layout } from 'lucide-react';

const ArtisanDashboard = () => {
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
      <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Please log in to access the Artisan Dashboard.</p>
        </div>
      </div>
    );
  }

  if (user?.role !== 'ARTISAN') {
    return (
      <div className="min-h-screen bg-[#f3f4f6] py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-linear-to-br from-[#111827] to-[#374151] p-12 text-center text-white">
              <h1 className="text-4xl font-bold mb-4">Join Our Creator Community</h1>
              <p className="text-xl opacity-90">Share your passion with the world and start selling your masterpieces.</p>
            </div>
            <div className="p-12 text-center">
              <div className="flex justify-center gap-8 mb-10">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#f3f4f6] rounded-full flex items-center justify-center text-gray-700 mb-3">
                    <Palette size={32} />
                  </div>
                  <span className="font-semibold">Showcase Art</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#f3f4f6] rounded-full flex items-center justify-center text-gray-700 mb-3">
                    <DollarSign size={32} />
                  </div>
                  <span className="font-semibold">Earn Money</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#f3f4f6] rounded-full flex items-center justify-center text-gray-700 mb-3">
                    <Globe size={32} />
                  </div>
                  <span className="font-semibold">Reach Millions</span>
                </div>
              </div>
              
              {success && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200">{success}</div>}
              {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">{error}</div>}

              <button
                onClick={handleBecomeArtisan}
                className="px-10 py-4 bg-[#111827] text-white rounded-full font-bold text-lg hover:bg-black transition-all transform hover:scale-105 shadow-xl"
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
    <div className="min-h-screen bg-[#f3f4f6] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[#111827]">Artisan Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.username}. Manage your gallery here.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Upload size={24} className="text-[#111827]" /> Upload New Artwork
              </h2>
              
              {success && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">{success}</div>}
              {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Artwork Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111827] outline-none"
                    placeholder="e.g. Starry Night"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111827] outline-none"
                    placeholder="e.g. Abstract, Portrait"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Price (NGN) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111827] outline-none"
                    placeholder="50000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111827] outline-none h-24 resize-none"
                    placeholder="Tell us about your work..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Image URLs (comma separated) *</label>
                  <input
                    type="text"
                    name="imageUrls"
                    value={formData.imageUrls}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111827] outline-none"
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full py-3 bg-[#111827] text-white rounded-lg font-bold hover:bg-black transition-colors disabled:opacity-50"
                >
                  {isUploading ? 'Uploading...' : 'Publish Artwork'}
                </button>
              </form>
            </div>
          </div>

          {/* My Artworks List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 min-h-[600px]">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Layout size={24} className="text-[#111827]" /> Your Collection
              </h2>

              {isLoadingArtworks ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#111827]"></div>
                </div>
              ) : myArtworks?.length === 0 || !myArtworks ? (
                <div className="text-center py-20">
                  <p className="text-gray-500 mb-4">You haven't uploaded any artworks yet.</p>
                  <p className="text-sm text-gray-400">Your published works will appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myArtworks.map(art => (
                    <div key={art.id} className="border border-gray-100 rounded-xl overflow-hidden group hover:shadow-md transition-shadow">
                      <div className="relative h-40 bg-gray-100">
                        <img 
                          src={Array.isArray(art.imageUrls) ? art.imageUrls[0] : (typeof art.imageUrls === 'string' && art.imageUrls.startsWith('[') ? JSON.parse(art.imageUrls)[0] : art.imageUrls)} 
                          alt={art.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 rounded text-xs font-bold shadow-sm">
                          N{art.price.toLocaleString()}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-[#111827] mb-1">{art.name}</h3>
                        <p className="text-xs text-gray-500 mb-2">{art.category || 'Uncategorized'}</p>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{art.description}</p>
                        <div className="flex gap-2">
                          <button className="flex-1 py-1.5 text-xs font-semibold bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">Edit</button>
                          <button className="flex-1 py-1.5 text-xs font-semibold bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors">Delete</button>
                        </div>
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
