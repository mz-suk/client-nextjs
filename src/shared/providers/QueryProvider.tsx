'use client';

import { CACHE_CONFIG, isDebug } from '@core/config';
import { logger } from '@core/lib';
import { isServer, MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { type ReactNode } from 'react';

import { GlobalLoading } from '../ui/GlobalLoading';
import { GlobalErrorHandler } from './GlobalErrorHandler';

interface QueryProviderProps {
  children: ReactNode;
  onError?: (error: Error) => void;
  enableDevtools?: boolean;
  enableGlobalLoading?: boolean;
  enableGlobalErrorHandler?: boolean;
}

function makeQueryClient(onError?: (error: Error) => void) {
  return new QueryClient({
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
        throwOnError: false, // GlobalErrorHandler에서 처리
      },
      mutations: {
        retry: 0,
        throwOnError: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient(onError?: (error: Error) => void) {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient(onError);
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient(onError);
    return browserQueryClient;
  }
}

export function QueryProvider({
  children,
  onError,
  enableDevtools = isDebug,
  enableGlobalLoading = true,
  enableGlobalErrorHandler = true,
}: QueryProviderProps) {
  const queryClient = getQueryClient(onError);

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
