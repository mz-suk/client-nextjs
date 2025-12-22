# Next.js 16 + React 19 + TypeScript 프로젝트

DDD(Domain-Driven Design) 아키텍처 기반 Next.js 범용 템플릿

## 🏗️ 프로젝트 구조

```
src/
├── app/          # Next.js App Router 페이지
├── core/         # 핵심 인프라 (API, Config)
├── domains/      # 비즈니스 도메인 (User, Todo, Counter)
└── shared/       # 공유 리소스 (UI, Lib, Types)
```

자세한 아키텍처 설명은 [DDD_ARCHITECTURE.md](./docs/DDD_ARCHITECTURE.md)를 참고하세요.

## 🚀 시작하기

### 설치

```bash
pnpm install
```

### 개발 서버

```bash
pnpm dev
```

### 프로덕션 빌드

```bash
pnpm build
pnpm start
```

### 린트

```bash
pnpm lint
```

## 📦 기술 스택

- **Next.js 16** - App Router, Turbopack
- **React 19** - use() hook, Server Components
- **TypeScript 5.9** - 타입 안전성
- **TanStack Query** - 서버 상태 관리 및 데이터 페칭
- **Zustand** - 클라이언트 상태 관리
- **Axios** - HTTP 클라이언트
- **Zod** - 스키마 검증

## 🎯 주요 기능

### 렌더링 전략

- ✅ SSG (Static Site Generation)
- ✅ CSR (Client-Side Rendering)
- ✅ Hybrid (SSG + React Query)
- ✅ React 19 use() hook

### 데이터 페칭

- ✅ TanStack Query (React Query)
- ✅ React 19 use() hook

### 상태 관리

- ✅ Zustand (persist, devtools)

## 📚 예제 페이지

- `/example-api-usage` - CSR with React Query
- `/example-ssg` - Static Site Generation
- `/example-hybrid` - SSG + React Query Hybrid
- `/example-tanstack-query` - TanStack Query
- `/example-react19` - React 19 use() hook
- `/example-zustand` - Zustand 상태 관리
- `/example-env-check` - 환경변수 확인

## 🔧 환경 설정

`.env.local` 파일 생성:

```env
NEXT_PUBLIC_API_URL=https://jsonplaceholder.typicode.com
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_FEATURE_DEBUG=true
```

## 📖 문서

- [아키텍처 가이드](./docs/DDD_ARCHITECTURE.md)
- [데이터 페칭](./docs/DATA_FETCHING.md)
- [렌더링 전략](./docs/RENDERING.md)
- [상태 관리](./docs/STATE_MANAGEMENT.md)
- [성능 최적화](./docs/PERFORMANCE.md)

## 🎨 코드 스타일

- 함수형 프로그래밍 기반
- 시니어 개발자 레벨의 프로덕션 퀄리티
- 확장성과 유지보수성 중점
- 필수 주석 외 주석 최소화

## 📄 라이선스

MIT
