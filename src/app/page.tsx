import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <main>
        <h1>Next.js 범용 템플릿</h1>
        <p>Next.js 16 + React 19 기반 DDD 아키텍처 템플릿</p>

        <div>
          <Link href="/example">예제 페이지 보기 →</Link>
        </div>

        <h2>주요 기능</h2>
        <ul>
          <li>
            <strong>SSG + CSR(TanStack Query):</strong> 빌드 타임 데이터 prefetch + 클라이언트 상태 관리
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
