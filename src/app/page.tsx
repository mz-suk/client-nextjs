import Link from 'next/link';
import styles from './page.module.scss';

export default function Home() {
  return (
    <main className={styles.container}>
      <h1>Next.js 테스트 템플릿</h1>
      <p>Next.js 16 + React 19 기반 FSD & DDD 아키텍처 템플릿</p>

      <ul>
        <li>
          <Link href="/example">예제 페이지 보기 →</Link>
        </li>
        <li>
          <Link href="/join">회원가입 페이지 보기 →</Link>
        </li>
      </ul>
    </main>
  );
}
