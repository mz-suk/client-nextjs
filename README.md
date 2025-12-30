# Next.js 16 + React 19 프로젝트

FSD + DDD 혼합 아키텍처 기반 프로덕션급 Next.js 템플릿

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

# 빌드 분석
pnpm analyze
```

## 기술 스택

- **Next.js 16** - App Router, Turbopack
- **React 19** - Server Components, React Compiler
- **TypeScript 5.9** - Strict mode
- **TanStack Query v5** - 서버 상태 관리
- **Zustand** - 클라이언트 상태 관리
- **Zod** - 스키마 검증
- **Sass** - 스타일링
- **React Hook Form** - 폼 관리

## 프로젝트 구조

```
src/
├── app/          # Next.js 페이지 및 라우팅
├── core/         # 공통 환경 (API, Config, Logger)
├── domains/      # 비즈니스 로직 (도메인별 분리)
└── shared/       # 공용 컴포넌트 (UI, Providers, Styles)
```

### 디렉토리 역할

- **app/**: Next.js App Router 페이지, 레이아웃, 에러 처리
- **core/**: API 클라이언트, 환경 설정, 로거, 공통 타입
- **domains/**: 도메인별 비즈니스 로직 (auth, user, join 등)
- **shared/**: 재사용 가능한 UI 컴포넌트, Provider, 스타일

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
- **Zustand**: 클라이언트 전역 상태, localStorage 동기화

### 데이터 패칭 (v2.0)

> - Query/Mutation Factory 헬퍼로 타입 안전성 강화
> - Optimistic Updates 지원
> - 개선된 서버 프리패칭 (PrefetchBoundary)

- `createQuery` / `createInfiniteQuery`: 타입 안전한 쿼리 정의
- `createMutation` / `createOptimisticMutation`: Optimistic Updates 지원
- `PrefetchBoundary`: 선언적 서버 프리패칭
- `createQueryKeys`: 일관된 쿼리 키 관리

### UI 컴포넌트

- BottomSheet (모바일 최적화)
- GlobalErrorHandler (전역 에러 토스트)
- GlobalLoading (전역 로딩 UI)

## 환경 설정

`.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_API_ACCEPT_LANGUAGE=ko-KR
NEXT_PUBLIC_FEATURE_DEBUG=true
API_TARGET_URL=http://backend:8080  # SSR 전용
```

## 예제 페이지

| 경로                       | 설명                  |
| -------------------------- | --------------------- |
| `/example`                 | 예제 목록             |
| `/example/ssg`             | SSG + CSR 하이브리드  |
| `/example/csr`             | 순수 CSR 데이터 패칭  |
| `/example/mutation`        | 데이터 생성/수정/삭제 |
| `/example/infinite-scroll` | 무한 스크롤           |
| `/example/virtual-scroll`  | Virtual Scroll        |
| `/example/features-demo`   | 전역 로딩/에러 처리   |

## 문서

- [아키텍처 가이드](./docs/architecture.md)
- [데이터 패칭 가이드](./docs/data-fetching.md)
- [에러 처리 가이드](./docs/error-handling.md)
- [Virtual Scroll 가이드](./docs/virtual-scroll.md)

## 라이선스

MIT
