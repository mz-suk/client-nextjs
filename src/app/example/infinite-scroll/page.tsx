'use client';

import { PostCard, useInfinitePosts } from '@domains/example';
import { useIntersectionObserver } from '@shared/hooks';

import { ExampleLayout, InfoBox } from '../_components';
import styles from './page.module.scss';

export default function InfiniteScrollPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfinitePosts();

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
          <li>
            • <strong>useInfiniteQuery</strong>: 페이지네이션 된 데이터를 관리하고 캐싱합니다.
          </li>
          <li>
            • <strong>useIntersectionObserver</strong>: 사용자가 페이지 하단에 도달했는지 감지합니다.
          </li>
          <li>
            • <strong>Interaction</strong>: 하단 감지 시 <code>fetchNextPage()</code>가 자동으로 호출됩니다.
          </li>
          <li>
            • <strong>UX</strong>: 사용자는 끊김 없이 계속해서 콘텐츠를 소비할 수 있습니다.
          </li>
        </ul>
      </InfoBox>

      <div className={styles.statusBox}>
        <strong>📊 현재 상태:</strong> {allPosts.length}개 게시글 로드됨
        {hasNextPage && ' • 스크롤하여 더 보기'}
        {!hasNextPage && ' • 모든 데이터 로드 완료'}
      </div>

      <div className={styles.grid}>
        {allPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <div ref={observerRef} className={styles.observerTarget} />

      {isFetchingNextPage && (
        <div className={styles.loadingMessage}>
          <p>다음 페이지를 불러오는 중...</p>
        </div>
      )}

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
