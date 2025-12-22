# ⚡ 성능 최적화 가이드

Next.js 15 애플리케이션의 성능을 최적화하는 방법을 안내합니다.

## 📊 현재 최적화 상태

### 이미 적용된 최적화

✅ **이미지 최적화**

- AVIF/WebP 포맷 자동 변환
- 반응형 이미지 크기
- 60초 캐시 TTL

✅ **번들 최적화**

- 프로덕션 빌드 시 console 제거
- 패키지 import 최적화 (실험적)
- Code Splitting 자동 적용

✅ **보안 헤더**

- X-Frame-Options, X-Content-Type-Options
- Referrer-Policy
- DNS Prefetch Control

✅ **정적 자산 캐싱**

- 1년 캐시 (immutable)

---

## 🔍 번들 분석

### 번들 크기 확인

```bash
# 번들 분석 실행
pnpm analyze

# 브라우저에서 자동으로 열림
# - client.html: 클라이언트 번들
# - server.html: 서버 번들
```

**확인 사항:**

- 큰 라이브러리 찾기
- 중복 의존성 확인
- Tree-shaking 여부

---

## 🖼️ 이미지 최적화

### next/image 사용

```typescript
import Image from 'next/image';

// ✅ 올바른 사용
<Image
  src="/images/hero.jpg"
  alt="Hero Image"
  width={1200}
  height={600}
  priority  // LCP 이미지에만 사용
  placeholder="blur"  // 옵션
/>

// ❌ 잘못된 사용
<img src="/images/hero.jpg" alt="Hero Image" />
```

### 최적화 설정 (next.config.ts)

```typescript
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  imageSizes: [16, 32, 48, 64, 96, 128, 256],
  minimumCacheTTL: 60,
}
```

### 외부 이미지

```typescript
// next.config.ts
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'example.com',
      pathname: '/images/**',
    },
  ],
}
```

---

## 🔤 폰트 최적화

### next/font 사용 (권장)

```typescript
// app/layout.tsx
import { Inter, Noto_Sans_KR } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const notoSansKR = Noto_Sans_KR({
  subsets: ['korean'],
  display: 'swap',
  weight: ['400', '700'],
  variable: '--font-noto-sans-kr',
});

export default function RootLayout({ children }) {
  return (
    <html className={`${inter.variable} ${notoSansKR.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

### 로컬 폰트

```typescript
import localFont from 'next/font/local';

const customFont = localFont({
  src: './fonts/CustomFont.woff2',
  display: 'swap',
  variable: '--font-custom',
});
```

**이점:**

- 자동 최적화
- CLS (Cumulative Layout Shift) 방지
- 폰트 로딩 전략 자동 적용

---

## 📦 번들 크기 최적화

### 1. Dynamic Import

```typescript
// ✅ 동적 import로 코드 분할
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false,  // 클라이언트 전용 컴포넌트
});

// 사용
<HeavyComponent />
```

### 2. 라이브러리 선택적 import

```typescript
// ❌ 전체 import
import _ from 'lodash';

// ✅ 필요한 것만 import
import debounce from 'lodash/debounce';

// 또는 lodash-es 사용
import { debounce } from 'lodash-es';
```

### 3. 패키지 최적화

```typescript
// next.config.ts
experimental: {
  optimizePackageImports: [
    'react-icons',
    'lucide-react',
    '@mui/material',
    '@mui/icons-material',
  ],
}
```

### 4. Tree Shaking 확인

```bash
# 번들 분석으로 확인
pnpm analyze

# 사용하지 않는 export 제거
# side-effects 최소화
```

---

## 🚀 렌더링 최적화

### 1. Static Generation (SSG) 활용

```typescript
// ✅ 가능하면 SSG 사용
export default async function Page() {
  const data = await fetchData();
  return <Component data={data} />;
}
```

### 2. Incremental Static Regeneration (ISR)

```typescript
// 재검증 주기 설정
export const revalidate = 3600;  // 1시간

export default async function Page() {
  const data = await fetchData();
  return <Component data={data} />;
}
```

### 3. Suspense + Streaming

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

### 4. Parallel Data Fetching

```typescript
// ✅ 병렬로 데이터 가져오기
const [users, products] = await Promise.all([getUsers(), getProducts()]);
```

---

## 🎯 React 최적화

### 1. useMemo / useCallback

```typescript
// ✅ 비싼 계산 메모이제이션
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);

// ✅ 콜백 메모이제이션
const handleClick = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

### 2. React.memo

```typescript
// ✅ 불필요한 리렌더링 방지
const MemoizedComponent = React.memo(function Component({ data }) {
  return <div>{data}</div>;
});
```

### 3. 리스트 최적화

```typescript
// ✅ 안정적인 key 사용
{items.map(item => (
  <Item key={item.id} item={item} />
))}

// ❌ index를 key로 사용 금지
{items.map((item, index) => (
  <Item key={index} item={item} />
))}
```

---

## 🔄 캐싱 전략

### TanStack Query 캐싱

```typescript
const { data } = useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  staleTime: 60000, // 60초
  gcTime: 300000, // 5분 (이전 cacheTime)
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
];
```

---

## 📈 성능 측정

### 1. Lighthouse

```bash
# Chrome DevTools에서 실행
1. F12 → Lighthouse
2. Generate Report
```

**목표:**

- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

### 2. Core Web Vitals

**LCP (Largest Contentful Paint):** < 2.5s

- 이미지 최적화
- 서버 응답 시간 개선
- Critical CSS 인라인

**FID (First Input Delay):** < 100ms

- 큰 JavaScript 파일 분할
- Web Workers 활용

**CLS (Cumulative Layout Shift):** < 0.1

- 이미지/비디오에 width/height 지정
- 폰트 최적화
- 광고/동적 콘텐츠 공간 예약

### 3. 번들 크기 모니터링

```bash
# 빌드 후 확인
pnpm build

# 목표
- First Load JS: < 200KB
- 개별 페이지: < 50KB 추가
```

---

## 🛠️ 개발 도구

### Next.js Speed Insights

```bash
pnpm add @vercel/speed-insights
```

```typescript
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

<SpeedInsights />
```

### Bundle Analyzer

```bash
# 이미 설정됨
pnpm analyze
```

---

## ✅ 체크리스트

### 이미지

- [ ] next/image 사용
- [ ] LCP 이미지에 priority 설정
- [ ] 적절한 크기 사용
- [ ] 최신 포맷 (AVIF/WebP)

### 폰트

- [ ] next/font 사용
- [ ] display: swap 설정
- [ ] 필요한 subset만 로드

### JavaScript

- [ ] 번들 크기 < 200KB
- [ ] Dynamic import 활용
- [ ] Tree shaking 확인
- [ ] 사용하지 않는 라이브러리 제거

### 렌더링

- [ ] SSG 우선 고려
- [ ] ISR 적절히 활용
- [ ] Suspense로 스트리밍
- [ ] 병렬 데이터 페칭

### 캐싱

- [ ] HTTP 캐싱 설정
- [ ] TanStack Query 활용
- [ ] 정적 자산 장기 캐싱

### 측정

- [ ] Lighthouse 90+ 달성
- [ ] Core Web Vitals 통과
- [ ] 번들 분석 정기 실행

---

## 🎓 추가 학습

- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Performance](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)

---

## 💬 성능 이슈 보고

성능 문제를 발견하면 다음 정보와 함께 이슈를 등록해주세요:

- Lighthouse 점수
- 번들 분석 결과
- 재현 방법
