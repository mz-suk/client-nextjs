import type { AuthActions, AuthState } from '@core/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 인증 스토어
 * - localStorage에 자동 저장
 * - 토큰 관리
 */
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    set => ({
      accessToken: null,
      refreshToken: null,
      setTokens: tokens =>
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        }),
      clearAuth: () =>
        set({
          accessToken: null,
          refreshToken: null,
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
