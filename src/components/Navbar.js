'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, [user, loading]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/ideas', label: 'Ideas' },
    { href: '/add-idea', label: 'Add Idea', private: true },
    { href: '/my-ideas', label: 'My Ideas', private: true },
    { href: '/my-interactions', label: 'My Interactions', private: true },
  ];

  const isActive = (href) => pathname === href;

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    router.push('/');
  };

  // Show loading state
  if (loading) {
    return (
      <nav className="sticky top-0 z-50 bg-white dark:bg-black border-b border-black/10 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-black dark:bg-red-600 flex items-center justify-center">
                <span className="text-white font-black text-xs">IV</span>
              </div>
              <span className="font-black text-lg tracking-tight text-black dark:text-white">
                Idea<span className="text-red-600 dark:text-red-500">Vault</span>
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-black border-b border-black/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-black dark:bg-red-600 flex items-center justify-center">
              <span className="text-white font-black text-xs">IV</span>
            </div>
            <span className="font-black text-lg tracking-tight text-black dark:text-white">
              Idea<span className="text-red-600 dark:text-red-500">Vault</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, private: isPrivate }) => {
              if (isPrivate && !user) return null;
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-1.5 text-sm font-semibold transition-colors ${
                    active
                      ? 'text-black dark:text-white border-b-2 border-black dark:border-red-500'
                      : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M18.364 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            )}

            {/* Auth */}
            {!user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-sm font-semibold text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-1.5 text-sm font-bold bg-black dark:bg-red-600 text-white hover:bg-black/80 dark:hover:bg-red-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-8 h-8 rounded-full border-2 border-black/20 dark:border-white/20 overflow-hidden hover:border-black dark:hover:border-red-500 transition-all flex items-center justify-center bg-black dark:bg-red-600"
                  title={user.name || 'User'}
                >
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-white text-sm font-bold">
                      {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  )}
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-lg shadow-xl z-50">
                      <div className="px-4 py-3 border-b border-black/10 dark:border-white/10">
                        <p className="text-sm font-bold text-black dark:text-white truncate">{user.name || 'User'}</p>
                        <p className="text-xs text-black/50 dark:text-white/50 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2.5 text-sm font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        >
                          Profile Management
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-black/10 dark:border-white/10 bg-white dark:bg-black">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(({ href, label, private: isPrivate }) => {
              if (isPrivate && !user) return null;
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-3 py-2.5 text-sm font-semibold transition-colors ${
                    active
                      ? 'text-black dark:text-white bg-black/5 dark:bg-white/5'
                      : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            {!user ? (
              <div className="flex gap-2 pt-3 border-t border-black/10 dark:border-white/10 mt-2">
                <Link href="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2 text-sm font-semibold border border-black/20 dark:border-white/20 text-black dark:text-white">Login</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2 text-sm font-bold bg-black dark:bg-red-600 text-white">Register</Link>
              </div>
            ) : (
              <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 text-sm font-semibold text-red-600 mt-2 border-t border-black/10 dark:border-white/10">
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}