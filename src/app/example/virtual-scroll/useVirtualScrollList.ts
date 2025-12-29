import { useInfinitePosts } from '@domains/example';
import { useScrollRestoration } from '@shared/hooks';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';

const SCROLL_STATE_KEY = 'virtual-scroll-example';

interface ScrollInfo {
  startIndex: number;
  offsetInItem: number;
  dataLength: number;
}

/**
 * Virtual Scroll 목록 페이지 로직 관리 훅
 *
 * - 무한 스크롤 데이터 로드
 * - 인덱스 기반 스크롤 위치 저장/복원
 * - 상세 페이지 네비게이션
 */
export function useVirtualScrollList() {
  const router = useRouter();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfinitePosts();

  const { savedState, saveScroll, markRestored, isRestoring } = useScrollRestoration({
    key: SCROLL_STATE_KEY,
  });

  const allPosts = useMemo(() => data?.pages.flatMap(page => page) ?? [], [data]);

  // 복원을 위한 데이터 자동 로드
  useEffect(() => {
    if (!savedState || !isRestoring) return;

    const targetLength = savedState.dataLength;
    if (allPosts.length >= targetLength || !hasNextPage || isFetchingNextPage) return;

    fetchNextPage();
  }, [savedState, isRestoring, allPosts.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 스크롤 변경 시 저장
  const handleScrollChange = useCallback(
    (info: ScrollInfo) => {
      if (allPosts.length > 0) {
        saveScroll(info);
      }
    },
    [allPosts.length, saveScroll]
  );

  // 상세 페이지 이동
  const navigateToDetail = useCallback(
    (postId: number) => {
      router.push(`/example/virtual-scroll/detail?id=${postId}`);
    },
    [router]
  );

  // 복원할 상태 (데이터가 충분히 로드된 경우에만)
  const restoreState = useMemo(() => {
    if (!savedState || !isRestoring) return null;
    if (allPosts.length < savedState.dataLength && hasNextPage) return null;
    return { startIndex: savedState.startIndex, offsetInItem: savedState.offsetInItem };
  }, [savedState, isRestoring, allPosts.length, hasNextPage]);

  return {
    posts: allPosts,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    restoreState,
    isRestoring,
    handleScrollChange,
    markRestored,
    navigateToDetail,
    fetchNextPage,
  };
}
