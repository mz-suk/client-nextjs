# SSG (Static Site Generation) 가이드

Next.js 16 + Static Export 환경에서 SSG를 활용하는 완벽 가이드입니다.

## 📚 목차

1. [SSG란?](#ssg란)
2. [기본 SSG 패턴](#기본-ssg-패턴)
3. [동적 라우트 (generateStaticParams)](#동적-라우트-generatestaticparams)
4. [데이터 소스](#데이터-소스)
5. [Best Practices](#best-practices)
6. [트러블슈팅](#트러블슈팅)

## SSG란?

**Static Site Generation (SSG)**은 빌드 시점에 페이지를 미리 생성하는 렌더링 방식입니다.

### 특징

- ⚡️ **빠른 로딩**: 미리 생성된 HTML을 즉시 제공
- 🔍 **SEO 최적화**: 크롤러가 완전한 HTML 콘텐츠 확인 가능
- 💰 **비용 절감**: CDN으로 정적 파일 서빙, 서버 비용 없음
- 🔒 **보안**: 서버 로직 없이 정적 파일만 제공

### 사용 시기

✅ **SSG 권장:**

- 블로그, 문서, 마케팅 페이지
- 자주 변경되지 않는 콘텐츠
- SEO가 중요한 공개 페이지
- 빌드 시점에 데이터를 알 수 있는 경우

❌ **SSG 비권장:**

- 사용자별 개인화 데이터
- 실시간으로 변경되는 데이터
- 인증이 필요한 페이지
- 매우 많은 동적 경로 (빌드 시간 증가)

## 기본 SSG 패턴

### 1. 정적 페이지

가장 간단한 SSG 패턴입니다.

```typescript
// app/about/page.tsx
export default function AboutPage() {
  return (
    <div>
      <h1>About Us</h1>
      <p>This page is statically generated at build time.</p>
    </div>
  );
}
```

### 2. SSG + CSR 하이브리드

빌드 시점에 데이터를 prefetch하고 클라이언트에서 hydrate하는 패턴입니다.

```typescript
// app/posts/page.tsx
import { PrefetchBoundary } from '@core/lib';
import { PostListSuspense, postQueries } from '@domains/post';

export default async function PostsPage() {
  return (
    <PrefetchBoundary queryOptions={postQueries.list()}>
      <PostListSuspense />
    </PrefetchBoundary>
  );
}
```

**장점:**

- 초기 HTML에 데이터 포함 (SEO)
- 클라이언트에서 실시간 업데이트 가능
- TanStack Query 캐싱 활용

## 동적 라우트 (generateStaticParams)

동적 경로를 빌드 시점에 미리 생성하는 패턴입니다.

### 아키텍처

```
domains/
└── post/
    ├── model/
    │   ├── ssg.types.ts      # 타입 정의
    │   ├── ssg.data.ts       # 데이터 레이어
    │   └── index.ts          # Export
    └── ui/
        ├── DetailCard.tsx    # 재사용 가능한 UI
        └── index.ts

app/
└── posts/
    └── [id]/
        └── page.tsx          # 동적 라우트 페이지
```

### 1. 타입 정의

```typescript
// domains/post/model/ssg.types.ts
import { z } from 'zod';

// Zod 스키마 정의
export const SSGPostSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  content: z.string(),
  createdAt: z.string(),
});

// 타입 추출
export type SSGPost = z.infer<typeof SSGPostSchema>;

// generateStaticParams 반환 타입
export type SSGPostParams = {
  id: string;
};
```

### 2. 데이터 레이어

```typescript
// domains/post/model/ssg.data.ts
import type { SSGPost } from './ssg.types';

// 정적 데이터 (실제로는 CMS, DB, API 등에서 가져옴)
export const SSG_POSTS: SSGPost[] = [
  {
    id: '1',
    title: 'Next.js 16의 새로운 기능',
    description: 'App Router의 성능 개선과 새로운 API 소개',
    content: '...',
    createdAt: '2026-01-10T09:00:00Z',
  },
  // ...
];

/**
 * SSG Post 상세 조회 (빌드 타임)
 */
export function getSSGPost(id: string): SSGPost | undefined {
  return SSG_POSTS.find(post => post.id === id);
}

/**
 * SSG Post ID 목록 조회 (generateStaticParams용)
 */
export function getSSGPostIds(): string[] {
  return SSG_POSTS.map(post => post.id);
}

/**
 * SSG Post ID 유효성 검증
 */
export function isValidSSGPostId(id: string): boolean {
  return SSG_POSTS.some(post => post.id === id);
}
```

### 3. 페이지 컴포넌트

```typescript
// app/posts/[id]/page.tsx
import { notFound } from 'next/navigation';
import {
  DetailCard,
  getSSGPost,
  getSSGPostIds,
  isValidSSGPostId,
  LinkButton,
  type SSGPostParams,
} from '@domains/post';

interface PageProps {
  params: Promise<SSGPostParams>;
}

/**
 * 정적 경로 생성 (빌드 타임)
 */
export async function generateStaticParams(): Promise<SSGPostParams[]> {
  const ids = getSSGPostIds();

  return ids.map(id => ({ id }));
}

/**
 * 동적 파라미터 처리 전략
 * - false: generateStaticParams에 없는 경로는 404 (권장)
 * - true: 런타임에 동적 생성 시도 (Static Export에서는 동작 안 함)
 */
export const dynamicParams = false;

/**
 * 페이지 컴포넌트
 */
export default async function PostDetailPage({ params }: PageProps) {
  const { id } = await params; // Next.js 15+에서는 params가 Promise

  // 유효성 검증
  if (!isValidSSGPostId(id)) {
    notFound();
  }

  // 데이터 조회 (빌드 타임)
  const post = getSSGPost(id);

  if (!post) {
    notFound();
  }

  return (
    <DetailCard
      title={post.title}
      description={post.description}
      content={<p>{post.content}</p>}
      footer={
        <LinkButton href="/posts" variant="secondary">
          목록으로 돌아가기
        </LinkButton>
      }
    />
  );
}
```

### 주요 개념

#### generateStaticParams

빌드 시점에 생성할 경로 목록을 반환하는 함수입니다.

```typescript
export async function generateStaticParams(): Promise<SSGPostParams[]> {
  // 1. 데이터 소스에서 ID 목록 가져오기
  const ids = getSSGPostIds();

  // 2. 경로 파라미터 객체 배열 반환
  return ids.map(id => ({ id }));
}
```

**반환값:**

- 배열의 각 객체가 하나의 경로를 나타냄
- 객체의 키는 동적 세그먼트 이름 (`[id]` → `{ id: '...' }`)
- 중첩 동적 라우트: `[category]/[id]` → `{ category: '...', id: '...' }`

#### dynamicParams

정의되지 않은 경로 접근 시 동작을 제어합니다.

```typescript
export const dynamicParams = false; // 권장
```

- `false`: generateStaticParams에 없는 경로는 404 처리
- `true` (기본값): 런타임에 동적 생성 시도 (Static Export에서는 동작 안 함)

#### params Promise

Next.js 15+에서는 `params`가 Promise로 래핑됩니다.

```typescript
// ✅ 올바른 사용
export default async function Page({ params }: PageProps) {
  const { id } = await params;
  // ...
}

// ❌ 잘못된 사용 (Next.js 14 이하)
export default function Page({ params }: PageProps) {
  const { id } = params; // 타입 에러
  // ...
}
```

## 데이터 소스

### 1. 정적 데이터 (하드코딩)

코드에 직접 포함된 데이터입니다.

```typescript
export const SSG_POSTS: SSGPost[] = [
  { id: '1', title: '...' /* ... */ },
  { id: '2', title: '...' /* ... */ },
];
```

**사용 시기:**

- 자주 변경되지 않는 데이터
- 소량의 데이터
- 설정, 상수 등

**주의사항:**

- 데이터가 많으면 번들 크기 증가
- 데이터 변경 시 코드 수정 및 재배포 필요

### 2. 파일 시스템

Markdown, JSON 등 파일에서 데이터를 읽습니다.

```typescript
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export function getSSGPosts(): SSGPost[] {
  const postsDirectory = path.join(process.cwd(), 'content/posts');
  const filenames = fs.readdirSync(postsDirectory);

  return filenames.map(filename => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      id: filename.replace(/\.md$/, ''),
      title: data.title,
      description: data.description,
      content,
      createdAt: data.createdAt,
    };
  });
}
```

**사용 시기:**

- 블로그, 문서 사이트
- Git으로 콘텐츠 버전 관리
- 개발자 친화적인 워크플로우

### 3. CMS / API (실제 사용 예제)

Headless CMS나 API에서 데이터를 가져옵니다.

**실제 프로젝트 예제 (JSONPlaceholder API):**

```typescript
// app/posts/[id]/page.tsx
import { postApi, type Post } from '@domains/post';

export async function generateStaticParams() {
  // 빌드 시점에 실제 API 호출
  const posts = await postApi.getPosts();
  const limitedPosts = posts.slice(0, 10); // 처음 10개만 SSG

  return limitedPosts.map(post => ({
    id: String(post.id),
  }));
}

export default async function PostDetailPage({ params }: PageProps) {
  const { id } = await params;
  const postId = parseInt(id, 10);

  // 빌드 타임에 API 호출하여 데이터 가져오기
  let post: Post;
  try {
    post = await postApi.getPost(postId);
  } catch (error) {
    notFound();
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  );
}
```

**빌드 출력 예시:**

```bash
├ ● /posts/[id]
│ ├ /posts/1
│ ├ /posts/2
│ ├ /posts/3
│ └ [+7 more paths]

●  (SSG)  prerendered as static HTML (uses generateStaticParams)
```

**사용 시기:**

- 비개발자가 콘텐츠 관리
- 여러 플랫폼에서 콘텐츠 재사용
- 풍부한 편집 기능 필요
- 실시간 데이터를 빌드 시점에 스냅샷

**주의사항:**

- 빌드 시점에 API가 접근 가능해야 함
- API 응답 시간이 빌드 시간에 영향
- 데이터 변경 시 재빌드 필요
- 대량 데이터는 일부만 SSG (예: 처음 100개)로 최적화

### 4. Database

빌드 시점에 데이터베이스에서 데이터를 조회합니다.

```typescript
import { db } from '@/lib/db';

export async function getSSGPosts(): Promise<SSGPost[]> {
  const posts = await db.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });

  return posts.map(post => ({
    id: post.id,
    title: post.title,
    description: post.description,
    content: post.content,
    createdAt: post.createdAt.toISOString(),
  }));
}
```

**사용 시기:**

- 대량의 구조화된 데이터
- 복잡한 쿼리 필요
- 기존 데이터베이스 활용

## Best Practices

### 1. 타입 안전성 보장

```typescript
// ✅ Zod 스키마로 런타임 검증 + 타입 추론
export const SSGPostSchema = z.object({
  id: z.string(),
  title: z.string(),
  // ...
});

export type SSGPost = z.infer<typeof SSGPostSchema>;

// ✅ generateStaticParams 반환 타입 명시
export async function generateStaticParams(): Promise<SSGPostParams[]> {
  // ...
}
```

### 2. 데이터 레이어 분리

```typescript
// ✅ 도메인 레이어에 데이터 로직 집중
// domains/post/model/ssg.data.ts
export function getSSGPost(id: string): SSGPost | undefined {
  return SSG_POSTS.find(post => post.id === id);
}

// ❌ 페이지 컴포넌트에 데이터 로직 혼재
export default async function Page({ params }) {
  const post = SSG_POSTS.find(p => p.id === id); // 비권장
}
```

### 3. 유효성 검증

```typescript
// ✅ 명시적인 유효성 검증
if (!isValidSSGPostId(id)) {
  notFound();
}

const post = getSSGPost(id);

if (!post) {
  notFound();
}
```

### 4. 재사용 가능한 컴포넌트

```typescript
// ✅ 공통 UI 컴포넌트 사용
<DetailCard
  title={post.title}
  description={post.description}
  content={<p>{post.content}</p>}
  footer={<LinkButton href="/posts">목록</LinkButton>}
/>

// ❌ 페이지마다 중복된 마크업
<div className={styles.container}>
  <h1>{post.title}</h1>
  {/* 반복되는 구조 */}
</div>
```

### 5. SEO 최적화

```typescript
// ✅ 메타데이터 생성
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = getSSGPost(id);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.createdAt,
    },
  };
}
```

### 6. 적절한 dynamicParams 설정

```typescript
// ✅ Static Export에서는 false 권장
export const dynamicParams = false;

// ⚠️ true는 Static Export에서 동작 안 함
export const dynamicParams = true;
```

## 트러블슈팅

### 1. 빌드 시 경로가 생성되지 않음

**증상:**

```bash
pnpm build
# /posts/1, /posts/2 등이 생성되지 않음
```

**원인:**

- `generateStaticParams`가 빈 배열 반환
- 데이터 소스 접근 실패
- 비동기 함수인데 await 누락

**해결:**

```typescript
// ✅ 올바른 구현
export async function generateStaticParams(): Promise<SSGPostParams[]> {
  const ids = getSSGPostIds(); // 데이터 확인
  console.log('Generating paths for:', ids); // 디버깅

  return ids.map(id => ({ id }));
}
```

### 2. 404 페이지로 리다이렉트됨

**증상:**

- 빌드는 성공했지만 페이지 접근 시 404

**원인:**

- `dynamicParams = false`인데 경로가 생성되지 않음
- 경로 파라미터 이름 불일치

**해결:**

```typescript
// ✅ 파라미터 이름 일치 확인
// [id]/page.tsx → { id: '...' }
// [slug]/page.tsx → { slug: '...' }

export async function generateStaticParams() {
  return [
    { id: '1' }, // ✅ [id]와 일치
    { slug: 'hello' }, // ❌ [id]와 불일치
  ];
}
```

### 3. params 타입 에러

**증상:**

```typescript
const { id } = params; // 타입 에러: params is Promise
```

**원인:**

- Next.js 15+에서는 params가 Promise

**해결:**

```typescript
// ✅ await 사용
const { id } = await params;
```

### 4. 빌드 시간이 너무 오래 걸림

**증상:**

- 수천 개의 경로 생성 시 빌드 시간 증가

**해결:**

```typescript
// 1. 필요한 경로만 생성
export async function generateStaticParams() {
  // 최근 100개만 SSG, 나머지는 CSR
  const recentIds = getRecentPostIds(100);
  return recentIds.map(id => ({ id }));
}

// 2. 또는 dynamicParams = true로 설정 (SSR 환경)
export const dynamicParams = true;
```

### 5. 데이터 업데이트가 반영되지 않음

**증상:**

- CMS에서 콘텐츠 수정했지만 사이트에 반영 안 됨

**원인:**

- SSG는 빌드 시점의 스냅샷

**해결:**

```bash
# 재빌드 필요
pnpm build

# 또는 Webhook으로 자동 재빌드 설정
# (Vercel, Netlify 등에서 지원)
```

## 참고

- [Next.js generateStaticParams 공식 문서](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
- [Next.js Static Exports 공식 문서](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [데이터 패칭 가이드](./data-fetching.md)
- [아키텍처 가이드](./architecture.md)
