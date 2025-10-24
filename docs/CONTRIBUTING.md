# 기여 가이드

## 개발 환경 설정

```bash
# 1. 저장소 클론
git clone <repository-url>
cd client-nextjs

# 2. 의존성 설치
pnpm install

# 3. 환경변수 설정
cp .env.example .env.development

# 4. 개발 서버 실행
pnpm dev
```

## 코드 작성 규칙

### 1. Feature-Sliced Design (FSD)

```
src/
├── app/           # Next.js 라우트
├── features/      # 비즈니스 기능 (user-list, todo-list 등)
├── entities/      # 도메인 모델 (user, todo 등)
└── shared/        # 공통 모듈 (api, config, hooks 등)
```

### 2. 코드 제너레이터 사용

```bash
# Feature 생성
pnpm generate:feature

# Entity 생성
pnpm generate:entity

# Page 생성
pnpm generate:page
```

### 3. 커밋 컨벤션

```bash
feat: 새 기능
fix: 버그 수정
docs: 문서 변경
refactor: 리팩토링
test: 테스트 추가
chore: 기타 변경
```

## Pull Request 절차

1. **브랜치 생성**: `feature/<기능명>` 또는 `fix/<버그명>`
2. **코드 작성**: Lint/Type 체크 통과 필수
3. **테스트**: `pnpm lint && pnpm build` 성공 확인
4. **PR 생성**: 변경사항 상세 설명 작성

## 문서 작성 규칙

- 한글로 작성
- 간결하게 작성 (긴 설명은 공식 문서 링크)
- 코드 예시 필수 포함

## 질문/이슈

- GitHub Issues에 등록
- 명확한 재현 방법 및 환경 정보 포함
