import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import { postApi } from './post.api';
import type { PostListParams } from './post.types';

/**
 * Post Query Keys Factory
 * 쿼리 키를 중앙에서 관리하여 일관성 유지
 */
export const postKeys = {
  all: () => ['posts'] as const,
  lists: () => [...postKeys.all(), 'list'] as const,
  list: (params?: PostListParams) => [...postKeys.lists(), params] as const,
  details: () => [...postKeys.all(), 'detail'] as const,
  detail: (id: number) => [...postKeys.details(), id] as const,
  infinite: () => [...postKeys.all(), 'infinite'] as const,
} as const;

/**
 * Post Query Options Factory
 * TanStack Query v5의 queryOptions를 활용한 타입 안전한 쿼리 정의
 */
export const postQueries = {
  list: (params?: PostListParams) =>
    queryOptions({
      queryKey: postKeys.list(params),
      queryFn: () => postApi.getPosts(params),
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: postKeys.detail(id),
      queryFn: () => postApi.getPost(id),
    }),

  infinite: () =>
    infiniteQueryOptions({
      queryKey: postKeys.infinite(),
      queryFn: ({ pageParam }) => postApi.getPostsPaginated(pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        // 페이지당 10개씩, 총 100개까지
        return lastPage.length === 10 && allPages.length < 10 ? allPages.length + 1 : undefined;
      },
    }),
} as const;
