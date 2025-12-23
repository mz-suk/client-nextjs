# 배포 가이드

Next.js 프로젝트 AWS 배포 방법

## 1. AWS EC2 + Docker 배포 (권장)

### 1.1 사전 준비

**필요 사항**:

- AWS EC2 인스턴스 (Ubuntu 20.04 이상, t3.small 이상 권장)
- Docker 및 Docker Compose 설치
- 도메인 및 SSL 인증서 (선택)
- 보안 그룹: 80(HTTP), 443(HTTPS), 22(SSH) 포트 오픈

### 1.2 EC2 인스턴스 설정

```bash
# EC2 접속
ssh -i your-key.pem ubuntu@your-ec2-ip

# 시스템 업데이트
sudo apt update && sudo apt upgrade -y

# Docker 설치
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Docker Compose 설치
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 재로그인 (docker 그룹 권한 적용)
exit
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### 1.3 Dockerfile

프로젝트 루트에 `Dockerfile` 생성:

```dockerfile
FROM node:20-alpine AS base

# 의존성 설치
FROM base AS deps
RUN corepack enable && corepack prepare pnpm@10.26.1 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 빌드
FROM base AS builder
RUN corepack enable && corepack prepare pnpm@10.26.1 --activate
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_API_TIMEOUT
ARG NEXT_PUBLIC_FEATURE_DEBUG
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_TIMEOUT=$NEXT_PUBLIC_API_TIMEOUT
ENV NEXT_PUBLIC_FEATURE_DEBUG=$NEXT_PUBLIC_FEATURE_DEBUG
RUN pnpm build

# 실행
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### 1.4 next.config.ts 수정

Standalone 모드 활성화:

```typescript
const nextConfig: NextConfig = {
  output: 'standalone',
  // ... 기존 설정
};
```

### 1.5 docker-compose.yml

```yaml
version: '3.8'

services:
  nextjs:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
        NEXT_PUBLIC_API_TIMEOUT: ${NEXT_PUBLIC_API_TIMEOUT}
        NEXT_PUBLIC_FEATURE_DEBUG: ${NEXT_PUBLIC_FEATURE_DEBUG}
    container_name: client-nextjs
    restart: always
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

### 1.6 환경 변수 설정

`.env.production` 파일 생성:

```bash
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_FEATURE_DEBUG=false
```

### 1.7 배포 실행

```bash
# 프로젝트 클론 또는 파일 전송
git clone your-repo.git
cd your-project

# 환경 변수 파일 복사
cp .env.production .env

# Docker 이미지 빌드 및 실행
docker-compose up -d --build

# 로그 확인
docker-compose logs -f

# 상태 확인
docker ps
```

---

## 2. AWS Amplify 배포

코드 저장소 연동으로 자동 배포

### 2.1 Amplify 설정

1. AWS Amplify 콘솔 접속
2. "New app" → "Host web app" 선택
3. GitHub/GitLab 저장소 연결
4. 브랜치 선택 (main/master)

### 2.2 빌드 설정

`amplify.yml` 파일 생성:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - corepack enable
        - corepack prepare pnpm@10.26.1 --activate
        - pnpm install --frozen-lockfile
    build:
      commands:
        - pnpm build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - .next/cache/**/*
      - node_modules/**/*
```

### 2.3 환경 변수

Amplify 콘솔 → App settings → Environment variables

```text
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_FEATURE_DEBUG=false
```

---

## 3. AWS ECS (Fargate) 배포

컨테이너 오케스트레이션을 통한 배포

### 3.1 ECR 리포지토리 생성

```bash
# AWS CLI 설치 및 설정
aws configure

# ECR 리포지토리 생성
aws ecr create-repository --repository-name client-nextjs --region ap-northeast-2

# ECR 로그인
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.ap-northeast-2.amazonaws.com
```

### 3.2 Docker 이미지 빌드 및 푸시

```bash
# 이미지 빌드
docker build -t client-nextjs:latest \
  --build-arg NEXT_PUBLIC_API_URL=https://api.example.com \
  --build-arg NEXT_PUBLIC_API_TIMEOUT=30000 \
  --build-arg NEXT_PUBLIC_FEATURE_DEBUG=false \
  .

# 태그 지정
docker tag client-nextjs:latest YOUR_ACCOUNT_ID.dkr.ecr.ap-northeast-2.amazonaws.com/client-nextjs:latest

# 푸시
docker push YOUR_ACCOUNT_ID.dkr.ecr.ap-northeast-2.amazonaws.com/client-nextjs:latest
```

### 3.3 ECS 설정

1. ECS 클러스터 생성 (Fargate)
2. 태스크 정의 생성
   - 컨테이너 이미지: ECR URI
   - 포트 매핑: 3000
   - CPU: 512, 메모리: 1024 (최소)
3. 서비스 생성
   - 로드 밸런서 연결 (ALB)
   - Auto Scaling 설정

### 3.4 ALB 설정

- 리스너: HTTP(80), HTTPS(443)
- 타겟 그룹: 포트 3000
- 헬스 체크: `/`

---

## 4. AWS S3 + CloudFront (Static Export)

완전 정적 사이트로 배포 (SSG only)

### 4.1 next.config.ts 수정

```typescript
const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // CloudFront에서 이미지 최적화
  },
};
```

### 4.2 빌드

```bash
pnpm build
```

`out/` 폴더에 정적 파일 생성

### 4.3 S3 버킷 생성 및 설정

```bash
# S3 버킷 생성
aws s3 mb s3://your-bucket-name

# 정적 웹사이트 호스팅 활성화
aws s3 website s3://your-bucket-name --index-document index.html --error-document 404.html

# 파일 업로드
aws s3 sync out/ s3://your-bucket-name --delete

# 퍼블릭 액세스 정책 설정
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
```

### 4.4 CloudFront 배포

1. CloudFront 배포 생성
2. Origin: S3 버킷 웹사이트 엔드포인트
3. Viewer Protocol Policy: Redirect HTTP to HTTPS
4. Compress Objects: Yes
5. SSL 인증서: ACM에서 발급
6. Custom Error Pages: 404 → /index.html (SPA 라우팅)

**제약사항**:

- Server Components 미지원
- API Routes 미지원
- Dynamic Routes는 `generateStaticParams` 필요

---

## 5. Nginx Reverse Proxy 설정 (EC2)

### 5.1 Nginx 설치

```bash
sudo apt install nginx -y
```

### 5.2 Nginx 설정

`/etc/nginx/sites-available/nextjs`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 설정 활성화
sudo ln -s /etc/nginx/sites-available/nextjs /etc/nginx/sites-enabled/

# Nginx 재시작
sudo nginx -t
sudo systemctl restart nginx
```

### 5.3 SSL 인증서 (Let's Encrypt)

```bash
# Certbot 설치
sudo apt install certbot python3-certbot-nginx -y

# SSL 인증서 발급
sudo certbot --nginx -d your-domain.com

# 자동 갱신 확인
sudo certbot renew --dry-run
```

---

## 6. 배포 전 체크리스트

### 6.1 로컬 빌드 테스트

```bash
# 빌드
pnpm build

# 프로덕션 모드 실행
pnpm start
```

### 6.2 환경 변수 확인

- [ ] 모든 필수 환경 변수 설정
- [ ] `NEXT_PUBLIC_*` prefix 올바른지 확인
- [ ] 민감 정보는 AWS Secrets Manager 사용 검토

### 6.3 성능 최적화

```bash
# 번들 분석
pnpm analyze
```

- [ ] 큰 번들 확인 및 최적화
- [ ] 이미지 최적화 적용
- [ ] 불필요한 의존성 제거

### 6.4 보안

- [ ] CSP 헤더 확인 (`next.config.ts`)
- [ ] AWS Security Group 설정
- [ ] HTTPS 사용 (ALB 또는 CloudFront)
- [ ] API 키는 AWS Secrets Manager로 관리

### 6.5 린트 및 타입 체크

```bash
pnpm lint
```

---

## 7. CI/CD 파이프라인

### 7.1 GitHub Actions + AWS ECR/ECS

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

env:
  AWS_REGION: ap-northeast-2
  ECR_REPOSITORY: client-nextjs
  ECS_SERVICE: client-nextjs-service
  ECS_CLUSTER: client-nextjs-cluster
  CONTAINER_NAME: client-nextjs

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build and push image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG \
            --build-arg NEXT_PUBLIC_API_URL=${{ secrets.NEXT_PUBLIC_API_URL }} \
            .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest

      - name: Deploy to ECS
        run: |
          aws ecs update-service --cluster $ECS_CLUSTER --service $ECS_SERVICE --force-new-deployment
```

### 7.2 GitHub Actions + EC2

```yaml
name: Deploy to EC2

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to EC2
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd /home/ubuntu/client-nextjs
            git pull origin main
            docker-compose down
            docker-compose up -d --build
            docker system prune -af
```

---

## 8. 모니터링 및 로깅

### 8.1 CloudWatch 로그

ECS 태스크 정의에서 로그 설정:

```json
{
  "logConfiguration": {
    "logDriver": "awslogs",
    "options": {
      "awslogs-group": "/ecs/client-nextjs",
      "awslogs-region": "ap-northeast-2",
      "awslogs-stream-prefix": "ecs"
    }
  }
}
```

### 8.2 CloudWatch 알람

- CPU 사용률 > 80%
- 메모리 사용률 > 80%
- 5xx 에러 발생
- 응답 시간 > 1초

### 8.3 X-Ray 추적

```bash
pnpm add aws-xray-sdk-core
```

```typescript
// app/layout.tsx
import AWSXRay from 'aws-xray-sdk-core';

if (process.env.NODE_ENV === 'production') {
  AWSXRay.captureHTTPsGlobal(require('http'));
  AWSXRay.captureHTTPsGlobal(require('https'));
}
```

---

## 9. 트러블슈팅

### 빌드 실패

**문제**: 메모리 부족 (EC2)

```bash
# Docker 메모리 제한 증가
docker-compose.yml에 추가:
  deploy:
    resources:
      limits:
        memory: 2G
```

**문제**: pnpm 설치 실패

```bash
# Dockerfile에서 Node.js 버전 확인
FROM node:20-alpine
```

### 런타임 에러

**문제**: 환경 변수 undefined

- Build Args로 전달했는지 확인
- `NEXT_PUBLIC_*` prefix 확인

**문제**: 컨테이너 재시작 반복

```bash
# 로그 확인
docker logs client-nextjs

# 헬스 체크 설정
docker-compose.yml:
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:3000"]
    interval: 30s
    timeout: 10s
    retries: 3
```

---

## 10. 비용 최적화

### EC2

- Reserved Instance 사용 (1년/3년 약정)
- Spot Instance 활용 (개발/스테이징)

### ECS Fargate

- Fargate Spot 사용
- Auto Scaling으로 필요 시에만 확장

### S3 + CloudFront

- S3 Intelligent-Tiering 사용
- CloudFront 캐싱 최대화
- 이미지 최적화 (WebP, AVIF)

---

## 참고 문서

- [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
- [AWS ECS Docs](https://docs.aws.amazon.com/ecs/)
- [AWS Amplify Docs](https://docs.amplify.aws/)
- [Docker with Next.js](https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile)
