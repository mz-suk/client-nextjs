import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

import { type PostListParams, postQueries } from '../model';

/**
 * Post Query Hooks
 *
 * React Query v5 + React 19 최적화 훅
 * Suspense 버전과 일반 버전 제공
 */

/**
 * 게시글 목록 조회 (Suspense) - 권장
 *
 * SSG/SSR prefetch와 함께 사용 시 최적의 성능
 * ErrorBoundary + Suspense 필요
 *
 * @example
 * // Server Component (prefetch)
 * <PrefetchBoundary queryOptions={postQueries.list()}>
 *   <PostListSuspense />
 * </PrefetchBoundary>
 *
 * // Client Component (use)
 * const { data } = useSuspensePosts();
 */
export const useSuspensePosts = (params?: PostListParams) => {
  const options = postQueries.list(params);
  return useSuspenseQuery({
    ...options,
    queryFn: typeof options.queryFn === 'function' ? options.queryFn : () => Promise.reject(new Error('Invalid queryFn')),
  });
};

/**
 * 게시글 목록 조회 (일반)
 *
 * 조건부 렌더링이나 커스텀 에러 처리가 필요한 경우
 * isLoading, isError 상태를 직접 관리
 */
export const usePosts = (params?: PostListParams) => {
  return useQuery(postQueries.list(params));
};

/**
 * 게시글 상세 조회 (Suspense)
 */
export const useSuspensePost = (id: number) => {
  const options = postQueries.detail(id);
  return useSuspenseQuery({
    ...options,
    queryFn: typeof options.queryFn === 'function' ? options.queryFn : () => Promise.reject(new Error('Invalid queryFn')),
  });
};

/**
 * 게시글 상세 조회 (일반)
 */
export const usePost = (id: number) => {
  return useQuery(postQueries.detail(id));
};
