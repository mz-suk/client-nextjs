'use client';

import { PostCard, useInfinitePosts } from '@domains/example';
import { useEffect, useRef } from 'react';

/**
 * 무한 스크롤 (Infinite Scroll) 예제
 *
 * 동작 방식:
 * 1. useInfiniteQuery로 페이지네이션 데이터 관리
 * 2. Intersection Observer로 스크롤 감지
 * 3. 하단 도달 시 자동으로 다음 페이지 로드
 * 4. 전역 로딩이 자동으로 표시됨
 *
 * 장점:
 * - 초기 로딩 속도 향상 (필요한 만큼만 로드)
 * - 무한 스크롤 UX
 * - 자동 캐싱 및 중복 요청 방지
 */
export default function InfiniteScrollPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfinitePosts();
  const observerTarget = useRef<HTMLDivElement>(null);

  // Intersection Observer로 무한 스크롤 구현
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <p style={{ color: '#6b7280' }}>초기 데이터를 불러오는 중...</p>
      </div>
    );
  }

  const allPosts = data?.pages.flatMap(page => page) ?? [];

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>무한 스크롤 (Infinite Scroll)</h1>
        <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
          스크롤을 내리면 자동으로 다음 페이지를 불러옵니다.
          <br />
          useInfiniteQuery를 사용하여 페이지네이션을 관리합니다.
        </p>
      </header>

      <div style={{ marginBottom: '24px', padding: '16px', background: '#f3f4f6', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '8px' }}>💡 동작 원리</h2>
        <ul style={{ lineHeight: '1.8', color: '#4b5563', marginLeft: '20px' }}>
          <li>• Intersection Observer API로 스크롤 위치 감지</li>
          <li>• 하단 도달 시 자동으로 fetchNextPage() 호출</li>
          <li>• 페이지별 데이터는 자동으로 캐싱되어 중복 요청 방지</li>
          <li>• 전역 로딩으로 페이지 로드 상태 표시</li>
        </ul>
      </div>

      <div style={{ marginBottom: '16px', padding: '12px', background: '#eff6ff', borderRadius: '6px' }}>
        <strong>📊 현재 상태:</strong> {allPosts.length}개 게시글 로드됨
        {hasNextPage && ' • 스크롤하여 더 보기'}
        {!hasNextPage && ' • 모든 데이터 로드 완료'}
      </div>

      {/* 게시글 그리드 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '32px',
        }}
      >
        {allPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Intersection Observer 타겟 */}
      <div ref={observerTarget} style={{ height: '20px', margin: '20px 0' }} />

      {/* 로딩 상태 표시 */}
      {isFetchingNextPage && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
          <p>다음 페이지를 불러오는 중...</p>
        </div>
      )}

      {/* 더 이상 데이터가 없을 때 */}
      {!hasNextPage && allPosts.length > 0 && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#9ca3af' }}>
          <p>모든 게시글을 불러왔습니다 🎉</p>
        </div>
      )}

      {/* 가이드 */}
      <div style={{ marginTop: '40px', padding: '20px', background: '#fef3c7', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '12px' }}>🎯 테스트 방법</h3>
        <ol style={{ lineHeight: '1.8', color: '#92400e' }}>
          <li>1. 페이지 하단으로 스크롤</li>
          <li>2. 자동으로 다음 페이지가 로드됩니다</li>
          <li>3. 전역 로딩이 표시되는 것을 확인</li>
          <li>4. 총 100개의 게시글까지 로드됩니다</li>
        </ol>
      </div>
    </div>
  );
}
