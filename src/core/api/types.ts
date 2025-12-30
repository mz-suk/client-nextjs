// Next.js의 RequestInit 타입을 확장하여 강력한 타입 지원 제공
export interface NextFetchRequestConfig {
  revalidate?: number | false;
  tags?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  code?: string;
}

export interface FetchConfig extends Omit<RequestInit, 'next'> {
  params?: Record<string, unknown>;
  skipAuth?: boolean;
  /**
   * Next.js 확장 옵션 (캐싱, 태그 등)
   * Next.js 13+ App Router 전용
   */
  next?: NextFetchRequestConfig & Record<string, unknown>;
}

export type RequestInterceptor = (config: RequestInit) => RequestInit | Promise<RequestInit>;

export type ResponseInterceptor = (response: Response) => Response | Promise<Response>;
