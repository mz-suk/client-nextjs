'use client';

import { CACHE_CONFIG } from '@core/config';
import { logger } from '@core/lib';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';

// 전역 에러 핸들링 설정
const onError = (error: Error) => {
  logger.error('Global Query Error:', error.message);
  // 추후 토스트 메시지 등을 여기에 추가
};

const queryClientConfig = {
  queryCache: new QueryCache({
    onError,
  }),
  mutationCache: new MutationCache({
    onError,
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
};

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(() => new QueryClient(queryClientConfig));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
