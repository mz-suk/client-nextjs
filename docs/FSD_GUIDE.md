# FSD (Feature-Sliced Design) 아키텍처 가이드

## FSD란?

Feature-Sliced Design은 프론트엔드 프로젝트를 확장 가능하고 유지보수하기 쉽게 구조화하는 아키텍처 방법론입니다.

## 프로젝트 구조

```
src/
├── shared/          # 공통 레이어
│   ├── api/        # API 클라이언트
│   │   ├── client.ts
│   │   └── index.ts
│   ├── config/     # 설정
│   │   ├── env.ts
│   │   ├── revalidate.ts
│   │   └── index.ts
│   ├── lib/        # 유틸리티
│   │   ├── logger.ts
│   │   └── index.ts
│   └── types/      # 공통 타입
│       ├── api.ts
│       └── index.ts
├── entities/       # 비즈니스 엔티티
│   └── nation/
│       ├── model/
│       │   ├── types.ts
│       │   └── index.ts
│       └── index.ts
├── features/       # 사용자 기능
│   └── nation-list/
│       ├── api/
│       │   ├── getNations.ts
│       │   └── index.ts
│       ├── ui/
│       │   ├── NationListClient.tsx
│       │   ├── NationListISR.tsx
│       │   ├── NationList.module.css
│       │   └── index.ts
│       └── index.ts
└── app/            # Next.js App Router
    ├── api/
    ├── example-api-usage/
    ├── example-isr/
    └── layout.tsx
```

## 레이어 설명

### 1. Shared (공통)

재사용 가능한 코드, 비즈니스 로직 없음

**사용 예시:**

```typescript
// shared/api/client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: env.API_URL,
  timeout: env.API_TIMEOUT,
});

export async function fetchAPI<T>(endpoint: string): Promise<T> {
  const response = await apiClient.get<T>(endpoint);
  return response.data;
}
```

### 2. Entities (엔티티)

비즈니스 엔티티의 타입과 모델

**사용 예시:**

```typescript
// entities/nation/model/types.ts
export interface Nation {
  alp3NatnCode: string;
  alp2NatnCode: string;
  natnIntcNo: string;
  natnNm: string;
  abrv: string;
}

// entities/nation/index.ts
export { type Nation } from './model';
```

### 3. Features (기능)

사용자 기능 단위로 구성

**구조:**

- `api/` - API 호출 로직
- `model/` - 상태 관리 (선택)
- `ui/` - UI 컴포넌트

**사용 예시:**

```typescript
// features/nation-list/api/getNations.ts
import { fetchAPI } from '@/shared/api';
import type { Nation } from '@/entities/nation';

export async function getNations(): Promise<Nation[]> {
  const response = await fetchAPI<{ result: Nation[] }>('/common/search/nations');
  return response.result || [];
}

// features/nation-list/ui/NationListClient.tsx
('use client');

import { useState } from 'react';
import { getNationsClient } from '../api';

export function NationListClient() {
  const [nations, setNations] = useState([]);
  // ...
}

// features/nation-list/index.ts
export { getNations, getNationsClient } from './api';
export { NationListClient, NationListISR } from './ui';
```

### 4. App (애플리케이션)

Next.js App Router 페이지

**사용 예시:**

```typescript
// app/example-isr/page.tsx
import { getNations, NationListISR } from '@/features/nation-list';
import { revalidateConfig } from '@/shared/config';

export const revalidate = revalidateConfig.dynamic;

export default async function ExampleIsrPage() {
  const nations = await getNations();
  const timestamp = new Date().toISOString();

  return <NationListISR nations={nations} timestamp={timestamp} />;
}
```

## Import 규칙

### Public API (index.ts)

각 레이어는 `index.ts`를 통해 외부에 노출

```typescript
// ✅ Good - Public API 사용
import { Nation } from '@/entities/nation';
import { getNations } from '@/features/nation-list';
import { fetchAPI } from '@/shared/api';

// ❌ Bad - 내부 구현 직접 접근
import { Nation } from '@/entities/nation/model/types';
import { getNations } from '@/features/nation-list/api/getNations';
```

### 레이어 간 의존성

```
app → features → entities → shared
```

- `shared`: 다른 레이어에 의존하지 않음
- `entities`: `shared`만 사용 가능
- `features`: `shared`, `entities` 사용 가능
- `app`: 모든 레이어 사용 가능

```typescript
// ✅ Good
// features/nation-list/api/getNations.ts
import { fetchAPI } from '@/shared/api'; // shared 사용
import type { Nation } from '@/entities/nation'; // entities 사용

// ❌ Bad
// entities/nation/model/index.ts
import { fetchAPI } from '@/shared/api'; // entities는 API 호출 금지
```

## 새 기능 추가 방법

### 1. 엔티티 정의

```typescript
// entities/product/model/types.ts
export interface Product {
  id: string;
  name: string;
  price: number;
}

// entities/product/model/index.ts
export type { Product } from './types';

// entities/product/index.ts
export { type Product } from './model';
```

### 2. Feature API 생성

```typescript
// features/product-list/api/getProducts.ts
import { fetchAPI } from '@/shared/api';
import type { Product } from '@/entities/product';

export async function getProducts(): Promise<Product[]> {
  return await fetchAPI<Product[]>('/products');
}

// features/product-list/api/index.ts
export { getProducts } from './getProducts';
```

### 3. Feature UI 생성

```typescript
// features/product-list/ui/ProductList.tsx
import type { Product } from '@/entities/product';

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          {product.name} - {product.price}원
        </div>
      ))}
    </div>
  );
}

// features/product-list/ui/index.ts
export { ProductList } from './ProductList';
```

### 4. Feature 통합

```typescript
// features/product-list/index.ts
export { getProducts } from './api';
export { ProductList } from './ui';
```

### 5. 페이지에서 사용

```typescript
// app/products/page.tsx
import { getProducts, ProductList } from '@/features/product-list';

export default async function ProductsPage() {
  const products = await getProducts();
  return <ProductList products={products} />;
}
```

## 파일 명명 규칙

### 컴포넌트

- PascalCase: `NationList.tsx`, `ProductCard.tsx`
- 스타일: `NationList.module.css`

### 함수/유틸리티

- camelCase: `getNations.ts`, `formatPrice.ts`

### 타입

- PascalCase: `types.ts` 파일 내에서 `interface Nation`

### 인덱스

- 항상 `index.ts`로 public API 노출

## 장점

### 1. 확장성

새 기능 추가 시 기존 코드 영향 최소화

### 2. 유지보수성

기능별로 코드가 분리되어 수정 범위 명확

### 3. 재사용성

`shared`, `entities`는 여러 feature에서 재사용

### 4. 테스트 용이성

각 레이어를 독립적으로 테스트 가능

## 예제

프로젝트의 `nation-list` feature를 참고:

```
features/nation-list/
├── api/
│   ├── getNations.ts      # API 호출 로직
│   └── index.ts
├── ui/
│   ├── NationListClient.tsx    # CSR 컴포넌트
│   ├── NationListISR.tsx       # ISR 컴포넌트
│   ├── NationList.module.css
│   └── index.ts
└── index.ts
```

## 참고 자료

- [Feature-Sliced Design 공식 문서](https://feature-sliced.design/)
- [FSD GitHub](https://github.com/feature-sliced/documentation)
