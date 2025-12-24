export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export const AUTH_ERROR_CODES = {
  REFRESH_FAILED: 'REFRESH_FAILED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
} as const;

export type AuthErrorCode = (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];

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

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
}

export interface AuthActions {
  setTokens: (tokens: AuthTokens) => void;
  clearAuth: () => void;
}

export interface AuthStore {
  getState: () => AuthState & AuthActions;
}

interface AuthConfig {
  store: AuthStore;
  refreshTokens: (refreshToken: string) => Promise<AuthTokens>;
  onAuthFailure: () => void;
  onError?: (error: Error) => void;
}

let authConfig: AuthConfig | null = null;

export const configureAuth = (config: AuthConfig): void => {
  authConfig = config;
};

export const getAuthConfig = (): AuthConfig | null => authConfig;
