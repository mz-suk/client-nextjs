import { create } from 'zustand';

export interface ScrollState {
  startIndex: number;
  offsetInItem: number;
  dataLength: number;
}

interface VirtualScrollStore {
  scrollStates: Record<string, ScrollState>;
  saveScrollState: (key: string, state: ScrollState) => void;
  getScrollState: (key: string) => ScrollState | undefined;
  clearScrollState: (key: string) => void;
}

/**
 * Virtual Scroll 상태 저장소
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
