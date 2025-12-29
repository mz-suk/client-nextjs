'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import { useCallback, useEffect, useRef } from 'react';

import styles from './VirtualList.module.scss';

interface ScrollInfo {
  startIndex: number;
  offsetInItem: number;
  dataLength: number;
}

interface VirtualListProps<T> {
  data: T[];
  estimateSize: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  /** 스크롤 정보 변경 콜백 (인덱스 기반) */
  onScrollChange?: (info: ScrollInfo) => void;
  /** 복원할 스크롤 정보 */
  restoreState?: { startIndex: number; offsetInItem: number } | null;
  /** 복원 완료 콜백 */
  onRestoreComplete?: () => void;
  overscan?: number;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  className?: string;
}

const LOAD_MORE_THRESHOLD = 300;

/**
 * 재사용 가능한 Virtual List 컴포넌트
 *
 * @example
 * <VirtualList
 *   data={items}
 *   estimateSize={120}
 *   renderItem={(item, index) => <ItemCard item={item} />}
 *   onScrollChange={(info) => saveScroll(info)}
 *   restoreState={savedState}
 *   onRestoreComplete={markRestored}
 * />
 */
export function VirtualList<T>({
  data,
  estimateSize,
  renderItem,
  onScrollChange,
  restoreState,
  onRestoreComplete,
  overscan = 5,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
  className,
}: VirtualListProps<T>) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isRestoredRef = useRef(false);

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => estimateSize,
    overscan,
  });

  // 스크롤 위치 복원 (인덱스 기반)
  useEffect(() => {
    if (!restoreState || isRestoredRef.current || data.length === 0) return;

    const targetIndex = Math.min(restoreState.startIndex, data.length - 1);

    // 다음 프레임에서 복원하여 DOM 렌더링 완료 보장
    requestAnimationFrame(() => {
      virtualizer.scrollToIndex(targetIndex, { align: 'start' });

      // 세부 오프셋 적용
      if (restoreState.offsetInItem > 0 && scrollContainerRef.current) {
        requestAnimationFrame(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop += restoreState.offsetInItem;
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

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    // 현재 보이는 첫 번째 아이템 정보 추출
    if (onScrollChange && data.length > 0) {
      const virtualItems = virtualizer.getVirtualItems();
      const firstItem = virtualItems[0];
      if (firstItem) {
        onScrollChange({
          startIndex: firstItem.index,
          offsetInItem: Math.max(0, scrollTop - firstItem.start),
          dataLength: data.length,
        });
      }
    }

    // 무한 스크롤
    if (onLoadMore && hasMore && !isLoadingMore) {
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      if (distanceFromBottom < LOAD_MORE_THRESHOLD) {
        onLoadMore();
      }
    }
  }, [onScrollChange, onLoadMore, hasMore, isLoadingMore, data.length, virtualizer]);

  // 스크롤 이벤트 리스너
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div ref={scrollContainerRef} className={`${styles.scrollContainer} ${className || ''}`}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map(virtualItem => {
          const item = data[virtualItem.index];
          if (!item) return null;

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
              {renderItem(item, virtualItem.index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
