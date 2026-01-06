import {
  type DefaultError,
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

/**
 * 일반 Query Options 생성
 *
 * @param keyBase 쿼리 키의 기본 값 (배열)
 * @param fetcher 데이터 패칭 함수
 * @param config 추가 옵션 (staleTime, gcTime 등)
 * @returns Query options factory 함수
 *
 * @example
 * export const postQueries = {
 *   list: createQuery(
 *     postKeys.lists(),
 *     (params?: PostListParams) => postApi.getPosts(params),
 *     { staleTime: 60000 }
 *   ),
 * };
 */
export const createQuery = <TData, TParams = void, TError = DefaultError>(
  keyBase: readonly unknown[],
  fetcher: (params: TParams) => Promise<TData>,
  config?: Partial<Omit<UndefinedInitialDataOptions<TData, TError, TData, QueryKey>, 'queryKey' | 'queryFn'>>
) => {
  return (params: TParams extends void ? void : TParams) => {
    const queryKey: QueryKey = params === undefined || params === null ? [...keyBase] : [...keyBase, params];

    return queryOptions({
      queryKey,
      queryFn: () => fetcher(params as TParams),
      ...config,
    }) as UseQueryOptions<TData, TError, TData, QueryKey> & {
      queryKey: QueryKey;
      queryFn: QueryFunction<TData, QueryKey>;
    };
  };
};

/**
 * Infinite Query Options 생성
 *
 * @param keyBase 쿼리 키의 기본 값 (배열)
 * @param fetcher 데이터 패칭 함수 (pageParam 포함)
 * @param config 추가 옵션 (getNextPageParam, initialPageParam 필수)
 * @returns Infinite query options factory 함수
 *
 * @example
 * export const postQueries = {
 *   infinite: createInfiniteQuery(
 *     postKeys.infinite(),
 *     ({ pageParam }) => postApi.getPostsPaginated(pageParam),
 *     {
 *       initialPageParam: 1,
 *       getNextPageParam: (lastPage, allPages, lastPageParam) => {
 *         return lastPage.length > 0 ? lastPageParam + 1 : undefined;
 *       },
 *     }
 *   ),
 * };
 */
export const createInfiniteQuery = <TData, TParams = void, TPageParam = number, TError = DefaultError>(
  keyBase: readonly unknown[],
  fetcher: (params: TParams & { pageParam: TPageParam }) => Promise<TData>,
  config: {
    initialPageParam: TPageParam;
    getNextPageParam: (lastPage: TData, allPages: TData[], lastPageParam: TPageParam, allPageParams: TPageParam[]) => TPageParam | undefined | null;
    getPreviousPageParam?: (firstPage: TData, allPages: TData[], firstPageParam: TPageParam, allPageParams: TPageParam[]) => TPageParam | undefined | null;
  } & Partial<
    Omit<
      UndefinedInitialDataInfiniteOptions<TData, TError, InfiniteData<TData>, QueryKey, TPageParam>,
      'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam' | 'getPreviousPageParam'
    >
  >
) => {
  return (params: TParams extends void ? void : TParams) => {
    const queryKey: QueryKey = params === undefined || params === null ? [...keyBase] : [...keyBase, params];
    const baseParams = (params ?? {}) as Record<string, unknown>;

    const { initialPageParam, getNextPageParam, getPreviousPageParam, ...restConfig } = config;

    return infiniteQueryOptions({
      queryKey,
      queryFn: ({ pageParam }) => fetcher({ ...baseParams, pageParam } as TParams & { pageParam: TPageParam }),
      initialPageParam,
      getNextPageParam,
      getPreviousPageParam,
      ...restConfig,
    }) as UseInfiniteQueryOptions<TData, TError, InfiniteData<TData>, QueryKey, TPageParam> & {
      queryKey: QueryKey;
      queryFn: QueryFunction<TData, QueryKey, TPageParam>;
    };
  };
};

/**
 * Query Key Factory 생성
 *
 * 쿼리 키를 중앙에서 관리하고 타입 안전성을 보장하기 위한 헬퍼
 *
 * @param base 쿼리 키의 기본 문자열 (도메인명)
 * @param keys 키 정의 객체
 * @returns 타입 안전한 쿼리 키 팩토리 함수들
 *
 * @example
 * export const postKeys = createQueryKeys('posts', {
 *   all: null,
 *   lists: null,
 *   list: (params?: PostListParams) => params,
 *   details: null,
 *   detail: (id: number) => id,
 * });
 *
 * // 사용
 * postKeys.all(); // ['posts', 'all']
 * postKeys.list({ page: 1 }); // ['posts', 'list', { page: 1 }]
 * postKeys.detail(5); // ['posts', 'detail', 5]
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

    if (keyFn === null || keyFn === undefined) {
      // null이나 undefined인 경우: 파라미터 없는 키
      result[key] = () => [base, key] as const;
    } else {
      // 함수인 경우: 파라미터를 변환하여 키에 포함
      result[key] = (arg?: unknown) => {
        const transformed = keyFn(arg);
        // undefined나 null이 아닌 경우에만 키에 포함
        return transformed !== undefined && transformed !== null ? [base, key, transformed] : [base, key];
      };
    }
  }

  return result as QueryKeyResult<T>;
};
