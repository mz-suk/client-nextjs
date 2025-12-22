# DDD 아키텍처 가이드

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── layout.tsx
│   ├── page.tsx
│   └── example-*/          # 예제 페이지들
│
├── core/                   # 핵심 인프라 레이어
│   ├── api/                # API 클라이언트 설정
│   │   ├── client.ts       # Axios 인스턴스, 인터셉터
│   │   └── index.ts
│   └── config/             # 환경 설정
│       ├── env.ts          # 환경변수 검증 및 파싱
│       ├── constants.ts    # 상수 정의
│       └── index.ts
│
├── domains/                # 도메인 레이어 (비즈니스 로직)
│   ├── user/               # User 도메인
│   │   ├── types/          # 타입 정의
│   │   ├── services/       # 비즈니스 로직 & API 호출
│   │   ├── hooks/          # React 훅 (SWR, TanStack Query)
│   │   ├── components/     # 도메인 전용 컴포넌트
│   │   └── index.ts
│   ├── todo/               # Todo 도메인
│   │   ├── types/
│   │   └── index.ts
│   └── counter/            # Counter 도메인 (Zustand 예제)
│       ├── stores/
│       └── index.ts
│
└── shared/                 # 공유 레이어
    ├── ui/                 # 공통 UI 컴포넌트
    │   └── ErrorBoundary/
    ├── lib/                # 유틸리티 함수
    │   └── logger.ts
    ├── types/              # 공통 타입
    │   └── api.ts
    └── providers/          # React 프로바이더
        └── QueryProvider.tsx
```

## 레이어별 역할

### 1. Core Layer (`core/`)

**역할**: 애플리케이션의 핵심 인프라 제공

- **API 클라이언트**: Axios 기반 HTTP 클라이언트 설정
  - 요청/응답 인터셉터
  - 에러 핸들링
  - 재시도 로직
- **환경 설정**: Zod 기반 환경변수 검증
  - 타입 안전한 환경변수 접근
  - 빌드 시점 검증

**의존성**: 없음 (최하위 레이어)

### 2. Domains Layer (`domains/`)

**역할**: 비즈니스 도메인별 로직 캡슐화

각 도메인은 독립적으로 구성:

- **types/**: 도메인 엔티티 타입 정의
- **services/**: API 호출 및 비즈니스 로직
- **hooks/**: React 데이터 페칭 훅
- **components/**: 도메인 전용 UI 컴포넌트
- **stores/**: 상태 관리 (Zustand 등)

**의존성**: `core/`, `shared/`

**예시**:

```typescript
// domains/user/services/userService.ts
import { fetchAPI } from '@/core/api';
import { logger } from '@/shared/lib';
import type { User } from '../types';

export async function getUsers(): Promise<User[]> {
  try {
    return await fetchAPI<User[]>('/users');
  } catch (error) {
    logger.error('getUsers 에러:', error);
    throw error;
  }
}
```

### 3. Shared Layer (`shared/`)

**역할**: 도메인 간 공유되는 리소스

- **ui/**: 재사용 가능한 UI 컴포넌트
- **lib/**: 유틸리티 함수 (logger 등)
- **types/**: 공통 타입 정의
- **providers/**: React Context 프로바이더

**의존성**: `core/` (최소한으로 유지)

### 4. App Layer (`app/`)

**역할**: Next.js 라우팅 및 페이지 구성

- 도메인 컴포넌트 조립
- 레이아웃 정의
- 메타데이터 설정

**의존성**: `domains/`, `shared/`

## 의존성 규칙

```
app/ ──────┐
           ├──> domains/ ──┐
           │                ├──> core/
           └──> shared/ ────┘
```

- **상위 레이어는 하위 레이어에만 의존**
- **같은 레벨 간 의존성 최소화**
- **core는 어디에도 의존하지 않음**

## 임포트 예시

```typescript
// ✅ 올바른 임포트
import { fetchAPI } from '@/core/api';
import { User, getUsers } from '@/domains/user';
import { logger } from '@/shared/lib';

// ❌ 잘못된 임포트
import { getUsers } from '@/domains/user/services/userService'; // 세부 경로 노출
import { API_CONFIG } from '@/shared/config'; // shared에서 core 접근 불가
```

## 새 도메인 추가하기

1. `domains/` 하위에 도메인 폴더 생성
2. 필요한 하위 폴더 구성:
   ```
   domains/new-domain/
   ├── types/
   ├── services/
   ├── hooks/
   ├── components/
   └── index.ts
   ```
3. `index.ts`에서 public API 노출
4. `app/`에서 사용

## 장점

### 1. 명확한 책임 분리

- 각 레이어의 역할이 명확
- 비즈니스 로직이 도메인에 집중

### 2. 확장성

- 새 도메인 추가가 용이
- 도메인 간 독립성 유지

### 3. 유지보수성

- 변경 영향 범위가 명확
- 테스트 작성이 쉬움

### 4. 타입 안전성

- 모든 레이어에서 TypeScript 활용
- 컴파일 타임 에러 검출

## 기존 FSD와의 차이점

| 항목   | FSD                          | DDD                     |
| ------ | ---------------------------- | ----------------------- |
| 구조   | features → entities → shared | domains → core → shared |
| 관심사 | 기능 중심                    | 도메인 중심             |
| 의존성 | 수평적 슬라이스              | 수직적 레이어           |
| 확장성 | 기능 추가 시 복잡도 증가     | 도메인 추가 시 독립적   |

## 참고 프로젝트

이 구조는 `wellness-bo` 프로젝트의 DDD 패턴을 참고하여 설계되었습니다.
