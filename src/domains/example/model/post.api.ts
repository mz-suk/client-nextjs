import { apiClient } from '@core/api/client';

import type { Post, PostListParams } from './post.types';

export const postApi = {
  getPosts: async (params?: PostListParams) => {
    const { data } = await apiClient.get<Post[]>('https://jsonplaceholder.typicode.com/posts', { params });
    return data;
  },

  getPost: async (id: number) => {
    const { data } = await apiClient.get<Post>(`https://jsonplaceholder.typicode.com/posts/${id}`);
    return data;
  },

  getPostsPaginated: async (page: number) => {
    const { data } = await apiClient.get<Post[]>('https://jsonplaceholder.typicode.com/posts', {
      params: { _page: page, _limit: 10 },
    });
    return data;
  },
} as const;
