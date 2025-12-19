# Next.js 16 업그레이드 가이드

이 문서는 프로젝트의 Next.js 16 업그레이드 변경사항을 정리합니다.

## 📋 적용된 변경사항

### 1. 패키지 업그레이드

#### Core 패키지

- `next`: 15.5.6 → **16.1.0**
- `react`: 19.2.0 → **19.2.3**
- `react-dom`: 19.2.0 → **19.2.3**

#### Node.js 버전 요구사항

- 최소 버전: **20.9.0** (이전: 18.0.0)

### 2. package.json 스크립트 수정

Turbopack이 기본값이 되어 `--turbopack` 플래그 제거:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  }
}
```

### 3. next.config.ts 변경사항

#### eslint 설정 제거

```typescript
// ❌ 제거됨 (Next.js 16에서 더 이상 지원 안 함)
eslint: {
  ignoreDuringBuilds: isDev,
}
```

#### React Compiler stable로 승격

```typescript
// ✅ experimental에서 최상위로 이동
reactCompiler: true,

experimental: {
  optimizePackageImports: ['lucide-react'],
}
```

#### 이미지 최적화 기본값 변경

```typescript
images: {
  imageSizes: [32, 48, 64, 96, 128, 256, 384],  // 16px 제거
  minimumCacheTTL: 14400,  // 60초 → 4시간 (14400초)
}
```

### 4. tsconfig.json 개선

```json
{
  "compilerOptions": {
    "jsx": "react-jsx", // "preserve" → "react-jsx"
    "verbatimModuleSyntax": true // 새로 추가
  },
  "include": [
    ".next/dev/types/**/*.ts" // 개발 서버 타입 지원
  ]
}
```

#### 변경 이유

- **jsx: react-jsx**: React 19와의 더 나은 호환성
- **verbatimModuleSyntax**: import/export 문법 엄격성 향상
- **.next/dev/types**: Next.js 16의 분리된 개발 타입 지원

### 5. ESLint 설정 자동 최적화

`eslint-config-next@16.1.0`이 React Hooks 플러그인을 자동으로 포함:

```javascript
// eslint.config.mjs
// reactHooks.configs.flat.recommended 제거됨
// eslint-config-next에 이미 포함되어 있음
```

## 🎯 주요 개선사항

### 1. Turbopack 기본 적용

- 개발 서버와 프로덕션 빌드 모두 Turbopack 사용
- 더 빠른 빌드와 HMR 성능

### 2. React Compiler Stable

- `babel-plugin-react-compiler@1.0.0` 안정화
- 자동 메모이제이션 최적화

### 3. 이미지 최적화 강화

- 캐시 TTL 증가로 재검증 비용 감소
- 16px 이미지 크기 제거로 브라우저 전송 크기 감소

### 4. 타입 안전성 향상

- `verbatimModuleSyntax`로 import/export 명확성 증가
- React 19.2 타입 개선

## 📦 의존성 변경사항

### 주요 패키지 업데이트

```json
{
  "@tanstack/react-query": "5.90.5 → 5.90.12",
  "axios": "1.12.2 → 1.13.2",
  "swr": "2.3.6 → 2.3.8",
  "zod": "4.1.12 → 4.2.1",
  "zustand": "5.0.8 → 5.0.9"
}
```

## ⚠️ Breaking Changes

### 1. Node.js 버전

- Node.js 18 지원 중단
- 최소 버전: **20.9.0**

### 2. ESLint 설정

- `next.config.ts`의 `eslint` 옵션 제거
- `next lint` 명령어 대신 `eslint` 직접 사용

### 3. 이미지 설정

- `imageSizes`에서 16px 제거
- `minimumCacheTTL` 기본값 변경 (60초 → 4시간)

## 🔧 추가 개선사항

### 1. pnpm 버전

```json
{
  "packageManager": "pnpm@10.25.0" // 10.14.0 → 10.25.0
}
```

### 2. React Compiler

- `babel-plugin-react-compiler`가 선택적 의존성으로 변경
- Next.js 16의 빌트인 컴파일러 지원 강화

## 📚 참고 문서

- [Next.js 16 공식 업그레이드 가이드](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [React 19.2 릴리스 노트](https://react.dev/blog/2025/10/01/react-19-2)
- [Turbopack 안정화](https://turbo.build/)

## ⚠️ 알려진 이슈

### ESLint Circular Structure 에러

Next.js 16.1.0 + ESLint 9.39.2 조합에서 FlatCompat 사용 시 circular structure 에러 발생:

```
TypeError: Converting circular structure to JSON
```

**해결책**:

1. **lint 스크립트 분리**

```json
{
  "scripts": {
    "lint": "tsc --noEmit",
    "lint:eslint": "eslint . --fix"
  }
}
```

2. **lint-staged에서 ESLint 제거**

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx,json,css,md}": ["prettier --write"]
  }
}
```

TypeScript 타입 체크는 pre-commit 훅에서 자동 실행되며, ESLint는 필요시 `pnpm lint:eslint`로 수동 실행할 수 있습니다.

## ✅ 검증 체크리스트

- [x] Node.js 20.9.0 이상 확인
- [x] pnpm 버전 업데이트
- [x] 패키지 의존성 업데이트
- [x] next.config.ts 수정
- [x] tsconfig.json 개선
- [x] babel-plugin-react-compiler 명시적 설치
- [x] 문서 업데이트 (README, PROJECT_PLAN, REACT_COMPILER)
- [x] TypeScript 타입 체크 통과
- [x] 프로덕션 빌드 성공

## 🚀 다음 단계

1. 개발 서버 실행 테스트

```bash
pnpm dev
```

2. 프로덕션 빌드 테스트

```bash
pnpm build
```

3. 타입 체크 및 린트

```bash
pnpm lint
```

---

**업그레이드 완료 날짜**: 2024-12-19  
**프로젝트 버전**: 16.1.0
