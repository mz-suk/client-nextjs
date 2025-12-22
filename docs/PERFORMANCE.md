# 성능 최적화

## 현재 적용된 최적화

✅ **React Compiler v1.0** - 자동 메모이제이션  
✅ **이미지 최적화** - AVIF/WebP 변환  
✅ **번들 최적화** - Code Splitting  
✅ **보안 헤더** - XSS, CSP

## React Compiler

빌드 타임에 컴포넌트를 자동으로 최적화

### 주요 기능

**자동 메모이제이션**

```typescript
// Before: 수동 메모이제이션
function Component({ data }) {
  const processed = useMemo(() => expensive(data), [data]);
  const handleClick = useCallback(() => doSomething(processed), [processed]);
  return <Child onClick={handleClick} data={processed} />;
}

// After: React Compiler가 자동 처리
function Component({ data }) {
  const processed = expensive(data);
  const handleClick = () => doSomething(processed);
  return <Child onClick={handleClick} data={processed} />;
}
```

컴파일러가 자동으로 필요한 곳에 메모이제이션 적용

### 설정

```typescript
// next.config.ts
export default {
  reactCompiler: true,
};
```

```bash
# 확인
pnpm build
# 출력: ✓ reactCompiler
```

### useMemo/useCallback 사용 시점

**기본:** 컴파일러에 맡기기

**필요한 경우:**

- Effect 의존성으로 사용
- 매우 비싼 계산 (측정 후)
- 외부 라이브러리 통합

```typescript
// Effect 의존성
const value = useMemo(() => compute(data), [data]);

useEffect(() => {
  doSomething(value);
}, [value]); // value 변경 시에만 실행
```

## 번들 최적화

### 번들 크기 확인

```bash
pnpm analyze
```

브라우저에서 자동으로 열림:

- `client.html`: 클라이언트 번들
- `server.html`: 서버 번들

### Dynamic Import

```typescript
// 무거운 컴포넌트 코드 분할
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <Skeleton />,
  ssr: false, // 클라이언트 전용
});
```

### 라이브러리 최적화

```typescript
// ❌ 전체 import
import _ from 'lodash';

// ✅ 필요한 것만
import debounce from 'lodash/debounce';
```

```typescript
// next.config.ts - 자동 최적화
experimental: {
  optimizePackageImports: ['react-icons', 'lucide-react'],
}
```

## 이미지 최적화

### next/image 사용

```typescript
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority  // LCP 이미지에만
  placeholder="blur"
/>
```

### 설정

```typescript
// next.config.ts
images: {
  formats: ['image/avif', 'image/webp'],
  minimumCacheTTL: 60,
}
```

## 렌더링 최적화

### SSG 우선

```typescript
// ✅ 가능하면 SSG
export default async function Page() {
  const data = await fetchData();
  return <Component data={data} />;
}
```

### 병렬 데이터 페칭

```typescript
// ✅ 병렬로 가져오기
const [users, posts] = await Promise.all([getUsers(), getPosts()]);
```

### Suspense 활용

```typescript
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <DataComponent />
    </Suspense>
  );
}
```

## 폰트 최적화

### next/font 사용

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({ children }) {
  return (
    <html className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

자동 최적화:

- CLS 방지
- 폰트 로딩 전략
- 최적화된 다운로드

## 캐싱

### TanStack Query

```typescript
useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  staleTime: 60000, // 60초 fresh
  gcTime: 300000, // 5분 후 GC
});
```

### HTTP 캐싱

```typescript
// next.config.ts
headers: [
  {
    source: '/static/:path*',
    headers: [
      {
        key: 'Cache-Control',
        value: 'public, max-age=31536000, immutable',
      },
    ],
  },
],
```

## 성능 측정

### Lighthouse

```bash
# Chrome DevTools
F12 → Lighthouse → Generate Report
```

**목표:**

- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

### Core Web Vitals

| 지표    | 목표    | 최적화 방법                   |
| ------- | ------- | ----------------------------- |
| **LCP** | < 2.5s  | 이미지 최적화, SSG            |
| **FID** | < 100ms | 코드 분할, React Compiler     |
| **CLS** | < 0.1   | 이미지 크기 지정, 폰트 최적화 |

### 번들 크기

```bash
pnpm build

# 목표
# - First Load JS: < 200KB
# - 페이지별: < 50KB
```

## React 최적화

### 리스트 렌더링

```typescript
// ✅ 안정적인 key
{items.map(item => (
  <Item key={item.id} item={item} />
))}

// ❌ index를 key로
{items.map((item, index) => (
  <Item key={index} item={item} />
))}
```

### React.memo (필요시만)

```typescript
// 복잡한 컴포넌트만
const HeavyComponent = React.memo(function Heavy({ data }) {
  return <div>{/* ... */}</div>;
});
```

React Compiler가 대부분 자동 처리

## 체크리스트

### 이미지

- [ ] next/image 사용
- [ ] LCP 이미지에 priority
- [ ] 적절한 크기 지정

### JavaScript

- [ ] 번들 크기 < 200KB
- [ ] Dynamic import 활용
- [ ] 사용 안 하는 라이브러리 제거

### 렌더링

- [ ] SSG 우선 고려
- [ ] 병렬 데이터 페칭
- [ ] Suspense 활용

### 폰트

- [ ] next/font 사용
- [ ] display: swap 설정

### 측정

- [ ] Lighthouse 90+ 달성
- [ ] Core Web Vitals 통과
- [ ] 번들 분석 정기 실행

## 개발 도구

### Speed Insights

```bash
pnpm add @vercel/speed-insights
```

```typescript
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### React DevTools Profiler

컴포넌트 렌더링 시간 측정

## 참고

- [React Compiler](https://react.dev/learn/react-compiler)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Performance](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)
