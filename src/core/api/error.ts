export const ERROR_TYPES = {
  API: 'API_ERROR',
  NETWORK: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  SERVER: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
} as const;

export type ErrorType = (typeof ERROR_TYPES)[keyof typeof ERROR_TYPES];

/**
 * API 에러 클래스
 * HTTP 응답 에러를 구조화하여 관리
 */
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

  /**
   * 네트워크 관련 에러인지 확인
   * - NETWORK_ERROR: 네트워크 연결 실패
   * - TIMEOUT_ERROR: 요청 시간 초과
   */
  isNetworkError(): boolean {
    return this.type === ERROR_TYPES.NETWORK || this.type === ERROR_TYPES.TIMEOUT;
  }

  /**
   * 서버 에러인지 확인 (5xx)
   */
  isServerError(): boolean {
    return this.type === ERROR_TYPES.SERVER || this.status >= 500;
  }

  /**
   * 클라이언트 에러인지 확인 (4xx)
   */
  isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  /**
   * 인증/인가 에러인지 확인 (401, 403)
   */
  isAuthError(): boolean {
    return this.status === 401 || this.status === 403;
  }

  /**
   * 전역으로 처리해야 하는 에러인지 확인
   * - 401: 인증 실패 (client.ts에서 자동 처리)
   * - 403: 권한 없음 (전역 처리)
   * - 5xx: 서버 에러 (전역 처리)
   * - 네트워크/타임아웃 에러 (전역 처리)
   */
  shouldHandleGlobally(): boolean {
    return (
      this.status === 403 || // 권한 없음
      this.isServerError() || // 서버 에러
      this.isNetworkError() // 네트워크/타임아웃
    );
    // 401은 client.ts에서 자동으로 토큰 갱신 처리
  }

  /**
   * 로컬에서 처리해야 하는 에러인지 확인
   * - 400: Bad Request
   * - 404: Not Found (API 리소스)
   * - 422: Validation Error
   * - 기타 4xx 에러
   */
  shouldHandleLocally(): boolean {
    return this.isClientError() && this.status !== 401 && this.status !== 403;
  }

  /**
   * 사용자 친화적인 에러 메시지 생성
   */
  getUserFriendlyMessage(): string {
    if (this.isNetworkError()) {
      return '네트워크 연결을 확인해주세요.';
    }

    if (this.type === ERROR_TYPES.TIMEOUT) {
      return '요청 시간이 초과되었습니다. 다시 시도해주세요.';
    }

    if (this.isServerError()) {
      return '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }

    if (this.status === 403) {
      return '접근 권한이 없습니다.';
    }

    // 기본적으로 서버에서 제공한 메시지 사용
    return this.message || '요청을 처리할 수 없습니다.';
  }
}
