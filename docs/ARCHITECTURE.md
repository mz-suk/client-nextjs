# 프로젝트 아키텍처

> **Feature-Sliced Design (FSD)** 기반 구조

## FSD 핵심 원칙

1. **단방향 의존성**: 상위 → 하위 레이어만 참조
2. **Public API**: `index.ts`를 통해서만 외부 노출
3. **격리성**: 같은 레벨 슬라이스는 직접 참조 불가

---

## 프로젝트 구조

```
src/
├── app/           # Next.js 라우트
├── features/      # 비즈니스 기능 (user-list, todo-list)
├── entities/      # 도메인 모델 (user, todo)
└── shared/        # 공통 모듈 (api, config, hooks)
```

---

## 레이어별 설명

### 1. app/ (라우팅)

```typescript
app/
├── page.tsx           # 홈
├── layout.tsx         # 레이아웃
└── users/
    ├── page.tsx       # 목록
    └── [id]/page.tsx  # 상세
```

**역할**: Next.js 라우팅, 페이지 조합

### 2. features/ (기능)

```typescript
features/user-list/
├── api/          # API 함수
│   ├── getUsers.ts
│   └── index.ts
├── hooks/        # SWR/Query 훅
│   ├── useUsers.ts
│   └── index.ts
├── ui/           # UI 컴포넌트
│   ├── UserList.tsx
│   └── index.ts
└── index.ts      # Public API
```

**역할**: 비즈니스 로직, 사용자 시나리오

### 3. entities/ (엔티티)

```typescript
entities/user/
├── model/
│   ├── types.ts   # User 타입
│   └── index.ts
└── index.ts
```

**역할**: 도메인 모델, 타입 정의

### 4. shared/ (공유)

```typescript
shared/
├── api/          # Axios 클라이언트
├── config/       # 환경변수, 설정
├── hooks/        # 공통 훅
├── lib/          # 유틸리티
└── types/        # 공통 타입
```

**역할**: 프로젝트 전역 공통 모듈

---

## Import 규칙

```typescript
// ✅ Good: 하위 레이어 참조
// app → features → entities → shared
import { UserList } from '@/features/user-list';
import { User } from '@/entities/user';
import { fetchAPI } from '@/shared/api';

// ❌ Bad: 상위 레이어 참조
// shared에서 features 참조 불가

// ❌ Bad: 내부 구조 직접 참조
import { UserList } from '@/features/user-list/ui/UserList';
// ✅ Good: Public API 사용
import { UserList } from '@/features/user-list';
```

---

## 새 기능 추가

### 1. 코드 제너레이터 사용 (권장)

```bash
pnpm generate:feature  # Feature 생성
pnpm generate:entity   # Entity 생성
pnpm generate:page     # Page 생성
```

### 2. 수동 생성

```bash
# 1. Entity 생성
mkdir -p src/entities/todo/model
touch src/entities/todo/model/types.ts
touch src/entities/todo/model/index.ts
touch src/entities/todo/index.ts

# 2. Feature 생성
mkdir -p src/features/todo-list/{api,hooks,ui}
touch src/features/todo-list/api/getTodos.ts
touch src/features/todo-list/hooks/useTodos.ts
touch src/features/todo-list/ui/TodoList.tsx

# 3. Page 생성
touch src/app/todos/page.tsx
```

---

## 베스트 프랙티스

### 1. Public API 패턴

```typescript
// features/user-list/index.ts
export { UserList } from './ui/UserList';
export { useUsers } from './hooks/useUsers';
export { getUsers } from './api/getUsers';
export type { User } from '@/entities/user';
```

### 2. 파일 네이밍

- 컴포넌트: PascalCase (`UserList.tsx`)
- 함수/Hook: camelCase (`getUsers.ts`, `useUsers.ts`)
- 타입: PascalCase (`types.ts` 내부에서 `User`)

### 3. 레이어 독립성

```typescript
// ✅ Good: Feature는 Entity만 의존
// features/user-list/hooks/useUsers.ts
import type { User } from '@/entities/user';

// ❌ Bad: Feature끼리 직접 참조
import { TodoList } from '@/features/todo-list';
```

---

📚 **상세 문서**: [FSD Official](https://feature-sliced.design/)
