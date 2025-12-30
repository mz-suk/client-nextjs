import { createInfiniteQuery, createQuery, createQueryKeys } from '@core/lib';

import { postApi } from './post.api';
import type { Post, PostListParams } from './post.types';

/**
 * Post Query Keys Factory
 *
 * 개선된 createQueryKeys 헬퍼로 타입 안전성 강화
 * 쿼리 키를 중앙에서 일관성 있게 관리
 */
export const postKeys = createQueryKeys('posts', {
  all: null,
  lists: null,
  list: (params: unknown) => params as PostListParams | undefined,
  details: null,
  detail: (id: unknown) => id as number,
  infinite: null,
});

/**
 * Post Query Options Factory
 *
 * React Query v5 + React 19 최적화 패턴
 * createQuery 헬퍼로 타입 추론 강화 및 코드 간소화
 */
export const postQueries = {
  /**
   * 게시글 목록 조회
   */
  list: createQuery<Post[], PostListParams | undefined>(postKeys.lists(), params => postApi.getPosts(params), {
    staleTime: 60000,
  }),

  /**
   * 게시글 상세 조회
   */
  detail: createQuery<Post, number>(postKeys.details(), id => postApi.getPost(id), {
    staleTime: 300000,
  }),

  /**
   * 무한 스크롤 게시글 목록
   */
  infinite: createInfiniteQuery<Post[], void>(postKeys.infinite(), ({ pageParam }) => postApi.getPostsPaginated(pageParam), {
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      return lastPage.length === 10 && allPages.length < 10 ? lastPageParam + 1 : undefined;
    },
    staleTime: 60000,
  }),
};
