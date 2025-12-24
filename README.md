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

## 예제 페이지

| 경로               | 설명                   |
| ------------------ | ---------------------- |
| `/example/ssg`     | SSG + TanStack Query   |
| `/example/csr`     | CSR + TanStack Query   |
| `/example/zustand` | Zustand 전역 상태 관리 |

### SSG + TanStack Query

빌드 타임에 데이터를 prefetch하고 클라이언트에서 TanStack Query로 관리합니다.

- 초기 페이지 로딩 속도 향상
- SEO 최적화
- 자동 리페치 및 캐싱

### CSR + TanStack Query

완전히 클라이언트에서 데이터를 페칭하고 관리합니다.

- 로딩, 에러 상태 자동 관리
- 백그라운드 업데이트
- 캐싱 및 리페치 전략

### Zustand

간단하고 직관적한 전역 상태 관리 라이브러리입니다.

- DevTools 지원
- localStorage 자동 동기화
- TypeScript 완벽 지원

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

- 자동 토큰 갱신 및 인증 관리
- 요청/응답 인터셉터
- 자동 재시도 (네트워크 에러, 5xx)
- 타임아웃 처리
- 타입 안전성

### 상태 관리

- **TanStack Query**: 서버 상태 캐싱, 자동 리페치
- **Zustand**: 클라이언트 전역 상태, localStorage 동기화

### 로깅

- 구조화된 로깅 (Context 지원)
- 로그 레벨 제어
- 개발/프로덕션 환경 자동 분기

### UI 컴포넌트

- BottomSheet (모바일 최적화)
- ErrorBoundary
- 폰트: Pretendard Variable, SUITE Variable

## 성능 최적화

- **React Compiler v1.0**: 자동 메모이제이션
- **Next.js Image**: 이미지 최적화
- **Code Splitting**: 자동 번들 분할
- **SSG/ISR**: 정적 생성 및 증분 재생성

## 라이선스

MIT
