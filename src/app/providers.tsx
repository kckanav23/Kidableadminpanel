import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PostHogProvider } from 'posthog-js/react';
import { Toaster } from '@/components/ui/sonner';
import { queryClient } from '@/lib/api/client';
import { AuthProvider } from '@/features/auth';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
      options={{
        api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
        defaults: '2025-05-24',
        capture_exceptions: true,
        debug: import.meta.env.MODE === 'production',
      }}
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
        {import.meta.env.MODE === 'development' ? <ReactQueryDevtools initialIsOpen={false} /> : null}
      </QueryClientProvider>
    </PostHogProvider>
  );
}


