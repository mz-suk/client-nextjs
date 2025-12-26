import { PostListSuspense, postQueries } from '@domains/example';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

/**
 * SSG + CSR 데이터 패칭 예제
 *
 * 동작 방식:
 * 1. 빌드 타임에 QueryClient를 생성하고 데이터를 prefetch
 * 2. prefetch된 데이터를 dehydrate하여 HTML에 포함
 * 3. 클라이언트에서 HydrationBoundary를 통해 데이터를 hydrate
 * 4. useSuspenseQuery를 사용하여 즉시 데이터 사용 가능
 * 5. 이후 클라이언트 사이드에서 TanStack Query의 캐싱 정책에 따라 동작
 */
export default async function SSGPage() {
  const queryClient = new QueryClient();

  // 빌드 타임에 데이터 미리 가져오기 (SSG)
  await queryClient.prefetchQuery(postQueries.list());

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>SSG + CSR Data Fetching</h1>
        <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
          빌드 시점에 데이터를 미리 가져와서(SSG) 정적 HTML을 생성하고,
          <br />
          클라이언트에서 Hydration되어 TanStack Query로 상호작용합니다.
        </p>
      </header>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <PostListSuspense />
      </HydrationBoundary>
    </div>
  );
}
