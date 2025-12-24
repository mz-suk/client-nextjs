export const ERROR_TYPES = {
  API: 'API_ERROR',
  NETWORK: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  SERVER: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
} as const;

export type ErrorType = (typeof ERROR_TYPES)[keyof typeof ERROR_TYPES];

export class ApiError extends Error {
  constructor(
    public status: number,
    public override message: string,
    public code?: string,
    public data?: unknown,
    public type: ErrorType = ERROR_TYPES.API
  ) {
    super(message);
    this.name = 'ApiError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  static isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
  }

  isNetworkError(): boolean {
    return this.type === ERROR_TYPES.NETWORK || this.type === ERROR_TYPES.TIMEOUT;
  }

  isServerError(): boolean {
    return this.type === ERROR_TYPES.SERVER || this.status >= 500;
  }

  isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  isAuthError(): boolean {
    return this.status === 401 || this.status === 403;
  }
}
