import type { Nation } from '@/entities/nation';
import { useFetch, type UseFetchOptions } from '@/shared/hooks';
import type { ApiResponse } from '@/shared/types';

export interface UseFrequentNationsOptions extends UseFetchOptions<ApiResponse<Nation[]>> {
  initialData?: Nation[];
}

export function useFrequentNations(options?: UseFrequentNationsOptions) {
  const { initialData, ...swrOptions } = options || {};

  const { data, error, isLoading, mutate } = useFetch<ApiResponse<Nation[]>>('frequent-nations', '/common/nation/frequent', {
    fallbackData: initialData ? { result: initialData, resultCode: 200, resultMessage: 'Initial data' } : undefined,
    ...swrOptions,
  });

  return {
    nations: data?.result || [],
    isLoading,
    error,
    refetch: mutate,
  };
}
