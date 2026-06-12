'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
  });

  useEffect(() => {
    document.title = 'Profile | IdeaVault';
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      setFormData({
        name: user.name || '',
        image: user.photoURL || '',
      });
    }
  }, [user, authLoading]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    setIsLoading(true);
    try {
      const { authClient } = await import('@/lib/auth-client');
      const result = await authClient.updateUser({
        name: formData.name,
        image: formData.image,
      });
      if (result.error) throw new Error(result.error.message);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">

          {/* Cover */}
          <div className="h-24 bg-gradient-to-br from-violet-600 to-indigo-600"></div>

          {/* Avatar + Info */}
          <div className="px-8 pb-8">
            <div className="flex items-end justify-between -mt-10 mb-6">
              <div className="w-20 h-20 rounded-2xl border-4 border-white dark:border-gray-900 overflow-hidden bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-violet-600">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                )}
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {!isEditing ? (
              // View Mode
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
                  <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Full Name</p>
                    <p className="text-gray-900 dark:text-white font-medium">{user?.name}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email</p>
                    <p className="text-gray-900 dark:text-white font-medium truncate">{user?.email}</p>
                  </div>
                  {user?.photoURL && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 sm:col-span-2">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Photo URL</p>
                      <p className="text-gray-900 dark:text-white text-sm truncate">{user.photoURL}</p>
                    </div>
                  )}
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <button
                    onClick={() => router.push('/my-ideas')}
                    className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
                  >
                    <span className="text-2xl">💡</span>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">My Ideas</p>
                      <p className="text-xs text-gray-400">View all your ideas</p>
                    </div>
                  </button>
                  <button
                    onClick={() => router.push('/my-interactions')}
                    className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
                  >
                    <span className="text-2xl">💬</span>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Interactions</p>
                      <p className="text-xs text-gray-400">View your comments</p>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleUpdate} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email <span className="text-gray-400 font-normal">(cannot be changed)</span>
                  </label>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Photo URL <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                  />
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="mt-3 w-16 h-16 rounded-xl object-cover"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl transition-colors font-medium"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}