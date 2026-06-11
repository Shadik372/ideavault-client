'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const slides = [
  {
    title: 'Turn Your Ideas Into Reality',
    subtitle: 'Share your startup ideas with a community of innovators and get valuable feedback.',
    bg: 'from-violet-600 to-indigo-600',
    emoji: '🚀',
  },
  {
    title: 'Discover Trending Startups',
    subtitle: 'Explore innovative ideas from entrepreneurs around the world and find your next inspiration.',
    bg: 'from-indigo-600 to-blue-600',
    emoji: '💡',
  },
  {
    title: 'Collaborate & Validate',
    subtitle: 'Comment, discuss and help validate ideas through community interaction and feedback.',
    bg: 'from-blue-600 to-cyan-600',
    emoji: '🤝',
  },
];

const categories = [
  { name: 'Technology', icon: '💻', count: 0 },
  { name: 'Health', icon: '🏥', count: 0 },
  { name: 'AI', icon: '🤖', count: 0 },
  { name: 'Education', icon: '📚', count: 0 },
  { name: 'Finance', icon: '💰', count: 0 },
  { name: 'Environment', icon: '🌱', count: 0 },
];

const steps = [
  { step: '01', title: 'Share Your Idea', desc: 'Submit your startup idea with details, problem statement and proposed solution.', icon: '✏️' },
  { step: '02', title: 'Get Feedback', desc: 'Receive comments and suggestions from the community to refine your concept.', icon: '💬' },
  { step: '03', title: 'Validate & Grow', desc: 'Use community insights to validate your idea and take it to the next level.', icon: '📈' },
];

export default function HomePage() {
  const [current, setCurrent] = useState(0);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auto-play slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Fetch trending ideas
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ideas?limit=6`);
        const data = await res.json();
        setIdeas(data);
      } catch (error) {
        console.error('Failed to fetch ideas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchIdeas();
  }, []);

  return (
    <div className="min-h-screen">

      {/* ── Banner ── */}
      <section className="relative overflow-hidden">
        <div className={`bg-gradient-to-br ${slides[current].bg} transition-all duration-700`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="text-center text-white">
              <div className="text-7xl mb-6">{slides[current].emoji}</div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                {slides[current].title}
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10">
                {slides[current].subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/ideas"
                  className="px-8 py-4 bg-white text-violet-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Explore Ideas →
                </Link>
                <Link
                  href="/add-idea"
                  className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl border border-white/30 transition-colors"
                >
                  Share Your Idea
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${i === current ? 'w-8 bg-white' : 'w-2 bg-white/50'}`}
            />
          ))}
        </div>
      </section>

      {/* ── Trending Ideas ── */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-violet-600 font-semibold text-sm uppercase tracking-wider">Community Picks</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2">
              Trending Ideas
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">
              Discover the most exciting startup ideas shared by our community
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : ideas.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">💡</div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No ideas yet</h3>
              <p className="text-gray-500 mb-6">Be the first to share a startup idea!</p>
              <Link href="/add-idea" className="px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors">
                Share an Idea
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ideas.map((idea) => (
                <IdeaCard key={idea._id} idea={idea} />
              ))}
            </div>
          )}

          {ideas.length > 0 && (
            <div className="text-center mt-12">
              <Link
                href="/ideas"
                className="px-8 py-3 border-2 border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white font-semibold rounded-xl transition-colors"
              >
                View All Ideas
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-violet-600 font-semibold text-sm uppercase tracking-wider">Simple Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2">
              How It Works
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">
              Three simple steps to share and validate your startup idea
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative text-center p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{step.icon}</div>
                <div className="absolute top-4 right-4 text-4xl font-bold text-gray-100 dark:text-gray-700">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-violet-600 font-semibold text-sm uppercase tracking-wider">Browse By Topic</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2">
              Explore Categories
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">
              Find ideas that match your interests and expertise
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <Link
                key={i}
                href={`/ideas?category=${cat.name}`}
                className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-900 rounded-2xl hover:shadow-md hover:scale-105 transition-all border border-gray-100 dark:border-gray-800"
              >
                <span className="text-4xl">{cat.icon}</span>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

function IdeaCard({ idea }) {
  const categoryColors = {
    Tech: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    Health: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    AI: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    Education: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    Finance: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Environment: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  };

  const colorClass = categoryColors[idea.category] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col">
      {/* Category + Date */}
      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colorClass}`}>
          {idea.category}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(idea.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
        {idea.title}
      </h3>

      {/* Description */}
      <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 flex-1 mb-4">
        {idea.shortDescription}
      </p>

      {/* Author + Button */}
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
          className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}