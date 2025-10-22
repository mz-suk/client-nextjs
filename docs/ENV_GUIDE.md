# 환경변수 설정 가이드

## 📁 파일 구조

```
.env                # 프로덕션 기본값
.env.development    # 개발 환경
.env.local          # 로컬 오버라이드 (선택)
```

---

## 🎯 환경별 설정

### 개발 환경

```bash
# .env.development
NEXT_PUBLIC_API_URL=/api/proxy
API_TARGET_URL=https://dev-api.incheondfs.kr
NEXT_PUBLIC_FEATURE_DEBUG=true
```

### 프로덕션 환경

```bash
# .env
NEXT_PUBLIC_API_URL=https://dev-api.incheondfs.kr
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_FEATURE_DEBUG=false
```

---

## 💻 사용 예시

### 환경변수 사용

```typescript
import { env, isDev } from '@/shared/config';

console.log(env.API_URL); // 자동으로 환경에 맞는 URL 사용
```

### API 호출

```typescript
import { fetchAPI, apiClient } from '@/shared/api';

const data = await fetchAPI<User[]>('/users');
const response = await apiClient.post('/users', { name: 'John' });
```

### ISR 설정

```typescript
// app/posts/page.tsx
import { revalidateConfig } from '@/shared/config';

export const revalidate = revalidateConfig.dynamic; // 60초

export default async function PostsPage() {
  const posts = await fetchAPI<Post[]>('/posts');
  return <PostList posts={posts} />;
}
```

---

## 🛠️ 환경변수 추가

### 1. 스키마 정의

```typescript
// src/shared/config/env.ts
const envSchema = {
  NEXT_PUBLIC_NEW_VAR: { required: false, isPublic: true, default: 'value' },
} as const;

export const env = {
  NEW_VAR: getEnv('NEXT_PUBLIC_NEW_VAR') ?? 'value',
} as const;
```

### 2. .env 파일에 추가

```bash
NEXT_PUBLIC_NEW_VAR=production-value
```

---

## 🔐 보안

```bash
# ✅ 클라이언트 노출 가능
NEXT_PUBLIC_API_URL=https://api.example.com

# ❌ 서버 전용 (민감정보)
API_SECRET=xxx
DATABASE_URL=postgresql://...
```

---

## 🐛 트러블슈팅

**환경변수 변경 후 서버 재시작 필수**

```bash
pnpm dev
```

**빌드 후 프로덕션 테스트**

```bash
pnpm build
pnpm start
```
