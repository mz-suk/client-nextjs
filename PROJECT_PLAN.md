# 범용 템플릿 리팩토링 프로젝트 계획

## 📊 프로젝트 개요

Next.js 15 + React 19 기반 인천 면세점 클라이언트 애플리케이션을 범용 템플릿으로 전환하고, 최신 개발 트렌드를 반영하여 재사용 가능한 프로젝트 보일러플레이트를 구축합니다.

---

## ✅ 완료된 작업 (1-2단계)

### 1. 도메인 중립화 작업 ✅

#### 1.1 예제 도메인 교체 ✅

**상태:** 완료  
**변경 내용:**

- ❌ 제거: `entities/nation`, `features/nation-list`, `entities/post`
- ✅ 추가: `entities/user`, `entities/todo`, `features/user-list`
- API 변경: 인천 면세점 API → JSONPlaceholder API (https://jsonplaceholder.typicode.com)

**구현 내용:**

- User 엔티티: 사용자 정보 모델 (id, name, email, company 등)
- Todo 엔티티: 할일 모델 (userId, title, completed)
- User List Feature:
  - API: `getUsers()`, `getUser(id)`
  - Hooks: `useUsers()`, `useUser(id)` (SWR)
  - Hooks: `useUsersQuery()`, `useUserQuery(id)` (TanStack Query)
  - UI: SSG, Hybrid, CSR, React 19 use(), TanStack Query 버전

**예제 페이지:**

- `/example-ssg` - SSG로 사용자 목록 표시
- `/example-hybrid` - SSG + SWR로 하이브리드 렌더링
- `/example-api-usage` - CSR with SWR
- `/example-react19` - React 19 use() 훅
- `/example-tanstack-query` - TanStack Query
- `/example-zustand` - Zustand 상태 관리

#### 1.2 API 클라이언트 범용화 ✅

**상태:** 완료  
**변경 내용:**

- 하드코딩된 `Accept-Language: ko` 제거
- 환경변수 `NEXT_PUBLIC_API_ACCEPT_LANGUAGE`로 분리
- 언어 설정이 없으면 헤더에 포함하지 않음

**코드 개선:**

```typescript
const getDefaultHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    accept: '*/*',
  };

  if (env.API_ACCEPT_LANGUAGE) {
    headers['Accept-Language'] = env.API_ACCEPT_LANGUAGE;
  }

  return headers;
};
```

---

### 2. 최신 개발 트렌드 적용 ✅

#### 2.1 Next.js 15 신규 기능 활용 ⏭️

**상태:** 스킵 (서버 미사용 템플릿)  
**사유:**

- A. Server Actions: 서버 필요 → 불가능
- B. Parallel Routes & Intercepting Routes: 서버 필요 → 불가능
- C. Route Handlers: 서버 필요 → 불가능

**대안:** 정적 빌드 및 클라이언트 중심 아키텍처 유지

#### 2.2 React 19 신규 기능 ✅

**상태:** 완료  
**구현 내용:**

**A. use() 훅 예제**

- 파일: `features/user-list/ui/UserListWithUse.tsx`
- 기능: Promise를 직접 unwrap하여 데이터 가져오기
- Suspense와 통합하여 로딩 상태 처리
- 예제 페이지: `/example-react19`

**특징:**

- 간결한 코드 (useEffect + useState 불필요)
- 자동 Suspense 통합
- 조건부 실행 가능 (훅 규칙의 예외)

**참고:**

- `useOptimistic`, `useActionState`는 Server Actions와 연관되어 서버 미사용 환경에서는 제한적

#### 2.3 상태 관리 옵션 추가 ✅

**상태:** 완료  
**구현 내용:**

**A. Zustand 통합**

- 패키지: `zustand@^5.0.8`
- 파일: `shared/stores/useCounterStore.ts`
- Middleware: devtools, persist 적용
- 예제 페이지: `/example-zustand`

**특징:**

- 간단한 API (useState와 유사)
- 최소한의 boilerplate
- localStorage 자동 저장
- Redux DevTools 지원
- 매우 작은 번들 크기 (~1KB)

**B. TanStack Query (React Query v5) 통합**

- 패키지: `@tanstack/react-query@5.90.5`
- 패키지: `@tanstack/react-query-devtools@5.90.2`
- 파일:
  - `shared/config/tanstack-query.ts` - 설정
  - `shared/providers/QueryProvider.tsx` - Provider
  - `features/user-list/hooks/useUsersQuery.ts` - 훅
- 예제 페이지: `/example-tanstack-query`

**설정:**

```typescript
defaultOptions: {
  queries: {
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 3,
  }
}
```

**특징:**

- 강력한 캐싱 및 무효화
- DevTools로 쿼리 상태 시각화
- 자동 재시도 및 에러 처리
- Optimistic Updates 지원
- Infinite Queries 지원

**기존 SWR 유지:**

- SWR 기반 훅 그대로 유지
- 사용자가 선택 가능하도록 양쪽 옵션 제공
- 리스크 없이 점진적 마이그레이션 가능

---

## 📋 향후 작업 계획 (3단계 이후)

### 3. 개발자 경험(DX) 개선

#### 3.1 개발 도구 추가

**A. Storybook 통합**

- 패키지: `@storybook/nextjs`, `@storybook/react`
- 공통 컴포넌트 스토리 작성
- 디자인 시스템 문서화
- 격리된 환경에서 컴포넌트 개발

**B. 테스팅 환경 구축**

- Vitest / Jest 설정
- `@testing-library/react` 통합
- 유닛 테스트 예제
- Playwright를 활용한 E2E 테스트

**C. Mock Service Worker (MSW)**

- API 모킹 설정
- 개발/테스트 환경 분리
- 오프라인 개발 지원

**예상 영향도:** 낮음 (기존 코드 영향 없음)

#### 3.2 코드 제너레이터

**Plop.js 또는 커스텀 스크립트**

```bash
pnpm generate:feature user-profile
# → entities/user-profile
# → features/user-profile (api, hooks, ui)

pnpm generate:component Button
pnpm generate:api getUserProfile
```

**생성 항목:**

- Feature 전체 구조
- React 컴포넌트
- API 함수
- 커스텀 훅

**예상 영향도:** 낮음

#### 3.3 환경변수 검증 강화

**Zod 기반 환경변수 스키마**

```typescript
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_API_TIMEOUT: z.coerce.number().min(1000),
  NEXT_PUBLIC_FEATURE_DEBUG: z.coerce.boolean(),
});

export const env = envSchema.parse(process.env);
```

**기능:**

- 타입 안전성 강화
- 런타임 검증
- 명확한 에러 메시지

**예상 영향도:** 낮음

#### 3.4 개발 환경 개선

- 핫 리로드 최적화
- 개발용 디버그 패널
- API 모니터링 도구
- 성능 프로파일링

---

### 4. UI/UX 개선

#### 4.1 디자인 시스템

**옵션 1: Tailwind CSS 통합 (추천)**

```bash
pnpm add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**장점:**

- 최신 트렌드
- 빠른 개발 속도
- 작은 번들 크기 (PurgeCSS)
- 풍부한 유틸리티 클래스

**옵션 2: CSS Modules 유지**

- 현재 방식 유지
- 영향도 최소화
- 기존 스타일 그대로 사용

**권장:** CSS Modules와 Tailwind 병행 사용

**추가 작업:**

- 디자인 토큰 시스템 (색상, 간격, 타이포그래피)
- 다크모드 지원
- 공통 컴포넌트 라이브러리 (Button, Input, Card 등)

**예상 영향도:** 중간 (선택적 적용 가능)

#### 4.2 접근성(a11y) 개선

**체크리스트:**

- [ ] ARIA 레이블 추가
- [ ] 키보드 네비게이션 지원
- [ ] 스크린 리더 호환성
- [ ] 색상 대비 개선
- [ ] 포커스 관리

**도구:**

- `axe-core` 통합
- `eslint-plugin-jsx-a11y`
- Lighthouse CI

**예상 영향도:** 중간

#### 4.3 성능 최적화

**A. 이미지 최적화**

```typescript
import Image from 'next/image';

<Image
  src="/image.jpg"
  width={500}
  height={300}
  alt="Description"
  priority={false}
/>
```

**B. 폰트 최적화**

```typescript
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
```

**C. 번들 최적화**

- Dynamic Import
- Code Splitting 전략
- Tree Shaking 검증
- 번들 분석 (`@next/bundle-analyzer`)

**목표:**

- Lighthouse 점수 90+ 유지
- First Contentful Paint < 1.5s
- Time to Interactive < 3s

**예상 영향도:** 중간

---

### 5. 보안 강화

#### 5.1 인증/인가 시스템

**옵션 1: NextAuth.js v5 (Auth.js) - 추천**

```bash
pnpm add next-auth@beta
```

**기능:**

- OAuth 제공자 (Google, GitHub 등)
- JWT/Session 관리
- 자격 증명 인증
- Protected Routes

**옵션 2: Clerk**

- 완전 관리형 인증
- 사용자 관리 UI 제공
- 소셜 로그인

**옵션 3: Supabase Auth**

- 오픈소스
- 백엔드 통합

**구현 예제:**

```typescript
// middleware.ts
export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
};
```

**예상 영향도:** 낮음 (선택적 기능)

#### 5.2 보안 헤더 강화

**next.config.ts 추가:**

```typescript
headers: [
  {
    source: '/:path*',
    headers: [
      { key: 'X-DNS-Prefetch-Control', value: 'on' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
      { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      {
        key: 'Content-Security-Policy',
        value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline';",
      },
    ],
  },
];
```

**예상 영향도:** 낮음

#### 5.3 환경변수 보안

**작업:**

- [ ] `.env.example` 파일 생성
- [ ] 민감 정보 암호화 (`dotenv-vault`)
- [ ] 환경변수 검증 강화 (Zod)
- [ ] 프로덕션 환경 분리

**예시 `.env.example`:**

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_API_TIMEOUT=30000

# Feature Flags
NEXT_PUBLIC_FEATURE_DEBUG=false

# Optional
NEXT_PUBLIC_API_ACCEPT_LANGUAGE=ko

# Server-side only (개발 환경)
API_TARGET_URL=https://dev-api.example.com
```

**예상 영향도:** 낮음

---

### 6. 배포 및 CI/CD

#### 6.1 Docker 지원

**Dockerfile (멀티 스테이지 빌드):**

```dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

**docker-compose.yml:**

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NEXT_PUBLIC_API_URL=https://api.example.com
```

**예상 영향도:** 낮음

#### 6.2 CI/CD 파이프라인

**GitHub Actions - CI**
`.github/workflows/ci.yml`

```yaml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build
```

**GitHub Actions - Deploy**
`.github/workflows/deploy.yml`

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

**예상 영향도:** 낮음

#### 6.3 모니터링

**옵션:**

**A. Sentry (에러 트래킹)**

```bash
pnpm add @sentry/nextjs
```

**B. Vercel Analytics**

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**C. Google Analytics 4**

```typescript
import Script from 'next/script';

<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
  strategy="afterInteractive"
/>
```

**예상 영향도:** 낮음

---

### 7. 문서화 개선

#### 7.1 README 개선

**추가 섹션:**

- [ ] 배지 추가 (버전, 라이선스, 빌드 상태)
- [ ] 스크린샷 및 데모 GIF
- [ ] 기여 가이드라인
- [ ] 라이선스 명시 (MIT 추천)
- [ ] 사용 사례 및 예제

**배지 예시:**

```markdown
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![License](https://img.shields.io/badge/license-MIT-green)
```

#### 7.2 추가 문서 작성

**새 파일:**

- `CONTRIBUTING.md` - 기여 가이드
  - 코드 스타일 가이드
  - PR 프로세스
  - 이슈 작성 방법
- `ARCHITECTURE.md` - 아키텍처 상세 설명
  - FSD 레이어별 상세 설명
  - 의존성 그래프
  - 데이터 플로우

- `DEPLOYMENT.md` - 배포 가이드
  - Vercel 배포
  - Docker 배포
  - 전통적인 서버 배포

- `CHANGELOG.md` - 변경 이력
  - 버전별 변경사항
  - Breaking Changes
  - Migration Guide

- `docs/` 폴더
  - `docs/api.md` - API 사용 가이드
  - `docs/components.md` - 컴포넌트 가이드
  - `docs/styling.md` - 스타일링 가이드
  - `docs/testing.md` - 테스팅 가이드

#### 7.3 API 문서 자동 생성

**Typedoc 통합:**

```bash
pnpm add -D typedoc
```

**typedoc.json:**

```json
{
  "entryPoints": ["src"],
  "out": "docs/api",
  "exclude": ["**/*.test.ts", "**/*.spec.ts"]
}
```

**OpenAPI/Swagger:**

- JSONPlaceholder API 명세 문서화
- 인터랙티브 API 테스트

**예상 영향도:** 낮음

---

### 8. 프로젝트 설정 개선

#### 8.1 패키지 관리

**package.json 업데이트:**

```json
{
  "packageManager": "pnpm@10.14.0",
  "volta": {
    "node": "20.18.0",
    "pnpm": "10.14.0"
  }
}
```

**의존성 자동 업데이트:**

- Renovate Bot 설정
- Dependabot 설정
- 자동 PR 생성

**renovate.json:**

```json
{
  "extends": ["config:base"],
  "schedule": ["before 3am on Monday"],
  "packageRules": [
    {
      "matchUpdateTypes": ["minor", "patch"],
      "automerge": true
    }
  ]
}
```

**예상 영향도:** 낮음

#### 8.2 커밋 규칙

**Commitlint + Commitizen 통합:**

```bash
pnpm add -D @commitlint/cli @commitlint/config-conventional commitizen cz-conventional-changelog
```

**commitlint.config.js:**

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'perf']],
  },
};
```

**Husky 훅 추가:**

```bash
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit ${1}'
```

**Conventional Commits 형식:**

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 리팩토링
test: 테스트 코드
chore: 빌드/설정 변경
perf: 성능 개선
```

**예상 영향도:** 낮음

#### 8.3 코드 품질

**SonarQube/SonarCloud 연동:**

- 정적 코드 분석
- 코드 스멜 감지
- 보안 취약점 검사

**코드 커버리지:**

```json
{
  "scripts": {
    "test:coverage": "vitest run --coverage"
  }
}
```

**Pre-push 훅:**

```bash
npx husky add .husky/pre-push 'pnpm test'
```

**예상 영향도:** 낮음

---

### 9. 추가 기능 제안

#### 9.1 다국어(i18n) 지원

**next-intl 통합:**

```bash
pnpm add next-intl
```

**구조:**

```
src/
  i18n/
    messages/
      en.json
      ko.json
      ja.json
```

**사용 예시:**

```typescript
import { useTranslations } from 'next-intl';

function Component() {
  const t = useTranslations('common');
  return <h1>{t('title')}</h1>;
}
```

**예상 영향도:** 중간

#### 9.2 PWA 지원

**next-pwa 통합:**

```bash
pnpm add next-pwa
```

**기능:**

- Service Worker 자동 생성
- Offline 지원
- 앱 설치 기능
- Push Notification

**next.config.ts:**

```typescript
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  // next config
});
```

**예상 영향도:** 낮음

#### 9.3 에러 바운더리

**전역 에러 바운더리:**

```typescript
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>문제가 발생했습니다!</h2>
      <button onClick={reset}>다시 시도</button>
    </div>
  );
}
```

**404 페이지:**

```typescript
// app/not-found.tsx
export default function NotFound() {
  return <div>페이지를 찾을 수 없습니다.</div>;
}
```

**예상 영향도:** 낮음

---

## 🚨 추가 고려사항

### A. 타입 안전성 강화

**openapi-typescript를 활용한 타입 자동 생성:**

```bash
pnpm add -D openapi-typescript
```

**설정:**

```json
{
  "scripts": {
    "generate:types": "openapi-typescript https://api.example.com/openapi.json -o src/types/api.ts"
  }
}
```

**엔드투엔드 타입 안전성:**

- API 응답 타입 자동 생성
- 요청/응답 타입 검증
- Zod를 활용한 런타임 검증

**예상 영향도:** 중간

### B. 성능 측정

**Lighthouse CI:**

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            https://staging.example.com
          uploadArtifacts: true
```

**Web Vitals 모니터링:**

```typescript
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

<SpeedInsights />
```

**번들 분석:**

```bash
pnpm add -D @next/bundle-analyzer
```

**예상 영향도:** 낮음

### C. 개발 워크플로우

**Git Flow 또는 GitHub Flow:**

- 브랜치 전략 문서화
- PR 템플릿
- Issue 템플릿

**.github/PULL_REQUEST_TEMPLATE.md:**

```markdown
## 변경 사항

<!-- 무엇을 변경했는지 설명 -->

## 관련 이슈

<!-- #이슈번호 -->

## 체크리스트

- [ ] 테스트 작성/업데이트
- [ ] 문서 업데이트
- [ ] 린트 통과
- [ ] 빌드 성공
```

**예상 영향도:** 낮음

### D. 백엔드 통합

**옵션 1: GraphQL (Apollo/URQL)**

```bash
pnpm add @apollo/client graphql
```

**옵션 2: tRPC**

```bash
pnpm add @trpc/client @trpc/server
```

**특징:**

- 타입 안전한 API
- 자동 타입 생성
- 클라이언트-서버 간 타입 공유

**예상 영향도:** 높음 (선택적)

### E. 실전 예제 추가

**구현 필요:**

- [ ] 인증 플로우 (로그인/회원가입/로그아웃)
- [ ] 장바구니 구현
- [ ] 검색 및 필터링
- [ ] 페이지네이션 / 무한 스크롤
- [ ] 파일 업로드
- [ ] 폼 처리 (react-hook-form)
- [ ] 데이터 테이블
- [ ] 차트/대시보드

**예상 영향도:** 중간

---

## 📊 우선순위 매트릭스

### 🔴 높음 (즉시 작업 권장)

| 작업                              | 영향도 | 복잡도 | 이유                 |
| --------------------------------- | ------ | ------ | -------------------- |
| 환경변수 검증 강화 (.env.example) | 낮음   | 낮음   | 프로젝트 설정 표준화 |
| 문서 개선 (CONTRIBUTING.md 등)    | 낮음   | 낮음   | 템플릿 사용성 향상   |
| 테스트 환경 구축                  | 낮음   | 중간   | 코드 품질 보증       |
| 코드 제너레이터                   | 낮음   | 중간   | 개발 생산성 향상     |
| Docker 지원                       | 낮음   | 낮음   | 배포 표준화          |

### 🟡 중간 (다음 단계)

| 작업             | 영향도 | 복잡도 | 이유               |
| ---------------- | ------ | ------ | ------------------ |
| 인증 시스템 예제 | 낮음   | 중간   | 실전 예제 필요     |
| 실전 예제 추가   | 중간   | 중간   | 템플릿 완성도 향상 |
| Storybook        | 낮음   | 중간   | 컴포넌트 문서화    |
| CI/CD 파이프라인 | 낮음   | 중간   | 자동화 필요        |
| 성능 최적화      | 중간   | 중간   | 사용자 경험 개선   |

### 🟢 낮음 (선택적)

| 작업              | 영향도 | 복잡도 | 이유                   |
| ----------------- | ------ | ------ | ---------------------- |
| Tailwind CSS 통합 | 중간   | 낮음   | 디자인 생산성 (선택적) |
| PWA 지원          | 낮음   | 낮음   | 특수 요구사항          |
| 다국어 지원       | 중간   | 중간   | 특정 사용 사례         |
| GraphQL/tRPC      | 높음   | 높음   | 특정 아키텍처 선택     |
| MSW               | 낮음   | 낮음   | 테스팅 편의성          |

---

## 🎯 권장 접근 방식

### Option 1: 점진적 개선 (추천) ⭐

**전략:**

- 기존 코드 유지하며 단계적 개선
- 영향도 낮은 작업부터 진행
- 예제 페이지 추가 방식
- 기존 기능 보존

**장점:**

- 낮은 리스크
- 점진적 학습 곡선
- 기존 기능 보존
- 유연한 선택

**진행 순서:**

1. 문서화 및 환경 설정
2. 개발 도구 추가
3. 예제 및 실전 기능 추가
4. 성능 및 보안 개선

### Option 2: 전면 리팩토링

**전략:**

- 완전히 새로운 구조로 재작성
- 최신 트렌드 전면 적용
- 모든 기능 일괄 업그레이드

**단점:**

- 높은 리스크
- 많은 시간 소요
- 잠재적 버그 증가
- 학습 곡선 급상승

**권장하지 않음** (기존 구조가 이미 우수함)

---

## 💡 템플릿 배포 전략

### 1. GitHub Template Repository

**설정:**

- Settings → Template repository 체크
- "Use this template" 버튼 활성화
- 템플릿 사용자가 쉽게 시작 가능

### 2. 예제 데이터 전략

**현재:**

- ✅ JSONPlaceholder API 사용 (무료, 안정적)

**추가 옵션:**

- Mock 데이터 제공 (MSW)
- 실제 API 연동 가이드
- 다양한 API 예제 (REST, GraphQL)

### 3. 브랜딩

**제거 필요:**

- ✅ 인천 면세점 관련 내용 제거됨
- ✅ 범용 이름으로 변경됨
- [ ] 프로젝트 로고/파비콘 업데이트
- [ ] 스크린샷 추가

### 4. 라이선스

**권장:** MIT License

```
MIT License

Copyright (c) 2024

Permission is hereby granted...
```

---

## 📈 성공 지표

### 템플릿 완성도

- [ ] 모든 예제 페이지 동작 확인
- [ ] 문서 완성 (README, CONTRIBUTING 등)
- [ ] 테스트 커버리지 > 80%
- [ ] Lighthouse 점수 > 90
- [ ] 번들 크기 최적화
- [ ] 타입 안전성 100%

### 개발자 경험

- [ ] 5분 이내 프로젝트 시작 가능
- [ ] 명확한 문서 및 예제
- [ ] 코드 제너레이터로 빠른 개발
- [ ] 실전 예제 충분
- [ ] CI/CD 자동화

### 코드 품질

- [ ] ESLint/Prettier 통과
- [ ] TypeScript strict 모드
- [ ] 테스트 커버리지 충분
- [ ] 보안 취약점 없음
- [ ] 성능 최적화 완료

---

## 🔄 다음 단계

### 즉시 시작 가능한 작업

1. **문서 작성** (영향도 낮음, 중요도 높음)
   - CONTRIBUTING.md
   - ARCHITECTURE.md
   - .env.example

2. **테스트 환경** (코드 품질)
   - Vitest 설정
   - 기본 테스트 작성

3. **CI/CD** (자동화)
   - GitHub Actions CI
   - 자동 테스트/빌드

4. **실전 예제** (완성도)
   - 인증 플로우
   - 폼 처리
   - 데이터 테이블

### 검토 필요한 의사결정

- [ ] Tailwind CSS 도입 여부
- [ ] 인증 솔루션 선택 (NextAuth vs Clerk vs 직접 구현)
- [ ] 백엔드 통합 방식 (REST vs GraphQL vs tRPC)
- [ ] 테스팅 프레임워크 (Vitest vs Jest)
- [ ] PWA 필요 여부

---

## 📝 변경 이력

| 날짜       | 버전  | 변경 내용                                      |
| ---------- | ----- | ---------------------------------------------- |
| 2024-10-24 | 1.0.0 | 초기 계획 수립                                 |
| 2024-10-24 | 1.1.0 | 1-2단계 완료 (도메인 중립화, 최신 트렌드 적용) |

---

## 📧 문의 및 기여

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해 주세요.

---

**작성자:** AI Assistant  
**최종 수정:** 2024-10-24
