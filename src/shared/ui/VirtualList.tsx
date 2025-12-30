'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useRef } from 'react';

import styles from './VirtualList.module.scss';

interface VirtualListProps<T> {
  /** 렌더링할 데이터 배열 */
  data: T[];
  /** 각 아이템의 예상 높이 (px) - measureElement로 실제 측정됨 */
  estimateSize: number;
  /** 아이템 렌더링 함수 */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** 복원할 스크롤 상태 */
  restoreState?: { startIndex: number; offsetInItem: number } | null;
  /** 복원 완료 콜백 */
  onRestoreComplete?: () => void;
  /** 뷰포트 밖 미리 렌더링 아이템 수 (기본: 5) */
  overscan?: number;
  /** 로더 행이 뷰포트에 들어올 때 호출 */
  onLoadMore?: () => void;
  /** 더 로드할 데이터 존재 여부 */
  hasMore?: boolean;
  /** 로딩 중 여부 */
  isLoadingMore?: boolean;
  /** 로더 행 UI 커스터마이즈 */
  renderLoader?: (state: { hasMore: boolean; isLoadingMore: boolean }) => React.ReactNode;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * TanStack Virtual 기반 가상 스크롤 리스트 컴포넌트
 *
 * - measureElement로 가변 높이 자동 측정
 * - 무한 스크롤 지원 (loader-row 패턴)
 * - 인덱스 기반 스크롤 위치 복원
 *
 * @example
 * ```tsx
 * <VirtualList
 *   data={posts}
 *   estimateSize={120}
 *   renderItem={(post) => <PostCard post={post} />}
 *   onLoadMore={fetchNextPage}
 *   hasMore={hasNextPage}
 *   isLoadingMore={isFetchingNextPage}
 * />
 * ```
 */
export function VirtualList<T>({
  data,
  estimateSize,
  renderItem,
  restoreState,
  onRestoreComplete,
  overscan = 5,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
  renderLoader,
  className,
}: VirtualListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const isRestoredRef = useRef(false);
  const isFetchingRef = useRef(false);

  const hasLoaderRow = hasMore || isLoadingMore;
  const itemCount = hasLoaderRow ? data.length + 1 : data.length;

  const virtualizer = useVirtualizer({
    count: itemCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
  });

  const virtualItems = virtualizer.getVirtualItems();

  // 스크롤 위치 복원
  useEffect(() => {
    if (!restoreState || isRestoredRef.current || data.length === 0) return;

    const targetIndex = Math.min(restoreState.startIndex, data.length - 1);
    requestAnimationFrame(() => {
      virtualizer.scrollToIndex(targetIndex, { align: 'start' });

      if (restoreState.offsetInItem > 0 && parentRef.current) {
        requestAnimationFrame(() => {
          if (parentRef.current) {
            parentRef.current.scrollTop += restoreState.offsetInItem;
          }
          isRestoredRef.current = true;
          onRestoreComplete?.();
        });
      } else {
        isRestoredRef.current = true;
        onRestoreComplete?.();
      }
    });
  }, [data.length, restoreState, virtualizer, onRestoreComplete]);

  // isLoadingMore 변경 시 ref 동기화
  useEffect(() => {
    isFetchingRef.current = isLoadingMore;
  }, [isLoadingMore]);

  // 무한 스크롤 트리거 (TanStack Virtual Infinite Scroll 패턴)
  useEffect(() => {
    const [lastItem] = [...virtualItems].reverse();
    if (!lastItem || !onLoadMore) return;

    // 마지막 아이템이 로드 임계값에 도달하고, 페치 중이 아닐 때만 호출
    if (lastItem.index >= data.length - 1 && hasMore && !isFetchingRef.current) {
      isFetchingRef.current = true;
      onLoadMore();
    }
  }, [hasMore, onLoadMore, data.length, virtualItems]);

  const containerClassName = className ? `${styles.scrollContainer} ${className}` : styles.scrollContainer;

  return (
    <div ref={parentRef} className={containerClassName}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map(virtualItem => {
          const isLoaderRow = virtualItem.index >= data.length;
          const item = data[virtualItem.index];

          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              {isLoaderRow ? (
                renderLoader ? (
                  renderLoader({ hasMore, isLoadingMore })
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center' }}>
                    {isLoadingMore ? 'Loading more...' : hasMore ? 'Scroll to load more' : 'No more items'}
                  </div>
                )
              ) : item ? (
                renderItem(item, virtualItem.index)
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
