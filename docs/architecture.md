# 아키텍처 가이드

## 프로젝트 구조

```
src/
├── app/          # Next.js App Router (페이지, 레이아웃, 에러 처리)
├── core/         # 공통 환경 (API, Config, Logger)
├── domains/      # 비즈니스 로직 (도메인별 분리)
└── shared/       # 공용 컴포넌트 (UI, Providers, Styles)
```

## Core (공통 환경)

### API 클라이언트

```typescript
import { apiClient } from '@core/api';

// 기본 사용
const { data } = await apiClient.get<User>('/users/me');
await apiClient.post('/users', { name: 'John' });

// 인터셉터
apiClient.addRequestInterceptor(async config => {
  config.headers = { ...config.headers, 'X-Custom': 'value' };
  return config;
});
```

**주요 기능:**

- 자동 토큰 갱신 (401 에러 자동 처리)
- 요청/응답 인터셉터
- 타임아웃 처리
- 타입 안전성

### 환경 변수

`.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_API_ACCEPT_LANGUAGE=ko-KR
NEXT_PUBLIC_FEATURE_DEBUG=true
API_TARGET_URL=http://backend:8080  # SSR 전용
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

```
domains/{domain}/
├── model/                    # 비즈니스 로직
│   ├── {entity}.types.ts    # 타입
│   ├── {entity}.api.ts      # API 호출
│   ├── {entity}.queries.ts  # Query 정의
│   └── {entity}.mutations.ts # Mutation 정의
└── ui/                       # 프레젠테이션
    ├── {Component}.tsx
    ├── {Component}.module.scss
    └── use{Entity}.ts        # Custom Hooks
```

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
import { queryOptions } from '@tanstack/react-query';

export const postQueries = {
  list: () =>
    queryOptions({
      queryKey: ['posts'],
      queryFn: postApi.list,
    }),
};

// ui/usePosts.ts
import { useQuery } from '@tanstack/react-query';

export const usePosts = () => {
  return useQuery(postQueries.list());
};
```

## Shared (공용 컴포넌트)

### UI 컴포넌트

```typescript
import { BottomSheet, GlobalLoading } from '@shared/ui';
```

### Providers

```typescript
import { QueryProvider } from '@shared/providers';

<QueryProvider>
  {children}
</QueryProvider>
```

### Styles

```scss
@use '@shared/styles/mixins' as *;
@use '@shared/styles/variables' as *;
```

## 참고

- [데이터 패칭](./data-fetching.md)
- [에러 처리](./error-handling.md)
