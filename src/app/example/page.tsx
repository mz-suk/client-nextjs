'use client';

import Link from 'next/link';

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
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '48px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '12px' }}>데이터 패칭 예제</h1>
        <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>TanStack Query를 활용한 다양한 데이터 패칭 패턴</p>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px',
        }}
      >
        {examples.map(example => (
          <Link
            key={example.path}
            href={example.path}
            style={{
              display: 'block',
              padding: '24px',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              textDecoration: 'none',
              transition: 'all 0.2s',
              background: 'white',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.08)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>{example.title}</h2>
            <p style={{ color: '#6b7280', marginBottom: '16px', lineHeight: '1.6' }}>{example.description}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {example.tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    padding: '4px 12px',
                    background: '#eff6ff',
                    color: '#1e40af',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: '64px', padding: '24px', background: '#f9fafb', borderRadius: '12px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px' }}>📚 학습 순서 추천</h3>
        <ol style={{ lineHeight: '2', color: '#4b5563', paddingLeft: '20px' }}>
          <li>
            <strong>SSG + CSR 하이브리드</strong> - 가장 일반적인 패턴, 프로덕션에서 권장
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
