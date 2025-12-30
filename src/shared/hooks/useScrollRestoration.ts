import { useVirtualScrollStore } from '@shared/stores/useVirtualScrollStore';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef } from 'react';

interface UseScrollRestorationOptions {
  /** 스크롤 상태를 저장할 고유 키 (기본값: pathname) */
  key?: string;
  /** 복원 후 상태 자동 삭제 여부 (기본값: true) */
  autoClear?: boolean;
}

interface ScrollState {
  startIndex: number;
  offsetInItem: number;
  dataLength: number;
}

/**
 * 가상 스크롤 위치 저장 및 복원 훅
 *
 * 인덱스 기반으로 스크롤 위치를 저장하고 복원합니다.
 * Zustand store를 사용하여 상태를 관리하며, 복원 후 자동 정리합니다.
 *
 * @example
 * ```tsx
 * const { savedState, rememberIndex, markRestored } = useScrollRestoration({ key: 'my-list' });
 *
 * // 상세 이동 시
 * <button onClick={() => rememberIndex(index, data.length)}>상세 보기</button>
 *
 * // 복원 시
 * <VirtualList restoreState={savedState} onRestoreComplete={markRestored} />
 * ```
 */
export function useScrollRestoration(options: UseScrollRestorationOptions = {}) {
  const pathname = usePathname();
  const key = options.key ?? pathname;
  const autoClear = options.autoClear ?? true;

  const saveScrollState = useVirtualScrollStore(state => state.saveScrollState);
  const getScrollState = useVirtualScrollStore(state => state.getScrollState);
  const clearScrollState = useVirtualScrollStore(state => state.clearScrollState);

  const savedState = useMemo(() => getScrollState(key), [getScrollState, key]);
  const hasRestoredRef = useRef(false);

  /**
   * 상세 이동 시 클릭한 인덱스 저장
   *
   * @param index - 클릭한 아이템 인덱스
   * @param dataLength - 현재 데이터 총 개수
   * @param offsetInItem - 아이템 내 세부 오프셋 (기본값: 0)
   */
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

  /**
   * 복원 완료 표시 및 자동 정리
   */
  const markRestored = useCallback(() => {
    if (hasRestoredRef.current || !savedState) return;
    hasRestoredRef.current = true;

    if (autoClear) {
      clearScrollState(key);
    }
  }, [autoClear, clearScrollState, key, savedState]);

  /**
   * 저장된 상태 수동 삭제
   */
  const clearScroll = useCallback(() => {
    clearScrollState(key);
    hasRestoredRef.current = false;
  }, [key, clearScrollState]);

  // 컴포넌트 언마운트 시 정리 (복원되지 않은 경우 상태 유지)
  useEffect(() => {
    return () => {
      // 복원 안된 상태는 유지 (다른 페이지로 이동 후 뒤로가기 대응)
    };
  }, []);

  return {
    /** 저장된 스크롤 상태 */
    savedState,
    /** 상세 이동 시 인덱스 저장 */
    rememberIndex,
    /** 복원 완료 표시 */
    markRestored,
    /** 상태 수동 삭제 */
    clearScroll,
    /** 복원 진행 중 여부 */
    isRestoring: !!savedState && !hasRestoredRef.current,
  };
}
