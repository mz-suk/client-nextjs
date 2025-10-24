# 렌더링 전략 가이드

> **핵심**: SSG(빠른 로딩) + CSR(실시간) = Hybrid 패턴

## 렌더링 방식 비교

| 방식       | 초기 로딩 | SEO     | 최신 데이터 | 사용 예             |
| ---------- | --------- | ------- | ----------- | ------------------- |
| **Hybrid** | 빠름      | ✅ 좋음 | ✅ 실시간   | **대부분의 페이지** |
| **SSG**    | 매우 빠름 | ✅ 최고 | ❌ 빌드시점 | 정적 콘텐츠         |
| **CSR**    | 느림      | ❌ 나쁨 | ✅ 실시간   | 인증, 대시보드      |

⚠️ **ISR/Server Actions**: 서버 필요, 이 템플릿에서 사용 불가

---

## 1. Hybrid (SSG + CSR) ⭐ 권장

### 동작 원리

```
빌드 시(SSG) → HTML 생성 → CDN 배포
      ↓
클라이언트(CSR) → SWR로 자동 업데이트
```

### 구현 (SWR)

**서버 컴포넌트**

```typescript
// app/users/page.tsx
export default async function UsersPage() {
  const initialUsers = await getUsers(); // SSG
  return <UserListHybrid initialUsers={initialUsers} />;
}
```

**클라이언트 컴포넌트**

```typescript
// features/user-list/ui/UserListHybrid.tsx
'use client';

export function UserListHybrid({ initialUsers }: Props) {
  const { users, isLoading } = useUsers({
    initialData: initialUsers // SSG 데이터 초기값
  });

  return <div>{users.map(...)}</div>;
}
```

**Hook (SWR)**

```typescript
// features/user-list/hooks/useUsers.ts
'use client';

export function useUsers({ initialData }) {
  return useSWR('/users', getUsers, {
    fallbackData: initialData,
    revalidateOnMount: true, // 마운트 시 자동 업데이트
  });
}
```

**예제**: `/example-hybrid`

---

## 2. SSG (Static Site Generation)

### 기본

```typescript
// app/users/page.tsx
export default async function UsersPage() {
  const users = await getUsers();
  return <UserListSSG users={users} />;
}
```

### 동적 라우트

```typescript
// app/users/[id]/page.tsx
export async function generateStaticParams() {
  const users = await getUsers();
  return users.slice(0, 10).map(u => ({ id: u.id.toString() }));
}

export default async function UserPage({ params }) {
  const user = await getUser(params.id);
  return <UserDetail user={user} />;
}
```

**예제**: `/example-ssg`

---

## 3. CSR (Client-Side Rendering)

```typescript
'use client';

export default function UsersPage() {
  const { users, isLoading } = useUsers(); // 클라이언트에서만 페칭

  if (isLoading) return <Loading />;
  return <UserList users={users} />;
}
```

**예제**: `/example-api-usage`

---

## 선택 가이드

| 상황                     | 권장 방식     |
| ------------------------ | ------------- |
| 일반 페이지              | **Hybrid** ⭐ |
| 자주 변경 안 되는 콘텐츠 | SSG           |
| 인증 필요                | CSR           |
| SEO 중요 + 실시간 필요   | **Hybrid** ⭐ |

---

## FAQ

**Q: 빌드 시간이 오래 걸리면?**  
A: 동적 라우트는 주요 페이지만 `generateStaticParams`로 생성, 나머지는 CSR 처리

**Q: 배포 후 데이터 갱신?**  
A: Hybrid 패턴 사용 (SSG + CSR 자동 업데이트)

**Q: 실시간 데이터만 필요하면?**  
A: CSR 사용 (SEO 불필요한 경우)

---

📚 **상세 문서**: [Next.js Rendering Docs](https://nextjs.org/docs/app/building-your-application/rendering)
