'use client';

import Link from 'next/link';

import styles from './page.module.scss';

/**
 * 예제 목록 페이지
 */
export default function ExampleIndexPage() {
  const examples = [
    {
      title: 'SSG + CSR 하이브리드',
      path: '/example/ssg',
      description: '빌드 타임에 데이터를 prefetch하고 클라이언트에서 hydrate',
      tags: ['SSG', 'Prefetch', 'Hydration'],
    },
    {
      title: '병렬 데이터 패칭',
      path: '/example/parallel-fetching',
      description: 'Promise.all을 활용한 병렬 패칭으로 워터폴 방지',
      tags: ['Parallel', 'Promise.all', 'Optimization'],
    },
    {
      title: 'Suspense Streaming',
      path: '/example/streaming',
      description: 'Suspense를 활용한 점진적 UI 렌더링',
      tags: ['Streaming', 'Suspense', 'UX'],
    },
    {
      title: 'CSR 데이터 패칭',
      path: '/example/csr',
      description: '클라이언트에서만 데이터를 가져오는 순수 CSR 패턴',
      tags: ['CSR', 'Client-Only'],
    },
    {
      title: 'Mutation (데이터 변경)',
      path: '/example/mutation',
      description: '생성, 수정, 삭제 등 데이터 변경 작업 예제',
      tags: ['Mutation', 'Create', 'Update', 'Delete'],
    },
    {
      title: '무한 스크롤',
      path: '/example/infinite-scroll',
      description: 'Intersection Observer와 useInfiniteQuery를 활용한 무한 스크롤',
      tags: ['Infinite', 'Scroll', 'Pagination'],
    },
    {
      title: '전역 기능 테스트',
      path: '/example/features-demo',
      description: 'GlobalLoading과 GlobalErrorHandler 통합 테스트',
      tags: ['Loading', 'Error', 'Features'],
    },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>데이터 패칭 예제</h1>
        <p>TanStack Query를 활용한 다양한 데이터 패칭 패턴</p>
      </header>

      <div className={styles.grid}>
        {examples.map(example => (
          <Link key={example.path} href={example.path} className={styles.card}>
            <h2>{example.title}</h2>
            <p>{example.description}</p>
            <div className={styles.tags}>
              {example.tags.map(tag => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      <div className={styles.guide}>
        <h3>📚 학습 순서 추천</h3>
        <ol>
          <li>
            <strong>SSG + CSR 하이브리드</strong> - 가장 일반적인 패턴, 프로덕션에서 권장
          </li>
          <li>
            <strong>병렬 데이터 패칭</strong> - 성능 최적화 필수 기법
          </li>
          <li>
            <strong>Suspense Streaming</strong> - 사용자 경험(UX) 개선
          </li>
          <li>
            <strong>전역 기능 테스트</strong> - 로딩과 에러 처리 동작 원리 이해
          </li>
          <li>
            <strong>CSR 데이터 패칭</strong> - 순수 클라이언트 사이드 패턴
          </li>
          <li>
            <strong>Mutation</strong> - 데이터 변경 작업 및 캐시 무효화
          </li>
          <li>
            <strong>무한 스크롤</strong> - 페이지네이션 및 무한 스크롤 패턴
          </li>
        </ol>
      </div>
    </div>
  );
}
