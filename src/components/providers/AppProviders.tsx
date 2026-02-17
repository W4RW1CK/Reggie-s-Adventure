import { PrivyProviderWrapper } from './PrivyProviderWrapper';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <PrivyProviderWrapper>
      {children}
    </PrivyProviderWrapper>
  );
}