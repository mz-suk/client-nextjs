import { apiClient } from '@core/api/client';
import { validateResponse } from '@core/api/utils';
import { z } from 'zod';

import { type Post, type PostListParams, PostSchema } from './post.types';

/**
 * Post API 레이어
 * 외부 API와의 통신 및 데이터 유효성 검증을 담당
 */
export const postApi = {
  /**
   * 게시글 목록 조회
   */
  getPosts: async (params?: PostListParams): Promise<Post[]> => {
    const data = await apiClient.get('https://jsonplaceholder.typicode.com/posts', {
      params: params as Record<string, unknown>,
    });
    return validateResponse(z.array(PostSchema), data);
  },

  /**
   * 게시글 상세 조회
   */
  getPost: async (id: number): Promise<Post> => {
    const data = await apiClient.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
    return validateResponse(PostSchema, data);
  },

  /**
   * 게시글 페이지네이션 조회 (무한 스크롤용)
   */
  getPostsPaginated: async (page: number): Promise<Post[]> => {
    const data = await apiClient.get('https://jsonplaceholder.typicode.com/posts', {
      params: {
        _page: page,
        _limit: 10,
      } as Record<string, unknown>,
    });
    return validateResponse(z.array(PostSchema), data);
  },
} as const;
