'use client';

import { PostCard, useInfinitePosts } from '@domains/example';
import { useEffect, useRef } from 'react';

import { ExampleLayout, InfoBox } from '../_components';
import styles from './page.module.scss';

/**
 * 무한 스크롤 예제
 *
 * 사용 사례:
 * - 피드 (소셜 미디어, 뉴스)
 * - 페이지네이션보다 연속적인 탐색이 중요한 긴 목록
 */
export default function InfiniteScrollPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfinitePosts();
  const observerTarget = useRef<HTMLDivElement>(null);

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
      <ExampleLayout title="무한 스크롤" description="로딩 중...">
        <div className={styles.loadingContainer}>
          <p>초기 데이터를 불러오는 중...</p>
        </div>
      </ExampleLayout>
    );
  }

  const allPosts = data?.pages.flatMap(page => page) ?? [];

  return (
    <ExampleLayout title="무한 스크롤" description="스크롤이 하단에 도달하면 자동으로 다음 페이지를 불러옵니다.">
      <InfoBox title="💡 동작 원리">
        <ul>
          <li>`IntersectionObserver`를 사용하여 하단 도달 여부를 감지합니다.</li>
          <li>도달 시 자동으로 `fetchNextPage()`를 호출합니다.</li>
          <li>페이지별 데이터는 캐싱되어 불필요한 재요청을 방지합니다.</li>
        </ul>
      </InfoBox>

      <div className={styles.statusBox}>
        <strong>📊 상태:</strong> {allPosts.length}개 게시글 로드됨
        {hasNextPage ? ' • 스크롤하여 더 보기' : ' • 모든 데이터 로드 완료'}
      </div>

      <div className={styles.grid}>
        {allPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Intersection Observer 타겟 */}
      <div ref={observerTarget} className={styles.observerTarget} />

      {isFetchingNextPage && (
        <div className={styles.loadingMessage}>
          <p>다음 페이지를 불러오는 중...</p>
        </div>
      )}

      {!hasNextPage && allPosts.length > 0 && (
        <div className={styles.endMessage}>
          <p>🎉 모든 게시글을 불러왔습니다</p>
        </div>
      )}
    </ExampleLayout>
  );
}
