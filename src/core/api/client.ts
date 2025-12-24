import { logger } from '../lib';

import { API_CONFIG, isDev, SERVER_CONFIG } from '../config/constants';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const getBaseURL = () => {
  if (typeof window === 'undefined' && isDev && SERVER_CONFIG.API_TARGET_URL) {
    return SERVER_CONFIG.API_TARGET_URL;
  }
  return API_CONFIG.BASE_URL;
};

const getDefaultHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    accept: '*/*',
  };

  if (API_CONFIG.ACCEPT_LANGUAGE) {
    headers['Accept-Language'] = API_CONFIG.ACCEPT_LANGUAGE;
  }

  return headers;
};

export interface FetchConfig extends RequestInit {
  baseURL?: string;
  timeout?: number;
  params?: Record<string, string | number | boolean>;
}

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = getBaseURL();
    this.timeout = API_CONFIG.TIMEOUT;
    this.defaultHeaders = getDefaultHeaders();
  }

  private buildURL(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const normalizedBase = this.baseURL.endsWith('/') ? this.baseURL : `${this.baseURL}/`;
    const url = new URL(normalizedEndpoint, normalizedBase);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
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

  async request<T>(endpoint: string, config: FetchConfig = {}, retryCount = 0): Promise<T> {
    const { params, headers: customHeaders, ...fetchConfig } = config;
    // const { baseURL, timeout, params, headers: customHeaders, ...fetchConfig } = config;
    const url = this.buildURL(endpoint, params);
    const headers = { ...this.defaultHeaders, ...customHeaders };

    logger.api(fetchConfig.method?.toUpperCase() || 'GET', url, fetchConfig.body);

    try {
      const response = await this.fetchWithTimeout(url, {
        ...fetchConfig,
        headers,
      });

      logger.debug('Response:', response.status);

      if (!response.ok) {
        const shouldRetry = response.status === 503;
        if (shouldRetry && retryCount < MAX_RETRIES) {
          const delay = RETRY_DELAY * (retryCount + 1);
          logger.warn(`재시도 ${retryCount + 1}/${MAX_RETRIES} (${delay}ms 후)`, url);
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.request<T>(endpoint, config, retryCount + 1);
        }

        const errorData = await response.json().catch(() => ({}));
        const message = (errorData as { message?: string })?.message || response.statusText;
        logger.error('API Error:', response.status, message);
        throw new Error(`API Error: ${response.status} - ${message}`);
      }

      const data = await response.json();
      logger.debug('Response data:', data);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        const isNetworkError = error.name === 'AbortError' || error.message.includes('fetch');
        if (isNetworkError && retryCount < MAX_RETRIES) {
          const delay = RETRY_DELAY * (retryCount + 1);
          logger.warn(`재시도 ${retryCount + 1}/${MAX_RETRIES} (${delay}ms 후)`, url);
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.request<T>(endpoint, config, retryCount + 1);
        }

        logger.error('Request Error:', error);
        throw error;
      }

      logger.error('Unknown Error:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string, config?: FetchConfig): Promise<{ data: T }> {
    const data = await this.request<T>(endpoint, { ...config, method: 'GET' });
    return { data };
  }

  async post<T>(endpoint: string, body?: unknown, config?: FetchConfig): Promise<{ data: T }> {
    const data = await this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
    return { data };
  }

  async put<T>(endpoint: string, body?: unknown, config?: FetchConfig): Promise<{ data: T }> {
    const data = await this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
    return { data };
  }

  async patch<T>(endpoint: string, body?: unknown, config?: FetchConfig): Promise<{ data: T }> {
    const data = await this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
    return { data };
  }

  async delete<T>(endpoint: string, config?: FetchConfig): Promise<{ data: T }> {
    const data = await this.request<T>(endpoint, { ...config, method: 'DELETE' });
    return { data };
  }
}

export const apiClient = new ApiClient();

export async function fetchAPI<T>(endpoint: string, config?: FetchConfig): Promise<T> {
  return apiClient.request<T>(endpoint, { ...config, method: config?.method || 'GET' });
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export async function fetchApiWithStatus<T>(endpoint: string, config?: FetchConfig): Promise<ApiResponse<T>> {
  try {
    const data = await fetchAPI<T>(endpoint, config);
    return { data, success: true };
  } catch (error) {
    logger.error('API 호출 실패:', error);
    throw error;
  }
}
