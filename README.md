# Next.js 16 + React 19 프로젝트

FSD + DDD 혼합 아키텍처 기반 Next.js 템플릿

## 시작하기

```bash
# 설치
pnpm install

# 개발 서버 (http://localhost:3000)
pnpm dev

# 프로덕션 빌드
pnpm build
pnpm start

# 린트
pnpm lint

# 포맷
pnpm format

# 빌드 분석
pnpm analyze
```

## 기술 스택

- **Next.js 16.1** - App Router, Static Export
- **React 19.2** - Server Components, React Compiler
- **TypeScript 5.9** - Strict mode
- **TanStack Query v5.90** - 서버 상태 관리
- **TanStack Virtual v3.13** - Virtual Scroll
- **Zustand v5.0** - 클라이언트 상태 관리
- **Zod v4.3** - 스키마 검증
- **Sass v1.97** - 스타일링
- **React Hook Form v7.70** - 폼 관리

## 프로젝트 구조

```
src/
├── app/          # Next.js 페이지 및 라우팅
├── core/         # 공통 환경 (API, Config, Logger, Factory)
├── domains/      # 비즈니스 로직 (도메인별 분리)
└── shared/       # 공용 컴포넌트 (UI, Providers, Hooks, Stores)
```

### 디렉토리 역할

- **app/**: Next.js App Router 페이지, 레이아웃, 에러 처리
- **core/**: API 클라이언트, 환경 설정, Query/Mutation Factory, 로거
- **domains/**: 도메인별 비즈니스 로직 (auth, example, join)
- **shared/**: UI 컴포넌트, Provider, Custom Hooks, Zustand Store

## 주요 기능

### API 클라이언트

- 자동 토큰 갱신 (401 에러 자동 처리)
- 요청/응답 인터셉터
- 타임아웃 처리
- 타입 안전성

### 에러 처리

| 에러 타입     | 처리 방식               |
| ------------- | ----------------------- |
| 401           | 자동 토큰 갱신 + 재시도 |
| 403, 5xx      | 전역 토스트 표시        |
| 400, 404, 422 | 로컬 처리 (각 컴포넌트) |
| 페이지 에러   | error.tsx               |
| 루트 에러     | global-error.tsx        |
| 페이지 404    | not-found.tsx           |

### 상태 관리

- **TanStack Query v5.90**: 서버 상태 캐싱, Optimistic Updates
- **Zustand v5.0**: 클라이언트 전역 상태, localStorage 동기화

### 데이터 패칭

**Query/Mutation Factory 패턴:**

- `createQuery` / `createInfiniteQuery`: 타입 안전한 쿼리 정의
- `createMutation`: 기본 Mutation 생성
- `createOptimisticMutation`: Optimistic Updates 지원
- `createOptimisticListMutation`: List 추가 Optimistic Update
- `createOptimisticDeleteMutation`: List 삭제 Optimistic Update
- `createQueryKeys`: 타입 안전한 쿼리 키 관리
- `PrefetchBoundary`: 선언적 서버 프리패칭

### UI 컴포넌트

- `VirtualList`: TanStack Virtual 기반 가상 스크롤
- `BottomSheet`: 모바일 최적화 바텀시트
- `Accordion`: 아코디언 컴포넌트
- `GlobalLoading`: 전역 로딩 UI (Query/Mutation 자동 감지)
- `GlobalErrorHandler`: 전역 에러 처리 (401, 403, 5xx 자동 처리)

## 환경 설정

`.env.local`:

```env
# 클라이언트 API 엔드포인트 (브라우저에서 접근)
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# API 요청 타임아웃 (밀리초)
NEXT_PUBLIC_API_TIMEOUT=30000

# API Accept-Language 헤더
NEXT_PUBLIC_API_ACCEPT_LANGUAGE=ko-KR

# 디버그 모드 활성화
NEXT_PUBLIC_FEATURE_DEBUG=true

# SSR 전용 API 엔드포인트 (개발 환경에서만 사용)
API_TARGET_URL=http://backend:8080
```

## 예제

| 경로                         | 설명                                   |
| ---------------------------- | -------------------------------------- |
| `/example`                   | 예제 목록                              |
| `/example/ssg`               | SSG + CSR 하이브리드 패턴              |
| `/example/ssg/[id]`          | SSG 동적 라우트 (generateStaticParams) |
| `/example/csr`               | 순수 CSR 패턴                          |
| `/example/mutation`          | Mutation & Optimistic                  |
| `/example/infinite-scroll`   | Infinite Scroll                        |
| `/example/virtual-scroll`    | Virtual Scroll                         |
| `/example/streaming`         | Suspense Streaming                     |
| `/example/parallel-fetching` | 병렬 데이터 패칭                       |
| `/example/features-demo`     | 전역 로딩/에러 처리                    |

## 실제 페이지

| 경로                  | 설명                 |
| --------------------- | -------------------- |
| `/join/account`       | 회원가입 - 계정 정보 |
| `/join/auth-code`     | 회원가입 - 인증 코드 |
| `/join/auth-complete` | 회원가입 - 인증 완료 |
| `/join/onboarding`    | 회원가입 - 온보딩    |
| `/join/complete`      | 회원가입 - 완료      |

## 문서

- [아키텍처 가이드](./docs/architecture.md) - FSD+DDD 아키텍처, 프로젝트 구조
- [데이터 패칭 가이드](./docs/data-fetching.md) - TanStack Query, Factory 패턴
- [SSG 가이드](./docs/ssg-guide.md) - Static Site Generation, generateStaticParams
- [에러 처리 가이드](./docs/error-handling.md) - 계층별 에러 처리 전략
- [Virtual Scroll 가이드](./docs/virtual-scroll.md) - TanStack Virtual 활용

## 라이선스

MIT
