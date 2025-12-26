# 아키텍처 가이드

FSD(Feature-Sliced Design)와 DDD(Domain-Driven Design)를 혼합한 아키텍처로, 확장 가능하고 유지보수하기 쉬운 구조를 제공합니다.

## 프로젝트 구조

```
src/
├── app/          # Next.js App Router (페이지, 레이아웃, 에러 처리)
├── core/         # 공통 환경 (API, Config, Logger)
├── domains/      # 비즈니스 로직 (도메인별 분리)
└── shared/       # 공용 컴포넌트 (UI, Providers, Styles)
```

### 계층별 역할

- **app/**: 라우팅과 페이지 구성만 담당, 비즈니스 로직은 domains에 위임
- **core/**: 프로젝트 전반에 사용되는 인프라 레벨 코드
- **domains/**: 비즈니스 도메인별로 격리된 로직과 UI
- **shared/**: 도메인에 독립적인 재사용 가능한 컴포넌트

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

각 도메인은 model(비즈니스 로직)과 ui(프레젠테이션)로 분리됩니다:

```
domains/{domain}/
├── model/                    # 비즈니스 로직 레이어
│   ├── {entity}.types.ts    # 타입 정의
│   ├── {entity}.api.ts      # API 호출 함수
│   ├── {entity}.queries.ts  # TanStack Query 정의
│   └── {entity}.mutations.ts # Mutation 정의
├── ui/                       # 프레젠테이션 레이어
│   ├── {Component}.tsx       # React 컴포넌트
│   ├── {Component}.module.scss # 스타일
│   └── use{Entity}.ts        # Custom Hooks
└── index.ts                  # Public API (외부 노출 인터페이스)
```

**중요**: 각 도메인은 `index.ts`를 통해서만 외부에 노출되어야 합니다.

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
