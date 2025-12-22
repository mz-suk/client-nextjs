# 렌더링 전략

## 렌더링 방식 비교

| 방식       | 초기 로딩 | SEO | 실시간 | 사용 예               |
| ---------- | --------- | --- | ------ | --------------------- |
| **Hybrid** | 빠름      | ✅  | ✅     | 대부분의 페이지       |
| **SSG**    | 매우 빠름 | ✅  | ❌     | 정적 콘텐츠           |
| **CSR**    | 느림      | ❌  | ✅     | 인증 페이지, 대시보드 |

## 1. Hybrid (권장) ⭐

SSG로 초기 HTML 생성 → CSR로 실시간 업데이트

### 구현

**서버 컴포넌트**

```typescript
// app/users/page.tsx
import { getUsers } from '@/domains/user';
import { UserListHybrid } from '@/domains/user';

export default async function UsersPage() {
  const initialUsers = await getUsers(); // SSG 빌드
  return <UserListHybrid initialUsers={initialUsers} />;
}
```

**클라이언트 컴포넌트**

```typescript
// domains/user/components/UserListHybrid.tsx
'use client';
import { useUsers } from '../hooks';

export function UserListHybrid({ initialUsers }) {
  const { data: users } = useUsers({ initialData: initialUsers });
  return <div>{users.map(user => ...)}</div>;
}
```

**Hook**

```typescript
// domains/user/hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../services';

export const useUsers = ({ initialData } = {}) => {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    initialData, // SSG 데이터
  });
};
```

**예제:** `/example-hybrid`

### 장점

- 빠른 초기 로딩 (SSG)
- SEO 최적화
- 실시간 데이터 (CSR)
- 자동 캐시 갱신

## 2. SSG (Static Site Generation)

빌드 시점에 HTML 생성

### 기본 구현

```typescript
// app/users/page.tsx
import { getUsers } from '@/domains/user';
import { UserListSSG } from '@/domains/user';

export default async function UsersPage() {
  const users = await getUsers();
  return <UserListSSG users={users} />;
}
```

### 동적 라우트

```typescript
// app/users/[id]/page.tsx
import { getUsers, getUser } from '@/domains/user';

export async function generateStaticParams() {
  const users = await getUsers();
  return users.slice(0, 10).map(u => ({
    id: u.id.toString()
  }));
}

export default async function UserPage({ params }) {
  const user = await getUser(params.id);
  return <UserDetail user={user} />;
}
```

**예제:** `/example-ssg`

### 장점

- 매우 빠른 로딩
- CDN 배포 가능
- 최고의 SEO

### 단점

- 빌드 시점 데이터만 사용
- 변경 시 재빌드 필요

## 3. CSR (Client-Side Rendering)

클라이언트에서만 데이터 페칭

### 구현

```typescript
// app/users/page.tsx
'use client';
import { useUsers } from '@/domains/user';

export default function UsersPage() {
  const { data: users, isLoading } = useUsers();

  if (isLoading) return <div>Loading...</div>;
  return <UserList users={users} />;
}
```

**예제:** `/example-api-usage`

### 장점

- 항상 최신 데이터
- 인증 처리 용이

### 단점

- 느린 초기 로딩
- SEO 불리

## 선택 가이드

| 상황                       | 권장 방식  |
| -------------------------- | ---------- |
| 일반 페이지 (SEO + 실시간) | **Hybrid** |
| 정적 콘텐츠 (블로그, 문서) | SSG        |
| 인증 필요 (마이페이지)     | CSR        |
| 실시간 데이터만 (대시보드) | CSR        |

## React 19 use() Hook

Promise를 직접 사용

```typescript
// app/users/page.tsx
import { getUsers } from '@/domains/user';
import { UserListWithUse } from '@/domains/user';

export default function UsersPage() {
  const usersPromise = getUsers();
  return <UserListWithUse usersPromise={usersPromise} />;
}
```

```typescript
// domains/user/components/UserListWithUse.tsx
'use client';
import { use } from 'react';

export function UserListWithUse({ usersPromise }) {
  const users = use(usersPromise); // Promise를 직접 사용
  return <div>{users.map(user => ...)}</div>;
}
```

**예제:** `/example-react19`

## FAQ

**Q. 빌드 시간이 너무 오래 걸립니다**

A. 동적 라우트는 주요 페이지만 생성:

```typescript
export async function generateStaticParams() {
  const users = await getUsers();
  return users.slice(0, 10).map(...); // 10개만
}
```

**Q. 배포 후 데이터를 갱신하려면?**

A. Hybrid 패턴 사용. SSG로 초기 로딩 빠르게 + CSR로 자동 갱신

**Q. SEO가 필요 없는데 SSG를 써야 하나요?**

A. CSR 사용. 인증 페이지, 대시보드 등에 적합

## 참고

- [Next.js Rendering](https://nextjs.org/docs/app/building-your-application/rendering)
- [React 19 use() hook](https://react.dev/reference/react/use)
