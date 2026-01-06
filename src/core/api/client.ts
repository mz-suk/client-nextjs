import { API_CONFIG, isDev, SERVER_CONFIG } from '../config/constants';
import { logger } from '../lib';
import { AUTH_ERROR_CODES, AuthError, type AuthTokens, getAuthConfig } from './auth';
import { HTTP_STATUS } from './constants';
import { ApiError, ERROR_TYPES, type ErrorType } from './error';
import type { FetchConfig, RequestInterceptor, ResponseInterceptor } from './types';
import { buildURL, createHeaders, serializeBody } from './utils';

const getBaseURL = () => {
  if (typeof window === 'undefined' && isDev && SERVER_CONFIG.API_TARGET_URL) {
    return SERVER_CONFIG.API_TARGET_URL;
  }
  return API_CONFIG.BASE_URL;
};

/**
 * Core API Client Wrapper
 *
 * Native Fetch API를 기반으로 인터셉터, 토큰 관리, 에러 처리를 캡슐화
 */
class ApiClient {
  private baseURL: string;
  private timeout: number;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private refreshPromise: Promise<AuthTokens> | null = null;

  constructor() {
    this.baseURL = getBaseURL();
    this.timeout = API_CONFIG.TIMEOUT;
  }

  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Internal fetch wrapper with timeout support
   */
  private async fetchWithTimeout(url: string, config: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, { ...config, signal: controller.signal });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Server-side auth header injection (Next.js App Router compatible)
   */
  private async getServerAuthHeader(): Promise<string | null> {
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      return cookieStore.get('accessToken')?.value ?? null;
    } catch (error) {
      logger.debug('Server auth header injection failed:', error);
      return null;
    }
  }

  private getClientAuthHeader(): string | null {
    const authConfig = getAuthConfig();
    return authConfig?.store.getState().accessToken ?? null;
  }

  private async injectAuthHeader(headers: HeadersInit, skipAuth?: boolean): Promise<HeadersInit> {
    if (skipAuth) return headers;

    const isServer = typeof window === 'undefined';
    const accessToken = isServer ? await this.getServerAuthHeader() : this.getClientAuthHeader();

    if (!accessToken) return headers;

    return { ...headers, Authorization: `Bearer ${accessToken}` };
  }

  /**
   * Token refresh logic handling 401 errors
   */
  private async handleTokenRefresh(endpoint: string, config: FetchConfig): Promise<Response> {
    const authConfig = getAuthConfig();
    if (!authConfig) throw new AuthError(AUTH_ERROR_CODES.UNAUTHORIZED);

    const { refreshToken } = authConfig.store.getState();

    if (!refreshToken || endpoint.includes('/auth/refresh')) {
      authConfig.onAuthFailure();
      throw new AuthError(AUTH_ERROR_CODES.UNAUTHORIZED);
    }

    try {
      if (!this.refreshPromise) {
        this.refreshPromise = authConfig.refreshTokens(refreshToken).finally(() => {
          this.refreshPromise = null;
        });
      }

      const tokens = await this.refreshPromise;
      authConfig.store.getState().setTokens(tokens);

      logger.info('Token refreshed successfully');
      // Retry original request with new token
      return this.executeRequest(endpoint, { ...config, _isRetry: true });
    } catch {
      logger.error('Token refresh failed');
      authConfig.onAuthFailure();
      throw new AuthError(AUTH_ERROR_CODES.REFRESH_FAILED);
    }
  }

  /**
   * Global error handler transformer
   */
  private handleError(error: unknown): never {
    if (error instanceof ApiError || error instanceof AuthError) throw error;

    if (!(error instanceof Error)) {
      throw new ApiError(0, 'Unknown error', undefined, undefined, ERROR_TYPES.UNKNOWN);
    }

    const isTimeout = error.name === 'AbortError';
    const isNetworkError = error.message.includes('fetch') || error.message.includes('network');

    const authConfig = getAuthConfig();
    if (authConfig?.onError && (isNetworkError || isTimeout)) {
      authConfig.onError(new Error('NETWORK_ERROR'));
    }

    const errorType = isTimeout ? ERROR_TYPES.TIMEOUT : ERROR_TYPES.NETWORK;
    throw new ApiError(0, error.message, undefined, undefined, errorType);
  }

  /**
   * Main request execution pipeline
   */
  private async executeRequest(endpoint: string, config: FetchConfig & { _isRetry?: boolean }): Promise<Response> {
    const url = buildURL(this.baseURL, endpoint, config.params);
    const rawHeaders = createHeaders(config.body, config.headers, API_CONFIG.ACCEPT_LANGUAGE);
    const headers = await this.injectAuthHeader(rawHeaders, config.skipAuth);

    let finalConfig: RequestInit = { ...config, headers };

    // Apply Request Interceptors
    for (const interceptor of this.requestInterceptors) {
      finalConfig = await interceptor(finalConfig);
    }

    logger.api(finalConfig.method?.toUpperCase() || 'GET', url);

    let response = await this.fetchWithTimeout(url, finalConfig);

    // Apply Response Interceptors
    for (const interceptor of this.responseInterceptors) {
      response = await interceptor(response);
    }

    // Handle 401 Unauthorized (Auto-Refresh)
    if (response.status === HTTP_STATUS.UNAUTHORIZED && !config._isRetry && !config.skipAuth) {
      return this.handleTokenRefresh(endpoint, config);
    }

    return response;
  }

  /**
   * Generic request method
   *
   * @param endpoint API endpoint
   * @param config Request configuration
   * @returns Promise with response data
   */
  async request<T>(endpoint: string, config: FetchConfig & { _isRetry?: boolean } = {}): Promise<T> {
    try {
      const response = await this.executeRequest(endpoint, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = (errorData as { message?: string }).message ?? response.statusText;
        const code = (errorData as { code?: string }).code;

        let errorType: ErrorType = ERROR_TYPES.API;

        if (response.status >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
          errorType = ERROR_TYPES.SERVER;
          const authConfig = getAuthConfig();
          authConfig?.onError?.(new Error('SERVER_ERROR'));
        }

        logger.error(`API Error ${response.status}:`, message, code);
        throw new ApiError(response.status, message, code, errorData, errorType);
      }

      // Handle empty response body (204 No Content)
      if (response.status === 204) {
        return {} as T;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async get<T>(endpoint: string, config?: FetchConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: unknown, config?: FetchConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: serializeBody(body),
    });
  }

  async put<T>(endpoint: string, body?: unknown, config?: FetchConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: serializeBody(body),
    });
  }

  async patch<T>(endpoint: string, body?: unknown, config?: FetchConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: serializeBody(body),
    });
  }

  async delete<T>(endpoint: string, config?: FetchConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  async upload<T>(endpoint: string, data: Record<string, unknown>, config?: FetchConfig): Promise<T> {
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
