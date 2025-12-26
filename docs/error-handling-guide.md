# 에러 처리 가이드

## 개요

이 프로젝트는 **통합 에러 처리 시스템**을 사용합니다. React Query 기반의 전역 에러 핸들러가 모든 클라이언트 사이드 에러를 자동으로 감지하고 처리합니다.

## 에러 처리 계층

### 1. 클라이언트 사이드 에러 (React Query)

**GlobalErrorHandler**가 자동으로 처리합니다.

```typescript
// src/shared/providers/GlobalErrorHandler.tsx
// React Query의 모든 에러를 구독하여 토스트로 표시
```

**특징:**

- 우측 하단에 토스트 형태로 표시
- 5초 후 자동 소멸
- 재시도 및 닫기 버튼 제공
- ApiError 타입 자동 감지

**적용 범위:**

- useQuery 에러
- useMutation 에러
- useInfiniteQuery 에러

### 2. 서버 사이드 에러 (Next.js)

**error.tsx**와 **global-error.tsx**가 처리합니다.

```typescript
// src/app/error.tsx - 페이지별 에러
// src/app/global-error.tsx - 전역 심각한 에러
```

**적용 범위:**

- Server Component 에러
- 빌드 타임 에러
- 라우팅 에러

## 사용 방법

### 기본 사용 (자동)

별도의 설정 없이 자동으로 동작합니다:

```typescript
// 쿼리 에러 - 자동으로 토스트 표시
const { data } = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
});

// Mutation 에러 - 자동으로 토스트 표시
const mutation = useMutation({
  mutationFn: createPost,
});
```

### 전역 에러 핸들러 비활성화

특정 경우에 비활성화할 수 있습니다:

```typescript
// src/app/layout.tsx
<QueryProvider enableGlobalErrorHandler={false}>
  {children}
</QueryProvider>
```

### 특정 쿼리에서만 에러 throw

```typescript
const { data } = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
  throwOnError: true, // 이 쿼리만 에러를 throw
});
```

### 커스텀 에러 처리

개별 쿼리에서 에러를 직접 처리:

```typescript
const { data, error, isError } = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
});

if (isError) {
  return <div>커스텀 에러 UI: {error.message}</div>;
}
```

## 에러 타입

### ApiError

API 호출 에러를 나타냅니다:

```typescript
class ApiError extends Error {
  status: number; // HTTP 상태 코드
  code?: string; // 에러 코드
  data?: unknown; // 추가 데이터
  type: ErrorType; // 에러 타입
}
```

**에러 타입:**

- `API`: 일반 API 에러
- `NETWORK`: 네트워크 에러
- `TIMEOUT`: 타임아웃
- `SERVER`: 서버 에러 (5xx)
- `UNKNOWN`: 알 수 없는 에러

### 일반 Error

일반적인 JavaScript 에러:

```typescript
throw new Error('에러 메시지');
```

## 에러 UI 커스터마이징

### 토스트 스타일 변경

`GlobalErrorHandler.tsx`를 수정하여 스타일을 변경할 수 있습니다:

```typescript
// src/shared/providers/GlobalErrorHandler.tsx
<div style={{
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  // 스타일 커스터마이징
}}>
```

### 토스트 위치 변경

```typescript
// 좌측 하단
bottom: '20px',
left: '20px',

// 상단 중앙
top: '20px',
left: '50%',
transform: 'translateX(-50%)',
```

### 자동 소멸 시간 변경

```typescript
// GlobalErrorHandler.tsx
setTimeout(() => {
  setErrorState({ error: null, timestamp: 0 });
}, 5000); // 5초 → 원하는 시간으로 변경
```

## 베스트 프랙티스

### ✅ DO

- 기본적으로 GlobalErrorHandler에 의존
- 중요한 에러는 로그로 기록
- ApiError를 사용하여 구조화된 에러 전달
- 사용자 친화적인 에러 메시지 작성

### ❌ DON'T

- 모든 에러를 try-catch로 감싸지 않기
- 에러를 무시하지 않기
- 기술적인 에러 메시지를 사용자에게 직접 노출하지 않기

## 예제

### 1. 일반 쿼리 에러

```typescript
const { data } = useQuery({
  queryKey: ['posts'],
  queryFn: async () => {
    const response = await fetch('/api/posts');
    if (!response.ok) {
      throw new Error('게시글을 불러올 수 없습니다');
    }
    return response.json();
  },
});
// 에러 발생 시 자동으로 토스트 표시
```

### 2. Mutation 에러

```typescript
const mutation = useMutation({
  mutationFn: async data => {
    const response = await fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('게시글 생성에 실패했습니다');
    }
    return response.json();
  },
});
// 에러 발생 시 자동으로 토스트 표시
```

### 3. 커스텀 에러 처리

```typescript
const { data, error, isError } = useQuery({
  queryKey: ['critical-data'],
  queryFn: fetchCriticalData,
});

if (isError) {
  // 중요한 데이터의 경우 커스텀 UI 표시
  return (
    <div className="critical-error">
      <h2>중요한 데이터를 불러올 수 없습니다</h2>
      <p>{error.message}</p>
      <button onClick={() => window.location.reload()}>
        페이지 새로고침
      </button>
    </div>
  );
}
```

## 테스트

에러 처리를 테스트하려면:

```bash
pnpm dev
# 브라우저에서 http://localhost:3000/example/features-demo
# "전역 에러" 탭 선택
```

다양한 에러 시나리오를 테스트할 수 있습니다:

- 404 에러
- 네트워크 에러

## 마이그레이션 가이드

### 이전 방식에서 마이그레이션

**Before (ErrorBoundary 사용):**

```typescript
<QueryErrorBoundary>
  <Component />
</QueryErrorBoundary>
```

**After (GlobalErrorHandler 자동 처리):**

```typescript
// 아무것도 필요 없음 - 자동으로 처리됨
<Component />
```

GlobalErrorHandler가 모든 React Query 에러를 자동으로 감지하여 토스트로 표시합니다.

## 정리

| 에러 타입             | 처리 방법          | UI               |
| --------------------- | ------------------ | ---------------- |
| React Query 에러      | GlobalErrorHandler | 우측 하단 토스트 |
| Server Component 에러 | error.tsx          | 전체 페이지      |
| 전역 심각한 에러      | global-error.tsx   | 전체 페이지      |

**권장 사항:** GlobalErrorHandler가 모든 클라이언트 사이드 에러를 자동으로 처리합니다.
