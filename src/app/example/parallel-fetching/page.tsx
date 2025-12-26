import { getQueryClient } from '@core/lib';
import { PostListSuspense, postQueries } from '@domains/example';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import styles from './page.module.scss';

/**
 * 병렬 데이터 패칭 예제
 *
 * Promise.all로 여러 쿼리를 동시 실행하여 워터폴 방지
 */
export default async function ParallelFetchingPage() {
  const queryClient = getQueryClient();

  // 병렬 패칭으로 전체 로딩 시간 단축
  await Promise.all([
    queryClient.ensureQueryData(postQueries.list()),
    queryClient.ensureQueryData(postQueries.detail(1)),
    queryClient.ensureQueryData(postQueries.detail(2)),
  ]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>병렬 데이터 패칭</h1>
        <p>Promise.all을 사용하여 여러 쿼리를 동시에 실행합니다.</p>
      </header>

      <div className={styles.infoBox}>
        <h2>💡 최적화 포인트</h2>
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
      </div>

      <div className={styles.comparison}>
        <div className={styles.bad}>
          <h3>❌ 순차 패칭 (워터폴)</h3>
          <pre>
            {`await queryClient.ensureQueryData(query1);
await queryClient.ensureQueryData(query2);
await queryClient.ensureQueryData(query3);

총 시간: T1 + T2 + T3`}
          </pre>
        </div>

        <div className={styles.good}>
          <h3>✅ 병렬 패칭</h3>
          <pre>
            {`await Promise.all([
  queryClient.ensureQueryData(query1),
  queryClient.ensureQueryData(query2),
  queryClient.ensureQueryData(query3),
]);

총 시간: max(T1, T2, T3)`}
          </pre>
        </div>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <PostListSuspense />
      </HydrationBoundary>
    </div>
  );
}
