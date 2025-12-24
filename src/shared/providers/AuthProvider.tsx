'use client';

import { configureAuth } from '@core/api';
import { logger } from '@core/lib';
import { refreshTokens, useAuthStore } from '@domains/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
  onAuthFailure?: () => void;
  onError?: (error: Error) => void;
}

export function AuthProvider({ children, onAuthFailure, onError }: AuthProviderProps) {
  const router = useRouter();
  const isConfigured = useRef(false);

  useEffect(() => {
    if (isConfigured.current) return;

    configureAuth({
      store: useAuthStore,
      refreshTokens,
      onAuthFailure: () => {
        useAuthStore.getState().clearAuth();
        if (onAuthFailure) {
          onAuthFailure();
        } else {
          router.push('/login');
        }
      },
      onError: error => {
        if (onError) {
          onError(error);
          return;
        }

        if (error.message === 'NETWORK_ERROR') {
          logger.error('네트워크 연결 오류');
        } else if (error.message === 'SERVER_ERROR') {
          logger.error('서버 오류');
        }
      },
    });

    isConfigured.current = true;
  }, [router, onAuthFailure, onError]);

  return <>{children}</>;
}
