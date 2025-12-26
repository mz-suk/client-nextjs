# 데이터 패칭 가이드

## 패턴

### SSG + CSR (권장)

빌드 시 데이터를 prefetch하고, 클라이언트에서 hydrate하여 사용

```typescript
// app/posts/page.tsx
import { PostList, postQueries } from '@domains/post';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';

export default async function PostsPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(postQueries.list());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostList />
    </HydrationBoundary>
  );
}
```

```typescript
// domains/post/ui/PostList.tsx
'use client';

export function PostList() {
  const { data } = useSuspenseQuery(postQueries.list());
  return <div>{data.map(post => <PostCard key={post.id} post={post} />)}</div>;
}
```

**장점:** 초기 로딩 속도 + SEO + 실시간 업데이트

### CSR

클라이언트에서만 데이터 페칭

```typescript
// app/posts/page.tsx
'use client';

export default function PostsPage() {
  return <PostList />;
}
```

```typescript
// domains/post/ui/PostList.tsx
'use client';

export function PostList() {
  const { data, isLoading, error } = useQuery(postQueries.list());

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생</div>;

  return <div>{data.map(post => <PostCard key={post.id} post={post} />)}</div>;
}
```

**장점:** 간단한 구현, 실시간 데이터

## Mutation

데이터 생성/수정/삭제

```typescript
// domains/post/model/post.mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostDto) => postApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
```

```typescript
// 사용
const createPost = useCreatePost();

await createPost.mutateAsync({ title: '제목', body: '내용' });
```

## Infinite Scroll

```typescript
// domains/post/model/post.queries.ts
export const postQueries = {
  infinite: () =>
    infiniteQueryOptions({
      queryKey: ['posts', 'infinite'],
      queryFn: ({ pageParam }) => postApi.list({ page: pageParam }),
      initialPageParam: 1,
      getNextPageParam: lastPage => lastPage.nextPage,
    }),
};
```

```typescript
// 사용
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery(postQueries.infinite());
```

## 전역 로딩

Mutation 실행 중 자동으로 전역 로딩 표시

```typescript
// 자동 감지됨 - 별도 설정 불필요
const mutation = useMutation({ ... });
await mutation.mutateAsync(data); // 로딩 자동 표시
```

## 참고

- [TanStack Query 공식 문서](https://tanstack.com/query/latest)
- [에러 처리](./error-handling.md)
