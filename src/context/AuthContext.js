'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('ideavault_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save user to localStorage whenever it changes
  const saveUser = (userData) => {
    if (userData) {
      localStorage.setItem('ideavault_user', JSON.stringify(userData));
      localStorage.setItem('ideavault_token', userData.token || '');
    } else {
      localStorage.removeItem('ideavault_user');
      localStorage.removeItem('ideavault_token');
    }
    setUser(userData);
  };

  // Register with email/password
  const registerWithEmail = async (name, email, photoURL, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, photoURL, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      saveUser(data.user);
      toast.success('Registration successful!');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login with email/password
  const loginWithEmail = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      saveUser(data.user);
      toast.success('Login successful!');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Google Login (placeholder — will wire up with Better Auth)
  const loginWithGoogle = async () => {
    try {
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
    } catch (error) {
      toast.error('Google login failed');
      throw error;
    }
  };

  // Update profile
  const updateProfile = async (updatedData) => {
    try {
      const token = localStorage.getItem('ideavault_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      saveUser({ ...user, ...updatedData, token });
      toast.success('Profile updated!');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Logout
  const logout = () => {
    saveUser(null);
    toast.success('Logged out successfully!');
    router.push('/');
  };

  const value = {
    user,
    loading,
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    updateProfile,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };