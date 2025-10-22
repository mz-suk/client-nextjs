# API 사용 예제

## 설정 완료 내역

### 환경변수

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

### API 클라이언트 설정

자동으로 적용되는 헤더:

- `Content-Type: application/json`
- `Accept-Language: ko`
- `accept: */*`

## 실제 API 예제

### 1. 국가 목록 조회

```typescript
import { fetchAPI } from '@/shared/api';
import type { Nation } from '@/entities/nation';
import type { ApiResponse } from '@/shared/types';

const response = await fetchAPI<ApiResponse<Nation[]>>('/common/search/nations');
const nations = response.result;
```

**응답 구조:**

```typescript
// API 응답
interface ApiResponse<T> {
  resultCode: number; // 200
  resultMessage: string; // "성공했습니다."
  result: T; // 데이터
  apiSysCntcId?: string;
}

// 국가 데이터
interface Nation {
  alp3NatnCode: string; // 3자리 국가 코드 (예: "KOR")
  alp2NatnCode: string; // 2자리 국가 코드 (예: "KR")
  natnIntcNo: string; // 국제전화번호 (예: "+82")
  natnNm: string; // 국가명 (예: "대한민국")
  abrv: string; // 약어 (예: "K")
}
```

### 2. CSR 방식 (클라이언트 컴포넌트)

```typescript
'use client';

import { useState } from 'react';
import { getNationsClient } from '@/features/nation-list';
import type { Nation } from '@/entities/nation';

export default function NationsPage() {
  const [nations, setNations] = useState<Nation[]>([]);

  const loadNations = async () => {
    try {
      const data = await getNationsClient();
      setNations(data);
    } catch (error) {
      console.error('Failed to load nations:', error);
    }
  };

  return (
    <div>
      <button onClick={loadNations}>국가 목록 가져오기</button>
      {nations.map(nation => (
        <div key={nation.alp3NatnCode}>
          {nation.natnNm} ({nation.alp2NatnCode})
        </div>
      ))}
    </div>
  );
}
```

### 3. ISR 방식 (서버 컴포넌트)

```typescript
import { getNations } from '@/features/nation-list';
import { revalidateConfig } from '@/shared/config';

export const revalidate = revalidateConfig.dynamic; // 60초

export default async function NationsPage() {
  const nations = await getNations();

  return (
    <div>
      <h1>국가 목록 (ISR)</h1>
      {nations.map(nation => (
        <div key={nation.alp3NatnCode}>
          {nation.natnNm} ({nation.alp2NatnCode}) - {nation.natnIntcNo}
        </div>
      ))}
    </div>
  );
}
```

## FSD 아키텍처

프로젝트는 Feature-Sliced Design 패턴을 따릅니다:

```
src/
├── shared/          # 공통 유틸리티, API 클라이언트
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
```

## 개발 환경

### 프록시 동작

개발 모드(`pnpm dev`)에서:

1. 클라이언트에서 `/api/proxy/common/search/nations` 호출
2. Next.js가 `https://dev-api.incheondfs.kr/common/search/nations`로 프록시
3. CORS 문제 없이 API 호출 가능

### 프로덕션

빌드 후(`pnpm build && pnpm start`):

1. 클라이언트에서 직접 `https://dev-api.incheondfs.kr/common/search/nations` 호출
2. 프록시 없이 직접 통신

## 테스트

### 개발 서버 실행

```bash
pnpm dev
```

### 예제 페이지 확인

- http://localhost:3000/example-api-usage (CSR 방식)
- http://localhost:3000/example-isr (ISR 방식)
- http://localhost:3000/api/health (헬스 체크)

### API 직접 테스트

```bash
# 개발 환경 (프록시 통해)
curl http://localhost:3000/api/proxy/common/search/nations

# 프로덕션 (직접 호출)
curl -H "Accept-Language: ko" https://dev-api.incheondfs.kr/common/search/nations
```

## 추가 API 연동 방법

### 1. 엔티티 정의

```typescript
// src/entities/product/model/types.ts
export interface Product {
  id: string;
  name: string;
  price: number;
}
```

### 2. Feature API 생성

```typescript
// src/features/product-list/api/getProducts.ts
import { fetchAPI } from '@/shared/api';
import type { Product } from '@/entities/product';

export async function getProducts(): Promise<Product[]> {
  return await fetchAPI<Product[]>('/products');
}
```

### 3. POST 요청

```typescript
import { apiClient } from '@/shared/api';

const response = await apiClient.post('/products', {
  name: 'New Product',
  price: 10000,
});
```

## 에러 핸들링

자동으로 처리되는 기능:

- ✅ 네트워크 에러 시 최대 3회 재시도 (지수 백오프)
- ✅ 타임아웃 (30초)
- ✅ 에러 로깅 (디버그 모드)
- ✅ 타입 안전 에러 메시지

```typescript
try {
  const data = await fetchAPI('/endpoint');
} catch (error) {
  // 자동으로 재시도 후에도 실패한 경우
  console.error('API 호출 실패:', error);
}
```

## 주요 설정

| 항목                | 값                              | 설명             |
| ------------------- | ------------------------------- | ---------------- |
| Base URL (개발)     | `/api/proxy`                    | 프록시 통해 호출 |
| Base URL (프로덕션) | `https://dev-api.incheondfs.kr` | 직접 호출        |
| Timeout             | 30초                            | 요청 타임아웃    |
| Retry               | 3회                             | 자동 재시도 횟수 |
| Retry Delay         | 1초 ~ 3초                       | 지수 백오프      |
| ISR Revalidate      | 60초                            | 기본 재검증 주기 |
