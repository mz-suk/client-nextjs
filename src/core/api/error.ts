export class ApiError extends Error {
  constructor(
    public status: number,
    public override message: string,
    public code?: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';

    // 가급적 Error.captureStackTrace를 지원하는 환경(Node/V8)에서 스택 유지
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  static isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
  }
}
