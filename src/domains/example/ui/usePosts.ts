import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

import type { PostListParams } from '../model';
import { postQueries } from '../model';

/**
 * 게시글 목록 조회 훅 (일반 쿼리)
 * CSR에서 사용하거나 에러 처리가 필요한 경우 사용
 */
export const usePosts = (params?: PostListParams) => {
  return useQuery(postQueries.list(params));
};

/**
 * 게시글 목록 조회 훅 (Suspense)
 * SSR/SSG에서 prefetch된 데이터를 hydrate하여 사용
 * 주의: CSR 전용 페이지에서는 사용하지 말 것 (무한 호출 발생)
 */
export const usePostsSuspense = (params?: PostListParams) => {
  return useSuspenseQuery(postQueries.list(params));
};

/**
 * 게시글 상세 조회 훅
 * 필요 시점에 데이터를 가져오는 일반 쿼리
 */
export const usePost = (id: number) => {
  return useQuery(postQueries.detail(id));
};
