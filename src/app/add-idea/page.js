'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

const CATEGORIES = ['Tech', 'Health', 'AI', 'Education', 'Finance', 'Environment', 'Other'];

const inputClass = 'w-full px-4 py-3 border border-black/20 dark:border-white/20 bg-white dark:bg-black text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-black dark:focus:border-white text-sm transition-colors';
const labelClass = 'block text-xs font-bold text-black/60 dark:text-white/60 uppercase tracking-wider mb-2';

export default function AddIdeaPage() {
  const { user, getToken } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState(false);
  const [tagInputValue, setTagInputValue] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    detailedDescription: '',
    category: '',
    tags: [],
    imageURL: '',
    estimatedBudget: '',
    targetAudience: '',
    problemStatement: '',
    proposedSolution: '',
  });

  useEffect(() => {
    document.title = 'Share an Idea | IdeaVault';
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    const tag = tagInputValue.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInputValue('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit an idea');
      router.push('/login');
      return;
    }
    if (!formData.title || !formData.shortDescription || !formData.category || !formData.problemStatement || !formData.proposedSolution || !formData.targetAudience) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsLoading(true);
    try {
      const token = await getToken();
      const ideaData = {
        ...formData,
        authorEmail: user.email,
        authorName: user.name,
        authorPhoto: user.photoURL || '',
      };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ideas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(ideaData),
      });
      if (!res.ok) throw new Error('Failed to submit idea');
      toast.success('Idea submitted successfully!');
      router.push('/my-ideas');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          <p className="text-red-600 font-bold text-xs uppercase tracking-widest mb-2">New Submission</p>
          <h1 className="text-3xl font-black text-black dark:text-white leading-none">Share Your Idea</h1>
          <p className="text-black/50 dark:text-white/50 mt-2 text-sm">
            Fill in the details below to submit your startup idea to the community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Basic Info */}
          <div className="border border-black/10 dark:border-white/10 p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-black/10 dark:border-white/10">
              <div className="w-1 h-5 bg-red-600"></div>
              <h2 className="text-sm font-black text-black dark:text-white uppercase tracking-wider">
                Basic Information
              </h2>
            </div>

            <div>
              <label className={labelClass}>Idea Title <span className="text-red-500 normal-case">*</span></label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. AI-powered personal finance tracker"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Short Description <span className="text-red-500 normal-case">*</span></label>
              <input
                type="text"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                placeholder="One sentence summary of your idea"
                maxLength={150}
                className={inputClass}
              />
              <p className="text-xs text-black/30 dark:text-white/30 mt-1 text-right">{formData.shortDescription.length}/150</p>
            </div>

            <div>
              <label className={labelClass}>Detailed Description <span className="text-black/30 dark:text-white/30 normal-case font-normal">(optional)</span></label>
              <textarea
                name="detailedDescription"
                value={formData.detailedDescription}
                onChange={handleChange}
                placeholder="Describe your idea in detail..."
                rows={4}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label className={labelClass}>Category <span className="text-red-500 normal-case">*</span></label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Tags <span className="text-black/30 dark:text-white/30 normal-case font-normal">(optional, max 5)</span></label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInputValue}
                  onChange={(e) => setTagInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag(e)}
                  placeholder="Add a tag and press Enter"
                  className={inputClass}
                />
                <button
                  onClick={handleAddTag}
                  type="button"
                  className="px-4 py-3 bg-black dark:bg-white text-white dark:text-black font-bold text-sm hover:bg-black/80 dark:hover:bg-white/80 transition-colors"
                >
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-black/5 dark:bg-white/5 text-black dark:text-white text-xs font-semibold">
                      #{tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-500 ml-1 font-bold">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className={labelClass}>Image URL <span className="text-black/30 dark:text-white/30 normal-case font-normal">(optional)</span></label>
              <input
                type="url"
                name="imageURL"
                value={formData.imageURL}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className={inputClass}
              />
              {formData.imageURL && (
                <img src={formData.imageURL} alt="Preview" className="mt-3 h-32 w-full object-cover" onError={(e) => e.target.style.display = 'none'} />
              )}
            </div>

            <div>
              <label className={labelClass}>Estimated Budget <span className="text-black/30 dark:text-white/30 normal-case font-normal">(optional)</span></label>
              <input
                type="text"
                name="estimatedBudget"
                value={formData.estimatedBudget}
                onChange={handleChange}
                placeholder="e.g. $10,000 - $50,000"
                className={inputClass}
              />
            </div>
          </div>

          {/* Problem & Solution */}
          <div className="border border-black/10 dark:border-white/10 p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-black/10 dark:border-white/10">
              <div className="w-1 h-5 bg-red-600"></div>
              <h2 className="text-sm font-black text-black dark:text-white uppercase tracking-wider">
                Problem & Solution
              </h2>
            </div>

            <div>
              <label className={labelClass}>Target Audience <span className="text-red-500 normal-case">*</span></label>
              <input
                type="text"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                placeholder="e.g. Small business owners, college students"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Problem Statement <span className="text-red-500 normal-case">*</span></label>
              <textarea
                name="problemStatement"
                value={formData.problemStatement}
                onChange={handleChange}
                placeholder="What problem does your idea solve?"
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label className={labelClass}>Proposed Solution <span className="text-red-500 normal-case">*</span></label>
              <textarea
                name="proposedSolution"
                value={formData.proposedSolution}
                onChange={handleChange}
                placeholder="How does your idea solve the problem?"
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-black dark:bg-red-600 text-white font-black text-sm hover:bg-black/80 dark:hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors uppercase tracking-wider"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 12 0 12h4z" />
                </svg>
                Submitting...
              </span>
            ) : 'Submit Idea →'}
          </button>
        </form>
      </div>
    </div>
  );
}