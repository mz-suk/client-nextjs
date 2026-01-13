import { PrefetchBoundary } from '@core/lib';
import { ExampleLayout, InfoBox, PostListSuspense, postQueries } from '@domains/example';

import styles from './page.module.scss';

export default async function ParallelFetchingPage() {
  return (
    <ExampleLayout title="병렬 데이터 패칭" description="PrefetchBoundary(Promise.all)를 사용하여 여러 쿼리를 동시에 실행합니다.">
      <InfoBox title="💡 최적화 포인트">
        <ul>
          <li>
            <strong>병렬 패칭:</strong> Promise.all로 여러 쿼리를 동시 실행
          </li>
          <li>
            <strong>워터폴 방지:</strong> 순차 패칭 대비 시간 단축
          </li>
          <li>
            <strong>캐시 재사용:</strong> ensureQueryData로 중복 fetch 방지
          </li>
        </ul>
      </InfoBox>

      <div className={styles.comparison}>
        <div className={styles.bad}>
          <h3>❌ 순차 패칭 (Waterfall)</h3>
          <pre>
            {`// 하나가 끝나야 다음이 시작됨
await query1(); // 1초
await query2(); // 1초
await query3(); // 1초

// 총 소요 시간: 3초 이상`}
          </pre>
        </div>

        <div className={styles.good}>
          <h3>✅ 병렬 패칭 (Parallel)</h3>
          <pre>
            {`// 동시에 시작됨
<PrefetchBoundary queryOptions={[
  query1, // 1초
  query2, // 1초
  query3  // 1초
]}>

// 총 소요 시간: 약 1초`}
          </pre>
        </div>
      </div>

      <PrefetchBoundary queryOptions={[postQueries.list(), postQueries.detail(1), postQueries.detail(2)]}>
        <PostListSuspense />
      </PrefetchBoundary>
    </ExampleLayout>
  );
}
