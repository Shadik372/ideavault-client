'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

const CATEGORIES = ['Tech', 'Health', 'AI', 'Education', 'Finance', 'Environment', 'Other'];

const categoryColors = {
  Tech: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Health: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  AI: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Education: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Finance: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Environment: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
};

export default function MyIdeasPage() {
  const { user, loading: authLoading, getToken } = useAuth();
  const router = useRouter();

  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [editData, setEditData] = useState({});
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) fetchMyIdeas();
  }, [user, authLoading]);

  const fetchMyIdeas = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/ideas?email=${user.email}`
      );
      const data = await res.json();
      setIdeas(data);
    } catch (error) {
      toast.error('Failed to load your ideas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ideas/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete idea');
      toast.success('Idea deleted successfully!');
      setDeleteConfirm(null);
      fetchMyIdeas();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const openEditModal = (idea) => {
    setEditData({
      title: idea.title,
      shortDescription: idea.shortDescription,
      detailedDescription: idea.detailedDescription || '',
      category: idea.category,
      targetAudience: idea.targetAudience || '',
      problemStatement: idea.problemStatement || '',
      proposedSolution: idea.proposedSolution || '',
      estimatedBudget: idea.estimatedBudget || '',
      imageURL: idea.imageURL || '',
    });
    setEditModal(idea._id);
  };

  const handleUpdate = async () => {
    if (!editData.title || !editData.shortDescription || !editData.category) {
      toast.error('Please fill in required fields');
      return;
    }
    setUpdating(true);
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ideas/${editModal}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });
      if (!res.ok) throw new Error('Failed to update idea');
      toast.success('Idea updated successfully!');
      setEditModal(null);
      fetchMyIdeas();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-48 mb-8 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-6 animate-pulse h-48"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Ideas</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              You have {ideas.length} idea{ideas.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => router.push('/add-idea')}
            className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
          >
            <span>+</span> New Idea
          </button>
        </div>

        {ideas.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💡</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No ideas yet</h3>
            <p className="text-gray-500 mb-6">Share your first startup idea with the community!</p>
            <button
              onClick={() => router.push('/add-idea')}
              className="px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors"
            >
              Share an Idea
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => {
              const colorClass = categoryColors[idea.category] || 'bg-gray-100 text-gray-700';
              return (
                <div key={idea._id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colorClass}`}>
                      {idea.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(idea.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{idea.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 flex-1 mb-4">{idea.shortDescription}</p>
                  <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <button onClick={() => router.push(`/ideas/${idea._id}`)} className="flex-1 py-2 text-sm font-medium text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors">View</button>
                    <button onClick={() => openEditModal(idea)} className="flex-1 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">Edit</button>
                    <button onClick={() => setDeleteConfirm(idea._id)} className="flex-1 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Idea</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Are you sure you want to delete this idea? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-8 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-2xl w-full shadow-2xl my-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit Idea</h3>
              <button onClick={() => setEditModal(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title <span className="text-red-500">*</span></label>
                <input type="text" value={editData.title} onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Short Description <span className="text-red-500">*</span></label>
                <input type="text" value={editData.shortDescription} onChange={(e) => setEditData(prev => ({ ...prev, shortDescription: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category <span className="text-red-500">*</span></label>
                <select value={editData.category} onChange={(e) => setEditData(prev => ({ ...prev, category: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition">
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Audience</label>
                <input type="text" value={editData.targetAudience} onChange={(e) => setEditData(prev => ({ ...prev, targetAudience: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Problem Statement</label>
                <textarea value={editData.problemStatement} onChange={(e) => setEditData(prev => ({ ...prev, problemStatement: e.target.value }))} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Proposed Solution</label>
                <textarea value={editData.proposedSolution} onChange={(e) => setEditData(prev => ({ ...prev, proposedSolution: e.target.value }))} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estimated Budget</label>
                <input type="text" value={editData.estimatedBudget} onChange={(e) => setEditData(prev => ({ ...prev, estimatedBudget: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                <input type="url" value={editData.imageURL} onChange={(e) => setEditData(prev => ({ ...prev, imageURL: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditModal(null)} className="flex-1 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">Cancel</button>
              <button onClick={handleUpdate} disabled={updating} className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl transition-colors font-medium">{updating ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}