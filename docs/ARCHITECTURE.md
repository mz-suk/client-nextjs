# 프로젝트 구조

DDD(Domain-Driven Design) 아키텍처 기반

## 폴더 구조

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   └── example-*/          # 예제 페이지
│
├── core/                   # 인프라 레이어
│   ├── api/                # HTTP 클라이언트 (Axios)
│   │   ├── client.ts
│   │   └── index.ts
│   └── config/             # 환경 설정
│       ├── env.ts          # 환경변수 검증 (Zod)
│       ├── constants.ts
│       └── index.ts
│
├── domains/                # 비즈니스 로직
│   ├── user/
│   │   ├── types/          # 타입 정의
│   │   ├── services/       # API 호출
│   │   ├── hooks/          # TanStack Query 훅
│   │   ├── components/     # 도메인 컴포넌트
│   │   └── index.ts
│   └── counter/
│       ├── stores/         # Zustand 스토어
│       └── index.ts
│
└── shared/                 # 공유 리소스
    ├── ui/                 # 공통 컴포넌트
    │   └── ErrorBoundary/
    ├── lib/                # 유틸리티
    │   └── logger.ts
    ├── types/              # 공통 타입
    ├── providers/          # React Provider
    └── styles/             # 전역 스타일
```

## 레이어별 역할

### Core Layer

**역할:** 인프라 제공

- API 클라이언트 (Axios 설정, 인터셉터)
- 환경변수 검증 (Zod)
- 전역 상수

**의존성:** 없음

### Domains Layer

**역할:** 비즈니스 로직

각 도메인은 독립적으로 구성:

- `types/`: 엔티티 타입
- `services/`: API 호출
- `hooks/`: 데이터 페칭
- `components/`: 도메인 UI
- `stores/`: 상태 관리 (선택)

**의존성:** `core/`, `shared/`

### Shared Layer

**역할:** 공통 리소스

- UI 컴포넌트
- 유틸리티 함수
- 타입 정의
- Provider

**의존성:** `core/`

### App Layer

**역할:** 라우팅 및 페이지 조립

- 도메인 컴포넌트 조합
- 레이아웃 정의
- 메타데이터

**의존성:** `domains/`, `shared/`

## 의존성 규칙

```
app/ ──────┐
           ├──> domains/ ──┐
           │                ├──> core/
           └──> shared/ ────┘
```

- 상위 → 하위 레이어만 의존
- 동일 레벨 간 의존 최소화
- `core`는 독립적

## Import 규칙

```typescript
// ✅ 올바른 방식
import { fetchAPI } from '@/core/api';
import { User, getUsers } from '@/domains/user';
import { logger } from '@/shared/lib';

// ❌ 잘못된 방식
import { getUsers } from '@/domains/user/services/userService';
```

각 레이어의 `index.ts`를 통해 public API만 노출

## 도메인 추가하기

```bash
domains/new-domain/
├── types/
│   ├── types.ts
│   └── index.ts
├── services/
│   ├── newService.ts
│   └── index.ts
├── hooks/
│   ├── useNew.ts
│   └── index.ts
├── components/
│   ├── NewComponent.tsx
│   └── index.ts
└── index.ts
```

`index.ts`에서 외부로 노출할 항목만 export

## 예제

### 도메인 Service

```typescript
// domains/user/services/userService.ts
import { fetchAPI } from '@/core/api';
import type { User } from '../types';

export const getUsers = async (): Promise<User[]> => {
  return fetchAPI<User[]>('/users');
};
```

### 도메인 Hook

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

### 페이지에서 사용

```typescript
// app/example/page.tsx
import { UserList } from '@/domains/user';

export default function Page() {
  return <UserList />;
}
```

## 장점

1. **명확한 책임 분리**
   - 레이어별 역할 명확
   - 비즈니스 로직 집중

2. **확장성**
   - 도메인 추가 용이
   - 독립적 개발 가능

3. **유지보수성**
   - 변경 영향 범위 제한
   - 테스트 작성 쉬움

4. **타입 안전성**
   - TypeScript 전면 활용
   - 컴파일 타임 검증

## 참고

- [Next.js 프로젝트 구조](https://nextjs.org/docs/getting-started/project-structure)
- [DDD 소개](https://martinfowler.com/bliki/DomainDrivenDesign.html)
