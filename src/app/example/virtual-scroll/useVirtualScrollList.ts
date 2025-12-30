import { useInfinitePosts } from '@domains/example';
import { useScrollRestoration } from '@shared/hooks';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';

const SCROLL_STATE_KEY = 'virtual-scroll-example';

/**
 * Virtual Scroll 목록 페이지 비즈니스 로직 훅
 *
 * - 무한 스크롤 데이터 관리 (TanStack Query useInfiniteQuery)
 * - 인덱스 기반 스크롤 위치 복원
 * - 상세 페이지 네비게이션
 */
export function useVirtualScrollList() {
  const router = useRouter();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfinitePosts();

  const { savedState, rememberIndex, markRestored, isRestoring } = useScrollRestoration({
    key: SCROLL_STATE_KEY,
  });

  const allPosts = useMemo(() => data?.pages.flatMap(page => page) ?? [], [data]);

  // 복원을 위한 데이터 자동 로드
  useEffect(() => {
    if (!savedState || !isRestoring || !hasNextPage || isFetchingNextPage) return;

    const requiredLength = Math.max(savedState.dataLength, savedState.startIndex + 1);
    if (allPosts.length >= requiredLength) return;

    // 필요한 데이터가 모두 로드될 때까지 페치
    fetchNextPage();
  }, [savedState, isRestoring, allPosts.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  /**
   * 상세 페이지 이동
   *
   * @param postId - 게시글 ID
   * @param index - 클릭한 아이템 인덱스
   */
  const navigateToDetail = useCallback(
    (postId: number, index: number) => {
      rememberIndex(index, allPosts.length);
      router.push(`/example/virtual-scroll/detail?id=${postId}`);
    },
    [allPosts.length, rememberIndex, router]
  );

  // 복원 상태 (데이터가 충분히 로드된 경우에만 반환)
  const restoreState = useMemo(() => {
    if (!savedState || !isRestoring) return null;

    const requiredLength = Math.max(savedState.dataLength, savedState.startIndex + 1);
    if (allPosts.length < requiredLength && hasNextPage) return null;

    return {
      startIndex: savedState.startIndex,
      offsetInItem: 0, // 클릭한 아이템을 상단에 정렬
    };
  }, [savedState, isRestoring, allPosts.length, hasNextPage]);

  return {
    posts: allPosts,
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
