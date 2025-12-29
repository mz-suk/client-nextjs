import { dehydrate, type FetchQueryOptions, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { cache } from 'react';

/**
 * Server Component용 QueryClient 생성기
 *
 * React의 cache()를 사용하여 요청당 하나의 QueryClient 인스턴스를 보장
 * Next.js 16 App Router에서 서버 컴포넌트 간 QueryClient 공유
 */
export const getQueryClient = cache(() => new QueryClient());

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QueryOptions = FetchQueryOptions<any, any, any, any>;

interface PrefetchBoundaryProps {
  children: ReactNode;
  queryOptions?: QueryOptions | QueryOptions[];
}

/**
 * Server Prefetching Boundary
 *
 * 서버에서 데이터를 prefetch하고 클라이언트로 hydrate하는 경계 컴포넌트
 * React 19 비동기 컴포넌트 + Next.js 16 최적화
 *
 * @example
 * // 단일 쿼리
 * <PrefetchBoundary queryOptions={postQueries.list()}>
 *   <PostList />
 * </PrefetchBoundary>
 *
 * // 여러 쿼리 동시 프리패칭
 * <PrefetchBoundary queryOptions={[postQueries.list(), userQueries.me()]}>
 *   <Dashboard />
 * </PrefetchBoundary>
 */
export async function PrefetchBoundary({ children, queryOptions }: PrefetchBoundaryProps) {
  const queryClient = getQueryClient();

  if (queryOptions) {
    const options = Array.isArray(queryOptions) ? queryOptions : [queryOptions];
    await Promise.all(options.map(option => queryClient.prefetchQuery(option)));
  }

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}

/**
 * Server Query Fetcher
 *
 * 서버 컴포넌트에서 데이터를 직접 가져올 때 사용
 * HydrationBoundary 없이 서버 데이터를 직접 사용하는 경우
 *
 * @example
 * export default async function Page() {
 *   const posts = await serverQuery(postQueries.list());
 *   return <PostList initialData={posts} />;
 * }
 */
export async function serverQuery<TData>(queryOptions: FetchQueryOptions<TData, unknown, TData, readonly unknown[]>): Promise<TData> {
  const queryClient = getQueryClient();
  return queryClient.fetchQuery(queryOptions);
}
