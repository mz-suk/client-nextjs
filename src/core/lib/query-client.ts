import { ApiError } from '@core/api/error';
import { CACHE_CONFIG } from '@core/config';
import { defaultShouldDehydrateQuery, isServer, QueryClient, type QueryKey } from '@tanstack/react-query';
import { cache } from 'react';

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: CACHE_CONFIG.QUERY_STALE_TIME,
        gcTime: CACHE_CONFIG.QUERY_GC_TIME,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: (failureCount, error) => {
          if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false;
          return failureCount < 3;
        },
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
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

export const getQueryClient = cache(makeQueryClient);

let browserQueryClient: QueryClient | undefined;

export const getBrowserQueryClient = () => {
  if (isServer) return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
};

type QueryConfig = { queryFn: () => unknown; [key: string]: unknown };
type QueryFactory<T extends Record<string, (...args: never[]) => QueryConfig>> = T;

export const createQueryFactory = <TFactoryName extends string, TQueries extends QueryFactory<Record<string, (...args: never[]) => QueryConfig>>>(
  factoryName: TFactoryName,
  queries: TQueries
) => {
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
      return [factoryName, key, ...(Object.keys(params).length ? [params] : [])] as const;
    }) as QueryKeys[typeof key];

    options[key] = ((...args: unknown[]) => {
      const config = queryFn(...(args as Parameters<TQueries[typeof key]>));
      const { queryFn: fn, ...params } = config;
      return {
        queryKey: [factoryName, key, ...(Object.keys(params).length ? [params] : [])] as const,
        queryFn: fn,
      };
    }) as QueryOptions[typeof key];
  });

  return { keys, ...options, _factoryName: factoryName } as { keys: QueryKeys } & QueryOptions & { _factoryName: TFactoryName };
};

export const createOptimisticUpdate = <TData, TVariables>({
  queryClient,
  queryKey,
  updater,
  invalidateKeys = [queryKey],
}: {
  queryClient: QueryClient;
  queryKey: QueryKey;
  updater: (oldData: TData, variables: TVariables) => TData;
  invalidateKeys?: QueryKey[];
}) => ({
  onMutate: async (variables: TVariables) => {
    await queryClient.cancelQueries({ queryKey });
    const previousData = queryClient.getQueryData<TData>(queryKey);
    if (previousData) queryClient.setQueryData<TData>(queryKey, updater(previousData, variables));
    return { previousData };
  },
  onError: (_: unknown, __: TVariables, context?: { previousData?: TData }) => {
    if (context?.previousData) queryClient.setQueryData(queryKey, context.previousData);
  },
  onSettled: () => {
    invalidateKeys.forEach(key => queryClient.invalidateQueries({ queryKey: key }));
  },
});
