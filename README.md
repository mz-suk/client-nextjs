# Next.js Client Application

Next.js 15 + TypeScript 기반 클라이언트 애플리케이션

## 📋 목차

- [프로젝트 개요](#프로젝트-개요)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [시작하기](#시작하기)
- [환경변수 설정](#환경변수-설정)
- [개발 가이드](#개발-가이드)
- [렌더링 전략](#렌더링-전략)
- [API 사용법](#api-사용법)
- [스크립트](#스크립트)

## 프로젝트 개요

인천 면세점 API(https://dev-api.incheondfs.kr)를 활용하는 프론트엔드 애플리케이션입니다.

### 주요 특징

- **FSD 아키텍처**: Feature-Sliced Design 패턴으로 확장 가능한 구조
- **다양한 렌더링 방식**: SSG, Hybrid(SSG+SWR), CSR 지원
- **타입 안전성**: TypeScript + 타입 안전 환경변수
- **견고한 API 레이어**: 자동 재시도, 에러 핸들링, 로깅
- **개발 경험**: 프록시 설정으로 CORS 해결, 디버그 로깅
- **AI 통합**: Apidog MCP로 API 코드 자동 생성

## 기술 스택

### Core

- **Next.js 15** - React 프레임워크 (App Router)
- **React 19** - UI 라이브러리
- **TypeScript 5.9** - 타입 안전성

### Data Fetching

- **Axios 1.12** - HTTP 클라이언트
- **SWR 2.3** - 클라이언트 데이터 페칭 및 캐싱

### Code Quality

- **ESLint** - 코드 린팅
- **Prettier** - 코드 포맷팅
- **Husky + lint-staged** - Git 훅

### Development

- **Turbopack** - 고속 번들러
- **Apidog MCP** - AI 기반 API 자동화

## 프로젝트 구조

### FSD 아키텍처

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # 루트 레이아웃
│   ├── page.tsx             # 홈페이지
│   ├── example-ssg/         # SSG 예제
│   ├── example-hybrid/      # Hybrid 예제
│   └── example-api-usage/   # CSR 예제
│
├── features/                 # 비즈니스 기능
│   └── nation-list/
│       ├── api/             # API 호출 함수
│       │   ├── getNations.ts
│       │   ├── getNationList.ts
│       │   └── getFrequentNations.ts
│       ├── hooks/           # React 훅
│       │   ├── useNations.ts
│       │   ├── useNationList.ts
│       │   └── useFrequentNations.ts
│       ├── ui/              # UI 컴포넌트
│       │   ├── NationListSSG.tsx
│       │   ├── NationListWithSWRImproved.tsx
│       │   └── NationListClientImproved.tsx
│       └── index.ts         # Public API
│
├── entities/                 # 비즈니스 엔티티
│   └── nation/
│       ├── model/
│       │   ├── types.ts     # Nation 타입 정의
│       │   └── index.ts
│       └── index.ts         # Public API
│
└── shared/                   # 공통 레이어
    ├── api/                 # API 클라이언트
    │   ├── client.ts        # Axios 클라이언트
    │   ├── fetcher.ts       # SWR fetcher
    │   └── index.ts
    ├── config/              # 설정
    │   ├── env.ts           # 환경변수
    │   ├── revalidate.ts    # ISR 설정
    │   ├── swr.ts           # SWR 설정
    │   └── index.ts
    ├── hooks/               # 공통 훅
    │   ├── useFetch.ts
    │   └── index.ts
    ├── lib/                 # 유틸리티
    │   ├── logger.ts        # 로깅 시스템
    │   └── index.ts
    └── types/               # 공통 타입
        ├── api.ts
        └── index.ts
```

### FSD 레이어 규칙

```
app → features → entities → shared
```

- **app**: 라우팅, 페이지 구성
- **features**: 사용자 기능 (API + Hooks + UI)
- **entities**: 비즈니스 엔티티 (타입, 모델)
- **shared**: 공통 인프라 (API 클라이언트, 설정, 유틸)

### Import 규칙

✅ **올바른 방식** - Public API 사용

```typescript
import { Nation } from '@/entities/nation';
import { getNations, useNations } from '@/features/nation-list';
import { fetchAPI } from '@/shared/api';
```

❌ **잘못된 방식** - 내부 구현 직접 접근

```typescript
import { Nation } from '@/entities/nation/model/types';
import { getNations } from '@/features/nation-list/api/getNations';
```

## 시작하기

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경변수 설정

`.env.development` 파일 생성:

```bash
NEXT_PUBLIC_API_URL=/api/proxy
API_TARGET_URL=https://dev-api.incheondfs.kr
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_FEATURE_DEBUG=true
```

`.env.production` 파일 생성:

```bash
NEXT_PUBLIC_API_URL=https://dev-api.incheondfs.kr
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_FEATURE_DEBUG=false
```

### 3. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 http://localhost:3000 접속

### 4. 프로덕션 빌드

```bash
pnpm build
pnpm start
```

## 환경변수 설정

### 환경변수 목록

| 변수명                      | 설명                | 개발         | 프로덕션     |
| --------------------------- | ------------------- | ------------ | ------------ |
| `NEXT_PUBLIC_API_URL`       | 클라이언트 API URL  | `/api/proxy` | 실제 API URL |
| `API_TARGET_URL`            | 서버 사이드 API URL | 실제 API URL | -            |
| `NEXT_PUBLIC_API_TIMEOUT`   | API 타임아웃 (ms)   | `30000`      | `30000`      |
| `NEXT_PUBLIC_FEATURE_DEBUG` | 디버그 로깅 활성화  | `true`       | `false`      |

### 프록시 동작 방식

**개발 환경**:

- 클라이언트 → `/api/proxy/*` → Next.js 프록시 → 실제 API
- 서버 사이드 → `API_TARGET_URL` 직접 호출
- CORS 문제 해결

**프로덕션**:

- 클라이언트/서버 모두 → 실제 API 직접 호출

## 개발 가이드

### 새 기능 추가하기

#### 방법 1: Apidog MCP 사용 (권장)

AI에게 요청:

```
"incheondfs-goods API의 상품 목록 조회 기능을
features/goods-list 구조로 만들어줘 (api, hooks, ui 포함)"
```

AI가 자동으로:

- OpenAPI 스펙 확인
- TypeScript 타입 생성
- API 함수 생성
- React 훅 생성
- UI 컴포넌트 생성

#### 방법 2: 수동 생성

**1단계: 엔티티 정의**

```typescript
// entities/product/model/types.ts
export interface Product {
  id: string;
  name: string;
  price: number;
}

// entities/product/index.ts
export * from './model/types';
```

**2단계: API 함수 생성**

```typescript
// features/product-list/api/getProducts.ts
import type { Product } from '@/entities/product';
import { fetchAPI } from '@/shared/api';
import type { ApiResponse } from '@/shared/types';

export async function getProducts(): Promise<Product[]> {
  const response = await fetchAPI<ApiResponse<Product[]>>('/products');
  return response.result || [];
}

// features/product-list/api/index.ts
export * from './getProducts';
```

**3단계: React 훅 생성**

```typescript
// features/product-list/hooks/useProducts.ts
import useSWR from 'swr';
import type { Product } from '@/entities/product';
import { getProducts } from '../api';

export function useProducts() {
  return useSWR<Product[]>('/products', getProducts);
}

// features/product-list/hooks/index.ts
export * from './useProducts';
```

**4단계: UI 컴포넌트 생성**

```typescript
// features/product-list/ui/ProductList.tsx
import { useProducts } from '../hooks';

export function ProductList() {
  const { data: products, error, isLoading } = useProducts();

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생</div>;

  return (
    <ul>
      {products?.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}

// features/product-list/ui/index.ts
export * from './ProductList';
```

**5단계: Public API 정의**

```typescript
// features/product-list/index.ts
export * from './api';
export * from './hooks';
export * from './ui';
```

**6단계: 페이지에서 사용**

```typescript
// app/products/page.tsx
import { ProductList } from '@/features/product-list';

export default function ProductsPage() {
  return <ProductList />;
}
```

## 렌더링 전략

### 1. SSG (Static Site Generation)

**특징**: 빌드 시 정적 페이지 생성, 최고 성능

```typescript
// app/example-ssg/page.tsx
import { getNations, NationListSSG } from '@/features/nation-list';

export default async function ExampleSsgPage() {
  const nations = await getNations();
  return <NationListSSG nations={nations} />;
}
```

**사용 시점**: 변경이 거의 없는 콘텐츠

### 2. Hybrid (SSG + SWR)

**특징**: 초기 SSG + 클라이언트 SWR 업데이트, 추천 방식 ⭐

```typescript
// app/example-hybrid/page.tsx
import { getNations, NationListWithSWRImproved } from '@/features/nation-list';

export default async function ExampleHybridPage() {
  const nations = await getNations();
  return <NationListWithSWRImproved initialNations={nations} />;
}
```

**사용 시점**: 대부분의 경우 (빠른 초기 렌더링 + 최신 데이터)

### 3. CSR (Client-Side Rendering)

**특징**: 클라이언트에서만 데이터 페칭

```typescript
// app/example-api-usage/page.tsx
import { NationListClientImproved } from '@/features/nation-list';

export default function ExampleApiUsagePage() {
  return <NationListClientImproved />;
}
```

**사용 시점**: 사용자 인증이 필요하거나 실시간 데이터

## API 사용법

### 기본 API 호출

```typescript
import { fetchAPI, apiClient } from '@/shared/api';

// GET 요청
const users = await fetchAPI<User[]>('/users');

// POST 요청
const response = await apiClient.post('/users', { name: 'John' });
```

### API 에러 핸들링

```typescript
import { fetchAPI } from '@/shared/api';
import { logger } from '@/shared/lib';

try {
  const data = await fetchAPI<Data>('/endpoint');
} catch (error) {
  logger.error('API 호출 실패:', error);
  // 에러 처리
}
```

### SWR을 사용한 API 호출

```typescript
import useSWR from 'swr';
import { fetchAPI } from '@/shared/api';

function Component() {
  const { data, error, isLoading } = useSWR(
    '/endpoint',
    () => fetchAPI<Data>('/endpoint')
  );

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생</div>;

  return <div>{data}</div>;
}
```

### API 클라이언트 특징

#### 자동 재시도

- 네트워크 에러, 타임아웃, 503 에러 시 자동 재시도
- 최대 3회, 지수 백오프 방식

#### 로깅

- 모든 요청/응답 자동 로깅
- 개발 환경에서만 활성화
- `NEXT_PUBLIC_FEATURE_DEBUG=true` 설정 시 상세 로그

#### 타임아웃

- 기본 30초
- 환경변수로 조정 가능

## 스크립트

| 스크립트          | 설명                           | 용도                        |
| ----------------- | ------------------------------ | --------------------------- |
| `pnpm dev`        | 개발 서버 실행 (Turbopack)     | 로컬 개발, 프록시 활성화    |
| `pnpm dev:prod`   | 프로덕션 모드 개발 서버        | 프로덕션 빌드 테스트        |
| `pnpm build`      | 프로덕션 빌드                  | 배포 전 빌드                |
| `pnpm build:prod` | 프로덕션 환경 빌드             | NODE_ENV=production 빌드    |
| `pnpm start`      | 프로덕션 서버 실행 (포트 4000) | 빌드 후 서버 실행           |
| `pnpm lint`       | TypeScript + ESLint 검사       | 타입 체크 및 코드 품질 검사 |
| `pnpm format`     | Prettier 포맷팅                | 코드 스타일 자동 정리       |

### 일반적인 워크플로우

```bash
# 개발 시작
pnpm dev

# 코드 작성 후
pnpm format        # 포맷팅
pnpm lint          # 검사

# 배포 전
pnpm build         # 빌드 확인
pnpm start         # 로컬에서 프로덕션 테스트
```

### Git Hooks (자동 실행)

- **pre-commit**: 커밋 전 자동으로 ESLint + Prettier 실행
- **Husky + lint-staged**: 변경된 파일만 검사하여 빠른 커밋

## 예제 페이지

- `/` - 홈페이지 (렌더링 방식 선택)
- `/example-ssg` - SSG 예제
- `/example-hybrid` - Hybrid 예제
- `/example-api-usage` - CSR 예제

## Apidog MCP - AI 기반 API 자동화

### 빠른 시작

```bash
# MCP 연결 검증
./scripts/test-mcp.sh

# Cursor 재시작 후 AI에게 요청
"incheondfs-common API의 모든 엔드포인트를 보여줘"
```

### 연결된 API 그룹

- `incheondfs-common` - 공통 API (국가, 통화 등)
- `incheondfs-goods` - 상품 API
- `incheondfs-cart` - 장바구니 API
- `incheondfs-order` - 주문 API
- `incheondfs-member` - 회원 API
- `incheondfs-auth` - 인증 API

자세한 내용은 [Apidog.md](./Apidog.md) 참조

## 프로젝트 원칙

### 코드 스타일

- 간결하고 명확한 코드 작성
- 필수적인 주석만 작성 (한글)
- 최신 TypeScript/React 패턴 사용

### 아키텍처

- FSD 레이어 규칙 준수
- Public API를 통한 모듈 간 통신
- 단방향 의존성 유지

### 성능

- 적절한 렌더링 전략 선택
- SWR을 통한 효율적인 캐싱
- Turbopack으로 빠른 개발 경험

## 배포

### Vercel 배포 (권장)

```bash
# Vercel CLI 설치
pnpm add -g vercel

# 배포
vercel
```

환경변수 설정:

- `NEXT_PUBLIC_API_URL`: 실제 API URL
- `NEXT_PUBLIC_API_TIMEOUT`: 30000
- `NEXT_PUBLIC_FEATURE_DEBUG`: false

### 직접 배포

```bash
# 빌드
pnpm build

# PM2로 실행
pm2 start npm --name "client-nextjs" -- start

# 또는 Docker
docker build -t client-nextjs .
docker run -p 4000:4000 client-nextjs
```

## 트러블슈팅

### CORS 에러 발생

**원인**: 개발 환경에서 프록시 설정이 제대로 되지 않음

**해결**:

1. `.env.development` 파일 확인
2. `NEXT_PUBLIC_API_URL=/api/proxy` 설정 확인
3. `API_TARGET_URL` 설정 확인

### 빌드 실패

**원인**: TypeScript 타입 에러

**해결**:

```bash
pnpm lint          # 에러 확인
pnpm format        # 포맷팅
```

### API 호출 타임아웃

**원인**: API 서버 응답 지연

**해결**:

- `NEXT_PUBLIC_API_TIMEOUT` 값 증가 (예: 60000)
- 로그 확인: `NEXT_PUBLIC_FEATURE_DEBUG=true` 설정

## 참고 문서

- [Apidog.md](./Apidog.md) - MCP 설정 및 추가 가이드

## 기여

이 프로젝트는 FSD 아키텍처를 따릅니다. 기여 전에:

1. FSD 레이어 규칙 준수
2. TypeScript strict 모드 준수
3. ESLint + Prettier 통과
4. 의미 있는 커밋 메시지 작성

## 라이선스

Private
