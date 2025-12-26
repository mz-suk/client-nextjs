import { ApiError } from '@core/api/error';
import { CACHE_CONFIG } from '@core/config';
import { defaultShouldDehydrateQuery, isServer, QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

/**
 * Query Client 기본 설정
 */
const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: CACHE_CONFIG.QUERY_STALE_TIME,
        gcTime: CACHE_CONFIG.QUERY_GC_TIME,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: (failureCount, error) => {
          if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
            return false;
          }
          return failureCount < 3;
        },
        retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
        throwOnError: false,
      },
      mutations: {
        retry: 0,
        throwOnError: false,
      },
      dehydrate: {
        shouldDehydrateQuery: query => defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  });
};

/**
 * 서버 사이드 QueryClient (React 19 cache API)
 */
export const getQueryClient = cache(makeQueryClient);

/**
 * 클라이언트 사이드 QueryClient (싱글톤)
 */
let browserQueryClient: QueryClient | undefined = undefined;

export function getBrowserQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
}

/**
 * Query Factory 생성 헬퍼
 *
 * @example
 * ```ts
 * export const postQueries = createQueryFactory('posts', {
 *   list: (params?) => ({
 *     queryFn: () => postApi.list(params),
 *     ...(params && { params }),
 *   }),
 *   detail: (id: number) => ({
 *     queryFn: () => postApi.detail(id),
 *     id,
 *   }),
 * });
 *
 * // 사용
 * useQuery(postQueries.list())
 * queryClient.invalidateQueries({ queryKey: postQueries.keys.list() })
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createQueryFactory<TFactoryName extends string, TQueries extends Record<string, (...args: any[]) => any>>(
  factoryName: TFactoryName,
  queries: TQueries
) {
  type QueryKeys = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [K in keyof TQueries]: (...args: Parameters<TQueries[K]>) => readonly [TFactoryName, K, ...any[]];
  };

  type QueryOptions = {
    [K in keyof TQueries]: (...args: Parameters<TQueries[K]>) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryKey: readonly [TFactoryName, K, ...any[]];
      queryFn: () => ReturnType<ReturnType<TQueries[K]>['queryFn']>;
    };
  };

  const keys = {} as QueryKeys;
  const options = {} as QueryOptions;

  for (const key in queries) {
    const queryFn = queries[key];
    if (!queryFn) continue;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    keys[key] = ((...args: any[]) => {
      const config = queryFn(...args);
      const { queryFn: _fn, ...params } = config;
      return [factoryName, key, ...(Object.keys(params).length > 0 ? [params] : [])] as const;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options[key] = ((...args: any[]) => {
      const config = queryFn(...args);
      const { queryFn: fn, ...params } = config;
      return {
        queryKey: [factoryName, key, ...(Object.keys(params).length > 0 ? [params] : [])] as const,
        queryFn: fn,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any;
  }

  return {
    keys,
    ...options,
    _factoryName: factoryName,
  } as { keys: QueryKeys } & QueryOptions & { _factoryName: TFactoryName };
}
