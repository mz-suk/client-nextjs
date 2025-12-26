import { Prefetch } from '@core/lib';
import { PostListSuspense, postQueries } from '@domains/example';

import styles from './page.module.scss';

/**
 * SSG + CSR 데이터 패칭 예제
 *
 * React 19 cache API + ensureQueryData로 최적화
 */
export default async function SSGPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>SSG + CSR Data Fetching</h1>
        <p>
          빌드 시점에 데이터를 미리 가져와서(SSG) 정적 HTML을 생성하고,
          <br />
          클라이언트에서 Hydration되어 TanStack Query로 상호작용합니다.
        </p>
      </header>

      <Prefetch queries={[postQueries.list()]}>
        <PostListSuspense />
      </Prefetch>
    </div>
  );
}
