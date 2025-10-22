import axios, { type AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import { env } from '../config/env';
import { logger } from '../lib/logger';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const getBaseURL = () => {
  if (typeof window === 'undefined') {
    return `http://localhost:${process.env.PORT || 3000}${env.API_URL}`;
  }
  return env.API_URL;
};

export const apiClient = axios.create({
  baseURL: getBaseURL(),
  timeout: env.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': 'ko',
    accept: '*/*',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    logger.api(config.method?.toUpperCase() || 'GET', config.url || '', config.data);
    return config;
  },
  (error: AxiosError) => {
    logger.error('Request Error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  response => {
    logger.debug('Response:', response.status, response.data);
    return response;
  },
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig & { _retryCount?: number };

    if (!config) {
      logger.error('No config in error');
      throw error;
    }

    const shouldRetry = error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK' || error.response?.status === 503;

    if (shouldRetry && (!config._retryCount || config._retryCount < MAX_RETRIES)) {
      config._retryCount = (config._retryCount || 0) + 1;
      const delay = RETRY_DELAY * config._retryCount;

      logger.warn(`재시도 ${config._retryCount}/${MAX_RETRIES} (${delay}ms 후)`, config.url);

      await new Promise(resolve => setTimeout(resolve, delay));
      return apiClient.request(config);
    }

    if (axios.isAxiosError(error)) {
      const message = (error.response?.data as { message?: string } | undefined)?.message || error.message;
      logger.error('API Error:', error.response?.status, message);
      throw new Error(`API Error: ${error.response?.status || 'Network'} - ${message}`);
    }

    logger.error('Unknown Error:', error);
    throw error;
  }
);

export async function fetchAPI<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
  console.log('[ENV] 환경변수 로드 완료:');
  console.log('  NODE_ENV:', process.env.NODE_ENV);
  console.log('  API_URL:', env.API_URL);
  console.log('  API_TIMEOUT:', env.API_TIMEOUT);
  console.log('  FEATURE_DEBUG:', env.FEATURE_DEBUG);
  console.log('  API_TARGET_URL:', env.API_TARGET_URL);

  const response = await apiClient.request<T>({
    url: endpoint,
    ...config,
  });
  return response.data;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export async function fetchApiWithStatus<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const data = await fetchAPI<T>(endpoint, config);
    return { data, success: true };
  } catch (error) {
    logger.error('API 호출 실패:', error);
    throw error;
  }
}
