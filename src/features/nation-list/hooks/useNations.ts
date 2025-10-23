import type { Nation } from '@/entities/nation';
import { useFetch, type UseFetchOptions } from '@/shared/hooks';
import type { ApiResponse } from '@/shared/types';

export interface UseNationsOptions extends UseFetchOptions<ApiResponse<Nation[]>> {
  initialData?: Nation[];
}

export function useNations(options?: UseNationsOptions) {
  const { initialData, ...swrOptions } = options || {};

  const { data, error, isLoading, mutate } = useFetch<ApiResponse<Nation[]>>('nations-list', '/common/search/nations', {
    fallbackData: initialData ? { result: initialData, resultCode: 200, resultMessage: 'Initial data from SSG' } : undefined,
    ...swrOptions,
  });

  return {
    nations: data?.result || [],
    isLoading,
    error,
    refetch: mutate,
  };
}
