import type { Nation, NationListParams } from '@/entities/nation';
import { useFetch, type UseFetchOptions } from '@/shared/hooks';
import type { ApiResponse } from '@/shared/types';

export interface UseNationListOptions extends UseFetchOptions<ApiResponse<Nation[]>> {
  initialData?: Nation[];
  params?: NationListParams;
}

export function useNationList(options?: UseNationListOptions) {
  const { initialData, params, ...swrOptions } = options || {};

  const queryParams = new URLSearchParams();
  if (params?.keyword) {
    queryParams.append('keyword', params.keyword);
  }

  const url = `/common/nation/list${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const cacheKey = `nation-list-${queryParams.toString()}`;

  const { data, error, isLoading, mutate } = useFetch<ApiResponse<Nation[]>>(cacheKey, url, {
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
