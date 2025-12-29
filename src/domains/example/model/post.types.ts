import { z } from 'zod';

/**
 * Post 도메인 스키마 및 타입 정의
 */

// Post 스키마
export const PostSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  userId: z.number(),
});

// Post 목록 파라미터 스키마
export const PostListParamsSchema = z.object({
  userId: z.number().optional(),
  limit: z.number().optional(),
  page: z.number().optional(),
});

// 타입 추출
export type Post = z.infer<typeof PostSchema>;
export type PostListParams = z.infer<typeof PostListParamsSchema>;
