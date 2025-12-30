'use client';

import { VirtualList } from '@shared/ui';

import { ExampleLayout, InfoBox } from '../_components';
import styles from './page.module.scss';
import { useVirtualScrollList } from './useVirtualScrollList';

/**
 * Virtual Scroll 예제 페이지
 *
 * TanStack Virtual + 무한 스크롤 + 스크롤 위치 복원 데모
 */
export default function VirtualScrollPage() {
  const { posts, isLoading, isFetchingNextPage, hasNextPage, restoreState, isRestoring, markRestored, navigateToDetail, fetchNextPage } =
    useVirtualScrollList();

  if (isLoading) {
    return (
      <ExampleLayout title="Virtual Scroll" description="로딩 중...">
        <div className={styles.loadingContainer}>
          <p>데이터를 불러오는 중...</p>
        </div>
      </ExampleLayout>
    );
  }

  return (
    <ExampleLayout title="Virtual Scroll" description="대용량 데이터를 효율적으로 렌더링하고 스크롤 위치를 복원합니다.">
      <InfoBox title="💡 동작 원리">
        <ul>
          <li>화면에 보이는 영역의 아이템만 DOM에 렌더링합니다.</li>
          <li>스크롤 시 동적으로 아이템을 교체하여 성능을 최적화합니다.</li>
          <li>상세 페이지 이동 시 클릭한 아이템의 인덱스를 저장합니다.</li>
          <li>뒤로가기 시 해당 인덱스가 리스트 상단에 오도록 복원합니다.</li>
          <li>하단 근처 도달 시 자동으로 다음 페이지를 불러옵니다.</li>
        </ul>
      </InfoBox>

      <div className={styles.statusBox}>
        <strong>📊 상태:</strong> 총 {posts.length}개 게시글
        {isRestoring && <span className={styles.restored}> • 스크롤 위치 복원 중...</span>}
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
          renderLoader={({ isLoadingMore: loading }) => (
            <div className={styles.loadingIndicator}>
              <p>{loading ? '다음 페이지를 불러오는 중...' : '스크롤하면 자동으로 더 불러옵니다'}</p>
            </div>
          )}
          overscan={5}
          renderItem={(post, index) => (
            <div
              key={post.id}
              className={styles.listItem}
              onClick={() => navigateToDetail(post.id, index)}
              role="button"
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigateToDetail(post.id, index);
                }
              }}
            >
              <div className={styles.itemHeader}>
                <span className={styles.itemNumber}>#{index + 1}</span>
                <span className={styles.itemCategory}>Post ID: {post.id}</span>
              </div>
              <h3 className={styles.itemTitle}>{post.title}</h3>
              <p className={styles.itemDescription}>{post.body}</p>
            </div>
          )}
        />

        {!hasNextPage && posts.length > 0 && (
          <div className={styles.endMessage}>
            <p>🎉 모든 게시글을 불러왔습니다</p>
          </div>
        )}
      </div>
    </ExampleLayout>
  );
}
