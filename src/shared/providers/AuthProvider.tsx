'use client';

import { configureAuth } from '@core/api';
import { refreshTokens, useAuthStore } from '@domains/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * 인증 설정 Provider
 * - 앱 초기화 시 API Client에 인증 설정 주입
 * - 토큰 갱신, 로그아웃 처리 등
 */
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
          console.error('네트워크 연결을 확인해주세요');
        } else if (error.message === 'SERVER_ERROR') {
          console.error('서버에 문제가 발생했습니다');
        }
      },
    });
  }, [router]);

  return <>{children}</>;
}
