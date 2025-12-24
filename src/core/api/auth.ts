/**
 * API 인증 토큰
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * 인증 에러 코드
 */
export const AUTH_ERROR_CODES = {
  REFRESH_FAILED: 'REFRESH_FAILED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
} as const;

export type AuthErrorCode = (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];

/**
 * 인증 에러 클래스
 */
export class AuthError extends Error {
  constructor(
    public code: AuthErrorCode,
    message?: string
  ) {
    super(message || code);
    this.name = 'AuthError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthError);
    }
  }

  static isAuthError(error: unknown): error is AuthError {
    return error instanceof AuthError;
  }
}

/**
 * 인증 스토어 상태
 */
export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
}

/**
 * 인증 스토어 액션
 */
export interface AuthActions {
  setTokens: (tokens: AuthTokens) => void;
  clearAuth: () => void;
}

/**
 * 인증 스토어 (Zustand 호환)
 */
export interface AuthStore {
  getState: () => AuthState & AuthActions;
}

/**
 * 인증 설정 인터페이스
 */
interface AuthConfig {
  store: AuthStore;
  refreshTokens: (refreshToken: string) => Promise<AuthTokens>;
  onAuthFailure: () => void;
  onError?: (error: Error) => void;
}

let authConfig: AuthConfig | null = null;

/**
 * 인증 설정 초기화
 * @example
 * ```ts
 * configureAuth({
 *   store: useAuthStore,
 *   refreshTokens: async (token) => await refreshAPI(token),
 *   onAuthFailure: () => router.push('/login'),
 *   onError: (error) => toast.error(error.message)
 * });
 * ```
 */
export function configureAuth(config: AuthConfig): void {
  authConfig = config;
}

/**
 * 인증 설정 조회
 */
export function getAuthConfig(): AuthConfig | null {
  return authConfig;
}

/**
 * 인증 설정 초기화
 */
export function clearAuthConfig(): void {
  authConfig = null;
}
