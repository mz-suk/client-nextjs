# 환경변수 설정 가이드

## 📁 파일 구조

```
.env                # 프로덕션 기본값 (Git ✅)
.env.development    # 개발 환경 (Git ✅)
.env.local          # 로컬 오버라이드 (Git ❌, 선택사항)
```

---

## 🎯 환경별 설정

### 개발 환경 (Development)

```bash
# .env.development (자동 로드)
NEXT_PUBLIC_API_URL=/api/proxy
API_TARGET_URL=https://dev-api.apecabac.com
```

**동작:**

- `pnpm dev` 실행 시 자동 로드
- 프록시를 통해 `https://dev-api.apecabac.com` 호출
- CORS 문제 없음

### 프로덕션 환경 (Production)

```bash
# .env (기본값)
NEXT_PUBLIC_API_URL=https://api.apecabac.com
```

**동작:**

- `pnpm build` 실행 시 사용
- API 직접 호출 (프록시 없음)
- 성능 최적화

### AWS 배포 환경

AWS에서 환경변수 직접 설정:

```bash
# AWS에서 설정할 환경변수
NEXT_PUBLIC_API_URL=https://api.apecabac.com
NEXT_PUBLIC_APP_VERSION=1.0.0
# 기타 필요한 변수들...
```

---

## 🔄 우선순위

```
높음 → .env.local (로컬 오버라이드, 선택)
       ↓
     .env.development (개발 환경)
       ↓
낮음 → .env (프로덕션 기본값)
```

---

## 💻 사용 방법

### 환경변수

```typescript
import { env, isDev, isProd } from '@/lib/env';

console.log(env.API_URL);
console.log(env.FEATURE_DEBUG);

if (isDev) {
  console.log('개발 모드: 프록시 사용 중');
}
```

### API 호출 (Axios)

```typescript
import { apiClient, fetchAPI } from '@/lib/api';

// 방법 1: fetchAPI 유틸
const users = await fetchAPI('/users', { method: 'GET' });

// 방법 2: apiClient 직접 사용
const { data } = await apiClient.get('/users');
await apiClient.post('/users', { name: 'John' });
```

### React 컴포넌트

```typescript
'use client';

import { apiClient } from '@/lib/api';
import { useState } from 'react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    // 개발: /api/proxy/users → https://dev-api.apecabac.com/users
    // 프로덕션: https://api.apecabac.com/users
    const { data } = await apiClient.get('/users');
    setUsers(data);
  };

  return <button onClick={loadUsers}>사용자 가져오기</button>;
}
```

---

## 🚀 시작하기

### 1. 개발 환경

```bash
# 개발 서버 실행
pnpm dev

# → .env.development 자동 로드
# → https://dev-api.apecabac.com으로 프록시 연결
```

### 2. 프로덕션 빌드

```bash
# 프로덕션 빌드
pnpm build

# → .env 사용
# → https://api.apecabac.com 직접 호출
```

### 3. 로컬 테스트 (프로덕션 모드)

```bash
pnpm build
pnpm start

# → 프로덕션과 동일한 환경
```

---

## 🛠️ 환경변수 추가 방법

### 1. 환경 파일에 추가

```bash
# .env에 추가 (프로덕션 기본값)
NEXT_PUBLIC_NEW_FEATURE=true

# .env.development에 추가 (개발 환경만)
NEXT_PUBLIC_NEW_FEATURE=false
```

### 2. 타입 정의 추가

```typescript
// src/lib/env.ts
const envSchema = {
  // ... 기존 설정
  NEXT_PUBLIC_NEW_FEATURE: { required: false, isPublic: true },
} as const;

export const env = {
  // ... 기존 설정
  NEW_FEATURE: getEnv('NEXT_PUBLIC_NEW_FEATURE') === 'true',
} as const;
```

### 3. 사용

```typescript
import { env } from '@/lib/env';

if (env.NEW_FEATURE) {
  // 새 기능 활성화
}
```

---

## 🔐 보안 규칙

### NEXT_PUBLIC\_ 접두사

```bash
# ✅ 브라우저 노출 가능 (공개 정보)
NEXT_PUBLIC_API_URL=https://api.apecabac.com
NEXT_PUBLIC_APP_VERSION=1.0.0

# ❌ 브라우저 노출 불가 (민감 정보)
API_SECRET_KEY=secret-key
DATABASE_URL=postgresql://...
```

### .env.local 사용 (선택)

개발자별로 다른 설정이 필요한 경우에만 사용:

```bash
# .env.local (Git에 커밋 안 됨)
NEXT_PUBLIC_API_URL=http://localhost:3001/api
API_TARGET_URL=http://localhost:3001/api
```

---

## 🌍 배포 환경 설정

### AWS

#### 방법 1: 환경변수 직접 설정

```bash
# AWS Elastic Beanstalk, ECS, Lambda 등
NEXT_PUBLIC_API_URL=https://api.apecabac.com
NEXT_PUBLIC_APP_VERSION=1.0.0
```

#### 방법 2: .env 파일 사용

```bash
# 빌드 시 .env 파일이 포함됨
# 추가 설정 필요 없음
```

### Vercel (참고용)

```
Project Settings → Environment Variables

Production:
  NEXT_PUBLIC_API_URL = https://api.apecabac.com

Preview:
  NEXT_PUBLIC_API_URL = https://dev-api.apecabac.com
```

---

## 🔍 환경 확인

### 터미널에서

```bash
pnpm env:check
```

### 브라우저에서

```
http://localhost:3000/api/health
```

### 코드에서

```typescript
console.log('Environment:', process.env.NODE_ENV);
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
```

---

## 📊 환경별 정리

| 환경        | 파일                 | API URL                         | 프록시 |
| ----------- | -------------------- | ------------------------------- | ------ |
| 개발        | `.env.development`   | `/api/proxy` → dev-api.apecabac | ✅     |
| 프로덕션    | `.env`               | `https://api.apecabac.com`      | ❌     |
| AWS 배포    | AWS 환경변수 or .env | `https://api.apecabac.com`      | ❌     |
| 로컬 테스트 | `.env.local` (선택)  | 개발자 설정                     | 선택   |

---

## 🐛 트러블슈팅

### 문제: API 호출 실패 (개발)

**확인:**

```bash
# dev-api 서버 접근 가능한지 확인
curl https://dev-api.apecabac.com/health
```

**해결:**

- VPN 연결 확인
- 네트워크 권한 확인

### 문제: 환경변수가 undefined

**원인:** 서버 재시작 필요

**해결:**

```bash
# 개발 서버 재시작
# Ctrl+C로 종료 후
pnpm dev
```

### 문제: 프로덕션에서 프록시 사용됨

**확인:**

```bash
# .env 파일 확인
cat .env

# NEXT_PUBLIC_API_URL이 /api/proxy면 안 됨!
```

---

## 💡 팁

1. **환경변수 변경 후 재시작 필수**
2. **NEXT_PUBLIC\_ 접두사 꼭 사용** (클라이언트 노출 변수)
3. **.env.local은 선택사항** (팀 공통 설정으로 충분)
4. **AWS 배포 시 환경변수 우선** (동적 변경 가능)

---

## 📚 관련 문서

- [PROXY_SETUP.md](./PROXY_SETUP.md) - 프록시 상세 가이드
- [QUICK_START.md](./QUICK_START.md) - 빠른 시작 가이드
