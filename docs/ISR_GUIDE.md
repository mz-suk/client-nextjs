# ISR (Incremental Static Regeneration) 가이드

## ISR이란?

Next.js의 ISR은 정적 사이트 생성(SSG)의 성능과 서버 사이드 렌더링(SSR)의 최신 데이터를 결합한 렌더링 방식입니다.

## 작동 원리

1. **첫 빌드**: 페이지를 정적으로 생성
2. **첫 요청**: 캐시된 페이지를 즉시 반환
3. **백그라운드 재검증**: 설정된 시간 후 백그라운드에서 페이지 재생성
4. **업데이트 완료**: 다음 요청부터 새 페이지 제공

## 기본 사용법

### 1. 페이지 레벨 설정

```typescript
// app/posts/page.tsx
import { revalidateConfig } from '@/shared/config';

export const revalidate = revalidateConfig.dynamic; // 60초

export default async function PostsPage() {
  const posts = await fetchAPI<Post[]>('/posts');
  return <PostList posts={posts} />;
}
```

### 2. 재사용 가능한 설정

```typescript
// src/shared/config/revalidate.ts
export const revalidateConfig = {
  static: 3600, // 1시간 (거의 변하지 않는 데이터)
  dynamic: 60, // 1분 (자주 변하는 데이터)
  short: 30, // 30초 (실시간성이 중요한 데이터)
  long: 86400, // 24시간 (일일 업데이트)
} as const;
```

## Next.js 설정

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30, // 동적 페이지 캐시 시간 (초)
      static: 180, // 정적 페이지 캐시 시간 (초)
    },
  },
};
```

## 사용 사례

### 블로그 포스트

```typescript
import { revalidateConfig } from '@/shared/config';

export const revalidate = revalidateConfig.static; // 1시간

export default async function BlogPage() {
  const posts = await fetchAPI('/blog/posts');
  return <BlogList posts={posts} />;
}
```

### 실시간 대시보드

```typescript
import { revalidateConfig } from '@/shared/config';

export const revalidate = revalidateConfig.short; // 30초

export default async function DashboardPage() {
  const stats = await fetchAPI('/dashboard/stats');
  return <Dashboard stats={stats} />;
}
```

### 상품 목록

```typescript
import { revalidateConfig } from '@/shared/config';

export const revalidate = revalidateConfig.dynamic; // 1분

export default async function ProductsPage() {
  const products = await fetchAPI('/products');
  return <ProductList products={products} />;
}
```

## 수동 재검증

### On-Demand Revalidation

특정 이벤트 발생 시 수동으로 재검증:

```typescript
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path');

  if (path) {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true });
  }

  return NextResponse.json({ error: 'Missing path' }, { status: 400 });
}
```

사용 예시:

```bash
curl -X POST http://localhost:3000/api/revalidate?path=/posts
```

## 캐시 전략

### 1. 정적 데이터 (Static)

- **재검증 주기**: 1시간 이상
- **사용 사례**: About, Terms, Privacy 등

```typescript
export const revalidate = revalidateConfig.static; // 3600초
```

### 2. 동적 데이터 (Dynamic)

- **재검증 주기**: 30초 ~ 5분
- **사용 사례**: 뉴스, 피드, 대시보드

```typescript
export const revalidate = revalidateConfig.dynamic; // 60초
```

### 3. 실시간 데이터 (Real-time)

- **재검증 주기**: 사용하지 않음 (SSR)
- **사용 사례**: 채팅, 알림

```typescript
export const dynamic = 'force-dynamic';
```

## 성능 최적화

### 1. fetch 캐싱

```typescript
const data = await fetch('https://api.example.com/data', {
  next: { revalidate: 60 },
});
```

### 2. 조건부 재검증

```typescript
export async function generateStaticParams() {
  const posts = await fetchAPI<Post[]>('/posts');
  return posts.map(post => ({ slug: post.slug }));
}

export const revalidate = revalidateConfig.static;
```

## 주의사항

1. **빌드 시간**: ISR은 빌드 시 초기 페이지를 생성하므로 빌드 시간이 길어질 수 있음
2. **서버 리소스**: 백그라운드 재검증 시 서버 리소스 사용
3. **데이터 일관성**: 재검증 전까지는 이전 데이터가 표시됨
4. **환경 변수**: ISR 페이지는 빌드 시 환경변수를 사용하므로 변경 시 재빌드 필요

## 디버깅

### 캐시 확인

```typescript
export default async function Page() {
  const timestamp = new Date().toISOString();
  console.log('Page generated at:', timestamp);

  return <div>Generated: {timestamp}</div>;
}
```

### 헤더 확인

```bash
curl -I http://localhost:3000/example-isr
```

캐시 헤더:

- `X-Next-Cache: HIT` - 캐시에서 제공
- `X-Next-Cache: MISS` - 새로 생성됨
- `X-Next-Cache: STALE` - 오래된 데이터, 재검증 중

## 예제 프로젝트

`/example-isr` 페이지에서 ISR 동작을 확인할 수 있습니다.

```bash
pnpm dev
# http://localhost:3000/example-isr
```
