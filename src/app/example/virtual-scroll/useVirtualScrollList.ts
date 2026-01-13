import { useInfinitePosts } from '@domains/example';
import { useScrollRestoration } from '@shared/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const SCROLL_STATE_KEY = 'virtual-scroll-example';

/**
 * Virtual Scroll 목록 비즈니스 로직
 */
export function useVirtualScrollList() {
  const router = useRouter();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfinitePosts();
  const { savedState, rememberIndex, markRestored, isRestoring } = useScrollRestoration({
    key: SCROLL_STATE_KEY,
  });

  const posts = data?.pages.flatMap(page => page) ?? [];

  const navigateToDetail = (postId: number, index: number) => {
    rememberIndex(index, posts.length);
    router.push(`/example/virtual-scroll/detail?id=${postId}`);
  };

  const restoreState = (() => {
    if (!savedState || !isRestoring) return null;

    const requiredLength = Math.max(savedState.dataLength, savedState.startIndex + 1);
    if (posts.length < requiredLength && hasNextPage) return null;

    return {
      startIndex: savedState.startIndex,
      offsetInItem: 0,
    };
  })();

  // 복원 시 필요한 데이터 자동 로드
  useEffect(() => {
    if (!savedState || !isRestoring || !hasNextPage || isFetchingNextPage) return;

    const requiredLength = Math.max(savedState.dataLength, savedState.startIndex + 1);
    if (posts.length >= requiredLength) return;

    fetchNextPage();
  }, [savedState, isRestoring, posts.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    posts,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    restoreState,
    isRestoring,
    markRestored,
    navigateToDetail,
    fetchNextPage,
  };
}
