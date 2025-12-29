import { PostListSuspense, postQueries } from '@domains/example';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { ExampleLayout } from '../_components';

/**
 * SSG + CSR 하이브리드 예제 (프로덕션 권장 패턴)
 *
 * 동작 흐름:
 * 1. 빌드 타임: 데이터를 prefetch(SSG)하여 데이터가 포함된 HTML 생성
 * 2. 클라이언트 마운트: 데이터를 hydrate하여 React Query와 상호작용
 *
 * 장점:
 * - SEO 최적화 (초기 HTML에 콘텐츠 포함)
 * - 빠른 초기 렌더링 (FCP 향상)
 * - 원활한 클라이언트 사이드 업데이트 (캐싱, 리페칭)
 */
export default async function SSGPage() {
  const queryClient = new QueryClient();

  // 서버에서 데이터 미리 가져오기
  await queryClient.prefetchQuery(postQueries.list());

  return (
    <ExampleLayout
      title="SSG + CSR 데이터 패칭"
      description="빌드 시점에 데이터를 미리 가져오고(SSG) 클라이언트에서 hydrate합니다. SEO가 필요한 공개 페이지에 가장 적합한 패턴입니다."
    >
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PostListSuspense />
      </HydrationBoundary>
    </ExampleLayout>
  );
}
