'use client';

import { configureAuth } from '@core/api';
import { logger } from '@core/lib';
import { refreshTokens, useAuthStore } from '@domains/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    configureAuth({
      store: useAuthStore,
      refreshTokens,
      onAuthFailure: () => {
        useAuthStore.getState().clearAuth();
        router.push('/login');
      },
      onError: error => {
        if (error.message === 'NETWORK_ERROR') {
          logger.error('네트워크 연결 오류');
        } else if (error.message === 'SERVER_ERROR') {
          logger.error('서버 오류');
        }
      },
    });
  }, [router]);

  return <>{children}</>;
}
