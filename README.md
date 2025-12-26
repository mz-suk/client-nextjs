# Next.js 16 + React 19 프로젝트

모바일 하이브리드 앱(Flutter)의 웹뷰 영역을 개발하는 프로젝트입니다.

## 기술 스택

- **Framework**: Next.js 16.1 (App Router, Static Export)
- **React**: 19.2.3
- **Data Fetching**: TanStack Query 5.90.12
- **State Management**: Zustand
- **Styling**: Sass
- **Form**: React Hook Form + Zod
- **UI**: Base UI (Headless)

## 프로젝트 구조

```
src/
├── app/              # Next.js App Router
├── core/             # 공통 환경 (API, Config, Lib)
├── domains/          # 비즈니스 로직 (DDD)
└── shared/           # 공용 컴포넌트
```

## 주요 기능

### 데이터 패칭 (최적화됨)

- **React 19 cache API**: QueryClient 재사용
- **ensureQueryData**: 중복 fetch 방지
- **병렬 패칭**: Promise.all로 워터폴 방지
- **Optimistic Updates**: 즉각적인 UI 반응
- **Query Factory**: Keys/Options 통합 관리
- **조건부 재시도**: 4xx 재시도 제외

### API 클라이언트

- 자동 토큰 갱신 (401 에러 자동 처리)
- 타임아웃 처리 (30초)
- 에러 타입 분류 (Network, Auth, API, Unknown)

### 전역 기능

- **GlobalErrorHandler**: 중앙 집중식 에러 처리
- **GlobalLoading**: 자동 로딩 UI
- **BottomSheet**: 모바일 최적화 UI

## 시작하기

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build

# 린트
pnpm lint
```

## 환경 변수

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
API_TARGET_URL=http://backend:8080  # SSR 전용
```

## 예제 페이지

| 경로                         | 설명                |
| ---------------------------- | ------------------- |
| `/example/ssg`               | SSG + CSR 기본 패턴 |
| `/example/parallel-fetching` | 병렬 데이터 패칭    |
| `/example/streaming`         | Suspense Streaming  |
| `/example/csr`               | 순수 CSR            |
| `/example/mutation`          | Optimistic Updates  |
| `/example/infinite-scroll`   | 무한 스크롤         |

## 문서

- [빠른 참조 가이드](./docs/QUICK_REFERENCE.md) 🚀
- [데이터 패칭 가이드](./docs/data-fetching.md)
- [아키텍처 가이드](./docs/architecture.md)
- [에러 처리 가이드](./docs/error-handling.md)

## 라이선스

MIT
