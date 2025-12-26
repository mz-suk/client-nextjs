'use client';

import { PostCard, useInfinitePosts } from '@domains/example';
import { useIntersectionObserver } from '@shared/hooks';

import { ExampleLayout, InfoBox } from '../_components';
import styles from './page.module.scss';

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

  // 커스텀 훅을 사용하여 무한 스크롤 구현
  const observerRef = useIntersectionObserver({
    onIntersect: fetchNextPage,
    enabled: hasNextPage && !isFetchingNextPage,
    threshold: 0.1,
  });

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <p>초기 데이터를 불러오는 중...</p>
      </div>
    );
  }

  const allPosts = data?.pages.flatMap(page => page) ?? [];

  return (
    <ExampleLayout
      title="무한 스크롤 (Infinite Scroll)"
      description="스크롤을 내리면 자동으로 다음 페이지를 불러옵니다. useInfiniteQuery를 사용하여 페이지네이션을 관리합니다."
    >
      <InfoBox title="💡 동작 원리">
        <ul>
          <li>• useIntersectionObserver 훅으로 스크롤 위치 감지</li>
          <li>• 하단 도달 시 자동으로 fetchNextPage() 호출</li>
          <li>• 페이지별 데이터는 자동으로 캐싱되어 중복 요청 방지</li>
          <li>• 전역 로딩으로 페이지 로드 상태 표시</li>
        </ul>
      </InfoBox>

      <div className={styles.statusBox}>
        <strong>📊 현재 상태:</strong> {allPosts.length}개 게시글 로드됨
        {hasNextPage && ' • 스크롤하여 더 보기'}
        {!hasNextPage && ' • 모든 데이터 로드 완료'}
      </div>

      {/* 게시글 그리드 */}
      <div className={styles.grid}>
        {allPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Intersection Observer 타겟 */}
      <div ref={observerRef} className={styles.observerTarget} />

      {/* 로딩 상태 표시 */}
      {isFetchingNextPage && (
        <div className={styles.loadingMessage}>
          <p>다음 페이지를 불러오는 중...</p>
        </div>
      )}

      {/* 더 이상 데이터가 없을 때 */}
      {!hasNextPage && allPosts.length > 0 && (
        <div className={styles.endMessage}>
          <p>모든 게시글을 불러왔습니다 🎉</p>
        </div>
      )}

      <InfoBox title="🎯 테스트 방법" variant="info">
        <ol>
          <li>1. 페이지 하단으로 스크롤</li>
          <li>2. 자동으로 다음 페이지가 로드됩니다</li>
          <li>3. 전역 로딩이 표시되는 것을 확인</li>
          <li>4. 총 100개의 게시글까지 로드됩니다</li>
        </ol>
      </InfoBox>
    </ExampleLayout>
  );
}
