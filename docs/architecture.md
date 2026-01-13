# 아키텍처 가이드

FSD(Feature-Sliced Design)와 DDD(Domain-Driven Design)를 혼합한 아키텍처입니다.

## 프로젝트 구조

```
src/
├── app/          # Next.js App Router (페이지, 레이아웃, 에러 처리)
├── core/         # 공통 환경 (API, Config, Logger, Factory)
├── domains/      # 비즈니스 로직 (도메인별 분리)
└── shared/       # 공용 컴포넌트 (UI, Providers, Hooks, Stores)
```

### 계층별 역할

- **app/**: 라우팅과 페이지 구성, 비즈니스 로직은 domains에 위임
- **core/**: API 클라이언트, 환경 설정, Query/Mutation Factory, 로거
- **domains/**: 비즈니스 도메인별로 격리된 로직 (model, ui, hooks, components)
- **shared/**: 도메인 독립적인 재사용 가능한 UI, Hooks, Stores

## Core (공통 환경)

### API 클라이언트

```typescript
import { apiClient } from '@core/api';

// GET
const user = await apiClient.get<User>('/users/me');

// POST
await apiClient.post('/users', { name: 'John' });

// PUT / PATCH
await apiClient.put('/users/1', { name: 'John' });
await apiClient.patch('/users/1', { name: 'John' });

// DELETE
await apiClient.delete('/users/1');

// File Upload
await apiClient.upload('/files', { file: fileObject });

// 인터셉터
apiClient.addRequestInterceptor(async config => {
  config.headers = { ...config.headers, 'X-Custom': 'value' };
  return config;
});
```

**주요 기능:**

- 자동 토큰 갱신 (401 에러 시 자동 refresh 및 재시도)
- 요청/응답 인터셉터
- 타임아웃 처리 (기본 30초)
- 타입 안전성 (TypeScript 완벽 지원)
- 서버/클라이언트 환경 자동 처리
- FormData 자동 처리 (upload)

### 환경 변수

`.env.local` 파일에 다음 변수들을 설정하세요:

```env
# 클라이언트 API 엔드포인트 (브라우저에서 접근)
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# API 요청 타임아웃 (밀리초)
NEXT_PUBLIC_API_TIMEOUT=30000

# API Accept-Language 헤더
NEXT_PUBLIC_API_ACCEPT_LANGUAGE=ko-KR

# 디버그 모드 활성화
NEXT_PUBLIC_FEATURE_DEBUG=true

# SSR 전용 API 엔드포인트 (서버에서만 접근)
API_TARGET_URL=http://backend:8080
```

### Logger

```typescript
import { logger } from '@core/lib';

logger.info('메시지');
logger.error('에러', error);
logger.debug('디버그 정보');
```

## Domains (비즈니스 로직)

### 구조

각 도메인은 비즈니스 로직에 따라 자유롭게 구성하되, 외부 노출은 `index.ts`를 통해서만:

```
domains/{domain}/
├── model/                      # 비즈니스 로직 (API, Types, Queries, Mutations)
│   ├── {entity}.types.ts      # 타입 정의
│   ├── {entity}.api.ts        # API 호출 함수
│   ├── {entity}.queries.ts    # Query 정의
│   └── {entity}.mutations.ts  # Mutation 정의
├── ui/                         # 프레젠테이션 컴포넌트
│   ├── {Component}.tsx
│   └── {Component}.module.scss
├── hooks/                      # Custom Hooks
│   └── use{Entity}.ts
├── components/                 # 도메인 전용 컴포넌트
├── stores/                     # Zustand Store (도메인 전용)
├── schemas/                    # Zod 스키마
├── services/                   # 비즈니스 서비스 로직
└── index.ts                    # Public API
```

**규칙**:

- 각 도메인은 `index.ts`를 통해서만 외부에 노출
- 도메인 간 직접 참조 금지 (index.ts를 통해서만)

### 예시

```typescript
// model/post.types.ts
export interface Post {
  id: number;
  title: string;
}

// model/post.api.ts
import { apiClient } from '@core/api';

export const postApi = {
  list: () => apiClient.get<Post[]>('/posts'),
  detail: (id: number) => apiClient.get<Post>(`/posts/${id}`),
};

// model/post.queries.ts
import { createQuery, createQueryKeys } from '@core/lib';

export const postKeys = createQueryKeys('posts', {
  all: null,
  lists: null,
  list: (params?: PostListParams) => params,
  details: null,
  detail: (id: number) => id,
});

export const postQueries = {
  list: createQuery<Post[], PostListParams | undefined>(postKeys.lists(), params => postApi.getPosts(params), { staleTime: 60000 }),
  detail: createQuery<Post, number>(postKeys.details(), id => postApi.getPost(id), { staleTime: 300000 }),
};

// hooks/usePosts.ts
import { useSuspenseQuery } from '@tanstack/react-query';
import { postQueries } from '../model';

export const useSuspensePosts = (params?: PostListParams) => {
  return useSuspenseQuery(postQueries.list(params));
};
```

## Shared (공용 컴포넌트)

### UI 컴포넌트

```typescript
import { VirtualList, BottomSheet, Accordion, GlobalLoading } from '@shared/ui';
```

### Providers

```typescript
import { QueryProvider, AuthProvider } from '@shared/providers';

<AuthProvider>
  <QueryProvider>{children}</QueryProvider>
</AuthProvider>
```

### Hooks

```typescript
import { useScrollRestoration, useIntersectionObserver } from '@shared/hooks';
```

### Stores

```typescript
import { useVirtualScrollStore } from '@shared/hooks';
```

### Styles

```scss
@use '@shared/assets/styles/base/variables' as *;
```

## 참고

- [데이터 패칭](./data-fetching.md)
- [에러 처리](./error-handling.md)
