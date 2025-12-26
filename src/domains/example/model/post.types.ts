/**
 * Post 도메인 타입 정의
 */
export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface PostListParams {
  userId?: number;
  limit?: number;
}
