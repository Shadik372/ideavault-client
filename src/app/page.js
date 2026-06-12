'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const slides = [
  {
    title: 'Turn Your Ideas Into Reality',
    subtitle: 'Share your startup ideas with a community of innovators and get valuable feedback.',
    emoji: '🚀',
  },
  {
    title: 'Discover Trending Startups',
    subtitle: 'Explore innovative ideas from entrepreneurs around the world and find your next inspiration.',
    emoji: '💡',
  },
  {
    title: 'Collaborate & Validate',
    subtitle: 'Comment, discuss and help validate ideas through community interaction and feedback.',
    emoji: '🤝',
  },
];

const categories = [
  { name: 'Technology', icon: '💻' },
  { name: 'Health', icon: '🏥' },
  { name: 'AI', icon: '🤖' },
  { name: 'Education', icon: '📚' },
  { name: 'Finance', icon: '💰' },
  { name: 'Environment', icon: '🌱' },
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

  useEffect(() => {
    document.title = 'IdeaVault - Startup Idea Sharing Platform';
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

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
    <div className="min-h-screen bg-white dark:bg-black">

      {/* ── Banner ── */}
      <section className="bg-black dark:bg-black relative overflow-hidden min-h-[560px] flex items-center">
        {/* Red accent line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-3xl">
            <div className="text-6xl mb-6">{slides[current].emoji}</div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight mb-6">
              {slides[current].title}
            </h1>
            <p className="text-lg text-white/60 max-w-xl mb-10 leading-relaxed">
              {slides[current].subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/ideas"
                className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold transition-colors text-sm"
              >
                Explore Ideas →
              </Link>
              <Link
                href="/add-idea"
                className="px-8 py-3 border border-white/20 hover:border-white/50 text-white font-bold transition-colors text-sm"
              >
                Share Your Idea
              </Link>
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-4 sm:left-8 lg:left-16 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-0.5 transition-all duration-300 ${i === current ? 'w-8 bg-red-500' : 'w-4 bg-white/20 hover:bg-white/40'}`}
            />
          ))}
        </div>

        {/* Slide number */}
        <div className="absolute bottom-6 right-8 text-white/20 font-black text-sm">
          0{current + 1} / 0{slides.length}
        </div>
      </section>

      {/* ── Trending Ideas ── */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-red-600 font-bold text-xs uppercase tracking-widest mb-2">Community Picks</p>
              <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white leading-none">
                Trending Ideas
              </h2>
            </div>
            {ideas.length > 0 && (
              <Link href="/ideas" className="text-sm font-bold text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors hidden sm:block">
                View all →
              </Link>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/10 dark:bg-white/10">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-black p-6 animate-pulse">
                  <div className="h-4 bg-black/10 dark:bg-white/10 w-1/3 mb-4"></div>
                  <div className="h-6 bg-black/10 dark:bg-white/10 w-3/4 mb-3"></div>
                  <div className="h-4 bg-black/10 dark:bg-white/10 w-full mb-2"></div>
                  <div className="h-4 bg-black/10 dark:bg-white/10 w-2/3"></div>
                </div>
              ))}
            </div>
          ) : ideas.length === 0 ? (
            <div className="text-center py-20 border border-black/10 dark:border-white/10">
              <div className="text-5xl mb-4">💡</div>
              <h3 className="text-xl font-bold text-black dark:text-white mb-2">No ideas yet</h3>
              <p className="text-black/50 dark:text-white/50 mb-6">Be the first to share a startup idea!</p>
              <Link href="/add-idea" className="px-6 py-2.5 bg-black dark:bg-red-600 text-white font-bold text-sm hover:bg-black/80 dark:hover:bg-red-700 transition-colors">
                Share an Idea
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/10 dark:bg-white/10">
              {ideas.map((idea) => (
                <IdeaCard key={idea._id} idea={idea} />
              ))}
            </div>
          )}

          {ideas.length > 0 && (
            <div className="text-center mt-12 sm:hidden">
              <Link href="/ideas" className="text-sm font-bold text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors">
                View all ideas →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 bg-black dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <p className="text-red-500 font-bold text-xs uppercase tracking-widest mb-2">Simple Process</p>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-none">
              How It Works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
            {steps.map((step, i) => (
              <div key={i} className="bg-black p-8 relative group hover:bg-white/5 transition-colors">
                <div className="text-6xl font-black text-white/5 absolute top-4 right-6 select-none">
                  {step.step}
                </div>
                <div className="text-3xl mb-6">{step.icon}</div>
                <h3 className="text-lg font-black text-white mb-3">{step.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
                <div className="w-8 h-0.5 bg-red-600 mt-6"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-red-600 font-bold text-xs uppercase tracking-widest mb-2">Browse By Topic</p>
            <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white leading-none">
              Explore Categories
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-black/10 dark:bg-white/10">
            {categories.map((cat, i) => (
              <Link
                key={i}
                href={`/ideas?category=${cat.name}`}
                className="flex flex-col items-center gap-3 p-8 bg-white dark:bg-black hover:bg-black dark:hover:bg-white group transition-colors"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-sm font-bold text-black dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors">
                  {cat.name}
                </span>
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
    Tech: 'text-blue-600 dark:text-blue-400',
    Health: 'text-green-600 dark:text-green-400',
    AI: 'text-purple-600 dark:text-purple-400',
    Education: 'text-yellow-600 dark:text-yellow-400',
    Finance: 'text-emerald-600 dark:text-emerald-400',
    Environment: 'text-teal-600 dark:text-teal-400',
  };

  const colorClass = categoryColors[idea.category] || 'text-black/50 dark:text-white/50';

  return (
    <div className="bg-white dark:bg-black p-6 flex flex-col group hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
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

      <div className="flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10">
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
        <Link
          href={`/ideas/${idea._id}`}
          className="text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 transition-colors"
        >
          View →
        </Link>
      </div>
    </div>
  );
}