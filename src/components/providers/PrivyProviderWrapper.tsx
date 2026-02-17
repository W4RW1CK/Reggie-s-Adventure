'use client';

import { PrivyProvider } from '@privy-io/react-auth';

interface PrivyProviderWrapperProps {
  children: React.ReactNode;
}

export function PrivyProviderWrapper({ children }: PrivyProviderWrapperProps) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || '';

  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethods: ['google', 'email', 'passkey'],
        appearance: {
          theme: 'dark', // Match NES aesthetic
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}