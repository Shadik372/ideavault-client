'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

const CATEGORIES = ['All', 'Tech', 'Health', 'AI', 'Education', 'Finance', 'Environment'];

const categoryColors = {
  Tech: 'text-blue-600 dark:text-blue-400',
  Health: 'text-green-600 dark:text-green-400',
  AI: 'text-purple-600 dark:text-purple-400',
  Education: 'text-yellow-600 dark:text-yellow-400',
  Finance: 'text-emerald-600 dark:text-emerald-400',
  Environment: 'text-teal-600 dark:text-teal-400',
};

function IdeaCard({ idea }) {
  const colorClass = categoryColors[idea.category] || 'text-black/50 dark:text-white/50';
  return (
    <div className="bg-white dark:bg-black border-b border-r border-black/10 dark:border-white/10 p-6 flex flex-col hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs font-bold uppercase tracking-wider ${colorClass}`}>
          {idea.category}
        </span>
        <span className="text-xs text-black/30 dark:text-white/30">
          {new Date(idea.createdAt).toLocaleDateString()}
        </span>
      </div>
      <h3 className="text-base font-black text-black dark:text-white mb-2 line-clamp-2 leading-snug">
        {idea.title}
      </h3>
      <p className="text-black/50 dark:text-white/50 text-sm line-clamp-3 flex-1 mb-4 leading-relaxed">
        {idea.shortDescription}
      </p>
      {idea.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {idea.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="text-xs px-2 py-0.5 bg-black/5 dark:bg-white/5 text-black/50 dark:text-white/50">
              #{tag}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-black/10 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-black dark:bg-red-600 flex items-center justify-center">
            <span className="text-white text-xs font-black">
              {idea.authorName?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
          <span className="text-xs font-semibold text-black/50 dark:text-white/50 truncate max-w-20">
            {idea.authorName}
          </span>
        </div>
        <Link href={`/ideas/${idea._id}`} className="text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-500 transition-colors">
          View →
        </Link>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-black border-b border-r border-black/10 dark:border-white/10 p-6 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="h-4 w-16 bg-black/10 dark:bg-white/10"></div>
        <div className="h-4 w-20 bg-black/10 dark:bg-white/10"></div>
      </div>
      <div className="h-5 bg-black/10 dark:bg-white/10 w-3/4 mb-3"></div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-black/10 dark:bg-white/10 w-full"></div>
        <div className="h-4 bg-black/10 dark:bg-white/10 w-5/6"></div>
        <div className="h-4 bg-black/10 dark:bg-white/10 w-4/6"></div>
      </div>
      <div className="h-px bg-black/10 dark:bg-white/10 mb-4"></div>
      <div className="flex justify-between">
        <div className="h-4 w-24 bg-black/10 dark:bg-white/10"></div>
        <div className="h-4 w-16 bg-black/10 dark:bg-white/10"></div>
      </div>
    </div>
  );
}

function IdeasContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'All'
  );

  useEffect(() => {
    document.title = 'Explore Ideas | IdeaVault';
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
    <div className="min-h-screen bg-white dark:bg-black">

      {/* Header */}
      <div className="border-b border-black/10 dark:border-white/10 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-red-600 font-bold text-xs uppercase tracking-widest mb-2">Community</p>
          <h1 className="text-3xl md:text-4xl font-black text-black dark:text-white mb-1 leading-none">
            Explore Ideas
          </h1>
          <p className="text-black/50 dark:text-white/50 text-sm">
            Discover innovative startup ideas from our community
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="mt-6 flex gap-2 max-w-xl">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30 dark:text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ideas by title..."
                className="w-full pl-9 pr-4 py-2.5 border border-black/20 dark:border-white/20 bg-white dark:bg-black text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-black dark:focus:border-white text-sm transition-colors"
              />
            </div>
            <button type="submit" className="px-6 py-2.5 bg-black dark:bg-red-600 text-white font-bold text-sm hover:bg-black/80 dark:hover:bg-red-700 transition-colors">
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
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors border ${
                selectedCategory === cat
                  ? 'bg-black dark:bg-red-600 text-white border-black dark:border-red-600'
                  : 'bg-white dark:bg-black text-black/50 dark:text-white/50 border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-xs text-black/40 dark:text-white/40 mb-6 font-medium">
            {ideas.length} idea{ideas.length !== 1 ? 's' : ''}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-black/10 dark:border-white/10">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : ideas.length === 0 ? (
          <div className="text-center py-20 border border-black/10 dark:border-white/10">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-black text-black dark:text-white mb-2">No ideas found</h3>
            <p className="text-black/50 dark:text-white/50 text-sm mb-6">Try a different search or category</p>
            <button
              onClick={() => { setSearch(''); setSelectedCategory('All'); fetchIdeas(); }}
              className="px-6 py-2.5 bg-black dark:bg-red-600 text-white font-bold text-sm hover:bg-black/80 dark:hover:bg-red-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-black/10 dark:border-white/10">
            {ideas.map((idea) => (
              <IdeaCard key={idea._id} idea={idea} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function IdeasPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-black dark:border-white border-t-transparent animate-spin"></div>
      </div>
    }>
      <IdeasContent />
    </Suspense>
  );
}