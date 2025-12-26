import { useInfiniteQuery } from '@tanstack/react-query';

import { postInfiniteQuery } from '../model';

/**
 * 무한 스크롤 게시글 목록 조회 훅
 */
export const useInfinitePosts = () => {
  return useInfiniteQuery(postInfiniteQuery());
};
