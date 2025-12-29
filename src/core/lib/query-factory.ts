import {
  type InfiniteData,
  infiniteQueryOptions,
  type QueryFunction,
  type QueryKey,
  queryOptions,
  type UndefinedInitialDataInfiniteOptions,
  type UndefinedInitialDataOptions,
  type UseInfiniteQueryOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';

/**
 * Query Factory Helper
 *
 * React Query v5 + React 19 최적화된 Query Factory 패턴
 * 타입 안전성과 DX를 개선한 헬퍼 함수들
 */

type QueryConfig<TData, TError = Error> = Partial<UndefinedInitialDataOptions<TData, TError, TData, QueryKey>>;

type InfiniteQueryConfig<TData, TError = Error> = Partial<UndefinedInitialDataInfiniteOptions<TData, TError, InfiniteData<TData>, QueryKey, number>>;

/**
 * 일반 Query Options 생성
 *
 * useSuspenseQuery와 호환되도록 queryFn이 필수인 타입으로 반환
 */
export const createQuery = <TData, TParams = void>(keyBase: readonly unknown[], fetcher: (params: TParams) => Promise<TData>, config?: QueryConfig<TData>) => {
  return (params: TParams extends void ? void : TParams) => {
    const queryKey = params !== undefined ? [...keyBase, params] : keyBase;

    const options = queryOptions({
      queryKey: queryKey as QueryKey,
      queryFn: () => fetcher(params as TParams),
      ...config,
    });

    // useSuspenseQuery 호환성을 위해 타입 단언
    return options as UseQueryOptions<TData, Error, TData, QueryKey> & {
      queryKey: QueryKey;
      queryFn: QueryFunction<TData, QueryKey>;
    };
  };
};

/**
 * Infinite Query Options 생성
 *
 * UseInfiniteQueryOptions 제네릭 인자 수정 (TanStack Query v5 기준 5개)
 * <TQueryFnData, TError, TData, TQueryKey, TPageParam>
 */
export const createInfiniteQuery = <TData, TParams = void>(
  keyBase: readonly unknown[],
  fetcher: (params: TParams & { pageParam: number }) => Promise<TData>,
  config: Omit<InfiniteQueryConfig<TData>, 'queryKey' | 'queryFn' | 'initialPageParam'> & {
    getNextPageParam: (lastPage: TData, allPages: TData[], lastPageParam: number) => number | undefined;
  }
) => {
  return (params?: TParams extends void ? void : TParams) => {
    const queryKey = params !== undefined ? [...keyBase, params] : keyBase;
    const baseParams = (params ?? {}) as Record<string, unknown>;

    const options = infiniteQueryOptions({
      queryKey: queryKey as QueryKey,
      queryFn: ({ pageParam }) => fetcher({ ...baseParams, pageParam } as TParams & { pageParam: number }),
      initialPageParam: 1,
      ...config,
    });

    return options as UseInfiniteQueryOptions<TData, Error, InfiniteData<TData>, QueryKey, number>;
  };
};

/**
 * Query Key Factory 생성
 */
type KeyFunction<P = unknown> = (arg: P) => unknown;
type KeyDefinition = KeyFunction | null;

type QueryKeyResult<T extends Record<string, KeyDefinition>> = {
  [K in keyof T]: T[K] extends KeyFunction<infer P> ? (P extends void ? () => readonly unknown[] : (arg: P) => readonly unknown[]) : () => readonly unknown[];
};

export const createQueryKeys = <T extends Record<string, KeyDefinition>>(base: string, keys: T): QueryKeyResult<T> => {
  const result: Record<string, (...args: unknown[]) => readonly unknown[]> = {};

  for (const key in keys) {
    const keyFn = keys[key];

    if (keyFn === null) {
      result[key] = () => [base, key] as const;
    } else {
      result[key] = (arg?: unknown) => {
        const transformed = keyFn?.(arg);
        return transformed !== undefined ? [base, key, transformed] : [base, key];
      };
    }
  }

  return result as QueryKeyResult<T>;
};
