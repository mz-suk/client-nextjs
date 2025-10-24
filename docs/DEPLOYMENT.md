# 🚀 배포 가이드

**서버 없는 정적 배포**로 프로젝트를 CDN에 배포하는 방법을 설명합니다.

> 🎯 **핵심**: 이 프로젝트는 서버가 필요 없는 정적 사이트입니다.

---

## 📖 목차

- [배포 전 체크리스트](#배포-전-체크리스트)
- [Vercel 배포 (권장)](#vercel-배포-권장)
- [Netlify 배포](#netlify-배포)
- [GitHub Pages 배포](#github-pages-배포)
- [환경변수 설정](#환경변수-설정)
- [성능 최적화](#성능-최적화)
- [모니터링](#모니터링)

---

## ✅ 배포 전 체크리스트

### 1. 코드 품질 확인

```bash
# TypeScript 타입 체크
pnpm lint

# 코드 포맷팅
pnpm format

# 프로덕션 빌드 테스트
pnpm build
```

### 2. 환경변수 확인

```bash
# .env.production 파일 생성
cp .env.example .env.production

# 필수 환경변수 확인
NEXT_PUBLIC_API_URL=https://your-api-url.com
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_FEATURE_DEBUG=false
```

### 3. 보안 점검

- [ ] API 키가 코드에 하드코딩되지 않았는지 확인
- [ ] 민감한 정보가 `.env` 파일에만 있는지 확인
- [ ] `.gitignore`에 `.env` 파일이 등록되어 있는지 확인
- [ ] **외부 API CORS 설정** 확인 (중요!)

**⚠️ 중요**: 정적 배포는 서버 프록시를 사용할 수 없으므로, **외부 API 서버에서 CORS를 허용**해야 합니다.

### 4. 성능 확인

```bash
# 번들 크기 분석
pnpm analyze

# Lighthouse 점수 확인 (Chrome DevTools)
```

---

## ☁️ Vercel 배포 (권장)

Next.js를 만든 Vercel에서 배포하는 것이 가장 간단하고 최적화되어 있습니다.

### 1. Vercel CLI 설치

```bash
pnpm add -g vercel
```

### 2. 프로젝트 연결

```bash
# 프로젝트 디렉토리에서 실행
vercel

# 질문에 답변
? Set up and deploy "~/client-nextjs"? [Y/n] Y
? Which scope do you want to deploy to? Your Team
? Link to existing project? [y/N] N
? What's your project's name? client-nextjs
? In which directory is your code located? ./
```

### 3. 환경변수 설정

**Vercel Dashboard에서 설정:**

1. https://vercel.com 접속
2. 프로젝트 선택
3. Settings → Environment Variables
4. 환경변수 추가:

```
NEXT_PUBLIC_API_URL=https://your-api-url.com
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_FEATURE_DEBUG=false
```

**CLI에서 설정:**

```bash
vercel env add NEXT_PUBLIC_API_URL
? What's the value of NEXT_PUBLIC_API_URL? https://your-api-url.com
? Add NEXT_PUBLIC_API_URL to which Environments? Production, Preview, Development
```

### 4. 배포

```bash
# Preview 배포 (테스트용)
vercel

# Production 배포
vercel --prod
```

### 5. 자동 배포 (Git 연동)

**GitHub 연동:**

1. Vercel Dashboard → Add New Project
2. Import Git Repository
3. GitHub 저장소 선택
4. 환경변수 설정
5. Deploy 클릭

**자동 배포 설정:**

- `main` 브랜치 푸시 → 자동 Production 배포
- 다른 브랜치 푸시 → 자동 Preview 배포
- Pull Request → 자동 Preview 배포 + 댓글에 URL

### 6. 커스텀 도메인

1. Vercel Dashboard → 프로젝트 → Settings → Domains
2. 도메인 입력 (예: `www.example.com`)
3. DNS 설정 (Vercel이 안내)

```
# DNS 레코드 추가 (도메인 제공업체에서)
A    @    76.76.21.21
CNAME www  cname.vercel-dns.com
```

### Vercel 장점

✅ **제로 설정** - Next.js에 최적화  
✅ **자동 배포** - Git 푸시만으로 배포  
✅ **무료 SSL** - HTTPS 자동 설정  
✅ **글로벌 CDN** - 전 세계 빠른 속도  
✅ **자동 캐시** - 최적의 캐싱 전략  
✅ **Preview 배포** - PR마다 미리보기 URL

---

## 🎨 Netlify 배포

### 1. Netlify CLI 설치

```bash
pnpm add -g netlify-cli
```

### 2. 빌드 설정

```toml
# netlify.toml 파일 생성
[build]
  command = "pnpm build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. 환경변수 설정

```bash
# Netlify Dashboard에서 설정
# Site settings → Environment variables

NEXT_PUBLIC_API_URL=https://your-api-url.com
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_FEATURE_DEBUG=false
```

### 4. 배포

```bash
# CLI로 배포
netlify deploy --prod

# 또는 Git 연동
# Netlify Dashboard에서 GitHub 저장소 연결
```

### Netlify 장점

✅ **무료 SSL** - HTTPS 자동 설정  
✅ **글로벌 CDN** - 빠른 속도  
✅ **Form 처리** - 내장 Form 기능  
✅ **분할 테스팅** - A/B 테스트 가능

---

## 🐙 GitHub Pages 배포

### 1. next.config.ts 수정

```typescript
// next.config.ts
const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // ... 기존 설정

  // GitHub Pages용 설정
  output: 'export', // 정적 HTML 출력
  basePath: isProd ? '/repo-name' : '', // 저장소 이름
  images: {
    unoptimized: true, // GitHub Pages는 이미지 최적화 불가
  },
};

export default nextConfig;
```

### 2. GitHub Actions 설정

```.yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

### 3. GitHub 설정

1. 저장소 → Settings → Pages
2. Source: GitHub Actions 선택
3. 환경변수 설정: Settings → Secrets → Actions

```
API_URL=https://your-api-url.com
```

### 4. 배포

```bash
# main 브랜치에 푸시하면 자동 배포
git push origin main
```

### GitHub Pages 장점

✅ **무료** - 개인/오픈소스 프로젝트  
✅ **GitHub 통합** - 저장소와 통합  
✅ **자동 배포** - GitHub Actions 사용

### 제한사항

❌ **이미지 최적화 불가** - `unoptimized: true` 필요  
❌ **서버 기능 없음** - 완전 정적만 가능  
❌ **느린 빌드** - GitHub Actions 리소스 제한

---

## ☁️ AWS S3 + CloudFront 배포

### 1. S3 버킷 생성

```bash
# AWS CLI 설치 후
aws s3 mb s3://your-bucket-name
```

### 2. 정적 호스팅 활성화

```bash
# S3 버킷 정책 설정
aws s3api put-bucket-policy --bucket your-bucket-name --policy '{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::your-bucket-name/*"
  }]
}'

# 정적 웹 호스팅 활성화
aws s3 website s3://your-bucket-name --index-document index.html --error-document 404.html
```

### 3. 빌드 및 배포

```bash
# 빌드
pnpm build

# S3 업로드
aws s3 sync out/ s3://your-bucket-name --delete
```

### 4. CloudFront 설정 (CDN)

**AWS Console에서:**

1. CloudFront → Create Distribution
2. Origin Domain: S3 버킷 선택
3. Default Root Object: `index.html`
4. Error Pages: 404 → `/404.html`

**CLI로:**

```bash
aws cloudfront create-distribution \
  --origin-domain-name your-bucket-name.s3.amazonaws.com \
  --default-root-object index.html
```

### 5. 캐시 무효화

```bash
# 배포 후 CloudFront 캐시 삭제
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### AWS 배포 장점

✅ **높은 안정성** - 99.99% SLA  
✅ **무제한 확장** - 트래픽 제한 없음  
✅ **저렴한 비용** - 사용량 기반 과금  
✅ **글로벌 CDN** - CloudFront 엣지 로케이션

---

## 🚀 AWS Amplify 배포

AWS Amplify는 Git 연동 자동 배포를 제공합니다.

### 1. Amplify CLI 설치

```bash
npm install -g @aws-amplify/cli
amplify configure
```

### 2. 프로젝트 초기화

```bash
# 프로젝트 루트에서
amplify init

# 질문에 답변
? Enter a name for the project: clientnextjs
? Enter a name for the environment: production
? Choose your default editor: Visual Studio Code
? Choose the type of app: javascript
? What javascript framework: react
? Source Directory Path: src
? Distribution Directory Path: out
? Build Command: pnpm build
? Start Command: pnpm dev
```

### 3. Git 저장소 연결

**AWS Console에서:**

1. https://console.aws.amazon.com/amplify 접속
2. "Host web app" 클릭
3. GitHub/GitLab/Bitbucket 연결
4. 저장소 및 브랜치 선택

### 4. 빌드 설정

`amplify.yml` 파일 생성:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install -g pnpm
        - pnpm install --frozen-lockfile
    build:
      commands:
        - pnpm build
  artifacts:
    baseDirectory: out
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

### 5. 환경변수 설정

**Amplify Console에서:**

1. App settings → Environment variables
2. 환경변수 추가:
   ```
   NEXT_PUBLIC_API_URL=https://api.example.com
   NEXT_PUBLIC_API_TIMEOUT=30000
   ```

### 6. 배포

```bash
# Git push로 자동 배포
git push origin main

# 또는 CLI로 수동 배포
amplify publish
```

### Amplify 장점

✅ **Git 자동 배포** - Push 시 자동 빌드/배포  
✅ **미리보기** - PR마다 프리뷰 환경 생성  
✅ **커스텀 도메인** - 무료 SSL 인증서  
✅ **모니터링** - 빌드/배포 로그, 분석  
✅ **간편한 설정** - Next.js 자동 감지

### Amplify vs S3+CloudFront

| 기능          | Amplify   | S3+CloudFront |
| ------------- | --------- | ------------- |
| 설정 난이도   | ⭐ 쉬움   | ⭐⭐⭐ 복잡   |
| Git 자동 배포 | ✅        | ❌            |
| 비용          | 약간 비쌈 | 저렴          |
| 커스터마이징  | 제한적    | 완전 제어     |
| PR 미리보기   | ✅        | ❌            |

**권장:**

- 빠른 배포/간편함 필요 → **Amplify** ⭐
- 비용 최적화/완전 제어 필요 → S3+CloudFront

---

## 🔐 환경변수 설정

### 환경별 파일

```bash
.env                # 모든 환경 기본값
.env.local          # 로컬 개발 (Git 제외)
.env.production     # 프로덕션 환경
```

### 필수 환경변수

```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.production.com
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_FEATURE_DEBUG=false

# 선택적
NEXT_PUBLIC_API_ACCEPT_LANGUAGE=ko-KR
```

### 클라이언트 vs 서버 환경변수

```bash
# 클라이언트 (브라우저에서 접근 가능)
NEXT_PUBLIC_*

# 서버 전용 (정적 배포에서는 빌드 시에만 사용)
# 런타임에는 사용 불가!
```

**⚠️ 주의**: 정적 배포에서는 **빌드 시**에만 환경변수를 읽을 수 있습니다. 런타임에 서버 환경변수를 읽을 수 없습니다.

### 환경변수 검증

Zod로 자동 검증됨 (`shared/config/env.ts`):

```typescript
// 잘못된 환경변수 시 빌드 실패
❌ 환경변수 검증 실패:
NEXT_PUBLIC_API_URL: 유효한 URL 형식이 아닙니다
```

---

## ⚡ 성능 최적화

### 1. 이미지 최적화

이미 설정되어 있음 (`next.config.ts`):

```typescript
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  minimumCacheTTL: 60,
}
```

**사용법:**

```typescript
import Image from 'next/image';

<Image
  src="/photo.jpg"
  width={800}
  height={600}
  alt="Photo"
  priority  // LCP 이미지는 priority 추가
/>
```

### 2. 번들 최적화

```bash
# 번들 분석
pnpm analyze

# 큰 라이브러리 확인 후 대체
```

### 3. CDN 활용

**Vercel/Netlify:** 자동으로 CDN 설정됨

**GitHub Pages:** CloudFlare를 추가로 사용 가능

### 4. 캐싱 전략

```typescript
// next.config.ts
headers: [
  {
    source: '/_next/static/:path*',
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

## 📊 모니터링

### 1. Vercel Analytics

```bash
pnpm add @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 2. Google Analytics

```typescript
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}

        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
      </body>
    </html>
  );
}
```

### 3. 에러 모니터링 (Sentry)

```bash
pnpm add @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### 4. 성능 모니터링

**Lighthouse CI:**

```bash
pnpm add -D @lhci/cli

# .lighthouserc.json
{
  "ci": {
    "collect": {
      "url": ["https://your-site.com"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}]
      }
    }
  }
}
```

---

## 🔄 CI/CD 파이프라인

### GitHub Actions (Vercel)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Build
        run: pnpm build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}

      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 🆘 문제 해결

### 빌드 실패

```bash
# 로컬에서 프로덕션 빌드 테스트
NODE_ENV=production pnpm build

# 타입 에러 확인
pnpm lint
```

### 환경변수가 undefined

- `NEXT_PUBLIC_` 접두사 확인
- **빌드 시** 환경변수 설정 확인 (정적 배포는 런타임 접근 불가)
- 브라우저 새로고침 (하드 새로고침)

### 404 에러

- `basePath` 설정 확인 (GitHub Pages)
- 라우팅 경로 확인
- 빌드 로그에서 생성된 페이지 확인

### CORS 에러

**정적 배포는 서버 프록시를 사용할 수 없습니다!**

**해결 방법:**

1. **API 서버에서 CORS 허용** (권장)

   ```
   Access-Control-Allow-Origin: https://your-site.com
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE
   Access-Control-Allow-Headers: Content-Type
   ```

2. **CORS 프록시 사용** (개발용만)

   ```typescript
   // 개발 환경에서만
   const API_URL = isDev
     ? '/api/proxy' // 개발: next dev 프록시
     : 'https://api.example.com'; // 프로덕션: 직접 호출
   ```

3. **서버리스 함수 사용** (Vercel/Netlify)
   ```typescript
   // api/proxy.ts (Vercel Serverless Function)
   export default async function handler(req, res) {
     const response = await fetch('https://api.example.com' + req.url);
     const data = await response.json();
     res.json(data);
   }
   ```

### 메모리 부족

```bash
# Node.js 메모리 증가
NODE_OPTIONS=--max_old_space_size=4096 pnpm build
```

---

## 💬 FAQ

**Q: Vercel 무료 플랜의 제한은?**  
A: 월 100GB 대역폭, 빌드 시간 6000분. 대부분의 프로젝트에 충분합니다.

**Q: 서버 기능(API Routes, ISR 등)은 사용 불가인가요?**  
A: 네. 이 프로젝트는 순수 정적 배포를 전제로 합니다. 서버 기능이 필요하면 Vercel/Netlify의 Serverless Functions를 사용하세요.

**Q: 배포 후 변경사항이 반영 안 되면?**  
A:

1. 브라우저 캐시 삭제 (Ctrl+Shift+R)
2. CDN 캐시 퍼지 (Vercel/Netlify Dashboard)
3. 빌드 로그 확인

**Q: 이미지 최적화가 안 되면?**  
A: GitHub Pages는 이미지 최적화를 지원하지 않습니다. Vercel/Netlify를 사용하거나 외부 CDN (Cloudinary 등)을 사용하세요.

---

**완료!** 이제 프로젝트를 정적 사이트로 배포할 수 있습니다! 🎉
