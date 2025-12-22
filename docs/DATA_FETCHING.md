# 데이터 페칭 가이드

## 페칭 방법 비교

| 방법               | 사용 시점       | 번들 크기 | 장점           |
| ------------------ | --------------- | --------- | -------------- |
| **fetch (서버)**   | SSG 빌드        | 0KB       | 빠른 초기 로딩 |
| **TanStack Query** | 클라이언트 상태 | 40KB      | 강력한 기능    |

---

## 1. API 클라이언트 (SSG용)

```typescript
// features/user-list/api/getUsers.ts
import { fetchAPI } from '@/shared/api';

export async function getUsers() {
  return fetchAPI<User[]>('/users');
}
```

```typescript
// app/users/page.tsx (서버 컴포넌트)
export default async function UsersPage() {
  const users = await getUsers(); // SSG
  return <UserList users={users} />;
}
```

---

## 2. TanStack Query (권장 - CSR)

### 기본 사용

```typescript
// features/user-list/hooks/useUsers.ts
'use client';
import { useQuery } from '@tanstack/react-query';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });
}
```

```typescript
// 컴포넌트에서 사용
'use client';

export function UserList() {
  const { data: users, isLoading, error } = useUsers();

  if (error) return <Error />;
  if (isLoading) return <Loading />;
  return <div>{users.map(...)}</div>;
}
```

### Hybrid (SSG + React Query)

```typescript
export function useUsers({ initialData }) {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    initialData, // SSG 데이터
  });
}
```

### Mutation

```typescript
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
```

---

## 선택 가이드

| 상황             | 권장 방법      |
| ---------------- | -------------- |
| SSG 빌드 시      | fetch (서버)   |
| 간단한 GET 요청  | TanStack Query |
| 복잡한 상태 관리 | TanStack Query |
| Mutation 많을 때 | TanStack Query |
| Hybrid 패턴      | TanStack Query |

---

## 에러 처리

### TanStack Query

```typescript
const { data, error } = useQuery({
  queryKey: ['users'],
  queryFn: getUsers,
  retry: 3,
  retryDelay: 1000,
});
```

---

## 베스트 프랙티스

### 1. Hybrid 패턴 (권장)

```typescript
// ✅ Good: SSG + CSR
export default async function Page() {
  const initial = await getUsers(); // SSG
  return <List initialUsers={initial} />; // CSR with React Query
}
```

### 2. API 레이어 분리

```
features/user-list/
├── api/          # API 함수 (getUsers, getUser)
├── hooks/        # React Query 훅
└── ui/           # 컴포넌트
```

### 3. 에러 바운더리

```typescript
<ErrorBoundary fallback={<ErrorUI />}>
  <UserList />
</ErrorBoundary>
```

---

📚 **상세 문서**:

- [TanStack Query Docs](https://tanstack.com/query/latest)
