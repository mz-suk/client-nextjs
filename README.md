# Next.js 16 + React 19 프로젝트

DDD 아키텍처 기반 범용 Next.js 템플릿

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
```

## 기술 스택

- **Next.js 16** - App Router, Turbopack
- **React 19** - use() hook, Server Components
- **TypeScript 5.9**
- **TanStack Query** - 서버 상태 관리
- **Zustand** - 클라이언트 상태 관리
- **Axios** - HTTP 클라이언트

## 프로젝트 구조

```
src/
├── app/          # Next.js 페이지
├── core/         # API, Config (인프라)
├── domains/      # 비즈니스 로직 (User, Counter)
└── shared/       # 공통 리소스 (UI, Types)
```

**상세:** [아키텍처 가이드](./docs/ARCHITECTURE.md)

## 주요 기능

### 렌더링 방식

- SSG (Static Site Generation)
- CSR (Client-Side Rendering)
- Hybrid (SSG + React Query)

**상세:** [렌더링 가이드](./docs/RENDERING.md)

### 데이터 페칭

- TanStack Query (추천)
- React 19 use() hook
- Server Components

**상세:** [데이터 페칭 가이드](./docs/DATA_FETCHING.md)

### 상태 관리

- 서버 상태: TanStack Query
- 클라이언트 상태: Zustand

**상세:** [상태 관리 가이드](./docs/STATE_MANAGEMENT.md)

## 예제 페이지

| 경로                      | 설명                |
| ------------------------- | ------------------- |
| `/example-ssg`            | SSG 빌드            |
| `/example-api-usage`      | CSR + React Query   |
| `/example-hybrid`         | Hybrid (SSG + CSR)  |
| `/example-tanstack-query` | TanStack Query      |
| `/example-react19`        | React 19 use() hook |
| `/example-zustand`        | Zustand 상태 관리   |
| `/example-env-check`      | 환경변수 확인       |

## 환경 설정

`.env.local` 파일:

```env
NEXT_PUBLIC_API_URL=https://jsonplaceholder.typicode.com
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_FEATURE_DEBUG=true
```

## 성능 최적화

- React Compiler v1.0 (자동 메모이제이션)
- Next.js Image 최적화
- 번들 분석: `pnpm analyze`

**상세:** [성능 최적화 가이드](./docs/PERFORMANCE.md)

## 문서

- [프로젝트 구조](./docs/ARCHITECTURE.md)
- [렌더링 전략](./docs/RENDERING.md)
- [데이터 페칭](./docs/DATA_FETCHING.md)
- [상태 관리](./docs/STATE_MANAGEMENT.md)
- [성능 최적화](./docs/PERFORMANCE.md)

## 라이선스

MIT
