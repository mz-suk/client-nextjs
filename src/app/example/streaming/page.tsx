import { PrefetchBoundary } from '@core/lib';
import { ExampleLayout, InfoBox, PostListSuspense, postQueries } from '@domains/example';
import { Suspense } from 'react';

import styles from './page.module.scss';

const SlowDataComponent = async () => {
  // 인위적인 지연 (3초)
  await new Promise(resolve => setTimeout(resolve, 3000));
  return (
    <div className={styles.slowData}>
      <h3>느린 데이터 (3초 지연)</h3>
      <p>이 컴포넌트는 3초 후에 렌더링됩니다.</p>
    </div>
  );
};

export default async function StreamingPage() {
  return (
    <ExampleLayout title="Suspense Streaming" description="빠른 데이터는 즉시 표시되고, 느린 데이터는 준비되는 대로 스트리밍됩니다.">
      <InfoBox title="💡 동작 원리">
        <ul>
          <li>
            <strong>점진적 렌더링:</strong> 빠른 콘텐츠를 먼저 보여주고, 느린 콘텐츠는 나중에 스트리밍
          </li>
          <li>
            <strong>TTFB 개선:</strong> 전체 데이터를 기다리지 않고 즉시 응답
          </li>
          <li>
            <strong>사용자 경험:</strong> 로딩 시간이 길어도 빠르게 느껴짐
          </li>
        </ul>
      </InfoBox>

      <section className={styles.section}>
        <h2>빠른 데이터 (즉시 렌더링)</h2>
        <PrefetchBoundary queryOptions={postQueries.list()}>
          <PostListSuspense />
        </PrefetchBoundary>
      </section>

      <section className={styles.section}>
        <h2>느린 데이터 (Suspense Streaming)</h2>
        <Suspense
          fallback={
            <div className={styles.skeleton}>
              <div className={styles.skeletonLine} />
              <div className={styles.skeletonLine} />
              <div className={styles.skeletonLine} />
            </div>
          }
        >
          <SlowDataComponent />
        </Suspense>
      </section>
    </ExampleLayout>
  );
}
