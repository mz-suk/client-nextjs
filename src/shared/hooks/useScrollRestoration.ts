import { useVirtualScrollStore } from '@shared/stores/useVirtualScrollStore';
import { usePathname } from 'next/navigation';
import { useCallback, useMemo, useRef } from 'react';

interface UseScrollRestorationOptions {
  key?: string;
  autoClear?: boolean;
}

interface ScrollState {
  startIndex: number;
  offsetInItem: number;
  dataLength: number;
}

/**
 * 가상 스크롤 위치 저장/복원 훅
 *
 * @example
 * ```tsx
 * const { savedState, rememberIndex, markRestored } = useScrollRestoration({ key: 'my-list' });
 *
 * <VirtualList
 *   restoreState={savedState}
 *   onRestoreComplete={markRestored}
 *   renderItem={(item, index) => (
 *     <button onClick={() => rememberIndex(index, data.length)}>상세</button>
 *   )}
 * />
 * ```
 */
export function useScrollRestoration(options: UseScrollRestorationOptions = {}) {
  const pathname = usePathname();
  const key = options.key ?? pathname;
  const autoClear = options.autoClear ?? true;

  const { saveScrollState, getScrollState, clearScrollState } = useVirtualScrollStore();
  const hasRestoredRef = useRef(false);

  const savedState = useMemo(() => getScrollState(key), [getScrollState, key]);

  const rememberIndex = useCallback(
    (index: number, dataLength: number, offsetInItem = 0) => {
      const state: ScrollState = {
        startIndex: Math.max(0, index),
        offsetInItem: Math.max(0, offsetInItem),
        dataLength: Math.max(dataLength, index + 1),
      };
      saveScrollState(key, state);
    },
    [key, saveScrollState]
  );

  const markRestored = useCallback(() => {
    if (hasRestoredRef.current || !savedState) return;
    hasRestoredRef.current = true;

    if (autoClear) {
      clearScrollState(key);
    }
  }, [autoClear, clearScrollState, key, savedState]);

  const clearScroll = useCallback(() => {
    clearScrollState(key);
    hasRestoredRef.current = false;
  }, [key, clearScrollState]);

  return {
    savedState,
    rememberIndex,
    markRestored,
    clearScroll,
    isRestoring: !!savedState && !hasRestoredRef.current,
  };
}
