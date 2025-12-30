import { createMutation, createOptimisticDeleteMutation, createOptimisticListMutation } from '@core/lib';

import { postKeys } from './post.queries';
import type { Post } from './post.types';

/**
 * Post Mutations
 *
 * React Query v5 + React 19 최적화 패턴
 * Optimistic Updates 지원으로 더 나은 사용자 경험 제공
 */

type CreatePostInput = Omit<Post, 'id'>;
type UpdatePostInput = { id: number; data: Partial<Post> };

/**
 * Post 생성 Mutation (Optimistic Update)
 *
 * 목록에 즉시 반영되어 빠른 피드백 제공
 */
export const useCreatePost = createOptimisticListMutation<Post, CreatePostInput>(
  async data => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id: Math.floor(Math.random() * 10000),
      ...data,
    };
  },
  {
    listQueryKey: postKeys.lists(),
    generateOptimisticItem: data => ({
      id: -Date.now(),
      ...data,
    }),
    position: 'start',
    invalidateKeys: [postKeys.lists()],
  }
);

/**
 * Post 수정 Mutation
 *
 * 특정 게시글과 목록 캐시 무효화
 */
export const useUpdatePost = createMutation<Post, UpdatePostInput>(
  async ({ id, data }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { id, ...data } as Post;
  },
  {
    invalidateKeys: [postKeys.details(), postKeys.lists()],
  }
);

/**
 * Post 삭제 Mutation (Optimistic Update)
 *
 * 목록에서 즉시 제거되어 빠른 피드백 제공
 */
export const useDeletePost = createOptimisticDeleteMutation<Post, number>(
  async _id => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  },
  {
    listQueryKey: postKeys.lists(),
    getId: id => id,
    invalidateKeys: [postKeys.details()],
  }
);
