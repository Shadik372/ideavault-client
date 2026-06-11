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
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) fetchMyComments();
  }, [user, authLoading]);

  const fetchMyComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user-comments?email=${user.email}`
      );
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-48 mb-8 animate-pulse"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-6 animate-pulse h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Interactions</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            All ideas you have commented on
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💬</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{comments.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Comments</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💡</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {new Set(comments.map(c => c.ideaId)).size}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Ideas Engaged</p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {comments.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No interactions yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start exploring ideas and leave your thoughts!
            </p>
            <Link
              href="/ideas"
              className="px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors"
            >
              Explore Ideas
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Comment Text */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">💬</span>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {comment.text}
                      </p>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(comment.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </span>
                      {comment.updatedAt !== comment.createdAt && (
                        <span className="text-gray-300 dark:text-gray-600">(edited)</span>
                      )}
                    </div>
                  </div>

                  {/* View Idea Button */}
                  <Link
                    href={`/ideas/${comment.ideaId}`}
                    className="flex-shrink-0 px-4 py-2 text-sm font-medium text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl transition-colors"
                  >
                    View Idea →
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