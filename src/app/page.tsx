import Link from 'next/link';

import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Next.js 범용 템플릿</h1>
        <p className={styles.description}>Next.js 16 + React 19 기반 DDD 아키텍처 템플릿</p>

        <div className={styles.exampleLink}>
          <Link href="/example">예제 페이지 보기 →</Link>
        </div>

        <h2>주요 기능</h2>
        <ul>
          <li>
            <strong>SSG + TanStack Query:</strong> 빌드 타임 데이터 prefetch + 클라이언트 상태 관리
          </li>
          <li>
            <strong>CSR + TanStack Query:</strong> 완전한 클라이언트 사이드 데이터 페칭
          </li>
          <li>
            <strong>Zustand:</strong> 간단하고 직관적인 전역 상태 관리
          </li>
        </ul>

        <h2>기술 스택</h2>
        <ul>
          <li>Next.js 16 (App Router, Turbopack)</li>
          <li>React 19 (Server Components, use() hook)</li>
          <li>TypeScript 5.9</li>
          <li>TanStack Query (서버 상태)</li>
          <li>Zustand (클라이언트 상태)</li>
        </ul>
      </main>
    </div>
  );
}
