import { createQueryFactory } from '@core/lib';
import { infiniteQueryOptions } from '@tanstack/react-query';

import { postApi } from './post.api';
import type { Post, PostListParams } from './post.types';

/**
 * Post Query Keys (하위 호환용)
 */
export const postKeys = {
  all: () => ['posts'] as const,
  lists: () => ['posts', 'list'] as const,
  list: (params?: PostListParams) => ['posts', 'list', ...(params ? [params] : [])] as const,
  details: () => ['posts', 'detail'] as const,
  detail: (id: number) => ['posts', 'detail', id] as const,
  infinite: () => ['posts', 'infinite'] as const,
} as const;

/**
 * Post Query Factory
 */
export const postQueries = createQueryFactory('posts', {
  list: (params?: PostListParams): { queryFn: () => Promise<Post[]>; params?: PostListParams } => ({
    queryFn: () => postApi.getPosts(params),
    ...(params && { params }),
  }),

  detail: (id: number): { queryFn: () => Promise<Post>; id: number } => ({
    queryFn: () => postApi.getPost(id),
    id,
  }),
});

/**
 * Infinite Query (별도 정의)
 */
export const postInfiniteQuery = () =>
  infiniteQueryOptions({
    queryKey: postKeys.infinite(),
    queryFn: ({ pageParam }) => postApi.getPostsPaginated(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 && allPages.length < 10 ? allPages.length + 1 : undefined;
    },
    maxPages: 10,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
