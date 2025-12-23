import Link from 'next/link';

import styles from './page.module.css';

/**
 * 예제 페이지 인덱스
 */
export default function ExampleIndexPage() {
  const examples = [
    {
      title: 'SSG + TanStack Query',
      description: '빌드 타임에 데이터를 prefetch하고 클라이언트에서 TanStack Query로 관리',
      href: '/example/ssg',
      features: ['초기 로딩 속도 향상', 'SEO 최적화', '자동 리페치 및 캐싱'],
    },
    {
      title: 'CSR + TanStack Query',
      description: '완전히 클라이언트에서 데이터를 페칭하고 관리',
      href: '/example/csr',
      features: ['로딩/에러 상태 자동 관리', '백그라운드 업데이트', '캐싱 전략'],
    },
    {
      title: 'Zustand 상태 관리',
      description: '간단하고 직관적한 전역 상태 관리',
      href: '/example/zustand',
      features: ['DevTools 지원', 'localStorage 동기화', 'TypeScript 완벽 지원'],
    },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>예제 페이지</h1>
        <p className={styles.description}>Next.js 16 + React 19 기반 다양한 패턴의 예제를 확인하세요</p>
      </header>

      <div className={styles.grid}>
        {examples.map(example => (
          <Link key={example.href} href={example.href} className={styles.card}>
            <h2>{example.title}</h2>
            <p className={styles.cardDescription}>{example.description}</p>
            <ul className={styles.features}>
              {example.features.map(feature => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <div className={styles.arrow}>→</div>
          </Link>
        ))}
      </div>

      <footer className={styles.footer}>
        <Link href="/" className={styles.backLink}>
          ← 홈으로 돌아가기
        </Link>
      </footer>
    </div>
  );
}
