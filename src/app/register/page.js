'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    photoURL: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { registerWithEmail, loginWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    document.title = 'Register | IdeaVault';
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Minimum 6 characters';
    if (!/[A-Z]/.test(formData.password)) newErrors.password = 'Must include an uppercase letter';
    if (!/[a-z]/.test(formData.password)) newErrors.password = 'Must include a lowercase letter';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);
    try {
      await registerWithEmail(formData.name, formData.email, formData.photoURL, formData.password);
      router.push('/');
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {}
  };

  const getPasswordStrength = () => {
    const p = formData.password;
    if (!p) return null;
    let score = 0;
    if (p.length >= 6) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[a-z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 2) return { label: 'Weak', color: 'bg-red-500', text: 'text-red-500', width: 'w-1/3' };
    if (score <= 3) return { label: 'Fair', color: 'bg-yellow-500', text: 'text-yellow-500', width: 'w-2/3' };
    return { label: 'Strong', color: 'bg-green-500', text: 'text-green-500', width: 'w-full' };
  };

  const strength = getPasswordStrength();

  const inputClass = (field) =>
    `w-full px-4 py-3 border ${errors[field] ? 'border-red-500' : 'border-black/20 dark:border-white/20'} bg-white dark:bg-black text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-black dark:focus:border-white text-sm transition-colors`;

  return (
    <div className="min-h-screen bg-white dark:bg-black flex">

      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-black p-12">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-red-600 flex items-center justify-center">
            <span className="text-white font-black text-xs">IV</span>
          </div>
          <span className="font-black text-xl text-white tracking-tight">
            Idea<span className="text-red-500">Vault</span>
          </span>
        </div>
        <div>
          <div className="w-8 h-0.5 bg-red-600 mb-6"></div>
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            Share your next big idea
          </h2>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs">
            Join thousands of innovators sharing and validating startup ideas with a supportive community.
          </p>
          <div className="mt-8 space-y-3">
            {['Share startup ideas', 'Get community feedback', 'Validate your concepts'].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-1 h-1 bg-red-600"></div>
                <span className="text-white/50 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/20 text-xs">© {new Date().getFullYear()} IdeaVault</p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-sm">

          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-7 h-7 bg-black dark:bg-red-600 flex items-center justify-center">
              <span className="text-white font-black text-xs">IV</span>
            </div>
            <span className="font-black text-xl text-black dark:text-white tracking-tight">
              Idea<span className="text-red-600 dark:text-red-500">Vault</span>
            </span>
          </div>

          <h1 className="text-2xl font-black text-black dark:text-white mb-1">Create account</h1>
          <p className="text-black/50 dark:text-white/50 text-sm mb-8">Join IdeaVault and share your ideas</p>

          {/* Google */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-black/20 dark:border-white/20 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors mb-6 text-sm font-semibold"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-black/10 dark:bg-white/10"></div>
            <span className="text-xs text-black/30 dark:text-white/30 font-medium">or</span>
            <div className="flex-1 h-px bg-black/10 dark:bg-white/10"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-black/60 dark:text-white/60 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={inputClass('name')}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-black/60 dark:text-white/60 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={inputClass('email')}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Photo URL */}
            <div>
              <label className="block text-xs font-bold text-black/60 dark:text-white/60 uppercase tracking-wider mb-2">
                Photo URL <span className="text-black/30 dark:text-white/30 normal-case font-normal">(optional)</span>
              </label>
              <input
                type="url"
                name="photoURL"
                value={formData.photoURL}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className={inputClass('photoURL')}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-black/60 dark:text-white/60 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`${inputClass('password')} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Password Strength */}
              {formData.password && strength && (
                <div className="mt-2">
                  <div className="h-0.5 w-full bg-black/10 dark:bg-white/10 overflow-hidden">
                    <div className={`h-full transition-all ${strength.color} ${strength.width}`}></div>
                  </div>
                  <p className={`text-xs mt-1 font-semibold ${strength.text}`}>{strength.label}</p>
                </div>
              )}
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}

              {/* Password Rules */}
              <ul className="mt-2 space-y-1">
                {[
                  { check: formData.password.length >= 6, label: 'At least 6 characters' },
                  { check: /[A-Z]/.test(formData.password), label: 'One uppercase letter' },
                  { check: /[a-z]/.test(formData.password), label: 'One lowercase letter' },
                ].map(({ check, label }) => (
                  <li key={label} className={`text-xs flex items-center gap-1.5 transition-colors ${check ? 'text-green-500' : 'text-black/30 dark:text-white/30'}`}>
                    <span>{check ? '✓' : '○'}</span>
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-black/60 dark:text-white/60 uppercase tracking-wider mb-2">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={inputClass('confirmPassword')}
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-black dark:bg-red-600 text-white font-bold text-sm hover:bg-black/80 dark:hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 12 0 12h4z" />
                  </svg>
                  Creating account...
                </span>
              ) : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-black/50 dark:text-white/50 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-red-600 hover:text-red-700 font-bold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}