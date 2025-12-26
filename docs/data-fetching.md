# 데이터 패칭 가이드

TanStack Query v5를 활용한 데이터 패칭 패턴을 소개합니다.

## 패턴 선택 가이드

| 패턴           | 사용 시기                      | SEO | 초기 로딩 속도 |
| -------------- | ------------------------------ | --- | -------------- |
| SSG + CSR      | 대부분의 경우 (권장)           | ✅  | ⚡️ 빠름        |
| CSR            | SEO 불필요, 실시간 데이터 필요 | ❌  | 🐢 느림        |
| Infinite Query | 대량 데이터, 페이지네이션      | ✅  | ⚡️ 빠름        |

## 패턴

### SSG + CSR (권장)

빌드 시 데이터를 prefetch하고, 클라이언트에서 hydrate하여 사용합니다.

**언제 사용하나요?**

- SEO가 중요한 페이지
- 빌드 시점에 데이터를 가져올 수 있는 경우
- 초기 로딩 속도가 중요한 경우

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

클라이언트에서만 데이터를 페칭합니다.

**언제 사용하나요?**

- SEO가 필요 없는 페이지 (대시보드, 마이페이지 등)
- 사용자별로 다른 데이터를 보여주는 경우
- 실시간 데이터가 필요한 경우

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

데이터 생성/수정/삭제 작업을 처리합니다.

**주요 기능:**

- 자동 전역 로딩 표시
- 성공 시 관련 쿼리 자동 무효화
- 에러 자동 처리 (GlobalErrorHandler)

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

무한 스크롤 및 페이지네이션을 구현합니다.

**주요 기능:**

- 자동 페이지 캐싱
- 스크롤 기반 자동 로딩
- 중복 요청 방지

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

`GlobalLoading` 컴포넌트가 모든 Query와 Mutation을 자동으로 감지하여 로딩 UI를 표시합니다.

```typescript
// 별도 설정 불필요 - 자동으로 감지됨
const { data } = useQuery(postQueries.list()); // Query 로딩 자동 감지
const mutation = useMutation({ ... });
await mutation.mutateAsync(data); // Mutation 로딩 자동 감지
```

**동작 방식:**

- `useIsFetching()`: 진행 중인 Query 감지
- `useIsMutating()`: 진행 중인 Mutation 감지
- 화면 전체 dim 처리 + 중앙 스피너 표시

## 참고

- [TanStack Query 공식 문서](https://tanstack.com/query/latest)
- [에러 처리](./error-handling.md)
