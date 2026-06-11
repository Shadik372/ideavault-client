'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

const categoryColors = {
  Tech: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Health: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  AI: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Education: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Finance: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Environment: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
};

export default function IdeaDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [idea, setIdea] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchIdea();
    fetchComments();
  }, [id, user]);

  const fetchIdea = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ideas/${id}`);
      if (!res.ok) throw new Error('Idea not found');
      const data = await res.json();
      setIdea(data);
    } catch (error) {
      toast.error('Failed to load idea');
      router.push('/ideas');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/${id}`);
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error('Failed to fetch comments');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ideaId: id,
          text: commentText.trim(),
          userEmail: user.email,
          userName: user.name,
          userPhoto: user.photoURL || '',
        }),
      });
      if (!res.ok) throw new Error('Failed to add comment');
      toast.success('Comment added!');
      setCommentText('');
      fetchComments();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editText.trim() }),
      });
      if (!res.ok) throw new Error('Failed to update comment');
      toast.success('Comment updated!');
      setEditingComment(null);
      setEditText('');
      fetchComments();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete comment');
      toast.success('Comment deleted!');
      setDeleteConfirm(null);
      fetchComments();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!idea) return null;

  const colorClass = categoryColors[idea.category] || 'bg-gray-100 text-gray-700';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Idea Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden mb-8">

          {/* Image */}
          {idea.imageURL && (
            <img
              src={idea.imageURL}
              alt={idea.title}
              className="w-full h-64 object-cover"
              onError={(e) => e.target.style.display = 'none'}
            />
          )}

          <div className="p-8">
            {/* Category + Date */}
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colorClass}`}>
                {idea.category}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(idea.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {idea.title}
            </h1>

            {/* Short Description */}
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">
              {idea.shortDescription}
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center overflow-hidden">
                {idea.authorPhoto ? (
                  <img src={idea.authorPhoto} alt={idea.authorName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-violet-600">{idea.authorName?.charAt(0)?.toUpperCase()}</span>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{idea.authorName}</p>
                <p className="text-xs text-gray-400">{idea.authorEmail}</p>
              </div>
            </div>

            {/* Tags */}
            {idea.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {idea.tags.map((tag, i) => (
                  <span key={i} className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {idea.targetAudience && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Target Audience</h3>
                  <p className="text-gray-900 dark:text-white text-sm">{idea.targetAudience}</p>
                </div>
              )}
              {idea.estimatedBudget && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Estimated Budget</h3>
                  <p className="text-gray-900 dark:text-white text-sm">{idea.estimatedBudget}</p>
                </div>
              )}
            </div>

            {/* Problem Statement */}
            {idea.problemStatement && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="text-red-500">⚠️</span> Problem Statement
                </h3>
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl p-4">
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{idea.problemStatement}</p>
                </div>
              </div>
            )}

            {/* Proposed Solution */}
            {idea.proposedSolution && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="text-green-500">✅</span> Proposed Solution
                </h3>
                <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 rounded-xl p-4">
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{idea.proposedSolution}</p>
                </div>
              </div>
            )}

            {/* Detailed Description */}
            {idea.detailedDescription && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📋 Detailed Description</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{idea.detailedDescription}</p>
              </div>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            💬 Comments ({comments.length})
          </h2>

          {/* Add Comment */}
          <form onSubmit={handleAddComment} className="mb-8">
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-sm font-bold text-violet-600">{user?.name?.charAt(0)?.toUpperCase()}</span>
                )}
              </div>
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts on this idea..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition resize-none"
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={submittingComment || !commentText.trim()}
                    className="px-5 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors text-sm"
                  >
                    {submittingComment ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Comments List */}
          {comments.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-3">💬</div>
              <p className="text-gray-500">No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment._id} className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {comment.userPhoto ? (
                      <img src={comment.userPhoto} alt={comment.userName} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <span className="text-sm font-bold text-violet-600">{comment.userName?.charAt(0)?.toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{comment.userName}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {editingComment === comment._id ? (
                        <div>
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none text-sm"
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleEditComment(comment._id)}
                              className="px-3 py-1.5 bg-violet-600 text-white text-xs rounded-lg hover:bg-violet-700 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => { setEditingComment(null); setEditText(''); }}
                              className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-700 dark:text-gray-300 text-sm">{comment.text}</p>
                      )}
                    </div>

                    {/* Edit/Delete — only for own comments */}
                    {user?.email === comment.userEmail && editingComment !== comment._id && (
                      <div className="flex gap-3 mt-1 ml-1">
                        <button
                          onClick={() => { setEditingComment(comment._id); setEditText(comment.text); }}
                          className="text-xs text-gray-400 hover:text-violet-600 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(comment._id)}
                          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Comment</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Are you sure you want to delete this comment? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteComment(deleteConfirm)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}