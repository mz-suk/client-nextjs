import type { AuthActions, AuthState } from '@core/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
    { name: 'auth-storage' }
  )
);
