# Next.js Client App

Next.js 15 기반의 ISR 지원 클라이언트 애플리케이션 (FSD 아키텍처)

## 주요 기능

- ✅ **FSD 아키텍처** - Feature-Sliced Design 패턴 적용
- ✅ **ISR (Incremental Static Regeneration)** 지원
- ✅ **타입 안전 환경변수** 관리
- ✅ **Axios 기반 API 클라이언트** (자동 재시도, 에러 핸들링)
- ✅ **개발 환경 프록시** 설정 (CORS 해결)
- ✅ **보안 헤더** 자동 적용
- ✅ **디버그 로깅** 시스템

## 시작하기

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경변수 설정

환경변수 파일이 이미 설정되어 있습니다:

**프로덕션 (.env)**

```bash
NEXT_PUBLIC_API_URL=https://dev-api.incheondfs.kr
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_FEATURE_DEBUG=false
```

**개발 (.env.development)**

```bash
NEXT_PUBLIC_API_URL=/api/proxy
API_TARGET_URL=https://dev-api.incheondfs.kr
NEXT_PUBLIC_FEATURE_DEBUG=true
```

### 3. 개발 서버 실행

```bash
pnpm dev
```

### 4. 프로덕션 빌드

```bash
pnpm build
pnpm start
```

## 프로젝트 구조 (FSD)

```
src/
├── shared/          # 공통 레이어
│   ├── api/        # API 클라이언트
│   ├── config/     # 환경변수, 설정
│   ├── lib/        # 로거 등 유틸리티
│   └── types/      # 공통 타입
├── entities/       # 비즈니스 엔티티
│   └── nation/     # 국가 엔티티
├── features/       # 사용자 기능
│   └── nation-list/ # 국가 목록 기능
│       ├── api/    # API 호출
│       └── ui/     # UI 컴포넌트
└── app/            # Next.js App Router
    ├── api/
    │   └── health/          # Health check API
    ├── example-api-usage/   # API 사용 예제 (CSR)
    └── example-isr/         # ISR 예제 (SSR + ISR)
```

## API 사용법

### 기본 사용

```typescript
import { fetchAPI, apiClient } from '@/shared/api';

const users = await fetchAPI<User[]>('/users');

const response = await apiClient.post('/users', { name: 'John' });
```

### Feature 사용

```typescript
import { getNations, NationListISR } from '@/features/nation-list';
import { revalidateConfig } from '@/shared/config';

export const revalidate = revalidateConfig.dynamic; // 60초

export default async function Page() {
  const nations = await getNations();
  return <NationListISR nations={nations} timestamp={new Date().toISOString()} />;
}
```

## FSD 아키텍처

### Import 규칙

```typescript
// ✅ Good - Public API 사용
import { Nation } from '@/entities/nation';
import { getNations } from '@/features/nation-list';
import { fetchAPI } from '@/shared/api';

// ❌ Bad - 내부 구현 직접 접근
import { Nation } from '@/entities/nation/model/types';
```

### 레이어 간 의존성

```
app → features → entities → shared
```

자세한 내용은 [FSD_GUIDE.md](./docs/FSD_GUIDE.md) 참조

## 스크립트

```bash
pnpm dev          # 개발 서버 실행
pnpm build        # 프로덕션 빌드
pnpm start        # 프로덕션 서버 실행
pnpm lint         # 타입 체크 + ESLint
pnpm format       # Prettier 포맷팅
```

## 기술 스택

- **Next.js 15** - React 프레임워크
- **TypeScript** - 타입 안전성
- **Axios** - HTTP 클라이언트
- **FSD** - Feature-Sliced Design 아키텍처
- **ESLint + Prettier** - 코드 품질
- **Husky + lint-staged** - Git hooks

## 예제 페이지

- `/api/health` - 헬스 체크 API
- `/example-api-usage` - 국가 목록 조회 예제 (CSR)
- `/example-isr` - 국가 목록 조회 예제 (ISR)

## 문서

- [FSD_GUIDE.md](./docs/FSD_GUIDE.md) - FSD 아키텍처 가이드
- [ENV_GUIDE.md](./docs/ENV_GUIDE.md) - 환경변수 상세 가이드
- [ISR_GUIDE.md](./docs/ISR_GUIDE.md) - ISR 사용 가이드
- [API_EXAMPLES.md](./docs/API_EXAMPLES.md) - 실제 API 사용 예제

## 새 기능 추가 방법

### 1. 엔티티 정의

```typescript
// entities/product/model/types.ts
export interface Product {
  id: string;
  name: string;
}
```

### 2. Feature 생성

```typescript
// features/product-list/api/getProducts.ts
import { fetchAPI } from '@/shared/api';
import type { Product } from '@/entities/product';

export async function getProducts(): Promise<Product[]> {
  return await fetchAPI<Product[]>('/products');
}
```

### 3. 페이지에서 사용

```typescript
// app/products/page.tsx
import { getProducts } from '@/features/product-list';

export default async function ProductsPage() {
  const products = await getProducts();
  return <ProductList products={products} />;
}
```

자세한 내용은 [FSD_GUIDE.md](./docs/FSD_GUIDE.md) 참조
