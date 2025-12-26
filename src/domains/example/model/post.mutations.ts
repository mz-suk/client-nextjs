import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postKeys } from './post.queries';
import type { Post } from './post.types';

/**
 * Post 생성 Mutation Hook
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Post, 'id'>) => {
      // 실제로는 POST 요청을 보내지만, 예제에서는 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        id: Math.floor(Math.random() * 10000),
        ...data,
      } as Post;
    },
    onSuccess: () => {
      // 성공 시 목록 쿼리 무효화하여 자동 refetch
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
};

/**
 * Post 수정 Mutation Hook
 */
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Post> }) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id, ...data } as Post;
    },
    onSuccess: (_, variables) => {
      // 특정 게시글 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
};

/**
 * Post 삭제 Mutation Hook
 */
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
};
