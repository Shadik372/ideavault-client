'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

const CATEGORIES = ['All', 'Tech', 'Health', 'AI', 'Education', 'Finance', 'Environment'];

const categoryColors = {
  Tech: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Health: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  AI: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Education: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Finance: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Environment: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
};

function IdeaCard({ idea }) {
  const colorClass = categoryColors[idea.category] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colorClass}`}>
          {idea.category}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(idea.createdAt).toLocaleDateString()}
        </span>
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
        {idea.title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 flex-1 mb-4">
        {idea.shortDescription}
      </p>
      {idea.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {idea.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
            <span className="text-xs font-bold text-violet-600">
              {idea.authorName?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
          <span className="text-xs text-gray-500 truncate max-w-24">{idea.authorName}</span>
        </div>
        <Link
          href={`/ideas/${idea._id}`}
          className="text-xs font-semibold text-violet-600 hover:text-violet-700"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
      </div>
      <div className="h-px bg-gray-100 dark:bg-gray-800 mb-4"></div>
      <div className="flex justify-between">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
}

export default function IdeasPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'All'
  );

  useEffect(() => {
    fetchIdeas();
  }, [selectedCategory]);

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/ideas?`;
      if (selectedCategory !== 'All') url += `category=${selectedCategory}&`;
      if (search) url += `search=${search}&`;
      const res = await fetch(url);
      const data = await res.json();
      setIdeas(data);
    } catch (error) {
      console.error('Failed to fetch ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchIdeas();
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat !== 'All') {
      router.push(`/ideas?category=${cat}`);
    } else {
      router.push('/ideas');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Explore Ideas
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Discover innovative startup ideas from our community
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="mt-6 flex gap-3 max-w-xl">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ideas by title..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-violet-600 text-white'
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-violet-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{ideas.length}</span> ideas
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : ideas.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No ideas found</h3>
            <p className="text-gray-500 mb-6">Try a different search or category</p>
            <button
              onClick={() => { setSearch(''); setSelectedCategory('All'); fetchIdeas(); }}
              className="px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <IdeaCard key={idea._id} idea={idea} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}