'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function MyInteractionsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'My Interactions | IdeaVault';
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) fetchMyComments();
  }, [user, authLoading]);

  const fetchMyComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-comments?email=${user.email}`);
      const data = await res.json();
      setComments(data);
    } catch (error) {
      toast.error('Failed to load interactions');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-6 bg-black/10 dark:bg-white/10 w-48 mb-8 animate-pulse"></div>
          <div className="space-y-px">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-black border border-black/10 dark:border-white/10 p-6 animate-pulse h-24"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          <p className="text-red-600 font-bold text-xs uppercase tracking-widest mb-2">Dashboard</p>
          <h1 className="text-3xl font-black text-black dark:text-white leading-none">My Interactions</h1>
          <p className="text-black/40 dark:text-white/40 text-sm mt-1">All ideas you have commented on</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-px bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10 mb-10">
          <div className="bg-white dark:bg-black p-6">
            <p className="text-3xl font-black text-black dark:text-white">{comments.length}</p>
            <p className="text-xs font-bold text-black/40 dark:text-white/40 uppercase tracking-wider mt-1">Total Comments</p>
            <div className="w-6 h-0.5 bg-red-600 mt-3"></div>
          </div>
          <div className="bg-white dark:bg-black p-6">
            <p className="text-3xl font-black text-black dark:text-white">
              {new Set(comments.map(c => c.ideaId)).size}
            </p>
            <p className="text-xs font-bold text-black/40 dark:text-white/40 uppercase tracking-wider mt-1">Ideas Engaged</p>
            <div className="w-6 h-0.5 bg-red-600 mt-3"></div>
          </div>
        </div>

        {/* Empty State */}
        {comments.length === 0 ? (
          <div className="text-center py-20 border border-black/10 dark:border-white/10">
            <div className="text-5xl mb-4">💬</div>
            <h3 className="text-xl font-black text-black dark:text-white mb-2">No interactions yet</h3>
            <p className="text-black/40 dark:text-white/40 text-sm mb-6">Start exploring ideas and leave your thoughts!</p>
            <Link
              href="/ideas"
              className="px-6 py-2.5 bg-black dark:bg-red-600 text-white font-bold text-sm hover:bg-black/80 dark:hover:bg-red-700 transition-colors"
            >
              Explore Ideas
            </Link>
          </div>
        ) : (
          <div className="border border-black/10 dark:border-white/10">
            {comments.map((comment, i) => (
              <div
                key={comment._id}
                className={`p-6 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors ${
                  i !== comments.length - 1 ? 'border-b border-black/10 dark:border-white/10' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Comment Text */}
                    <p className="text-black dark:text-white text-sm font-medium mb-3 leading-relaxed">
                      "{comment.text}"
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-black/30 dark:text-white/30">
                      <span className="flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(comment.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                      {comment.updatedAt !== comment.createdAt && (
                        <span className="text-black/20 dark:text-white/20 font-medium">edited</span>
                      )}
                    </div>
                  </div>

                  {/* View Button */}
                  <Link
                    href={`/ideas/${comment.ideaId}`}
                    className="flex-shrink-0 px-4 py-2 text-xs font-bold text-black dark:text-white border border-black/20 dark:border-white/20 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors uppercase tracking-wider"
                  >
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}