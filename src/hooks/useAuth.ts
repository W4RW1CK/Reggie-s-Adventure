'use client';

import { usePrivy } from '@privy-io/react-auth';

export interface AuthState {
  isLoggedIn: boolean;
  privyUserId: string | null;
  login: () => void;
  logout: () => void;
  isReady: boolean;
  user: {
    email?: string;
    name?: string;
  } | null;
}

export function useAuth(): AuthState {
  const { 
    ready, 
    authenticated, 
    user,
    login: privyLogin, 
    logout: privyLogout 
  } = usePrivy();

  // Graceful fallback when Privy is not configured
  const isPrivyConfigured = Boolean(process.env.NEXT_PUBLIC_PRIVY_APP_ID);
  
  if (!isPrivyConfigured) {
    return {
      isLoggedIn: false,
      privyUserId: null,
      login: () => {},
      logout: () => {},
      isReady: true,
      user: null,
    };
  }

  return {
    isLoggedIn: ready && authenticated,
    privyUserId: user?.id || null,
    login: privyLogin,
    logout: privyLogout,
    isReady: ready,
    user: user ? {
      email: user.email?.address,
      name: user.google?.name || user.github?.name || undefined,
    } : null,
  };
}