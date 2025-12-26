import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postQueries } from './post.queries';
import type { Post } from './post.types';

/**
 * Post 생성 Mutation (Optimistic Update)
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Post, 'id'>) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id: Math.floor(Math.random() * 10000), ...data } as Post;
    },
    onMutate: async newPost => {
      await queryClient.cancelQueries({ queryKey: postQueries.keys.list() });
      const previousPosts = queryClient.getQueryData<Post[]>(postQueries.keys.list());

      if (previousPosts) {
        queryClient.setQueryData<Post[]>(postQueries.keys.list(), old => [{ id: Date.now(), ...newPost } as Post, ...(old || [])]);
      }

      return { previousPosts };
    },
    onError: (_, __, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(postQueries.keys.list(), context.previousPosts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postQueries.keys.list() });
    },
  });
};

/**
 * Post 수정 Mutation (Optimistic Update)
 */
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Post> }) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id, ...data } as Post;
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: postQueries.keys.detail(id) });

      const previousPost = queryClient.getQueryData<Post>(postQueries.keys.detail(id));

      if (previousPost) {
        queryClient.setQueryData<Post>(postQueries.keys.detail(id), { ...previousPost, ...data });
      }

      return { previousPost };
    },
    onError: (_, variables, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(postQueries.keys.detail(variables.id), context.previousPost);
      }
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: postQueries.keys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: postQueries.keys.list() });
    },
  });
};

/**
 * Post 삭제 Mutation (Optimistic Update)
 */
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return id;
    },
    onMutate: async id => {
      await queryClient.cancelQueries({ queryKey: postQueries.keys.list() });

      const previousPosts = queryClient.getQueryData<Post[]>(postQueries.keys.list());

      if (previousPosts) {
        queryClient.setQueryData<Post[]>(
          postQueries.keys.list(),
          previousPosts.filter(post => post.id !== id)
        );
      }

      return { previousPosts };
    },
    onError: (_, __, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(postQueries.keys.list(), context.previousPosts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postQueries.keys.list() });
    },
  });
};
