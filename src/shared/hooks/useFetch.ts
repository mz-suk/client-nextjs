'use client';

import useSWR, { type SWRConfiguration, type SWRResponse } from 'swr';
import { swrFetcher } from '../api';
import { swrConfig } from '../config';

export interface UseFetchOptions<T> extends SWRConfiguration<T> {
  fallbackData?: T;
}

export function useFetch<T>(key: string | null, endpoint: string | null, options?: UseFetchOptions<T>): SWRResponse<T> {
  return useSWR<T>(key, endpoint ? async () => swrFetcher<T>(endpoint) : null, {
    ...swrConfig,
    ...options,
  });
}
