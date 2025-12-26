import { ApiError } from '@core/api/error';
import { CACHE_CONFIG } from '@core/config';
import { defaultShouldDehydrateQuery, isServer, QueryClient, type QueryKey } from '@tanstack/react-query';
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
type QueryConfig = { queryFn: () => unknown; [key: string]: unknown };
type QueryFactory<T extends Record<string, (...args: never[]) => QueryConfig>> = T;

export function createQueryFactory<TFactoryName extends string, TQueries extends QueryFactory<Record<string, (...args: never[]) => QueryConfig>>>(
  factoryName: TFactoryName,
  queries: TQueries
) {
  type QueryKeys = {
    [K in keyof TQueries]: (...args: Parameters<TQueries[K]>) => readonly [TFactoryName, K, ...unknown[]];
  };

  type QueryOptions = {
    [K in keyof TQueries]: (...args: Parameters<TQueries[K]>) => {
      queryKey: readonly [TFactoryName, K, ...unknown[]];
      queryFn: () => ReturnType<ReturnType<TQueries[K]>['queryFn']>;
    };
  };

  const keys = {} as QueryKeys;
  const options = {} as QueryOptions;

  (Object.keys(queries) as Array<keyof TQueries>).forEach(key => {
    const queryFn = queries[key];
    if (!queryFn) return;

    keys[key] = ((...args: unknown[]) => {
      const config = queryFn(...(args as Parameters<TQueries[typeof key]>));
      const { queryFn: _fn, ...params } = config;
      return [factoryName, key, ...(Object.keys(params).length > 0 ? [params] : [])] as const;
    }) as QueryKeys[typeof key];

    options[key] = ((...args: unknown[]) => {
      const config = queryFn(...(args as Parameters<TQueries[typeof key]>));
      const { queryFn: fn, ...params } = config;
      return {
        queryKey: [factoryName, key, ...(Object.keys(params).length > 0 ? [params] : [])] as const,
        queryFn: fn,
      };
    }) as QueryOptions[typeof key];
  });

  return {
    keys,
    ...options,
    _factoryName: factoryName,
  } as { keys: QueryKeys } & QueryOptions & { _factoryName: TFactoryName };
}

/**
 * Optimistic Update 헬퍼
 *
 * @example
 * ```ts
 * export const useCreatePost = () => {
 *   const queryClient = useQueryClient();
 *
 *   return useMutation({
 *     mutationFn: postApi.create,
 *     ...createOptimisticUpdate({
 *       queryClient,
 *       queryKey: postQueries.keys.list(),
 *       updater: (oldData: Post[], newPost: Post) => [newPost, ...oldData],
 *     }),
 *   });
 * };
 * ```
 */
export function createOptimisticUpdate<TData, TVariables>({
  queryClient,
  queryKey,
  updater,
  invalidateKeys = [queryKey],
}: {
  queryClient: QueryClient;
  queryKey: QueryKey;
  updater: (oldData: TData, variables: TVariables) => TData;
  invalidateKeys?: QueryKey[];
}) {
  return {
    onMutate: async (variables: TVariables) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<TData>(queryKey);

      if (previousData) {
        queryClient.setQueryData<TData>(queryKey, updater(previousData, variables));
      }

      return { previousData };
    },
    onError: (_: unknown, __: TVariables, context?: { previousData?: TData }) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      invalidateKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  };
}
