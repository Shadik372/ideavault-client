'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

const categoryColors = {
  Tech: 'text-blue-600 dark:text-blue-400',
  Health: 'text-green-600 dark:text-green-400',
  AI: 'text-purple-600 dark:text-purple-400',
  Education: 'text-yellow-600 dark:text-yellow-400',
  Finance: 'text-emerald-600 dark:text-emerald-400',
  Environment: 'text-teal-600 dark:text-teal-400',
};

export default function IdeaDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, getToken } = useAuth();

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
      document.title = `${data.title} | IdeaVault`;
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
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ideaId: id, text: commentText.trim(), userEmail: user.email, userName: user.name, userPhoto: user.photoURL || '' }),
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
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
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
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
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
      <div className="min-h-screen bg-white dark:bg-black py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse space-y-4">
          <div className="h-4 bg-black/10 dark:bg-white/10 w-16"></div>
          <div className="h-8 bg-black/10 dark:bg-white/10 w-3/4"></div>
          <div className="h-4 bg-black/10 dark:bg-white/10 w-1/2"></div>
          <div className="h-64 bg-black/10 dark:bg-white/10"></div>
        </div>
      </div>
    );
  }

  if (!idea) return null;

  const colorClass = categoryColors[idea.category] || 'text-black/50 dark:text-white/50';

  return (
    <div className="min-h-screen bg-white dark:bg-black py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white mb-8 transition-colors text-sm font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Idea */}
        <div className="border border-black/10 dark:border-white/10 mb-8">
          {idea.imageURL && (
            <img src={idea.imageURL} alt={idea.title} className="w-full h-64 object-cover" onError={(e) => e.target.style.display = 'none'} />
          )}
          <div className="p-8">

            {/* Category + Date */}
            <div className="flex items-center justify-between mb-6">
              <span className={`text-xs font-bold uppercase tracking-wider ${colorClass}`}>{idea.category}</span>
              <span className="text-xs text-black/30 dark:text-white/30">
                {new Date(idea.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-black dark:text-white mb-3 leading-tight">{idea.title}</h1>
            <p className="text-black/60 dark:text-white/60 mb-8 leading-relaxed">{idea.shortDescription}</p>

            {/* Author */}
            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-black/10 dark:border-white/10">
              <div className="w-9 h-9 bg-black dark:bg-red-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                {idea.authorPhoto ? (
                  <img src={idea.authorPhoto} alt={idea.authorName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-sm font-black">{idea.authorName?.charAt(0)?.toUpperCase()}</span>
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-black dark:text-white">{idea.authorName}</p>
                <p className="text-xs text-black/40 dark:text-white/40">{idea.authorEmail}</p>
              </div>
            </div>

            {/* Tags */}
            {idea.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {idea.tags.map((tag, i) => (
                  <span key={i} className="text-xs px-3 py-1 bg-black/5 dark:bg-white/5 text-black/50 dark:text-white/50 font-semibold">#{tag}</span>
                ))}
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {idea.targetAudience && (
                <div className="bg-black/[0.03] dark:bg-white/[0.03] p-4 border border-black/10 dark:border-white/10">
                  <h3 className="text-xs font-bold text-black/40 dark:text-white/40 uppercase tracking-wider mb-2">Target Audience</h3>
                  <p className="text-black dark:text-white text-sm">{idea.targetAudience}</p>
                </div>
              )}
              {idea.estimatedBudget && (
                <div className="bg-black/[0.03] dark:bg-white/[0.03] p-4 border border-black/10 dark:border-white/10">
                  <h3 className="text-xs font-bold text-black/40 dark:text-white/40 uppercase tracking-wider mb-2">Estimated Budget</h3>
                  <p className="text-black dark:text-white text-sm">{idea.estimatedBudget}</p>
                </div>
              )}
            </div>

            {/* Problem Statement */}
            {idea.problemStatement && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-5 bg-red-600"></div>
                  <h3 className="text-sm font-black text-black dark:text-white uppercase tracking-wider">Problem Statement</h3>
                </div>
                <div className="border-l-2 border-red-600 pl-4 py-1">
                  <p className="text-black/60 dark:text-white/60 text-sm leading-relaxed">{idea.problemStatement}</p>
                </div>
              </div>
            )}

            {/* Proposed Solution */}
            {idea.proposedSolution && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-5 bg-green-600"></div>
                  <h3 className="text-sm font-black text-black dark:text-white uppercase tracking-wider">Proposed Solution</h3>
                </div>
                <div className="border-l-2 border-green-600 pl-4 py-1">
                  <p className="text-black/60 dark:text-white/60 text-sm leading-relaxed">{idea.proposedSolution}</p>
                </div>
              </div>
            )}

            {/* Detailed Description */}
            {idea.detailedDescription && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-5 bg-black dark:bg-white"></div>
                  <h3 className="text-sm font-black text-black dark:text-white uppercase tracking-wider">Detailed Description</h3>
                </div>
                <p className="text-black/60 dark:text-white/60 text-sm leading-relaxed">{idea.detailedDescription}</p>
              </div>
            )}
          </div>
        </div>

        {/* Comments */}
        <div className="border border-black/10 dark:border-white/10 p-8">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-black/10 dark:border-white/10">
            <div className="w-1 h-5 bg-red-600"></div>
            <h2 className="text-sm font-black text-black dark:text-white uppercase tracking-wider">
              Comments ({comments.length})
            </h2>
          </div>

          {/* Add Comment */}
          <form onSubmit={handleAddComment} className="mb-8">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-black dark:bg-red-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-xs font-black">{user?.name?.charAt(0)?.toUpperCase()}</span>
                )}
              </div>
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts on this idea..."
                  rows={3}
                  className="w-full px-4 py-3 border border-black/20 dark:border-white/20 bg-white dark:bg-black text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-black dark:focus:border-white text-sm transition-colors resize-none"
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={submittingComment || !commentText.trim()}
                    className="px-5 py-2 bg-black dark:bg-red-600 hover:bg-black/80 dark:hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs transition-colors uppercase tracking-wider"
                  >
                    {submittingComment ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Comments List */}
          {comments.length === 0 ? (
            <div className="text-center py-12 border border-black/10 dark:border-white/10">
              <p className="text-black/30 dark:text-white/30 text-sm">No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment._id} className="flex gap-3">
                  <div className="w-8 h-8 bg-black dark:bg-red-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {comment.userPhoto ? (
                      <img src={comment.userPhoto} alt={comment.userName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-xs font-black">{comment.userName?.charAt(0)?.toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-black dark:text-white">{comment.userName}</span>
                        <span className="text-xs text-black/30 dark:text-white/30">{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                      {editingComment === comment._id ? (
                        <div>
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-black/20 dark:border-white/20 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white resize-none text-sm"
                          />
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => handleEditComment(comment._id)} className="px-3 py-1.5 bg-black dark:bg-red-600 text-white text-xs font-bold hover:bg-black/80 dark:hover:bg-red-700 transition-colors">Save</button>
                            <button onClick={() => { setEditingComment(null); setEditText(''); }} className="px-3 py-1.5 border border-black/20 dark:border-white/20 text-black dark:text-white text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-colors">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-black/70 dark:text-white/70 text-sm">{comment.text}</p>
                      )}
                    </div>
                    {user?.email === comment.userEmail && editingComment !== comment._id && (
                      <div className="flex gap-3 mt-1.5 ml-1">
                        <button onClick={() => { setEditingComment(comment._id); setEditText(comment.text); }} className="text-xs text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white transition-colors font-semibold">Edit</button>
                        <button onClick={() => setDeleteConfirm(comment._id)} className="text-xs text-black/30 dark:text-white/30 hover:text-red-600 transition-colors font-semibold">Delete</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-black border border-black/10 dark:border-white/10 p-6 max-w-sm w-full">
            <h3 className="text-base font-black text-black dark:text-white mb-2 uppercase tracking-wider">Delete Comment</h3>
            <p className="text-black/50 dark:text-white/50 text-sm mb-6">Are you sure? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-black/20 dark:border-white/20 text-black dark:text-white font-bold text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors">Cancel</button>
              <button onClick={() => handleDeleteComment(deleteConfirm)} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}