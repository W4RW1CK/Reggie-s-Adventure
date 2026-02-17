'use client';

import { PrivyProvider } from '@privy-io/react-auth';

interface PrivyProviderWrapperProps {
  children: React.ReactNode;
}

export function PrivyProviderWrapper({ children }: PrivyProviderWrapperProps) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  // Skip Privy if no App ID configured (build time / dev without keys)
  if (!appId) {
    return <>{children}</>;
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethods: ['google', 'email', 'passkey', 'github', 'discord'],
        appearance: {
          theme: 'dark',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
