import { PrefetchBoundary } from '@core/lib';
import { ExampleLayout, PostListSuspense, postQueries } from '@domains/example';

/**
 * SSG + CSR 하이브리드 예제 (프로덕션 권장 패턴)
 *
 * 동작 흐름:
 * 1. 빌드 타임: 데이터를 prefetch(SSG)하여 데이터가 포함된 HTML 생성
 * 2. 클라이언트 마운트: 데이터를 hydrate하여 React Query와 상호작용
 *
 * Next.js 16 + React 19 + TanStack Query v5 최신 패턴 적용:
 * - `PrefetchBoundary`를 사용하여 선언적으로 서버 데이터 프리패칭 처리
 * - 불필요한 보일러플레이트 코드 제거
 */
export default async function SSGPage() {
  return (
    <ExampleLayout
      title="SSG + CSR 데이터 패칭"
      description="빌드 시점에 데이터를 미리 가져오고(SSG) 클라이언트에서 hydrate합니다. SEO가 필요한 공개 페이지에 가장 적합한 패턴입니다."
    >
      <PrefetchBoundary queryOptions={postQueries.list()}>
        <PostListSuspense />
      </PrefetchBoundary>
    </ExampleLayout>
  );
}
