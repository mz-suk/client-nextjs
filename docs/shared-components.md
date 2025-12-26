# Shared Components 가이드

## 개요

`shared` 폴더는 프로젝트 전반에서 재사용 가능한 공용 컴포넌트와 Provider를 관리합니다.

## 구조

```
shared/
├── providers/        # 전역 Provider 컴포넌트
├── ui/              # 재사용 가능한 UI 컴포넌트
└── styles/          # 공통 스타일 및 폰트
```

## Providers

### QueryProvider

TanStack Query 설정을 관리하는 Provider입니다.

```typescript
import { QueryProvider } from '@shared/providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <QueryProvider
          onError={(error) => {
            // 전역 에러 처리
            console.error(error);
          }}
          enableDevtools={true} // 개발 환경에서만 활성화 권장
        >
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
```

**Props:**

- `onError?: (error: Error) => void` - 전역 에러 핸들러
- `enableDevtools?: boolean` - React Query Devtools 활성화 (기본값: `isDebug`)

### AuthProvider

인증 관리를 위한 Provider입니다.

```typescript
import { AuthProvider } from '@shared/providers';
import { useRouter } from 'next/navigation';

export default function RootLayout({ children }) {
  return (
    <AuthProvider
      onAuthFailure={() => {
        // 커스텀 인증 실패 처리
        router.push('/login');
      }}
      onError={(error) => {
        // 커스텀 에러 처리
      }}
    >
      {children}
    </AuthProvider>
  );
}
```

**Props:**

- `onAuthFailure?: () => void` - 인증 실패 시 콜백 (기본: `/login`으로 이동)
- `onError?: (error: Error) => void` - 에러 핸들러

## UI Components

### BottomSheet

모바일 환경에 최적화된 바텀시트 컴포넌트입니다.

#### 기본 사용법

```typescript
import { BottomSheet } from '@shared/ui';

function MyComponent() {
  return (
    <BottomSheet
      trigger={<button>열기</button>}
      title="바텀시트 제목"
      description="설명입니다"
    >
      <div>콘텐츠</div>
    </BottomSheet>
  );
}
```

#### Controlled 방식

```typescript
import { BottomSheet } from '@shared/ui';
import { useState } from 'react';

function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>열기</button>
      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        title="Controlled 바텀시트"
      >
        <div>콘텐츠</div>
      </BottomSheet>
    </>
  );
}
```

#### 커스텀 헤더 & 푸터

```typescript
<BottomSheet
  trigger={<button>열기</button>}
  header={
    <div>
      <h2>커스텀 헤더</h2>
      <BottomSheet.Close>
        <button>닫기</button>
      </BottomSheet.Close>
    </div>
  }
  footer={
    <div>
      <button>확인</button>
    </div>
  }
  height="70vh"
>
  <div>콘텐츠</div>
</BottomSheet>
```

**Props:**

- `open?: boolean` - 열림/닫힘 상태 (controlled)
- `onOpenChange?: (open: boolean) => void` - 상태 변경 콜백
- `trigger?: ReactNode` - 트리거 버튼
- `title?: ReactNode` - 제목
- `description?: ReactNode` - 설명
- `children: ReactNode` - 본문 콘텐츠
- `showCloseButton?: boolean` - 닫기 버튼 표시 (기본값: `true`)
- `header?: ReactNode` - 커스텀 헤더
- `footer?: ReactNode` - 푸터
- `height?: 'auto' | 'full' | '${number}vh' | '${number}px'` - 높이
- `className?: string` - 커스텀 클래스

### Next.js error.tsx

React 에러를 처리하는 컴포넌트입니다.

```typescript
import { Next.js error.tsx } from '@shared/ui';

function MyComponent() {
  return (
    <Next.js error.tsx
      fallback={(error, reset) => (
        <div>
          <h2>에러 발생</h2>
          <p>{error.message}</p>
          <button onClick={reset}>다시 시도</button>
        </div>
      )}
      onError={(error, errorInfo) => {
        // 에러 로깅
        console.error(error, errorInfo);
      }}
    >
      <MyFeature />
    </Next.js error.tsx>
  );
}
```

**Props:**

- `children: ReactNode` - 보호할 컴포넌트
- `fallback?: (error: Error, reset: () => void) => ReactNode` - 에러 UI
- `onError?: (error: Error, errorInfo: React.ErrorInfo) => void` - 에러 핸들러

## 스타일

### 폰트

프로젝트에서 사용하는 폰트:

- Pretendard Variable
- SUITE Variable

```typescript
import { pretendard, suite } from '@shared/styles/fonts';

<body className={`${pretendard.variable} ${suite.variable}`}>
  {children}
</body>
```

### 공통 스타일

```scss
@import '@shared/styles/scss/variables';
@import '@shared/styles/scss/utilities';

.my-component {
  color: $color-primary;
  padding: $spacing-md;
}
```

## 모범 사례

### 1. Provider 순서

```typescript
// ✅ 올바른 순서
<QueryProvider>
  <AuthProvider>
    {children}
  </AuthProvider>
</QueryProvider>
```

### 2. BottomSheet 사용

```typescript
// ❌ 나쁜 예 - height를 문자열로
<BottomSheet height="500">

// ✅ 좋은 예
<BottomSheet height="500px">
<BottomSheet height="70vh">
<BottomSheet height="full">
```

### 3. Next.js error.tsx 배치

```typescript
// ✅ 기능별로 Next.js error.tsx 배치
<Next.js error.tsx>
  <UserProfile />
</Next.js error.tsx>

<Next.js error.tsx>
  <ProductList />
</Next.js error.tsx>
```

### 4. Provider Props 활용

```typescript
// ✅ 환경별 설정
<QueryProvider
  enableDevtools={process.env.NODE_ENV === 'development'}
  onError={(error) => {
    // 프로덕션 환경에서는 에러 추적 서비스로 전송
    if (process.env.NODE_ENV === 'production') {
      sendToErrorTracking(error);
    }
  }}
>
```

## 확장

### 커스텀 UI 컴포넌트 추가

`shared/ui/` 폴더에 새 컴포넌트 추가:

```typescript
// shared/ui/MyComponent.tsx
export function MyComponent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

// shared/ui/index.ts
export * from './MyComponent';
```

### 커스텀 Provider 추가

```typescript
// shared/providers/ThemeProvider.tsx
'use client';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// shared/providers/index.ts
export * from './ThemeProvider';
```
