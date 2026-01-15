'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useRef } from 'react';

import styles from './VirtualList.module.scss';

interface RestoreState {
  startIndex: number;
  offsetInItem: number;
}

interface LoaderRenderProps {
  hasMore: boolean;
  isLoadingMore: boolean;
}

interface VirtualListProps<T> {
  data: T[];
  estimateSize: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  restoreState?: RestoreState | null;
  onRestoreComplete?: () => void;
  overscan?: number;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  renderLoader?: (props: LoaderRenderProps) => React.ReactNode;
  className?: string;
}

/**
 * TanStack Virtual 기반 가상 스크롤 리스트
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

  // eslint-disable-next-line react-hooks/incompatible-library
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

      if (restoreState.offsetInItem > 0) {
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

  // 로딩 상태 동기화
  useEffect(() => {
    isFetchingRef.current = isLoadingMore;
  }, [isLoadingMore]);

  // 무한 스크롤 트리거
  useEffect(() => {
    const [lastItem] = [...virtualItems].reverse();
    if (!lastItem || !onLoadMore || !hasMore || isFetchingRef.current) return;

    if (lastItem.index >= data.length - 1) {
      isFetchingRef.current = true;
      onLoadMore();
    }
  }, [hasMore, onLoadMore, data.length, virtualItems]);

  const defaultLoader = ({ hasMore, isLoadingMore }: LoaderRenderProps) => (
    <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
      {isLoadingMore ? 'Loading more...' : hasMore ? 'Scroll to load more' : 'No more items'}
    </div>
  );

  const containerClassName = className ? `${styles.scrollContainer} ${className}` : styles.scrollContainer;

  return (
    <div ref={parentRef} className={containerClassName} role="list" aria-busy={isLoadingMore}>
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
              role={isLoaderRow ? 'status' : 'listitem'}
            >
              {isLoaderRow ? (renderLoader ?? defaultLoader)({ hasMore, isLoadingMore }) : item ? renderItem(item, virtualItem.index) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
