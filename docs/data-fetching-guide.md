# 데이터 패칭 가이드

## 개요

이 프로젝트는 **SSG(Static Site Generation) + CSR(Client-Side Rendering)** 하이브리드 방식으로 데이터를 관리합니다.

- **빌드 타임**: 정적 데이터를 미리 가져와 HTML 생성 (SSG)
- **런타임**: TanStack Query를 통한 클라이언트 사이드 데이터 관리 (CSR)

## 아키텍처

### DDD & FSD 혼합 구조

```
src/domains/{domain}/
├── model/              # 도메인 로직 (비즈니스 레이어)
│   ├── {entity}.types.ts    # 타입 정의
│   ├── {entity}.api.ts      # API 호출
│   ├── {entity}.queries.ts  # Query Keys & Options
│   └── index.ts
└── ui/                 # 프레젠테이션 레이어
    ├── {Component}.tsx
    ├── {Component}.module.scss
    ├── use{Entity}.ts       # Custom Hooks
    └── index.ts
```

### 레이어 책임

- **model**: 데이터 구조, API 통신, 쿼리 정의
- **ui**: 컴포넌트, 스타일, 프레젠테이션 훅

## SSG + CSR 패턴

### 1. 도메인 모델 정의

```typescript
// src/domains/example/model/post.types.ts
export interface Post {
  id: number;
  title: string;
  body: string;
}
```

### 2. API 레이어

```typescript
// src/domains/example/model/post.api.ts
import { apiClient } from '@core/api/client';
import type { Post } from './post.types';

export const postApi = {
  getPosts: async (): Promise<Post[]> => {
    const { data } = await apiClient.get<Post[]>('/posts');
    return data;
  },
} as const;
```

### 3. Query Options Factory

```typescript
// src/domains/example/model/post.queries.ts
import { queryOptions } from '@tanstack/react-query';
import { postApi } from './post.api';

export const postQueries = {
  list: () =>
    queryOptions({
      queryKey: ['posts', 'list'],
      queryFn: postApi.getPosts,
    }),
} as const;
```

### 4. Server Component (SSG)

```typescript
// src/app/example/ssg/page.tsx
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { postQueries } from '@domains/example';

export default async function SSGPage() {
  const queryClient = new QueryClient();

  // 빌드 타임에 데이터 prefetch
  await queryClient.prefetchQuery(postQueries.list());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostList />
    </HydrationBoundary>
  );
}
```

### 5. Client Component (CSR)

```typescript
// src/domains/example/ui/usePosts.ts
import { useSuspenseQuery } from '@tanstack/react-query';
import { postQueries } from '../model';

export const usePosts = () => {
  return useSuspenseQuery(postQueries.list());
};
```

```typescript
// src/domains/example/ui/PostList.tsx
'use client';

export function PostList() {
  const { data: posts } = usePosts();
  return <div>{/* 렌더링 */}</div>;
}
```

## 공통 기능

### 로딩 처리

전역 로딩은 `QueryProvider`에 통합되어 자동으로 처리됩니다.

```typescript
// src/app/layout.tsx
<QueryProvider enableGlobalLoading={true}>
  {children}
</QueryProvider>
```

### 에러 처리

`GlobalErrorHandler`를 사용하여 선언적으로 에러를 처리합니다.

```typescript
import { GlobalErrorHandler } from '@shared/ui';

<GlobalErrorHandler>
  <YourComponent />
</GlobalErrorHandler>
```

커스텀 에러 UI가 필요한 경우:

```typescript
<GlobalErrorHandler
  fallback={(error, reset) => (
    <div>
      <p>{error.message}</p>
      <button onClick={reset}>재시도</button>
    </div>
  )}
>
  <YourComponent />
</GlobalErrorHandler>
```

## 베스트 프랙티스

### ✅ DO

- Query Keys는 Factory 패턴으로 중앙 관리
- `queryOptions`를 사용하여 타입 안전성 확보
- SSG에는 `prefetchQuery`, CSR에는 `useSuspenseQuery` 사용
- 도메인별로 model/ui 레이어 분리
- API 호출은 `apiClient` 사용

### ❌ DON'T

- Query Keys를 하드코딩하지 않기
- 컴포넌트에서 직접 API 호출하지 않기
- 비즈니스 로직을 UI 레이어에 작성하지 않기

## 예제

### 실제 동작 예제

| 경로                       | 설명                            |
| -------------------------- | ------------------------------- |
| `/example`                 | 예제 목록 및 학습 가이드        |
| `/example/ssg`             | SSG + CSR 하이브리드 패턴       |
| `/example/csr`             | 순수 CSR 데이터 패칭            |
| `/example/mutation`        | 데이터 생성/수정/삭제           |
| `/example/infinite-scroll` | 무한 스크롤 (Infinite Scroll)   |
| `/example/features-demo`   | 전역 로딩/에러 처리 통합 테스트 |

### 도메인 구조 참고

`src/domains/example` - DDD & FSD 혼합 아키텍처 예제

## 전역 로딩 제어

### 동작 원리

`GlobalLoading`은 TanStack Query의 클라이언트 사이드 fetching을 자동으로 감지합니다:

```typescript
// src/shared/ui/GlobalLoading/GlobalLoading.tsx
const isFetching = useIsFetching(); // 모든 쿼리의 fetching 상태
const isMutating = useIsMutating(); // 모든 mutation의 실행 상태
const isLoading = isFetching > 0 || isMutating > 0;
```

### 언제 표시되나요?

✅ **표시되는 경우:**

- `useQuery`로 새로운 데이터를 가져올 때
- `refetch()` 실행 시
- `useMutation` 실행 중
- 캐시가 없는 상태에서 데이터 요청

❌ **표시되지 않는 경우:**

- SSG/SSR로 prefetch된 데이터 (이미 캐시에 있음)
- `Suspense` fallback (별도로 처리)
- 캐시된 데이터를 즉시 반환하는 경우

### 제어 방법

**1. 전역 로딩 비활성화**

```typescript
// src/app/layout.tsx
<QueryProvider enableGlobalLoading={false}>
  {children}
</QueryProvider>
```

**2. 특정 쿼리에서만 로딩 표시 안 함**

```typescript
// notifyOnChangeProps로 제어
const { data } = useQuery({
  ...postQueries.list(),
  notifyOnChangeProps: ['data'], // isFetching 변경 무시
});
```

**3. 로컬 로딩 상태 사용**

```typescript
const { data, isLoading } = useQuery(postQueries.list());

if (isLoading) return <div>로컬 로딩...</div>;
```

### 테스트 방법

1. `/example/features-demo` 접속
2. "전역 로딩" 탭에서 "데이터 가져오기" 버튼 클릭
3. 화면 전체가 dim 처리되고 중앙에 스피너 표시
4. 네트워크 탭에서 "Slow 3G"로 설정하면 더 명확하게 확인 가능

## 전역 에러 처리

### 기본 사용법

```typescript
import { GlobalErrorHandler } from '@shared/ui';

<GlobalErrorHandler>
  <YourComponent />
</GlobalErrorHandler>
```

### 커스텀 에러 UI

```typescript
<GlobalErrorHandler
  fallback={(error, reset) => (
    <div>
      <h2>커스텀 에러 화면</h2>
      <p>{error.message}</p>
      <button onClick={reset}>재시도</button>
    </div>
  )}
>
  <YourComponent />
</GlobalErrorHandler>
```

### ApiError 타입 감지

`GlobalErrorHandler`는 자동으로 `ApiError`를 감지하여 적절한 메시지를 표시합니다:

```typescript
if (error instanceof ApiError) {
  // API 에러 전용 UI
  // - 에러 코드 표시
  // - 상태 코드별 메시지
}
```

### 테스트 방법

1. `/example/features-demo` 접속
2. "전역 에러" 탭에서 "에러 발생시키기" 버튼 클릭
3. 우측 하단에 토스트 형태로 에러 표시
4. "재시도" 또는 "닫기" 버튼으로 제어

## Mutation (데이터 변경)

### 기본 패턴

```typescript
// 1. Mutation Hook 정의
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePostData) => {
      return await postApi.create(data);
    },
    onSuccess: () => {
      // 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
};

// 2. 컴포넌트에서 사용
const createPost = useCreatePost();

const handleSubmit = async () => {
  await createPost.mutateAsync({ title, body });
};
```

### 자동 캐시 무효화

Mutation 성공 시 관련 쿼리를 자동으로 무효화하여 최신 데이터를 유지합니다:

```typescript
onSuccess: () => {
  // 목록 쿼리 무효화 → 자동 refetch
  queryClient.invalidateQueries({ queryKey: postKeys.lists() });

  // 특정 상세 쿼리 무효화
  queryClient.invalidateQueries({ queryKey: postKeys.detail(id) });
};
```

### 테스트 방법

1. `/example/mutation` 접속
2. 제목과 내용 입력 후 "게시글 생성" 클릭
3. 전역 로딩이 표시되고 1초 후 완료
4. "수정" 또는 "삭제" 버튼으로 다른 Mutation 테스트
