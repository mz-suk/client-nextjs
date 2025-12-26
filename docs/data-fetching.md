# 데이터 패칭 가이드

Next.js 16 + React 19 + TanStack Query v5 기반 데이터 패칭 패턴입니다.

## 빠른 시작

### 기본 패턴 (SSG + CSR)

```typescript
// app/posts/page.tsx
import { Prefetch } from '@core/lib';
import { PostList, postQueries } from '@domains/post';

export default async function PostsPage() {
  return (
    <Prefetch queries={[postQueries.list()]}>
      <PostList />
    </Prefetch>
  );
}
```

### 병렬 패칭

```typescript
await Promise.all([queryClient.ensureQueryData(postQueries.list()), queryClient.ensureQueryData(userQueries.me())]);
```

### Optimistic Updates

```typescript
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: data => postApi.create(data),
    onMutate: async newPost => {
      await queryClient.cancelQueries({ queryKey: postQueries.keys.list() });
      const previousPosts = queryClient.getQueryData(postQueries.keys.list());

      queryClient.setQueryData(postQueries.keys.list(), old => [...old, newPost]);

      return { previousPosts };
    },
    onError: (err, newPost, context) => {
      queryClient.setQueryData(postQueries.keys.list(), context.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postQueries.keys.list() });
    },
  });
};
```

## Query Factory 패턴

### Query 정의

```typescript
// domains/post/model/post.queries.ts
import { createQueryFactory } from '@core/lib';

export const postQueries = createQueryFactory('posts', {
  list: (params?) => ({
    queryFn: () => postApi.list(params),
    ...(params && { params }),
  }),

  detail: (id: number) => ({
    queryFn: () => postApi.detail(id),
    id,
  }),
});
```

### 사용법

```typescript
// 쿼리 사용
useQuery(postQueries.list());
useSuspenseQuery(postQueries.detail(1));

// 캐시 무효화
queryClient.invalidateQueries({ queryKey: postQueries.keys.list() });
queryClient.invalidateQueries({ queryKey: postQueries.keys.detail(1) });
```

## 최적화 기법

### 1. React 19 cache API

```typescript
// core/lib/query-client.ts
export const getQueryClient = cache(() => new QueryClient({...}));
```

### 2. ensureQueryData

```typescript
// prefetchQuery 대신 ensureQueryData 사용
await queryClient.ensureQueryData(postQueries.list());
```

### 3. 조건부 재시도

```typescript
retry: (failureCount, error) => {
  // 4xx 에러는 재시도 안함
  if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
    return false;
  }
  // 5xx 에러는 최대 3회까지
  return failureCount < 3;
};
```

### 4. Infinite Query 최적화

```typescript
infiniteQueryOptions({
  queryKey: ['posts', 'infinite'],
  queryFn: ({ pageParam }) => postApi.list({ page: pageParam }),
  initialPageParam: 1,
  getNextPageParam: (lastPage, allPages) => (lastPage.length === 10 ? allPages.length + 1 : undefined),
  maxPages: 10, // 메모리 누수 방지
  refetchOnMount: false,
  refetchOnWindowFocus: false,
});
```

## 예제 페이지

| 경로                         | 설명                |
| ---------------------------- | ------------------- |
| `/example/ssg`               | SSG + CSR 기본 패턴 |
| `/example/parallel-fetching` | 병렬 데이터 패칭    |
| `/example/streaming`         | Suspense Streaming  |
| `/example/csr`               | 순수 CSR            |
| `/example/mutation`          | Optimistic Updates  |
| `/example/infinite-scroll`   | 무한 스크롤         |

## 참고

- [TanStack Query 공식 문서](https://tanstack.com/query/latest)
- [아키텍처 가이드](./architecture.md)
- [에러 처리 가이드](./error-handling.md)
