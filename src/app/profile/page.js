'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

const inputClass = 'w-full px-4 py-3 border border-black/20 dark:border-white/20 bg-white dark:bg-black text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-black dark:focus:border-white text-sm transition-colors';
const labelClass = 'block text-xs font-bold text-black/60 dark:text-white/60 uppercase tracking-wider mb-2';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', image: '' });

  useEffect(() => {
    document.title = 'Profile | IdeaVault';
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      setFormData({ name: user.name || '', image: user.photoURL || '' });
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
      const result = await authClient.updateUser({ name: formData.name, image: formData.image });
      if (result.error) throw new Error(result.error.message);
      toast.success('Profile updated!');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
          <div className="h-6 bg-black/10 dark:bg-white/10 w-32 mb-8"></div>
          <div className="border border-black/10 dark:border-white/10 p-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-black/10 dark:bg-white/10"></div>
              <div className="space-y-2">
                <div className="h-5 bg-black/10 dark:bg-white/10 w-32"></div>
                <div className="h-4 bg-black/10 dark:bg-white/10 w-48"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          <p className="text-red-600 font-bold text-xs uppercase tracking-widest mb-2">Account</p>
          <h1 className="text-3xl font-black text-black dark:text-white leading-none">Profile</h1>
          <p className="text-black/40 dark:text-white/40 text-sm mt-1">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="border border-black/10 dark:border-white/10">

          {/* Cover */}
          <div className="h-16 bg-black dark:bg-red-600/20 relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10"
              style={{ backgroundImage: 'repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }}>
            </div>
          </div>

          <div className="px-8 pb-8">
            {/* Avatar */}
            <div className="flex items-end justify-between -mt-8 mb-8">
              <div className="w-16 h-16 border-4 border-white dark:border-black overflow-hidden bg-black dark:bg-red-600 flex items-center justify-center">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-black text-white">{user?.name?.charAt(0)?.toUpperCase()}</span>
                )}
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 border border-black/20 dark:border-white/20 text-black dark:text-white font-bold text-xs hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors uppercase tracking-wider"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-black dark:text-white">{user?.name}</h2>
                  <p className="text-black/40 dark:text-white/40 text-sm">{user?.email}</p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10">
                  <div className="bg-white dark:bg-black p-4">
                    <p className="text-xs font-bold text-black/40 dark:text-white/40 uppercase tracking-wider mb-1">Full Name</p>
                    <p className="text-black dark:text-white font-semibold text-sm">{user?.name}</p>
                  </div>
                  <div className="bg-white dark:bg-black p-4">
                    <p className="text-xs font-bold text-black/40 dark:text-white/40 uppercase tracking-wider mb-1">Email</p>
                    <p className="text-black dark:text-white font-semibold text-sm truncate">{user?.email}</p>
                  </div>
                  {user?.photoURL && (
                    <div className="bg-white dark:bg-black p-4 sm:col-span-2">
                      <p className="text-xs font-bold text-black/40 dark:text-white/40 uppercase tracking-wider mb-1">Photo URL</p>
                      <p className="text-black dark:text-white text-sm truncate">{user.photoURL}</p>
                    </div>
                  )}
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-2 gap-px bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10">
                  <button
                    onClick={() => router.push('/my-ideas')}
                    className="flex items-center gap-3 p-5 bg-white dark:bg-black hover:bg-black dark:hover:bg-white group transition-colors"
                  >
                    <span className="text-2xl">💡</span>
                    <div className="text-left">
                      <p className="text-sm font-black text-black dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors">My Ideas</p>
                      <p className="text-xs text-black/40 dark:text-white/40 group-hover:text-white/60 dark:group-hover:text-black/60 transition-colors">View all your ideas</p>
                    </div>
                  </button>
                  <button
                    onClick={() => router.push('/my-interactions')}
                    className="flex items-center gap-3 p-5 bg-white dark:bg-black hover:bg-black dark:hover:bg-white group transition-colors"
                  >
                    <span className="text-2xl">💬</span>
                    <div className="text-left">
                      <p className="text-sm font-black text-black dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors">Interactions</p>
                      <p className="text-xs text-black/40 dark:text-white/40 group-hover:text-white/60 dark:group-hover:text-black/60 transition-colors">View your comments</p>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdate} className="space-y-5">
                <div>
                  <label className={labelClass}>Full Name <span className="text-red-500 normal-case">*</span></label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email <span className="text-black/30 dark:text-white/30 normal-case font-normal">(cannot be changed)</span></label>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="w-full px-4 py-3 border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40 cursor-not-allowed text-sm"
                  />
                </div>
                <div>
                  <label className={labelClass}>Photo URL <span className="text-black/30 dark:text-white/30 normal-case font-normal">(optional)</span></label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://example.com/photo.jpg"
                    className={inputClass}
                  />
                  {formData.image && (
                    <img src={formData.image} alt="Preview" className="mt-3 w-14 h-14 object-cover border border-black/10 dark:border-white/10" onError={(e) => e.target.style.display = 'none'} />
                  )}
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-3 border border-black/20 dark:border-white/20 text-black dark:text-white font-bold text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors">Cancel</button>
                  <button type="submit" disabled={isLoading} className="flex-1 py-3 bg-black dark:bg-red-600 hover:bg-black/80 dark:hover:bg-red-700 disabled:opacity-50 text-white font-bold text-sm transition-colors">{isLoading ? 'Saving...' : 'Save Changes'}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}