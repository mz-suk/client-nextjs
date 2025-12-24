export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  code?: string;
}

export interface FetchConfig extends RequestInit {
  params?: Record<string, unknown>;
  skipAuth?: boolean;
}

export type RequestInterceptor = (config: RequestInit) => RequestInit | Promise<RequestInit>;

export type ResponseInterceptor = (response: Response) => Response | Promise<Response>;
