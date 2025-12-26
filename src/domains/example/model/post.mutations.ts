import { createOptimisticUpdate } from '@core/lib';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postQueries } from './post.queries';
import type { Post } from './post.types';

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Post, 'id'>) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id: Math.floor(Math.random() * 10000), ...data } as Post;
    },
    ...createOptimisticUpdate<Post[], Omit<Post, 'id'>>({
      queryClient,
      queryKey: postQueries.keys.list(),
      updater: (oldData, newPost) => [{ id: Date.now(), ...newPost } as Post, ...oldData],
    }),
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Post> }) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id, ...data } as Post;
    },
    ...createOptimisticUpdate<Post, { id: number; data: Partial<Post> }>({
      queryClient,
      queryKey: postQueries.keys.detail(0),
      updater: (oldData, { data }) => ({ ...oldData, ...data }),
      invalidateKeys: [postQueries.keys.list()],
    }),
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return id;
    },
    ...createOptimisticUpdate<Post[], number>({
      queryClient,
      queryKey: postQueries.keys.list(),
      updater: (oldData, id) => oldData.filter(post => post.id !== id),
    }),
  });
};
