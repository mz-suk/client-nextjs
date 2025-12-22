# 데이터 페칭

## 방법 비교

| 방법               | 사용 위치  | 번들 크기 | 장점                   |
| ------------------ | ---------- | --------- | ---------------------- |
| **fetch (서버)**   | SSG        | 0KB       | 빠른 초기 로딩         |
| **TanStack Query** | 클라이언트 | ~40KB     | 강력한 캐싱, 상태 관리 |
| **React 19 use()** | 클라이언트 | 0KB       | 간단한 사용법          |

## 1. TanStack Query (권장)

클라이언트 상태 관리의 표준

### 기본 사용

**Service**

```typescript
// domains/user/services/userService.ts
import { fetchAPI } from '@/core/api';
import type { User } from '../types';

export const getUsers = async (): Promise<User[]> => {
  return fetchAPI<User[]>('/users');
};
```

**Hook**

```typescript
// domains/user/hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../services';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });
};
```

**Component**

```typescript
'use client';
import { useUsers } from '@/domains/user';

export function UserList() {
  const { data: users, isLoading, error } = useUsers();

  if (error) return <div>Error: {error.message}</div>;
  if (isLoading) return <div>Loading...</div>;
  return <div>{users.map(...)}</div>;
}
```

### Hybrid 패턴 (SSG + CSR)

```typescript
// Hook with initialData
export const useUsers = ({ initialData } = {}) => {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    initialData, // SSG 데이터를 초기값으로
  });
};
```

```typescript
// Server Component
export default async function Page() {
  const initialUsers = await getUsers(); // SSG
  return <UserList initialUsers={initialUsers} />;
}
```

### Mutation

```typescript
// domains/user/hooks/useCreateUser.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '../services';

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // 캐시 무효화 → 자동 재조회
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
```

### 캐싱 옵션

```typescript
useQuery({
  queryKey: ['users'],
  queryFn: getUsers,
  staleTime: 60000, // 60초 동안 fresh
  gcTime: 300000, // 5분 후 가비지 컬렉션
  refetchOnWindowFocus: true, // 포커스 시 재조회
  retry: 3, // 실패 시 3번 재시도
});
```

## 2. Server Fetch (SSG)

서버 컴포넌트에서 직접 호출

```typescript
// app/users/page.tsx
import { getUsers } from '@/domains/user';

export default async function UsersPage() {
  const users = await getUsers(); // 빌드 시 실행
  return <UserList users={users} />;
}
```

### 병렬 페칭

```typescript
const [users, posts] = await Promise.all([getUsers(), getPosts()]);
```

## 3. React 19 use() Hook

Promise를 직접 사용

```typescript
'use client';
import { use } from 'react';

export function UserList({ usersPromise }) {
  const users = use(usersPromise);
  return <div>{users.map(...)}</div>;
}
```

```typescript
// 서버에서 Promise 전달
export default function Page() {
  const usersPromise = getUsers();
  return <UserList usersPromise={usersPromise} />;
}
```

**주의:** Suspense와 함께 사용 필요

## 에러 처리

### TanStack Query

```typescript
const { data, error, isError } = useQuery({
  queryKey: ['users'],
  queryFn: getUsers,
  retry: 3,
  retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000),
});

if (isError) return <ErrorUI error={error} />;
```

### Error Boundary

```typescript
// app/users/error.tsx
'use client';

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>오류 발생</h2>
      <p>{error.message}</p>
      <button onClick={reset}>재시도</button>
    </div>
  );
}
```

## 베스트 프랙티스

### 1. 레이어 분리

```
domains/user/
├── services/       # API 호출
├── hooks/          # TanStack Query 훅
└── components/     # UI 컴포넌트
```

### 2. Hybrid 패턴 활용

```typescript
// ✅ SSG로 초기 로딩 빠르게 + CSR로 실시간 업데이트
export default async function Page() {
  const initial = await getUsers();
  return <UserList initialUsers={initial} />;
}
```

### 3. Query Key 컨벤션

```typescript
// ✅ 일관된 key 구조
['users'][('users', id)][('users', id, 'posts')]; // 전체 목록 // 단일 항목 // 중첩 리소스
```

### 4. 낙관적 업데이트

```typescript
const { mutate } = useMutation({
  mutationFn: updateUser,
  onMutate: async newUser => {
    await queryClient.cancelQueries({ queryKey: ['users'] });
    const previous = queryClient.getQueryData(['users']);
    queryClient.setQueryData(['users'], old => [...old, newUser]);
    return { previous };
  },
  onError: (err, newUser, context) => {
    queryClient.setQueryData(['users'], context.previous);
  },
});
```

## 선택 가이드

| 상황             | 추천           |
| ---------------- | -------------- |
| 정적 페이지 빌드 | Server Fetch   |
| 실시간 데이터    | TanStack Query |
| 복잡한 캐싱      | TanStack Query |
| Mutation 많음    | TanStack Query |
| 간단한 조회      | React 19 use() |

## 참고

- [TanStack Query 문서](https://tanstack.com/query/latest)
- [React 19 use() hook](https://react.dev/reference/react/use)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
