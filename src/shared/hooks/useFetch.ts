'use client';

import useSWR, { type SWRConfiguration, type SWRResponse } from 'swr';
import { fetchAPI } from '../api';
import { swrConfig } from '../config';

export interface UseFetchOptions<T> extends SWRConfiguration<T> {
  fallbackData?: T;
}

export function useFetch<T>(key: string | null, endpoint: string | null, options?: UseFetchOptions<T>): SWRResponse<T> {
  return useSWR<T>(key, endpoint ? async () => fetchAPI<T>(endpoint) : null, {
    ...swrConfig,
    ...options,
  });
}
