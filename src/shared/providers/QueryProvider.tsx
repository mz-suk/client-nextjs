'use client';

import { CACHE_CONFIG, isDebug } from '@core/config';
import { logger } from '@core/lib';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { type ReactNode, useMemo } from 'react';

import { GlobalLoading } from '../ui/GlobalLoading';
import { GlobalErrorHandler } from './GlobalErrorHandler';

interface QueryProviderProps {
  children: ReactNode;
  onError?: (error: Error) => void;
  enableDevtools?: boolean;
  enableGlobalLoading?: boolean;
  enableGlobalErrorHandler?: boolean;
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
      // 에러를 throw하지 않고 상태로 관리 (GlobalErrorHandler에서 처리)
      throwOnError: false,
    },
    mutations: {
      retry: 0,
      throwOnError: false,
    },
  },
});

export function QueryProvider({
  children,
  onError,
  enableDevtools = isDebug,
  enableGlobalLoading = true,
  enableGlobalErrorHandler = true,
}: QueryProviderProps) {
  const queryClient = useMemo(() => new QueryClient(createQueryClientConfig(onError)), [onError]);

  return (
    <QueryClientProvider client={queryClient}>
      {enableGlobalErrorHandler ? (
        <GlobalErrorHandler>
          {children}
          {enableGlobalLoading && <GlobalLoading />}
          {enableDevtools && <ReactQueryDevtools initialIsOpen={false} />}
        </GlobalErrorHandler>
      ) : (
        <>
          {children}
          {enableGlobalLoading && <GlobalLoading />}
          {enableDevtools && <ReactQueryDevtools initialIsOpen={false} />}
        </>
      )}
    </QueryClientProvider>
  );
}
