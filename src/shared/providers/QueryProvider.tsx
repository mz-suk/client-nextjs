'use client';

import { CACHE_CONFIG, isDebug } from '@core/config';
import { logger } from '@core/lib';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { type ReactNode, useMemo } from 'react';

interface QueryProviderProps {
  children: ReactNode;
  onError?: (error: Error) => void;
  enableDevtools?: boolean;
}

const createQueryClientConfig = (onError?: (error: Error) => void) => ({
  queryCache: new QueryCache({
    onError: onError ?? (error => logger.error('Query Error:', error.message)),
  }),
  mutationCache: new MutationCache({
    onError: onError ?? (error => logger.error('Mutation Error:', error.message)),
  }),
  defaultOptions: {
    queries: {
      staleTime: CACHE_CONFIG.QUERY_STALE_TIME,
      gcTime: CACHE_CONFIG.QUERY_GC_TIME,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 2,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 0,
    },
  },
});

export function QueryProvider({ children, onError, enableDevtools = isDebug }: QueryProviderProps) {
  const queryClient = useMemo(() => new QueryClient(createQueryClientConfig(onError)), [onError]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {enableDevtools && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
