'use client';

import { createContext } from 'react';
import { signIn, signOut, signUp, useSession } from '@/lib/auth-client';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { data: session, isPending: loading } = useSession();

  const user = session?.user ? {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    photoURL: session.user.image,
  } : null;

  const getToken = async () => {
    try {
      return localStorage.getItem('ideavault_jwt') || null;
    } catch {
      return null;
    }
  };

  const generateJWT = async (email, name) => {
    try {
      const res = await fetch('http://localhost:5000/api/jwt/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (data.token) localStorage.setItem('ideavault_jwt', data.token);
      return data.token;
    } catch (error) {
      console.error('Failed to generate JWT:', error);
      return null;
    }
  };

  const registerWithEmail = async (name, email, photoURL, password) => {
    try {
      const result = await signUp.email({ name, email, password, image: photoURL || '' });
      if (result.error) throw new Error(result.error.message);
      await generateJWT(email, name);
      toast.success('Registration successful!');
      return result;
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const loginWithEmail = async (email, password) => {
    try {
      const result = await signIn.email({ email, password });
      if (result.error) throw new Error(result.error.message);
      await generateJWT(email, result.data?.user?.name || '');
      toast.success('Login successful!');
      return result;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signIn.social({ provider: 'google', callbackURL: '/' });
    } catch (error) {
      toast.error('Google login failed');
      throw error;
    }
  };

  const logout = async () => {
    await signOut();
    localStorage.removeItem('ideavault_jwt');
    toast.success('Logged out successfully!');
  };

  return (
    <AuthContext.Provider value={{ user, loading, getToken, registerWithEmail, loginWithEmail, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };