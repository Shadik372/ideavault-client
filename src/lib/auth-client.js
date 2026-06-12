import { createAuthClient } from 'better-auth/react';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const authClient = createAuthClient({
  baseURL: baseURL,
  fetchOptions: {
    credentials: 'include',
  },
});

export const { signIn, signOut, signUp, useSession } = authClient;