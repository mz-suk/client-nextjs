import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Next.js 범용 템플릿</h1>
        <p className={styles.description}>다양한 렌더링 방식과 최신 기술 스택을 활용한 범용 템플릿입니다.</p>

        <h2>렌더링 방식 예제</h2>
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
          <li>
            <Link href="/example-react19">
              <strong>React 19 use() 훅</strong>
              <br />
              <small>React 19 신규 훅으로 Promise unwrap</small>
            </Link>
          </li>
        </ol>

        <h2>상태 관리 예제</h2>
        <ol>
          <li>
            <Link href="/example-tanstack-query">
              <strong>TanStack Query (React Query)</strong>
              <br />
              <small>서버 상태 관리 및 강력한 캐싱</small>
            </Link>
          </li>
          <li>
            <Link href="/example-zustand">
              <strong>Zustand</strong>
              <br />
              <small>간단하고 강력한 클라이언트 상태 관리</small>
            </Link>
          </li>
        </ol>
      </main>
    </div>
  );
}
