# Next.js 16 + React 19 프로젝트 템플릿

> **서버 없는** SSG+CSR 하이브리드로 빠른 로딩 + 실시간 데이터를 동시에!

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React Compiler](https://img.shields.io/badge/React_Compiler-1.0-purple)](https://react.dev/learn/react-compiler)

---

## 🎯 프로젝트 소개

**서버 없는 정적 배포**로 최고의 성능과 사용성을 제공하는 Next.js 템플릿입니다.

### 🌟 핵심 컨셉

```
SSG (Static Site Generation)     →  빠른 초기 로딩 ⚡
      +
CSR (Client-Side Rendering)      →  실시간 데이터 🔄
      =
Hybrid Pattern                    →  최고의 사용성 🎯
```

### ⚡ 주요 특징

- **🌟 Hybrid 최우선** - SSG+CSR로 빠른 로딩 + 실시간 데이터
- **🚀 서버 불필요** - CDN 정적 배포만으로 완벽 작동
- **⚡ 자동 최적화** - React Compiler v1.0로 자동 메모이제이션
- **🔄 실시간 업데이트** - SWR/TanStack Query로 백그라운드 자동 갱신
- **🏗️ 확장 가능한 구조** - Feature-Sliced Design (FSD) 아키텍처
- **🛡️ 타입 안전성** - TypeScript strict + Zod 환경변수 검증
- **🔒 보안 강화** - CSP, Permissions-Policy 등 보안 헤더 적용
- **⚡ 성능 최적화** - DNS Prefetch, Preconnect로 API 연결 최적화
- **📦 최적화 도구** - Bundle Analyzer, 이미지 최적화
- **🚀 빠른 개발** - Plop.js 코드 제너레이터 + Turbopack

---

## 🚀 빠른 시작

### 1️⃣ 설치

```bash
# 저장소 클론
git clone <your-repo-url>
cd client-nextjs

# 의존성 설치
pnpm install
```

### 2️⃣ 환경변수 설정

```bash
# 환경변수 파일 생성
cp .env.example .env

# .env 파일 수정 (API URL 등)
NEXT_PUBLIC_API_URL=https://jsonplaceholder.typicode.com
```

### 3️⃣ 개발 서버 실행

```bash
pnpm dev
```

http://localhost:3000 에서 확인

### 4️⃣ 프로덕션 빌드

```bash
pnpm build
pnpm start
```

**🎉 5분 안에 시작 완료!**

---

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router (라우팅)
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈페이지
│   └── example-*/         # 예제 페이지들
│
├── features/              # 기능 단위 (비즈니스 로직)
│   └── user-list/
│       ├── api/          # API 호출 함수
│       ├── hooks/        # React 훅 (SWR, TanStack Query)
│       └── ui/           # UI 컴포넌트
│
├── entities/              # 비즈니스 엔티티 (도메인 모델)
│   ├── user/
│   └── todo/
│
└── shared/               # 공통 인프라
    ├── api/             # API 클라이언트 (Axios)
    ├── config/          # 환경변수, 설정
    ├── hooks/           # 공통 훅
    ├── lib/             # 유틸리티 (logger 등)
    └── ui/              # 공통 UI (ErrorBoundary)
```

**의존성 규칙:** `app → features → entities → shared`

> 📖 **상세 설명:** [ARCHITECTURE.md](./docs/ARCHITECTURE.md)

---

## 💡 핵심 사용법

### 새 기능 추가하기

**1. 코드 제너레이터 사용 (권장)**

```bash
# Feature 생성 (Entity + API + Hooks + UI)
pnpm generate:feature

# 프롬프트에 따라 입력
? Feature name: product-list
? Entity name: product
```

자동으로 생성됨:

- `entities/product/` - 타입 정의
- `features/product-list/api/` - API 함수
- `features/product-list/hooks/` - React 훅
- `features/product-list/ui/` - UI 컴포넌트

**2. 페이지에서 사용**

```typescript
// app/products/page.tsx (Server Component)
import { getProducts, ProductListHybrid } from '@/features/product-list';

export default async function ProductsPage() {
  const products = await getProducts();
  return <ProductListHybrid initialProducts={products} />;
}

// 또는 Client Component로만 (CSR)
// 'use client';
// import { ProductList } from '@/features/product-list/ui';
// export default function ProductsPage() {
//   return <ProductList />;
// }
```

> 📖 **상세 가이드:** [GENERATOR.md](./docs/GENERATOR.md)

### 데이터 페칭

**SWR (경량, 간단)**

```typescript
import { useUsers } from '@/features/user-list';

function Component() {
  const { users, isLoading, error } = useUsers();
  // initialData가 있는 경우 (Hybrid 패턴)
  // const { users, isLoading, error } = useUsers({ initialData });
}
```

**TanStack Query (강력, 복잡한 상태)**

```typescript
import { useUsersQuery } from '@/features/user-list';

function Component() {
  const { data, isLoading, error } = useUsersQuery();
  const users = data || [];
}
```

> 📖 **상세 가이드:** [DATA_FETCHING.md](./docs/DATA_FETCHING.md)

### 상태 관리

**Zustand (클라이언트 상태)**

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useCounterStore = create<CounterState>()(
  devtools(
    persist(
      set => ({
        count: 0,
        increment: () => set(state => ({ count: state.count + 1 })),
        decrement: () => set(state => ({ count: state.count - 1 })),
        reset: () => set({ count: 0 }),
      }),
      { name: 'counter-storage' }
    )
  )
);
```

> 📖 **상세 가이드:** [STATE_MANAGEMENT.md](./docs/STATE_MANAGEMENT.md)

### 렌더링 전략

| 방식       | 사용 시점                       | 예제 페이지          | 우선순위 |
| ---------- | ------------------------------- | -------------------- | -------- |
| **Hybrid** | **대부분의 경우** (빠름+실시간) | `/example-hybrid`    | ⭐⭐⭐   |
| **SSG**    | 변경 거의 없는 정적 콘텐츠      | `/example-ssg`       | ⭐⭐     |
| **CSR**    | SEO 불필요 (인증, 대시보드)     | `/example-api-usage` | ⭐       |

**💡 Hybrid = SSG(빌드 시 HTML) + CSR(클라이언트 자동 업데이트)**

> 📖 **상세 가이드:** [RENDERING.md](./docs/RENDERING.md)

---

## 📚 문서

### 핵심 가이드

| 문서                                                 | 설명                            |
| ---------------------------------------------------- | ------------------------------- |
| [🏗️ ARCHITECTURE.md](./docs/ARCHITECTURE.md)         | FSD 아키텍처 상세 설명          |
| [🔄 DATA_FETCHING.md](./docs/DATA_FETCHING.md)       | API, SWR, TanStack Query 사용법 |
| [🎨 STATE_MANAGEMENT.md](./docs/STATE_MANAGEMENT.md) | Zustand 상태 관리               |
| [🎭 RENDERING.md](./docs/RENDERING.md)               | SSG, Hybrid, CSR 렌더링 전략    |
| [⚡ REACT_COMPILER.md](./docs/REACT_COMPILER.md)     | React Compiler 자동 최적화      |

### 추가 가이드

| 문서                                         | 설명                      |
| -------------------------------------------- | ------------------------- |
| [🛠️ GENERATOR.md](./docs/GENERATOR.md)       | Plop.js 코드 제너레이터   |
| [📊 PERFORMANCE.md](./docs/PERFORMANCE.md)   | 성능 최적화 기법          |
| [🚀 DEPLOYMENT.md](./docs/DEPLOYMENT.md)     | 배포 가이드               |
| [📋 PROJECT_PLAN.md](./docs/PROJECT_PLAN.md) | 프로젝트 계획 및 히스토리 |

---

## 🛠️ 스크립트

```bash
# 개발
pnpm dev              # 개발 서버 (Turbopack)
pnpm dev:prod         # 프로덕션 모드 개발 서버

# 빌드
pnpm build            # 프로덕션 빌드
pnpm start            # 프로덕션 서버 실행

# 코드 품질
pnpm lint             # TypeScript + ESLint 검사
pnpm format           # Prettier 포맷팅

# 코드 생성
pnpm generate         # 대화형 제너레이터
pnpm generate:feature # Feature 생성
pnpm generate:component # 컴포넌트 생성
pnpm generate:hook    # 훅 생성
pnpm generate:page    # 페이지 생성

# 분석
pnpm analyze          # 번들 크기 분석
```

---

## 🔧 기술 스택

### Core

- **Next.js 16.1** - React 프레임워크 (App Router)
- **React 19.2** - UI 라이브러리
- **TypeScript 5.9** - 타입 안전성
- **React Compiler 1.0** - 자동 메모이제이션 ⚡

### 데이터 페칭

- **Axios 1.12** - HTTP 클라이언트
- **SWR 2.3** - 경량 데이터 페칭
- **TanStack Query 5.90** - 강력한 서버 상태 관리

### 상태 관리

- **Zustand 5.0** - 클라이언트 상태 관리

### 개발 도구

- **Plop 4.0** - 코드 제너레이터
- **Turbopack** - 고속 번들러
- **Zod 4.1** - 환경변수 검증
- **ESLint 9.38** - 코드 린팅
- **Prettier 3.6** - 코드 포맷팅

---

## 🌟 예제 페이지

| URL                       | 설명              | 기술                  |
| ------------------------- | ----------------- | --------------------- |
| `/`                       | 홈페이지          | 렌더링 방식 소개      |
| `/example-ssg`            | SSG 예제          | Static Generation     |
| `/example-hybrid`         | Hybrid 예제       | SSG + SWR (권장)      |
| `/example-api-usage`      | CSR 예제          | Client-Side Rendering |
| `/example-react19`        | React 19 use() 훅 | Promise Unwrapping    |
| `/example-tanstack-query` | TanStack Query    | 서버 상태 관리        |
| `/example-zustand`        | Zustand           | 클라이언트 상태 관리  |

---

## 🎓 학습 순서 (권장)

1. **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - FSD 구조 이해 (10분)
2. **예제 페이지 둘러보기** - 실제 코드 확인 (10분)
3. **[GENERATOR.md](./docs/GENERATOR.md)** - 코드 생성 실습 (5분)
4. **[DATA_FETCHING.md](./docs/DATA_FETCHING.md)** - 데이터 페칭 이해 (15분)
5. **첫 기능 만들어보기** - 실전 연습 (30분)

**총 소요 시간: 약 1시간** ⏱️

---

## 🚀 배포

### 지원 플랫폼

| 플랫폼                | 난이도 | 추천도 | 특징                      |
| --------------------- | ------ | ------ | ------------------------- |
| **Vercel**            | ⭐     | ⭐⭐⭐ | Next.js 최적화, 자동 배포 |
| **AWS Amplify**       | ⭐⭐   | ⭐⭐   | Git 연동, PR 미리보기     |
| **Netlify**           | ⭐     | ⭐⭐   | Form 처리, 분할 테스팅    |
| **AWS S3+CloudFront** | ⭐⭐⭐ | ⭐⭐   | 완전 제어, 저렴한 비용    |
| **GitHub Pages**      | ⭐⭐   | ⭐     | 무료, 간단                |

### 빠른 배포 (Vercel)

```bash
# Vercel CLI 설치
pnpm add -g vercel

# 배포
vercel
```

### AWS Amplify

```bash
# Amplify CLI 설치
npm install -g @aws-amplify/cli

# 초기화 및 배포
amplify init
amplify publish
```

> 📖 **상세 가이드:** [DEPLOYMENT.md](./docs/DEPLOYMENT.md) - AWS S3, CloudFront, Amplify, Netlify, GitHub Pages 등

---

## 🤝 기여

기여를 환영합니다!

```bash
# 1. 브랜치 생성
git checkout -b feature/new-feature

# 2. 코드 작성 및 검증
pnpm lint && pnpm build

# 3. PR 생성
```

> 📖 **상세 가이드:** [CONTRIBUTING.md](./docs/CONTRIBUTING.md)

---

## 📄 라이선스

MIT License

---

## 🔍 SEO 설정

### robots.txt / sitemap.xml

Next.js는 동적 생성을 지원합니다:

```typescript
// app/robots.ts
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://your-domain.com/sitemap.xml',
  };
}

// app/sitemap.ts
export default async function sitemap() {
  return [{ url: 'https://your-domain.com', lastModified: new Date() }];
}
```

> 📖 **상세 가이드:** [DEPLOYMENT.md - SEO 최적화](./docs/DEPLOYMENT.md#-seo-최적화)

---

## 🆘 문제 해결

### CORS 에러

```bash
# .env.development 확인
NEXT_PUBLIC_API_URL=/api/proxy
API_TARGET_URL=https://your-api-url
```

### 빌드 실패

```bash
pnpm lint          # 에러 확인
pnpm format        # 포맷팅 수정
```

### React Compiler 확인

```bash
pnpm build | grep "reactCompiler"
# ✓ reactCompiler 표시 확인
```

> 📖 **상세 트러블슈팅:** 각 문서의 "문제 해결" 섹션 참고

---

## 💬 FAQ

**Q: SWR과 TanStack Query 중 무엇을 사용해야 하나요?**  
A: 간단한 데이터 페칭은 SWR, 복잡한 서버 상태 관리는 TanStack Query를 권장합니다.

**Q: React Compiler는 언제 사용하나요?**  
A: 기본적으로 활성화되어 있으며, 자동으로 최적화합니다. 수동 `useMemo`/`useCallback` 작성이 불필요합니다.

**Q: 새 기능을 어떻게 추가하나요?**  
A: `pnpm generate:feature` 명령어로 자동 생성하거나, [GENERATOR.md](./docs/GENERATOR.md)를 참고하세요.

**Q: 환경변수는 어떻게 관리하나요?**  
A: `.env.example`을 복사하여 `.env` 파일을 만들고, Zod로 자동 검증됩니다 (`shared/config/env.ts`). 검증된 환경변수는 `shared/config/constants.ts`에서 애플리케이션 상수로 변환되어 사용됩니다.

---

<div align="center">

**⭐ 이 템플릿이 유용했다면 Star를 눌러주세요!**

Made with ❤️ by Your Team

</div>
