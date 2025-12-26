import { useInfiniteQuery } from '@tanstack/react-query';

import { postInfiniteQuery } from '../model';

export const useInfinitePosts = () => useInfiniteQuery(postInfiniteQuery());
