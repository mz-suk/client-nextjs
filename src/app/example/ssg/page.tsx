import { Prefetch } from '@core/lib';
import { PostListSuspense, postQueries } from '@domains/example';

import { ExampleLayout } from '../_components';

/**
 * SSG + CSR 데이터 패칭 예제
 *
 * React 19 cache API + ensureQueryData로 최적화
 */
export default async function SSGPage() {
  return (
    <ExampleLayout
      title="SSG + CSR 하이브리드"
      description="빌드 시점에 데이터를 미리 가져와서(SSG) 정적 HTML을 생성하고, 클라이언트에서 Hydration되어 TanStack Query로 상호작용합니다."
    >
      <Prefetch queries={[postQueries.list()]}>
        <PostListSuspense />
      </Prefetch>
    </ExampleLayout>
  );
}
