import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>렌더링 방식 예제</h1>
        <ol>
          <li>
            <Link href="/example-ssg">
              <strong>SSG (Static Site Generation)</strong>
              <br />
              <small>빌드 시 정적 페이지 생성 - 최고 성능</small>
            </Link>
          </li>
          <li>
            <Link href="/example-hybrid">
              <strong>하이브리드 (SSG + SWR)</strong>
              <br />
              <small>초기는 SSG, 업데이트는 SWR - 추천 방식 ⭐</small>
            </Link>
          </li>
          <li>
            <Link href="/example-api-usage">
              <strong>CSR with SWR</strong>
              <br />
              <small>클라이언트에서 SWR로 데이터 fetch</small>
            </Link>
          </li>
        </ol>
      </main>
    </div>
  );
}
