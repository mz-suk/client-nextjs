'use client';

import { isDebug } from '@core/config';
import { getBrowserQueryClient } from '@core/lib';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { type ReactNode, useState } from 'react';

import { GlobalLoading } from '../ui/GlobalLoading';
import { GlobalErrorHandler } from './GlobalErrorHandler';

interface QueryProviderProps {
  children: ReactNode;
  enableDevtools?: boolean;
  enableGlobalLoading?: boolean;
  enableGlobalErrorHandler?: boolean;
}

/**
 * Query Provider
 */
export function QueryProvider({ children, enableDevtools = isDebug, enableGlobalLoading = true, enableGlobalErrorHandler = true }: QueryProviderProps) {
  // useState로 QueryClient를 한 번만 생성 (클라이언트 싱글톤)
  const [queryClient] = useState(() => getBrowserQueryClient());

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
