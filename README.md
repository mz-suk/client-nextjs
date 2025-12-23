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
- **Native Fetch** - HTTP 클라이언트

## 프로젝트 구조

```
src/
├── app/          # Next.js 페이지
├── core/         # API, Config (인프라)
├── domains/      # 비즈니스 로직
└── shared/       # 공통 리소스 (UI, Types)
```

### 주요 디렉토리

- **app/**: Next.js App Router 페이지 및 라우팅
- **core/**: API 클라이언트, 환경 설정 등 인프라 레벨 코드
- **domains/**: 도메인별 비즈니스 로직 (services, hooks, stores, types)
- **shared/**: UI 컴포넌트, Provider, 유틸리티 등 공통 코드

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

## 라이선스

MIT
