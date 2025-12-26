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
- **React 19** - use() hook, Server Components, React Compiler
- **TypeScript 5.9** - Strict mode
- **TanStack Query v5** - 서버 상태 관리 및 캐싱
- **Zustand** - 클라이언트 상태 관리
- **Zod** - 스키마 검증
- **Sass** - 스타일링
- **React Hook Form** - 폼 관리

## 프로젝트 구조

```
src/
├── app/          # Next.js 페이지 및 라우팅
├── core/         # 공통 환경 (API, Config, Logger)
├── domains/      # 비즈니스 로직 (Services, Hooks, Stores)
└── shared/       # 공용 컴포넌트 (UI, Providers, Styles)
```

### 주요 디렉토리

- **app/**: Next.js App Router 페이지, 레이아웃, 에러 핸들링
- **core/**: API 클라이언트, 환경 설정, 로거, 공통 타입
- **domains/**: 도메인별 비즈니스 로직 분리 (auth, user, join 등)
- **shared/**: 재사용 가능한 UI 컴포넌트, Provider, 공통 스타일

## 상세 문서

- [Core 아키텍처 가이드](./docs/core-architecture.md)
- [Shared Components 가이드](./docs/shared-components.md)
- [데이터 패칭 가이드](./docs/data-fetching-guide.md)
- [에러 처리 가이드](./docs/error-handling-guide.md)

## 예제 페이지

| 경로                       | 설명                             |
| -------------------------- | -------------------------------- |
| `/example`                 | 예제 목록 및 학습 가이드         |
| `/example/ssg`             | SSG + CSR 하이브리드 패턴        |
| `/example/csr`             | 순수 CSR 데이터 패칭             |
| `/example/mutation`        | 데이터 생성/수정/삭제 (Mutation) |
| `/example/infinite-scroll` | 무한 스크롤 (Infinite Scroll)    |
| `/example/features-demo`   | 전역 로딩/에러 처리 통합 테스트  |

### 주요 패턴

**SSG + CSR 하이브리드** (권장)

- 빌드 타임에 데이터 prefetch → 정적 HTML 생성
- 클라이언트에서 Hydration 후 TanStack Query로 관리
- 초기 로딩 속도 + SEO + 실시간 업데이트

**CSR (Client-Side Rendering)**

- 클라이언트에서만 데이터 페칭
- 전역 로딩/에러 처리 자동 적용
- 실시간 데이터에 적합

**Mutation (데이터 변경)**

- 생성/수정/삭제 작업
- 자동 캐시 무효화
- Optimistic Update 지원

자세한 내용은 [데이터 패칭 가이드](./docs/data-fetching-guide.md) 참고

## 환경 설정

`.env.local` 파일 생성:

```env
# API 설정
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_API_ACCEPT_LANGUAGE=ko-KR

# 디버그 모드
NEXT_PUBLIC_FEATURE_DEBUG=true

# SSR 전용 (선택)
API_TARGET_URL=http://backend:8080
```

자세한 내용은 [Core 아키텍처 가이드](./docs/core-architecture.md#환경-변수) 참고

## 주요 기능

### API 클라이언트

- 자동 토큰 갱신 및 인증 관리 (401 에러 자동 처리)
- 요청/응답 인터셉터
- 자동 재시도 (네트워크 에러, 5xx)
- 타임아웃 처리
- 타입 안전성

### 에러 처리

- **401**: 자동 토큰 갱신 + 재시도 (투명 처리)
- **403, 5xx**: 전역 토스트 표시 (GlobalErrorHandler)
- **400, 404, 422**: 로컬 처리 (각 컴포넌트)
- **페이지 에러**: error.tsx, global-error.tsx, not-found.tsx

자세한 내용은 [에러 처리 가이드](./docs/error-handling-guide.md) 참고

### 상태 관리

- **TanStack Query**: 서버 상태 캐싱, 자동 리페치
- **Zustand**: 클라이언트 전역 상태, localStorage 동기화

### 로깅

- 구조화된 로깅 (Context 지원)
- 로그 레벨 제어
- 개발/프로덕션 환경 자동 분기

### UI 컴포넌트

- BottomSheet (모바일 최적화)
- GlobalErrorHandler (전역 에러 토스트)
- GlobalLoading (전역 로딩 UI)
- 폰트: Pretendard Variable, SUITE Variable

## 성능 최적화

- **React Compiler v1.0**: 자동 메모이제이션
- **Next.js Image**: 이미지 최적화
- **Code Splitting**: 자동 번들 분할
- **SSG/ISR**: 정적 생성 및 증분 재생성

## 라이선스

MIT

## 에러 처리 아키텍처

### 계층별 처리

| 에러 타입     | 처리 위치          | UI          | 설명                    |
| ------------- | ------------------ | ----------- | ----------------------- |
| 401           | client.ts          | 없음        | 자동 토큰 갱신 + 재시도 |
| 403           | GlobalErrorHandler | 토스트      | 권한 없음 → 로그인 이동 |
| 5xx           | GlobalErrorHandler | 토스트      | 서버 에러 안내          |
| 400, 404, 422 | 로컬 (컴포넌트)    | 커스텀      | 비즈니스 로직 에러      |
| 페이지 에러   | error.tsx          | 전체 페이지 | 렌더링 에러             |
| 루트 에러     | global-error.tsx   | 전체 페이지 | 치명적 에러             |
| 페이지 404    | not-found.tsx      | 전체 페이지 | 존재하지 않는 페이지    |

### 중복 제거

- ❌ **ErrorBoundary**: Next.js error.tsx로 대체
- ❌ **QueryErrorBoundary**: GlobalErrorHandler로 통합
- ✅ **단일 책임**: 각 계층이 명확한 역할 수행

자세한 내용: [에러 처리 가이드](./docs/error-handling-guide.md) | [error.tsx vs global-error.tsx](./docs/error-boundaries-explained.md)
