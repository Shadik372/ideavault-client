'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

const CATEGORIES = ['Tech', 'Health', 'AI', 'Education', 'Finance', 'Environment', 'Other'];

const categoryColors = {
  Tech: 'text-blue-600 dark:text-blue-400',
  Health: 'text-green-600 dark:text-green-400',
  AI: 'text-purple-600 dark:text-purple-400',
  Education: 'text-yellow-600 dark:text-yellow-400',
  Finance: 'text-emerald-600 dark:text-emerald-400',
  Environment: 'text-teal-600 dark:text-teal-400',
};

const inputClass = 'w-full px-4 py-3 border border-black/20 dark:border-white/20 bg-white dark:bg-black text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-black dark:focus:border-white text-sm transition-colors';
const labelClass = 'block text-xs font-bold text-black/60 dark:text-white/60 uppercase tracking-wider mb-2';

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
    document.title = 'My Ideas | IdeaVault';
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) fetchMyIdeas();
  }, [user, authLoading]);

  const fetchMyIdeas = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ideas?email=${user.email}`);
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
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete idea');
      toast.success('Idea deleted!');
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
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(editData),
      });
      if (!res.ok) throw new Error('Failed to update idea');
      toast.success('Idea updated!');
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
      <div className="min-h-screen bg-white dark:bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-6 bg-black/10 dark:bg-white/10 w-48 mb-8 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/10 dark:bg-white/10">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-black p-6 animate-pulse h-48"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-red-600 font-bold text-xs uppercase tracking-widest mb-1">Dashboard</p>
            <h1 className="text-3xl font-black text-black dark:text-white leading-none">My Ideas</h1>
            <p className="text-black/40 dark:text-white/40 text-sm mt-1">
              {ideas.length} idea{ideas.length !== 1 ? 's' : ''} submitted
            </p>
          </div>
          <button
            onClick={() => router.push('/add-idea')}
            className="px-5 py-2.5 bg-black dark:bg-red-600 text-white font-bold text-sm hover:bg-black/80 dark:hover:bg-red-700 transition-colors"
          >
            + New Idea
          </button>
        </div>

        {/* Empty State */}
        {ideas.length === 0 ? (
          <div className="text-center py-20 border border-black/10 dark:border-white/10">
            <div className="text-5xl mb-4">💡</div>
            <h3 className="text-xl font-black text-black dark:text-white mb-2">No ideas yet</h3>
            <p className="text-black/40 dark:text-white/40 text-sm mb-6">Share your first startup idea with the community!</p>
            <button
              onClick={() => router.push('/add-idea')}
              className="px-6 py-2.5 bg-black dark:bg-red-600 text-white font-bold text-sm hover:bg-black/80 dark:hover:bg-red-700 transition-colors"
            >
              Share an Idea
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/10 dark:bg-white/10">
            {ideas.map((idea) => {
              const colorClass = categoryColors[idea.category] || 'text-black/50 dark:text-white/50';
              return (
                <div key={idea._id} className="bg-white dark:bg-black p-6 flex flex-col hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-bold uppercase tracking-wider ${colorClass}`}>
                      {idea.category}
                    </span>
                    <span className="text-xs text-black/30 dark:text-white/30">
                      {new Date(idea.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-black dark:text-white mb-2 line-clamp-2 leading-snug">{idea.title}</h3>
                  <p className="text-black/50 dark:text-white/50 text-sm line-clamp-2 flex-1 mb-4">{idea.shortDescription}</p>
                  <div className="flex gap-px pt-4 border-t border-black/10 dark:border-white/10">
                    <button onClick={() => router.push(`/ideas/${idea._id}`)} className="flex-1 py-2 text-xs font-bold text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors uppercase tracking-wider">View</button>
                    <button onClick={() => openEditModal(idea)} className="flex-1 py-2 text-xs font-bold text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors uppercase tracking-wider">Edit</button>
                    <button onClick={() => setDeleteConfirm(idea._id)} className="flex-1 py-2 text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors uppercase tracking-wider">Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-black border border-black/10 dark:border-white/10 p-6 max-w-sm w-full">
            <h3 className="text-base font-black text-black dark:text-white mb-2 uppercase tracking-wider">Delete Idea</h3>
            <p className="text-black/50 dark:text-white/50 text-sm mb-6">Are you sure? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-black/20 dark:border-white/20 text-black dark:text-white font-bold text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4 py-8 overflow-y-auto">
          <div className="bg-white dark:bg-black border border-black/10 dark:border-white/10 p-6 max-w-2xl w-full my-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/10 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-red-600"></div>
                <h3 className="text-sm font-black text-black dark:text-white uppercase tracking-wider">Edit Idea</h3>
              </div>
              <button onClick={() => setEditModal(null)} className="text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <label className={labelClass}>Title <span className="text-red-500 normal-case">*</span></label>
                <input type="text" value={editData.title} onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Short Description <span className="text-red-500 normal-case">*</span></label>
                <input type="text" value={editData.shortDescription} onChange={(e) => setEditData(prev => ({ ...prev, shortDescription: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Category <span className="text-red-500 normal-case">*</span></label>
                <select value={editData.category} onChange={(e) => setEditData(prev => ({ ...prev, category: e.target.value }))} className={inputClass}>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Target Audience</label>
                <input type="text" value={editData.targetAudience} onChange={(e) => setEditData(prev => ({ ...prev, targetAudience: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Problem Statement</label>
                <textarea value={editData.problemStatement} onChange={(e) => setEditData(prev => ({ ...prev, problemStatement: e.target.value }))} rows={3} className={`${inputClass} resize-none`} />
              </div>
              <div>
                <label className={labelClass}>Proposed Solution</label>
                <textarea value={editData.proposedSolution} onChange={(e) => setEditData(prev => ({ ...prev, proposedSolution: e.target.value }))} rows={3} className={`${inputClass} resize-none`} />
              </div>
              <div>
                <label className={labelClass}>Estimated Budget</label>
                <input type="text" value={editData.estimatedBudget} onChange={(e) => setEditData(prev => ({ ...prev, estimatedBudget: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Image URL</label>
                <input type="url" value={editData.imageURL} onChange={(e) => setEditData(prev => ({ ...prev, imageURL: e.target.value }))} className={inputClass} />
              </div>
            </div>
            <div className="flex gap-3 mt-6 pt-4 border-t border-black/10 dark:border-white/10">
              <button onClick={() => setEditModal(null)} className="flex-1 py-3 border border-black/20 dark:border-white/20 text-black dark:text-white font-bold text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors">Cancel</button>
              <button onClick={handleUpdate} disabled={updating} className="flex-1 py-3 bg-black dark:bg-red-600 hover:bg-black/80 dark:hover:bg-red-700 disabled:opacity-50 text-white font-bold text-sm transition-colors">{updating ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}