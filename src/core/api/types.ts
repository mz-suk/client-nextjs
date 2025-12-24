/**
 * 표준 API 응답 인터페이스
 * 아직 API 명세가 확정되지 않았으므로 가장 범용적인 구조로 정의
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  code?: string; // 서비스 내부 에러 코드 등
}

/**
 * 에러 응답 인터페이스
 */
export interface ApiErrorResponse {
  message: string;
  code?: string;
  status: number;
}
