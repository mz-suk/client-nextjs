'use client';

import { ExampleLayout, InfoBox } from '@domains/example';
import { VirtualList } from '@shared/ui';

import styles from './page.module.scss';
import { useVirtualScrollList } from './useVirtualScrollList';

/**
 * Virtual Scroll 예제 페이지
 */
export default function VirtualScrollPage() {
  const { posts, isLoading, isFetchingNextPage, hasNextPage, restoreState, isRestoring, markRestored, navigateToDetail, fetchNextPage } =
    useVirtualScrollList();

  if (isLoading) {
    return (
      <ExampleLayout title="Virtual Scroll" description="로딩 중...">
        <div className={styles.loadingContainer} role="status" aria-live="polite">
          <p>데이터를 불러오는 중...</p>
        </div>
      </ExampleLayout>
    );
  }

  return (
    <ExampleLayout title="Virtual Scroll" description="대용량 데이터를 효율적으로 렌더링하고 스크롤 위치를 복원합니다.">
      <InfoBox title="💡 동작 원리">
        <ul>
          <li>화면에 보이는 영역의 아이템만 DOM에 렌더링</li>
          <li>스크롤 시 동적으로 아이템 교체</li>
          <li>상세 이동 시 클릭한 인덱스 저장</li>
          <li>뒤로가기 시 해당 인덱스를 상단에 복원</li>
          <li>하단 도달 시 자동으로 다음 페이지 로드</li>
        </ul>
      </InfoBox>

      <div className={styles.statusBox} role="status" aria-live="polite">
        <strong>📊 상태:</strong> 총 {posts.length}개{isRestoring && <span className={styles.restored}> • 복원 중</span>}
        {hasNextPage && <span> • 스크롤하여 더 보기</span>}
      </div>

      <div className={styles.listContainer}>
        <VirtualList
          data={posts}
          estimateSize={120}
          restoreState={restoreState}
          onRestoreComplete={markRestored}
          onLoadMore={fetchNextPage}
          hasMore={hasNextPage}
          isLoadingMore={isFetchingNextPage}
          renderLoader={({ isLoadingMore }) => (
            <div className={styles.loadingIndicator} role="status" aria-live="polite">
              <p>{isLoadingMore ? '다음 페이지를 불러오는 중...' : '스크롤하면 자동으로 더 불러옵니다'}</p>
            </div>
          )}
          overscan={5}
          renderItem={(post, index) => (
            <button type="button" className={styles.listItem} onClick={() => navigateToDetail(post.id, index)} aria-label={`${post.title} 상세 보기`}>
              <div className={styles.itemHeader}>
                <span className={styles.itemNumber}>#{index + 1}</span>
                <span className={styles.itemCategory}>Post ID: {post.id}</span>
              </div>
              <h3 className={styles.itemTitle}>{post.title}</h3>
              <p className={styles.itemDescription}>{post.body}</p>
            </button>
          )}
        />

        {!hasNextPage && posts.length > 0 && (
          <div className={styles.endMessage} role="status">
            <p>🎉 모든 게시글을 불러왔습니다</p>
          </div>
        )}
      </div>
    </ExampleLayout>
  );
}
