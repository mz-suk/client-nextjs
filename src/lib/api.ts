import axios, { type AxiosRequestConfig } from 'axios';
import { env } from './env';
import { logger } from './logger';

export const apiClient = axios.create({
  baseURL: env.API_URL,
  timeout: env.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (디버그 로깅)
apiClient.interceptors.request.use(
  config => {
    logger.api(config.method?.toUpperCase() || 'GET', config.url || '', config.data);
    return config;
  },
  error => {
    logger.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (에러 핸들링)
apiClient.interceptors.response.use(
  response => {
    logger.debug('Response:', response.status, response.data);
    return response;
  },
  error => {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      logger.error('API Error:', error.response?.status, message);
      throw new Error(`API Error: ${error.response?.status || 'Network'} - ${message}`);
    }
    logger.error('Unknown Error:', error);
    throw error;
  }
);

export async function fetchAPI<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.request<T>({
    url: endpoint,
    ...config,
  });
  return response.data;
}
