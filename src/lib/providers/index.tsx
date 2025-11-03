'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './query-client';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthGuard } from '@/components/AuthGuard';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthGuard>{children}</AuthGuard>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
