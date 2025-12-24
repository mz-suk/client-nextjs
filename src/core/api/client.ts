import { API_CONFIG, isDev, SERVER_CONFIG } from '../config/constants';
import { logger } from '../lib';
import { AUTH_ERROR_CODES, AuthError, type AuthTokens, getAuthConfig } from './auth';
import { API_CONSTANTS, HTTP_STATUS } from './constants';
import { ApiError, ERROR_TYPES, type ErrorType } from './error';
import type { ApiResponse, FetchConfig, RequestInterceptor, ResponseInterceptor } from './types';
import { buildURL, createHeaders, delay, serializeBody } from './utils';

const getBaseURL = () => {
  if (typeof window === 'undefined' && isDev && SERVER_CONFIG.API_TARGET_URL) {
    return SERVER_CONFIG.API_TARGET_URL;
  }
  return API_CONFIG.BASE_URL;
};

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

  removeRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors = this.requestInterceptors.filter(i => i !== interceptor);
  }

  removeResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors = this.responseInterceptors.filter(i => i !== interceptor);
  }

  private buildURL(endpoint: string, params?: Record<string, unknown>): string {
    return buildURL(this.baseURL, endpoint, params);
  }

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

  private async injectAuthHeader(headers: HeadersInit, skipAuth?: boolean): Promise<HeadersInit> {
    if (skipAuth) return headers;

    const authConfig = getAuthConfig();
    if (!authConfig) return headers;

    const { accessToken } = authConfig.store.getState();
    if (!accessToken) return headers;

    return { ...headers, Authorization: `Bearer ${accessToken}` };
  }

  private async handleTokenRefresh(endpoint: string, config: FetchConfig, retryCount: number): Promise<Response> {
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

      logger.info('토큰 갱신 성공');
      return this.executeRequest(endpoint, { ...config, _isRetry: true }, retryCount);
    } catch {
      logger.error('토큰 갱신 실패');
      authConfig.onAuthFailure();
      throw new AuthError(AUTH_ERROR_CODES.REFRESH_FAILED);
    }
  }

  private shouldRetry(status: number, skipRetry?: boolean, retryCount?: number): boolean {
    if (skipRetry || !retryCount || retryCount >= API_CONSTANTS.MAX_RETRIES) return false;
    return status === HTTP_STATUS.SERVICE_UNAVAILABLE || status >= HTTP_STATUS.INTERNAL_SERVER_ERROR;
  }

  private async handleError(error: unknown, endpoint: string, config: FetchConfig, retryCount: number): Promise<never> {
    if (error instanceof ApiError || error instanceof AuthError) throw error;

    if (!(error instanceof Error)) {
      throw new ApiError(0, 'Unknown error', undefined, undefined, ERROR_TYPES.UNKNOWN);
    }

    const isTimeout = error.name === 'AbortError';
    const isNetworkError = error.message.includes('fetch') || error.message.includes('network');

    if (!config.skipRetry && (isNetworkError || isTimeout) && retryCount < API_CONSTANTS.MAX_RETRIES) {
      const delayMs = API_CONSTANTS.RETRY_DELAY * (retryCount + 1);
      logger.warn(`재시도 ${retryCount + 1}/${API_CONSTANTS.MAX_RETRIES} (${delayMs}ms 후)`);
      await delay(delayMs);
      return this.request(endpoint, config, retryCount + 1);
    }

    const authConfig = getAuthConfig();
    if (authConfig?.onError && (isNetworkError || isTimeout)) {
      authConfig.onError(new Error('NETWORK_ERROR'));
    }

    const errorType = isTimeout ? ERROR_TYPES.TIMEOUT : ERROR_TYPES.NETWORK;
    throw new ApiError(0, error.message, undefined, undefined, errorType);
  }

  private async executeRequest(endpoint: string, config: FetchConfig & { _isRetry?: boolean }, retryCount: number): Promise<Response> {
    const url = this.buildURL(endpoint, config.params);
    const headers = await this.injectAuthHeader(createHeaders(config.body, config.headers, API_CONFIG.ACCEPT_LANGUAGE), config.skipAuth);

    let finalConfig: RequestInit = { ...config, headers };

    for (const interceptor of this.requestInterceptors) {
      finalConfig = await interceptor(finalConfig);
    }

    logger.api(finalConfig.method?.toUpperCase() || 'GET', url);

    let response = await this.fetchWithTimeout(url, finalConfig);

    for (const interceptor of this.responseInterceptors) {
      response = await interceptor(response);
    }

    if (response.status === HTTP_STATUS.UNAUTHORIZED && !config._isRetry && !config.skipAuth) {
      return this.handleTokenRefresh(endpoint, config, retryCount);
    }

    return response;
  }

  async request<T>(endpoint: string, config: FetchConfig & { _isRetry?: boolean } = {}, retryCount = 0): Promise<T> {
    try {
      const response = await this.executeRequest(endpoint, config, retryCount);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = (errorData as { message?: string }).message ?? response.statusText;
        const code = (errorData as { code?: string }).code;

        if (this.shouldRetry(response.status, config.skipRetry, retryCount)) {
          const delayMs = API_CONSTANTS.RETRY_DELAY * (retryCount + 1);
          logger.warn(`재시도 ${retryCount + 1}/${API_CONSTANTS.MAX_RETRIES} (${delayMs}ms 후)`);
          await delay(delayMs);
          return this.request<T>(endpoint, config, retryCount + 1);
        }

        let errorType: ErrorType = ERROR_TYPES.API;
        if (response.status >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
          errorType = ERROR_TYPES.SERVER;
          const authConfig = getAuthConfig();
          authConfig?.onError?.(new Error('SERVER_ERROR'));
        }

        logger.error('API Error:', response.status, message, code);
        throw new ApiError(response.status, message, code, errorData, errorType);
      }

      const data = await response.json();
      logger.debug('Response:', data);
      return data;
    } catch (error) {
      return this.handleError(error, endpoint, config, retryCount);
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
      body: serializeBody(body),
    });
    return { data, success: true };
  }

  async put<T>(endpoint: string, body?: unknown, config?: FetchConfig): Promise<ApiResponse<T>> {
    const data = await this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: serializeBody(body),
    });
    return { data, success: true };
  }

  async patch<T>(endpoint: string, body?: unknown, config?: FetchConfig): Promise<ApiResponse<T>> {
    const data = await this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: serializeBody(body),
    });
    return { data, success: true };
  }

  async delete<T>(endpoint: string, config?: FetchConfig): Promise<ApiResponse<T>> {
    const data = await this.request<T>(endpoint, { ...config, method: 'DELETE' });
    return { data, success: true };
  }

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
