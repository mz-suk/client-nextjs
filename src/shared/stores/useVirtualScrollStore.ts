import { create } from 'zustand';

interface ScrollState {
  /** 첫 번째 보이는 아이템 인덱스 */
  startIndex: number;
  /** 해당 아이템 내 세부 오프셋 (정밀 복원용) */
  offsetInItem: number;
  /** 저장 시점의 데이터 개수 */
  dataLength: number;
}

interface VirtualScrollStore {
  scrollStates: Record<string, ScrollState>;
  saveScrollState: (key: string, state: ScrollState) => void;
  getScrollState: (key: string) => ScrollState | undefined;
  clearScrollState: (key: string) => void;
}

/**
 * Virtual Scroll 상태 관리 Store
 *
 * 인덱스 기반으로 스크롤 위치를 저장/복원하여 정확한 위치 복원 보장
 */
export const useVirtualScrollStore = create<VirtualScrollStore>((set, get) => ({
  scrollStates: {},

  saveScrollState: (key, state) =>
    set(prev => ({
      scrollStates: { ...prev.scrollStates, [key]: state },
    })),

  getScrollState: key => get().scrollStates[key],

  clearScrollState: key =>
    set(prev => {
      const { [key]: _, ...rest } = prev.scrollStates;
      return { scrollStates: rest };
    }),
}));
