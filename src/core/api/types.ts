/**
 * 표준 API 응답 인터페이스
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  code?: string;
}

/**
 * 에러 응답 인터페이스
 */
export interface ApiErrorResponse {
  message: string;
  code?: string;
  status: number;
}

/**
 * Fetch 설정 인터페이스
 */
export interface FetchConfig extends RequestInit {
  baseURL?: string;
  timeout?: number;
  params?: Record<string, unknown>;
  skipAuth?: boolean; // 인증 헤더 제외
  skipRetry?: boolean; // 재시도 로직 제외
}

/**
 * 요청 인터셉터
 */
export type RequestInterceptor = (config: RequestInit) => RequestInit | Promise<RequestInit>;

/**
 * 응답 인터셉터
 */
export type ResponseInterceptor = (response: Response) => Response | Promise<Response>;

/**
 * 페이지네이션 응답
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
}

/**
 * 페이지네이션 파라미터
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}
