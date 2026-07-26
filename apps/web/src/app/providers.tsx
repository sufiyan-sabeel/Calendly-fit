'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { initConfig } from '@calendy/config';

initConfig('web');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 30_000, refetchOnWindowFocus: false },
    mutations: { retry: 1 },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="bottom-center" theme="dark" />
    </QueryClientProvider>
  );
}
