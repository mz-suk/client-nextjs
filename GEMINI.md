# Gemini 컨텍스트: client-nextjs

## 프로젝트 개요

이 프로젝트는 `create-next-app`으로 부트스트랩된 Next.js 애플리케이션입니다. TypeScript를 사용하여 개발되었으며, React 19 버전을 기반으로 합니다. Next.js 15의 App Router를 사용하여 페이지를 구성하고, Turbopack을 통해 빠른 개발 및 빌드 속도를 제공합니다. 코드 품질을 위해 ESLint가 설정되어 있습니다.

- **주요 기술**: Next.js 15, React 19, TypeScript
- **패키지 매니저**: pnpm
- **핵심 디렉토리**: `src/app` (App Router)
- **컴파일러/번들러**: Turbopack

## 빌드 및 실행

프로젝트의 주요 스크립트는 `package.json`에 정의되어 있습니다.

- **개발 서버 실행**:

  ```bash
  pnpm dev
  ```

  이 명령은 Turbopack을 사용하여 개발 서버를 시작합니다. (http://localhost:3000)

- **프로덕션 빌드**:

  ```bash
  pnpm build
  ```

  이 명령은 프로덕션용으로 애플리케이션을 빌드합니다.

- **프로덕션 서버 시작**:

  ```bash
  pnpm start
  ```

  빌드가 완료된 후 프로덕션 서버를 실행합니다.

- **코드 린팅**:
  ```bash
  pnpm lint
  ```
  ESLint를 사용하여 코드 스타일 및 잠재적 오류를 검사합니다.

## 개발 컨벤션

- **TypeScript**: `tsconfig.json`에 `strict: true` 옵션이 활성화되어 있어 엄격한 타입 체크를 강제합니다.
- **경로 별칭**: `@/*` 별칭을 사용하여 `src/` 디렉토리의 모듈을 절대 경로로 가져올 수 있습니다.
- **라우팅**: Next.js의 App Router를 사용하며, `src/app` 디렉토리 내의 파일 구조가 URL 경로를 결정합니다.
- **스타일링**: CSS Modules (`.module.css`)를 사용하여 컴포넌트 레벨의 스타일을 관리합니다.
- **ESLint**: `next/core-web-vitals` 설정을 확장하여 웹 성능 및 코드 품질을 유지합니다.
