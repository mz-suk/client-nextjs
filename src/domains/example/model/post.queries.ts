import { createQueryFactory } from '@core/lib';
import { infiniteQueryOptions } from '@tanstack/react-query';

import { postApi } from './post.api';
import type { Post, PostListParams } from './post.types';

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

export const postInfiniteQuery = () =>
  infiniteQueryOptions({
    queryKey: ['posts', 'infinite'] as const,
    queryFn: ({ pageParam }) => postApi.getPostsPaginated(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => (lastPage.length === 10 && allPages.length < 10 ? allPages.length + 1 : undefined),
    maxPages: 10,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
