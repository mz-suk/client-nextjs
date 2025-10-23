import type { AxiosRequestConfig } from 'axios';
import { fetchAPI } from './client';

export async function swrFetcher<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return fetchAPI<T>(url, config);
}
