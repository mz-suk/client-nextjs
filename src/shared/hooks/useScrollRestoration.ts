import { useVirtualScrollStore } from '@shared/stores/useVirtualScrollStore';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef } from 'react';

const SCROLL_SAVE_THROTTLE = 100;

interface UseScrollRestorationOptions {
  /** 스크롤 상태를 저장할 고유 키 (기본값: pathname) */
  key?: string;
  /** 복원 후 상태 자동 삭제 여부 (기본값: true) */
  autoClear?: boolean;
}

interface ScrollInfo {
  startIndex: number;
  offsetInItem: number;
  dataLength: number;
}

/**
 * 스크롤 위치 저장 및 복원을 관리하는 커스텀 훅
 *
 * 인덱스 기반 저장으로 정확한 위치 복원 보장
 *
 * @example
 * const { savedState, saveScroll, clearScroll } = useScrollRestoration({ key: 'my-list' });
 */
export function useScrollRestoration(options: UseScrollRestorationOptions = {}) {
  const pathname = usePathname();
  const key = options.key ?? pathname;
  const autoClear = options.autoClear ?? true;

  const saveScrollState = useVirtualScrollStore(state => state.saveScrollState);
  const getScrollState = useVirtualScrollStore(state => state.getScrollState);
  const clearScrollState = useVirtualScrollStore(state => state.clearScrollState);

  // 마운트 시점의 저장 상태 캐싱
  const savedState = useMemo(() => getScrollState(key), [getScrollState, key]);
  const hasRestored = useRef(false);
  const lastSaveTime = useRef(0);

  // 스크롤 위치 저장 (Throttle 적용)
  const saveScroll = useCallback(
    (info: ScrollInfo) => {
      const now = Date.now();
      if (now - lastSaveTime.current >= SCROLL_SAVE_THROTTLE) {
        saveScrollState(key, info);
        lastSaveTime.current = now;
      }
    },
    [key, saveScrollState]
  );

  // 스크롤 상태 삭제
  const clearScroll = useCallback(() => {
    clearScrollState(key);
  }, [key, clearScrollState]);

  // 복원 완료 표시 및 자동 삭제
  const markRestored = useCallback(() => {
    if (hasRestored.current || !savedState) return;
    hasRestored.current = true;

    if (autoClear) {
      clearScroll();
    }
  }, [autoClear, clearScroll, savedState]);

  // 언마운트 시 복원되지 않은 상태 유지
  useEffect(() => {
    return () => {
      if (!hasRestored.current && savedState) {
        // 복원 안됐으면 상태 유지 (다른 페이지로 이동한 경우)
      }
    };
  }, [savedState]);

  return {
    savedState,
    saveScroll,
    clearScroll,
    markRestored,
    isRestoring: !!savedState && !hasRestored.current,
  };
}
