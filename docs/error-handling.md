# 에러 처리 가이드

프로젝트는 다층 에러 처리 전략을 사용하여 각 에러를 적절한 계층에서 처리합니다.

## 계층별 처리

| 에러 타입        | 처리 위치            | UI          | 설명                    |
| ---------------- | -------------------- | ----------- | ----------------------- |
| 401 Unauthorized | `client.ts`          | 없음        | 자동 토큰 갱신 + 재시도 |
| 403 Forbidden    | `GlobalErrorHandler` | 토스트      | 권한 없음 → 로그인 이동 |
| 5xx Server Error | `GlobalErrorHandler` | 토스트      | 서버 에러 안내          |
| 400, 404, 422    | 로컬 (각 컴포넌트)   | 커스텀      | 비즈니스 로직 에러      |
| 페이지 렌더링    | `error.tsx`          | 전체 페이지 | 페이지 에러             |
| 루트 레이아웃    | `global-error.tsx`   | 전체 페이지 | 치명적 에러             |
| 페이지 404       | `not-found.tsx`      | 전체 페이지 | 존재하지 않는 페이지    |

## API 에러

### 전역 처리 (자동)

**401, 403, 5xx, 네트워크 에러**는 `GlobalErrorHandler`가 자동으로 감지하고 처리합니다.

```typescript
// 별도 처리 불필요 - GlobalErrorHandler가 자동 처리
const { data } = useQuery({ queryKey: ['posts'], queryFn: fetchPosts });
```

**처리 흐름:**

1. `QueryCache`/`MutationCache`에서 에러 발생
2. `GlobalErrorHandler`가 에러 감지
3. `ApiError.shouldHandleGlobally()` 확인
4. 전역 처리 대상이면 토스트 표시
5. 403 에러는 2초 후 로그인 페이지로 리다이렉트

### 로컬 처리

**400, 404, 422** 등 비즈니스 로직 에러는 각 컴포넌트에서 처리합니다.

```typescript
const { data, error } = useQuery({ queryKey: ['post', id], queryFn: () => fetchPost(id) });

if (error instanceof ApiError && error.status === 404) {
  return <div>게시글을 찾을 수 없습니다.</div>;
}
```

**왜 로컬에서 처리하나요?**

- 404, 422 등은 비즈니스 로직에 따라 다른 UI를 보여줘야 함
- 전역 토스트보다 컨텍스트에 맞는 메시지가 더 유용함
- 예: 게시글 404 vs 댓글 404는 다른 UI 필요

### Mutation 에러

Mutation 에러도 동일한 원칙을 따릅니다.

```typescript
const mutation = useMutation({
  mutationFn: createPost,
  onError: error => {
    // 로컬 처리 대상 (422 등)
    if (error instanceof ApiError && error.status === 422) {
      setFormError(error.message);
    }
    // 전역 처리 대상 (5xx 등)은 GlobalErrorHandler가 자동 처리
  },
});
```

**Tip:** `onError`에서 로컬 처리 대상만 처리하고, 나머지는 GlobalErrorHandler에 위임하세요.

## Next.js 에러

Next.js는 페이지 렌더링 에러를 처리하기 위한 특별한 파일들을 제공합니다.

### error.tsx (페이지 에러)

페이지 컴포넌트나 자식 컴포넌트에서 발생한 에러를 처리합니다.

```typescript
// app/error.tsx
'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>문제가 발생했습니다</h2>
      <p>{error.message}</p>
      <button onClick={reset}>다시 시도</button>
    </div>
  );
}
```

### global-error.tsx (루트 에러)

루트 레이아웃(`app/layout.tsx`)에서 발생한 에러를 처리합니다.

**주의사항:**

- 프로덕션에서만 작동 (개발 모드에서는 Next.js 에러 오버레이 표시)
- 매우 드물게 발생 (루트 레이아웃 에러는 치명적)

```typescript
// app/global-error.tsx
'use client';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body>
        <h2>심각한 오류</h2>
        <button onClick={() => window.location.reload()}>새로고침</button>
      </body>
    </html>
  );
}
```

**주의:** `<html>`, `<body>` 태그 필수

### not-found.tsx (404)

존재하지 않는 페이지나 리소스에 대한 UI를 제공합니다.

```typescript
// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div>
      <h1>404</h1>
      <p>페이지를 찾을 수 없습니다</p>
      <Link href="/">홈으로</Link>
    </div>
  );
}
```

**트리거:**

```typescript
import { notFound } from 'next/navigation';

export default async function PostPage({ params }) {
  const post = await fetchPost(params.id);
  if (!post) notFound();
  return <PostDetail post={post} />;
}
```

## 에러 유틸리티

`ApiError` 클래스는 에러 처리를 위한 다양한 헬퍼 메서드를 제공합니다.

```typescript
import { ApiError } from '@core/api/error';

// 에러 타입 확인
error.isServerError(); // 5xx 에러인가?
error.isClientError(); // 4xx 에러인가?
error.isAuthError(); // 401, 403 에러인가?
error.shouldHandleGlobally(); // 전역 처리 대상인가?
error.shouldHandleLocally(); // 로컬 처리 대상인가?

// 사용자 친화적 메시지 (기술적 용어 제거)
const message = error.getUserFriendlyMessage();
```

**사용 예시:**

```typescript
const { error } = useQuery(postQueries.detail(id));

if (error instanceof ApiError) {
  if (error.shouldHandleLocally()) {
    // 로컬에서 처리
    return <ErrorMessage>{error.getUserFriendlyMessage()}</ErrorMessage>;
  }
  // 전역 처리 대상은 GlobalErrorHandler가 자동 처리
}
```

## FAQ

**Q. error.tsx와 global-error.tsx 둘 다 필요한가요?**

A. 네, 둘 다 필요합니다.

- `error.tsx`: 일반 페이지 에러 (99%)
- `global-error.tsx`: 루트 레이아웃 에러 (1%)

**Q. 401 에러를 직접 처리해야 하나요?**

A. 아니요, `client.ts`가 자동으로 토큰 갱신 및 재시도를 처리합니다.

**Q. API 404와 페이지 404의 차이는?**

A.

- API 404: 로컬 처리 (존재하지 않는 리소스)
- 페이지 404: `not-found.tsx` 표시 (존재하지 않는 URL)

## 참고

- [Next.js Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [TanStack Query Error Handling](https://tanstack.com/query/latest/docs/react/guides/query-functions#handling-and-throwing-errors)
