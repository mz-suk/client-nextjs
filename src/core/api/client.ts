import { API_CONFIG, isDev, SERVER_CONFIG } from '../config/constants';
import { logger } from '../lib';
import { AUTH_ERROR_CODES, AuthError, type AuthTokens, getAuthConfig } from './auth';
import { ApiError, ERROR_TYPES, type ErrorType } from './error';
import type { ApiResponse, FetchConfig, RequestInterceptor, ResponseInterceptor } from './types';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

/**
 * 토큰 갱신 Promise (동시 요청 방지)
 */
let refreshPromise: Promise<AuthTokens> | null = null;

/**
 * 재시도 중인 요청 추적 (무한 루프 방지)
 */
interface RetryState {
  _retry?: boolean;
}

const getBaseURL = () => {
  if (typeof window === 'undefined' && isDev && SERVER_CONFIG.API_TARGET_URL) {
    return SERVER_CONFIG.API_TARGET_URL;
  }
  return API_CONFIG.BASE_URL;
};

const getDefaultHeaders = (body?: unknown) => {
  const headers: Record<string, string> = {
    accept: '*/*',
  };

  // FormData는 브라우저가 자동으로 Content-Type 설정
  if (!(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (API_CONFIG.ACCEPT_LANGUAGE) {
    headers['Accept-Language'] = API_CONFIG.ACCEPT_LANGUAGE;
  }

  return headers;
};

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  constructor() {
    this.baseURL = getBaseURL();
    this.timeout = API_CONFIG.TIMEOUT;
  }

  /**
   * 요청 인터셉터 등록
   * @example
   * apiClient.addRequestInterceptor(async (config) => {
   *   config.headers = { ...config.headers, 'X-Custom': 'value' };
   *   return config;
   * });
   */
  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * 응답 인터셉터 등록
   * @example
   * apiClient.addResponseInterceptor(async (response) => {
   *   if (response.status === 404) console.warn('Not found');
   *   return response;
   * });
   */
  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * 요청 인터셉터 제거
   */
  removeRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors = this.requestInterceptors.filter(i => i !== interceptor);
  }

  /**
   * 응답 인터셉터 제거
   */
  removeResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors = this.responseInterceptors.filter(i => i !== interceptor);
  }

  private buildURL(endpoint: string, params?: Record<string, unknown>): string {
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const normalizedBase = this.baseURL.endsWith('/') ? this.baseURL : `${this.baseURL}/`;
    const url = new URL(normalizedEndpoint, normalizedBase);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return url.toString();
  }

  private async fetchWithTimeout(url: string, config: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async request<T>(endpoint: string, config: FetchConfig & RetryState = {}, retryCount = 0): Promise<T> {
    const { params, headers: customHeaders, skipAuth, skipRetry, _retry, ...fetchConfig } = config;
    const url = this.buildURL(endpoint, params);
    const defaultHeaders = getDefaultHeaders(fetchConfig.body);

    let finalConfig: RequestInit = {
      ...fetchConfig,
      headers: { ...defaultHeaders, ...customHeaders },
    };

    // 인증 헤더 주입 (skipAuth가 false일 때만)
    if (!skipAuth) {
      const authConfig = getAuthConfig();
      if (authConfig) {
        const { accessToken } = authConfig.store.getState();
        if (accessToken) {
          finalConfig.headers = {
            ...finalConfig.headers,
            Authorization: `Bearer ${accessToken}`,
          };
        }
      }
    }

    // 요청 인터셉터 실행
    for (const interceptor of this.requestInterceptors) {
      finalConfig = await interceptor(finalConfig);
    }

    logger.api(finalConfig.method?.toUpperCase() || 'GET', url, finalConfig.body);

    try {
      let response = await this.fetchWithTimeout(url, finalConfig);

      // 응답 인터셉터 실행
      for (const interceptor of this.responseInterceptors) {
        response = await interceptor(response);
      }

      // 401 Unauthorized - 토큰 갱신 시도
      if (response.status === 401 && !_retry && !skipAuth) {
        const authConfig = getAuthConfig();
        if (authConfig) {
          const { refreshToken } = authConfig.store.getState();

          // 리프레시 토큰이 있고, refresh API가 아닌 경우
          if (refreshToken && !endpoint.includes('/auth/refresh')) {
            try {
              // 동시 다발적 401 시 하나의 갱신 요청만 실행
              if (!refreshPromise) {
                refreshPromise = authConfig.refreshTokens(refreshToken).finally(() => {
                  refreshPromise = null;
                });
              }

              const tokens = await refreshPromise;
              authConfig.store.getState().setTokens(tokens);

              logger.info('토큰 갱신 성공, 요청 재시도');

              // 원본 요청 재시도
              return this.request<T>(endpoint, { ...config, _retry: true }, retryCount);
            } catch (refreshError) {
              logger.error('토큰 갱신 실패:', refreshError);
              authConfig.onAuthFailure();
              throw new AuthError(AUTH_ERROR_CODES.REFRESH_FAILED);
            }
          } else {
            authConfig.onAuthFailure();
            throw new AuthError(AUTH_ERROR_CODES.UNAUTHORIZED);
          }
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = (errorData as { message?: string })?.message || response.statusText;
        const code = (errorData as { code?: string })?.code;

        // 503, 500대 에러 재시도
        const shouldRetry = !skipRetry && (response.status === 503 || response.status >= 500) && retryCount < MAX_RETRIES;
        if (shouldRetry) {
          const delay = RETRY_DELAY * (retryCount + 1);
          logger.warn(`재시도 ${retryCount + 1}/${MAX_RETRIES} (${delay}ms 후)`, url);
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.request<T>(endpoint, config, retryCount + 1);
        }

        // 에러 타입 분류
        let errorType: ErrorType = ERROR_TYPES.API;
        if (response.status >= 500) {
          errorType = ERROR_TYPES.SERVER;
          const authConfig = getAuthConfig();
          if (authConfig?.onError) {
            authConfig.onError(new Error('SERVER_ERROR'));
          }
        }

        logger.error('API Error:', response.status, message);
        throw new ApiError(response.status, message, code, errorData, errorType);
      }

      const data = await response.json();
      logger.debug('Response data:', data);
      return data;
    } catch (error) {
      if (error instanceof ApiError || error instanceof AuthError) throw error;

      if (error instanceof Error) {
        const isTimeout = error.name === 'AbortError';
        const isNetworkError = error.message.includes('fetch') || error.message.includes('network');

        // 네트워크/타임아웃 에러 재시도
        if (!skipRetry && (isNetworkError || isTimeout) && retryCount < MAX_RETRIES) {
          const delay = RETRY_DELAY * (retryCount + 1);
          logger.warn(`재시도 ${retryCount + 1}/${MAX_RETRIES} (${delay}ms 후)`, url);
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.request<T>(endpoint, config, retryCount + 1);
        }

        // 네트워크 에러 핸들러 호출
        const authConfig = getAuthConfig();
        if (authConfig?.onError && (isNetworkError || isTimeout)) {
          authConfig.onError(new Error('NETWORK_ERROR'));
        }

        logger.error('Request Error:', error);
        const errorType = isTimeout ? ERROR_TYPES.TIMEOUT : ERROR_TYPES.NETWORK;
        throw new ApiError(0, error.message, undefined, undefined, errorType);
      }

      logger.error('Unknown Error:', error);
      throw new ApiError(0, 'Unknown error occurred', undefined, undefined, ERROR_TYPES.UNKNOWN);
    }
  }

  async get<T>(endpoint: string, config?: FetchConfig): Promise<ApiResponse<T>> {
    const data = await this.request<T>(endpoint, { ...config, method: 'GET' });
    return { data, success: true };
  }

  async post<T>(endpoint: string, body?: unknown, config?: FetchConfig): Promise<ApiResponse<T>> {
    const data = await this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    });
    return { data, success: true };
  }

  async put<T>(endpoint: string, body?: unknown, config?: FetchConfig): Promise<ApiResponse<T>> {
    const data = await this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    });
    return { data, success: true };
  }

  async patch<T>(endpoint: string, body?: unknown, config?: FetchConfig): Promise<ApiResponse<T>> {
    const data = await this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    });
    return { data, success: true };
  }

  async delete<T>(endpoint: string, config?: FetchConfig): Promise<ApiResponse<T>> {
    const data = await this.request<T>(endpoint, { ...config, method: 'DELETE' });
    return { data, success: true };
  }

  /**
   * 파일 업로드 (FormData 자동 생성)
   * @example
   * await apiClient.upload('/upload', { file, title: 'image' });
   */
  async upload<T>(endpoint: string, data: Record<string, unknown>, config?: FetchConfig): Promise<ApiResponse<T>> {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File || value instanceof Blob) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    return this.post<T>(endpoint, formData, config);
  }
}

export const apiClient = new ApiClient();

/**
 * 단순 데이터만 반환 (레거시 호환)
 * @deprecated ApiClient 메서드 직접 사용 권장
 */
export async function fetchAPI<T>(endpoint: string, config?: FetchConfig): Promise<T> {
  return apiClient.request<T>(endpoint, { ...config, method: config?.method || 'GET' });
}

/**
 * 상태와 데이터를 함께 반환
 * @deprecated apiClient.get() 직접 사용 권장
 */
export async function fetchApiWithStatus<T>(endpoint: string, config?: FetchConfig): Promise<ApiResponse<T>> {
  return apiClient.get<T>(endpoint, config);
}

/**
 * 인증 없이 요청
 */
export async function fetchWithoutAuth<T>(endpoint: string, config?: FetchConfig): Promise<T> {
  return apiClient.request<T>(endpoint, { ...config, skipAuth: true });
}
