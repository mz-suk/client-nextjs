import { Prefetch } from '@core/lib';
import { PostListSuspense, postQueries } from '@domains/example';

import { ExampleLayout } from '../_components';

/**
 * SSG + CSR 하이브리드 데이터 패칭 예제 (Recommended)
 *
 * [동작 방식]
 * 1. 빌드 타임(또는 서버): 데이터를 미리 fetch (Prefetch)
 * 2. 서버: 데이터가 포함된 HTML 생성 (HydrationBoundary로 데이터 직렬화)
 * 3. 클라이언트: 초기 로딩 시 즉시 데이터 표시 (Hydration)
 * 4. 클라이언트: 이후 TanStack Query가 백그라운드에서 데이터 관리 (Stale Time 등)
 *
 * [장점]
 * - 완벽한 SEO (데이터가 HTML에 포함됨)
 * - 초기 로딩 속도 매우 빠름 (CLS 방지)
 * - 클라이언트 인터랙션 가능
 */
export default async function SSGPage() {
  return (
    <ExampleLayout
      title="SSG + CSR 하이브리드"
      description="서버에서 미리 가져온 데이터를 기반으로 렌더링하므로 로딩 없이 즉시 화면이 보입니다."
      tip="페이지 소스 보기를 하면 데이터가 HTML에 포함되어 있는 것을 확인할 수 있습니다."
    >
      {/* 
        Prefetch 컴포넌트는 내부적으로 HydrationBoundary를 사용합니다.
        서버에서 실행된 쿼리 결과를 클라이언트로 전달(Dehydrate)합니다.
      */}
      <Prefetch queries={[postQueries.list()]}>
        <PostListSuspense />
      </Prefetch>
    </ExampleLayout>
  );
}
