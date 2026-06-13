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
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">

      {/* ── Banner ── */}
      <section className="bg-white dark:bg-black relative overflow-hidden min-h-[560px] flex items-center border-b border-black/10 dark:border-white/10 transition-colors duration-300">
        {/* Red accent line */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-red-600"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-3xl">
            <div className="text-6xl mb-6">{slides[current].emoji}</div>
            <h1 className="text-5xl md:text-7xl font-black text-black dark:text-white leading-none tracking-tight mb-6 transition-colors">
              {slides[current].title}
            </h1>
            <p className="text-lg text-black/60 dark:text-white/60 max-w-xl mb-10 leading-relaxed transition-colors">
              {slides[current].subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/ideas"
                className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider text-sm text-center transition-colors shadow-lg shadow-red-600/20"
              >
                Explore Ideas →
              </Link>
              <Link
                href="/add-idea"
                className="px-8 py-4 border-2 border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white text-black dark:text-white font-black uppercase tracking-wider text-sm text-center transition-colors"
              >
                Share Your Idea
              </Link>
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-4 sm:left-8 lg:left-16 flex gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1 transition-all duration-300 ${i === current ? 'w-10 bg-red-600' : 'w-4 bg-black/20 dark:bg-white/20 hover:bg-black/40 dark:hover:bg-white/40'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Slide number */}
        <div className="absolute bottom-6 right-8 text-black/20 dark:text-white/20 font-black text-sm tracking-widest transition-colors">
          0{current + 1} / 0{slides.length}
        </div>
      </section>

      {/* ── Trending Ideas ── */}
      <section className="py-24 bg-white dark:bg-black transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-red-600 font-black text-xs uppercase tracking-widest mb-3">Community Picks</p>
              <h2 className="text-3xl md:text-5xl font-black text-black dark:text-white leading-none tracking-tight">
                Trending Ideas
              </h2>
            </div>
            {ideas.length > 0 && (
              <Link href="/ideas" className="text-sm font-black uppercase tracking-wider text-black/40 dark:text-white/40 hover:text-red-600 dark:hover:text-red-600 transition-colors hidden sm:block">
                View all →
              </Link>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-black p-8 animate-pulse">
                  <div className="h-3 bg-black/10 dark:bg-white/10 w-1/4 mb-5"></div>
                  <div className="h-6 bg-black/10 dark:bg-white/10 w-3/4 mb-4"></div>
                  <div className="h-4 bg-black/10 dark:bg-white/10 w-full mb-2"></div>
                  <div className="h-4 bg-black/10 dark:bg-white/10 w-2/3"></div>
                </div>
              ))}
            </div>
          ) : ideas.length === 0 ? (
            <div className="text-center py-32 border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
              <div className="text-6xl mb-6">💡</div>
              <h3 className="text-2xl font-black text-black dark:text-white mb-3 tracking-tight">No ideas yet</h3>
              <p className="text-black/50 dark:text-white/50 mb-8 font-medium">Be the first to share a startup idea with the world!</p>
              <Link href="/add-idea" className="px-8 py-4 bg-red-600 text-white font-black uppercase tracking-wider text-sm hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20">
                Share an Idea
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10">
              {ideas.map((idea) => (
                <IdeaCard key={idea._id} idea={idea} />
              ))}
            </div>
          )}

          {ideas.length > 0 && (
            <div className="text-center mt-12 sm:hidden">
              <Link href="/ideas" className="text-sm font-black uppercase tracking-wider text-black/50 dark:text-white/50 hover:text-red-600 dark:hover:text-red-600 transition-colors">
                View all ideas →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 bg-white dark:bg-black border-y border-black/10 dark:border-white/10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <p className="text-red-600 font-black text-xs uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-3xl md:text-5xl font-black text-black dark:text-white leading-none tracking-tight">
              How It Works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10">
            {steps.map((step, i) => (
              <div key={i} className="bg-white dark:bg-black p-10 relative group hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors overflow-hidden">
                <div className="text-8xl font-black text-black/[0.03] dark:text-white/[0.03] absolute -top-4 -right-2 select-none group-hover:text-black/[0.05] dark:group-hover:text-white/[0.05] transition-colors">
                  {step.step}
                </div>
                <div className="text-4xl mb-8 relative z-10">{step.icon}</div>
                <h3 className="text-xl font-black text-black dark:text-white mb-4 relative z-10 tracking-tight">{step.title}</h3>
                <p className="text-black/60 dark:text-white/60 text-sm leading-relaxed relative z-10 font-medium">{step.desc}</p>
                <div className="w-10 h-1 bg-red-600 mt-8 relative z-10 transform origin-left transition-transform group-hover:scale-x-150"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-24 bg-white dark:bg-black transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-red-600 font-black text-xs uppercase tracking-widest mb-3">Browse By Topic</p>
            <h2 className="text-3xl md:text-5xl font-black text-black dark:text-white leading-none tracking-tight">
              Explore Categories
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10">
            {categories.map((cat, i) => (
              <Link
                key={i}
                href={`/ideas?category=${cat.name}`}
                className="flex flex-col items-center justify-center gap-4 py-12 px-4 bg-white dark:bg-black hover:bg-black dark:hover:bg-white group transition-colors"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
                <span className="text-sm font-black uppercase tracking-wider text-black dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors">
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
  return (
    <div className="bg-white dark:bg-black p-8 flex flex-col group hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors h-full">
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-black uppercase tracking-widest text-red-600 dark:text-red-500">
          {idea.category}
        </span>
        <span className="text-xs font-bold text-black/30 dark:text-white/30 tracking-wide">
          {new Date(idea.createdAt).toLocaleDateString()}
        </span>
      </div>

      <h3 className="text-lg font-black text-black dark:text-white mb-3 line-clamp-2 leading-snug tracking-tight group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
        {idea.title}
      </h3>

      <p className="text-black/60 dark:text-white/60 text-sm line-clamp-3 flex-1 mb-8 leading-relaxed font-medium">
        {idea.shortDescription}
      </p>

      <div className="flex items-center justify-between pt-5 border-t border-black/10 dark:border-white/10 mt-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black dark:bg-white flex items-center justify-center rounded-sm">
            <span className="text-white dark:text-black text-xs font-black uppercase">
              {idea.authorName?.charAt(0) || '?'}
            </span>
          </div>
          <span className="text-xs font-black text-black/70 dark:text-white/70 truncate max-w-[100px] tracking-wide">
            {idea.authorName}
          </span>
        </div>
        <Link
          href={`/ideas/${idea._id}`}
          className="text-xs font-black uppercase tracking-wider text-black dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors flex items-center gap-1"
        >
          View <span className="text-red-600">→</span>
        </Link>
      </div>
    </div>
  );
}