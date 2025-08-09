'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { NotificationProvider } from '@/contexts/NotificationContext';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  }));
  
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </QueryClientProvider>
  );
}