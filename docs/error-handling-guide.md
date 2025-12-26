# 에러 처리 가이드

## 개요

이 프로젝트는 **계층별 에러 처리 시스템**을 사용합니다. Next.js의 모범 사례를 따르며, API 에러는 전역/로컬 처리를 명확히 구분합니다.

## 에러 처리 계층

### 1. Next.js 에러 처리 (페이지 레벨)

#### not-found.tsx (404 에러)

존재하지 않는 페이지에 접근했을 때 표시됩니다.

```tsx
// app/not-found.tsx - 전역 404
// app/[경로]/not-found.tsx - 특정 경로의 404
```

**적용 범위:**

- 존재하지 않는 URL 접근
- `notFound()` 함수로 명시적 트리거
- SSG/SSR에서 데이터가 없을 때

**사용 예시:**

```tsx
import { notFound } from 'next/navigation';

export default async function PostPage({ params }) {
  const post = await getPost(params.id);

  if (!post) {
    notFound(); // not-found.tsx 표시
  }

  return <div>{post.title}</div>;
}
```

#### error.tsx (페이지 에러)

Server Component 및 Client Component의 에러를 포착합니다.

```tsx
// app/error.tsx - 전역 페이지 에러
// app/[경로]/error.tsx - 특정 경로의 에러
```

**적용 범위:**

- Server Component 렌더링 에러
- Client Component 렌더링 에러
- 데이터 fetching 에러 (Server Component)
- 라우팅 에러

**특징:**

- `reset()` 함수로 에러 복구 시도
- 재시도, 홈 이동, 새로고침 버튼 제공
- 에러 ID (digest)로 추적 가능

#### global-error.tsx (치명적 에러)

루트 레이아웃을 포함한 최상위 레벨의 에러를 포착합니다.

```tsx
// app/global-error.tsx - 전역 치명적 에러
```

**적용 범위:**

- 루트 레이아웃 에러
- 매우 드문 치명적 에러

**주의사항:**

- 프로덕션에서만 활성화 (개발 모드에서는 error.tsx 사용)
- `<html>`, `<body>` 태그 직접 포함 필요
- 반드시 외부 모니터링 서비스로 로깅

---

### 2. API 에러 처리 (HTTP 레벨)

#### 전역 에러 처리 (GlobalErrorHandler)

특정 HTTP 상태 코드의 에러를 자동으로 처리합니다.

**전역 처리 대상:**

- **403 Forbidden**: 권한 없음 → 토스트 표시 후 로그인 페이지 이동
- **5xx Server Error**: 서버 에러 → 토스트 표시
- **네트워크 에러**: 연결 실패 → 토스트 표시
- **타임아웃 에러**: 요청 시간 초과 → 토스트 표시

**특징:**

- React Query의 모든 에러를 구독
- 전역 처리 대상만 토스트로 표시
- 5초 후 자동 소멸
- 재시도 및 닫기 버튼 제공

#### 자동 토큰 갱신 (client.ts)

**401 Unauthorized** 에러는 API 클라이언트 레벨에서 자동 처리합니다.

**처리 방식:**

1. 401 에러 감지
2. Refresh Token으로 Access Token 갱신
3. 원래 요청 자동 재시도
4. 갱신 실패 시 로그인 페이지 이동

**장점:**

- 애플리케이션 코드가 토큰 갱신을 신경쓰지 않아도 됨
- 투명한 인증 처리
- 중복 갱신 요청 방지 (Promise 캐싱)

#### 로컬 에러 처리 (각 컴포넌트)

비즈니스 로직 에러는 각 컴포넌트에서 직접 처리합니다.

**로컬 처리 대상:**

- **400 Bad Request**: 잘못된 요청
- **404 Not Found**: API 리소스 없음
- **422 Unprocessable Entity**: 유효성 검증 실패
- 기타 4xx 에러

**이유:**

- 에러 컨텍스트가 컴포넌트마다 다름
- 사용자에게 구체적인 피드백 필요
- 폼 유효성 검증 등 비즈니스 로직과 연관

---

## 에러 타입 및 클래스

### ApiError

API 호출 에러를 나타냅니다:

```typescript
class ApiError extends Error {
  status: number; // HTTP 상태 코드 (예: 404, 500)
  message: string; // 에러 메시지
  code?: string; // 에러 코드 (서버 정의)
  data?: unknown; // 추가 데이터
  type: ErrorType; // 에러 타입
}
```

**에러 타입:**

- `API_ERROR`: 일반 API 에러
- `NETWORK_ERROR`: 네트워크 에러
- `TIMEOUT_ERROR`: 타임아웃
- `SERVER_ERROR`: 서버 에러 (5xx)
- `UNKNOWN_ERROR`: 알 수 없는 에러

**유틸리티 메서드:**

```typescript
error.isNetworkError(); // 네트워크/타임아웃 에러인지
error.isServerError(); // 5xx 서버 에러인지
error.isClientError(); // 4xx 클라이언트 에러인지
error.isAuthError(); // 401/403 인증 에러인지
error.shouldHandleGlobally(); // 전역 처리 대상인지
error.shouldHandleLocally(); // 로컬 처리 대상인지
error.getUserFriendlyMessage(); // 사용자 친화적 메시지
```

### AuthError

인증 관련 에러를 나타냅니다:

```typescript
class AuthError extends Error {
  code: AuthErrorCode; // 에러 코드
  message: string; // 에러 메시지
}
```

**에러 코드:**

- `UNAUTHORIZED`: 인증 실패
- `TOKEN_EXPIRED`: 토큰 만료
- `REFRESH_FAILED`: 토큰 갱신 실패

---

## 사용 방법

### 1. 기본 사용 (전역 에러 처리)

별도의 설정 없이 자동으로 동작합니다:

```typescript
// 쿼리 에러 - 전역 대상이면 자동으로 토스트 표시
const { data } = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
});

// Mutation 에러 - 전역 대상이면 자동으로 토스트 표시
const mutation = useMutation({
  mutationFn: createPost,
});
```

**전역 처리되는 에러:**

- 403, 5xx, 네트워크/타임아웃 에러 → 자동으로 토스트 표시

**로컬 처리되는 에러:**

- 400, 404, 422 등 → 컴포넌트에서 직접 처리 필요

---

### 2. 로컬 에러 처리 (커스텀 처리)

개별 쿼리에서 에러를 직접 처리:

```typescript
const { data, error, isError } = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
});

if (isError) {
  // ApiError의 유틸리티 메서드 활용
  if (error instanceof ApiError) {
    if (error.status === 404) {
      return <div>게시글을 찾을 수 없습니다.</div>;
    }

    if (error.status === 422) {
      return <div>입력값을 확인해주세요: {error.message}</div>;
    }

    // 사용자 친화적 메시지 사용
    return <div>{error.getUserFriendlyMessage()}</div>;
  }

  return <div>오류가 발생했습니다.</div>;
}
```

**Mutation 에러 처리:**

```typescript
const mutation = useMutation({
  mutationFn: createPost,
  onError: error => {
    if (error instanceof ApiError && error.status === 400) {
      // 폼 에러 처리
      setFormError(error.message);
    }
  },
});
```

---

### 3. Next.js 페이지 에러 처리

#### SSR/SSG에서 404 처리

```typescript
// app/posts/[id]/page.tsx
import { notFound } from 'next/navigation';

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await fetchPost(params.id);

  if (!post) {
    notFound(); // not-found.tsx 표시
  }

  return <PostDetail post={post} />;
}
```

#### 특정 경로의 커스텀 에러 페이지

```typescript
// app/dashboard/error.tsx
'use client';

export default function DashboardError({ error, reset }) {
  return (
    <div>
      <h2>대시보드를 불러올 수 없습니다</h2>
      <button onClick={reset}>다시 시도</button>
    </div>
  );
}
```

---

## 베스트 프랙티스

### ✅ DO

1. **전역 에러는 자동 처리에 의존**
   - 403, 5xx, 네트워크 에러는 별도 처리 불필요
   - GlobalErrorHandler가 자동으로 토스트 표시

2. **로컬 에러는 명시적으로 처리**
   - 400, 404, 422 등은 컴포넌트에서 처리
   - 사용자에게 구체적인 피드백 제공

3. **에러 타입 확인 및 유틸리티 사용**

   ```typescript
   if (error instanceof ApiError) {
     console.log(error.getUserFriendlyMessage());
   }
   ```

4. **401은 자동 처리됨을 신뢰**
   - client.ts가 자동으로 토큰 갱신
   - 애플리케이션 코드에서 401 처리 불필요

5. **에러 로깅**
   - 중요한 에러는 외부 모니터링 서비스로 전송
   - 개발 환경에서는 logger 사용

### ❌ DON'T

1. **전역 에러를 로컬에서 중복 처리하지 않기**

   ```typescript
   // ❌ 나쁜 예: 5xx는 이미 전역 처리됨
   const { error } = useQuery({ queryKey: ['posts'], queryFn: fetchPosts });
   if (error?.status === 500) {
     toast.error('서버 에러'); // 중복!
   }
   ```

2. **401을 직접 처리하지 않기**

   ```typescript
   // ❌ 나쁜 예: 401은 client.ts에서 자동 처리
   if (error?.status === 401) {
     refreshToken(); // 불필요!
   }
   ```

3. **모든 에러를 try-catch로 감싸지 않기**

   ```typescript
   // ❌ 나쁜 예
   try {
     await mutation.mutateAsync(data);
   } catch (error) {
     // React Query가 이미 에러를 관리함
   }
   ```

4. **기술적인 에러 메시지를 사용자에게 직접 노출하지 않기**

   ```typescript
   // ❌ 나쁜 예
   <div>{error.stack}</div>

   // ✅ 좋은 예
   <div>{error.getUserFriendlyMessage()}</div>
   ```

---

## 실전 예제

### 1. 폼 제출 with 유효성 검증

```typescript
function CreatePostForm() {
  const [formError, setFormError] = useState('');

  const mutation = useMutation({
    mutationFn: createPost,
    onError: (error) => {
      // 422는 로컬 처리 (유효성 검증 실패)
      if (error instanceof ApiError && error.status === 422) {
        setFormError(error.message);
      }
      // 5xx는 전역 처리 (GlobalErrorHandler가 토스트 표시)
    },
    onSuccess: () => {
      setFormError('');
      router.push('/posts');
    },
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      mutation.mutate(formData);
    }}>
      {formError && <div className="error">{formError}</div>}
      <input type="text" />
      <button type="submit">제출</button>
    </form>
  );
}
```

### 2. 데이터 로딩 with 404 처리

```typescript
function PostDetail({ id }: { id: string }) {
  const { data, error, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPost(id),
  });

  if (isLoading) return <div>로딩 중...</div>;

  // 404는 로컬 처리
  if (error instanceof ApiError && error.status === 404) {
    return (
      <div>
        <h2>게시글을 찾을 수 없습니다</h2>
        <Link href="/posts">목록으로</Link>
      </div>
    );
  }

  // 5xx, 네트워크 에러는 전역 처리 (토스트 표시)
  if (error) {
    return <div>게시글을 불러올 수 없습니다.</div>;
  }

  return <div>{data.title}</div>;
}
```

### 3. SSR with 에러 처리

```typescript
// app/posts/[id]/page.tsx
import { notFound } from 'next/navigation';

export default async function PostPage({ params }: { params: { id: string } }) {
  try {
    const post = await fetchPost(params.id);

    if (!post) {
      notFound(); // not-found.tsx 표시
    }

    return <PostDetail post={post} />;
  } catch (error) {
    // error.tsx가 포착하여 처리
    throw error;
  }
}
```

### 4. 무한 스크롤 with 에러 처리

```typescript
function InfinitePostList() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  // 5xx, 네트워크 에러는 전역 처리
  if (isError && error instanceof ApiError && error.shouldHandleGlobally()) {
    return <div>게시글을 불러올 수 없습니다.</div>;
  }

  // 기타 에러는 로컬 처리
  if (isError) {
    return <div>오류: {error.message}</div>;
  }

  return (
    <div>
      {data?.pages.map((page) => (
        page.posts.map((post) => <PostCard key={post.id} post={post} />)
      ))}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()}>더 보기</button>
      )}
    </div>
  );
}
```

---

## 에러 처리 흐름도

```
┌─────────────────────────────────────────────────────────────┐
│                        에러 발생                              │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
              ┌───────────────┐
              │ 에러 타입 확인 │
              └───────┬───────┘
                      │
        ┌─────────────┼─────────────┬─────────────┐
        ▼             ▼             ▼             ▼
   ┌────────┐   ┌────────┐   ┌────────┐   ┌─────────┐
   │ 401    │   │ 403    │   │ 5xx    │   │ 4xx     │
   └────┬───┘   └────┬───┘   └────┬───┘   └────┬────┘
        │            │            │            │
        ▼            ▼            ▼            ▼
   ┌────────┐   ┌────────┐   ┌────────┐   ┌─────────┐
   │client.ts│   │Global  │   │Global  │   │Local    │
   │자동 갱신 │   │Handler │   │Handler │   │처리     │
   │+ 재시도 │   │토스트  │   │토스트  │   │컴포넌트 │
   └────────┘   │+리다이렉트│  └────────┘   └─────────┘
                └────────┘
```

---

## 테스트

에러 처리를 테스트하려면:

```bash
pnpm dev
# 브라우저에서 http://localhost:3000/example/features-demo
```

**테스트 시나리오:**

1. 401 에러: 자동 토큰 갱신 확인
2. 403 에러: 토스트 표시 + 로그인 페이지 이동 확인
3. 404 에러 (API): 로컬 처리 확인
4. 404 에러 (페이지): not-found.tsx 표시 확인
5. 500 에러: 토스트 표시 확인
6. 네트워크 에러: 토스트 표시 확인

---

## 설정

### GlobalErrorHandler 비활성화

특정 경우에 비활성화할 수 있습니다:

```typescript
// src/app/layout.tsx
<QueryProvider enableGlobalErrorHandler={false}>
  {children}
</QueryProvider>
```

### 로그인 페이지 경로 변경

```typescript
// src/app/layout.tsx
<GlobalErrorHandler loginPath="/auth/login">
  {children}
</GlobalErrorHandler>
```

### 토스트 자동 소멸 시간 변경

```typescript
// src/shared/providers/GlobalErrorHandler.tsx
setTimeout(() => {
  setErrorState({ error: null, timestamp: 0 });
}, 5000); // 5초 → 원하는 시간으로 변경
```

---

## 에러 모니터링 통합

프로덕션 환경에서는 반드시 에러 모니터링 서비스를 통합하세요:

### Sentry 예시

```typescript
// src/core/lib/monitoring.ts
import * as Sentry from '@sentry/nextjs';

export function initMonitoring() {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
  });
}

export function captureError(error: Error, context?: Record<string, unknown>) {
  Sentry.captureException(error, { extra: context });
}
```

### 에러 핸들러에 통합

```typescript
// src/app/global-error.tsx
useEffect(() => {
  captureError(error, {
    digest: error.digest,
    timestamp: new Date().toISOString(),
  });
}, [error]);
```

---

## 정리

### 에러 처리 매트릭스

| 에러 타입     | HTTP 상태    | 처리 위치          | 처리 방식               | UI          |
| ------------- | ------------ | ------------------ | ----------------------- | ----------- |
| 인증 실패     | 401          | client.ts          | 자동 토큰 갱신 + 재시도 | 없음 (투명) |
| 권한 없음     | 403          | GlobalErrorHandler | 토스트 + 로그인 이동    | 토스트      |
| 페이지 없음   | 404 (페이지) | not-found.tsx      | 404 페이지 표시         | 전체 페이지 |
| 리소스 없음   | 404 (API)    | 로컬 (컴포넌트)    | 커스텀 UI               | 컴포넌트 내 |
| 유효성 실패   | 422          | 로컬 (컴포넌트)    | 폼 에러 표시            | 폼 내       |
| 서버 에러     | 5xx          | GlobalErrorHandler | 토스트 표시             | 토스트      |
| 네트워크 에러 | 0            | GlobalErrorHandler | 토스트 표시             | 토스트      |
| 타임아웃      | 0            | GlobalErrorHandler | 토스트 표시             | 토스트      |
| 렌더링 에러   | -            | error.tsx          | 에러 페이지             | 전체 페이지 |
| 치명적 에러   | -            | global-error.tsx   | 치명적 에러 페이지      | 전체 페이지 |

### 핵심 원칙

1. **자동화**: 401은 자동 처리, 403/5xx는 전역 토스트
2. **명확성**: 전역/로컬 처리 구분 명확
3. **사용자 친화**: 기술적 메시지 대신 사용자 친화적 메시지
4. **모니터링**: 모든 에러는 로깅 및 모니터링
5. **복구 가능**: 재시도, 새로고침 등 복구 옵션 제공

---

## 참고 자료

- [Next.js Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [React Query Error Handling](https://tanstack.com/query/latest/docs/react/guides/query-functions#handling-and-throwing-errors)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

---

## 에러 처리 아키텍처 요약

### 계층별 역할 분담

```
┌─────────────────────────────────────────────────────────────┐
│                    에러 발생 지점                             │
└─────────────────┬───────────────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
  ┌──────────┐        ┌──────────┐
  │ 페이지    │        │ API      │
  │ 에러      │        │ 에러      │
  └────┬─────┘        └────┬─────┘
       │                   │
       ▼                   ▼
┌─────────────┐    ┌─────────────────┐
│ Next.js     │    │ HTTP 상태 코드   │
│ 에러 파일    │    │ 확인             │
└─────┬───────┘    └────────┬────────┘
      │                     │
      ▼                     ▼
┌─────────────┐    ┌──────────────────┐
│ error.tsx   │    │ 401: client.ts   │
│ (일반 에러)  │    │ (자동 토큰 갱신)  │
│             │    │                  │
│ global-     │    │ 403, 5xx:        │
│ error.tsx   │    │ GlobalError-     │
│ (루트 에러)  │    │ Handler          │
│             │    │ (전역 토스트)     │
│ not-found   │    │                  │
│ .tsx        │    │ 400, 404, 422:   │
│ (404)       │    │ 로컬 처리         │
└─────────────┘    └──────────────────┘
```

### 에러 처리 우선순위

1. **401 Unauthorized**
   - 처리: `client.ts` (자동 토큰 갱신)
   - UI: 없음 (투명 처리)
   - 사용자 경험: 끊김 없는 인증

2. **403 Forbidden**
   - 처리: `GlobalErrorHandler`
   - UI: 토스트 → 로그인 페이지 이동
   - 사용자 경험: 권한 없음 안내

3. **5xx Server Error**
   - 처리: `GlobalErrorHandler`
   - UI: 토스트
   - 사용자 경험: 서버 문제 안내

4. **400, 404, 422 (비즈니스 로직 에러)**
   - 처리: 각 컴포넌트 (로컬)
   - UI: 컴포넌트별 커스텀
   - 사용자 경험: 구체적인 피드백

5. **페이지 렌더링 에러**
   - 처리: `error.tsx` 또는 `global-error.tsx`
   - UI: 전체 페이지 대체
   - 사용자 경험: 에러 페이지 + 복구 옵션

6. **404 Not Found (페이지)**
   - 처리: `not-found.tsx`
   - UI: 404 페이지
   - 사용자 경험: 페이지 없음 안내

---

## 중복 제거된 에러 처리

### ❌ 제거된 것들

1. **ErrorBoundary 컴포넌트**
   - 이유: Next.js의 `error.tsx`와 중복
   - 대체: `error.tsx`, `global-error.tsx` 사용

2. **QueryErrorBoundary**
   - 이유: `GlobalErrorHandler`로 통합
   - 대체: React Query 에러는 `GlobalErrorHandler`가 자동 처리

3. **개별 try-catch 블록**
   - 이유: React Query와 GlobalErrorHandler가 자동 처리
   - 대체: 필요한 경우만 로컬 에러 처리

### ✅ 현재 에러 처리 구조

```typescript
// ✅ 올바른 구조
app/
├── layout.tsx
├── error.tsx              // 페이지 에러 처리
├── global-error.tsx       // 루트 레이아웃 에러 처리
├── not-found.tsx          // 404 페이지
└── providers/
    └── GlobalErrorHandler.tsx  // API 에러 처리 (403, 5xx, 네트워크)

core/
└── api/
    └── client.ts          // 401 자동 처리
```

---

## 자주 묻는 질문 (FAQ)

### Q1. error.tsx와 global-error.tsx 둘 다 필요한가요?

**A:** 네, 둘 다 필요합니다.

- `error.tsx`: 일반 페이지 에러 처리 (99%)
- `global-error.tsx`: 루트 레이아웃 에러 처리 (1%)

자세한 내용은 [error-boundaries-explained.md](./error-boundaries-explained.md) 참고

### Q2. ErrorBoundary는 어디 갔나요?

**A:** Next.js의 `error.tsx`가 동일한 역할을 하므로 제거되었습니다.

- React의 ErrorBoundary → Next.js의 `error.tsx`
- 더 나은 DX, 파일 기반 라우팅과 통합

### Q3. 401 에러를 직접 처리해야 하나요?

**A:** 아니요, `client.ts`가 자동으로 처리합니다.

- 자동 토큰 갱신
- 원래 요청 재시도
- 실패 시 로그인 페이지 이동

### Q4. API 404 에러는 어떻게 처리하나요?

**A:** 컴포넌트에서 로컬로 처리합니다.

```typescript
const { data, error } = useQuery({ ... });

if (error instanceof ApiError && error.status === 404) {
  return <div>데이터를 찾을 수 없습니다.</div>;
}
```

### Q5. 페이지 404와 API 404의 차이는?

**A:**

- **페이지 404**: `not-found.tsx` 표시 (존재하지 않는 URL)
- **API 404**: 로컬 처리 (존재하지 않는 리소스)

### Q6. GlobalErrorHandler를 비활성화할 수 있나요?

**A:** 네, 가능합니다.

```tsx
<QueryProvider enableGlobalErrorHandler={false}>{children}</QueryProvider>
```

하지만 권장하지 않습니다. 전역 에러 처리가 사용자 경험을 크게 개선합니다.

---

## 마이그레이션 가이드

### 이전 ErrorBoundary 사용 코드

```tsx
// ❌ 이전 방식
<ErrorBoundary fallback={<ErrorUI />}>
  <Component />
</ErrorBoundary>
```

### 현재 권장 방식

```tsx
// ✅ 현재 방식 1: Next.js error.tsx 사용
// app/[경로]/error.tsx 파일 생성
'use client';

export default function Error({ error, reset }) {
  return <ErrorUI error={error} onReset={reset} />;
}

// ✅ 현재 방식 2: 로컬 에러 처리
function Component() {
  const { data, error } = useQuery({ ... });

  if (error) {
    return <ErrorUI error={error} />;
  }

  return <div>{data}</div>;
}
```

---

## 체크리스트

프로젝트에 에러 처리가 제대로 구현되었는지 확인하세요:

- [ ] `app/error.tsx` 존재
- [ ] `app/global-error.tsx` 존재
- [ ] `app/not-found.tsx` 존재
- [ ] `GlobalErrorHandler` 활성화
- [ ] `client.ts`에 401 자동 처리 구현
- [ ] 로컬 에러 처리 (400, 404, 422) 구현
- [ ] 에러 모니터링 서비스 통합 (프로덕션)
- [ ] 사용자 친화적 에러 메시지 사용

---

## 추가 자료

- [Next.js Error Handling 공식 문서](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [React Query Error Handling](https://tanstack.com/query/latest/docs/react/guides/query-functions#handling-and-throwing-errors)
- [error.tsx vs global-error.tsx 상세 설명](./error-boundaries-explained.md)
