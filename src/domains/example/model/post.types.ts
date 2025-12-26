export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface PostListParams extends Record<string, unknown> {
  userId?: number;
  limit?: number;
}
