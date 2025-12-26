# 에러 처리 가이드

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

**401, 403, 5xx, 네트워크 에러**는 자동으로 처리됨

```typescript
// 별도 처리 불필요 - GlobalErrorHandler가 자동 처리
const { data } = useQuery({ queryKey: ['posts'], queryFn: fetchPosts });
```

### 로컬 처리

**400, 404, 422** 등은 각 컴포넌트에서 처리

```typescript
const { data, error } = useQuery({ queryKey: ['post', id], queryFn: () => fetchPost(id) });

if (error instanceof ApiError && error.status === 404) {
  return <div>게시글을 찾을 수 없습니다.</div>;
}
```

### Mutation 에러

```typescript
const mutation = useMutation({
  mutationFn: createPost,
  onError: error => {
    if (error instanceof ApiError && error.status === 422) {
      setFormError(error.message);
    }
    // 5xx는 GlobalErrorHandler가 자동 처리
  },
});
```

## Next.js 에러

### error.tsx (페이지 에러)

일반적인 페이지 에러 처리

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

루트 레이아웃 에러 처리 (프로덕션에서만 작동)

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

존재하지 않는 페이지

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

```typescript
import { ApiError } from '@core/api/error';

// 에러 타입 확인
error.isServerError(); // 5xx
error.isClientError(); // 4xx
error.isAuthError(); // 401, 403
error.shouldHandleGlobally(); // 전역 처리 대상
error.shouldHandleLocally(); // 로컬 처리 대상

// 사용자 친화적 메시지
error.getUserFriendlyMessage();
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
