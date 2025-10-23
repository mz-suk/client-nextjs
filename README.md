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
- ✨ **Apidog MCP 통합** - AI 기반 API 자동화

## 시작하기

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경변수 설정

다음 환경변수 파일들을 생성하세요:

**개발 환경 (.env.development)**

```bash
NEXT_PUBLIC_API_URL=/api/proxy
API_TARGET_URL=https://dev-api.incheondfs.kr
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_FEATURE_DEBUG=true
```

**프로덕션 (.env.production 또는 .env)**

```bash
NEXT_PUBLIC_API_URL=https://dev-api.incheondfs.kr
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_FEATURE_DEBUG=false
```

> **동작 방식**
>
> - 개발 환경 클라이언트: `/api/proxy` 사용 (CORS 해결)
> - 개발 환경 서버: `API_TARGET_URL` 직접 사용 (프록시 우회)
> - 프로덕션: `NEXT_PUBLIC_API_URL` 직접 사용

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
- **Apidog MCP** - AI 기반 API 코드 생성

## 예제 페이지

- `/api/health` - 헬스 체크 API
- `/example-api-usage` - 국가 목록 조회 예제 (CSR)
- `/example-isr` - 국가 목록 조회 예제 (ISR)

## 문서

- [FSD_GUIDE.md](./docs/FSD_GUIDE.md) - FSD 아키텍처 가이드
- [ENV_GUIDE.md](./docs/ENV_GUIDE.md) - 환경변수 상세 가이드
- [ISR_GUIDE.md](./docs/ISR_GUIDE.md) - ISR 사용 가이드
- [API_EXAMPLES.md](./docs/API_EXAMPLES.md) - 실제 API 사용 예제
- **[MCP_SETUP.md](./docs/MCP_SETUP.md)** - Apidog MCP 설정 가이드 ⭐
- [API_GROUPS.md](./docs/API_GROUPS.md) - API 그룹 목록

## Apidog MCP - AI 기반 API 자동화 🚀

인천 면세점 API와 연결된 MCP 서버를 통해 AI가 자동으로 코드를 생성합니다.

### 빠른 시작

1. **검증 스크립트 실행**

   ```bash
   ./scripts/test-mcp.sh
   ```

2. **Cursor 재시작**
   - 완전히 종료 후 재시작

3. **AI에게 요청**
   ```
   "incheondfs-common API의 모든 엔드포인트를 보여줘"
   "장바구니 추가 API 함수를 features/cart 구조로 만들어줘"
   ```

### 연결된 API 그룹

- ✅ `incheondfs-common` - 공통 API (국가, 통화 등)
- ✅ `incheondfs-goods` - 상품 API
- ✅ `incheondfs-cart` - 장바구니 API
- ✅ `incheondfs-order` - 주문 API
- ✅ `incheondfs-member` - 회원 API
- ✅ `incheondfs-auth` - 인증 API

자세한 사용법은 **[MCP_SETUP.md](./docs/MCP_SETUP.md)** 참조

## 새 기능 추가 방법

### 방법 1: MCP를 사용한 자동 생성 (권장) ⭐

AI에게 직접 요청:

```
"incheondfs-goods API의 상품 상세 조회 기능을
features/product-detail 구조로 만들어줘 (api, types, ui 포함)"
```

AI가 자동으로:

- OpenAPI 스펙 확인
- TypeScript 타입 생성
- API 호출 함수 생성
- 에러 핸들링 추가

### 방법 2: 수동 생성

#### 1. 엔티티 정의

```typescript
// entities/product/model/types.ts
export interface Product {
  id: string;
  name: string;
}
```

#### 2. Feature 생성

```typescript
// features/product-list/api/getProducts.ts
import { fetchAPI } from '@/shared/api';
import type { Product } from '@/entities/product';

export async function getProducts(): Promise<Product[]> {
  return await fetchAPI<Product[]>('/products');
}
```

#### 3. 페이지에서 사용

```typescript
// app/products/page.tsx
import { getProducts } from '@/features/product-list';

export default async function ProductsPage() {
  const products = await getProducts();
  return <ProductList products={products} />;
}
```

자세한 내용은 [FSD_GUIDE.md](./docs/FSD_GUIDE.md) 참조
