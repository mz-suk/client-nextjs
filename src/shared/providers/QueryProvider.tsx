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

export const QueryProvider = ({ children, enableDevtools = isDebug, enableGlobalLoading = true, enableGlobalErrorHandler = true }: QueryProviderProps) => {
  const [queryClient] = useState(getBrowserQueryClient);

  const content = (
    <>
      {children}
      {enableGlobalLoading && <GlobalLoading />}
      {enableDevtools && <ReactQueryDevtools initialIsOpen={false} />}
    </>
  );

  return (
    <QueryClientProvider client={queryClient}>{enableGlobalErrorHandler ? <GlobalErrorHandler>{content}</GlobalErrorHandler> : content}</QueryClientProvider>
  );
};
