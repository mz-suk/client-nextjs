# 데이터 패칭 가이드

React 19.2 + Next.js 16.1 + TanStack Query v5.90 최신 패턴을 활용한 데이터 패칭 가이드입니다.

## 🎯 패턴 선택 가이드

| 패턴           | 사용 시기                      | SEO | 초기 속도 | UX  |
| -------------- | ------------------------------ | --- | --------- | --- |
| SSG + CSR      | 대부분의 경우 (권장)           | ✅  | ⚡️ 빠름   | ⭐️  |
| CSR            | SEO 불필요, 실시간 데이터 필요 | ❌  | 🐢 느림   | ⚡️  |
| Infinite Query | 대량 데이터, 페이지네이션      | ✅  | ⚡️ 빠름   | ⭐️  |

### 개발자 경험

- 보일러플레이트 코드 최소화
- 명확한 JSDoc과 타입 주석
- 일관된 Factory 패턴 적용
- 모든 도메인에서 통일된 API 사용

## 📚 패턴 상세

### 1. SSG + CSR (권장) ⭐️

서버에서 데이터를 prefetch하고 클라이언트에서 hydrate하는 하이브리드 패턴입니다.

**언제 사용?**

- SEO가 중요한 페이지
- 초기 로딩 속도가 중요한 경우
- 빌드 시점에 데이터를 가져올 수 있는 경우

**Server Component (데이터 프리패칭)**

```typescript
// app/posts/page.tsx
import { PrefetchBoundary } from '@core/lib';
import { PostListSuspense, postQueries } from '@domains/post';

export default async function PostsPage() {
  return (
    <PrefetchBoundary queryOptions={postQueries.list()}>
      <PostListSuspense />
    </PrefetchBoundary>
  );
}
```

**여러 쿼리 동시 프리패칭**

```typescript
export default async function DashboardPage() {
  return (
    <PrefetchBoundary
      queryOptions={[
        postQueries.list(),
        userQueries.me(),
        statsQueries.summary(),
      ]}
    >
      <Dashboard />
    </PrefetchBoundary>
  );
}
```

**Client Component (데이터 사용)**

```typescript
// domains/post/ui/PostListSuspense.tsx
'use client';

import { useSuspensePosts } from './usePosts';

export function PostListSuspense() {
  const { data: posts } = useSuspensePosts();

  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

**장점**

- ⚡️ 빠른 초기 로딩 (서버 프리렌더링)
- ✅ SEO 최적화 (HTML에 데이터 포함)
- 🔄 클라이언트 실시간 업데이트
- 🎯 Suspense Streaming 지원

### 2. CSR (Client-Side Rendering)

클라이언트에서만 데이터를 패칭합니다.

**언제 사용?**

- SEO가 필요 없는 페이지 (대시보드, 마이페이지)
- 사용자별 개인화 데이터
- 실시간 데이터가 필요한 경우

**Page Component**

```typescript
// app/dashboard/page.tsx
'use client';

import { PostList } from '@domains/post';

export default function DashboardPage() {
  return <PostList />;
}
```

**Client Component**

```typescript
// domains/post/ui/PostList.tsx
'use client';

import { usePosts } from './usePosts';

export function PostList() {
  const { data: posts, isLoading, error } = usePosts();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

**장점**

- 🚀 간단한 구현
- ⚡️ 실시간 데이터
- 🔐 인증된 사용자 데이터

## ✏️ Mutation (데이터 변경)

데이터 생성/수정/삭제 작업을 처리합니다.

### 기본 기능

- ⚡️ 자동 전역 로딩 표시
- 🔄 성공 시 관련 쿼리 자동 무효화
- ❌ 에러 자동 처리 (GlobalErrorHandler)
- ⭐️ Optimistic Updates 지원 (NEW!)

### 1. Optimistic List Mutation (추천)

목록에 즉시 반영되어 빠른 사용자 피드백을 제공합니다.

```typescript
// domains/post/model/post.mutations.ts
import { createOptimisticListMutation } from '@core/lib';
import { postKeys } from './post.queries';

export const useCreatePost = createOptimisticListMutation(async (data: CreatePostDto) => postApi.create(data), {
  listQueryKey: postKeys.lists(),
  generateOptimisticItem: data => ({
    id: -Date.now(), // 임시 ID
    ...data,
    createdAt: new Date().toISOString(),
  }),
  position: 'start', // 'start' | 'end'
  invalidateKeys: [postKeys.lists()],
});
```

**사용**

```typescript
const createPost = useCreatePost();

await createPost.mutateAsync({
  title: '새 게시글',
  body: '내용',
  userId: 1,
});
// ⚡️ UI에 즉시 반영 → 서버 응답 → 실제 데이터로 교체
```

### 2. 기본 Mutation

간단한 변경 작업에 사용합니다. Factory 패턴으로 타입 안전성을 보장합니다.

```typescript
import { createMutation } from '@core/lib';

export const useUpdatePost = createMutation<Post, UpdatePostParams>(({ id, data }) => postApi.update(id, data), {
  invalidateKeys: [postKeys.detail(), postKeys.lists()],
  onSuccess: () => toast.success('수정 완료'),
});
```

**타입 파라미터**

- `TData`: 응답 데이터 타입
- `TVariables`: Mutation 입력 파라미터 타입
- `TError`: 에러 타입 (기본값: `DefaultError`)
- `TContext`: Context 타입 (기본값: `unknown`)

### 3. Optimistic Delete Mutation

삭제 작업을 즉시 UI에 반영합니다.

```typescript
import { createOptimisticDeleteMutation } from '@core/lib';

export const useDeletePost = createOptimisticDeleteMutation(async (id: number) => postApi.delete(id), {
  listQueryKey: postKeys.lists(),
  getId: id => id,
  invalidateKeys: [postKeys.details()],
});
```

## 🔄 Infinite Scroll

무한 스크롤 및 페이지네이션을 구현합니다.

### 주요 기능

- 📦 자동 페이지 캐싱
- ⚡️ 스크롤 기반 자동 로딩
- 🚫 중복 요청 방지
- 🎯 타입 안전한 구현

### Query 정의

```typescript
// domains/post/model/post.queries.ts
import { createInfiniteQuery, createQueryKeys } from '@core/lib';

export const postKeys = createQueryKeys('posts', {
  infinite: null,
});

export const postQueries = {
  infinite: createInfiniteQuery(postKeys.infinite(), ({ pageParam }: { pageParam: number }) => postApi.getPostsPaginated(pageParam), {
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      return lastPage.length === 10 ? lastPageParam + 1 : undefined;
    },
    staleTime: 60000,
  }),
};
```

### Hook 생성

```typescript
// domains/post/ui/useInfinitePosts.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { postQueries } from '../model';

export const useInfinitePosts = () => {
  return useInfiniteQuery(postQueries.infinite());
};
```

### 컴포넌트 사용

```typescript
'use client';

import { useInfinitePosts } from './useInfinitePosts';
import { useEffect, useRef } from 'react';

export function InfinitePostList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfinitePosts();
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const allPosts = data?.pages.flatMap(page => page) ?? [];

  return (
    <div>
      {allPosts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
      <div ref={observerTarget} />
      {isFetchingNextPage && <LoadingSpinner />}
    </div>
  );
}
```

## 🎨 전역 로딩

`GlobalLoading` 컴포넌트가 모든 Query와 Mutation을 자동으로 감지하여 로딩 UI를 표시합니다.

### 자동 감지

별도 설정 없이 자동으로 동작합니다.

```typescript
// Query 로딩 자동 감지
const { data } = useQuery(postQueries.list());

// Mutation 로딩 자동 감지
const createPost = useCreatePost();
await createPost.mutateAsync(data);
```

### 동작 방식

- `useIsFetching()`: 진행 중인 Query 감지
- `useIsMutating()`: 진행 중인 Mutation 감지
- 화면 전체 dim 처리 + 중앙 스피너 표시

## 🏗️ Query 정의 패턴

### Query Keys Factory

```typescript
import { createQueryKeys } from '@core/lib';

export const postKeys = createQueryKeys('posts', {
  all: null,
  lists: null,
  list: (params?: PostListParams) => params,
  details: null,
  detail: (id: number) => id,
});

// 사용
postKeys.all(); // ['posts', 'all']
postKeys.list(); // ['posts', 'list']
postKeys.list({ page: 1 }); // ['posts', 'list', { page: 1 }]
postKeys.detail(5); // ['posts', 'detail', 5]
```

### Query Options Factory

```typescript
import { createQuery, createInfiniteQuery } from '@core/lib';

export const postQueries = {
  // 일반 쿼리 - 타입 파라미터로 완벽한 타입 추론
  list: createQuery<Post[], PostListParams | undefined>(postKeys.lists(), params => postApi.getPosts(params), { staleTime: 60000 }),

  // 상세 쿼리
  detail: createQuery<Post, number>(postKeys.details(), id => postApi.getPost(id), { staleTime: 300000 }),

  // 무한 스크롤 쿼리 - initialPageParam 필수
  infinite: createInfiniteQuery<Post[], void, number>(postKeys.infinite(), ({ pageParam }) => postApi.getPostsPaginated(pageParam), {
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      return lastPage.length === 10 ? lastPageParam + 1 : undefined;
    },
    staleTime: 60000,
  }),
};
```

**타입 파라미터**

- `createQuery<TData, TParams>`: 데이터 타입과 파라미터 타입
- `createInfiniteQuery<TData, TParams, TPageParam>`: 데이터, 파라미터, 페이지 파라미터 타입

### API 레이어 (Zod 검증)

API 레이어에서 Zod를 사용하여 런타임 타입 검증 및 자동 타입 추론을 제공합니다.

```typescript
import { apiClient, validateResponse } from '@core/api';
import { z } from 'zod';

// Zod 스키마 정의 (타입 자동 추론)
const PostSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  userId: z.number(),
});

// 타입 추론
export type Post = z.infer<typeof PostSchema>;

// API 함수 (타입 안전성 보장)
export const postApi = {
  getPosts: async (params?: PostListParams): Promise<Post[]> => {
    const { data } = await apiClient.get('/posts', { params });
    return validateResponse(z.array(PostSchema), data);
  },

  getPost: async (id: number): Promise<Post> => {
    const { data } = await apiClient.get(`/posts/${id}`);
    return validateResponse(PostSchema, data);
  },
} as const;
```

**Zod 검증의 장점**

- 런타임 타입 검증으로 안전성 보장
- 타입 추론으로 중복 타입 정의 불필요
- 스키마 기반 문서화
- 유효성 검사 실패 시 명확한 에러 메시지

## 💡 Best Practices

### 1. Suspense 우선 사용

```typescript
// ✅ 권장 (Suspense) - 서버 프리패칭과 함께 사용
const { data } = useSuspenseQuery(postQueries.list());

// ⚠️ 필요시에만 (조건부 렌더링이 필요한 경우)
const { data, isLoading } = useQuery(postQueries.list());
```

### 2. 서버 프리패칭 활용

```typescript
// ✅ SEO + 빠른 로딩 + 완벽한 타입 추론
export default async function Page() {
  return (
    <PrefetchBoundary queryOptions={postQueries.list()}>
      <PostList />
    </PrefetchBoundary>
  );
}

// 여러 쿼리 동시 프리패칭
export default async function DashboardPage() {
  return (
    <PrefetchBoundary
      queryOptions={[
        postQueries.list(),
        userQueries.me(),
        statsQueries.summary(),
      ]}
    >
      <Dashboard />
    </PrefetchBoundary>
  );
}
```

### 3. Factory 패턴 일관성 유지

```typescript
// ✅ 권장 - 모든 Mutation에 Factory 패턴 사용
export const useCreatePost = createOptimisticListMutation<Post, CreatePostDto>(data => postApi.create(data), {
  listQueryKey: postKeys.lists(),
  generateOptimisticItem: data => ({ id: -Date.now(), ...data }),
});

// ❌ 비권장 - useMutation 직접 사용
export function useCreatePost() {
  return useMutation({
    mutationFn: data => postApi.create(data),
    // 타입 추론이 약하고 코드 중복 발생
  });
}
```

### 4. 타입 안전성 강화

```typescript
// ✅ 명시적 타입 파라미터로 안전성 보장
export const postQueries = {
  list: createQuery<Post[], PostListParams | undefined>(postKeys.lists(), params => postApi.getPosts(params), { staleTime: 60000 }),
};

// ✅ Zod 스키마로 런타임 검증
const { data } = await apiClient.get('/posts');
return validateResponse(z.array(PostSchema), data);
```

### 5. 적절한 캐시 시간 설정

```typescript
export const postQueries = {
  // 자주 변경되는 데이터: 1분
  list: createQuery<Post[], PostListParams | undefined>(postKeys.lists(), postApi.getPosts, { staleTime: 60000 }),

  // 잘 변경되지 않는 데이터: 5분
  detail: createQuery<Post, number>(postKeys.details(), postApi.getPost, { staleTime: 300000 }),
};
```

### 6. Query Key 중앙 관리

```typescript
// ✅ createQueryKeys로 타입 안전한 키 관리
export const postKeys = createQueryKeys('posts', {
  all: null,
  lists: null,
  list: (params?: PostListParams) => params,
  details: null,
  detail: (id: number) => id,
});

// 사용
postKeys.all(); // ['posts', 'all']
postKeys.list({ page: 1 }); // ['posts', 'list', { page: 1 }]
postKeys.detail(5); // ['posts', 'detail', 5]
```

## 📚 참고

- [TanStack Query v5 공식 문서](https://tanstack.com/query/latest)
- [React 19 공식 문서](https://react.dev)
- [Next.js 16 공식 문서](https://nextjs.org/docs)
- [에러 처리 가이드](./error-handling.md)
- [아키텍처 가이드](./architecture.md)
